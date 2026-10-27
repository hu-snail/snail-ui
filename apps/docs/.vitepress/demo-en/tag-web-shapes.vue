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
      <SnTag closable shape="skew" type="error">Skew closable</SnTag>
      <SnTag checkable checked shape="ticket" type="success">Ticket checkable</SnTag>
      <SnTag color="#722ed1" shape="ribbon">Custom ribbon</SnTag>
      <SnTag shape="fold" size="large" type="warning">Large fold</SnTag>
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
