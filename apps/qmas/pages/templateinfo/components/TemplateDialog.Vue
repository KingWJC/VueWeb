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
      <!--标题-->
      <div class="dialog__header clearfix">
        <h3>{{title}}</h3>
        <a title="取消" href="javascript:;" class="dialog__closebtn" @click="headerCloseBtnClick"></a>
      </div>

      <!--内容-->
      <div class="dialog__body">
        <!--操作部分-->
        <div style="margin:15px;0px">
          <h4>应用页面</h4>
          <p>{{ this.templateName }}</p>
        </div>
        <div class="template-dialog_Table" style="margin:15px;0px">
          <a
            href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="selectFile"
          >上传文件</a>
        </div>
        <div style="margin:15px;0px">
          <p>支持文件类型：.doc .docx .xls .xlsx .pdf</p>
        </div>

        <!--列表部分-->

        <div style="margin:15px;0px">
          <table class="template-dialog__table">
            <thead>
              <tr>
                <th>模板名称</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>
          <div class="template-dialog__bodyctn">
            <table class="template-dialog__table">
              <tbody>
                <tr v-for="(item, index) in fileData" :key="index">
                  <td>{{ item.FILE_NAME }}</td>
                  <td>
                    <a href="javascript:;" @click="deleteFile(item)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>
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
      <global-uploader ref="upload" :attrdata="attrdata" @fileSuccess="fileSuccess"></global-uploader>
    </div>
  </teleporter>
</template>

<script>
import Axios from "axios";
import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
import CheckboxGroup from "__shared-libs/components/CheckboxGroup";
import resolveApiRoute from "__libs/js/modules/resolve-api-route";
import GlobalUploader from "__libs/components/GlobalUploader";

export default {
  name: "template-dialog",

  components: {
    CheckboxGroup,
    GlobalUploader
  },

  mixins: [BasicDialog],

  props: {
    logicClassName: {
      type: String,
      default: "template-dialog"
    },

    userData: {
      type: Object,
      default() {
        return null;
      }
    }
  },

  data() {
    return {
      templateID: null,
      fileData: null,
      templateName: "",
      // 新创建的用户如果没选择角色，需要给出提示
      isHide: true,

      // 专家审核ID
      expertAuditId: "",
      // 状态ID
      stateId: "",
      title: "",
      // 不通过原因
      acResult: "",
      // 备注
      remark: "",
      // 系统建议等级
      systemSuggestLevel: "",
      acApplyId: "",
      attrdata: [".doc", ".docx", ".xls", ".xlsx", ".pdf"]
    };
  },

  computed: {},
  methods: {
    deleteFile(item) {
      Axios.delete(resolveApiRoute("file-delete"), {
        params: {
          fileID: item.ID
        }
      }).then(
        (res) => {
          if (res.data.Code === 0) {
            let index = this.fileData.findIndex((file) => {
              return file.ID === item.ID;
            });
            let workList = this.fileData.slice(0);
            workList.splice(index, 1);
            this.fileData = workList;

            if (this.fileData.length === 0) {
              this.selectItem.FILE_STATE = 0;
            }
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        },
        () => {
          this.$showNotice("网络异常", "failed");
        }
      );
    },
    fileSuccess(res) {
      let freshFile = {
        ID: res.id,
        FILE_NAME: res.name
      };
      let newfileData = this.fileData.slice(0);
      newfileData.push(freshFile);
      this.fileData = newfileData;
      this.selectItem.FILE_STATE = 1;
    },
    selectFile() {
      this.$refs.upload.openUploader({
        fileID: "",
        typeID: 2,
        relID: this.userData.id,
        targetFolder: "template"
      });
    },
    upload() {
      this.$showNotice("更新成功", "success");
      window.location.href = `/TemplateInfo`;
    },
    cancel() {
      window.location.href = `/TemplateInfo`;
    },

    // 编辑 初始化对话框
    initDialog() {
      // if (this.userData != null) {
      //   (this.expertAuditId = this.userData.expertAuditId),
      //     (this.acApplyId = this.userData.acApplyId),
      //     (this.title = this.userData.title),
      //     (this.acResult = this.userData.acResult),
      //     (this.remark = this.userData.remark);
      // }
      this.$showLoading();
      this.templateName = this.userData.templateName;
      this.title = this.userData.title;
      Axios.get(resolveApiRoute("file-list"), {
        params: {
          relID: this.userData.id,
          type: 2
        }
      }).then(
        (res) => {
          this.$hideLoading();

          if (res.data.Code === 0) {
            this.fileData = res.data.Data;
            this.showFileControlDialog = true;
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        },
        () => {
          this.$hideLoading();
          this.$showNotice("网络异常", "failed");
        }
      );
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
        logicClassName: "template-dialog-notice"
      });
    },

    // 点击确认按钮
    okBtnClick() {
      this.$emit("dialogOkClicked");
      window.location.href = `/TemplateInfo`;
    }
  }
};
</script>

<style lang="scss">
@import "~__libs/scss/lib-common-utils";

.template-dialog {
  @include dialog-css(sz(500), sz(440));

  .dialog__body {
    padding: sz(20) 0 0;
    text-align: left;
  }
  &__bodyctn {
    margin-left: 15px;
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
  &__bodyctn {
    // title 41 btn 76
    height: 200px;
    overflow: auto;
  }
  &__table {
    @include unify-table-ui();
    table-layout: fixed;

    span,
    b,
    a {
      display: inline-block;
    }

    tr {
      th,
      td {
        @include table-sizes(100, 50);
        white-space: nowrap; //禁止td换行
        overflow: hidden; //隐藏X,Y滚动条
        text-overflow: ellipsis; //将显示不完的以...显示
        padding: 0;

        &:first-child {
          padding: 0 sz(8);
          text-indent: sz(18);
          width: sz(100);
        }
        &:nth-child(2) {
          > p {
            @include word-hidden(sz(50));

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
    .template-dialog-notice {
      width: sz(417);
    }
  }
}
</style>
