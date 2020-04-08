export default {
  state: {
    // 日期范围
    dateRange: null
  },
  mutations: {
    CHANGE_DATE_RANGE(state, dateRange) {
      state.dateRange = dateRange;
    }
  },
  actions: {
    // payload: {startDate, endDate}
    changeDateRange({ commit }, payload) {
      commit("CHANGE_DATE_RANGE", Object.assign({}, payload));
    }
  },
  getters: {
    dateRange(state) {
      return state.dateRange;
    }
  }
};
