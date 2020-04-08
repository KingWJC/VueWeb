<template>
  <div>
    <table class="scene-examine-table-body">
      <tbody>
        <tr v-for="(item, index) in bodyData"
          :key="index">
          <td :title="item.HOSP_NAME">{{ item.HOSP_NAME }}</td>
          <td :title="item.DEPT_NAME">{{ item.DEPT_NAME }}</td>
          <td :title="item.UPD_TIME">{{ item.UPD_TIME }}</td>
          <td :title="item.SCENE_GRADE">
            <p v-if="item.STATE_VALUE===4">
              {{ item.DATA_GRADE }}
            </p>
            <p v-else></p>
          </td>
          <td :title="item.AC_RESULT">
            <p v-if="item.STATE_VALUE===4">
              {{ item.AC_RESULT }}
            </p>
            <p v-else></p>
          </td>
          <td :title="item.STATE_VALUE_NAME">{{ item.STATE_VALUE_NAME }}</td>
          <td :title="item.UPD_USER_NAME">
            <p v-if="item.STATE_VALUE===4">
              {{ item.UPD_USER_NAME }}
            </p>
            <p v-else></p>
          </td>
          <td :title="item.UPD_TIME">
            <p v-if="item.STATE_VALUE===4">
              {{ item.UPD_TIME }}
            </p>
            <p v-else></p>
          </td>
          <td>
            <p v-if="item.STATE_VALUE===4">
              <a
                href="javascript:;"
                class="material-examine__table-edit"
                @click="viewDetail(item,1)"
              >查看</a>
            </p>
            <p v-else>
              <a href="javascript:;"
                class="material-examine__table-edit"
                @click="viewDetail(item,2)">审核</a>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import GlobalUploader from "__libs/components/GlobalUploader";
  export default {
    name: "scene-examine-table-body",
    components: {
      GlobalUploader,
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
        editBaseData: {},
        showFileControlDialog: false
      };
    },

    methods: {
      // 查看进度
      viewDetail(obj, Edittype) {
        this.$router.push({
          path: "/sceneexamineDetail",
          query: { editdata: obj,
                   Edittype: Edittype }
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .scene-examine-table-body {
    @include unify-table-ui();

    > tbody tr {
      cursor: default;

      td {
        @include table-sizes(160, 160, 90, 80, 80, 80, 80, 90, 80);

        &:nth-child(1) {
          padding-left: sz(10);
        }

        &:nth-child(4) {
          text-align: center;
        }

        &:nth-child(5) {
          text-align: center;
        }

        &:nth-child(6) {
          text-align: center;
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
