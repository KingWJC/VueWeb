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
        <h3>
          <span>上传文件</span>
        </h3>
        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"></a>
      </div>

      <div class="dialog__body">
        <div class="file-manage-dialog__contents">
          <div class="file-manage-dialog__contents-item">
            <table class="file-manage-dialog__temp-table">
              <thead>
                <tr>
                  <th>文件名称</th>
                  <th>操作</th>
                </tr>
              </thead>
            </table>

            <div>
              <table class="file-manage-dialog__temp-table">
                <tbody>
                  <tr v-for="(item, index) in editBaseData"
                    :key="index">
                    <td>{{ item.FILE_NAME }}</td>
                    <td>
                      <template v-if="uiType==='upload'">
                        <a href="javascript:;"
                          @click="deleteFile(item)">删除</a>
                      </template>
                      <a href="javascript:;"
                        @click="viewFile(item)">查看</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <template v-if="uiType==='upload'">
        <div class="dialog__footer">
          <a
            href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="upload"
          >上传文件</a>
        </div>
      </template>
    </div>
  </teleporter>
</template>

<script>
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";

  export default {
    name: "file-manage-dialog",

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "file-manage-dialog"
      },
      editBaseData: {
        type: Array,
        default() {
          return {};
        }
      },
      uiType: {
        type: String,
        default: "upload"
      }
    },

    data() {
      return {};
    },

    methods: {
      upload() {
        this.$emit("uploadFile");
      },
      deleteFile(item) {
        this.$emit("deleteFile", item);
      },
      viewFile(item) {
        window.open(`/PdfViewer?filePath=${encodeURI(encodeURI(item.FILE_PATH))}`);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .file-manage-dialog {
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

    &__temp-table {
      @include unify-table-ui();
      table-layout: fixed;

      span,
      b,
      a {
        display: inline-block;
      }

      tr {
        th {
          &:nth-child(2) {
            text-indent: sz(24);
          }
        }

        th,
        td {
          @include table-sizes(200, 120);
          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示
          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            text-indent: sz(10);
            width: sz(200);
            > p {
              @include word-hidden(sz(200));

              margin: 0;
            }
          }
          &:nth-child(2) {
            > p {
              @include word-hidden(sz(120));

              margin: 0;
            }

            > div {
              margin-left: sz(8);
            }
            a {
              margin-right: sz(5);

              #{get-bem-root()} & {
                color: map-get($colors, theme-blue);
              }
            }
          }
        }
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
