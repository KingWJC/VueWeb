<template>
  <div>
    <div class="org-detail"
      style="margin:20px auto;width:1000px;height:650px">
      <div style="float:left;width:500px">
        <h3 style="margin-left:90px">机构信息</h3>
        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">医院名称</span>
          <input
            v-model="hospName"
            class="org-detail__body-userloginname-editinput"
            type="text"
            placeholder="请填写《医疗机构执业许可证》上的机构名称"
            maxlength="50"
            onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
            onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
          />
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnHospName }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">医院级别</span>
          <select v-model="hospLevel"
            class="org-detail__body-userloginname-editinput">
            <option value>请选择</option>
            <option
              v-for="(item,index) in selectHospLevel"
              :key="index"
              :value="item.ID"
            >{{ item.DICT_VAL_NAME }}</option>
          </select>
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnHospLevel }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">医院类别</span>
          <select v-model="hospType"
            class="org-detail__body-userloginname-editinput">
            <option value>请选择</option>
            <option
              v-for="(item,index) in selectHospType"
              :key="index"
              :value="item.ID"
            >{{ item.DICT_VAL_NAME }}</option>
          </select>
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnHospType }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">医院性质</span>
          <select v-model="hospNature"
            class="org-detail__body-userloginname-editinput">
            <option value>请选择</option>
            <option
              v-for="(item,index) in selectHospNature"
              :key="index"
              :value="item.ID"
            >{{ item.DICT_VAL_NAME }}</option>
          </select>
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnHospNature }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">科室名称</span>
          <input
            v-model="deptName"
            class="org-detail__body-userloginname-editinput"
            type="text"
            placeholder
            maxlength="50"
            onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
            onpaste="value=value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"
          />
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnDeptName }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">科室类别</span>
          <select v-model="deptType"
            class="org-detail__body-userloginname-editinput">
            <option value>请选择</option>
            <option
              v-for="(item,index) in selectDeptType"
              :key="index"
              :value="item.ID"
            >{{ item.DICT_VAL_NAME }}</option>
          </select>
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnDeptType }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">详细地址</span>
          <input
            v-model="addressDetail"
            class="org-detail__body-userloginname-editinput"
            type="text"
            placeholder="请填写《医疗机构执业许可证》上的地址"
            maxlength="200"
          />
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnAddressDetail }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">医院总机</span>
          <input
            v-model="hospPhone"
            class="org-detail__body-userloginname-editinput"
            type="text"
            placeholder="请输入座机号码，如010-88888888"
            maxlength="12"
            @blur="checkPhone"
          />
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnHospPhone }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">证明材料</span>
          <input
            v-model="licenPath"
            style="background:#3789be;color:white"
            class="org-detail__body-userloginname-editinput"
            type="button"
            value="请上传"
            @click="upload"
          />
          <!-- <template v-if="licenPath===''">
            <a href="javascript:;" @click="upload()">请上传</a>
          </template>
          <template else>
            <a href="javascript:;" @click="upload()">{{licenPath}}</a>
          </template>-->

          <a href="javascript:;"
            @click="viewFile()">查看</a>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnLicenPath }}</span>
        </div>
      </div>

      <div style="float:right;width:500px">
        <h3 style="margin-left:90px">联络员信息</h3>
        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">真实姓名</span>
          <input
            v-model="userRealname"
            class="org-detail__body-userloginname-editinput"
            type="text"
            placeholder
            maxlength="10"
            onkeyup="value=value.replace(/[^\a-\z\A-\Z\u4E00-\u9FA5]/g,'')"
            onpaste="value=value.replace(/[^\a-\z\A-\Z\u4E00-\u9FA5]/g,'')"
            @blur="nameLength"
          />
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnUserRealname }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">手机号码</span>
          <input
            v-model="userMobilephone"
            class="org-detail__body-userloginname-editinput"
            type="text"
            placeholder="请输入11位手机号码"
            maxlength="11"
            @blur="checkMobilePhone"
          />
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnUserMobilephone }}</span>
        </div>

        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">电子邮箱</span>
          <input
            v-model="userEmail"
            class="org-detail__body-userloginname-editinput"
            type="text"
            placeholder
            maxlength="50"
          />
          <b class="org-detail__body-userloginname-mustwrite">*</b>
        </div>
        <div class="org-detail__body-namewarning">
          <span>{{ warnUserEmail }}</span>
        </div>

        <h3 style="margin-left:90px">认证相关信息</h3>
        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">注册日期</span>
          [{{ createTime }}]
          <b class="org-detail__body-userloginname-mustwrite"></b>
        </div>
        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">审核日期</span>
          [{{ verifyDate }}]
          <span class="org-detail__body-userloginname">审核状态</span>
          <template v-if="verifyState">
            [{{
            verifystate[verifyState].ITEM_NAME }}]
          </template>
          <template v-else>[无]</template>
          <b class="org-detail__body-userloginname-mustwrite"></b>
        </div>
        <div class="org-detail__body-userloginname clearfix">
          <span class="org-detail__body-userloginname-span">缴费日期</span>
          [{{ payDate }}]
          <span class="org-detail__body-userloginname">缴费状态</span>
          <template v-if="payState">
            [{{ paystate[payState].ITEM_NAME }}]</template>
          <template v-else>[无]</template>
          <b class="org-detail__body-userloginname-mustwrite"></b>
        </div>
      </div>
    </div>
    <div class="dialog__footer">
      <a
        href="javascript:;"
        class="btn dialog__footer-btn dialog__footer-btn-ok"
        @click="registerBtnClicked"
      >保存</a>
      <a href="javascript:;"
        style="color:#3789BE;margin-left:40px "
        @click="backList">返回</a>
    </div>
    <global-uploader ref="upload"
      :attrdata="attrdata"
      @fileSuccess="fileSuccess"></global-uploader>
  </div>
</template>

<script>
  import Axios from "axios";
  import resolveApiRoute from "__libs/js/modules/resolve-api-route";
  import GlobalUploader from "__libs/components/GlobalUploader";
  export default {
    name: "org-detail",
    components: {
      GlobalUploader
    },

    data() {
      return {
        orgID: "",
        hospName: "",
        hospLevel: "",
        hospType: "",
        hospNature: "",
        deptName: "",
        deptType: "",
        addressDetail: "",
        hospPhone: "",
        licenPath: "",
        fileID: "",
        filePath: "",
        userRealname: "",
        userMobilephone: "",
        userEmail: "",

        payState: "",
        payDate: "",
        verifyState: "",
        verifyDate: "",
        createTime: "",
        createID: "",

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
        attrdata: [".png", ".jpg", ".jpeg", ".bmp", ".pdf"],

        paystate: [
          {
            ITEM_CODE: "0",
            ITEM_NAME: "待缴费"
          },
          {
            ITEM_CODE: "1",
            ITEM_NAME: "已缴费"
          }
        ],
        verifystate: [
          {
            ITEM_CODE: "0",
            ITEM_NAME: "待审核"
          },
          {
            ITEM_CODE: "1",
            ITEM_NAME: "审核通过"
          },
          {
            ITEM_CODE: "2",
            ITEM_NAME: "审核不通过"
          }
        ]
      };
    },
    watch: {
      hospName(val) {
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

      hospPhone(val) {
        if (val != "") {
          this.warnHospPhone = "";
        }
      },

      licenPath(val) {
        if (val != "") {
          this.warnLicenPath = "";
        }
      },

      userRealname(val) {
        if (val != "") {
          this.warnUserRealname = "";
        }
      },

      userMobilephone(val) {
        if (val.length != 11) {
          this.warnUserMobilephone = "请输入11位手机号";
        } else {
          this.warnUserMobilephone = "";
        }
      },

      userEmail(val) {
        if (val != "") {
          this.warnUserEmail = "";
        }
      },

      userAccount(val) {
        if (val != "") {
          this.warnUserAccount = "";
        }
      },

      userPasswd(val) {
        if (val.length < 6) {
          this.warnUserPasswd = "请设置6-20位密码";
        } else {
          this.warnUserPasswd = "";
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
      this.initData(this.$route.query.editdata);
    },

    methods: {
      upload() {
        this.$refs.upload.openUploader({
          fileID: this.fileID,
          targetFolder: "certificate"
        });
      },
      fileSuccess(res) {
        this.fileID = res.id;
        this.licenPath = res.name;
        this.filePath = res.filePath;
      },
      viewFile() {
        if (
          typeof this.filePath == "undefined" ||
          this.filePath == null ||
          this.filePath == ""
        ) {
          this.$showNotice("无效的文件路径！");
        } else {
          window.open(
            `/PdfViewer?filePath=${encodeURIComponent(
              encodeURIComponent(this.filePath)
            )}`
          );
        }
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

      initData(obj) {
        this.orgID = obj.ID;
        this.hospName = obj.HOSP_NAME;
        this.hospType = obj.HOSP_TYPE;
        this.hospNature = obj.HOSP_NATURE;
        this.deptName = obj.DEPT_NAME;
        this.deptType = obj.DEPT_TYPE;
        this.hospLevel = obj.HOSP_LEVEL;
        this.addressDetail = obj.ADDRESS_DETAIL;

        this.hospPhone = obj.HOSP_PHONE;
        this.licenPath = obj.FileName;
        this.fileID = obj.LICEN_PATH;
        this.filePath = obj.FilePath;
        this.userRealname = obj.USER_REALNAME;
        this.userMobilephone = obj.USER_MOBILEPHONE;
        this.userEmail = obj.USER_EMAIL;

        this.payState = obj.PAY_STATE;
        this.payDate = obj.PAY_DATE;
        this.verifyState = obj.VERIFY_STATE;
        this.verifyDate = obj.VERIFY_DATE;

        this.createID = obj.CREATE_USER_ID;
        this.createTime = obj.CREATE_TIME;
      },
      // 得到新的注册用户信息对象
      getNewRegisterInfo() {
        this.newRegisterInfo = Object.assign(
          {},
          {
            ID: this.orgID,
            HOSP_NAME: this.hospName.trim(),
            HOSP_TYPE: this.hospType.trim(),
            HOSP_NATURE: this.hospNature.trim(),
            DEPT_NAME: this.deptName.trim(),
            DEPT_TYPE: this.deptType.trim(),
            HOSP_LEVEL: this.hospLevel.trim(),
            ADDRESS_DETAIL: this.addressDetail.trim(),
            HOSP_PHONE: this.hospPhone.trim(),
            LICEN_PATH: this.fileID,
            FileName: this.licenPath.trim(),
            FilePath: this.filePath,

            USER_REALNAME: this.userRealname.trim(),
            USER_MOBILEPHONE: this.userMobilephone.trim(),
            USER_EMAIL: this.userEmail.trim(),
            PAY_STATE: this.payState,
            PAY_DATE: this.payDate,
            VERIFY_STATE: this.verifyState,
            VERIFY_DATE: this.verifyDate,
            CREATE_USER_ID: this.createID,
            CREATE_TIME: this.createTime
          }
        );
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
          this.warnHospType != "" ||
          this.warnHospNature != "" ||
          this.warnDeptType != ""
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
                this.warnUserAccount = "该用户已存在";
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
          Axios.post(resolveApiRoute("org-save"), this.newRegisterInfo).then(
            (res) => {
              if (res.data.Code === 0) {
                this.$showNotice("保存成功");
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
      },

      backList() {
        this.$router.push({ path: "/orginfo" });
      }
    }
  };
</script>

<style lang="scss">
  @import "~__libs/scss/lib-common-utils";

  .org-detail {
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
      .org-detail-select-dropdown {
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
