<template>
  <!-- 上传头像 -->
  <div class="layui-form layui-form-pane layui-tab-item layui-show">
    <div class="layui-form-item">
      <div class="avatar-add" @click="handleUpload">
        <p>建议尺寸168*168，支持jpg、png、gif、jpeg最大不能超过100KB</p>
        <label class="layui-btn upload-img">
          <i class="layui-icon">&#xe67c;</i>上传头像
        </label>
        <input
          type="file"
          name="file"
          accept=".jpg,.png,.jpeg,.gif"
          style="display: none"
          @change="upload"
          ref="upload"
        />
        <img :src="pic ? pic : '/img/bear-200-200.jpg'" />
        <span class="loading"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { changeBase64 } from "@/utils";
import { updateUser, getUserInfo } from "@/api/user";
import { uploadImg } from "@/api/content";
import { baseURL } from "@/config";

export default {
  data() {
    return {};
  },
  methods: {
    handleUpload() {
      this.$refs.upload.value = "";
      this.$refs.upload.click();
    },
    async upload(e) {
      const file = e.target.files[0];
      const maxSize = 100 * 1024;
      if (file.size > maxSize) {
        return this.$pop.show({ msg: "超过文件最大限制", type: "shake" });
      }
      // 将其转换成 base64
      this.imgBase64 = await changeBase64(file);
      const fm = new FormData();
      fm.append("file", file);
      // 上传到服务器
      const res = await uploadImg(fm);
      if (res.code !== 200) {
        this.$alert.show({ msg: "上传失败" });
        return;
      }
      console.log(res);
      // 更新用户信息
      const isUpdate = await updateUser({
        pic: res.imgUrl,
      });
      if (isUpdate.code !== 200) {
        return this.$alert.show({ msg: "上传失败" });
      }
      const user = await getUserInfo();
      this.$store.commit("login/SET_USERINFO", user.data);
      this.$pop.show({ msg: "头像上传成功" });
    },
  },
  computed: {
    pic() {
      return this.$store.state.login.userinfo.pic;
    },
  },
};
</script>

<style lang="scss" scoped></style>
