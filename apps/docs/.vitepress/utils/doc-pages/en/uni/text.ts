/** Text · uni-app x (Mobile) (uni-app x) — English page data. Props from sn-text.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const textDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Text · uni-app x (Mobile)' },
  ],
  title: 'Text · uni-app x (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Five semantic colours, bold, three decorations:' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-text',
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
    fileLabel: 'Text · uni-app x (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Text } from '@snui/uni';
</script>

<template>
  <sn-text />
</template>`,
  },
  demos: [
    {
      name: 'text-mp-basic',
      title: 'Basic usage',
      blurb:
        'Five types (default / primary / success / warning / error); bold; underline / line-through / overline decorations.',
    },
    {
      name: 'text-mp-mode',
      title: 'Mode transforms',
      blurb: 'phone / name masking, price grouping, date normalisation, call dialling.',
    },
    {
      name: 'text-mp-lines',
      title: 'Line clamping (`lines`)',
      blurb: 'lines=1/2/3 truncates the overflow with an ellipsis so cards keep the same height.',
    },
    {
      name: 'text-mp-typography',
      title: 'Typography overrides (`size` / `lineHeight` / `color`)',
      blurb: 'size sets the font size; line-height the leading; color the text colour.',
    },
    {
      name: 'text-mp-custom',
      title: 'Custom styles and slots',
      blurb:
        'customClass / customStyle on the root; the prefix / suffix / default slots render nodes rather than strings.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'default' | 'primary' | 'success' | 'warning' | 'error'",
        default: "'default'",
        desc: '主题类型：default / primary / success / warning / error。',
      },
      {
        name: 'text',
        type: 'string | number',
        default: "''",
        desc: '文本内容（`default` slot 优先）。',
      },
      {
        name: 'size',
        type: 'string',
        default: "''",
        desc: '字体大小（原样转发，可写 `28rpx` / `14px`）。',
      },
      {
        name: 'mode',
        type: 'TextMode',
        default: "'text'",
        desc: '文本处理模式：text / date / phone / name / price。',
      },
      {
        name: 'decoration',
        type: 'TextDecoration',
        default: "'none'",
        desc: '文本装饰：none / underline / line-through / overline。',
      },
      {
        name: 'call',
        type: 'boolean',
        default: 'false',
        desc: '`mode="phone"` 时点击文本是否拨号。',
      },
      { name: 'bold', type: 'boolean', default: 'false', desc: '是否粗体。' },
      {
        name: 'format',
        type: 'boolean',
        default: 'false',
        desc: '是否脱敏，仅在 `mode` 为 phone / name 时生效。',
      },
      { name: 'color', type: 'string', default: "''", desc: '文本颜色（内联覆盖 `type`）。' },
      { name: 'prefix', type: 'string', default: "''", desc: '前缀内容（`prefix` slot 优先）。' },
      { name: 'suffix', type: 'string', default: "''", desc: '后缀内容（`suffix` slot 优先）。' },
      { name: 'lines', type: 'number', default: '0', desc: '展示行数，超出后显示省略号。' },
      { name: 'lineHeight', type: 'string', default: "''", desc: '文本行高（原样转发）。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Text · uni-app x (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Text } from '@snui/uni';",
    chipCopy: "import { Text } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-text', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Icon', link: '/en/components/uni/icon' },
    next: { text: 'Layout', link: '/en/components/uni/layout' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
