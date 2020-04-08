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
        <div class="result-confirm-dialog__access">
          <div style="margin-top: -20px;">
            <h3 class="result-confirm-dialog__access-title">系统建议级别</h3>
          </div>
          <div style="margin:25px 0 10px 30px">
            <p>{{ adviceLevel }}</p>
            <p class="hide">{{ stateId }}</p>
          </div>
          <div style="height:30px">
            <h3 class="result-confirm-dialog__access-title">专家意见</h3>
          </div>
          <div style="width:440px;height:230px;margin:0px 0px 0px 30px">
            <template v-if="expertAudits">
              <template v-if="expertAudits.length > 0">
                <div class="result-confirm-dialog__tablectn">
                  <table class="result-confirm-dialog__table">
                    <thead class="result-confirm-dialog__table-header">
                      <tr>
                        <th></th>
                        <th>专家</th>
                        <th>意见</th>
                      </tr>
                    </thead>
                    <tbody class="result-confirm-dialog__table-body">
                      <tr
                        v-for="(item, index) in expertAudits"
                        :key="index"
                        class="result-confirm-dialog__table-body-review"
                      >
                        <td></td>
                        <td :title="item.EXPERT_NAME">
                          {{ item.EXPERT_NAME }}
                        </td>
                        <td :title="item.AUDIT_RESULT">
                          {{ item.AUDIT_RESULT }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </template>
            <template v-else>
              <qa-no-content title="暂无数据"></qa-no-content>
            </template>
          </div>
          <div style="height:30px">
            <h3 class="result-confirm-dialog__access-title">最终认证结果</h3>
          </div>
          <div class="result-confirm-dialog__body-userloginname clearfix"
            style="margin-left:10px;margin-top:5px">
            <select v-model="acResult"
              class="result-confirm-dialog__body-userloginname-editinput">
              <option value>请选择</option>
              <option
                v-for="(item,index) in selectAcResult"
                :key="index"
                :value="item.Code"
              >{{ item.Name }}</option>
            </select>
          </div>
          <div class="result-confirm-dialog__access-content"></div>
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
  import QaNoContent from "__libs/components/QaNoContent";

  export default {
    name: "result-confirm-dialog",

    components: {
      CheckboxGroup,
      QaNoContent
    },

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "result-confirm-dialog"
      },

      // 结果确认
      confirmAccessData: {
        type: Object,
        default() {
          return null;
        }
      }
    },

    data() {
      return {
        // 新创建的用户如果没选择角色，需要给出提示
        isHide: true,
        // 认证结果
        acResult: "",
        selectAcResult: [
          {
            Code: 1,
            Name: "初级"
          },
          {
            Code: 2,
            Name: "中级"
          },
          {
            Code: 3,
            Name: "高级"
          },
          {
            Code: 4,
            Name: "不通过"
          }
        ]
      };
    },

    computed: {
      // 渲染数据通过计算获取，方法内使用数据不用计算（异步），这样父组件传入初
      // 始值 null 也不会触发渲染错误
      expertAudits() {
        return this.confirmAccessData ?
          this.confirmAccessData.expertAudits : [];
      },
      title() {
        return this.confirmAccessData ? this.confirmAccessData.title : "";
      },
      adviceLevel() {
        return this.confirmAccessData ? this.confirmAccessData.adviceLevel : "";
      },
      stateId() {
        return this.confirmAccessData ? this.confirmAccessData.stateId : "";
      }
    },

    methods: {
      // 打开对话框的时候已经有了所有数据，直接使用即可
      // 其中的指标需要进行相应的处理
      initDialog() {},

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
          logicClassName: "result-confirm-notice"
        });
      },

      // 点击确认按钮
      okBtnClick() {
        // 没选择评价科室
        if (this.acResult == "") {
          this.networkExceptional("您还未填写最终审核结果");

          return false;
        }

        if (this.adviceLevel == "初级" &&
        (this.acResult == "2" || this.acResult == "3")) {
          this.networkExceptional("不能选择比系统建议级别高的级别");

          return false;
        } else if (this.adviceLevel == "中级" && this.acResult == "3") {
          this.networkExceptional("不能选择比系统建议级别高的级别");

          return false;
        }

        Axios.post(resolveApiRoute("result-confirm"), {
          StateId: this.stateId,
          AcResult: this.acResult
        }).then(
          (res) => {
            if (res.data.Code === 0) {
              this.$emit("dialogOkClicked", this.stateId);
              this.close();
              this.$showNotice("审核成功");
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

  .result-confirm-dialog {
    @include dialog-css(sz(500), sz(440));

    .dialog__body {
      padding: sz(20) 0 0;
      text-align: left;
    }

    &__body {
      &-userloginname,
      &-doctorinput {
        margin: sz(12) 0 0 0;
        height: sz(34);
        line-height: sz(34);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        .select-dropdown-v2-options {
          &__items-item-text {
            font-size: map-get($font-sizes, xs);
          }
        }

        &-editinput,
        &-editinputuser,
        &-editinputmm {
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);
          @include placeholder-color(map-get($colors, placeholder-text-color));
          @include border-radius(5px);

          float: left;
          width: sz(270);
          height: sz(34);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          margin-left: sz(10);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }
      }
    }

    &__table {
      @include unify-table-ui();

      // 占位符
      &-body {
        &-hidden {
          visibility: hidden;
          display: inline-block;
        }

        &-review {
          .customize-checkbox {
            position: relative;
            top: sz(3);
          }
        }
      }

      b,
      a {
        display: inline-block;
      }

      tr {
        th,
        td {
          @include table-sizes(50, 150, 150);

          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            height: sz(30);
          }
        }
      }
    }

    &__tablectn {
      height: calc(100% - 40px);
      overflow: auto;
    }

    &__access {
      margin-top: sz(18);
      position: relative;
      border: 1px solid transparent;
      height: 430px;

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

    // 重定义 notice 在当前视图下的宽度, 使用 @at-root 编译到当前
    // BEM 最下面（具体参照css编译码）
    @at-root {
      .result-confirm-notice {
        width: sz(417);
      }
    }
  }
</style>
