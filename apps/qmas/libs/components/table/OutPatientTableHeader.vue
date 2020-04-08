<template>
  <div class="out-patient-table-header">
    <table class="out-patient-table-header__table">
      <thead class="out-patient-table-header__table-header">
        <tr>
          <th>门急诊号</th>
          <th>患者</th>
          <th>性别</th>
          <th>出生日期</th>

          <!--医生-->
          <th>
            <div class="out-patient-table-header__condition-doctor">
              <div
                :class="{
                  'out-patient-table-header__condition-select--disabled':
                    disabled,
                  'out-patient-table-header__condition-select--active':
                    showDoctor
                }"
                class="out-patient-table-header__condition-select"
                @click="changeActiveCondition('doctor')">
                <span :title="allDoctorsTitle">{{ allDoctorsTitle }}</span>
              </div>

              <options-dropdown
                :display="showDoctor"
                :optionArr="doctorsList"
                allName="医生"
                objectCode="DOCTOR_CODE"
                objectName="DOCTOR_NAME"
                @cancelSelect="showDoctor = !showDoctor"
                @checkboxAll="doctorCheckboxAll">
              </options-dropdown>
            </div>
          </th>

          <!--挂号科室-->
          <th>
            <div class="out-patient-table-header__condition-dept">
              <div
                :class="{
                  'out-patient-table-header__condition-select--disabled':
                    disabled,
                  'out-patient-table-header__condition-select--active':
                    showDept
                }"
                class="out-patient-table-header__condition-select"
                @click="changeActiveCondition('dept')">
                <span :title="allDeptsTitle">{{ allDeptsTitle }}</span>
              </div>

              <options-dropdown
                :display="showDept"
                :optionArr="deptsList"
                allName="挂号科室"
                objectCode="DEPT_CODE"
                objectName="DEPT_NAME"
                @cancelSelect="showDept = !showDept"
                @checkboxAll="deptCheckboxAll">
              </options-dropdown>
            </div>
          </th>

          <!-- 挂号时间 -->
          <th>
            <div class="out-patient-table-header__condition-date">
              <div
                :class="{
                  'out-patient-table-header__condition-select--disabled':
                    disabled,
                  'out-patient-table-header__condition-select--active':
                    showCalendar
                }"
                class="out-patient-table-header__condition-select"
                @click="changeActiveCondition('date')">
                <span :title="outDateTitle">{{ outDateTitle }}</span>
              </div>

              <range-calendar
                :display="showCalendar"
                :selectedStartDate="dateRangeStart"
                :selectedEndDate="dateRangeEnd"
                :availableStart="availableDateRangeStart"
                :availableEnd="availableDateRangeEnd"
                @cancelRangeSelect="showCalendar = !showCalendar"
                @dateRangeChanged="changeDateRange">
              </range-calendar>
            </div>
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import RangeCalendar from "__shared-libs/components/datepicker/calendar/RangeCalendar";
  import OptionsDropdown from "__shared-libs/components/OptionsDropdown";

  export default {
    name: "out-patient-table-header",

    components: {
      CustomizeCheckbox,
      RangeCalendar,
      OptionsDropdown
    },

    props: {
      filterParams: {
        type: Object,
        default() {
          return {};
        }
      },

      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        // 当前已选范围
        dateRange: null,
        // 所有可用范围
        availableDateRange: null,

        // 挂号日期
        showCalendar: false,
        dateRangeStart: "--",
        dateRangeEnd: "--",
        availableDateRangeStart: "--",
        availableDateRangeEnd: "--",

        // 医生
        showDoctor: false,
        // 医生可选项
        doctorsList: [],

        // 科室
        showDept: false,
        // 科室可选项
        deptsList: []
      };
    },

    computed: {
      // 挂号时间动态标题（如果可用范围和已选范围一样，直接返回挂号时间，否则显示当前范围
      outDateTitle() {
        let title;

        if (
          this.dateRangeStart === this.availableDateRangeStart &&
          this.dateRangeEnd === this.availableDateRangeEnd ||
          this.disabled
        ) {
          title = "挂号时间";
        } else {
          title = `${this.dateRangeStart} - ${this.dateRangeEnd}`;
        }

        return title;
      },

      // 科室下拉框显示文本
      allDeptsTitle() {
        return this.getDropdownTitle("dept");
      },

      // 医生下拉框显示文本
      allDoctorsTitle() {
        return this.getDropdownTitle("doctor");
      }
    },

    watch: {
      filterParams() {
        this.updateCache();
      }
    },

    mounted() {
      this.updateCache();
    },

    methods: {
      // 获取下拉框标题（需要用逗号分隔，还是显示默认标题）
      getDropdownTitle(type) {
        let originList,
            defaultTitle,
            nameField;

        if (type === "dept") {
          originList = this.filterParams.deptsList;
          defaultTitle = "挂号科室";
          nameField = "DEPT_NAME";
        } else if (type === "doctor") {
          originList = this.filterParams.doctorsList;
          defaultTitle = "医生";
          nameField = "DOCTOR_NAME";
        }

        // 筛选出所有已选择的
        let checkedItems = originList.filter((item) => {
          return item.isChecked;
        });

        // 若筛选条件禁止，直接返回科室 医生 病种等表题
        if (this.disabled) {
          return defaultTitle;
        }

        // 可选项和已选项长度相等
        if (originList.length === checkedItems.length) {
          return defaultTitle;
        }

        let selectedNames = originList.reduce((tmpList, item) => {
          if (item.isChecked) {
            tmpList.push(item[nameField]);
          }

          return tmpList;
        }, []);

        return selectedNames.join("，");
      },

      // 选择科室
      deptCheckboxAll(codes) {
        this.showDept = false;
        this.$emit("deptsChanged", codes);
      },

      // 选择医生
      doctorCheckboxAll(codes) {
        this.showDoctor = false;
        this.$emit("doctorsChanged", codes);
      },

      // 挂号时间范围变更
      changeDateRange(range) {
        this.showCalendar = false;
        this.$emit("dateRangeChanged", range);
      },

      // 切换当前激活的选择条件
      changeActiveCondition(conditionName) {
        if (this.disabled) {
          return;
        }

        if (conditionName === "date") {
          this.showCalendar = true;
        } else if (conditionName === "dept") {
          this.showDept = true;
        } else if (conditionName === "doctor") {
          this.showDoctor = true;
        }
      },

      // 设置本地日期范围
      setLocalDateRange() {
        this.dateRangeStart = this.dateRange[0];
        this.dateRangeEnd = this.dateRange[1];
        this.availableDateRangeStart = this.availableDateRange[0];
        this.availableDateRangeEnd = this.availableDateRange[1];
      },

      // 上游参数变更之后更新本地缓存
      updateCache() {
        this.deptsList = this.filterParams.deptsList.slice(0);
        this.doctorsList = this.filterParams.doctorsList.slice(0);
        // 当前已选范围
        this.dateRange = this.filterParams.dateRange.slice(0);
        // 所有可用范围
        this.availableDateRange = this.filterParams.availableDateRange.slice(0);
        this.setLocalDateRange();
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .out-patient-table-header {
    @include user-select(none);

    &__condition {
      height: sz(28);
      border-top: 1px solid map-get($app-colors, dropdown-options-border);
      font-size: map-get($font-sizes, base);

      &-dept,
      &-date,
      &-doctor {
        float: left;
        width: sz(120);
        height: sz(17);
        margin-top: sz(4);
        position: relative;
        background: map-get($colors, pure-white);
        cursor: pointer;
      }

      &-select {
        background: map-get($colors, pure-white);
        height: sz(28);
        margin-top: sz(-8);

        &::after {
          @include transform(rotate(45deg));

          content: "";
          display: inline-block;
          width: sz(5);
          height: sz(5);
          border-right: 1px solid map-get($colors, text-light);
          border-bottom: 1px solid map-get($colors, text-light);
          position: absolute;
          top: sz(2);
          right: sz(9);
        }

        &--active {
          &::after {
            @include transform(rotate(-135deg));

            content: "";
            display: inline-block;
            width: sz(5);
            height: sz(5);
            border-right: 1px solid map-get($colors, text-light);
            border-bottom: 1px solid map-get($colors, text-light);
            position: absolute;
            top: sz(6);
            right: sz(9);
          }
        }

        &--disabled {
          color: map-get($colors, text-light);
          cursor: default;

          &::after {
            @include transform(rotate(45deg));

            border-right: 1px solid map-get($colors, text-light);
            border-bottom: 1px solid map-get($colors, text-light);
          }
        }

        &-sectionimg,
        &-dateimg {
          display: inline-block;
          width: sz(17);
          height: sz(17);
          margin-left: sz(6);
          margin-right: sz(2);
          background-repeat: no-repeat;
        }

        &-sectionimg {
          background-image: url("~__libs/imgs/cases_section.png");
        }

        &-dateimg {
          background-image: url("~__libs/imgs/cases_date.png");
          vertical-align: middle;
          margin-top: sz(-3);
        }

        > p {
          display: inline-block;
          margin: 0;
          margin-top: sz(4);
          padding-left: sz(5);
        }

        > span {
          @include word-hidden(sz(95));

          display: inline-block;
          padding: sz(5) sz(19) 0 0;
          font-size: sz(13);
        }
      }

      &-date {
        border: none;
      }

      &-option {
        width: sz(180);
        height: sz(300);
        display: none;
      }

      &--active {
        display: block;
      }
    }

    &__table {
      width: 100%;
      border-collapse: collapse;

      &-header {
        border-bottom: 1px solid map-get($colors, dialog-cancel-border);

        tr {
          height: sz(38);
          color: map-get($colors, table-thead-color);

          th {
            @include table-sizes(160, 130, 70, 160, 160, 300);

            text-align: left;
            padding: 0;

            &:nth-child(1) {
              padding-left: sz(20);
            }
          }
        }

        // 重置dropdown，不允许加粗
        .options-dropdown {
          font-weight: normal;

          &__names {
            &-contxt-alls {
              padding: 0;
              width: 100%;
            }

            &-alls {
              padding-left: 0;
            }
          }

          .customize-checkbox {
            width: sz(158);
            padding-left: sz(20);
            padding-right: sz(20);
          }
        }

        .range-calendar {
          margin-top: 1px;
          // 提高日期的层级，否则筛选的上下箭头层级会高于日期空间的层级
          position: absolute;
          // 右对齐，不然会
          right: 0;
          z-index: 1;

          .calendar {
            tr {
              height: auto;
            }

            // 年月左边箭头位置
            &__paginator-btn--prevmon {
              left: sz(-7);
            }
          }
        }
      }
    }
  }
</style>
