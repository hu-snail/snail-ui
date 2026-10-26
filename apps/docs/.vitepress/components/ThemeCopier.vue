<script setup lang="ts">
/**
 * ThemeCopier — displays a ready-to-paste snippet for the current Style Pack.
 *
 * Per AUI-PRD-v3.0 §7.2 + Spec-05 §4:
 *   - Shows main.ts snippet that the user can copy to apply the current Pack
 *   - One-click copy + "Copied" feedback
 *   - Auto-syncs with StyleSwitcher's active pack via props.pack
 *
 * Browser-safe: only imports @snui/style-packs (data objects), no Node-only
 * APIs. The `loadSkill()` helper from @snui/ai is intentionally NOT imported
 * here — VitePress bundles for the browser and chokes on node:fs / node:path.
 * @snui/ai's MCP / aggregator functions are still consumed server-side.
 */

import { ref, watch } from 'vue'
import { defaultPack, iosPack, darkPack, allPacks, getPack } from '@snui/style-packs'
import { Check, Copy } from 'lucide-vue-next'
import { SnIcon } from '@snui/vue-web'

const props = withDefaults(
  defineProps<{
    /** Currently active Pack name (controlled by StyleSwitcher). */
    pack?: string
  }>(),
  { pack: 'default' },
)

const copied = ref(false)
const snippet = ref('')

/**
 * Build the main.ts snippet for a given Pack name.
 * Pure string interpolation over the static Pack definition — no runtime
 * generation of code, no Node.js APIs.
 */
function buildSnippet(name: string): string {
  const pack = getPack(name) ?? allPacks[0]
  if (!pack) return ''
  const header = `import { snCssVars } from '@snui/tokens'\nimport { ${name}Pack } from '@snui/style-packs/${name}'\n`
  const callParts: string[] = []
  if (pack.theme) callParts.push('theme: ' + name + 'Pack.theme')
  if (pack.style) callParts.push('style: ' + name + 'Pack.style')
  if (pack.density) callParts.push('density: ' + name + 'Pack.density')
  const call = 'snCssVars({\n  ' + callParts.join(',\n  ') + ',\n})'
  return `${header}
const el = document.createElement('style')
el.textContent = ${call}
document.head.appendChild(el)
`
}

function refresh(): void {
  snippet.value = buildSnippet(props.pack)
}

// Initialize on mount and whenever the active pack changes.
watch(() => props.pack, () => refresh(), { immediate: true })

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

// Suppress unused-import warnings (defaultPack / darkPack / iosPack are public
// references for tree-shaking + future direct API usage).
void defaultPack; void iosPack; void darkPack
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
        <SnIcon v-if="copied" :icon="Check" :size="12" />
        <SnIcon v-else :icon="Copy" :size="12" />
        <span style="margin-left: 4px;">{{ copied ? 'Copied' : 'Copy' }}</span>
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