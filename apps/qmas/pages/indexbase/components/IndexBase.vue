<template>
  <div v-if="roleList"
    class="index-base">
    <div>
      <h3>评审阶段</h3>
      <div style="float:left;width:100px;margin-left:5px">基本要求</div>
      <div style="float:right;width:200px;">
        <a href="javascript:;"
          class="btn"
          @click="downloadTemplate">下载模板</a>
        <a href="javascript:;"
          class="btn"
          @click="importData">导入数据</a>
      </div>
    </div>
    <br />
    <h3>指标</h3>
    <table class="index-base__table">
      <thead class="index-base__table-header">
        <tr>
          <th>项目</th>
          <th>项目描述</th>
          <th>证明文件要求</th>
          <th style="text-align:center">认证级别</th>
        </tr>
      </thead>
      <tbody class="index-base__table-body">
        <tr v-for="(item, index) in roleList"
          :key="index"
          class="index-base__table-body-review">
          <td :title="item.ITEM_NAME">{{ item.ITEM_NAME }}</td>
          <td :title="item.ITEM_DESC">{{ item.ITEM_DESC }}</td>
          <td :title="item.FILE_REQUIRE">{{ item.FILE_REQUIRE }}</td>
          <td>
            <p v-if="item.ITEM_LEVEL=='1'">初级</p>
            <p v-else-if="item.ITEM_LEVEL=='2'">中级</p>
            <p v-else>高级</p>
          </td>
        </tr>
      </tbody>
    </table>
    <br/>
    <div v-if="is_upload"
      class="dialog__footer">
      <template>
        <a
          href="javascript:;"
          class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
          @click="cancelInfo"
        >取消</a>
        <a
          href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn"
          @click="submitInfo"
        >提交</a>
      </template>
    </div>
    <global-uploader ref="upload"
      :attrdata="attrdata"
      @fileSuccess="fileSuccess">
    </global-uploader>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import GlobalUploader from "__libs/components/GlobalUploader";

  export default {
    name: "index-base",

    components: {
      GlobalUploader
    },

    data() {
      return {
        // 角色列表
        roleList: null,
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

        // 角色对话框数据
        roleInfoData: null,
        // 导入文件格式
        attrdata: [".xls", ".xlsx"],
        fileID: "",
        filePath: "",
        is_upload: false
      };
    },

    mounted() {
      this.fetchData();
    },

    methods: {
      downloadTemplate() {
        let apiUrl =
          resolveApiRoute("index-template-download") +
          "?typeId=5&tempId=INDEX_BASE_TEMP";
        window.open(apiUrl);
        // this.$showLoading();
        // Axios.get(resolveApiRoute("index-template-download"),{
        //   params: {
        //     typeId: '5',
        //     tempId: 'INDEX_BASE_TEMP'
        //   }
        // }).then((res) => {
        //   this.$hideLoading();
        //   this.$showNotice(res.data.Msg);
        // }, () => {
        //   this.$hideLoading();
        //   this.$showNotice("网络异常", "failed");
        // });
      },
      importData() {
        this.$refs.upload.openUploader({
          fileID: this.fileID,
          targetFolder: "indexfile"
        });
      },
      fileSuccess(res) {
        this.fileID = res.id;
        this.filePath = res.filePath;
        this.uploadData();
      },
      uploadData() {
        this.$showLoading();
        Axios.get(resolveApiRoute("index-upload-data"), {
          params: {
            typeId: 5,
            filePath: this.filePath
          }
        }).then((res) => {
          this.$hideLoading();
          this.roleList = JSON.parse(
            JSON.stringify(res.data.Data)
          );
          this.is_upload = true;
          // this.roleList = res.data.Data.filter((item) => {
          //   // 0: 普通用户
          //   return item.INDEX_PURPOSE === 1;
          // });
        }, () => {
          this.$hideLoading();
          this.$showNotice("网络异常", "failed");
        });
      },
      // 角色列表
      fetchData() {
        this.$showLoading();

        Axios.get(resolveApiRoute("index-base-list")).then(
          (res) => {
            this.$hideLoading();
            this.roleList = res.data.Data.Data;
          },
          () => {
            this.$hideLoading();
            this.$showNotice("网络异常", "failed");
          }
        );
      },
      // 取消
      cancelInfo() {
        this.fetchData();
        this.is_upload = false;
      },
      // 提交
      submitInfo() {
        this.$showLoading();
        Axios.post(resolveApiRoute("index-submit-base"),
                   this.roleList).then((res) => {
                     this.$hideLoading();

                     if (res.data.Code === 0) {
                       this.fetchData();
                       this.is_upload = false;
                     } else {
                       this.$showNotice(res.data.Msg, "failed");
                     }
                   }, () => {
                     this.$hideLoading();
                     this.$showNotice("网络异常", "failed");
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .index-base {
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__bodyctn {
      // title 41 btn 76
      height: calc(100% - 117px);
      overflow: auto;
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
      table-layout: fixed;
      > tbody tr {
        cursor: default;

        td {
          @include table-sizes(100, 100, 130, 100);
          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示

          &:nth-child(1) {
            padding-left: sz(10);
          }

          &:nth-child(4) {
            text-align: center;
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
