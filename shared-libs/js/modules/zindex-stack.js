// 判断当前是否有打开的覆盖层，列表不为空表示有，就禁止 body overflow 变回 visible
// 当前打开的所有覆盖层层级链，从低到高排序，间隔为2（多加一层用于遮罩）
let zIndexStack = [];

// 全局覆盖层（对话框，loading，notice）初始化层级
const initialZIndex = 999;

// get amount of stored z-index
function getTotalZIndex() {
  return zIndexStack.length;
}

// get the top-most z-index
function getTopZIndex() {
  return zIndexStack[zIndexStack.length - 1];
}

// get the next layer's index
function getNextZIndex() {
  return getTotalZIndex() === 0 ? initialZIndex : getTopZIndex() + 2;
}

// get mask layer's zindex(will be one layer right below the top layer)
function getNextMaskZIndex() {
  return getTopZIndex() - 1;
}

function pushZIndex(zIndex) {
  zIndexStack.push(zIndex);

  return zIndexStack.slice(0);
}

function pullZIndex() {
  zIndexStack.pop();

  return zIndexStack.slice(0);
}

export {
  initialZIndex,
  getTotalZIndex,
  getTopZIndex,
  getNextZIndex,
  getNextMaskZIndex,
  pushZIndex,
  pullZIndex
};
