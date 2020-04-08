<template>
  <div class="trend-set-box">
    <img :title="titleTips"
      src="~__libs/imgs/trend_set.png"
      class="trend-set-box__trigger"
      @click="toggleBox" />

    <div :class="{'hide': !display}"
      class="trend-set-box__cont">
      <p class="trend-set-box__cont-title">
        <span class="trend-set-box__cont-title-txt">趋势类型</span>
      </p>

      <ul class="trend-set-box__cont-items">
        <li v-for="(item, index) in setList"
          :key="index"
          class="trend-set-box__cont-items-item">
          <p class="trend-set-box__cont-items-item-parent"
            @click="toggleShowParent(item.itemCode)">
            <customize-checkbox
              v-model="parentSelectedCode"
              :value="item.itemCode"
              :allowEmpty="false"
              type="radio">
            </customize-checkbox>

            <span class="trend-set-box__cont-items-item-parent-name">
              {{ item.itemName }}
            </span>

            <i
              :class="{
                'trend-set-box__cont-items-item-parent-triangle--open':
                  item.itemCode === parentShowCode
              }"
              class="trend-set-box__cont-items-item-parent-triangle">
            </i>
          </p>

          <div v-if="item.itemCode === parentShowCode"
            class="trend-set-box__cont-items-item-lists">
            <p v-if="item.ctrlList.length > 0">
              <span v-for="(ctrl, idx) in item.ctrlList"
                :key="idx">
                <customize-checkbox
                  v-model="ctrlSelectedList"
                  :hasText="true"
                  :txt="ctrl.ctrlName"
                  :value="ctrl.code"
                  :disabled="item.itemCode !== parentSelectedCode">
                </customize-checkbox>
              </span>
            </p>

            <ul class="trend-set-box__cont-items-item-lists-childs">
              <!-- eslint-disable vue/require-v-for-key, vue/valid-v-for -->
              <template v-for="child in item.childList">
                <template v-if="childIsDisabled(item, child)">
                  <li
                    v-tooltips:trendSetTips="
                      `已经达到${item.itemName.slice(0, -2)}选择上限`
                    "
                    class="trend-set-box__cont-items-item-lists-childs-child">
                    <customize-checkbox
                      v-model="childSelectedList"
                      :hasText="true"
                      :txt="child.childName"
                      :value="child.code"
                      :disabled="childIsDisabled(item, child)">
                    </customize-checkbox>
                  </li>
                </template>
                <template v-else>
                  <li
                    class="trend-set-box__cont-items-item-lists-childs-child">
                    <customize-checkbox
                      v-model="childSelectedList"
                      :hasText="true"
                      :txt="child.childName"
                      :value="child.code"
                      :disabled="childIsDisabled(item, child)">
                    </customize-checkbox>
                  </li>
                </template>
              </template>
              <!-- eslint-enable vue/require-v-for-key, vue/valid-v-for -->
            </ul>
          </div>
        </li>
      </ul>

      <div class="trend-set-box__cont-bottom">
        <a href="javascript:;"
          class="btn btn--white trend-set-box__cont-bottom-cancel"
          @click="cancel">
          取消
        </a>

        <a :class="{'btn--disabled': childSelectedList.length === 0}"
          href="javascript:;"
          class="btn trend-set-box__cont-bottom-save"
          @click="save">
          保存
        </a>
      </div>
    </div>

    <tooltips
      ref="trendSetTips"
      :marginTop="15"
      :marginLeft="40"
      direction="topleft"
      logicClassName="trend-set-tooltips">
    </tooltips>
  </div>
</template>

<script>
  import $ from "jquery";
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import isClickOutsideEl from "__shared-libs/js/modules/is-click-outside-el";

  export default {
    name: "trend-set-box",

    components: {
      CustomizeCheckbox
    },

    props: {
      setList: {
        type: Array,
        default() {
          return [];
        }
      },

      // 鼠标悬停提示文案
      titleTips: {
        type: String,
        default: "趋势设置"
      }
    },

    data() {
      return {
        // 是否显示设置内容
        display: false,

        // 控制内容的选中列表
        ctrlSelectedList: [],

        // 子类的选中情况
        childSelectedList: [],

        // 母类的选择情况
        parentSelectedCode: "",

        // 母类的展示情况
        parentShowCode: ""
      };
    },

    watch: {
      display(val) {
        if (val) {
          this.initBox();
          $(document).on("click", this.outToggleBox);
        } else {
          $(document).off("click", this.outToggleBox);
        }
      },

      // 母类选择发生变化的时候
      parentSelectedCode(val, oldVal) {
        if (oldVal === "") {
          return;
        }
        let index = this.setList.findIndex((item) => {
          return item.itemCode === this.parentSelectedCode;
        });

        this.ctrlSelectedList =
          this.getCtrlSelectedList(this.setList[index].ctrlList);
        this.childSelectedList =
          this.getCtrlSelectedList(this.setList[index].childList);
      }
    },

    methods: {
      // 子类是否为 disabled 状态
      childIsDisabled(parent, child) {
        return parent.itemCode !== this.parentSelectedCode ||
          (
          this.childSelectedList.length === 5 &&
          this.childSelectedList.indexOf(child.code) === -1
        );
      },

      // 取消按钮操作
      cancel() {
        this.display = false;
      },

      // 保存按钮操作
      save() {
        if (this.childSelectedList.length === 0) {
          return;
        }

        this.$emit("saveSetResult", {
          itemCode: this.parentSelectedCode,
          ctrlList: this.ctrlSelectedList,
          code: this.childSelectedList
        });

        this.cancel();
      },

      // 展开或者是折叠一个母类
      toggleShowParent(parentCode) {
        if (this.parentShowCode === parentCode) {
          this.parentShowCode = "";
        } else {
          this.parentShowCode = parentCode;
        }
      },

      // 打开关闭设置
      toggleBox() {
        this.display = !this.display;
      },

      // 初始化设置
      initBox() {
        if (this.setList.length === 0) {
          return;
        }

        // 初始化母类状态
        this.parentShowCode = "";

        // 找出默认选中的母类
        let index = this.setList.findIndex((item) => {
          return item.isSelected = true;
        });

        this.parentSelectedCode = this.setList[index].itemCode;

        this.ctrlSelectedList =
          this.getCtrlSelectedList(this.setList[index].ctrlList);
        this.childSelectedList =
          this.getCtrlSelectedList(this.setList[index].childList);
      },

      // 获取控制内容的默认选中列表
      getCtrlSelectedList(target) {
        let res = [];

        if (target) {
          res = target.reduce((acc, item) => {
            if (item.isSelected) {
              acc.push(item.code);
            }

            return acc;
          }, []);
        }

        return res;
      },

      // 注册点击其他位置时的关闭事件
      outToggleBox(evt) {
        if (
          !isClickOutsideEl(
            evt,
            $(this.$el).find(".trend-set-box__cont")[0]
          )
        ) {
          this.display = false;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .trend-set-box {
    &__trigger {
      height: sz(16);
      cursor: pointer;
    }

    &__cont {
      @include border-radius(4px);
      @include box-shadow(0 2px 15px 1px map-get($colors, border-gray));

      overflow: hidden;
      position: absolute;
      right: sz(-40);
      top: sz(27);
      height: sz(308);
      border: 1px solid map-get($colors, dropdown-box-border);
      background: map-get($colors, pure-white);

      .customize-checkbox {
        &__check {
          position: relative;
          top: sz(-2);
          width: sz(12);
          height: sz(12);
        }

        &__label {
          @include word-hidden(sz(132), max-width);

          font-size: map-get($font-sizes, xs);
        }
      }

      &-title {
        margin: 0;
        height: sz(35);
        line-height: sz(35);
        padding: 0 sz(10);
        color: map-get($colors, essential-header);
        border-bottom: 1px solid map-get($colors, dropdown-box-border);
        background: map-get($colors, tab-bg);

        &-txt {
          float: left;
        }
      }

      &-items {
        @extend %normalized-list;

        height: sz(236);
        width: sz(198);
        max-height: sz(234);
        overflow-y: auto;

        &-item {
          &-parent {
            position: relative;
            margin: 0;
            height: sz(30);
            line-height: sz(30);
            padding-left: sz(10);

            &-triangle {
              @include transform(rotate(45deg));

              position: absolute;
              left: sz(165);
              top: sz(9);
              width: sz(6);
              height: sz(6);
              border-right: 1px solid map-get($colors, text-light);
              border-bottom: 1px solid map-get($colors, text-light);

              &--open {
                @include transform(rotate(-135deg));

                top: sz(13);
              }
            }

            .customize-checkbox {
              &__label {
                display: inline;
                line-height: sz(30);
                font-size: map-get($font-sizes, base);
              }

              &__radio {
                width: sz(12);
                height: sz(12);
                top: sz(-1);
              }

              &--active {
                .customize-checkbox__radio {
                  width: sz(6);
                  height: sz(6);
                  border-width: sz(4);
                }
              }
            }

            &:hover {
              background: map-get($colors, bg-home);
            }

            &-name {
              display: inline-block;
            }
          }

          &-lists {
            p {
              margin: 0;
              height: sz(25);
              line-height: sz(35);
              padding-left: sz(28);

              span {
                margin-left: sz(20);

                .customize-checkbox {
                  &__label {
                    @include word-hidden(sz(132), max-width);
                  }
                }

                &:first-child {
                  margin-left: 0;
                }
              }

              &:hover {
                background: map-get($colors, bg-home);
              }
            }

            &-childs {
              @extend %normalized-list;

              &-child {
                padding-left: sz(28);
                height: sz(25);
                line-height: sz(35);

                .customize-checkbox {
                  width: 100%;
                }

                &:hover {
                  background: map-get($colors, bg-home);
                }
              }
            }
          }
        }
      }

      &-bottom {
        height: sz(37);
        width: 100%;
        line-height: sz(37);
        border-top: 1px solid map-get($colors, dropdown-box-border);
        background: map-get($colors, tab-bg);
        text-align: center;

        &-save,
        &-cancel {
          font-size: map-get($font-sizes, xs);
          width: sz(43);
          height: sz(20);
          line-height: sz(20);
        }

        &-save {
          margin-left: sz(20);
        }
      }
    }
  }

  .trend-set-tooltips {
    z-index: 1;

    .tooltips {
      &__content {
        padding: sz(3) sz(5);
        border-color: map-get($app-colors, tips-border);
        background: map-get($app-colors, tips-background);

        &-item {
          border-bottom: none;
          padding: 0;
          margin: 0;
          color: map-get($app-colors, tips-color);
          font-size: map-get($font-sizes, xs);
        }
      }

      &__triangle {
        &::before {
          border-top: 1px solid map-get($app-colors, tips-border);
          border-left: 1px solid map-get($app-colors, tips-border);
          background: map-get($app-colors, tips-background);
        }
      }
    }
  }
</style>
