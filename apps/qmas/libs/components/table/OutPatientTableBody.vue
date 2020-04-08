<template>
  <table class="out-patient-table-body">
    <tbody class="out-patient-table-body__body">
      <tr v-for="(item, index) in cpatList"
        :key="index">
        <td :title="item.PATIENT_NO">
          <p class="out-patient-table-body__body-text">
            {{ item.PATIENT_NO }}
          </p>
        </td>
        <td :title="item.PATIENT_NAME">
          <p class="out-patient-table-body__body-text">
            {{ item.PATIENT_NAME }}
          </p>
        </td>
        <td>{{ item.GENDER_NAME }}</td>
        <td>
          <p class="out-patient-table-body__body-text">
            {{ item.BIRTH_DATE }}
          </p>
        </td>
        <td :title="item.DOCTOR_NAME">
          <p class="out-patient-table-body__body-text">
            {{ item.DOCTOR_NAME }}
          </p>
        </td>
        <td :title="item.DEPT_NAME">
          <p class="out-patient-table-body__body-text">
            {{ item.DEPT_NAME }}
          </p>
        </td>
        <td>{{ item.OUT_DATE }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    name: "out-patient-table-body",

    props: {
      cpatList: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .out-patient-table-body {
    @include unify-table-ui();

    &__body {
      tr {
        border-bottom: 1px solid map-get($colors, dialog-cancel-border);
        color: map-get($colors, text-light);

        td {
          @include table-sizes(160, 130, 70, 160, 160, 300);

          height: sz(38);
          text-align: left;
          padding: 0;

          &:nth-child(1) {
            padding-left: sz(20);

            #{get-bem-root()}__body-text {
              @include word-hidden(sz(155));

              display: inline-block;
              vertical-align: middle;
            }
          }

          &:nth-child(2) {
            #{get-bem-root()}__body-text {
              @include word-hidden(sz(125));
            }
          }

          &:nth-child(3) {
            #{get-bem-root()}__body-text {
              @include word-hidden(sz(68));
            }
          }

          &:nth-child(4) {
            #{get-bem-root()}__body-text {
              @include word-hidden(sz(155));
            }
          }

          &:nth-child(5) {
            #{get-bem-root()}__body-text {
              @include word-hidden(sz(155));
            }
          }

          &:nth-child(6) {
            #{get-bem-root()}__body-text {
              @include word-hidden(sz(295));

              display: inline-block;
              vertical-align: middle;
            }
          }
        }
      }

      // 溢出隐藏容器
      &-text {
        margin: 0;

        &--active {
          color: map-get($colors, echart-blue);
        }
      }
    }
  }
</style>
