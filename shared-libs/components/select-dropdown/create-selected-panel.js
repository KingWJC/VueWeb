// v-model 有值时的展示状态
const createPlainDisplayNode = (vm) => {
  const h = vm.$createElement;

  // 对于普通选择值，可以通过 slot 自定义其结构，slot 接收当前选择的选项作为参数，
  // 注意，需要手动构建 dom 结构，并手动绑定关键类 `hide` 和关键属性 `title`
  return vm._t(
    "plainSelected",
    [
      h(
        "p",
        {
          staticClass: "select-dropdown-v2__selected-plain",
          class: {
            hide: !(!vm.displaySingleInputBox && vm.checkedOptions)
          },
          attrs: {
            title: vm.checkedOptions && vm.checkedOptions[vm.label]
          }
        },
        [
          // render text node
          // _v: createTextVNode, located in `core/vdom/vnode`
          // _s: toString, located in `shared/util`
          vm._v(vm._s(vm.checkedOptions && vm.checkedOptions[vm.label]))
        ]
      )
    ],
    // scope-slot 回传对象，如果需要解构，使用 { selected } 即可
    { selected: vm.checkedOptions }
  );
};

// 渲染输入框节点（根据单选/多选模式）
const createInputBox = (vm, mode) => {
  const h = vm.$createElement;

  let valField, staticClass, ref;

  // 单选模式
  if (mode === "single") {
    valField = "singleInput";
    ref = "singleInputBox";
    staticClass = "select-dropdown-v2__selected-input";
  } else {
    // else: 多选模式
    valField = "multipleInput";
    ref = "multipleInputBox";
    staticClass = "select-dropdown-v2__selected-tag-input";
  }

  return h("input", {
    directives: [
      {
        name: "model",
        rawName: "v-model.trim",
        value: vm[valField],
        expression: valField,
        modifiers: { trim: true }
      }
    ],
    ref,
    staticClass,
    attrs: {
      placeholder: vm.inputPlaceholder,
      autocomplete: "off",
      type: "text"
    },
    domProps: {
      value: vm[valField]
    },
    on: {
      input: ($evt) => {
        if ($evt.target.composing) {
          return;
        }

        vm[valField] = $evt.target.value.trim();
      },
      blur: () => {
        vm.$forceUpdate();
      }
    }
  });
};

// 渲染选择区面板
export default (vm) => {
  const h = vm.$createElement;

  // 当前展示内容下面的子节点
  let viewArea = [];

  // 单选
  // 单选不用区分 同步/异步
  if (!vm.isMultiple) {
    // 可筛选
    if (vm.isFilterable) {
      // 输入框打开状态
      viewArea.push(
        h(
          "div",
          {
            staticClass: "select-dropdown-v2__selected-input-wrapper",
            class: {
              hide: !vm.displaySingleInputBox
            }
          },
          [createInputBox(vm, "single")]
        )
      );

      // 输入框关闭状态
      // v-model 有值
      viewArea.push(createPlainDisplayNode(vm));

      // 输入框关闭状态
      // v-model 没有值, 尝试渲染placeholder，无论有没有（撑开布局）
      viewArea.push(
        h(
          "p",
          {
            staticClass: "select-dropdown-v2__selected-placeholder",
            class: {
              hide: !(!vm.displaySingleInputBox && !vm.checkedOptions)
            },
            attrs: {
              title: vm.placeholder
            }
          },
          [
            // render text node
            vm._v(vm._s(vm.placeholder))
          ]
        )
      );
    } else {
      // else: 不可筛选

      // v-model 有值
      viewArea.push(createPlainDisplayNode(vm));

      // v-model 没有值, 尝试渲染placeholder，无论有没有（撑开布局）
      viewArea.push(
        h(
          "p",
          {
            staticClass: "select-dropdown-v2__selected-placeholder",
            class: {
              hide: vm.checkedOptions
            },
            attrs: {
              title: vm.placeholder
            }
          },
          [vm._v(vm._s(vm.placeholder))]
        )
      );
    }

    // 删除已选按钮(不分同/异步)
    if (vm.isSingleRemovable) {
      viewArea.push(
        h("i", {
          staticClass: "select-dropdown-v2__selected-remove-single",
          class: {
            hide: !(!vm.displayDropdown && vm.checkedOptions)
          },
          attrs: {
            title: "取消选择"
          },
          on: {
            click: vm.deleteOption
          }
        })
      );
    }
  } else {
    // else: 多选
    // 多选不区分同步/异步

    let tagsSubArea = [];

    // 存在可用选项才渲染
    if (vm.checkedOptions && vm.checkedOptions.length > 0) {
      vm.checkedOptions.forEach((option, index) => {
        tagsSubArea.push(
          h(
            "li",
            {
              key: index,
              staticClass: "select-dropdown-v2__selected-tag",
              attrs: {
                title: option[vm.label]
              }
            },
            [
              vm._v(vm._s(option[vm.label])),
              h("i", {
                staticClass: "select-dropdown-v2__selected-tag-remove",
                on: {
                  click: () => {
                    vm.deleteOption(option);
                  }
                }
              })
            ]
          )
        );
      });
    }

    // 可筛选且输入框打开，就渲染输入框
    tagsSubArea.push(
      h(
        "li",
        {
          staticClass: `select-dropdown-v2__selected-tag
          select-dropdown-v2__selected-tag--action
          select-dropdown-v2__selected-tag--pending`,
          class: {
            hide: !(vm.isFilterable && vm.displayMultipleInputBox)
          },
          style: {
            width: vm.multipleInputWidth
          }
        },
        [createInputBox(vm, "multiple")]
      )
    );

    // 不可筛选 || 可筛选，但是输入框没打开，就渲染 placeholder
    tagsSubArea.push(
      h(
        "li",
        {
          staticClass: `select-dropdown-v2__selected-tag
          select-dropdown-v2__selected-tag--action`,
          class: {
            hide: !(
              !vm.isFilterable ||
              (vm.isFilterable && !vm.displayMultipleInputBox)
            )
          },
          style: {
            width: vm.multipleInputWidth
          },
          attrs: {
            title: vm.placeholder
          }
        },
        [vm._v(vm._s(vm.placeholder))]
      )
    );

    // 渲染 v-model 的值
    viewArea.push(
      h(
        "ul",
        {
          staticClass: "select-dropdown-v2__selected-tags clearfix"
        },
        tagsSubArea
      )
    );
  }

  return h(
    "div",
    {
      ref: "selectedArea",
      staticClass: "select-dropdown-v2__selected"
    },
    viewArea
  );
};
