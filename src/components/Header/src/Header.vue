<template>
  <div class="fly-header layui-bg-black">
    <div class="layui-container">
      <router-link class="fly-logo logo-img" :to="{ name: 'home' }">
        <img src="~@/assets/img/logo.png" alt="logo" />
      </router-link>
      <ul class="layui-nav fly-nav layui-hide-xs">
        <li class="layui-nav-item layui-this">
          <router-link :to="{ name: 'home' }">
            <i class="iconfont icon-jiaoliu"></i>交流
          </router-link>
        </li>
        <li class="layui-nav-item">
          <a href="case/case.html">
            <i class="iconfont icon-iconmingxinganli"></i>案例
          </a>
        </li>
        <li class="layui-nav-item">
          <a href="https://layuion.com/" target="_blank">
            <i class="iconfont icon-ui"></i>框架
          </a>
        </li>
      </ul>

      <ul class="layui-nav fly-nav-user">
        <!-- 未登入的状态 -->
        <template v-if="!$store.state.login.isLogin">
          <li class="layui-nav-item">
            <router-link
              class="iconfont icon-touxiang layui-hide-xs"
              :to="{ path: '/404' }"
            ></router-link>
          </li>
          <li class="layui-nav-item">
            <router-link :to="{ name: 'login' }">登入</router-link>
          </li>
          <li class="layui-nav-item">
            <router-link :to="{ name: 'reg' }">注册</router-link>
          </li>
          <li class="layui-nav-item layui-hide-xs">
            <a
              href
              onclick="layer.msg('正在通过QQ登入', {icon:16, shade: 0.1, time:0})"
              title="QQ登入"
              class="iconfont icon-qq"
            ></a>
          </li>
          <li class="layui-nav-item layui-hide-xs">
            <a
              href
              onclick="layer.msg('正在通过微博登入', {icon:16, shade: 0.1, time:0})"
              title="微博登入"
              class="iconfont icon-weibo"
            ></a>
          </li>
        </template>
        <template v-else>
          <!-- 登入后的状态 -->

          <li class="layui-nav-item" @click.stop="showNavList" ref="navItem">
            <a class="fly-nav-avatar" href="javascript:;">
              <cite class="layui-hide-xs">{{
                $store.state.login.userinfo.nickname
              }}</cite>
              <!-- <i
              class="iconfont icon-renzheng layui-hide-xs"
              title="认证信息：layui 作者"
            ></i> -->
              <i
                class="layui-badge fly-badge-vip layui-hide-xs"
                v-if="$store.state.login.userinfo.isVIP"
                >VIP{{ $store.state.login.userinfo.isVIP }}</i
              >
              <img :src="$store.state.login.userinfo.pic || defaultAvatar" />
            </a>
            <dl
              class="layui-nav-child layui-anim layui-anim-upbit"
              v-show="showNav"
            >
              <dd>
                <router-link :to="{ name: 'center' }">
                  <i class="layui-icon">&#xe620;</i>
                  基本设置
                </router-link>
              </dd>
              <dd>
                <a href="user/message.html"
                  ><i class="iconfont icon-tongzhi"></i>我的消息</a
                >
              </dd>
              <dd>
                <router-link
                  :to="{
                    name: 'user',
                    params: $store.state.login.userinfo
                      ? { id: $store.state.login.userinfo._id }
                      : {},
                  }"
                >
                  <i class="layui-icon">&#xe68e;</i>
                  我的主页
                </router-link>
              </dd>
              <hr style="margin: 5px 0" />
              <dd>
                <a
                  href="javascript:;"
                  style="text-align: center"
                  @click="logout"
                  >退出</a
                >
              </dd>
            </dl>
          </li>
          <div
            class="fly-nav-msg"
            @click="toMsg"
            v-if="num && +num.message !== 0"
          >
            {{ num.message }}
          </div>
          <transition name="tips">
            <div class="layui-layer-tips" v-show="isShowTips">
              <div class="layui-layer-content">
                您有 {{ num.message }} 条未读消息
                <i class="layui-layer-TipsG layui-layer-TipsB"></i>
              </div>
            </div>
          </transition>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "@/utils";
export default {
  name: "Header",
  data() {
    return {
      showNav: false,
      defaultAvatar: require("@/assets/img/avatar.png"),
      isShowTips: false,
      timer: null,
    };
  },
  methods: {
    showNavList() {
      this.showNav = !this.showNav;
    },
    callback(event) {
      const target = event.target;
      if (!target.contains(this.$refs.navItem)) {
        this.showNav = false;
      }
    },
    logout() {
      this.$alert.show({
        msg: "确定要退出登录吗？",
        type: "",
        success: () => {
          this.$store.commit("login/SET_TOKEN", "");
          this.$store.commit("login/SET_USERINFO", "");
          this.$store.commit("login/SET_ISLOGIN", false);
          if (this.$route.name !== "home") {
            this.$router.replace({ name: "home" });
          }
        },
      });
    },
    toMsg() {
      this.$router.push({ name: "msg" });
    },
  },
  mounted() {
    document.addEventListener("click", this.callback);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.callback);
  },
  computed: {
    num() {
      return this.$store.state.ws.num;
    },
  },
  watch: {
    num(newVal) {
      console.log(newVal);
      if (isEmpty(newVal.event)) return;
      if (+newVal.message === 0) return;

      this.isShowTips = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isShowTips = false;
      }, 2000);
    },
  },
};
</script>

<style lang="less" scoped>
.fly-logo {
  left: -15px;
  top: -10px;
  margin-left: 15px;

  img {
    position: relative;
    top: 15px;
    width: 100%;
    height: 50px;
  }
}

.layui-nav-child {
  display: block;
}

.layui-nav-child.layui-anim.layui-anim-upbit a {
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    top: -2px;
  }
}

.layui-layer-tips {
  position: fixed;
  white-space: nowrap;
  z-index: 2000;
  top: 60px;
}

.tips-enter-active {
  animation: bounceIn 0.3s;
}
.tips-leave-active {
  animation: bounceOut 0.3s;
}
.fly-nav-msg {
  cursor: pointer;
}
</style>
