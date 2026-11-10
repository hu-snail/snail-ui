/** Collapse · uni-app (uni-app) — English page data. Props from sn-collapse.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const collapseDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Collapse · uni-app' },
  ],
  title: 'Collapse · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'In normal mode ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' is a ' },
    { t: 'code', s: 'string[]' },
    { t: 'text', s: ', so several panels can be open at once:' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-collapse',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Collapse · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Collapse } from '@snui/uni';
</script>

<template>
  <sn-collapse />
</template>`,
  },
  demos: [
    {
      name: 'collapse-mp-basic',
      title: 'Basic usage',
      blurb: 'v-model binds the open-name array; multiple panels can stay open together.',
    },
    {
      name: 'collapse-mp-accordion',
      title: 'Accordion mode (`accordion`)',
      blurb: 'accordion makes v-model a string and keeps one panel open at a time.',
    },
    {
      name: 'collapse-mp-disabled',
      title: 'Disabled panel (`disabled`)',
      blurb: 'A disabled item keeps the neutral colour and ignores taps.',
    },
    {
      name: 'collapse-mp-viewmore',
      title: 'View-more mode',
      blurb:
        'viewmore makes v-model a boolean; line-num sets the collapsed line count; a toggle button renders at the bottom.',
    },
    {
      name: 'collapse-mp-card',
      title: 'Card form',
      blurb:
        'collapse card gives every panel its own card with a configurable title icon; a single panel can be a card on its own.',
    },
    {
      name: 'collapse-mp-icon',
      title: 'Title icon and icon size',
      blurb:
        'Three title-icon sources: a built-in set object, an image URL and the name chain; iconSize tiers tiny/small/medium/large plus a custom length; iconColor takes a colour token.',
    },
    {
      name: 'collapse-mp-more-slot',
      title: 'The `more` slot',
      blurb: 'The #more slot customises the viewmore footer; custom-more-slot-class appends a class.',
    },
    {
      name: 'collapse-mp-before-expend',
      title: 'Expand guard (`before-expend`)',
      blurb: 'before-expend blocks the first two expands by returning false.',
    },
    {
      name: 'collapse-mp-title-slot',
      title: '`title` slot & content styling',
      blurb:
        '#title replaces the heading; custom-body-class targets the content; item border=false drops the rule.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnCollapseModelValue',
        default: '() => [] as string[]',
        desc: '绑定值；普通模式为 string[]，手风琴模式为 string，查看更多模式为 boolean。',
      },
      {
        name: 'accordion',
        type: 'boolean',
        default: 'false',
        desc: '是否开启手风琴模式（同时只开一项）。',
      },
      {
        name: 'viewmore',
        type: 'boolean',
        default: 'false',
        desc: '是否开启查看更多模式（单个内容块 + 收起行数）。',
      },
      {
        name: 'useMoreSlot',
        type: 'boolean',
        default: 'false',
        desc: '查看更多模式下是否启用 more 插槽。',
      },
      { name: 'lineNum', type: 'number', default: '2', desc: '查看更多模式下收起显示行数。' },
      {
        name: 'customMoreSlotClass',
        type: 'string',
        default: "''",
        desc: '查看更多模式下 more 插槽外部自定义类名。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      {
        name: 'card',
        type: 'boolean',
        default: 'false',
        desc: '卡片形态：每个面板渲染为独立圆角卡片，容器透明并以 token 间距分行。',
      },
      {
        name: 'iconSize',
        type: 'string | number | undefined',
        default: '—',
        desc: '图标尺寸（面板箭头与标题图标共享）：数字按 px，档位名映射 `--sn-mp-icon-size-*`，其它字符串透传。',
      },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: '图标颜色（面板箭头与标题图标共享）：传 `var(--sn-mp-color-*)` token；面板自身设置优先。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Collapse · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Collapse } from '@snui/uni';",
    chipCopy: "import { Collapse } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-collapse', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-steps', link: '/en/components/uni/steps' },
    next: { text: 'sn-sticky', link: '/en/components/uni/sticky' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
