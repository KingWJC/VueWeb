<template>
  <div class="small-paginator">
    <template v-for="(page, index) in pages">
      <a
        v-if="page.type === 'prev'"
        :key="index"
        :class="{
          'small-paginator__link--disabled': page.disabled
        }"
        class="small-paginator__link"
        href="javascript:;"
        @click="changePage(page)">
        &lt;
      </a>
      <span
        v-else-if="page.type === 'normal' && page.num == curPage"
        :key="index"
        href="javascript:;"
      >
        {{ curPage }}/{{ totalPages }}
      </span>
      <a
        v-else-if="page.type === 'next'"
        :key="index"
        :class="{
          'small-paginator__link--disabled': page.disabled
        }"
        class="small-paginator__link"
        href="javascript:;"
        @click="changePage(page)">
        &gt;
      </a>
    </template>
  </div>
</template>

<script>
  import Paginator from "__components/paginator/Paginator";

  export default ({
    name: "small-paginator",

    mixins: [Paginator]
  });
</script>

<style lang="scss">
  @import "~__scss/lib-common-utils";

  // small-paginator
  .small-paginator {
    @extend %normalized-list;
    text-align: center;
    text-decoration: none;

    &__link {
      border: 1px solid map-get($colors, border-gray);
      background: map-get($colors, pure-white);
      display: inline-block;
      width: sz(13);
      height: sz(13);
      line-height: sz(13);
      &:hover {
        text-decoration: none;
      }

      &--disabled {
        @at-root #{get-bem-root()} & {
          color: rgba(map-get($colors, pure-black), 0.3);
          border-color: rgba(map-get($colors, pure-black), 0.1);
          background: rgba(map-get($colors, pure-black), 0.1);
          cursor: default;
        }
      }
    }
  }
</style>
