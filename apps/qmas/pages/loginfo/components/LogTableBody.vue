<template>
  <table class="log-table-body">
    <tbody>
      <tr v-for="(item, index) in bodyData" 
        :key="index">
        <td :title="item.ACTION_ID">{{ item.ACTION_ID }}</td>
        <td :title="item.ACTION_DATE">{{ item.ACTION_DATE }}</td>
        <td :title="item.ACTION_TYPE_NAME">{{ item.ACTION_TYPE_NAME }}</td>
        <td :title="item.ACTION_EVENT_NAME">{{ item.ACTION_EVENT_NAME }}</td>
        <td :title="item.ACTION_CONT"><div>{{ item.ACTION_CONT }}</div></td>
        <td :title="item.USER_NAME">{{ item.USER_NAME }}</td>
        <template v-if="item.ACTION_VALUE==='0'">
          <td title="成功">
            <div class="log-table-body__result
              log-table-body__result--success">成功</div>
          </td>
        </template>
        <template v-else>
          <td title="失败">
            <div class="log-table-body__result
              log-table-body__result--failed">失败</div>
          </td>
        </template>
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
        @include table-sizes(74, 178, 148, 140, 385, 140);

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
