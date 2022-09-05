<template>
  <div>
    <table class="layui-table" border="0">
      <thead>
        <tr>
          <th class="pl0 title">
            <div class="layui-table-cell">
              <span>帖子标题</span>
            </div>
          </th>
          <th>
            <div class="layui-table-cell text-center">
              <span>收藏时间</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="item in collectList" :key="item._id">
          <td class="text-left">{{ item.title }}</td>
          <td>{{ formatTime(item.created) }}</td>
        </tr>
      </tbody>
    </table>
    <pagination
      :pageSize="limit"
      :total="total"
      @currentChange="currentChange"
      :showEnd="false"
      align="left"
    />
  </div>
</template>

<script>
import { getCollectList } from "@/api/user";
import formatTime from "@/utils/formatTime";
import Pagination from "@/components/Pagination/Pagination.vue";

export default {
  components: { Pagination },
  data() {
    return {
      collectList: [],
      formatTime,
      limit: 10,
      pageNum: 1,
      total: 0,
    };
  },
  mounted() {
    this.getCollect();
  },
  methods: {
    async getCollect() {
      const res = await getCollectList({
        pageNum: this.pageNum,
        limit: this.limit,
      });
      if (res.code !== 200) {
        P;
        return this.$pop.show({ msg: res.msg, type: "shake" });
      }
      this.collectList = res.data;
      this.total = res.total;
    },
    currentChange(e) {
      this.pageNum = e;
      this.getCollect();
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  width: 70%;
}
</style>
