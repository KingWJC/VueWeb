<template>
  <teleporter>
    <div
      :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName,
        `modification-password-dialog--${uiType}`
      ]"
      class="dialog"
    >
      <div class="dialog__header clearfix">
        <h3>
          <span>{{ titles }}密码</span>
        </h3>
        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"></a>
      </div>

      <div class="dialog__body">
        <div class="modification-password-dialog__contents">
          <div class="modification-password-dialog__contents-item">
            <label>账号</label>
            <input v-model="tmpUserName"
              type="text"
              disabled />
          </div>
          <template v-if="uiType === 'modification'">
            <div class="modification-password-dialog__contents-item">
              <label>旧密码</label>
              <input
                ref="modification"
                v-model="oldPassWord"
                type="password"
                placeholder="请输入密码"
                @focusout="onBlurOldPassWord($event)"
              />
            </div>
            <div
              :class="{
                'modification-password-dialog__contents-namewarning--repeat':
                  isRepeatOld
              }"
              class="modification-password-dialog__contents-namewarning"
            >
              <span>{{ lawlessnessOld }}</span>
            </div>
          </template>

          <div class="modification-password-dialog__contents-item">
            <label>新密码</label>
            <input
              ref="setting"
              v-model="newPassWord"
              type="password"
              placeholder="请输入要改的新密码"
              @focusout="onBlurNewPassWord($event)"
            />
          </div>
          <div
            :class="{
              'modification-password-dialog__contents-namewarning--repeat':
                isRepeat
            }"
            class="modification-password-dialog__contents-namewarning"
          >
            <span>{{ lawlessness }}</span>
          </div>
          <div class="modification-password-dialog__contents-item">
            <label>确认密码</label>
            <input
              v-model="repeatNewPassWord"
              type="password"
              placeholder="请再次输入要改的新密码"
              @focusout="onBlurRepeatNewPassWord($event)"
            />
          </div>
          <div
            :class="{
              'modification-password-dialog__contents-namewarning--repeat':
                isRepeatNew
            }"
            class="modification-password-dialog__contents-namewarning"
          >
            <span>{{ lawlessnessNew }}</span>
          </div>
        </div>
      </div>

      <div class="dialog__footer">
        <template v-if="uiType === 'setting'">
          <a
            href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="close"
          >{{ dialogFooterCancelBtnText }}</a>

          <a
            href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
            @click="okBtnClick"
          >{{ dialogFooterOkBtnText }}</a>
        </template>
        <template v-else-if="uiType === 'modification'">
          <a
            href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="close"
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
  import $ from "jquery";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "modification-password-dialog",

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "modification-password-dialog"
      },

      // 登录页输入框里面的用户名
      userName: {
        type: String,
        default: ""
      },

      uiType: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        // 原密码
        oldPassWord: "",
        // 新密码
        newPassWord: "",
        // 重复新密码
        repeatNewPassWord: "",
        // 本地输入框里面的用户名
        tmpUserName: "",
        lawlessness: "",
        lawlessnessNew: "",
        lawlessnessOld: "",
        isRepeat: false,
        isRepeatNew: false,
        isRepeatOld: false
      };
    },

    computed: {
      // 标题
      titles() {
        if (this.uiType === "modification") {
          return "修改";
        } else if (this.uiType === "setting") {
          return "设置";
        }
      }
    },

    watch: {
      // 登录框里面的值发生了变化，同步本地值（v-model已经和登录框分离）
      userName(val) {
        this.tmpUserName = val.trim();
      }
    },

    // 挂载的时候更新本地缓存
    mounted() {
      this.tmpUserName = this.userName.trim();
    },

    methods: {
      initDialog() {
        this.$nextTick(() => {
          if (this.uiType === "setting") {
            this.$refs.setting.focus();
          } else if (this.uiType === "modification") {
            this.$refs.modification.focus();
          }
        });
      },
      // 旧密码是否合格
      validOld() {
        let oldPassWord = this.oldPassWord.trim();
        let yz = this.getSimpleTestReg();

        if (oldPassWord === "") {
          return "请输入旧密码";
        }

        if (oldPassWord.length > 20) {
          return "请设置20位以下的密码";
        }

        if (!yz.test(oldPassWord)) {
          return "请设置为数字、字母或特殊字符的密码";
        }
      },

      // 判断点击的对象时是否为 取消/关闭(X号) 特殊按钮 ,从而来在失去焦点时过滤验证
      notNeedTest(e) {
        return (
          $(e.relatedTarget).hasClass("dialog__footer-btn-cancel") ||
          $(e.relatedTarget).hasClass("dialog__closebtn")
        );
      },

      // 验证旧密码
      testOldPassWord() {
        let err = this.validOld();

        if (err) {
          this.isRepeatOld = true;
          this.lawlessnessOld = err;
        } else {
          this.isRepeatOld = false;
        }
      },

      // 旧密码
      onBlurOldPassWord(evt) {
        if (this.notNeedTest(evt)) {
          return;
        }

        this.testOldPassWord();
      },
      // 新密码是否合格
      validNew() {
        let newPassWord = this.newPassWord.trim();

        if (newPassWord === "") {
          return "请输入新密码";
        }

        return this.validPwd(newPassWord);
      },

      validPwd(newpwd) {
        let yz = this.getSimpleTestReg();

        if (newpwd.length > 20) {
          return "请设置20位以下的密码";
        }

        // 密码高强度  1 是 0 否
        if (newpwd.length < 6) {
          return "请设置6位以上的密码";
        }

        // 用户名和新密码都转为小写，判断是否一样
        if (this.userName.toLowerCase() === newpwd.toLowerCase()) {
          return "请设置和账号不相同的密码";
        }

        // // 首先缩小判断范围，使用白名单，同简单匹配（数字 || 字母 || 特殊字符）
        if (!yz.test(newpwd)) {
          return "请设置由数字、字母或特殊字符组合的密码";
        }

        if (!this.getTwoTestReg(newpwd)) {
          return "请设置由数字、字母或特殊字符组合的密码";
        }

        // 默认返回空（没有错误）
        return null;
      },

      // 验证新密码
      testNewPassWord() {
        let err = this.validNew();

        if (err) {
          this.isRepeat = true;
          this.lawlessness = err;
        } else {
          this.isRepeat = false;
        }
      },

      // 新密码
      onBlurNewPassWord(evt) {
        if (this.notNeedTest(evt)) {
          return;
        }

        this.testNewPassWord();
      },

      // 获取简单匹配时的正则
      getSimpleTestReg() {
        return /^[$!^*-+.=\d~@#%&_a-zA-Z]+$/i;
      },

      // 获取高强度匹配时的正则
      getIntensifiedTestReg() {
        return [/\d+/i, /[a-zA-Z]+/i, /[$!^*-+.=~@#%&_]+/i];
      },

      // 验证组合密码 返回true或false
      getTwoTestReg(testpwd) {
        let yztypes = this.getIntensifiedTestReg();

        // 然后分别判断组合（4种）
        // 数字 + 字母
        // 数字 + 特殊
        // 字母 + 特殊
        // 数字 + 字母 + 特殊
        return (
          (yztypes[0].test(testpwd) && yztypes[1].test(testpwd)) ||
          (yztypes[0].test(testpwd) && yztypes[2].test(testpwd)) ||
          (yztypes[1].test(testpwd) && yztypes[2].test(testpwd)) ||
          (yztypes[0].test(testpwd) &&
          yztypes[1].test(testpwd) &&
          yztypes[2].test(testpwd))
        );
      },

      // 确认密码是否合格
      validRepeat() {
        let yz = this.getSimpleTestReg();
        let newPassWord = this.newPassWord.trim();
        let repeatNewPassWord = this.repeatNewPassWord.trim();
        let bl = !yz.test(repeatNewPassWord);

        if (repeatNewPassWord === "") {
          return "请再输入一次密码";
        }

        if (repeatNewPassWord.length > 20) {
          return "请设置20位以下的密码";
        }

        // 密码高强度  1 是 0 否
        for (let key in this.$config.SETTING) {
          if (
            this.$config.SETTING[key].ItemCode === "PWD_STRONG" &&
            this.$config.SETTING[key].ItemVal === "1"
          ) {
            if (repeatNewPassWord.length < 6) {
              return "请设置6位以上的密码";
            }

            // 首先缩小判断范围，使用白名单，同简单匹配（数字 || 字母 || 特殊字符）
            if (!yz.test(repeatNewPassWord)) {
              return "请设置由数字、字母或特殊字符组合的密码";
            }

            if (!this.getTwoTestReg(repeatNewPassWord)) {
              return "请设置由数字、字母或特殊字符组合的密码";
            }
          } else {
            if (this.$config.SETTING[key].ItemCode === "PWD_STRONG") {
              if (bl) {
                return "请设置为数字、字母或特殊字符的密码";
              }
            }
          }
        }

        if (newPassWord !== repeatNewPassWord) {
          return "两次输入的密码不一致";
        }

        // 默认返回空（没有错误）
        return null;
      },

      // 验证确认密码
      testRepeatPassWord() {
        let err = this.validRepeat();

        if (err) {
          this.isRepeatNew = true;
          this.lawlessnessNew = err;
        } else {
          this.isRepeatNew = false;
        }
      },

      // 确认密码
      onBlurRepeatNewPassWord(evt) {
        if (this.notNeedTest(evt)) {
          return;
        }

        this.testRepeatPassWord();
      },

      // 点击确定按钮提交数据并且发送请求
      okBtnClick() {
        let validOld = this.validOld();
        let validNew = this.validNew();
        let validRepeat = this.validRepeat();

        // 不执行，直接点击确定按钮 不会显示红字
        this.testOldPassWord();
        this.testNewPassWord();
        this.testRepeatPassWord();

        if (this.uiType === "modification") {
          // 只要有值，不发请求
          if (validOld || validNew || validRepeat) {
            return;
          }
        } else if (this.uiType === "setting") {
          if (validNew || validRepeat) {
            return;
          }
        }
        this.fetchData(this.uiType);
      },

      // 重写关闭dialog方法关闭时清空模型
      close() {
        // 清空模型
        this.oldPassWord = "";
        this.newPassWord = "";
        this.repeatNewPassWord = "";
        this.isRepeatOld = false;
        this.isRepeatNew = false;
        this.isRepeat = false;
        this.$emit("closeDialog");
      },

      // 弹出错误信息（failed）提示框
      showError(errmsg) {
        this.$showNotice({
          noticeText: errmsg,
          noticeType: "failed",
          logicClassName: "modification-password-notice"
        });
      },

      fetchData(type) {
        // 修改密码
        if (type === "modification") {
          Axios.put(
            resolveApiRoute("user-change-pwd", {
              UserCode: this.tmpUserName
            }),
            {
              OldPwd: this.oldPassWord,
              NewPwd: this.newPassWord
            }
          ).then(
            (res) => {
              if (res.data.Code === 0) {
                this.$showNotice({
                  noticeText: "密码修改成功",
                  logicClassName: "modification-password-notice"
                });

                // 清空模型
                this.oldPassWord = "";
                this.newPassWord = "";
                this.repeatNewPassWord = "";
                this.close();
              } else if (res.data.Code === 8) {
                this.lawlessnessOld = "旧密码错误";
                this.isRepeatOld = true;
              } else if (res.data.Code === 9) {
                this.showError("修改密码失败");
              } else if (res.data.Code === 10) {
                this.showError("密码修改异常");
              }
            },
            () => {
              this.showError("网络异常");
            }
          );
        } else if (type === "setting") {
          // 设置密码
          Axios.post(
            resolveApiRoute("user-set-pwd", {
              UserCode: this.tmpUserName
            }),
            {
              Pwd: this.newPassWord
            },
            {
              // axios 拦截器在页面进入的时候才会添加 header，异步生成的header（token）不能
              // 捕获和添加，需要在这里手工添加(在打开这个对话框之前已经成功登录，拿到token了)
              headers: {
                Authorization: `Bearer ${this.$config.USER.Token}`
              }
            }
          ).then(
            (res) => {
              if (res.data.Code === 0) {
                // 密码设置成功之后 如果没有默认页面 出现弹框
                if (this.$config.HomeUrl) {
                  window.location.href = this.$config.HomeUrl;
                } else {
                  this.$emit("showDialogNoPage");
                }
              } else {
                this.showError("密码设置失败");
              }
            },
            () => {
              this.showError("密码设置失败");
            }
          );
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .modification-password-dialog {
    @include dialog-css(sz(420), sz(270));

    .dialog__body {
      padding: sz(30) 0 0;
    }

    &__contents {
      &-item {
        text-align: right;
        padding-right: sz(76);
        height: sz(34);
        position: relative;

        &:first-child {
          margin-bottom: sz(20);
        }

        input {
          @include border-radius(4px);
          @include placeholder-color(map-get($colors, placeholder-text-color));

          float: right;
          border: 1px solid map-get($colors, dialog-input-border);
          height: sz(34);
          width: sz(200);
          text-indent: sz(10);
          color: map-get($colors, dialog-text-color);
          font-size: map-get($font-sizes, xs);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }

          &:disabled {
            background-color: map-get($colors, dialog-input-disabled-bg);
            color: map-get($colors, dialog-disabled-text-color);
          }
        }

        label {
          margin-right: sz(10);
          line-height: sz(34);
        }

        &-picfail {
          position: absolute;
          left: sz(580);
          top: sz(7);
          width: sz(16);
          height: sz(16);
          background: url("~__libs/imgs/change-fail.png") center no-repeat;
        }

        &-picsuccess {
          position: absolute;
          left: sz(580);
          top: sz(7);
          width: sz(16);
          height: sz(16);
          background: url("~__libs/imgs/change-success.png") center no-repeat;
        }

        &-tips {
          position: absolute;
          left: sz(580);
          top: sz(5);
          color: map-get($app-colors, error-text-color);
        }

        // 设置密码的时候需要上边距
        @at-root #{get-bem-root()}--setting &:first-child {
          margin-top: sz(20);
        }
      }
      &-namewarning {
        visibility: hidden;
        text-align: left;
        height: sz(20);
        position: relative;

        span {
          display: inline-block;
          position: absolute;
          top: sz(0);
          left: sz(0);
          height: sz(15);
          font-size: sz(12);
          margin-left: sz(144);
          border: 1px solid transparent;
          color: map-get($colors, theme-red);
        }

        &--repeat {
          visibility: visible;
        }
      }

      &-btnbox {
        margin-top: sz(60);
        text-align: center;
      }
    }

    // 重定义 notice 在当前视图下的宽度, 使用 @at-root 编译到当前
    // BEM 最下面（具体参照css编译码）
    @at-root {
      .modification-password-notice {
        width: sz(398);
      }
    }
  }
</style>
