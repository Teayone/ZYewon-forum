<template>
  <div class="layui-container fly-marginTop fly-user-main">
    <ul class="layui-nav layui-nav-tree" lay-filter="test">
      <!-- 侧边导航: <ul class="layui-nav layui-nav-tree layui-nav-side"> -->

      <li class="layui-nav-item" v-for="item in lists" :key="item.name">
        <router-link
          :to="{ name: item.link, params: item.uid ? { id: item.uid } : {} }"
          :active-class="item.activeClass"
        >
          <i :class="['layui-icon', item.icon]"></i>
          {{ item.name }}
        </router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [
        {
          name: "我的主页",
          icon: "layui-icon-home",
          link: "user",
          uid: JSON.parse(localStorage.getItem("userinfo"))._id,
        },
        {
          name: "用户中心",
          icon: "layui-icon-friends",
          link: "center",
        },
        {
          name: "基本设置",
          icon: "layui-icon-set",
          link: "info",
          activeClass: "layui-this",
        },
        {
          name: "我的帖子",
          icon: "layui-icon-template",
          link: "mypost",
          activeClass: "layui-this",
        },
        {
          name: "我的消息",
          icon: "layui-icon-dialogue",
          link: "msg",
        },
        {
          name: "其它设置",
          icon: "layui-icon-template-1",
          link: "others",
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.layui-icon {
  margin-right: 10px;
}
</style>
