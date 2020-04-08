<template>
  <table class="org-table-body">
    <tbody>
      <tr v-for="(item, index) in bodyData"
        :key="index">
        <td :title="item.HOSP_NAME">
          <div class="org-table-body__hospassess">{{ item.HOSP_NAME }}</div>
        </td>
        <td :title="item.DEPT_NAME">
          <div class="org-table-body__hospassess">{{ item.DEPT_NAME }}</div>
        </td>
        <td :title="item.CREATE_TIME">
          {{ (item.CREATE_TIME||'').split(' ')[0] }}</td>
        <td :title="item.VERIFY_DATE">
          {{ (item.VERIFY_DATE||'').split(' ')[0] }}</td>
        <td :title="verifystate[item.VERIFY_STATE].ITEM_NAME">
          <template v-if="JSON.stringify(item.VERIFY_STATE)!=='{}'">
            {{ verifystate[item.VERIFY_STATE].ITEM_NAME }}
          </template>
          <template v-else>{{ item.VERIFY_STATE }}</template>
        </td>

        <td :title="item.PAY_DATE">{{ (item.PAY_DATE||'').split(' ')[0] }}</td>
        <td :title="paystate[item.PAY_STATE].ITEM_NAME">
          <template v-if="JSON.stringify(item.PAY_STATE)!=='{}'">
            {{ paystate[item.PAY_STATE].ITEM_NAME }}
          </template>
          <template v-else>{{ item.PAY_STATE }}</template>
        </td>
        <td class="tdfooter">
          <a href="javascript:;"
            class="org-table-body__edit"
            @click="editOrgInfo(item)">编辑</a>
          <!-- <template v-if="showdelete">
            <a href="javascript:;"
              class="org-table-body__delt"
              @click="deleteOrgInfo(item)">删除</a>
          </template> -->
          <template v-if="item.VERIFY_STATE === 1">
            <a
              v-tooltips:qaPointTips="'机构已审核通过'"
              href="javascript:;"
              class="org-table-body__delt--disabled"
            >审核</a>
          </template>
          <template v-else>
            <a href="javascript:;"
              class="org-table-body__delt"
              @click="verifyOrg(item)">审核</a>
          </template>
          <template v-if="item.PAY_STATE === 1|| item.VERIFY_STATE === 0">
            <a
              v-tooltips:qaPointTips="'机构已缴费'"
              href="javascript:;"
              class="org-table-body__delt--disabled"
            >缴费</a>
          </template>
          <template v-else>
            <a href="javascript:;"
              class="org-table-body__delt"
              @click="payOrg(item)">缴费</a>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: "org-table-body",

    components: {},

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
        paystate: [
          {
            ITEM_CODE: "0",
            ITEM_NAME: "待缴费"
          },
          {
            ITEM_CODE: "1",
            ITEM_NAME: "已缴费"
          }
        ],
        verifystate: [
          {
            ITEM_CODE: "0",
            ITEM_NAME: "待审核"
          },
          {
            ITEM_CODE: "1",
            ITEM_NAME: "审核通过"
          },
          {
            ITEM_CODE: "2",
            ITEM_NAME: "审核不通过"
          }
        ],
        showdelete: this.$config.USER.IsAdmin
      };
    },
    methods: {

      verifyOrg(item) {
        this.$emit("orgVerify", item);
      },
      editOrgInfo(item) {
        this.$emit("orgEdit", item);
      },
      deleteOrgInfo(item) {
        this.$emit("orgDelete", item);
      },
      payOrg(users) {
        this.$emit("orgPay", users);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .org-table-body {
    @include unify-table-ui();

    &__hospassess {
      @include word-hidden(sz(250));
    }

    &-hidden {
      visibility: hidden;
      display: inline-block;
    }

    > tbody tr {
      cursor: default;

      td {
        @include table-sizes(270, 250, 130, 130, 130, 130, 130, 200);

        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;

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

    &__edit,
    &__delt {
      #{get-bem-root()} & {
        color: map-get($colors, theme-blue);
      }

      &--disabled {
        @at-root #{get-bem-root()} & {
          color: map-get($colors, placeholder-text-color);
        }

        cursor: default;
      }
    }

    &__edit {
      margin-right: sz(6);
    }
  }
  .tdfooter {
    color: blue;
  }
</style>
