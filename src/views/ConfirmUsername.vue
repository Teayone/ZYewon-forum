<template>
  <div class="confirm">
    <template v-if="isShow">
      <p>确定要更新账号为{{ username }}吗？</p>
      <div class="confirm-btn">
        <div
          class="layui-btn layui-btn-primary layui-border-blue"
          @click="confirm"
        >
          确定
        </div>
        <div
          class="layui-btn layui-btn-primary layui-border-black"
          @click="cancel"
        >
          取消
        </div>
      </div>
    </template>
    <template v-else>
      <div>更新成功，将回到首页</div>
      <div class="time">{{ num }}</div>
    </template>
  </div>
</template>

<script>
import { updateUserName } from "@/api/user";
import { getLinkTime } from "@/api/public";
export default {
  data() {
    return {
      isShow: true,
      key: "",
      username: "",
      timer: null,
      num: 3,
    };
  },
  mounted() {
    this.isOverdue();
  },
  methods: {
    async isOverdue() {
      this.key = this.$route.query.key;
      this.username = this.$route.query.username;
      const res = await getLinkTime(this.key);
      if (res.code !== 200) {
        // 过期了
        this.$alert.show({ msg: res.msg });
        setTimeout(() => {
          this.$router.replace({ name: "home" });
        }, 1000);
      }
    },
    async confirm() {
      const res = await updateUserName({
        key: this.key,
        username: this.username,
      });
      if (!res.code === 200) {
        this.$alert.show({ msg: "更新失败，请稍后重试" });
        setTimeout(() => {
          this.$router.replace({ name: "home" });
        }, 1500);
      }
      this.isShow = false;
      this.timer = setInterval(() => {
        this.num--;
        if (this.num <= 0) {
          this.$router.replace({ name: "home" });
          clearInterval(this.timer);
        }
      }, 1000);
      if (this.$store.state.login.isLogin) {
        this.$store.dispatch("login/initLoginState");
      }
    },
    cancel() {
      this.$pop.show({ msg: "取消成功" });
      setTimeout(() => {
        this.$router.replace({ name: "home" });
      }, 1500);
    },
  },
};
</script>

<style lang="less" scoped>
.confirm {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #333;
  background: #fff;
  .confirm-btn {
    margin-top: 30px;
    margin-left: -10px;
  }
  .time {
    font-size: 16px;
    color: cornflowerblue;
    font-weight: 700;
    margin-top: 20px;
  }
}
</style>
