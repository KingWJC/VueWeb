<template>
  <teleporter>
    <div :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName
      ]"
      class="dialog">
      <div class="dialog__header clearfix">
        <h3>
          <span v-if="conditionView !== ''"
            class="report-range-dialog__child-view-title">
            按{{ condTypeMap[conditionView] }}
          </span>
          {{ dialogHeaderTitle }}
        </h3>
      </div>

      <div
        :class="{'report-range-dialog__main-dialog-body': conditionView === ''}"
        class="dialog__body">
        <template v-if="conditionView === ''">
          <ul class="report-range-dialog__condition-list">
            <li v-for="(type, index) in conditionList"
              :key="index"
              :title="'按' + condTypeMap[type]"
              @click="changeCondition(type)">
              &gt;&nbsp;&nbsp;按{{ condTypeMap[type] }}
            </li>
          </ul>
        </template>
        <template v-else-if="conditionView === 'dept'">
          <div class="report-range-dialog__tags clearfix">
            <label class="report-range-dialog__tags-label
              report-range-dialog__tags-label--single">
              科<i>占位</i>室：
            </label>
            <div class="report-range-dialog__tags-dropdown
              report-range-dialog__tags-dropdown--dept">
              <template v-if="availMainDepts.length === 0">
                <div class="report-range-dialog__tags-dropdown-tips
                  report-range-dialog__tags-dropdown-tips--single">
                  暂无数据
                </div>
              </template>
              <template v-else>
                <multi-filter-item
                  v-model="cachedDepts"
                  :originalList="availMainDepts"
                  label="DEPT_NAME"
                  trackBy="DEPT_CODE">
                </multi-filter-item>
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="conditionView === 'group'">
          <div class="report-range-dialog__tags clearfix">
            <label class="report-range-dialog__tags-label">
              科<i>占位</i>室：
            </label>
            <div class="report-range-dialog__tags-dropdown">
              <select-dropdown-v2
                v-model="cachedSubDeptMain"
                :dropDownMaxHeight="180"
                :options="availMainDepts"
                label="DEPT_NAME"
                trackBy="DEPT_CODE"
                @optionChanged="changeMainDept">
              </select-dropdown-v2>
            </div>
          </div>

          <div class="report-range-dialog__tags clearfix">
            <label class="report-range-dialog__tags-label
              report-range-dialog__tags-label--multiple">
              诊<i>2</i>疗<i>2</i>组：
            </label>
            <div class="report-range-dialog__tags-dropdown
              report-range-dialog__tags-dropdown--group">
              <template v-if="availGroups.length === 0">
                <div class="report-range-dialog__tags-dropdown-tips
                  report-range-dialog__tags-dropdown-tips--multiple">
                  {{ cachedSubDeptMain ? '暂无数据' : '请选择科室' }}
                </div>
              </template>
              <template v-else>
                <multi-filter-item
                  v-model="cachedGroups"
                  :originalList="availGroups"
                  label="GROUP_NAME"
                  trackBy="GROUP_ID">
                </multi-filter-item>
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="conditionView === 'doctor'">
          <div class="report-range-dialog__tags clearfix">
            <label class="report-range-dialog__tags-label
              report-range-dialog__tags-label--single">
              医<i>占位</i>生：
            </label>
            <div class="report-range-dialog__tags-dropdown
              report-range-dialog__tags-dropdown--doctor">
              <template v-if="availDoctors.length === 0">
                <div class="report-range-dialog__tags-dropdown-tips
                  report-range-dialog__tags-dropdown-tips--single">
                  暂无数据
                </div>
              </template>
              <template v-else>
                <multi-filter-item
                  v-model="cachedDocters"
                  :originalList="availDoctors"
                  label="DOCTOR_NAME"
                  trackBy="DOCTOR_CODE">
                </multi-filter-item>
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="conditionView === 'disease'">
          <div class="report-range-dialog__tags clearfix">
            <label class="report-range-dialog__tags-label
              report-range-dialog__tags-label--single">
              病<i>占位</i>种：
            </label>
            <div class="report-range-dialog__tags-dropdown
              report-range-dialog__tags-dropdown--disease">
              <template v-if="rawConditions.SD.length === 0">
                <div class="report-range-dialog__tags-dropdown-tips
                  report-range-dialog__tags-dropdown-tips--single">
                  暂无数据
                </div>
              </template>
              <template v-else>
                <multi-filter-item
                  v-model="cachedDiseases"
                  :originalList="rawConditions.SD"
                  label="SD_NAME"
                  trackBy="SD_ID">
                </multi-filter-item>
              </template>
            </div>
          </div>
        </template>
        <template v-else-if="conditionView === 'index'">
          <div class="report-range-dialog__tags clearfix">
            <label class="report-range-dialog__tags-label">病种分类：</label>
            <div class="report-range-dialog__tags-dropdown">
              <select-dropdown-v2
                v-model="cachedDiseaseCat"
                :searchable="false"
                :dropDownMaxHeight="180"
                :options="rawConditions.SD"
                label="SD_NAME"
                trackBy="SD_ID"
                @optionChanged="changeDiseaseCat">
              </select-dropdown-v2>
            </div>
          </div>

          <div class="report-range-dialog__tags clearfix">
            <label class="report-range-dialog__tags-label
              report-range-dialog__tags-label--multiple">
              指<i>占位</i>标：
            </label>
            <div class="report-range-dialog__tags-dropdown
              report-range-dialog__tags-dropdown--index">
              <template v-if="availIndices.length === 0">
                <div class="report-range-dialog__tags-dropdown-tips
                  report-range-dialog__tags-dropdown-tips--multiple">
                  {{ cachedDiseaseCat ? '暂无数据' : '请选择病种' }}
                </div>
              </template>
              <template v-else>
                <multi-filter-item
                  v-model="cachedIndices"
                  :originalList="availIndices"
                  label="KPI_NAME"
                  trackBy="KPI_ID">
                </multi-filter-item>
              </template>
            </div>
          </div>
        </template>
      </div>

      <div class="dialog__footer">
        <template v-if="conditionView === ''">
          <a href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="cancelBtnClick">
            {{ dialogFooterCancelBtnText }}
          </a>
        </template>
        <template v-else>
          <a href="javascript:;"
            class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
            @click="cancelBtnClick">
            {{ dialogFooterCancelBtnText }}
          </a>

          <a
            :class="{'btn--disabled': cachedSelectNone}"
            class="btn dialog__footer-btn dialog__footer-btn-ok"
            href="javascript:;"
            @click="okBtnClick">
            {{ dialogFooterOkBtnText }}
          </a>
        </template>
      </div>
    </div>
  </teleporter>
</template>

<script>
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import MultiFilterItem from "__libs/components/MultiFilterItem";

  export default {
    name: "report-range-dialog",

    components: {
      MultiFilterItem
    },

    mixins: [BasicDialog],

    props: {
      logicClassName: {
        type: String,
        default: "report-range-dialog"
      },

      dialogHeaderTitle: {
        type: String,
        default: null
      },

      // 主条件列表 ['dept', 'subDept'...]
      conditionList: {
        type: Array,
        default() {
          return [];
        }
      },

      // // 当前页面已选择的条件集合(仅用于在取消时重置选择状态用!)
      selectedConditions: {
        type: Object,
        default() {
          return {};
        }
      },

      // 后端返回的条件列表(见mock-session)
      rawConditions: {
        type: Object,
        default() {
          return {};
        }
      },

      // 主条件名称映射
      condTypeMap: {
        type: Object,
        default() {
          return {};
        }
      },

      // 子视图，不传则展示主视图
      // 科室：dept
      // 二级科室：group
      // 医生：doctor
      // 病种：disease
      // 指标: index
      conditionView: {
        type: String,
        default: ""
      },
      clearType: {
        type: String,
        default: ""
      }
    },

    data() {
      return {
        // 一级科室
        cachedDepts: [],
        // 病种
        cachedDiseases: [],

        // 二级科室 - 父科室
        cachedSubDeptMain: null,
        // 二级科室 - 二级科室
        cachedGroups: [],
        // 医生 - 医生
        cachedDocters: [],

        // 指标 - 病种分类
        cachedDiseaseCat: null,
        // 指标 - 指标分类
        cachedIndexCat: null,
        // 指标 - 指标
        cachedIndices: []
      };
    },

    computed: {
      // 判断确认按钮是否可以点击(至少选择一个)
      cachedSelectNone() {
        let selectedNope = false;

        if (this.conditionView === "dept") {
          selectedNope = this.cachedDepts.length === 0;
        } else if (this.conditionView === "group") {
          selectedNope = this.cachedGroups.length === 0;
        } else if (this.conditionView === "doctor") {
          selectedNope = this.cachedDocters.length === 0;
        } else if (this.conditionView === "disease") {
          selectedNope = this.cachedDiseases.length === 0;
        } else {
          selectedNope = this.cachedIndices.length === 0;
        }

        return selectedNope;
      },

      // 选出可用所有一级科室
      availMainDepts() {
        let depts = [];
        let maps = {};
        this.rawConditions.DEPT.forEach((item) => {
          if (maps[item.DEPT_CODE]) {
            maps[item.DEPT_CODE].sdIds[item.SD_ID] = 1;
            maps[item.DEPT_CODE].sdCodes[item.SD_CODE] = 1;

            return;
          }

          // map 里面不存在科室,新建
          maps[item.DEPT_CODE] = {
            sdIds: {},
            sdCodes: {},
            dept: item
          };
          maps[item.DEPT_CODE].sdIds[item.SD_ID] = 1;
          maps[item.DEPT_CODE].sdCodes[item.SD_CODE] = 1;
        });

        for (let key in maps) {
          let eachDept = {};
          let sdIdArr = Object.keys(maps[key].sdIds);
          let sdCodeArr = Object.keys(maps[key].sdCodes);

          eachDept = Object.assign({}, maps[key].dept, {
            SD_CODE: sdCodeArr,
            SD_ID: sdIdArr
          });
          depts.push(eachDept);
        }

        return depts;
      },

      // 指标视图，选出可用指标分类
      availIndexCats() {
        if (this.cachedDiseaseCat) {
          return this.rawConditions.KPI_TYPE.filter((item) => {
            return item.SD_ID === this.cachedDiseaseCat.SD_ID;
          });
        }

        return [];
      },

      // 指标视图，选出可用指标
      availIndices() {
        if (this.cachedDiseaseCat) {
          return this.rawConditions.KPI.filter((item) => {
            return item.SD_ID === this.cachedDiseaseCat.SD_ID;
          });
        }

        return [];
      },

      // 诊疗组视图
      availGroups() {
        if (this.cachedSubDeptMain) {
          return this.rawConditions.GROUP.filter((item) => {
            return item.DEPT_CODE === this.cachedSubDeptMain.DEPT_CODE;
          });
        }

        return [];
      },

      // 医生视图，可用医生--拼接对应医生的科室和诊疗组
      availDoctors() {
        // 修改医生数据的返回结构
        let newDoctor = [];
        let maps = {};

        this.rawConditions.DOCTOR.forEach((item) => {
          if (maps[item.DOCTOR_CODE]) {
            maps[item.DOCTOR_CODE].deptCodes[item.DEPT_CODE] = 1;

            return;
          }
          maps[item.DOCTOR_CODE] = {
            doctor: item,
            deptCodes: {}
          };
          maps[item.DOCTOR_CODE].deptCodes[item.DEPT_CODE] = 1;
        });

        for (let key in maps) {
          let newDeptCode = Object.keys(maps[key].deptCodes);
          let eachDoctor = Object.assign(
            {},
            maps[key].doctor,
            {
              DEPT_CODE: newDeptCode
            }
          );
          newDoctor.push(eachDoctor);
        }

        let ret = [];

        newDoctor.forEach((eachDoc) => {
          let addDeptName = [];

          eachDoc.DEPT_CODE.forEach((eachDeptCode) => {
            this.availMainDepts.forEach((eachDept) => {
              if (eachDept.DEPT_CODE === eachDeptCode) {
                addDeptName.push(eachDept.DEPT_NAME);
              }
            });
          });

          addDeptName = addDeptName.join("，");

          let newDoc = {};

          if (addDeptName !== "" ) {
            newDoc = Object.assign(
              {},
              eachDoc,
              {
                DOCTOR_NAME: `${eachDoc.DOCTOR_NAME} (${addDeptName})`
              }
            );
          } else {
            newDoc = Object.assign({}, eachDoc);
          }

          let addGroupName = [];

          this.rawConditions.GROUP.forEach((eachGroup) => {
            let isGroup = eachGroup.DOCTOR.filter((code) => {
              return code === eachDoc.DOCTOR_CODE;
            });

            if (isGroup.length > 0) {
              addGroupName.push(eachGroup.GROUP_NAME);
            }
          });
          addGroupName = addGroupName.join("，");

          if (addGroupName !== "") {
            newDoc = Object.assign(
              {},
              newDoc,
              {
                DOCTOR_NAME: `${newDoc.DOCTOR_NAME} (${addGroupName})`
              }
            );
          } else {
            newDoc = Object.assign({}, newDoc);
          }
          ret.push(newDoc);
        });

        return ret;
      }
    },

    watch: {
      clearType(newV) {
        this.clearCachedData(newV);
      }
    },

    methods: {
      // 在父组件执行清空某一项的操作时执行这个函数:清空已经保存在v-model缓冲中的数据
      // @param {Boolean} reset 是否重置为props里面的数据(在点击取消的时候需要重置为页面上已经选择的项目)
      clearCachedData(type, reset) {
        if (type === "") {
          return;
        } else if (type === "dept") {
          // 页面已经有了值, 且要还原为缓存值
          if (reset && this.selectedConditions.dept) {
            this.cachedDepts = this.selectedConditions.dept.slice(0);
          } else {
            this.cachedDepts = [];
          }
        } else if (type === "group") {
          // 页面已经有了值, 且要还原为缓存值
          if (reset && this.selectedConditions.group) {
            this.cachedGroups = this.selectedConditions.group.slice(0);
          } else {
            this.cachedSubDeptMain = null;
            this.cachedGroups = [];
          }
        } else if (type === "doctor") {
          if (reset && this.selectedConditions.doctor) {
            this.cachedDocters = this.selectedConditions.doctor.slice(0);
          } else {
            this.cachedDocters = [];
          }
        } else if (type === "disease") {
          if (reset && this.selectedConditions.disease) {
            this.cachedDiseases = this.selectedConditions.disease.slice(0);
          } else {
            this.cachedDiseases = [];
          }
        } else if (type === "index") {
          if (reset && this.selectedConditions.index) {
            this.cachedIndices = this.selectedConditions.index.slice(0);
          } else {
            this.cachedDiseaseCat = null;
            this.cachedIndices = [];
          }
        }
      },
      // 选择二级科室的时候，修改了一级科室，则已选择的二级置空
      changeMainDept() {
        this.cachedGroups = [];
      },

      // 指标视图，修改病例类别，指标分类置空, 已选指标置空
      changeDiseaseCat() {
        this.cachedIndices = [];
      },

      // 指标视图，修改指标类别，已选择指标置空
      changeIndexCat() {
        this.cachedIndices = [];
      },

      // 医生视图，修改一级科室，已选二级科室置空，医生置空
      changeDoctDept() {
        this.cachedDocters = [];
      },

      // 医生视图，修改二级科室，已选医生置空
      changeDoctSubDept() {
        this.cachedDocters = [];
      },

      okBtnClick() {
        // 如果未选择任何的子项, 那么点击确定按钮无效
        if (this.cachedSelectNone) {
          return;
        }

        if (this.conditionView === "dept") {
          this.$emit("okClicked", {dept: this.cachedDepts});
        } else if (this.conditionView === "disease") {
          this.$emit("okClicked", {disease: this.cachedDiseases});
        } else if (this.conditionView === "doctor") {
          this.$emit("okClicked", {doctor: this.cachedDocters});
        } else if (this.conditionView === "group") {
          if (this.cachedGroups.length === 0) {
            this.cachedSubDeptMain = [];
          }
          this.$emit("okClicked", {group: this.cachedGroups});
        } else if (this.conditionView === "index") {
          this.cachedIndices.map((item) => {
            item.disease = Object.assign({}, this.cachedDiseaseCat);

            return item;
          });

          if (this.cachedIndices.length === 0) {
            this.cachedDiseaseCat = [];
          }
          this.$emit("okClicked", {index: this.cachedIndices});
        }

        this.close();
      },

      cancelBtnClick() {
        // 清除已选中值, 重置为props 下发的值, true 表示重置
        this.clearCachedData(this.conditionView, true);
        this.$emit("cancelClicked");
        this.close();
      },

      changeCondition(view) {
        // 先清除之前缓存，无论有没有
        this.clearCachedData(view);
        this.$emit("changeCondition", view);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .report-range-dialog {
    @include dialog-css(sz(580), sz(436));

    .dialog__header {
      h3 {
        position: relative;

        #{get-bem-root()}__child-view-title {
          position: absolute;
          left: sz(20);
          font-size: map-get($font-sizes, xs);
        }
      }
    }

    // body，在主视图时没有padding
    .dialog__body {
      padding: sz(20);
      // 主视图的时候，没有左右padding
      &#{get-bem-root()}__main-dialog-body {
        padding: 0 0 sz(40);
      }

      .multi-filter-item__list {
        .customize-checkbox__label {
          max-width: sz(414);
        }
      }
    }

    .dialog__footer {
      &-btn {
        // 此处不能用默认的cancel右边距, 当第一层弹窗只有一个关闭时 会导致不按钮不居中
        &-cancel {
          margin-right: 0;
        }

        &-ok {
          margin-left: sz(16);
        }
      }
    }

    .select-dropdown-v2 {
      width: sz(465);
      min-height: sz(34);

      &__selected {
        width: sz(463);
        min-height: sz(32);
        border-color: map-get($colors, dialog-input-border);

        &-plain,
        &-placeholder {
          height: sz(32);
          line-height: sz(32);
          text-align: left;
          font-size: map-get($font-sizes, xs);
        }

        &-tag {
          font-size: map-get($font-sizes, xs);

          &--action {
            color: map-get($colors, placeholder-text-color);
          }
        }
      }
    }

    .select-dropdown-v2-options {
      &__items-item-text {
        font-size: map-get($font-sizes, xs);
      }
    }

    // 主视图，条件ul
    &__condition-list {
      @extend %normalized-list;

      li {
        text-align: left;
        border-bottom: 1px solid map-get($colors, dialog-cancel-border);
        padding: sz(9) sz(20);
        cursor: pointer;
      }
    }

    &__tags {
      margin-top: sz(10);

      &:first-child {
        margin-top: 0;
      }

      &-label {
        float: left;
        width: sz(72);
        line-height: sz(37);
        text-align: right;

        &--single {
          line-height: sz(67);
        }

        &--multiple {
          line-height: sz(90);
        }

        i {
          visibility: hidden;
        }
      }

      &-dropdown {
        width: sz(465);
        float: left;

        &-tips {
          @include border-radius(4px);

          height: sz(32);
          line-height: sz(32);
          border: 1px solid map-get($colors, dropdown-box-border);
          padding-left: sz(10);
          text-align: left;
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, placeholder-text-color);
          background: map-get($colors, dialog-input-disabled-bg);

          &--multiple {
            margin-top: sz(29);
          }

          &--single {
            margin-top: sz(16);
          }
        }

        // 调整最大tags区高度
        &--index,
        &--group {
          .select-dropdown-v2 {
            &__selected {
              max-height: sz(240);
            }
          }

          .multi-filter-item__list {
            max-height: sz(360);
          }
        }

        &--doctor,
        &--disease,
        &--dept {
          .multi-filter-item {
            margin-top: sz(-10);
          }
          .select-dropdown-v2 {
            &__selected {
              max-height: sz(300);
            }
          }
        }
      }
    }
  }
</style>
