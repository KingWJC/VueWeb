<template>
  <div class="train-course clearfix">
    <!--侧边栏-->
    <div class="train-course__aside">
      <h3 class="train-course__aside-title">基础课程</h3>
      <div
        v-for="(item,index) in basicCourse"
        :key="'B'+index"
        class="train-course__aside-general-article"
      >
        <a
          :class="{'active':ind === 'B'+index}"
          href="javascript:;"
          @click="switchCourse(item,'B'+index)"
        >{{ item.VIEW_TITLE }}</a>
      </div>

      <h3 class="train-course__aside-title">进阶课程</h3>
      <div
        v-for="(item,index) in advanceCourse"
        :key="'A'+index"
        class="train-course__aside-general-article"
      >
        <a
          :class="{'active':ind === 'A'+index}"
          href="javascript:;"
          @click="switchCourse(item,'A'+index)"
        >{{ item.VIEW_TITLE }}</a>
      </div>
    </div>

    <!--展示区域-->
    <div class="train-course__section">
      <div style="padding: 0px 0px 2px 0px;height: 25px">
        <a :class="{ hide: studyFlag }"
          href="javascript::"
          class="study-flag">已学习</a>
      </div>

      <div :class="{ hide: hidePlayer }">
        <div id="mse"
          style="margin: auto auto"></div>
      </div>

      <div :class="{ hide: hidePdf }"
        style="margin: auto auto">
        <iframe :src="pdfUrl"
          class="pdf-viewer"
          width="100%"
          height="800px">您的浏览器不支持PDF阅读</iframe>
      </div>

      <div :class="{ hide: hideHtml }"
        style="margin: auto auto">
        <div v-html="htmlText"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import Player from "xgplayer";
  import "pdfjs";
  // import pdf from "pdfjs-dist/lib/pdf";
  // import pdfWorker from "pdfjs-dist/lib/pdf.worker";

  export default {
    name: "train-course",

    components: {},

    data() {
      return {
        ind: "",
        studyFlag: true,
        hidePlayer: true,
        hidePdf: true,
        hideHtml: true,
        htmlText: "<h1>12321</h1>",
        basicCourse: [],
        advanceCourse: [],
        // url: "http://s2.pstatp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4",
        url: "",
        player: {},
        // pdfUrl: "http://image.cache.timepack.cn/nodejs.pdf",
        pdfUrl: ""
      };
    },

    watch: {},

    mounted() {
      this.getTrainCourse();
      // 初始化播放器
      this.player = new Player({
        id: "mse",
        url: this.url,
        width: 700,
        fluid: true
      // height: 440,
      // autoplay: false
      });
    },

    created() {},

    methods: {
      changeState(item) {
        Axios.post(resolveApiRoute("train-course"), {
          stateId: item.STATE_ID,
          applyId: item.APPLY_ID,
          materialId: item.ID
        }).then(
          (res) => {
            if (res.data.Code === 0) {
              this.studyFlag = false;
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      // 获取课程数据
      getTrainCourse() {
        Axios.get(resolveApiRoute("train-course")).then(
          (res) => {
            if (res.data.Code === 0) {
              // this.$showNotice("成功");
              this.basicCourse = res.data.Data.BasicCourse;
              this.advanceCourse = res.data.Data.AdvanceCourse;
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      // 切换课程
      switchCourse(item, index) {
        this.ind = index;
        let fileType = item.FILE_TYPE;
        // let serviceUrl = "http://localhost:45350";
        let serviceUrl = "";

        if (item.STATE == 2) {
          this.studyFlag = false;
        } else {
          this.studyFlag = true;
        }

        if (fileType == 1) {
          this.player.start(serviceUrl + item.MATERIAL_PATH);
          this.hidePlayer = false;
          this.hidePdf = true;
          this.hideHtml = true;
        } else if (fileType == 2) {
          this.pdfUrl = serviceUrl + item.MATERIAL_PATH;
          this.player.pause();
          this.hidePlayer = true;
          this.hidePdf = false;
          this.hideHtml = true;
        } else if (fileType == 3) {
          this.htmlText = item.HTML_CONTENT;
          this.player.pause();
          this.hidePlayer = true;
          this.hidePdf = true;
          this.hideHtml = false;
        }

        this.changeState(item);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";
  // @import '~vue-pdf-reader/vue-pdf-reader.css';
  .study-flag {
    @include border-radius(5px);
    background: #fff;
    border: 1px solid #3789be;
    cursor: pointer;
    color: #3789be;
    padding: 3px;
  }

  .active {
    font-weight: bold;
  }
  .train-course__aside-general-article a:link {
    color: #3c3c3c;
    text-decoration: none;
  }
  .train-course__aside-general-article a:visited {
    color: #551a8b;
    text-decoration: none;
  }
  .train-course__aside-general-article a:hover {
    color: #3789be;
    text-decoration: underline;
  }

  .train-course {
    &__aside {
      @include border-radius(5px);

      float: left;
      width: sz(300);
      // height: sz(600 - 2);
      border: 1px solid map-get($colors, dropdown-box-border);
      background: map-get($colors, pure-white);

      &-title {
        margin: 0;
        background: map-get($colors, checkbox-disabled-bg);
        height: sz(32);
        text-align: center;
        color: map-get($colors, text-main);
        font-weight: normal;
        line-height: sz(32);
        font-size: inherit;
      }

      // 2.4 版本内只做专病评价板块，以后做其它模块的时候取消注释
      &-general,
      &-dept,
      &-reason {
        cursor: default;
      }

      &-general,
      &-dept,
      &-dis,
      &-reason {
        width: sz(80);
        height: sz(28);
        display: inline-block;
        text-align: center;
        padding-left: sz(20);
        margin-top: sz(10);

        &-article {
          margin-left: sz(10);
          margin-top: sz(5);
          text-decoration: #3789be;
        }

        &-icon {
          display: inline-block;
          width: sz(12);
          height: sz(13);
          margin: sz(5) sz(4) 0 sz(-12);
          position: relative;
          top: sz(2);
        }

        @at-root #{get-bem-root()} &--active {
          position: relative;
          color: map-get($colors, pure-white);
          background: map-get($colors, theme-blue);
        }
      }
    }

    &__section {
      @include border-radius(5px);
      float: right;
      width: sz(870);
      // height: sz(600 - 2);
      border: 1px solid map-get($colors, dropdown-box-border);
      background: map-get($colors, pure-white);
      padding: sz(10) sz(10);
    }
  }
</style>
