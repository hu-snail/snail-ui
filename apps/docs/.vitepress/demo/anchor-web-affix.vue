<script setup lang="ts">
/**
 * anchor-web-affix — the anchor pinned to the viewport while the page scrolls.
 *
 * Shows: `affix` turning the anchor into a sticky element. The nav column
 * stays in place as the long body scrolls past it.
 */
import { SnAnchor, SnAnchorLink } from '@snui/vue-web'

const sections = [
  { id: 'afx-intro', title: '概述' },
  { id: 'afx-api', title: '接口' },
  { id: 'afx-faq', title: '常见问题' },
]

/** Pad each section so there is enough scroll distance to observe. */
const paragraphs = Array.from({ length: 8 }, (_, i) => i + 1)
</script>

<template>
  <div class="anchor-afx">
    <div class="anchor-afx__nav">
      <SnAnchor affix :bound="12" :offset-top="12">
        <SnAnchorLink
          v-for="s in sections"
          :key="s.id"
          :title="s.title"
          :href="`#${s.id}`"
        />
      </SnAnchor>
    </div>

    <div class="anchor-afx__body">
      <section v-for="s in sections" :id="s.id" :key="s.id" class="anchor-afx__section">
        <h4>{{ s.title }}</h4>
        <p v-for="n in paragraphs" :key="n">
          {{ s.title }}的第 {{ n }} 段内容 —— 页面滚动时左侧导航保持吸附。
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.anchor-afx {
  display: flex;
  gap: 24px;
  width: 100%;
  align-items: flex-start;
}
.anchor-afx__nav {
  flex: none;
  width: 140px;
}
.anchor-afx__body {
  flex: 1;
  min-width: 0;
  /* A tall body so the page itself scrolls. */
  max-height: 320px;
  overflow-y: auto;
  padding: 0 12px;
  border: 1px solid var(--sn-web-color-border);
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
}
.anchor-afx__section h4 {
  margin: 14px 0 6px;
  font-size: 14px;
}
.anchor-afx__section p {
  margin: 0 0 6px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
