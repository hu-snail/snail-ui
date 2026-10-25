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
 *   ?comp=<name>  — a component's short name: every `<name>-mp*` demo stacks
 *                   vertically, one titled module per scenario
 *   ?demo=<file>  — jump straight to one demo file (used by inline Demos)
 *
 * Layout (per the reference mock): one top bar (back + component name) and
 * naturally stacked modules — a small grey title with an index above each
 * white 24px-radius flat card. No mode switch, no tab chips.
 *
 * Dark mode: this page runs `layout: false` (no theme chrome), so it mirrors
 * the parent frame's `dark` class via a MutationObserver; standalone opens
 * fall back to the stored theme / media query.
 */
import { computed, onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import { useData, withBase } from 'vitepress'
import { ChevronLeft } from 'lucide-vue-next'
import { listMpDemoNames, loadDemoComponent } from '../utils/demo-loader'
import MpOverview from './MpOverview.vue'

const { lang } = useData()
const isEn = computed(() => lang.value === 'en-US')

const comp = ref('')
const pinnedDemo = ref('')
/** Home = the overview directory: no bar, the page *is* the directory. */
const isHome = ref(false)
const ready = ref(false)

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  comp.value = (params.get('comp') ?? '').trim()
  pinnedDemo.value = (params.get('demo') ?? '').trim()
  isHome.value =
    params.get('home') === '1' || (comp.value === '' && pinnedDemo.value === '')
  ready.value = true
  syncTheme()
})

interface Scenario {
  name: string
  label: string
  component: Component
}

/**
 * Scenario title words: the file-name suffix (`paging-mp-basic` → `basic`)
 * mapped to the docs' common Chinese scenario names; unknown suffixes fall
 * back to the raw word, which stays readable for ad-hoc names.
 */
const SCENARIO_LABELS = new Map<string, string>([
  ['basic', '基础用法'],
  ['custom', '自定义'],
  ['custom-style', '自定义样式'],
  ['custom-icon', '自定义图标'],
  ['states', '状态'],
  ['status', '状态'],
  ['scroll', '滚动'],
  ['app', '应用案例'],
  ['loading', '加载'],
  ['disabled', '禁用'],
  ['size', '尺寸'],
  ['sizes', '尺寸'],
  ['type', '类型'],
  ['types', '类型'],
  ['color', '颜色'],
  ['colors', '颜色'],
  ['form', '表单'],
  ['event', '事件'],
  ['events', '事件'],
  ['slot', '插槽'],
  ['slots', '插槽'],
  ['dark', '暗黑'],
  ['layout', '布局'],
  ['hover', '按压'],
  ['cell', '单元格'],
  ['vertical', '纵向'],
  ['horizontal', '横向'],
  ['inline', '内联'],
])

function labelOf(name: string): string {
  const short = name.includes('-mp-') ? (name.split('-mp-')[1] ?? name) : name
  return SCENARIO_LABELS.get(short) ?? short
}

/** Every scenario of the component (comp mode) or just the pinned demo. */
const scenarios = computed<Scenario[]>(() => {
  const names =
    comp.value !== ''
      ? listMpDemoNames(comp.value)
      : pinnedDemo.value !== ''
        ? [pinnedDemo.value]
        : []
  return names.map((name) => ({
    name,
    label: labelOf(name),
    component: loadDemoComponent(name, isEn.value),
  }))
})

const title = computed(() =>
  comp.value !== '' ? `sn-${comp.value}` : pinnedDemo.value || 'Preview',
)

const t = computed(() =>
  isEn.value
    ? {
        back: 'Back',
        missing: 'No preview found for this route.',
        loading: 'Loading preview…',
      }
    : {
        back: '返回',
        missing: '该路由暂无可预览的内容。',
        loading: '预览加载中…',
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

/* ── Dark-mode mirroring ────────────────────────────────────────────────
 * `layout: false` pages carry no theme chrome, so nobody toggles `dark` on
 * this document. Mirror the parent frame (same origin) with an observer;
 * standalone opens fall back to the stored theme / media query. */
let themeObserver: MutationObserver | null = null

function applyDark(dark: boolean): void {
  /* `dark` drives the page chrome; `sn-theme-dark` flips the uni component
   * tokens (--sn-mp-*), the uni-end dark contract (AGENTS.md §112.5). */
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.classList.toggle('sn-theme-dark', dark)
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
  <div class="mpp" :class="{ 'mpp--home': isHome }">
    <header v-if="!isHome" class="mpp__bar">
      <button class="mpp__back" type="button" :aria-label="t.back" @click="goBack">
        <ChevronLeft :size="18" />
        <span class="mpp__back-label">{{ t.back }}</span>
      </button>
      <span class="mpp__name" :title="title">{{ title }}</span>
      <!-- Width shim: keeps the title optically centered against the back
       * button without a flex-grow asymmetry. -->
      <span class="mpp__shim" aria-hidden="true" />
    </header>

    <main class="mpp__body" :class="{ 'mpp__body--home': isHome }">
      <ClientOnly>
        <MpOverview v-if="isHome" />

        <template v-else>
          <section v-for="(scenario, index) in scenarios" :key="scenario.name" class="mpp__module">
            <h2 class="mpp__module-title">
              <span class="mpp__module-num">{{ index + 1 }}</span>
              <span class="mpp__module-label">{{ scenario.label }}</span>
            </h2>
            <div class="mpp__card">
              <component :is="scenario.component" />
            </div>
          </section>

          <p v-if="ready && scenarios.length === 0" class="mpp__missing">{{ t.missing }}</p>
          <p v-else-if="!ready" class="mpp__missing">{{ t.loading }}</p>
        </template>

        <template #fallback>
          <p v-if="!isHome" class="mpp__missing">{{ t.loading }}</p>
        </template>
      </ClientOnly>
    </main>
  </div>
</template>

<style scoped>
/* Reference mock: #f8f8f8 page, one bar, stacked titled white 24px modules. */
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
  gap: 8px;
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

.mpp__name {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mpp__shim {
  flex-shrink: 0;
  width: 64px;
}

.mpp__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
  width: 100%;
  padding: 14px 12px 24px;
}

/* Home: the overview owns its own background, padding and cards. */
.mpp__body--home {
  gap: 0;
  padding: 0;
}

/* Module: small grey title above a white flat 24px-radius card. */
.mpp__module-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  padding: 0 4px;
  font-size: 13px;
  font-weight: 500;
  color: #5b6068;
}

.dark .mpp__module-title {
  color: #9a9aa3;
}

.mpp__module-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  background: rgba(31, 35, 41, 0.08);
  color: #5b6068;
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.dark .mpp__module-num {
  background: rgba(255, 255, 255, 0.1);
  color: #9a9aa3;
}

.mpp__card {
  box-sizing: border-box;
  width: 100%;
  min-height: 240px;
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
</style>
