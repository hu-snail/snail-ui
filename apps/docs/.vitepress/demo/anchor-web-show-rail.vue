<script setup lang="ts">
/** Demo: SnAnchor — showRail=false (hide the rail). */
import { SnAnchor, SnAnchorLink } from '@snui/vue-web';
</script>

<template>
  <div class="anchor-demo">
    <span class="anchor-demo__label">showRail=false</span>
    <SnAnchor :show-rail="false">
      <SnAnchorLink title="概览" href="#anchor-var-a" />
      <SnAnchorLink title="配置" href="#anchor-var-b" />
    </SnAnchor>
  </div>
</template>

<style scoped>
.anchor-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.anchor-demo__label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
