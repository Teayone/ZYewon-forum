<template>
  <div class="fly-panel fly-panel-user" pad20 ref="msg">
    <div
      class="layui-tab layui-tab-brief"
      lay-filter="user"
      id="LAY_msg"
      style="margin-top: 15px"
    >
      <button
        class="layui-btn layui-btn-danger"
        id="LAY_delallmsg"
        @click="clearAll"
      >
        清空全部消息
      </button>
      <div id="LAY_minemsg" style="margin-top: 10px">
        <!--<div class="fly-none">您暂时没有最新消息</div>-->
        <ul class="mine-msg">
          <li v-for="item in lists" :key="item._id">
            <blockquote class="layui-elem-quote" v-if="item.cuid && item.tid">
              <router-link
                :to="{ name: 'user', params: { id: item.cuid._id } }"
              >
                <cite>{{ item.cuid.nickname }}</cite>
              </router-link>
              回答了您的求解
              <router-link
                :to="{ name: 'detail', params: { tid: item.tid._id } }"
              >
                <cite>{{ item.tid.title }}</cite>
              </router-link>
            </blockquote>
            <div class="content" v-html="escapeHtml(item.content)"></div>
            <p>
              <span>{{ formatTime(item.created) }}</span>
              <a
                href="javascript:;"
                class="layui-btn layui-btn-small layui-btn-danger fly-delete"
                @click="readComment(item)"
                >删除</a
              >
            </p>
          </li>
        </ul>
      </div>
    </div>
    <pagination
      :total="total"
      :pageSize="limit"
      :showEnd="false"
      @currentPage="currentPage"
    />
  </div>
</template>

<script>
import { getMsg, setMsg } from "@/api/user";
import Pagination from "@/components/Pagination/Pagination.vue";
import formatTime from "@/utils/formatTime";
import escapeHtml from "@/utils/escapeHtml";
import { isEmpty } from "@/utils";
export default {
  components: { Pagination },
  data() {
    return {
      lists: [],
      pageNum: 1,
      limit: 10,
      total: 0,
      formatTime,
      escapeHtml,
    };
  },
  mounted() {
    this.getMsgAll();
  },

  methods: {
    // 获取未读消息
    async getMsgAll() {
      const res = await getMsg({
        pageNum: this.pageNum,
        limit: this.limit,
      });

      this.lists = res.data;
      this.total = res.total;
      this.$refs.msg.scrollIntoView({ behavior: "smooth" });
    },
    // 翻页
    currentPage(e) {
      this.pageNum = e;
      this.getMsgAll();
    },
    // 清空所有未读消息
    async clearAll() {
      const res = await setMsg();
      if (res.code !== 200) {
        return this.$pop.show({ msg: res.msg, type: "shake" });
      }
      this.lists = [];
      this.$store.commit("ws/setMessage", {
        message: 0,
      });
      this.getMsgAll();
      this.$pop.show({ msg: "清空全部消息成功" });
    },
    // 已读某一条消息
    async readComment(item) {
      const res = await setMsg({ cid: item._id });
      if (res.code !== 200) {
        return this.$pop.show({ msg: res.msg, type: "shake" });
      }
      this.lists.splice(this.lists.indexOf(item), 1);
      this.getMsgAll();
      this.$store.commit("ws/setMessage", {
        message: this.lists.length,
      });
      this.$pop.show({ msg: "删除消息成功" });
    },
  },

  watch: {
    "$store.state.ws.num"(newVal) {
      if (isEmpty(newVal.event)) return;
      if (newVal.message === 0) return;
      this.getMsgAll();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 10px;
  background: #e3e7eb;
  margin-bottom: 10px;
}
</style>
