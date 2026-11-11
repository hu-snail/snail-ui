<script setup lang="ts">
/** Demo: SnAnchor — type="block" (no rail, block links). */
import { SnAnchor, SnAnchorLink } from '@snui/vue-web';
</script>

<template>
  <div class="anchor-demo">
    <span class="anchor-demo__label">type="block" (no rail)</span>
    <SnAnchor type="block">
      <SnAnchorLink title="Level 1 · Overview" href="#anchor-var-a">
        <SnAnchorLink title="Level 2 · Details" href="#anchor-var-a1" />
      </SnAnchorLink>
      <SnAnchorLink title="Level 1 · Configuration" href="#anchor-var-b" />
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
