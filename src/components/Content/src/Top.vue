<template>
  <div class="fly-panel" v-if="lists.length > 0">
    <div class="fly-panel-title fly-filter">
      <a>置顶</a>
      <a
        href="#signin"
        class="layui-hide-sm layui-show-xs-block fly-right"
        id="LAY_goSignin"
        style="color: #ff5722"
        >去签到</a
      >
    </div>
    <list-item :lists="lists" :isShow="false"></list-item>
  </div>
</template>

<script>
import ListItem from "./ListItem";
import { getListAsync } from "@/api/content";
export default {
  name: "Top",
  components: { ListItem },
  data() {
    return {
      page: 0,
      limit: 20,
      isTop: "1",
      lists: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const options = {
        isTop: this.isTop,
      };
      const res = await getListAsync(options);
      this.lists = res.data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
