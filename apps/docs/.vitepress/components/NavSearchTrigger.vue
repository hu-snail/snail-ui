<script setup lang="ts">
/**
 * NavSearchTrigger — a permanent "搜索组件 ⌘ K" button injected into the
 * navbar's nav-bar-content-after slot.
 *
 * Why this exists alongside VitePress's default DocSearch-Button:
 *   - VitePress's default collapses to a tiny 48x55px icon and is easy
 *     to miss; even with custom.css widening it, the label was tiny.
 *   - We want one obvious affordance that says "搜索组件 / ⌘ K" in a
 *     way that survives language switching.
 *
 * Click and Cmd/Ctrl+K both dispatch a custom event the CommandPalette
 * listens for; we don't import the palette here to avoid coupling.
 */

import { onBeforeUnmount, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'

function openPalette(): void {
  window.dispatchEvent(new CustomEvent('snui:open-command-palette'))
}

function onKeydown(e: KeyboardEvent): void {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    openPalette()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <button
    type="button"
    class="sn-nav-search"
    :title="`搜索组件  ⌘ K`"
    aria-label="搜索组件"
    @click="openPalette"
  >
    <Search :size="14" />
    <span class="sn-nav-search__label">搜索组件</span>
    <span class="sn-nav-search__kbd">
      <kbd>⌘</kbd><kbd>K</kbd>
    </span>
  </button>
</template>

<style scoped>
.sn-nav-search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px 0 10px;
  margin: 0 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-alt, var(--vp-c-bg-soft));
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: border-color 0.18s, background 0.18s, color 0.18s;
}
.sn-nav-search:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.sn-nav-search:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.sn-nav-search__label {
  font-weight: 500;
  white-space: nowrap;
}
.sn-nav-search__kbd {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 2px;
  padding-left: 6px;
  border-left: 1px solid var(--vp-c-divider);
}
.sn-nav-search__kbd kbd {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  padding: 2px 4px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}
@media (max-width: 640px) {
  .sn-nav-search__label,
  .sn-nav-search__kbd {
    display: none;
  }
  .sn-nav-search {
    padding: 0 8px;
  }
}
</style>
