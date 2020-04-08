import Config from "__libs/js/modules/config";

export default {
  state: {
    taskCount: Config.USER.TaskCount
  },
  mutations: {
    CHANGE_TASK_COUNT(state, count) {
      state.taskCount = count;
    }
  },
  getters: {
    taskCount(state) {
      return state.taskCount;
    }
  },
  actions: {
    changeTaskCount({ commit }, count) {
      commit("CHANGE_TASK_COUNT", count);
    }
  }
};
