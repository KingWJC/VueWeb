<script>
  import BasicTabs from "__shared-libs/components/tabs/basic-tabs/Tabs";

  export default {
    name: "square-tabs",

    mixins: [BasicTabs],

    props: {
      // 这个 tabs 的业务名字（用来重写样式）
      logicClassName: {
        type: String,
        default: "square-tabs"
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .square-tabs {
    .basic-tabs {
      &__header {
        height: sz(38);
        line-height: sz(38);
        font-size: map-get($font-sizes, sm);
        background: map-get($colors, tab-bg);
        border: 1px solid map-get($colors, dialog-cancel-border);

        &-item {
          height: sz(40);
          margin-top: -1px;
          padding: 0 sz(20);

          &--active {
            background: map-get($colors, pure-white);
            border-left: 1px solid map-get($colors, dialog-cancel-border);
            border-right: 1px solid map-get($colors, dialog-cancel-border);
            border-top: 2px solid map-get($colors, theme-blue);
            height: sz(38);
            color: map-get($colors, theme-blue);

            &:first-child {
              border-left: 0;
            }
          }
        }
      }

      &__contents {
        padding: sz(10) sz(20);
        border: 1px solid map-get($colors, dialog-cancel-border);
        border-top: 0;
      }
    }
  }
</style>
