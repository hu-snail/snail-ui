<script setup lang="ts">
/**
 * anchor-web-variants — type="block" (no rail), showRail=false, and an
 * affixed anchor that sticks while the page scrolls.
 */
import { SnAnchor, SnAnchorLink } from '@snui/vue-web';
</script>

<template>
  <div class="anchor-demo">
    <div class="anchor-demo__col">
      <span class="anchor-demo__label">type="block"（无导轨）</span>
      <SnAnchor type="block">
        <SnAnchorLink title="一级 · 概览" href="#anchor-var-a">
          <SnAnchorLink title="二级 · 明细" href="#anchor-var-a1" />
        </SnAnchorLink>
        <SnAnchorLink title="一级 · 配置" href="#anchor-var-b" />
      </SnAnchor>
    </div>

    <div class="anchor-demo__col">
      <span class="anchor-demo__label">showRail=false</span>
      <SnAnchor :show-rail="false">
        <SnAnchorLink title="概览" href="#anchor-var-a" />
        <SnAnchorLink title="配置" href="#anchor-var-b" />
      </SnAnchor>
    </div>

    <div class="anchor-demo__col">
      <span class="anchor-demo__label">affix（滚动时固定在视口）</span>
      <SnAnchor affix :trigger-top="80" :top="80" :bound="12">
        <SnAnchorLink title="概览" href="#anchor-var-a" />
        <SnAnchorLink title="配置" href="#anchor-var-b" />
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
