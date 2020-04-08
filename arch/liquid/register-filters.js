// 注册 liquid filters
export default (engine, filtersMap) => {
  for (let filter in filtersMap) {
    engine.registerFilter(filter, filtersMap[filter]);
  }
};
