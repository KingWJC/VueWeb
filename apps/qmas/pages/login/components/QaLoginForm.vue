<template>
  <div class="qa-login-form clearfix">
    <div class="qa-login-form__left">
      <span class="qa-login-form__left-bg"></span>
      <p class="qa-login-form__left-title">重症质量认证平台</p>
    </div>

    <div class="qa-login-form__right">
      <div class="qa-login-form__right-content">
        <div class="qa-login-form__username clearfix">
          <label class="qa-login-form__username-label">账号</label>
          <input
            ref="loginobj"
            :class="{
              'qa-login-form__username-input--active': usernameOnfocus
            }"
            v-model="username"
            class="qa-login-form__username-input"
            type="text"
            placeholder="请输入用户名"
            @keyup="enterLogin($event)"
            @focus="usernameOnfocus=true"
            @blur="usernameOnfocus=false"
          />
        </div>

        <div class="qa-login-form__password clearfix">
          <label class="qa-login-form__username-label">密码</label>
          <input
            ref="psdobj"
            :class="{
              'qa-login-form__username-input--active': passwordOnfocus
            }"
            v-model="password"
            class="qa-login-form__username-input"
            type="password"
            placeholder="请输入密码"
            @keyup="enterLogin($event)"
            @focus="passwordOnfocus=true"
            @blur="passwordOnfocus=false"
          />
        </div>
        <div
          :class="{
            'qa-login-form__message--visiblity': isLoginFailed
          }"
          class="qa-login-form__message"
        >
          <span>{{ message }}</span>
        </div>
        <a class="qa-login-form__denglu"
          href="javascript:;"
          @click="okBtnClick">登录</a>
        <p style="margin-top:7px">
          <a class="qa-login-form__forgetpwd"
            href="javascript:;"
            @click="getPwd">忘记密码</a>
          <a class="qa-login-form__register"
            href="javascript:;"
            @click="register">注册账户</a>
        </p>
      </div>
    </div>

    <!-- 设置密码 -->
    <modification-password-dialog
      :display="modificationPasswordDisplay"
      :userName="username"
      uiType="setting"
      dialogFooterOkBtnText="设置"
      dialogFooterCancelBtnText="退出"
      @showDialogNoPage="showDialogNoPage"
      @closeDialog="modificationPasswordDisplay=false"
    ></modification-password-dialog>

    <qa-login-dialog
      :display="displayCancelResultDialog"
      :dialogFooterCancelBtn="false"
      @closeDialog="displayCancelResultDialog=false"
    ></qa-login-dialog>

    <!--提示框-->
    <confirm-dialog
      :display="displayConfirmDialog"
      :dialogBody="axiosConfirmStatusText"
      :dialogHeaderCloseBtn="true"
      @closeDialog="displayConfirmDialog=false"
    ></confirm-dialog>
  </div>
</template>

<script>
// 全局配置
  import Config from "__libs/js/modules/config";
  import Axios from "axios";
  import QaLoginDialog from "./QaLoginDialog";
  import ModificationPasswordDialog from "__libs/components/dialog/ModificationPasswordDialog";

  export default {
    name: "qa-login-form",

    components: {
      QaLoginDialog,
      ModificationPasswordDialog
    },

    data() {
      return {
        username: "",
        password: "",

        isLoginFailed: false,
        // 用户名是否没激活
        usernameOnfocus: false,
        passwordOnfocus: false,
        message: "",

        // 弹框
        displayCancelResultDialog: false,

        modificationPasswordDisplay: false,

        // 提示对话框吗？
        displayConfirmDialog: false,
        axiosConfirmStatusText: null
      };
    },

    methods: {
      // 显示 没有配置页的弹框
      showDialogNoPage() {
        this.modificationPasswordDisplay = false;
        this.axiosConfirmStatusText =
          "您的账号尚无相关页面访问权限，请联系管理员进行设置！";
        this.displayConfirmDialog = true;
      },

      getPwd() {
        this.displayCancelResultDialog = true;
      },

      register() {
        location.href = "/Register";
      },

      enterLogin(e) {
        if (e.keyCode === 13) {
          // 如果光标保留到input里面，ie下弹出层不能遮盖光标，会被光标穿透
          this.$refs.loginobj.blur();
          this.$refs.psdobj.blur();
          this.okBtnClick();
        }
      },

      okBtnClick() {
        if (this.username.trim() === "") {
          this.isLoginFailed = true;
          this.message = "请输入账号！";
          this.usernameOnfocus = true;

          return;
        }

        Axios.post("/Login", {
          UserName: this.username.trim(),
          PassWord: this.password.trim()
        }).then(
          (res) => {
            if (res.data.Code === 0) {
              // 登陆成功之后 如果没有默认页面 出现弹框
              if (res.data.Data.HomeUrl) {
                window.location.href = res.data.Data.HomeUrl;
              } else {
                this.axiosConfirmStatusText =
                  "您的账号尚无相关页面访问权限，请联系管理员进行设置！";
                this.displayConfirmDialog = true;
              }
            } else if (res.data.Code === 1) {
              this.isLoginFailed = true;
              this.message = res.data.Msg;
              this.usernameOnfocus = true;
            } else if (res.data.Code === 5) {
              this.isLoginFailed = true;
              this.message = res.data.Msg;
              this.usernameOnfocus = true;
            } else if (res.data.Code === 10) {
              // 设置密码弹框
              // 更新全局配置
              Config.USER = res.data.Data.USER;
              Config.SETTING = res.data.Data.SETTING;
              Config.HomeUrl = res.data.Data.HomeUrl;

              this.modificationPasswordDisplay = true;
            } else if (res.data.Code === 11) {
              // 登录的时候密码过期 重新设置密码

              // 更新全局配置
              Config.USER = res.data.Data.USER;
              Config.SETTING = res.data.Data.SETTING;
              Config.HomeUrl = res.data.Data.HomeUrl;

              this.modificationPasswordDisplay = true;
            } else if (res.data.Code === 12) {
              // 登录的时候密码输入次数过多， 提示锁定用户
              this.isLoginFailed = true;
              this.message =
                "今日连续10次输入错误密码，请明日再试或联系管理员清空重置密码!";
            } else if (res.data.Code === 14) {
              this.isLoginFailed = true;
              this.message =
                "您的账号尚无相关页面访问权限，请联系管理员进行设置！";
            } else {
              this.isLoginFailed = true;
              this.message = "登录失败!";
            }
          },
          () => {
            this.isLoginFailed = true;
            this.message = "登录失败!";
            this.$showNotice("网络异常", "failed");
          }
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .qa-login-form {
    @include border-radius(12px);
    @include box-shadow(
      10px 10px 16px rgba(map-get($colors, pure-black), 0.15)
    );

    width: sz(510);
    height: sz(230);
    background: rgba(map-get($colors, pure-white), 0.8);
    padding: sz(70) sz(80) sz(63) sz(60);

    &__left {
      float: left;

      &-bg {
        display: block;
        width: sz(100);
        height: sz(72);
        margin: sz(38) auto 0;
        background: url("~__libs/imgs/logo1.png") no-repeat center top;
      }

      &-title {
        margin-top: sz(40);
        text-align: center;
        font-weight: bold;
        color: map-get($colors, text-main);
        font-size: sz(23);
      }
    }

    &__right {
      float: right;
      border-left: 1px solid map-get($colors, pure-white);

      &-content {
        margin-left: sz(80);
        padding-top: sz(20);
      }
    }

    &__username,
    &__password {
      height: sz(34);

      &-label {
        float: left;
        height: sz(34);
        line-height: sz(34);
        color: map-get($colors, text-main);
      }

      &-input {
        @include border-radius(6px);
        @include placeholder-color(map-get($colors, dialog-input-border));

        padding-left: sz(10);
        padding-right: sz(10);
        margin-left: sz(10);
        width: sz(200);
        height: sz(34);
        border: 1px solid map-get($app-colors, input-light-border);
        font-size: sz(13);
        float: right;

        &--active {
          border: 1px solid map-get($colors, theme-blue);
        }
      }
    }

    &__password {
      margin-top: sz(20);
    }

    &__message {
      height: sz(26);
      margin: sz(2) sz(0) sz(-4) sz(38);
      color: map-get($colors, theme-red);
      font-size: map-get($font-sizes, xs);
      visibility: hidden;

      &--visiblity {
        visibility: visible;
      }

      span {
        display: inline-block;
        width: sz(195);
      }
    }

    &__denglu {
      @include border-radius(6px);

      display: block;
      margin-left: sz(38);
      width: sz(200);
      height: sz(34);
      background-color: map-get($colors, theme-blue);
      text-align: center;
      line-height: sz(34);

      @at-root #{get-bem-root()} & {
        color: map-get($colors, pure-white);
      }
    }

    &__forgetpwd {
      display: inline;
      text-align: left;
      margin-left: sz(40);
      // margin-top: sz(5);

      @at-root #{get-bem-root()} & {
        color: map-get($colors, theme-blue);
      }
    }

    &__register {
      display: inline;
      text-align: right;
      margin-left: sz(70);
      // margin-top: sz(5);

      @at-root #{get-bem-root()} & {
        color: map-get($colors, theme-blue);
      }
    }
  }
</style>
