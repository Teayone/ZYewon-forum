<template>
  <div class="layui-form layui-form-pane layui-tab-item layui-show">
    <validate-form>
      <validate-input
        label="邮箱"
        v-model="username"
        type="email"
        placeholder="请输入邮箱"
        :rules="rules.email"
      >
        <template #tips>
          <span class="tips">
            如果您在邮箱已激活的情况下，变更了邮箱，需<a
              href="activate.html"
              style="font-size: 12px; color: #4f99cf"
              >重新验证邮箱</a
            >。</span
          >
        </template>
      </validate-input>
      <validate-input
        label="昵称"
        v-model="nickname"
        type="text"
        placeholder="请输入昵称"
      />
      <validate-input
        label="城市"
        v-model="location"
        type="text"
        placeholder="请输入城市"
      />
      <div class="layui-form-item">
        <label for="L_city" class="layui-form-label">性别</label>
        <div class="layui-input-inline gray mt1 ml1">
          <label for="gender1" class="mr1">
            <input
              id="gender1"
              type="radio"
              name="sex"
              v-model="gender"
              value="0"
              title="男"
            />
            <i
              class="layui-icon layui-icon-circle"
              :class="{ 'layui-icon-radio': gender === '0' }"
            ></i>
            男
          </label>
          <label for="gender2">
            <input
              id="gender2"
              type="radio"
              name="sex"
              v-model="gender"
              value="1"
              title="女"
            />
            <i
              class="layui-icon layui-icon-circle"
              :class="{ 'layui-icon-radio': gender === '1' }"
            ></i>
            女
          </label>
        </div>
      </div>
      <validate-textarea
        v-model="remark"
        placeholder="随便写些什么刷下存在感"
        label="签名"
      />
    </validate-form>

    <div class="layui-form-item">
      <button class="layui-btn" @click="submit">确认修改</button>
    </div>
  </div>
</template>

<script>
import ValidateForm from "@/components/ValidateForm";
import ValidateInput from "@/components/ValidateInput";
import ValidateTextarea from "@/components/ValidateTextarea";
import { updateUser } from "@/api/user";
export default {
  components: { ValidateForm, ValidateInput, ValidateTextarea },
  data() {
    return {
      username: "",
      nickname: "",
      location: "",
      gender: "",
      remark: "",
      rules: {
        email: [
          {
            pattern:
              /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: "邮箱格式不正确",
          },
        ],
      },
    };
  },
  mounted() {
    const { nickname, location, gender, remark, username } =
      this.$store.state.login.userinfo;
    this.nickname = nickname;
    this.location = location;
    this.gender = gender;
    this.remark = remark;
    this.username = username;
  },
  methods: {
    async submit() {
      const res = await updateUser({
        nickname: this.nickname,
        location: this.location,
        gender: this.gender,
        remark: this.remark,
        username: this.username,
      });
      if (res.code !== 200) {
        this.$pop.show({ msg: res.msg, type: "shake" });
        return;
      }
      this.$alert.show({ msg: res.msg });
      this.$store.dispatch("login/initLoginState");
    },
  },
};
</script>

<style lang="less" scoped>
.layui-icon-radio {
  color: #5fb878;
}
.layui-input-inline.gray.mt1.ml1 {
  margin-top: 10px;
  margin-left: 10px;
}
.tips {
  display: inline-block;
  margin-top: -10px;
  margin-bottom: 5px;
  color: rgb(117, 114, 114);
}
</style>
