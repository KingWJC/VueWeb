<template>
  <teleporter>
    <div
      :style="dialogStyles"
      :class="[
        {
          'hide': !display
        },
        logicClassName
      ]"
      class="dialog"
    >
      <!--标题-->
      <div class="dialog__header clearfix">
        <h3>
          <template v-if="controlModel === 'add'">编辑意见</template>
          <template v-else>意见反馈</template>
        </h3>
        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"></a>
      </div>
      <!--内容-->
      <template v-if="userData">
        <div class="dialog__body">
          <div class="opinion-fb__tablecontent">
            <div class="opinion-fb__tablecontent__body">
              <div class="opinion-fb__tablecontent-item">
                <label class="opinion-fb__tablecontent-item-label">状态</label>
                <div class="opinion-fb__tablecontent-item-col"
                  style="vertical-align:middle">
                  <select-dropdown-v2
                    v-model="fbState"
                    :disabled="true"
                    :dropDownMaxHeight="80"
                    :options="selectFbState"
                    label="ITEM_NAME"
                    trackBy="ITEM_CODE"
                  >
                    <template slot="drop"
                      slot-scope="dropContent">
                      <p
                        class="select-dropdown-v2-options__items-item-text"
                      >{{ dropContent.options.ITEM_NAME }}</p>
                    </template>
                  </select-dropdown-v2>
                </div>
              </div>
              <div class="opinion-fb__tablecontent-item
                          opinion-fb__tablecontent-editarea">
                <label class="opinion-fb__tablecontent-item-label">备注</label>
                <div class="opinion-fb__tablecontent-item-col">
                  <textarea
                    v-model="fbContent"
                    type="text"
                    placeholder="请输入您的反馈"
                    maxlength="200"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog__footer">
          <a
            href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="cancelBtnClicked"
          >{{ dialogFooterCancelBtnText }}</a>

          <a
            href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
            @click="okBtnClick"
          >{{ dialogFooterOkBtnText }}</a>
        </div>
      </template>
    </div>
  </teleporter>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";

  export default {
    name: "opinion-fb-dialog",

    components: {},

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "opinion-fb-dialog"
      },

      // 弹框类型 add:添加用户;edit:编辑用户
      controlModel: {
        type: String,
        default: ""
      },

      initData: {
        type: Object,
        default: null
      }
    },

    data() {
      return {
        userData: null,

        // 意见状态
        selectFbState: [
          {
            ITEM_CODE: 0,
            ITEM_NAME: "待反馈"
          },
          {
            ITEM_CODE: 1,
            ITEM_NAME: "已反馈"
          }
        ],

        // 反馈
        fbContent: "",
        fbState: null,

        opinionFbData: null,

        btnText: "",

        disableFlag: null
      };
    },

    watch: {},

    mounted() {},

    methods: {
      // 在对话框打开的时候，根据当前view，重置状态
      initDialog() {
        this.userData = this.initData;
        this.fbContent = this.userData.FB_CON;
        this.fbState = this.selectFbState.find((item) => {
          return item.ITEM_CODE === 1 - this.userData.IS_FEEDBACK;
        });

        this.disableFlag = true;
      },

      // 验证表单
      VerigyForm() {
        if (this.opinionFbData.OP_GUID === "") {
          this.checkFlag = false;
        } else {
          this.checkFlag = true;
        }
      },

      GetOpinionData() {
        this.opinionFbData = Object.assign(
          {},
          {
            OP_GUID: this.userData.OP_GUID,
            FB_CON: this.fbContent !== null ?
              this.fbContent.trim() : ""
          }
        );
      },

      cancelBtnClicked() {
        this.close();
      },

      // 反馈
      okBtnClick() {
        this.SubmitData();
      },

      // 提交数据
      SubmitData() {
        // 获取意见数据
        this.GetOpinionData();

        // 校验表单
        this.VerigyForm();

        if (!this.checkFlag) {
          this.$showNotice("网络异常", "failed");
          this.close();

          return;
        }

        this.$showLoading();

        Axios.post(
          resolveApiRoute("opinion-manage-submit"),
          this.opinionFbData
        ).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              this.$showNotice("操作成功");
              this.close();

              this.$emit("okClicked");
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.isShowLoading = false;
            this.$showNotice("网络异常", "failed");
          }
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .opinion-fb {
    &-dialog {
      @include dialog-css(sz(450), sz(319));

      .dialog__body {
        height: auto;
        text-align: left;
        padding: sz(10) 0 0;
      }
    }

    &__tablecontent {
      padding-top: 20px;
      width: 700px;
      margin: 0 auto;

      input {
        font-size: map-get($font-sizes, xs);
        color: map-get($colors, dialog-text-color);
        @include placeholder-color(map-get($colors, placeholder-text-color));
        @include border-radius(5px);

        width: sz(270);
        height: sz(34);
        border: 1px solid map-get($colors, dialog-input-border);
        padding-left: sz(10);

        &:focus {
          border: 1px solid map-get($colors, theme-blue);
        }
      }

      textarea {
        font-size: map-get($font-sizes, xs);
        color: map-get($colors, dialog-text-color);
        @include placeholder-color(map-get($colors, placeholder-text-color));
        @include border-radius(5px);

        border: 1px solid map-get($colors, dialog-input-border);
        padding-left: sz(10);

        &:focus {
          border: 1px solid map-get($colors, theme-blue);
        }
      }

      &__body {
        // paginator 28px margin 10px
        overflow: auto;
      }

      &-item {
        line-height: 2rem;

        &-label {
          width: 80px;
          text-align: right;
          display: inline-block;
          height: 1.7rem;
          line-height: 1.7rem;
        }

        &-col {
          display: inline-block;
          margin-left: 1rem;
          line-height: 1.7rem;
        }
      }

      &-editarea {
        label {
          vertical-align: top;
        }

        textarea {
          margin-top: 8px;
          max-height: 100px;
          min-height: 100px;
          max-width: 300px;
          min-width: 300px;
        }

        b {
          top: -60px;
        }
      }

      .hidden {
        display: none;
      }
    }
  }
</style>
