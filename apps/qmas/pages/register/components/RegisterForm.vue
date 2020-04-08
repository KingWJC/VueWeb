<template>
  <div>
    <div class="register-form"
      style="margin:20px auto;width:1000px;height:700px">
      <div style="float:left;width:500px">
        <h3 style="margin-left:90px">机构信息</h3>
        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">医院名称</span>
          <input
            v-model="hospName"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="text"
            placeholder="请填写《医疗机构执业许可证》上的机构名称"
            maxlength="50"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnHospName }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">医院级别</span>
          <select v-model="hospLevel"
            class="register-form__body-userloginname-editinput">
            <option value>请选择</option>
            <option
              v-for="(item,index) in selectHospLevel"
              :key="index"
              :value="item.ID"
            >{{ item.DICT_VAL_NAME }}</option>
          </select>
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnHospLevel }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">医院类别</span>
          <select v-model="hospType"
            class="register-form__body-userloginname-editinput">
            <option value>请选择</option>
            <option
              v-for="(item,index) in selectHospType"
              :key="index"
              :value="item.ID"
            >{{ item.DICT_VAL_NAME }}</option>
          </select>
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnHospType }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">医院性质</span>
          <select v-model="hospNature"
            class="register-form__body-userloginname-editinput">
            <option value>请选择</option>
            <option
              v-for="(item,index) in selectHospNature"
              :key="index"
              :value="item.ID"
            >{{ item.DICT_VAL_NAME }}</option>
          </select>
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnHospNature }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">科室名称</span>
          <input
            v-model="deptName"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="text"
            placeholder
            maxlength="50"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnDeptName }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">科室类别</span>
          <select v-model="deptType"
            class="register-form__body-userloginname-editinput">
            <option value>请选择</option>
            <option
              v-for="(item,index) in selectDeptType"
              :key="index"
              :value="item.ID"
            >{{ item.DICT_VAL_NAME }}</option>
          </select>
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnDeptType }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">详细地址</span>
          <input
            v-model="addressDetail"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="text"
            placeholder="请填写《医疗机构执业许可证》上的地址"
            maxlength="200"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnAddressDetail }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">医院总机</span>
          <input
            v-model="hospPhone"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="text"
            placeholder="请输入座机号码，如010-88888888"
            maxlength="12"
            @blur="checkPhone"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnHospPhone }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">证明材料</span>
          <input
            v-model="licenPath"
            style="background:#3789be;color:white"
            class="register-form__body-userloginname-editinput"
            type="button"
            value="请上传"
            @click="upload"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnLicenPath }}</span>
        </div>
        <div style="font-size:8px;margin:-5px 0 0 160px">
          请上传在有效期内的《医疗机构执业许可证》照片或扫描件，且诊疗科目需包含“重症医学科”</div>
      </div>

      <div style="float:right;width:500px">
        <h3 style="margin-left:90px">联络员信息</h3>
        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">真实姓名</span>
          <input
            v-model="userRealname"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="text"
            placeholder
            maxlength="10"
            @blur="nameLength"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnUserRealname }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">手机号码</span>
          <input
            v-model="userMobilephone"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="text"
            placeholder="请输入11位手机号码"
            maxlength="11"
            @blur="checkMobilePhone"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnUserMobilephone }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">电子邮箱</span>
          <input
            v-model="userEmail"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="text"
            placeholder
            maxlength="50"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnUserEmail }}</span>
        </div>

        <h3 style="margin-left:90px">账户信息</h3>
        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">账号</span>
          <input
            v-model="userAccount"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="text"
            placeholder="请输入字母或数字，不区分大小写"
            maxlength="50"
            @blur="onBlurTestUserLoginName"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnUserAccount }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">密码</span>
          <input
            v-model="userPasswd"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="password"
            placeholder="请输入6-20位密码，区分大小写"
            maxlength="20"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnUserPasswd }}</span>
        </div>

        <div class="register-form__body-userloginname clearfix">
          <span class="register-form__body-userloginname-span">密码确认</span>
          <input
            v-model="userPasswdAgain"
            :disabled="controlModel === 'edit'"
            class="register-form__body-userloginname-editinput"
            type="password"
            placeholder="请再次输入密码"
            maxlength="20"
          />
          <b class="register-form__body-userloginname-mustwrite">*</b>
        </div>
        <div class="register-form__body-namewarning">
          <span>{{ warnUserPasswdAgain }}</span>
        </div>
      </div>
    </div>
    <div class="dialog__footer">
      <a
        href="javascript:;"
        class="btn dialog__footer-btn dialog__footer-btn-ok"
        @click="registerBtnClicked"
      >注册</a>
      <a href="/Login/Index"
        style="color:#3789BE;margin-left:40px ">使用已有账号登录</a>
    </div>

    <global-uploader ref="upload"
      :attrdata="attrdata"
      @fileSuccess="fileSuccess"></global-uploader>
  </div>
</template>

<script>
  import Axios from "axios";
  import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
  import CustomizeCheckbox from "__shared-libs/components/CustomizeCheckbox";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import GlobalUploader from "__libs/components/GlobalUploader";

  export default {
    name: "register-form",

    components: {
      BasicDialog,
      CustomizeCheckbox,
      GlobalUploader
    },

    mixins: [BasicDialog],

    props: {
      controlModel: {
        type: String,
        default: "import"
      }
    },
    data() {
      return {
        hospName: "",
        hospLevel: "",
        hospType: "",
        hospNature: "",
        deptName: "",
        deptType: "",
        addressDetail: "",
        hospPhone: "",
        licenPath: ">>点击上传文件",
        // 上传文件返回的ID
        fileID: "",
        userRealname: "",
        userMobilephone: "",
        userEmail: "",
        userAccount: "",
        userPasswd: "",
        userPasswdAgain: "",
        newRegisterInfo: {},
        // 用户名非法提示
        warnHospName: "",
        warnHospLevel: "",
        warnHospType: "",
        warnHospNature: "",
        warnDeptName: "",
        warnDeptType: "",
        warnAddressDetail: "",
        warnHospPhone: "",
        warnLicenPath: "",
        warnUserRealname: "",
        warnUserMobilephone: "",
        warnUserEmail: "",
        warnUserAccount: "",
        warnUserPasswd: "",
        warnUserPasswdAgain: "",

        selectHospLevel: [],
        selectHospType: [],
        selectHospNature: [],
        selectDeptType: [],
        attrdata: [".png", ".jpg", ".jpeg", ".bmp", ".pdf"]
      };
    },

    watch: {
      hospName(val) {
        this.hospName = val.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, "");

        if (val != "") {
          this.warnHospName = "";
        }
      },

      hospType(val) {
        if (val != "") {
          this.warnHospType = "";
        }
      },

      hospNature(val) {
        if (val != "") {
          this.warnHospNature = "";
        }
      },

      deptName(val) {
        this.deptName = val.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, "");

        if (val != "") {
          this.warnDeptName = "";
        }
      },

      deptType(val) {
        if (val != "") {
          this.warnDeptType = "";
        }
      },

      hospLevel(val) {
        if (val != "") {
          this.warnHospLevel = "";
        }
      },

      addressDetail(val) {
        if (val != "") {
          this.warnAddressDetail = "";
        }
      },

      // hospPhone(val) {
      //   if (val != "") {
      //     this.warnHospPhone = "";
      //   }
      // },

      licenPath(val) {
        if (val != ">>点击上传文件" && val != "") {
          this.warnLicenPath = "";
        }
      },

      userRealname(val) {
        this.userRealname = val.replace(/[^a-zA-Z\u4E00-\u9FA5]/g, "");

        if (val != "") {
          this.warnUserRealname = "";
        }
      },

      // userMobilephone(val) {
      //   if (val.length != 11) {
      //     this.warnUserMobilephone = "请输入11位手机号";
      //   } else {
      //     this.warnUserMobilephone = "";
      //   }
      // },

      userEmail(val) {
        if (val != "") {
          this.warnUserEmail = "";
        }
      },

      userAccount(val) {
        this.userAccount = val.replace(/[^0-9a-zA-Z]/g, "");

        if (val != "") {
          this.warnUserAccount = "";
        }
      },

      userPasswd(val) {
        if (val.length < 6) {
          this.warnUserPasswd = "请设置6-20位密码";
        } else {
          this.warnUserPasswd = "";

          if (val != this.userPasswdAgain) {
            this.warnUserPasswdAgain = "两次密码不一致";
          } else {
            this.warnUserPasswd = "";
            this.warnUserPasswdAgain = "";
          }
        }
      },

      userPasswdAgain(val) {
        if (val != this.userPasswd) {
          this.warnUserPasswdAgain = "两次密码不一致";
        } else {
          this.warnUserPasswdAgain = "";
        }
      }
    },

    mounted() {
      this.getSelevtLevel();
    },

    methods: {
      upload() {
        this.$refs.upload.openUploader({
          fileID: this.fileID,
          targetFolder: "registerfile"
        });
      },
      fileSuccess(res) {
        this.fileID = res.id;
        this.licenPath = res.name;
      },
      // 得到新的注册用户信息对象
      getNewRegisterInfo() {
        this.newRegisterInfo = Object.assign(
          {},
          {
            HOSP_NAME: this.hospName.trim(),
            HOSP_TYPE: this.hospType.trim(),
            HOSP_NATURE: this.hospNature.trim(),
            DEPT_NAME: this.deptName.trim(),
            DEPT_TYPE: this.deptType.trim(),
            HOSP_LEVEL: this.hospLevel.trim(),
            ADDRESS_DETAIL: this.addressDetail.trim(),
            HOSP_PHONE: this.hospPhone.trim(),
            LICEN_PATH: this.fileID.trim(),
            USER_REALNAME: this.userRealname.trim(),
            USER_MOBILEPHONE: this.userMobilephone.trim(),
            USER_EMAIL: this.userEmail.trim(),
            USER_ACCOUNT: this.userAccount.trim(),
            USER_PASSWD: this.userPasswd.trim()
          }
        );
      },

      // 验证手机号
      checkMobilePhone() {
        if (!/^1[3456789]\d{9}$/.test(this.userMobilephone)) {
          this.warnUserMobilephone = "手机号码有误，请重填";
        } else {
          this.warnUserMobilephone = "";
        }
      },
      // 验证座机号
      checkPhone() {
        if (!/^0\d{2,3}-?\d{7,8}$/.test(this.hospPhone)) {
          this.warnHospPhone = "座机号码有误，请重填";
        } else {
          this.warnHospPhone = "";
        }
      },

      // 验证姓名长度
      nameLength() {
        if (this.userRealname.length < 2) {
          this.warnUserRealname = "姓名不能少于两个字符";
        }
      },

      // 表单校验
      registerVerify() {
        this.getNewRegisterInfo();
        let flag = true;

        if (this.newRegisterInfo.HOSP_NAME === "") {
          this.warnHospName = "请填写";
        }

        if (this.newRegisterInfo.HOSP_TYPE === "") {
          this.warnHospType = "请选择";
        }

        if (this.newRegisterInfo.HOSP_NATURE === "") {
          this.warnHospNature = "请选择";
        }

        if (this.newRegisterInfo.DEPT_NAME === "") {
          this.warnDeptName = "请填写";
        }

        if (this.newRegisterInfo.DEPT_NAME === "") {
          this.warnDeptName = "请填写";
        }

        if (this.newRegisterInfo.DEPT_TYPE === "") {
          this.warnDeptType = "请选择";
        }

        if (this.newRegisterInfo.HOSP_LEVEL === "") {
          this.warnHospLevel = "请选择";
        }

        if (this.newRegisterInfo.ADDRESS_DETAIL === "") {
          this.warnAddressDetail = "请填写";
        }

        if (this.newRegisterInfo.HOSP_PHONE === "") {
          this.warnHospPhone = "请填写";
        }

        if (this.newRegisterInfo.LICEN_PATH === "") {
          this.warnLicenPath = "请上传";
        }

        if (this.newRegisterInfo.USER_REALNAME === "") {
          this.warnUserRealname = "请填写";
        }

        if (this.newRegisterInfo.USER_MOBILEPHONE === "") {
          this.warnUserMobilephone = "请填写";
        }

        if (this.newRegisterInfo.USER_EMAIL === "") {
          this.warnUserEmail = "请填写";
        }

        if (this.newRegisterInfo.USER_ACCOUNT === "") {
          this.warnUserAccount = "请填写";
        }

        if (this.newRegisterInfo.USER_PASSWD === "") {
          this.warnUserPasswd = "请填写";
        }

        if (this.userPasswdAgain.trim() === "") {
          this.warnUserPasswdAgain = "请填写";
        }

        if (
          this.warnHospName != "" ||
          this.warnDeptName != "" ||
          this.warnHospLevel != "" ||
          this.warnAddressDetail != "" ||
          this.warnHospPhone != "" ||
          this.warnLicenPath != "" ||
          this.warnUserRealname != "" ||
          this.warnUserMobilephone != "" ||
          this.warnUserEmail != "" ||
          this.warnUserPasswd != "" ||
          this.warnUserPasswdAgain != "" ||
          this.warnHospType != "" ||
          this.warnHospNature != "" ||
          this.warnDeptType != "" ||
          this.warnUserAccount != ""
        ) {
          flag = false;
        }

        return flag;
      },

      // 离开焦点验证用户名是否重复
      onBlurTestUserLoginName() {
        let account = this.userAccount.trim();

        if (account !== "") {
          Axios.get(resolveApiRoute("user-check-use-name"), {
            params: {
              UserLoginName: account
            }
          }).then(
            (res) => {
              if (res.data.Code === 0) {
                this.warnUserAccount = "";
              } else if (res.data.Code === 1) {
                this.warnUserAccount = "该账号已被占用，请重新输入";
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

      // 执行注册
      registerBtnClicked() {
        let flag = this.registerVerify();

        if (flag) {
          Axios.post(resolveApiRoute("register-info"),
                     this.newRegisterInfo).then(
                       (res) => {
                         if (res.data.Code === 0) {
                           this.$showNotice("注册成功");
                           location.href = "/RegisterSuccess";
                         } else if (res.data.Code === 1) {
                           this.$showNotice(res.data.Msg);
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

      // 获取下拉框数据
      getSelevtLevel() {
        Axios.get(resolveApiRoute("select-dict-value")).then(
          (res) => {
            if (res.data.Code === 0) {
              // this.$showNotice("成功");
              this.selectHospLevel = res.data.Data.HospLevel;
              this.selectHospType = res.data.Data.HospType;
              this.selectHospNature = res.data.Data.HospNature;
              this.selectDeptType = res.data.Data.DeptType;
            } else {
              this.$showNotice("服务器异常", "failed");
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

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .register-form {
    // @include dialog-css(sz(480), sz(239));
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
          width: sz(270);
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
          width: sz(270);
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
      .register-form-select-dropdown {
        .select-dropdown-v2-options__items-item-text {
          overflow: visible;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .cases-search-box {
    @include border-radius(4px);

    border: 1px solid map-get($colors, dialog-cancel-border);
    padding: sz(7) sz(10);
    background: map-get($colors, pure-white);
  }
</style>
