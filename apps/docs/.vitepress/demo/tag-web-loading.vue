<script setup lang="ts">
/** Demo: SnTag — loading state (AUI additive). */
import { SnTag } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag loading>加载中</SnTag>
      <SnTag loading type="primary">保存中</SnTag>
      <SnTag loading closable>loading 时不可关闭</SnTag>
      <SnTag loading round type="success">提交中</SnTag>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
