<script setup lang="ts">
/**
 * SnDocsSearch — the always-expanded search field on documentation pages.
 *
 * Unlike `SnNavSearch` (a 32px lens that springs open — the home page's
 * behaviour), a docs page has room for a real field, and a reader who wants to
 * search should not have to discover a hidden affordance first. The field is
 * built from `SnInput` so it inherits the library's focus ring, clear button
 * and height scale, and the result dropdown is the same `SnSearchPanel` the
 * home search uses (one search implementation, two shells).
 *
 * `type="text"` is deliberate: `type="search"` makes WebKit draw its own
 * cancel button next to SnInput's `clearable` button (two × icons). The home
 * page's SnNavSearch already uses a plain text input for the same reason.
 *
 * Keyboard: ↑/↓ walk the results, Enter opens the active one, Escape clears and
 * blurs — the same map as the hero search, so muscle memory carries over.
 */
import { computed, ref } from 'vue';
import { SnIcon, SnInput } from '@snui/vue-web';
import { Search } from 'lucide-vue-next';
import SnSearchPanel from './SnSearchPanel.vue';

const query = ref('');
const focused = ref(false);
const panel = ref<InstanceType<typeof SnSearchPanel> | null>(null);

/** The dropdown is a function of "has a query and still has focus". */
const panelOpen = computed(() => focused.value && query.value.trim().length > 0);

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    query.value = '';
    (event.target as HTMLElement | null)?.blur();
    return;
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    panel.value?.move(1);
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    panel.value?.move(-1);
    return;
  }
  if (event.key === 'Enter') {
    panel.value?.chooseActive();
  }
}

/** A result was chosen: the panel navigates, we just reset the field. */
function onPanelClose(): void {
  query.value = '';
}
</script>

<template>
  <div class="sn-docs-search">
    <SnInput
      v-model="query"
      class="sn-docs-search__field"
      size="small"
      radius="pill"
      border="none"
      type="text"
      :placeholder="'搜索文档'"
      :aria-label="'搜索文档'"
      clearable
      @focus="focused = true"
      @blur="focused = false"
      @keydown="onKeydown"
    >
      <template #prefix>
        <SnIcon class="sn-docs-search__icon" :icon="Search" :size="14" />
      </template>
    </SnInput>
    <SnSearchPanel :query="query" :open="panelOpen" @close="onPanelClose" />
  </div>
</template>

<style scoped>
.sn-docs-search {
  position: relative;
  width: 260px;
  flex-shrink: 0;
}

.sn-docs-search__field {
  width: 100%;
  /* 站点级自定义底色（浅色「浅浅的」#f8f8f8 / 深色 --vp-c-bg-soft，
     见 custom.css）：文档画布是纯白，输入框只需比白低半档即可辨认，
     太深的灰底会抢视觉。走 SnInput 的 --sn-web-input-bg 钩子，
     不覆盖组件内部样式，深色模式由变量自动切换。 */
  --sn-web-input-bg: var(--sn-docs-search-bg);
}

.sn-docs-search__icon {
  color: var(--sn-web-color-text-tertiary);
}
</style>
