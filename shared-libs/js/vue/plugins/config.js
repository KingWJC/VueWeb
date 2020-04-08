// usage:
// {{ $config.API.cards }} -> /api/v1/cards/
export default class VueConfig {
  // constructor () {}

  static installed = false;

  static install(Vue, config) {
    if (VueConfig.installed) {
      return false;
    }

    VueConfig.installed = true;

    Object.defineProperty(Vue.prototype, "$config", {
      get: () => config
    });
  }
}
