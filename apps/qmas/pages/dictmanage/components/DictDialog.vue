<template>
  <teleporter>
    <div
      :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName
      ]"
      class="dialog">
      <!-- 弹出框头 -->
      <div class="dialog__header clearfix">
        <h3 class="dict-dialog__header-text">
          <template v-if="isAdd">新增项目</template>
          <template v-else>编辑项目</template>
        </h3>

        <a
          :title="dialogFooterCancelBtnText"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"
        ></a>
      </div>
      <!-- 弹出框内容 -->
      <div class="dialog__body">
        <div class="dict-dialog__body-dicttype clearfix">
          <span class="dict-dialog__body-dicttype-span">
            字典类型
          </span>
          <input
            v-model="dictType"
            :disabled="true"
            class="dict-dialog__body-dicttype-editinputtype"
            type="text"
            placeholder="请输入"
          />
          <b class="dict-dialog__body-dicttype-requiredflag">*</b>
        </div>
        <div class="dict-dialog__body-dictvalue clearfix">
          <span class="dict-dialog__body-dictvalue-span">
            字典值
          </span>
          <input
            v-model="dictValue"
            class="dict-dialog__body-dictvalue-editinput"
            type="text"
            placeholder="请输入"
            maxlength="20"
            @blur="onBlurTestDictValue"
          />
          <b class="dict-dialog__body-dictvalue-requiredflag">*</b>
        </div>
        <div
          :class="{
            'dict-dialog__body-dictvaluewarning--warning': isOk
          }"
          class="dict-dialog__body-dictvaluewarning"
        >
          <span>{{ warningmsg }}</span>
        </div>

        <div class="dict-dialog__body-validflag clearfix">
          <span class="dict-dialog__body-validflag-span">
            是否启用
          </span>
          <select-dropdown-v2
            v-model="dictValid"
            :dropDownMaxHeight="210"
            :options="validstate"
            label="ITEM_NAME"
            trackBy="ITEM_CODE"
          >
            <template
              slot="drop"
              slot-scope="dropContent">
              <p class="select-dropdown-v2-options__items-item-text">
                {{ dropContent.options.ITEM_NAME }}
              </p>
            </template>
          </select-dropdown-v2>
          <b class="dict-dialog__body-validflag-requiredflag">*</b>
        </div>
      </div>
      <!-- 弹出框尾 -->
      <div class="dialog__footer">
        <a
          href="javascript:;"
          class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
          @click="cancelBtnClicked"
        >{{ dialogFooterCancelBtnText }}</a>

        <a
          href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn-ok"
          @click="okBtnClicked"
        >确认</a>
      </div>
    </div>
  </teleporter>
</template>

<script>
  import Axios from "axios";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "dict-dialog",

    components: {},

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "dict-dialog"
      },

      dictBaseData: {
        type: Object,
        default() {
          return {};
        }
      },

      isAdd: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        dictTypeId: "",
        dictType: "",
        dictValue: "",
        dictValid: null,

        marginTop: 70,

        newDictInfo: {},

        validstate: [
          {
            ITEM_CODE: 0,
            ITEM_NAME: "停用"
          },
          {
            ITEM_CODE: 1,
            ITEM_NAME: "启用"
          }
        ],
        // 字典值验证信息
        warningmsg: "",
        isOk: false
      };
    },

    methods: {
      // 验证字典值格式
      onBlurTestDictValue() {
        this.testDictValue();
      },

      // 验证字典值
      testDictValue() {
        if (this.dictValue.trim() !== "") {
          if (this.dictValue.trim().length > 20) {
            this.warningmsg = "字典值不能大于20个字符";
            this.isOk = true;
          } else {
            this.isOk = false;
          }
        } else {
          this.warningmsg = "请输入字典值";
          this.isOk = true;
        }
      },

      // 初始化对话框
      initDialog() {
        this.dictTypeId = this.dictBaseData.DICT_TYPE_ID
          ? this.dictBaseData.DICT_TYPE_ID : "";
        this.dictType = this.dictBaseData.DICT_TYPE
          ? this.dictBaseData.DICT_TYPE : "";
        this.dictValue = this.dictBaseData.DICT_VALUE
          ? this.dictBaseData.DICT_VALUE : "";
        this.dictValid = this.validstate.find((item) => {
          return item.ITEM_CODE === this.dictBaseData.IS_VAILD;
        });
      },

      close() {
        this.clearCacheData();
        this.$emit("closeDialog");
      },

      clearCacheData() {
        this.dictTypeId = "";
        this.dictType = "";
        this.dictValue = "";
        this.dictValid = this.validstate[1];
        this.isOk = false;
      },

      okBtnClicked() {
        this.testDictValue();

        if (!this.isOk) {
          // 确认 添加或编辑
          this.newDictInfo = {
            TYPE_ID: this.dictTypeId,
            VALUE_ID: this.dictBaseData.VALUE_ID,
            VALUE_NAME: this.dictValue.trim(),
            IS_VALID: this.dictValid.ITEM_CODE
          };
          this.fetchSaveDictData();
        }
      },

      // 取消按钮执行的操作
      cancelBtnClicked() {
        this.close();
      },

      fetchSaveDictData() {
        Axios.post(resolveApiRoute("dict-update"), this.newDictInfo).then(
          (res) => {
            if (res.data.Code === 0) {
              // 保存成功
              this.close();

              if (this.isAdd) {
                this.$showNotice("添加成功");
              } else {
                this.$showNotice("编辑成功");
              }
              this.$emit("fetchData", ["search", true, this.newDictInfo]);
              // this.$emit("refreshTree", this.newDictInfo);
            } else if (res.data.Code === 2) {
              // 字典值已存在
              // this.$showNotice("字典值已存在", "failed");
              this.warningmsg = res.data.Msg;
              this.isOk = true;
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .dict-dialog {
    @include dialog-css(sz(480), sz(319));

    .dialog__header {
      h3 {
        font-size: sz(16);
      }
    }

    .dialog__body {
      padding: sz(20) 0 sz(35) 0;
      text-align: left;
    }

    &__body {
      &-dicttype,
      &-dictvalue,
      &-validflag {
        margin: sz(12) 0 0 0;
        height: sz(34);
        line-height: sz(34);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        .select-dropdown-v2 {
          float: left;
          width: sz(200);
          height: sz(34);
          margin-left: sz(10);

          &__selected {
            font-size: map-get($font-sizes, xs);
            height: sz(32);
            line-height: sz(32);
            border-color: map-get($colors, dialog-input-border);

            &-placeholder {
              height: sz(32);
              line-height: sz(32);
              font-size: map-get($font-sizes, xs);
            }

            &-input,
            &-plain {
              height: sz(32);
              font-size: map-get($font-sizes, xs);
              line-height: sz(32);
            }
          }
        }

        .select-dropdown-v2-options {
          &__items-item-text {
            font-size: map-get($font-sizes, xs);
          }
        }

        &-editinput {
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);
          @include placeholder-color(map-get($colors, placeholder-text-color));
          @include border-radius(5px);

          float: left;
          width: sz(200);
          height: sz(34);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          margin-left: sz(10);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        &-requiredflag {
          float: left;
          font-size: sz(25);
          margin-left: sz(10);
          color: map-get($app-colors, error-text-color);
          margin-top: sz(5);
          height: sz(27);
        }

        &-editinputtype {
          background: map-get($colors, pure-white);
          border: none;
          float: left;
          width: sz(200);
          height: sz(34);
          padding-left: sz(10);
          margin-left: sz(10);
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);
        }
      }

      &-dicttype {
        margin-bottom: sz(20);
      }

      &-dictvaluewarning {
        visibility: hidden;
        text-align: left;
        height: sz(27);
        margin-top: sz(5);
        position: relative;

        span {
          display: inline-block;
          position: absolute;
          top: sz(0);
          left: sz(0);
          height: sz(15);
          font-size: map-get($font-sizes, xs);
          height: sz(12);
          line-height: sz(12);
          margin-left: sz(162);
          border: 1px solid transparent;
          color: map-get($colors, theme-red);
        }

        &--warning {
          visibility: visible;
        }
      }
    }

    // 重定义body下下拉框的样式
    @at-root {
      .dict-dialog-select-dropdown {
        .select-dropdown-v2-options__items-item-text {
          overflow: visible;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
