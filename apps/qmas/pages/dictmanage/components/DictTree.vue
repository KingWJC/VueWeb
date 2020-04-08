<!-- 菜单树 -->
<template>
  <div class="menus-tree">
    <el-table ref="bodyData"
      :rowStyle="showRow"
      :data="bodyData"
      v-bind="$attrs">
      <el-table-column
        prop="ITEM_NAME"
        label="项目"
        minWidth="20%">
        <template slot-scope="scope">
          <span :class="['level'+scope.row.LEVEL]">
            <i v-if="scope.row.CHILDREN"
              :class="[scope.row.open?
              'fa fa-chevron-down':'fa fa-chevron-right']"
              @click="openToggle(scope.row)"></i>
          </span>
          {{ scope.row.ITEM_NAME }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ORDER_NO"
        label="排序"
        minWidth="10%">
        <template slot-scope="scope">
          <i
            v-if="scope.row.IS_TYPE === 2"
            :class="{
              'el-table__body-sortup--updisable':
                bodyData[scope.$index - 1].CHILDREN !== undefined
            }"
            class="el-table__body-sortup"
            @click.stop="sortUp(scope.$index, scope.row)"
          ></i>
          <i
            v-if="scope.row.IS_TYPE === 2"
            :class="{
              'el-table__body-sortdown--downdisable':
                bodyData[scope.$index + 1].CHILDREN !== undefined
            }"
            class="el-table__body-sortdown"
            @click.stop="sortDown(scope.$index, scope.row)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="IS_VALID"
        label="是否启用"
        minWidth="10%">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.IS_VALID !== undefined"
            v-model="scope.row.IS_VALID"
            :activeValue="1"
            :inactiveValue="0"
            @change="changeValid(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="UPD_USER"
        label="操作人"
        minWidth="8%">
        <template slot-scope="scope">
          {{ scope.row.UPD_USER }}
        </template>
      </el-table-column>
      <el-table-column
        prop="UPD_TIME"
        label="更新时间"
        minWidth="15%">
        <template slot-scope="scope">
          {{ scope.row.UPD_TIME }}
        </template>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作"
        minWidth="15%">
        <template slot-scope="scope">
          <!-- 判断下面是否有子菜单，有子菜单不能是有删除按钮 -->
          <el-button
            v-if="scope.row.IS_TYPE === 1"
            type="text"
            size="small"
            @click="addDictValue(scope.row)">新增</el-button>
          <el-button
            v-else
            type="text"
            size="small"
            @click="editDictValue(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Vue from "vue";
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "dict-tree",

    props: {
      bodyData: {
        type: Array,
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        // 菜单表格结构数据
        // bodyData: []
      };
    },
    mounted() {
      //  this.bodyData = this.bodyData;
    },
    // 初始化函数，赋值，bodyData =>bodyData
    created() {
      // this.bodyData = this.bodyData;
    },
    methods: {
      showRow: function(row) {
        const show = row.row.parent
          ? row.row.parent._expanded && row.row.parent._show
          : true;
        row.row._show = show;

        return show
          ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
          : "display:none;";
      },

      // 树节点开关操作
      openToggle: function(item) {
        // 这里只是展开和关闭样式的变换方法
        Vue.set(item, "open", !item.open);
        // 展开的时候，显示子节点，关闭的时候隐藏子节点
        // 遍历所有的子节点，加入到menuTable中
        let parentIndex = 0;

        for (let i = 0; i < this.bodyData.length; i++) {
          // 找到父节点的id，然后依次把子节点放到数组里面父节点后面
          if (this.bodyData[i].ITEM_ID === item.ITEM_ID) {
            parentIndex = i;
            break;
          }
        }

        if (item.open) {
          // open => close
          let bodyData = this.bodyData;
          item.CHILDREN.forEach(function(child, index) {
            // 添加子节点
            bodyData.splice(parentIndex + index + 1, 0, child);
          });
        } else {
          // 删除子节点
          this.bodyData.splice(parentIndex + 1, item.CHILDREN.length);
        }
      },
      addDictValue(item) {
        this.$emit("dictAdd", item);
      },
      editDictValue(item) {
        let itemType = {};

        for (let i = 0; i < this.bodyData.length; i++) {
          // 找到父节点的id，然后依次把子节点放到数组里面父节点后面
          if (this.bodyData[i].CHILDREN !== undefined) {
            for (let j = 0; j < this.bodyData[i].CHILDREN.length; j++) {
              if (this.bodyData[i].CHILDREN[j].ITEM_ID === item.ITEM_ID) {
                itemType = this.bodyData[i];
                break;
              }
            }
          }
        }
        this.$emit("dictEdit", {
          itemType: itemType,
          itemValue: item
        });
      },
      // 字典停启用
      changeValid(val) {
        Axios.post(resolveApiRoute("dict-set-valid"), val).then(
          (res) => {
            if (res.data.Code !== 0) {
              val.IS_VALID = val.IS_VALID === 0 ? 1 : 0;
              this.$showNotice("设置失败", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      // 下移按钮
      sortDown(index) {
        // 下一个是否为类型
        if (this.bodyData[index + 1].CHILDREN !== undefined) {
          return;
        }
        let i = this.bodyData[index + 1];
        this.setDictOrder(this.bodyData[index], i, index, false);
      },
      // 上移按钮
      sortUp(index) {
        // 上一个是否为类型
        if (this.bodyData[index - 1].CHILDREN !== undefined) {
          return;
        }
        let temp = this.bodyData[index - 1];
        this.setDictOrder(this.bodyData[index], temp, index, true);
      },
      setDictOrder(dict1, dict2, index, isUp) {
        let dictCode1 = dict1.ITEM_CODE;
        dict1.ITEM_CODE = dict2.ITEM_CODE;
        dict2.ITEM_CODE = dictCode1;
        let dictList = [];
        dictList.push(dict1);
        dictList.push(dict2);
        Axios.post(resolveApiRoute("dict-set-order"), dictList).then(
          (res) => {
            if (res.data.Code === 0) {
              if (isUp) {
                Vue.set(this.bodyData, index - 1, dict1);
                Vue.set(this.bodyData, index, dict2);
              } else {
                Vue.set(this.bodyData, index + 1, dict1);
                Vue.set(this.bodyData, index, dict2);
              }
            } else {
              this.$showNotice("设置失败", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      }
    }
  };
</script>

<style scoped>
  .level1,
  .level2,
  .level3 {
    display: inline-block;
    width: 20px;
  }

  .level1 {
    margin-left: 5px;
  }

  .level2 {
    margin-left: 20px;
  }

  .level3 {
    margin-left: 35px;
  }
</style>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .menus-tree {
    height: 100%;
  }

  .el-table {
    width: 100%;
    border-collapse: collapse;
    height: 100%;

    &__header {
      border-bottom: 1px solid map-get($colors, dialog-cancel-border);
      font-weight: bold;

      tr {
        height: sz(38);
        color: map-get($colors, table-thead-color);

        th {
          text-align: left;
          padding: 0;

          &:nth-child(1) {
            padding-left: sz(20);
          }
        }
      }
    }

    &__body {
      &-wrapper {
        height: calc(100% - 40px);
        overflow-y: auto;
        overflow-x: hidden;
      }

      &-sortup {
        background: url("~__libs/imgs/arrow-up.png");
        display: inline-block;
        background-size: sz(25) sz(25);
        width: sz(25);
        height: sz(25);

        &--updisable {
          background: url("~__libs/imgs/arrow-up-grey.png");
          background-size: sz(25) sz(25);
        }
      }

      &-sortdown {
        background: url("~__libs/imgs/arrow-down.png");
        display: inline-block;
        background-size: sz(25) sz(25);
        width: sz(25);
        height: sz(25);

        &--downdisable {
          background: url("~__libs/imgs/arrow-down-grey.png");
          background-size: sz(25) sz(25);
        }
      }
    }
  }

  .fa {
    position: relative;
    top: sz(-3);
    left: sz(4);

    display: inline-block;
    height: sz(5);
    width: sz(5);
    border-right: 1px solid map-get($colors, theme-blue);
    border-top: 1px solid map-get($colors, theme-blue);

    @at-root {
      .fa-chevron-down {
        @include transform(rotate(-45deg));
      }

      .fa-chevron-right {
        @include transform(rotate(45deg));
      }
    }
  }

  .el-switch__core:after {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    border-radius: 100%;
    transition: all 0.3s;
    width: 16px;
    height: 16px;
    background-color: #fff;
  }

  .el-switch.is-checked .el-switch__core:after {
    left: 100%;
    margin-left: -17px;
  }
</style>
