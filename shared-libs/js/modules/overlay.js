import Vue from "vue";
import {
  getTotalZIndex,
  getNextMaskZIndex
} from "__shared-libs/js/modules/zindex-stack";

// 对话框遮罩单例
let vm = null;

// 为一个对话框实例请求遮罩
// 如果不存在遮罩单例则新建，否则复用并更新z-index
function requestOverlay({ opacity }) {
  if (!vm) {
    vm = new Vue({
      data() {
        return {
          opacity: 0.5,
          zIndex: 1
        };
      },

      render(h) {
        return h("div", {
          class: "overlay",
          style: {
            background: `rgba(0,0,0, ${this.opacity})`,
            zIndex: this.zIndex
          }
        });
      }
    });

    vm.$mount();
    document.body.appendChild(vm.$el);
  }

  // mask should be one layer lower than the current open dialog.
  vm.zIndex = getNextMaskZIndex();
  vm.opacity = opacity;
}

// 销毁遮罩实例
// 如果仍然有对话框存在，则仅仅更新z-index
// 直到最后一个对话框被关闭之后才销毁遮罩实例
// 必须于 pullZIndex 之后被调用，层级才能同步
function removeOverlay() {
  if (!vm) {
    return;
  }

  // only reduce it's z-index when there are still open dialogs
  if (getTotalZIndex() > 0) {
    vm.zIndex = getNextMaskZIndex();
  } else {
    document.body.removeChild(vm.$el);
    vm.$destroy(true);
    vm = null;
  }
}

export { requestOverlay, removeOverlay };
