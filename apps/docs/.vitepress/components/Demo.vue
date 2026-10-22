<script setup lang="ts">
/**
 * Demo — wraps a per-component demo .vue file with a unified demo + code
 * module (per docs redesign, AUI-DOCS-016 + WBS v3.1).
 *
 * Per-component demo files live at apps/docs/.vitepress/demo/<name>.vue.
 * VitePress compiles them via @vue/compiler-sfc (compile-time macros like
 * defineOptions / defineProps are transformed before reaching the browser).
 *
 * Features:
 *   1. Live render of the named demo file via dynamic import + ClientOnly
 *   2. Collapsible code block (default collapsed) showing the demo source
 *   3. Toolbar with copy button (TS source → clipboard) + fullscreen toggle
 *   4. Optional `description` prop shown above the demo (supports markdown
 *      inline code via backticks already)
 *   5. TS-only source rendering (raw source from `?raw` import). JS conversion
 *      skipped — naive TS→JS stripping is fragile and not worth the surface
 *
 * Usage in .md:
 *   <Demo name="button-web" />
 *   <Demo name="divider-mp" description="基本分割线" />
 */

import { computed, defineAsyncComponent, h, ref, watch } from 'vue'
import { Check, Copy, ChevronRight, ChevronDown } from 'lucide-vue-next'
import { SnIcon } from '@snui/vue-web'

interface Props {
  /** Demo file basename (without .vue) under apps/docs/.vitepress/demo/. */
  name: string
  /** Optional description shown above the demo (rendered as plain text). */
  description?: string
  /** Hide the wrapping card chrome (used inside docs prose). */
  bare?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  bare: false,
})

// Dynamic import of demo file (async chunk split).
//
// 双语机制(naive-ui 官网同构):英文站点优先加载 `demo-en/<name>.vue`
// 影子文件(渲染 + 代码面板都用它);不存在时回退中文 demo。影子文件是
// 普通源码,保持 demo「可复制即真实用法」的教学价值;md 页零改动。
import { useData } from 'vitepress'
const { lang } = useData()
const isEn = computed(() => lang.value === 'en-US')
const demoModules = {
  ...import.meta.glob('../demo/*.vue'),
  ...import.meta.glob('../demo-en/*.vue'),
}
const AsyncDemo = defineAsyncComponent({
  loader: () => {
    const enKey = `../demo-en/${props.name}.vue`
    const key = isEn.value && demoModules[enKey] !== undefined ? enKey : `../demo/${props.name}.vue`
    const mod = demoModules[key]
    if (!mod) {
      return Promise.resolve(
        { render: () => h('div', { class: 'sn-demo-error' }, `demo not found: ${props.name}`) },
      )
    }
    return mod()
      .then((m: { default: unknown }) => m)
      .catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error(`[Demo] failed to load ${props.name}:`, err)
        return {
          render: () => h('div', { class: 'sn-demo-error' }, `demo failed to load: ${props.name}`),
        }
      })
  },
  delay: 0,
})

/** 双语 chrome 文案(复制 / 展开代码),跟随站点语言。 */
const t = computed(() =>
  isEn.value
    ? { copy: 'Copy', copied: 'Copied', copyCode: 'Copy code', expandCode: 'Show code', collapseCode: 'Hide code' }
    : { copy: '复制', copied: '已复制', copyCode: '复制代码', expandCode: '展开代码', collapseCode: '收起代码' },
)

// Raw source of the demo file (for the code panel). Both the Chinese and
// English shadow dirs are inlined eagerly (`?raw` build-time strings).
//
// `import.meta.glob` key shape is build-dependent (may or may not carry the
// `?raw` suffix) — match by filename suffix instead of a literal key.
type RawModule = string
const sourceModules = {
  ...import.meta.glob<RawModule>('../demo/*.vue', { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob<RawModule>('../demo-en/*.vue', { query: '?raw', import: 'default', eager: true }),
}

function findSourceKey(name: string): string | undefined {
  // English site shows the English shadow source when available (the code
  // panel must match what is rendered), falling back to the Chinese demo.
  const enBase = `/demo-en/${name}.vue`
  const base = `/demo/${name}.vue`
  for (const key of Object.keys(sourceModules)) {
    if (isEn.value && (key.endsWith(enBase) || key.endsWith(`${enBase}?raw`))) return key
  }
  for (const key of Object.keys(sourceModules)) {
    if (key.endsWith(base) || key.endsWith(`${base}?raw`)) return key
  }
  return undefined
}

const source = computed<RawModule>(() => {
  const key = findSourceKey(props.name)
  if (key !== undefined) {
    const mod = sourceModules[key]
    if (typeof mod === 'string') return mod
  }
  return `// Demo source not found: ${props.name}`
})


// Code panel: collapsed by default. Toggled by toolbar button (and also by
// the inner ⏵ chevron when the user wants a quick inline affordance).
const codeOpen = ref(false)
function toggleCode() {
  codeOpen.value = !codeOpen.value
}

// Toolbar: copy-to-clipboard.
const copied = ref(false)
async function copyCode(): Promise<void> {
  try {
    await navigator.clipboard.writeText(source.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Demo] copy failed', err)
  }
}

// Syntax-highlighted HTML (Shiki). Demo files are .vue (script + template +
// <style scoped>), so we always pass `lang: 'vue'` regardless of demo kind.
// Highlighted HTML is built lazily — only when the code panel is expanded,
// to avoid paying the highlight cost for collapsed panels.
// Dual-theme output (light + dark) so the panel keeps readable contrast in
// both modes; the CSS below picks the matching --shiki-* variable.
import { createHighlighter } from 'shiki'
const highlighted = ref('')
const highlighterPromise = createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['vue'],
})
watch(
  [() => codeOpen.value, () => source.value],
  async ([open, src]) => {
    if (!open) {
      highlighted.value = ''
      return
    }
    const hl = await highlighterPromise
    highlighted.value = hl.codeToHtml(src, {
      lang: 'vue',
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
  },
  { immediate: true },
)
</script>

<template>
  <div :class="['sn-demo', bare ? 'sn-demo--bare' : '']">
    <p v-if="description" class="sn-demo__description">{{ description }}</p>

    <div class="sn-demo__card">
      <ClientOnly>
        <component :is="AsyncDemo" />
        <template #fallback>
          <div class="sn-demo__loading">
            <span class="sn-demo-spinner" aria-hidden="true" />
            <span>Loading {{ name }} …</span>
          </div>
        </template>
      </ClientOnly>
    </div>

    <div class="sn-demo__toolbar">
      <span class="sn-demo__lang">TypeScript</span>
      <div class="sn-demo__actions">
        <button
          type="button"
          class="sn-demo__action"
          :title="copied ? t.copied : t.copyCode"
          @click="copyCode"
        >
          <SnIcon :icon="copied ? Check : Copy" :size="14" />
          <span class="sn-demo__action-label">{{ copied ? t.copied : t.copy }}</span>
        </button>
        <button
          type="button"
          class="sn-demo__action"
          :title="codeOpen ? t.collapseCode : t.expandCode"
          :aria-expanded="codeOpen"
          @click="toggleCode"
        >
          <SnIcon
            :icon="codeOpen ? ChevronDown : ChevronRight"
            :size="14"
            class="sn-demo__chevron"
          />
          <span class="sn-demo__action-label">{{ codeOpen ? t.collapseCode : t.expandCode }}</span>
        </button>
      </div>
    </div>

    <div v-show="codeOpen" class="sn-demo__code">
      <div class="sn-demo__code-body" v-html="highlighted || ''" />
      <pre v-if="!highlighted" class="sn-demo__code-fallback"><code>{{ source }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.sn-demo {
  margin: 24px 0;
}

.sn-demo__description {
  margin: 0 0 12px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.sn-demo__card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 24px;
  /* 预览面与页面底色一致（白底），避免浅灰内嵌。 */
  background: var(--vp-c-bg);
  min-height: 80px;
  position: relative;
}

.sn-demo--bare .sn-demo__card {
  border: 0;
  padding: 0;
  background: transparent;
}

.sn-demo__loading {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.sn-demo-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: sn-demo-spin 0.8s linear infinite;
}
@keyframes sn-demo-spin {
  to {
    transform: rotate(360deg);
  }
}

.sn-demo-error {
  color: var(--vp-c-danger-1);
  font-size: 13px;
  padding: 8px 12px;
  border: 1px dashed var(--vp-c-danger-1);
  border-radius: 4px;
}

.sn-demo__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
  padding: 0 4px;
}

/* 语言徽标：中性柔和底，不用彩色填充。 */
.sn-demo__lang {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.sn-demo__actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 工具栏按钮：ghost 按钮，无边框，hover 用柔和底。 */
.sn-demo__action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}
.sn-demo__action:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}
.sn-demo__action span[aria-hidden] {
  font-size: 14px;
  line-height: 1;
}

/* 代码面板：细发丝边框 + 柔和中性底 + 微圆角。 */
.sn-demo__code {
  margin-top: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.sn-demo__chevron {
  font-size: 12px;
  line-height: 1;
}

/* Shiki output: a <pre> containing <code><span>…</span></code>. */
.sn-demo__code-body {
  padding: 12px 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.55;
  font-family: var(--vp-font-family-mono);
}
.sn-demo__code-body :deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent !important;
}
.sn-demo__code-body :deep(code) {
  display: block;
  background: transparent !important;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  color: var(--vp-c-text-1);
}
.sn-demo__code-body :deep(.line) {
  display: block;
  min-height: 1em;
}

/* Shiki 双主题 token：明/暗各取一套配色，避免浅底浅字 / 深底深字。 */
.sn-demo__code-body :deep(.shiki),
.sn-demo__code-body :deep(.shiki span) {
  color: var(--shiki-light, var(--vp-c-text-1));
}
.dark .sn-demo__code-body :deep(.shiki),
.dark .sn-demo__code-body :deep(.shiki span) {
  color: var(--shiki-dark, var(--vp-c-text-1));
}

/* Plain-text fallback used until Shiki finishes (rare). */
.sn-demo__code-fallback {
  margin: 0;
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.55;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  background: transparent;
  white-space: pre;
  overflow-x: auto;
}

@media (max-width: 640px) {
  .sn-demo__action-label {
    display: none;
  }
}
</style>