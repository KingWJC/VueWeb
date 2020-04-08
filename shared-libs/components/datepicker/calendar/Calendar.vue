<template>
  <div class="calendar">
    <table>
      <thead>
        <tr>
          <th colspan="7">
            <div class="calendar__paginator">
              <a
                :class="{
                  'calendar__paginator-btn--enabled': prevMonthEnabled
                }"
                class="
                  calendar__paginator-btn
                  calendar__paginator-btn--prevmon
                "
                href="javascript:;"
                @click="goPrevMonth">
                <i></i>
              </a>

              <div class="calendar__paginator-title clearfix">
                <div class="calendar__paginator-title-year">
                  <div class="calendar__paginator-title-wrapper">
                    <select-dropdown-v2
                      v-model="selectedYear"
                      :options="yearOptions"
                      :dropDownMaxHeight="184"
                      label="year"
                      trackBy="value"
                      @optionChanged="selectYear">
                    </select-dropdown-v2>
                  </div>
                  <span>年</span>
                </div>

                <div class="calendar__paginator-title-month">
                  <div class="calendar__paginator-title-wrapper">
                    <select-dropdown-v2
                      v-model="selectedMonth"
                      :options="monthOptions"
                      :dropDownMaxHeight="220"
                      label="month"
                      trackBy="value"
                      optionsLogicClassName="
                        calendar-select-dropdown-v2-options
                      "
                      @optionChanged="selectMonth">
                    </select-dropdown-v2>
                  </div>
                  <span>月</span>
                </div>
              </div>

              <a
                :class="{
                  'calendar__paginator-btn--enabled': nextMonthEnabled
                }"
                class="
                  calendar__paginator-btn
                  calendar__paginator-btn--nextmon
                "
                href="javascript:;"
                @click="goNextMonth">
                <i></i>
              </a>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr class="calendar__date-names">
          <td
            v-for="(minDayName, index) in i18n.daysMin"
            :key="index">
            {{ minDayName }}
          </td>
        </tr>

        <tr
          v-for="(row, rindex) in dateRows"
          :key="rindex">
          <td
            v-for="(col, cindex) in row"
            :key="cindex">
            <template v-if="col">
              <span v-if="col.disabled"
                class="calendar__date calendar__date--disabled">
                {{ col.value }}
              </span>
              <span v-else
                :class="{
                  'calendar__date--active': col.active,
                  'calendar__date--selected': col.selected
                }"
                class="calendar__date"
                @click="clickMoment(col.value)">
                {{ col.value }}
              </span>
            </template>
            <template v-else>
              <span class="calendar__date calendar__date--empty"></span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Moment from "moment";

  export default {
    name: "calendar",

    props: {
      dateFormat: {
        type: String,
        default: "YYYY-MM-DD"
      },

      // range start shoulde be equal to or larger than
      availableStart: {
        type: String,
        // no start date is specified, use `--` instead
        default: "--"
      },

      // range start shoulde be equal to or smaller than
      availableEnd: {
        type: String,
        // no start date is specified, use `--` instead
        default: "--"
      },

      // e.g. 2017-11-21
      selectedDate: {
        type: String,
        // no start date is specified, use `--` instead
        default: "--"
      },

      isRange: {
        type: Boolean,
        default: false
      },

      // left or right
      // only works when `isRange` set to `true`
      // left: 2017-11-21 -> --
      // right: -- -> 2017-11-21
      rangeDir: {
        type: String,
        default: "right",
        validator(str) {
          return ["left", "right"].indexOf(str) > -1;
        }
      }
    },

    data() {
      return {
        viewDate: this.selectedDate,

        // use today if no given range start
        i18n: {daysMin: ["日", "一", "二", "三", "四", "五", "六"]},

        selectedYear: {},

        selectedMonth: {}
      };
    },

    computed: {
      yearOptions() {
        let startYear,
            endYear;

        if (this.availableStartMoment) {
          startYear = this.availableStartMoment.year();
        } else {
          startYear = this.viewMoment.year() - 50;
        }

        if (this.availableEndMoment) {
          endYear = this.availableEndMoment.year();
        } else {
          endYear = this.viewMoment.year() + 50;
        }

        let resList = [];

        for (let i = startYear; i <= endYear; i++) {
          resList.push({
            year: i,
            value: i
          });
        }

        return resList;
      },

      monthOptions() {
        let startMonth, endMonth;

        if (this.availableStartMoment) {
          if (this.availableStartMoment.year() < this.selectedYear.value) {
            startMonth = 0;
          } else {
            startMonth = this.availableStartMoment.month();
          }
        } else {
          startMonth = 0;
        }

        if (this.availableEndMoment) {
          if (this.availableEndMoment.year() > this.selectedYear.value) {
            endMonth = 11;
          } else {
            endMonth = this.availableEndMoment.month();
          }
        } else {
          endMonth = 11;
        }

        let resList = [];

        for (let i = startMonth; i <= endMonth; i++) {
          resList.push({
            month: i + 1,
            value: i
          });
        }

        return resList;
      },

      dateRows() {
        let daysInMonth = this.viewMoment.daysInMonth(),
            retRows = [],
            lastIdx = 1;

        // clone a Moment object to find the column for the first day to be
        // rendered in the first row
        let mmtCopy = this.viewMoment.clone();
        mmtCopy.set("date", 1);
        // current day for the month being rendered
        let curDay = mmtCopy.day();

        // there will be only 6 rows used to render each date(1, 2... 31)
        for (let i = 0; i < 6; i++) {
          let curRow = [];

          // for each row, there are at most 7 columns which can be used to
          // render date numbers
          for (let j = 0; j < 7; j++) {
            // while for the first row, we need to find out the column to render
            //  the first day, we'll simply ignore the column if it's not the
            // first date of the month
            if (i === 0 && j < curDay) {
              curRow.push(null);
            } else {
              // render to the last date of the month(28/29/30/31)
              if (lastIdx <= daysInMonth) {
                // if target date is larger than range end, disable the date
                let tmmpCopy = this.viewMoment.clone();
                tmmpCopy.set("date", lastIdx);

                if (
                  this.availableStartMoment &&
                  tmmpCopy < this.availableStartMoment
                ) {
                  curRow.push({
                    value: lastIdx,
                    disabled: true
                  });
                } else if (
                  this.availableEndMoment &&
                  tmmpCopy > this.availableEndMoment
                ) {
                  curRow.push({
                    value: lastIdx,
                    disabled: true
                  });
                } else {
                  let mmtCopy = this.viewMoment.clone();
                  mmtCopy.set("date", lastIdx);

                  curRow.push({
                    value: lastIdx,
                    // is this date larger than the relative moment?
                    active: this.selectedMoment
                      ? (this.isRange
                        ? (this.rangeDir === "right"
                          ? mmtCopy >= this.selectedMoment
                          : mmtCopy <= this.selectedMoment)
                        : mmtCopy.isSame(this.selectedMoment))
                      : false,
                    // is this the selected moment?
                    selected: this.selectedMoment
                      ? mmtCopy.isSame(this.selectedMoment)
                      : false
                  });
                }

                lastIdx++;
                tmmpCopy = null;
              } else {
                curRow.push(null);
              }
            }
          }

          retRows.push(curRow);
        }

        return retRows;
      },

      availableStartMoment() {
        // if end range date is given and current moment is a larger date than
        // it, reset current moment to it.
        if (this.availableStart !== "--") {
          return this.parseDateToMoment(this.availableStart);
        }

        return null;
      },

      availableEndMoment() {
        // if end range date is given and current moment is a larger date than
        // it, reset current moment to it.
        if (this.availableEnd !== "--") {
          return this.parseDateToMoment(this.availableEnd);
        }

        return null;
      },

      selectedMoment() {
        if (this.selectedDate === "--") {
          return null;
        }

        // if start range not given, set current moment to Today
        let mmt = this.parseDateToMoment(this.selectedDate);

        // start date is larger than end date?
        if (
          this.availableStartMoment &&
          this.availableEndMoment &&
          this.availableStartMoment > this.availableEndMoment
        ) {
          throw {
            message: `range start date should be smaller than or equal to
            range end date e.g. using start: 2017-03-01 together with end:
            2017-02-12 is invalid.`
          };
        }

        // is smaller than start date?
        if (this.availableStartMoment && mmt < this.availableStartMoment) {
          mmt = this.availableStartMoment.clone();
        }

        // is larger than end date?
        if (this.availableEndMoment && mmt > this.availableEndMoment) {
          mmt = this.availableEndMoment.clone();
        }

        return mmt;
      },

      // currently rendered view(cached locally)
      viewMoment() {
        // if start range not given, set current moment to Today
        let mmt = this.viewDate !== "--"
          ? this.parseDateToMoment(this.viewDate)
          : Moment();

        // start date is larger than end date?
        if (
          this.availableStartMoment &&
          this.availableEndMoment &&
          this.availableStartMoment > this.availableEndMoment
        ) {
          throw {
            message: `range start date should be smaller than or equal to
            range end date e.g. using start: 2017-03-01 together with end:
            2017-02-12 is invalid.`
          };
        }

        // is smaller than start date?
        if (this.availableStartMoment && mmt < this.availableStartMoment) {
          mmt = this.availableStartMoment.clone();
        }

        // is larger than end date?
        if (this.availableEndMoment && mmt > this.availableEndMoment) {
          mmt = this.availableEndMoment.clone();
        }

        return mmt;
      },

      prevMonthEnabled() {
        if (this.availableStartMoment) {
          let mmtCopy = this.viewMoment.clone();

          mmtCopy.subtract(1, "months");
          mmtCopy.set("date", mmtCopy.daysInMonth());

          // if the last day of last month is equal to or larger than the
          // available start date, then we mark last month as available month
          if (mmtCopy < this.availableStartMoment) {
            return false;
          }
        }

        return true;
      },

      nextMonthEnabled() {
        if (this.availableEndMoment) {
          let mmtCopy = this.viewMoment.clone();

          mmtCopy.add(1, "months");
          mmtCopy.set("date", 1);

          // if the last day of last month is equal to or larger than the
          // available start date, then we mark last month as available month
          if (mmtCopy > this.availableEndMoment) {
            return false;
          }
        }

        return true;
      }
    },

    watch: {
      // 同步上游已选时间，更新当前视图漫游参照时间（漫游参照时间和已选时间可以不同步，
      // 但是 如果上游更新了已选时间，我们就把参照时间也同步成该时间，
      // 这样刚好能够看到已选时间
      selectedDate(value) {
        this.viewDate = value;
      },

      viewMoment(value) {
        this.freshSelectedDate(value);
      }
    },

    mounted() {
      this.freshSelectedDate(this.viewMoment);
    },

    methods: {
      selectYear(obj) {
        let mmtCopy = this.viewMoment.clone();
        mmtCopy.set("year", obj.value);

        this.viewDate = mmtCopy.format(this.dateFormat);
      },

      selectMonth(obj) {
        let mmtCopy = this.viewMoment.clone();
        mmtCopy.set("month", obj.value);

        this.viewDate = mmtCopy.format(this.dateFormat);
      },

      goPrevMonth() {
        let mmtCopy = this.viewMoment.clone();
        mmtCopy.subtract(1, "months");

        this.viewDate = mmtCopy.format(this.dateFormat);
      },

      goNextMonth() {
        let mmtCopy = this.viewMoment.clone();
        mmtCopy.add(1, "months");

        this.viewDate = mmtCopy.format(this.dateFormat);
      },

      clickMoment(date) {
        // click on the same date(same year and same month), return
        if (
          this.selectedMoment &&
          date === this.selectedMoment.date() &&
          this.selectedYear.value === this.selectedMoment.year() &&
          this.selectedMonth.value === this.selectedMoment.month()
        ) {
          return false;
        }

        let mmtCopy = this.viewMoment.clone();
        mmtCopy.set("date", date);

        this.$emit("dateChanged", mmtCopy.format(this.dateFormat));
      },

      parseDateToMoment(dateStr) {
        return dateStr ? Moment(dateStr, this.dateFormat) : Moment();
      },

      // get fresh selectedYear and selectedMonth
      freshSelectedDate(obj) {
        this.selectedYear = {
          year: obj.year(),
          value: obj.year()
        };
        this.selectedMonth = {
          month: obj.month() + 1,
          value: obj.month()
        };
      }
    }
  };
</script>

<style lang="scss">
</style>
