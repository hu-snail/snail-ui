/** Dialer — Lucky Wheel (uni-app) — English page data. Props from sn-dialer.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dialerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Business Components' },
    { text: 'Dialer — Lucky Wheel' },
  ],
  title: 'Dialer — Lucky Wheel',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Tap the center GO to fire ' },
    { t: 'code', s: 'click' },
    { t: 'text', s: ' (request the result), then call ' },
    { t: 'code', s: 'run(index)' },
    { t: 'text', s: '; ' },
    { t: 'code', s: 'done(index)' },
    { t: 'text', s: ' fires when the wheel settles.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-dialer',
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
    fileLabel: 'Dialer — Lucky Wheel.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Dialer } from '@snui/uni';
</script>

<template>
  <sn-dialer />
</template>`,
  },
  demos: [
    {
      name: 'dialer-mp',
      title: 'Demos',
      blurb: '6-prize wheel, random target on GO, result shown on done.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'prizeList',
        type: 'SnDialerPrize[]',
        default: '() => []',
        desc: '奖品列表（2-12 项）。',
      },
      { name: 'turns', type: 'number', default: '5', desc: '旋转圈数。' },
      { name: 'duration', type: 'number', default: '3', desc: '旋转时长（秒）。' },
      {
        name: 'size',
        type: 'string',
        default: "'600rpx'",
        desc: '转盘直径（rpx / px 长度字符串）。',
      },
      {
        name: 'prizeBgColors',
        type: 'string[]',
        default: "() => ['#FFF0A3'",
        desc: '交替扇区背景色。',
      },
      { name: 'borderColor', type: 'string', default: "'#FFD752'", desc: '扇区描边色。' },
      { name: 'fontSize', type: 'string', default: "'24rpx'", desc: '奖品名字号。' },
      {
        name: 'color',
        type: 'string',
        default: "'var(--sn-mp-color-text-primary)'",
        desc: '奖品名颜色。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Dialer — Lucky Wheel ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Dialer } from '@snui/uni';",
    chipCopy: "import { Dialer } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-dialer', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-barcode', link: '/en/components/uni/barcode' },
    next: { text: 'sn-scratchcard', link: '/en/components/uni/scratchcard' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
