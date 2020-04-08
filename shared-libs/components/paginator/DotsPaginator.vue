<template>
  <div class="dots-paginator">
    <template v-for="(page, index) in pages">
      <a
        v-if="page.type === 'normal'"
        :key="index"
        :class="{
          'dots-paginator__link--active': page.num === curPage
        }"
        class="dots-paginator__link"
        href="javascript:;"
        @click="changePage(page)">
        <template v-if="pageShow">
          {{ page.num }}
        </template>
      </a>
      <a
        v-else-if="page.type === 'ellipsis' && showEllipsis"
        :key="index"
        class="dots-paginator__ddd">...</a>
    </template>
  </div>
</template>

<script>
  import Paginator from "__shared-libs/components/paginator/Paginator";

  export default ({
    name: "dots-paginator",

    mixins: [Paginator],

    props: {
      pageShow: {
        type: Boolean,
        default: true
      }
    }
  });
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .dots-paginator {
    text-align: center;

    a {
      color: map-get($colors, theme-blue);
    }

    &__link,
    &__ddd {
      @include border-radius(50%);

      display: inline-block;
      width: sz(16);
      height: sz(16);
      margin-left: sz(10);
      line-height: sz(16);
      font-size: sz(11);
      text-align: center;
      border: 1px solid map-get($colors, theme-blue);
    }

    &__ddd {
      border: none;
    }

    &__link {
      &:first-child {
        margin-left: 0;
      }

      &--active {
        @at-root #{get-bem-root()} & {
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
          cursor: default;
        }
      }

      &--disabled {
        @at-root #{get-bem-root()} & {
          color: rgba(map-get($colors, pure-black), 0.3);
          cursor: default;

          &:hover {
            color: rgba(map-get($colors, pure-black), 0.3);
            cursor: default;
          }
        }
      }

      &-goprev,
      &-gonext {
        width: auto;
        padding: sz(0) sz(10);
      }
    }
  }
</style>
