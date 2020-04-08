<template>
  <div class="opinion-feedback">
    <div class="opinion-feedback__tablecontent">
      <template v-if="!isShowLoading">
        <template v-if="userData">
          <div class="opinion-feedback__tablecontent__body">
            <div class="opinion-feedback__tablecontent-item">
              <label class="opinion-feedback__tablecontent-item-label">
                用户类型
              </label>
              <div class="opinion-feedback__tablecontent-item-col">
                <span>{{ userData.ROLE_NAME }}</span>
              </div>
            </div>
            <div class="opinion-feedback__tablecontent-item">
              <label class="opinion-feedback__tablecontent-item-label">
                用户名
              </label>
              <div class="opinion-feedback__tablecontent-item-col">
                <span>{{ userData.USER_NAME }}</span>
              </div>
            </div>
            <template v-if="userData.ROLE_ID == 4">
              <div class="opinion-feedback__tablecontent-item">
                <label class="opinion-feedback__tablecontent-item-label">
                  联络员姓名
                </label>
                <div class="opinion-feedback__tablecontent-item-col">
                  <span>{{ userData.CONTACT_NAME }}</span>
                </div>
              </div>
            </template>
            <div class="opinion-feedback__tablecontent-item
                        opinion-feedback__tablecontent-editarea">
              <label class="opinion-feedback__tablecontent-item-label">
                意见描述
              </label>
              <div class="opinion-feedback__tablecontent-item-col">
                <textarea
                  ref="focusTextarea"
                  v-model="opinionText"
                  type="text"
                  placeholder="请输入您的意见"
                  maxlength="200"
                  @blur="checkOpinion"
                ></textarea>
                <b class="opinion-feedback__tablecontent-notnull">*</b>
              </div>
            </div>
            <div class="opinion-feedback__tablecontent-warn">
              <span>{{ warnOpinionMsg }}</span>
            </div>
            <div class="opinion-feedback__tablecontent-itemphone">
              <label class="opinion-feedback__tablecontent-item-label">
                联系方式
              </label>
              <div class="opinion-feedback__tablecontent-item-col">
                <input
                  ref="focusInput"
                  v-model="contactDetail"
                  type="text"
                  placeholder="请输入您的电话或邮箱"
                  maxlength="50"
                  autocomplete="off"
                  @blur="checkContact"
                />
                <b class="opinion-feedback__tablecontent-notnull">*</b>
              </div>
            </div>
            <div class="opinion-feedback__tablecontent-warn">
              <span>{{ warnContactMsg }}</span>
            </div>
          </div>
          <div class="opinion-feedback__tablecontent__footer">
            <a
              href="javascript:;"
              class="btn opinion-feedback-btn-ok"
              @click="SubmitData"
            >提交</a>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "opinion-feedback",

    components: {
    },

    props: {

    },

    data() {
      return {
        userData: null,

        // 是否正在加载数据
        isShowLoading: true,

        warnContactMsg: "",
        warnOpinionMsg: "",
        checkFlag: true,

        // 联系方式
        contactDetail: "",
        // 意见
        opinionText: "",

        opinionData: null
      };
    },

    watch: {

      contactDetail(val) {
        if (val.length !== "") {
          this.warnContactMsg = "";
        }
      },

      opinionText(val) {
        if (val !== "") {
          this.warnOpinionMsg = "";
        }
      }

    },

    mounted() {
      this.GetUserData();
    },

    methods: {

      // blur 校验意见
      checkOpinion() {
        if (this.opinionText.trim().length === 0) {
          this.warnOpinionMsg = "必填项，不能为空";
        } else {
          this.warnOpinionMsg = "";
        }
      },

      // blur 校验联系方式
      checkContact() {
        if (this.contactDetail.trim().length === 0) {
          this.warnContactMsg = "必填项，不能为空";
        } else {
          this.warnContactMsg = "";
        }
      },

      // 校验电话和邮件格式
      CheckFormat() {
        var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        var regPhone = /^1[3456789]\d{9}$/;
        var regCall = /^0\d{2,3}-?\d{7,8}$/;

        if (!regPhone.test(this.contactDetail) ||
          !regCall.test(this.contactDetail) ||
          !regEmail.test(this.contactDetail)) {
            this.warnContactMsg = "请输入正确的联系方式";
        } else {
          this.warnContactMsg = "";
        }
      },

      // 验证表单
      VerigyForm() {
        if (this.opinionData.OPINION_DESC === "") {
          this.checkFlag = false;
          this.warnOpinionMsg = "必填项，不能为空";
          this.$refs.focusTextarea.focus();
        } else if (this.opinionData.CONTACT_WAY === "") {
          this.checkFlag = false;
          this.$refs.focusInput.focus();
          this.warnContactMsg = "必填项，不能为空";
        } else {
          this.checkFlag = true;
        }
      },

      GetUserData() {
        this.$showLoading();

        Axios.post(
          resolveApiRoute("opinion-userdata-get")
        ).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              this.userData = res.data.Data[0];
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
      },

      GetOpinionData() {
        this.opinionData = Object.assign(
          {},
          {
            ROLE_ID: this.userData.ROLE_ID,
            USER_ID: this.userData.USER_ID,
            USER_NAME: this.userData.USER_NAME,
            CONTACT_NAME: this.userData.CONTACT_NAME,
            OPINION_DESC: this.opinionText.trim(),
            CONTACT_WAY: this.contactDetail.trim(),
            COMMIT_TIME: new Date()
          }
        );
      },

      // 提交数据
      SubmitData() {
        // 获取意见数据
        this.GetOpinionData();

        // 校验表单
        this.VerigyForm();

        if (!this.checkFlag) {
          return;
        }

        this.$showLoading();

        Axios.post(
          resolveApiRoute("opinion-userdata-submit"),
          this.opinionData
        ).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              this.$showNotice("提交成功");
              window.location.href = "/Home";
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

  .opinion-feedback {
    @include border-radius(5px);

    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__tablecontent {
      // log-filter 39px
      height: calc(100% - 50px);
      padding-top: 20px;
      width: 700px;
      margin: 0 auto;

      &-notnull {
        font-size: sz(25);
        margin-left: sz(10);
        color: map-get($app-colors, error-text-color);
        position: relative;
        top: 10px;
      }

      &__body {
        // paginator 28px margin 10px
        height: calc(100% - 38px);
        overflow: auto;
      }

      &-item {
        height: 1.7rem;
        line-height: 1.7rem;

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

      &-itemphone {
        height: 2rem;
        line-height: 2rem;
      }

      &-warn {
        height: 1rem;
        color: #f34a4f;
        padding-left: 5.2rem;
        padding-top: 3px;
        font-size: 0.6rem;
      }

      &-editarea {
        height: 150px;

        label {
          vertical-align: top;
        }

        textarea {
          margin-top: 8px;
          max-height: 140px;
          min-height: 140px;
          max-width: 500px;
          min-width: 500px;
        }

        b {
          top: -60px;
        }
      }

      &__footer {
        text-align: center;
      }
    }
  }
</style>
