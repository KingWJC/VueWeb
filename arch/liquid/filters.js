// json 序列化filter（与后端完全统一）
function to_json(obj) {
  return JSON.stringify(obj);
}

export { to_json };
