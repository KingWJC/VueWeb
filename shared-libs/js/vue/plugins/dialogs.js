import BasicDialog from "__shared-libs/components/dialog/BasicDialog";
import ConfirmDialog from "__shared-libs/components/dialog/ConfirmDialog";

// usage:
// <basic-dialog
//   :display="displayDialog"
//   :dialogBody="'保存成功！'"
//   :dialogFooterCancelBtn="false"
//   @closeDialog="displayDialog=false"></basic-dialog>
export default class VueDialogs {
  // constructor () {}

  static installed = false;

  static install(Vue) {
    if (VueDialogs.installed) {
      return false;
    }

    VueDialogs.installed = true;

    // register global components respectively
    // basic-dialog can't be registered by it's name automatically, we should
    // manually specify it's name, because it's created via Vue.extend()
    Vue.component("basic-dialog", BasicDialog);
    Vue.component(ConfirmDialog.name, ConfirmDialog);
  }
}
