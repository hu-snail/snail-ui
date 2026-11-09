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
    { name: 'card-web-cover', title: '实时预览', blurb: '实时预览' },
    { name: 'card-web-footer', title: '实时预览', blurb: '实时预览' },
    { name: 'card-web-closable', title: '实时预览', blurb: '实时预览' },
    { name: 'card-web-hoverable', title: '实时预览', blurb: '实时预览' },
    { name: 'card-web-sizes', title: '实时预览', blurb: '实时预览' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'contentClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the content (body) region.',
      },
      {
        name: 'contentStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to the content (body) region.',
      },
      {
        name: 'contentScrollable',
        type: 'boolean',
        default: '—',
        desc: 'Make content region scrollable when overflowing. Naive UI wires this to NScrollbar; we render a max-height + overflow:auto shell that approximates that behavior without pulling in the full virtualized scrollbar.',
      },
      {
        name: 'headerClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the header region.',
      },
      {
        name: 'headerStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to the header region.',
      },
      {
        name: 'headerExtraClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the header-extra region.',
      },
      {
        name: 'headerExtraStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to the header-extra region.',
      },
      {
        name: 'footerClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the footer region.',
      },
      {
        name: 'footerStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to the footer region.',
      },
      {
        name: 'embedded',
        type: 'boolean',
        default: '—',
        desc: 'Embedded variant — strips outer border + shadow for nested cards.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large' | 'huge'",
        default: '—',
        desc: 'Card size preset. Drives padding + font-size.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: '—',
        desc: 'Show 1px outer border. Default true.',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: '—',
        desc: 'Show close button in header. Requires `onClose` to do anything.',
      },
      { name: 'hoverable', type: 'boolean', default: '—', desc: 'Apply hover-lift visual cue.' },
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
        name: 'closeFocusable',
        type: 'boolean',
        default: '—',
        desc: 'Close button focusable (keyboard tab). Default true.',
      },
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
        desc: 'Web-only convenience alias: show shadow.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: '—',
        desc: 'Native ARIA label. Forwarded to the root element when provided.',
      },
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
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
