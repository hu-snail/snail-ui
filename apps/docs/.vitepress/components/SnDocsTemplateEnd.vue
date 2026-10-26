<script setup lang="ts">
/**
 * SnDocsTemplateEnd — the web / uni-app capsule at the top of the 模板 sidebar.
 *
 * Every template is one page that covers both ends internally, but not every
 * template ships on both: the assistant, the composer and the model-config page
 * are web-only. The capsule filters the sidebar down to the end you are
 * building for — state lives in utils/template-end.ts, the filtering itself is
 * custom.css §14.
 *
 * Mounted through vitepress's `sidebar-nav-before` slot, i.e. directly above the
 * 概览 group, so it reads as the section's end selector rather than as one of
 * its entries.
 */

import { computed } from 'vue';
import { useRoute } from 'vitepress';
import { SnRadioGroup } from '@snui/vue-web';
import type { SnRadioOption, SnRadioValue } from '@snui/vue-web';
import { WEB_ONLY_ROUTES, useTemplateEnd, type TemplateEnd } from '../utils/template-end';

const { end, setEnd } = useTemplateEnd();
const route = useRoute();

const options: SnRadioOption[] = [
  { label: 'Web', value: 'web' },
  { label: 'uni-app', value: 'uni' },
];

const isEn = computed(() => route.path === '/en' || route.path.startsWith('/en/'));

/**
 * True while reading a web-only page with the uni-app filter on — its sidebar
 * entry is hidden, so say why instead of leaving the reader with a menu that
 * does not contain the page in front of them.
 */
const offEnd = computed(
  () =>
    end.value === 'uni' &&
    WEB_ONLY_ROUTES.some((path) => route.path === path || route.path === `${path}.html`),
);

function onChange(value: SnRadioValue): void {
  if (value === 'web' || value === 'uni') setEnd(value as TemplateEnd);
}
</script>

<template>
  <div class="sn-docs-template-end">
    <SnRadioGroup
      class="sn-docs-template-end__capsule"
      button
      size="small"
      name="sn-template-end"
      :model-value="end"
      :options="options"
      :aria-label="isEn ? 'Filter templates by end' : '按端筛选模板'"
      @update:model-value="onChange"
    />
    <p v-if="offEnd" class="sn-docs-template-end__hint">
      {{ isEn ? 'This page is web-only' : '当前页面仅 Web 端提供' }}
    </p>
  </div>
</template>

<style scoped>
.sn-docs-template-end {
  display: flex;
  flex-direction: column;
  gap: 6px;
  /* Clear of the fixed navbar: the sidebar's own top padding sits underneath it,
   * so without this the capsule reads as pinned to the top edge. */
  padding-top: 16px;
  margin-bottom: 12px;
}

/* Full width so the two segments split the sidebar evenly. */
.sn-docs-template-end__capsule {
  width: 100%;
}
.sn-docs-template-end__hint {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
  line-height: 1.5;
}
</style>
