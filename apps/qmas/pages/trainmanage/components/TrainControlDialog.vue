<template>
  <teleporter>
    <div
      :style="dialogStyles"
      :class="[
        {'hide': !display},
        logicClassName
      ]"
      class="dialog"
    >
      <div class="dialog__header clearfix">
        <h3 class="train-control-dialog__header-text">
          <template v-if="controlModel === 'add'">添加课程</template>
          <template v-else-if="controlModel === 'edit'">编辑课程</template>
          <template v-else-if="controlModel === 'view'">查看课程</template>
        </h3>

        <a
          :title="dialogFooterCancelBtnText"
          href="javascript:;"
          class="dialog__closebtn"
          @click="headerCloseBtnClick"
        ></a>
      </div>

      <div class="dialog__body">
        <template v-if="controlModel === 'add'">
          <div class="train-control-dialog__body-userloginname clearfix">
            <span class="train-control-dialog__body-userloginname-span">
              课程类型</span>
            <select
              v-model="materialType"
              class="train-control-dialog__body-userloginname-editinput"
            >
              <option
                v-for="(item,index) in selectMaterialType"
                :key="index"
                :value="item.ID"
              >{{ item.DICT_VAL_NAME }}</option>
            </select>
            <b class="train-control-dialog__body-userloginname-mustwrite">*</b>
          </div>
          <div class="train-control-dialog__body-addnamewarning">
            <span>{{ warnMaterialType }}</span>
          </div>

          <div class="train-control-dialog__body-username clearfix"
            style="height:70px">
            <span class="train-control-dialog__body-username-span">课程名称</span>
            <textarea
              v-model="viewTitle"
              style="height:70px"
              class="train-control-dialog__body-username-editinput"
              type="text"
              placeholder="请输入"
              maxlength="50"
            ></textarea>
            <b class="train-control-dialog__body-username-mustwrite">*</b>
          </div>
          <div class="train-control-dialog__body-addnamewarning">
            <span>{{ warnViewTitle }}</span>
          </div>

          <div class="train-control-dialog__body-userloginname clearfix">
            <span class="train-control-dialog__body-userloginname-span">
              资料类型</span>
            <select v-model="fileType"
              class="train-control-dialog__body-userloginname-editinput">
              <option
                v-for="(item,index) in selectFileType"
                :key="index"
                :value="item.ID"
              >{{ item.DICT_VAL_NAME }}</option>
            </select>
            <b class="train-control-dialog__body-userloginname-mustwrite">*</b>
          </div>
          <div class="train-control-dialog__body-addnamewarning">
            <span>{{ warnFileType }}</span>
          </div>

          <div class="train-control-dialog__body-username clearfix">
            <span class="train-control-dialog__body-username-span">资料</span>
            <input
              v-model="materialPath"
              :disabled="controlModel === 'view'"
              style="background:#3789be;color:white"
              class="train-control-dialog__body-username-editinput"
              type="button"
              @click="upload"
            />
            <b class="train-control-dialog__body-username-mustwrite">*</b>
          </div>
          <div class="train-control-dialog__body-addnamewarning">
            <span>{{ warnMaterialPath }}</span>
          </div>
        </template>
        <template v-else>
          <div class="train-control-dialog__body-userloginname clearfix">
            <span class="train-control-dialog__body-userloginname-span">
              课程类型</span>
            <select
              v-model="materialType"
              :disabled="controlModel === 'view'"
              class="train-control-dialog__body-userloginname-editinput"
            >
              <option
                v-for="(item,index) in selectMaterialType"
                :key="index"
                :value="item.ID"
              >{{ item.DICT_VAL_NAME }}</option>
            </select>
            <b class="train-control-dialog__body-userloginname-mustwrite">*</b>
          </div>
          <div class="train-control-dialog__body-addnamewarning">
            <span>{{ warnMaterialType }}</span>
          </div>

          <div class="train-control-dialog__body-username clearfix"
            style="height:70px">
            <span class="train-control-dialog__body-username-span">课程名称</span>
            <textarea
              v-model="viewTitle"
              :disabled="controlModel === 'view'"
              style="height:70px"
              class="train-control-dialog__body-username-editinput"
              type="text"
              placeholder="请输入"
              maxlength="50"
            ></textarea>
            <b class="train-control-dialog__body-username-mustwrite">*</b>
          </div>
          <div class="train-control-dialog__body-addnamewarning">
            <span>{{ warnViewTitle }}</span>
          </div>

          <div class="train-control-dialog__body-userloginname clearfix">
            <span class="train-control-dialog__body-userloginname-span">
              资料类型</span>
            <select
              v-model="fileType"
              :disabled="controlModel === 'view'"
              class="train-control-dialog__body-userloginname-editinput"
            >
              <option
                v-for="(item,index) in selectFileType"
                :key="index"
                :value="item.ID"
              >{{ item.DICT_VAL_NAME }}</option>
            </select>
            <b class="train-control-dialog__body-userloginname-mustwrite">*</b>
          </div>
          <div class="train-control-dialog__body-addnamewarning">
            <span>{{ warnFileType }}</span>
          </div>

          <div class="train-control-dialog__body-username clearfix">
            <span class="train-control-dialog__body-username-span">资料</span>
            <input
              v-if="controlModel === 'view'"
              v-model="materialPath"
              :disabled="controlModel === 'view'"
              class="train-control-dialog__body-username-editinput"
              type="button"
              @click="upload"
            />
            <input
              v-else
              v-model="materialPath"
              :disabled="controlModel === 'view'"
              style="background:#3789be;color:white"
              class="train-control-dialog__body-username-editinput"
              type="button"
              @click="upload"
            />
            <b class="train-control-dialog__body-username-mustwrite">*</b>
          </div>
          <div class="train-control-dialog__body-addnamewarning">
            <span>{{ warnMaterialPath }}</span>
          </div>

        </template>
      </div>

      <div class="train-control-dialog__notice">
        <span>视频资料支持.mp4格式文件，文件类型支持PDF文件</span>
      </div>

      <div class="dialog__footer">
        <a
          href="javascript:;"
          class="btn btn--white dialog__footer-btn dialog__footer-btn-cancel"
          @click="cancelBtnClicked"
        >{{ dialogFooterCancelBtnText }}</a>

        <a
          href="javascript:;"
          class="btn dialog__footer-btn dialog__footer-btn-ok"
          @click="okBtnClicked"
        >{{ dialogFooterOkBtnText }}</a>
      </div>

      <global-uploader v-if="reFresh"
        ref="upload"
        :attrdata="attrdata"
        @fileSuccess="fileSuccess"></global-uploader>

    </div>
  </teleporter>
</template>

<script>
  import Axios from "axios";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import GlobalUploader from "__libs/components/GlobalUploader";

  export default {
    name: "train-control-dialog",

    components: {
      GlobalUploader
    },

    mixins: [BasicDialog],

    props: {
      // logicClassName
      logicClassName: {
        type: String,
        default: "train-control-dialog"
      },

      // controlModel include edit import add
      controlModel: {
        type: String,
        default: "import"
      },

      // 如果是编辑模式,默认需要渲染的数据
      editBaseData: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        // 相对于窗口的margin-top值
        marginTop: 70,

        // 定义一个变量,用来保存提交时的用户信息(可能修改之后的用户信息)
        newTrainInfo: {},
        fileID: "",

        selectFileType: [
          { ID: "1",
            DICT_VAL_NAME: "视频" },
          { ID: "2",
            DICT_VAL_NAME: "文件" }
            // { ID: "3",
            //   DICT_VAL_NAME: "文本" }
        ],
        selectMaterialType: [
          { ID: "1",
            DICT_VAL_NAME: "基础课" },
          { ID: "2",
            DICT_VAL_NAME: "进阶课" }
        ],
        // 绑定字段
        materialType: "",
        viewTitle: "",
        fileType: "1",
        materialPath: ">>点击上传文件",

        // 非法提示
        warnMaterialType: "",
        warnViewTitle: "",
        warnFileType: "",
        warnMaterialPath: "",
        attrdata: [".mp4"],
        reFresh: true
      };
    },

    watch: {
      materialType(val) {
        if (val != "") {
          this.warnMaterialType = "";
        }
      },
      viewTitle(val) {
        if (val != "") {
          this.warnViewTitle = "";
        }
      },
      fileType(val) {
        if (val != "") {
          this.warnFileType = "";
        }

        if (val == "1") {
          this.attrdata = [".mp4"];
        } else if (val == "2") {
          this.attrdata = [".pdf"];
        }
        this.reFresh = false;
        this.$nextTick(() => {
          this.reFresh = true;
        });
      },
      materialPath(val) {
        if (val != ">>点击上传文件" && val != "") {
          this.warnMaterialPath = "";
        }
      }
    },

    methods: {
      upload() {
        if (this.fileType == "") {
          this.warnFileType = "请选择资料类型";
        } else {
          this.$refs.upload.openUploader({
            fileID: this.fileID,
            targetFolder: "trainfile"
          });
        }
      },
      fileSuccess(res) {
        this.fileID = res.id;
        this.materialPath = res.name;
      },
      // 编辑 初始化对话框
      initDialog() {
        if (this.controlModel === "edit" || this.controlModel === "view") {
          (this.materialType = this.editBaseData.MATERIAL_TYPE),
          (this.viewTitle = this.editBaseData.VIEW_TITLE),
          (this.fileType = this.editBaseData.FILE_TYPE),
          (this.materialPath = this.editBaseData.MATERIAL_NAME == "" ||
            this.editBaseData.MATERIAL_NAME == null
            ? ">>点击上传文件" : this.editBaseData.MATERIAL_NAME),
          (this.fileID = this.editBaseData.FILE_ID);
        }
      },

      // 获取下拉框数据
      // getSelevtLevel() {
      //   Axios.get(resolveApiRoute("train-manage-select")).then(
      //     (res) => {
      //       if (res.data.Code === 0) {
      //         // this.$showNotice("成功");
      //         this.selectMaterialType = res.data.Data.MaterialType;
      //         this.selectFileType = res.data.Data.FileType;
      //       } else {
      //         this.$showNotice("服务器异常", "failed");
      //       }
      //     },
      //     () => {
      //       this.$showNotice("网络异常", "failed");
      //     }
      //   );
      // },

      // remove the instance
      close() {
        if (this.allowClosing) {
          this.clearCachedData();
          this.$emit("closeDialog");
        }
      },

      // 每次关闭对话框的时候修需要将缓冲的数据清楚,以免影响下一次的操作
      clearCachedData() {
        this.materialId = "";
        this.trainActId = "";
        this.materialType = "";
        this.viewTitle = "";
        this.fileType = "";
        this.materialPath = ">>点击上传文件";
        this.warnFileType = "";
        this.warnMaterialType = "";
        this.warnViewTitle = "";
      },

      // 确定按钮执行的操作
      okBtnClicked() {
        if (this.controlModel === "view") {
          this.$emit("dialogOkClicked", "view");
          this.close();

          return;
        }

        // 如果isRepeat是true  说明有红字 不执行api请求
        if (
          this.warnMaterialType === "" &&
          this.warnViewTitle === "" &&
          this.warnFileType === "" &&
          this.warnMaterialPath === ""
        ) {
          this.fetchSaveUserData();
        }
      },

      // 取消按钮执行的操作
      cancelBtnClicked() {
        this.close();
      },

      // 编辑/添加 保存用户请求
      fetchSaveUserData() {
        this.getNewTrainInfo();

        if (this.newTrainInfo.MATERIAL_TYPE === "") {
          this.warnMaterialType = "请选择课程类型";
        }

        if (this.newTrainInfo.VIEW_TITLE === "") {
          this.warnViewTitle = "请输入课程名称";
        }

        if (this.newTrainInfo.FILE_TYPE === "") {
          this.warnFileType = "请选择材料类型";
        }

        if (this.newTrainInfo.MATERIAL_PATH === "" ||
          this.newTrainInfo.MATERIAL_PATH === ">>点击上传文件" ||
          this.newTrainInfo.MATERIAL_PATH === null) {
            this.warnMaterialPath = "请上传资料文件";
          }

        if (
          this.warnMaterialType === "" &&
          this.warnViewTitle === "" &&
          this.warnFileType === "" &&
          this.warnMaterialPath === ""
        ) {
          Axios.post(resolveApiRoute("train-manage"), this.newTrainInfo).then(
            (res) => {
              if (res.data.Code === 0) {
                let obj = Object.assign({}, res.data.Data);

                if (this.controlModel === "edit") {
                  this.$emit("dialogOkClicked", obj);
                  this.close();
                  this.$showNotice("编辑成功");
                } else {
                  this.$emit("dialogOkClicked", obj);
                  this.close();
                  this.$showNotice("添加成功");
                }
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
        }
      },

      // 得到新的信息对象
      getNewTrainInfo() {
        let materialType = this.materialType;
        let viewTitle = this.viewTitle.trim();
        let fileType = this.fileType;
        let materialPath = this.fileID;

        if (this.controlModel === "add") {
          this.newTrainInfo = Object.assign(
            {},
            {
              MATERIAL_TYPE: materialType,
              VIEW_TITLE: viewTitle,
              FILE_TYPE: fileType,
              MATERIAL_PATH: materialPath
            }
          );
        } else if (this.controlModel === "edit") {
          this.newTrainInfo = Object.assign(
            {},
            {
              ID: this.editBaseData.ID,
              TRAIN_ACT_ID: this.editBaseData.TRAIN_ACT_ID,
              MATERIAL_TYPE: materialType,
              MATERIAL_NAME: this.editBaseData.MATERIAL_NAME,
              VIEW_TITLE: viewTitle,
              FILE_TYPE: fileType,
              MATERIAL_PATH: materialPath,
              HTML_CONTENT: this.editBaseData.HTML_CONTENT,
              ORDER: this.editBaseData.ORDER,
              IS_VALID: this.editBaseData.IS_VALID
            }
          );
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .btn_disable {
    background: #3789be;
    color: white;
  }
  .train-control-dialog {
    @include dialog-css(sz(480), sz(280));

    .dialog__header {
      h3 {
        font-size: sz(16);
      }
    }

    .dialog__body {
      padding: sz(20) 0 sz(35) 0;
      text-align: left;
    }

    &__body {
      &-userloginname,
      &-doctor,
      &-doctoradd,
      &-doctorinput {
        margin: sz(12) 0 0 0;
        height: sz(34);
        line-height: sz(34);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        .select-dropdown-v2 {
          float: left;
          width: sz(200);
          height: sz(34);
          margin-left: sz(10);

          &__selected {
            font-size: map-get($font-sizes, xs);
            height: sz(32);
            line-height: sz(32);
            border-color: map-get($colors, dialog-input-border);

            &-placeholder {
              height: sz(32);
              line-height: sz(32);
              font-size: map-get($font-sizes, xs);
            }

            &-input,
            &-plain {
              height: sz(32);
              font-size: map-get($font-sizes, xs);
              line-height: sz(32);
            }
          }
        }

        .select-dropdown-v2-options {
          &__items-item-text {
            font-size: map-get($font-sizes, xs);
          }
        }

        &-editinput,
        &-editinputuser,
        &-editinputmm {
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);
          @include placeholder-color(map-get($colors, placeholder-text-color));
          @include border-radius(5px);

          float: left;
          width: sz(200);
          height: sz(34);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          margin-left: sz(10);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        &-editinputuser {
          background: map-get($colors, pure-white);
          border: none;
        }

        &-editinputmm {
          color: map-get($colors, dialog-disabled-text-color);
          background: map-get($colors, dialog-input-disabled-bg);
          font-size: map-get($font-sizes, xs);
        }

        &-mustwrite {
          float: left;
          font-size: sz(25);
          margin-left: sz(10);
          color: map-get($app-colors, error-text-color);
          margin-top: sz(5);
          height: sz(27);
        }
      }

      &-userloginname {
        margin: 0;
      }

      &-namewarning,
      &-addnamewarning {
        // visibility: hidden;
        text-align: left;
        height: sz(27);
        margin-top: sz(5);
        position: relative;

        span {
          display: inline-block;
          position: absolute;
          top: sz(0);
          left: sz(0);
          height: sz(15);
          font-size: map-get($font-sizes, xs);
          height: sz(12);
          line-height: sz(12);
          margin-left: sz(162);
          border: 1px solid transparent;
          color: map-get($colors, theme-red);
        }

        &--repeat {
          visibility: visible;
        }
      }

      &-username,
      &-usernameedit {
        height: sz(34);
        line-height: sz(34);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        .select-dropdown-v2 {
          float: left;
          width: sz(200);
          height: sz(34);
          margin-left: sz(10);
        }

        &-editinput {
          @include placeholder-color(map-get($colors, placeholder-text-color));
          @include border-radius(5px);

          float: left;
          width: sz(200);
          height: sz(34);
          border: none;
          border: 1px solid map-get($colors, dialog-input-border);
          padding-left: sz(10);
          margin-left: sz(10);
          font-size: map-get($font-sizes, xs);
          color: map-get($colors, dialog-text-color);

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }
        }

        &-mustwrite {
          float: left;
          font-size: sz(25);
          margin-left: sz(10);
          color: map-get($app-colors, error-text-color);
          margin-top: sz(5);
          height: sz(27);
        }
      }

      &-usernameedit {
        margin-top: sz(10);
      }

      &-gender,
      &-genderAdd,
      &-genderedit,
      &-oneself {
        margin-top: sz(30);
        height: sz(14);
        line-height: sz(14);

        &-span {
          display: inline-block;
          width: sz(150);
          height: 100%;
          text-align: right;
          float: left;
        }

        .customize-checkbox {
          float: left;
          margin-left: sz(10);

          &__radio {
            width: sz(12);
            height: sz(12);
          }

          &__label {
            vertical-align: middle;
            margin-left: sz(5);
            line-height: sz(14);
            height: sz(14);
            color: map-get($colors, dialog-text-color);
          }

          &:last-child {
            margin-left: sz(34);
          }

          &--active {
            .customize-checkbox__radio {
              width: sz(4);
              height: sz(4);
            }
          }
        }
      }

      &-genderAdd,
      &-genderedit,
      &-oneself {
        margin-top: 0;
      }

      &-oneself {
        &-span {
          width: sz(206);
        }
      }
    }

    &__notice {
      text-align: center;
      margin: 0 0 sz(20) 0;
      font-size: sz(12);
      line-height: sz(12);
      color: map-get($colors, text-light);
    }

    //重定义body下的样式
    @at-root {
      .train-control-dialog-select-dropdown {
        .select-dropdown-v2-options__items-item-text {
          overflow: visible;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
