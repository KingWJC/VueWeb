<template>
  <div class="dept-cascade-drill clearfix">
    <div class="dept-cascade-drill__content">
      <a
        :class="{
          'dept-cascade-drill__content-left--active': drillUpType
        }"
        href="javascript:;"
        class="dept-cascade-drill__content-left"
        @click="upDrillList">上钻</a>

      <span :title="currentTitle"
        class="dept-cascade-drill__content-center">
        {{ shortTitle }}
      </span>

      <!-- 下钻 -->
      <a
        :class="{
          'dept-cascade-drill__content-right--active': drilldownType
        }"
        href="javascript:;"
        class="dept-cascade-drill__content-right"
        @click="downDrillList">下钻</a>

      <template v-if="accuracyItems.length > 0">
        <div :class="{'hide': !display}"
          class="dept-cascade-drill__content-drill">
          <span
            v-for="(item, index) in accuracyItems"
            :key="index"
            @click="nextDrill(item)">
            {{ item.NAME }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import $ from "jquery";
  import isClickOutsideEl from "__shared-libs/js/modules/is-click-outside-el";

  export default {
    name: "dept-cascade-drill",

    props: {
      // (当前可用)上钻级别
      drillUpType: {
        type: String,
        // 当前不能上钻就为 null
        default: null
      },

      // (当前可用)下钻级别
      drilldownType: {
        type: String,
        // 当前不能下钻就为 null
        default: null
      },

      // 当前组件中间展示的文本
      currentTitle: {
        type: String,
        default: null
      },

      // 下拉数据
      accuracyItems: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        display: false
      };
    },

    computed: {
      shortTitle() {
        if (this.currentTitle && this.currentTitle.length > 5) {
          return this.currentTitle.slice(0).substring(0, 5) + "...";
        } else {
          return this.currentTitle;
        }
      }
    },

    watch: {
      display() {
        if (this.display) {
          // 异步触发，因为在当前瞬间视图还没更新完成，props状态也还没同步完成
          // 但是我们不能用
          setTimeout(() => {
            $(document).on("click", this.docClickDebouncer);
          }, 0);
        } else {
          $(document).off("click", this.docClickDebouncer);
        }
      }
    },

    methods: {
      // 上钻
      upDrillList() {
        if (this.drillUpType) {
          this.$emit("upDrillList", this.drillUpType);
        }
      },

      // 下钻
      downDrillList() {
        if (this.drilldownType) {
          this.display = !this.display;
        }
      },

      // 下转下拉菜单点击事件
      nextDrill(item) {
        this.display = false;
        this.$emit("nextDrill", Object.assign({}, item));
      },

      // 如果点击非浮动区域，触发关闭事件
      docClickDebouncer(evt) {
        // 不是点击浮动弹出框, 关闭
        if (!isClickOutsideEl(
          evt,
          this.$el.querySelector(".dept-cascade-drill__content-drill")
        )) {
          this.display = false;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .dept-cascade-drill {
    border: 1px solid map-get($app-colors, fill-gray);
    width: sz(212);
    height: sz(32);

    &__content {
      @include border-radius(5px);

      width: sz(200);
      height: sz(22);
      line-height: sz(22);
      margin: sz(4) auto 0;
      border: 1px solid map-get($app-colors, fill-gray);
      font-size: map-get($font-sizes, xs);
      position: relative;
      background: map-get($app-colors, fill-gray);

      &-left,
      &-center,
      &-right {
        float: left;
        height: sz(22);
      }

      &-left,
      &-right {
        #{get-bem-root()} & {
          color: map-get($colors, pure-white);
        }

        width: sz(35);
        position: relative;
        padding-left: sz(25);
        cursor: default;

        &--active {
          background: map-get($colors, theme-blue);
          cursor: pointer;
        }

        &::after {
          border-left: sz(5) solid transparent;
          border-right: sz(5) solid transparent;
          content: "";
          position: absolute;
          width: 0;
          top: sz(8);
        }
      }

      &-center {
        width: sz(80);
        text-align: center;
        font-size: map-get($font-sizes, xs);
        background: map-get($colors, pure-white);
      }

      &-left {
        @include border-radius(5px 0 0 5px);

        &::after {
          border-bottom: sz(5) solid map-get($colors, pure-white);
          left: sz(10);
        }
      }

      &-right {
        @include border-radius(0 5px 5px 0);

        padding-left: sz(10);
        width: sz(50);

        &::after {
          border-top: sz(5) solid map-get($colors, pure-white);
          content: "";
          position: absolute;
          width: 0;
          right: sz(10);
        }
      }

      &-drill {
        @include border-radius(3px);

        width: sz(80);
        position: absolute;
        top: sz(24);
        right: sz(-22);
        background: map-get($colors, pure-white);
        border: 1px solid map-get($app-colors, fill-gray);
        cursor: pointer;
        z-index: 1;

        span {
          display: block;
          height: sz(24);
          line-height: sz(24);
          padding-left: sz(10);

          &:hover {
            background: map-get($colors, bg-home);
          }
        }
      }
    }
  }
</style>
