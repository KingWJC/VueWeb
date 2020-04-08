<template>
  <div>
    <table class="expert-audit-table-body">
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
          <td :title="item.MATERIAL_GRADE">{{ item.MATERIAL_GRADE }}</td>
          <td :title="item.DATA_GRADE">{{ item.DATA_GRADE }}</td>
          <td :title="item.SCENE_GRADE">{{ item.SCENE_GRADE }}</td>
          <td :title="item.STATE_VALUE_NAME">{{ item.STATE_VALUE_NAME }}</td>
          <td :title="item.AC_RESULT">{{ item.AC_RESULT }}</td>
          <td v-if="item.STATE_VALUE_NAME=='已审核'"
            :title="item.UPD_TIME">{{ item.UPD_TIME }}</td>
          <td v-else></td>
          <template v-if="item.STATE_VALUE=='1'||item.STATE_VALUE=='2'
          ||item.STATE_VALUE=='3'||item.STATE_VALUE=='4'">
            <td title="查看">
              <a href="javascript:;"
                @click="viewDetail(item)">查看</a>
            </td>
          </template>
          <template v-else-if="item.STATE_VALUE=='5'">
            <td>
            </td>
          </template>
          <template v-else>
            <td title="审核">
              <a href="javascript:;"
                @click="viewDetail(item)">审核</a>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";

  export default {
    name: "expert-audit-table-body",
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
      // 编辑
      editTrainInfo(obj) {
        this.editBaseData = obj;
        this.controlModel = "edit";
        this.dialogFooterOkBtnText = "完成";
        this.showUserControlDialog = true;
      },
      dialogOkClicked(id) {
        this.$emit("refreshData", id);
      },

      // 查看进度
      viewDetail(obj) {
        this.$router.push({
          path: "/expertAuditDetail",
          query: { editdata: obj }
        });
      }

    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .expert-audit-table-body {
    @include unify-table-ui();

    > tbody tr {
      cursor: default;

      td {
        @include table-sizes(180, 150, 90, 80, 80, 80, 80, 90, 100, 100);

        &:nth-child(1) {
          padding-left: sz(10);
          div {
            @include word-hidden(sz(175), max-width);
          }
        }

        &:nth-child(2) {
          div {
            @include word-hidden(sz(145), max-width);
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
