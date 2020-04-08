<template>
  <div class="quality-point">
    <square-tabs
      :activeTabName="activeQualityPointsTabName"
      @changeTab="changeQualityPointsTab">

      <!-- 全部质控点-->
      <basic-tab tabName="qualityTab">
        <template slot="tabLabel">
          <span class="quality-point__label">质控点
            <span class="quality-point__label-num">
              <template v-if="totalQualityPoints">
                {{ totalQualityPoints.length }}
              </template>
              <template v-else>0</template>
            </span>
          </span>
        </template>

        <!-- 是否存在质控点（不要和是否有病例混在一起，它们没有关联性！） -->
        <template v-if="totalQualityPoints">
          <template v-if="totalQualityPoints.length > 0">
            <ul class="quality-point__uls">
              <li v-for="item in complete"
                :key="item.KPI_ID"
                :title= "
                  getActualTime(
                    item.KPI_NAME,
                    item.SD_ITEM_VALUE,
                    item.SD_ITEM_UNIT
                  )
                "
                class="quality-point__uls-item clearfix">

                <i class="quality-point__uls-item-icon
                  quality-point__uls-item-icon--zhikongimg"></i>

                <span class="quality-point__uls-item-text">
                  {{ item.KPI_NAME }}
                </span>
              </li>

              <li
                v-tooltips:qaPointTips="
                  createTooltipsContent(item, 'noFeedback')
                "
                v-for="item in noFeedback"
                :key="item.KPI_ID"
                class="
                  quality-point__uls-item
                  quality-point__uls-item--nofeedback clearfix
                "
                @click="addReason(item)">

                <i
                  class="
                    quality-point__uls-item-icon
                    quality-point__uls-item-icon--weifankuiimg
                  ">
                </i>

                <span class="quality-point__uls-item-text">
                  {{ item.KPI_NAME }}
                </span>
              </li>

              <li
                v-tooltips:qaPointTips="
                  createTooltipsContent(item, 'suspicious')
                "
                v-for="item in suspicious"
                :key="item.KPI_ID"
                class="quality-point__uls-item clearfix">

                <i
                  class="
                    quality-point__uls-item-icon
                    quality-point__uls-item-icon--yifankuiimg
                  "
                ></i>

                <span class="quality-point__uls-item-text">
                  {{ item.KPI_NAME }}
                </span>
              </li>
            </ul>
          </template>
          <template v-else>
            <p class="quality-point__uls quality-point__uls--empty">
              <span class="quality-point__uls-com">没有任何相关质控点</span>
            </p>
          </template>
        </template>
        <template v-else>
          <div class="quality-point__loading">
            <img src="~__shared-libs/imgs/qa-loading.gif"
              alt="加载中.." />
          </div>
        </template>

        <!--
          是否有病例(不要和质控点混为一谈，它们没有关联性！)
          _self 是默认属性，表示不打开新窗口/标签页，否则火狐即使 javascript:;
          如果有 _blank 也会打开新标签页
        -->
        <div class="quality-point__btn">
          <a
            :class="{
              'btn--disabled': !patientId
            }"
            :href="patientId ? patientDetailUrl : 'javascript:;'"
            :target="patientId ? '_blank' : '_self'"
            class="btn">
            病例详情
          </a>
        </div>
      </basic-tab>

      <!-- 全部可疑质控点-->
      <basic-tab tabName="suspiciousTab">
        <template slot="tabLabel">
          <span class="quality-point__label">可疑点
            <span class="quality-point__label-num">
              <template v-if="totalQualityPoints">
                {{ suspicious.length + noFeedback.length }}
              </template>
              <template v-else>0</template>
            </span>
          </span>
        </template>

        <!-- 是否存在可疑（已反馈+未反馈>0）质控点 -->
        <template v-if="totalQualityPoints">
          <template v-if="suspicious.length + noFeedback.length > 0">
            <ul class="quality-point__uls">
              <li
                v-tooltips:qaPointTips="
                  createTooltipsContent(item, 'noFeedback')
                "
                v-for="item in noFeedback"
                :key="item.KPI_ID"
                class="
                  quality-point__uls-item
                  clearfix
                  quality-point__uls-item--nofeedback
                "
                @click="addReason(item)">
                <i
                  class="
                    quality-point__uls-item-icon
                    quality-point__uls-item-icon--weifankuiimg
                  "></i>
                <span class="quality-point__uls-item-text">
                  {{ item.KPI_NAME }}
                </span>
              </li>

              <li
                v-tooltips:qaPointTips="
                  createTooltipsContent(item, 'suspicious')
                "
                v-for="item in suspicious"
                :key="item.KPI_ID"
                class="quality-point__uls-item clearfix">
                <i
                  class="
                    quality-point__uls-item-icon
                    quality-point__uls-item-icon--yifankuiimg
                  "></i>
                <span class="quality-point__uls-item-text">
                  {{ item.KPI_NAME }}
                </span>
              </li>
            </ul>
          </template>
          <template v-else>
            <p class="quality-point__uls quality-point__uls--empty">
              <span class="quality-point__uls-com">没有可疑质控点</span>
            </p>
          </template>
        </template>
        <template v-else>
          <div class="quality-point__loading">
            <img src="~__shared-libs/imgs/qa-loading.gif"
              alt="加载中.." />
          </div>
        </template>

        <!-- 是否有病例(不要和质控点混为一谈，它们没有关联性！) -->
        <div class="quality-point__btn">
          <a
            :class="{
              'btn--disabled': !patientId
            }"
            :href="patientId ? patientDetailUrl : 'javascript:;'"
            :target="patientId ? '_blank' : '_self'"
            class="btn">
            病例详情
          </a>
        </div>
      </basic-tab>

      <!-- 全部可疑未反馈质控点-->
      <basic-tab tabName="noFeedbackTab">
        <template slot="tabLabel">
          <span class="quality-point__label">未反馈
            <span class="quality-point__label-num">
              <template v-if="totalQualityPoints">
                {{ noFeedback.length }}
              </template>
              <template v-else>0</template>
            </span>
          </span>
        </template>

        <template v-if="totalQualityPoints">
          <template v-if="noFeedback.length>0">
            <ul class="quality-point__uls">
              <li
                v-tooltips:qaPointTips="
                  createTooltipsContent(item, 'noFeedback')
                "
                v-for="item in noFeedback"
                :key="item.KPI_ID"
                class="
                  quality-point__uls-item
                  clearfix
                  quality-point__uls-item--nofeedback
                "
                @click="addReason(item)">
                <i
                  class="
                    quality-point__uls-item-icon
                    quality-point__uls-item-icon--weifankuiimg
                  "></i>
                <span class="quality-point__uls-item-text">
                  {{ item.KPI_NAME }}
                </span>
              </li>
            </ul>
          </template>
          <template v-else>
            <p class="quality-point__uls quality-point__uls--empty">
              <span class="quality-point__uls-com">没有需要反馈原因的可疑点</span>
            </p>
          </template>
        </template>
        <template v-else>
          <div class="quality-point__loading">
            <img src="~__shared-libs/imgs/qa-loading.gif"
              alt="加载中.." />
          </div>
        </template>

        <!-- 是否有病例(不要和质控点混为一谈，它们没有关联性！) -->
        <div class="quality-point__btn">
          <a
            :class="{
              'btn--disabled': !patientId
            }"
            :href="patientId ? patientDetailUrl : 'javascript:;'"
            :target="patientId ? '_blank' : '_self'"
            class="btn">
            病例详情
          </a>
        </div>
      </basic-tab>
    </square-tabs>

    <tooltips ref="qaPointTips"
      :marginLeft="-10"
      direction="right"></tooltips>

    <!-- 未反馈添加原因 -->
    <unqualified-response-reason-dialog
      :allReasonList="allReasonList"
      :parameters="parameters"
      :display="showDialog"
      dialogFooterOkBtnText="提交"
      @closeDialog="showDialog = false"
      @changeView="changeView">
    </unqualified-response-reason-dialog>
  </div>
</template>

<script>
  import Axios from "axios";
  import SquareTabs from "__shared-libs/components/tabs/square-tabs/Tabs";
  import BasicTab from "__shared-libs/components/tabs/basic-tabs/Tab";

  // 未反馈添加原因弹窗
  import UnqualifiedResponseReasonDialog from "./dialog/UnqualifiedResponseReasonDialog";
  import resolveMvcRoute from "__libs/js/modules/resolve-mvc-route";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "quality-point",

    components: {
      SquareTabs,
      BasicTab,
      UnqualifiedResponseReasonDialog
    },

    props: {
      // 所有质控点
      totalQualityPoints: {
        type: Array,
        default() {
          return [];
        }
      },

      // 病例ID（SD_CPAT_NO）
      patientId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        activeQualityPointsTabName: "qualityTab",
        // 是否显示添加原因对话框
        showDialog: false,
        // 为弹窗传递的数据
        parameters: {},

        // 当前病例请求到的所有原因列表
        allReasonList: []
      };
    },

    computed: {
      // 不可疑数据
      complete() {
        if (!this.totalQualityPoints) {
          return null;
        }

        return this.totalQualityPoints.filter((item) => {
          return item.INDEX_VALUE === item.IS_POSITIVE &&
            item.SD_EKPI_TYPE === 1;
        });
      },

      // 可疑已反馈数据
      suspicious() {
        if (!this.totalQualityPoints) {
          return null;
        }

        return this.totalQualityPoints.filter((item) => {
          return item.RSN_FLAG === 1 &&
            item.SD_EKPI_TYPE === 1 &&
            item.INDEX_VALUE !== item.IS_POSITIVE;
        });
      },

      // 可疑未反馈数据
      noFeedback() {
        if (!this.totalQualityPoints) {
          return null;
        }

        return this.totalQualityPoints.filter((item) => {
          return item.RSN_FLAG === 0 &&
            item.SD_EKPI_TYPE === 1 &&
            item.INDEX_VALUE !== item.IS_POSITIVE;
        });
      },

      // 详情页链接
      patientDetailUrl() {
        return resolveMvcRoute("patientdetail", {sdCpatNo: this.patientId});
      }
    },

    watch: {
      patientId() {
        // 如果查看的病例发生变化，就要立即切换回第一个tab
        this.changeQualityPointsTab("qualityTab");
      }
    },

    methods: {
      getActualTime(kpiName, val, unit) {
        let title = `${kpiName}\n实际完成时间：${val}${unit}`;

        if (
          val === null &&
          unit === null
        ) {
          title = kpiName;
        }

        return title;
      },

      // 更新数据
      changeView(newObj) {
        this.showDialog = false;

        let obj = Object.assign(
          newObj,
          {
            susp: this.suspicious.length + this.noFeedback.length,
            feedback: this.suspicious.length
          }
        );

        this.$emit("changeQualityPointReasonContent", obj);
      },

      // 添加原因
      addReason(kpiInfo) {
        this.parameters = Object.assign({}, {
          kpiId: kpiInfo.KPI_ID,
          kpiName: kpiInfo.KPI_NAME,
          sdId: kpiInfo.SD_ID,
          sdName: kpiInfo.SD_NAME,
          sdCpatNo: this.patientId
        });

        this.fetchReasonList();
      },

      // 获得 tooltips 显示内容数组
      createTooltipsContent(item, type) {
        // kpi_name的字符串处理 大于20个字换行
        let strKpi = item.KPI_NAME;
        let newKpiStrArr = [],
            title = "";

        if (
          item.SD_ITEM_VALUE !== null &&
          item.SD_ITEM_UNIT !== null
        ) {
          title = `\n实际完成时间：${item.SD_ITEM_VALUE}${ item.SD_ITEM_UNIT}`;
        }

        if (strKpi.length >= 20) {
          for (let i = 20; i < strKpi.length; i + 20) {
            newKpiStrArr.push(`${strKpi.slice(0, i)}<br>`);
            strKpi = strKpi.slice(i, strKpi.length);
          }

          // 把最后一次余下的字符串放入数组
          newKpiStrArr.push(strKpi);
          // 数组转字符串
          strKpi = newKpiStrArr.join("");
        }

        // rsn_name和type的字符串处理 大于20字换行
        // 可以已反馈
        if (type === "suspicious") {
          let res = [strKpi + title];

          for (let j = 0; j < item.Reasons.length; j++) {
            let strRsn = `${j + 1}. ${item.Reasons[j].RSN_TYPE_NAME}：${item.Reasons[j].RSN_NAME}`;
            let newRsnStrArr = [];

            // 大于20的需要处理的
            if (strRsn.length >= 20) {
              for (let i = 20; i < strRsn.length; i + 20) {
                newRsnStrArr.push(`${strRsn.slice(0, i)}<br>`);
                strRsn = strRsn.slice(i, strRsn.length);
              }

              // 把最后一次余下的字符串放入数组
              newRsnStrArr.push(strRsn);
              // 数组转字符串
              strRsn = newRsnStrArr.join("");

              res.push(strRsn);
            } else {
              // else: 不大于的无序处理
              res.push(strRsn);
            }
          }

          return res;
        } else if (type === "noFeedback") {
          // else: 可疑未反馈
          return [strKpi + title, "原因：未反馈"];
        }

        // 默认我们返回空数组(避免没传type)
        return [];
      },

      // 修改质控点 tab
      changeQualityPointsTab(tabName) {
        this.activeQualityPointsTabName = tabName;
      },

      // 获取对应的原因列表
      fetchReasonList() {
        this.$showLoading();

        Axios.get(resolveApiRoute(
          "disease-index-reason",
          {
            KpiId: this.parameters.kpiId
          }
        )).then((res) => {
          this.$hideLoading();

          if (res.data.Code === 0) {
            this.allReasonList = res.data.Data.Data;
            // 请求成功之后打开对话框
            this.showDialog = true;
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

  .quality-point {
    // 按钮区 50px，下面 calc 如果改都要改

    width: sz(250);
    height: 100%;

    &__loading {
      text-align: center;
      height: calc(100% - 50px);

      img {
        width: 100%;
      }
    }

    &__uls {
      @extend %normalized-list;

      // 下面的按钮区包括上边框是 50px
      height: calc(100% - 50px);
      overflow: auto;

      // 是否显示“无数据”文案
      &-com {
        display: none;
        text-align: center;
        margin-top: sz(100);
        display: inline-block;
        width: 100%;
        color: map-get($colors, text-light);

        @at-root #{get-bem-root()}__uls--empty & {
          display: block;
        }
      }

      &-item {
        height: sz(30);
        line-height: sz(30);
        margin-left: sz(10);
        color: map-get($colors, text-light);

        // 无原因（可以点击弹窗反馈）
        &--nofeedback {
          cursor: pointer;
        }

        &-icon {
          float: left;
          height: sz(12);
          width: sz(12);
          margin-top: sz((30 - 12) / 2);
          background-size: sz(12) sz(12);

          &--zhikongimg {
            background-image: url("~__libs/imgs/checkmark.png");
          }

          &--weifankuiimg {
            background-image: url("~__libs/imgs/checkmarks.png");
          }

          &--yifankuiimg {
            background-image: url("~__libs/imgs/checkmarkss.png");
          }
        }

        &-text {
          @include word-hidden(sz(200));

          float: left;
          height: sz(30);
          margin-left: sz(5);
          line-height: sz(30);
        }
      }
    }

    // 操作按钮 “病例详情”
    &__btn {
      height: sz(49);
      line-height: sz(49);
      border-top: 1px solid map-get($colors, dialog-cancel-border);
      text-align: center;
    }

    .square-tabs {
      height: 100%;

      .basic-tabs {
        &__header {
          @include border-radius(5px 5px 0 0);

          &-item {
            border-right: 1px solid map-get($colors, dialog-cancel-border);

            &:last-child {
              border-right: none;
            }

            &--active {
              border-top: 1px solid map-get($colors, dialog-cancel-border);
              border-left: none;
              color: map-get($colors, theme-blue);

              &:first-child {
                @include border-radius(5px 0 0 0);
              }

              &:last-child {
                @include border-radius(0 5px 0 0);
              }
            }
          }
        }

        &__contents {
          @include border-radius(0 0 5px 5px);

          // head 38 + 2
          height: calc(100% - 40px);
          padding: 0;
        }

        &__content {
          height: 100%;
        }
      }
    }

    &__label {
      position: relative;
      font-size: map-get($font-sizes, base);

      // 小数字提示
      &-num {
        @include border-radius(8px);

        position: absolute;
        left: sz(35);
        top: sz(-9);
        width: sz(22);
        height: sz(16);
        line-height: sz(16);
        background: map-get($app-colors, error-text-color);
        color: map-get($colors, pure-white);
        font-size: map-get($font-sizes, xs);
      }
    }
  }
</style>
