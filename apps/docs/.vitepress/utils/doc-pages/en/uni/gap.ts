/** Gap · uni-app (Mobile) (uni-app) — English page data. Props from sn-gap.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const gapDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Gap · uni-app (Mobile)' },
  ],
  title: 'Gap · uni-app (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '14px by default; pass a number (px) or a string with a unit:' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-gap',
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
    fileLabel: 'Gap · uni-app (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Gap } from '@snui/uni';
</script>

<template>
  <sn-gap />
</template>`,
  },
  demos: [
    {
      name: 'gap-mp-basic',
      title: 'Basic usage',
      blurb: "Default 14px gap; height=24 numeric gap; height='20px' gap with a background.",
    },
    {
      name: 'gap-mp-safe-area',
      title: 'Bottom safe area',
      blurb:
        'safeAreaBottom reserves the gesture-bar inset at the bottom of a page so the last row is not covered.',
    },
    {
      name: 'gap-mp-custom',
      title: 'rpx heights and custom styles',
      blurb:
        'height=&quot;24rpx&quot; is forwarded verbatim while a number stays px; customClass / customStyle stack with bg-color.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'height',
        type: 'string | number',
        default: '14',
        desc: '间隔槽高度：数字按 px，字符串原样转发（如 `20rpx`）。',
      },
      {
        name: 'bgColor',
        type: 'string',
        default: "'transparent'",
        desc: '背景颜色（内联覆盖，默认透明）。',
      },
      {
        name: 'safeAreaBottom',
        type: 'boolean',
        default: 'false',
        desc: '是否开启底部安全区适配（叠加 `env(safe-area-inset-bottom)`）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Gap · uni-app (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Gap } from '@snui/uni';",
    chipCopy: "import { Gap } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-gap', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-divider', link: '/en/components/uni/divider' },
    next: { text: 'sn-tag', link: '/en/components/uni/tag' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
