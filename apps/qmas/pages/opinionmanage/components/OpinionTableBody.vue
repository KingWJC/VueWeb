<template>
  <div>
    <table class="opinion-table-body">
      <tbody>
        <tr v-for="(item, index) in bodyData"
          :key="index">
          <td :title="item.ROLE_NAME">
            <div>{{ item.ROLE_NAME }}</div>
          </td>
          <td :title="item.USER_NAME">
            <div>{{ item.USER_NAME }}</div>
          </td>
          <td :title="item.CONTACT_NAME">{{ item.CONTACT_NAME }}</td>
          <td :title="item.OPINION_DESC">{{ item.OPINION_DESC }}</td>
          <td :title="item.CONTACT_WAY">{{ item.CONTACT_WAY }}</td>
          <td :title="item.COMMIT_TIME">{{ formatDate(item.COMMIT_TIME) }}</td>
          <td :title="item.IS_FEEDBACK_NAME">{{ item.IS_FEEDBACK_NAME }}</td>
          <td :title="item.FB_USER_NAME">{{ item.FB_USER_NAME }}</td>
          <td :title="item.FB_TIME">{{ formatDate(item.FB_TIME) }}</td>
          <td>
            <a href="javascript:;"
              @click="viewDetail(item)">查看详情</a>
            <template v-if="item.IS_FEEDBACK === 0">
              <a href="javascript:;"
                @click="fbClick(item)">反馈</a>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <template v-if="hackReset === true">
      <opinion-detail-dialog
        :display="dispalyOpMain"
        :initData="userData"
        controlModel="add"
        @closeDialog="dispalyOpMain = false"
        @okClicked="editOrAddClicked">
      </opinion-detail-dialog>
    </template>

    <opinion-fb-dialog
      :display="dispalyFbMain"
      :initData="userData"
      controlModel="edit"
      @closeDialog="dispalyFbMain = false"
      @okClicked="editOrAddClicked">
    </opinion-fb-dialog>
  </div>
</template>

<script>
  import Moment from "moment";
  import OpinionDetailDialog from "__libs/components/opinion/OpinionDetailDialog";
  import OpinionFbDialog from "__libs/components/opinion/OpinionFbDialog";

  export default {
    name: "opinion-table-body",

    components: {
      OpinionDetailDialog,
      OpinionFbDialog
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
        dispalyOpMain: false,
        dispalyFbMain: false,
        hackReset: true,
        userData: null
      };
    },

    methods: {

      formatDate: function(date) {
        if (date !== null) {
          return Moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
        } else {
          return "";
        }
      },

      // 查看详情
      viewDetail(obj) {
        this.userData = obj;
        this.dispalyOpMain = true;
      },

      fbClick(obj) {
        this.userData = obj;
        this.dispalyFbMain = true;
      },
      // 本地更新数据
      editOrAddClicked() {
        this.hackReset = false;
        this.$nextTick(function() {
          this.$emit("refreshData");
        });
        this.hackReset = true;
      }

    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .opinion-table-body {
    @include unify-table-ui();

    > tbody tr {
      cursor: default;

      td {
        @include table-sizes(80, 110, 90, 80, 80, 80, 45, 90, 80, 80, 100);

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
