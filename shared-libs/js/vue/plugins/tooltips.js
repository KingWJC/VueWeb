import $ from "jquery";
import Tooltips from "__shared-libs/components/Tooltips";

// usage:
// <li v-tooltips:tips组件ref="String|Array<tips文本>"></li>
export default class VueTooltipsDirective {
  // constructor () {}

  static installed = false;

  static install(Vue) {
    if (VueTooltipsDirective.installed) {
      return false;
    }

    VueTooltipsDirective.installed = true;

    // 全局directive
    Vue.directive("tooltips", {
      bind: function(el, binding, vnode) {
        // set a reference to rendered Tooltips component
        $(el).on("mouseenter.tooltips", function() {
          let tipsComp = vnode.context.$refs[binding.arg];

          let domEl = $(el);
          let offset = domEl.offset();
          let width = domEl.width();
          let height = domEl.height();

          // 作为 data 属性绑定到元素，在 update 和 componentUpdated 期间修改，实现
          // 单事件数据共享
          //
          // @see https://vuejs.org/v2/guide/custom-directive.html#ad
          //
          // Apart from el, you should treat these arguments as read-only
          // and never modify them. If you need to share information across
          // hooks, it is recommended to do so through element’s dataset.
          let _tooltips = $(el).data("_tooltips");

          // 存储初始tips值
          if (!_tooltips) {
            _tooltips = Array.isArray(binding.value)
              ? binding.value
              : [binding.value];
            $(el).data("_tooltips", _tooltips);
          }

          // 传递 tips 内容到组件
          tipsComp.setContent(_tooltips);
          tipsComp.show({
            // 指令触发元素的偏移
            left: offset.left,
            top: offset.top,
            // 指令触发元素的宽高
            width,
            height
          });

          // tips 处于显示状态之后（必须在 display = true 之后调用）才
          // 可以计算自身内容尺寸
          tipsComp.$nextTick(() => {
            let tipsCon = $(tipsComp.$el).find(".tooltips__content");
            let tipsConWidth = tipsCon.width();
            let tipsConHeight = tipsCon.height();

            // 把计算出的尺寸传入，使得tips可以动态变换位置
            tipsComp.setTipsParams({
              height: tipsConHeight,
              width: tipsConWidth
            });
          });
        });

        $(el).on("mouseleave.tooltips", function() {
          let tipsComp = vnode.context.$refs[binding.arg];

          tipsComp.hide();
        });
      },

      // 指令所在vnode变化，tips相应也发生变化
      update: function(el, binding) {
        // TODO: tips值发生了变化才更新缓存
        $(el).data(
          "_tooltips",
          Array.isArray(binding.value) ? binding.value : [binding.value]
        );
      },

      // 上层组件树发生变化，tips相应也发生变化
      componentUpdated: function(el, binding) {
        // TODO: tips值发生了变化才更新缓存
        $(el).data(
          "_tooltips",
          Array.isArray(binding.value) ? binding.value : [binding.value]
        );
      },

      // 解绑事件
      unbind: function(el) {
        $(el).off("mouseenter.tooltips");
        $(el).off("mouseleave.tooltips");
      }
    });

    // 全局组件
    Vue.component(Tooltips.name, Tooltips);
  }
}
