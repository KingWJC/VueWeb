<template>
  <div class="cer-detail">
    <span class="cer-detail__log"></span>
    <p class="cer-detail__title">您还没有认证记录</p>
    <a href="javascript:;" 
      class="cer-detail__apply" 
      @click="applyCer">立即申请</a>
  </div>
</template>

<script>
  export default {
    name: "cer-detail",
    data() {
      return {};
    },
    methods: {
      applyCer() {
        this.$router.push({
          path: "/CerApply",
          query: {
            applyLevel: "",
            reapply: false,
            isHeigher: false
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";
  .cer-detail {
    background: rgba(map-get($colors, pure-white), 0.8);
    padding: sz(70) sz(80) sz(63) sz(60);

    &__log {
      display: block;
      width: sz(150);
      height: sz(155);
      margin: sz(0) auto 0;
      background: url("~__libs/imgs/certificate_empty.png") no-repeat;
    }

    &__title {
      margin-top: sz(40);
      text-align: center;
      font-weight: bold;
      color: map-get($colors, text-main);
      font-size: sz(23);
    }

    &__apply {
      @include border-radius(6px);

      display: block;
      margin: auto;
      width: sz(200);
      height: sz(34);
      background-color: map-get($colors, theme-blue);
      text-align: center;
      line-height: sz(34);

      @at-root #{get-bem-root()} & {
        color: map-get($colors, pure-white);
      }
    }
  }
</style>
