<template>
  <div class="patient-detail clearfix">
    <!-- 左侧部分 -->
    <div class="patient-detail__left">
      <!-- 个人信息 -->
      <sub-personal-info></sub-personal-info>

      <!-- 诊疗相关信息 -->
      <sub-diagnosis-msg
        @changePatientNo="changePatientNo">
      </sub-diagnosis-msg>
    </div>

    <!-- 中间部分 -->
    <div class="patient-detail__center">
      <essential
        v-if="patientObj"
        :patientObj="patientObj"
        @changeJoinSCStatus="changeJoinSCStatus">
      </essential>

      <!--  Tabs 组件 -->
      <square-tabs
        :activeTabName="activeCasesTabName"
        @changeTab="changeCasesTab">
        <basic-tab :tabLabel="medicalTabName"
          tabName="medicalTab">
          <template v-if="activeCasesTabName === 'medicalTab'">
            <!-- 住院病案 -->
            <case-document
              v-if="patientObj"
              :patientObj="patientObj"
              :emrOptions="$pagePayload.BASIC.Menu">
            </case-document>
          </template>
        </basic-tab>

        <basic-tab tabName="recordTab"
          tabLabel="检查记录">
          <template v-if="activeCasesTabName === 'recordTab'">
            <!-- 检查记录 -->
            <record v-if="patientObj"
              :patientObj="patientObj"
              :originalData="originalData"
              :mainDataList="recordData"
              :mainDataApplyField="getApplyField('record')"
              mainDataSelectNameField="CHECK_ITEM_NAME"
              subIdField="CHECK_ID">
            </record>
          </template>
        </basic-tab>

        <basic-tab tabName="testTab"
          tabLabel="检验记录">
          <template v-if="activeCasesTabName === 'testTab'">
            <!-- 检验记录 -->
            <test v-if="patientObj"
              :patientObj="patientObj">
            </test>
          </template>
        </basic-tab>

        <basic-tab tabName="nodocotorTab"
          tabLabel="非药物医嘱">
          <template v-if="activeCasesTabName === 'nodocotorTab'">
            <!-- 非药物治疗 -->
            <prescription
              v-if="patientObj"
              :patientObj="patientObj"
              :dataSourceName="noMedcianName"
              :dataSourceCode="noMedcianCode"
              :treatType="treatType"
              :typeDoctor="typeDoctor">
            </prescription>
          </template>
        </basic-tab>

        <basic-tab tabName="docotorTab"
          tabLabel="药物医嘱">
          <template v-if="activeCasesTabName === 'docotorTab'">
            <!-- 药物治疗 -->
            <prescription
              v-if="patientObj"
              :patientObj="patientObj"
              :dataSourceName="medcianName"
              :dataSourceCode="medcianCode"
              :treatType="treatType"
              :typeDoctor="typeDoctor">
            </prescription>
          </template>
        </basic-tab>
      </square-tabs>
    </div>

    <!-- 右侧部分 -->
    <div class="patient-detail__right">
      <quality-point
        :patientId="patientId"
        :totalQualityPoints="totalQualityPoints"
        @changeQualityPointReasonContent="changeQualityPointReasonContent">
      </quality-point>
    </div>
  </div>
</template>

<script>
  import Axios from "axios";
  import Essential from "__libs/components/Essential";
  import CaseDocument from "__libs/components/CaseDocument";
  import Prescription from "__libs/components/Prescription";
  import Record from "__libs/components/Record";
  import Test from "__libs/components/Test";
  import Pathology from "__libs/components/Pathology";
  // 个人信息
  import SubPersonalInfo from "__libs/components/SubPersonalInfo";
  // 相关诊疗信息
  import SubDiagnosisMsg from "__libs/components/SubDiagnosisMsg";

  import SquareTabs from "__shared-libs/components/tabs/square-tabs/Tabs";
  import BasicTab from "__shared-libs/components/tabs/basic-tabs/Tab";
  import QualityPoint from "__libs/components/QualityPoint";

  import updateQualityPointReasons from "__libs/js/modules/update-quality-point-reasons";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "patient-detail",

    components: {
      Essential,
      CaseDocument,
      Prescription,
      Record,
      Test,
      Pathology,

      SquareTabs,
      BasicTab,

      SubDiagnosisMsg,
      SubPersonalInfo,
      QualityPoint
    },

    data() {
      return {
        medcianName: "药物",
        medcianCode: "1",
        noMedcianName: "非药物",
        noMedcianCode: "0",

        treatType: null,
        typeDoctor: null,

        // 要传给所有子组件的 props
        patientNo: null,
        patientObj: null,
        // msg:'住院病历',

        // 病种 全部 tab 被激活
        activeCasesTabName: "medicalTab",

        // 所有质控点列表
        totalQualityPoints: null,

        patientId: this.$pagePayload.BASIC.Diagnose[0].SD_CPAT_NO,

        // 检查tab 数据
        recordData: [],

        // 原始数据
        originalData: null,
        // 病理
        pathologyData: []
      };
    },

    computed: {
      medicalTabName() {
        let name = "住院病历",
            patientObj = this.patientObj || {};

        if (patientObj.IN_FLAG === "E") {
          name = "急诊病历";
        } else if (patientObj.IN_FLAG === "O") {
          name = "门诊病历";
        }

        return name;
      }
    },

    mounted() {
      // 组件挂载之后就要立即请求质控点数据（在未分组病例详情里面
      // 需要重写为空方法避免发请求）
      this.fetchQualityPointsData();
    },

    methods: {
      // 修改前端质控点反馈原因
      changeQualityPointReasonContent(obj) {
        this.totalQualityPoints = updateQualityPointReasons(
          this.totalQualityPoints,
          obj
        );
      },

      changeJoinSCStatus(pno) {
        let obj = this.$pagePayload.BASIC.Diagnose.filter((item) => {
          return item.PATIENT_NO === pno;
        })[0];
        obj.IsJoinSC = true;
        this.patientObj = obj;
      },

      changePatientNo(patNo) {
        let patientObj = this.$pagePayload.BASIC.Diagnose.filter((item) => {
          return item.PATIENT_NO === patNo;
        })[0];

        this.patientObj = patientObj;
        let treatType = null;

        // 急诊信息
        if (patientObj.IN_FLAG === "E") {
          treatType = "emergency";
        } else if (patientObj.IN_FLAG === "O") {
          // else: 门诊信息
          treatType = "outpatient";
        } else {
          // else: 住院信息
          treatType = "inpatient";
        }

        this.treatType = treatType;
        // 跳转到第一个tab
        this.changeCasesTab("medicalTab");
      },

      /* 质控2.1*/
      // crf结果,点击相应的"自定义--某某"对应中间部分的tab标签
      changeActiveTabToCRF(tabName) {
        this.activeCasesTabName = tabName;
      },

      // 修改tab
      changeCasesTab(tabName) {
        this.activeCasesTabName = tabName;

        if (tabName === "nodocotorTab") {
          this.typeDoctor = "extra";
        } else if (tabName === "docotorTab") {
          this.typeDoctor = "medical";
        } else if (tabName === "recordTab") {
          // else: 检查记录
          // 请求数据
          this.getRecordData();
        } else if (tabName === "pathologyTab") {
          // else: 病理记录
          // 请求数据
          this.getPathologyData();
        }
      },

      // 得到用于渲染列表的应用字段
      getApplyField(type) {
        let list;

        if (type === "record") {
          list = [
            {
              title: "检查名称",
              field: "CHECK_ITEM_NAME"
            },
            {
              title: "申请时间",
              field: "APPLY_DATE"
            },
            {
              title: "检查时间",
              field: "CHECK_DATE"
            },
            {
              title: "报告时间",
              field: "REPORT_DATE"
            }
          ];
        } else if (type === "pathology") {
          list = [
            {
              title: "病理名称",
              field: "ITEM_NAME"
            },
            {
              title: "病理类别",
              field: "SAMPLE_TYPE_NAME"
            },
            {
              title: "检查时间",
              field: "CHECK_DATE"
            },
            {
              title: "报告时间",
              field: "REPORT_DATE_TIME"
            }
          ];
        }

        return list;
      },

      // 检查记录数据获取
      getRecordData() {
        this.$showLoading();

        // 检查记录  表格1
        Axios.get(resolveApiRoute(
          "patient-detail-record",
          {
            SdCpatNo: this.patientObj.SD_CPAT_NO
          }
        ), {
          params: {
            // I 住院E 急诊O 门诊 9 未知
            InFlag: this.patientObj.IN_FLAG,
            PatientNo: this.patientObj.PATIENT_NO
          }
        }).then((res) => {
          this.$hideLoading();

          if (res.data.Code === 0) {
            this.originalData = res.data.Data.Data;
            this.recordData = this.originalData;
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$hideLoading();
          this.$showNotice("网络异常", "failed");
        });
      },

      // 病理记录数据获取
      getPathologyData() {
        this.$showLoading();

        // 病理记录  表格1
        Axios.get(resolveApiRoute(
          "pathology",
          {
            SdCpatNo: this.patientObj.SD_CPAT_NO
          }
        ), {
          params: {
            // I 住院E 急诊O 门诊 9 未知
            InFlag: this.patientObj.IN_FLAG,
            // "患者唯一住院号/门诊号"
            PatientNo: this.patientObj.PATIENT_NO
          }
        }).then((res) => {
          this.$hideLoading();

          if (res.data.Code === 0) {
            this.originalData = res.data.Data.Data;
            this.pathologyData = this.originalData;
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$hideLoading();
          this.$showNotice("网络异常", "failed");
        });
      },

      // 取得质控点数据
      fetchQualityPointsData() {
        // 准备开始请求质控点，置为空显示加载动画
        this.totalQualityPoints = null;

        Axios.get(resolveApiRoute(
          "review-cases",
          {
            SdCpatNo: this.$pagePayload.BASIC.Diagnose[0].SD_CPAT_NO
          }
        )).then((res) => {
          if (res.data.Code === 0) {
            this.totalQualityPoints = res.data.Data.Data;
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$showNotice("网络异常", "failed");
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .patient-detail {
    &__left {
      float: left;
    }

    &__center {
      width: sz(750);
      float: left;
      margin-left: sz(10);

      .square-tabs {
        .basic-tabs {
          &__header {
            @include border-radius(5px 5px 0 0);

            margin-top: sz(10);

            &-item {
              width: sz(125 - 40);

              &:nth-child(1),
              &:nth-child(6) {
                width: sz(124 - 40);
              }

              &--active {
                width: sz(123 - 40);
                color: map-get($colors, theme-blue);

                &:nth-child(1) {
                  @include border-radius(5px 0 0 0);

                  width: sz(123 - 40);
                }

                &:nth-child(6) {
                  @include border-radius(0 5px 0 0);

                  width: sz(122 - 40);
                  border-right-color: transparent;
                }
              }
            }
          }

          &__contents {
            @include border-radius(0 0 5px 5px);

            padding: sz(10);
            height: sz(536);
          }
        }
      }
    }

    &__right {
      width: sz(250);
      float: left;
      margin-left: sz(10);
    }

    .quality-point {
      &__uls {
        height: sz(562);
        border: none;
      }

      // 病例详情页，不再展示操作按钮一栏（目前没有任何按钮）
      &__btn {
        display: none;
      }

      .basic-tabs {
        &__header,
        &__contents {
          width: sz(250);
        }

        &__contents {
          height: sz(582);
        }
      }
    }

    .nodoctor {
      p {
        color: map-get($colors, pure-white);
      }
    }

    .test {
      .dots-paginator {
        margin: sz(10) 0 0;
      }
    }

    .doctor {
      max-height: sz(483);
    }
  }
</style>
