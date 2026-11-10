<script setup lang="ts">
/** Demo: SnSliderBar — aurora theme (gradient fill + drifting stars + round thumb). */
import { ref } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const hero = ref(72);
const custom = ref(58);
const still = ref(30);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">默认（紫蓝渐变 + 星光粒子动效）</span>
    <SnSliderBar v-model="hero" theme="aurora" aria-label="Hero progress" />

    <span class="demo-label">自定义渐变（青 → 品红）</span>
    <SnSliderBar
      v-model="custom"
      theme="aurora"
      gradient="linear-gradient(90deg, #22d3ee 0%, #a855f7 55%, #ec4899 100%)"
      show-value
      aria-label="Custom gradient"
    />

    <span class="demo-label">animated=false（保留渐变，关闭动效）</span>
    <SnSliderBar v-model="still" theme="aurora" :animated="false" show-value aria-label="Static" />

    <span class="demo-log">hero = {{ hero }} · custom = {{ custom }} · still = {{ still }}</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 460px;
  padding: 12px 0;
}
.demo-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.demo-log {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
