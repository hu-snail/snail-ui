<script setup lang="ts">
/**
 * alert-web-types — shows all five semantic types side by side.
 */
import { SnAlert } from '@snui/vue-web';
</script>

<template>
  <div class="alert-demo">
    <SnAlert type="default" title="default">中性提示 — 没有内置图标。</SnAlert>
    <SnAlert type="info" title="info">一般说明，用于补充上下文信息。</SnAlert>
    <SnAlert type="success" title="success">操作已成功完成。</SnAlert>
    <SnAlert type="warning" title="warning">需要注意，但不会阻塞当前流程。</SnAlert>
    <SnAlert type="error" title="error">执行失败，请检查网络后重试。</SnAlert>
  </div>
</template>

<style scoped>
.alert-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
