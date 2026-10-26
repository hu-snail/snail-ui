<script setup lang="ts">
/** Demo: sn-navbar — 基础导航栏：标题 + 左右按钮。 */
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnNavbar title="首页" />
    <SnNavbar title="订单详情" left-text="返回" right-text="更多" />
    <SnNavbar title="设置" left-arrow bordered />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
