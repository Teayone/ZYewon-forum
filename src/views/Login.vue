<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li class="layui-this">登入</li>
          <li>
            <router-link :to="{ name: 'reg' }">注册</router-link>
          </li>
        </ul>
      </div>
      <ValidateForm ref="formRef">
        <ValidateInput
          label="邮箱"
          v-model="username"
          type="email"
          placeholder="请输入邮箱"
          :rules="rules.email"
        />
        <ValidateInput
          label="密码"
          type="password"
          placeholder="请输入密码"
          :rules="rules.password"
          v-model="password"
        />
        <ValidateInput
          label="验证码"
          v-model="code"
          type="text"
          placeholder="请输入验证码"
          :rules="rules.code"
          :captcha="svg"
          :errorMessage="codeErrorMsg"
          @captchaClick="getCaptcha"
        />
        <div class="layui-form-item">
          <button type="button" class="layui-btn" @click="submit">
            点击登录
          </button>
          <router-link :to="{ name: 'forget' }" style="margin-left: 10px">
            忘记密码？
          </router-link>
        </div>
        <div class="layui-form-item fly-form-app">
          <span>或者使用社交账号登入</span>
          <a
            href=""
            onclick="layer.msg('正在通过QQ登入', {icon:16, shade: 0.1, time:0})"
            class="iconfont icon-qq"
            title="QQ登入"
          ></a>
          <a
            href=""
            onclick="layer.msg('正在通过微博登入', {icon:16, shade: 0.1, time:0})"
            class="iconfont icon-weibo"
            title="微博登入"
          ></a>
        </div>
      </ValidateForm>
    </div>
  </div>
</template>

<script>
import ValidateInput from "@/components/ValidateInput";
import ValidateForm from "@/components/ValidateForm";
import getCaptcha from "@/mixins/getCaptcha";
import rules from "@/rules";
import { loginAsync } from "@/api/login";
import { v4 as uuid } from "uuid";
import { getUserInfo } from "@/api/user";
export default {
  components: { ValidateInput, ValidateForm },
  mixins: [getCaptcha],
  data() {
    return {
      username: "",
      password: "",
      code: "",
      codeErrorMsg: "",
      rules,
    };
  },
  methods: {
    async submit() {
      this.codeErrorMsg = "";
      const res = this.$refs.formRef.validate();
      if (!res) return;
      // 登录
      const loginRes = await loginAsync({
        username: this.username,
        password: this.password,
        code: this.code,
        sid: this.$store.state.global.sid,
      });

      if (loginRes.code === 200) {
        this.username = "";
        this.password = "";
        this.code = "";

        // TODO：跳转至首页
        this.$store.commit("login/SET_TOKEN", loginRes.data.token);
        this.$store.commit('ws/initWebSocket')
        this.$store.commit("login/SET_USERINFO", loginRes.data.data);
        this.$store.commit("login/SET_ISLOGIN", true);
        localStorage.removeItem("sid");
        this.$store.commit("global/SET_SID", "");
        this.$router.push("/");

      } else if (loginRes.code === 40001) {
        // 验证码校验失败
        this.codeErrorMsg = loginRes.msg;
      } else if (loginRes.code === 403) {
        // 验证码过期
        this.$alert.show({ msg: loginRes.msg });
        const sid = uuid();
        localStorage.setItem("sid", sid);
        this.$store.commit("global/SET_SID", sid);
        this.getCaptcha();
      } else {
        this.$pop.show({ msg: loginRes.msg });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
