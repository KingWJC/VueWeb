<template>
  <teleporter>
    <div :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName
      ]"
      class="dialog">
      <!--标题-->
      <div class="dialog__header clearfix">
        <h3>
          <template v-if="type === 'add'">
            增加原因
          </template>
          <template v-if="type === 'review'">
            原因审核
          </template>
        </h3>

        <a title="取消"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"></a>
      </div>

      <!--内容-->
      <div class="dialog__body">
        <!--操作部分-->
        <div v-if="rsnObj"
          class="edit-index-reasons-dialog__handle">
          <span class="edit-index-reasons-dialog__handle-title">
            <template v-if="type === 'add'">
              填写新原因信息
            </template>
            <template v-if="type === 'review'">
              提交的原因信息
            </template>
          </span>

          <div class="edit-index-reasons-dialog__handle-handlemsg">
            <div class="edit-index-reasons-dialog__handle-handlemsg-item
              clearfix">
              <label>关联病种</label>
              <span>{{ rsnObj.sdName }}</span>
            </div>

            <div class="edit-index-reasons-dialog__handle-handlemsg-item
              clearfix">
              <label>关联指标</label>
              <div class="edit-index-reasons-dialog__handle-handlemsg-kpiname">
                <p :title="rsnObj.kpiName">{{ bytesKpiName }}</p>
              </div>
            </div>

            <div class="edit-index-reasons-dialog__handle-handlemsg-item
              clearfix">
              <label>原因类型</label>
              <div
                class="edit-index-reasons-dialog__handle-handlemsg-selectbox">
                <select-dropdown-v2
                  v-model="rsnTypeSelected"
                  :dropDownMaxHeight="117"
                  :options="rsnTypeArr"
                  trackBy="RSN_TYPE_CODE"
                  label="RSN_TYPE_NAME"
                  optionsLogicClassName="edit-index-reasons-select-dropdown"
                  @optionChanged="changeType">
                </select-dropdown-v2>
              </div>

              <p
                :class="{
                  'edit-index-reasons-dialog__handle-errmsg--active':
                    isRsnTypeErr
                }"
                class="edit-index-reasons-dialog__handle-errmsg">
                请选择原因类型
              </p>
            </div>

            <div class="edit-index-reasons-dialog__handle-handlemsg-item
              clearfix">
              <label><i>占位</i>原因</label>

              <div class="edit-index-reasons-dialog__reason clearfix">
                <textarea
                  :class="{
                    'edit-index-reasons-dialog__reason-con--active':
                      reasonFilterList.length > 0,
                    'edit-index-reasons-dialog__reason-con--disabled':
                      !isSearchSelectActive
                  }"
                  :disabled= "!isSearchSelectActive"
                  :maxlength="rsnLength()"
                  v-model="rsnName"
                  class="edit-index-reasons-dialog__reason-con"
                  @input="isInput">
                </textarea>

                <div v-if="reasonFilterList.length > 0"
                  class="edit-index-reasons-dialog__reason-list">
                  <ul class="edit-index-reasons-dialog__reason-list-items">
                    <li v-for="(item, index) in reasonFilterList"
                      :key="index"
                      :title="item.RSN_NAME"
                      class="edit-index-reasons-dialog__reason-list-item"
                      @click="clickQuery(item.RSN_NAME)"
                      v-text="item.RSN_NAME">
                    </li>
                  </ul>
                </div>
              </div>

              <p
                :class="{
                  'edit-index-reasons-dialog__handle-errmsg--active':
                    isRsnErr
                }"
                class="edit-index-reasons-dialog__handle-errmsg">
                {{ rsnErrMsg }}
              </p>

              <p
                :class="{
                  'edit-index-reasons-dialog__handle-errmsg--active':
                    isRsnEmptyErr
                }"
                class="edit-index-reasons-dialog__handle-errmsg">
                {{ rsnEmptyErrMsg }}
              </p>
            </div>
          </div>
        </div>

        <!--列表部分-->

        <div class="edit-index-reasons-dialog__table">
          <span class="edit-index-reasons-dialog__table-title">
            当前指标已关联的原因
          </span>
          <template v-if="relatedRsnList.length !== 0">
            <table class="edit-index-reasons-dialog__table-head">
              <thead>
                <tr>
                  <th>原因类型</th>
                  <th>原因</th>
                </tr>
              </thead>
            </table>

            <div class="edit-index-reasons-dialog__table-body-wrapper">
              <table class="edit-index-reasons-dialog__table-body">
                <tbody>
                  <tr v-for="(item, index) in relatedRsnList"
                    :key="index">
                    <td>
                      <p :title="item.RSN_TYPE_NAME">
                        {{ item.RSN_TYPE_NAME }}
                      </p>
                    </td>
                    <td>
                      <p :title="item.RSN_NAME">{{ item.RSN_NAME }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <!-- 无饼图展示 -->
            <qa-no-content
              :title="'暂无关联原因'">
            </qa-no-content>
          </template>
        </div>
      </div>

      <div class="dialog__footer">
        <template v-if="type === 'add'">
          <a href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="close">
            取消
          </a>
          <a href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn"
            @click="submitBtnClick">
            提交
          </a>
        </template>

        <template v-if="type === 'review'">
          <a href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="reject">
            拒绝
          </a>
          <a href="javascript:;"
            class="btn dialog__footer-btn dialog__footer-btn"
            @click="pass">
            通过
          </a>
        </template>
      </div>

      <!--提示弹框 -->
      <confirm-dialog
        :display="displayMsgDialog"
        :dialogHeaderTitle="'提示'"
        :dialogBody="axiosMsgStatusText"
        :dialogHeaderCloseBtn="true"
        @okClicked="requestMsg"
        @closeDialog="displayMsgDialog=false">
      </confirm-dialog>
    </div>
  </teleporter>
</template>

<script>
  import Axios from "axios";
  import $ from "jquery";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import isClickOutsideEl from "__shared-libs/js/modules/is-click-outside-el";
  import QaNoContent from "__libs/components/QaNoContent";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "edit-index-reasons-dialog",

    components: {
      QaNoContent
    },

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "edit-index-reasons-dialog"
      },

      type: {
        type: String,
        default: ""
      },

      rsnObj: {
        type: Object,
        default() {
          return {};
        }
      },

      rsnTypeArr: {
        type: Array,
        default() {
          return [];
        }
      },

      relatedRsnList: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        // 原因列表
        reasonList: [],
        // 原因整理对话框 筛选后的可选原因列表
        reasonFilterList: [],

        // 提示对话框
        displayMsgDialog: false,
        axiosMsgStatusText: null,

        // selectV2
        rsnTypeSelected: null,

        // 激活下拉
        isSearchSelectActive: false,
        // 原因名字(添加时)
        rsnName: "",

        // 新添和修改的原因类型
        selectRsnTypeCode: "",
        selectRsnMsg: "",

        // 审核状态
        applyState: null,
        // 原因错误信息
        rsnErrMsg: "",
        // err信息
        isRsnTypeErr: false,
        isRsnErr: false,
        isRsnEmptyErr: false,
        rsnEmptyErrMsg: "",
        isCheckRsnLength: false,
        hasDocClickDebouncer: false
      };
    },

    computed: {
      // 处理kpiName的字符长度
      bytesKpiName() {
        if (this.rsnObj.kpiName) {
          // i 两行最多64个字符
          if (this.byteTools(this.rsnObj.kpiName, 100, "lte")) {
            return this.rsnObj.kpiName;
          } else {
            for (let i = 0; i < this.rsnObj.kpiName.length; i++) {
              if (this.byteTools(
                this.rsnObj.kpiName.substr(0, i),
                100,
                "gte"
              )) {
                return this.rsnObj.kpiName.substr(0, i - 2) + "...";
              }
            }
          }
        }
      }
    },

    watch: {
      rsnName(val) {
        // 判断是否选中下拉框中原因名称，若选中则不再显示下拉框
        if (this.reasonList.findIndex((item) => {
          return item.RSN_NAME === val;
        }) > -1) {
          this.reasonFilterList = [];
        } else {
          this.searchContent(val);
        }
      },

      reasonList(val) {
        // 如果下拉框有可选项，而且事件句柄没有被注册过，才注册
        // 否则每发生一次筛选都会注册一次事件
        if (val.length > 0 && !this.hasDocClickDebouncer) {
          // 标记为事件已注册
          this.hasDocClickDebouncer = true;
          $(document).on("click", this.docClickDebouncer);
        } else {
          // 标记为事件未注册
          $(document).off("click", this.docClickDebouncer);
          this.hasDocClickDebouncer = false;
        }
      }
    },

    methods: {
      // 输入内容是否改变
      isInput() {
        this.isCheckRsnLength = false;
        this.isRsnEmptyErr = false;
      },

      // 判断字符串的字符数
      byteTools(str, num, operator) {
        let flag;
        let len = str.replace(/[^\\x00-\\xFF]/g, "**").length;

        if (operator === "gte") {
          flag = len >= num;
        } else if (operator === "lte") {
          flag = len <= num;
        }

        return flag;
      },

      // 设置只能输入70个字符
      rsnLength() {
        if (!this.isCheckRsnLength) {
          // 判断是否大于70个字符
          if (this.byteTools(this.rsnName, 70, "gte")) {
            // 大于70字符时,截取字符串
            for (let i = 0; i < this.rsnName.length; i++) {
              if (this.byteTools(this.rsnName.substr(0, i), 70, "gte")) {
                this.rsnName = this.rsnName.substr(0, i);
                this.isRsnErr = true;
                this.rsnErrMsg = "已达输入上限";
              }
            }
          } else {
            this.isRsnErr = false;
            this.rsnErrMsg = "";
          }
        }
      },

      // 拒绝
      reject() {
        // 弹出提示
        this.axiosMsgStatusText = "拒绝后，将不会增加在原因设置中是否继续？";
        this.displayMsgDialog = true;
        // 审核状态
        this.applyState = 2;
      },

      // 通过
      pass() {
        if (this.rsnName.trim() === "") {
          this.isRsnEmptyErr = true;
          this.rsnEmptyErrMsg = "请输入原因";

          return;
        }

        // 弹出提示
        this.axiosMsgStatusText = "通过审核后，该原因会加入原因设置，是否继续？";
        this.displayMsgDialog = true;
        // 审核状态
        this.applyState = 1;
      },

      // 审核对话框父组件code传来后,组件根据code筛选
      filterRsnTypeCode() {
        // 根据审核传来的typecode筛选
        return this.rsnTypeArr.find((item) => {
          return this.rsnObj.rsnTypeCode === item.RSN_TYPE_CODE;
        });
      },

      // 提交按钮验证
      submitBtnClick() {
        if (!this.rsnTypeSelected) {
          this.isRsnTypeErr = true;

          return;
        }

        if (this.rsnName.trim() === "") {
          this.isRsnEmptyErr = true;
          this.rsnEmptyErrMsg = "请输入原因";

          return;
        }

        // 弹出提示
        this.axiosMsgStatusText =
          "原因提交后，需管理员审核通过才可以使用。可去任务中心查看审核进度!";
        this.displayMsgDialog = true;
      },

      // 下拉框选择
      clickQuery(content) {
        this.rsnName = content;
      },

      // 筛选原因类型下的原因
      filterReasonTypeCodeList() {
        return this.reasonList.reduce((temp, item) => {
          if (item.RSN_TYPE_CODE === this.rsnTypeSelected.RSN_TYPE_CODE) {
            temp.push(item);
          }

          return temp;
        }, []);
      },

      // 过滤为包含指定内容的原因列表
      searchContent(content) {
        content = content.trim();

        if (content !== "") {
          let temps = this.filterReasonTypeCodeList();

          this.reasonFilterList = temps.reduce((temp, item) => {
            if (item.RSN_NAME.includes(content)) {
              temp.push(item);
            }

            return temp;
          }, []);
        } else {
          this.reasonFilterList = [];
        }
      },

      // 对话框展示的时候重新获取原因列表
      initDialog() {
        if (this.type === "review") {
          this.rsnTypeSelected = this.filterRsnTypeCode();
          this.isSearchSelectActive = true;
          this.rsnName = this.rsnObj.rsnMsg;
        }

        this.fetchData();
      },

      // 弹出错误信息（failed）提示框
      showError(errmsg) {
        this.$showNotice({
          noticeText: errmsg,
          noticeType: "failed",
          logicClassName: "edit-index-reasons-notice"
        });
      },

      // 关闭弹窗后清理状态，初始化变量
      cleanUp() {
        // 清空原因类型
        this.rsnTypeSelected = null;
        // 原因描述框状态置灰
        this.isSearchSelectActive = false;
        // 原因内容清空
        this.rsnName = "";

        // 原因code清除(手选的)
        this.selectRsnTypeCode = "";

        this.reasonList = [];
        // 审核状态
        this.applyState = null;

        // 原因错误信息
        this.rsnErrMsg = "";
        // err信息
        this.isRsnTypeErr = false;
        this.isRsnErr = false;
        this.isRsnEmptyErr = false;
        this.rsnEmptyErrMsg = "";
        this.isCheckRsnLength = false;
      },

      // 新增未保存时dialog关闭弹出提示
      close() {
        // 父类逻辑
        if (this.allowClosing) {
          // 清空之前的列表，准备请求api或许新数据
          this.cleanUp();

          this.$emit("closeDialog");
        }
      },

      // V2下拉框选择事件
      changeType(obj) {
        // 记录选中的原因code
        this.selectRsnTypeCode = obj.RSN_TYPE_CODE;
        // 激活下拉
        this.isSearchSelectActive = true;
        // 提示文案消失
        this.isRsnTypeErr = false;
        this.isRsnErr = false;
        this.isRsnEmptyErr = false;
      },

      // 是否点击目标区域外 -> 关闭下拉
      docClickDebouncer(evt) {
        if (!isClickOutsideEl(
          evt,
          this.$el.querySelector(".edit-index-reasons-dialog__reason-con")
        )) {
          this.reasonFilterList = [];
        }
      },

      // 确认框请求
      requestMsg() {
        if (this.type === "review") {
          this.reviewFetchData();
        } else {
          this.addFetchData();
        }
      },

      // 添加原因请求
      addFetchData() {
        Axios.post(resolveApiRoute("sd-index-reason-info", {
          SdId: this.rsnObj.sdId,
          KpiId: this.rsnObj.kpiId
        }), {
          RsnTypeCode: this.selectRsnTypeCode,
          RsnName: this.rsnName.trim()
        }).then((res) => {
          if (res.data.Code === 0) {
            // 成功后上报状态,以关闭父对话框
            this.$emit("okEdit", "ok");
            // 关闭自身
            this.okBtnClick();
          } else if (res.data.Code === 1) {
            this.showError("操作失败");
          } else if (res.data.Code === 2 ) {
            this.isCheckRsnLength = true;
            this.isRsnErr = true;
            this.rsnErrMsg = "原因重复,请重新输入";
          } else if (res.data.Code === 3) {
            this.isCheckRsnLength = true;
            this.isRsnErr = true;
            this.rsnErrMsg = "有其他原因类型使用该描述，请重新输入";
          } else if (res.data.Code === 4) {
            this.isCheckRsnLength = true;
            this.isRsnErr = true;
            this.rsnErrMsg = "该申请已存在，请重新输入";
          } else {
            this.showError("服务器异常");
          }
        }, () => {
          this.showError("网络异常");
        });
      },

      // 审核原因请求
      reviewFetchData() {
        // 拒绝时  原因应该传递修改之前的值
        if (this.applyState === 2) {
          this.selectRsnTypeCode = this.rsnObj.rsnTypeCode;
          this.rsnName = this.rsnObj.rsnMsg;
        }

        Axios.put(resolveApiRoute(
          "apply-state",
          {
            ApplyId: this.rsnObj.applyId
          }
        ), {
          RsnTypeCode: this.selectRsnTypeCode === ""
            ? this.rsnObj.rsnTypeCode
            : this.selectRsnTypeCode,
          RsnName: this.rsnName.trim(),
          ApplyState: this.applyState
        }).then((res) => {
          if (res.data.Code === 0) {
            // 审核成功
            this.$emit("okEdit", "ok");
            // 关闭当前dialog
            this.close();
          } else if (res.data.Code === 1) {
            this.showError("操作失败");
          } else if (res.data.Code === 2) {
            this.showError("审核数据失效");
          } else if (res.data.Code === 3) {
            this.isCheckRsnLength = true;
            this.isRsnErr = true;
            this.rsnErrMsg = "原因重复,请重新输入";
          } else if (res.data.Code === 4) {
            this.isCheckRsnLength = true;
            this.isRsnErr = true;
            this.rsnErrMsg = "有其他原因类型使用该描述，请重新输入";
          } else {
            this.showError("服务器异常");
          }
        }, () => {
          this.showError("网络异常");
        });
      },

      // 对话框初始请求
      fetchData() {
        Axios.get(resolveApiRoute("auto-match-reason", {
          SdId: this.rsnObj.sdId,
          KpiId: this.rsnObj.kpiId
        })).then((res) => {
          // get body data
          if (res.data.Code === 0) {
            this.reasonList = res.data.Data.Data;
          } else if (res.data.Code === 1) {
            this.showError("列表请求失败");
          } else {
            this.showError("服务器异常");
          }
        }, () => {
          this.showError("网络异常");
        });
      }
    }
  };

</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .edit-index-reasons-dialog {
    @include dialog-css(sz(860), sz(470));

    .dialog__header {
      h3 {
        span {
          @include word-hidden(sz(350), max-width);

          display: inline-block;
          vertical-align: middle;
        }
      }
    }

    .dialog__body {
      padding: sz(10);
    }

    .dialog__footer {
      height: sz(49);
      line-height: sz(49);
      border-top: 1px solid map-get($colors, dialog-cancel-border);

      &-btn {
        height: sz(30 - 2);
        line-height: sz(30 - 2);
      }
    }

    &__handle,
    &__table {
      &-title {
        display: block;
        height: sz(30 - 1);
        line-height: sz(30 - 1 - 10);
        border-bottom: 1px solid map-get($colors, dialog-cancel-border);
      }
    }

    &__handle {
      float: left;
      width: sz(410 - 20);
      padding-right: sz(10);

      &-handlemsg {
        height: sz(282);

        &-item {
          text-align: left;
          margin-top: sz(10);

          &:nth-child(2) {
            margin: 0;
          }

          &:nth-child(3) {
            height: sz(63);
          }

          &:last-child {
            margin: 0;

            > label > i {
              visibility: hidden;
            }
          }

          .select-dropdown-v2 {
            width: sz(300);

            &__selected {
              height: sz(32);
              color: map-get($colors, dialog-input-border);

              &-plain {
                text-align: left;
                font-size: map-get($font-sizes, xs);
                line-height: sz(32);
              }

              &-placeholder {
                height: sz(34 - 2);
                line-height: sz(32);
                font-size: map-get($font-sizes, xs);
              }
            }
          }

          > label {
            float: left;
            line-height: sz(34);
            margin: 0 sz(10);
          }

          > span {
            line-height: sz(34);
            font-size: map-get($font-sizes, xs);
            color: map-get($colors, dialog-text-color);
          }
        }

        &-kpiname {
          float: left;
          width: sz(300);

          > p {
            margin: sz(10) 0 0;
            font-size: map-get($font-sizes, xs);
            color: map-get($colors, dialog-text-color);
          }
        }

        &-selectbox {
          float: left;
        }
      }

      &-errmsg {
        float: left;
        font-size: map-get($font-sizes, xs);
        margin: 2px 0 0 sz(75);
        color: map-get($colors, theme-red);
        display: none;

        &--active {
          display: block;
        }
      }
    }

    &__table {
      border-left: 1px solid map-get($colors, dialog-cancel-border);
      height: 100%;
      width: sz(449 - 20 - 1);
      padding-left: sz(10);
      float: left;

      &-body-wrapper {
        height: sz(400-1);
        overflow: auto;
      }

      &-head,
      &-body {
        border-collapse: collapse;
        text-align: left;
        width: 100%;

        thead {
          tr {
            border-bottom: 1px solid map-get($colors, dialog-cancel-border);

            th {
              height: sz(40 - 2);
              text-align: left;
              font-weight: bold;

              &:nth-child(1) {
                width: sz(100);
                padding: 0;
                text-indent: sz(10);
              }
            }
          }
        }

        tbody {
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);

          tr {
            height: sz(30);
            border-bottom: 1px solid map-get($colors, dialog-cancel-border);

            td {
              padding: 0;

              > p {
                @extend %overflow-hidden-word;

                margin: 0;
                line-height: sz(30);
              }

              &:nth-child(1) {
                width: sz(100);

                > p {
                  padding: 0 sz(10);
                  width: sz(80);
                }
              }

              &:nth-child(2) {
                > p {
                  width: sz(305);
                }
              }
            }
          }
        }
      }

      &-tfoot {
        height: sz(34);
        padding: sz(2) 0;
      }
    }

    &__reason {
      position: relative;

      &-con {
        // 媒体查询 监测ie10浏览器 执行{}中input字体重置
        @include patch-ie10-input-font();

        font-size: map-get($font-sizes, xs);
        border-radius: sz(4);
        float: left;
        width: sz(300);
        height: sz(60);
        line-height: sz(22);
        padding: sz(8) sz(10);
        border: 1px solid map-get($colors, dialog-input-border);
        resize: none;
        overflow: hidden;
        word-break: break-all;

        &:focus {
          border: 1px solid map-get($colors, theme-blue);
        }

        &--active {
          border-radius: sz(4) sz(4) 0 0;
        }

        &--disabled {
          cursor: not-allowed;
          background: map-get($colors, dialog-input-disabled-bg);
        }
      }

      &-list {
        position: absolute;
        padding: 0;
        top: sz(62);
        left: sz(76);
        width: sz(300 - 2);
        max-height: sz(112);
        overflow-y: auto;
        z-index: 1;
        background: map-get($colors, pure-white);
        border-radius: 0 0 sz(4) sz(4);
        border: 1px solid rgba(map-get($colors, pure-black), 0.16);

        &-items {
          @extend %normalized-list;

          list-style: none;
        }

        &-item {
          @include word-hidden(240);

          font-size: map-get($font-sizes, xs);
          padding: 0 sz(10);
          height: sz(28);
          line-height: sz(28);
          cursor: pointer;
          text-align: left;

          &:hover {
            color: map-get($colors, pure-white);
            background: rgba(map-get($colors, echart-blue), 0.7);
          }
        }
      }
    }
    // 重定义 notice-dialog 在当前视图下的宽度, 使用 @at-root 编译到当前
    // BEM 最下面（具体参照css编译码）
    @at-root {
      .edit-index-reasons-noticen {
        width: sz(398);
      }

      .edit-index-reasons-select-dropdown {
        .select-dropdown-v2-options__items-item {
          padding: 0 sz(10);
          font-size: map-get($font-sizes, xs);
        }
      }
    }
  }
</style>
