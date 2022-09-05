import store from "@/store";

import { isEmpty } from "@/utils";
const Login = () => import(/* webpackChunkName:'login' */ "@/views/Login.vue");
const Reg = () => import(/* webpackChunkName:'reg' */ "@/views/Reg.vue");
const Forget = () =>
  import(/* webpackChunkName:'forget' */ "@/views/Forget.vue");
const Home = () => import(/* webpackChunkName:'home' */ "@/views/Home.vue");

const routes = [
  {
    path: "/",
    meta: {
      title: "home",
    },
    component: Home,
    children: [
      {
        path: "",
        name: "home",
        component: () =>
          import(
            /* webpackChunkName:'channels' */ "@/views/Channels/Channels.vue"
          ),
      },
      {
        path: "/index/:catalog",
        name: "catalog",
        component: () =>
          import(
            /* webpackChunkName:'template1' */ "@/views/Channels/Template1.vue"
          ),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
    },
    component: Login,
  },
  {
    path: "/reg",
    name: "reg",
    meta: {
      title: "注册",
    },
    component: Reg,
    beforeEnter(to, from, next) {
      if (from.name === "login") {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/forget",
    name: "forget",
    meta: {
      title: "忘记密码",
    },
    component: Forget,
  },
  {
    path: "/reset-pass",
    name: "reset-pass",
    meta: {
      title: "重置密码",
    },
    component: () =>
      import(/* webpackChunkName:'reset-pass' */ "@/views/ResetPass.vue"),
  },
  {
    path: "/add",
    name: "add",
    component: () =>
      import(/* webpackChunkName:'add' */ "@/components/Content/src/Add.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/edit/:tid",
    name: "edit",
    component: () =>
      import(/* webpackChunkName:'edit' */ "@/components/Content/src/Edit.vue"),
    meta: {
      requiresAuth: true,
    },
    beforeEnter: (to, from, next) => {
      // 必须从 detail 或者 mypost 页面并且传递了 post 文章数据，并且当前文章没有结帖才会进入编辑文章页面
      if (
        ["detail", "mypost"].includes(from.name) &&
        to.params.post &&
        +to.params.post.isEnd === 0
      ) {
        next();
      } else {
        // 用户在 edit 页面刷新
        let editData = localStorage.getItem("editData") || "";
        if (!isEmpty(editData)) {
          editData = JSON.parse(editData);
          if (+editData.isEnd === 0) {
            next();
          } else {
            next({ name: "home" });
          }
        } else {
          next({ name: "home" });
        }
      }
    },
  },
  {
    path: "/detail/:tid",
    name: "detail",
    component: () => import("@/components/Content/src/Detail.vue"),
  },
  {
    path: "/user/:id",
    // props: true,
    name: "user",
    component: () => import(/* webpackChunkName:'user' */ "@/views/User.vue"),
  },
  {
    path: "/center",
    meta: {
      title: "",
      requiresAuth: true,
    },
    component: () =>
      import(/* webpackChunkName:'center' */ "@/views/Center.vue"),
    beforeEnter: (to, from, next) => {
      const isLogin = store.state.login.isLogin;
      if (isLogin) {
        next();
      } else {
        next({ name: "login" });
      }
    },
    children: [
      {
        path: "",
        name: "center",
        component: () => import("@/components/User/Center.vue"),
      },
      {
        path: "set",
        component: () => import("@/components/User/Settings.vue"),
        children: [
          {
            path: "",
            name: "info",
            component: () => import("@/components/User/common/MyInfo.vue"),
          },
          {
            path: "pic",
            name: "pic",
            component: () => import("@/components/User/common/PicUpload.vue"),
          },
          {
            path: "passwd",
            name: "passwd",
            component: () => import("@/components/User/common/Passwd.vue"),
          },
          {
            path: "account",
            name: "account",
            component: () => import("@/components/User/common/Accounts.vue"),
          },
        ],
      },
      {
        path: "post",
        component: () => import("@/components/User/Post.vue"),
        children: [
          {
            path: "",
            name: "mypost",
            component: () => import("@/components/User/common/MyPost.vue"),
          },
          {
            path: "mycollection",
            name: "mycollection",
            component: () =>
              import("@/components/User/common/MyCollection.vue"),
          },
        ],
      },
      {
        path: "others",
        name: "others",
        component: () => import("@/components/User/Others.vue"),
      },
      {
        path: "msg",
        name: "msg",
        component: () => import("@/components/User/Msg.vue"),
      },
    ],
  },
  {
    path: "/confirm",
    name: "confirm",
    component: () => import("@/views/ConfirmUsername.vue"),
  },
  {
    path: "/404",
    component: () => import("@/views/NotFound.vue"),
  },
  {
    path: "*",
    redirect: "/404",
  },
];

export default routes;
