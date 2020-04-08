// 渲染 没有搜到结果
const createNoResultSlot = (vm) => {
  // h 就是 this.$createElement 的别名，连引用都是一样的，而 _c 是对
  // this.$createElement 的一层包装，所以 vue 编译出来的 render 函数才能用 _c
  const h = vm.$createElement;

  return vm._t("noResult", [
    h(
      "p",
      {
        staticClass: "select-dropdown-v2-options__no-result"
      },
      [vm._v("没有搜到结果")]
    )
  ]);
};

// 渲染 下拉选项列表
const createDropdownItems = (vm, itemList) => {
  const h = vm.$createElement;

  return h(
    "ul",
    {
      staticClass: "select-dropdown-v2-options__items"
    },
    itemList.map((option, index) => {
      return h(
        "li",
        {
          key: index,
          staticClass: "select-dropdown-v2-options__items-item",
          class: {
            "select-dropdown-v2-options__items-item--selected":
              (!vm.isMultiple && vm.isSameOption(option)) ||
              (vm.isMultiple && vm.hasSelectedOption(option))
          },
          attrs: {
            title: option[vm.label]
          },
          on: {
            click: () => {
              vm.selectOption(option);
            }
          }
        },
        [
          // 单个下拉选项（slot）
          vm._t(
            "drop",
            [
              h(
                "p",
                {
                  staticClass: "select-dropdown-v2-options__items-item-text"
                },
                [vm._v(vm._s(option[vm.label]))]
              )
            ],
            { options: option }
          )
        ]
      );
    })
  );
};

// 渲染下拉框选择区（判断是否要渲染至 body 下）
export default (vm) => {
  const h = vm.$createElement;

  // 下拉框节点的子节点
  let dropdownChildren = [];

  // 同步
  if (!vm.isAsync) {
    // 有可用同步选项
    if (vm.dropdownItems.length > 0) {
      dropdownChildren.push(createDropdownItems(vm, vm.dropdownItems));
    } else {
      // else: 无可用同步选项
      dropdownChildren.push(createNoResultSlot(vm));
    }
  } else {
    // else: 异步

    // 异步正在加载
    if (vm.isAsyncLoading) {
      dropdownChildren.push(
        vm._t("asyncLoading", [
          h(
            "p",
            {
              staticClass: "select-dropdown-v2-options__loading"
            },
            [vm._v("加载中...")]
          )
        ])
      );
    } else {
      // else: 异步加载完成

      // 有可用异步选项
      if (vm.asyncDropdownItems) {
        dropdownChildren.push(createDropdownItems(vm, vm.asyncDropdownItems));
      } else {
        // else: 无可用异步选项
        dropdownChildren.push(createNoResultSlot(vm));
      }
    }
  }

  let dropdownNodeStyles = {
    left: `${vm.dropdownLeft}px`,
    top: `${vm.dropdownTop}px`,
    zIndex: vm.dropDownZIndex,
    width: `${vm.dropdownWidth}px`,
    maxHeight: `${vm.dropDownMaxHeight}px`
  };

  // 限定了下拉列表最小宽度，且选择区宽度小于下拉列表最小宽度，则使用最小宽度
  if (vm.dropDownMinWidth !== null && vm.dropdownWidth < vm.dropDownMinWidth) {
    dropdownNodeStyles.width = `${vm.dropDownMinWidth}px`;
  }

  // 下拉框节点（可挂载为子节点，也可挂载到 body 下）
  let dropdownNode = h(
    "div",
    {
      ref: "dropdown",
      staticClass: "select-dropdown-v2-options",
      class: [
        {
          hide: !vm.displayDropdown,
          "select-dropdown-v2-options--upward": vm.dropdownDirection === "up",
          "select-dropdown-v2-options--downward":
            vm.dropdownDirection === "down"
        },
        vm.optionsLogicClassName
      ],
      style: dropdownNodeStyles
    },
    dropdownChildren
  );

  // 如果需要使用 teleporter 迁移至 body 下
  let dropdownArea = [];

  if (vm.useTeleporter) {
    dropdownArea.push(h("teleporter", [dropdownNode]));
  } else {
    dropdownArea.push(dropdownNode);
  }

  return dropdownArea;
};
