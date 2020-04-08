<script>
  import Tab from "./Tab";
  import TabLabels from "./TabLabels";

  export default {
    name: "basic-tabs",

    props: {
      // 这个 tabs 的业务名字（用来重写样式）
      logicClassName: {
        type: String,
        default: null
      },

      activeTabName: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        tabs: []
      };
    },

    methods: {
      // add a tab(tab is reported by itself and this component is
      // only used to maintain the layout)
      addTab(tab) {
        // find only the tab components
        const index = this.$slots.default.filter((tab) => {
          let reg = new RegExp(`\\b${Tab.name}\\b`);

          return tab.tag && reg.test(tab.tag);
        }).indexOf(tab.$vnode);

        this.tabs.splice(index, 0, tab);
      },

      // remove a tab
      removeTab(tab) {
        const index = this.tabs.indexOf(tab);

        if (index > -1) {
          this.tabs.splice(index, 1);
        }
      },

      changeTab(tabName) {
        this.$emit("changeTab", tabName);
      },

      // force the labes panel to show the latest labels after a
      // tab get updated.
      updateLabels() {
        this.$refs.tabLabels.$forceUpdate();
      }
    },

    render(h) {
      return h("div", {class: ["basic-tabs", this.logicClassName]}, [
        h(TabLabels, {
          props: {
            tabs: this.tabs,
            activeTabName: this.activeTabName
          },
          ref: "tabLabels"
        }),

        h("div", {class: "basic-tabs__contents"}, this.$slots.default)
      ]);
    }
  };
</script>

<style lang="scss"></style>
