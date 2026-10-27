<script setup lang="ts">
/** Demo: SnTag — special shapes (AUI additive `shape`). */
import { SnTag } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag type="primary">square</SnTag>
      <SnTag type="primary" shape="round">round</SnTag>
      <SnTag type="info" shape="skew">skew</SnTag>
      <SnTag type="success" shape="ribbon">ribbon</SnTag>
      <SnTag type="warning" shape="fold">fold</SnTag>
      <SnTag type="error" shape="ticket">ticket</SnTag>
    </div>
    <div class="demo-row">
      <SnTag closable shape="skew" type="error">倾斜可关闭</SnTag>
      <SnTag checkable checked shape="ticket" type="success">票券可选中</SnTag>
      <SnTag color="#722ed1" shape="ribbon">自定义色旗标</SnTag>
      <SnTag shape="fold" size="large" type="warning">大号折角</SnTag>
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
