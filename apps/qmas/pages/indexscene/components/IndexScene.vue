<template>
  <div v-if="roleList"
    class="index-scene">
    <div>
      <h3>评审阶段</h3>
      <div style="float:left;width:100px;margin-left:5px">现场评审</div>
      <div style="float:right;width:200px;">
        <a href="javascript:;"
          class="btn"
          @click="downloadTemplate">下载模板</a>
        <a href="javascript:;"
          class="btn"
          @click="importData">导入数据</a>
      </div>
    </div>
    <br/>
    <div><h3>指标</h3></div>
    <table class="index-scene__table">
      <thead class="index-scene__table-header">
        <tr>
          <th>一级指标</th>
          <th>二级指标</th>
          <th>三级指标</th>
          <th>证明文件</th>
          <th>证明文件要求</th>
          <th>指标释义与评分标准</th>
          <th style="text-align:center">标准分值</th>
        </tr>
      </thead>
      <tbody class="index-scene__table-body">
        <tr v-for="(item, index) in roleList"
          :key="index"
          class="index-scene__table-body-review">
          <td :title="item.INDEX_ONE_LEVEL">{{ item.INDEX_ONE_LEVEL }}</td>
          <td :title="item.INDEX_TWO_LEVEL">{{ item.INDEX_TWO_LEVEL }}</td>
          <td :title="item.INDEX_THREE_LEVEL">{{ item.INDEX_THREE_LEVEL }}</td>
          <td>
            <p v-if="item.IS_NEED_PROVE=='1'">需要</p>
            <p v-else>不需要</p>
          </td>
          <td :title="item.PROVE_FILE_REQ">{{ item.PROVE_FILE_REQ }}</td>
          <td :title="item.INDEX_DESC">{{ item.INDEX_DESC }}</td>
          <td :title="item.STANDARD_SCORE">{{ item.STANDARD_SCORE }}</td>
        </tr>
      </tbody>
    </table>
    <br/>
    <div v-if="is_upload" 
      class="dialog__footer">
      <a href="javascript:;"
        class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
        @click="cancelInfo">取消</a>
      <a href="javascript:;"
        class="btn dialog__footer-btn dialog__footer-btn"
        @click="submitInfo">提交</a>
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
    name: "index-scene",

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
          resolveApiRoute("index-template-download") + "?typeId=4";
        window.open(apiUrl);
        // this.$showLoading();
        // Axios.get(resolveApiRoute("index-template-download"),{
        //   params: {
        //     typeId: 4
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
            typeId: 4,
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
      deptChanged() {
        this.fetchData();
      },

      // 角色列表
      fetchData() {
        this.$showLoading();
        Axios.get(resolveApiRoute("index-scene-list")).then(
          (res) => {
            this.$hideLoading();
            this.roleList = res.data.Data.Data.filter((item) => {
              // 0: 普通用户
              return item.INDEX_PURPOSE === 4;
            });
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
        Axios.post(resolveApiRoute("index-submit-data"), {
          TypeId: 4,
          SubmitData: this.roleList
        }).then((res) => {
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

  .index-scene {
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
      &-del {
        margin-left: sz(16);
      }

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
          @include table-sizes(130, 150, 200, 100, 80, 150, 100);
          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示
          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            text-align: center;
            height: sz(40);
          }

          &:nth-child(7) {
            text-align: center;
          }

          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7) {
            @include word-hidden(sz(148));
          }

          &:nth-child(8) {
            a {
              margin-right: sz(5);
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
