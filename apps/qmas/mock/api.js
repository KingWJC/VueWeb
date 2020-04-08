import logInfo from "./api/log-info";
import userAutoImportUser from "./api/user-auto-import-user";
import userChangePwd from "./api/user-change-pwd";
import userStatus from "./api/user-status";
import userClearPwd from "./api/user-clear-pwd";
import userDelete from "./api/user-delete";
import userInfo from "./api/user-info";
import userSave from "./api/user-save";
import userJurisdiction from "./api/user-jurisdiction";
import userCheckUseName from "./api/user-check-use-name";
import userSetPwd from "./api/user-set-pwd";
import orgDelete from "./api/org-delete";
import orgInfo from "./api/org-info";
import orgSave from "./api/org-save";
import orgPay from "./api/org-pay-state";
import orgVerify from "./api/org-verify-state";
import roleInfoAuthorSetting from "./api/role-info-author-setting";
import roleInfoFunc from "./api/role-info-func";
import roleInfoList from "./api/role-info-list";
import roleInfoOperation from "./api/role-info-operation";
import roleInfoRepeatName from "./api/role-info-repeat-name";
import selectDictValue from "./api/select-dict-value";
import registerInfo from "./api/register-info";
import trainManage from "./api/train-manage";
import trainManageDelete from "./api/train-manage-delete";
import trainManageSelect from "./api/train-manage-select";
import trainCourse from "./api/train-course";
import templateInfoList from "./api/template-info-list";
import indexInfoList from "./api/index-info-list";
import examineInfoList from "./api/examine-info-list";
import indexBaseList from "./api/index-base-list";
import indexmaterialList from "./api/index-material-list";
import indexTemplateDownload from "./api/index-template-download";
import indexUploadData from "./api/index-upload-data";
import indexSubmitData from "./api/index-submit-data";
import indexSubmitBase from "./api/index-submit-base";
import fileDownload from "./api/file-download";
import templateInfoAdd from "./api/template-info-add";
import templateInfoDel from "./api/template-info-del";
import expertAuditManage from "./api/expert-audit-manage";
import IndexScene from "./api/index-scene-list";
import expertAuditProgress from "./api/expert-audit-progress";
import resultConfirm from "./api/result-confirm";
import assigmentExpert from "./api/assigment-expert";
import expertAuditInfo from "./api/expert-audit-info";
import expertAuditDetail from "./api/expert-audit-detail";
import expertAuditSubmit from "./api/expert-audit-submit";
import fileUpload from "./api/file-upload";
import fileMerge from "./api/file-merge";
import cerApply from "./api/cer-apply";
import fileList from "./api/file-list";
import fileDelete from "./api/file-delete";
import MaterialExamine from "./api/material-examine-list";
import MaterialScoringResult from "./api/material-scoring-result";
import SceneExamine from "./api/scene-examine-list";
import SceneScoringResult from "./api/scene-scoring-result";
import MaterialScoringList from "./api/material-scoring-list";
import MaterialScoringSave from "./api/material-scoring-save";
import MaterialScoringSubmit from "./api/material-scoring-submit";
import SceneScoringList from "./api/scene-scoring-list";
import SceneScoringSave from "./api/scene-scoring-save";
import DataScoringList from "./api/data-scoring-list";
import DataScoringSave from "./api/data-scoring-save";
import DataExamine from "./api/data-examine-list";
import DataScoringResult from "./api/data-scoring-result";
import ExamineDiagSubmit from "./api/examine-dialog-submit";
import ScenePersonalAllotment from "./api/scene-person-allotment";
import cerSubmit from "./api/cer-submit";
import certificationManage from "./api/certification-manage";
import certificationDetail from "./api/certification-detail";
import certificationReapply from "./api/certification-reapply";
import cerCurrent from "./api/cer-current";
import cerExist from "./api/cer-exist";
import cerDelete from "./api/cer-delete";
import dictInfo from "./api/dict-info";
import dictUpdate from "./api/dict-update";
import dictSetValid from "./api/dict-set-valid";
import dictSetOrder from "./api/dict-set-order";
import OpinionUserData from "./api/opinion-userdata-get";
import OpinionSubmit from "./api/opinion-userdata-submit";
import OpinionManageData from "./api/opinion-manage-get";
import OpinionManageFbData from "./api/opinion-manage-submit";
import CerViewVerify from "./api/cer-view-verify";
import TrainManageOrder from "./api/train-manage-order";
import LogManage from "./api/log-manage-get";

export default {
  "scene-person-allotment": ScenePersonalAllotment,
  "examine-dialog-submit": ExamineDiagSubmit,
  "data-scoring-result": DataScoringResult,
  "data-examine-list": DataExamine,
  "data-scoring-list": DataScoringList,
  "data-scoring-save": DataScoringSave,
  "scene-scoring-list": SceneScoringList,
  "scene-scoring-save": SceneScoringSave,
  "material-scoring-submit": MaterialScoringSubmit,
  "material-scoring-save": MaterialScoringSave,
  "material-scoring-list": MaterialScoringList,
  "scene-scoring-result": SceneScoringResult,
  "scene-examine-list": SceneExamine,
  "material-scoring-result": MaterialScoringResult,
  "material-examine-list": MaterialExamine,
  "index-scene-list": IndexScene,
  "template-info-del": templateInfoDel,
  "template-info-add": templateInfoAdd,
  "file-download": fileDownload,
  "index-material-list": indexmaterialList,
  "index-template-download": indexTemplateDownload,
  "index-upload-data": indexUploadData,
  "index-submit-data": indexSubmitData,
  "index-submit-base": indexSubmitBase,
  // 项目情况
  "index-base-list": indexBaseList,
  // 审核标准
  "examine-info-list": examineInfoList,

  // 角色管理 角色名是否重复
  "role-info-repeat-name": roleInfoRepeatName,

  // 角色管理 删除操作
  "role-info-operation": roleInfoOperation,

  // 角色管理 列表
  "role-info-list": roleInfoList,

  // 角色管理 弹框列表
  "role-info-func": roleInfoFunc,

  // 角色管理
  "role-info-author-setting": roleInfoAuthorSetting,

  // 用户权限管理空密码第一次登入用户密码设置
  "user-set-pwd": userSetPwd,

  // 用户管理--验证用户名是否存在
  "user-check-use-name": userCheckUseName,

  // 用户管理--角色设置
  "user-jurisdiction": userJurisdiction,

  // 用户管理--表格
  "user-info": userInfo,

  // 用户保存
  "user-save": userSave,

  // 用户管理--删除
  "user-delete": userDelete,

  // 用户管理--清空密码
  "user-clear-pwd": userClearPwd,

  // 用户管理--启用停用
  "user-status": userStatus,

  // 用户权限管理修改密码
  "user-change-pwd": userChangePwd,

  // 用户管理--导入账号联想输入
  "user-auto-import-user": userAutoImportUser,

  // 日志管理
  "log-info": logInfo,

  // 机构管理--表格
  "org-info": orgInfo,

  // 机构保存
  "org-save": orgSave,

  // 机构管理--删除
  "org-delete": orgDelete,
  // 机构管理--删除
  "org-pay-state": orgPay,
  // 机构管理--删除
  "org-verify-state": orgVerify,

  // 医院等级下拉框
  "select-dict-value": selectDictValue,

  // 注册
  "register-info": registerInfo,

  // 培训管理列表
  "train-manage": trainManage,

  // 培训课程删除
  "train-manage-delete": trainManageDelete,

  // 赔训课程下拉框
  "train-manage-select": trainManageSelect,

  // 培训课程
  "train-course": trainCourse,

  // 模板管理: 模板展示
  "template-info-list": templateInfoList,

  //
  "index-info-list": indexInfoList,

  // 专家审核管理
  "expert-audit-manage": expertAuditManage,

  "file-upload": fileUpload,
  "file-merge": fileMerge,
  "cer-apply": cerApply,
  "file-list": fileList,
  "file-delete": fileDelete,

  // 专家组审核进度
  "expert-audit-progress": expertAuditProgress,

  // 最终结果确认
  "result-confirm": resultConfirm,

  // 分配专家
  "assigment-expert": assigmentExpert,

  // 专家审核
  "expert-audit-info": expertAuditInfo,

  // 专家审核详情
  "expert-audit-detail": expertAuditDetail,

  // 专家审核结果
  "expert-audit-submit": expertAuditSubmit,

  "cer-submit": cerSubmit,

  // 认证管理
  "certification-manage": certificationManage,

  // 认证详情
  "certification-detail": certificationDetail,

  // 认证状态不通过重新申请
  "certification-reapply": certificationReapply,
  "cer-current": cerCurrent,
  "cer-exist": cerExist,
  "cer-delete": cerDelete,
  // 字典管理
  "dict-info": dictInfo,
  "dict-update": dictUpdate,
  "dict-set-valid": dictSetValid,
  "dict-set-order": dictSetOrder,

  // 意见
  "opinion-userdata-get": OpinionUserData,
  "opinion-userdata-submit": OpinionSubmit,
  "opinion-manage-get": OpinionManageData,
  "opinion-manage-submit": OpinionManageFbData,

  // 证书查看
  "cer-view-verify": CerViewVerify,
  "train-manage-order": TrainManageOrder,
  "log-manage-get": LogManage
};
