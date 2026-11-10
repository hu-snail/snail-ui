/** Typing (uni-app) — English page data. Props from sn-typing.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const typingDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Business Components' }, { text: 'Typing' }],
  title: 'Typing',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Defaults to the "输入中" label plus 3 dots; the label can be emptied, and color / count / speed are adjustable.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-typing',
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
    fileLabel: 'Typing.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Typing } from '@snui/uni';
</script>

<template>
  <sn-typing />
</template>`,
  },
  demos: [
    {
      name: 'typing-mp',
      title: 'Demos',
      blurb: 'Default / custom label and dot color / bubble scenario.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'text',
        type: 'string',
        default: "'输入中'",
        desc: '随圆点一起展示的文案（空字符串则只显示圆点）。',
      },
      { name: 'dotCount', type: 'number', default: '3', desc: '圆点数量。' },
      { name: 'speed', type: 'number', default: '350', desc: '单个圆点脉动周期（ms）。' },
      {
        name: 'activeDotColor',
        type: 'string',
        default: "'var(--sn-mp-color-action-primary)'",
        desc: '圆点颜色（非激活观感由低透明度表达）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Typing ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Typing } from '@snui/uni';",
    chipCopy: "import { Typing } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-typing', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-lucky', link: '/en/components/uni/lucky' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
