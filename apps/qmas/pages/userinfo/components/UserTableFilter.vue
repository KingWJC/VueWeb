<template>
  <div class="user-table-filter">
    <table class="user-table-filter__table">
      <thead class="user-table-filter__table-header">
        <tr>
          <th>登录账号</th>
          <th>用户姓名</th>
          <!-- 角色 -->
          <th>
            <div class="user-table-filter__condition-type">
              <div
                :class="{
                  'user-table-filter__condition-select--disabled': disabled,
                  'user-table-filter__condition-select--active': showType
                }"
                class="user-table-filter__condition-select"
                @click="changeActiveCondition('typeselect')"
              >
                <span :title="allTypeTitle">{{ allTypeTitle }}</span>
              </div>

              <options-dropdown
                :display="showType"
                :optionArr="typeList"
                allName="角色"
                objectCode="ID"
                objectName="ROLE_NAME"
                @cancelSelect="showType = !showType"
                @checkboxAll="typeCheckboxAll"
              ></options-dropdown>
            </div>
          </th>
          <th>注册时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
  import OptionsDropdown from "__shared-libs/components/OptionsDropdown";

  export default {
    name: "user-table-filter",

    components: {
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
        // 类型
        showType: false,
        // 类型可选项
        typeList: []
      };
    },

    computed: {
      // 类型下拉框显示文本
      allTypeTitle() {
        return this.getDropdownTitle("typeselect");
      }
    },

    watch: {
      filterParams: "updateCache"
    },

    mounted() {
      this.updateCache();
    },

    methods: {
      // 获取下拉框标题（需要用逗号分隔，还是显示默认标题）
      getDropdownTitle(type) {
        let originList, defaultTitle, nameField;

        if (type === "typeselect") {
          originList = this.filterParams.roleName;
          defaultTitle = "角色";
          nameField = "ROLE_NAME";
        }
        // 筛选出所有已选择的
        let checkedItems = originList.filter((item) => {
          return item.isChecked;
        });

        // 若筛选条件禁止，直接返回标题
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

      // 选择类型
      typeCheckboxAll(codes) {
        this.showType = false;
        this.$emit("typeChanged", codes);
      },

      // 切换当前激活的选择条件
      changeActiveCondition(conditionName) {
        if (this.disabled) {
          return;
        }

        if (conditionName === "typeselect") {
          this.showType = true;
        }
      },

      // 上游参数变更之后更新本地缓存
      updateCache() {
        this.typeList = this.filterParams.roleName.slice(0);
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .user-table-filter {
    &__condition {
      height: sz(28);
      border-top: 1px solid map-get($app-colors, dropdown-options-border);
      font-size: map-get($font-sizes, base);

      &-type {
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

            top: sz(6);
            right: sz(9);
          }
        }

        &--disabled {
          color: map-get($colors, border-gray);
          background-color: map-get($colors, bg-home);
          cursor: default;

          &::after {
            @include transform(rotate(45deg));

            border-right: 1px solid rgba(map-get($colors, text-light), 0.2);
            border-bottom: 1px solid rgba(map-get($colors, text-light), 0.2);
          }
        }

        > p {
          display: inline-block;
          margin: 0;
          margin-top: sz(4);
          padding-left: sz(5);
        }

        > span {
          @include word-hidden(sz(65));

          display: inline-block;
          padding: sz(5) sz(19) 0 0;
          font-size: sz(13);
        }
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
      @include unify-table-ui();
      width: 100%;
      border-collapse: collapse;

      &-header {
        border-bottom: 1px solid map-get($colors, diauser-cancel-border);
        font-weight: bold;

        tr {
          height: sz(38);
          color: map-get($colors, table-thead-color);

          th {
            @include table-sizes(150, 180, 150, 205, 140, 200);

            text-align: left;
            padding: 0;

            &:nth-child(1) {
              padding-left: sz(30);
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

            .customize-checkbox {
              width: sz(158);
              padding-left: sz(20);
              padding-right: sz(20);
            }
          }
        }
      }
    }
  }
</style>
