/**
 *  echart图形tooltip的圆点
 *  @param {String} color 圆点颜色
 *  @param {String} type 圆点类型，为空的时候 实心 不为空的时候 空心
 *  @return {String}
 */
export default function(color, type) {
  let extraStyles = !type
    ? `width: 9px;
      height: 9px;
      background-color: ${color};`
    : `width: 6px;
      height: 6px;
      border: 2px solid ${color};`;

  return `<span style="
    display: inline-block;
    margin-right: 5px;
    border-radius: 10px;
    ${extraStyles}
  "></span>`;
}
