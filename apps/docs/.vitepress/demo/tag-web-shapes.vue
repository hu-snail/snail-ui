<script setup lang="ts">
/** Demo: SnTag — shapes. */
import { SnTag } from '@snui/vue-web';
</script>

<template>
  <div class="demo-row">
    <SnTag round>胶囊标签</SnTag>
    <SnTag :bordered="false">无边框</SnTag>
    <SnTag color="#722ed1">自定义色</SnTag>
    <SnTag disabled>禁用标签</SnTag>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
