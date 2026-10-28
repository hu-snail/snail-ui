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
 *   2. Code panel split into `vue` / `ts` / `css` tabs (see `sections`)
 *   3. Copy-to-clipboard for the visible tab
 *   4. Optional `description` prop shown above the demo (supports markdown
 *      inline code via backticks already)
 *
 * ## Why the code is split instead of shown as one SFC
 *
 * A reader looking at "基本用法" wants the markup, not the whole file: the
 * script is usually boilerplate (`import { ref } from 'vue'`) and the style is
 * demo-only chrome. Showing the entire SFC forces them to scroll past code
 * they will not copy. Splitting into tabs keeps every part one click away
 * while the default view stays short — the same shape wot-ui's docs use.
 *
 * Usage in .md:
 *   <Demo name="button-web" />
 *   <Demo name="divider-mp" description="基本分割线" />
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ChevronRight, ChevronDown, Check, Copy } from 'lucide-vue-next';
import { SnIcon } from '@snui/vue-web';
import PhoneFrame from './PhoneFrame.vue';
import {
  dockState,
  claimInlinePreview,
  uniCompFromRoute,
  registerDemo,
  unregisterDemo,
} from '../utils/demo-dock';
import { dedent, loadDemoComponent, loadDemoSource, loadDemoUsage } from '../utils/demo-loader';
import { uniDemoPageUrl } from '../utils/uni-demo-base';
import demoManifest from '../../../uni-demo/src/demos-manifest.json';
import { useData, useRoute } from 'vitepress';

interface Props {
  /** Demo file basename (without .vue) under apps/docs/.vitepress/demo/. */
  name: string;
  /** Optional description shown above the demo (rendered as plain text). */
  description?: string;
  /** Hide the wrapping card chrome (used inside docs prose). */
  bare?: boolean;
  /**
   * Render inside the mobile device shell (PhoneFrame).
   *
   * Defaults to `undefined`, which means "auto": any demo whose name carries
   * the `-mp-` marker (uni-app demos) gets the phone shell, web demos keep the
   * plain card. Set `false` to opt a mobile demo out of the frame (e.g. when
   * the demo itself renders a full-bleed modal), or `true` to force it.
   */
  phone?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  bare: false,
  phone: undefined,
});

/**
 * Whether this demo runs on the uni-app (mobile) end.
 *
 * `-mp` is the file-naming marker for uni demos (AGENTS.md §111.2: every uni
 * demo is `*-mp-*.vue`). The marker appears in two shapes in practice:
 * `button-mp-basic` (mid-name) and `card-mp` / `divider-mp` (suffix), so the
 * check matches either — a plain `includes('-mp-')` silently skipped the
 * suffix shape and those two pages rendered without the phone shell.
 *
 * Pages therefore need no extra markup: the frame decision rides on the demo
 * file name alone.
 */
const isMobileDemo = computed(() => props.phone ?? /(^|-)mp(-|$)/.test(props.name));

// ─── Preview dock integration ────────────────────────────────────────────
//
// On uni component pages the live preview moves out of the article flow and
// into the fixed dock on the right (see DemoDock.vue / utils/demo-dock.ts).
// The article keeps the heading, the description and the code — which is the
// part a reader actually copies — while the device frame stays in view.
//
// Each Demo registers itself so the dock can build its section switcher. On a
// uni page the dock owns *all* previews (it renders whichever demo is selected),
// so no demo renders its frame inline; narrow viewports and non-uni pages keep
// the inline path.
/**
 * Does the dock own this demo's preview?
 *
 * Not just the active one: on a uni page *every* demo's live preview belongs
 * to the dock, because the article is meant to read as prose + code. The dock
 * renders whichever demo is selected; the others show a "preview is in the
 * panel" note in the article and are one click away via the section tabs.
 *
 * Only the active demo is actually mounted in the dock, so this flag says
 * "don't render inline", not "render in the dock".
 */
const inDock = computed(() => isMobileDemo.value && dockState.open);

/** Section label: the demo's own description, else its file name. */
const dockLabel = computed(() => {
  const d = props.description.trim();
  if (d === '') return props.name;
  // Section switchers are narrow; keep the first clause of a long description.
  const head = d.split(/[：:，,。.]/)[0] ?? d;
  return head.length > 14 ? `${head.slice(0, 14)}…` : head;
});

/**
 * Seed `open` synchronously for the first demo on a uni page.
 *
 * `DemoDock` mounts inside `<ClientOnly>` and flips `dockState.open` in its
 * own `onMounted`, which can run *after* the markdown-mounted demos have
 * already rendered their inline preview. Seeding here — in the demo's setup,
 * before its first render — makes the first frame correct whichever order the
 * two mount in: the one that runs first sets `open`, the other is a no-op.
 *
 * Guarded on `window` so the SSR pass keeps `open` false and renders the
 * inline preview; hydration re-evaluates this branch on the client.
 */
if (
  isMobileDemo.value &&
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 1200px)').matches &&
  /\/components\/uni\//.test(window.location.pathname)
) {
  dockState.open = true;
}

onMounted(() => {
  if (!isMobileDemo.value) return;
  registerDemo({
    name: props.name,
    label: dockLabel.value,
    description: props.description,
  });
});

onBeforeUnmount(() => {
  if (isMobileDemo.value) unregisterDemo(props.name);
});

// Dynamic import of demo file (async chunk split).
//
// 双语机制(naive-ui 官网同构):英文站点优先加载 `demo-en/<name>.vue`
// 影子文件(渲染 + 代码面板都用它);不存在时回退中文 demo。影子文件是
// 普通源码,保持 demo「可复制即真实用法」的教学价值;md 页零改动。
const { lang } = useData();
const isEn = computed(() => lang.value === 'en-US');

/**
 * uni demos render the deployed uni-demo site inside an iframe: the frame
 * gives the demo its own browsing context (gestures, fixed layers and page
 * scrolling behave like a real app screen) on the real uni runtime, and the
 * component page there stacks every scenario. Docs no longer compiles uni
 * demos — see ADR-0005.
 *
 * ONE frame per page: a browsing context is expensive, so the first mobile
 * demo of the route claims the only inline frame (it already stacks every
 * scenario of the component, in document order) and the later sections point
 * up to it — that claim is what fixed "the preview loads forever" pages.
 */
const route = useRoute();
const ownsInlineFrame = ref(false);
watch(
  () => route.path,
  () => {
    ownsInlineFrame.value = isMobileDemo.value && claimInlinePreview(props.name, route.path);
  },
  { immediate: true },
);

/**
 * uni demo 预览 = 部署的 uni-demo H5 站（ADR-0005，hash 路由）。组件页一帧
 * 聚合该组件全部场景；组件不在清单（无 uni demo 或非组件路由）时回退首页
 * 目录。
 */
interface DemoManifestEntry {
  page: string;
}

const mpPreviewUrl = computed(() => {
  const comp = uniCompFromRoute(route.path);
  const entry = (demoManifest.components as Record<string, DemoManifestEntry>)[comp];
  return uniDemoPageUrl(entry?.page ?? 'pages/index/index');
});

// Async demo component, resolved through the shared loader so `DemoDock` and
// this component can never disagree about which file a name maps to (English
// shadow vs Chinese demo) or how a failed chunk load degrades.
const AsyncDemo = computed(() => loadDemoComponent(props.name, isEn.value));

/** 双语 chrome 文案(复制 / 展开代码),跟随站点语言。 */
const t = computed(() =>
  isEn.value
    ? {
        copy: 'Copy',
        copied: 'Copied',
        copyCode: 'Copy code',
        expandCode: 'Show code',
        collapseCode: 'Hide code',
        inPanel: 'Live preview is in the panel on the right',
        inFrame: 'Live preview is in the phone frame above (all scenarios)',
        codeTabs: 'Code sections',
        missing:
          'Usage code for this scenario is being migrated to the uni-demo workspace (browser-API demos) and will return shortly.',
      }
    : {
        copy: '复制',
        copied: '已复制',
        copyCode: '复制代码',
        expandCode: '展开代码',
        collapseCode: '收起代码',
        inPanel: '实时预览已移至右侧预览面板',
        inFrame: '实时预览见上方手机框（含全部场景）',
        codeTabs: '代码分区',
        missing: '该场景用法源码整理中（依赖浏览器 API 的 demo 正在向 uni-demo 迁移）。',
      },
);

// Raw source of the demo file, for the code panel. Delegated to the shared
// loader so the panel always shows the same file that was rendered (English
// shadow when the site is English, Chinese demo otherwise).
const source = computed<string>(() => loadDemoSource(props.name, isEn.value));

/**
 * Code panel visibility.
 *
 * Defaults to *open* on uni pages, because there the live preview lives in the
 * right-hand dock and the code is the only thing left in the article — leaving
 * it collapsed would render each section as a bare heading with nothing under
 * it. Web pages keep the old collapsed default: their preview is inline and
 * already occupies the column.
 *
 * The value is computed once at setup; the toolbar still toggles it freely
 * afterwards.
 */
const codeOpen = ref(dockState.open && /(^|-)mp(-|$)/.test(props.name));
function toggleCode() {
  codeOpen.value = !codeOpen.value;
}

// ─── Code sections (vue / ts / css) ──────────────────────────────────────
//
// The demo files are ordinary SFCs, so the three parts are just the block
// contents without their wrappers. `template` is labelled `vue` because that
// is the part a reader pastes into a page; `script` is `ts`; `style` is `css`.

type SectionLang = 'vue' | 'ts' | 'css';

interface CodeSection {
  lang: SectionLang;
  code: string;
}

/**
 * Split an SFC source into its non-empty blocks.
 *
 * `<template>` is matched greedily to the *last* `</template>` because demos
 * routinely nest `<template #slot>` inside the root template; a lazy match
 * would cut the markup at the first inner slot.
 */
function extractSections(src: string): CodeSection[] {
  const sections: CodeSection[] = [];

  const template = src.match(/<template[^>]*>([\s\S]*)<\/template>/);
  const templateCode = template?.[1]?.trim() ? dedent(template[1]) : '';
  if (templateCode !== '') sections.push({ lang: 'vue', code: templateCode });

  // A file may carry both `<script setup>` and a plain `<script>`; join them
  // so the `ts` tab shows everything the demo actually runs.
  const scriptCode = dedent(
    [...src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1] ?? '').join('\n'),
  );
  if (scriptCode.trim() !== '') sections.push({ lang: 'ts', code: scriptCode });

  // Same for styles: a demo can ship a scoped block plus an unscoped one.
  const styleCode = dedent(
    [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1] ?? '').join('\n'),
  );
  if (styleCode.trim() !== '') sections.push({ lang: 'css', code: styleCode });

  return sections;
}

/**
 * 代码分区：uni demo → 用法源码（模板去壳 + 脚本去 import，见 demo-loader，
 * css 不展示）；web demo → 完整 SFC 分区（vue/ts/css）。两者共用代码面板。
 */
const sections = computed<CodeSection[]>(() =>
  isMobileDemo.value ? loadDemoUsage(props.name, isEn.value) : extractSections(source.value),
);

/** Active tab. Falls back to the first section when the demo has no `vue`. */
const activeTab = ref<SectionLang>('vue');

const activeSection = computed<CodeSection | undefined>(
  () => sections.value.find((s) => s.lang === activeTab.value) ?? sections.value[0],
);

/**
 * Keep the active tab valid across page/demo changes: a demo without a style
 * block must not leave the panel pointing at an empty `css` tab.
 */
watch(sections, (list) => {
  if (list.length === 0) return;
  if (!list.some((s) => s.lang === activeTab.value)) {
    activeTab.value = list[0]!.lang;
  }
});

// Toolbar: copy-to-clipboard. Copies the *visible* tab, not the whole SFC —
// that is what the reader is looking at when they hit the button.
const copied = ref(false);
async function copyCode(): Promise<void> {
  try {
    await navigator.clipboard.writeText(activeSection.value?.code ?? '');
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[Demo] copy failed', err);
  }
}

// Syntax-highlighted HTML (Shiki). Each tab is highlighted with the grammar
// that matches its content, so a `ts` tab gets real TS token colors instead of
// Vue-directive noise from the SFC grammar.
import { createHighlighter } from 'shiki';
const highlighted = ref('');
const highlighterPromise = createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['vue', 'ts', 'css'],
});
watch(
  [() => codeOpen.value, () => activeSection.value],
  async ([open, section]) => {
    if (!open || section === undefined) {
      highlighted.value = '';
      return;
    }
    const hl = await highlighterPromise;
    highlighted.value = hl.codeToHtml(section.code, {
      lang: section.lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    });
  },
  { immediate: true },
);
</script>

<template>
  <div :class="['sn-demo', bare ? 'sn-demo--bare' : '']">
    <p v-if="description" class="sn-demo__description">{{ description }}</p>

    <!--
      Live preview: the dock owns it on wide uni pages; otherwise the FIRST
      mobile demo of the page owns the single inline frame (it stacks every
      scenario of the component); the remaining sections point to it.
    -->
    <div v-if="inDock" class="sn-demo__docked">
      <span class="sn-demo__docked-note">{{ t.inPanel }}</span>
    </div>
    <div v-else-if="isMobileDemo && !ownsInlineFrame" class="sn-demo__docked">
      <span class="sn-demo__docked-note">{{ t.inFrame }}</span>
    </div>
    <div v-else-if="isMobileDemo" class="sn-demo__stage">
      <ClientOnly>
        <PhoneFrame :height="720">
          <iframe
            class="sn-demo__frame"
            :src="mpPreviewUrl"
            :title="`uni preview: ${name}`"
            loading="lazy"
          />
        </PhoneFrame>
        <template #fallback>
          <div class="sn-demo__loading">
            <span class="sn-demo-spinner" aria-hidden="true" />
            <span>Loading {{ name }} …</span>
          </div>
        </template>
      </ClientOnly>
    </div>
    <div v-else class="sn-demo__card">
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

    <!--
      Collapse control.

      Rendered only while the code is hidden: once open, the block carries its
      own tabs + copy + collapse icons in its header, so this row would be a
      second, redundant toolbar.
    -->
    <div v-if="!codeOpen" class="sn-demo__toolbar">
      <button
        type="button"
        class="sn-demo__action"
        :title="t.expandCode"
        :aria-expanded="false"
        @click="toggleCode"
      >
        <SnIcon :icon="ChevronRight" :size="14" class="sn-demo__chevron" />
        <span class="sn-demo__action-label">{{ t.expandCode }}</span>
      </button>
    </div>

    <div v-if="codeOpen && sections.length === 0" class="sn-demo__missing">
      {{ t.missing }}
    </div>

    <div v-show="codeOpen && sections.length > 0" class="sn-demo__code">
      <div class="sn-demo__code-head">
        <div class="sn-demo__tabs" role="tablist" :aria-label="t.codeTabs">
          <button
            v-for="section in sections"
            :key="section.lang"
            type="button"
            role="tab"
            class="sn-demo__tab"
            :class="[section.lang === activeTab ? 'sn-demo__tab--active' : '']"
            :aria-selected="section.lang === activeTab"
            @click="activeTab = section.lang"
          >
            {{ section.lang }}
          </button>
        </div>
        <div class="sn-demo__code-actions">
          <button
            type="button"
            class="sn-demo__icon-btn"
            :title="copied ? t.copied : t.copyCode"
            :aria-label="copied ? t.copied : t.copyCode"
            @click="copyCode"
          >
            <SnIcon :icon="copied ? Check : Copy" :size="14" />
          </button>
          <button
            type="button"
            class="sn-demo__icon-btn"
            :title="t.collapseCode"
            :aria-label="t.collapseCode"
            @click="toggleCode"
          >
            <SnIcon :icon="ChevronDown" :size="14" />
          </button>
        </div>
      </div>

      <div class="sn-demo__code-body" v-html="highlighted || ''" />
      <pre
        v-if="!highlighted"
        class="sn-demo__code-fallback"
      ><code>{{ activeSection?.code ?? '' }}</code></pre>
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
  border: 1px solid rgba(9, 9, 11, 0.08);
  border-radius: 8px;
  padding: 24px;
  /* 预览面与页面底色一致（白底），避免浅灰内嵌。 */
  background: var(--vp-c-bg);
  min-height: 80px;
  position: relative;
}

html.dark .sn-demo__card {
  border-color: rgba(250, 250, 250, 0.09);
}

.sn-demo--bare .sn-demo__card {
  border: 0;
  padding: 0;
  background: transparent;
}

/*
 * Mobile stage: the container that hosts the PhoneFrame.
 *
 * It deliberately drops the desktop card's border and padding — the device
 * bezel already provides the frame, so a second border would read as a card
 * inside a card. Background stays transparent so the bezel's shadow lands on
 * the page surface.
 */
.sn-demo__stage {
  display: flex;
  justify-content: center;
  padding: 8px 0 0;
  min-height: 80px;
}

/* The in-frame preview surface: the demo page owns its own background. */
.sn-demo__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #f8f8f8;
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

/* 用法源码暂缺提示（浏览器 API demo 迁移期，见 ADR-0005）。 */
.sn-demo__missing {
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.6;
}

/* Collapse row — only while the code block is hidden. */
.sn-demo__toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  padding: 0 4px;
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
  transition:
    background-color 0.15s,
    color 0.15s;
}
.sn-demo__action:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.sn-demo__chevron {
  font-size: 12px;
  line-height: 1;
}

/*
 * Code panel — the wot-ui shape: a soft, borderless sheet with the language
 * tabs at the top-left and quiet icon actions at the top-right. No outer
 * border and no separate toolbar, so the block reads as one piece of content
 * rather than a framed widget.
 */
.sn-demo__code {
  margin-top: 12px;
  border: 0;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.sn-demo__code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px 4px;
}

.sn-demo__tabs {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.sn-demo__tab {
  height: 22px;
  padding: 0 8px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.sn-demo__tab:hover {
  color: var(--vp-c-text-1);
}

/* Active tab lifts out of the sheet with the page background. */
.sn-demo__tab--active {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.sn-demo__code-actions {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  /* Icon actions stay out of the way until the reader engages with the block. */
  opacity: 0;
  transition: opacity 0.15s;
}

.sn-demo__code:hover .sn-demo__code-actions,
.sn-demo__code-actions:focus-within {
  opacity: 1;
}

.sn-demo__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.sn-demo__icon-btn:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

/* Shiki output: a <pre> containing <code><span>…</span></code>. */
.sn-demo__code-body {
  padding: 4px 14px 14px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.6;
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
  padding: 4px 14px 14px;
  font-size: 13px;
  line-height: 1.6;
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
