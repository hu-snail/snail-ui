/** Badge · uni-app x (Mobile) (uni-app x) — English page data. Props from sn-badge.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const badgeDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Badge · uni-app x (Mobile)' },
  ],
  title: 'Badge · uni-app x (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Numeric markers with the ' },
    { t: 'code', s: 'max' },
    { t: 'text', s: ' overflow cap:' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-badge',
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
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Badge · uni-app x (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Badge } from '@snui/uni';
</script>

<template>
  <sn-badge />
</template>`,
  },
  demos: [
    {
      name: 'badge-mp-basic',
      title: 'Basic usage',
      blurb: 'Numeric markers: plain value, max overflow shown as 99+, five semantic types.',
    },
    {
      name: 'badge-mp-dot',
      title: 'Dot badge (`is-dot`)',
      blurb: 'is-dot renders a small red dot instead of a count.',
    },
    {
      name: 'badge-mp-shape',
      title: 'Shape & border (`shape` / `border`)',
      blurb: 'shape circle / square / bubble; border adds a ring.',
    },
    {
      name: 'badge-mp-offset',
      title: 'Offset & color (`top` / `right` / `bgColor`)',
      blurb: 'top / right nudge the badge position; bgColor overrides the fill.',
    },
    {
      name: 'badge-mp-visibility',
      title: 'Visibility rules',
      blurb:
        'value=0 hidden by default; showZero reveals 0; hidden forces it off; the count updates live.',
    },
    {
      name: 'badge-mp-custom',
      title: 'Root class and inline style (`customClass` / `customStyle`)',
      blurb:
        "customClass puts a dashed frame on the wrapper; customStyle adds padding and fill; both together; a control showing the marker's own type / bgColor / offsets.",
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '显示值（数字或字符串）。数字超出 `max` 时显示 `{max}+`。',
      },
      {
        name: 'max',
        type: 'number | undefined',
        default: 'undefined',
        desc: '最大值，超过后显示 `{max}+`，仅当 `value` 为数字时生效。',
      },
      {
        name: 'top',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '为正时，角标向下偏移对应像素。',
      },
      {
        name: 'right',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '为正时，角标向左偏移对应像素。',
      },
      { name: 'isDot', type: 'boolean', default: 'false', desc: '红色点状标注（不显示数值）。' },
      { name: 'hidden', type: 'boolean', default: 'false', desc: '隐藏角标（内容照常渲染）。' },
      {
        name: 'type',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | undefined",
        default: 'undefined',
        desc: '类型：primary / success / warning / danger / info。 不设置时用危险色（红）—— 默认角标为红色。',
      },
      { name: 'bgColor', type: 'string', default: '—', desc: '背景色（内联覆盖 `type`）。' },
      {
        name: 'showZero',
        type: 'boolean',
        default: 'false',
        desc: '是否显示 `0`（默认 `0` 不渲染角标）。',
      },
      {
        name: 'shape',
        type: "'circle' | 'square' | 'bubble'",
        default: "'circle'",
        desc: '徽标形状：circle / square / bubble。',
      },
      {
        name: 'border',
        type: 'boolean',
        default: 'false',
        desc: '是否显示描边（与背景同宽的一道分隔环）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Badge · uni-app x (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Badge } from '@snui/uni';",
    chipCopy: "import { Badge } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-badge', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Tag', link: '/en/components/uni/tag' },
    next: { text: 'Avatar', link: '/en/components/uni/avatar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
