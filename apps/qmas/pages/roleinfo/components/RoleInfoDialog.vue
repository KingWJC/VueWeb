<template>
  <teleporter>
    <div
      :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName
      ]"
      class="dialog"
    >
      <div class="dialog__header clearfix">
        <h3>操作权限设置</h3>
        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"></a>
      </div>

      <div class="role-info-dialog__name">
        <span class="role-info-dialog__name-span">角色名称</span>
        <input
          v-model="rolename"
          type="text"
          class="role-info-dialog__name-input"
          placeholder="请输入角色名称"
          @blur="roleNameIsRepeat"
        />
        <label :class="{'hide': !showErrmsg}"
          class="role-info-dialog__name-label">{{ errmsg }}</label>
      </div>
      <div class="role-info-dialog__group"
        style="margin-left:20px">
        <span class="role-info-dialog__name-span">角色描述</span>
        <br />
        <textarea
          v-model="remark"
          class="role-info-dialog__name-input"
          style="height:80px;width:400px;"
          @input="descInput"
        ></textarea>
        <br />
        <span class="text">限制{{ remnant }}/200字以内</span>
      </div>
      <div class="role-info-dialog__group">
        <label class="role-info-dialog__group-title">角色功能权限模板</label>
      </div>
      <div class="role-info-dialog__function">
        <checkbox-group
          v-for="(cat, catCode) in funcMap"
          :key="catCode"
          v-model="cat.checked"
          :title="cat.name"
          :optionsList="cat.all"
          trackByField="FUNC_ID"
          labelField="FUNC_NAME"
        ></checkbox-group>
      </div>
      <div class="dialog__footer">
        <a
          href="javascript:;"
          class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
          @click="cancelBtnClick"
        >{{ dialogFooterCancelBtnText }}</a>

        <a
          href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn-ok"
          @click="okBtnClick"
        >{{ dialogFooterOkBtnText }}</a>
      </div>
    </div>
  </teleporter>
</template>

<script>
  import Axios from "axios";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import CheckboxGroup from "__shared-libs/components/CheckboxGroup";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "role-info-dialog",

    components: {
      CheckboxGroup
    },

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "role-info-dialog"
      },

      // 角色信息数据
      // {
      //   Funcs
      //   ROLE_NAME,
      //   前端添加的字段
      //   ID
      // }
      roleInfoData: {
        type: Object,
        default() {
          return null;
        }
      },

      // 当前激活视图
      // create: 新增角色
      // edit: 编辑角色
      view: {
        type: String,
        default: "create"
      }
    },

    data() {
      return {
        // 角色名称
        rolename: "",
        // 错误提示信息是否显示
        showErrmsg: false,
        // 错误提示信息
        errmsg: null,
        remnant: 200,
        remark: null
      };
    },

    computed: {
      funcMap() {
        return this.roleInfoData ?
          this.groupFuncs(this.roleInfoData.Funcs) : {};
      }
    },

    methods: {
      // 倒计数
      descInput() {
        if (this.remnant >= 0) {
          var txtVal = this.remark.length;
          this.remnant = 200 - txtVal;

          if (this.remnant < 0) {
            this.remark = this.remark.substr(0, 200);
            this.remnant = 0;
          }
        } else {
          this.remark = this.remark.substr(0, 200);
          this.remnant = 200 - this.remark.length;
          this.$showNotice("字数超过限制", "failed");
        }
      },
      initDialog() {
        // 编辑模式，需要预填一下角色名
        if (this.view === "edit") {
          this.rolename = this.roleInfoData.ROLE_NAME;
          this.remark = this.roleInfoData.REMARK;
          this.remnant = 200 - this.roleInfoData.REMARK.length;
        } else {
          this.remark = null;
          this.remnant = 200;
        }
      },

      close() {
        if (this.allowClosing) {
          this.showErrmsg = false;
          // 清空缓存的角色名（角色名会从api返回）
          this.rolename = "";

          this.$emit("closeDialog");
        }
      },

      // 检查角色名是否重复
      roleNameIsRepeat() {
        let rolename = this.rolename.trim();

        if (rolename !== "") {
          Axios.get(resolveApiRoute("role-info-repeat-name"), {
            params: {
              RoleId: this.roleInfoData.ID,
              RoleName: rolename
            }
          }).then(
            (res) => {
              if (res.data.Code === 0) {
                this.showErrmsg = false;
              } else if (res.data.Code === 1) {
                this.errmsg = "角色名称重复";
                this.showErrmsg = true;
              } else {
                this.networkExceptional("服务器错误");
              }
            },
            () => {
              this.networkExceptional("网络错误");
            }
          );
        }
      },

      // 网络异常
      networkExceptional(titleName) {
        this.$showNotice({
          noticeText: titleName,
          noticeType: "failed",
          logicClassName: "role-info-notice"
        });
      },

      // 保存功能列表
      okBtnClick() {
        let rolename = this.rolename.trim();

        if (rolename === "") {
          this.errmsg = "请输入角色名称";
          this.showErrmsg = true;

          return false;
        } else if (this.showErrmsg) {
          return;
        }

        let idList = this.extractFuncIds();

        if (idList.length === 0) {
          this.networkExceptional("请至少选择一个本角色用户能访问的页面");

          return false;
        }

        Axios.post(resolveApiRoute("role-info-func"), {
          RoleId: this.roleInfoData.ID,
          RoleName: rolename,
          Funcs: idList,
          Remark: this.remark
        }).then(
          (res) => {
            if (res.data.Code === 0) {
              // 发送到页面
              if (this.view === "create") {
                this.$emit("roleAdded", {
                  ID: res.data.Data.ID,
                  ROLE_NAME: rolename,
                  UPD_TIME: res.data.Data.UpdDate,
                  REMARK: this.remark
                });
              } else if (this.view === "edit") {
                this.$emit("roleEdited", {
                  ID: this.roleInfoData.ID,
                  ROLE_NAME: rolename,
                  UPD_TIME: res.data.Data,
                  REMARK: this.remark
                });
              }
              this.close();
            } else if (res.data.Code === 2) {
              this.errmsg = "角色名称重复";
              this.showErrmsg = true;
            } else {
              this.showErrmsg = false;
              this.networkExceptional("服务器错误");
            }
          },
          () => {
            this.networkExceptional("网络错误");
          }
        );
      },

      // 按功能进行分组
      // {
      //   [catCode]: {
      //     // cat_name
      //     [name],
      //     [checked]: [],
      //     [all]: []
      //   }
      // }
      groupFuncs(funcs) {
        let map = funcs.reduce((tmpMap, curItem) => {
          // 尚未注册当前类型
          if (!tmpMap[curItem.FUNC_CAT_CODE]) {
            tmpMap[curItem.FUNC_CAT_CODE] = {
              name: curItem.FUNC_CAT_NAME,
              checked: [],
              all: []
            };
          }

          return tmpMap;
        }, {});

        // 分类找出所有功能项
        for (let catCode in map) {
          // 找到当前分类下所有的功能
          map[catCode].all = funcs.filter((item) => {
            return item.FUNC_CAT_CODE === catCode;
          });

          map[catCode].all.sort((a, b) => {
            return a.DISPLAY_ORDER - b.DISPLAY_ORDER;
          });

          // 从所有的中找出已选择的功能项
          map[catCode].checked = map[catCode].all.filter((item) => {
            return item.IsSelect;
          });
        }

        return map;
      },

      // 从动态模型map中提取取选中的功能的id list
      extractFuncIds() {
        let idList = [];

        // 从动态 map 里面解析出每个类别的功能，及id
        for (let item in this.funcMap) {
          let ids = this.funcMap[item].checked.map((funcItem) => {
            return funcItem["FUNC_ID"];
          });

          // 附加到队尾
          idList = idList.concat(ids);
        }

        return idList;
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .role-info-dialog {
    @include dialog-css(sz(500), sz(440));

    .dialog__body {
      padding: sz(20) 0 0;
    }

    &__name {
      @include border-radius(6px);

      margin-left: sz(20);
      height: sz(34);
      width: sz(540);
      text-align: left;

      &-span {
        margin-right: sz(6);
        line-height: sz(34);
        color: map-get($colors, text-main);
      }

      &-input {
        @include border-radius(6px);
        @include placeholder-color(map-get($colors, placeholder-text-color));

        border: 1px solid map-get($app-colors, dropdown-options-border);
        height: sz(34);
        width: sz(180);
        font-size: map-get($font-sizes, xs);
        color: map-get($colors, dialog-text-color);
        padding-left: sz(10);
        vertical-align: middle;

        &:focus {
          border: 1px solid map-get($colors, theme-blue);
        }
      }

      &-label {
        color: map-get($colors, theme-red);
        font-size: map-get($font-sizes, xs);
        margin-left: sz(6);
      }
    }

    &__group {
      margin-top: sz(20);
      text-align: left;
      border: 1px solid transparent;
      position: relative;
      &-title {
        margin-left: sz(18);
        color: map-get($colors, text-main);
        position: absolute;
        top: 0;
        left: sz(2);
        line-height: sz(12);
        font-weight: bold;
      }
    }

    &__function {
      margin-top: sz(20);
      text-align: left;
      border: 1px solid transparent;
      position: relative;
      overflow: auto;
      height: sz(180);

      .checkbox-group {
        margin: sz(32) auto 0;
      }
    }

    .checkbox-group {
      &__contxt-alls {
        padding-bottom: sz(10);
      }
    }

    // 重定义 notice 在当前视图下的宽度, 使用 @at-root 编译到当前
    // BEM 最下面（具体参照css编译码）
    @at-root {
      .role-info-notice {
        width: sz(417);
      }
    }
  }
</style>
