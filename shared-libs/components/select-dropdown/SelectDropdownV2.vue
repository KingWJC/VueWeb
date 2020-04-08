<script>
  import $ from "jquery";
  import generateUUID from "__shared-libs/js/modules/generate-uuid";
  import createDropdownPanel from "./create-dropdown-panel";
  import createSelectedPanel from "./create-selected-panel";

  export default {
    name: "select-dropdown-v2",

    model: {
      prop: "checkedOptions",
      event: "syncCheckedOptions"
    },

    props: {
      // 上级缓存(v-model)数据
      // 对象，或者对象列表
      // 单选模式下是一个对象，多选模式下是一个列表
      // 如果是字面量（字符串，数字，布尔，null，undefined）请手动封装为对象
      // key-value
      // 形式再使用
      checkedOptions: {
        type: [Object, Array],
        default: null
      },

      // 同步模式备选列表(对象列表)
      // 异步模式下（isAsync === true）不需要传入，每次都会进行异步请求
      options: {
        type: Array,
        default() {
          return [];
        }
      },

      // dropdown 使用的逻辑类
      // 因为使用了 teleporter 进行了 BEM 的提升（全局命名空间），如果遇到 case by
      // case
      // 的需求要进行重置样式的话，使用此逻辑类进行样式的重置操作（参考 重置
      // notice-dialog
      // 宽度样式的部分）
      optionsLogicClassName: {
        type: String,
        default: null
      },

      // 没有v-model时占位文本
      placeholder: {
        type: String,
        default: "请选择"
      },

      // 输入框占位文本
      inputPlaceholder: {
        type: String,
        default: "请输入关键字"
      },

      // 条目文案字段
      label: {
        type: String,
        default: ""
      },

      // 唯一标识字段
      trackBy: {
        type: String,
        default: ""
      },

      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },

      // 是否使用teleporter进行dom提升（有的地方如果提升会造成头身分离）
      useTeleporter: {
        type: Boolean,
        default: false
      },

      // 单选已选项是否可被移除
      // 如果为true，会出现 x 号，单击即移除
      // 如果为false，选中项不可被移除（没有入口）
      isSingleRemovable: {
        type: Boolean,
        default: false
      },

      // 是否多选(tags 模式)
      isMultiple: {
        type: Boolean,
        default: false
      },

      // 是否可筛选
      isFilterable: {
        type: Boolean,
        default: false
      },

      // 是否异步
      isAsync: {
        type: Boolean,
        default: false
      },

      // 异步请求触发超时（不是在每次input都触发，而是超时触发，避免太频繁发请求）
      // >=0 正整数，默认 100 毫秒
      // 如果希望输入框任何变动都告知父组件，传入 null 即可
      asyncTimeout: {
        type: Number,
        default: 100
      },

      // 如果 isAsync 为true，必须传入对应 asyncFetchMethod，返回值为 Promise 对象
      asyncFetchMethod: {
        type: Function,
        default: null
      },

      // 下拉列表的最大高度
      dropDownMaxHeight: {
        type: Number,
        default: 200
      },

      // 下拉列表的最小宽度（如果是可视区没是响应式的，就需要给下拉列表一个
      // 最小宽度，否则可视区宽度很小的时候下拉列表宽度也会相应很小）
      // 如果不需要限定，就传 null
      dropDownMinWidth: {
        type: Number,
        default: null
      },

      // 下拉列表距离选择器的视觉间距
      dropDownTopMargin: {
        type: Number,
        default: 4
      },

      // dropDown的层级,50起
      // 和 `useTeleporter` props 配搭使用才有意义，否则如果不迁移 options 列表
      // 的 DOM 的话，其层级将保持和 select-dropdown-v2 自身一致，无需特意设置
      dropDownZIndex: {
        type: Number,
        default: 50
      }
    },

    data() {
      return {
        // 用于事件绑定时生成唯一命名空间
        eventNS: generateUUID(),

        // 是否展示下拉框
        displayDropdown: false,
        // 下拉框展示方向（动态，如果位置不够，就向上展示）
        // up：向上展示
        // down：向下展示
        dropdownDirection: "down",
        // 下拉框左偏移
        dropdownLeft: 0,
        // 下拉框上偏移
        dropdownTop: 0,
        dropdownWidth: 0,

        // 是否展示单选输入框（筛选用到）
        displaySingleInputBox: false,
        // 是否展示多选输入框（筛选用到）
        displayMultipleInputBox: false,

        // 单选输入框的值
        singleInput: "",
        // 多选输入框的值
        multipleInput: "",
        // 筛选字符串（单选多选均可公用，因为一次只会出现一个筛选器）
        // 不一定等于输入框的值
        // （比如单选同步筛选的时候，下拉框打开的时候仍然要显示全部列表）
        filteringStr: "",

        // 异步加载时的请求结果列表缓存
        asyncDropdownItems: null,
        // 如果 isAsync 为true，则判断是否正在异步请求数据，渲染“正在加载”
        isAsyncLoading: false,
        // 异步请求节流器
        asyncLoadingDebouncer: null,

        // 全局事件是否已经绑定（document.click, window.resize)
        globalEventsBound: false,

        // 视口resize节流器
        winResizeDebouncer: null
      };
    },

    computed: {
      // 多选输入框动态长度
      multipleInputWidth() {
        let len;

        // 如果没有输入内容，使用placeholder长度
        if (this.multipleInput.length === 0) {
          // 有 placeholder
          if (this.placeholder) {
            len = this.placeholder.length;
          } else if (this.inputPlaceholder) {
            // else if: 有 inputPlaceholder
            len = this.inputPlaceholder.length;
          }
        } else {
          // else: 使用输入值的长度
          len = this.multipleInput.length;
        }

        // 限制多长
        return `${len}em`;
      },

      // 同步模式中需要渲染到下拉框中的数据(包括模糊匹配的结果)
      // 异步模式的选项是需要实时动态获取的，用的是 asyncDropdownItems
      dropdownItems() {
        // 单选
        if (!this.isMultiple) {
          // 同步
          if (!this.isAsync) {
            // 可筛选
            if (this.isFilterable) {
              // 如果筛选空串，返回全部列表
              if (this.filteringStr === "") {
                return this.copyOptions();
              }

              return this.options.filter((item) => {
                return item[this.label].indexOf(this.filteringStr) > -1;
              });
            } else {
              // else: 不可筛选
              return this.copyOptions();
            }
          }
        } else {
          // else: 多选
          // 同步
          if (!this.isAsync) {
            // 可筛选
            if (this.isFilterable) {
              // 如果筛选空串，返回全部列表
              if (this.filteringStr === "") {
                return this.copyOptions();
              }

              return this.options.filter((item) => {
                return item[this.label].indexOf(this.filteringStr) > -1;
              });
            } else {
              // else: 不可筛选
              return this.copyOptions();
            }
          }
        }
      }
    },

    watch: {
      // 单选输入框值
      singleInput: "handleSingleInputChange",

      // 多选输入框值
      multipleInput: "handleMultipleInputChange"
    },

    // 绑定全局事件
    mounted() {
      this.bindGlobalEventsHandle();
    },

    // 解绑全局事件
    beforeDestroy() {
      this.unbindGlobalEventsHandle();
    },

    methods: {
      // 多选输入框值变化处理句柄
      handleMultipleInputChange(inputStr) {
        // 更新筛选参照字符串
        this.filteringStr = inputStr;

        // 同步
        if (!this.isAsync) {
          // 可筛选
          if (this.isFilterable) {
            if (inputStr !== "") {
              this.showDropdown();
            } else {
              this.hideDropdown();
            }
          }
        } else {
          // else: 异步
          // 可筛选
          if (this.isFilterable) {
            // 且输入值不为空，触发筛选操作
            if (inputStr !== "") {
              this.updateAsyncFilteringDebouncer(inputStr);
              this.showDropdown();
            } else {
              // else: 输入框为空，直接隐藏列表即可，无需请求
              this.hideDropdown();
            }
          }
        }
      },

      // 单选输入框值变化处理句柄
      handleSingleInputChange(inputStr) {
        // 更新筛选参照字符串
        this.filteringStr = inputStr;

        // 异步
        if (this.isAsync) {
          // 可筛选
          if (this.isFilterable) {
            // 且输入值不为空，触发筛选操作
            if (inputStr !== "") {
              this.updateAsyncFilteringDebouncer(inputStr);
              this.showDropdown();
            } else {
              // else:输入框为空，直接隐藏列表即可，无需请求
              this.hideDropdown();
            }
          }
        }
      },

      // 更新异步筛选节流器
      updateAsyncFilteringDebouncer(inputStr) {
        // 正在loading
        this.isAsyncLoading = true;
        // 异步结果清空
        this.asyncDropdownItems = null;

        // 如果使用节流模式
        if (this.asyncTimeout !== null) {
          // 清空节流器(如果已设置)
          if (this.asyncLoadingDebouncer) {
            clearTimeout(this.asyncLoadingDebouncer);
          }

          // 重置节流器
          this.asyncLoadingDebouncer = setTimeout(() => {
            // 调用 promise
            this.asyncFetchMethod(inputStr)
              .then((res) => {
                this.visuallyHideDropdown();
                this.asyncDropdownItems = res;
                this.isAsyncLoading = false;

                // 异步数据请求成功之后，也要重置下拉框位置
                // （避免页面滚动条导致下拉框错位）
                this.resetDropdownPosition();
              }, () => {
                this.asyncDropdownItems = null;
                this.isAsyncLoading = false;
            });
          }, this.asyncTimeout);
        } else {
          // else: 实时通知父组件（每一次按键都触发，但父组件仍需按 Promise 返回）
          // 调用 promise
          this.asyncFetchMethod(inputStr)
            .then((res) => {
              this.visuallyHideDropdown();
              this.asyncDropdownItems = res;
              this.isAsyncLoading = false;

              // 异步数据请求成功之后，也要重置下拉框位置
              // （避免页面滚动条导致下拉框错位）
              this.resetDropdownPosition();
            }, () => {
              this.asyncDropdownItems = null;
              this.isAsyncLoading = false;
          });
        }
      },

      // 展示单选输入框
      showSingleInputBox() {
        this.displaySingleInputBox = true;

        // 回填输入框的值
        this.resetSingleInput();
      },

      // 隐藏单选输入框
      hideSingleInputBox() {
        this.displaySingleInputBox = false;
      },

      // 展示多选输入框
      showMultipleInputBox() {
        this.displayMultipleInputBox = true;

        // 立即清空输入框的值
        this.resetMultipleInput();
      },

      // 隐藏多选输入框
      hideMultipleInputBox() {
        this.displayMultipleInputBox = false;
      },

      // 从视觉上隐藏dropdown，避免向下弹出的时候超长，导致浏览器出现滚动条
      // 在dropdown display 为true之后，我们拿到 dropdown 的真实高度，然后加以
      // 判断，是否下边距超出了浏览器文档带滚动条的高度，超过了就向上弹出下拉框
      visuallyHideDropdown() {
        this.dropdownLeft = 0;
        this.dropdownTop = -1000;
        this.dropdownWidth = 1;
      },

      // 展示下拉列表
      showDropdown() {
        this.visuallyHideDropdown();
        this.displayDropdown = true;

        // 重置列表位置
        this.resetDropdownPosition();
      },

      // 隐藏下拉列表
      hideDropdown() {
        this.displayDropdown = false;
      },

      // 重计算和设置 dropdown 位置
      resetDropdownPosition() {
        let $el = $(this.$el);
        let offset = $el.offset();
        let top = offset.top;
        let left = offset.left;
        let width = $el.outerWidth();
        let height = $el.outerHeight();

        // 如果是下拉列表就地渲染模式，相对select进行定位
        if (!this.useTeleporter) {
          left = 0;
          top = 0;
        }

        // 默认向下弹出，计算下靠的位置
        this.dropdownWidth = width - 2;
        this.dropdownLeft = left;

        // 强制更新组件（否则所有样式可能不能同步被应用）
        this.$forceUpdate();

        // 在 nextTick 里面获取渲染之后的dropdown的实际高度，用于判断弹出方向
        // 否则dom没被渲染已先是获取不到正确高度的（可能为2px，就是css里面定义的边框）
        this.$nextTick(() => {
          let direction = "down";
          let calcTop = top + height + this.dropDownTopMargin;
          let dropdownHeight = $(this.$refs.dropdown).outerHeight();

          // 如果是下拉列表就地渲染模式，始终向下展示，因为我们不能确知直系父元素是否
          // 有合理的scrollHeight（可能被外包了一个容器，高度刚好是select的高）
          if (this.useTeleporter) {
            // 如果全部加起来超过了 document scrollHeight，就向上弹出
            if (
              calcTop + dropdownHeight > document.documentElement.scrollHeight
            ) {
              direction = "up";
              calcTop = top - this.dropDownTopMargin - dropdownHeight;
            }
          }

          this.dropdownTop = calcTop;
          this.dropdownDirection = direction;
        });
      },

      // 多选模式，选择/取消选择之后 重置滚动条位置（使得滚动条始终拉到底部）
      resetScrollbarPosition() {
        this.$nextTick(() => {
          let conEl = $(this.$refs.selectedArea);

          // 滚动到最底部(scrollHeight 不是一个方法，是一个 HTML property)
          conEl.scrollTop(conEl.prop("scrollHeight"));
        });
      },

      // 视口大小变更
      winResizeHandler() {
        // 清空节流器(如果已设置)
        if (this.winResizeDebouncer) {
          clearTimeout(this.winResizeDebouncer);
        }

        // 重置节流器
        this.winResizeDebouncer = setTimeout(() => {
          // 如果下拉框打开，才重置位置
          if (this.displayDropdown) {
            this.resetDropdownPosition();
          }
        }, 20);
      },

      // 如果点击非calendar区域，触发关闭事件
      docClickHandler(evt) {
        if ($(evt.target).parents(".select-dropdown-v2")[0] !== this.$el) {
          // 恢复到纯粹展示模式（无单选输入框，无下拉框）
          this.hideDropdown();

          // 单选
          if (!this.isMultiple) {
            // 筛选模式，直接隐藏输入框
            if (this.isFilterable) {
              this.hideSingleInputBox();
            }
          } else {
            // else： 多选
            // 筛选模式，删除多选输入框的值并隐藏
            if (this.isFilterable) {
              this.multipleInput = "";
              this.hideMultipleInputBox();
            }
          }
        }
      },

      // 复制一份可用选项（用于触发响应式更新）
      copyOptions() {
        return this.options.slice(0);
      },

      // 进行同步操作
      notifyChange(option) {
        this.$emit("syncCheckedOptions", option);
        // 不暴露 v-model 同步事件，使用一个新事件通知外部选项发生了变化
        this.$emit("optionChanged", option);
      },

      // 单选模式下对比 v-model，是否是同一个对象
      isSameOption(option) {
        return this.checkedOptions && option &&
          this.checkedOptions[this.label] === option[this.label] &&
          this.checkedOptions[this.trackBy] === option[this.trackBy];
      },

      // 多选模式下对比 v-model，是否存在该对象
      hasSelectedOption(option) {
        return this.checkedOptions &&
          this.checkedOptions.length > 0 &&
          this.checkedOptions.findIndex((item) => {
            return item[this.label] === option[this.label] &&
              item[this.trackBy] === option[this.trackBy];
        }) > -1;
      },

      // 删除选项
      deleteOption(option) {
        // 如果禁用，不可删除
        if (this.disabled) {
          return false;
        }

        // 单选
        if (!this.isMultiple) {
          // 发送 null，实现删除的效果
          this.selectOption(null);
        } else {
          // else: 多选
          let tmpList = this.checkedOptions.slice(0);
          let optionIdx = tmpList.findIndex((item) => {
            return item[this.label] === option[this.label] &&
              item[this.trackBy] === option[this.trackBy];
          });
          tmpList.splice(optionIdx, 1);

          this.notifyChange(tmpList);
          // 重置下拉框位置
          this.resetDropdownPosition();
          // 重置滚动条位置
          this.resetScrollbarPosition();
        }
      },

      // 从选项列表里面选择一项
      selectOption(option) {
        // 单选
        if (!this.isMultiple) {
          // 如果点的不是当前v-model对象，才发事件
          if (!this.isSameOption(option)) {
            this.notifyChange(option);
          }

          // 单选之后需要立即关闭下拉框 和 输入框
          this.hideSingleInputBox();
          this.hideDropdown();
        } else {
          // else: 多选
          // 如果选择的不存在于 v-model 列表里面，就执行添加操作
          if (!this.hasSelectedOption(option)) {
            let tmpList = [];

            // 存在非null的 v-model（一个数组，因为是多选模式），使用
            if (this.checkedOptions) {
              tmpList = this.checkedOptions.slice(0);
            }

            tmpList.push(option);

            this.notifyChange(tmpList);
            // 重置下拉框位置
            this.resetDropdownPosition();
          } else {
            // else: 否则执行删除操作
            this.deleteOption(option);
          }

          // 可筛选
          if (this.isFilterable) {
            // 每次都清空输入框，准备下一次筛选
            this.resetMultipleInput();
          }

          // 重置滚动条位置
          this.resetScrollbarPosition();
        }
      },

      // 重置单选输入框的值并聚焦
      resetSingleInput() {
        // 存在 v-model，使用其值回填，便于在此基础之上继续筛选
        if (this.checkedOptions) {
          this.singleInput = this.checkedOptions[this.label];
        } else {
          // else: 否则清空输入框的值
          this.singleInput = "";
        }

        // 强制渲染输入框 dom，否则 nextTick 后找不到节点
        this.$forceUpdate();

        // 清空筛选字符串并聚焦光标
        this.$nextTick(() => {
          this.filteringStr = "";
          this.$refs.singleInputBox.focus();
        });
      },

      // 重置多选输入框的值并聚焦
      resetMultipleInput() {
        // 清空输入框的值
        this.multipleInput = "";
        // 强制渲染输入框 dom，否则 nextTick 后找不到节点
        this.$forceUpdate();

        // 清空筛选字符串并聚焦光标
        this.$nextTick(() => {
          this.filteringStr = "";
          this.$refs.multipleInputBox.focus();
        });
      },

      // 点击可视区
      clickHandle($evt) {
        // 如果禁用，无操作
        if (this.disabled) {
          return;
        }

        // 单选
        if (!this.isMultiple) {
          // 同步
          if (!this.isAsync) {
            // 可筛选
            if (this.isFilterable) {
              // 是否展示输入框（展示的同时也要同步展示下拉框）
              if (!this.displaySingleInputBox) {
                this.showSingleInputBox();
                this.showDropdown();
              } else {
                this.hideSingleInputBox();
                this.hideDropdown();
              }
            } else {
              // else: 不可筛选
              // 是否展示下拉框
              if (!this.displayDropdown) {
                this.showDropdown();
              } else {
                this.hideDropdown();
              }
            }
          } else {
            // else: 异步
            // 可筛选
            if (this.isFilterable) {
              // 是否展示输入框
              if (!this.displaySingleInputBox) {
                this.showSingleInputBox();

                // 异步模式下，单选输入框有值才显示下拉框
                if (this.singleInput !== "") {
                  this.showDropdown();
                } else {
                  this.hideDropdown();
                }
              } else {
                this.hideSingleInputBox();
                this.hideDropdown();
              }
            } else {
              // else: 不可筛选
              // 是否展示下拉框
              if (!this.displayDropdown) {
                this.updateAsyncFilteringDebouncer(null);
                this.showDropdown();
              } else {
                this.hideDropdown();
              }
            }
          }
        } else {
          // else: 多选
          // 如果点击 tag 或者 tag 上的 x 号，不做操作（x号的click事件会接管继续处理）
          // 此处如果不做处理，点击x号也会触发下拉框切换 展示/隐藏 状态
          let removeTemp = "select-dropdown-v2__selected-tag-remove";

          if (
            $($evt.target).hasClass(removeTemp) ||
            $($evt.target).hasClass("select-dropdown-v2__selected-tag") &&
            !$($evt.target).hasClass("select-dropdown-v2__selected-tag--action")
          ) {
            return;
          }

          // 同步
          if (!this.isAsync) {
            // 可筛选
            if (this.isFilterable) {
              // 如果输入框是展示模式
              if (this.displayMultipleInputBox) {
                // 如果下拉框没打开，打开
                if (!this.displayDropdown) {
                  this.showDropdown();
                } else {
                  // else: 否则，说明输入框和下拉框都打开了，再次点击就都要关闭
                  // 而且要清空输入框的值(否则动态计算的宽度就错误了)
                  this.multipleInput = "";

                  this.hideMultipleInputBox();
                  this.hideDropdown();
                }
              } else {
                // else 输入框没打开，就都打开
                this.showMultipleInputBox();
                this.showDropdown();
              }
            } else {
              // else: 不可筛选
              // 是否展示下拉框
              if (!this.displayDropdown) {
                this.showDropdown();
              } else {
                this.hideDropdown();
              }
            }
          } else {
            // else: 异步
            // 可筛选
            if (this.isFilterable) {
              // 是否展示多选输入框（展示的同时也要同步展示下拉框）
              if (!this.displayMultipleInputBox) {
                this.showMultipleInputBox();
              } else {
                // 而且要清空输入框的值(否则动态计算的宽度就错误了)
                this.multipleInput = "";

                this.hideMultipleInputBox();
              }
            } else {
              // eles: 不可筛选
              // 是否展示下拉框
              if (!this.displayDropdown) {
                this.updateAsyncFilteringDebouncer(null);
                this.showDropdown();
              } else {
                this.hideDropdown();
              }
            }
          }
        }
      },

      // 绑定文档点击事件
      bindGlobalEventsHandle() {
        // 已经绑定全局事件，不再绑定
        if (!this.globalEventsBound) {
          // 文档单击
          $(document).on(
            `click.selectdropdown${this.eventNS}`,
            this.docClickHandler
          );

          // 视口尺寸变更，调整dropdown位置
          $(window).on(
            `resize.selectdropdown${this.eventNS}`,
            this.winResizeHandler
          );

          // 标记为已绑定
          this.globalEventsBound = true;
        }
      },

      // 解除绑定文档点击事件
      unbindGlobalEventsHandle() {
        if (this.globalEventsBound) {
          $(document).off(
            `click.selectdropdown${this.eventNS}`,
            this.docClickHandler
          );

          $(window).off(
            `resize.selectdropdown${this.eventNS}`,
            this.winResizeHandler
          );

          this.globalEventsBound = false;
        }
      }
    },

    render(h) {
      // 组件 root
      return h(
        "div",
        {
          staticClass: "select-dropdown-v2",
          class: {
            "select-dropdown-v2--open": this.displayDropdown,
            "select-dropdown-v2--disabled": this.disabled,
            "select-dropdown-v2--single": !this.isMultiple,
            "select-dropdown-v2--multiple": this.isMultiple,
            "select-dropdown-v2--sync": !this.isAsync,
            "select-dropdown-v2--async": this.isAsync,
            "select-dropdown-v2--filterable": this.isFilterable,
            "select-dropdown-v2--unfilterable": !this.isFilterable,
            "select-dropdown-v2--upward": this.dropdownDirection === "up",
            "select-dropdown-v2--downward": this.dropdownDirection === "down"
          },
          on: {
            // capture: !
            "!click": ($evt) => {
              this.clickHandle($evt);
            }
          }
        },
        [
          // 当前展示内容
          createSelectedPanel(this),

          // 用于展示选择状态的标识，默认为三角形（三角形始终展示到选择区的右下角）
          this._t(
            "indicator",
            [
              h("i", {
                staticClass: "select-dropdown-v2__triangle"
              })
            ],
            {
              // 当前是否是打开状态，如果需要更多状态，按照上面给出的修饰器进行添加即可，
              // 尽量保持修饰器名称一致
              open: this.displayDropdown
            }
          ),

          // 下拉框区域
          // TODO: 隔级传递 slot
          createDropdownPanel(this)
        ]
      );
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  // 默认阴影值（可视区和下拉框统一）
  $_select-dropdown-v2-radius: 5px;
  $_select-dropdown-v2-height: 28;

  // 展示区
  .select-dropdown-v2 {
    // 组件内部重置样式（避免外部样式影响）
    width: sz(240);
    // 如果不使用 teleporter，则据此进行定位
    position: relative;

    // 选择区
    &__selected {
      // 屏蔽鼠标选择文本高亮效果
      @include user-select(none);
      @include border-radius($_select-dropdown-v2-radius);

      position: relative;
      border: 1px solid map-get($colors, dropdown-box-border);
      // 默认白色背景
      background: map-get($colors, pure-white);

      // 多选模式下 tags 容器最大高度
      @at-root #{get-bem-root()}--multiple & {
        max-height: sz(300);
        overflow-x: hidden;
        overflow-y: auto;
      }

      // 向下打开状态取消下边圆角
      @at-root #{get-bem-root()}--open#{get-bem-root()}--downward & {
        @include border-radius(
          $_select-dropdown-v2-radius $_select-dropdown-v2-radius 0 0
        );
      }

      // 向上打开状态取消上边圆角
      @at-root #{get-bem-root()}--open#{get-bem-root()}--upward & {
        @include border-radius(
          0 0 $_select-dropdown-v2-radius $_select-dropdown-v2-radius
        );
      }

      // 禁止状态背景变灰
      @at-root #{get-bem-root()}--disabled & {
        background: map-get($colors, dialog-input-disabled-bg);
      }

      // 去掉 p 的 margin
      &-plain,
      &-placeholder {
        margin: 0;
      }

      &-plain,
      &-placeholder {
        @include word-hidden(auto);

        height: sz($_select-dropdown-v2-height);
        line-height: sz($_select-dropdown-v2-height);
        padding: 0 sz($_select-dropdown-v2-height - 2) 0 sz(10);
      }

      // 单选
      &-plain {
        color: map-get($colors, dialog-text-color);
        font-size: map-get($font-sizes, base);
      }

      // placeholder文案
      &-placeholder {
        color: map-get($colors, placeholder-text-color);
      }

      // 多选tag列表
      &-tags {
        @include border-radius(5px);
        @extend %normalized-list;

        padding: 0 sz($_select-dropdown-v2-height - 2) 0 sz(10);
      }

      // 标签
      &-tag {
        @include border-radius(5px);

        float: left;
        background: rgba(map-get($colors, border-gray), 0.4);
        color: map-get($colors, dialog-text-color);
        position: relative;
        padding: sz(4) sz($_select-dropdown-v2-height - 2) sz(4) sz(10);
        margin: sz(4) sz(4) 0 0;
        text-align: left;

        // 删除x号
        &-remove {
          position: absolute;
          top: 50%;
          right: 0;
          width: sz(20);
          height: sz(20);
          line-height: sz(20);
          margin-top: sz(-10);
          cursor: pointer;
          text-align: center;
          font-size: sz(20);
          font-style: normal;
          color: map-get($colors, border-gray);

          &:hover {
            color: map-get($colors, text-main);
          }

          // 人工 + 号
          &::after {
            @include transform(rotate(45deg));

            display: block;
            content: "+";
            font-family: monospace, san-serif;
          }

          // disabled 状态
          @at-root #{get-bem-root()}--disabled & {
            cursor: not-allowed;

            &:hover {
              color: map-get($colors, border-gray);
            }
          }
        }

        // 多选输入框
        &-input {
          @include placeholder-color(map-get($colors, placeholder-text-color));

          border: 0;
          // 需要和 “请选择” 保持一样高
          height: sz(26);
          padding: 0;
          width: 100%;
        }

        // tag 输入框模式（最后的模拟tag）
        &--action {
          // 添加下编辑，使得上下对等
          padding-left: 0;
          padding-right: 0;
          margin-right: 0;
          margin-bottom: sz(4);
          // 最大宽，溢出之后input内容不可见
          max-width: 100%;
          // 去掉背景色
          background: transparent;

          // 新建tag（输入模式）需要重置margin
          &#{get-bem-root()}__selected-tag--pending {
            padding: 0;
          }
        }
      }

      // 输入框容器（用于撑开输入框宽度，输入框不能自适应宽度）
      &-input-wrapper {
        padding: 0 sz($_select-dropdown-v2-height - 2) 0 sz(10);
        color: map-get($colors, dialog-text-color);
      }

      // 单选输入框
      &-input {
        @include placeholder-color(map-get($colors, placeholder-text-color));

        display: block;
        width: 100%;
        height: sz($_select-dropdown-v2-height);
        line-height: sz($_select-dropdown-v2-height);
        border: 0;
        // 默认有1px 的padding？
        padding: 0;
      }

      // 删除单选选项 x 号
      &-remove-single {
        position: absolute;
        top: 50%;
        right: sz(25);
        width: sz(20);
        height: sz(20);
        line-height: sz(20);
        margin-top: sz(-10);
        cursor: pointer;
        text-align: center;
        font-size: sz(20);
        font-style: normal;
        color: map-get($colors, border-gray);

        &:hover {
          color: map-get($colors, text-main);
        }

        // 人工 + 号
        &::after {
          @include transform(rotate(45deg));

          display: block;
          content: "+";
          font-family: monospace, san-serif;
        }

        // disabled 状态
        @at-root #{get-bem-root()}--disabled & {
          cursor: not-allowed;

          &:hover {
            color: map-get($colors, border-gray);
          }
        }
      }
    }

    // 三角形区
    &__triangle {
      @include transform(rotate(135deg));

      display: inline-block;
      height: sz(5);
      width: sz(5);
      border-right: 1px solid map-get($colors, text-light);
      border-top: 1px solid map-get($colors, text-light);
      position: absolute;
      // 主流浏览器平台滚动条宽占 17px
      right: sz(10);
      top: 50%;
      // 上移一半高
      margin-top: sz(-4);

      // 打开状态，旋转
      @at-root #{get-bem-root()}--open & {
        @include transform(rotate(-45deg));

        margin-top: sz(0);
      }

      // 多选状态下，三角形定位到右下方
      @at-root #{get-bem-root()}--multiple & {
        top: initial;
        right: sz(10);
        bottom: sz(18);
      }
    }

    // 屏蔽交互（disabled）
    &--disabled {
      cursor: not-allowed;
      color: map-get($colors, text-disabled-color);
    }
  }

  // 下拉列表
  .select-dropdown-v2-options {
    // 向下打开状态取消上边圆角
    &--downward {
      @include border-radius(
        0 0 $_select-dropdown-v2-radius $_select-dropdown-v2-radius
      );
    }

    // 向上打开状态取消下边圆角
    &--upward {
      @include border-radius(
        $_select-dropdown-v2-radius $_select-dropdown-v2-radius 0 0
      );
    }

    position: absolute;
    border: 1px solid map-get($colors, dropdown-box-border);
    line-height: 1;
    overflow-y: auto;
    background: map-get($colors, pure-white);

    &__items {
      @extend %normalized-list;

      padding-bottom: sz(4);

      &-item {
        cursor: pointer;
        text-align: left;
        height: sz(30);
        line-height: sz(30);
        padding: 0 sz(10);

        // 渲染文案
        &-text {
          @include word-hidden(100%);

          margin: 0;
          color: map-get($colors, dialog-text-color);
        }

        &:hover {
          background: map-get($colors, bg-home);
        }

        // 已选择的（单选模式）
        &--selected {
          #{get-bem-root()}__items-item-text {
            color: map-get($colors, theme-blue);
          }
        }
      }
    }

    // 搜索列表没有内容的展示文案
    // 加载提示
    &__no-result,
    &__loading {
      margin: 0;
      height: sz(30);
      line-height: sz(30);
      text-align: center;
    }
  }
</style>
