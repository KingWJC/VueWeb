<script>
  import BasicTabs from "__shared-libs/components/tabs/basic-tabs/Tabs";

  export default {
    name: "round-tabs",

    mixins: [BasicTabs],

    props: {
      // 这个 tabs 的业务名字（用来重写样式）
      logicClassName: {
        type: String,
        default: "round-tabs"
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .round-tabs {
    .basic-tabs {
      &__header {
        height: sz(32);
        line-height: sz(32);
        font-size: map-get($font-sizes, sm);

        &-item {
          @include border-radius(6px 6px 0 0);

          width: sz(78);
          height: sz(31);
          margin-top: 0;
          border: 1px solid map-get($colors, dialog-cancel-border);
          border-right: 0;
          background: map-get($colors, tab-bg);

          &:last-child {
            border-right: 1px solid map-get($colors, dialog-cancel-border);
          }

          &--active {
            background: map-get($colors, pure-white);
            border-color-left: map-get($colors, dialog-cancel-border);
            color: map-get($colors, theme-blue);

            &:first-child {
              border-left: 1px solid map-get($colors, dialog-cancel-border);
            }
          }
        }
      }

      &__contents {
        @include border-radius(0 6px 6px 6px);

        padding: sz(10);
        border: 1px solid map-get($colors, dialog-cancel-border);
      }
    }
  }
</style>
