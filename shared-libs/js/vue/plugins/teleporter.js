import Teleporter from "__shared-libs/components/Teleporter";

// usage:
// <teleporter>
//   <abc-dialog></abc-dialog>
// </teleporter>
// the dom element of component `abc-dialog` will be appended down to <body>
export default class VueTeleporter {
  // constructor () {}

  static installed = false;

  static install(Vue) {
    if (VueTeleporter.installed) {
      return false;
    }

    VueTeleporter.installed = true;

    Vue.component("teleporter", Teleporter);
  }
}
