<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li><router-link :to="{ name: 'login' }">登入</router-link></li>
          <li class="layui-this">重置密码</li>
        </ul>
        <div
          class="layui-form layui-tab-content"
          id="LAY_ucm"
          style="padding: 20px 0"
        >
          <div class="layui-tab-item layui-show">
            <ValidateForm ref="formRef">
              <ValidateInput
                label="重置密码"
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
                <button type="button" class="layui-btn" @click="reset">
                  重置密码
                </button>
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
import { resetAsync } from "@/api/login";
import { getLinkTime } from "@/api/public";
export default {
  components: { ValidateForm, ValidateInput },
  mixins: [getCaptcha],
  data() {
    return {
      rules,
      password: "",
      passwordConfirm: "",
      code: "",
      errorMsg: "",
      passwordConfirmErrorMsg: "",
      key: "",
    };
  },
  created() {
    this.getLinkTimeAsync();
  },
  methods: {
    // 获取当前连接的时效是否还生效
    async getLinkTimeAsync() {
      this.key = this.$route.query.key;
      const res = await getLinkTime(this.key);
      if (res.code !== 200) {
        this.$alert.show({ msg: "链接已失效" });
        setTimeout(() => {
          this.$router.replace({ name: "home" });
        }, 1500);
      }
    },
    async reset() {
      const isValid = this.$refs.formRef.validate();
      if (!isValid) return;
      if (!this.validatePassword()) return;
      const res = await resetAsync({
        password: this.password,
        sid: this.$store.state.global.sid,
        code: this.code,
        key: this.key,
      });
      // 验证码错误
      if (res.code >= 400 && res.code < 500) {
        return (this.errorMsg = res.msg);
      }
      // 链接失效
      if (res.code === 500) {
        this.$alert.show({ msg: "链接已失效" });
        setTimeout(() => {
          this.$router.replace({ name: "home" });
        }, 1500);
        return;
      }
      // 修改成功
      if (res.code === 200) {
        this.$alert.show({ msg: res.msg });
        setTimeout(() => {
          this.$router.replace({ name: "login" });
        }, 1500);
      }
    },

    // 确认密码框失去焦点时触发
    handleBlur() {
      this.errorMsg = "";
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
