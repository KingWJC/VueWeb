// 检查一个鼠标事件是否发生在元素内部（含border，不含box-shadow等）
export default function(evt, domEl) {
  let rect = domEl.getBoundingClientRect();
  let clientX = evt.clientX;
  let clientY = evt.clientY;

  return (
    clientX >= rect.left &&
    clientX <= rect.left + rect.width &&
    clientY >= rect.top &&
    clientY <= rect.top + rect.height
  );
}
