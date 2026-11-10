/** Divider (uni-app) — English page data. Props from sn-divider.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dividerDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Divider' }],
  title: 'Divider',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Conforms to easycom — **no import needed in templates**:' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-divider',
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
    fileLabel: 'Divider.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Divider } from '@snui/uni';
</script>

<template>
  <sn-divider />
</template>`,
  },
  demos: [
    {
      name: 'divider-mp',
      title: 'Live preview',
      blurb:
        'Comprehensive preview of all variants: horizontal / dashed / with text / marginSize / vertical.',
    },
    {
      name: 'divider-mp-content-position',
      title: 'Content position',
      blurb:
        'All three content-position steps — left / center / right — and how they stack with dashed / marginSize.',
    },
    {
      name: 'divider-mp-vertical',
      title: 'Vertical dividers and custom styles',
      blurb:
        'Both the vertical and direction spellings; dashed / color; customClass and customStyle overriding the default 1em height.',
    },
    {
      name: 'divider-mp-hairline',
      title: 'Hairline (`hairline`)',
      blurb:
        'hairline on / off side by side: horizontal, with text, vertical and a thin dashed line.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: 'Axis: horizontal (full-width line) or vertical (inline line).',
      },
      { name: 'dashed', type: 'boolean', default: 'false', desc: 'Dashed instead of solid.' },
      {
        name: 'hairline',
        type: 'boolean',
        default: 'true',
        desc: 'Hairline (0.5px-like thin line) — mobile common. Default true.',
      },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Optional color override (CSS color value).',
      },
      {
        name: 'marginSize',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Vertical margin (only for horizontal direction).',
      },
      {
        name: 'contentPosition',
        type: "'left' | 'center' | 'right'",
        default: "'center'",
        desc: 'Content position along the line (`wd-divider` `content-position`).',
      },
      {
        name: 'vertical',
        type: 'boolean',
        default: 'false',
        desc: "Vertical separator (`wd-divider` `vertical`). Equivalent to `direction: 'vertical'`; either one renders the vertical variant.",
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Extra class on the root node (`wd-divider` `custom-class`).',
      },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Extra inline style on the root node (`wd-divider` `custom-style`).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Divider ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Divider } from '@snui/uni';",
    chipCopy: "import { Divider } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-divider', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-root-portal', link: '/en/components/uni/root-portal' },
    next: { text: 'sn-gap', link: '/en/components/uni/gap' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
