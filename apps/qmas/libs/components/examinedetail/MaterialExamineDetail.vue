<template>
  <div>
    <div class="material-examine-detail"
      style="height:200px">
      <h2 style="margin-left:5px">
        申请人：
        <span>{{ AcOrgName }}</span>
      </h2>
      <div class="top-left">
        <p>
          认证类型：
          <span>{{ AcType }}</span>
        </p>
        <p>
          申请级别：
          <span>{{ AcLevel }}</span>
        </p>
        <p>
          申请日期：
          <span>{{ (ApplyTime||'').split(' ')[0] }}</span>
        </p>
      </div>
      <div v-if="Edittype!=1"
        class="top-right">
        <a
          href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn-ok"
          @click="auditBtnClicked"
        >打回</a>
      </div>
    </div>

    <div class="material-examine-detail">
      <h3 style="margin-left:5px">基本要求材料</h3>

      <template v-if="jbyqcl">
        <template v-if="jbyqcl.length > 0">
          <table class="material-examine-detail__table">
            <thead class="material-examine-detail__table-header">
              <tr>
                <th>项目</th>
                <th>项目描述</th>
                <th>证明文件要求</th>
                <th>证明文件</th>
              </tr>
            </thead>
          </table>

          <div class="material-examine-detail__tablectn">
            <table class="material-examine-detail__table">
              <tbody class="material-examine-detail__table-body">
                <tr
                  v-for="(item, index) in jbyqcl"
                  :key="index"
                  class="material-examine-detail__table-body-review"
                >
                  <td :title="item.ITEM_NAME">{{ item.ITEM_NAME }}</td>
                  <td :title="item.ITEM_DESC">{{ item.ITEM_DESC }}</td>
                  <td :title="item.FILE_REQUIRE">{{ item.FILE_REQUIRE }}</td>
                  <td>
                    <p>
                      <a href="javascript:;"
                        style="color:#3789be"
                        @click="fileLook(item)">查看</a>
                    </p>
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
    <div class="material-examine-detail">
      <h3 style="margin-left:5px">专科建设材料评分</h3>

      <template v-if="zkjscl">
        <template v-if="zkjscl.length > 0">
          <table class="material-examine-detail__table">
            <thead class="material-examine-detail__table-header">
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

          <div class="material-examine-detail__tablectn">
            <table class="material-examine-detail__table">
              <tbody class="material-examine-detail__table-body">
                <tr
                  v-for="(item, index) in zkjscl"
                  :key="index"
                  class="material-examine-detail__table-body-review"
                >
                  <td :title="item.INDEX_ONE_LEVEL">
                    {{ item.INDEX_ONE_LEVEL }}</td>
                  <td :title="item.INDEX_TWO_LEVEL">
                    {{ item.INDEX_TWO_LEVEL }}</td>
                  <td :title="item.INDEX_THREE_LEVEL">
                    {{ item.INDEX_THREE_LEVEL }}</td>
                  <td :title="item.INDEX_VALUE">
                    {{ item.INDEX_VALUE }}</td>
                  <td>
                    <a
                      v-if="item.IS_NEED_PROVE==1"
                      href="javascript:;"
                      style="color:#3789be"
                      @click="indexfileLook(item)"
                    >查看</a>
                  </td>
                  <td :title="item.INDEX_DESC">

                    {{ item.INDEX_DESC }}</td>
                  <td :title="item.STANDARD_SCORE">
                    {{ item.STANDARD_SCORE }}</td>
                  <td v-if="Edittype==1"
                    :title="item.GRADE_RESULT">
                    {{ item.GRADE_RESULT }}</td>
                  <td v-else>
                    <input
                      v-model="item.GRADE_RESULT"
                      class="material-examine-detail
                      __body-userloginname-editinput"
                      type="number"
                      placeholder="请填写得分"
                      style="width:100px"
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
    <div class="material-examine-detail">
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
              <div v-if="this.Edittype==1||this.isComputer==1"
                style="width:100px;float:left;">
                <span
                  v-if="this.pfjg==1||this.pfjg==2||this.pfjg==3"
                  class="through-msg">通过
                </span>
                <span v-else-if="this.pfjg==0||this.pfjg==4"
                  class="nothrough-msg">
                  不通过
                </span>
              </div>
              <div v-if="Edittype!=1"
                style="float:left;margin-top:10px;width:100px">
                <a
                  href="javascript:;"
                  class="btn btn--white material-examine__addbtnbox-addbtn"
                  @click="CakcScore"
                >计算得分</a>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row
          v-if="this.pfjg!=1&&this.pfjg!=2&&this.pfjg!=3&&this.pfjg!=null"
          style="height:100px"
        >
          <el-col :span="3"
            style="text-align: right;">
            <div class="grid-content">不通过原因:</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content">
              <span v-if="Edittype!=1">
                <textarea
                  v-model="noPassReason"
                  style="height:80px;width:400px;"
                  class="material-examine-detail__body-userloginname-editinput"
                  @input="descInput"
                ></textarea>
                &nbsp;&nbsp;
                <span class="text">限制{{ remnant }}/200字以内</span>
              </span>
              <span v-else>{{ noPassReason }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="height:100px">
          <el-col :span="3"
            style="text-align: right;">
            <div class="grid-content">备注：</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content">
              <span v-if="Edittype!=1">
                <textarea
                  v-model="remak"
                  style="height:80px;width:400px;"
                  class="material-examine-detail__body-userloginname-editinput"
                ></textarea>
              </span>
              <span v-else>{{ remak }}</span>
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
                class="btn material-examine__addbtnbox-addbtn"
                @click="saveItem"
              >提交</a>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <examine-dialog
      :display="displayExpertDialog"
      :dialogHeaderCloseBtn="true"
      :userData="userData"
      @closeDialog="displayExpertDialog=false"
      @dialogOkClicked="dialogOkClicked"
    ></examine-dialog>
    <file-manage-dialog
      :display="showFileControlDialog"
      :editBaseData="fileData"
      :uiType="view"
      @closeDialog="showFileControlDialog=false"
    ></file-manage-dialog>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import QaNoContent from "__libs/components/QaNoContent";
  import ExamineDialog from "./ExamineDialog";
  import FileManageDialog from "__libs/components/dialog/FileManageDialog";
  export default {
    name: "material-examine-detail",

    components: {
      QaNoContent,
      ExamineDialog,
      FileManageDialog
    },

    data() {
      return {
        view: "view",
        fileData: [],
        remnant: 200,
        Edittype: null,
        AcOrgName: "",
        AcType: "",
        AcLevel: "",
        ApplyTime: "",
        // 其他阶段审核结果
        jbyqcl: null,
        // 我的审核
        zkjscl: null,
        clpf: null,
        pfjg: null,
        isComputer: null,
        noPassReason: null,
        remak: null,
        showFileControlDialog: false,
        displayExpertDialog: false,
        // 专家数据
        userData: null,
        acApplyId: "",
        state_Id: null,
        pjapplyId: null,
        selectItem: null
      };
    },

    watch: {},

    mounted() {
      this.initData(this.$route.query.editdata);
      this.Edittype = this.$route.query.Edittype;
    },

    methods: {
      // 倒计数
      descInput() {
        if (this.remnant >= 0) {
          var txtVal = this.noPassReason.length;
          this.remnant = 200 - txtVal;

          if (this.remnant < 0) {
            this.noPassReason = this.noPassReason.substr(0, 200);
            this.remnant = 0;
          }
        } else {
          this.noPassReason = this.noPassReason.substr(0, 200);
          this.remnant = 200 - this.noPassReason.length;
          this.$showNotice("字数超过限制", "failed");
        }
      },
      handleInput2(item) {
        if (/^\d+(\.([\d]{0,3}))?$/.test(item.GRADE_RESULT)) {
          if (
            item.GRADE_RESULT > item.STANDARD_SCORE &&
            item.STANDARD_SCORE > 0
          ) {
            this.$showNotice("得分应大于等于0且小于等于标准分值", "failed");
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
            "输入框仅支持输入正数,且小数位数不得大于3位",
            "failed"
          );
          item.GRADE_RESULT = 0;
        }
      },
      fileLook(item) {
        Axios.get(resolveApiRoute("file-list"), {
          params: {
            relID: item.ID,
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
      indexfileLook(item) {
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
      // 专家审核
      auditBtnClicked() {
        this.userData = {
          expertAuditId: this.state_Id,
          acApplyId: this.acApplyId,
          acResult: "",
          remark: "",
          title: "打回材料"
        };
        this.displayExpertDialog = true;
      },
      // 文件浏览

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
        Axios.get(resolveApiRoute("material-scoring-list"), {
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
              this.jbyqcl = res.data.Data.SepsisData;
              this.zkjscl = res.data.Data.IcuData;

              if (this.Edittype == 1) {
                this.clpf = res.data.Data.clpf == null ? 0 : res.data.Data.clpf;
                this.remak = res.data.Data.remak;
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
          if (els[i].value == "" && els[i].placeholder == "请填写得分") {
            this.$showNotice(els[i].alt + "得分不能为空", "failed");

            return false;
          } else if (els[i].value < 0) {
            this.$showNotice(els[i].alt + "得分不能为负数", "failed");

            return false;
          }
        }
        Axios.post(
          resolveApiRoute("material-scoring-result"),
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
        if (this.clpf != null) {
          Axios.post(
            resolveApiRoute("material-scoring-save"),
            this.getDataList()
          ).then(
            (res) => {
              this.$hideLoading();
              this.isShowLoading = false;

              if (res.data.Code === 0) {
                this.$showNotice("提交成功", "successful");
                this.$router.push({
                  path: "/materialexamineinfo"
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
        } else {
          this.$showNotice("计算评分后才能进行提交", "failed");
        }
      },
      getDataList() {
        let combined = {
          IcuData: this.zkjscl,
          StateId: this.state_Id,
          // 可选 0正序，1倒序 默认为1倒序排序类型
          TotalGrade: this.clpf,
          // 评分等级
          auditLevel: this.pfjg,
          // 每页条数
          FeedbackMsg: this.noPassReason,
          Remark: this.remak
        };

        return combined;
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";
  @import "~__libs/scss/element";
  .top-left {
    width: 400px;
    height: 120px;
    float: left;
    margin: 0 0 0 10px;
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

  .material-examine-detail {
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
