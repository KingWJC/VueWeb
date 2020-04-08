<template>
  <div class="certificate-view">
    <template v-if="certificateData">
      <div id="pdfDom"
        class="certificate-view__con">
        <div class="certificate-view__con-top">
          {{ certificateData.ORG_NAME }}
        </div>
        <div class="certificate-view__con-medium">
          <span>贵机构已于 {{ formatDate(certificateData.FINISH_TIME) }} 完成认证线上培训，
          可进行正式认证申请，以兹证明。</span>
        </div>
        <div class="certificate-view__con-bottom">
          中国重症联盟
        </div>
      </div>
      <div class="certificate-view__con__download">
        <a class="btn btn--solid btn--blue"
          href="javascript:;"
          @click="downloadCer">下载证书</a>
      </div>
    </template>
    <template v-else>
      <div class="certificate-view-nocontent">
        <div class="certificate-view-nocontent__top">
          <div class="certificate-view-nocontent__top-img">
          </div>
          <div class="certificate-view-nocontent__top-bottom">
            <div class="certificate-view-nocontent__top-bottom-img"></div>
            <span>您还没有获得培训证书</span>
          </div>
        </div>
        <div class="certificate-view-nocontent__bottom">
          <a class="btn btn--solid btn--blue"
            href="javascript:;"
            @click="trainCourse">去培训</a>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  export default {
    name: "certificate-view",

    props: {

    },

    data() {
      return {
        // 是否正在加载数据
        isShowLoading: true,

        // 课程是否全部结束
        isCourseOver: false,

        // 证书信息
        certificateData: null,

        htmlTitle: "myCer"
      };
    },

    computed: {

    },

    mounted() {
      this.InitVerify();
    },

    methods: {
      // 获取数据方法
      InitVerify() {
        this.$showLoading();

        Axios.get(
          resolveApiRoute("cer-view-verify")
        ).then(
          (res) => {
            this.$hideLoading();
            this.isShowLoading = false;

            if (res.data.Code === 0 && res.data.Data !== null) {
              this.certificateData = res.data.Data;
            } else {
              this.$showNotice(res.data.Msg, "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.isShowLoading = false;
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      trainCourse() {
        window.location.href = "/TrainCourse";
      },

      downloadCer() {
        window.scrollTo(0, 0);
        this.getPdf(this.htmlTitle);
      },

      formatDate: function(date) {
        if (date !== null) {
          var curDate = new Date(date);
          var Y = curDate.getFullYear() + "年";
          var M = (curDate.getMonth() + 1 < 10 ? "0" +
          (curDate.getMonth() + 1) : curDate.getMonth() + 1) + "月";
          var D = curDate.getDate() + "日";

          return Y + M + D;
        } else {
          return "";
        }
      }

    }
  };
</script>
<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .certificate-view {
    @include border-radius(4px);
    @include custom-container(sz(22));

    &__con {
      display: block;
      width: sz(600);
      height: sz(220);
      margin: sz(30) auto;
      padding: sz(80) sz(50);
      border: 1px solid rgb(204, 204, 204);
      border-radius: sz(5);
      background-color: map-get($colors, pure-white);
      background: url("~__shared-libs/imgs/cerbak.jpg") no-repeat center center;
      background-size: 100% 100%;

      &-top {
        font-size: large;
      }

      &-medium {
        font-size: larger;
        margin-top: sz(60);
        margin-left: sz(90);
      }

      &-bottom {
        font-size: large;
        margin-top: sz(90);
        text-align: right;
      }

      &__download {
        width: sz(700);
        margin: sz(20) auto;
        text-align: right;
      }
    }

    &-nocontent {
      width: sz(200);
      margin: sz(10) auto;
      text-align: center;
      height: 100%;
      vertical-align: middle;
      margin-top: sz(90);

      &__top {
        &-img {
          width: sz(200);
          height: sz(200);
          background: url("~__shared-libs/imgs/file.png") no-repeat center
            center;
        }

        &-bottom {
          &-img {
            vertical-align: middle;
            width: sz(15);
            height: sz(15);
            display: inline-block;
            background: url("~__shared-libs/imgs/exclamation.png") no-repeat
              center center;
            background-size: sz(15) sz(15);
          }
        }
      }

      &__bottom {
        margin-top: sz(20);
      }
    }
  }
</style>
