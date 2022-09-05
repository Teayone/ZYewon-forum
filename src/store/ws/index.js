import WebSocketClient from "@/config/websocket";

export default {
  namespaced: true,
  state() {
    return {
      ws: null,
      num: 0,
    };
  },
  mutations: {
    initWebSocket(state, config) {
      state.ws = new WebSocketClient(config);
      state.ws.init();
    },
    setMessage(state, value) {
      state.num = value;
    },
  },
  actions: {
    onMessage({ commit }, msg) {
      commit("setMessage", msg);
    },
  },
};
