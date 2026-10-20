<script setup lang="ts">
/**
 * SnDocsCopyDoc — copies the current page's markdown source.
 *
 * The raw markdown of every page is embedded by the `sn-raw-doc-source`
 * markdown-it rule (see .vitepress/config.ts) as
 *
 *   <div hidden data-sn-doc-source="…"></div>
 *
 * so the button copies the exact source the page was authored in — headings,
 * prose and the `<Demo … />` tags included — rather than anything
 * reconstructed from the rendered DOM. That is what a reader wants to paste
 * into their own project, or into an AI prompt.
 *
 * Mounted at the top of the article through the `doc-before` slot.
 */

import { computed, onBeforeUnmount, ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { SnButton, SnIcon } from '@snui/vue-web'
import { RAW_DOC_SOURCE_ATTR } from '../utils/raw-doc-source'

/** Written onto every page by the markdown-it rule in config.ts. */
const SOURCE_SELECTOR = `div[${RAW_DOC_SOURCE_ATTR}]`

/** How long the success / failure state stays on screen (ms). */
const FEEDBACK_MS = 2000

const state = ref<'idle' | 'copied' | 'failed'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined

const label = computed<string>(() => {
  if (state.value === 'copied') return '已复制文档源码'
  if (state.value === 'failed') return '复制失败，请重试'
  return '复制文档'
})

const icon = computed(() => (state.value === 'copied' ? Check : Copy))

function readSource(): string {
  const el = document.querySelector<HTMLElement>(SOURCE_SELECTOR)
  const payload = el ? el.getAttribute(RAW_DOC_SOURCE_ATTR) : null
  if (!payload) return ''
  try {
    return JSON.parse(payload) as string
  } catch {
    return ''
  }
}

function flash(next: 'copied' | 'failed'): void {
  state.value = next
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    state.value = 'idle'
  }, FEEDBACK_MS)
}

async function copyDoc(): Promise<void> {
  const source = readSource()
  if (!source) {
    flash('failed')
    return
  }
  try {
    await navigator.clipboard.writeText(source)
    flash('copied')
  } catch {
    flash('failed')
  }
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <div class="sn-docs-copy-doc">
    <SnButton
      class="sn-docs-copy-doc__button"
      size="small"
      :aria-label="label"
      :title="label"
      @click="copyDoc"
    >
      <SnIcon class="sn-docs-copy-doc__icon" :icon="icon" />
    </SnButton>
  </div>
</template>

<style scoped>
/* Right-aligned row above the article body. */
.sn-docs-copy-doc {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
.sn-docs-copy-doc__button {
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
  border-color: transparent;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
}
.sn-docs-copy-doc__button:hover:not(.sn-button--disabled) {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-copy-doc__icon {
  width: var(--sn-web-icon-size-medium);
  height: var(--sn-web-icon-size-medium);
}
.sn-docs-copy-doc__icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
