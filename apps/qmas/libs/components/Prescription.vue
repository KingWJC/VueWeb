<template>
  <div
    :class="[
      `prescription--${typeDoctor}`,
      `prescription--${treatType}`
    ]"
    class="prescription">
    <Filters
      :dataList="dataList"
      :filterOptions="filterOptions"
      :dataSourceCode="dataSourceCode"
      @filterOptionsChanged="filterOptionsChanged">
    </Filters>

    <table class="prescription__table-head">
      <thead>
        <tr>
          <th><div>{{ contentTitle }}</div></th>

          <template v-if="treatType !== 'outpatient'">
            <th>临/长</th>
          </template>

          <template v-if="dataSourceCode === '0'">
            <th>类型</th>
          </template>
          <th>剂量</th>
          <template v-if="dataSourceCode === '1'">
            <th>单位</th>
            <th>给药途径</th>
          </template>
          <th>频次</th>
          <th>
            <!-- I是住院信息，O是门诊信息-->
            <template v-if="patientObj.IN_FLAG === 'I'">开始时间</template>
            <template v-else-if="patientObj.IN_FLAG === 'O'">处方时间</template>
            <template v-else>医嘱时间</template>
          </th>
          <template v-if="patientObj.IN_FLAG === 'I'">
            <th>停止时间</th>
          </template>
        </tr>
      </thead>
    </table>

    <div v-if="!isBa"
      class="prescription__table-body-wrapper">
      <table class="prescription__table-body" >
        <tbody>
          <tr v-for="(item, index) in dataListDoctor"
            :key="index">
            <td :title="item.ORDER_ITEM_NAME">
              <div>{{ item.ORDER_ITEM_NAME }}</div>
            </td>

            <template v-if="treatType !== 'outpatient'">
              <td :title="item.LONG_FLAG"><div>{{ item.LONG_FLAG }}</div></td>
            </template>

            <template v-if="dataSourceCode === '0'">
              <td :title="item.ORDER_TYPE_NAME">
                <div>{{ item.ORDER_TYPE_NAME }}</div>
              </td>
            </template>

            <!-- 剂量 -->
            <template v-if="item.DOSE_ONCE">
              <td :title="item.DOSE_ONCE"><div>{{ item.DOSE_ONCE }}</div></td>
            </template>
            <template v-else>
              <td><p>--</p></td>
            </template>

            <!-- 只有药物治疗显示：单位 给药途径 -->
            <template v-if="dataSourceCode === '1'">
              <td :title="item.DOSE_UNIT"><div>{{ item.DOSE_UNIT }}</div></td>
              <td :title="item.GYTJ_NAME"><div>{{ item.GYTJ_NAME }}</div></td>
            </template>

            <!-- 频次 -->
            <template v-if="item.FREQ_NAME">
              <td :title="item.FREQ_NAME"><div>{{ item.FREQ_NAME }}</div></td>
            </template>
            <template v-else>
              <td><p>--</p></td>
            </template>

            <!-- 住院病历显示开始时间，门诊急诊显示医嘱时间-->
            <template v-if="patientObj.IN_FLAG === 'I'">
              <td :title="item.DATE_BEGIN"><div>{{ item.DATE_BEGIN }}</div></td>
            </template>
            <template v-else>
              <td :title="item.MO_DATE"><div>{{ item.MO_DATE }}</div></td>
            </template>

            <template v-if="patientObj.IN_FLAG === 'I'">
              <!-- 停止时间 如果为null 展示横杠 -->
              <template v-if="item.DATE_END === null || item.DATE_END === ''">
                <td><p>--</p></td>
              </template>
              <template v-else>
                <td :title="item.DATE_END"><div>{{ item.DATE_END }}</div></td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <qa-no-content
      v-if="isBa"
      title="暂无相关信息">
    </qa-no-content>
  </div>
</template>

<script>
  import Axios from "axios";
  import Filters from "./Filters";
  import QaNoContent from "__libs/components/QaNoContent";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "prescription",

    components: {
      Filters,
      QaNoContent
    },

    props: {
      dataSourceName: {
        type: String,
        default: ""
      },

      // 0: 表示药物医嘱; 1: 表示非药物医嘱
      dataSourceCode: {
        type: String,
        default: ""
      },

      patientObj: {
        type: Object,
        default() {
          return {};
        }
      },

      // 诊疗类型：门诊(outpatient) | 急诊(emergency) | 住院(inpatient)
      treatType: {
        type: String,
        default: ""
      },

      // 医嘱类型： 药物(medical) | 非药物(extra)
      typeDoctor: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        dataList: [],
        isShow: false,

        // 过滤参数
        filterOptions: {
          ORDER_ITEM_NAME: "",
          doseOnceMin: "",
          doseOnceMax: "",
          DOSE_UNIT: "",
          GYTJ_NAME: ""
        },

        // 添加
        dataListDoctor: [],
        isBa: false
      };
    },

    computed: {
      contentTitle() {
        return this.patientObj.IN_FLAG === "I" ? "医嘱内容" : "处方内容";
      }
    },

    watch: {
      patientObj() {
        this.dataListDoctor = [];
        // 清空筛选参数
        this.filterOptions = {
          ORDER_ITEM_NAME: "",
          doseOnceMin: "",
          doseOnceMax: "",
          DOSE_UNIT: "",
          GYTJ_NAME: ""
        };

        this.getCase();
      }
    },

    mounted() {
      this.getCase();
    },

    methods: {
      showFilters() {
        this.isShow = !this.isShow;
      },

      filterOptionsChanged(options) {
        this.filterOptions = options;
        this.dataListDoctor = this.getFilteredList(options);

        if (this.dataListDoctor.length === 0) {
          // 显示
          this.isBa = true;
        } else {
          this.isBa = false;
        }
      },

      // @param {Object} options {name: xx, unit: xx...}
      getFilteredList(options) {
        let resList = [];

        this.dataList.forEach((item) => {
          // 如果传入 名称 条件
          if (options.ORDER_ITEM_NAME) {
            // 如果医嘱内容为空 或null 直接return
            if (item.ORDER_ITEM_NAME) {
              // 如果不包含关键字，直接搜索下一行
              if (item.ORDER_ITEM_NAME.indexOf(options.ORDER_ITEM_NAME) < 0) {
                return;
              }
            } else {
              return;
            }
          }

          // 如果传入 计量单位 条件
          if (options.unitValue &&
            options.unitValue !== "全部") {
              // 如果不等于，直接搜索下一行
              if (item.DOSE_UNIT !== options.unitValue) {
                return;
              }
            }

          // 如果传入 计量值(最小) 条件
          if (options.doseOnceMin) {
            // 如果小于最小值，直接搜索下一行
            if (item.DOSE_ONCE < options.doseOnceMin) {
              return;
            }
          }

          // 如果传入 计量值(最大) 条件
          if (options.doseOnceMax) {
            // 如果大于最大值，直接搜索下一行
            if (item.DOSE_ONCE > options.doseOnceMax) {
              return;
            }
          }

          // 如果传入 用法 条件
          if (options.useageValue &&
            options.useageValue !== "全部") {
              // 如果不等于，直接搜索下一行
              if (item.GYTJ_NAME !== options.useageValue) {
                return;
              }
            }
          // 所有测试条件都通过，使用该行
          resList.push(item);
        });

        return resList;
      },

      getCase() {
        this.$showLoading();

        Axios.get(resolveApiRoute(
          "patient-detail-prescription",
          {
            SdCpatNo: this.patientObj.SD_CPAT_NO
          }
        ), {
          params: {
            OrderTypeCode: this.dataSourceCode,
            // I 住院E 急诊O 门诊 9 未知
            InFlag: this.patientObj.IN_FLAG,
            PatientNo: this.patientObj.PATIENT_NO
          }
        }).then((res) => {
          this.$hideLoading();

          if (res.data.Code === 0) {
            this.dataList = res.data.Data.Data;
            this.dataListDoctor = this.getFilteredList({});

            if (this.dataListDoctor.length === 0) {
              // 显示
              this.isBa = true;
            } else {
              this.isBa = false;
            }
          } else {
            this.$showNotice("服务器异常", "failed");
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

  .prescription {
    $_bem-root: &;

    .filters {
      margin: 0;
    }

    &__table-head th {
      $_parent: &;

      text-align: left;
      height: sz(48);
      line-height: sz(48);
      padding: 0;

      &:nth-child(1) {
        padding-left: sz(10);
      }

      @at-root #{$_bem-root}--medical #{$_parent} {
        @include table-sizes(204, 52, 44, 44, 72, 62, 120);
      }

      @at-root #{$_bem-root}--extra #{$_parent} {
        @include table-sizes(240, 56, 52, 68, 62, 116);
      }

      // 门诊
      @at-root #{$_bem-root}--outpatient {
        &#{$_bem-root}--extra #{$_parent} {
          @include table-sizes(380, 60, 65, 90);

          &:nth-child(5) {
            // 重设置 width 为 auto 覆盖急诊和住院的 nth-child(6) 的定宽
            width: auto;
          }
        }

        &#{$_bem-root}--medical #{$_parent} {
          @include table-sizes(300, 60, 60, 80, 90);

          &:nth-child(6) {
            // 重设置 width 为 auto 覆盖急诊和住院的 nth-child(7) 的定宽
            width: auto;
          }
        }
      }

      // 急诊
      @at-root #{$_bem-root}--emergency {
        &#{$_bem-root}--extra #{$_parent} {
          @include table-sizes(320, 60, 60, 65, 90);

          &:nth-child(6) {
            // 重设置 width 为 auto 覆盖急诊和住院的 nth-child(6) 的定宽
            width: auto;
          }
        }

        &#{$_bem-root}--medical #{$_parent} {
          @include table-sizes(245, 60, 60, 60, 80, 90);

          &:nth-child(7) {
            // 重设置 width 为 auto 覆盖急诊和住院的 nth-child(7) 的定宽
            width: auto;
          }
        }
      }
    }

    &__table-body tbody tr td {
      $_parent: &;

      text-align: left;
      height: sz(38);
      padding: 0;

      p {
        margin: 0 0 0 sz(5);
      }

      &:nth-child(1) {
        padding-left: sz(10);
      }

      @at-root #{$_bem-root}--medical #{$_parent} {
        @include table-sizes(204, 52, 44, 44, 72, 62, 120);

        &:nth-child(1) {
          div {
            @include word-hidden(sz(201));
          }
        }

        &:nth-child(2) {
          div {
            @include word-hidden(sz(50));
          }
        }

        &:nth-child(3),
        &:nth-child(4) {
          div {
            @include word-hidden(sz(42));
          }
        }

        &:nth-child(5) {
          div {
            @include word-hidden(sz(70));
          }
        }

        &:nth-child(6) {
          div {
            @include word-hidden(sz(60));
          }
        }

        &:nth-child(7) {
          div {
            @include word-hidden(sz(117));
          }
        }

        &:nth-child(8) {
          p {
            margin: 0 0 0 sz(15);
          }
        }
      }

      @at-root #{$_bem-root}--extra #{$_parent} {
        @include table-sizes(240, 56, 52, 68, 62, 116);

        &:nth-child(1) {
          text-align: left;

          div {
            @include word-hidden(sz(240));
          }
        }

        &:nth-child(2) {
          div {
            @include word-hidden(sz(53));
          }
        }

        &:nth-child(3) {
          div {
            @include word-hidden(sz(49));
          }
        }

        &:nth-child(4) {
          div {
            @include word-hidden(sz(65));
          }
        }

        &:nth-child(5) {
          div {
            @include word-hidden(sz(60));
          }
        }

        &:nth-child(7) {
          p {
            margin: 0 0 0 sz(15);
          }
        }
      }

      // 门诊信息
      @at-root #{$_bem-root}--outpatient {
        &#{$_bem-root}--extra #{$_parent} {
          @include table-sizes(380, 60, 65, 90);

          &:nth-child(1) {
            div {
              @include word-hidden(sz(377));
            }
          }

          &:nth-child(2) {
            div {
              @include word-hidden(sz(57));
            }
          }

          &:nth-child(3) {
            div {
              @include word-hidden(sz(62));
            }
          }

          &:nth-child(4) {
            div {
              @include word-hidden(sz(87));
            }
          }

          &:nth-child(5) {
            // 重设置 width 为 auto 覆盖急诊和住院的 nth-child(6) 的定宽
            width: auto;

            div {
              width: auto;
            }

            p {
              margin: 0 0 0 sz(15);
            }
          }
        }

        &#{$_bem-root}--medical #{$_parent} {
          @include table-sizes(300, 60, 60, 80, 90);

          &:nth-child(1) {
            div {
              @include word-hidden(sz(297));
            }
          }

          &:nth-child(2),
          &:nth-child(3) {
            div {
              @include word-hidden(sz(57));
            }
          }

          &:nth-child(4) {
            div {
              @include word-hidden(sz(77));
            }
          }

          &:nth-child(5) {
            div {
              @include word-hidden(sz(87));
            }
          }

          &:nth-child(6) {
            // 重设置 width 为 auto 覆盖急诊和住院的 nth-child(7) 的定宽
            width: auto;

            div {
              width: auto;
            }

            p {
              margin: 0 0 0 sz(15);
            }
          }
        }
      }

      // 急诊信息
      @at-root #{$_bem-root}--emergency {
        &#{$_bem-root}--extra #{$_parent} {
          @include table-sizes(320, 60, 60, 65, 90);

          &:nth-child(1) {
            div {
              @include word-hidden(sz(317));
            }
          }

          &:nth-child(2),
          &:nth-child(3) {
            div {
              @include word-hidden(sz(57));
            }
          }

          &:nth-child(4) {
            div {
              @include word-hidden(sz(62));
            }
          }

          &:nth-child(5) {
            div {
              @include word-hidden(sz(87));
            }
          }

          &:nth-child(6) {
            // 重设置 width 为 auto 覆盖急诊和住院的 nth-child(6) 的定宽
            width: auto;

            div {
              width: auto;
            }

            p {
              margin: 0 0 0 sz(15);
            }
          }
        }

        &#{$_bem-root}--medical #{$_parent} {
          @include table-sizes(245, 60, 60, 60, 80, 90);

          &:nth-child(1) {
            div {
              @include word-hidden(sz(242));
            }
          }

          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4) {
            div {
              @include word-hidden(sz(60));
            }
          }

          &:nth-child(5) {
            div {
              @include word-hidden(sz(80));
            }
          }

          &:nth-child(6) {
            div {
              @include word-hidden(sz(90));
            }
          }

          &:nth-child(7) {
            // 重设置 width 为 auto 覆盖急诊和住院的 nth-child(7) 的定宽
            width: auto;

            div {
              width: auto;
            }

            p {
              margin: 0 0 0 sz(15);
            }
          }
        }
      }
    }

    &__table-head {
      @include unify-table-ui();

      border-top: 1px solid map-get($colors, dialog-cancel-border);
    }

    &__table-body-wrapper {
      table {
        @include unify-table-ui();

        tbody tr {
          height: sz(38);

          td {
            padding: 0;
          }
        }
      }

      border-top: 0;
      max-height: sz(420);
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
</style>
