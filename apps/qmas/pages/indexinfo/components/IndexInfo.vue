<template>
  <div v-if="roleList"
    class="index-info">
    <div>
      <h3>评审阶段</h3>
      <div style="float:left;width:100px;margin-left:5px">数据评审</div>
      <div style="float:right;">
        <a href="javascript:;"
          class="btn"
          @click="downloadTemplate">下载模板</a>
      </div>
      <br />
    </div>
    <br />
    <div id="IndexType">
      <h3>指标类型</h3>
      <select-dropdown-v2
        v-model="selectedDeptObj"
        :options="deptOptions"
        label="DEPT_NAME"
        trackBy="DEPT_CODE"
        @optionChanged="deptChanged"
      ></select-dropdown-v2>
      <div style="float:right;">
        <a href="javascript:;"
          class="btn"
          @click="importData">导入数据</a>
      </div>
    </div>
    <br />
    <table class="index-info__table">
      <thead class="index-info__table-header">
        <tr>
          <th>一级指标</th>
          <th>二级指标</th>
          <th>三级指标</th>
          <th>指标释义与评分标准</th>
          <th style="text-align:center">标准分值</th>
        </tr>
      </thead>
      <tbody v-if="deptOptions.DEPT_CODE==2"
        class="index-info__table-body">
        <tr v-for="(item, index) in roleList"
          :key="index"
          class="index-info__table-body-review">
          <td :title="item.INDEX_ONE_LEVEL">{{ item.INDEX_ONE_LEVEL }}</td>
          <td :title="item.INDEX_TWO_LEVEL">{{ item.INDEX_TWO_LEVEL }}</td>
          <td :title="item.INDEX_THREE_LEVEL">{{ item.INDEX_THREE_LEVEL }}</td>
          <td :title="item.INDEX_DESC">{{ item.INDEX_DESC }}</td>
          <td :title="item.STANDARD_SCORE">{{ item.STANDARD_SCORE }}</td>
        </tr>
      </tbody>
      <tbody v-else
        class="index-info__table-body">
        <tr v-for="(item, index) in roleList"
          :key="index"
          class="index-info__table-body-review">
          <td :title="item.INDEX_ONE_LEVEL">{{ item.INDEX_ONE_LEVEL }}</td>
          <td :title="item.INDEX_TWO_LEVEL">{{ item.INDEX_TWO_LEVEL }}</td>
          <td :title="item.INDEX_THREE_LEVEL">{{ item.INDEX_THREE_LEVEL }}</td>
          <td :title="item.INDEX_DESC">{{ item.INDEX_DESC }}</td>
          <td :title="item.STANDARD_SCORE">{{ item.STANDARD_SCORE }}</td>
        </tr>
      </tbody>
    </table>
    <br/>
    <div v-if="is_upload"
      class="dialog__footer">
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
    name: "index-info",

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
        // 选中的当前科室
        selectedDeptObj: {
          DEPT_CODE: 2,
          DEPT_NAME: "脓毒症专病"
        },
        deptOptions: [
          {
            DEPT_NAME: "脓毒症专病",
            DEPT_CODE: 2
          },
          {
            DEPT_NAME: "ICU专科",
            DEPT_CODE: 3
          },
          {}
        ],
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
          "?typeId=2&tempId=INDEX_DATA_TEMP";
        window.open(apiUrl);
        // this.$showLoading();
        // Axios.get(resolveApiRoute("index-template-download"),{
        //   params: {
        //     typeId: 2
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
            typeId: this.selectedDeptObj.DEPT_CODE,
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
        let name = this.selectedDeptObj.DEPT_CODE;
        Axios.get(resolveApiRoute("index-info-list")).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code === 0) {
              this.roleList = res.data.Data.Data.filter((item) => {
                if (item.INDEX_PURPOSE === 2 || item.INDEX_PURPOSE === 3) {
                  return item.INDEX_PURPOSE === name;
                }
              });
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
      // 取消
      cancelInfo() {
        this.fetchData();
        this.is_upload = false;
      },
      // 提交
      submitInfo() {
        this.$showLoading();
        Axios.post(resolveApiRoute("index-submit-data"), {
          TypeId: this.selectedDeptObj.DEPT_CODE,
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

  .index-info {
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
          @include table-sizes(100, 100, 100, 200, 80);

          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示

          &:nth-child(1) {
            padding-left: sz(10);
          }

          &:nth-child(5) {
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
