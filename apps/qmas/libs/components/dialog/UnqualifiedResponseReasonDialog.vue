<template>
  <teleporter>
    <div :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName
      ]"
      class="dialog">
      <div class="dialog__header clearfix">
        <h3>
          <span :title="parameters.kpiName">{{ parameters.kpiName }}</span>
          <span>-&nbsp;未达标原因反馈</span>
        </h3>
        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="closeBtnClick"></a>
      </div>
      <div class="unqualified-response-reason-dialog__fixedtip">
        <span
          class="unqualified-response-reason-dialog__fixedtip-content">
          不提交反馈原因退出，会缓存选择项。清空浏览器缓存会清除选项。
        </span>
      </div>
      <div class="dialog__body">
        <ul class="unqualified-response-reason-dialog__reasons">
          <li v-for="(item,index) in allReasonList"
            :class="{
              'unqualified-response-reason-dialog__reasons-item--active':
                isSelected(item.RSN_ID)
            }"
            :key="index"
            class="unqualified-response-reason-dialog__reasons-item"
            @click="selectReason(item.RSN_ID)">
            <span :title="item.RSN_TYPE_NAME">{{ item.RSN_TYPE_NAME }}</span>
            <span :title="item.RSN_NAME">{{ item.RSN_NAME }}</span>
          </li>
        </ul>
      </div>

      <div class="dialog__footer">
        <a :class="{
             'btn--disabled': selectedReasonList.length === 0
           }"
          href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn-ok"
          @click="submitBtnClick">
          {{ dialogFooterOkBtnText }}
        </a>

        <a href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn-add"
          @click="addReasonBtnClick">
          增加原因
        </a>
      </div>

      <edit-index-reasons-dialog
        :display="editReasonsDialogDisplay"
        :rsnObj="parameters"
        :rsnTypeArr="$pagePayload.RSN_TYPE"
        :relatedRsnList="allReasonList"
        type="add"
        dialogFooterCancelBtnText="关闭"
        @okEdit="okEdit"
        @closeDialog="editReasonsDialogDisplay=false">
      </edit-index-reasons-dialog>

      <confirm-dialog
        :dialogBody="showConfirmDialogText"
        :display="showConfirmDialog"
        @okClicked="confirmOkClick"
        @closeDialog="showConfirmDialog=false">
      </confirm-dialog>
    </div>
  </teleporter>
</template>

<script>
  import Axios from "axios";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import EditIndexReasonsDialog from "./EditIndexReasonsDialog";
  import {
    mapGetters,
    mapActions
  } from "vuex";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default ({
    name: "unqualified-response-reason-dialog",

    components: {
      EditIndexReasonsDialog
    },

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "unqualified-response-reason-dialog"
      },

      // 传来包含入组样本ID和指标ID及指标名称的一个对象
      parameters: {
        type: Object,
        default() {
          return {};
        }
      },

      // 原始数据
      allReasonList: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        // 已经选择的原因列表
        selectedReasonList: [],

        // 是否显示 确认对话框
        showConfirmDialog: false,
        showConfirmDialogText: "",
        // 是否后端返回原因被修改状态码（然后就要据此切换“确定”对话框操作句柄内部逻辑）
        noSameClick: false,

        editReasonsDialogDisplay: false
      };
    },

    computed: {
      ...mapGetters([
        // 是否显示审核tab
        "isShowReview",
        // 审核红色tip
        "taskCount"
      ])
    },

    methods: {
      // 对话框展示的时候重新获取原因列表
      initDialog() {
        // 获取成功之后,全部 与 缓存中如果有相同的,
        // 就控制 this.selectedReasonList 让列表中显示选中
        this.compareCachedList();
      },

      // 挂载 Vuex action，用于向中央仓库写入新的 dateRange
      // 设置新的 dateRange 的时候，调用此 action
      ...mapActions([
        "changeTaskCount"
      ]),

      okEdit() {
        this.selectedReasonList = [];

        if (this.isShowReview) {
          this.changeTaskCount(this.taskCount + 1);
        }

        this.close();
      },

      // 读取 localStorage
      readCache() {
        try {
          return JSON.parse(localStorage.getItem("cachedReasonListv2"));
        } catch (err) {
          return null;
        }
      },

      // 写入 localStorage
      writeCache(obj) {
        localStorage.setItem("cachedReasonListv2", JSON.stringify(obj));
      },

      // 清空 localStorage
      removeTheCache() {
        localStorage.removeItem("cachedReasonListv2");
      },

      // 获取当前用户，当前患者，当前指标对应的缓存原因列表
      getPatientIsHasCache(cachedReason) {
        return cachedReason.filter((item) => {
          return item.userId === this.$config.USER.UserId &&
            item.kpiId === this.parameters.kpiId &&
            item.patientId === this.parameters.sdCpatNo;
        });
      },

      // 映射api返回的原因和本地缓存的原因的id列表，找出匹配项，勾选
      mapReasons(existArray) {
        return existArray.reduce((tmpList, cur) => {
          let tmp = this.allReasonList.find((item) => {
            return cur.rsnId === item.RSN_ID;
          });

          if (tmp) {
            tmpList.push(cur.rsnId);
          }

          return tmpList;
        }, []);
      },

      // 对比请求到的 所有的原因列表: 如果所有与缓存的 有对应,那么就让对应的选中
      compareCachedList() {
        // 获取上次缓存在 localStorage 中的原因
        let cachedReason = this.readCache(),
            existArray = [];

        // 从本地缓存中读取出了数据（暂时不知道是否数据可用/过期）
        if (cachedReason) {
          existArray = this.getPatientIsHasCache(cachedReason);

          // 读取出来可用数据
          if (existArray.length > 0) {
            this.selectedReasonList = this.mapReasons(existArray);
          }
        }
      },

      // 排除当前用户当前病例当前kpi下所有原因
      excludeAllCachedReasons(cachedReason) {
        return cachedReason.filter((item) => {
          // 对所有条件都成立的项 取反
          return !(item.userId === this.$config.USER.UserId &&
            item.kpiId === this.parameters.kpiId &&
            item.patientId === this.parameters.sdCpatNo);
        });
      },

      // 判断是否选中
      isSelected(rsnId) {
        return this.selectedReasonList.filter(function(value) {
          return value === rsnId;
        }).length === 1;
      },

      // 点击每一个原因的操作
      selectReason(rsnId) {
        let index = this.selectedReasonList.findIndex((item) => {
          return item === rsnId;
        });

        if (index > -1) {
          this.selectedReasonList.splice(index, 1);

          return;
        }

        if (this.selectedReasonList.length >= 3) {
          this.showError("请选择最主要的三个原因!");

          return;
        }
        this.selectedReasonList.push(rsnId);
      },

      // 点击关闭 取消 进行的操作
      closeBtnClick() {
        // 获取已经缓存的数组对象
        let cachedReason = this.readCache();

        // 如果没有缓存，就要构建
        if (!cachedReason) {
          cachedReason = [];
        }

        // 预先排除所有当前用户，当前病例，当前 kpi 下面所有原因
        cachedReason = this.excludeAllCachedReasons(cachedReason);

        // 然后添加当前选择原因
        this.selectedReasonList.forEach((rsnId) => {
          cachedReason.push({
            rsnId,
            kpiId: this.parameters.kpiId,
            userId: this.$config.USER.UserId,
            patientId: this.parameters.sdCpatNo
          });
        });

        // 清空已选
        this.selectedReasonList = [];
        // 写入缓存
        this.writeCache(cachedReason);

        // 所有拦截逻辑都执行完成之后再发出关闭事件
        this.close();
      },

      // 点击提交按钮的操作
      submitBtnClick() {
        if (this.selectedReasonList.length === 0) {
          return;
        }

        // 如果有需要反馈的原因,弹出对话框
        this.showConfirmDialogText = "是否确认提交反馈的原因? 提交后将无法修改!";
        this.noSameClick = false;
        this.showConfirmDialog = true;
      },

      // 添加原因按钮
      addReasonBtnClick() {
        this.editReasonsDialogDisplay = true;
      },

      // 弹出错误信息（failed）提示框
      showError(errmsg) {
        this.$showNotice({
          noticeText: errmsg,
          noticeType: "failed",
          logicClassName: "unqualified-response-reason-notice"
        });
      },

      // 添加原因
      confirmOkClick() {
        // 如果是后端发现已经合并的原因，就关闭所有对话框，不再进行添加操作
        if (this.noSameClick) {
          this.close();

          return;
        }

        Axios.post(resolveApiRoute("disease-add-index-reason", {
          SdCpatNo: this.parameters.sdCpatNo,
          KpiId: this.parameters.kpiId
        }), {
          RsnList: this.selectedReasonList.length === 0
            ? ""
            : this.selectedReasonList
        }).then((res) => {
          if (res.data.Code === 0) {
            // 当这个指标的原因反馈成功的时候 清除其对应的缓存列表
            let cachedReason = this.readCache();

            // 如果没有缓存，就要构建
            if (!cachedReason) {
              cachedReason = [];
            }

            cachedReason = this.excludeAllCachedReasons(cachedReason);
            // 重新写入缓存
            this.writeCache(cachedReason);

            // 通知父级原因反馈成功
            this.$emit("changeView", {
              selectedArr: this.getSelectedReasonsArr(),
              kpiCode: this.parameters.kpiId
            });

            this.selectedReasonList = [];
          } else if (res.data.Code === 2) {
            this.showError("原因失效，请刷新重试!");
          } else if (res.data.Code === 9) {
            this.showConfirmDialogText = "原因被修改，无法提交!";
            this.noSameClick = true;
            this.showConfirmDialog = true;
          } else {
            this.showError("服务器异常");
          }
        }, () => {
          this.showError("网络异常");
        });
      },

      // 筛选出已经选择的原因对象数组
      getSelectedReasonsArr() {
        return this.selectedReasonList.reduce((tmpList, cur) => {
          let foundRsns = this.allReasonList.filter((item) => {
            return item.RSN_ID === cur;
          });

          tmpList.push.apply(tmpList, foundRsns);

          return tmpList;
        }, []);
      }
    }
  });
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .unqualified-response-reason-dialog {
    @include dialog-css();

    &__fixedtip {
      width: sz(578);
      height: sz(32);
      border: 1px solid map-get($colors, notice-bar-cancel-border);
      background: map-get($colors, notice-bar-cancel-bg);
      color: map-get($colors, notice-bar-cancel-text);

      &-content {
        line-height: sz(32);
        margin-left: sz(10);
        font-size: map-get($font-sizes, xs);
      }
    }

    .dialog__header {
      span {
        color: map-get($colors, pure-white);
        display: inline-block;
        vertical-align: middle;
        font-size: map-get($font-sizes, sm);

        &:first-child {
          @include word-hidden(sz(382), max-width);
        }
      }
    }

    .dialog__body {
      height: sz(460);
      overflow-y: auto;
    }

    .dialog__footer {
      height: sz(50);
      line-height: sz(50);

      &-btn {
        // 增加原因
        &-add {
          // do not change the elements` appearing order in the dom tree.
          margin-left: sz(40 - 4);
        }
      }
    }

    &__reasons {
      @extend %normalized-list;

      &-item {
        @include border-radius(4px);

        height: sz(32);
        line-height: sz(32);
        border: 1px solid map-get($app-colors, dropdown-options-border);
        margin-top: sz(14);
        padding: 0;
        font-size: sz(13);
        color: map-get($colors, dialog-text-color);
        cursor: pointer;

        &:first-child {
          margin-top: sz(10);
        }

        &:last-child {
          margin-bottom: sz(10);
        }

        // 选中
        &--active {
          background: url("~__libs/imgs/selected-reason.png") no-repeat top
            right;
          background-size: sz(25) sz(25);
        }

        span {
          display: inline-block;
          height: sz(20);
          line-height: sz(20);
          float: left;
          margin-top: sz(7);
          text-align: left;

          &:nth-child(1) {
            @include word-hidden(sz(110));

            border-right: 1px solid
              map-get($app-colors, dropdown-options-border);
            padding-left: sz(10);
          }

          &:nth-child(2) {
            @include word-hidden(sz(395));

            margin-left: sz(10);
          }
        }
      }
    }

    // 重定义 notice 在当前视图下的宽度, 使用 @at-root 编译到当前
    // BEM 最下面（具体参照css编译码）
    @at-root {
      .unqualified-response-reason-notice {
        width: sz(400);
      }
    }
  }
</style>
