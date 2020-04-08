import SelectDropdownV2 from "__shared-libs/components/select-dropdown/SelectDropdownV2";

// usage:
// <select-dropdown
//   v-model="cachedDocters"
//   placeholder="请输入医生关键字"
//   label="DOCTOR_NAME"
//   trackBy="DOCTOR_CODE"
//   :disabled="availDoctors.length===0"
//   :options="availDoctors"
//   :multiple="true"
//   :dropDownMaxHeight="250"
//   :searchable="true">
// </select-dropdown>
export default class VueSelectDropdownV2 {
  // constructor () {}

  static installed = false;

  static install(Vue) {
    if (VueSelectDropdownV2.installed) {
      return false;
    }

    VueSelectDropdownV2.installed = true;

    Vue.component("select-dropdown-v2", SelectDropdownV2);
  }
}
