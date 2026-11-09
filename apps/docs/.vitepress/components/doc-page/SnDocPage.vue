<script setup lang="ts">
/**
 * SnDocPage — 组件详情页渲染器（版式参考高保真原型，配色跟随站点主题）。
 *
 * 三栏叙事：中央文档流 + 右侧「本页目录 / 反馈」浮轨（xl 以上双栏），
 * 左侧站点原生侧栏保留。所有颜色经由 --sn-doc-* 局部变量映射到
 * --vp-c-*（站点）与 --sn-web-color-*（UI 库语义层），因此暗色模式与
 * Style Pack 换肤自动生效，本组件不携带任何私有色值。
 *
 * 本页只负责「读」：头部信息、代码用法、案例、Token 表、Props 表与 AI 集成。
 * 交互式演练（Playground）与样式变体（Style Variants）两块已按需求移除 ——
 * 案例区已经承担了「真实可运行」的职责，再叠一个可调参数的舞台会让同一份
 * 契约出现两种表述。
 */
import { computed, markRaw, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { useData, useRouter } from 'vitepress';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  Copy,
  Code2,
  Cpu,
  Layers,
  Link as LinkIcon,
  Monitor,
  Palette,
  Play,
  Sparkles,
  Table2,
} from 'lucide-vue-next';
import { SnIcon } from '@snui/vue-web';
import { loadDemoComponent, loadDemoSource } from '../../utils/demo-loader';
import type { DocFeature, DocSeg, DocQuickAction, SnDocPageData } from './types';

const props = defineProps<{ doc: SnDocPageData }>();

/**
 * 区块数据兜底。
 *
 * 90 多个页面正在分批迁移，任何一页漏了 `usage` / `tokens` / `props` / `ai`
 * 都会让模板直接读 undefined 而白屏 —— 一页的错误不该炸掉整站构建。这里把
 * 缺失的区块归一成空集合：页面少显示一块，而不是整页崩掉。
 */
const doc = computed(() => {
  const raw = props.doc;
  return {
    ...raw,
    usage: raw.usage ?? { hint: [], fileLabel: '', meta: '', code: '' },
    props: raw.props ?? { hint: [], rows: [] },
    ai: raw.ai ?? {
      badge: '',
      heading: '',
      copy: '',
      chip: '',
      chipCopy: '',
      stats: [],
    },
    demos: raw.demos ?? [],
    pager: raw.pager ?? {},
    toc: raw.toc ?? [],
  };
});

/** 特性条图标：把数据里的语义名映射到具体图标组件。 */
const FEATURE_ICONS: Record<NonNullable<DocFeature['icon']>, typeof Monitor> = {
  eco: Sparkles,
  touch: Play,
  layers: Layers,
  a11y: Check,
  dual: Monitor,
};

const { isDark, lang } = useData();
/** 英文站：demo 走 demo-en 影子文件（与 demos 瀑布流一致）。 */
const isEn = computed(() => lang.value.startsWith('en'));

/**
 * 界面文案随站点语言切换。
 *
 * 中文站保留「中文 + 英文」双语复合标题（项目文档的品牌习惯），英文站给纯
 * 英文——否则 /en/ 页面的区块标题、表头和按钮会混入中文。数据层的文案
 * （标题、描述、features、pager）本来就在各语言的数据模块里，这里只管
 * 布局壳自己的固定串。
 */
const UI = computed(() =>
  isEn.value
    ? {
        crumbs: 'Breadcrumb',
        copiedAll: 'Copied to clipboard',
        usage: 'Code Usage',
        demos: 'Examples',
        demosAside: 'Live · rendered from the docs corpus',
        ai: 'AI-Native Integration',
        previewSource: 'Preview / Source',
        preview: 'Preview',
        source: 'Source',
        copy: 'Copy',
        copied: 'Copied',
        copyChip: 'Copy',
        api: 'Props Reference',
        thProp: 'Prop',
        thType: 'Type',
        thDefault: 'Default',
        thDesc: 'Description',
        prev: 'Previous',
        next: 'Next',
        railhead: 'On this page',
        feedbackQ: 'Was this page helpful?',
        helpful: 'Helpful',
        needsWork: 'Needs work',
      }
    : {
        crumbs: '面包屑',
        copiedAll: '已复制到剪贴板',
        usage: '代码用法 Code Usage',
        demos: '案例 Demos',
        demosAside: '实时渲染 · 来自组件文档案例',
        ai: 'AI 原生集成 AI-Native Integration',
        previewSource: '预览 / 源码',
        preview: '预览',
        source: '源码',
        copy: '复制',
        copied: '已复制',
        copyChip: '复制',
        api: 'API 属性参考 Props Reference',
        thProp: '属性 Prop',
        thType: '类型 Type',
        thDefault: '默认值',
        thDesc: '说明 Description',
        prev: '上一篇 Previous',
        next: '下一篇 Next',
        railhead: '本页目录 · On this page',
        feedbackQ: '此文档对您是否有帮助？',
        helpful: '有用',
        needsWork: '待优化',
      },
);
const router = useRouter();
function navTo(url: string | undefined): void {
  if (url) router.go(url);
}

/* ── 行内富文本 ──────────────────────────────────────────────────────── */

function segs(segs: DocSeg[] | undefined) {
  return segs ?? [];
}

/* ── 复制 ────────────────────────────────────────────────────────────── */

const copiedKey = ref('');
let copyTimer: ReturnType<typeof setTimeout> | undefined;
async function copyText(key: string, text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  copiedKey.value = key;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copiedKey.value = '';
  }, 1600);
}
onBeforeUnmount(() => clearTimeout(copyTimer));

function onQuickAction(act: DocQuickAction): void {
  if (act.copy) void copyText('quick', act.copy);
  else navTo(act.href);
}

/* ── 代码高亮（自有静态内容的最小着色，无 eval / 无外部依赖） ─────────── */

function escapeHtml(src: string): string {
  return src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightVue(src: string): string {
  const escaped = escapeHtml(src);
  return escaped.replace(
    /(&lt;\/?)([A-Za-z][\w-]*)|([A-Za-z-]+)(=)("[^"]*")|("[^"]*")|\b(import|from|export|default|const|return|async|function|await)\b/g,
    (m, lt, tag, attr, eq, attrStr, str, kw) => {
      if (tag) return `${lt}<span class="tok-t">${tag}</span>`;
      if (attr)
        return `<span class="tok-a">${attr}</span>${eq}<span class="tok-s">${attrStr}</span>`;
      if (str) return `<span class="tok-s">${str}</span>`;
      if (kw) return `<span class="tok-k">${kw}</span>`;
      return m;
    },
  );
}

function highlightCode(src: string, lang: 'vue' | 'ts' | 'css'): string {
  if (lang === 'ts') {
    // script/ts：注释 / 字符串 / 关键词，单遍交替避免嵌套着色
    return escapeHtml(src).replace(
      /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('[^'\n]*'|"[^"\n]*")|\b(import|from|export|default|const|let|function|return|async|await|if|else|for|of|new)\b/g,
      (m, c, str, kw) => {
        if (c) return `<span class="tok-c">${c}</span>`;
        if (str) return `<span class="tok-s">${str}</span>`;
        if (kw) return `<span class="tok-k">${kw}</span>`;
        return m;
      },
    );
  }
  if (lang === 'css') {
    // css：注释 / 属性名（: 前）/ 颜色与函数值
    return escapeHtml(src).replace(
      /(\/\*[\s\S]*?\*\/)|([-\w]+)(?=\s*:)|(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\))/g,
      (m, c, prop, val) => {
        if (c) return `<span class="tok-c">${c}</span>`;
        if (prop) return `<span class="tok-a">${prop}</span>`;
        if (val) return `<span class="tok-s">${val}</span>`;
        return m;
      },
    );
  }
  return highlightVue(src);
}

function codeToHtml(code: string, lang: 'vue' | 'ts' | 'css' = 'vue'): string {
  return highlightCode(code, lang)
    .split('\n')
    .map((line, i) => `<span class="sn-code__ln">${String(i + 1).padStart(2, '0')}</span>${line}`)
    .join('\n');
}

const usageHtml = computed(() => codeToHtml(doc.value.usage.code));

/* ── demo 案例瀑布流（复用 demo-loader：活体渲染 + 源码，切换而非展开） ── */

type DemoMode = 'preview' | 'code';

const demoModes = ref<Record<string, DemoMode>>({});

function demoMode(name: string): DemoMode {
  return demoModes.value[name] ?? 'preview';
}

function setDemoMode(name: string, mode: DemoMode): void {
  demoModes.value = { ...demoModes.value, [name]: mode };
}

/**
 * demo 按奇偶分列（自管两列瀑布）：列是独立 flex 容器，卡片展开只推挤
 * 本列后续项 —— 无空高度。不经过 slot 传递，预览/源码状态走标准响应式。
 */
const demoComponents = computed(() =>
  Object.fromEntries(doc.value.demos.map((d) => [d.name, markRawDemo(d.name)])),
);
/**
 * Demo 源码：懒加载（async）。之前三个 eager raw glob 把全部 ~1900 个
 * demo 源码文本（~477KB import 块）拉进每个文档页的模块图；现在 raw
 * 模块只在代码面板请求时按需拉取，结果缓存进 demoSources。
 */
const demoSources = ref<Record<string, string>>({});
watchEffect(async () => {
  const out: Record<string, string> = {};
  // 并发拉取本页全部 demo 源码（per-file chunk，Promise.all 一次收敛）
  await Promise.all(
    doc.value.demos.map(async (d) => {
      out[d.name] = await loadDemoSource(d.name, false);
    }),
  );
  demoSources.value = out;
});

/**
 * demo-loader 返回 defineAsyncComponent —— 缓存一份避免每次渲染重建。
 *
 * 缓存键必须带 locale：英文站优先取 demo-en/ 影子文件，用中文键缓存会让
 * /en/ 页面渲染出中文 demo。这个标志以前写死成 false，英文站一直拿的是
 * 中文语料。
 */
const demoComponentCache = new Map<string, unknown>();
function markRawDemo(name: string): unknown {
  const key = `${isEn.value ? 'en' : 'zh'}:${name}`;
  if (!demoComponentCache.has(key)) {
    demoComponentCache.set(key, markRaw(loadDemoComponent(name, isEn.value)));
  }
  return demoComponentCache.get(key);
}

/* SFC 拆段：template / script / style（缺失则整份 source）——与 Demo.vue 同思路 */
interface SfcSection {
  lang: 'vue' | 'ts' | 'css';
  label: string;
  code: string;
}

function parseSfcSections(src: string): SfcSection[] {
  const sections: SfcSection[] = [];
  const template = src.match(/<template[^>]*>([\s\S]*)<\/template>/);
  if (template?.[1]?.trim()) {
    sections.push({
      lang: 'vue',
      label: 'template',
      code: template[1].replace(/^\n/, '').trimEnd(),
    });
  }
  const scriptCode = [...src.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1] ?? '')
    .join('\n')
    .trim();
  if (scriptCode) sections.push({ lang: 'ts', label: 'script', code: scriptCode });
  const styleCode = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map((m) => m[1] ?? '')
    .join('\n')
    .trim();
  if (styleCode) sections.push({ lang: 'css', label: 'style', code: styleCode });
  if (sections.length === 0) {
    sections.push({ lang: 'vue', label: 'source', code: src.trim() });
  }
  return sections;
}

const demoSections = computed<Record<string, SfcSection[]>>(() => {
  const out: Record<string, SfcSection[]> = {};
  for (const d of doc.value.demos) {
    out[d.name] = parseSfcSections(demoSources.value[d.name] ?? '');
  }
  return out;
});

/**
 * 高亮结果缓存：key = `lang\u0000code`。demoSectionHtml 在模板里调用 ——
 * 之前每次组件重渲染都会对可见的每个代码面板重跑正则高亮（46 个 demo
 * 全量 ~43ms）；按 (源码, 语言) 记忆化后同一代码段只高亮一次。
 */
const highlightCache = new Map<string, string>();
function highlightCached(code: string, lang: 'vue' | 'ts' | 'css'): string {
  const key = `${lang}\u0000${code}`;
  let html = highlightCache.get(key);
  if (html === undefined) {
    html = codeToHtml(code, lang);
    highlightCache.set(key, html);
  }
  return html;
}

/** 每个 demo 记住自己的代码段页签。 */
const demoSectionState = ref<Record<string, number>>({});

function demoSectionIndex(name: string): number {
  const list = demoSections.value[name] ?? [];
  const idx = demoSectionState.value[name] ?? 0;
  return Math.min(idx, Math.max(0, list.length - 1));
}

function setDemoSection(name: string, index: number): void {
  demoSectionState.value = { ...demoSectionState.value, [name]: index };
}

function demoSectionCode(name: string): string {
  const list = demoSections.value[name] ?? [];
  return list[demoSectionIndex(name)]?.code ?? '';
}

function demoSectionHtml(name: string): string {
  const list = demoSections.value[name] ?? [];
  const sec = list[demoSectionIndex(name)];
  return sec ? highlightCached(sec.code, sec.lang) : '';
}

/* ── 反馈挂件 ────────────────────────────────────────────────────────── */

const feedback = ref<'' | 'up' | 'down'>('');

/* ── 右栏目录滚动高亮（scroll-spy，与内容区滚动联动） ── */
const activeSection = ref('');
let spyRaf = 0;
function spySections(): void {
  const ids = doc.value.toc.map((t) => t.id);
  let current = ids[0] ?? '';
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= 140) current = id;
    else break;
  }
  /* 底部兜底：滚到底高亮最后一项 */
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
    current = ids[ids.length - 1] ?? current;
  }
  activeSection.value = current;
}
function onSpyScroll(): void {
  cancelAnimationFrame(spyRaf);
  spyRaf = requestAnimationFrame(spySections);
}
onMounted(() => {
  spySections();
  window.addEventListener('scroll', onSpyScroll, { passive: true });
  window.addEventListener('resize', onSpyScroll);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(spyRaf);
  window.removeEventListener('scroll', onSpyScroll);
  window.removeEventListener('resize', onSpyScroll);
});
</script>

<template>
  <div class="sn-docpage" :class="{ 'sn-docpage--dark': isDark }">
    <!-- 原型氛围背景：弥散光晕 + 亚像素点阵（fixed，不拦截交互，配色走主题变量） -->
    <div class="sn-docpage__bg" aria-hidden="true">
      <span class="sn-docpage__blob sn-docpage__blob--a" />
      <span class="sn-docpage__blob sn-docpage__blob--b" />
      <span class="sn-docpage__blob sn-docpage__blob--c" />
      <span class="sn-docpage__dotgrid" />
    </div>
    <div class="sn-docpage__layout">
      <!-- ═══════════════ 中央文档流 ═══════════════ -->
      <main class="sn-docpage__main">
        <!-- 头部：面包屑 / 标题+徽章 / 描述 / 快捷操作 -->
        <header class="sn-docpage__head">
          <nav class="sn-docpage__crumbs" :aria-label="UI.crumbs">
            <template v-for="(crumb, i) in doc.crumbs" :key="i">
              <a
                v-if="crumb.link && i < doc.crumbs.length - 1"
                :href="crumb.link"
                @click.prevent="navTo(crumb.link)"
              >
                {{ crumb.text }}
              </a>
              <span v-else :class="{ 'sn-docpage__crumb-here': i === doc.crumbs.length - 1 }">
                {{ crumb.text }}
              </span>
              <span
                v-if="i < doc.crumbs.length - 1"
                class="sn-docpage__crumb-sep"
                aria-hidden="true"
                >/</span
              >
            </template>
          </nav>

          <div class="sn-docpage__titlerow">
            <h1 class="sn-docpage__title">{{ doc.title }}</h1>
            <div class="sn-docpage__badges">
              <span
                v-for="badge in doc.badges"
                :key="badge.label"
                class="sn-docpage__badge"
                :class="`sn-docpage__badge--${badge.tone}`"
              >
                <span
                  v-if="badge.icon === 'stable'"
                  class="sn-docpage__badge-dot"
                  aria-hidden="true"
                />
                <SnIcon v-else-if="badge.icon === 'dual'" :icon="Monitor" :size="12" />
                <SnIcon v-else-if="badge.icon === 'ai'" :icon="Cpu" :size="12" />
                {{ badge.label }}
              </span>
            </div>
          </div>

          <p class="sn-docpage__desc">
            <template v-for="(seg, i) in segs(doc.description)" :key="i">
              <code v-if="seg.t === 'code'" class="sn-docpage__ic">{{ seg.s }}</code>
              <template v-else>{{ seg.s }}</template>
            </template>
          </p>
          <div class="sn-docpage__actions">
            <template v-for="(act, i) in doc.quickActions" :key="i">
              <button type="button" class="sn-docpage__action" @click="onQuickAction(act)">
                <SnIcon
                  :icon="act.icon === 'copy' ? Copy : act.icon === 'palette' ? Palette : LinkIcon"
                  :size="14"
                />
                <span v-if="act.copy && copiedKey === 'quick'">{{ UI.copiedAll }}</span>
                <span v-else>{{ act.label }}</span>
              </button>
            </template>
          </div>

          <!-- 头卡特性条：参考稿底部一行「生态 / 交互 / 运行时」要点。
               数据来自 doc.features，省略时不渲染。 -->
          <ul v-if="doc.features?.length" class="sn-docpage__features">
            <li v-for="f in doc.features" :key="f.text">
              <SnIcon :icon="FEATURE_ICONS[f.icon ?? 'eco']" :size="15" />
              {{ f.text }}
            </li>
          </ul>
        </header>

        <!-- 代码用法 -->
        <section id="usage" class="sn-docpage__section">
          <div class="sn-docpage__sec-head">
            <div class="sn-docpage__sec-title">
              <SnIcon
                class="sn-docpage__sec-icon sn-docpage__sec-icon--usage"
                :icon="Box"
                :size="15"
              />
              <h2>{{ UI.usage }}</h2>
            </div>
          </div>
          <p class="sn-docpage__hint">
            <template v-for="(seg, i) in segs(doc.usage.hint)" :key="i">
              <code v-if="seg.t === 'code'" class="sn-docpage__ic">{{ seg.s }}</code>
              <template v-else>{{ seg.s }}</template>
            </template>
          </p>
          <div class="sn-docpage__codecard">
            <div class="sn-docpage__codecard-bar">
              <span class="sn-docpage__codecard-file">{{ doc.usage.fileLabel }}</span>
              <span class="sn-docpage__codecard-meta">{{ doc.usage.meta }}</span>
            </div>
            <pre class="sn-code" v-html="usageHtml" />
          </div>
        </section>

        <!-- demo 案例瀑布流（预览 / 源码胶囊切换，不展开） -->
        <section id="demos" class="sn-docpage__section">
          <div class="sn-docpage__sec-head">
            <div class="sn-docpage__sec-title">
              <SnIcon
                class="sn-docpage__sec-icon sn-docpage__sec-icon--demos"
                :icon="Play"
                :size="15"
              />
              <h2>{{ UI.demos }}</h2>
            </div>
            <span class="sn-docpage__sec-aside">{{ UI.demosAside }}</span>
          </div>
          <!-- 一个案例一行：案例之间是并列的契约说明，横排会压缩演示宽度
                并让阅读顺序变得含糊。 -->
          <div class="sn-docpage__demo-fall">
            <div v-for="d in doc.demos" :key="d.name" class="sn-docpage__demo">
              <!-- 标题与描述在卡片外：它们是案例的正文说明，不是卡片饰面。
                   卡片只承载预览 / 源码面板本体。 -->
              <div class="sn-docpage__demo-head">
                <h3>{{ d.title }}</h3>
                <p>{{ d.blurb }}</p>
              </div>
              <div class="sn-docpage__demo-card">
                <!-- 切换胶囊浮在预览面板右上角；源码模式下浮在代码面板右上角。 -->
                <div class="sn-docpage__demo-switch" role="tablist" :aria-label="UI.previewSource">
                  <span
                    class="sn-docpage__demo-thumb"
                    :class="{ 'sn-docpage__demo-thumb--code': demoMode(d.name) === 'code' }"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    role="tab"
                    class="sn-docpage__demo-tab"
                    :class="{ 'sn-docpage__demo-tab--on': demoMode(d.name) === 'preview' }"
                    :aria-selected="demoMode(d.name) === 'preview'"
                    :aria-label="UI.preview"
                    @click="setDemoMode(d.name, 'preview')"
                  >
                    <SnIcon :icon="Box" :size="13" />
                  </button>
                  <button
                    type="button"
                    role="tab"
                    class="sn-docpage__demo-tab"
                    :class="{ 'sn-docpage__demo-tab--on': demoMode(d.name) === 'code' }"
                    :aria-selected="demoMode(d.name) === 'code'"
                    :aria-label="UI.source"
                    @click="setDemoMode(d.name, 'code')"
                  >
                    <SnIcon :icon="Code2" :size="13" />
                  </button>
                </div>
                <div v-if="demoMode(d.name) === 'preview'" class="sn-docpage__demo-stage">
                  <!-- ClientOnly：demo 是浏览器语料，常见 setup 期直接摸 window /
                     document / navigator（视频小窗、上传、日志自动滚动等）。这里
                     不套客户端边界就会在 SSR 阶段抛 "window is not defined"，整页
                     构建失败。Demo.vue 一直是这么做的，这里是把它补齐。 -->
                  <ClientOnly>
                    <component :is="demoComponents[d.name]" />
                  </ClientOnly>
                </div>
                <div v-else class="sn-docpage__demo-codebody">
                  <div class="sn-docpage__codebar">
                    <div class="sn-docpage__codebar-tabs">
                      <button
                        v-for="(sec, si) in demoSections[d.name]"
                        :key="sec.label"
                        type="button"
                        class="sn-docpage__codebar-tab"
                        :class="{ 'sn-docpage__codebar-tab--on': demoSectionIndex(d.name) === si }"
                        @click="setDemoSection(d.name, si)"
                      >
                        {{ sec.label }}
                      </button>
                    </div>
                    <button
                      type="button"
                      class="sn-docpage__mini"
                      @click="copyText('demo-' + d.name, demoSectionCode(d.name))"
                    >
                      <SnIcon :icon="copiedKey === 'demo-' + d.name ? Check : Copy" :size="13" />
                      {{ copiedKey === 'demo-' + d.name ? UI.copied : UI.copy }}
                    </button>
                  </div>
                  <pre class="sn-code sn-docpage__demo-code" v-html="demoSectionHtml(d.name)" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- API 属性参考 -->
        <section id="api" class="sn-docpage__section">
          <div class="sn-docpage__sec-head">
            <div class="sn-docpage__sec-title">
              <SnIcon
                class="sn-docpage__sec-icon sn-docpage__sec-icon--api"
                :icon="Table2"
                :size="15"
              />
              <h2>{{ UI.api }}</h2>
            </div>
          </div>
          <p class="sn-docpage__hint">
            <template v-for="(seg, i) in segs(doc.props.hint)" :key="i">
              <code v-if="seg.t === 'code'" class="sn-docpage__ic">{{ seg.s }}</code>
              <template v-else>{{ seg.s }}</template>
            </template>
          </p>
          <div class="sn-docpage__tablecard">
            <div class="sn-docpage__table-scroll">
              <table class="sn-docpage__table">
                <thead>
                  <tr>
                    <th>{{ UI.thProp }}</th>
                    <th>{{ UI.thType }}</th>
                    <th>{{ UI.thDefault }}</th>
                    <th>{{ UI.thDesc }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in doc.props.rows" :key="row.name">
                    <td class="sn-docpage__td-name">{{ row.name }}</td>
                    <td class="sn-docpage__td-type">{{ row.type }}</td>
                    <td class="sn-docpage__td-var">{{ row.default }}</td>
                    <td class="sn-docpage__td-desc">{{ row.desc }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- AI 原生集成 -->
        <section id="ai-native" class="sn-docpage__section">
          <div class="sn-docpage__sec-head">
            <div class="sn-docpage__sec-title">
              <SnIcon
                class="sn-docpage__sec-icon sn-docpage__sec-icon--ai"
                :icon="Sparkles"
                :size="15"
              />
              <h2>{{ UI.ai }}</h2>
            </div>
          </div>
          <div class="sn-docpage__ai">
            <div class="sn-docpage__ai-main">
              <div class="sn-docpage__ai-status">
                <span class="sn-docpage__pulse" aria-hidden="true" />
                {{ doc.ai.badge }}
              </div>
              <h3>{{ doc.ai.heading }}</h3>
              <p>{{ doc.ai.copy }}</p>
              <div class="sn-docpage__ai-chiprow">
                <code class="sn-docpage__ai-chip">{{ doc.ai.chip }}</code>
                <button
                  type="button"
                  class="sn-docpage__mini"
                  :aria-label="UI.copyChip + ' ' + doc.ai.chip"
                  @click="copyText('ai', doc.ai.chipCopy)"
                >
                  <SnIcon :icon="copiedKey === 'ai' ? Check : Copy" :size="13" />
                </button>
              </div>
            </div>
            <div class="sn-docpage__ai-panel">
              <div class="sn-docpage__ai-panel-head">
                <span>Context Snapshot</span>
                <span class="sn-docpage__ai-sync">ai-description.md</span>
              </div>
              <div v-for="stat in doc.ai.stats" :key="stat.key" class="sn-docpage__ai-row">
                <span>{{ stat.key }}</span>
                <span :class="`sn-docpage__ai-val sn-docpage__ai-val--${stat.tone}`">{{
                  stat.value
                }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 上一篇 / 下一篇 -->
        <div class="sn-docpage__pager">
          <button
            v-if="doc.pager.prev"
            type="button"
            class="sn-docpage__page"
            @click="navTo(doc.pager.prev.link)"
          >
            <span class="sn-docpage__page-label">{{ UI.prev }}</span>
            <span class="sn-docpage__page-title">
              <SnIcon :icon="ArrowLeft" :size="14" />
              {{ doc.pager.prev.text }}
            </span>
          </button>
          <span v-else />
          <button
            v-if="doc.pager.next"
            type="button"
            class="sn-docpage__page sn-docpage__page--right"
            @click="navTo(doc.pager.next.link)"
          >
            <span class="sn-docpage__page-label">{{ UI.next }}</span>
            <span class="sn-docpage__page-title">
              {{ doc.pager.next.text }}
              <SnIcon :icon="ArrowRight" :size="14" />
            </span>
          </button>
        </div>
      </main>

      <!-- ═══════════════ 右侧浮轨：本页目录 + 反馈 ═══════════════ -->
      <aside class="sn-docpage__rail">
        <div class="sn-docpage__railcard">
          <div class="sn-docpage__railhead">{{ UI.railhead }}</div>
          <nav class="sn-docpage__toc">
            <a
              v-for="item in doc.toc"
              :key="item.id"
              :href="`#${item.id}`"
              class="sn-docpage__toc-link"
              :class="{ 'sn-docpage__toc-link--active': activeSection === item.id }"
            >
              {{ item.text }}
            </a>
          </nav>
          <div class="sn-docpage__fb">
            <span>{{ UI.feedbackQ }}</span>
            <div class="sn-docpage__fb-row">
              <button
                type="button"
                class="sn-docpage__fb-btn"
                :class="{ 'sn-docpage__fb-btn--on': feedback === 'up' }"
                @click="feedback = 'up'"
              >
                {{ UI.helpful }}
              </button>
              <button
                type="button"
                class="sn-docpage__fb-btn sn-docpage__fb-btn--down"
                :class="{ 'sn-docpage__fb-btn--on': feedback === 'down' }"
                @click="feedback = 'down'"
              >
                {{ UI.needsWork }}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* ═══ 主题接线：全部颜色跟随站点 / UI 库变量，不携带私有色值 ═══ */
.sn-docpage {
  --sn-doc-accent: var(--sn-web-color-action-primary, var(--vp-c-brand-1));
  --sn-doc-accent-hover: var(--sn-web-color-action-primary-hover, var(--vp-c-brand-2));
  --sn-doc-accent-soft: var(--sn-web-color-action-primary-soft, var(--vp-c-brand-soft));
  --sn-doc-text-on-accent: var(--sn-web-color-text-on-primary, #ffffff);
  --sn-doc-card: var(--vp-c-bg-elv);
  --sn-doc-card-soft: var(--vp-c-bg-soft);
  --sn-doc-border: var(--vp-c-divider);
  --sn-doc-border-strong: var(--vp-c-border);
  --sn-doc-text-1: var(--vp-c-text-1);
  --sn-doc-text-2: var(--vp-c-text-2);
  --sn-doc-text-3: var(--vp-c-text-3);
  --sn-doc-ok: var(--sn-web-color-feedback-success, #10b981);

  /* ── 表面色阶（参考稿 "Emerald Cloud" 的 Level 0–3）────────────────────
   * 参考稿用五级表面 + 极低对比边框来分层，而不是投影。落到主题变量上：
   * canvas 是页面底、lowest 是卡面、low/low-high 是卡内嵌块（代码条、表头、
   * 控件底），这样深色模式与风格包仍然各自生效，组件不携带私有色值。 */
  --sn-doc-canvas: var(--vp-c-bg);
  --sn-doc-surface-lowest: var(--vp-c-bg-elv);
  --sn-doc-surface-low: var(--vp-c-bg-soft);
  --sn-doc-surface-high: color-mix(in srgb, var(--vp-c-bg-soft) 62%, var(--vp-c-bg));

  /* 参考稿的「超轻环境光」：靠色阶分层，投影只做贴地感，不做戏剧化浮起。 */
  --sn-doc-shadow: 0 1px 3px rgb(15 23 42 / 0.04), 0 1px 2px rgb(15 23 42 / 0.02);
  --sn-doc-shadow-hover: 0 4px 6px -1px rgb(15 23 42 / 0.07), 0 2px 4px -2px rgb(15 23 42 / 0.05);
  /* 卡片圆角：参考稿容器用 16px，内部小块 12px。 */
  --sn-doc-radius-card: 16px;
  --sn-doc-radius-block: 12px;
  --sn-doc-radius-chip: 9999px;
  --sn-doc-warn: var(--sn-web-color-feedback-warning, #f59e0b);
  --sn-doc-err: var(--sn-web-color-feedback-danger, #ef4444);
  --sn-doc-cyan: var(--sn-web-color-feedback-info, #06b6d4);
  /* 代码面板跟随主题：浅色模式浅色终端，深色模式烟熏终端（见 .sn-docpage--dark） */
  --sn-doc-code-bg: color-mix(in srgb, var(--vp-c-bg-soft) 72%, var(--vp-c-bg));
  --sn-doc-code-bar: var(--vp-c-bg-soft);
  --sn-doc-code-border: var(--vp-c-divider);
  --sn-doc-code-text: var(--vp-c-text-1);
  --sn-doc-code-dim: var(--vp-c-text-3);
  --sn-doc-code-meta: var(--vp-c-text-3);
  --sn-doc-code-chip: var(--vp-c-bg);
  --sn-doc-tok-c: #64748b;
  --sn-doc-tok-tag: #0369a1;
  --sn-doc-tok-attr: #4338ca;
  --sn-doc-tok-str: #047857;
  --sn-doc-tok-kw: #6d28d9;

  color: var(--sn-doc-text-1);
  font-size: 15px;
}
.sn-docpage--dark {
  --sn-doc-code-bg: #0b1220;
  --sn-doc-code-bar: #101828;
  --sn-doc-code-border: #1f2a3d;
  --sn-doc-code-text: #d6deeb;
  --sn-doc-code-dim: #94a3b8;
  --sn-doc-code-meta: #5b6b85;
  --sn-doc-code-chip: #131c2e;
  --sn-doc-tok-c: #5b6b85;
  --sn-doc-tok-tag: #7dd3fc;
  --sn-doc-tok-attr: #a5b4fc;
  --sn-doc-tok-str: #6ee7b7;
  --sn-doc-tok-kw: #c4b5fd;
}

/* 内容区封顶：正文列 1120px + 右轨 232px + 列距 40px = 1392px。超宽屏居中，
 * 避免 2560px 显示器上正文被拉到组件从未设计过的宽度（与 markdown 页的
 * content-container 上限同一语义）。 */
.sn-docpage__layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
  max-width: 1392px;
  margin-inline: auto;
}
@media (min-width: 1280px) {
  .sn-docpage__layout {
    grid-template-columns: minmax(0, 1fr) 232px;
  }
}

.sn-docpage__main {
  display: flex;
  flex-direction: column;
  gap: 52px;
  min-width: 0;
  padding-bottom: 48px;
}

/* ═══ 头部 ═══ */
/* 头卡：参考稿把标题区做成一张独立白卡（Level 1 表面 + 超轻投影），
 * 右上 / 左下各一团弥散光晕，标题与徽章在内层正常流里。这样页面第一屏
 * 就有明确的「一块内容」而不是漂浮在画布上的文字。 */
.sn-docpage__head {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 28px 30px 24px;
  border-radius: var(--sn-doc-radius-card);
  background: var(--sn-doc-surface-lowest);
  box-shadow: var(--sn-doc-shadow);
  overflow: hidden;
}

/* 弥散光晕：纯装饰，不参与布局也不拦截交互。 */
.sn-docpage__head::before,
.sn-docpage__head::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.sn-docpage__head::before {
  top: -96px;
  right: -80px;
  width: 320px;
  height: 320px;
  background: color-mix(in srgb, var(--sn-doc-accent) 14%, transparent);
  filter: blur(48px);
}
.sn-docpage__head::after {
  bottom: -64px;
  left: -48px;
  width: 256px;
  height: 256px;
  /* 同一根主题色相的更深一档（hover 态即深色锚点），而不是固定的 success 绿 ——
     换主题 / 换风格包时两团光晕仍然是一对，不会出现孤立的杂色。 */
  background: color-mix(in srgb, var(--sn-doc-accent-hover) 14%, transparent);
  filter: blur(40px);
}

/* 内层内容压在光晕之上。 */
.sn-docpage__head > * {
  position: relative;
  z-index: 1;
}
/* 特性条：一行轻量要点，细线分隔，图标随语义色。 */
.sn-docpage__features {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 24px;
  margin: 4px 0 0;
  padding: 14px 0 0;
  border-top: 1px solid var(--sn-doc-border);
  list-style: none;
  font-size: 12.5px;
  color: var(--sn-doc-text-2);
}
.sn-docpage__features li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.sn-docpage__features li svg {
  color: var(--sn-doc-accent);
  flex: none;
}

.sn-docpage__crumbs {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--sn-doc-text-3);
}
.sn-docpage__crumbs a {
  color: var(--sn-doc-text-3);
  text-decoration: none;
  transition: color 0.15s;
}
.sn-docpage__crumbs a:hover {
  color: var(--sn-doc-accent);
}
.sn-docpage__crumb-here {
  color: var(--sn-doc-accent);
  font-weight: 600;
}
.sn-docpage__crumb-sep {
  color: var(--sn-doc-border-strong);
}

.sn-docpage__titlerow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.sn-docpage__title {
  margin: 0;
  font-size: 34px;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: var(--sn-doc-text-1);
}
.sn-docpage__badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.sn-docpage__badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 999px;
  font-size: 12px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--sn-doc-text-2);
  background: var(--sn-doc-card);
}
.sn-docpage__badge--ok {
  border-color: color-mix(in srgb, var(--sn-doc-ok) 35%, transparent);
  color: color-mix(in srgb, var(--sn-doc-ok) 82%, var(--sn-doc-text-1));
  background: color-mix(in srgb, var(--sn-doc-ok) 9%, transparent);
}
.sn-docpage__badge--accent {
  border-color: color-mix(in srgb, var(--sn-doc-accent) 30%, transparent);
  color: var(--sn-doc-accent);
  background: var(--sn-doc-accent-soft);
}
.sn-docpage__badge--warn {
  border-color: color-mix(in srgb, var(--sn-doc-warn) 40%, transparent);
  color: color-mix(in srgb, var(--sn-doc-warn) 80%, var(--sn-doc-text-1));
  background: color-mix(in srgb, var(--sn-doc-warn) 10%, transparent);
}
.sn-docpage__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sn-doc-ok);
}

.sn-docpage__desc {
  margin: 0;
  max-width: 720px;
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--sn-doc-text-2);
}
.sn-docpage__ic {
  padding: 1.5px 6px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 5px;
  background: var(--sn-doc-card-soft);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 12.5px;
  color: var(--sn-doc-accent);
}

.sn-docpage__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}
.sn-docpage__action {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 9px;
  background: var(--sn-doc-card);
  color: var(--sn-doc-text-1);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
}
.sn-docpage__action :deep(.sn-icon) {
  color: var(--sn-doc-accent);
}
.sn-docpage__action:hover {
  border-color: color-mix(in srgb, var(--sn-doc-accent) 45%, var(--sn-doc-border));
  background: var(--sn-doc-accent-soft);
}

/* ═══ 区块通用 ═══ */
.sn-docpage__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-margin-top: 96px;
}
.sn-docpage__sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.sn-docpage__sec-title {
  display: flex;
  align-items: center;
  gap: 9px;
}
.sn-docpage__sec-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 999px;
}
.sn-docpage__sec-icon--playground {
  color: #6366f1;
  background: color-mix(in srgb, #6366f1 12%, transparent);
}
.sn-docpage__sec-icon--usage {
  color: #8b5cf6;
  background: color-mix(in srgb, #8b5cf6 12%, transparent);
}
.sn-docpage__sec-icon--variants {
  color: #f59e0b;
  background: color-mix(in srgb, #f59e0b 14%, transparent);
}
.sn-docpage__sec-icon--demos {
  color: #ec4899;
  background: color-mix(in srgb, #ec4899 12%, transparent);
}
.sn-docpage__sec-icon--tokens {
  color: #06b6d4;
  background: color-mix(in srgb, #06b6d4 12%, transparent);
}
.sn-docpage__sec-icon--api {
  color: #10b981;
  background: color-mix(in srgb, #10b981 12%, transparent);
}
.sn-docpage__sec-icon--ai {
  color: #a855f7;
  background: color-mix(in srgb, #a855f7 12%, transparent);
}
.sn-docpage__sec-title h2 {
  /* 覆盖 .vp-doc h2 的 border-top / padding-top / margin —— 那是标题上方
     分割线与图标不居中的同一根源 */
  margin: 0;
  padding-top: 0;
  border-top: 0;
  line-height: 1.3;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--sn-doc-text-1);
}
.sn-docpage__sec-aside {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11.5px;
  color: var(--sn-doc-text-3);
}
.sn-docpage__hint {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--sn-doc-text-2);
}

/* ═══ Playground 窗口 ═══ */
.sn-docpage__window {
  overflow: hidden;
  border-radius: 18px;
  background: var(--sn-doc-card);
  box-shadow: var(--sn-doc-shadow);
}
.sn-docpage__win-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--sn-doc-border);
  background: color-mix(in srgb, var(--sn-doc-card-soft) 82%, transparent);
}
.sn-docpage__win-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sn-docpage__dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.sn-docpage__dot--r {
  background: #ff5f57;
}
.sn-docpage__dot--y {
  background: #febc2e;
}
.sn-docpage__dot--g {
  background: #28c840;
}
.sn-docpage__win-file {
  margin-left: 10px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 12px;
  color: var(--sn-doc-text-3);
}
.sn-docpage__tabs {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 9px;
  background: var(--sn-doc-card-soft);
}
.sn-docpage__tab {
  padding: 4px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--sn-doc-text-2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}
.sn-docpage__tab:hover {
  color: var(--sn-doc-text-1);
}
.sn-docpage__tab--active {
  background: var(--sn-doc-card);
  color: var(--sn-doc-accent);
  font-weight: 600;
  box-shadow: 0 1px 3px rgb(2 6 16 / 0.08);
}

.sn-docpage__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 330px;
  padding: 52px 24px 28px;
  background:
    radial-gradient(520px 200px at 22% 0%, var(--sn-doc-accent-soft), transparent 70%),
    color-mix(in srgb, var(--sn-doc-card-soft) 55%, transparent);
  overflow: hidden;
}
.sn-docpage__stage-custom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  min-height: 180px;
  width: 100%;
  max-width: 560px;
  padding: 4px 0;
}
.sn-docpage__stage-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.sn-docpage__presets {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 560px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--sn-doc-border);
}
@media (min-width: 640px) {
  .sn-docpage__presets {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
}
.sn-docpage__preset {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 9px 4px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 11px;
  background: var(--sn-doc-card);
  color: var(--sn-doc-text-2);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;
}
.sn-docpage__preset:hover {
  border-color: color-mix(in srgb, var(--sn-doc-accent) 40%, var(--sn-doc-border));
  color: var(--sn-doc-text-1);
}
.sn-docpage__preset--on {
  border-color: var(--sn-doc-accent);
  background: var(--sn-doc-accent-soft);
  color: var(--sn-doc-accent);
}
.sn-docpage__preset-dot {
  width: 16px;
  height: 16px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 5px;
}

/* 控制工具条 */
.sn-docpage__controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid var(--sn-doc-border);
  background: var(--sn-doc-card);
}
@media (min-width: 720px) {
  .sn-docpage__controls {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.sn-docpage__ctrl {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.sn-docpage__ctrl-hint {
  margin-left: 6px;
  color: var(--sn-doc-muted, var(--vp-c-text-3));
  font-size: 11px;
  font-style: normal;
}
.sn-docpage__ctrl-range {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sn-docpage__range-slider {
  flex: 1 1 auto;
  min-width: 0;
}
.sn-docpage__ctrl-value {
  flex: none;
  min-width: 42px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--sn-doc-card-soft, var(--vp-c-bg-soft));
  color: var(--sn-doc-text, var(--vp-c-text-1));
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.sn-docpage__ctrl-input {
  width: 100%;
  height: 30px;
  padding: 0 9px;
  border: 1px solid var(--sn-doc-border, var(--vp-c-border));
  border-radius: 6px;
  background: var(--sn-doc-card, var(--vp-c-bg));
  color: inherit;
  font: inherit;
  font-size: 13px;
  box-sizing: border-box;
  outline: none;
}
.sn-docpage__ctrl-input:focus {
  border-color: var(--sn-doc-accent, var(--vp-c-brand-1));
}
.sn-docpage__ctrl--actions {
  justify-content: flex-end;
}
.sn-docpage__ctrl-label {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--sn-doc-text-3);
}
.sn-docpage__switch-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.sn-docpage__ctrl-iconrow {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2px;
}
.sn-docpage__ctrl .sn-docpage__switch-line {
  padding: 4px 0;
  font-size: 12.5px;
  color: var(--sn-doc-text-2);
}
.sn-docpage__ctrl > :deep(.sn-select),
.sn-docpage__ctrl > :deep(.sn-radio-group) {
  width: 100%;
}

.sn-docpage__ctrl :deep(.sn-radio-group) {
  flex-wrap: nowrap;
}
.sn-docpage__ctrl :deep(.sn-radio-group *) {
  white-space: nowrap;
}

/* ═══ 代码面板（跟随主题：浅色浅终端 / 深色烟熏终端） ═══ */
.sn-docpage__terminal,
.sn-docpage__codecard {
  overflow: hidden;
  border: 1px solid var(--sn-doc-code-border);
  border-radius: 12px;
  background: var(--sn-doc-code-bg);
}
.sn-docpage__term-bar,
.sn-docpage__codecard-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--sn-doc-code-border);
  background: var(--sn-doc-code-bar);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11.5px;
  color: var(--sn-doc-code-dim);
}
.sn-docpage__term-body {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 13px;
  color: var(--sn-doc-code-text);
}
.sn-docpage__term-prompt {
  color: var(--sn-doc-code-meta);
}
.sn-docpage__term-meta {
  padding: 0 16px 10px;
  font-size: 11px;
  color: var(--sn-doc-code-meta);
  text-align: right;
}
.sn-docpage__codecard-meta {
  color: var(--sn-doc-code-meta);
}
.sn-code {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 12.5px;
  line-height: 1.75;
  color: var(--sn-doc-code-text);
  white-space: pre;
}
.sn-code :deep(.tok-c) {
  color: var(--sn-doc-tok-c);
  font-style: italic;
}
.sn-code :deep(.tok-t) {
  color: var(--sn-doc-tok-tag);
}
.sn-code :deep(.tok-a) {
  color: var(--sn-doc-tok-attr);
}
.sn-code :deep(.tok-s) {
  color: var(--sn-doc-tok-str);
}
.sn-code :deep(.tok-k) {
  color: var(--sn-doc-tok-kw);
}
.sn-code :deep(.sn-code__ln) {
  display: inline-block;
  width: 2.2em;
  margin-right: 10px;
  color: var(--sn-doc-tok-ln);
  text-align: right;
  user-select: none;
}
.sn-docpage__codebody {
  background: var(--sn-doc-code-bg);
}
.sn-docpage__code-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 14px;
  border-top: 1px solid var(--sn-doc-code-border);
  font-size: 11.5px;
  color: var(--sn-doc-code-meta);
}

.sn-docpage__mini {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border: 1px solid var(--sn-doc-code-border);
  border-radius: 7px;
  background: transparent;
  color: var(--sn-doc-code-dim);
  font-size: 11.5px;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s;
}
.sn-docpage__mini:hover {
  border-color: var(--sn-doc-border-strong);
  color: var(--sn-doc-text-1);
}

/* ═══ demo 案例（预览/源码切换，一个案例一行） ═══ */
.sn-docpage__demo-fall {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
/* 案例容器不再是卡片：标题、描述、切换胶囊都是页面正文层，无背景；
 * 卡片饰面（圆角 / 底色 / 阴影）只属于预览面板本体。 */
.sn-docpage__demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sn-docpage__demo-head h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--sn-doc-text-1);
}
.sn-docpage__demo-head p {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--sn-doc-text-2);
}
.sn-docpage__demo-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: var(--sn-doc-card);
  box-shadow: var(--sn-doc-shadow);
}

/* 预览 / 源码切换胶囊（图标，参照 heroui 的 eye/code 双态）。
  * 滑块是唯一的运动物：cubic-bezier(0.34, 1.56, 0.64, 1) 的 back-out
  * 曲线让它带一次可见回弹（过冲约 10% 后落位）——与侧栏端切换胶囊
  * 同一套「确认感」语言。 */
/* 胶囊浮在预览面板右上角：绝对定位脱离内容流，预览本体始终居中。
 * z-index 高于预览内容，源码模式下同样浮在代码面板右上角。 */
.sn-docpage__demo-switch {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  display: inline-flex;
  flex: none;
  padding: 3px;
  border-radius: 999px;
  background: var(--sn-doc-card-soft);
  box-shadow: 0 1px 3px rgb(2 6 16 / 0.08);
}
.sn-docpage__demo-thumb {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: 28px;
  border-radius: 999px;
  background: var(--sn-doc-card);
  box-shadow: 0 1px 3px rgb(2 6 16 / 0.1);
  transform: translateX(0);
  transition: transform 480ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.sn-docpage__demo-thumb--code {
  transform: translateX(28px);
}
.sn-docpage__demo-tab {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--sn-doc-text-3);
  cursor: pointer;
  transition: color 0.15s;
}
.sn-docpage__demo-tab:hover {
  color: var(--sn-doc-text-1);
}
.sn-docpage__demo-tab--on {
  color: var(--sn-doc-accent);
}
.sn-docpage__demo-stage {
  /* 白底面：预览是「作品台」，灰底会把组件自身的浅色控件吃掉一层对比。
     给一个最小高度，避免单行演示（一个按钮 / 一个开关）把卡片压成细条。 */
  min-height: 240px;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sn-doc-surface-lowest);
}
.sn-docpage__demo-codebody {
  background: var(--sn-doc-code-bg);
}
.sn-docpage__codebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  /* 右侧留出浮动切换胶囊的宽度，复制按钮不被压住。 */
  padding: 8px 84px 8px 12px;
}
.sn-docpage__codebar-tabs {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border-radius: 8px;
  background: var(--sn-doc-code-chip);
}
.sn-docpage__codebar-tab {
  padding: 3px 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--sn-doc-code-dim);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11.5px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}
.sn-docpage__codebar-tab:hover {
  color: var(--sn-doc-code-text);
}
.sn-docpage__codebar-tab--on {
  background: var(--sn-doc-card);
  color: var(--sn-doc-accent);
  font-weight: 600;
}
.sn-docpage__demo-code {
  margin: 12px 0 0;
  border-radius: 0;
}

/* Token 实时读数 */
.sn-docpage__tokenbody {
  padding: 14px 16px;
  background: var(--sn-doc-card-soft);
}
.sn-docpage__token-live {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 12px;
}
.sn-docpage__token-live td {
  padding: 6px 8px;
  border-bottom: 1px dashed var(--sn-doc-border);
}
.sn-docpage__token-name {
  color: var(--sn-doc-accent);
  font-weight: 600;
}
.sn-docpage__token-val {
  color: var(--sn-doc-text-2);
}
.sn-docpage__token-note {
  margin: 10px 0 0;
  font-size: 11.5px;
  color: var(--sn-doc-text-3);
}

/* ═══ 变体卡 ═══ */
.sn-docpage__variant-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 14px;
}
@media (min-width: 760px) {
  .sn-docpage__variant-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.sn-docpage__vcard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  background: var(--sn-doc-card);
  box-shadow: var(--sn-doc-shadow);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}
.sn-docpage__vcard:hover {
  transform: translateY(-2px);
  box-shadow: var(--sn-doc-shadow-hover);
}
.sn-docpage__vcard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.sn-docpage__vcard-head h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--sn-doc-text-1);
}
.sn-docpage__vcard-tag {
  padding: 2px 8px;
  border-radius: 6px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10.5px;
  background: var(--sn-doc-card-soft);
  color: var(--sn-doc-text-2);
}
.sn-docpage__vcard-tag--accent {
  background: var(--sn-doc-accent-soft);
  color: var(--sn-doc-accent);
}
.sn-docpage__vcard-tag--ai {
  background: color-mix(in srgb, var(--sn-doc-cyan) 12%, transparent);
  color: var(--sn-doc-cyan);
}
.sn-docpage__vcard-copy {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--sn-doc-text-3);
}
.sn-docpage__vcard-stage {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 92px;
  padding: 16px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--sn-doc-card-soft) 65%, transparent);
}

/* ═══ 表格 ═══ */
/* 表格无边框：层级交给字重与留白，不画线。表头用小号等宽字体 + 弱色区分，
 * 行与行之间靠 padding 呼吸，悬停给一层极浅底色保持可扫读性。 */
.sn-docpage__tablecard {
  border-radius: 14px;
  background: transparent;
}
.sn-docpage__table-scroll {
  overflow-x: auto;
}
.sn-docpage__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.sn-docpage__table th {
  padding: 10px 14px;
  color: var(--sn-doc-text-3);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11.5px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}
.sn-docpage__table td {
  padding: 10px 14px;
  color: var(--sn-doc-text-2);
  vertical-align: top;
}
.sn-docpage__table tbody tr:hover td {
  background: color-mix(in srgb, var(--sn-doc-accent) 4%, transparent);
}
.sn-docpage__table tbody tr {
  transition: background 0.12s;
}
.sn-docpage__table tbody tr:hover {
  background: color-mix(in srgb, var(--sn-doc-accent-soft) 45%, transparent);
}
.sn-docpage__th-right {
  text-align: right !important;
}
.sn-docpage__td-name {
  color: var(--sn-doc-accent) !important;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-weight: 600;
  white-space: nowrap;
}
.sn-docpage__td-var {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--sn-doc-text-3) !important;
}
.sn-docpage__td-type {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--sn-doc-accent) !important;
  font-size: 11.5px;
}
.sn-docpage__td-value {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  color: var(--sn-doc-text-1) !important;
}
.sn-docpage__td-desc {
  color: var(--sn-doc-text-1) !important;
}
.sn-docpage__td-preview {
  text-align: right;
}
.sn-docpage__swatch {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 1px solid var(--sn-doc-border-strong);
  border-radius: 4px;
  vertical-align: middle;
}
.sn-docpage__swatch--empty {
  background: transparent;
}
.sn-docpage__swatch-curve {
  display: inline-block;
  width: 22px;
  height: 16px;
  border: 1.5px solid var(--sn-doc-accent);
  vertical-align: middle;
}

/* ═══ AI 原生集成 ═══ */
.sn-docpage__ai {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 22px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 16px;
  background: var(--sn-doc-card);
}
@media (min-width: 800px) {
  .sn-docpage__ai {
    flex-direction: row;
    align-items: center;
  }
}
.sn-docpage__ai-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
}
.sn-docpage__ai-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--sn-doc-ok);
}
.sn-docpage__pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sn-doc-ok);
  animation: sn-doc-pulse 1.8s ease-in-out infinite;
}
@keyframes sn-doc-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
.sn-docpage__ai-main h3 {
  margin: 0;
  font-size: 16.5px;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: var(--sn-doc-text-1);
}
.sn-docpage__ai-main p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--sn-doc-text-2);
}
.sn-docpage__ai-chiprow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 6px;
}
.sn-docpage__ai-chip {
  padding: 7px 12px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 8px;
  background: var(--sn-doc-card-soft);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 12px;
  color: var(--sn-doc-text-1);
}
.sn-docpage__ai-chiprow .sn-docpage__mini {
  border-color: var(--sn-doc-border);
  color: var(--sn-doc-text-2);
}
.sn-docpage__ai-chiprow .sn-docpage__mini:hover {
  border-color: var(--sn-doc-border-strong);
  color: var(--sn-doc-text-1);
}
.sn-docpage__ai-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: var(--sn-doc-code-bg);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11.5px;
}
@media (min-width: 800px) {
  .sn-docpage__ai-panel {
    width: 264px;
    flex: none;
  }
}
.sn-docpage__ai-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--sn-doc-code-border);
  color: var(--sn-doc-code-dim);
}
.sn-docpage__ai-sync {
  color: var(--sn-doc-ok);
  font-weight: 600;
}
.sn-docpage__ai-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 9px;
  border-radius: 6px;
  background: var(--sn-doc-code-chip);
  color: var(--sn-doc-code-dim);
}
.sn-docpage__ai-val--accent {
  color: var(--sn-doc-accent);
  font-weight: 600;
}
.sn-docpage__ai-val--cyan {
  color: var(--sn-doc-cyan);
}
.sn-docpage__ai-val--ok {
  color: var(--sn-doc-ok);
}

/* ═══ 上一篇 / 下一篇 ═══ */
.sn-docpage__pager {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
  padding-top: 26px;
  border-top: 1px solid var(--sn-doc-border);
}
@media (min-width: 640px) {
  .sn-docpage__pager {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.sn-docpage__page {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 13px 15px;
  border-radius: 14px;
  background: var(--sn-doc-card);
  cursor: pointer;
  box-shadow: var(--sn-doc-shadow);
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
}
.sn-docpage__page:hover {
  transform: translateY(-1px);
  box-shadow: var(--sn-doc-shadow-hover);
}
.sn-docpage__page--right {
  align-items: flex-end;
  text-align: right;
}
.sn-docpage__page-label {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10.5px;
  color: var(--sn-doc-text-3);
}
.sn-docpage__page-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--sn-doc-text-1);
}
.sn-docpage__page:hover .sn-docpage__page-title {
  color: var(--sn-doc-accent);
}

/* ═══ 右侧浮轨 ═══ */
.sn-docpage__rail {
  display: none;
}
@media (min-width: 1280px) {
  .sn-docpage__rail {
    display: block;
    position: sticky;
    top: 96px;
    align-self: start;
  }
}
/* 目录卡：磨砂玻璃（盖在点阵画布上） */
.sn-docpage__railcard {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--vp-c-bg) 55%, transparent);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgb(255 255 255 / 0.6);
  box-shadow: var(--sn-doc-shadow);
}
.sn-docpage--dark .sn-docpage__railcard {
  background: rgb(15 23 42 / 0.5);
  border-color: rgb(255 255 255 / 0.1);
}
.sn-docpage__railhead {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--sn-doc-text-3);
}
.sn-docpage__toc {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-size: 12.5px;
}
.sn-docpage__toc a {
  padding: 5px 8px;
  border-radius: 7px;
  color: var(--sn-doc-text-2);
  text-decoration: none;
  transition:
    background 0.14s,
    color 0.14s;
}
.sn-docpage__toc-link--active {
  color: var(--sn-doc-accent);
  font-weight: 600;
}
.sn-docpage__toc a:hover {
  background: var(--sn-doc-card-soft);
  color: var(--sn-doc-accent);
}
.sn-docpage__fb {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-top: 12px;
  border-top: 1px solid var(--sn-doc-border);
  font-size: 11.5px;
  color: var(--sn-doc-text-3);
}
.sn-docpage__fb-row {
  display: flex;
  gap: 6px;
}
.sn-docpage__fb-btn {
  flex: 1;
  padding: 6px 0;
  border: 1px solid var(--sn-doc-border);
  border-radius: 8px;
  background: var(--sn-doc-card-soft);
  color: var(--sn-doc-text-2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}
.sn-docpage__fb-btn:hover {
  border-color: color-mix(in srgb, var(--sn-doc-accent) 40%, var(--sn-doc-border));
  color: var(--sn-doc-accent);
}
.sn-docpage__fb-btn--on {
  border-color: var(--sn-doc-accent);
  background: var(--sn-doc-accent-soft);
  color: var(--sn-doc-accent);
}

/* ═══ 氛围背景（原型还原）：弥散光晕 + 亚像素点阵，配色全部走主题变量 ═══ */
.sn-docpage__bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.sn-docpage__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
}
.sn-docpage__blob--a {
  top: -18%;
  left: 15%;
  width: 680px;
  height: 680px;
  background: radial-gradient(
    circle at 40% 40%,
    color-mix(in srgb, var(--sn-doc-accent) 16%, transparent),
    transparent 70%
  );
}
.sn-docpage__blob--b {
  top: 35%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle at 60% 40%,
    color-mix(in srgb, var(--sn-doc-cyan) 12%, transparent),
    transparent 70%
  );
}
.sn-docpage__blob--c {
  bottom: 5%;
  left: 20%;
  width: 720px;
  height: 720px;
  background: radial-gradient(
    circle at 50% 60%,
    color-mix(in srgb, var(--sn-doc-accent) 10%, transparent),
    transparent 72%
  );
}
.sn-docpage__dotgrid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    color-mix(in srgb, var(--sn-doc-accent) 14%, transparent) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  opacity: 0.55;
}
.sn-docpage--dark .sn-docpage__blob {
  filter: blur(130px);
  opacity: 0.85;
}

/* ═══ 移动端适配（<960px） ═══════════════════════════════════════════
 * demo 卡片单列由 §demos 的 1199 断点承担；这里处理窄容器下的挤压：
 *   - playground 顶栏：页签/文件名禁止逐字竖排，放不下横向滚动；
 *   - demo 卡片头部与舞台收紧内距；
 *   - 代码字号略降。 */
@media (max-width: 959px) {
  .sn-docpage__win-bar {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .sn-docpage__win-bar::-webkit-scrollbar {
    display: none;
  }
  .sn-docpage__tab,
  .sn-docpage__win-file {
    white-space: nowrap;
    flex: none;
  }
  .sn-docpage__tab {
    padding: 4px 10px;
  }
  .sn-docpage__demo-stage {
    min-height: 180px;
    padding: 16px 10px;
  }
  .sn-docpage__demo-codebody .sn-docpage__codebar {
    padding: 8px 84px 8px 10px;
  }
  .sn-docpage__demo-code {
    font-size: 12px;
  }
}
</style>
