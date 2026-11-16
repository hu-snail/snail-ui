<script setup lang="ts">
/**
 * Demo: SnButton (Web) — disabled & loading 状态（全语义色）。
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { ref } from 'vue';
import { SnButton } from '@snui/vue-web';

const loading = ref(false);
function trigger(): void {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}
</script>

<template>
  <div class="sn-demo sn-demo--stack">
    <p class="sn-demo__label">禁用（disabled）</p>
    <div class="sn-demo__row">
      <SnButton disabled>默认按钮</SnButton>
      <SnButton disabled type="primary">主要按钮</SnButton>
      <SnButton disabled type="success">成功按钮</SnButton>
      <SnButton disabled type="info">信息按钮</SnButton>
      <SnButton disabled type="warning">警告按钮</SnButton>
      <SnButton disabled type="error">危险按钮</SnButton>
    </div>

    <p class="sn-demo__label">加载（loading）</p>
    <div class="sn-demo__row">
      <SnButton loading type="primary">保存中</SnButton>
      <SnButton loading type="success">提交中</SnButton>
      <SnButton loading type="error">删除中</SnButton>
      <SnButton :loading="loading" type="primary" @click="trigger">点击触发加载</SnButton>
    </div>
  </div>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.sn-demo__label {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
