<template>
  <div class="pdf-viewer clearfix">
    <div class="pdf-viewer__section">
      <div style="margin: auto auto">
        <iframe :src="pdfUrl"
          class="pdf-viewer"
          width="100%"
          height="800px">您的浏览器不支持PDF阅读</iframe>
      </div>
    </div>
  </div>
</template>

<script>
  import "pdfjs";

  export default {
    name: "pdf-viewer",

    components: {},

    data() {
      return {
        pdfUrl: ""
      };
    },

    watch: {},

    mounted() {
      let serviceUrl = "";
      let filePath = this.getQueryStringRegExp("filePath");
      this.pdfUrl = serviceUrl + "/" + filePath;
    },

    methods: {
      getQueryStringRegExp(name) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");

        if (reg.test(location.href)) {
          return unescape(RegExp.$2.replace(/\+/g, " "));
        }

        return "";
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .pdf-viewer {
    &__section {
      @include border-radius(5px);
      // height: sz(600 - 2);
      border: 1px solid map-get($colors, dropdown-box-border);
      background: map-get($colors, pure-white);
      padding: sz(10) sz(10);
    }
  }
</style>
