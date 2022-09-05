<template>
  <div>
    <dl class="fly-panel fly-list-one">
      <dt class="fly-panel-title">本周热议</dt>
      <template v-if="hotList.length > 0">
        <dd v-for="item in hotList" :key="item._id">
          <router-link :to="{ name: 'detail', params: { tid: item._id } }">{{
            item.title
          }}</router-link>
          <span>
            <i class="iconfont icon-pinglun1"></i> {{ item.answer }}
          </span>
        </dd>
      </template>
      <!-- 无数据时 -->
      <div class="fly-none" v-else>没有相关数据</div>
    </dl>
  </div>
</template>

<script>
import { getTopAsync } from "@/api/content";
export default {
  name: "HotList",
  data() {
    return {
      hotList: [],
    };
  },
  mounted() {
    this.getHotList();
  },
  methods: {
    async getHotList() {
      const res = await getTopAsync();
      this.hotList = res.data;
    },
  },
};
</script>

<style lang="less" scoped></style>
