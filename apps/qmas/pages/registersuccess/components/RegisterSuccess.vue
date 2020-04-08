<template>
  <div class="register-success">
    <div style="margin:20px auto;width:1000px;height:500px">
      <h1 class="title-center register-success__title-one">重症质量认证平台注册</h1>
      <h1 class="title-center register-success__title-two">提交成功!</h1>
      <h5 class="title-center">工作人员审核注册信息通过后可以登录</h5>
    </div>
    <div class="dialog__footer">
      <a
        href="javascript:;"
        class="btn dialog__footer-btn dialog__footer-btn-ok"
        @click="toHoneIndex"
      >返回门户</a>
    </div>
  </div>
</template>

<script>

  export default {
    name: "register-success",

    components: {
    },

    props: {
      controlModel: {
        type: String,
        default: "import"
      }
    },
    data() {
      return {};
    },

    watch: {},

    methods: {
      toHoneIndex() {
        location.href = "/Login/Index";
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .register-success {
    // @include dialog-css(sz(480), sz(239));

    &__body {
      &-userloginname,
      &-doctor,
      &-doctoradd,
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

        .select-dropdown-v2 {
          float: left;
          width: sz(200);
          height: sz(34);
          margin-left: sz(10);

          &__selected {
            font-size: map-get($font-sizes, xs);
            height: sz(32);
            line-height: sz(32);
            border-color: map-get($colors, dialog-input-border);

            &-placeholder {
              height: sz(32);
              line-height: sz(32);
              font-size: map-get($font-sizes, xs);
            }

            &-input,
            &-plain {
              height: sz(32);
              font-size: map-get($font-sizes, xs);
              line-height: sz(32);
            }
          }
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
          width: sz(200);
          height: sz(34);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          margin-left: sz(10);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        &-editinputuser {
          background: map-get($colors, pure-white);
          border: none;
        }

        &-editinputmm {
          color: map-get($colors, dialog-disabled-text-color);
          background: map-get($colors, dialog-input-disabled-bg);
          font-size: map-get($font-sizes, xs);
        }

        &-mustwrite {
          float: left;
          font-size: sz(25);
          margin-left: sz(10);
          color: map-get($app-colors, error-text-color);
          margin-top: sz(5);
          height: sz(27);
        }
      }

      &-userloginname {
        margin: 0;
      }

      &-namewarning,
      &-addnamewarning {
        // visibility: hidden;
        text-align: left;
        height: sz(27);
        margin-top: sz(5);
        position: relative;

        span {
          display: inline-block;
          position: absolute;
          top: sz(0);
          left: sz(0);
          height: sz(15);
          font-size: map-get($font-sizes, xs);
          height: sz(12);
          line-height: sz(12);
          margin-left: sz(162);
          border: 1px solid transparent;
          color: map-get($colors, theme-red);
        }

        &--repeat {
          visibility: visible;
        }
      }

      &-username,
      &-usernameedit {
        height: sz(34);
        line-height: sz(34);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        .select-dropdown-v2 {
          float: left;
          width: sz(200);
          height: sz(34);
          margin-left: sz(10);
        }

        &-editinput {
          @include placeholder-color(map-get($colors, placeholder-text-color));
          @include border-radius(5px);

          float: left;
          width: sz(200);
          height: sz(34);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          margin-left: sz(10);
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        &-mustwrite {
          float: left;
          font-size: sz(25);
          margin-left: sz(10);
          color: map-get($app-colors, error-text-color);
          margin-top: sz(5);
          height: sz(27);
        }
      }

      &-usernameedit {
        margin-top: sz(10);
      }

      &-gender,
      &-genderAdd,
      &-genderedit,
      &-oneself {
        margin-top: sz(30);
        height: sz(14);
        line-height: sz(14);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        .customize-checkbox {
          float: left;
          margin-left: sz(10);

          &__radio {
            width: sz(12);
            height: sz(12);
          }

          &__label {
            vertical-align: middle;
            margin-left: sz(5);
            line-height: sz(14);
            height: sz(14);
            color: map-get($colors, dialog-text-color);
          }

          &:last-child {
            margin-left: sz(34);
          }

          &--active {
            .customize-checkbox__radio {
              width: sz(4);
              height: sz(4);
            }
          }
        }
      }

      &-genderAdd,
      &-genderedit,
      &-oneself {
        margin-top: 0;
      }

      &-oneself {
        &-span {
          width: sz(206);
        }
      }
    }

    &__notice {
      text-align: center;
      margin: 0 0 sz(20) 0;
      font-size: sz(12);
      line-height: sz(12);
      color: map-get($colors, text-light);
    }

    .title-center {
      text-align: center;
    }

    &__title-one {
      margin: sz(50) 0 sz(20) 0;
      line-height: sz(12);
    }

    &__title-two {
      margin: sz(200) 0 sz(40) 0;
      line-height: sz(12);
      font-size: sz(40);
      color: green;
    }

    //重定义body下的样式
    @at-root {
      .register-form-select-dropdown {
        .select-dropdown-v2-options__items-item-text {
          overflow: visible;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .cases-search-box {
    @include border-radius(4px);

    border: 1px solid map-get($colors, dialog-cancel-border);
    padding: sz(7) sz(10);
    background: map-get($colors, pure-white);
  }
</style>
