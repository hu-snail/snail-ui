/**
 * FloatButton 浮动按钮 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const floatButtonDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'FloatButton 浮动按钮' },
  ],
  title: 'FloatButton 浮动按钮',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnFloatButton' },
    { t: 'text', s: ' 是固定在视口某一角的悬浮操作按钮，' },
    { t: 'code', s: 'SnFloatButtonGroup' },
    { t: 'text', s: ' 把多个' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/float-button',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'FloatButton 浮动按钮.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { FloatButton } from '@snui/vue-web';
</script>

<template>
  <FloatButton />
</template>`,
  },
  demos: [
    { name: 'float-button-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'float-button-web-placement', title: '八个方位', blurb: '八个方位' },
    { name: 'float-button-web-group', title: '按钮组', blurb: '按钮组' },
    { name: 'float-button-web-direction', title: '展开方向', blurb: '展开方向' },
    { name: 'float-button-web-badge-link', title: '徽标与链接', blurb: '徽标与链接' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: 'SnFloatButtonType',
        default: "'default'",
        desc: "Filled color: surface background (`'default'`) or brand fill (`'primary'`).",
      },
      {
        name: 'shape',
        type: 'SnFloatButtonShape',
        default: "'circle'",
        desc: "`'circle'` (default) or `'square'` — square stacks the icon above a `description` line.",
      },
      {
        name: 'icon',
        type: 'IconComponent | undefined',
        default: '—',
        desc: 'Lucide-style icon component; the `icon` slot overrides it.',
      },
      {
        name: 'iconSize',
        type: 'number | string',
        default: '18',
        desc: 'Pixel / CSS size forwarded to the embedded SnIcon.',
      },
      {
        name: 'description',
        type: 'string',
        default: '—',
        desc: 'Text under the icon. Rendered for `shape="square"` only; the `description` slot overrides it.',
      },
      {
        name: 'tooltip',
        type: 'string | undefined',
        default: '—',
        desc: 'Sets the native `title` and the accessible name on the root. No tooltip component is used. The explicit `| undefined` is required by `exactOptionalPropertyTypes` for props forwarded into the template.',
      },
      {
        name: 'badge',
        type: 'number | string',
        default: '—',
        desc: "Count bubble; hidden when `undefined`, `0` or `''`.",
      },
      {
        name: 'badgeDot',
        type: 'boolean',
        default: 'false',
        desc: 'Render a dot instead of the count (used when there is no number to show).',
      },
      {
        name: 'href',
        type: 'string',
        default: '—',
        desc: 'When set, the root renders `<a href>` instead of `<button type="button">`.',
      },
      {
        name: 'target',
        type: "'_blank' | '_self' | '_parent' | '_top'",
        default: '—',
        desc: 'Native link target. Only meaningful together with `href`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disabled state — no `click` event, `aria-disabled` on the root.',
      },
      { name: 'visible', type: 'boolean', default: 'true', desc: '是否渲染整个按钮（`v-if`）。' },
      {
        name: 'placement',
        type: 'SnFloatButtonPlacement',
        default: "'bottom-right'",
        desc: 'Fixed corner. Ignored inside `<SnFloatButtonGroup>` — the group positions its children.',
      },
      {
        name: 'right',
        type: 'number | string',
        default: '—',
        desc: 'Explicit distance from the viewport right edge; overrides `placement`.',
      },
      {
        name: 'bottom',
        type: 'number | string',
        default: '—',
        desc: 'Explicit distance from the viewport bottom edge; overrides `placement`.',
      },
      {
        name: 'top',
        type: 'number | string',
        default: '—',
        desc: 'Explicit distance from the viewport top edge; overrides `placement`.',
      },
      {
        name: 'left',
        type: 'number | string',
        default: '—',
        desc: 'Explicit distance from the viewport left edge; overrides `placement`.',
      },
      {
        name: 'zIndex',
        type: 'number',
        default: '1000',
        desc: 'Stacking order of the fixed root. Ignored inside a group.',
      },
      {
        name: 'fixed',
        type: 'boolean',
        default: 'true',
        desc: '`false` pins the button to its nearest positioned ancestor instead of the viewport — drop it into a `position: relative` hero/section (or set `container`) when the button belongs to that block, not to the page.',
      },
      {
        name: 'container',
        type: 'string | HTMLElement | undefined',
        default: 'undefined',
        desc: 'Explicit positioning context (selector or element) for `fixed: false`. When omitted the root only switches to `position: absolute`, so the offset resolves against the nearest positioned ancestor.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'FloatButton 浮动按钮 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { FloatButton } from '@snui/vue-web';",
    chipCopy: "import { FloatButton } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'FloatButton', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'floating-toc', link: '/components/web/floating-toc' },
    next: { text: 'pagination', link: '/components/web/pagination' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
