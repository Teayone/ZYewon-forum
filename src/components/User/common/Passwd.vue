<template>
  <!-- 修改密码 -->
  <div class="layui-form layui-form-pane layui-tab-item layui-show">
    <validate-form ref="formRef">
      <validate-input
        type="password"
        v-model.trim="password"
        label="密码"
        placeholder="请输入密码"
        :rules="rules.password"
      />
      <validate-input
        type="password"
        v-model.trim="confirmPwd"
        label="确认密码"
        placeholder="请确认密码"
        :rules="rules.password"
        :errorMessage="confirmPwdErr"
        @handleBlur="handleBlur"
      />
      <validate-input
        v-model.trim="code"
        label="验证码"
        placeholder="请输入验证码"
        :captcha="svg"
        :rules="rules.code"
        :errorMessage="codeErr"
        @captchaClick="getCaptcha"
      />
      <div class="layui-form-item">
        <button type="button" class="layui-btn" @click="submit">
          确认修改
        </button>
      </div>
    </validate-form>
  </div>
</template>

<script>
import ValidateForm from "@/components/ValidateForm";
import ValidateInput from "@/components/ValidateInput";
import getCaptcha from "@/mixins/getCaptcha";
import rules from "@/rules";
import { updatePass } from "@/api/user";
export default {
  components: { ValidateForm, ValidateInput },
  mixins: [getCaptcha],
  data() {
    return {
      password: "",
      confirmPwd: "",
      code: "",
      confirmPwdErr: "",
      codeErr: "",
      rules,
    };
  },
  methods: {
    async submit() {
      const isValid = this.$refs.formRef.validate();
      if (!isValid) return;
      if (this.confirmPwdErr) return;
      // 重置密码
      this.codeErr = "";
      const res = await updatePass({
        password: this.password,
        code: this.code,
        sid: this.$store.state.global.sid,
      });
      // 验证码错误
      if (res.code === 403 || res.code === 40001) {
        this.getCaptcha();
        return (this.codeErr = res.msg);
      }
      // 密码相同 或 服务端错误
      if (res.code !== 200) {
        this.getCaptcha();
        return this.$alert.show({ msg: res.msg });
      }
      // 更新成功
      this.$pop.show({ msg: "更新成功" });
      this.password = "";
      this.confirmPwd = "";
      this.code = "";
      this.getCaptcha();
    },
    handleBlur() {
      if (this.confirmPwd !== "" && this.confirmPwd !== this.password) {
        this.confirmPwdErr = "两次密码输入不一致";
      } else {
        this.confirmPwdErr = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
