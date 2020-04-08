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
        <h3>{{ title }}</h3>
        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"></a>
      </div>

      <div class="dialog__body">
        <div class="expert-dialog__access">
          <h3 class="expert-dialog__access-title">分配专家</h3>

          <div class="expert-dialog__access-content">
            <!--科室-->
            <checkbox-group
              v-model="selectedDeptArr"
              :optionsList="depts"
              trackByField="EXPERT_ID"
              labelField="EXPERT_NAME"
              title="专家"
            ></checkbox-group>
            <!--科室结束-->

            <!--病种-->

            <!--病种结束-->
          </div>
        </div>
      </div>

      <div class="dialog__footer">
        <template>
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
        </template>
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
    name: "expert-dialog",

    components: {
      CheckboxGroup
    },

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "expert-dialog"
      },

      userAccessData: {
        type: Object,
        default() {
          return null;
        }
      }
    },

    data() {
      return {
        selectedDeptArr: [],

        // 新创建的用户如果没选择角色，需要给出提示
        isHide: true
      };
    },

    computed: {
      // 渲染数据通过计算获取，方法内使用数据不用计算（异步），这样父组件传入初
      // 始值 null 也不会触发渲染错误
      depts() {
        return this.userAccessData ? this.userAccessData.depts : [];
      },
      title() {
        return this.userAccessData ? this.userAccessData.title : "";
      }
    },

    methods: {
      // 打开对话框的时候已经有了所有数据，直接使用即可
      // 其中的指标需要进行相应的处理
      initDialog() {
        this.selectedDeptArr =
          this.getSelectedOptions(this.userAccessData.depts);
      },

      close() {
        if (this.allowClosing) {
          // 关闭之前隐藏提示信息
          this.isHide = true;
          this.$emit("closeDialog");
        }
      },

      // 网络异常
      networkExceptional(titleName) {
        this.$showNotice({
          noticeText: titleName,
          noticeType: "failed",
          logicClassName: "expert-dialog-notice"
        });
      },

      // 点击确认按钮
      okBtnClick() {
        // 没选择评价科室
        if (this.selectedDeptArr.length === 0) {
          this.networkExceptional("您还未分配专家");

          return false;
        }

        let deptCodes = this.extractFuncIds(this.selectedDeptArr, "EXPERT_ID");

        Axios.post(resolveApiRoute("assigment-expert"), {
          StateId: this.selectedDeptArr[0].STATE_ID,
          CheckedExperts: deptCodes
        }).then(
          (res) => {
            if (res.data.Code === 0) {
              // 刷新主页面
              this.$emit("dialogOkClicked", {
                STATE_ID: this.selectedDeptArr[0].STATE_ID
              });

              this.close();
            } else if (res.data.Code === 2) {
              this.networkExceptional("用户数据异常修改失败, 请刷新重试!");
            } else {
              this.networkExceptional("服务器错误");
            }
          },
          () => {
            this.networkExceptional("网络错误");
          }
        );
      },

      getSelectedOptions(data) {
        return data.reduce((tmpList, curItem) => {
          if (curItem.IsSelect === 1) {
            tmpList.push(curItem);
          }

          return tmpList;
        }, []);
      },

      // 从动态模型map中提取取选中的功能的id list
      extractFuncIds(list, id) {
        let idList = [];

        // 从动态 map 里面解析出每个类别的功能，及id
        for (let item in list) {
          let ids = list[item][id];

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

  .expert-dialog {
    @include dialog-css(sz(580), sz(466));

    .dialog__body {
      padding: sz(20) 0 0;
      text-align: left;
    }

    &__function {
      &-title {
        font-size: inherit;
        margin: 0 0 0 sz(22);
        height: sz(16);
        line-height: sz(16);
      }

      &-content {
        @include border-radius(5px);

        margin: sz(10) 0 0 sz(22);
        width: sz(540);
        height: sz(34);

        &-title {
          float: left;
          line-height: sz(34);
        }

        &-warning {
          margin-left: sz(10);
          line-height: sz(35);
          color: map-get($colors, theme-red);
        }

        &-mul {
          width: sz(180);
          float: left;
          margin: 0 0 0 sz(10);

          .select-dropdown-v2 {
            width: sz(180);
            height: sz(34);

            &__selected {
              height: sz(32);
              border-color: map-get($colors, dialog-input-border);

              &-plain,
              &-placeholder {
                height: sz(32);
                line-height: sz(32);
                font-size: map-get($font-sizes, xs);
              }
            }
          }

          .select-dropdown-v2-options {
            &__items-item-text {
              font-size: map-get($font-sizes, xs);
            }
          }
        }
      }
    }

    &__access {
      margin-top: sz(18);
      position: relative;
      border: 1px solid transparent;

      &-title {
        margin: 0 0 0 sz(22);
        font-size: inherit;
        position: absolute;
      }

      &-content {
        margin: sz(18) auto;
        border: 1px solid transparent;

        &-op {
          float: right;
          margin-top: sz(-3);
          line-height: sz(24);
          cursor: default;

          &:link,
          &:visited {
            color: map-get($colors, placeholder-text-color);
          }

          &--canclick {
            cursor: pointer;

            &:link,
            &:visited {
              color: map-get($colors, theme-blue);
            }
          }

          &--noindex {
            cursor: not-allowed;
          }
        }
      }
    }

    .checkbox-group {
      width: sz(555);
      margin: sz(20) sz(10) 0 sz(10);

      &__contxt {
        max-height: sz(118);
        overflow: auto;

        &-alls {
          margin-bottom: sz(10);
          padding-bottom: 0;
        }
      }

      &:nth-child(1) {
        .checkbox-group__contxt {
          max-height: sz(118);
          overflow-y: auto;
        }
      }

      &:nth-child(2) {
        margin-top: sz(30);

        .checkbox-group__contxt {
          max-height: sz(128);
          overflow-y: auto;

          &-alls {
            @extend %clearfix;

            width: sz(249);
            margin-right: 0;

            .customize-checkbox {
              float: left;

              &__label {
                @include word-hidden(sz(167), max-width);
              }
            }

            &:nth-child(even) {
              margin-left: sz(20);
            }
          }
        }
      }
    }

    // 重定义 notice 在当前视图下的宽度, 使用 @at-root 编译到当前
    // BEM 最下面（具体参照css编译码）
    @at-root {
      .expert-dialog-notice {
        width: sz(417);
      }
    }
  }
</style>
