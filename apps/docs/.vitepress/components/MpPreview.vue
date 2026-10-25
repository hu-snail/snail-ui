<script setup lang="ts">
/**
 * MpPreview — the standalone uni demo preview route (`/preview-mp`).
 *
 * Every uni demo renders through this page inside an iframe (see Demo.vue /
 * DemoDock.vue): the iframe gives the demo its own browsing context, so
 * gestures (the sn-paging pull), fixed layers and page-level scrolling behave
 * like a real app screen instead of fighting the docs layout. It also gives
 * navigation a history of its own — "back" returns to the overview inside the
 * same iframe, never to the enclosing docs page.
 *
 * Query contract:
 *   ?comp=<name>  — a component's short name: every `<name>-mp*` demo shows
 *                   up as a switchable scenario list
 *   ?demo=<file>  — jump straight to one demo file (used by inline Demos)
 *   ?mode=unix    — start in the uni-app x view
 *
 * Top bar: back + title + mode switch (uni-app / uni-app x). The uni-app x
 * mode explains the native-rendering (uvue) pipeline instead of simulating
 * it — a browser cannot render vapor output; see AGENTS.md §116 / ADR-0004.
 *
 * Visual language (per the reference mock): page background #f8f8f8, white
 * modules with a large 24px radius, flat (no shadow / border). Dark mode
 * mirrors the parent frame's `dark` class via a MutationObserver — this page
 * runs `layout: false`, so the theme chrome never toggles it for us.
 */
import { computed, onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import { useData, withBase } from 'vitepress'
import { ChevronLeft } from 'lucide-vue-next'
import { listMpDemoNames, loadDemoComponent } from '../utils/demo-loader'

type PreviewMode = 'uniapp' | 'unix'

const { lang } = useData()
const isEn = computed(() => lang.value === 'en-US')

const comp = ref('')
const demoName = ref('')
const mode = ref<PreviewMode>('uniapp')
const ready = ref(false)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  comp.value = (params.get('comp') ?? '').trim()
  demoName.value = (params.get('demo') ?? '').trim()
  if (params.get('mode') === 'unix') mode.value = 'unix'
  if (demoName.value === '' && comp.value !== '') {
    demoName.value = listMpDemoNames(comp.value)[0] ?? ''
  }
  ready.value = true
  syncTheme()
})

/** Scenario list: the component's demos, or just the pinned one. */
const scenarios = computed(() => {
  if (comp.value === '') return demoName.value === '' ? [] : [demoName.value]
  return listMpDemoNames(comp.value)
})

const activeIndex = computed(() =>
  Math.max(0, scenarios.value.indexOf(demoName.value)),
)

const title = computed(() =>
  comp.value !== '' ? `sn-${comp.value}` : demoName.value || 'Preview',
)

/** Chip label: the scenario suffix after the component marker (`-mp-`). */
function labelOf(name: string): string {
  return name.includes('-mp-') ? (name.split('-mp-')[1] ?? name) : name
}

const AsyncDemo = computed<Component | null>(() => {
  if (mode.value !== 'uniapp' || demoName.value === '') return null
  return loadDemoComponent(demoName.value, isEn.value)
})

const t = computed(() =>
  isEn.value
    ? {
        back: 'Back',
        uniapp: 'uni-app',
        unix: 'uni-app x',
        missing: 'No preview found for this route.',
        loading: 'Loading preview…',
        unixTitle: 'uni-app x · native rendering',
        unixBody:
          'On uni-app x the App side runs this component through the deterministic uvue transform on a native rendering engine — a browser cannot simulate that output. Preview it with HBuilderX on a real device.',
        unixGuide: 'uni-app x guide',
        unixReport: 'Porting report',
        scenarios: 'Scenarios',
      }
    : {
        back: '返回',
        uniapp: 'uni-app',
        unix: 'uni-app x',
        missing: '该路由暂无可预览的内容。',
        loading: '预览加载中…',
        unixTitle: 'uni-app x · 原生渲染',
        unixBody:
          'uni-app x 的 App 端由确定性转换管线生成 uvue 产物，运行在原生渲染引擎上——浏览器无法模拟原生渲染，请在 HBuilderX 真机预览。',
        unixGuide: 'uni-app x 指南',
        unixReport: '转换报告',
        scenarios: '场景',
      },
)

function goBack(): void {
  if (window.history.length > 1) {
    window.history.back()
    return
  }
  const fallback = isEn.value
    ? '/en/components/uni/overview'
    : '/components/uni/overview'
  window.location.href = withBase(fallback)
}

/** Switch scenario without stacking history entries. */
function pickScenario(name: string): void {
  if (name === demoName.value) return
  demoName.value = name
  const url = new URL(window.location.href)
  url.searchParams.set('demo', name)
  window.history.replaceState(null, '', url)
}

function setMode(next: PreviewMode): void {
  if (next === mode.value) return
  mode.value = next
  const url = new URL(window.location.href)
  url.searchParams.set('mode', next)
  window.history.replaceState(null, '', url)
}

/* ── Dark-mode mirroring ────────────────────────────────────────────────
 * `layout: false` pages carry no theme chrome, so nobody toggles `dark` on
 * this document. Mirror the parent frame (same origin) with an observer;
 * standalone opens fall back to the stored theme / media query. */
let themeObserver: MutationObserver | null = null

function applyDark(dark: boolean): void {
  document.documentElement.classList.toggle('dark', dark)
}

function syncTheme(): void {
  let parentDoc: Document | null = null
  try {
    parentDoc = window.parent === window ? null : window.parent.document
  } catch {
    parentDoc = null
  }
  if (parentDoc !== null) {
    applyDark(parentDoc.documentElement.classList.contains('dark'))
    themeObserver = new MutationObserver(() => {
      applyDark(parentDoc?.documentElement.classList.contains('dark') ?? false)
    })
    themeObserver.observe(parentDoc.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return
  }
  const stored = localStorage.getItem('vitepress-theme')
  applyDark(
    stored === 'dark' ||
      (stored !== 'light' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches),
  )
}

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
})
</script>

<template>
  <div class="mpp">
    <header class="mpp__bar">
      <button class="mpp__back" type="button" :aria-label="t.back" @click="goBack">
        <ChevronLeft :size="18" />
        <span class="mpp__back-label">{{ t.back }}</span>
      </button>
      <div class="mpp__title">
        <span class="mpp__name">{{ title }}</span>
        <span v-if="scenarios.length > 1" class="mpp__count">
          {{ activeIndex + 1 }}/{{ scenarios.length }}
        </span>
      </div>
      <div class="mpp__modes" role="tablist" :aria-label="t.scenarios">
        <button
          type="button"
          role="tab"
          class="mpp__mode"
          :class="{ 'mpp__mode--active': mode === 'uniapp' }"
          :aria-selected="mode === 'uniapp'"
          @click="setMode('uniapp')"
        >
          {{ t.uniapp }}
        </button>
        <button
          type="button"
          role="tab"
          class="mpp__mode"
          :class="{ 'mpp__mode--active': mode === 'unix' }"
          :aria-selected="mode === 'unix'"
          @click="setMode('unix')"
        >
          {{ t.unix }}
        </button>
      </div>
    </header>

    <nav v-if="mode === 'uniapp' && scenarios.length > 1" class="mpp__chips">
      <button
        v-for="(name, index) in scenarios"
        :key="name"
        type="button"
        class="mpp__chip"
        :class="{ 'mpp__chip--active': name === demoName }"
        @click="pickScenario(name)"
      >
        {{ index + 1 }} · {{ labelOf(name) }}
      </button>
    </nav>

    <main class="mpp__body">
      <ClientOnly>
        <section v-if="mode === 'unix'" class="mpp__card mpp__native">
          <h2 class="mpp__native-title">{{ t.unixTitle }}</h2>
          <p class="mpp__native-text">{{ t.unixBody }}</p>
          <div class="mpp__native-links">
            <a
              class="mpp__native-link"
              :href="withBase(isEn ? '/en/guide/uni/uni-app-x' : '/guide/uni/uni-app-x')"
              target="_blank"
            >
              {{ t.unixGuide }}
            </a>
          </div>
        </section>

        <section v-else-if="AsyncDemo" class="mpp__card">
          <component :is="AsyncDemo" />
        </section>

        <p v-else-if="ready" class="mpp__missing">{{ t.missing }}</p>
        <p v-else class="mpp__missing">{{ t.loading }}</p>

        <template #fallback>
          <p class="mpp__missing">{{ t.loading }}</p>
        </template>
      </ClientOnly>
    </main>
  </div>
</template>

<style scoped>
/* Reference mock: #f8f8f8 page, white 24px-radius flat modules. */
.mpp {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
  color: #1f2329;
  font-family:
    ui-sans-serif, -apple-system, 'Segoe UI', Roboto, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.dark .mpp {
  background: #17171a;
  color: #e3e3e8;
}

.mpp__bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 14px;
  background: #ffffff;
}

.dark .mpp__bar {
  background: #232327;
}

.mpp__back {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 30px;
  padding: 0 8px 0 4px;
  border: 0;
  border-radius: 15px;
  background: transparent;
  color: inherit;
  font-size: 13px;
  cursor: pointer;
}

.mpp__back:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dark .mpp__back:hover {
  background: rgba(255, 255, 255, 0.08);
}

.mpp__title {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.mpp__name {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mpp__count {
  flex-shrink: 0;
  color: #8a8f99;
  font-size: 12px;
}

.mpp__modes {
  flex-shrink: 0;
  display: inline-flex;
  padding: 2px;
  border-radius: 999px;
  background: #f1f2f5;
}

.dark .mpp__modes {
  background: #17171a;
}

.mpp__mode {
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #5b6068;
  font-size: 12px;
  line-height: 26px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.mpp__mode--active {
  background: #ffffff;
  color: #1f2329;
  font-weight: 600;
}

.dark .mpp__mode {
  color: #9a9aa3;
}

.dark .mpp__mode--active {
  background: #3a3a40;
  color: #f0f0f4;
}

.mpp__chips {
  display: flex;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  padding: 12px 14px 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.mpp__chips::-webkit-scrollbar {
  display: none;
}

.mpp__chip {
  flex-shrink: 0;
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  color: #5b6068;
  font-size: 12px;
  line-height: 28px;
  cursor: pointer;
}

.dark .mpp__chip {
  background: #232327;
  color: #9a9aa3;
}

.mpp__chip--active {
  background: #1f2329;
  color: #ffffff;
}

.dark .mpp__chip--active {
  background: #e3e3e8;
  color: #17171a;
}

.mpp__body {
  flex: 1;
  padding: 12px 12px 24px;
}

/* The demo module: a white flat card with a large radius (reference mock). */
.mpp__card {
  box-sizing: border-box;
  width: 100%;
  min-height: 320px;
  padding: 16px;
  border-radius: 24px;
  background: #ffffff;
  overflow: hidden;
}

.dark .mpp__card {
  background: #232327;
}

.mpp__missing {
  margin: 48px 16px;
  color: #8a8f99;
  font-size: 13px;
  text-align: center;
}

.mpp__native {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px;
}

.mpp__native-title {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

.mpp__native-text {
  margin: 0;
  color: #5b6068;
  font-size: 13px;
  line-height: 1.8;
}

.dark .mpp__native-text {
  color: #9a9aa3;
}

.mpp__native-links {
  display: flex;
  gap: 16px;
}

.mpp__native-link {
  color: #3b7cf6;
  font-size: 13px;
  text-decoration: none;
}

.mpp__native-link:hover {
  text-decoration: underline;
}
</style>
