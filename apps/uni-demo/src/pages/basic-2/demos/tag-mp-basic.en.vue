<script setup lang="ts">
/** Demo: sn-tag (uni-end) — ten semantic colours. */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
</script>

<template>
  <view class="sn-demo">
    <SnTag>Default</SnTag>
    <SnTag type="primary">Primary</SnTag>
    <SnTag type="success">Success</SnTag>
    <SnTag type="warning">Warning</SnTag>
    <SnTag type="danger">Danger</SnTag>
    <SnTag type="volcano">Volcano</SnTag>
    <SnTag type="lightblue">Light blue</SnTag>
    <SnTag type="cyan">Cyan</SnTag>
    <SnTag type="pink">Pink</SnTag>
    <SnTag type="purple">Purple</SnTag>
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
