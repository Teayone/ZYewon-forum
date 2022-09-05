import { getUserInfo } from "@/api/user";
export default {
  namespaced: true,
  state() {
    return {
      token: "",
      isLogin: false,
      userinfo: {},
    };
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_USERINFO(state, data) {
      state.userinfo = data;
      localStorage.setItem("userinfo", JSON.stringify(state.userinfo));
    },
    SET_ISLOGIN(state, value) {
      state.isLogin = value;
    },
  },
  actions: {
    async initLoginState(context) {
      try {
        const res = await getUserInfo();
        if (res.code === 200) {
          context.commit("SET_ISLOGIN", true);
          context.commit("SET_TOKEN", localStorage.getItem("token"));
          context.commit("SET_USERINFO", res.data);
        } else {
          context.commit("SET_ISLOGIN", false);
          context.commit("SET_TOKEN", "");
          context.commit("SET_USERINFO", {});
        }
      } catch (error) {
        context.commit("SET_ISLOGIN", false);
        context.commit("SET_TOKEN", "");
        context.commit("SET_USERINFO", {});
      }
    },
  },
};
