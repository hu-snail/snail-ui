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
      type="search"
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
}

.sn-docs-search__icon {
  color: var(--sn-web-color-text-tertiary);
}
</style>
