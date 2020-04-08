<template>
  <div v-if=" fileData"
    class="template-detail">

    <div style="margin:15px;0px">
      <h4>应用页面</h4>
      <p>{{ this.templateName }}</p>
      <!-- <select-dropdown-v2
        v-model="selectedDeptObj"
        :options="deptOptions"
        label="PAGE_NAME"
        @optionChanged="deptChanged"
      ></select-dropdown-v2> -->
    </div>
    <div class="template-detail__bodyctn">
      <a
        href="javascript:;"
        class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
        @click="selectFile"
      >上传文件</a>
      <div>
        <p>支持文件类型：.doc .docx .xls .xlsx .pdf</p>
      </div>

      <div>
        <table class="template-detail__table">
          <thead>
            <tr>
              <th>模板名称</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in fileData"
              :key="index">
              <td>{{ item.FILE_NAME }}</td>
              <td>
                <a href="javascript:;"
                  @click="deleteFile(item)">删除</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div style="margin:30px auto 0 auto">
      <div class="dialog__footer">
        <template>
          <!-- <a
            href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
            @click="upload"
          >提交</a> -->
          <a
            href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="cancel"
          >返回</a>
        </template>
      </div>
    </div>

    <global-uploader ref="upload"
      :attrdata="attrdata"
      @fileSuccess="fileSuccess"></global-uploader>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import GlobalUploader from "__libs/components/GlobalUploader";
  export default {
    name: "template-detail",

    components: { GlobalUploader },
    data() {
      return {
        templateID: null,
        templateName: "",
        // 角色列表
        fileData: null,
        checkModels: [],
        delRoleId: null,

        // 角色权限对话框
        displayRoleDialog: false,
        roleDialogView: "create",

        // 确定删除对话框吗？
        displayDeletDialog: false,
        axiosDeletStatusText: null,

        // 确定清空密码对话框吗？
        displayEmptyDialog: false,
        axiosEmptyStatusText: null,

        // 选中的当前科室
        selectedDeptObj: { PAGE_NAME: "认证申请-基本材料" },
        attrdata: [".doc", ".docx", ".xls", ".xlsx", ".pdf"],
        deptOptions: [
          { PAGE_NAME: "认证申请-基本材料" },
          { PAGE_NAME: "认证申请-专科建设材料" },
          {}
        ]
      };
    },

    mounted() {
      this.fetchData();
    },

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
          relID: this.templateID,
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
      deptChanged() {
        this.fetchData();
      },
      getQueryStringRegExp(name) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");

        if (reg.test(location.href)) {
          return unescape(RegExp.$2.replace(/\+/g, " "));
        }

        return "";
      },
      // 角色列表
      fetchData() {
        this.$showLoading();
        this.templateID = this.getQueryStringRegExp("id");
        this.templateName = decodeURI(this.getQueryStringRegExp("name"));
        Axios.get(resolveApiRoute("file-list"), {
          params: {
            relID: this.templateID,
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
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .template-detail {
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);
    height: auto;

    &__bodyctn {
      margin-left: 15px;
    }

    &__addbtnbox {
      width: sz(100);
      margin: 0 auto;

      &-addbtn {
        width: sz(100);
        height: sz(34);
        line-height: sz(34);
        margin: sz(30) 0 sz(10) 0;
      }
    }

    &__table {
      @include unify-table-ui();

      > tbody tr {
        cursor: default;

        td {
          @include table-sizes(100, 100);

          &:nth-child(1) {
            padding-left: sz(10);
          }

          &:nth-child(5) {
            div {
              @include word-hidden(sz(385), max-width);
            }
          }
        }
      }
    }

    // 重置checkbox的样式
    .customize-checkbox {
      margin-top: sz(5);
    }
  }
</style>
