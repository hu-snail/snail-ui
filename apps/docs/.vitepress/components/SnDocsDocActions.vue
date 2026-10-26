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
 * body inside `.content-container`; custom.css §11 takes it out of flow and
 * lifts it above the article so it shares the title's line *and* keeps its
 * hit area.
 */

import { computed, onBeforeUnmount, ref } from 'vue'
import { useData } from 'vitepress'
import { Check, Copy, Pencil } from 'lucide-vue-next'
import { SnButton, SnIcon } from '@snui/vue-web'
import { RAW_DOC_SOURCE_ATTR } from '../utils/raw-doc-source'

/** Written onto every page by the markdown-it rule in config.ts. */
const SOURCE_SELECTOR = `div[${RAW_DOC_SOURCE_ATTR}]`

/** Used only if `themeConfig.editBase` is missing (see utils/edit-link.ts). */
const EDIT_BASE_FALLBACK = 'https://github.com/hu-snail/snail-ui/edit/main/apps/docs/'

/** How long the success / failure state stays on screen (ms). */
const FEEDBACK_MS = 2000

const { page, theme } = useData()

/**
 * Branch-matched at build time by utils/edit-link.ts and shipped through
 * `themeConfig.editBase`; the constant is only a safety net for a config
 * that predates it.
 */
const editBase = computed<string>(
  () => (theme.value as { editBase?: string }).editBase || EDIT_BASE_FALLBACK,
)

const editUrl = computed<string>(() =>
  page.value.relativePath ? `${editBase.value}${page.value.relativePath}` : '',
)

const state = ref<'idle' | 'copied' | 'failed'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined

const label = computed<string>(() => {
  if (state.value === 'copied') return '已复制文档源码'
  if (state.value === 'failed') return '复制失败，请重试'
  return '复制文档'
})

const icon = computed(() => (state.value === 'copied' ? Check : Copy))

/**
 * Read the page's markdown back out of its hidden carrier element.
 *
 * The payload is base64 (see `utils/raw-doc-source.ts` for why escaping alone
 * is not enough: Vue's template tokenizer re-parses attribute values, so any
 * `<` in the markdown collides with the page's own attribute names). Decoding
 * is the exact inverse — base64 → UTF-8 bytes → string.
 */
function readSource(): string {
  const el = document.querySelector<HTMLElement>(SOURCE_SELECTOR)
  const payload = el ? el.getAttribute(RAW_DOC_SOURCE_ATTR) : null
  if (!payload) return ''
  try {
    const binary = atob(payload)
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
    return new TextDecoder().decode(bytes)
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

/**
 * `navigator.clipboard` only exists in a secure context, and it can also be
 * present yet reject (permissions policy). The published site is https, but
 * an `http://` preview — or an embedded/iframe context — would otherwise
 * fail every time behind "复制失败". Fall back to the selection-based copy,
 * which still works there. No `await` runs before `execCommand`, so the call
 * stays inside the click's user-gesture window.
 */
async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // fall through to the legacy path
    }
  }

  const scratch = document.createElement('textarea')
  scratch.value = text
  scratch.setAttribute('readonly', '')
  // Off-screen but still selectable — `display: none` could not be selected.
  scratch.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0'
  document.body.appendChild(scratch)
  try {
    scratch.select()
    if (!document.execCommand('copy')) throw new Error('copy rejected')
  } finally {
    document.body.removeChild(scratch)
  }
}

async function copyDoc(): Promise<void> {
  const source = readSource()
  if (!source) {
    flash('failed')
    return
  }
  try {
    await writeClipboard(source)
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
