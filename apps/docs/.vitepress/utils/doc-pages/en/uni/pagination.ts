/** Pagination · uni-app (uni-app) — English page data. Props from sn-pagination.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const paginationDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Pagination · uni-app' },
  ],
  title: 'Pagination · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'The component follows the easycom convention, so **no import is needed in a template**:',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-pagination',
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
    fileLabel: 'Pagination · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Pagination } from '@snui/uni';
</script>

<template>
  <sn-pagination />
</template>`,
  },
  demos: [
    {
      name: 'pagination-mp-basic',
      title: 'Basic usage',
      blurb:
        'v-model binds the page; total-page sets the count; show-message renders the current / total counter.',
    },
    {
      name: 'pagination-mp-variant',
      title: 'Button variants and total-derived pages',
      blurb:
        'total=95 with page-size=10 gives 10 pages; button-variant=base adds a border and the step icons; dashed draws a dashed border.',
    },
    {
      name: 'pagination-mp-disabled',
      title: 'Disabled state',
      blurb:
        'disabled freezes the whole control; the stepper buttons boundary-disable at the first / last page and the arrow dims with the label.',
    },
    {
      name: 'pagination-mp-simple',
      title: 'Simple mode',
      blurb: 'simple mode: prev / counter / next, shown with and without the counter text.',
    },
    {
      name: 'pagination-mp-slots',
      title: 'Single-page hiding and custom slots',
      blurb: 'hide-if-one-page skips rendering; all four slots customised.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'number', default: '1', desc: '当前页码。' },
      {
        name: 'totalPage',
        type: 'number',
        default: '1',
        desc: '总页数；传入 total 时优先根据 total 与 pageSize 计算。',
      },
      { name: 'total', type: 'number', default: '0', desc: '总数据条数。' },
      { name: 'pageSize', type: 'number', default: '10', desc: '每页条数。' },
      {
        name: 'prevText',
        type: 'string',
        default: "''",
        desc: '上一页按钮文字；未设置时使用内置文案。',
      },
      {
        name: 'nextText',
        type: 'string',
        default: "''",
        desc: '下一页按钮文字；未设置时使用内置文案。',
      },
      { name: 'showIcon', type: 'boolean', default: 'false', desc: '是否展示翻页图标。' },
      { name: 'showMessage', type: 'boolean', default: 'false', desc: '是否展示文字提示。' },
      {
        name: 'buttonVariant',
        type: "'base' | 'plain' | 'dashed' | 'text'",
        default: "'text'",
        desc: '分页按钮风格：base / plain / dashed / text。',
      },
      {
        name: 'hideIfOnePage',
        type: 'boolean',
        default: 'false',
        desc: '总页数只有一页时是否隐藏。',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否整体禁用。' },
      {
        name: 'simple',
        type: 'boolean',
        default: 'false',
        desc: '简单模式：只展示 prev / 当前页 / next，不渲染页码条。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Pagination · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Pagination } from '@snui/uni';",
    chipCopy: "import { Pagination } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-pagination', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-sidebar', link: '/en/components/uni/sidebar' },
    next: { text: 'sn-index-bar', link: '/en/components/uni/index-bar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
