<template>
  <div class="test">
    <div class="test__filter">
      <select-dropdown-v2
        v-model="selectedTest"
        :isFilterable="true"
        :options="testOptions"
        label="TEST_ITEM_NAME"
        trackBy="SAMPLE_NO"
        @optionChanged="selectview">
      </select-dropdown-v2>
    </div>

    <div class="test__parent">
      <table class="test__parent-tablehead">
        <thead>
          <tr>
            <th><div>检验名称</div></th>
            <th>标本类型</th>
            <th>申请时间</th>
            <th>标本采样时间</th>
            <th>报告时间</th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- 避免先出现无数据 -->
    <template v-if="originalData">
      <!-- 父表格 -->
      <template v-if="testAll.length > 0">
        <div class="test__parent">
          <a
            :class="{
              'test__parent-left--active': isLeftBtn
            }"
            class="test__parent-left"
            @click="getLeft">
          </a>

          <table class="test__parent-table">
            <tbody class="test__parent-table-toby">
              <tr v-for="(item, index) in testAll"
                :key="index"
                :class="{
                  'test__parent-table-toby-trs--active':
                    sampleNo === item.SAMPLE_NO
                }"
                class="test__parent-table-toby-trs"
                @click="subFeachData(item)">
                <td :title="item.TEST_ITEM_NAME">
                  <div>{{ item.TEST_ITEM_NAME }}</div>
                </td>
                <td :title="item.SAMPLE_TYPE_NAME">
                  <div>{{ item.SAMPLE_TYPE_NAME }}</div>
                </td>
                <td :title="item.APPLY_DATE">
                  <div>{{ item.APPLY_DATE }}</div>
                </td>
                <td :title="item.SAMPLING_DATE">
                  <div>{{ item.SAMPLING_DATE }}</div>
                </td>
                <td :title="item.TEST_DATE">
                  <div>{{ item.TEST_DATE }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          <a
            :class="{
              'test__parent-right--active': isRightBtn
            }"
            class="test__parent-right"
            @click="getRight">
          </a>
        </div>

        <!-- 翻页 -->
        <dots-paginator
          :totalRecords="totalRecords"
          :pageSize="pageSize"
          :curPage="curPage"
          @changePage="changePage">
        </dots-paginator>

        <!--  子表格-->
        <template v-if="originalSubData">
          <template v-if="subTableData.length > 0">
            <!-- 微生物 -->
            <template v-if="typeChild === 1">
              <span class="test__resull">微生物结果</span>

              <div class="test__microbial-header">
                <table>
                  <thead>
                    <tr>
                      <th>细菌编码</th>
                      <th>细菌名称</th>
                      <th>抗生素编码</th>
                      <th>抗生素名称</th>
                      <th>数值结果</th>
                      <th>敏感S/中敏I/耐药R</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div class="test__content">
                <table class="test__content-microbial">
                  <tbody>
                    <tr v-for="(item, sindex) in subTableData"
                      :key="sindex">
                      <td :title="item.GERM_CODE">
                        <div>{{ item.GERM_CODE }}</div>
                      </td>
                      <td :title="item.GERM_NAME">
                        <div>{{ item.GERM_NAME }}</div>
                      </td>
                      <td :title="item.ANTI_CODE">
                        <div>{{ item.ANTI_CODE }}</div>
                      </td>
                      <td :title="item.ANTI_NAME">
                        <div>{{ item.ANTI_NAME }}</div>
                      </td>
                      <td :title="item.NUM_RESULT">
                        <div>{{ item.NUM_RESULT }}</div>
                      </td>
                      <td :title="item.LETTER_RESULT">
                        <div>{{ item.LETTER_RESULT }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
            <template v-else>
              <!-- 检验结果 -->
              <span class="test__resull">检验结果</span>

              <div class="test__test-header">
                <table>
                  <thead>
                    <tr>
                      <th>项目名称</th>
                      <th>结果值</th>
                      <th>参考值</th>
                      <th>单位</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <!-- 表格 -->
              <div class="test__content">
                <table class="test__content-test">
                  <tbody>
                    <tr v-for="(item, aindex) in subTableData"
                      :key="aindex">
                      <td :title="item.RESULT_ITEM_NAME">
                        <div>{{ item.RESULT_ITEM_NAME }}</div>
                      </td>
                      <td :title="item.RESULT_VALUE">
                        <div>{{ item.RESULT_VALUE }}</div>
                      </td>
                      <template v-if="item.REF_RANGE !== null">
                        <td :title="item.REF_RANGE">
                          <div>{{ item.REF_RANGE }}</div>
                        </td>
                      </template>
                      <template
                        v-else-if="
                          item.MIN_RANGE !== null &&
                            item.MAX_RANGE !== null
                        ">
                        <td :title="`${item.MIN_RANGE}-${item.MAX_RANGE}`">
                          <div>{{ item.MIN_RANGE }}-{{ item.MAX_RANGE }}></div>
                        </td>
                      </template>
                      <template v-else>
                        <td></td>
                      </template>
                      <td :title="item.RESULT_UNIT">
                        <div>{{ item.RESULT_UNIT }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </template>
          <template v-else>
            <qa-no-content title="暂无相关信息"></qa-no-content>
          </template>
        </template>
      </template>
      <template v-else>
        <qa-no-content title="暂无相关信息"></qa-no-content>
      </template>
    </template>
  </div>
</template>

<script>
  import Axios from "axios";
  import DotsPaginator from "__shared-libs/components/paginator/DotsPaginator";
  import QaNoContent from "__libs/components/QaNoContent";
  import getPaginationData from "__shared-libs/js/modules/get-pagination-data";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "test",

    components: {
      DotsPaginator,
      QaNoContent
    },

    props: {
      patientObj: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      return {
        selectedTest: {
          TEST_ITEM_NAME: "全部",
          SAMPLE_NO: "*"
        },
        testOptions: [],

        // 缓存原始数据
        originalData: null,
        filterData: [],
        testAll: [],
        // 缓存子表格的原始数据 避免点击父表的时候 子表还是父表上一条数据的字表
        originalSubData: null,
        // 子表格
        subTableData: [],
        isLeftBtn: true,
        isRightBtn: false,

        // 小圆点翻页组件元数据，至少这三条
        totalRecords: 0,
        pageSize: 5,
        curPage: 1,

        // 点击父表某一条高亮(默认第一条高亮)
        sampleNo: null,

        // 子表格 0是检验结果 1是微生物结果
        typeChild: 0
      };
    },

    watch: {
      patientObj: "resetView"
    },

    mounted() {
      this.getParentsData();
    },

    methods: {
      // 判断总共有多少页
      howManyPages() {
        if ((Math.ceil(this.totalRecords / this.pageSize)) <= 1) {
          this.isLeftBtn = true;
          this.isRightBtn = true;
        }
      },

      changePage(pageNum) {
        this.curPage = pageNum;
        this.testAll = getPaginationData(
          (this.curPage - 1) * this.pageSize,
          this.pageSize,
          this.filterData
        );

        if (
          this.curPage > 1 &&
          this.curPage < Math.ceil(this.totalRecords / this.pageSize)
        ) {
          this.isRightBtn = false;
          this.isLeftBtn = false;
        } else if (this.curPage === 1) {
          this.isLeftBtn = true;
          this.isRightBtn = false;
        } else if (
          this.curPage === Math.ceil(this.totalRecords / this.pageSize)
        ) {
          this.isLeftBtn = false;
          this.isRightBtn = true;
        }

        if (this.testAll.length > 0) {
          this.subFeachData(this.testAll[0]);
        }
      },

      getLeft() {
        let tmpPage = this.curPage - 1;

        if (tmpPage < 1) {
          return;
        }

        this.changePage(tmpPage);
      },

      getRight() {
        let totalPages = Math.ceil(this.totalRecords / this.pageSize);
        let tmpPage = this.curPage + 1;

        if (tmpPage > totalPages) {
          return;
        }

        this.changePage(tmpPage);
      },

      // 获得去重后的option数据
      getSelectOpt() {
        let retlist = [];
        let newList = [];
        let hash = {};

        this.originalData.forEach((item) => {
          hash[item.TEST_ITEM_NAME] = 1;
        });
        retlist = Object.keys(hash);

        retlist.forEach((item, index) => {
          if (newList.indexOf(item) === -1) {
            newList.push({
              TEST_ITEM_NAME: item,
              SAMPLE_NO: index
            });
          }
        });
        newList.unshift(this.selectedTest);

        return newList;
      },

      // 筛选数据
      selectview() {
        let retList = [];

        if (this.selectedTest.TEST_ITEM_NAME === "全部") {
          this.filterData = this.originalData;
          this.testAll = getPaginationData(
            0,
            this.pageSize,
            this.filterData
          );
          this.totalRecords = this.filterData.length;
          this.curPage = 1;
        } else {
          this.originalData.forEach((item) => {
            if (item.TEST_ITEM_NAME === this.selectedTest.TEST_ITEM_NAME) {
              retList.push(item);
            }
          });

          this.filterData = retList;
          this.testAll = getPaginationData(
            0,
            this.pageSize,
            this.filterData
          );
          this.subFeachData(retList[0]);
          this.totalRecords = retList.length;
          this.curPage = 1;
        }

        this.changePage(this.curPage);
        this.howManyPages();
      },

      resetView() {
        this.selectedTest = {
          TEST_ITEM_NAME: "全部",
          SAMPLE_NO: "*"
        };
        this.getParentsData();
      },

      // 检验记录父表格数据
      getParentsData() {
        this.$showLoading();

        Axios.get(resolveApiRoute(
          "patient-detail-test",
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
            this.selectview();
            this.totalRecords = res.data.Data.TotalRecord;
            this.testAll = getPaginationData(
              0,
              this.pageSize,
              this.filterData
            );
            this.testOptions = this.getSelectOpt();

            // 主表有数据的情况  才请求子表
            if (this.testAll.length > 0) {
              // 首次渲染第一个表格的第一条
              this.subFeachData(this.testAll[0]);
            }
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$hideLoading();
          this.$showNotice("网络异常", "failed");
        });
      },

      // 检验记录  子表格
      // 点击父表格的某个 出现对应的子表格的内容
      subFeachData(obj) {
        this.$showLoading();
        this.sampleNo = obj.SAMPLE_NO;
        this.typeChild = obj.GERM_FLAG;
        this.originalSubData = null;

        Axios.get(resolveApiRoute("patient-detail-sub-test", {
          SdCpatNo: this.patientObj.SD_CPAT_NO,
          SampleNo: obj.SAMPLE_NO
        }), {
          params: {
            // I 住院E 急诊O 门诊 9 未知
            InFlag: this.patientObj.IN_FLAG,
            GermFlag: obj.GERM_FLAG
          }
        }).then((res) => {
          this.$hideLoading();

          // get body data
          if (res.data.Code === 0) {
            let result = res.data.Data.Data[0];

            if (res.data.Data.TotalRecord === 1 && result.TEST_TYPE === 1) {
              this.originalSubData = result.GERM;
              this.subTableData = this.originalSubData;
            } else if (
              res.data.Data.TotalRecord === 1 &&
              result.TEST_TYPE === 0
            ) {
              this.originalSubData = result.TEST;
              this.subTableData = this.originalSubData;
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

  .test {
    &__filter {
      width: sz(240);
      height: sz(30);
      position: relative;

      .select-dropdown-v2 {
        &__selected-input {
          @include patch-ie10-input-font();
        }
      }
    }

    &__resull {
      font-size: map-get($font-sizes, sm);
    }

    &__parent {
      position: relative;

      &:hover {
        #{get-bem-root()}__parent-left {
          display: block;
        }

        #{get-bem-root()}__parent-right {
          display: block;
        }
      }

      &-tablehead,
      &-table {
        @include unify-table-ui();

        thead {
          tr {
            height: sz(50);
          }
        }

        th,
        td {
          @include table-sizes(238, 120, 120, 120);

          padding: 0;

          &:nth-child(1) {
            div {
              @include word-hidden(sz(235));
            }

            padding-left: sz(10);
            text-align: left;
          }
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5) {
            div {
              @include word-hidden(sz(110));
            }
          }
        }

        &-toby {
          &-trs {
            &--active {
              @at-root #{get-bem-root()} & {
                background: map-get($colors, bg-home);
              }
            }
          }
        }
      }

      &-tablehead {
        margin-top: sz(10);
        border-top: 1px solid map-get($colors, dialog-cancel-border);
      }

      &-left {
        background-color: rgba(map-get($colors, pure-black), 0.2);
        width: sz(35);
        height: sz(35);
        border-radius: 50%;
        position: absolute;
        top: 35%;
        left: 0;
        cursor: pointer;
        display: none;

        &::after {
          @include transform(rotate(45deg));

          position: absolute;
          top: 68%;
          left: 35%;
          display: block;
          margin-top: sz(-12);
          content: "";
          width: sz(11);
          height: sz(11);
          border-left: 1px solid rgba(map-get($colors, pure-white), 1);
          border-bottom: 1px solid rgba(map-get($colors, pure-white), 1);
        }

        &--active {
          cursor: default;
          background-color: rgba(map-get($colors, pure-black), 0.1);
        }
      }

      &-right {
        background-color: rgba(map-get($colors, pure-black), 0.2);
        width: sz(35);
        height: sz(35);
        border-radius: 50%;
        position: absolute;
        top: 35%;
        left: 95%;
        cursor: pointer;
        display: none;

        &::before {
          @include transform(rotate(45deg));

          position: absolute;
          top: 68%;
          left: 25%;
          display: block;
          margin-top: sz(-12);
          content: "";
          width: sz(11);
          height: sz(11);
          border-right: 1px solid rgba(map-get($colors, pure-white), 1);
          border-top: 1px solid rgba(map-get($colors, pure-white), 1);
        }

        &--active {
          cursor: default;
          background-color: rgba(map-get($colors, pure-black), 0.1);
        }
      }
    }

    &__test-header,
    &__microbial-header {
      background-color: map-get($colors, pure-white);
      height: sz(50 - 2);
      line-height: sz(50 - 2);
      border-top: 1px solid map-get($colors, dialog-cancel-border);
      border-bottom: 1px solid map-get($colors, dialog-cancel-border);

      table {
        @include unify-table-ui();

        thead {
          tr {
            border-bottom: 0;

            th {
              @include table-sizes(280, 130, 190);

              font-weight: bold;
              text-align: left;
              padding: 0;

              &:nth-child(1) {
                padding-left: sz(10);
              }
            }
          }
        }
      }
    }

    &__microbial-header {
      table {
        @include unify-table-ui();
        border: 0;

        thead {
          tr {
            th {
              @include table-sizes(96, 101, 114, 114, 101);

              font-weight: bold;
              text-align: left;
            }
          }
        }
      }
    }

    &__content {
      overflow: auto;
      max-height: sz(140);

      &--active {
        display: none;
      }

      // 检验结果
      &-test {
        @include unify-table-ui();

        tbody {
          tr {
            td {
              @include table-sizes(280, 130, 190);

              height: sz(35);
              text-align: left;
              padding: 0;

              &:nth-child(1) {
                padding-left: sz(10);

                div {
                  @include word-hidden(sz(277));
                }
              }

              &:nth-child(2) {
                div {
                  @include word-hidden(sz(127));
                }
              }
              &:nth-child(3) {
                div {
                  @include word-hidden(sz(187));
                }
              }
            }
          }
        }
      }

      // 微生物结果
      &-microbial {
        @include unify-table-ui();

        th,
        td {
          @include table-sizes(96, 101, 114, 114, 101);

          height: sz(35);
          text-align: left;
          &:nth-child(1) {
            padding-left: sz(10);

            div {
              @include word-hidden(sz(93));
            }
          }
          &:nth-child(2),
          &:nth-child(5) {
            div {
              @include word-hidden(sz(98));
            }
          }
          &:nth-child(3),
          &:nth-child(4) {
            div {
              @include word-hidden(sz(95));
            }
          }
        }
      }
    }
  }
</style>
