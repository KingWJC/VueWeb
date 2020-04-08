<script>
  import $ from "jquery";

  // 迁移组件 $el 到新的位置, 默认 <body> 下
  export default {
    // mark it an abstract component, do not create actual dom element.
    abstract: true,

    name: "teleporter",

    props: {
      // where should the dom elememt be transfered to.
      target: {
        type: String,
        // by default it will be appended to '<body>'
        default: "body"
      }
    },

    data() {
      return {
        // mounted $el
        refEl: null
      };
    },

    updated() {
      $(this.refEl).replaceWith(this.$el);
    },

    beforeDestroy() {
      $(this.refEl).remove();
      this.refEl = null;
    },

    mounted() {
      if (!this.refEl) {
        this.refEl = this.$el;
        $(this.target).append(this.refEl);
      } else {
        $(this.refEl).replaceWith(this.$el);
      }
    },

    render: function() {
      return this.$slots.default[0];
    }
  };
</script>
