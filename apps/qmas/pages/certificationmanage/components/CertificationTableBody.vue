<template>
  <div>
    <table class="certification-table-body">
      <tbody>
        <tr v-for="(item, index) in bodyData"
          :key="index">
          <td :title="item.HOSP_NAME">
            <div>{{ item.HOSP_NAME }}</div>
          </td>
          <td :title="item.DEPT_NAME">
            <div>{{ item.DEPT_NAME }}</div>
          </td>
          <td :title="item.AC_TYPE_NAME">{{ item.AC_TYPE_NAME }}</td>
          <td :title="item.APPLY_LEVEL">{{ item.APPLY_LEVEL }}</td>
          <td :title="item.APPLY_TIME">{{ item.APPLY_TIME }}</td>
          <td :title="item.AC_SECTION">{{ item.AC_SECTION }}</td>
          <td :title="item.STATE_VALUE_NAME">{{ item.STATE_VALUE_NAME }}</td>
          <td :title="item.AC_RESULT">{{ item.AC_RESULT }}</td>
          <td :title="item.START_TIME">{{ item.START_TIME }}</td>
          <td :title="item.END_TIME">{{ item.END_TIME }}</td>
          <td>
            <a href="javascript:;"
              @click="viewProgress(item)">查看</a>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  // import Axios from "axios";
  // import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "certification-table-body",
    components: {
      BasicDialog
    },

    props: {
      bodyData: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        // 编辑模式下 原始渲染对象
        editBaseData: {}
      };
    },

    methods: {

      // 查看进度
      viewProgress(obj) {
        this.$router.push({
          path: "/certificationDetail",
          query: { applyID: obj.AC_APPLY_ID }
        });
      }

    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .certification-table-body {
    @include unify-table-ui();

    > tbody tr {
      cursor: default;

      td {
        @include table-sizes(150, 150, 90, 80, 80, 80, 80, 90, 80, 80, 100);

        &:nth-child(1) {
          padding-left: sz(10);
          div {
            @include word-hidden(sz(150), max-width);
          }
        }

        &:nth-child(2) {
          div {
            @include word-hidden(sz(150), max-width);
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
