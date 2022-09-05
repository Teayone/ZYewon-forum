<template>
  <div class="min-table">
    <table class="layui-table" border="0">
      <thead>
        <tr>
          <th class="pl0">
            <div class="layui-table-cell">
              <span>帖子标题</span>
            </div>
          </th>
          <th>
            <div class="layui-table-cell text-center"><span>状态</span></div>
          </th>
          <th>
            <div class="layui-table-cell text-center"><span>结帖</span></div>
          </th>
          <th>
            <div class="layui-table-cell text-center">
              <span>发表时间</span>
            </div>
          </th>
          <th>
            <div class="layui-table-cell text-center"><span>数据</span></div>
          </th>
          <th>
            <div class="layui-table-cell text-center"><span>操作</span></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="item in postList" :key="item._id">
          <td class="text-left">
            <router-link
              :to="{ name: 'detail', params: { tid: item._id } }"
              style="color: #1e9fff"
            >
              {{ item.title }}
            </router-link>
          </td>
          <td>{{ format("status", item.status) }}</td>
          <td>
            <span :class="{ end: +item.isEnd === 1 }">
              {{ format("isEnd", item.isEnd) }}
            </span>
          </td>
          <td>{{ format("created", item.created) }}</td>
          <td>{{ item.reads }}阅/{{ item.answer }}答</td>
          <td class="min-cell">
            <div
              class="layui-btn layui-btn-xs"
              @click="goEditPostPage(item)"
              v-if="+item.isEnd === 0"
            >
              编辑
            </div>
            <div
              class="layui-btn layui-btn-xs layui-btn-danger"
              v-if="+item.isEnd === 0"
              @click="deletePost(item)"
            >
              删除
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination
      :total="total"
      :pageSize="limit"
      :showEnd="false"
      @currentPage="currentPage"
      align="left"
    />
  </div>
</template>

<script>
import { getMyPost, deletePostById } from "@/api/user";
import formatTime from "@/utils/formatTime";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  components: { Pagination },
  data() {
    return {
      postList: [],
      limit: 10,
      pageNum: 1,
      total: 0,
    };
  },
  mounted() {
    this.getPostList();
  },
  methods: {
    // 获取我发表的文章列表
    async getPostList() {
      const res = await getMyPost({
        limit: this.limit,
        pageNum: this.pageNum,
      });
      if (res.code !== 200) {
        return this.$alert.show({ msg: "获取文章列表失败" });
      }
      this.postList = res.data;
      this.total = res.total;
    },
    // 翻页
    currentPage(e) {
      this.pageNum = e;
      this.getPostList();
    },
    format(type, value) {
      if (type === "status") {
        return {
          0: "打开",
          1: "关闭",
        }[value];
      } else if (type === "isEnd") {
        return {
          0: "未结",
          1: "已结",
        }[value];
      } else if (type === "created") {
        return formatTime(value);
      }
    },
    // 跳转至文章编辑页
    goEditPostPage(item) {
      this.$router.push({
        name: "edit",
        params: {
          post: item,
          tid: item._id,
        },
      });
    },
    // 删除文章
    deletePost(item) {
      const success = async () => {
        const params = {
          tid: item._id,
        };
        const res = await deletePostById(params);
        if (res.code !== 200) {
          return this.$pop.show({ msg: res.msg });
        }

        this.postList.splice(this.postList.indexOf(item), 1);
        this.$pop.show({ msg: res.msg });
      };
      this.$alert.show({ msg: "确定要删除文章吗？", type: "confirm", success });
    },
  },
};
</script>

<style lang="less" scoped>
.overflow {
  overflow-y: auto;
}
@media (max-width: 992px) {
  .min-table {
    overflow-x: auto;
  }
}
.min-cell {
  min-width: 90px;
}
.end {
  color: #5fb878;
  font-weight: 600;
}
</style>
