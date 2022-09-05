export default {
  namespaced: true,
  state() {
    return {
      sid: "",
    };
  },
  mutations: {
    SET_SID(state, sid) {
      state.sid = sid;
    },
  },
};
