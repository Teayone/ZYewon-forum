<template>
  <div class="fly-panel fly-panel-user" pad20>
    <div class="layui-tab layui-tab-brief" lay-filter="user">
      <ul class="layui-tab-title" id="LAY_mine">
        <li>
          <router-link :to="{ name: 'info' }">我的资料</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'pic' }">头像</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'passwd' }">密码</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'account' }">帐号绑定</router-link>
        </li>
      </ul>
      <div class="layui-tab-content" style="padding: 20px 0">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { changeBase64 } from "@/utils";
import { uploadAvatarAsync } from "@/api/user";
export default {
  data() {
    return {
      formData: null,
      pic: this.$store.state.login.userinfo.pic || "",
      disabled: false,
    };
  },
  methods: {
    upload() {
      this.$refs.upload.value = "";
      this.$refs.upload.click();
    },
    async inputChange(e) {
      this.disabled = true;
      const file = e.target.files[0];
      const res = await changeBase64(file);
      this.pic = res;
      const fm = new FormData();
      fm.append("file", file);
      this.formData = fm;
      const uploadRes = await uploadAvatarAsync(fm);
      this.disabled = false;
      console.log(uploadRes);
    },
  },
};
</script>

<style lang="less" scoped>
.img {
  margin-top: 20px;
  width: 400px;
  height: 400px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
