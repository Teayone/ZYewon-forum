<template>
  <div class="layui-container">
    <div class="layui-row layui-col-space15">
      <div class="layui-col-md8">
        <Top />
        <List />
      </div>
      <div class="layui-col-md4">
        <Tips />
        <Sign />
        <HotList />
        <Ads />
        <Links />
      </div>
    </div>
  </div>
</template>

<script>
import { Tips, Sign, HotList, Links, Ads } from "@/components/Sidebar";
import { List, Top } from "@/components/Content";
export default {
  components: { Links, Ads, List, HotList, Tips, Sign, Top },
};
</script>

<style lang="less" scoped></style>
