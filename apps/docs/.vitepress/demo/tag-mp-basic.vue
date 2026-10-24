<script setup lang="ts">
/** Demo: sn-tag (uni-end) — 十种语义色 × 三档常用尺寸。 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue'
</script>

<template>
  <view class="sn-demo">
    <SnTag>默认</SnTag>
    <SnTag type="primary">主要</SnTag>
    <SnTag type="success">成功</SnTag>
    <SnTag type="warning">警告</SnTag>
    <SnTag type="danger">危险</SnTag>
    <SnTag type="volcano">橘火</SnTag>
    <SnTag type="lightblue">亮蓝</SnTag>
    <SnTag type="cyan">青色</SnTag>
    <SnTag type="pink">粉色</SnTag>
    <SnTag type="purple">紫色</SnTag>
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
