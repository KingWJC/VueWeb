<template>
  <div class="disease-list">
    <accordions
      :activeAccordionName="activeAccordionName"
      @changeAccordion="changeAccordion">

      <accordion-item
        v-for="item in accordionList"
        :accordionName="`${item.SD_ID}`"
        :key="item.SD_ID">

        <td :title="item.SD_NAME">
          <div class="disease-list__sdname">
            {{ item.SD_NAME }}
          </div>
        </td>
        <td>{{ item.MonitorCPatCount }}</td>
        <td>
          <span
            :class="{
              'disease-list__susprate--warn': item.SdStatus === 0,
              'disease-list__susprate--normal': item.SdStatus === 1 ||
                item.SdStatus === 2
            }"
            class="disease-list__susprate">
            {{ item.SuspRate }}%
            <span>({{ item.SuspCount }}/{{ item.QualityPointCount }})</span>
          </span>
        </td>
        <td>
          <template v-if="item.IS_DISPLAY === 0">
            <div class="disease-list__war-line">--</div>
          </template>
          <template v-else-if="item.SuspRateBaseLine === '-'">
            <div class="disease-list__war-line">--</div>
          </template>
          <template v-else>{{ item.SuspRateBaseLine }}%</template>
        </td>
        <td>
          <template v-if="item.FactorialRate === '-'">
            <div>--</div>
          </template>
          <template v-else>
            {{ item.FactorialRate }}%
            <span>({{ item.FactorialCount }}/{{ item.SuspCount }})</span>
          </template>
        </td>
        <td>
          <i
            :class="{
              'disease-list__star--active': item.IsCollect
            }"
            class="disease-list__star"
            @click.stop="
              setStarStatus(item.SD_ID, item.SD_CODE, !item.IsCollect)
            ">
          </i>

          <a :href="sdIndexUrl(item)"
            class="disease-list__view-index-btn"
            @click.stop>
            查看指标
          </a>
        </td>
        <!-- 滚动条占位 -->
        <td></td>

        <!-- BEGIN 趋势 Tabs -->
        <round-tabs
          v-if="activeAccordionName === `${item.SD_ID}`"
          :activeTabName="activeTrendsTabName"
          @changeTab="changeTabs">

          <basic-tab tabName="trendsTab"
            tabLabel="趋势">
            <template v-if="tendencyDiagramData">
              <a
                v-if="allowSetBaseline && !isShowBaseline"
                href="javascript:;"
                class="btn disease-list__setbaseline"
                @click="activeSetting">
                设置
              </a>

              <trend-set-box
                :setList="typeDataMap[activeAccordionName]"
                @saveSetResult="saveSetResult">
              </trend-set-box>

              <qa-tenden-sub
                :activeAccuracyCode="selectedAccuracy"
                :diagramData="tendencyDiagramData"
                :isDisplay="item.IS_DISPLAY"
                :baselineValue="item.SuspRateBaseLine">
              </qa-tenden-sub>

              <template v-if="!isShowBaseline">
                <statistics-accuracy
                  :accuracyItems="accuracyItems"
                  :activeAccuracyCode="selectedAccuracy"
                  @accuracyChange="accuracyChange">
                </statistics-accuracy>

                <div class="disease-list__jumpcase">
                  <template v-if="relCasesSd">
                    <a :href="casesUrl"
                      class="btn disease-list__jumpcase-cases"
                      target="_blank">
                      相关病例
                    </a>
                  </template>

                  <template v-if="relSuspCasesSd">
                    <a :href="casesSuspUrl"
                      class="btn disease-list__jumpcase-cases"
                      target="_blank">
                      相关可疑病例
                    </a>
                  </template>
                </div>
              </template>
              <template v-else>
                <baseline-set
                  :isDisplay="item.IS_DISPLAY"
                  :baselineValue="item.SuspRateBaseLine"
                  indexType="war"
                  @saveSet="saveBaselineSet(item.SD_ID, arguments[0])"
                  @cancelSet="cancelBaselineSet">
                </baseline-set>
              </template>
            </template>
          </basic-tab>

          <basic-tab tabName="departmentTab"
            tabLabel="科室">
            <!-- 如果没有激活科室tabs，就不渲染（级联组件会在渲染的时候
            通知父组件发送请求） -->
            <template v-if="activeTrendsTabName === 'departmentTab'">
              <dept-cascade-drill
                :accuracyItems="accuracyItemsPack(item.SD_ID, 'accuracyItems')"
                :currentTitle="drillTitle"
                :drillUpType="resolveObj(item.SD_ID, 'drillUpType')"
                :drilldownType="resolveObj(item.SD_ID, 'drilldownType')"
                @upDrillList="upDrillList"
                @nextDrill="nextDrill">
              </dept-cascade-drill>

              <template v-if="originalDeptData">
                <template v-if="diagramData">
                  <qa-column-diagram
                    :diagramData="diagramData"
                    @levelMenu="drillLevelMenuSub('SD_ID', arguments[0])">
                  </qa-column-diagram>
                </template>
                <template v-else>
                  <!-- eslint-disable-next-line max-len -->
                  <qa-no-content :title="`当前时间(${dateRange.startDate}~${dateRange.endDate}) 【${item.SD_NAME}】 ${noDataMsg}`">
                  </qa-no-content>
                </template>
              </template>
            </template>
          </basic-tab>

          <basic-tab tabName="analyticsTab"
            tabLabel="原因汇总">
            <template v-if="item.MonitorCPatCount > 0">
              <template v-if="causeAnalysisData">
                <template
                  v-if="
                    causeAnalysisData.Reason &&
                      causeAnalysisData.Reason.length > 0
                  ">
                  <p class="disease-list__cause-analysis-title">
                    【{{ item.SD_NAME }}】{{ item.KPICount }}个监测指标对应产生
                    {{ causeAnalysisData.Reason.length }} 种原因，汇总如下
                  </p>

                  <cause-analysis
                    v-if="
                      activeTrendsTabName === 'analyticsTab' &&
                        causeAnalysisData
                    "
                    :caseAll="causeAnalysisData">
                  </cause-analysis>
                </template>
                <template v-else>
                  <!-- 无饼图展示 -->
                  <!-- eslint-disable-next-line max-len -->
                  <qa-no-content :title="`当前时间(${dateRange.startDate}~${dateRange.endDate}) 【${item.SD_NAME}】 没有相关原因反馈信息`">
                  </qa-no-content>
                </template>
              </template>
            </template>
            <template v-else>
              <!-- 无饼图展示 -->
              <!-- eslint-disable-next-line max-len -->
              <qa-no-content :title="`当前时间(${dateRange.startDate}~${dateRange.endDate}) 【${item.SD_NAME}】 没有相关病例`">
              </qa-no-content>
            </template>
          </basic-tab>
        </round-tabs>
        <!-- END 趋势 Tabs -->
      </accordion-item>
    </accordions>
  </div>
</template>

<script>
  import Axios from "axios";

  import RoundTabs from "__shared-libs/components/tabs/round-tabs/Tabs";
  import BasicTab from "__shared-libs/components/tabs/basic-tabs/Tab";

  import Accordions from "__shared-libs/components/accordions/Accordions";
  import AccordionItem from "__shared-libs/components/accordions/AccordionItem";
  import CauseAnalysis from "__libs/components/CauseAnalysis";
  import QaNoContent from "__libs/components/QaNoContent";
  import QaColumnDiagram from "__libs/components/QaColumnDiagram";
  import DrillIndexList from "__libs/components/DrillIndexList";
  import DeptCascadeDrill from "__libs/components/DeptCascadeDrill";
  import ZoomPillarDiagram from "__libs/components/ZoomPillarDiagram";
  import LayerPie from "__libs/components/LayerPie";
  import Plato from "__libs/components/Plato";
  import QaTendenSub from "__libs/components/QaTendenSub";
  import StatisticsAccuracy from "__libs/components/StatisticsAccuracy";
  import BaselineSet from "__libs/components/BaselineSet";

  import { groupingData } from "__libs/js/modules/sd-layer-chart-data-filter";
  import getCasesPathStr from "__libs/js/modules/get-cases-path-str";
  import getAccurcyDateRange from "__libs/js/modules/get-accuracy-date-range";
  import saveBaseline from "__libs/js/modules/save-baseline";
  import { mapGetters } from "vuex";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import resolveMvcRoute from "__libs/js/modules/resolve-mvc-route";
  import resolveSpaRoute from "__shared-libs/js/modules/resolve-spa-route";
  import sdIndexRouteMap from "__pages/sdindex/route-map";
  import sdLayerRouteMap from "__pages/sdlayer/route-map";
  import formatXAxisDateTime from "__libs/js/modules/format-x-axis-date-time";
  import TrendSetBox from "__libs/components/TrendSetBox";
  import TrendDeptSetting from "__libs/components/TrendDeptSetting";

  export default {
    name: "disease-list",

    components: {
      RoundTabs,
      BasicTab,

      Accordions,
      AccordionItem,

      QaTendenSub,
      QaColumnDiagram,
      ZoomPillarDiagram,
      LayerPie,
      CauseAnalysis,
      QaNoContent,
      DeptCascadeDrill,
      Plato,
      StatisticsAccuracy,
      BaselineSet,
      TrendSetBox
    },

    mixins: [
      DrillIndexList,
      TrendDeptSetting
    ],

    props: {
      // 折叠面板（它的值是病种的 SD_ID）
      activeAccordionName: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        // 默认展示趋势tabs
        activeTrendsTabName: "trendsTab",

        // 原因分析数据
        causeAnalysisData: null,

        // 指标tab数据
        indexTabData: null,
        indexDiagramData: null,

        // 科室图api请求返回原始数据
        originalDeptData: null,

        // 传递给科室图子组件的数据对象
        diagramData: null,

        // 传递给患者分组的饼图和柱图数据
        isReady: false,
        sdLayerPieData: null,
        sdLayerColumnData: null,

        // 构建 map，用于存储各个病种对应的科室诊疗组id/code
        // 在每次 accordion 数据即（accordionList）发生变化之后都要重建该 map
        // {
        //   [SD_ID]: {
        //     deptCode: null,
        //     deptName: null,
        //     groupId: null,
        //     groupName: null,
        //     legendType: 'dept'
        //   }
        // }
        accordionCascadeMap: {},

        // 统计精度选项
        accuracyItems: [
          {
            code: "0",
            name: "周"
          },
          {
            code: "1",
            name: "月"
          },
          {
            code: "2",
            name: "季度"
          }
        ],

        // 趋势图表数据
        tendencyDiagramData: null,

        // 统计精度值（从统计精度选项列表里面选择一个值）
        selectedAccuracy: "0",

        // 显示修改预警值的文本框
        isShowBaseline: false,

        // 原始数据
        originTrendData: null
      };
    },

    computed: {
      // 挂载 Vuex getter，用于从中央仓库读入当前 dateRagnge
      // 名称一旦定义，不可同名与现有 'props', 'data', 'computed', 'methods' 冲突！
      ...mapGetters([
        "dateRange",
        "relCasesSd",
        "relSuspCasesSd",
        "allowSetBaseline"
      ]),

      // 生成到病例列表的链接
      casesUrl() {
        return getCasesPathStr(
          {
            diseaseList: [this.activeAccordionName]
          },
          this.dateRange,
          {
            // 表示从 专病或者指标 跳转过去
            isDisOrIdx: true
          }
        );
      },

      // 相关可疑病例（多了一个”可疑“标识）
      casesSuspUrl() {
        return getCasesPathStr(
          {
            diseaseList: [this.activeAccordionName]
          },
          this.dateRange,
          {
            isSusp: true,
            isDisOrIdx: true
          }
        );
      }
    },

    watch: {
      // 折叠出现变化（父组件侦测到路由变化因而主动触发accordion变化）
      activeAccordionName(sdId) {
        // 只有某一个 accordion 被打开的状态，才继续判断是否请求 tabs 的数据
        if (sdId) {
          // 立即切换到趋势 tabs
          this.changeTabs("trendsTab");
        }
      },

      // 时间切换之后会重取accordionList，所以只要这个变化，
      // 我们就重渲tabs里面的图
      accordionList(val) {
        // 直接重渲激活的tabs里面的图
        if (this.activeAccordionName && val.length !== 0) {
          this.changeTabs(this.activeTrendsTabName);
        }
      }
    },

    // 挂载的时候，如果有打开的accordion，就立即切换到第一个tabs（目前
    // 是趋势tabs），触发数据请求并渲染图表
    mounted() {
      // 只有某一个 accordion 被打开的状态，才继续判断是否请求 tabs 的数据
      if (this.activeAccordionName) {
        // 立即切换到趋势 tabs
        this.changeTabs("trendsTab");
      }
    },

    methods: {
      // 保存趋势设置结果
      saveSetResult(result) {
        this.tendencyDiagramData =
          this.filterEchartsOfData(this.getSelectedTypeData(
            this.originTrendData,
            result
        ));
      },

      // 指标页面 跳转链接
      sdIndexUrl(item) {
        // 解析 mvc 路由
        let mvcRoute = resolveMvcRoute("sdindex", {SdCode: item.SD_ID});
        // 解析页面 spa 路由
        let spaRoute = resolveSpaRoute(
          // 页面 spa 路由注册表
          sdIndexRouteMap,
          // 需要解析到的路由名
          "index",
          // 路由参数
          {
            startDate: this.dateRange.startDate,
            endDate: this.dateRange.endDate
          }
        );

        // 拼接前后端路由
        return `${mvcRoute}#${spaRoute}`;
      },

      // 分组页面 跳转链接
      sdLayerUrl(item) {
        // 解析 mvc 路由
        let mvcRoute = resolveMvcRoute("sdlayer", {SdId: item.SD_ID});
        // 解析页面 spa 路由
        let spaRoute = resolveSpaRoute(
          // 页面 spa 路由注册表
          sdLayerRouteMap,
          // 需要解析到的路由名
          "sdlayer",
          // 路由参数
          {
            startDate: this.dateRange.startDate,
            endDate: this.dateRange.endDate
          }
        );

        // 拼接前后端路由
        return `${mvcRoute}#${spaRoute}`;
      },

      // 切换tab
      changeTabs(tabName) {
        // 接收map的id 用于获取每条accordion 的map的对象
        let mapId = this.activeAccordionName;

        this.activeTrendsTabName = tabName;

        // 切换到 趋势tabs
        if (this.activeTrendsTabName === "trendsTab") {
          // TODO 趋势图迁移,请求数据拆到此处
          this.tendencyDiagramData = null;
          this.fetchQaTendencyData();
        } else if (this.activeTrendsTabName === "departmentTab") {
          // else: 切换到 科室tabs
          // 切换tab 清空map对象
          this.accordionCascadeMap[mapId] = null;
          this.diagramData = null;
          this.fetchDeptCaseCadeData();
        } else if (this.activeTrendsTabName === "sdLayerTab") {
          // else: 切换到患者分组
          // 切换tab 清空map对象
          this.accordionCascadeMap[mapId] = null;
          this.sdLayerColumnData = null;
          this.sdLayerPieData = null;
          this.fetchSdLayerPieData();
        } else if (this.activeTrendsTabName === "indexTab") {
          // else: 切换到指标tabs
          this.indexTabData = null;
          this.indexDiagramData = null;
          this.fetchIndexData();
        } else if (this.activeTrendsTabName === "analyticsTab") {
          // else: 切换到 原因分析tabs
          this.causeAnalysisData = null;
          this.fetchAnalysisData();
        }
      },

      // 切换 accordion
      changeAccordion(sdId) {
        // 当前 accordion 就是高亮的，折叠
        if (this.activeAccordionName === sdId) {
          this.$emit("accordionChanged", null);
        } else {
          // 展开 accordion
          this.$emit("accordionChanged", sdId);
        }

        // TODO：重构 drilllist 组件并修复 accordionMap 功能之后，仍要用 map 方案
        // 实现
        this.isShowBaseline = false;
        this.selectedAccuracy = "0";
      },

      // 专病柱图排序（和指标不一样，不要复用！）
      bubbleSort(obj) {
        let len = obj.Susp.length;

        for (let i = 0; i < len; i++) {
          for (let j = 0; j < len - 1 - i; j++) {
            // 相邻元素两两对比
            if (
              Number(obj.Susp[j].SuspRate) < Number(obj.Susp[j + 1].SuspRate)
            ) {
              // 元素交换
              let tempSusp = obj.Susp[j + 1];
              obj.Susp[j + 1] = obj.Susp[j];
              obj.Susp[j] = tempSusp;

              // 元素交换
              let tempFactorial = obj.Factorial[j + 1];
              obj.Factorial[j + 1] = obj.Factorial[j];
              obj.Factorial[j] = tempFactorial;

              // 元素交换
              let tempX = obj.X[j + 1];
              obj.X[j + 1] = obj.X[j];
              obj.X[j] = tempX;
            }
          }
        }

        return obj;
      },

      // 代理发送危机信息（id(sd/kpi)，预警值）到父组件
      baselineChanged(obj) {
        this.$emit("baselineChanged", obj);
      },

      // 收藏 / 取消
      setStarStatus(sdId, sdCode, isCollect) {
        Axios.post(resolveApiRoute("collection"), {
          // 1：病种，2: 指标
          FavId: sdId,
          FavCode: sdCode,
          FavType: 1,
          // 0收藏  1取消收藏
          Operate: isCollect ? 0 : 1
        }).then((res) => {
          // get body data
          if (res.data.Code === 0) {
            if (isCollect) {
              this.$showNotice("收藏成功！");
            } else {
              this.$showNotice("取消收藏！", "failed");
            }

            this.$emit("changeCollectStatus", {
              sdId,
              isCollect
            });
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$showNotice("网络异常", "failed");
        });
      },

      // 趋势精度发生变化
      accuracyChange(val) {
        this.selectedAccuracy = val;
        this.tendencyDiagramData = null;
        this.fetchQaTendencyData();
      },

      // 设置预警值
      activeSetting() {
        this.isShowBaseline = true;
      },

      // 取消设置基线
      cancelBaselineSet() {
        this.isShowBaseline = false;
      },

      // 保存基线设置
      saveBaselineSet(sdId, baselineInfo) {
        let sdCode = this.accordionList.find((item) => {
          return item.SD_ID === parseFloat(this.activeAccordionName);
        }).SD_CODE;

        let baselineValue = baselineInfo.value !== "-"
              ? baselineInfo.value
              : "",
            // 保存基线的类型(0: 专病质量)
            setType = 0;

        saveBaseline(
          this.activeAccordionName,
          sdCode,
          setType,
          baselineValue,
          baselineInfo.display
        ).then((res) => {
          if (res.data.Code === 0) {
            this.$emit(
              "baselineChanged",
              Object.assign(baselineInfo, {id: sdId})
            );
          } else {
            this.$showNotice("服务器异常", "failed");
          }

          // 设置成功之后，取消设置
          this.cancelBaselineSet();
        }, () => {
          // 设置失败，也要取消设置
          this.cancelBaselineSet();
          this.$showNotice("网络异常", "failed");
        });
      },

      // 组件勾选判断
      legendStatus(data) {
        // 都不勾选
        if (!data[0].isSelected && !data[1].isSelected) {
          return 1;
        } else if (data[0].isSelected && !data[1].isSelected) {
          // else: 勾选可疑率
          return 2;
        } else if (!data[0].isSelected && data[1].isSelected) {
          // else: 勾选反馈率
          return 3;
        } else if (data[0].isSelected && data[1].isSelected) {
          // else: 都勾选
          return 4;
        }
      },

      // 过滤echart能使用的数据（父组件传过来的是api原始数据）
      filterEchartsOfData(data) {
        let xAxisValue,
            legendMap = {},
            numerator = [],
            denominator = [],
            sectionTime = data[0].X,

            originalX = data[0].X.map((item) => {
              return item.Item;
            }),

            // 图例数组 构建
            legendList = data.reduce((temp, item) => {
              temp.push(`${item.Item.Name}可疑率`);
              temp.push(`${item.Item.Name}反馈率`);

              return temp;
            }, []);

        data.forEach((item) => {
          for (let i = 0; i < 2; i++) {
            let myMum = [],
                myDen = [];

            item.Y.forEach((subItem) => {
              myMum.push(subItem.Numerator[i]);
              myDen.push(subItem.Denominator[i]);
            });

            numerator.push(myMum);
            denominator.push(myDen);
          }
        });

        let seriesData = data.reduce((seriesArr, item) => {
          for (let i = 0; i < 2; i++) {
            let newArr = item.Y.map((yitem) => {
              return {
                value: yitem.Rate[i],
                datas: [numerator, denominator]
              };
            });

            seriesArr.push(newArr);
          }

          return seriesArr;
        }, []);

        // 判断组件 可疑率 反馈率 勾选情况
        let listDta = this.typeDataMap[this.activeAccordionName][0].ctrlList;
        let res = this.legendStatus(listDta);

        legendMap = legendList.reduce((temp, item, index) => {
          if (index > 1) {
            if (res === 1) {
              temp[item] = false;
            } else if (res === 2) {
              temp[item] = index % 2 ? false : true;
            } else if (res === 3) {
              temp[item] = index % 2 ? true : false;
            } else if (res === 4) {
              temp[item] = true;
            }
          } else {
            temp[item] = true;
          }

          return temp;
        }, {});

        xAxisValue = formatXAxisDateTime(sectionTime, this.selectedAccuracy);

        return {
          xAxisValue,
          sectionTime,
          originalX,
          seriesData,
          legendList,
          legendMap
        };
      },

      // 请求趋势图数据
      fetchQaTendencyData() {
        // 趋势下随着精度变化 实际向后端传递的起始结束时间
        let {
          stTime,
          edTime
        } = getAccurcyDateRange(
          this.selectedAccuracy,
          this.dateRange
        );

        this.$showLoading();

        Axios.get(resolveApiRoute(
          "disease-tendency",
          {
            SdCode: this.activeAccordionName
          }
        ), {
          params: {
            // 0:周，1.月 2季度
            Accuracy: this.selectedAccuracy,
            StartTime: stTime,
            EndTime: edTime
          }
        }).then((res) => {
          this.$hideLoading();

          if (res.data.Code === 0 && res.data.Data.TotalRecord > 0) {
            this.originTrendData = res.data.Data.Data.slice(0);

            // 把数据给子组件，图表组件侦测到变化会自动开始画图
            // 初始化趋势设置下拉框
            this.getTypeData(res.data.Data.Data.slice(0), "sd");

            // 初始化趋势图数据
            let tempMap = this.filterSourceData(res.data.Data.Data.slice(0));
            this.tendencyDiagramData = this.filterEchartsOfData(tempMap);
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$hideLoading();
          this.$showNotice("网络异常", "failed");
        });
      },

      // 请求患者分组数据
      fetchSdLayerPieData() {
        this.isReady = false;

        Axios.get(resolveApiRoute(
          "sd-layer-pie",
          {
            SdId: this.activeAccordionName
          }
        ), {
          params: {
            StartTime: this.dateRange.startDate,
            EndTime: this.dateRange.endDate
          }
        }).then((res) => {
          if (res.data.Code === 0) {
            // 根据 bug #1822,
            // 判空条件改为使用 accordion 监测病例数进行判断，下面数组
            // 里面可能出现全部为 0 的情况，
            // 不能作为判空条件，但是为了和之前判空逻辑相同，保留
            // 未删除
            if (
              res.data.Data.Data[0].X.length !== 0 &&
              res.data.Data.Data[0].Y.length !== 0
            ) {
              // 区分饼图和柱图数据
              let initialData = res.data.Data.Data[0];

              this.sdLayerColumnData = groupingData(initialData)[1];
              this.sdLayerPieData = groupingData(initialData)[0];
            } else {
              this.sdLayerColumnData = null;
              this.sdLayerPieData = null;
            }

            this.isReady = true;
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$showNotice("网络异常", "failed");
        });
      },

      // 请求科室的数据
      fetchDeptCaseCadeData(type) {
        // 先清空原有数据
        this.diagramData = null;
        this.originalDeptData = null;

        let mapId = this.activeAccordionName,
            groupCodeObj = this.resolveObj(mapId, "groupCode"),
            deptCode = this.resolveObj(mapId, "deptCode"),
            groupId = this.resolveObj(mapId, "groupId"),
            paramsObj;

        // 如果是上转请求数据 要么是请求全部科室的全部数据
        // 不然就是请求指定科室的全部诊疗组数据
        if (
          type === "up" &&
          this.resolveObj(mapId, "columnLevel") === "dept"
        ) {
          deptCode = null;
        }

        // 可缩放柱形图  请求API所需路径及参数
        paramsObj = {
          // 开始时间
          StartTime: this.dateRange.startDate,
          // 结束时间
          EndTime: this.dateRange.endDate,
          // 为空查询全部科室 科室编码
          DeptCode: deptCode === null ? "" : deptCode,
          // 为空查询全部诊疗组
          GroupId: ""
        };

        // 如果有科室，就看诊疗组id要传什么
        if (deptCode !== null) {
          // 科室底下存在诊疗组
          if (groupCodeObj === "group") {
            if (groupId === null) {
              paramsObj.GroupId = "";
            } else {
              paramsObj.GroupId = groupId;
            }
          } else if (groupCodeObj === "doctor") {
            // 上转逻辑
            if (type === "up") {
              paramsObj.GroupId = "";
            } else {
              // else: 下转逻辑
              if (groupId === null) {
                paramsObj.GroupId = "*";
              } else {
                paramsObj.GroupId = groupId;
              }
            }
          } else {
            // 不存在诊疗组
            paramsObj.GroupId = "*";
          }
        }

        Axios.get(resolveApiRoute(
          "disease-column-diagram",
          {
            SdCode: mapId
          }
        ), {params: paramsObj}).then((res) => {
          if (res.data.Code === 0) {
            // 如果api没有返回可渲染数据, 构造模拟空数据, 确保图表渲染成功
            if (res.data.Data.Data.length === 0) {
              res.data.Data.Data = [{
                X: [],
                Susp: [],
                Factorial: []
              }];

              // 判断map是否构建   如果没有构建   直接set会出错
              if (this.accordionCascadeMap[mapId]) {
                // 如果返回数据为空(无数据展示时),设置下拉列表为空
                this.setAccuracyItems(mapId, []);
                // 无数据展示组件下转置灰
                this.setObj(mapId, null, "drilldownType");
              }
            }

            this.originalDeptData = res.data.Data.Data[0];

            if (res.data.Data.TotalRecord === 1) {
              // 如果没有 x 轴，可疑率，反馈率，则认为科室柱状图无数据
              if (
                this.originalDeptData.X.length === 0 &&
                this.originalDeptData.Susp.length === 0 &&
                this.originalDeptData.Factorial.length === 0
              ) {
                this.diagramData = null;
              } else {
                // 原始数据排序
                this.originalDeptData = this.bubbleSort(this.originalDeptData);
                // 专病评价
                let suspData = this.originalDeptData.Susp.map((item) => {
                  return item.SuspRate;
                });
                let factData = this.originalDeptData.Factorial.map((item) => {
                  return item.FactorialRate;
                });

                // 转换数据为 echarts 渲染数据
                let myxAxisData = this.originalDeptData.X.map((item) => {
                  return item.Name;
                });

                this.diagramData = {
                  myxAxisData,
                  // 可疑率
                  Susp: suspData,
                  SuspAll: this.originalDeptData.Susp,
                  // 反馈率
                  Factorial: factData,
                  FactorialAll: this.originalDeptData.Factorial
                };
              }
            } else {
              // 先清空原有数据
              this.diagramData = null;
            }
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$showNotice("网络异常", "failed");
        });
      },

      // 原因分析 数据请求
      fetchAnalysisData() {
        Axios.get(resolveApiRoute(
          "disease-analysis",
          {
            SdCode: this.activeAccordionName
          }
        ), {
          params: {
            StartTime: this.dateRange.startDate,
            EndTime: this.dateRange.endDate
          }
        }).then((res) => {
          if (res.data.Code === 0) {
            this.causeAnalysisData = res.data.Data.Data[0];
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$showNotice("网络异常", "failed");
        });
      },

      // 指标tab 数据请求
      fetchIndexData() {
        Axios.get(resolveApiRoute(
          "disease-index",
          {
            SdId: this.activeAccordionName
          }
        ), {
          params: {
            StartTime: this.dateRange.startDate,
            EndTime: this.dateRange.endDate
          }
        }).then((res) => {
          if (res.data.Code === 0) {
            this.indexTabData = res.data.Data.Data[0];

            // 判断如果Y轴所有指标的可疑发生频次为0则显示无数据
            let isAllNull = this.indexTabData.Y.every((item) => {
              return item.Numerator[0] === 0;
            });

            if (isAllNull) {
              this.indexDiagramData = null;

              return;
            }

            let xAxis = this.indexTabData.X.map((item) => {
              return item.Code;
            });

            let seriesData = [],
                xIndexName = [],
                suspCount = [],
                suspRate = [],
                suspAccuRate = [],
                careCount = 0,
                flag = true;

            this.indexTabData.X.forEach((item) => {
              xIndexName.push(item.Name);
            });

            // 可疑频次，可疑率，可疑累计率
            this.indexTabData.Y.forEach((item) => {
              suspCount.push(item.Numerator[0]);
              suspRate.push(item.Rate[0]);
              suspAccuRate.push(item.Rate[1]);

              if (item.Rate[1] < 80) {
                careCount++;
              } else if (flag) {
                flag = false;
                careCount++;
              }
            });

            seriesData.push(
              suspCount,
              suspRate,
              suspAccuRate,
              xIndexName
            );

            let yData = {
              diagData: suspCount,
              platoData: suspAccuRate,
              suspRate,
              name: "可疑发生频次",
              min: 0,
              max: Math.max.apply(null, suspCount)
            };

            let series = [];
            let diagSeries = this.indexTabData.Y.reduce((acc, item) => {
              acc.push({
                seriesData: seriesData,
                value: item.Numerator[0]
              });

              return acc;
            }, []);

            let platoSeries = this.indexTabData.Y.reduce((acc, item) => {
              acc.push({
                seriesData: seriesData,
                value: item.Rate[1]
              });

              return acc;
            }, []);

            series.push(diagSeries, platoSeries);

            this.indexDiagramData = {
              series,
              xAxis,
              yData,
              careCount,
              monitorIndexCount: this.indexTabData.X.length
            };
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

  .disease-list {
    @include list-color-change();
    @include collections-star();

    .trend-set-box {
      position: absolute;
      right: sz(102);
      top: sz(16);
      z-index: 1;
    }

    &__setbaseline {
      position: absolute;
      right: sz(10);
      z-index: 1;
    }

    &__jumpcase {
      text-align: center;
      padding-right: sz(15);

      &-cases {
        width: sz(118);
        margin-right: sz(3);
      }
    }

    &__sdname {
      @include word-hidden(sz(347));
    }

    // 原因分析 title
    &__cause-analysis-title {
      margin: 0;
      text-align: center;
      font-size: map-get($font-sizes, sm);
      color: map-get($app-colors, echart-legend-text);
    }

    &__piecontent,
    &__colcontent,
    &__title {
      float: left;
    }

    &__piecontent {
      width: sz(416);

      &-title {
        color: map-get($app-colors, echart-legend-text);
        font-size: map-get($font-sizes, sm);
        line-height: sz(16);
        margin: 0 0 sz(14);
      }
    }

    // 定义 accordions 的列宽，除了列宽和 padding 之外一律不要耦合到 accordions 里面
    .accordions {
      @include unify-accordion-ui("tbody", 34, 350, 120, 200, 120, 166, 151);

      // 重置并修复嵌套 圆tab 的样式
      // TODO: use > selector to reduce style conflicts in nested components
      .round-tabs {
        .basic-tabs {
          &__header {
            height: sz(32);
            background: transparent;
            border: 0;
          }

          &__contents {
            height: sz(340);
            position: relative;

            .dept-cascade-drill {
              position: absolute;
              left: 50%;
              // 组件自身宽度：212
              margin-left: sz(-212 / 2);
              z-index: 1;
            }

            .statistics-accuracy {
              width: sz(250);
              margin: sz(5) auto;
              margin-top: sz(10);

              &__option {
                width: sz(46);
              }
            }
          }

          // 饼图柱图都浮动，所以需要清除浮动
          &__content {
            @extend %clearfix;

            .qa-tendency__diagram {
              margin: 0;
            }

            .baseline-set {
              margin-top: sz(6);
              text-align: center;
            }
          }
        }
      }
    }

    // 预警值的占位线
    &__war-line {
      margin-left: sz(8);
    }

    // 查看指标
    &__view-index-btn {
      margin-left: sz(6);

      #{get-bem-root()} & {
        color: map-get($colors, theme-blue);
      }
    }

    &__star {
      margin-left: sz(60);
    }
  }
</style>
