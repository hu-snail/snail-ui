<script setup lang="ts">
/** Demo: SnButton (Web) — custom color prop overrides type color; gradients layer via background-image. */
import { SnButton } from '@snui/vue-web';
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__group">
      <SnButton color="#8b5cf6">Custom purple</SnButton>
      <SnButton color="#ec4899">Custom pink</SnButton>
      <SnButton color="#06b6d4" ghost>Custom cyan ghost</SnButton>
      <SnButton color="#10b981" tertiary>Custom emerald tertiary</SnButton>
    </div>

    <div class="sn-demo__group">
      <SnButton type="primary" class="gradient-btn gradient-btn--sunset">Gradient primary</SnButton>
      <SnButton type="success" class="gradient-btn gradient-btn--emerald">Gradient success</SnButton>
      <SnButton type="primary" round class="gradient-btn gradient-btn--aurora">Gradient pill</SnButton>
    </div>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sn-demo__group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* 渐变案例：color prop 落在 --sn-button-color，组件按 background-color
 * 消费，gradient 只能经 background-image 叠加（画在底色之上，hover 换
 * 底色不影响观感）；描边置透明以贴合渐变。 */
.sn-demo :deep(.gradient-btn) {
  border-color: transparent;
}
.sn-demo :deep(.gradient-btn--sunset) {
  background-image: linear-gradient(135deg, #8b5cf6, #ec4899);
}
.sn-demo :deep(.gradient-btn--emerald) {
  background-image: linear-gradient(135deg, #10b981, #06b6d4);
}
.sn-demo :deep(.gradient-btn--aurora) {
  background-image: linear-gradient(120deg, #f59e0b, #ec4899, #8b5cf6);
}
</style>
