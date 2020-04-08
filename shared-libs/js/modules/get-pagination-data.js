// 重新计算和渲染翻页后的列表
// offset: 数组起点
// limit: 每页显示数
function getPaginationData(offset, limit, result) {
  // 共0个，返回空数组
  if (result.length === 0) {
    return [];
  }

  // 取第 -n 个，错误，修正offset
  if (offset < 0) {
    offset = 0;
  }

  // 共1个，取第1个，错误，修正offset
  if (offset > result.length - 1) {
    offset = 0;
  }

  let endIdx = offset + limit;

  if (endIdx < 0) {
    endIdx = 0;
  }

  if (endIdx >= result.length) {
    endIdx = result.length;
  }

  // 起点不能大于终点
  if (offset > endIdx) {
    endIdx = offset;
  }

  return result.slice(offset, endIdx);
}

export default getPaginationData;
