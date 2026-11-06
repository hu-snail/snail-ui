<script setup lang="ts">
/**
 * SnDocPage — 组件详情页渲染器（版式参考高保真原型，配色跟随站点主题）。
 *
 * 三栏叙事：中央文档流 + 右侧「本页目录 / 反馈」浮轨（xl 以上双栏），
 * 左侧站点原生侧栏保留。所有颜色经由 --sn-doc-* 局部变量映射到
 * --vp-c-*（站点）与 --sn-web-color-*（UI 库语义层），因此暗色模式与
 * Style Pack 换肤自动生效，本组件不携带任何私有色值。
 *
 * Playground 控件直接使用 @snui/vue-web 的 SnSelect / SnRadioGroup /
 * SnSwitch —— 文档页本身就在消费被文档化的组件。
 */
 import { computed, markRaw, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from 'vue';
import { useData, useRouter } from 'vitepress';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  Copy,
  Code2,
  Cpu,
  FlaskConical,
  Layers,
  Link as LinkIcon,
  Monitor,
  Palette,
  Play,
  SlidersHorizontal,
  Sparkles,
  Table2,
} from 'lucide-vue-next';
import { SnButton, SnIcon, SnRadioGroup, SnSelect, SnSwitch, SnWaterfall } from '@snui/vue-web';
import { loadDemoComponent, loadDemoSource } from '../../utils/demo-loader';
import type { DocButtonDemo, DocSeg, DocQuickAction, SnDocPageData } from './types';

const props = defineProps<{ doc: SnDocPageData }>();

const { isDark } = useData();
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

/* ── Playground ──────────────────────────────────────────────────────── */

type PgType = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' | 'tertiary';
type PgSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge';

const pg = reactive({
  type: 'primary' as PgType,
  size: 'medium' as PgSize,
  shape: 'default' as 'default' | 'round' | 'circle',
  iconPlacement: 'left' as 'left' | 'right',
  showIcon: true,
  loading: false,
  disabled: false,
});

/** 语义类型预设（色点跟随 UI 库语义变量，风格包换肤同步变化）。 */
const typePresets: Array<{ key: PgType; label: string; dot: string }> = [
  {
    key: 'default',
    label: 'Default',
    dot: 'var(--sn-web-color-border-default, var(--vp-c-border))',
  },
  { key: 'primary', label: 'Primary', dot: 'var(--sn-doc-accent)' },
  { key: 'info', label: 'Info', dot: 'var(--sn-web-color-feedback-info, var(--vp-c-text-2))' },
  { key: 'success', label: 'Success', dot: 'var(--sn-doc-ok)' },
  { key: 'warning', label: 'Warning', dot: 'var(--sn-doc-warn)' },
  { key: 'error', label: 'Error', dot: 'var(--sn-doc-err)' },
  { key: 'tertiary', label: 'Tertiary', dot: 'var(--sn-doc-accent-soft)' },
];

const typeOptions = typePresets.map((p) => ({ label: p.label, value: p.key }));
const sizeOptions = [
  { label: 'tiny', value: 'tiny' },
  { label: 'small', value: 'small' },
  { label: 'medium', value: 'medium' },
  { label: 'large', value: 'large' },
  { label: 'huge', value: 'huge' },
];
const shapeOptions = [
  { label: '默认', value: 'default' },
  { label: '胶囊', value: 'round' },
  { label: '圆形', value: 'circle' },
];
const iconPlacementOptions = [
  { label: '左', value: 'left' },
  { label: '右', value: 'right' },
];

const activeTab = ref<'preview' | 'code' | 'token'>('preview');

/** 点击反馈：真实事件语义（disabled / loading 时 SnButton 不会 emit）。 */
const toast = ref('');
let toastTimer: ReturnType<typeof setTimeout> | undefined;
function onDemoClick(): void {
  toast.value = '已触发 click 事件 · MouseEvent';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = '';
  }, 1500);
}
onBeforeUnmount(() => clearTimeout(toastTimer));

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

/** 由 Playground 当前状态生成的真实可运行片段。 */
const generatedCode = computed(() => {
  const attrs: string[] = [];
  if (pg.type !== 'default') attrs.push(`type="${pg.type}"`);
  if (pg.size !== 'medium') attrs.push(`size="${pg.size}"`);
  if (pg.shape === 'round') attrs.push('round');
  if (pg.shape === 'circle') attrs.push('circle');
  if (pg.loading) attrs.push('loading');
  if (pg.disabled) attrs.push('disabled');
  if (pg.showIcon && pg.iconPlacement === 'right') attrs.push('icon-placement="right"');
  if (!pg.showIcon) attrs.push(':show-icon="false"');
  const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
  return [
    '<script setup lang="ts">',
    "import { SnButton } from '@snui/vue-web';",
    '<\/script>',
    '',
    '<template>',
    `  <SnButton${attrStr}>`,
    `    ${props.doc.playground.stageLabel}`,
    '  </SnButton>',
    '</template>',
  ].join('\n');
});

const generatedHtml = computed(() => codeToHtml(generatedCode.value));
const usageHtml = codeToHtml(props.doc.usage.code);

/* ── Token 实时读数（Playground · Token 变量页签） ────────────────────── */

const tokenVars = [
  '--aui-button-radius',
  '--sn-button-radius',
  '--aui-button-height-medium',
  '--sn-button-height-medium',
  '--aui-button-padding-x',
  '--aui-button-font-size',
  '--aui-button-focus-ring',
  '--sn-web-color-action-primary',
  '--sn-web-color-action-primary-hover',
  '--sn-web-color-action-primary-soft',
];

const liveTokens = ref<Array<{ name: string; value: string }>>([]);
function readLiveTokens(): void {
  const cs = getComputedStyle(document.documentElement);
  liveTokens.value = tokenVars.map((name) => ({
    name,
    value: cs.getPropertyValue(name).trim() || '(未设置 · 组件回退值)',
  }));
}
watch(activeTab, (tab) => {
  if (tab === 'token') readLiveTokens();
});
onMounted(readLiveTokens);

function isColorToken(name: string): boolean {
  return name.includes('color');
}

/* ── 变体卡演示 ──────────────────────────────────────────────────────── */

function demoBind(demo: DocButtonDemo) {
  return {
    type: demo.type ?? ('default' as const),
    size: demo.size ?? ('medium' as const),
    text: demo.text || undefined,
    ghost: demo.ghost || undefined,
    dashed: demo.dashed || undefined,
    strong: demo.strong || undefined,
    secondary: demo.secondary || undefined,
    tertiary: demo.tertiary || undefined,
    quaternary: demo.quaternary || undefined,
    round: demo.round || undefined,
    circle: demo.circle || undefined,
  };
}

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
const demoColumns = computed(() => {
  const cols: Array<typeof props.doc.demos> = [[], []];
  props.doc.demos.forEach((d, i) => cols[i % 2].push(d));
  return cols;
});

const demoComponents = computed(() =>
  Object.fromEntries(props.doc.demos.map((d) => [d.name, markRawDemo(d.name)])),
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
     props.doc.demos.map(async (d) => {
       out[d.name] = await loadDemoSource(d.name, false);
     }),
   );
   demoSources.value = out;
 });

/** demo-loader 返回 defineAsyncComponent —— 缓存一份避免每次渲染重建。 */
const demoComponentCache = new Map<string, unknown>();
function markRawDemo(name: string): unknown {
  if (!demoComponentCache.has(name)) {
    demoComponentCache.set(name, markRaw(loadDemoComponent(name, false)));
  }
  return demoComponentCache.get(name);
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
   for (const d of props.doc.demos) {
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
  const ids = props.doc.toc.map((t) => t.id);
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
          <nav class="sn-docpage__crumbs" aria-label="面包屑">
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
                <span v-if="act.copy && copiedKey === 'quick'">已复制到剪贴板</span>
                <span v-else>{{ act.label }}</span>
              </button>
            </template>
          </div>
        </header>

        <!-- 交互式演练 Playground -->
        <section id="playground" class="sn-docpage__section">
          <div class="sn-docpage__sec-head">
            <div class="sn-docpage__sec-title">
              <SnIcon
                class="sn-docpage__sec-icon sn-docpage__sec-icon--playground"
                :icon="SlidersHorizontal"
                :size="15"
              />
              <h2>交互式演练 Playground</h2>
            </div>
            <span class="sn-docpage__sec-aside">实时驱动真实 SnButton</span>
          </div>

          <div class="sn-docpage__window">
            <div class="sn-docpage__win-bar">
              <div class="sn-docpage__win-left">
                <span class="sn-docpage__dot sn-docpage__dot--r" />
                <span class="sn-docpage__dot sn-docpage__dot--y" />
                <span class="sn-docpage__dot sn-docpage__dot--g" />
                <span class="sn-docpage__win-file">{{ doc.playground.fileLabel }}</span>
              </div>
              <div class="sn-docpage__tabs" role="tablist" aria-label="Playground 视图">
                <button
                  v-for="tab in [
                    { key: 'preview', label: '交互预览' },
                    { key: 'code', label: '代码' },
                    { key: 'token', label: 'Token 变量' },
                  ]"
                  :key="tab.key"
                  type="button"
                  role="tab"
                  class="sn-docpage__tab"
                  :class="{ 'sn-docpage__tab--active': activeTab === tab.key }"
                  :aria-selected="activeTab === tab.key"
                  @click="activeTab = tab.key as 'preview' | 'code' | 'token'"
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- 预览舞台 -->
            <div v-if="activeTab === 'preview'" class="sn-docpage__stage">
              <div class="sn-docpage__stage-center">
                <SnButton
                  :type="pg.type"
                  :size="pg.size"
                  :round="pg.shape === 'round'"
                  :circle="pg.shape === 'circle'"
                  :icon-placement="pg.iconPlacement"
                  :show-icon="pg.showIcon"
                  :loading="pg.loading"
                  :disabled="pg.disabled"
                  :icon="Cpu"
                  @click="onDemoClick"
                >
                  {{ doc.playground.stageLabel }}
                </SnButton>
                <div
                  class="sn-docpage__toast"
                  :class="{ 'sn-docpage__toast--on': toast !== '' }"
                  aria-live="polite"
                >
                  {{ toast || '点击按钮触发 click 事件' }}
                </div>
              </div>

              <div class="sn-docpage__presets" role="group" aria-label="语义类型预设">
                <button
                  v-for="preset in typePresets"
                  :key="preset.key"
                  type="button"
                  class="sn-docpage__preset"
                  :class="{ 'sn-docpage__preset--on': pg.type === preset.key }"
                  @click="pg.type = preset.key"
                >
                  <span class="sn-docpage__preset-dot" :style="{ background: preset.dot }" />
                  {{ preset.label }}
                </button>
              </div>
            </div>

            <!-- 代码页签 -->
            <div v-else-if="activeTab === 'code'" class="sn-docpage__codebody">
              <pre class="sn-code" v-html="generatedHtml" />
              <div class="sn-docpage__code-foot">
                <span>随左侧控件实时生成 · 与预览状态一致</span>
                <button
                  type="button"
                  class="sn-docpage__mini"
                  @click="copyText('gen', generatedCode)"
                >
                  <SnIcon :icon="copiedKey === 'gen' ? Check : Copy" :size="13" />
                  {{ copiedKey === 'gen' ? '已复制' : '复制' }}
                </button>
              </div>
            </div>

            <!-- Token 页签 -->
            <div v-else class="sn-docpage__tokenbody">
              <table class="sn-docpage__token-live">
                <tbody>
                  <tr v-for="tk in liveTokens" :key="tk.name">
                    <td class="sn-docpage__token-name">{{ tk.name }}</td>
                    <td class="sn-docpage__token-val">
                      <span
                        v-if="isColorToken(tk.name) && tk.value.startsWith('#')"
                        class="sn-docpage__swatch"
                        :style="{ background: tk.value }"
                      />
                      {{ tk.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p class="sn-docpage__token-note">
                读取当前文档根节点的 computed style —— 切换主题编辑器或风格包后数值同步变化。
              </p>
            </div>

            <!-- 控制工具条 -->
            <div class="sn-docpage__controls">
              <div class="sn-docpage__ctrl">
                <span class="sn-docpage__ctrl-label">类型 Type</span>
                <SnSelect
                  v-model="pg.type"
                  :options="typeOptions"
                  size="small"
                  aria-label="按钮类型"
                />
              </div>
              <div class="sn-docpage__ctrl">
                <span class="sn-docpage__ctrl-label">尺寸 Size</span>
                <SnRadioGroup
                  v-model="pg.size"
                  :options="sizeOptions"
                  size="small"
                  button
                  aria-label="按钮尺寸"
                />
              </div>
              <div class="sn-docpage__ctrl">
                <span class="sn-docpage__ctrl-label">形状 Shape</span>
                <SnRadioGroup
                  v-model="pg.shape"
                  :options="shapeOptions"
                  size="small"
                  button
                  aria-label="按钮形状"
                />
              </div>
              <div class="sn-docpage__ctrl">
                <span class="sn-docpage__ctrl-label">图标 Icon</span>
                <div class="sn-docpage__ctrl-iconrow">
                  <SnRadioGroup
                    v-model="pg.iconPlacement"
                    :options="iconPlacementOptions"
                    size="small"
                    button
                    aria-label="图标位置"
                  />
                  <label class="sn-docpage__switch-line">
                    <span>显示图标</span>
                    <SnSwitch v-model="pg.showIcon" size="small" />
                  </label>
                </div>
              </div>
              <div class="sn-docpage__ctrl">
                <span class="sn-docpage__ctrl-label">状态 State</span>
                <label class="sn-docpage__switch-line">
                  <span>加载 loading</span>
                  <SnSwitch v-model="pg.loading" size="small" />
                </label>
                <label class="sn-docpage__switch-line">
                  <span>禁用 disabled</span>
                  <SnSwitch v-model="pg.disabled" size="small" />
                </label>
              </div>
            </div>
          </div>
        </section>

        <!-- 代码用法 -->
        <section id="usage" class="sn-docpage__section">
          <div class="sn-docpage__sec-head">
            <div class="sn-docpage__sec-title">
              <SnIcon
                class="sn-docpage__sec-icon sn-docpage__sec-icon--usage"
                :icon="Box"
                :size="15"
              />
              <h2>代码用法 Code Usage</h2>
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

        <!-- 样式变体 -->
        <section id="variants" class="sn-docpage__section">
          <div class="sn-docpage__sec-head">
            <div class="sn-docpage__sec-title">
              <SnIcon
                class="sn-docpage__sec-icon sn-docpage__sec-icon--variants"
                :icon="FlaskConical"
                :size="15"
              />
              <h2>样式变体 Style Variants</h2>
            </div>
          </div>
          <p class="sn-docpage__hint">
            <template v-for="(seg, i) in segs(doc.variants.hint)" :key="i">
              <code v-if="seg.t === 'code'" class="sn-docpage__ic">{{ seg.s }}</code>
              <template v-else>{{ seg.s }}</template>
            </template>
          </p>
          <div class="sn-docpage__variant-grid">
            <div v-for="card in doc.variants.cards" :key="card.title" class="sn-docpage__vcard">
              <div class="sn-docpage__vcard-head">
                <h3>{{ card.title }}</h3>
                <span
                  class="sn-docpage__vcard-tag"
                  :class="`sn-docpage__vcard-tag--${card.tagTone}`"
                  >{{ card.tag }}</span
                >
              </div>
              <p class="sn-docpage__vcard-copy">{{ card.copy }}</p>
              <div class="sn-docpage__vcard-stage">
                <SnButton
                  v-for="(demo, i) in card.demos"
                  :key="i"
                  v-bind="demoBind(demo)"
                  @click.stop
                >
                  {{ demo.label }}
                </SnButton>
              </div>
            </div>
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
              <h2>案例 Demos</h2>
            </div>
            <span class="sn-docpage__sec-aside">实时渲染 · 来自组件文档案例</span>
          </div>
           <!-- demo 两列瀑布：自管双列（每列独立 flex），卡片展开自然推挤
                本列后续项，无空高度。不用 slot 传递（编译插槽稳定化会跳过
                子组件更新导致预览/源码切换失效，见 SnWaterfall 签名修复）。 -->
           <div class="sn-docpage__demo-fall">
            <div
              v-for="(column, ci) in demoColumns"
              :key="'col' + ci"
              class="sn-docpage__demo-col"
            >
              <div v-for="d in column" :key="d.name" class="sn-docpage__demo">
                <div class="sn-docpage__demo-head">
                  <div class="sn-docpage__demo-meta">
                    <h3>{{ d.title }}</h3>
                    <p>{{ d.blurb }}</p>
                  </div>
                  <div class="sn-docpage__demo-switch" role="tablist" aria-label="预览 / 源码">
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
                      aria-label="预览"
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
                      aria-label="源码"
                      @click="setDemoMode(d.name, 'code')"
                    >
                      <SnIcon :icon="Code2" :size="13" />
                    </button>
                  </div>
                </div>
                <div v-if="demoMode(d.name) === 'preview'" class="sn-docpage__demo-stage">
                  <component :is="demoComponents[d.name]" />
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
                      {{ copiedKey === 'demo-' + d.name ? '已复制' : '复制' }}
                    </button>
                  </div>
                  <pre class="sn-code sn-docpage__demo-code" v-html="demoSectionHtml(d.name)" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Token 映射 -->
        <section id="tokens" class="sn-docpage__section">
          <div class="sn-docpage__sec-head">
            <div class="sn-docpage__sec-title">
              <SnIcon
                class="sn-docpage__sec-icon sn-docpage__sec-icon--tokens"
                :icon="Layers"
                :size="15"
              />
              <h2>Token 规范与多端映射 Design Tokens</h2>
            </div>
            <span class="sn-docpage__sec-aside">{{ doc.tokens.note }}</span>
          </div>
          <p class="sn-docpage__hint">
            <template v-for="(seg, i) in segs(doc.tokens.hint)" :key="i">
              <code v-if="seg.t === 'code'" class="sn-docpage__ic">{{ seg.s }}</code>
              <template v-else>{{ seg.s }}</template>
            </template>
          </p>
          <div class="sn-docpage__tablecard">
            <div class="sn-docpage__table-scroll">
              <table class="sn-docpage__table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>原始级联（@snui/tokens）</th>
                    <th>品牌别名（组件消费）</th>
                    <th>浅色基准值</th>
                    <th class="sn-docpage__th-right">预览</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in doc.tokens.rows" :key="row.name">
                    <td class="sn-docpage__td-name">{{ row.name }}</td>
                    <td class="sn-docpage__td-var">{{ row.raw }}</td>
                    <td class="sn-docpage__td-var">{{ row.alias }}</td>
                    <td class="sn-docpage__td-value">{{ row.value }}</td>
                    <td class="sn-docpage__td-preview">
                      <span
                        v-if="row.swatch"
                        class="sn-docpage__swatch"
                        :style="{ background: row.swatch }"
                      />
                      <span
                        v-else-if="row.kind === 'curve'"
                        class="sn-docpage__swatch-curve"
                        :style="{ borderRadius: row.value }"
                      />
                      <span
                        v-else-if="row.kind === 'blur'"
                        class="sn-docpage__swatch swatch-soft"
                      />
                      <span v-else class="sn-docpage__swatch sn-docpage__swatch--empty" />
                    </td>
                  </tr>
                </tbody>
              </table>
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
              <h2>API 属性参考 Props Reference</h2>
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
                    <th>属性 Prop</th>
                    <th>类型 Type</th>
                    <th>默认值</th>
                    <th>说明 Description</th>
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
              <h2>AI 原生集成 AI-Native Integration</h2>
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
                  :aria-label="'复制 ' + doc.ai.chip"
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
            <span class="sn-docpage__page-label">上一篇 Previous</span>
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
            <span class="sn-docpage__page-label">下一篇 Next</span>
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
          <div class="sn-docpage__railhead">本页目录 · On this page</div>
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
            <span>此文档对您是否有帮助？</span>
            <div class="sn-docpage__fb-row">
              <button
                type="button"
                class="sn-docpage__fb-btn"
                :class="{ 'sn-docpage__fb-btn--on': feedback === 'up' }"
                @click="feedback = 'up'"
              >
                有用
              </button>
              <button
                type="button"
                class="sn-docpage__fb-btn sn-docpage__fb-btn--down"
                :class="{ 'sn-docpage__fb-btn--on': feedback === 'down' }"
                @click="feedback = 'down'"
              >
                待优化
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
  /* 清爽风：无边线，圆角 + 极浅阴影承托层次 */
  --sn-doc-shadow: 0 2px 12px rgb(15 23 42 / 0.05), 0 1px 3px rgb(15 23 42 / 0.04);
  --sn-doc-shadow-hover: 0 10px 28px -6px rgb(15 23 42 / 0.1), 0 2px 6px rgb(15 23 42 / 0.05);
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

.sn-docpage__layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
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
.sn-docpage__head {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  font-weight: 700;
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
  font-weight: 700;
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
.sn-docpage__stage-center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.sn-docpage__toast {
  padding: 4px 12px;
  border: 1px solid var(--sn-doc-border);
  border-radius: 999px;
  background: var(--sn-doc-card);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11.5px;
  color: var(--sn-doc-text-3);
  opacity: 0.6;
  transition:
    opacity 0.25s,
    color 0.2s,
    border-color 0.2s;
}
.sn-docpage__toast--on {
  opacity: 1;
  border-color: color-mix(in srgb, var(--sn-doc-accent) 45%, var(--sn-doc-border));
  color: var(--sn-doc-accent);
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

/* ═══ demo 案例瀑布流（预览/源码切换） ═══ */
/* demo 两列瀑布：自管双列 flex —— 每列独立堆叠，卡片展开自然推挤
 * 本列后续项（无空高度）；<1200px 单列。 */
.sn-docpage__demo-fall {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.sn-docpage__demo-col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
@media (max-width: 1199px) {
  .sn-docpage__demo-fall {
    flex-direction: column;
  }
}
.sn-docpage__demo {
  overflow: hidden;
  border-radius: 16px;
  background: var(--sn-doc-card);
  box-shadow: var(--sn-doc-shadow);
}
.sn-docpage__demo-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 0;
}
.sn-docpage__demo-meta h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 650;
  color: var(--sn-doc-text-1);
}
 .sn-docpage__demo-meta p {
   margin: 3px 0 0;
   font-size: 12.5px;
   line-height: 1.6;
   color: var(--sn-doc-text-3);
 }
 
 /* 预览 / 源码切换胶囊（图标，参照 heroui 的 eye/code 双态）。
  * 滑块是唯一的运动物：cubic-bezier(0.34, 1.56, 0.64, 1) 的 back-out
  * 曲线让它带一次可见回弹（过冲约 10% 后落位）——与侧栏端切换胶囊
  * 同一套「确认感」语言。 */
 .sn-docpage__demo-switch {
   position: relative;
   display: inline-flex;
   flex: none;
   padding: 3px;
   border-radius: 999px;
   background: var(--sn-doc-card-soft);
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
  margin: 12px 16px 16px;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: color-mix(in srgb, var(--sn-doc-card-soft) 60%, transparent);
}
.sn-docpage__demo-codebody {
  background: var(--sn-doc-code-bg);
}
.sn-docpage__codebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
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
  font-weight: 650;
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
.sn-docpage__tablecard {
  overflow: hidden;
  border-radius: 14px;
  background: var(--sn-doc-card);
  box-shadow: var(--sn-doc-shadow);
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
  border-bottom: 1px solid var(--sn-doc-border);
  background: var(--sn-doc-card-soft);
  color: var(--sn-doc-text-2);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11.5px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}
.sn-docpage__table td {
  padding: 9px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--sn-doc-border) 55%, transparent);
  color: var(--sn-doc-text-2);
  vertical-align: top;
}
.sn-docpage__table tbody tr:last-child td {
  border-bottom: 0;
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
  font-weight: 700;
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
  /* demo 两列在窄屏强制单列（与 §demos 的 1199 断点双保险） */
  .sn-docpage__demo-fall {
    flex-direction: column;
  }
  .sn-docpage__demo-col {
    flex: 1 1 auto;
    width: 100%;
  }
  .sn-docpage__tab {
    padding: 4px 10px;
  }
  .sn-docpage__demo-head {
    padding: 12px 12px 0;
    gap: 8px;
  }
  .sn-docpage__demo-stage {
    margin: 10px 12px 12px;
    padding: 16px 10px;
  }
  .sn-docpage__demo-codebody .sn-docpage__codebar {
    padding: 8px 10px;
  }
  .sn-docpage__demo-code {
    font-size: 12px;
  }
}
</style>
