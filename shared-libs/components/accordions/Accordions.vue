<script>
  export default {
    name: "accordions",

    props: {
      // 这个 tabs 的业务名字（用来重写样式）
      logicClassName: {
        type: String,
        default: ""
      },

      // 是否生成显示展开/收起图标列（第一列）
      // 默认展示（三角形），如果要自定义图标，可隐藏并自行处理布局（在td内部模拟）
      appendIconColumn: {
        type: Boolean,
        default: true
      },

      activeAccordionName: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        accordions: []
      };
    },

    methods: {
      // add a accordion(accordion is reported by itself and this component is
      // only used to maintain the layout)
      addAccordion(accordion) {
        const index = this.$slots.default.indexOf(accordion.$vnode);
        this.accordions.splice(index, 0, accordion);
      },

      // remove a accordion
      removeAccordion(accordion) {
        const index = this.accordions.indexOf(accordion);

        if (index > -1) {
          this.accordions.splice(index, 1);
        }
      },

      changeAccordion(accordionName) {
        this.$emit("changeAccordion", accordionName);
      }
    },

    render: function(h) {
      let thVnodes = [],
          itemVnodes = [],
          tableChild = [];

      // 当accordions中默认插槽中的内容为异步或者异步间接渲染
      // 可能导致初始的默认插槽为空, 此时this.$slots.default === undefined
      // 为了避免这种情况导致 下面的循环限制条件获取vnodes长度时发生异常错误
      // 修改为 vnodes = this.$slots.default || [];
      for (
        let i = 0, vnodes = this.$slots.default || [];
        i < vnodes.length;
        i++
      ) {
        if (vnodes[i].tag === "th") {
          thVnodes.push(vnodes[i]);
        }

        if (
          vnodes[i].componentOptions &&
          vnodes[i].componentOptions.tag === "accordion-item"
        ) {
          itemVnodes.push(vnodes[i]);
        }
      }

      if (thVnodes.length > 0) {
        if (this.appendIconColumn) {
          thVnodes.unshift(h("th", {
            class: "accordions__table-thead-triangle-th",
            domProps: {innerHTML: "&nbsp;"}
          }));
        }

        tableChild.push(h(
          "thead",
          {class: "accordions__table-thead"},
          thVnodes
        ));
      }

      if (itemVnodes.length > 0) {
        tableChild = tableChild.concat(itemVnodes);
      }

      return h("div", {class: ["accordions", this.logicClassName]}, [
        h("table", {class: "accordions__table"}, tableChild)
      ]);
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .accordions {
    &__table {
      width: 100%;
      border-spacing: 0;

      // 头部，直系子元素，避免嵌套组件产生样式冲突问题
      > thead {
        // 只可能存在一个 tr
        tr {
          cursor: default;
        }

        // accordion 头部只可能存在 th，不会再嵌套，所以不需要用 >
        th {
          padding: 0;
          border-bottom: 1px solid map-get($colors, dialog-cancel-border);
          color: map-get($colors, table-thead-color);
          vertical-align: middle;
          text-align: left;
          cursor: pointer;
          height: sz(40);

          // 包含指示小三角的列
          &#{get-bem-root()}__table-thead-triangle-th {
            width: sz(34);
          }
        }
      }

      // accordion item
      > tbody {
        // 每个 tbody 下面有两个 tr
        // 第一个 tr 是标题行
        // 第二个 tr 里面有一个 colspan 的 td，用于放置具体的内容
        > tr {
          color: map-get($colors, text-light);

          // 直系 tr 下面的直系 td
          > td {
            border-bottom: 1px solid map-get($colors, dialog-cancel-border);
            vertical-align: middle;
            text-align: left;
          }

          // accordion item 的标题行
          &:first-child {
            // 悬停高亮
            &:hover {
              background: map-get($colors, bg-home);
            }

            // 第一行里面只可能存在 td，所以不需要用直系子选择器 >
            td {
              height: sz(40);
              padding: 0;
              cursor: default;

              // 包含指示小三角的列
              &#{get-bem-root()}__table-tbody-triangle-td {
                text-align: center;
              }
            }
          }

          // accordion item 的内容行，只有一个直系跨列的 td
          &:last-child {
            // 直系跨列的 td，避免和嵌套组件里面的 td 样式冲突
            > td {
              cursor: default;
              padding: sz(10) 0 sz(10);
              overflow: initial;
            }

            // 默认不展示，激活的时候展示为 table-row 布局
            display: none;
          }
        }

        // accordion item 被激活
        &#{get-bem-root()}__table-tbody--active {
          > tr {
            // 标题行高亮
            &:first-child {
              background: map-get($colors, bg-home);

              td {
                border-bottom: 0;
              }
            }

            // 展示内容区
            &:last-child {
              display: table-row;
            }
          }

          // 指示小三角旋转方向
          #{get-bem-root()}__triangle {
            @include transform(rotate(135deg));

            margin-left: sz(5);
            top: sz(-4);
          }
        }
      }
    }

    // 指示小三角
    &__triangle {
      @include transform(rotate(45deg));

      display: inline-block;
      position: relative;
      top: sz(-2);
      height: sz(5);
      width: sz(5);
      border-right: 1px solid map-get($colors, text-light);
      border-top: 1px solid map-get($colors, text-light);
      cursor: pointer;
    }
  }
</style>
