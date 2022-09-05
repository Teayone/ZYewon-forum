<template>
  <div class="layui-container">
    <div class="layui-row layui-col-space15">
      <div class="layui-col-md8">
        <List />
      </div>
      <div class="layui-col-md4">
        <HotList />
        <Ads />
        <Links />
      </div>
    </div>
  </div>
</template>

<script>
import { HotList, Links, Ads } from "@/components/Sidebar";
import { List } from "@/components/Content";
export default {
  components: { Links, Ads, List, HotList },
};
</script>

<style lang="scss" scoped></style>
