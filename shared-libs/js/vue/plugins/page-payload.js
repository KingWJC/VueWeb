// usage:
// this.$pagePayload.ITEM_TYPE_CODE -> [{...}]
export default class VuePagePayload {
  // constructor () {}

  static installed = false;

  static install(Vue, pagePayload) {
    if (VuePagePayload.installed) {
      return false;
    }

    VuePagePayload.installed = true;

    Object.defineProperty(Vue.prototype, "$pagePayload", {
      get: () => pagePayload
    });
  }
}
