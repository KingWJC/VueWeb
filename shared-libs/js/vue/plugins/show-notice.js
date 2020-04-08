import Vue from "vue";
import Notice from "__shared-libs/components/Notice";
import getDomSize from "__shared-libs/js/modules/get-dom-size";
import { getNextZIndex } from "__shared-libs/js/modules/zindex-stack";

function wrapComponent({ timeout, noticeType, noticeText, logicClassName }) {
  return new Vue({
    data() {
      return {
        timeout,
        noticeType,
        noticeText,
        logicClassName,
        noticeStyles: null
      };
    },

    render(h) {
      return h(Notice, {
        props: {
          timeout: this.timeout,
          noticeType: this.noticeType,
          noticeText: this.noticeText,
          logicClassName: this.logicClassName,
          noticeStyles: this.noticeStyles
        },

        // vm.$on can't be used outside the 'render' function to add
        // listeners to events emitted from within child components!
        on: {
          removeNotice: () => {
            // throughly destroy the instance then remove it's DOM Node
            this.$el.parentNode.removeChild(this.$el);
            this.$destroy(true);
          }
        }
      });
    }
  });
}

// usage:
// this.$showNotice({timeout: 1500, noticeText: 'blabla', noticeType: 'failed'})
// this.$showNotice('blabla') -> will use 'successful' as noticeType
// this.$showNotice('blabla', 'failed') -> will use 'failed' as noticeType
// the dom node of `notice` will be appended as the last child of <body>
export default class VueShowNotice {
  // constructor () {}

  static installed = false;

  static install(Vue) {
    if (VueShowNotice.installed) {
      return false;
    }

    VueShowNotice.installed = true;

    Vue.prototype.$showNotice = (noticeText, noticeType = "successful") => {
      let opts;

      // use full format config: {x:n, y:z}
      if (typeof noticeText === "object") {
        opts = noticeText;
      } else if (typeof noticeText === "string") {
        opts = {
          noticeText,
          noticeType
        };
      }

      const vm = wrapComponent(opts);
      vm.$mount();
      document.body.appendChild(vm.$el);

      // notice不需要遮罩，也不需要锁定 body的 overflow）
      // 由于该组件异步关闭，我们只需要获得推送层级之后的最新层级，确保其位于
      // 当前视图最顶层即可，否则其他对话框不会被关闭(zindex 链还有值)，
      // 不需要存储层级到 zindex 链
      let zIndex = getNextZIndex();

      vm.$nextTick(() => {
        let domSize = getDomSize(vm.$el);

        vm.noticeStyles = {
          "margin-left": `${-domSize.width / 2}px`,
          "z-index": zIndex
        };
      });
    };
  }
}
