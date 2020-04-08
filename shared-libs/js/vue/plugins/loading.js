import Vue from "vue";
import Loading from "__shared-libs/components/Loading";

import {
  requestOverlay,
  removeOverlay
} from "__shared-libs/js/modules/overlay";

import {
  getNextZIndex,
  pushZIndex,
  pullZIndex
} from "__shared-libs/js/modules/zindex-stack";

import getDomSize from "__shared-libs/js/modules/get-dom-size";
import toggleBodyOverflow from "__shared-libs/js/modules/toggle-body-overflow";

// return a instance based on mixined Loading module
function wrapComponent() {
  return new Vue({
    data() {
      return {
        logicClassName: null,
        loadingStyles: null
      };
    },

    render(h) {
      return h(Loading, {
        props: {
          logicClassName: this.logicClassName,
          loadingStyles: this.loadingStyles
        }
      });
    }
  });
}

// means how many times the $showLoading() has been invoked
let locker = 0;
// a Vue instance
let vm = null;

export default class VueLoading {
  static installed = false;

  static install(Vue) {
    if (VueLoading.installed) {
      return false;
    }

    VueLoading.installed = true;

    Vue.prototype = Object.assign(Vue.prototype, {
      // if 'locker !== 0' means vm is exsited, we need't to establish a vm
      // instance, neither append a child element to body just use
      // them(dom&vm instance) already exsisted the 'loacker++' means more
      // than one place used, or need to establish instance and append child
      // element to target parent
      $showLoading: () => {
        if (locker === 0) {
          let zIndex = getNextZIndex();

          pushZIndex(zIndex);

          vm = wrapComponent();

          requestOverlay({
            opacity: vm.dialogMaskOpacity
          });

          vm.$mount();
          document.body.appendChild(vm.$el);

          vm.$nextTick(() => {
            let domSize = getDomSize(vm.$el);

            vm.loadingStyles = {
              // 动画位置不在正中央，所以我们偏移一倍距离，而非二分之一
              "margin-left": `${-domSize.width}px`,
              "z-index": zIndex
            };
          });
        }

        locker++;

        toggleBodyOverflow();
      },

      // 'if locker > 0',means one or more vm instance and dom exsisted,
      // when use $hideLoading ,we need to reduce locker to one,
      // indicatily vm instance and element used place is reduce to one
      // until the 'locker===0',means there are no place use them ,
      // and remove dom and destroy vm instance
      $hideLoading: () => {
        if (locker === 0) {
          return;
        }

        if (locker > 0) {
          locker--;
        }

        if (locker === 0) {
          pullZIndex();
          removeOverlay();
          toggleBodyOverflow();

          document.body.removeChild(vm.$el);
          vm.$destroy(true);
          vm = null;
        }
      }
    });
  }
}
