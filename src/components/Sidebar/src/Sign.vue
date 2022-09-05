<template>
  <div class="fly-panel fly-signin">
    <div class="fly-panel-title">
      签到
      <i class="fly-mid"></i>
      <a
        href="javascript:;"
        class="fly-link"
        id="LAY_signinHelp"
        @click="showInfo"
        >说明</a
      >
      <i class="fly-mid"></i>
      <a
        href="javascript:;"
        class="fly-link"
        id="LAY_signinTop"
        @click="showList = true"
      >
        活跃榜
        <span class="layui-badge-dot"></span>
      </a>
      <span
        class="fly-signin-days"
        v-show="
          $store.state.login.userinfo.isSign || $store.state.login.isLogin
        "
      >
        已连续签到
        <cite>{{ count }}</cite
        >天
      </span>
    </div>

    <div class="fly-panel-main fly-signin-main">
      <template v-if="!$store.state.login.userinfo.isSign">
        <button
          class="layui-btn layui-btn-danger"
          id="LAY_signin"
          @click="handleSign"
        >
          今日签到
        </button>
        <span>
          可获得
          <cite>{{ favs }}</cite
          >飞吻
        </span>
      </template>
      <!-- 已签到状态 -->
      <template v-else>
        <button class="layui-btn layui-btn-disabled">今日已签到</button>
        <span
          >获得了<cite>{{ favs }}</cite
          >飞吻</span
        >
      </template>
    </div>

    <!-- 签到说明 -->
    <sign-info :isShow="isShow" @closeModal="close" />
    <!-- 签到榜 -->
    <sign-list :isShow="showList" @closeModal="close" />
  </div>
</template>

<script>
import SignInfo from "./SignInfo.vue";
import SignList from "./SignList.vue";
import { userSign } from "@/api/user";
import { isEmpty } from "@/utils";
export default {
  components: { SignInfo, SignList },
  data() {
    return {
      isShow: false,
      showList: false,
    };
  },
  methods: {
    // 签到逻辑
    async handleSign() {
      // 未登录弹出提示框
      const isLogin = this.$store.state.login.isLogin;
      if (!isLogin) {
        this.$pop.show({ msg: "请登录后再签到", type: "shake" });
      }
      // 签到
      const res = await userSign();
      if (res.code !== 200) {
        return this.$alert.show({ msg: "签到失败" });
      }
      // 签到成功更新前端状态积分
      const user = this.$store.state.login.userinfo;
      user.favs = res.favs;
      user.count = res.count;
      user.isSign = true;
      this.$store.commit("login/SET_USERINFO", user);
      this.$pop.show({ msg: "签到成功" });
    },
    // 点击说明展示模态框
    showInfo() {
      this.isShow = true;
    },
    close() {
      this.isShow = false;
      this.showList = false;
    },
  },
  computed: {
    favs() {
      const count = this.count;
      let favs = 0;
      if (count < 5) {
        favs = 5;
      } else if (count >= 5 && count < 15) {
        favs = 10;
      } else if (count >= 15 && count < 30) {
        favs = 15;
      } else if (count >= 30 && count < 100) {
        favs = 20;
      } else if (count >= 100 && count < 365) {
        favs = 30;
      } else if (count >= 365) {
        favs = 50;
      }
      return favs;
    },
    count() {
      const userinfo = this.$store.state.login.userinfo;
      if (!isEmpty(userinfo)) {
        if (!isEmpty(userinfo.count)) {
          return userinfo.count;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    },
  },
};
</script>

<style lang="less">
// @keyframes bounceIn {
//   0% {
//     opacity: 0;
//     transform: scale(0.5);
//   }
//   100% {
//     opacity: 1;
//     transform: scale(1);
//   }
// }

.mask {
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 20000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.layui-layer.layui-layer-page.info.active {
  position: fixed;
  top: 50% !important;
  left: 50%;
  width: 300px;
  height: 480px;
  margin-top: -240px;
  margin-left: -150px;
  background: #fff;
  z-index: 21000;

  &.active {
    animation-fill-mode: both; // 设置动画结尾时如何将样式应用其目标
    animation-duration: 0.2s;
    animation-name: bounceIn;
  }
  .layui-layer-title {
    height: 42px;
    line-height: 42px;
    padding-left: 20px;
    padding-right: 20px;
    color: #333;
    background-color: #f8f8f8;
  }
  .layui-layer-content {
    padding: 20px;
  }
}
</style>
