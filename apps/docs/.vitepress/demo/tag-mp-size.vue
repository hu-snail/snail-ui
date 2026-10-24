<script setup lang="ts">
/** Demo: sn-tag (uni-end) — 尺寸 / 圆角 / 标记形态。 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-row">
      <SnTag size="small" type="primary">小号</SnTag>
      <SnTag size="medium" type="primary">中号</SnTag>
      <SnTag size="large" type="primary">大号</SnTag>
      <SnTag size="extra-large" type="primary">超大号</SnTag>
    </view>
    <view class="sn-demo-row">
      <SnTag type="primary">默认直角</SnTag>
      <SnTag type="primary" round>圆角</SnTag>
      <SnTag type="primary" mark>标记</SnTag>
      <SnTag type="primary" round mark>圆角标记</SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.sn-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
