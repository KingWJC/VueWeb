<template>
  <!-- 暂无内容 显示图片 -->
  <div class="qa-no-content">
    <div class="qa-no-content__noscon">
      <img :src="imgUrl"
        class="qa-no-content__noscon-img" />
      <span :title="title">{{ interceptTitle }}</span>
    </div>
  </div>
</template>

<script>
  // 报警图片
  import policeImg from "__libs/imgs/police.png";
  // 没有内容图片
  import noContentImg from "__libs/imgs/no_content.png";

  export default {
    name: "qa-no-content",

    props: {
      title: {
        type: String,
        default: "暂无报警病种"
      },

      // 只有在报警的时候才需要传入 true（报警的图不一样）
      isWarning: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      imgUrl() {
        return this.isWarning ? policeImg : noContentImg;
      },

      // 判断是否超长和截取
      interceptTitle() {
        // 如果类似格式：【xx】，则判断是否超长，并截取
        if (this.title.indexOf("【") > -1) {
          let titleArr = this.title.split("【");
          let titleArrNew = titleArr[1].split("】");

          if (titleArrNew[0].length > 25) {
            return `${titleArr[0]}【${titleArrNew[0].substring(0, 25)}...】${titleArrNew[1]}`;
          } else {
            return this.title;
          }
        } else {
          // else: 否则直接返回上级文案
          return this.title;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .qa-no-content {
    text-align: center;
    height: sz(250);

    &__noscon {
      display: inline-block;
      // 垂直居中 ( 父层高度 - 子层高度 ) / 2
      margin-top: sz((250 - 50) / 2);

      &-img {
        width: sz(71);
        height: sz(50);
        margin-right: sz(15);
        vertical-align: middle;
      }

      span {
        position: relative;
        top: sz(5);
        color: map-get($colors, text-light);
      }
    }
  }
</style>
