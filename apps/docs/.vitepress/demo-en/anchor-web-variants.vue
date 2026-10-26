<script setup lang="ts">
/**
 * anchor-web-variants — type="block" (no rail), showRail=false, and an
 * affixed anchor that sticks while the page scrolls.
 */
import { SnAnchor, SnAnchorLink } from '@snui/vue-web'
</script>

<template>
  <div class="anchor-demo">
    <div class="anchor-demo__col">
      <span class="anchor-demo__label">type="block" (no rail)</span>
      <SnAnchor type="block">
        <SnAnchorLink title="Level 1 · Overview" href="#anchor-var-a">
          <SnAnchorLink title="Level 2 · Details" href="#anchor-var-a1" />
        </SnAnchorLink>
        <SnAnchorLink title="Level 1 · Configuration" href="#anchor-var-b" />
      </SnAnchor>
    </div>

    <div class="anchor-demo__col">
      <span class="anchor-demo__label">showRail=false</span>
      <SnAnchor :show-rail="false">
        <SnAnchorLink title="Overview" href="#anchor-var-a" />
        <SnAnchorLink title="Config" href="#anchor-var-b" />
      </SnAnchor>
    </div>

    <div class="anchor-demo__col">
      <span class="anchor-demo__label">affix (fixed to the viewport while scrolling)</span>
      <SnAnchor affix :trigger-top="80" :top="80" :bound="12">
        <SnAnchorLink title="Overview" href="#anchor-var-a" />
        <SnAnchorLink title="Config" href="#anchor-var-b" />
      </SnAnchor>
    </div>
  </div>
</template>

<style scoped>
.anchor-demo {
  display: flex;
  gap: 32px;
  width: 100%;
}
.anchor-demo__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.anchor-demo__label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
