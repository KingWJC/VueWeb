<template>
  <header class="global-header clearfix">
    <!-- site logo -->
    <div class="global-header__site-logo">
      <img class="global-header__site-logo-img"
        src="~__libs/imgs/logo.svg"
        alt="logo" />
    </div>

    <!-- menu and child menu -->
    <ul class="global-header__menu">
      <template v-for="(item, index) in navMenuList">
        <li
          :key="index"
          :class="[
            {
              'global-header__menu-item--active': isActiveFirstLevel(item),
              'global-header__menu-item--open':
                hoverAtMenu === item.menuCode,
              'global-header__menu-item--haschild': item.children
            },
            `global-header__menu-item--${item.menuCode}`
          ]"
          class="global-header__menu-item"
          @mouseenter="hoverHandler(item.menuCode, $event)"
          @mouseleave="cancelHoverHandler(item.menuCode, $event)"
        >
          <!-- 如果是指定了路径，就使用路径，否则，使用事件句柄 -->
          <a
            :href="item.path ? item.path : 'javascript:;'"
            class="global-header__menu-item-link"
            @click="item.handler && item.handler($event)"
          >
            <!-- 用户下拉菜单（最后一项）有一个小图标-->
            <template v-if="item.menuCode === 'personalinfo'">
              <i class="global-header__menu-icon"></i>
              <span
                v-if="taskCount > 0 && isShowReview"
                :class="{
                  'global-header__task-count--assessment': taskCount > 99
                }"
                class="global-header__task-count"
              >
                <template v-if="taskCount < 100">{{ taskCount }}</template>
                <template v-else>99+</template>
              </span>
            </template>

            {{ item.name }}
            <!-- 有子菜单，显示倒三角 -->
            <template v-if="item.children">
              <i class="global-header__menu-item-triangle"></i>
            </template>
          </a>

          <!-- 有子菜单 -->
          <template v-if="item.children">
            <ul class="global-header__child-menu">
              <template v-for="(subitem, cindex) in item.children">
                <li
                  :key="cindex"
                  :class="[
                    {
                      'global-header__child-menu-item--active':
                        isActiveSecLevel(subitem)
                    },
                    `global-header__child-menu-item--${subitem.menuCode}`
                  ]"
                  class="global-header__child-menu-item"
                >
                  <!-- 如果是指定了路径，就使用路径，否则，使用事件句柄 -->
                  <a
                    :href="subitem.path ? subitem.path : 'javascript:;'"
                    class="global-header__child-menu-item-link"
                    @click="subitem.handler && subitem.handler($event)"
                  >
                    <!-- 用户下拉菜单下面项目都有icon-->
                    <template v-if="item.menuCode === 'personalinfo'">
                      <i class="global-header__child-menu-icon"></i>
                      <span
                        v-if="
                          taskCount > 0 &&
                            isShowReview &&
                            subitem.menuCode === 'taskcenter'
                        "
                        :class="{
                          'global-header__child-menu-count--assessment':
                            taskCount > 99
                        }"
                        class="global-header__child-menu-count"
                      >
                        <template v-if="taskCount < 100">
                          {{ taskCount }}</template>
                        <template v-else>99+</template>
                      </span>
                    </template>
                    {{ subitem.name }}
                  </a>
                </li>
              </template>
            </ul>
          </template>
        </li>
      </template>
    </ul>

    <modification-password-dialog
      :display="modificationPasswordDisplay"
      :userName="$config.USER.UserId"
      uiType="modification"
      dialogFooterOkBtnText="修改"
      @closeDialog="modificationPasswordDisplay=false"
    ></modification-password-dialog>
  </header>
</template>

<script>
  import ModificationPasswordDialog from "__libs/components/dialog/ModificationPasswordDialog";
  import { mapGetters } from "vuex";

  export default {
    name: "global-header",

    components: {
      ModificationPasswordDialog
    },

    data() {
      return {
        // 显示修改密码对话框
        modificationPasswordDisplay: false,

        // 当前激活的菜单项（使用id进行识别，如果不需要激活，比如”修改密码“，就传null）
        activeMenu: null,

        // 当前悬停的菜单项（必传，用于高亮当前项）
        hoverAtMenu: null,

        // 构建一个临时 map 用于存储所有菜单
        hashMap: this.getMenuList()
      };
    },

    computed: {
      ...mapGetters([
        // 是否显示审核tab
        "isShowReview",
        "taskCount"
      ]),

      // 所有菜单项
      navMenuList() {
        let allFirstLevel = [];
        // 存储所有可供渲染的页面id
        let allAvailIds = [];

        // TODO:过滤掉menu_type=3的隐藏页面
        allAvailIds = this.$config.USER.PageMenu.filter((item) => {
          return item.MENU_TYPE !== 3;
        });

        // 针对特殊 code 添加相关逻辑
        allAvailIds = allAvailIds.map((item) => {
          // 替换个人设置为用户登录名
          if (item.MENU_CODE === "personalinfo") {
            item.MENU_NAME = this.$config.USER.UserName;
          }

          /* eslint-disable vue/no-side-effects-in-computed-properties */
          // 点击打开修改密码弹框
          if (item.MENU_CODE === "changepwd") {
            item.handler = () => {
              this.modificationPasswordDisplay = true;
            };
          }
          /* eslint-enable vue/no-side-effects-in-computed-properties */

          return item;
        });

        // 先筛出来一级/二级/三级
        let allFirstIds = [];
        let allSecIds = [];
        let allThirdIds = [];
        // 筛选剩下的ids
        let remnantIds = [];

        // 筛选一级
        for (let i = 0; i < allAvailIds.length; i++) {
          let curId = allAvailIds[i];

          // 如果是一级(没有PARENT_CODE)
          if (
            allAvailIds[i].PARENT_CODE === null
          ) {
            allFirstIds.push(curId);
          } else {
            // else: 记录到剩余id列表
            remnantIds.push(curId);
          }
        // TODO: 未来添加业内权限之后需要判断是否是一个业内模块
        }

        // 按照渲染顺序排序一级菜单
        allFirstIds.sort((a, b) => {
          return a.DISPLAY_ORDER - b.DISPLAY_ORDER;
        });

        // 筛选二级
        allAvailIds = remnantIds;

        for (let i = 0; i < allAvailIds.length; i++) {
          let curId = allAvailIds[i];
          let PARENT_CODE = allAvailIds[i].PARENT_CODE;

          let grandParentId = this.hashMap[PARENT_CODE].PARENT_CODE;

          // 如果是二级，即：
          // 它的父级再没有父级
          if (grandParentId === null) {
            allSecIds.push(curId);
          } else {
            // else: 记录到剩余id列表
            // else: 目前为止，我们的应用支持到3级菜单（显示的和隐藏的），剩下的就都归到三级
            allThirdIds.push(curId);
          }

        // TODO: 未来添加业内权限之后需要判断是否是一个业内模块
        }

        // 从一级开始渲染
        for (let i = 0; i < allFirstIds.length; i++) {
          allFirstLevel.push(
            this.createMenuItemObj(allFirstIds[i],
                                   allSecIds.concat(allThirdIds))
          );
        }

        return allFirstLevel;
      }
    },

    mounted() {
      // 找出当前高亮的页面（要注意虚拟页面需要从 router 里面取出虚拟id）
      // 当前只有一个虚拟页面：hospdeptpatient = hosp + dept
      if (this.$pagePayload.PAGE_ID === "hospdeptpatient") {
        if (
          this.$route.name === "hosp-filterable" ||
          this.$route.name === "hosp-readonly"
        ) {
          this.activeMenu = "hosp";
        } else {
          this.activeMenu = "dept";
        }
      } else {
        this.activeMenu = this.$pagePayload.PAGE_ID;
      }
    },

    methods: {
      // 生成菜单对象
      createMenuItem(menuItem) {
        let ret = {
          name: menuItem.MENU_NAME,
          hide: !!menuItem.hide,
          menuCode: menuItem.MENU_CODE,
          pageCode: menuItem.PAGE_CODE
        // PAGE_URL could be one of the following three types:
        // 1. a url PAGE_URL(combined by both BE route and FE route)
        // 2. null, which will be rendered as 'javascript:;'
        // 3. if PAGE_URL is undefiend but a `handler` is given,
        // then the `href`
        // will be rendered as `javascript:;`,
        // but an event handler will be bound
        // to the element using the `handler` as event processor.

        // the event handler for click event for each menu item
        // handler: Function
        };

        // 如果定义了PAGE_URL,就使用
        if (menuItem.PAGE_URL) {
          ret.path = menuItem.PAGE_URL;
        }

        // 如果定义了 handler,就使用
        // 不建议 PAGE_URL 和 handler 同时出现，同时出现场景：
        // 某个页面点击前需要进行拦截和验证是否允许跳转，
        // 可通过 evt.preventDefault 实现
        if (menuItem.handler) {
          ret.handler = menuItem.handler;
        }

        return ret;
      },

      // 生成菜单渲染对象(包含二级/三级)
      // @param {Array} allSecIds 所有可用二级id（不区分是否当前级别下的）
      createMenuItemObj(menuItem, allSecIds) {
        // 构建一级菜单，然后再看是否需要往里面填充二级
        let ret = this.createMenuItem(menuItem);
        // 找出可能为该级别下二级的id
        let maybeChildrenIds = allSecIds.filter((cid) => {
          return cid.PARENT_CODE === menuItem.MENU_CODE;
        });

        // 的确有对应二级,使用
        if (maybeChildrenIds.length > 0) {
          // 按照渲染顺序排序二级菜单
          maybeChildrenIds.sort((a, b) => {
            return a.DISPLAY_ORDER - b.DISPLAY_ORDER;
          });

          ret.children = maybeChildrenIds.reduce((tmpList, cid) => {
            // 构建二级菜单
            let childRet = this.createMenuItemObj(cid, allSecIds);
            tmpList.push(childRet);

            return tmpList;
          }, []);
        }

        return ret;
      },

      // 鼠标悬停到某菜单，展示某菜单（不用css的 hover，因为我们需要在 spa 路由
      // 跳转的时候人工控制取消悬停状态）
      hoverHandler(id) {
        this.hoverAtMenu = id;
      },

      cancelHoverHandler() {
        this.hoverAtMenu = null;
      },

      // 当前二级菜单是否高亮
      isActiveSecLevel(menuObj) {
        // 尚未解析出激活菜单，退出
        if (!this.activeMenu) {
          return false;
        }

        // 如果当前就是激活菜单
        if (menuObj.pageCode === this.activeMenu) {
          return true;
        }

        // 如果是二级子菜单, 判断激活菜单是否是当前菜单的子菜单, 是就高亮
        let papa = this.hashMap[this.hashMap[this.activeMenu].PARENT_CODE];

        // 有父亲
        if (papa) {
          if (this.hashMap[this.activeMenu].PARENT_CODE === menuObj.menuCode) {
            return true;
          }
        }

        return false;
      },

      // 当前一级菜单是否高亮
      isActiveFirstLevel(menuObj) {
        // 尚未解析出激活菜单，退出
        if (!this.activeMenu) {
          return false;
        }

        // 如果当前就是激活菜单
        if (menuObj.pageCode === this.activeMenu) {
          return true;
        }

        // 如果是二级子菜单, 判断激活菜单是否是当前菜单的子菜单, 是就高亮
        let papa = this.hashMap[this.hashMap[this.activeMenu].PARENT_CODE];

        // 有父亲
        if (papa) {
          if (this.hashMap[this.activeMenu].PARENT_CODE === menuObj.menuCode) {
            return true;
          }

          // 如果是三级，找到一级
          // TODO: 递归实现
          let grandpa = this.hashMap[papa.PARENT_CODE];

          if (grandpa && papa.PARENT_CODE === menuObj.menuCode) {
            return true;
          }
        }

        return false;
      },

      getMenuList() {
        return this.$config.USER.PageMenu.reduce((hashMapTemp, item) => {
          hashMapTemp[item.MENU_CODE] = item;

          return hashMapTemp;
        }, {});
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .global-header {
    $_header-height: sz(50);

    background: map-get($colors, theme-blue);
    height: $_header-height;
    position: relative;
    // 使之盖住页面上 select dropdown(z-index 为 50),globalheader的层级,100起
    z-index: 100;

    // logo 区
    &__site-logo {
      float: left;
      height: $_header-height;
      line-height: $_header-height;

      &-locker,
      &-img {
        display: inline-block;
        vertical-align: middle;
      }

      // 抽屉菜单
      &-locker {
        width: sz(24);
        height: sz(20);
        margin-left: sz(15);
      }

      // 网站logo
      &-img {
        width: sz(76);
        height: sz(30);
        margin-left: sz(30);
      }
    }

    // 一级菜单区
    &__menu {
      @extend %normalized-list;

      // 左边logo区宽 133px，加上 40px 间距
      margin-left: sz(130 + 40);
      font-size: map-get($font-sizes, sm);

      // 普通菜单
      &-item {
        float: left;

        // 链接
        &-link {
          display: block;
          padding: 0 sz(20);
        }

        // 三角形（只有存在二级菜单时才有）
        &-triangle {
          // 向上提保持和文字居中（字体本身不是居中）
          @include transform(rotate(135deg));

          position: relative;
          top: sz(-3);
          left: sz(4);

          display: inline-block;
          height: sz(5);
          width: sz(5);
          border-right: 1px solid map-get($colors, pure-white);
          border-top: 1px solid map-get($colors, pure-white);
        }

        // 用户行为菜单（永远是靠右最后一个，根据当前UI）
        &--personalinfo {
          float: right;
          margin-right: sz(12);

          // 用户下拉框头像icon
          #{get-bem-root()}__menu-icon {
            display: inline-block;
            vertical-align: middle;
            // 和右边的用户名隔开
            margin-right: sz(5);
            width: sz(28);
            height: sz(28);
            background: url("~__libs/imgs/user_logo.png");
            background-size: sz(28) sz(28);
          }

          #{get-bem-root()}__task-count {
            @include border-radius(50%);

            position: absolute;
            max-height: sz(13);
            min-width: sz(13);
            line-height: sz(14);
            left: sz(37);
            top: sz(3);
            padding: sz(3);
            text-align: center;
            font-size: sz(12);
            color: map-get($colors, pure-white);
            background: map-get($app-colors, error-text-color);

            &--assessment {
              @include border-radius(20px);
            }
          }
        }

        // 如果是父级菜单，就支持子菜单定位
        &--haschild {
          position: relative;
        }

        // 一级菜单样式
        > a {
          color: map-get($colors, pure-white);
          line-height: $_header-height;

          // 一级菜单悬停高亮背景
          &:hover {
            background: map-get($app-colors, deep-blue);
          }

          @at-root #{get-bem-root()}__menu-item--open#{&} {
            background: map-get($app-colors, deep-blue);
          }

          // 当前激活菜单（或者悬停状态）,激活菜单悬停时不改变背景色
          @at-root #{get-bem-root()}__menu-item--active#{&},
            #{get-bem-root()}__menu-item--active#{&}:hover {
            background: map-get($app-colors, deep-blue);
          }
        }
      }
    }

    // 二级菜单区
    &__child-menu {
      @extend %normalized-list;
      @include border-radius(4px);
      @include box-shadow(2px 2px 4px rgba(map-get($colors, pure-black), 0.1));

      // 默认不展示，悬停再展示
      display: none;
      position: absolute;
      left: 0;
      top: $_header-height;
      width: sz(150);
      background: map-get($colors, pure-white);
      color: map-get($colors, dialog-text-color);
      padding: sz(4) 0;

      // 打开状态
      @at-root #{get-bem-root()}__menu-item--open & {
        display: block;
      }

      // 用户下拉菜单，向左展开
      @at-root #{get-bem-root()}__menu-item--personalinfo & {
        left: initial;
        right: 0;
      }

      @at-root #{get-bem-root()}__child-menu-count {
        @include border-radius(50%);

        position: absolute;
        max-height: sz(13);
        min-width: sz(13);
        line-height: sz(14);
        left: sz(18);
        top: sz(35);
        padding: sz(3);
        text-align: center;
        font-size: sz(12);
        color: map-get($colors, pure-white);
        background: map-get($app-colors, error-text-color);

        &--assessment {
          @include border-radius(20px);
        }
      }

      // 悬停高亮
      &-item {
        $_cur-parent: &;

        font-size: map-get($font-sizes, base);

        // 直系子元素（其实不必要，因为按照当前两级目录，没有孙元素是 a 了
        > a {
          display: block;
          padding: sz(5) sz(10);
        }

        &--active {
          color: map-get($colors, theme-blue);
        }

        &:hover {
          background: map-get($colors, bg-home);
        }

        // 我的收藏
        &--favinfo {
          #{get-bem-root()}__child-menu-icon {
            height: sz(14);
            width: sz(14);
            background: url("~__libs/imgs/favinfo.png");
            background-size: sz(14) sz(14);
          }

          // 我的收藏高亮
          &#{$_cur-parent}--active {
            #{get-bem-root()}__child-menu-icon {
              background-image: url("~__libs/imgs/favinfo_blue.png");
            }
          }
        }

        // 任务中心
        &--taskcenter {
          #{get-bem-root()}__child-menu-icon {
            height: sz(16);
            width: sz(13);
            background: url("~__libs/imgs/task_center.png");
            background-size: sz(13) sz(16);
          }

          // 任务中心高亮
          &#{$_cur-parent}--active {
            #{get-bem-root()}__child-menu-icon {
              background-image: url("~__libs/imgs/task_center_blue.png");
            }
          }
        }

        // 日志管理
        &--loginfo {
          #{get-bem-root()}__child-menu-icon {
            height: sz(14);
            width: sz(14);
            background: url("~__libs/imgs/log.png");
            background-size: sz(14) sz(14);
          }

          // 日志管理高亮
          &#{$_cur-parent}--active {
            #{get-bem-root()}__child-menu-icon {
              background-image: url("~__libs/imgs/log_white.png");
            }
          }
        }

        // 修改密码
        &--changepwd {
          #{get-bem-root()}__child-menu-icon {
            height: sz(17);
            width: sz(14);
            background: url("~__libs/imgs/edit_password.png");
            background-size: sz(14) sz(17);
          }

          // 修改密码高亮
          &#{$_cur-parent}--active {
            #{get-bem-root()}__child-menu-icon {
              background-image: url("~__libs/imgs/edit_password_blue.png");
            }
          }
        }

        // 退出
        &--loginout {
          #{get-bem-root()}__child-menu-icon {
            height: sz(15);
            width: sz(15);
            background: url("~__libs/imgs/exit.png");
            background-size: sz(15) sz(15);
          }

          // 退出高亮
          &#{$_cur-parent}--active {
            #{get-bem-root()}__child-menu-icon {
              background-image: url("~__libs/imgs/exit_blue.png");
            }
          }
        }
      }

      // 小图标
      &-icon {
        display: inline-block;
        vertical-align: middle;
        height: sz(14);
        width: sz(14);
        margin-right: sz(10);
      }
    }
  }
</style>
