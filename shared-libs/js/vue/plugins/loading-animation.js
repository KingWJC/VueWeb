import LoadingAnimation from "__shared-libs/components/LoadingAnimation";

// usage:
// <loading-animation></loading-animation>
export default class VueLoadingAnimation {
  // constructor () {}

  static installed = false;

  static install(Vue) {
    if (VueLoadingAnimation.installed) {
      return false;
    }

    VueLoadingAnimation.installed = true;

    // register global components respectively
    // basic-dialog can't be registered by it's name automatically, we should
    // manually specify it's name, because it's created via Vue.extend()
    Vue.component("loading-animation", LoadingAnimation);
  }
}
