<template>
  <div class="panel main pd20">
    <div class="msg">Hi,{{ userInfo.nickname }}</div>
    <div class="layui-row layui-col-space20">
      <div class="layui-col-md6">
        <div class="panel border">
          <div class="title">我的会员信息</div>
          <div class="content">
            <p>
              您的财富经验值为：<em class="em">{{ userInfo.favs }}</em>
              <span class="layui-btn layui-btn-warm layui-btn-xs ml10"
                >充值</span
              >
            </p>
            <p v-if="+userInfo.isVip === 0">
              您当前为： <em class="em">普通用户</em>
            </p>
            <p v-else>
              您当前的会员等位为：<em class="em">VIP{{ userInfo.isVip }}</em>
            </p>
          </div>
        </div>
      </div>
      <div class="layui-col-md6">
        <Sign class="border" />
      </div>

      <div class="layui-col-md12 mt-20">
        <div class="panel border">
          <div class="title">快捷方式</div>
          <div class="content" style="height: auto">
            <ul class="layui-row layui-col-space10">
              <li
                class="layui-col-sm3 layui-col-xs4"
                v-for="item in lists"
                :key="item.icon"
              >
                <router-link :to="{ name: item.route }">
                  <div class="layui-icon shortcut" :class="item.icon"></div>
                  <span>{{ item.name }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Sign } from "@/components/Sidebar";
export default {
  components: { Sign },
  mounted() {
    this.getUserInfo();
  },
  data() {
    return {
      lists: [
        {
          name: "修改信息",
          route: "info",
          icon: "layui-icon-set",
        },
        {
          name: "修改头像",
          route: "pic",
          icon: "layui-icon-face-smile",
        },
        {
          name: "修改密码",
          route: "passwd",
          icon: "layui-icon-password",
        },
        {
          name: "账号绑定",
          route: "account",
          icon: "layui-icon-app",
        },
        {
          name: "发表新贴",
          route: "",
          icon: "layui-icon-add-circle",
        },
        {
          name: "查看分享",
          route: "",
          icon: "layui-icon-share",
        },
        {
          name: "我的帖子",
          route: "mypost",
          icon: "layui-icon-username",
        },
        {
          name: "我的收藏",
          route: "mycollection",
          icon: "layui-icon-rate-solid",
        },
        {
          name: "其他资料",
          route: "",
          icon: "layui-icon-template-1",
        },
        {
          name: "关注公众号",
          route: "",
          icon: "layui-icon-login-wechat",
        },
        {
          name: "文档",
          route: "",
          icon: "layui-icon-read",
        },
        {
          name: "后台管理",
          route: "",
          icon: "layui-icon-user",
        },
      ],
    };
  },
  methods: {
    async getUserInfo() {
      await this.$store.dispatch("login/initLoginState");
    },
  },
  computed: {
    userInfo() {
      return this.$store.state.login.userinfo;
    },
  },
};
</script>

<style lang="less" scoped>
@media (max-width: 768px) {
  .panel {
    margin: 0 !important;
  }
}
.panel {
  color: #333;
  font-size: 14px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  &.main {
    margin: 0 0 10px 225px;
  }
}
.msg {
  background-color: #f8f8f8;
  color: #666;
  padding: 10px 15px;
  margin-bottom: 20px;
}
.pd20 {
  padding: 20px;
}
.border {
  border: 1px solid #e6e6e6;
}
.title {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px dotted #e9e9e9;
  padding: 0 15px;
}
.content {
  padding: 18px 15px;
  height: 50px;
  line-height: 26px;
  color: #666;
}
.mt-20 {
  margin-top: -20px;
}
li {
  text-align: center;
  padding: 5px;
}
.shortcut {
  background-color: #2f9688;
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  border-radius: 2px;
  font-size: 30px;
}
.em {
  font-style: normal;
  color: rgb(245, 46, 11);
}
</style>
