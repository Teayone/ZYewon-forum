import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import routes from "./routes";
import { isEmpty } from "@/utils";
Vue.use(VueRouter);
const router = new VueRouter({
  linkExactActiveClass: "layui-this",
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
const loginPathList = ["login", "reg", "forget", "reset-pass"];
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("token");
  // 如果没有 token，并且访问的地址需要权限，则代表没有登录，vuex 的状态不用动
  if (isEmpty(token) && to.matched.some((record) => record.meta.requiresAuth)) {
    next({ name: "login" });
  } else if (isEmpty(token)) {
    // 如果没有 token 并且去往的页面不需要登陆权限就直接放行
    next();
  } else {
    // 有 token，并且已经设置为登陆状态了
    if (store.state.login.isLogin) {
      // 在登陆状态强行去往 登录、注册、找回密码页面时，直接前往 home 页
      if (loginPathList.includes(to.name)) {
        next({ name: "home" });
      } else {
        next();
      }
    } else {
      // 发起请求获取用户信息
      await store.dispatch("login/initLoginState");
      // ws 鉴权
      store.commit("ws/initWebSocket");
      // 如果获取到了，代表登陆了，直接跳转
      if (store.state.login.isLogin) {
        if (loginPathList.includes(to.name)) {
          next({ name: "home" });
        } else {
          next();
        }
      } else if (to.matched.some((record) => record.meta.requiresAuth)) {
        next({ name: "login" });
      } else {
        next();
      }
    }
  }
});

export default router;
