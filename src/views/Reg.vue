<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li><router-link :to="{ name: 'login' }">登入</router-link></li>
          <li class="layui-this">注册</li>
        </ul>
        <div
          class="layui-form layui-tab-content"
          id="LAY_ucm"
          style="padding: 20px 0"
        >
          <div class="layui-tab-item layui-show">
            <ValidateForm ref="formRef">
              <ValidateInput
                label="用户名"
                type="text"
                placeholder="请输入用户名"
                :rules="rules.email"
                v-model="username"
                :errorMessage="usernameErrorMsg"
              ></ValidateInput>
              <ValidateInput
                label="昵称"
                type="text"
                placeholder="请输入昵称"
                :rules="rules.nickname"
                v-model="nickname"
                :errorMessage="nicknameErrorMsg"
              ></ValidateInput>
              <ValidateInput
                label="密码"
                type="password"
                placeholder="请输入密码"
                :rules="rules.password"
                v-model="password"
              ></ValidateInput>
              <ValidateInput
                label="确认密码"
                type="password"
                placeholder="请输入密码"
                :rules="rules.password"
                v-model="passwordConfirm"
                @handleBlur="handleBlur"
                :errorMessage="passwordConfirmErrorMsg"
              ></ValidateInput>
              <ValidateInput
                label="验证码"
                v-model="code"
                type="text"
                placeholder="请输入验证码"
                :rules="rules.code"
                :captcha="svg"
                :errorMessage="errorMsg"
                @captchaClick="getCaptcha"
              />
              <div class="layui-form-item">
                <button type="button" class="layui-btn" @click="register">
                  立即注册
                </button>
              </div>
              <div class="layui-form-item fly-form-app">
                <span>或者直接使用社交账号快捷注册</span>
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
      </div>
    </div>
  </div>
</template>

<script>
import ValidateInput from "@/components/ValidateInput";
import ValidateForm from "@/components/ValidateForm";
import rules from "@/rules";
import getCaptcha from "@/mixins/getCaptcha";
import { regAsync } from "@/api/login";
export default {
  components: { ValidateForm, ValidateInput },
  mixins: [getCaptcha],
  data() {
    return {
      rules,
      username: "",
      password: "",
      nickname: "",
      passwordConfirm: "",
      code: "",
      errorMsg: "",
      usernameErrorMsg: "",
      nicknameErrorMsg: "",
      passwordConfirmErrorMsg: "",
    };
  },
  methods: {
    async register() {
      const res = this.$refs.formRef.validate();
      if (!res) return;
      if (!this.validatePassword()) return;
      const regRes = await regAsync({
        username: this.username,
        password: this.password,
        nickname: this.nickname,
        code: this.code,
        sid: this.$store.state.global.sid,
      });
      if (regRes.code === 200) {
        this.$alert.show({ msg: "注册成功" });
        setTimeout(() => {
          this.$router.replace({
            name: "login",
          });
        }, 1000);
        localStorage.removeItem("sid");
        this.$store.commit("global/SET_SID", "");
      } else if (regRes.code === 40001) {
        this.errorMsg = regRes.msg;
      } else if (regRes.code === 40002) {
        this.usernameErrorMsg = regRes.msg;
      } else if (regRes.code === 40003) {
        this.nicknameErrorMsg = regRes.msg;
      } else if (regRes.code === 403) {
        this.$alert.show({ msg: regRes.msg });
        const sid = uuid();
        localStorage.setItem("sid", sid);
        this.$store.commit("global/SET_SID", sid);
        this.getCaptcha();
      } else {
        this.$alert.show({ msg: regRes.msg });
      }
    },
    // 确认密码框失去焦点时触发
    handleBlur() {
      this.errorMsg = "";
      this.nicknameErrorMsg = "";
      this.usernameErrorMsg = "";
      if (this.passwordConfirm === "") return;
      this.validatePassword();
    },
    validatePassword() {
      if (this.passwordConfirm !== this.password) {
        this.passwordConfirmErrorMsg = "输入的密码不一致";
        return false;
      }
      this.passwordConfirmErrorMsg = "";
      return true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
