<script setup lang="ts">
/** Demo: SnEquation — basic LaTeX rendering (mirrors n-equation basic). */
import { SnEquation } from '@snui/vue-web';

const equation = '\\displaystyle= \\frac{k(k+1)}{2}+k+1';
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__text">内联公式：<SnEquation :value="equation" /></p>
    <p class="sn-demo__text">行间公式：</p>
    <SnEquation
      value="\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}"
      :katex-options="{ displayMode: true }"
    />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sn-demo__text {
  margin: 0;
  color: var(--sn-web-color-text-primary);
}
</style>
