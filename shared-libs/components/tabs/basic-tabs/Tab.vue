<script>
  export default {
    name: "basic-tabs-tab",

    props: {
      // static props
      tabName: {
        type: String,
        default: null
      },

      // tab label(will be used as tab title if no 'tabLabel' slot
      // is given)
      tabLabel: {
        type: String,
        default: null
      }
    },

    computed: {
      activeTabName() {
        return this.$parent.activeTabName;
      }
    },

    mounted() {
      this.$parent.addTab(this);
    },

    // once a updating loop is triggered, immediately re-render the
    // TabLabels components to force it show the latest labels,
    // in this way we can drop the `tab.$forceUpdate()` hack from outside
    // of the tabs component.
    updated() {
      this.$parent.updateLabels();
    },

    destroyed() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }

      this.$parent.removeTab(this);
    },

    render(h) {
      return h("div", {
        class: [
          "basic-tabs__content",
          {
            "basic-tabs__content--active":
              this.activeTabName === this.tabName
          }
        ]
      }, this.$slots.default);
    }
  };
</script>
