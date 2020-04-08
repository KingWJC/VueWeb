<template>
  <div class="department-casecade clearfix">
    <!-- 全部科室 -->
    <div class="department-casecade__primary">
      <select-dropdown-v2
        v-model="selectedDeptObj"
        :options="deptOptions"
        label="DEPT_NAME"
        trackBy="DEPT_CODE"
        @optionChanged="deptChanged">
      </select-dropdown-v2>
    </div>

    <!-- 全部诊疗组 -->
    <div class="department-casecade__subs">
      <select-dropdown-v2
        v-model="selectedGroupObj"
        :disabled="groupOptions.length <= 1"
        :options="groupOptions"
        label="GROUP_NAME"
        trackBy="GROUP_ID"
        @optionChanged="groupChanged">
      </select-dropdown-v2>
    </div>

    <a class="department-casecade__btn"
      href="javascript:;"
      @click="resetSelected">重置</a>
  </div>
</template>

<script>

  export default {
    name: "department-casecade",

    props: {
      // 可选科室列表
      dept: {
        type: Array,
        default() {
          return [];
        }
      },

      // 可选诊疗组列表
      groups: {
        type: Array,
        default() {
          return [];
        }
      },

      // 已选科室code
      // 为 null 表示 “全部”
      deptCode: {
        type: String,
        default: null
      },

      // 已选诊疗组id
      // 为 null 表示 “全部”
      groupId: {
        type: Number,
        default: null
      }
    },

    data() {
      // 构造虚拟 “全部科室”
      let deptOptions = this.dept.slice(0);
      let deptAll = this.getAllDeptOption();

      // 构造虚拟 “全部诊疗组”
      let groupOptions = this.filterGroup(deptAll);
      let groupAll = this.getAllGroupOption();

      deptOptions.unshift(deptAll);
      groupOptions.unshift(groupAll);

      return {
        // 选中的当前科室
        selectedDeptObj: deptAll,
        deptOptions,

        // 选中的当前诊疗组项
        selectedGroupObj: groupAll,
        groupOptions
      };
    },

    watch: {
      deptCode: "setNewDeptData",
      groupId: "setNewGroupData",
      dept() {
        let temp = this.dept.slice(0);
        temp.unshift(this.getAllDeptOption());
        this.deptOptions = temp;
      }
    },

    mounted() {
      // 初始渲染时候通知父亲渲染的诊疗组（全部）
      this.groupChanged(this.getAllGroupOption());
    },

    methods: {
      // 生成“全部科室”选项
      getAllDeptOption() {
        return {
          DEPT_CODE: null,
          DEPT_NAME: "全部科室"
        };
      },

      // 生成“全部诊疗组”选项
      getAllGroupOption() {
        return {
          GROUP_ID: null,
          GROUP_NAME: "全部诊疗组"
        };
      },

      // 接收从父亲传过来Echars点击事件的科室code 级联选择器变更
      setNewDeptData() {
        // 传过来科室code有null => 是全部科室
        if (this.deptCode === null) {
          this.selectedDeptObj = this.getAllDeptOption();
        } else {
          this.selectedDeptObj = this.dept.find((item) => {
            return item.DEPT_CODE === this.deptCode;
          });
        }

        this.setNewGroupData();
      },

      // 接收从父亲传过来Echars点击事件的诊疗组id 级联选择器变更
      setNewGroupData() {
        // 传过来诊疗组id有null => 是全部诊疗组
        if (this.groupId === null) {
          this.selectedGroupObj = this.getAllGroupOption();
        } else {
          this.selectedGroupObj = this.groups.find((item) => {
            return item.GROUP_ID === this.groupId;
          });
        }

        this.resetGroupOptions();
      },

      // 根据已选科室筛选对应诊疗组
      filterGroup(deptObj) {
        return this.groups.filter((item) => {
          return item.DEPT_CODE === deptObj.DEPT_CODE;
        });
      },

      // 重置诊疗组可选项（科室切换之后）
      resetGroupOptions() {
        let options = this.filterGroup(this.selectedDeptObj);
        let groupAll = this.getAllGroupOption();

        options.unshift(groupAll);
        this.groupOptions = options;
      },

      // 科室发生改变
      deptChanged() {
        // 科室改变, 疗组赋变回 “全部”
        this.groupChanged(this.getAllGroupOption());
      },

      // 重置 变成全部科室和全部诊疗组
      resetSelected() {
        let allDept = this.getAllDeptOption(),
            allGroup = this.getAllGroupOption();

        this.notifyChanges(
          allDept.DEPT_CODE,
          allDept.DEPT_NAME,
          allGroup.GROUP_ID,
          allGroup.GROUP_NAME
        );
      },

      // 发送改变到父级
      notifyChanges(deptCode, deptName, groupId, groupName) {
        this.$emit("codeObjData", {
          deptCode,
          deptName,
          groupId,
          groupName
        });
      },

      // 诊疗组发生改变
      groupChanged(groupObj) {
        let deptObj = this.selectedDeptObj;

        if (!deptObj) {
          deptObj = this.getAllDeptOption();
        }

        this.notifyChanges(
          deptObj.DEPT_CODE,
          deptObj.DEPT_NAME,
          groupObj.GROUP_ID,
          groupObj.GROUP_NAME
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .department-casecade {
    width: sz(350);

    &__btn {
      @include border-radius(5px);

      float: left;
      width: sz(40);
      height: sz(28);
      line-height: sz(28);
      text-align: center;

      #{get-bem-root()} & {
        color: map-get($colors, theme-blue);
      }
    }

    &__primary {
      height: sz(28);
      float: left;
      margin-right: sz(10);

      .select-dropdown-v2 {
        @include blue-select-dropdown(sz(140));
      }
    }

    &__subs {
      height: sz(28);
      float: left;
      margin-right: sz(10);

      .select-dropdown-v2 {
        @include blue-select-dropdown(sz(140));

        &--disabled {
          .select-dropdown-v2 {
            &__selected {
              background: map-get($colors, tab-bg);

              &-plain {
                @include border-radius(5px);

                border: 1px solid map-get($colors, dialog-cancel-border);
                height: sz(26);
                color: map-get($colors, text-disabled-color);
              }
            }

            &__triangle {
              border-color: map-get($colors, border-gray);
            }
          }
        }
      }
    }
  }
</style>
