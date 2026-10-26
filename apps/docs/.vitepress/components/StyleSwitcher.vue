<script setup lang="ts">
/**
 * StyleSwitcher — global Style Pack switcher for the docs site.
 *
 * Per AUI-PRD-v3.0 §7.1 + Spec-05 §3:
 *   - Floating panel listing all official Style Packs
 *   - Click → inject CSS variables + activate skin class on document.body
 *   - Web端 mechanism only (uni 端通过 ConfigProvider skin prop in source)
 *
 * Per AGENTS.md §89, this component does not depend on any token JS API at
 * runtime — it uses pre-baked snippets from @snui/ai/get-style-pack so that
 * the docs site stays self-contained.
 */

import { ref } from 'vue'
import { allPacks } from '@snui/style-packs'
import { snCssVars } from '@snui/tokens'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import { SnIcon } from '@snui/vue-web'

const activePack = ref<string>('default')
const open = ref(false)

const PACKS = allPacks.map((p) => ({
  name: p.name,
  label: p.label,
  description: p.description ?? '',
}))

function applyPack(name: string): void {
  activePack.value = name
  const pack = allPacks.find((p) => p.name === name)
  if (!pack) return
  const css = snCssVars({
    theme: pack.theme,
    style: pack.style,
    density: pack.density,
  })
  // Inject into <style id="snui-docs-pack"> in <head>.
  let styleEl = document.getElementById('snui-docs-pack') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'snui-docs-pack'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = css

  // Body class for any skin-CSS overlays (no official packs have skinCss yet,
  // but the hook is ready for doodle / sticky-note / douyin).
  document.body.classList.forEach((c) => {
    if (c.startsWith('snui-skin-')) document.body.classList.remove(c)
  })
  if (name !== 'default') document.body.classList.add(`snui-skin-${name}`)

  open.value = false
}
</script>

<template>
  <div class="sn-style-switcher" :class="{ 'is-open': open }">
    <button
      type="button"
      class="sn-style-switcher__trigger"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="sn-style-switcher__dot" :style="{ background: 'var(--sn-color-action-primary)' }" />
      <span class="sn-style-switcher__label">{{ activePack }}</span>
      <span class="sn-style-switcher__chevron">
        <SnIcon :icon="open ? ChevronDown : ChevronRight" :size="12" />
      </span>
    </button>
    <div v-if="open" class="sn-style-switcher__panel" role="dialog" aria-label="Style Pack">
      <button
        v-for="p in PACKS"
        :key="p.name"
        type="button"
        class="sn-style-switcher__item"
        :class="{ 'is-active': activePack === p.name }"
        @click="applyPack(p.name)"
      >
        <span class="sn-style-switcher__item-label">{{ p.label }}</span>
        <span class="sn-style-switcher__item-desc">{{ p.description }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sn-style-switcher {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  font-family: var(--vp-font-family-base, -apple-system, BlinkMacSystemFont, sans-serif);
}
.sn-style-switcher__trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}
.sn-style-switcher__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sn-color-action-primary);
}
.sn-style-switcher__label {
  font-weight: 500;
  text-transform: capitalize;
}
.sn-style-switcher__panel {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  background: var(--vp-c-bg-elv, #ffffff);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 8px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sn-style-switcher__item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  color: var(--vp-c-text-1);
}
.sn-style-switcher__item:hover {
  background: var(--vp-c-bg-soft);
}
.sn-style-switcher__item.is-active {
  border-color: var(--sn-color-action-primary);
}
.sn-style-switcher__item-label {
  font-weight: 500;
}
.sn-style-switcher__item-desc {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
</style>