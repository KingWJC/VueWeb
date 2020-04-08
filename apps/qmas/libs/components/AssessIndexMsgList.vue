<template>
  <div class="assess-index-msg-list">
    <accordions
      :activeAccordionName="activeAccordionName"
      @changeAccordion="changeAccordion">

      <accordion-item
        v-for="item in accordionList"
        :accordionName="`${item.KPI_ID}`"
        :key="item.KPI_ID">
        <!-- 指标类型名 -->
        <td v-if="pageName === 'hospassess'"
          :title="item.KPI_TYPE_NAME">
          {{ item.KPI_TYPE_NAME }}
        </td>
        <!-- 指标名 -->
        <td :title="getCalcVerify(item.KPI_NAME, item.SD_EKPI_DESC)">
          <div :class="`assess-index-msg-list__${pageName}`">
            {{ item.KPI_NAME }}
          </div>
        </td>
        <!--监测病例-->
        <td>
          <!--全院评价-->
          <template v-if="pageName === 'hospassess'">
            <template v-if="groupType === 'disease'">
              <template v-if="item.N_IS_VIEW_DTL === 1">
                {{ item.DenominatorCPatCount }}
              </template>
              <template v-else>
                &nbsp;&nbsp;--
              </template>
            </template>
            <!--全院昆儿评价-->
            <template v-else-if="groupType === 'dept'">
              {{ item.DenominatorCPatCount }}
            </template>
          </template>

          <!--专科评价-->
          <template v-if="pageName === 'specdept'">
            <template v-if="item.N_IS_VIEW_DTL === 1">
              {{ item.DenominatorCPatCount }}
            </template>
            <template v-else>&nbsp;&nbsp;--</template>
          </template>
        </td>
        <!-- 指标值 -->
        <!-- 针对全院和专科单位数据统一返回 -->
        <td>
          <template v-if="item.IS_POSITIVE === 0 || item.IS_POSITIVE === 1">
            <span
              :class="{
                'assess-index-msg-list__susprate--warn':
                  item.IndexStatus === 0,
                'assess-index-msg-list__susprate--normal':
                  item.IndexStatus === 1 || item.IndexStatus === 2
              }"
              class="assess-index-msg-list__susprate">
              {{ item.KPI_VALUE }}{{ item.SD_EKPI_UNIT }}
            </span>
          </template>
          <template v-else>
            {{ item.KPI_VALUE }}{{ item.SD_EKPI_UNIT }}
          </template>
        </td>

        <!-- 基线 -->
        <!-- 基线勾选 -->
        <template v-if="item.IS_DISPLAY === 0 || item.IS_POSITIVE === 2">
          <td>&nbsp;&nbsp;--</td>
        </template>
        <!-- 基线为- -->
        <template v-else-if="item.BaseLine === '-'">
          <td>&nbsp;&nbsp;--</td>
        </template>
        <template v-else>
          <!-- 针对全院和专科单位数据统一返回 -->
          <td>{{ item.BaseLine }}{{ item.SD_EKPI_UNIT }}</td>
        </template>
        <!-- 滚动条占位 -->
        <td></td>

        <round-tabs
          v-if="activeAccordionName === `${item.KPI_ID}`"
          :activeTabName="activeTrendsTabName"
          @changeTab="changeTabs">

          <!-- BEGIN 监测指标 Tabs -->
          <template v-if="item.IS_TREND === 1">
            <basic-tab
              tabName="trendsTab"
              tabLabel="趋势">

              <!-- 如果没有激活趋势tabs，就不发请求(全院专病趋势图还没有分离请求) -->
              <template v-if="tendencyDiagramData">
                <template v-if="item.IS_POSITIVE !== 2">
                  <a
                    v-if="allowSetBaseline && !isShowBaseline"
                    href="javascript:;"
                    class="btn assess-index-msg-list__setbaseline"
                    @click="activeSetting">
                    设置
                  </a>
                </template>

                <hosp-dept-index-tenden
                  :sdEkpiType="item.SD_EKPI_TYPE"
                  :sdEkpiUnit="item.SD_EKPI_UNIT"
                  :sdEkpiConver="item.SD_EKPI_CONVER"
                  :isDynamic="item.IS_DYNAMIC"
                  :denominatorName="item.DenominatorName"
                  :numeratorName="item.NumeratorName"
                  :diagramData="tendencyDiagramData"
                  :isDisplay="useBaseline(item.IS_DISPLAY, item.IS_POSITIVE)"
                  :isPositive="item.IS_POSITIVE"
                  :baseline="baselineMap"
                  :activeAccuracyCode="selectedAccuracy">
                </hosp-dept-index-tenden>

                <template v-if="!isShowBaseline">
                  <statistics-accuracy
                    :accuracyItems="accuracyItems"
                    :activeAccuracyCode="selectedAccuracy"
                    @accuracyChange="accuracyChange(item, arguments[0])">
                  </statistics-accuracy>

                  <div class="assess-index-msg-list__jumpcase">
                    <!-- 全院的相关病例 显不显示 -->
                    <template v-if="pageName === 'hospassess'">
                      <template v-if="groupType === 'disease'">
                        <template v-if="relCasesHosp && item.N_IS_VIEW_DTL">
                          <a :href="hospDeptPatientUrl(item, 'hosppatientrel')"
                            class="btn assess-index-msg-list__jumpcase-cases"
                            target="_blank">
                            相关病例
                          </a>
                        </template>
                      </template>
                      <template v-else-if="groupType === 'dept'">
                        <!-- 全院昆儿的相关病例 显不显示 -->
                        <template v-if="item.N_IS_VIEW_DTL">
                          <!--昆儿门急诊病例-->
                          <template v-if="relCasesOEHospKr">
                            <template v-if="item.KPI_TYPE_NAME === '门诊' ||
                            item.KPI_TYPE_NAME === '急诊'">
                              <a :href="kunerPatientUrl(item, 'outpatientrel')"
                                class="
                                  btn
                                  assess-index-msg-list__jumpcase-cases
                                "
                                target="_blank">
                                相关可疑病例
                              </a>
                            </template>
                          </template>

                          <!--昆儿住院病例-->
                          <template v-if="relCasesInHospKr">
                            <template v-if="item.KPI_TYPE_NAME === '住院'">
                              <a :href="kunerPatientUrl(item, 'inpatientrel')"
                                class="
                                  btn
                                  assess-index-msg-list__jumpcase-cases
                                "
                                target="_blank">
                                相关可疑病例
                              </a>
                            </template>
                          </template>
                        </template>
                      </template>
                    </template>

                    <!-- 专科的相关病例 显不显示 -->
                    <template v-if="pageName === 'specdept'">
                      <template v-if="relCasesDept && item.N_IS_VIEW_DTL">
                        <a :href="hospDeptPatientUrl(item, 'deptpatientrel')"
                          class="btn assess-index-msg-list__jumpcase-cases"
                          target="_blank">
                          相关病例
                        </a>
                      </template>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <baseline-set
                    :isDisplay="item.IS_DISPLAY"
                    :baselineValue="cachedBaseline"
                    :isDynamic="item.IS_DYNAMIC"
                    :sdEkpiUnit="item.SD_EKPI_UNIT"
                    :sdEkpiConver="item.SD_EKPI_CONVER"
                    :precision="item.NUM_PRECISION"
                    :sdEkpiType="item.SD_EKPI_TYPE"
                    typeBaseline="evaBaseline"
                    indexType="eva"
                    @saveSet="saveBaselineSet(item.KPI_ID, arguments[0])"
                    @cancelSet="cancelBaselineSet">
                  </baseline-set>
                </template>
              </template>
            </basic-tab>
          </template> <!-- END 监测指标 Tabs -->

          <!-- BEGIN 科室 Tabs -->
          <template v-if="item.IS_DISTRIBUTION === 1">
            <basic-tab
              tabName="departmentTab"
              tabLabel="科室">

              <!-- 如果没有激活科室tabs，就不渲染（级联组件会在渲染的时候
              通知父组件发送请求） -->
              <template v-if="activeTrendsTabName === 'departmentTab'">
                <department-casecade
                  :dept="item.DEPT"
                  :groups="item.Groups"
                  :deptCode="resolveDeptCode(item.KPI_ID)"
                  :groupId="resolveGroupId(item.KPI_ID)"
                  @codeObjData="
                    codeObjData(item.KPI_ID, arguments[0], 'KPI_ID')
                  ">
                </department-casecade>

                <template v-if="originalDeptData">
                  <template v-if="diagramData">
                    <zoom-column-diagram
                      :diagramData="diagramData"
                      :sdEkpiConver="item.SD_EKPI_CONVER"
                      :legendType="resolveLegendType(item.KPI_ID)"
                      :sdEkpiType="item.SD_EKPI_TYPE"
                      :denominatorName="item.DenominatorName"
                      :numeratorName="item.NumeratorName"
                      :sdEkpiUnit="item.SD_EKPI_UNIT"
                      :isDynamic="item.IS_DYNAMIC"
                      @levelMenu="levelMenuSub('KPI_ID', arguments[0])">
                    </zoom-column-diagram>
                  </template>
                  <template v-else>
                    <!-- eslint-disable-next-line max-len -->
                    <qa-no-content :title="`当前时间(${dateRange.startDate}~${dateRange.endDate}) 【${item.KPI_NAME}】${noDataMsg}`">
                    </qa-no-content>
                  </template>
                </template>
              </template>
            </basic-tab>
          </template> <!-- END 科室 Tabs -->
        </round-tabs>
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

  import HospDeptIndexTenden from "__libs/components/HospDeptIndexTenden";
  import StatisticsAccuracy from "__libs/components/StatisticsAccuracy";
  import BaselineSet from "__libs/components/BaselineSet";
  import DepartmentCasecade from "__libs/components/DepartmentCasecade";
  import QaNoContent from "__libs/components/QaNoContent";
  import ZoomColumnDiagram from "__libs/components/ZoomColumnDiagram";
  import AbstractIndexList from "__libs/components/AbstractIndexList";

  import getAccurcyDateRange from "__libs/js/modules/get-accuracy-date-range";
  import getBaselineEchart from "__libs/js/modules/get-baseline-echart";
  import getDailyBaselineOrBaseline from "__libs/js/modules/get-daily-baseline-or-baseline";
  import getMinBaseline from "__libs/js/modules/get-min-baseline";
  import saveBaseline from "__libs/js/modules/save-baseline";
  import unifyDeptDataFormat from "__libs/js/modules/unify-dept-data-format";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import resolveMvcRoute from "__libs/js/modules/resolve-mvc-route";
  import resolveSpaRoute from "__shared-libs/js/modules/resolve-spa-route";
  import kunerHospPatientRouteMap from "__pages/hosppatientkr/route-map";
  // 全院专科共用一个route-map
  import hospDeptPatientRouteMap from "__pages/hospdeptpatient/route-map";
  import { mapGetters } from "vuex";
  import indexCalcVerify from "__libs/js/modules/index-calc-verify";

  export default {
    name: "assess-index-msg-list",

    components: {
      RoundTabs,
      BasicTab,
      Accordions,
      AccordionItem,
      QaNoContent,
      DepartmentCasecade,
      ZoomColumnDiagram,
      HospDeptIndexTenden,
      StatisticsAccuracy,
      BaselineSet
    },

    mixins: [
      AbstractIndexList
    ],

    props: {
      // 用于区分到什么地方渲染（全院评价/专科评价），id
      pageName: {
        type: String,
        default: "hospassess"
      },

      // 折叠面板状态
      activeAccordionName: {
        type: String,
        default: null
      },

      // 分组模式(标准模式还是昆儿模式)
      // disease: 按病种分组(标准模式)
      // dept: 按科室分组(昆儿模式)
      groupType: {
        type: String,
        default: ""
      },

      // 后端需要的科室 code，如果是普通全院，传 null（即不传）
      // 如果是昆儿全院，就是 tabs 对应的科室 code，全部科室 code 为 '__ALL_DEPT'
      // （在往后端传的时候，如果是全部科室，就要再次转换为 '' 空字符串）
      indexDeptCode: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        // 默认展示趋势tabs
        activeTrendsTabName: "trendsTab",

        // 科室图api请求返回原始数据
        originalDeptData: null,
        // 传递给科室图子组件的数据对象
        diagramData: null,

        // 构建 map，用于存储各个指标对应的科室诊疗组原有的上下文数据（科室code，诊疗组
        // id，图例类型，etc.）
        // 在每次 accordion 数据即（accordionList）发生变化之后都要重建该 map
        // {
        //   [KPI_ID]: {
        //     deptCode: null,
        //     groupId: null,
        //     // 传给科室图例的类型
        //     legendName: 'dept'
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

        // 趋势图基线
        baselineMap: null,

        // 当前临时预警值或单日基线值
        cachedBaseline: null
      };
    },

    computed: {
      // 挂载 Vuex getter，用于从中央仓库读入当前 dateRagnge
      // 名称一旦定义，不可同名与现有 'props', 'data', 'computed', 'methods' 冲突！
      ...mapGetters([
        "dateRange",
        "relCasesHosp",
        "relCasesDept",
        "allowSetBaseline",
        "relCasesInHospKr",
        "relCasesOEHospKr"
      ]),

      noDataMsg() {
        let kpiId = this.activeAccordionName,
            deptCode = this.resolveDeptCode(kpiId),
            groupId = this.resolveGroupId(kpiId),
            deptName = this.resolveDeptName(kpiId),
            groupName = this.resolveGroupName(kpiId);

        if (deptCode === null) {
          return `${deptName} 没有监测病例`;
        }

        if (groupId === null) {
          return `${deptName} ${groupName}中没有监测病例`;
        }

        return `${deptName} ${groupName}诊疗组中 没有监测病例`;
      }
    },

    watch: {
      // 折叠出现变化（父组件侦测到路由变化因而主动触发accordion变化）
      activeAccordionName(kpiId) {
        // 只有某一个 accordion 被打开的状态，才继续判断是否请求 tabs 的数据
        if (kpiId) {
          // 立即切换到趋势 tabs
          this.changeTabs("trendsTab");
        }
      },

      // 时间切换之后会重取accordionList，所以只要这个变化，我们就重渲tabs里面的图
      accordionList() {
        // 直接重渲激活的tabs里面的图
        if (this.activeAccordionName) {
          this.changeTabs(this.activeTrendsTabName);
        }
      }
    },

    mounted() {
      // 只有某一个 accordion 被打开的状态，才继续判断是否请求 tabs 的数据
      if (this.activeAccordionName) {
        // 立即切换到趋势 tabs
        this.changeTabs("trendsTab");
      }
    },

    methods: {
      // 获取指标规则数据
      getCalcVerify(name, desc) {
        return indexCalcVerify(name, desc);
      },

      // 昆儿门急诊病例 或 住院病例 跳转链接
      kunerPatientUrl(item, type) {
        // 解析 mvc 路由
        let mvcRoute = resolveMvcRoute("hosppatientkr");
        // 解析页面 spa 路由
        let spaRoute = resolveSpaRoute(
          // 页面 spa 路由注册表
          kunerHospPatientRouteMap,
          // 需要解析到的路由名
          type,
          // 路由参数
          {
            index: item.KPI_ID,
            sd: item.SD_ID,
            dept: this.indexDeptCode,
            startDate: this.dateRange.startDate,
            endDate: this.dateRange.endDate
          }
        );

        // 拼接前后端路由
        return `${mvcRoute}#${spaRoute}`;
      },

      // 专科 | 全院 相关病例跳转链接
      hospDeptPatientUrl(item, type) {
        // 解析 mvc 路由
        let mvcRoute = resolveMvcRoute(type);
        // 解析页面 spa 路由
        let spaRoute = resolveSpaRoute(
          // 页面 spa 路由注册表
          hospDeptPatientRouteMap,
          // 需要解析到的路由名
          "headerfilter",
          // 路由参数
          {
            index: item.KPI_ID,
            sd: item.SD_ID,
            startDate: this.dateRange.startDate,
            endDate: this.dateRange.endDate
          }
        );

        // 拼接前后端路由
        return `${mvcRoute}#${spaRoute}`;
      },

      // 是否显示基线
      useBaseline(bool, condition) {
        // 如果是非正负向指标 则没有基线 即与未勾选基线逻辑相同
        return condition === 2 ? 0 : bool;
      },

      // 用于画基线用基线值
      getBaseline() {
        let fields = this.getFieldByKpiId();

        return getBaselineEchart(fields);
      },

      // 获取是基线还是最小基线
      getMinBaseline() {
        let fields = this.getFieldByKpiId();

        return getMinBaseline(fields);
      },

      // 切换 accordion
      changeAccordion(kpiId) {
        // 当前 accordion 就是高亮的，折叠
        if (this.activeAccordionName === kpiId) {
          this.$emit("changeAccordion", null);
        } else {
          // 展开 accordion
          this.$emit("changeAccordion", kpiId);
        }

        // TODO: 仍然要移动到 map 里面，等 map 方案修复以后
        this.isShowBaseline = false;
        this.selectedAccuracy = "0";
      },

      // 切换 tabs
      changeTabs(tabName) {
        this.activeTrendsTabName = tabName;

        // 切换到 趋势tabs
        if (this.activeTrendsTabName === "trendsTab") {
          // 初始化画图基线
          this.baselineMap = this.getBaseline();
          // 初始化最小基线
          this.cachedBaseline = this.getMinBaseline();

          // TODO 趋势图迁移,请求数据拆到此处
          this.tendencyDiagramData = null;
          this.fetchQaTendencyData();
        } else if (this.activeTrendsTabName === "departmentTab") {
          this.diagramData = null;
          this.originalDeptData = null;
          this.codeObjData(this.activeAccordionName, {
            deptCode: null,
            groupId: null,
            deptName: "全部科室",
            groupName: "全部诊疗组"
          }, "KPI_ID");
        }
      },

      // 关注 / 取消
      setStarStatus(kpiId, kpiCode, isCollect) {
        Axios.post(resolveApiRoute("collection"), {
          // 1：病种，2: 指标
          FavId: kpiId,
          FavCode: kpiCode,
          FavType: 2,
          // 0关注  1取消关注
          Operate: isCollect ? 0 : 1
        }).then((res) => {
          if (res.data.Code === 0) {
            if (isCollect) {
              this.$showNotice("收藏成功！");
            } else {
              this.$showNotice("取消收藏！", "failed");
            }

            this.$emit("changeCollectStatus", {
              kpiId,
              isCollect
            });
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$showNotice("网络异常", "failed");
        });
      },

      // 根据当前 kpiId 获取相应的字段
      getFieldByKpiId() {
        return this.accordionList.find((item) => {
          return item.KPI_ID === parseFloat(this.activeAccordionName);
        });
      },

      // 是基线值还是单日基线
      changeBaselineMap(obj) {
        return getDailyBaselineOrBaseline(
          this.cachedBaseline,
          obj,
          this.selectedAccuracy
        );
      },

      // 趋势精度发生变化
      accuracyChange(obj, val) {
        this.selectedAccuracy = val;
        this.tendencyDiagramData = null;

        this.baselineMap = this.changeBaselineMap(obj);

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
      saveBaselineSet(kpiId, baselineInfo) {
        let fields = this.getFieldByKpiId(),
            baselineValue = baselineInfo.value !== "-"
              ? baselineInfo.value
              : "",
            // 保存基线的类型(1: 全院科室和专病指标的保存类型)
            setType = 1;

        saveBaseline(
          this.activeAccordionName,
          fields.KPI_CODE,
          setType,
          baselineValue,
          baselineInfo.display
        ).then((res) => {
          if (res.data.Code === 0) {
            this.cachedBaseline = baselineInfo.value;
            this.baselineMap = this.changeBaselineMap(fields);
            this.$emit(
              "baselineChanged",
              Object.assign(baselineInfo, {id: kpiId})
            );
          } else {
            this.$showNotice("服务器异常", "failed");
          }

          this.cancelBaselineSet();
        }, () => {
          this.cancelBaselineSet();
          this.$showNotice("网络异常", "failed");
        });
      },

      // 请求趋势图数据
      fetchQaTendencyData() {
        // 区分调用 api
        let apiPath;
        let fields = this.getFieldByKpiId();
        // 趋势下随着精度变化 实际向后端传递的起始结束时间
        let {
          stTime,
          edTime
        } = getAccurcyDateRange(
          this.selectedAccuracy,
          this.dateRange
        );

        if (this.pageName === "hospassess") {
          apiPath = resolveApiRoute("hosp-assess-list-trend", {
            SdId: fields.SD_ID,
            KpiId: this.activeAccordionName
          });
        } else if (this.pageName === "specdept") {
          apiPath = resolveApiRoute("spec-dept-list-trend", {
            SdId: fields.SD_ID,
            KpiId: this.activeAccordionName
          });
        } else {
          return;
        }

        this.$showLoading();

        Axios.get(apiPath, {
          params: {
            // 取值来源 （int 1:过程指标，2分子分母指标）
            ValueTableId: fields.VALUE_TABLE_ID,
            // 开始时间
            StartTime: stTime,
            // 结束时间
            EndTime: edTime,
            // 精准度:0:周，1.月 2季度
            Accuracy: this.selectedAccuracy,
            // 如果是昆儿“全部科室”，要传空字符串
            IndexDeptCode: this.indexDeptCode === "__ALL_DEPT"
              ? ""
              : this.indexDeptCode,
            // 1 为全院昆儿，0 不为昆儿
            IsKr: this.indexDeptCode === null ? 0 : 1
          }
        }).then((res) => {
          this.$hideLoading();

          if (res.data.Code === 0) {
            if (res.data.Data.TotalRecord > 0) {
              // 把数据给子组件，图表组件侦测到变化会自动开始画图
              this.tendencyDiagramData = res.data.Data.Data[0];
            }
          } else {
            this.$showNotice("服务器异常", "failed");
          }
        }, () => {
          this.$hideLoading();
          this.$showNotice("网络异常", "failed");
        });
      },

      // 请求科室数据
      fetchDeptCaseCadeData() {
        let apiPath = "",
            kpiId = this.activeAccordionName,
            deptCode = this.resolveDeptCode(kpiId),
            groupId = this.resolveGroupId(kpiId),
            legendType = this.resolveLegendType(kpiId),

            // 已选择的accordion指标行 数据对象
            activeKpiObj = this.findObjById(kpiId, "KPI_ID"),
            // 可缩放柱形图  请求API所需路径及参数
            paramsObj = {
              // 开始时间
              StartTime: this.dateRange.startDate,
              // 结束时间
              EndTime: this.dateRange.endDate,
              // 值来源（int 1:过程指标，2分子分母指标）
              ValueTableId: activeKpiObj.VALUE_TABLE_ID,
              // 为空查询全部科室 科室编码
              DeptCode: deptCode === null ? "" : deptCode,
              // 为空查询全部医生 没有诊疗组:-999 诊疗组
              GroupId: "",
              // 如果是昆儿“全部科室”，要传空字符串
              IndexDeptCode: this.indexDeptCode === "__ALL_DEPT"
                ? ""
                : this.indexDeptCode,
              // 1 为全院昆儿，0 不为昆儿
              IsKr: this.indexDeptCode === null ? 0 : 1
            };

        // 如果有科室，就看诊疗组id要传什么
        if (deptCode !== null) {
          // 科室底下存在诊疗组
          if (activeKpiObj.Groups.filter((item) => {
            return item.DEPT_CODE === deptCode;
          }).length > 0) {
            if (groupId === null) {
              paramsObj.GroupId = "";
            } else {
              paramsObj.GroupId = groupId;
            }
          } else {
            paramsObj.GroupId = "*";
          }
        }

        // 全院页面
        if (this.pageName === "hospassess") {
          // 路径
          apiPath = resolveApiRoute("hosp-assess-list-dept", {
            SdId: activeKpiObj.SD_ID,
            KpiId: kpiId
          });
        }

        // 专科页面
        if (this.pageName === "specdept") {
          apiPath = resolveApiRoute("spec-dept-list-dept", {
            SdId: activeKpiObj.SD_ID,
            KpiId: kpiId
          });
        }

        // 发送请求
        Axios.get(apiPath, {params: paramsObj}).then((res) => {
          // get body data
          if (res.data.Code === 0 ) {
            // 预处理不兼容格式
            if (res.data.Data.TotalRecord === 1) {
              this.originalDeptData = res.data.Data.Data[0];
            } else {
              this.originalDeptData = {
                X: [],
                Y: []
              };
            }

            if (
              this.originalDeptData.X.length === 0 &&
              this.originalDeptData.Y.length === 0
            ) {
              this.diagramData = null;
            } else {
              // 调用匹配器，匹配后端格式到前端统一格式
              this.originalDeptData.X = unifyDeptDataFormat(
                this.originalDeptData.X,
                legendType
              );

              // 原始数据排序
              this.originalDeptData = this.bubbleSort(this.originalDeptData);

              // 转换数据为 echarts 渲染数据
              let xAxis = this.originalDeptData.X.map((item) => {
                let xText;

                // 科室视图
                if (legendType === "dept") {
                  xText = item.DEPT_NAME;
                } else if (legendType === "group") {
                  xText = item.GROUP_NAME;
                } else if (legendType === "doctor") {
                  xText = item.DOCTOR_NAME;
                }

                return xText;
              });

              // y 轴
              let yAxis = this.originalDeptData.Y.map((item) => {
                return item.Rate;
              });

              this.diagramData = {
                xAxis,
                yAxis,
                // y轴数据的全部信息(含tips)
                seriesData: this.originalDeptData.Y
              };
            }
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

  .assess-index-msg-list {
    @include list-color-change();
    @include collections-star();

    &__hospassess {
      @include word-hidden(sz(416));
    }

    &__specdept {
      @include word-hidden(sz(522));
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
        width: sz(238);
        margin-right: sz(3);
      }
    }

    // 定义 accordions 的列宽，除了列宽和 padding 之外一律不要耦合到 accordions 里面
    .accordions {
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

            // 级联选择器要浮在科室图表上，与图例居中对齐
            .department-casecade {
              position: absolute;
              right: 0;
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

          &__content {
            @extend %clearfix;

            .baseline-set {
              text-align: center;
              margin-top: sz(6);
            }
          }
        }
      }
    }

    // 反馈率说明文字
    &__fatorial-tips {
      font-size: map-get($font-sizes, xs);
    }

    // 原因分析 title
    &__cause-analysis-title {
      margin: sz(30) auto 0;
      text-align: center;
    }
  }
</style>
