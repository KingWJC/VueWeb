<template>
  <table class="log-table-body">
    <tbody>
      <tr v-for="(item, index) in bodyData"
        :key="index">
        <td :title="item.OPER_TIME">
          {{ item.OPER_TIME }}</td>
        <td :title="item.IP">
          {{ item.IP }}</td>
        <td :title="item.OPER_USER_NAME">
          {{ item.OPER_USER_NAME }}</td>
        <td :title="item.OPER_USER_REAL_NAME">
          {{ item.OPER_USER_REAL_NAME }}</td>
        <td :title="item.MODULE_NAME"><div>
          {{ item.MODULE_NAME }}</div></td>
        <td :title="item.OPER_DESC">
          {{ item.OPER_DESC }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: "log-table-body",

    props: {
      bodyData: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .log-table-body {
    @include unify-table-ui();

    > tbody tr {
      cursor: default;

      td {
        @include table-sizes(178, 178, 148, 140, 140, 240);

        &:nth-child(1) {
          padding-left: sz(10);
        }

        &:nth-child(5) {
          div {
            @include word-hidden(sz(385), max-width);
          }
        }
      }
    }

    &__result {
      margin-left: sz(14);

      &--success {
        color: map-get($app-colors, gray-green);
      }

      &--failed {
        color: map-get($colors, theme-red);
      }
    }
  }
</style>
