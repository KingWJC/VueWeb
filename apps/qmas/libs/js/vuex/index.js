import Vue from "vue";
import Vuex from "vuex";
import dateRange from "./date-range";
import taskCount from "./task-count";
import permission from "./permission";

Vue.use(Vuex);

const modules = {
  "task-count": taskCount,
  "date-range": dateRange,
  permission: permission
};

export default new Vuex.Store({ modules });
