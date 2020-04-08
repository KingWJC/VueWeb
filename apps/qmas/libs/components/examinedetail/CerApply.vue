<template>
  <div class="cer-apply">
    <square-tabs :activeTabName="activeTabName"
      @changeTab="changeTab">
      <!-- 基本要求 -->
      <basic-tab tabName="basicTab"
        tabLabel="基本要求">
        <div class="cer-apply__type clearfix">
          <h3>认证类型</h3>
          <select-dropdown-v2
            v-model="applyType"
            :dropDownMaxHeight="210"
            :options="selectType"
            label="DICT_VAL_NAME"
            trackBy="DICT_VAL_CODE"
          ></select-dropdown-v2>
        </div>

        <div class="cer-apply__level clearfix">
          <h3>申请级别</h3>
          <select-dropdown-v2
            v-model="applyLevel"
            :dropDownMaxHeight="210"
            :options="selectLevel"
            label="DICT_VAL_NAME"
            trackBy="DICT_VAL_CODE"
            @optionChanged="getNecData"
          ></select-dropdown-v2>
        </div>

        <div class="cer-apply__file clearfix">
          <h3>材料上传</h3>
          <table class="cer-apply__file-table">
            <thead>
              <tr>
                <th>项目</th>
                <th>项目描述</th>
                <th>证明文件要求</th>
                <th>证明文件</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>

          <div class="cer-apply__file-bodyctn">
            <table class="cer-apply__file-table">
              <tbody>
                <tr v-for="(item, index) in basicNec"
                  :key="index">
                  <td :title="item.ITEM_NAME">
                    <div>{{ item.ITEM_NAME }}</div>
                  </td>
                  <td :title="item.ITEM_DESC">{{ item.ITEM_DESC }}</td>
                  <td :title="item.FILE_REQUIRE">{{ item.FILE_REQUIRE }}</td>
                  <td>
                    <template v-if="item.FILE_STATE">已上传</template>
                    <template v-else>未上传</template>
                  </td>
                  <td>
                    <a href="javascript:;"
                      @click="fileUpload(item)">文件上传</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="cer-apply__template clearfix">
          <h3>模板下载</h3>
          <div class="cer-apply__index-bodyctn">
            <table class="cer-apply__temp-table">
              <thead>
                <tr>
                  <th>文件名称</th>
                  <th>操作</th>
                </tr>
              </thead>
            </table>

            <div>
              <table class="cer-apply__temp-table">
                <tbody>
                  <tr v-for="(item, index) in basicTemp"
                    :key="index">
                    <td :title="item.FILE_NAME">{{ item.FILE_NAME }}</td>
                    <td>
                      <a href="javascript:;"
                        @click="download(item)">下载</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- <a
            href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
            @click="download"
          >模板打包下载</a>-->
        </div>
      </basic-tab>
      <!-- 专科建设要求 -->
      <basic-tab tabName="perofessionTab"
        tabLabel="专科建设要求">
        <div class="cer-apply__index clearfix">
          <h3>材料上传</h3>
          <table class="cer-apply__index-table">
            <thead>
              <tr>
                <th>一级指标</th>
                <th>二级指标</th>
                <th>三级指标</th>
                <th>证明文件要求</th>
                <th>指标结果</th>
                <th>证明文件</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>

          <div class="cer-apply__index-bodyctn">
            <table class="cer-apply__index-table">
              <tbody>
                <tr v-for="(item, index) in professionNec"
                  :key="index">
                  <td :title="item.INDEX_ONE_LEVEL">
                    {{ item.INDEX_ONE_LEVEL }}</td>
                  <td :title="item.INDEX_TWO_LEVEL">
                    {{ item.INDEX_TWO_LEVEL }}</td>
                  <td :title="item.INDEX_THREE_LEVEL">
                    {{ item.INDEX_THREE_LEVEL }}</td>
                  <td :title="item.PROVE_FILE_REQ">
                    {{ item.PROVE_FILE_REQ }}</td>
                  <td>
                    <input
                      v-model="item.INDEX_VALUE"
                      maxlength="20"
                      class="cer-apply__input-editinput"
                      type="text"
                      placeholder="请填写指标结果"
                    />
                  </td>
                  <td>
                    <template v-if="item.IS_NEED_PROVE==2">不需要</template>
                    <template v-else-if="item.FILE_STATE">已上传</template>
                    <template v-else>未上传</template>
                  </td>
                  <td>
                    <template v-if="item.IS_NEED_PROVE!==2">
                      <a href="javascript:;"
                        @click="fileUpload(item)">文件上传</a>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="cer-apply__index-bodyctn">
          <h3>模板下载</h3>
          <div class="file-manage-dialog__contents-item">
            <table class="cer-apply__temp-table">
              <thead>
                <tr>
                  <th>文件名称</th>
                  <th>操作</th>
                </tr>
              </thead>
            </table>

            <div>
              <table class="cer-apply__temp-table">
                <tbody>
                  <tr v-for="(item, index) in proTemp"
                    :key="index">
                    <td :title="item.FILE_NAME">
                      <p>{{ item.FILE_NAME }}</p>
                    </td>
                    <td>
                      <a href="javascript:;"
                        @click="download(item)">下载</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- <a
            href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
            @click="download"
          >模板打包下载</a>-->
        </div>
      </basic-tab>
    </square-tabs>
    <div class="dialog__footer"
      style="background-color:#f1f1f1;padding-top:15px;">
      <a
        href="javascript:;"
        class="btn dialog__footer-btn dialog__footer-btn-ok"
        @click="clickFlag && submit()"
      >{{ submitText }}</a>
    </div>
    <global-uploader ref="upload"
      :attrdata="attrdata"
      @fileSuccess="fileSuccess"></global-uploader>
    <file-manage-dialog
      :display="showFileControlDialog"
      :editBaseData="fileData"
      @uploadFile="okBtnClick"
      @deleteFile="deleteFile"
      @closeDialog="closeDialog"
    ></file-manage-dialog>
    <!--确定离开吗？ -->
    <confirm-dialog
      :display="displayLeaveDialog"
      :dialogBody="axiosLeaveStatusText"
      dialogHeaderTitle="离开"
      @okClicked="leavePage"
      @closeDialog="displayLeaveDialog=false"
    ></confirm-dialog>
  </div>
</template>

<script>
  import GlobalUploader from "__libs/components/GlobalUploader";
  import SquareTabs from "__shared-libs/components/tabs/square-tabs/Tabs";
  import BasicTab from "__shared-libs/components/tabs/basic-tabs/Tab";
  import FileManageDialog from "__libs/components/dialog/FileManageDialog";
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import $ from "jquery";

  export default {
    name: "cer-apply",
    components: {
      GlobalUploader,
      SquareTabs,
      FileManageDialog,
      BasicTab
    },
    data() {
      return {
        submitText: "提交",
        clickFlag: true,
        selectLevel: [],
        selectType: [],
        basicNec: {},
        professionNec: {},
        applyID: "",
        stateID: "",
        activeTabName: "basicTab",
        applyLevel: null,
        applyType: null,
        showFileControlDialog: false,
        fileData: [],
        selectItem: {},
        basicData: [],
        basicTemp: [],
        proTemp: [],
        attrdata: [".png", ".jpg", ".jpeg", ".bmp", ".pdf"],

        isHeigher: false,
        reapply: false,
        levelPara: null,
        typePara: null,

        displayLeaveDialog: false,
        leaveFlag: false,
        axiosLeaveStatusText: "申请未提交，是否离开？"
      };
    },
    // created(){
    //   window.addEventListener("beforeunload", this.leavePage);
    // },
    mounted() {
      if (this.$route.query.applyID !== undefined) {
        this.applyID = this.$route.query.applyID;
      }

      if (this.$route.query.stateID !== undefined) {
        this.stateID = this.$route.query.stateID;
      }

      this.levelPara = this.$route.query.applyLevel;

      if (this.$route.query.reapply !== undefined) {
        this.reapply = this.$route.query.reapply;
      }

      if (this.$route.query.isHeigher !== undefined) {
        this.isHeigher = this.$route.query.isHeigher;
      }

      if (this.$route.query.applyType !== undefined) {
        this.typePara = this.$route.query.applyType;
      }
      this.fetchdata();
      this.getTemp("11213");
      this.getTemp("11214");

      window.addEventListener("beforeunload", this.leavePage);
    },

    beforeRouteLeave(to, from, next) {
      // next方法传true或者不传为默认历史返回，传false为不执行历史回退
      if (this.leaveFlag || !this.clickFlag) {
        next(true);
      } else {
        next(false);
      }
      this.displayLeaveDialog = true;
    },
    destroyed() {
      window.removeEventListener("beforeunload", this.leavePage);
    },
    methods: {
      leavePage() {
        if (this.clickFlag) {
          Axios.delete(resolveApiRoute("cer-delete"), {
            params: {
              APPLY_ID: this.applyID,
              STATE_ID: this.stateID
            }
          }).then((res) => {
            if (res.data.Code === 0) {
              this.applyID = "";
              this.stateID = "";
              this.leaveFlag = true;
              this.$router.go(-1);
            }
          });
        }
      },
      getNecData() {
        if (this.applyLevel) {
          this.basicNec = this.basicData.filter((item) => {
            return item.ITEM_LEVEL <= this.applyLevel.DICT_VAL_CODE;
          });
        }
      },
      okBtnClick() {
        this.$refs.upload.openUploader({
          fileID: "",
          stateID: this.stateID,
          typeID: 1,
          relID: this.selectItem.ID,
          targetFolder: "certificate"
        });
      },
      fileSuccess(res) {
        let freshFile = {
          ID: res.id,
          FILE_NAME: res.name,
          FILE_PATH: res.filePath
        };
        let newfileData = this.fileData.slice(0);
        newfileData.push(freshFile);
        this.fileData = newfileData;
        this.selectItem.FILE_STATE = 1;
      },
      changeTab(tabName) {
        this.activeTabName = tabName;
      },
      fetchdata() {
        this.$showLoading();
        Axios.get(resolveApiRoute("cer-apply"), {
          params: {
            APPLY_ID: this.applyID,
            STATE_ID: this.stateID
          }
        }).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code == 0) {
              this.basicData = res.data.Data.Basic_NEC;
              this.professionNec = res.data.Data.Profession_NEC;
              this.stateID = res.data.Data.State_ID;
              this.applyID = res.data.Data.Apply_ID;

              if (this.typePara != null) {
                this.selectLevel = res.data.Data.Apply_Level.filter((item) => {
                  return item.DICT_VAL_NAME === this.levelPara;
                });

                this.selectType = res.data.Data.Apply_Type.filter((item) => {
                  return item.DICT_VAL_NAME === this.typePara;
                });
              } else if (this.reapply) {
                this.selectLevel = res.data.Data.Apply_Level.filter((item) => {
                  return item.DICT_VAL_NAME === this.levelPara;
                });
                this.selectType = res.data.Data.Apply_Type.filter((item) => {
                  return item.DICT_VAL_CODE === "2";
                });
              } else {
                if (this.isHeigher) {
                  if (this.levelPara === "中级") {
                    this.selectLevel = res.data.Data.Apply_Level.filter(
                      (item) => {
                        return item.DICT_VAL_CODE === "3";
                      }
                    );
                  } else {
                    this.selectLevel = res.data.Data.Apply_Level.filter(
                      (item) => {
                        return item.DICT_VAL_CODE !== "1";
                      }
                    );
                  }
                } else {
                  this.selectLevel = res.data.Data.Apply_Level;
                }

                this.selectType = res.data.Data.Apply_Type.filter((item) => {
                  return item.DICT_VAL_CODE === "1";
                });
              }
              this.applyLevel = this.selectLevel[0];
              this.applyType = this.selectType[0];
              this.getNecData();
            } else {
              this.$showNotice("服务器错误");
            }
          },
          () => {
            this.$hideLoading();
            this.$showNotice("网络错误");
          }
        );
      },
      submit() {
        if (
          this.basicNec.findIndex((p) => {
            return p.FILE_STATE === 0;
          }) > -1
        ) {
          this.$showNotice("基本要求中有未上传的材料！", "failed");
        } else if (
          this.professionNec.findIndex((p) => {
            return p.FILE_STATE === 0 && p.IS_NEED_PROVE === 1;
          }) > -1
        ) {
          this.$showNotice("专科建设中有未上传的材料！", "failed");
        } else if (
          this.professionNec.findIndex((p) => {
            return p.INDEX_VALUE === "";
          }) > -1
        ) {
          this.$showNotice("指标结果不可以为空！", "failed");
        } else {
          this.clickFlag = false;
          this.submitText = "提交中";
          let params = {
            // 可选 默认操作时间
            APPLY_ID: this.applyID,
            // 可选 0正序，1倒序 默认为1倒序排序类型
            STATE_ID: this.stateID,
            // 当前页码
            APPLY_LEVEL: this.applyLevel.DICT_VAL_CODE,
            // 每页条数
            APPLY_TYPE: this.applyType.DICT_VAL_CODE,
            INDEX_DATA: this.professionNec
          };
          Axios.post(resolveApiRoute("cer-submit"), params).then(
            (res) => {
              this.$hideLoading();
              this.isShowLoading = true;

              if (res.data.Code === 0) {
                this.clickFlag = false;
                this.submitText = "提交成功";
                this.$showNotice("提交成功");

                this.$router.push({
                  path: "/CerList"
                });
              } else {
                this.clickFlag = true;
                this.submitText = "提交";
                this.$showNotice("服务器异常", "failed");
              }
            },
            () => {
              this.clickFlag = true;
              this.submitText = "提交";
              this.$hideLoading();
              this.isShowLoading = false;
              this.$showNotice("网络异常", "failed");
            }
          );
        }
      },
      closeDialog() {
        let flag = false;
        $(".uploader-file-status").each(function(index, item) {
          var state = $(item).find("span")
            .first()
            .text();

          if (state == "上传中" || state == "暂停中" || state == "等待中") {
            flag = true;
          }
        });

        if (flag) {
          this.$showNotice("文件上传中请勿关闭！", "failed");
        } else {
          this.showFileControlDialog = false;
        }
      },
      download(item) {
        // let apiUrl = resolveApiRoute("file-download", {
        //   FILE_ID: "1174263734869299200"
        // });
        let apiUrl =
          resolveApiRoute("file-download") + "?FILE_ID=" + item.ID;
        window.open(apiUrl);

        // 直接使用页面会跳转。
        // window.location.href =
        //   resolveApiRoute("file-download") + "?FILE_ID=" + item.ID;

      // Axios.get(resolveApiRoute("file-download"), {
      //   params: { FILE_ID: "1174263734869299200" }
      // }).then(
      //   (res) => {
      //     resolve(res.data);
      //     // window.location.href = res.data;
      //   },
      //   () => {
      //     this.requestApi = false;
      //     this.$hideLoading();
      //     this.$showNotice("网络异常", "failed");
      //   }
      // );
      },
      getTemp(relid) {
        Axios.get(resolveApiRoute("file-list"), {
          params: {
            relID: relid,
            type: 2
          }
        }).then(
          (res) => {
            if (res.data.Code === 0) {
              if (relid === "11213") {
                this.basicTemp = res.data.Data;
              } else {
                this.proTemp = res.data.Data;
              }
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
      fileUpload(item) {
        this.selectItem = item;
        Axios.get(resolveApiRoute("file-list"), {
          params: {
            relID: item.ID,
            type: 1,
            stateID: this.stateID
          }
        }).then(
          (res) => {
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
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .cer-apply {
    background: rgba(map-get($colors, pure-white), 0.8);
    .square-tabs {
      .basic-tabs {
        &__header {
          @include border-radius(5px 5px 0 0);

          margin-top: sz(10);

          &-item {
            width: sz(155 - 40);

            &:nth-child(1),
            &:nth-child(2) {
              width: sz(155 - 40);
            }

            &--active {
              width: sz(155 - 40);
              color: map-get($colors, theme-blue);

              &:nth-child(1) {
                @include border-radius(5px 0 0 0);

                width: sz(155 - 40);
              }

              &:nth-child(2) {
                @include border-radius(0 5px 0 0);

                width: sz(155 - 40);
                border-right-color: transparent;
              }
            }
          }
        }

        &__contents {
          @include border-radius(0 0 5px 5px);

          padding: sz(10);
          height: sz(536);
          overflow: scroll;
        }
      }
    }

    &__file-table {
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
          @include table-sizes(150, 200, 200, 200, 200);
          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示
          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            text-indent: sz(20);
            width: sz(150);
          }
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5) {
            > p {
              @include word-hidden(sz(200));

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

    &__index-table {
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
          @include table-sizes(150, 170, 200, 170, 150, 150, 150);
          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示
          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            text-indent: sz(10);
            width: sz(150);
          }
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7) {
            > p {
              @include word-hidden(sz(150));

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

    &__temp-table {
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
          @include table-sizes(300, 150);
          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示
          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            text-indent: sz(10);
            width: sz(300);
            > p {
              @include word-hidden(sz(300));

              margin: 0;
            }
          }
          &:nth-child(2) {
            > p {
              @include word-hidden(sz(150));

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

    &__input {
      &-editinput,
      &-editinputuser,
      &-editinputmm {
        font-size: map-get($font-sizes, xs);
        color: map-get($colors, dialog-text-color);
        @include placeholder-color(map-get($colors, placeholder-text-color));
        @include border-radius(5px);

        float: left;
        width: sz(110);
        height: sz(30);
        border: none;
        border: 1px solid map-get($colors, dialog-input-border);
        padding-left: sz(10);

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
    }
  }
</style>
