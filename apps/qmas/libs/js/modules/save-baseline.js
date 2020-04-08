import Axios from "axios";
import Config from "./config";

/**
 * @param {Number} kpiId 指标id
 * @param {String} kpiCode 指标code
 * @param {Number} setType 保存基线的类型
 * @param {String} value 基线值
 * @param {Number} display 基线是否显示
 * @param {Object} extraParams 额外的参数集，比如患者分组 id
 */
export default (kpiId, kpiCode, setYpe, value, display, extraParams) => {
  let params = {
    Id: kpiId,
    Code: kpiCode,
    SetType: setYpe,
    Value: value,
    CheckBoxType: display
  };

  if (typeof extraParams === "object") {
    params = Object.assign(params, extraParams);
  }

  return Axios.put(`${Config.API_PREFIX}/SetBaseLine`, null, { params });
};
