<template>
  <teleporter>
    <div
      :class="[
        {
          'hide': !display,
          'tooltips--right': direction === 'right',
          'tooltips--left': direction === 'left',
          'tooltips--topright': direction === 'topright',
          'tooltips--tbctop': direction === 'topright',
          'tooltips--topleft': direction === 'topleft',
          'tooltips--rlcbottom':
            (direction === 'right' || direction === 'left') &&
            c_bottom <= tipsParams.height,
          'tooltips--rlctop':
            (direction === 'right' || direction === 'left') &&
            c_bottom > tipsParams.height
        },
        logicClassName
      ]"
      :style="{
        top: top + 'px',
        left: left + 'px'
      }"
      class="tooltips">

      <div class="tooltips__content">
        <slot :option="tips"
          name="tag">
          <p v-for="(item, index) in tips"
            :key="index"
            class="tooltips__content-item"
            v-html="item">
          </p>
        </slot>
      </div>

      <i class="tooltips__triangle"></i>
    </div>
  </teleporter>
</template>

<script>
  import $ from "jquery";

  export default {
    name: "tooltips",

    props: {
      // 业务逻辑名，重置样式时使用
      logicClassName: {
        type: String,
        default: null
      },

      // {'hide': !display},
      // TODO: tips 展示方向
      // 可用：right（右指向）
      // 可用：left（左指向）
      // 可用：topright（顶部右指向）
      direction: {
        type: String,
        default: ""
      },

      // tips 与元素之间的间距
      marginLeft: {
        type: Number,
        default: 0
      },
      marginTop: {
        type: Number,
        default: 0
      }
    },

    data() {
      return {
        // 当前展示状态
        display: false,
        option: [],
        // 指令所在元素传递的元信息
        // {
        //   left: 0 // 元素相对 document 左offset
        //   top: 0, // 元素相对 document 上offset
        //   width: 0 // 元素宽
        //   height: 0 // 元素高
        // }
        dimension: {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        },

        // tips参数
        tipsParams: {
          width: 0,
          height: 0
        },

        // tips 列表
        tips: []
      };
    },

    computed: {
      left() {
        return this.dimension.left + this.marginLeft;
      },

      top() {
        // 小三角形的高是 9px (见下方sass)
        return this.dimension.top + (this.dimension.height - 9) / 2 +
          this.marginTop;
      },

      c_bottom() {
        return $(window).height() - this.dimension.top - this.dimension.height;
      }
    },

    methods: {
      show(dimension) {
        this.dimension = dimension;
        this.display = true;
      },

      setContent(tips) {
        this.tips = tips;
      },

      hide() {
        this.display = false;
      },

      setTipsParams(tipsParams) {
        this.tipsParams = tipsParams;
      }
    }
  };
</script>

<style lang="scss">
  @import "~__shared-libs/scss/lib-common-utils";

  .tooltips {
    // 等宽等高
    $_triangle-width: 8;

    position: absolute;
    width: sz($_triangle-width + 1);
    height: sz($_triangle-width + 1);

    &__triangle {
      display: block;
      width: sz($_triangle-width + 1);
      height: sz($_triangle-width + 1);

      &::before {
        content: "";
        display: block;
        position: absolute;
        // top:sz(18);
        // right:sz(-5);
        width: sz($_triangle-width);
        height: sz($_triangle-width);
        background: map-get($colors, pure-white);
        border-top: 1px solid map-get($colors, dialog-cancel-border);
        border-left: 1px solid map-get($colors, dialog-cancel-border);
      }

      @at-root #{get-bem-root()}--right &::before {
        @include transform(rotate(135deg));
      }

      @at-root #{get-bem-root()}--left &::before {
        @include transform(rotate(315deg));
      }

      @at-root #{get-bem-root()}--topright &::before,
        #{get-bem-root()}--topleft &::before {
        @include transform(rotate(45deg));
      }
    }

    &__content {
      $_parent: &;

      @include border-radius(6px);
      //控制content盒子在离箭头上下左右的方向
      @at-root #{get-bem-root()}--left & {
        left: sz(5);
      }

      @at-root #{get-bem-root()}--right & {
        right: sz(5);
      }

      @at-root #{get-bem-root()}--topright & {
        top: sz(10);
        right: sz(-20);
      }

      @at-root #{get-bem-root()}--topleft & {
        top: sz(5);
        left: sz(-20);
      }

      //当tip内容过长,
      //控制content盒子箭头在盒子的上定位还是下定位
      @at-root #{get-bem-root()}--rlcbottom & {
        bottom: sz(-15);
      }

      @at-root #{get-bem-root()}--rlctop & {
        top: sz(-15);
      }
      // ==========未设计完============
      @at-root #{get-bem-root()}--tbcbottom & {
        bottom: sz(5);
      }

      @at-root #{get-bem-root()}--tbctop & {
        top: sz(5);
      }

      position: absolute;
      min-width: sz(50);
      box-shadow: sz(-4) sz(4) sz(5) rgba(map-get($colors, pure-black), 0.1);
      padding: sz(10);
      color: map-get($colors, dialog-text-color);
      background: map-get($colors, pure-white);
      border: 1px solid map-get($colors, dialog-cancel-border);

      &-item {
        white-space: pre;
        margin: 0;
        font-size: map-get($colors, xs);

        &:first-child {
          border-bottom: 1px solid map-get($colors, dialog-cancel-border);
          padding-bottom: sz(3);
          margin-bottom: sz(3);
        }
      }
    }
  }
</style>
