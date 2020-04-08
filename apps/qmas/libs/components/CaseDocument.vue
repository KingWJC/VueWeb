<template>
  <div class="case-document">
    <!-- 只有“住院（I）才显示时间选择栏） -->
    <div v-if="patientObj.IN_FLAG === 'I'"
      class="case-document__menu clearfix">
      <div class="case-document__menu-input">
        <span>住院记录:</span>
        <div class="case-document__menu-input-primary">
          <select-dropdown-v2
            v-model="selectedEmrOption"
            :isFilterable="true"
            :options="emrOptions"
            label="DP_ITEM_NAME"
            trackBy="DP_ITEM_CODE"
            @optionChanged="getCase">
            <template slot="drop"
              slot-scope="dropContent">
              <p class="select-dropdown-v2-options__items-item-text">
                <span :title="dropContent.options.DP_ITEM_NAME">
                  <i
                    :class="{
                      'case-document__graydot--active':
                        hasDocs(dropContent.options)
                    }"
                    class="case-document__graydot"></i>
                  {{ dropContent.options.DP_ITEM_NAME }}
                </span>
              </p>
            </template>
          </select-dropdown-v2>
        </div>
      </div>

      <div v-if="docDateOptions.length > 0"
        class="case-document__menu-input">
        <span>创建时间:</span>
        <div class="case-document__menu-input-secondary">
          <select-dropdown-v2
            v-model="selectedDocDate"
            :isFilterable="true"
            :options="docDateOptions"
            label="CREATE_DATE"
            trackBy="EMR_REC_ID"
            @optionChanged="showDocByDate">
          </select-dropdown-v2>
        </div>
      </div>
    </div>

    <!-- 文件内容渲染区 -->
    <template v-if="!requestApi">
      <template v-if="currentDoc">
        <div class="case-document__content">
          病历内容：{{ currentDoc }}
        </div>
      </template>
      <template v-else>
        <qa-no-content title="暂无相关信息"></qa-no-content>
      </template>
    </template>
  </div>
</template>

<script>
  import Axios from "axios";
  import QaNoContent from "./QaNoContent";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "case-document",

    components: {
      QaNoContent
    },

    props: {
      patientObj: {
        type: Object,
        default() {
          return {};
        }
      },

      // 住院记录下拉框可选项
      emrOptions: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        // 选择的病历文件对象
        selectedEmrOption: this.emrOptions[0],

        // 当前选择的文件日期
        selectedDocDate: null,
        // 可用文件日期
        docDateOptions: [],

        // api返回的原始病历列表（可能有多个时间）
        rawDocs: null,

        // 当前正在查看的病历文件
        currentDoc: null,

        // 当前是否在加载api
        requestApi: true
      };
    },

    watch: {
      patientObj: "resetView"
    },

    mounted() {
      this.resetView();
    },

    methods: {
      // 给定住院记录是否存在病历文件
      // @param {Object} recObj 住院记录对象（下拉框里面带小点的条目）
      hasDocs(recObj) {
        return recObj.PatientList.indexOf(this.patientObj.PATIENT_NO) > -1;
      },

      // 变更相关诊疗项之后取数据，刷新
      resetView() {
        this.selectedEmrOption = this.emrOptions[0];
        this.getCase();
      },

      getCase() {
        // 正在请求api
        this.requestApi = true;
        // 清空之前的时间列表
        this.docDateOptions = [];
        this.$showLoading();

        // 病历文件
        Axios.get(resolveApiRoute(
          "patient-detail-case",
          {SdCpatNo: this.patientObj.SD_CPAT_NO}
        ), {
          params: {
            // I 住院E 急诊O 门诊 9 未知
            InFlag: this.patientObj.IN_FLAG,
            EmrTypeCode: this.patientObj.IN_FLAG === "I"
              ? this.selectedEmrOption.DP_ITEM_CODE
              : "",
            PatientNo: this.patientObj.PATIENT_NO
          }
        }).then((res) => {
          this.requestApi = false;
          this.$hideLoading();

          // get body data
          if (res.data.Code === 0) {
            this.rawDocs = res.data.Data.Data;

            // 后端返回了可用病历
            if (res.data.Data.TotalRecord > 0) {
              // 如果是“住院病历”，就要构造“创建时间”下拉框
              if (this.patientObj.IN_FLAG === "I") {
                this.docDateOptions = this.createDateOptions();
                this.selectedDocDate = this.docDateOptions[0];

                // 手动展示第一个时间对应病历
                this.showDocByDate();
              } else {
                // 门诊，急症，只有一份病历，直接展示
                this.currentDoc = this.rawDocs[0].REC_CONTENT;
              }
            } else {
              this.currentDoc = null;
            }
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.requestApi = false;
          this.$hideLoading();
          this.$showNotice("网络异常", "failed");
        });
      },

      // 构造可用时间下拉框
      createDateOptions() {
        // 创建当前“住院记录”对应的时间列表
        let dateList = this.rawDocs.reduce((tmpList, curItem) => {
          if (curItem.EMR_TYPE_CODE === this.selectedEmrOption.DP_ITEM_CODE) {
            tmpList.push({
              CREATE_DATE: curItem.CREATE_DATE,
              EMR_REC_ID: curItem.EMR_REC_ID
            });
          }

          return tmpList;
        }, []);

        // 可用时间排序
        dateList.sort(function(a, b) {
          return new Date(b["CREATE_DATE"]).getTime() -
            new Date(a["CREATE_DATE"]).getTime();
        });

        return dateList;
      },

      // 时间切换之后，展示对应病历内容
      showDocByDate() {
        this.currentDoc = this.rawDocs.filter((item) => {
          return item.EMR_TYPE_CODE === this.selectedEmrOption.DP_ITEM_CODE &&
            item.EMR_REC_ID === this.selectedDocDate.EMR_REC_ID;
        })[0].REC_CONTENT;
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .case-document {
    &__graydot {
      @include border-radius(50%);
      display: inline-block;
      height: sz(6);
      width: sz(6);
      background: map-get($colors, border-gray);
      vertical-align: middle;
      margin-right: sz(10);

      &--active {
        background: map-get($colors, success-green);
      }
    }

    &__menu {
      position: relative;
      margin-bottom: sz(10);

      &-input {
        float: left;
        width: sz(240);
        margin-right: sz(40);

        &-primary,
        &-secondary {
          margin-top: sz(10);
        }

        &-primary {
          .select-dropdown-v2 {
            &__selected-input {
              // 此样式只适用于ie显示汉字使用,纯数字的下拉input样式继承会有变化,
              // 建议不使用,故此方法不得写入select-dropdown-v2中,
              @include patch-ie10-input-font();
            }
          }
        }
      }

      &-poy {
        color: map-get($colors, text-main);

        span {
          display: inline-block;
          margin-right: 23%;
          height: sz(33);
          line-height: sz(33);
        }
      }
    }

    &__content {
      border: 1px solid map-get($colors, pure-white);
      height: sz(444);
      overflow: auto;
      font-size: map-get($font-sizes, sm);
      color: map-get($colors, text-light);
      padding-bottom: sz(20);
      line-height: sz(25);
    }
  }
</style>
