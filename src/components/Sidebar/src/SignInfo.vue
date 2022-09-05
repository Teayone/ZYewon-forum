<template>
  <!-- 签到说明 -->
  <div class="modal" v-show="isShow">
    <div class="mask" @click="close"></div>
    <div class="layui-layer layui-layer-page info active">
      <div class="layui-layer-title">
        <span>签到说明</span>
        <i class="layui-icon layui-icon-close pull-right" @click="close"></i>
      </div>
      <div class="layui-layer-content">
        <div class="layui-text">
          <blockquote class="layui-elem-quote">
            “签到”可获得的社区积分规则如下
          </blockquote>
        </div>
        <table class="layui-table">
          <thead>
            <tr>
              <th>连续签到天数</th>
              <th>每天可获积分</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>&lt;5</td>
              <td>5</td>
            </tr>
            <tr>
              <td>&ge;5</td>
              <td>10</td>
            </tr>
            <tr>
              <td>&ge;15</td>
              <td>15</td>
            </tr>
            <tr>
              <td>&ge;30</td>
              <td>20</td>
            </tr>
            <tr>
              <td>&ge;100</td>
              <td>30</td>
            </tr>
            <tr>
              <td>&ge;365</td>
              <td>50</td>
            </tr>
          </tbody>
        </table>
        <div>
          <p>中间若有间隔则连续签到天数中断</p>
          <p class="orange">不可利用程序自动签到，否则积分清0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="less" scoped></style>
