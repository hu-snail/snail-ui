<script setup lang="ts">
/** Demo: SnAnchor — type="block" (no rail, block links). */
import { SnAnchor, SnAnchorLink } from '@snui/vue-web';
</script>

<template>
  <div class="anchor-demo">
    <span class="anchor-demo__label">type="block"（无导轨）</span>
    <SnAnchor type="block">
      <SnAnchorLink title="一级 · 概览" href="#anchor-var-a">
        <SnAnchorLink title="二级 · 明细" href="#anchor-var-a1" />
      </SnAnchorLink>
      <SnAnchorLink title="一级 · 配置" href="#anchor-var-b" />
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
