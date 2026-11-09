/** Resize · uni-app (Mobile) (uni-app) — English page data. Props from sn-resize.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const resizeDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Resize · uni-app (Mobile)' },
  ],
  title: 'Resize · uni-app (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A host usually needs to recompute layout after its content grows (a longer list, a wrapped title). ',
    },
    { t: 'code', s: 'sn-resize' },
    { t: 'text', s: ' reports the box on the first measurement and on every change.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-resize',
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
    fileLabel: 'Resize · uni-app (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Resize } from '@snui/uni';
</script>

<template>
  <sn-resize />
</template>`,
  },
  demos: [
    { name: 'resize-mp-basic', title: 'Basic', blurb: 'Adding a row updates the measured box.' },
    {
      name: 'resize-mp-custom',
      title: 'Custom classes and the measured boundary',
      blurb:
        'customClass / customStyle draw the outer wrapper boundary; customContainerClass draws the measured inner node.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      {
        name: 'customContainerClass',
        type: 'string',
        default: "''",
        desc: '内层容器自定义类名（实际被测量的节点）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Resize · uni-app (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Resize } from '@snui/uni';",
    chipCopy: "import { Resize } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-resize', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-transition', link: '/en/components/uni/transition' },
    next: { text: 'sn-config-provider', link: '/en/components/uni/config-provider' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
