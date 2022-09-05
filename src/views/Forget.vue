<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li>
            <router-link :to="{ name: 'login' }">登入</router-link>
          </li>
          <li class="layui-this">
            <router-link :to="{ name: 'forget' }">忘记密码</router-link>
          </li>
        </ul>
      </div>
      <ValidateForm ref="formRef">
        <ValidateInput
          label="邮箱"
          v-model="email"
          type="text"
          placeholder="请输入邮箱"
          :rules="rules.email"
        />
        <ValidateInput
          label="验证码"
          type="text"
          placeholder="请输入验证码"
          :rules="rules.code"
          v-model="code"
          :captcha="svg"
          @captchaClick="getCaptcha"
        />
        <div class="layui-form-item">
          <button type="button" class="layui-btn" @click="forget">提交</button>
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
import { forgetAsync } from "@/api/login";
export default {
  components: { ValidateInput, ValidateForm },
  mixins: [getCaptcha],
  data() {
    return {
      email: "",
      code: "",
      rules: rules,
    };
  },
  mounted() {
    document.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        this.forget();
      }
    });
  },
  methods: {
    async forget() {
      const result = this.$refs.formRef.validate();
      if (!result) return; // 如果校验不通过直接终止程序
      const res = await forgetAsync({
        email: this.email,
        code: this.code,
        sid: this.$store.state.global.sid,
      });
      this.getCaptcha();
      this.email = "";
      this.code = "";
      if (res.code === 200) {
        this.$alert.show({ msg: "发送邮件成功，请查看邮件" });
        localStorage.removeItem("sid");
        this.$store.commit("global/SET_SID", "");
      } else {
        this.$alert.show({ msg: res.msg });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
