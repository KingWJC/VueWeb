<template>
  <div>
    <div class="scene-examine-detail"
      style="300px">
      <h2 style="margin-left:5px">
        申请人：
        <span>{{ AcOrgName }}</span>
      </h2>
      <div class="top-div">
        <el-row>
          <el-col :span="3">
            <div class="grid-content-new">认证类型：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content-new">
              <span>{{ AcType }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content-new">申请级别：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content-new">
              <span>{{ AcLevel }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row type="flex">
          <el-col :span="3"
            justify="center">
            <div class="grid-content-new">现场审核日期：</div>
          </el-col>
          <el-col :span="21">
            <div v-if="Edittype!=1"
              class="grid-content-new">
              <el-date-picker
                v-model="ApplyTime"
                :pickerOptions="pickerOptions1"
                type="date"
                size="mini"
                valueFormat="yyyy-MM-dd"
                placeholder="选择日期"
                @change="SaveAuditTime()"
              ></el-date-picker>
            </div>
            <div v-else
              class="grid-content-new">{{ ApplyTime }}</div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="3">
            <div class="grid-content-new">现场工作人员：</div>
          </el-col>
          <el-col :span="21">
            <div v-if="Edittype!=1"
              class="grid-content-new">
              <template>
                <el-select
                  v-model="workers"
                  style="width:1000px"
                  size="mini"
                  multiple
                  filterable
                  allowCreate
                  defaultFirstOption
                  placeholder="请选择工作人员"
                  @change="SavePersons(1)"
                >
                  <el-option
                    v-for="item in workerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </div>
            <div v-else
              class="grid-content-new">
              <template>
                <el-select
                  v-model="workers"
                  style="width:1000px"
                  size="mini"
                  multiple
                  filterable
                  allowCreate
                  disabled="false"
                  defaultFirstOption
                  placeholder="请选择工作人员"
                  @change="SavePersons(1)"
                >
                  <el-option
                    v-for="item in workerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="3">
            <div class="grid-content-new">现场专家：</div>
          </el-col>
          <el-col :span="21">
            <div v-if="Edittype!=1"
              class="grid-content-new">
              <template>
                <el-select
                  v-model="auditers"
                  style="width:1000px"
                  size="mini"
                  multiple
                  filterable
                  allowCreate
                  defaultFirstOption
                  placeholder="请选择专家"
                  @change="SavePersons(2)"
                >
                  <el-option
                    v-for="item in auditOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </div>
            <div v-else
              class="grid-content-new">
              <template>
                <el-select
                  v-model="auditers"
                  style="width:1000px"
                  size="mini"
                  multiple
                  filterable
                  allowCreate
                  disabled="false"
                  defaultFirstOption
                  placeholder="请选择专家"
                  @change="SavePersons(2)"
                >
                  <el-option
                    v-for="item in auditOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="scene-examine-detail">
      <h3 style="margin-left:5px">现场评审结果</h3>

      <template v-if="zkjscl">
        <template v-if="zkjscl.length > 0">
          <table class="scene-examine-detail__table">
            <thead class="scene-examine-detail__table-header">
              <tr>
                <th>一级指标</th>
                <th>二级指标</th>
                <th>三级指标</th>
                <th>指标结果</th>
                <th>证明文件</th>
                <th>指标释义与评分标准</th>
                <th>标准分值</th>
                <th>得分</th>
              </tr>
            </thead>
          </table>

          <div class="scene-examine-detail__tablectn">
            <table class="scene-examine-detail__table">
              <tbody class="scene-examine-detail__table-body">
                <tr
                  v-for="(item, index) in zkjscl"
                  :key="index"
                  class="scene-examine-detail__table-body-review"
                >
                  <td :title="item.INDEX_ONE_LEVEL">
                    {{ item.INDEX_ONE_LEVEL }}</td>
                  <td :title="item.INDEX_TWO_LEVEL">
                    {{ item.INDEX_TWO_LEVEL }}</td>
                  <td :title="item.INDEX_THREE_LEVEL">
                    {{ item.INDEX_THREE_LEVEL }}</td>
                  <td v-if="Edittype==1">{{ item.INDEX_VALUE }}</td>
                  <td v-else>
                    <input
                      v-model="item.INDEX_VALUE"
                      class="scene-examine-detail__body-userloginname-editinput"
                      type="text"
                      placeholder="请填写指标结果"
                      @blur="handleInput3(item)"
                    />
                  </td>
                  <td>
                    <p v-if="item.IS_NEED_PROVE===1">
                      <span v-if="Edittype==1">
                        <a href="javascript:;"
                          style="color:#3789be"
                          @click="fileLook(item)">查看文件</a>
                      </span>
                      <span v-else>
                        <a href="javascript:;"
                          style="color:#3789be"
                          @click="fileLook(item)">上传文件</a>
                      </span>
                    </p>
                  </td>
                  <td :title="item.INDEX_DESC">{{ item.INDEX_DESC }}</td>
                  <td>{{ item.STANDARD_SCORE }}</td>
                  <td v-if="Edittype==1">{{ item.GRADE_RESULT }}</td>
                  <td v-else
                    :title="item.GRADE_RESULT">
                    <input
                      v-model="item.GRADE_RESULT"
                      class="scene-examine-detail__body-userloginname-editinput"
                      type="number"
                      placeholder="请填写得分"
                      @blur="handleInput2(item)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </template>
      <template v-else>
        <qa-no-content title="暂无数据"></qa-no-content>
      </template>
    </div>
    <div class="scene-examine-detail">
      <h3 style="margin-left:5px">评分结果</h3>
      <div class="result-div">
        <el-row>
          <el-col :span="3"
            style="text-align: right;">
            <div class="grid-content">
              <div v-if="this.Edittype==1||this.isComputer==1">
                <span
                  v-if="this.pfjg==1||this.pfjg==2||this.pfjg==3">
                  <span class="through-score">{{ this.clpf }}</span>&nbsp;分
                </span>
                <span v-else>
                  <span class="nothrough-score">{{ this.clpf }}</span>
                  &nbsp;分
                </span>
              </div>
              <div v-else
                style="margin-top:15px;color:#F5222D">
                未计算&nbsp;&nbsp;</div>
            </div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content">
              <!-- <div v-if="this.Edittype==1||this.isComputer==1"
                style="width:100px;float:left;">
                <span
                  v-if="this.pfjg==1||this.pfjg==2||this.pfjg==3"
                  class="through-msg">通过
                </span>
                <span v-else
                  class="nothrough-msg">
                  不通过
                </span>
              </div> -->
              <div v-if="Edittype!=1"
                style="float:left;margin-top:10px;width:100px">
                <a
                  href="javascript:;"
                  class="btn btn--white"
                  @click="CakcScore"
                >计算得分</a>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row style="height:100px">
          <el-col :span="3"
            style="text-align: right;">
            <div class="grid-content">备注:</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content">
              <span v-if="Edittype!=1">
                <textarea
                  v-model="remark"
                  style="height:80px;width:400px;"
                  class="scene-examine-detail__body-userloginname-editinput"
                  @input="descInput"
                ></textarea>
                &nbsp;&nbsp;
                <span class="text">限制{{ remnant }}/200字以内</span>
              </span>
              <span v-else>{{ remark }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="grid-content"
              style="text-align: center;margin-top:10px">
              <a
                v-if="Edittype!=1"
                href="javascript:;"
                class="btn scene-examine__addbtnbox-addbtn"
                @click="saveItem"
              >提交</a>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <global-uploader ref="upload"
      :attrdata="attrdata"
      @fileSuccess="fileSuccess"></global-uploader>
    <file-manage-dialog
      :display="showFileControlDialog"
      :editBaseData="fileData"
      :uiType="view"
      @uploadFile="okBtnClick"
      @deleteFile="deleteFile"
      @closeDialog="showFileControlDialog=false"
    ></file-manage-dialog>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import QaNoContent from "__libs/components/QaNoContent";
  // import Calendar
  // from "__shared-libs/components/datepicker/calendar/Calendar";
  import FileManageDialog from "__libs/components/dialog/FileManageDialog";
  import GlobalUploader from "__libs/components/GlobalUploader";

  export default {
    name: "scene-examine-detail",

    components: {
      QaNoContent,
      FileManageDialog,
      GlobalUploader
    },
    props: {},
    data() {
      return {
        view: "view",
        fileData: [],
        remnant: 200,
        workerOptions: [],
        auditOptions: [],
        workers: [],
        auditers: [],
        Edittype: null,
        userAccessData: null,
        AcOrgName: "",
        AcType: "",
        AcLevel: "",
        ApplyTime: "",
        zkjscl: null,
        clpf: null,
        isComputer: null,
        bzfz: null,
        pfjg: null,
        noPassReason: null,
        remark: null,
        showFileControlDialog: false,
        displayExpertDialog: false,
        acApplyId: "",
        state_Id: null,
        pjapplyId: null,
        attrdata: [".png", ".jpg", ".jpeg", ".bmp", ".pdf"],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      };
    },
    computed: {},

    watch: {},
    mounted() {
      this.initData(this.$route.query.editdata);
      this.Edittype = this.$route.query.Edittype;

      if (this.Edittype !== 1) {
        this.view = "upload";
      }
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
      okBtnClick() {
        this.$refs.upload.openUploader({
          fileID: "",
          stateID: this.state_Id,
          typeID: 1,
          relID: this.selectItem.INDEX_ID,
          targetFolder: "sceneexamine"
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
      fileLook(item) {
        this.selectItem = item;
        Axios.get(resolveApiRoute("file-list"), {
          params: {
            relID: item.INDEX_ID,
            type: 1,
            stateID: this.state_Id
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
      // 倒计数
      descInput() {
        if (this.remnant >= 0) {
          var txtVal = this.remark.length;
          this.remnant = 200 - txtVal;

          if (this.remnant < 0) {
            this.remark = this.remark.substr(0, 200);
            this.remnant = 0;
          }
        } else {
          this.remark = this.remark.substr(0, 200);
          this.remnant = 200 - this.remark.length;
          this.$showNotice("字数超过限制", "failed");
        }
      },
      // 选择工作人员
      SavePersons(typeid) {
        let personIds = typeid == 1 ? this.workers : this.auditers;

        if (personIds.length <= 0) {
          return;
        }
        Axios.post(resolveApiRoute("scene-person-allotment"), {
          StateId: this.state_Id,
          PersonType: typeid,
          PersonId: personIds
        }).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code === 0) {
              this.userAccessData = {
                depts: res.data.Data,
                title: "分配工作人员"
              };
              this.displayExpertDialog = true;
            } else if (res.data.Code === 1) {
              this.$showNotice(res.data.Msg);
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
            this.$hideLoading();
          }
        );
      },

      SaveAuditTime() {
        Axios.get(resolveApiRoute("scene-person-allotment"), {
          params: {
            stateId: this.state_Id,
            reviewTime: this.ApplyTime == null ? "" : this.ApplyTime
          }
        }).then(
          (res) => {
            if (res.data.Code === 0) {
              this.$hideLoading();
            } else if (res.data.Code === 1) {
              this.$showNotice(res.data.Msg);
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
            this.$hideLoading();
          }
        );
      },

      handleInput2(item) {
        if (/^\d+(\.([\d]{0,3}))?$/.test(item.GRADE_RESULT)) {
          if (
            item.GRADE_RESULT > item.STANDARD_SCORE &&
            item.STANDARD_SCORE > 0
          ) {
            this.$showNotice("得分应大于等于0且小于等于标准分值");
            item.GRADE_RESULT = 0;
          } else {
            if (/^\d+$/.test(item.GRADE_RESULT)) {
              item.GRADE_RESULT = item.GRADE_RESULT.replace(/\b(0+)/gi, "");

              if (item.GRADE_RESULT.length == 0) {
                item.GRADE_RESULT = 0;
              }
            }
          }
        } else {
          this.$showNotice(
            "输入框仅支持输入正数，且小数位数不得大于3位",
            "failed"
          );
          item.GRADE_RESULT = 0;
        }
      },
      handleInput3(item) {
        if (!/^\d+(\.([\d]{0,3}))?%?$/.test(item.INDEX_VALUE)) {
          if (item.INDEX_VALUE && item.INDEX_VALUE.length > 0) {
            this.$showNotice(
              "指标结果仅支持输入数字和百分号，且小数点后不得超过3位小数",
              "failed"
            );
            item.INDEX_VALUE = 0;
          }
        }
      },
      // 刷新数据
      dialogOkClicked(obj) {
        this.initData(obj);
      },

      initData(obj) {
        this.$showLoading();
        this.isShowLoading = true;

        this.acApplyId = obj.AC_APPLY_ID;
        this.state_Id = obj.STATE_ID;
        this.pjapplyId = obj.AC_APPLY_ID;
        Axios.get(resolveApiRoute("scene-scoring-list"), {
          params: {
            stateId: obj.STATE_ID,
            applyId: obj.AC_APPLY_ID
          }
        }).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              let info = res.data.Data.acInfo;
              this.AcOrgName = info.AcOrgName;
              this.AcType = info.AcType;
              this.AcLevel = info.AcLevel;
              this.ApplyTime = info.ApplyTime;
              this.zkjscl = res.data.Data.IcuData;
              this.workerOptions = info.AllWorker;
              this.auditOptions = info.AllAuditer;
              this.workers = info.Worker;
              this.auditers = info.Auditer;

              if (this.Edittype == 1) {
                this.clpf = res.data.Data.clpf;
                this.remark = res.data.Data.remak;
                this.noPassReason = res.data.Data.noPassReason;
                this.pfjg = res.data.Data.pfjg;
              }
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.isShowLoading = false;
            this.$showNotice("网络异常", "failed");
          }
        );
      },
      CakcScore() {
        let els = document.getElementsByTagName("input");

        for (let i = 0; i < els.length; i++) {
          if (
            els[i].value == "" &&
            els[i].placeholder == "请填写得分" &&
            els[i].type == "number"
          ) {
            this.$showNotice(els[i].alt + "得分不能为空", "failed");

            return false;
          }
        }
        Axios.post(
          resolveApiRoute("scene-scoring-result"),
          this.getDataList()
        ).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0) {
              this.clpf = res.data.Data.TotalGrade;
              this.pfjg = res.data.Data.auditLevel;
              this.isComputer = 1;
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.isShowLoading = false;
            this.$showNotice("网络异常", "failed");
          }
        );
      },
      saveItem() {
        let els = document.getElementsByTagName("input");

        if (this.ApplyTime == null) {
          this.$showNotice("现场审核时间为空", "failed");
        } else if (this.workers === null || this.workers.length <= 0) {
          this.$showNotice("现场工作人员为空", "failed");
        } else if (this.auditers === null || this.auditers.length <= 0) {
          this.$showNotice("现场专家为空", "failed");
        } else if (els.length > 0) {
          let isfalse = true;

          for (let i = 0; i < els.length; i++) {
            if (els[i].value == "" && els[i].placeholder == "请填写得分") {
              this.$showNotice(els[i].alt + "得分不能为空", "failed");
              isfalse = false;
            } else if (els[i].value < 0) {
              this.$showNotice(els[i].alt + "得分不能为负数", "failed");
              isfalse = false;
            }

            if (els[i].value == "" && els[i].placeholder == "请填写指标结果") {
              this.$showNotice(els[i].alt + "指标结果不能为空", "failed");
              isfalse = false;
            }
          }

          if (this.clpf != null && isfalse == true) {
            Axios.post(
              resolveApiRoute("scene-scoring-save"),
              this.getDataList()
            ).then(
              (res) => {
                this.$hideLoading();
                this.isShowLoading = false;

                if (res.data.Code === 0) {
                  this.$showNotice("提交成功", "successful");
                  this.$router.push({
                    path: "/sceneexamineinfo"
                  });
                } else {
                  this.$showNotice("服务器异常", "failed");
                }
              },
              () => {
                this.$hideLoading();
                this.isShowLoading = false;
                this.$showNotice("网络异常", "failed");
              }
            );
          } else if (this.clpf == null) {
            this.$showNotice("计算评分后才能进行提交", "failed");
          }
        }
      },
      getDataList() {
        let combined = {
          IcuData: this.zkjscl,
          StateId: this.state_Id,
          // 可选 0正序，1倒序 默认为1倒序排序类型
          TotalGrade: this.clpf,
          // 当前页码
          auditLevel: this.pfjg,
          // 每页条数
          FeedbackMsg: this.noPassReason,
          remark: this.remark
        };

        return combined;
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";
  @import "~__libs/scss/element";

  .top-div .el-col {
    height: 40px;
    // text-align: center;
    line-height: 40px;
  }
  .top-div {
    width: 800px;
    // height: 120px;
    margin-left: 10px;
  }
  .top-right {
    width: 300px;
    height: 120px;
    float: right;
  }

  .nothrough-score {
    font-size: 30px;
    color: #f5222d;
  }

  .through-score {
    font-size: 30px;
    color: #52c41a;
  }

  .nothrough-msg {
    font-size: 20px;
    line-height: 50px;
    font-weight: bold;
    color: #f5222d;
    padding-right: 30px;
  }

  .through-msg {
    font-size: 20px;
    line-height: 50px;
    font-weight: bold;
    color: #52c41a;
    padding-right: 30px;
  }

  .result-div {
    margin: 20px 0;
  }

  .result-div .el-row {
    height: 50px;
  }

  .scene-examine-detail {
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__table {
      @include unify-table-ui();
      table-layout: fixed;
      // 占位符
      &-body {
        &-hidden {
          visibility: hidden;
          display: inline-block;
        }

        &-review {
          .customize-checkbox {
            position: relative;
            top: sz(3);
          }
        }
      }

      b,
      a {
        display: inline-block;
      }

      tr {
        th,
        td {
          @include table-sizes(100, 100, 150, 100, 80, 200, 90, 110);
          white-space: nowrap; //禁止td换行
          overflow: hidden; //隐藏X,Y滚动条
          text-overflow: ellipsis; //将显示不完的以...显示
          padding: 0;

          &:first-child {
            padding: 0 sz(8);
            // text-align: center;
            height: sz(40);
          }

          &:nth-child(7) {
            text-align: center;
          }
        }
      }
    }

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
          width: sz(270);
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
          width: sz(110);
          height: sz(30);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          // margin-left: sz(10);

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
          width: sz(110);
          height: sz(30);
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

    &__tablectn {
      height: calc(100% - 40px);
      overflow: auto;
    }

    .qa-no-content {
      border: 1px solid map-get($colors, dialog-cancel-border);
      background: map-get($colors, pure-white);
      margin-top: sz(10);
    }
  }
</style>
