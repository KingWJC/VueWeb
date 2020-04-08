<script>
  export default {
    props: {
      // tabs list
      tabs: {
        type: Array,
        default() {
          return [];
        }
      },

      // current active tab
      activeTabName: {
        type: String,
        default: null
      }
    },

    render(h) {
      let labelVnodes = this.tabs.map((tab) => {
        // either use content from slot, or use value passed in from props as
        // the table label
        let tabLabel = tab.$slots.tabLabel || tab.tabLabel;

        return h("li", {
          class: [
            "basic-tabs__header-item",
            {
              "basic-tabs__header-item--active":
                tab.tabName === this.activeTabName
            }
          ],
          on: {
            click: ($evt) => {
              if (tab.tabName !== this.activeTabName) {
                // proxy to parent's `changeTab`
                this.$parent.changeTab(tab.tabName, $evt);
              }
            }
          }
        }, tabLabel);
      });

      return h("ul", {class: "basic-tabs__header"}, labelVnodes);
    }
  };
</script>
