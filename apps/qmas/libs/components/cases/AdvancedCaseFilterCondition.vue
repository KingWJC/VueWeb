<template>
  <div class="advanced-case-filter-condition">
    <div class="advanced-case-filter-condition__conditiontext clearfix">
      <div class="advanced-case-filter-condition__conditiontext-type">
        <select-dropdown-v2
          v-model="selectedType"
          :useTeleporter="true"
          :dropDownMaxHeight="210"
          :dropDownTopMargin="6"
          :searchable="false"
          :options="allContentTypes"
          label="Text"
          trackBy="Value"
          optionsLogicClassName="advanced-case-filter-condition-dropdown"
          @optionChanged="changeContentType">
        </select-dropdown-v2>
      </div>

      <!--患者姓名(0), 住院流水号(1), 反馈原因(6)-->
      <template
        v-if="selectedType.Value === 0 ||
          selectedType.Value === 1 ||
          selectedType.Value === 6 ||
          selectedType.Value === 7
        ">
        <div class="advanced-case-filter-condition__conditiontext-include">
          <select-dropdown-v2
            v-model="selectedSearchWay"
            :useTeleporter="true"
            :dropDownMaxHeight="210"
            :searchable="false"
            :options="filterParams.searchWayList"
            label="Text"
            trackBy="Value"
            optionsLogicClassName="advanced-case-filter-condition-dropdown"
            @optionChanged="changeContentType">
          </select-dropdown-v2>
        </div>

        <div class="advanced-case-filter-condition__conditiontext-content">
          <input v-model="textContent"
            class="advanced-case-filter-condition__conditiontext-content-txt" />
        </div>
      </template>

      <!--医生姓名-->
      <template v-if="selectedType.Value===2">
        <div
          class="advanced-case-filter-condition__conditionlabel-includelabel">
          是
        </div>

        <div class="advanced-case-filter-condition__conditionlabel-content">
          <select-dropdown-v2
            v-model="selectedDoc"
            :useTeleporter="true"
            :dropDownMaxHeight="210"
            :isFilterable="true"
            :options="filterParams.doctorsList"
            label="DOCTOR_NAME"
            trackBy="DOCTOR_CODE"
            inputPlaceholder="请输入选择"
            optionsLogicClassName="advanced-case-filter-condition-dropdown"
            @optionChanged="changeContentType">
          </select-dropdown-v2>
        </div>
      </template>

      <!--质控点-->
      <template v-if="selectedType.Value===5">
        <div class="advanced-case-filter-condition__content-include">
          <select-dropdown-v2
            v-model="selectedSd"
            :useTeleporter="true"
            :dropDownMaxHeight="210"
            :searchable="false"
            :options="filterParams.sdsList"
            label="SD_NAME"
            trackBy="SD_ID"
            optionsLogicClassName="advanced-case-filter-condition-dropdown"
            @optionChanged="changeContentType">
          </select-dropdown-v2>
        </div>

        <div class="advanced-case-filter-condition__content-content">
          <div
            :class="{
              'advanced-case-filter-condition__content-select--active':
                showQualityPoints
            }"
            class="advanced-case-filter-condition__content-select"
            @click="toggleQualityPointDisplay">
            <span :title="kpisTitle">{{ kpisTitle }}</span>
          </div>
        </div>
      </template>

      <span class="advanced-case-filter-condition__content-operation">
        <a
          :class="{
            'advanced-case-filter-condition__content-operation-oper--disabled':
              orphanCond
          }"
          :title="!orphanCond ? '删除条件' : ''"
          class="advanced-case-filter-condition__content-operation-jian"
          href="javascript:;"
          @click="removeCondition">-</a>
        <a
          :class="{
            'advanced-case-filter-condition__content-operation-oper--disabled':
              conditionLimit
          }"
          :title="!conditionLimit ? '添加条件' : ''"
          class="advanced-case-filter-condition__content-operation-jia"
          href="javascript:;"
          @click="addCondition">+</a>
      </span>
    </div>

    <!-- 质控点浮层 -->
    <teleporter>
      <senior-quality-points
        ref="qualityPointsLayer"
        :display="showQualityPoints"
        :qualityPoints="qualityPoints"
        :selectedQualityPointsMap="selectedQualityPointsMap"
        @confirmSelect="confirmQualityPointSelect"
        @cancelSelect="showQualityPoints = false"
        @resetSelect="resetQualityPointSelect">
      </senior-quality-points>
    </teleporter>
  </div>
</template>

<script>
  import $ from "jquery";
  import Axios from "axios";
  import SeniorQualityPoints from "./SeniorQualityPoints";

  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "advanced-case-filter-condition",

    components: {
      SeniorQualityPoints
    },

    // 自定义 v-model
    model: {
      prop: "checkedOptions",
      event: "syncCheckedOptions"
    },

    props: {
      // v-model 使用
      checkedOptions: {
        type: Object,
        default() {
          return {};
        }
      },

      // 是否是孤儿条件（唯一条件，需要置灰“-”按钮）
      orphanCond: {
        type: Boolean,
        default: false
      },
      // 是否超过五条（限制条件，需要置灰“+”按钮）
      conditionLimit: {
        type: Boolean,
        default: false
      },

      filterParams: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      // 可选类型列表（高级搜索不支持类型：病种（3）和科室（4）
      let allContentTypes = this.filterParams.contentTypes.filter((item) => {
        return item.Value !== 3 && item.Value !== 4;
      });

      return {
        // 质控点浮层
        showQualityPoints: false,
        // 当前条件对应的可用质控点
        qualityPoints: [],
        // 当前条件下已选择的质控点 map (带 value)
        selectedQualityPointsMap: {},

        // 可用类型
        allContentTypes,
        selectedType: allContentTypes[0],

        selectedSd: this.filterParams.sdsList[0],
        selectedSearchWay: this.filterParams.searchWayList[0],
        selectedDoc: this.filterParams.doctorsList[0],

        // 输入框模型
        textContent: "",

        // 用来临时存储质控点
        kpiList: [],

        // 滚动计时器
        scrollDebouncer: null
      };
    },

    computed: {
      // 质控点选择提示文案
      kpisTitle() {
        return `已选择${this.kpiList.length}个质控点`;
      }
    },

    watch: {
      // 质控点浮层展开的时候要重定位到当前行
      showQualityPoints(bool) {
        // 打开
        if (bool) {
          this.updateLayerPosition();
        }
      },

      // input框发生变化及时更新
      textContent() {
        // 调用同步逻辑
        this.callSyncLogic();
      }
    },

    mounted() {
      // 添加滚动事件，只要滚动了，就同步更新质控点浮层的位置
      $(this.$el.parentNode).scroll(() => {
        // 如果质控点浮层处于打开状态，就要同步更新位置
        if (this.showQualityPoints) {
          // 清空计时器
          this.scrollDebouncer && clearTimeout(this.scrollDebouncer);

          this.scrollDebouncer = setTimeout(() => {
            this.updateLayerPosition();
          }, 20);
        }
      });
    },

    methods: {
      // 同步从下游传来的质控点数据（可能从确定/重置）
      doUpdateQualityPoint(pointsMap) {
        // 确定按钮关闭质控点对话框，重置按钮则继续保持打开状态
        // 同步更新已选择的质控点
        this.selectedQualityPointsMap = pointsMap;

        // 生成随机唯一整数ID，用于对质控点进行分组（不然后端在进行“任一”搜索的时候，相同
        // 病种下的质控点没有办法进行区分）
        let uniqueGroupId = parseInt(Math.random() * 100000);

        // 取出并拼接所有kpi参数
        this.kpiList = Object.keys(pointsMap).reduce((tempList, key) => {
          // 取出所有非 2 的（即选择了值的）
          if (pointsMap[key] !== 2) {
            tempList.push({
              GroupId: uniqueGroupId,
              SdId: this.selectedSd.SD_ID,
              KpiId: key,
              Val: pointsMap[key]
            });
          }

          return tempList;
        }, []);

        // 在质控点变更之后要同步 v-model
        this.callSyncLogic();
      },

      // 重置选择质控点（不需要关闭质控点选择框）
      resetQualityPointSelect(pointsMap) {
        this.doUpdateQualityPoint(pointsMap);
      },

      // 确定选择质控点
      confirmQualityPointSelect(pointsMap) {
        // 选择完成之后关闭浮层
        this.showQualityPoints = false;
        this.doUpdateQualityPoint(pointsMap);
      },

      // 够建一个什么都没选的空 map
      buildSelectedQualityPointsMap() {
        return this.qualityPoints.reduce((tmpMap, curItem) => {
          // 2 表示什么都没选(只要是任何非 0/1 的值就行)
          tmpMap[curItem.KPI_ID] = 2;

          return tmpMap;
        }, {});
      },

      // 高级搜索中的质控点数据
      fetchQualityPoints() {
        let sdId = this.selectedSd.SD_ID;

        // 清空之前的质控点
        this.qualityPoints = [];

        Axios.get(resolveApiRoute(
          "quality-point-list",
          {
            SdId: sdId
          }
        )).then((res) => {
          if (res.data.Code === 0) {
            // 所有质控点
            this.qualityPoints = res.data.Data.Data;
            // 清空已选择的质控点
            this.selectedQualityPointsMap =
              this.buildSelectedQualityPointsMap();
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$showNotice("网络异常", "failed");
        });
      },

      // 是否显示质控点
      toggleQualityPointDisplay() {
        // 没有任何质控点的时候，不操作（请求进行过程中也不操作）
        if (this.qualityPoints.length === 0) {
          return;
        }

        this.showQualityPoints = !this.showQualityPoints;
      },

      // 任一一个下拉框发生变更之后，都要清空输入框和已选择质控点
      changeContentType() {
        this.kpiList = [];
        this.textContent = "";

        // 如果是选择质控点，先从api预取新的质控点
        if (this.selectedType.Value === 5) {
          this.fetchQualityPoints();
        }

        this.callSyncLogic();
      },

      // 添加高级搜索条件
      addCondition() {
        // 只要是添加/删除，就直接关掉质控点浮层
        if (!this.conditionLimit) {
          this.showQualityPoints = false;
          this.$emit("addCondition");
        }
      },

      // 删除高级搜索条件
      removeCondition() {
        // 如果只有一个条件了，禁止继续删除操作
        if (!this.orphanCond) {
          // 只要是添加/删除，就直接关掉质控点浮层
          this.showQualityPoints = false;
          this.$emit("removeCondition");
        }
      },

      // 同步 v-model 逻辑
      callSyncLogic() {
        let text, way;

        // 有输入框的字段
        if (
          this.selectedType.Value === 0 ||
          this.selectedType.Value === 1 ||
          this.selectedType.Value === 6 ||
          this.selectedType.Value === 7
        ) {
          text = this.textContent.trim();
          way = this.selectedSearchWay.Value;
        } else if (this.selectedType.Value === 2) {
          // else-if: 医生：直接使用医生code作为 Content
          text = this.selectedDoc.DOCTOR_NAME;
          way = 4;
        }

        // 如果是输入框类型（或者医生）
        if (
          this.selectedType.Value === 0 ||
          this.selectedType.Value === 1 ||
          this.selectedType.Value === 2 ||
          this.selectedType.Value === 6 ||
          this.selectedType.Value === 7
        ) {
          this.$emit("syncCheckedOptions", {
            ContentType: this.selectedType.Value,
            Way: way,
            Content: text
          });
        } else if (this.selectedType.Value === 5) {
          // else-if: 质控点，拼接成api需要的格式（数组）
          this.$emit("syncCheckedOptions", {
            ContentType: this.selectedType.Value,
            Kpis: this.kpiList
          });
        }
      },

      // 更新质控点浮层位置(需要在：打开，添加/删除，滚动的位置更新)
      updateLayerPosition() {
        // 当前行的偏移
        let rowOffset = $(this.$el).offset();
        // 当前行的高度
        let rowHeight = $(this.$el).height();

        this.$nextTick(() => {
          // 重定位质控点浮层位置
          $(this.$refs.qualityPointsLayer.$el).css({
            left: `${rowOffset.left + 9}px`,
            top: `${rowOffset.top + rowHeight + 2}px`
          });
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .advanced-case-filter-condition {
    &__content,
    &__conditiontext,
    &__conditionlabel {
      border-radius: sz(4);
      height: sz(24);
      margin-top: sz(7);

      &-type,
      &-include,
      &-content {
        float: left;
        margin-left: sz(10);
        width: sz(100);
        background: map-get($colors, pure-white);

        .select-dropdown-v2 {
          width: sz(100);
        }
      }

      &-type {
        @include border-radius(5px);
      }

      &-include {
        @include border-radius(5px 0 0 5px);

        border-right: 0;

        .select-dropdown-v2 {
          width: sz(70);
          &__selected {
            &-plain {
              padding: 0 sz(8);
            }
          }
        }
      }

      &-operation {
        float: right;
        margin: 1px sz(25) 0 0;

        @at-root #{get-bem-root()} & {
          &-jian,
          &-jia {
            @include border-radius(50%);

            display: inline-block;
            width: sz(14);
            height: sz(14);
            line-height: sz(12);
            text-align: center;
            padding: sz(2);
            font-style: normal;
            border: 1px solid map-get($colors, theme-blue);
            color: map-get($colors, theme-blue);
            background: map-get($colors, pure-white);
            margin-right: sz(10);
          }

          // 按钮屏蔽操作状态
          &-oper {
            &--disabled {
              cursor: default;
              color: map-get($colors, dropdown-box-border);
              border-color: map-get($colors, dropdown-box-border);
            }
          }
        }
      }
    }

    //质控点
    &__content {
      &-content {
        @include border-radius(0 5px 5px 0);

        margin-left: 0;
        width: sz(180);
      }

      &-include {
        width: sz(135);

        .select-dropdown-v2 {
          width: sz(135);

          &__selected {
            @include border-radius(5px 0 0 5px);

            border-right: 0;

            &-plain {
              padding: 0 sz(15) 0 sz(8);
            }
          }

          &--open {
            .select-dropdown-v2 {
              &__selected {
                @include border-radius(5px 0 0 5px);
              }
            }
          }
        }
      }

      &-select {
        @include border-radius(0 4px 4px 0);

        position: relative;

        > span {
          font-size: map-get($font-sizes, xs);
          padding: sz(3) 0 0 sz(10);

          &:after {
            @include transform(rotate(135deg));

            content: "";
            display: inline-block;
            position: absolute;
            top: sz(6);
            right: sz(10);
            width: sz(5);
            height: sz(5);
            border-right: 1px solid map-get($colors, text-light);
            border-top: 1px solid map-get($colors, text-light);
          }
        }

        &--active {
          > span {
            &::after {
              @include transform(rotate(-45deg));

              top: sz(9);
            }
          }
        }

        border: 1px solid rgba(map-get($colors, border-gray), 0.6);
        background: map-get($colors, pure-white);
        height: sz(22);
      }
    }

    //医生姓名行
    &__conditionlabel {
      &-includelabel {
        float: left;
        margin: 0 sz(20);
        line-height: sz(24);
      }

      &-includelabel,
      &-content {
        @include border-radius(5px);
      }

      &-content {
        @include border-radius(5px);

        margin-left: 0;

        .select-dropdown-v2 {
          width: sz(100);

          &__selected {
            &-plain {
              padding: 0 sz(8);
            }

            &-input {
              height: sz(22);
              line-height: sz(22);
              font-size: map-get($font-sizes, xs);

              &-wrapper {
                padding: 0 sz(8);
              }
            }
          }
        }
      }
    }
    //带文本框input（患者姓名）
    &__conditiontext {
      &-content-txt {
        @include border-radius(5px);

        border: 1px solid map-get($colors, border-gray);
        width: sz(180);
        height: sz(24);
        line-height: sz(24);
        padding: 0 sz(10);
        font-size: map-get($font-sizes, xs);

        &:focus {
          border: 1px solid map-get($colors, theme-blue);
        }
      }

      &-content {
        @include border-radius(5px);

        width: sz(180);
      }

      &-include {
        @include border-radius(5px);

        width: sz(70);
      }
    }

    @at-root {
      .advanced-case-filter-condition-dropdown {
        .select-dropdown-v2-options__items-item {
          height: sz(22);
          line-height: sz(22);
          font-size: map-get($font-sizes, xs);
          padding-left: sz(10);
        }
      }
    }
  }
</style>
