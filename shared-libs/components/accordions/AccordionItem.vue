<script>
  export default {
    name: "accordion-item",

    props: {
      // static props
      accordionName: {
        type: String,
        default: ""
      }
    },

    computed: {
      activeAccordionName() {
        return this.$parent.activeAccordionName;
      }
    },

    mounted() {
      this.$parent.addAccordion(this);
    },

    destroyed() {
      if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }

      this.$parent.removeAccordion(this);
    },

    render(h) {
      let tdVnodes = [],
          otherVnodes = [];

      for (let i = 0, vnodes = this.$slots.default; i < vnodes.length; i++) {
        // only td element will be recognized as valid node
        if (vnodes[i].tag === "td") {
          tdVnodes.push(vnodes[i]);
        } else {
          otherVnodes.push(vnodes[i]);
        }
      }

      // use an empty th for the column to hold the collapsable triangle
      if (this.$parent.appendIconColumn) {
        tdVnodes.unshift(h(
          "td",
          {class: "accordions__table-tbody-triangle-td"},
          [h("i", {class: "accordions__triangle"})]
        ));
      }

      return h(
        "tbody",
        {
          class: [
            "accordions__table-tbody",
            {
              "accordions__table-tbody--active":
                this.accordionName === this.activeAccordionName
            }
          ]
        },
        [
          h(
            "tr",
            {
              class: "accordions__table-tbody-title",
              on: {
                click: ($evt) => {
                  this.$parent.changeAccordion(this.accordionName, $evt);
                }
              }
            }, tdVnodes
          ),

          h(
            "tr",
            {
              class: "accordions__table-tbody-content"
            },
            [
              h(
                "td",
                {
                  attrs: {
                    colspan: tdVnodes.length
                  }
                }, otherVnodes
              )
            ]
          )
        ]
      );
    }
  };
</script>
