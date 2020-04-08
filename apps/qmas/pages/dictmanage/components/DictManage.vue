<template>
  <div class="dict-manage">

    <div class="dict-manage__tablecontent">
      <template v-if="bodyData">
        <div class="dict-manage__tablecontent-body">
          <!-- <dict-table-body
            :bodyData="bodyData"
            @dictAdd="addDictValue"
            @dictEdit="editDictValue"
          ></dict-table-body> -->
          <dict-tree
            :bodyData="bodyData"
            @dictAdd="addDictValue"
            @dictEdit="editDictValue"
          ></dict-tree>
        </div>
      </template>
      <template v-else>
        <qa-no-content title="暂无字典数据"></qa-no-content>
      </template>
    </div>

    <!-- 新增 编辑 -->
    <dict-dialog
      :display="showDictDialog"
      :dictBaseData="dictBaseData"
      :isAdd="isAdd"
      @fetchData="fetchData"
      @refreshTree="fetchTree"
      @closeDialog="showDictDialog=false"
    ></dict-dialog>

  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  // import QaNoContent from "__libs/components/QaNoContent";
  import EventBus from "__shared-libs/js/vue/eventbus";
  import Vue from "vue";

  // import DictTableFilter from "./DictTableFilter";
  // import DictTableBody from "./DictTableBody";
  import DictDialog from "./DictDialog";
  import DictTree from "./DictTree";



  export default {
    name: "dict-manage",

    components: {
      // DictTableFilter,
      // DictTableBody,
      DictDialog,
      DictTree
    },

    data() {
      return {
        // 字典列表
        bodyData: [],
        // 已选择的搜索参数
        selectedParams: null,
        // 无返回数据筛选条件置灰禁用
        filterDisable: false,
        // 筛选模式下筛选器可用选项
        filterParams: {
          roleName: []
        },
        // 是否展示编辑对话框
        showDictDialog: false,
        dictBaseData: {},
        // 是否编辑
        isAdd: true
      };
    },

    mounted() {
      this.fetchData(["search", false, null]);
      // 搜索事件
      EventBus.$on("searchChanged", (evt) => {
        // 获取搜索字典
        this.selectedParams = evt;
        this.fetchData(["search", false, null]);
      });
    },

    methods: {
      // 获取Api 参数
      getApiPara() {
        let combined = {
          dictName: "",
          isValid: -1
        };

        if (this.selectedParams) {
          // 搜索内容
          if (this.selectedParams.SearchText) {
            Object.assign(combined, {
              dictName: this.selectedParams.SearchText
            });
          }

          // 是否启用
          if (this.selectedParams.IsValid) {
            Object.assign(combined, {
              isValid: this.selectedParams.IsValid
            });
          }
        }

        return combined;
      },
      // 字典列表
      fetchData(obj) {
        let type = obj[0];
        let isFreshTree = obj[1];
        let selectNode = obj[2];
        this.$showLoading();
        Axios.get(resolveApiRoute("dict-info"),
                  {params: this.getApiPara()}).then(
                    (res) => {
                      this.$hideLoading();
                      let filterDisable = false;

                      if (res.data.Code === 0) {
                        if (res.data.Data.length > 0) {
                          this.bodyData = res.data.Data;

                          if (isFreshTree) {
                            this.fetchTree(selectNode);
                          }
                        } else {
                          this.bodyData = [];

                          if (type === "search") {
                            filterDisable = true;
                          }
                        }
                        this.filterDisable = filterDisable;
                      } else {
                        this.$showNotice("加载异常", "failed");
                      }
                    },
                    () => {
                      this.$hideLoading();
                      this.$showNotice("网络异常", "failed");
                    }
        );
      },
      // 新增字典值
      addDictValue(item) {
        this.dictBaseData = Object.assign(
          {},
          {
            DICT_TYPE_ID: item.ITEM_ID,
            DICT_TYPE: item.ITEM_NAME,
            DICT_VALUE: "",
            VALUE_ID: "",
            IS_VAILD: 1
          }
        );
        this.isAdd = true;
        this.showDictDialog = true;
      },
      // 编辑字典值
      editDictValue(obj) {
        this.dictBaseData = Object.assign(
          {},
          {
            DICT_TYPE_ID: obj.itemType.ITEM_ID,
            DICT_TYPE: obj.itemType.ITEM_NAME,
            DICT_VALUE: obj.itemValue.ITEM_NAME,
            VALUE_ID: obj.itemValue.ITEM_ID,
            IS_VAILD: obj.itemValue.IS_VALID
          }
        );
        this.isAdd = false;
        this.showDictDialog = true;
      },

      // 刷新字典树列表
      fetchTree(newDictInfo) {
        let parentIndex = 0;

        for (let i = 0; i < this.bodyData.length; i++) {
          // 找到父节点的id，然后依次把子节点放到数组里面父节点后面
          if (this.bodyData[i].ITEM_ID === newDictInfo.TYPE_ID) {
            parentIndex = i;
            break;
          }
        }

        Vue.set(this.bodyData[parentIndex],
                "open", !this.bodyData[parentIndex].open);


        let bodyData = this.bodyData;
        this.bodyData[parentIndex].CHILDREN.forEach(function(child, index) {
          // 添加子节点
          bodyData.splice(parentIndex + index + 1, 0, child);
        });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .dict-manage {
    @include border-radius(5px);
    @include custom-container(sz(22));

    margin: sz(10) auto sz(20);
    // 导航50  面包屑 35  margin 30 filter 50 filter-margin 10 padding 20
    // border 2
    height: calc(100% - 200px);
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__tablecontent {
      // log-filter 39px
      height: 100%;

      &-body {
        // paginator 28px margin 10px
        height: 100%;
        overflow: hidden;
      }

      .paginator {
        margin: sz(10) 0 0 0;
      }
    }

    .qa-no-content {
      border: 1px solid map-get($colors, dialog-cancel-border);
      background: map-get($colors, pure-white);
      margin-top: sz(10);
    }
  }
</style>
