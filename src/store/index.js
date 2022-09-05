import Vue from "vue";
import Vuex from "vuex";
import login from "./login";
import global from "./global";
import ws from "./ws";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    login,
    global,
    ws,
  },
});
