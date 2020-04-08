<template>
  <table class="user-table-body">
    <tbody>
      <tr v-for="(item, index) in bodyData"
        :key="index">
        <td :title="item.USER_ACCOUNT">
          <div>{{ item.USER_ACCOUNT }}</div>
        </td>
        <td :title="item.USER_REALNAME">
          <div>{{ item.USER_REALNAME }}</div>
        </td>
        <td :title="item.RoleNames">{{ item.RoleNames }}</td>
        <td :title="item.UPD_TIME">{{ item.UPD_TIME }}</td>
        <td>
          <template v-if="item.RoleType === 1">
            <!-- 超级管理员禁用 -->
            <switch-btn :checked="!!item.STATE"
              :disabled="true"></switch-btn>
          </template>
          <template v-else>
            <!-- 非超级管理员 -->
            <switch-btn :checked="!!item.STATE"
              @changeValue="changeUserStatus(item)"></switch-btn>
          </template>
        </td>
        <td>
          <template v-if="item.RoleType===1">
            <span class="user-table-body-hidden">占位</span>
            <span class="user-table-body-hidden">占位</span>
            <a href="javascript:;"
              @click="emptyUserInfo(item)">清空密码</a>
          </template>
          <template v-else>
            <a href="javascript:;"
              @click="editUserInfo(item)">编辑</a>
            <a href="javascript:;"
              @click="deleteUserInfo(item)">删除</a>
            <a href="javascript:;"
              @click="emptyUserInfo(item)">清空密码</a>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import SwitchBtn from "__shared-libs/components/SwitchBtn";

  export default {
    name: "user-table-body",

    components: {
      CustomizeCheckbox,
      SwitchBtn
    },

    props: {
      bodyData: {
        type: Array,
        default() {
          return [];
        }
      },
      checkModels: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    watch: {
      checkModels(checkedUsers, oldList) {
        // 只有在真正发生变化之后才发出通知
        // 注意：必须构建深拷贝之后才可以 sort！不然会触发响应式更新死循环，因为
        // sort 会直接修改原数组
        let changedCopy = checkedUsers.slice(0).sort();
        let oldCopy = oldList.slice(0).sort();

        // 使用 JSON 对比算法，快速对比差异
        if (JSON.stringify(changedCopy) === JSON.stringify(oldCopy)) {
          this.updateCheckedUsers(checkedUsers);
        }
      }
    },

    methods: {
      changeUserStatus(item) {
        this.$emit("statusChanged", item);
      },
      editUserInfo(item) {
        this.$emit("userEdit", item);
      },
      deleteUserInfo(item) {
        this.$emit("userDelete", item);
      },
      emptyUserInfo(item) {
        this.$emit("userEmpty", item);
      },
      updateCheckedUsers(users) {
        this.$emit("updateCheckedUsers", users);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .user-table-body {
    @include unify-table-ui();

    &-hidden {
      visibility: hidden;
      display: inline-block;
    }

    > tbody tr {
      cursor: default;

      td {
        @include table-sizes(150, 180, 150, 205, 140, 200);

        &:nth-child(1) {
          padding-left: sz(30);
          div {
            @include word-hidden(sz(145), max-width);
          }
        }

        &:nth-child(2) {
          div {
            @include word-hidden(sz(175), max-width);
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
