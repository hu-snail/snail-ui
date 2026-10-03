<script setup lang="ts">
/**
 * ThemeCopier — displays a ready-to-paste snippet for the current Style Pack.
 *
 * Per AUI-PRD-v3.0 §7.2 + Spec-05 §4:
 *   - Shows main.ts snippet that the user can copy to apply the current Pack
 *   - One-click copy + "Copied" feedback
 *   - Auto-syncs with StyleSwitcher's active pack
 */

import { ref } from 'vue'
import { getStylePack } from '@snui/ai'
import { defaultPack, iosPack, darkPack } from '@snui/style-packs'

const props = withDefaults(
  defineProps<{
    /** Currently active Pack name (controlled by StyleSwitcher). */
    pack?: string
  }>(),
  { pack: 'default' },
)

const copied = ref(false)

const PACK_SNIPPETS: Record<string, string> = {
  default: `// main.ts — switch to default Pack
import { snCssVars } from '@snui/tokens'
import { defaultPack } from '@snui/style-packs/default'

const el = document.createElement('style')
el.textContent = snCssVars({ style: defaultPack.style, density: defaultPack.density })
document.head.appendChild(el)`,
  ios: `// main.ts — switch to iOS Pack
import { snCssVars } from '@snui/tokens'
import { iosPack } from '@snui/style-packs/ios'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: iosPack.theme,
  style: iosPack.style,
  density: iosPack.density,
})
document.head.appendChild(el)`,
  dark: `// main.ts — switch to dark Pack
import { snCssVars } from '@snui/tokens'
import { darkPack } from '@snui/style-packs/dark'

const el = document.createElement('style')
el.textContent = snCssVars({
  theme: darkPack.theme,
  style: darkPack.style,
  density: darkPack.density,
})
document.head.appendChild(el)`,
}

const snippet = ref('')

// Initialize from props.pack; refresh whenever it changes.
async function load(): Promise<void> {
  // First try the API-driven snippet (covers any future packs added dynamically);
  // fall back to the static lookup.
  try {
    const info = await getStylePack(props.pack).handle({ name: props.pack })
    snippet.value = info.snippet
  } catch {
    snippet.value = PACK_SNIPPETS[props.pack] ?? PACK_SNIPPETS['default'] ?? ''
  }
}

import { watch } from 'vue'
watch(() => props.pack, () => load(), { immediate: true })

async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(snippet.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1400)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = snippet.value
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } finally { document.body.removeChild(ta) }
    copied.value = true
    setTimeout(() => { copied.value = false }, 1400)
  }
}
</script>

<template>
  <div class="sn-theme-copier">
    <div class="sn-theme-copier__header">
      <span class="sn-theme-copier__title">复制配置到项目</span>
      <button
        type="button"
        class="sn-theme-copier__btn"
        :class="{ 'is-copied': copied }"
        @click="copy"
      >
        {{ copied ? '✓ Copied' : 'Copy' }}
      </button>
    </div>
    <pre class="sn-theme-copier__pre"><code>{{ snippet }}</code></pre>
  </div>
</template>

<style scoped>
.sn-theme-copier {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
}
.sn-theme-copier__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.sn-theme-copier__title {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
.sn-theme-copier__btn {
  font-size: 12px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  color: var(--vp-c-text-1);
}
.sn-theme-copier__btn.is-copied {
  color: var(--vp-c-success-1);
}
.sn-theme-copier__pre {
  background: var(--vp-c-bg-soft);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
  font-size: 12px;
}
</style>