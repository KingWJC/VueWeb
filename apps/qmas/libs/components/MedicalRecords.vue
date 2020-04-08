<template>
  <div class="medical-records">
    <div class="medical-records__filter">
      <select-dropdown-v2
        v-model="selectedActiveObj"
        :isFilterable="true"
        :options="selectedOptions"
        label="name"
        trackBy="id"
        @optionChanged="selectview">
      </select-dropdown-v2>
    </div>

    <!-- 表头一直存在 不管有没有数据 -->
    <table class="medical-records__fir-tablehead">
      <thead>
        <tr>
          <th v-for="(item, mindex) in mainDataApplyField"
            :key="mindex">
            <div>{{ item.title }}</div>
          </th>
        </tr>
      </thead>
    </table>

    <template v-if="originalData">
      <template v-if="mainDataList.length > 0">
        <div class="medical-records__fir">
          <p v-if="activeMainList.length > 0"
            :class="{
              'medical-records__fir-left--active': leftHandler
            }"
            class="medical-records__fir-left"
            @click="getLeft">
          </p>

          <template v-if="mainDataList.length > 0">
            <table class="medical-records__fir-table">
              <tbody class="medical-records__fir-table-toby">
                <tr
                  v-for="(item, kindex) in activeMainList"
                  :key="kindex"
                  :class="{
                    'medical-records__fir-table-toby-trs--active':
                      curItem === kindex
                  }"
                  class="medical-records__fir-table-toby-trs"
                  @click="subIns(item[subIdField], kindex)">
                  <td v-for="(subitem, findex) in mainDataApplyField"
                    :key="findex"
                    :title="item[subitem.field]">
                    <div>{{ item[subitem.field] }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <p v-if="activeMainList.length > 0"
            :class="{
              'medical-records__fir-right--active': rightHandler
            }"
            class="medical-records__fir-right"
            @click="getRight">
          </p>
        </div>

        <!-- 翻页 -->
        <dots-paginator
          :totalRecords="totalRecords"
          :pageSize="pageSize"
          :curPage="curPage"
          @changePage="changePage">
        </dots-paginator>

        <!-- 子表 -->
        <!-- 避免先出现无数据 在展示列表情况 -->
        <template v-if="insAll">
          <template v-if="isSubInsShowData">
            <div class="medical-records__content">
              <slot :options="insAll"
                name="describe">
                <p class="medical-records__content-title">客观所见</p>
                <p class="medical-records__content-msg">
                  {{ insAll.REPORT_OBJECTIVE }}
                </p>
                <p class="medical-records__content-title">主观结论</p>
                <p class="medical-records__content-msg">
                  {{ insAll.REPORT_SUBJECTIVE }}
                </p>
              </slot>
            </div>
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
  import DotsPaginator from "__shared-libs/components/paginator/DotsPaginator";
  import QaNoContent from "__libs/components/QaNoContent";
  import getPaginationData from "__shared-libs/js/modules/get-pagination-data";

  export default {
    name: "medical-records",

    components: {
      DotsPaginator,
      QaNoContent
    },

    props: {
      // 病例信息 子表请求数据用
      patientObj: {
        type: Object,
        default() {
          return {};
        }
      },

      // 主表数据列表
      mainDataList: {
        type: Array,
        default() {
          return [];
        }
      },

      // 原始数据
      originalData: {
        type: Array,
        default() {
          return null;
        }
      },

      // 主表动态渲染 title 和字段的对象数组
      mainDataApplyField: {
        type: Array,
        default() {
          return [];
        }
      },

      // 子表 id 字段
      subIdField: {
        type: String,
        default: ""
      },

      // 主表元数据下拉框筛选字段名
      mainDataSelectNameField: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        // 下拉框相关数据
        selectedActiveObj: {
          name: "全部",
          id: "*"
        },
        selectedOptions: [],

        // 子列表数据
        insAll: null,

        // 当前页列表数据
        activeMainList: [],

        // 筛选后的主表数据 为了不同方法间传值(中间量) 例  筛选后的数据   传入翻页器
        filterMainList: [],

        // 左右翻页按钮
        leftHandler: true,
        rightHandler: true,

        // 小圆点翻页组件元数据，至少这三条
        totalRecords: 0,
        pageSize: 5,
        curPage: 1,

        // 子表无数据展示控制
        isSubInsShowData: true,

        // 点击的目标行index
        curItem: 0
      };
    },

    watch: {
      totalRecords: "howManyPages",
      patientObj: "resetView",

      mainDataList(val) {
        this.activeMainList = getPaginationData(0, this.pageSize, val);
        this.totalRecords = val.length;
        this.selectedOptions = this.getSelectOpt(
          val,
          this.mainDataSelectNameField
        );
        this.selectview();
      }
    },

    methods: {
      // 左右翻页按钮
      howManyPages() {
        if (Math.ceil(this.totalRecords / this.pageSize) <= 1) {
          this.leftHandler = true;
          this.rightHandler = true;
        }
      },

      // 翻页左点击
      getLeft() {
        let tmpPage = this.curPage - 1;

        if (tmpPage < 1) {
          return;
        }

        this.changePage(tmpPage);
      },

      // 翻页右点击
      getRight() {
        let totalPages = Math.ceil(this.totalRecords / this.pageSize);
        let tmpPage = this.curPage + 1;

        if (tmpPage > totalPages) {
          return;
        }

        this.changePage(tmpPage);
      },

      // v2数据初始化
      getSelectOpt(source, field) {
        let newList = [],
            hash = {};

        hash = source.reduce((hash, item) => {
          hash[item[field]] = 1;

          return hash;
        }, {});

        newList = Object.keys(hash).reduce((tmpList, curItem, index) => {
          // 去重条件
          if (tmpList.indexOf(curItem) === -1) {
            tmpList.push({
              name: curItem,
              id: index
            });
          }

          return tmpList;
        }, []);

        newList.unshift({
          name: "全部",
          id: "*"
        });

        return newList;
      },

      // v2下拉选择触发
      changePage(pageNum) {
        this.curPage = pageNum;
        this.activeMainList = getPaginationData(
          (this.curPage - 1) * this.pageSize,
          this.pageSize,
          this.filterMainList
        );

        // 目标页 不是第一或最后一页 handlerbtn 都激活状态
        if (
          this.curPage > 1 &&
          this.curPage < Math.ceil(this.totalRecords / this.pageSize)
        ) {
          this.rightHandler = false;
          this.leftHandler = false;
        } else if (
          this.curPage === 1 &&
          Math.ceil(this.totalRecords / this.pageSize) > 1
        ) {
          // else: 目标页是第一页 并且 翻页器页数大于 1 页 右边h andler 激活 反之禁用
          this.rightHandler = false;
          this.leftHandler = true;
        } else if (
          // else: 目标页不是第一页 并且 目标页等于翻页器页数 左边 handler 激活 反之禁用
          this.curPage !== 1 &&
          this.curPage === Math.ceil(this.totalRecords / this.pageSize)
        ) {
          this.leftHandler = false;
          this.rightHandler = true;
        } else if (
          // else: 目标页是第一页 并且 翻页器只有一页  两边 handler 禁用
          this.curPage === 1 &&
          Math.ceil(this.totalRecords / this.pageSize) === 1
        ) {
          this.leftHandler = true;
          this.rightHandler = true;
        }

        if (this.activeMainList.length > 0) {
          this.subIns(
            this.filterMainList[(this.curPage - 1) * 5][this.subIdField],
            0
          );
        } else {
          this.isSubInsShowData = false;
        }
      },

      // 筛选数据
      selectview() {
        this.curPage = 1;

        if (this.selectedActiveObj.name === "全部") {
          this.filterMainList = this.mainDataList;
          this.activeMainList = getPaginationData(
            0,
            this.pageSize,
            this.filterMainList
          );
          this.totalRecords = this.filterMainList.length;
        } else {
          this.filterMainList = this.mainDataList.reduce((tmpList, item) => {
            if (
              item[this.mainDataSelectNameField] === this.selectedActiveObj.name
            ) {
              tmpList.push(item);
            }

            return tmpList;
          }, []);

          this.activeMainList = getPaginationData(
            0,
            this.pageSize,
            this.filterMainList
          );
          // 首次渲染第一个表格的第一条
          this.subIns(this.filterMainList[0][this.subIdField], 0);
          this.totalRecords = this.filterMainList.length;
        }

        this.changePage(this.curPage);
      },

      nulls(str) {
        return str === "" ||
          str === null ||
          str === undefined
          ? true
          : false;
      },

      resetView() {
        this.selectedActiveObj = {
          name: "全部",
          id: "*"
        };
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .medical-records {
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

    &__content {
      background: map-get($colors, tab-bg);
      height: sz(204);
      overflow: auto;

      &-title,
      &-msg {
        font-style: normal;
        line-height: sz(30);
        margin: 0 0 0 sz(10);
        display: block;
        color: map-get($colors, text-light);
      }

      &-title {
        font-size: map-get($font-sizes, sm);
        color: map-get($colors, text-main);
        margin-top: sz(10);
      }
    }

    &__fir {
      position: relative;

      &:hover {
        #{get-bem-root()}__fir-left {
          display: block;
        }

        #{get-bem-root()}__fir-right {
          display: block;
        }
      }

      &-tablehead,
      &-table {
        @include unify-table-ui();

        thead {
          > tr {
            height: sz(50);
          }
        }

        th,
        td {
          @include table-sizes(358, 120, 120, 120);

          padding: 0;

          &:nth-child(1) {
            text-align: left;
            padding-left: sz(10);

            div {
              @include word-hidden(sz(322));
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
        border-top: 1px solid map-get($colors, border-gray);
        margin-top: sz(10);
      }

      &-left {
        @include border-radius(50%);

        background-color: rgba(map-get($colors, pure-black), 0.2);
        width: sz(35);
        height: sz(35);
        position: absolute;
        top: 35%;
        left: 0;
        cursor: pointer;
        display: none;

        &::after {
          @include transform(rotate(45deg));

          content: "";
          display: block;
          position: absolute;
          top: 68%;
          left: 35%;
          margin-top: sz(-12);
          width: sz(11);
          height: sz(11);
          border-left: 1px solid map-get($colors, pure-white);
          border-bottom: 1px solid map-get($colors, pure-white);
        }

        &--active {
          background-color: rgba(map-get($colors, pure-black), 0.1);
          cursor: default;
        }
      }

      &-right {
        @include border-radius(50%);
        background-color: rgba(map-get($colors, pure-black), 0.2);
        width: sz(35);
        height: sz(35);
        position: absolute;
        top: 35%;
        left: 95%;
        cursor: pointer;
        display: none;

        &::before {
          @include transform(rotate(45deg));

          content: "";
          display: block;
          position: absolute;
          top: 68%;
          left: 25%;
          margin-top: sz(-12);
          width: sz(11);
          height: sz(11);
          border-right: 1px solid map-get($colors, pure-white);
          border-top: 1px solid map-get($colors, pure-white);
        }

        &--active {
          background-color: rgba(map-get($colors, pure-black), 0.1);
          cursor: default;
        }
      }
    }

    .dots-paginator {
      margin: sz(10) 0;
    }
  }
</style>
