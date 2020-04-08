<template>
  <div class="cases-table-light">
    <table class="cases-table-light__table">
      <tbody class="cases-table-light__table-body">
        <tr v-for="(item,index) in cpatList"
          :key="index"
          class="cases-table-light__table-body-review">
          <td
            :title="$pagePayload.PAGE_ID === 'hosppatientkr'
              ? item.PATIENT_NO : item.PATIENT_ID
            ">
            <p class="cases-table-light__table-body-text">
              {{ item.PATIENT_NO }}
            </p>
          </td>
          <td :title="item.PATIENT_NAME">
            <p class="cases-table-light__table-body-text">
              {{ item.PATIENT_NAME }}
            </p>
          </td>
          <td>{{ item.GENDER_NAME }}</td>
          <td>
            <p class="cases-table-light__table-body-text">
              {{ item.BIRTH_DATE }}
            </p>
          </td>
          <td :title="item.DEPT_NAME">
            <p class="cases-table-light__table-body-text">
              {{ item.DEPT_NAME }}
            </p>
          </td>
          <td :title="item.DOCTOR_NAME">
            <p class="cases-table-light__table-body-text">
              {{ item.DOCTOR_NAME }}
            </p>
          </td>
          <td>{{ item.IN_DATE }}</td>
          <td>{{ item.OUT_DATE }}</td>
          <template v-if="hasOperations">
            <td>
              <a :href="getDetailUrl(item)"
                class="cases-table-light__table-body-operation"
                target="_blank">
                查看
              </a>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import resolveMvcRoute from "__libs/js/modules/resolve-mvc-route";

  export default {
    name: "cases-table-light",

    props: {
      cpatList: {
        type: Array,
        default() {
          return [];
        }
      },

      hasOperations: {
        type: Boolean,
        default: false
      }
    },

    methods: {
      // 获取详情页链接
      getDetailUrl(item) {
        return resolveMvcRoute("ungrpatientdetail", {
          PatientNo: item.PATIENT_NO,
          SdTypeCode: this.$pagePayload.PAGE_ID === "hosppatientrel" ? 1 : 2
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .cases-table-light {
    &__table {
      width: 100%;
      border-collapse: collapse;

      &-body {
        &-operation {
          #{get-bem-root()} & {
            color: map-get($colors, theme-blue);
          }
        }

        // 溢出隐藏容器
        &-text {
          margin: 0;
        }

        &-review {
          cursor: pointer;

          &:hover {
            background: map-get($colors, bg-home);
          }

          &--reviewed {
            @at-root #{get-bem-root()} & {
              background: map-get($colors, bg-home);
            }
          }
        }
      }
    }
  }
</style>
