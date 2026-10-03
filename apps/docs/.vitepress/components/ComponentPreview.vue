<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';

/**
 * ComponentPreview — placeholder for SnButton / sn-button live preview.
 *
 * Status: BLOCKED (AGENTS.md §86 — 3 fix attempts exhausted).
 *
 * Per AUI-PRD-v3.0 + ADR-0002 (FOUND-002): the intended implementation is to
 * import the real @snui/vue-web component and mount via createApp(). The code
 * path works in browser runtime (verified via dev server), but VitePress's
 * prerender pipeline loads .vue files as raw ESM in SSR — compile-time
 * macros (defineOptions / defineProps) are stripped to undefined identifiers,
 * causing a build crash.
 *
 * M0.5 outcome: the live preview is replaced by a static `<pre>` Vue SFC
 * snippet + a labeled "preview pending" placeholder. The file structure
 * (props + computed code) is forward-compatible with a future fix
 * (e.g. wrapping each ComponentPreview call site in vitepress <ClientOnly>,
 * or moving to a per-component .demo.vue under apps/docs/.vitepress/demo/).
 *
 * Failure / Hypothesis / Attempts:
 *   Failure:  ReferenceError: defineOptions is not defined
 *             at .vitepress/.temp/SnButton.vue.DXvh31Yh.js
 *   Hypothesis: VitePress prerender imports @snui/vue-web .vue files as raw
 *               ES modules; compile-time macros are not transformed.
 *   Attempt 1: removed static `import { SnButton }` and moved to onMounted
 *               with `if (typeof window === 'undefined') return` guard.
 *               Result: SnButton.vue still in module graph via lazy import.
 *   Attempt 2: vitepress config — vite.ssr.noExternal = @snui/vue-web.
 *               Result: still loaded; SSR file is .temp/SnButton.vue.*.js.
 *   Attempt 3: this placeholder fallback (current).
 *
 * Follow-up task (AUI-DOCS-016): Either wrap ComponentPreview calls in
 * vitepress ClientOnly (8 md files × 2 locales = 16 edits), or refactor to
 * a per-component .demo.vue plus loading-bridge markup. Tracked in WBS.
 */

interface Props {
  /** Component to render. Default: 'button' (only supported name in M0.5). */
  name?: 'button';
  /** Visual variant passed to <SnButton>. */
  variant?: 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info';
  /** Size preset passed to <SnButton>. */
  size?: 'tiny' | 'small' | 'medium' | 'large';
  /** Disabled flag. */
  disabled?: boolean;
  /** Loading flag. */
  loading?: boolean;
  /** Button label. */
  text?: string;
  /** Optional CSS class on the preview card. */
  cardClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: 'button',
  variant: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  text: 'Button',
  cardClass: '',
});

// useData() provided by VitePress — call for parity with previous implementation.
useData

const codeSnippet = computed(() => {
  const lines: Array<string> = []
  lines.push(`<template>`)
  lines.push(`  <SnButton`)
  if (props.variant !== 'default') lines.push(`    type="${props.variant}"`)
  if (props.size !== 'medium') lines.push(`    size="${props.size}"`)
  if (props.disabled) lines.push(`    disabled`)
  if (props.loading) lines.push(`    loading`)
  lines.push(`  >`)
  lines.push(`    ${props.text}`)
  lines.push(`  </SnButton>`)
  lines.push(`</template>`)
  return lines.join('\n')
})

const copied = ref(false)
async function copySnippet(): Promise<void> {
  try {
    await navigator.clipboard.writeText(codeSnippet.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1400)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = codeSnippet.value
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } finally { document.body.removeChild(ta) }
    copied.value = true
    setTimeout(() => { copied.value = false }, 1400)
  }
}
</script>

<template>
  <div class="sn-preview">
    <div class="preview-card preview-card--placeholder" :class="cardClass">
      <span class="preview-card__label">
        {{ text }} <span class="preview-card__meta">({{ variant }} / {{ size }})</span>
      </span>
      <span class="preview-card__note">preview pending — AUI-DOCS-016</span>
    </div>

    <details class="sn-source-block" open>
      <summary>
        <span class="sn-source-label">Vue SFC</span>
        <button
          type="button"
          class="sn-copy-btn"
          :class="{ 'is-copied': copied }"
          @click.stop.prevent="copySnippet"
        >
          {{ copied ? '✓ Copied' : 'Copy' }}
        </button>
      </summary>
      <pre class="sn-source-pre"><code>{{ codeSnippet }}</code></pre>
    </details>
  </div>
</template>

<style scoped>
.sn-preview {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
}
.preview-card {
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.preview-card__meta {
  color: var(--vp-c-text-3);
  margin-left: 6px;
}
.preview-card__note {
  margin-left: auto;
  font-size: 11px;
  color: var(--vp-c-warning-1);
  font-style: italic;
}
.sn-source-block {
  margin-top: 12px;
  font-size: 13px;
}
.sn-source-block summary {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sn-copy-btn {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}
.sn-copy-btn.is-copied {
  color: var(--vp-c-success-1);
}
.sn-source-pre {
  background: var(--vp-c-bg-soft);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 8px 0 0;
}
</style>