<template>
  <div class="sub-diagnosis-msg">
    <h3 class="sub-diagnosis-msg__maintitle">相关诊疗信息</h3>
    <ul v-for="(item, index) in cases"
      :key="index"
      class="sub-diagnosis-msg__mainbody">
      <template v-if="item.msgData.length !== 0">
        <li>
          <!--急诊信息-->
          <h4
            :class="{
              'sub-diagnosis-msg__mainbody-tabbody-items--active':
                activeType === item.IN_FLAG,
              'sub-diagnosis-msg__mainbody-tabbody-items--prohibit':
                !item.msgData[0]
            }"
            class="sub-diagnosis-msg__mainbody-tabtitle
            sub-diagnosis-msg__mainbody-tabbody-items"
            @click="changeType(item)">

            <i
              :class="{
                'sub-diagnosis-msg__mainbody-tabtitle-graydot--active':
                  activeType === item.IN_FLAG && item.msgData.length !== 0
              }"
              class="sub-diagnosis-msg__mainbody-tabtitle-graydot">
            </i>
            {{ item.msgName }} ({{ item.msgData.length }})
          </h4>

          <ul
            :class="{
              'sub-diagnosis-msg__mainbody-tablist--active':
                activeType === item.IN_FLAG
            }"
            :style="{
              'max-height': `${maxHeight}px`
            }"
            class="sub-diagnosis-msg__mainbody-tablist">
            <li v-for="(subItem, index) in item.msgData"
              :key="index"
              :class="{
                'sub-diagnosis-msg__mainbody-tablist-item--active':
                  activePno === subItem.PATIENT_NO
              }"
              :title="item.IN_FLAG === 'I'
                ? `${subItem.IN_DATE}~${subItem.OUT_DATE}` : ''
              "
              class="sub-diagnosis-msg__mainbody-tablist-item"
              @click="changePatientNo(subItem)">
              <template v-if="item.IN_FLAG === 'I'">
                {{ subItem.IN_DATE }}~{{ subItem.OUT_DATE }}
              </template>
              <template v-else>
                {{ subItem.OUT_DATE }}
              </template>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "sub-diagnosis-msg",

    data() {
      return {
        activeTabName: null,
        // 当前激活的门急诊、住院类别
        activeType: "I",
        // 当前激活的住院号
        activePno: null,
        dataSource: this.$pagePayload.BASIC,
        departmentMsg: [],
        emergencyMsg: [],
        hospitalizedMsg: [],
        patientObj: {},
        cases: []
      };
    },

    computed: {
      maxHeight() {
        let oL = this.departmentMsg.length > 0 ? 1 : 0,
            iL = this.hospitalizedMsg.length > 0 ? 1 : 0,
            eL = this.emergencyMsg.length > 0 ? 1 : 0,
            length = oL + iL + eL;

        // 308: 相关诊疗信息面板除去面板 header 区的高度（用于做内容高度自适应）
        // 28: 急诊/门诊/住院 每一行的高度
        return 308 - 28 * length;
      }
    },

    mounted() {
      this.getMsgCount();
      this.patientObj = this.filterCurrentPatient();
      this.changePatientNo(this.patientObj);
    },

    methods: {
      // 修改门急诊及住院类型
      changeType(obj) {
        if (obj.IN_FLAG === this.activeType) {
          this.activeType = null;
        } else {
          this.activeType = obj.IN_FLAG;
        }
      },

      changePatientNo(obj) {
        // 判断是 mounted 时调用  还是点击时候调用
        let patNo = obj.msgData
          ? (obj.msgData[0] ? obj.msgData[0].PATIENT_NO : null)
          : obj.PATIENT_NO;

        if (patNo) {
          this.$emit("changePatientNo", patNo);
          this.activePno = patNo;
        }
      },

      // 筛选是数据
      getMsgCount() {
        this.dataSource.Diagnose.forEach((item) => {
          if (item.IN_FLAG === "O") {
            this.departmentMsg.push(item);
          } else if (item.IN_FLAG === "E") {
            this.emergencyMsg.push(item);
          } else if (item.IN_FLAG === "I") {
            this.hospitalizedMsg.push(item);
          }
        });

        this.cases = [
          {
            msgName: "门诊信息",
            IN_FLAG: "O",
            msgData: this.departmentMsg
          },
          {
            msgName: "急诊信息",
            IN_FLAG: "E",
            msgData: this.emergencyMsg
          },
          {
            msgName: "住院信息",
            IN_FLAG: "I",
            msgData: this.hospitalizedMsg
          }
        ];
      },

      filterCurrentPatient() {
        return this.$pagePayload.BASIC.Diagnose.filter((item) => {
          return item.BASE_FLAG === 1 && item.IN_FLAG === "I";
        })[0];
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .sub-diagnosis-msg {
    @include border-radius(sz(4));

    width: sz(178);
    margin-top: sz(10);
    line-height: sz(28);
    background: map-get($colors, pure-white);
    border: 1px solid map-get($colors, dialog-cancel-border);
    height: sz(343);

    ul {
      @extend %normalized-list;
      width: 100%;
    }

    &__maintitle {
      @extend %normalized-list;
      @include border-radius(sz(4) sz(4) 0 0);

      margin: 0;
      font-size: map-get($font-sizes, base);
      font-weight: normal;
      border-bottom: 1px solid map-get($colors, dialog-cancel-border);
      text-align: center;
      background: map-get($colors, tab-bg);
      color: map-get($colors, text-main);
      height: sz(34);
      line-height: sz(34);
    }

    &__mainbody {
      cursor: pointer;
      font-size: sz(13);

      &-tabtitle {
        margin: 0;
        position: relative;
        font-weight: normal;

        &-graydot {
          @include transform(rotate(45deg));

          position: relative;
          top: sz(-1);
          left: sz(-5);

          display: inline-block;
          height: sz(5);
          width: sz(5);
          border-top: 1px solid map-get($colors, dialog-text-color);
          border-right: 1px solid map-get($colors, dialog-text-color);
          margin-right: sz(-2);

          &--active {
            @include transform(rotate(135deg));

            position: relative;
            top: sz(-3);
            left: sz(-3);
          }
        }
      }

      &-tablist {
        overflow-y: auto;
        display: none;

        &--active {
          display: block;
        }

        &-item {
          @include word-hidden(sz(160));

          text-indent: sz(17);
          background: map-get($colors, pure-white);

          &--active {
            color: map-get($colors, theme-blue);
          }
        }
      }

      &-tabbody {
        display: none;
        box-sizing: border-box;

        &-items {
          @extend %overflow-hidden-word;

          border-bottom: 1px solid map-get($colors, dialog-cancel-border);
          text-indent: sz(10);
          border-bottom: none;
          color: map-get($colors, dialog-text-color);

          &:last-child {
            border-bottom: none;
          }

          &--active {
            background: map-get($colors, bg-home);
            color: map-get($colors, dialog-text-color);
          }

          &--prohibit {
            @at-root #{get-bem-root()} & {
              color: map-get($colors, placeholder-text-color);
              cursor: default;
            }
          }
        }
      }
    }
  }
</style>
