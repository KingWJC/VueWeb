<template>
  <div class="essential">
    {{ patientObj.OUT_DEPT_NAME }} | {{ patientObj.SD_NAME }} |
    {{ patNoName }}：{{ patientObj.PATIENT_NO }}

    <!-- 只有住院信息有出院时间 -->
    <template v-if="patientObj.IN_DEPT_DATE &&
    patientObj.OUT_DEPT_DATE">
      | {{ patientObj.IN_DEPT_DATE }}~{{ patientObj.OUT_DEPT_DATE }}
    </template>
  </div>
</template>

<script>
  export default {
    name: "essential",

    props: {
      patientObj: {
        type: Object,
        default() {
          return {};
        }
      }
    },

    data() {
      return {};
    },

    computed: {
      patNoName() {
        return this.patientObj.IN_FLAG === "I" ? "住院流水号" : "门急诊号";
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .essential {
    height: sz(16);
    line-height: sz(16);
    color: map-get($colors, essential-header);
    font-weight: bold;
  }
</style>
