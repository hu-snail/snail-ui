/**
 * Card 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const cardDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '布局组件 Layout' }, { text: 'Card' }],
  title: 'Card',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: '<div role="region">' },
    { t: 'text', s: ' 容器，按顺序区域承载 cover → header → content → footer → action。视觉走 ' },
    { t: 'code', s: '--sn-web-card-*' },
    { t: 'text', s: ' Token 别名层（padding / radius / shadow）。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/card',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Card.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Card } from '@snui/vue-web';
</script>

<template>
  <Card />
</template>`,
  },
  demos: [
    { name: 'card-web', title: '基本用法', blurb: '基本用法' },
    { name: 'card-web-cover', title: '封面', blurb: '封面' },
    { name: 'card-web-footer', title: '页脚', blurb: '页脚' },
    { name: 'card-web-closable', title: '可关闭与拦截', blurb: '可关闭与拦截' },
    { name: 'card-web-hoverable', title: '悬浮反馈', blurb: '悬浮反馈' },
    { name: 'card-web-sizes', title: '尺寸', blurb: '尺寸' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string | (() => unknown)',
        default: '—',
        desc: '标题文本或渲染函数；未提供 header 插槽时渲染在头部。',
      },
      { name: 'contentClass', type: 'string', default: '—', desc: '内容区 class 名' },
      { name: 'contentStyle', type: 'string | Record<string, string>', default: '—', desc: '标准' },
      {
        name: 'contentScrollable',
        type: 'boolean',
        default: '—',
        desc: '内容区超长时可滚动（max-height + overflow:auto）',
      },
      { name: 'headerClass', type: 'string', default: '—', desc: '头部 class 名' },
      { name: 'headerStyle', type: 'string | Record<string, string>', default: '—', desc: '标准' },
      { name: 'headerExtraClass', type: 'string', default: '—', desc: '头部右侧区域 class 名' },
      {
        name: 'headerExtraStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: '标准',
      },
      { name: 'footerClass', type: 'string', default: '—', desc: '底部 class 名' },
      { name: 'footerStyle', type: 'string | Record<string, string>', default: '—', desc: '标准' },
      { name: 'embedded', type: 'boolean', default: '—', desc: '嵌套卡片模式（去边框 + 阴影）' },
      {
        name: 'segmented',
        type: "| boolean | { content?: boolean | 'soft'; footer?: boolean | 'soft'; action?: boolean | 'soft' }",
        default: '—',
        desc: "区域之间的分隔线；支持 `true` 或 `{ content?, footer?, action? }`，各项为 `true | 'soft'`。",
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large' | 'huge'",
        default: '—',
        desc: 'Card size preset. Drives padding + font-size.',
      },
      { name: 'bordered', type: 'boolean', default: '—', desc: '是否显示外边框' },
      {
        name: 'closable',
        type: 'boolean',
        default: '—',
        desc: '头部显示关闭按钮（需 `onClose` 才有作用）',
      },
      { name: 'hoverable', type: 'boolean', default: '—', desc: 'hover 时显示上浮视觉效果' },
      {
        name: 'role',
        type: 'string',
        default: '—',
        desc: "Accessible role attribute. Default 'region'.",
      },
      {
        name: 'tag',
        type: 'keyof HTMLElementTagNameMap',
        default: '—',
        desc: "Root tag. Default 'div'.",
      },
      {
        name: 'cover',
        type: '() => unknown',
        default: '—',
        desc: '封面区域的渲染函数（位于头部之上）。',
      },
      {
        name: 'content',
        type: 'string | (() => unknown)',
        default: '—',
        desc: '内容文本或渲染函数；未提供默认插槽时渲染在主体。',
      },
      { name: 'footer', type: '() => unknown', default: '—', desc: '底部区域的渲染函数。' },
      {
        name: 'action',
        type: '() => unknown',
        default: '—',
        desc: '操作区域的渲染函数（位于底部之下）。',
      },
      {
        name: 'headerExtra',
        type: '() => unknown',
        default: '—',
        desc: '头部右侧附加区域的渲染函数。',
      },
      { name: 'closeFocusable', type: 'boolean', default: '—', desc: '关闭按钮是否可键盘聚焦' },
      {
        name: 'variant',
        type: "'default' | 'outlined' | 'elevated'",
        default: '—',
        desc: "Web-only convenience alias: visual variant. Maps to (bordered, |) combinations. 'default' → bordered true + shadow false. 'outlined' → bordered true + shadow false (alias of default; kept for nav parity with prior docs). 'elevated' → bordered false + shadow true.",
      },
      {
        name: 'padding',
        type: "'none' | 'sm' | 'md' | 'lg'",
        default: '—',
        desc: 'Web-only convenience alias: padding sub-axis. Maps to `size`.',
      },
      {
        name: 'shadow',
        type: 'boolean',
        default: '—',
        desc: '是否显示阴影（消费 `--sn-web-card-shadow`）',
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: '转发到根节点 `aria-label`' },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnCard.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      { name: 'close', payload: '—', desc: '点击关闭按钮时触发（仅当 `closable` 为 true）。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnCard.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '卡片主体内容，渲染在头部与底部之间。' },
      { name: 'cover', props: '—', desc: '封面区域，位于头部之上。' },
      { name: 'header', props: '—', desc: '头部区域，会覆盖 `title` 属性。' },
      { name: 'header-extra', props: '—', desc: '头部右侧的附加区域。' },
      { name: 'footer', props: '—', desc: '底部区域。' },
      { name: 'action', props: '—', desc: '操作区域，位于底部之下。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Card 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Card } from '@snui/vue-web';",
    chipCopy: "import { Card } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Card', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'drag-sort', link: '/components/web/drag-sort' },
    next: { text: 'grid', link: '/components/web/grid' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
