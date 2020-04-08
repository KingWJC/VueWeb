<template>
  <div class="sub-personal-info">
    <div class="sub-personal-info__left-top">
      <div class="sub-personal-info__left-top-person">个人信息</div>
      <ul class="sub-personal-info__left-top-uls">
        <li :title="$pagePayload.BASIC.Diagnose[0].NAME">
          姓<i>占位</i>名：{{ $pagePayload.BASIC.Diagnose[0].NAME }}
        </li>
        <li :title="$pagePayload.BASIC.Diagnose[0].PATIENT_ID">
          患者编号：{{ $pagePayload.BASIC.Diagnose[0].PATIENT_ID }}
        </li>
        <li>性<i>占位</i>别：{{ patientObj.GENDER_NAME }}</li>
        <li>生<i>占位</i>日：{{ patientObj.BIRTH_DATE }}</li>
        <li>年<i>占位</i>龄：{{ patientObj.AGE }}</li>
        <li>民<i>占位</i>族：{{ patientObj.NATION_NAME }}</li>
        <li>入院时间：{{ patientObj.IN_DATE }}</li>
        <li>出院时间：{{ patientObj.OUT_DATE }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "sub-personal-info",

    computed: {
      patientObj() {
        return this.$pagePayload.BASIC.Diagnose.filter((item) => {
          return item.BASE_FLAG === 1 && item.IN_FLAG === "I";
        })[0];
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .sub-personal-info {
    @include border-radius(sz(4));

    width: sz(178);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);
    border: 1px solid map-get($colors, dialog-cancel-border);
    height: sz(266);

    &__left {
      float: left;
      margin-right: sz(10);

      &-top {
        line-height: sz(28);

        &-person {
          @include border-radius(sz(4) sz(4) 0 0);

          background: map-get($colors, tab-bg);
          color: map-get($colors, text-main);
          height: sz(34);
          line-height: sz(34);
          text-align: center;
          border-bottom: 1px solid map-get($colors, dialog-cancel-border);
        }

        &-uls {
          @extend %normalized-list;

          padding: 0 sz(10);
          font-size: sz(13);

          li {
            @include word-hidden(sz(148));

            border-bottom: 1px solid map-get($colors, dialog-cancel-border);
            padding-left: sz(10);
            color: map-get($colors, dialog-text-color);

            &:last-child {
              border: none;
            }

            i {
              visibility: hidden;
            }
          }
        }
      }
    }
  }
</style>
