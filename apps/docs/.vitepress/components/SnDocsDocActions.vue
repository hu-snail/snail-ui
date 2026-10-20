<script setup lang="ts">
/**
 * SnDocsDocActions — the pair of icon actions that ride the article's title
 * row, right-aligned next to the `<h1>`:
 *
 *   - copy: copies the current page's markdown source
 *   - edit: opens the page's source file on GitHub in a new tab
 *
 * The raw markdown of every page is embedded by the `sn-raw-doc-source`
 * markdown-it rule (see .vitepress/config.ts) as
 *
 *   <div hidden data-sn-doc-source="…"></div>
 *
 * so the copy button hands over the exact source the page was authored in —
 * headings, prose and the `<Demo … />` tags included — rather than anything
 * reconstructed from the rendered DOM. That is what a reader wants to paste
 * into their own project, or into an AI prompt.
 *
 * The edit target is derived from VitePress's `page.relativePath`, which is
 * already locale-aware (`en/…` for the English pages) and relative to the
 * docs `srcDir`, so one pattern covers both locales.
 *
 * Mounted through the `doc-before` slot, i.e. as a sibling of the article
 * body inside `.content-container`; custom.css §11 takes it out of flow so
 * it shares the line with the title instead of pushing it down.
 */

import { computed, onBeforeUnmount, ref } from 'vue'
import { useData } from 'vitepress'
import { Check, Copy, Pencil } from 'lucide-vue-next'
import { SnButton, SnIcon } from '@snui/vue-web'
import { RAW_DOC_SOURCE_ATTR } from '../utils/raw-doc-source'

/** Written onto every page by the markdown-it rule in config.ts. */
const SOURCE_SELECTOR = `div[${RAW_DOC_SOURCE_ATTR}]`

/** Repository root for "edit this page". `:path` is `page.relativePath`. */
const EDIT_BASE = 'https://github.com/hu-snail/snail-ui/edit/main/apps/docs/'

/** How long the success / failure state stays on screen (ms). */
const FEEDBACK_MS = 2000

const { page } = useData()

const editUrl = computed<string>(() =>
  page.value.relativePath ? `${EDIT_BASE}${page.value.relativePath}` : '',
)

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
  <div class="sn-docs-doc-actions">
    <SnButton
      class="sn-docs-doc-actions__button"
      size="small"
      :aria-label="label"
      :title="label"
      @click="copyDoc"
    >
      <SnIcon class="sn-docs-doc-actions__icon" :icon="icon" />
    </SnButton>

    <!-- Left out entirely when the page has no source path (e.g. the
         generated 404), rather than rendering a dead link. -->
    <SnButton
      v-if="editUrl"
      class="sn-docs-doc-actions__button"
      tag="a"
      size="small"
      :href="editUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="编辑本页"
      title="编辑本页"
    >
      <SnIcon class="sn-docs-doc-actions__icon" :icon="Pencil" />
    </SnButton>
  </div>
</template>

<style scoped>
/* Compact icon row; custom.css parks it on the title line. */
.sn-docs-doc-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}
.sn-docs-doc-actions__button {
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
  border-color: transparent;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
}
.sn-docs-doc-actions__button:hover:not(.sn-button--disabled) {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-doc-actions__icon {
  width: var(--sn-web-icon-size-medium);
  height: var(--sn-web-icon-size-medium);
}
.sn-docs-doc-actions__icon :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
