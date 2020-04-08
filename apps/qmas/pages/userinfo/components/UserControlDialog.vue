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
        <h3 class="user-control-dialog__header-text">
          <template v-if="controlModel === 'import'">导入账号</template>
          <template v-else-if="controlModel === 'add'">添加账号</template>
          <template v-else-if="controlModel === 'edit'">编辑账号</template>
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
          <div class="user-control-dialog__body-userloginname clearfix">
            <span class="user-control-dialog__body-userloginname-span">
              登录账户</span>
            <input
              v-model="userLoginName"
              :disabled="controlModel === 'edit'"
              class="user-control-dialog__body-userloginname-editinput"
              type="text"
              placeholder="请输入登录名"
              maxlength="20"
              @blur="onBlurTestUserLoginName"
            />
            <b class="user-control-dialog__body-userloginname-mustwrite">
              <template v-if="controlModel !== 'edit'">*</template>
            </b>
          </div>
          <div
            :class="{
              'user-control-dialog__body-namewarning--repeat': isRepeat
            }"
            class="user-control-dialog__body-namewarning"
          >
            <span>{{ lawlessness }}</span>
          </div>

          <div class="user-control-dialog__body-username clearfix">
            <span class="user-control-dialog__body-username-span">
              用户姓名</span>
            <input
              v-model="userName"
              class="user-control-dialog__body-username-editinput"
              type="text"
              placeholder="请输入姓名"
              maxlength="10"
              @blur="onBlurTestUserName"
            />
            <b class="user-control-dialog__body-username-mustwrite">*</b>
          </div>
          <div
            :class="{
              'user-control-dialog__body-addnamewarning--repeat': isRepeatAdd
            }"
            class="user-control-dialog__body-addnamewarning"
          >
            <span>{{ lawlessnessName }}</span>
          </div>

          <div class="user-control-dialog__body-username clearfix">
            <span class="user-control-dialog__body-username-span">手机号码</span>
            <input
              v-model="phoneNumber"
              class="user-control-dialog__body-username-editinput"
              type="text"
              placeholder="请输入11位手机号"
              maxlength="11"
              @blur="onBlurTestIPhoneNumber"
            />
            <b class="user-control-dialog__body-username-mustwrite">*</b>
          </div>
          <div
            :class="{
              'user-control-dialog__body-addnamewarning--repeat': isRepeatPhone
            }"
            class="user-control-dialog__body-addnamewarning"
          >
            <span>{{ lawlessnessPhone }}</span>
          </div>

          <div class="user-control-dialog__body-doctoradd clearfix">
            <span class="user-control-dialog__body-doctoradd-span">角色</span>
            <select-dropdown-v2
              v-model="cachedRole"
              :dropDownMaxHeight="210"
              :options="commonRoles"
              label="ROLE_NAME"
              trackBy="ID"
              @optionChanged="onBlurTestRole"
            >
              <template slot="drop"
                slot-scope="dropContent">
                <p
                  class="select-dropdown-v2-options__items-item-text"
                >{{ dropContent.options.ROLE_NAME }}</p>
              </template>
            </select-dropdown-v2>
            <b class="user-control-dialog__body-usernameedit-mustwrite">*</b>
          </div>
          <div
            :class="{
              'user-control-dialog__body-namewarning--repeat': isRepeatRole
            }"
            class="user-control-dialog__body-namewarning"
          >
            <span>{{ lawlessnessRole }}</span>
          </div>

          <div class="user-control-dialog__body-username clearfix">
            <span class="user-control-dialog__body-username-span">备注</span>
            <textarea v-model="remark"
              class="user-control-dialog__body-remark-textarea"></textarea>
          </div>
        </template>
        <template v-else>
          <div class="user-control-dialog__body-userloginname clearfix">
            <span class="user-control-dialog__body-userloginname-span">
              登录账户</span>
            <input
              v-model="userLoginName"
              :disabled="controlModel === 'edit'"
              class="user-control-dialog__body-userloginname-editinputuser"
              type="text"
              placeholder="请输入登录名"
              maxlength="20"
              @blur="onBlurTestUserLoginName"
            />
            <b class="user-control-dialog__body-userloginname-mustwrite">
              <template v-if="controlModel !== 'edit'">*</template>
            </b>
          </div>
          <div class="user-control-dialog__body-usernameedit clearfix">
            <span class="user-control-dialog__body-usernameedit-span">
              用户姓名</span>
            <input
              v-model="userName"
              class="user-control-dialog__body-usernameedit-editinput"
              type="text"
              placeholder="请输入姓名"
              maxlength="100"
              @blur="onBlurTestUserName"
            />
            <b class="user-control-dialog__body-usernameedit-mustwrite">*</b>
          </div>
          <div
            :class="{
              'user-control-dialog__body-namewarning--repeat': isRepeatAdd
            }"
            class="user-control-dialog__body-namewarning"
          >
            <span>{{ lawlessnessName }}</span>
          </div>

          <div class="user-control-dialog__body-usernameedit clearfix">
            <span class="user-control-dialog__body-usernameedit-span">
              手机号码</span>
            <input
              v-model="phoneNumber"
              class="user-control-dialog__body-usernameedit-editinput"
              type="text"
              placeholder="请输入11位手机号"
              maxlength="11"
              @blur="onBlurTestIPhoneNumber"
            />
            <b class="user-control-dialog__body-usernameedit-mustwrite">*</b>
          </div>
          <div
            :class="{
              'user-control-dialog__body-namewarning--repeat': isRepeatPhone
            }"
            class="user-control-dialog__body-namewarning"
          >
            <span>{{ lawlessnessPhone }}</span>
          </div>

          <div class="user-control-dialog__body-doctor clearfix">
            <span class="user-control-dialog__body-doctor-span">角色</span>
            <select-dropdown-v2
              v-model="cachedRole"
              :dropDownMaxHeight="210"
              :options="commonRoles"
              label="ROLE_NAME"
              trackBy="ID"
              @optionChanged="onBlurTestRole"
            >
              <template slot="drop"
                slot-scope="dropContent">
                <p
                  class="select-dropdown-v2-options__items-item-text"
                >{{ dropContent.options.ROLE_NAME }}</p>
              </template>
            </select-dropdown-v2>
            <b class="user-control-dialog__body-usernameedit-mustwrite">*</b>
          </div>
          <div
            :class="{
              'user-control-dialog__body-namewarning--repeat': isRepeatRole
            }"
            class="user-control-dialog__body-namewarning"
          >
            <span>{{ lawlessnessRole }}</span>
          </div>

          <div class="user-control-dialog__body-username clearfix">
            <span class="user-control-dialog__body-username-span">备注</span>
            <textarea v-model="remark"
              class="user-control-dialog__body-remark-textarea"></textarea>
          </div>
        </template>
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
    </div>
  </teleporter>
</template>

<script>
  import Axios from "axios";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";

  export default {
    name: "user-control-dialog",

    components: {},

    mixins: [BasicDialog],

    props: {
      // logicClassName
      logicClassName: {
        type: String,
        default: "user-control-dialog"
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
      },

      commonRoles: {
        type: Array,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        // 缓冲中的用户
        cachedUser: null,
        cachedRole: null,

        // 相对于窗口的margin-top值
        marginTop: 70,

        // 定义一个变量,用来保存提交时的用户信息(可能修改之后的用户信息)
        newUserInfo: {},

        // 非导入模式下的用户名
        userLoginName: "",
        userName: "",
        phoneNumber: "",
        remark: "",

        // 用户名是否重复
        isRepeat: false,
        isRepeatAdd: false,
        isRepeatRole: false,
        isRepeatPhone: false,

        // 用户名非法提示
        lawlessness: "",
        lawlessnessName: "",
        lawlessnessRole: "",
        lawlessnessPhone: ""
      };
    },

    methods: {
      // 离开焦点验证用户名是否重复
      onBlurTestUserLoginName() {
        if (this.controlModel === "add") {
          // this.isRepeat = false;
          this.testUserLoginName();
        }
      },

      onBlurTestUserName() {
        if (this.userName.trim() !== "") {
          if (this.userName.length > 10) {
            this.lawlessnessName = "用户姓名应不大于10个字符";
            this.isRepeatAdd = true;
          } else {
            this.isRepeatAdd = false;
          }
        } else {
          this.lawlessnessName = "请输入姓名";
          this.isRepeatAdd = true;
        }
      },

      onBlurTestRole() {
        if (this.cachedRole !== null) {
          this.isRepeatRole = false;
        }
      },

      onBlurTestIPhoneNumber() {
        let exp = /^1[3456789]\d{9}$/;
        let objExp = new RegExp(exp);

        if (objExp.test(this.phoneNumber) === true) {
          this.isRepeatPhone = false;
        } else {
          this.lawlessnessPhone = "请输入11位手机号";
          this.isRepeatPhone = true;
        }
      },

      // 编辑 初始化对话框
      initDialog() {
        if (this.controlModel === "edit") {
          this.userName = this.editBaseData.USER_REALNAME
            ? this.editBaseData.USER_REALNAME
            : "";
          this.userLoginName = this.editBaseData.USER_ACCOUNT
            ? this.editBaseData.USER_ACCOUNT
            : "";
          this.phoneNumber = this.editBaseData.USER_MOBILEPHONE
            ? this.editBaseData.USER_MOBILEPHONE
            : "";
          this.remark = this.editBaseData.REMARK ?
            this.editBaseData.REMARK : "";
          this.cachedRole = this.filterSelectedRole();
          this.isRepeat = false;
          this.isRepeatAdd = false;
          this.isRepeatRole = false;
          this.isRepeatPhone = false;
        }
      },

      // remove the instance
      close() {
        if (this.allowClosing) {
          this.clearCachedData();
          this.$emit("closeDialog");
        }
      },

      // 每次关闭对话框的时候修需要将缓冲的数据清楚,以免影响下一次的操作
      clearCachedData() {
        this.userName = "";
        this.userLoginName = "";
        this.phoneNumber = "";
        this.remark = "";
        this.cachedUser = null;
        this.cachedRole = null;
        this.isRepeat = false;
        this.isRepeatAdd = false;
        this.isRepeatRole = false;
        this.isRepeatPhone = false;
      },

      // 确定按钮执行的操作
      okBtnClicked() {
        // 请求数据
        // 如果isRepeat是true  说明有红字 不执行api请求
        if (
          !this.isRepeat &&
          !this.isRepeatRole &&
          !this.isRepeatPhone &&
          !this.isRepeatAdd
        ) {
          this.fetchSaveUserData();
        }
      },

      // 用户名验证最多输入20字符
      userNameChecking() {
        // 在JavaScript中，正则表达式只能使用"/"开头和结束，不能使用双引号
        let exp = /^[a-zA-Z\d]{1,20}$/;
        let objExp = new RegExp(exp);

        if (objExp.test(this.userLoginName) === true) {
          this.isRepeat = false;
        } else {
          this.lawlessness = "请输入数字或字母";
          this.isRepeat = true;
        }
      },

      // 取消按钮执行的操作
      cancelBtnClicked() {
        this.close();
      },

      // 编辑/添加 保存用户请求
      fetchSaveUserData() {
        this.getNewUserInfo();
        let userName = this.newUserInfo.USER_REALNAME.trim();
        let userLoginName = this.newUserInfo.USER_ACCOUNT.trim();
        let roleID = this.newUserInfo.RoleIdList;
        let phoneNumber = this.newUserInfo.USER_MOBILEPHONE.trim();

        if (
          userName === "" &&
          userLoginName === "" &&
          roleID.length === 0 &&
          phoneNumber === ""
        ) {
          this.lawlessness = "请输入用户名";
          this.lawlessnessName = "请输入姓名";
          this.lawlessnessRole = "请选择用户的角色";
          this.lawlessnessPhone = "请输入11位手机号";
          this.isRepeatPhone = true;
          this.isRepeatRole = true;
          this.isRepeat = true;
          this.isRepeatAdd = true;

          return;
        } else if (
          userName !== "" &&
          userLoginName === "" &&
          roleID.length === 0 &&
          phoneNumber === ""
        ) {
          this.lawlessness = "请输入用户名";
          this.lawlessnessRole = "请选择用户的角色";
          this.lawlessnessPhone = "请输入11位手机号";
          this.isRepeatPhone = true;
          this.isRepeatRole = true;
          this.isRepeat = true;
          this.isRepeatAdd = false;

          return;
        } else if (
          userName === "" &&
          userLoginName !== "" &&
          roleID.length === 0 &&
          phoneNumber === ""
        ) {
          this.lawlessnessName = "请输入姓名";
          this.lawlessnessRole = "请选择用户的角色";
          this.lawlessnessPhone = "请输入11位手机号";
          this.isRepeatPhone = true;
          this.isRepeatRole = true;
          this.isRepeat = false;
          this.isRepeatAdd = true;

          return;
        } else if (
          userName !== "" &&
          userLoginName !== "" &&
          roleID.length === 0 &&
          phoneNumber === ""
        ) {
          this.isRepeat = false;
          this.lawlessnessRole = "请选择用户的角色";
          this.lawlessnessPhone = "请输入11位手机号";
          this.isRepeatPhone = true;
          this.isRepeatRole = true;

          return;
        } else if (
          userName !== "" &&
          userLoginName === "" &&
          roleID.length !== 0 &&
          phoneNumber === ""
        ) {
          this.lawlessness = "请输入用户名";
          this.lawlessnessPhone = "请输入11位手机号";
          this.isRepeatPhone = true;
          this.isRepeat = true;
          this.isRepeatRole = false;
          this.isRepeatAdd = false;

          return;
        } else if (
          userName === "" &&
          userLoginName !== "" &&
          roleID.length !== 0 &&
          phoneNumber === ""
        ) {
          this.lawlessnessName = "请输入姓名";
          this.lawlessnessPhone = "请输入11位手机号";
          this.isRepeatPhone = true;
          this.isRepeatAdd = true;
          this.isRepeatRole = false;
          this.isRepeat = false;

          return;
        } else if (
          userName === "" &&
          userLoginName === "" &&
          roleID.length !== 0 &&
          phoneNumber === ""
        ) {
          this.lawlessnessName = "请输入姓名";
          this.lawlessness = "请输入用户名";
          this.lawlessnessPhone = "请输入11位手机号";
          this.isRepeatPhone = true;
          this.isRepeatAdd = true;
          this.isRepeatRole = false;
          this.isRepeat = true;

          return;
        } else if (
          userName === "" &&
          userLoginName === "" &&
          roleID.length !== 0 &&
          phoneNumber !== ""
        ) {
          this.lawlessness = "请输入用户名";
          this.lawlessnessName = "请输入姓名";
          this.isRepeat = true;
          this.isRepeatAdd = true;

          return;
        } else if (
          userName !== "" &&
          userLoginName === "" &&
          roleID.length !== 0 &&
          phoneNumber !== ""
        ) {
          this.lawlessness = "请输入用户名";
          this.isRepeat = true;

          return;
        } else if (
          userName === "" &&
          userLoginName !== "" &&
          roleID.length !== 0 &&
          phoneNumber !== ""
        ) {
          this.lawlessnessName = "请输入姓名";
          this.isRepeatAdd = true;

          return;
        } else if (roleID.length === 0) {
          this.lawlessnessRole = "请选择用户的角色";
          this.isRepeatRole = true;

          return;
        }

        Axios.post(resolveApiRoute("user-save"), this.newUserInfo).then(
          (res) => {
            if (res.data.Code === 0) {
              if (this.controlModel !== "edit") {
                this.newUserInfo = Object.assign({}, this.newUserInfo, {
                  ID: res.data.Data.ID,
                  UPD_TIME: res.data.Data.UpdDate
                });
              }

              let obj = Object.assign({}, this.newUserInfo, {
                RoleIdList: [this.cachedRole.ID]
              });

              if (this.controlModel === "edit") {
                let tmp = obj;
                tmp.STATE = this.editBaseData.STATE;
                tmp.UPD_TIME = this.editBaseData.UPD_TIME;

                if (this.cachedRole) {
                  tmp.RoleIdList = [this.cachedRole.ID];
                  tmp.RoleNames = this.cachedRole.ROLE_NAME;
                }

                this.$emit("dialogOkClicked", tmp);
                this.close();
                this.$showNotice("编辑成功");
              } else {
                this.$emit("dialogOkClicked", obj);
                this.close();
                this.$showNotice("添加成功");
              }
            } else if (res.data.Code === 4) {
              this.$showNotice("用户已存在!", "failed");
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

      // 得到新的用户信息对象
      getNewUserInfo() {
        let userName = this.userName.trim();
        let userLoginName = this.userLoginName.trim();
        let phoneNumber = this.phoneNumber.trim();

        if (this.controlModel === "add") {
          this.newUserInfo = Object.assign(
            {},
            {
              USER_REALNAME: userName,
              USER_ACCOUNT: userLoginName,
              RoleIdList: this.cachedRole ? [this.cachedRole.ID] : [],
              RoleNames: this.cachedRole ? this.cachedRole.ROLE_NAME : "",
              USER_MOBILEPHONE: phoneNumber,
              STATE: 0,
              REMARK: this.remark
            }
          );
        } else if (this.controlModel === "edit") {
          this.newUserInfo = Object.assign(
            {},
            {
              ID: this.editBaseData.ID,
              USER_REALNAME: userName,
              USER_ACCOUNT: userLoginName,
              USER_MOBILEPHONE: phoneNumber,
              STATE: this.editBaseData.STATE,
              RoleIdList: [this.cachedRole.ID],
              RoleNames: this.cachedRole.ROLE_NAME,
              REMARK: this.remark,
              ORG_ID: this.editBaseData.ORG_ID,
              USER_PASSWD: this.editBaseData.USER_PASSWD
            }
          );
        }
      },

      // 验证用户名是否存在
      testUserLoginName() {
        let trimedStr = this.userLoginName.trim();

        if (trimedStr !== "") {
          Axios.get(resolveApiRoute("user-check-use-name"), {
            params: {
              UserLoginName: trimedStr
            }
          }).then(
            (res) => {
              if (res.data.Code === 0) {
                // isRepeat模型共用
                // 控制'用户名存在'的显示
                this.isRepeat = false;
                // 保证输入框未失去焦点时并用户名有效时,显示输入是否合法的提示
                this.userNameChecking();
              } else if (res.data.Code === 1) {
                this.isRepeat = true;
                this.lawlessness = "该用户已存在";
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
      // 找出当前已选择的角色
      filterSelectedRole() {
        if (this.editBaseData.RoleIdList.length > 0) {
          return this.commonRoles.find((item) => {
            return item.ID === this.editBaseData.RoleIdList[0];
          });
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .user-control-dialog {
    @include dialog-css(sz(480), sz(319));

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

      &-remark {
        position: relative;

        &-textarea {
          // 媒体查询 监测ie10浏览器 执行{}中input字体重置
          @include patch-ie10-input-font();

          font-size: map-get($font-sizes, xs);
          border-radius: sz(4);
          float: left;
          margin-left: 10px;
          width: sz(290);
          height: sz(60);
          line-height: sz(22);
          padding: sz(8) sz(10);
          border: 1px solid map-get($colors, dialog-input-border);
          resize: none;
          overflow: hidden;
          word-break: break-all;

          &:focus {
            border: 1px solid map-get($colors, theme-blue);
          }

          &--active {
            border-radius: sz(4) sz(4) 0 0;
          }

          &--disabled {
            cursor: not-allowed;
            background: map-get($colors, dialog-input-disabled-bg);
          }
        }
      }

      &-userloginname {
        margin: 0;
      }

      &-namewarning,
      &-addnamewarning {
        visibility: hidden;
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
      .user-control-dialog-select-dropdown {
        .select-dropdown-v2-options__items-item-text {
          overflow: visible;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
