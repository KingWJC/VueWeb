<template>
  <div class="train-manage">
    <template v-if="trainData">
      <template v-if="trainData.length > 0">
        <table class="train-manage__table">
          <thead class="train-manage__table-header">
            <tr>
              <th>课程类型</th>
              <th>课程名称</th>
              <th>资料类型</th>
              <th>操作人</th>
              <th>更新时间</th>
              <th>排序</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>

        <div class="train-manage__tablectn">
          <table class="train-manage__table">
            <tbody class="train-manage__table-body">
              <tr
                v-for="(item, index) in trainData"
                :key="index"
                class="train-manage__table-body-review"
              >
                <td :title="item.MATERIAL_TYPE_NAME">
                  {{ item.MATERIAL_TYPE_NAME }}</td>
                <td :title="item.VIEW_TITLE">
                  {{ item.VIEW_TITLE }}</td>
                <td :title="item.FILE_TYPE_NAME">
                  {{ item.FILE_TYPE_NAME }}</td>
                <td :title="item.CREATE_USER_NAME">
                  {{ item.CREATE_USER_NAME }}</td>
                <td>{{ item.CREATE_TIME }}</td>
                <td>
                  <div
                    :class="{'train-manage__table-body-up':
                               item.COUR_ORDER !== 1,
                             'train-manage__table-body-upFirst' :
                    item.COUR_ORDER === 1}"
                    :style="disCursor"
                    class="train-manage__table-body-order"
                    @mouseover="mouseroverup(item)"
                    @click="setUp(item,index)"
                  ></div>
                  <div
                    :class="{'train-manage__table-body-down':
                               item.COUR_ORDER !== item.ALL_CNT,
                             'train-manage__table-body-downLast' :
                    item.COUR_ORDER === item.ALL_CNT}"
                    :style="disCursor"
                    class="train-manage__table-body-order"
                    @mouseover="mouseroverdown(item)"
                    @click="setDown(item,index)"
                  ></div>
                </td>

                <td>
                  <a href="javascript:;"
                    @click="viewTrainInfo(item)">查看</a>
                  <a href="javascript:;"
                    @click="editTrainInfo(item)">编辑</a>
                  <a href="javascript:;"
                    @click="deleteTrainInfo(item)">删除</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template v-else>
        <qa-no-content title="暂无数据"></qa-no-content>
      </template>
    </template>

    <!--确定删除吗？ -->
    <confirm-dialog
      :display="displayDeletDialog"
      :dialogBody="axiosDeletStatusText"
      dialogHeaderTitle="删除"
      @okClicked="delCustom"
      @closeDialog="displayDeletDialog=false"
    ></confirm-dialog>

    <train-control-dialog
      :controlModel="controlModel"
      :display="showUserControlDialog"
      :editBaseData="editBaseData"
      :dialogFooterOkBtnText="dialogFooterOkBtnText"
      @dialogOkClicked="dialogOkClicked"
      @closeDialog="showUserControlDialog=false"
    ></train-control-dialog>
  </div>
</template>

<script>
  import Vue from "vue";
  import Axios from "axios";
  import TrainControlDialog from "./TrainControlDialog";
  import SwitchBtn from "__shared-libs/components/SwitchBtn";
  import QaNoContent from "__libs/components/QaNoContent";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import EventBus from "__shared-libs/js/vue/eventbus";

  export default {
    name: "train-manage",

    components: {
      TrainControlDialog,
      SwitchBtn,
      QaNoContent
    },

    data() {
      return {
        trainData: null,
        delMaterialId: null,

        // 确定删除对话框吗？
        displayDeletDialog: false,
        axiosDeletStatusText: null,

        // 以何种方式打开用户操作对话框
        controlModel: "",

        // 是否显示 导入/编辑/添加账号 对话框
        showUserControlDialog: false,

        // 编辑模式下 原始渲染对象
        editBaseData: {},

        // 是导入还是添加 还是完成
        dialogFooterOkBtnText: null,

        disCursor: null,
        materData: null
      };
    },

    watch: {},

    mounted() {
      // 接受事件
      EventBus.$on("searchChanged", (evt) => {
        if (evt.name === "searchObj") {
          // else: 获取搜索字段
          this.fetchData(evt.params);
        } else if (evt.name === "add") {
          // else: 添加账号进行的操作
          this.controlModel = "add";
          this.dialogFooterOkBtnText = "添加";
          this.showUserControlDialog = true;
        }
      });

      this.fetchData();
    },

    beforeDestroy() {},

    destroyed() {},

    methods: {
      // 鼠标移入 向上
      mouseroverup: function(obj) {
        if (obj.COUR_ORDER === 1) {
          this.disCursor = "cursor:not-allowed;";
        } else {
          this.disCursor = "";
        }
      },

      // 鼠标移入向下
      mouseroverdown: function(obj) {
        if (obj.COUR_ORDER === obj.ALL_CNT) {
          this.disCursor = "cursor:not-allowed;";
        } else {
          this.disCursor = "";
        }
      },

      // 向上排序
      setUp(obj, index) {
        if (obj.COUR_ORDER === 1) {
          this.$showNotice("同类型已置顶！", "failed");

          return;
        } else {
          // 交换行数据
          let temp1 = this.trainData[index - 1];
          let temp2 = this.trainData[index];

          // 原始顺序码
          let order = temp1.ORDER;
          temp1.ORDER = temp2.ORDER;
          temp2.ORDER = order;

          // 分类顺序码
          let courOrder = temp1.COUR_ORDER;
          temp1.COUR_ORDER = temp2.COUR_ORDER;
          temp2.COUR_ORDER = courOrder;

          Vue.set(this.trainData, index - 1, temp2);
          Vue.set(this.trainData, index, temp1);

          this.changeCourOrder(temp1, temp2);
        }
      },

      // 向下排序
      setDown(obj, index) {
        if (obj.COUR_ORDER === obj.ALL_CNT) {
          this.$showNotice("同类型已置末尾！", "failed");

          return;
        } else {
          // 交换行数据
          let temp1 = this.trainData[index + 1];
          let temp2 = this.trainData[index];

          // 原始顺序码
          let order = temp1.ORDER;
          temp1.ORDER = temp2.ORDER;
          temp2.ORDER = order;

          // 分类顺序码
          let courOrder = temp1.COUR_ORDER;
          temp1.COUR_ORDER = temp2.COUR_ORDER;
          temp2.COUR_ORDER = courOrder;

          Vue.set(this.trainData, index + 1, temp2);
          Vue.set(this.trainData, index, temp1);

          this.changeCourOrder(temp1, temp2);
        }
      },

      // 后台排序
      changeCourOrder(material1, material2) {
        this.materData = [material1, material2];

        Axios.post(resolveApiRoute("train-manage-order"), this.materData).then(
          (res) => {
            if (res.data.Code === 0) {
              this.$showNotice("操作成功");
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      // 更新原始列表
      updateTrainList(trainList) {
        this.trainData = trainList;
      },

      // 导入/编辑/删除账号确定操作
      dialogOkClicked(obj) {
        if (obj !== "view") {
          this.fetchData();
        }
      },

      viewTrainInfo(obj) {
        this.editBaseData = obj;
        this.controlModel = "view";
        this.dialogFooterOkBtnText = "完成";
        this.showUserControlDialog = true;
      },

      // 编辑
      editTrainInfo(obj) {
        this.editBaseData = obj;
        this.controlModel = "edit";
        this.dialogFooterOkBtnText = "完成";
        this.showUserControlDialog = true;
      },

      // 确定删除吗？
      deleteTrainInfo(obj) {
        // 点击取消按钮后数组里会有刚刚选中的那条ID,所以要先清空
        this.delMaterialId = null;
        this.axiosDeletStatusText = `删除材料${obj.VIEW_TITLE}，是否继续？`;
        this.delMaterialId = obj.ID;
        this.displayDeletDialog = true;
      },

      // 删除
      delCustom() {
        Axios.delete(
          resolveApiRoute("train-manage-delete", {
            materialId: this.delMaterialId
          })
        ).then(
          (res) => {
            if (res.data.Code === 0) {
              this.$showNotice("删除成功");

              // 找到已删除的原因
              let index = this.trainData.findIndex((item) => {
                return item.ID === this.delMaterialId;
              });
              // 建立副本，用来删除操作
              let workedList = this.trainData.slice(0);
              // 删掉原来位置的原因
              workedList.splice(index, 1);
              this.updateTrainList(workedList);
            } else if (res.data.Code === 99) {
              // 步骤1：A用户删除用户
              // 步骤2：B用户没有刷新页面，操作已经删除的用户，会报服务器异常
              this.$showNotice("数据变动，请刷新重试!", "failed");
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$showNotice("网络异常", "failed");
          }
        );
      },

      // 培训材料管理列表
      fetchData() {
        this.$showLoading();

        Axios.get(resolveApiRoute("train-manage"), {
          params: {
            TRAIN_ACT_ID: ""
          }
        }).then(
          (res) => {
            this.$hideLoading();

            if (res.data.Code === 0) {
              this.updateTrainList(res.data.Data);
            } else {
              this.$showNotice("服务器异常", "failed");
            }
          },
          () => {
            this.$hideLoading();
            this.$showNotice("网络异常", "failed");
          }
        );
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .train-manage {
    padding: sz(10);
    border: 1px solid map-get($colors, dialog-cancel-border);
    background: map-get($colors, pure-white);

    &__table {
      @include unify-table-ui();

      // 占位符
      &-body {
        &-hidden {
          visibility: hidden;
          display: inline-block;
        }

        &-review {
          .customize-checkbox {
            position: relative;
            top: sz(3);
          }
        }

        &-order {
          float: left;
          display: block;
          width: 20px;
          height: 30px;
          border: none;
          transition: all 0.8s ease;
        }

        &-order:hover {
          -webkit-transform: scale(1.5);
          -moz-transform: scale(1.5);
          -ms-transform: scale(1.5);
          -o-transform: scale(1.5);
          transform: scale(1.5);
        }

        &-up {
          background: url("~__shared-libs/imgs/arrow-up.png") no-repeat center
            center;
          background-size: cover;
        }

        &-upFirst {
          background: url("~__shared-libs/imgs/arrow-up-grey.png") no-repeat
            center center;
          background-size: cover;
        }

        &-down {
          margin-left: sz(5);
          background: url("~__shared-libs/imgs/arrow-down.png") no-repeat center
            center;
          background-size: cover;
        }

        &-downLast {
          margin-left: sz(5);
          background: url("~__shared-libs/imgs/arrow-down-grey.png") no-repeat
            center center;
          background-size: cover;
        }
      }

      b,
      a {
        display: inline-block;
      }

      tr {
        th,
        td {
          @include table-sizes(100, 180, 100, 150, 150, 100, 90);
        }

        th {
          text-align: left;
          padding: 0;

          &:nth-child(1) {
            padding-left: sz(10);
          }
        }

        td {
          &:nth-child(1) {
            padding-left: sz(10);

            div {
              @include word-hidden(sz(100), max-width);
            }
          }

          &:nth-child(2) {
            div {
              @include word-hidden(sz(180), max-width);
            }
          }
        }
      }
    }

    &__tablectn {
      height: calc(100% - 40px);
      overflow: auto;
    }

    .qa-no-content {
      border: 1px solid map-get($colors, dialog-cancel-border);
      background: map-get($colors, pure-white);
      margin-top: sz(10);
    }
  }
</style>
