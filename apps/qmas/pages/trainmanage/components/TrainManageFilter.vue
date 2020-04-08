<template>
  <div class="train-manage-filter clearfix">

    <div class="train-manage-filter__btnbox">
      <a href="javascript:;"
        class="btn btn--white train-manage-filter__basicbtn
        train-manage-filter__btnbox-add"
        @click="add">
        添加课程
      </a>

    </div>

  </div>
</template>

<script>
  import EventBus from "__shared-libs/js/vue/eventbus";

  export default {
    name: "train-manage-filter",

    components: {
    },

    data() {
      return {
        searchObj: "",
        userDataCount: null,
        selectedUserCount: 0,
        adminUserCount: 0
      };
    },

    computed: {
      // 组件内部的全选的状态
      selectedAll: {
        get() {
          return this.userDataCount - this.adminUserCount ===
            this.selectedUserCount;
        },

        set(val) {
          this.sendEvent({
            name: "allStatusChanged",
            params: val
          });
        }
      }
    },

    mounted() {
      EventBus.$on("sendData", (evt) => {
        if (evt.name === "userChanged") {
          this.userDataCount = evt.params.userDataCount;
          this.adminUserCount = evt.params.adminUserCount;
        } else if (evt.name === "modelsChanged") {
          this.selectedUserCount = evt.params.selectedUserCount;
        }
      });
    },

    methods: {
      // 发送事件
      sendEvent(evtObj) {
        // {
        //   name, // 事件名称，
        //   params, // 搜索参数
        // }
        EventBus.$emit("searchChanged", evtObj);
      },

      // 搜索时间
      search() {
        this.sendEvent({
          name: "searchObj",
          params: this.searchObj.trim()
        });
      },

      // 重置input
      reset() {
        this.searchObj = "";
        this.search();
      },

      // 添加账号
      add() {
        this.sendEvent({
          name: "add"
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .train-manage-filter {
    @include border-radius(4px);

    position: relative;
    border: 1px solid map-get($colors, dialog-cancel-border);
    padding: sz(8) sz(10) sz(6) sz(10);
    background: map-get($colors, pure-white);

    &__counts {
      float: left;
      margin-top: sz(3);
      margin-left: sz(11);
      width: sz(143);

      &-no {
        margin-left: sz(5);
      }

      .customize-checkbox {
        position: relative;
        top: sz(4);
      }
    }

    &__basicbtn {
      @include border-radius(4px);

      display: inline-block;
      vertical-align: middle;
      height: sz(34);
      line-height: sz(34);
      text-align: center;
    }

    &__btnbox {
      float: left;
      margin-top: sz(2);

      &-statistics {
        font-size: map-get($font-sizes, xs);
        color: map-get($colors, text-light);
        margin-left: sz(5);
      }

      &-imports,
      &-add {
        margin-left: sz(5);
        height: sz(26);
        line-height: sz(26);
      }

      &-multichange {
        vertical-align: middle;
      }
    }

    &__searchbox {
      float: right;
      margin-right: sz(10);

      &-searchbar {
        float: left;

        input {
          @include border-radius(4px 0 0 4px);
          @include placeholder-color(map-get($colors, placeholder-text-color));

          border: 1px solid map-get($colors, dropdown-box-border);
          height: sz(34);
          width: sz(400);
          padding-left: sz(10);
          float: left;
          color: map-get($colors, placeholder-text-color);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        a {
          @include border-radius(0 4px 4px 0);

          width: sz(90);
          float: left;
          background: map-get($colors, theme-blue);
          color: map-get($colors, pure-white);
        }
      }

      &-reset {
        margin-left: sz(10);
        float: left;

        #{get-bem-root()} & {
          color: map-get($colors, theme-blue);
        }
      }
    }
  }
</style>
