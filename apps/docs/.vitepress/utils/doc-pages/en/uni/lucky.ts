/** Lucky Grid (uni-app x) — English page data. Props from sn-lucky.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const luckyDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Business Components' }, { text: 'Lucky Grid' }],
  title: 'Lucky Grid',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Tap the center button to start; request the result after ' },
    { t: 'code', s: 'start' },
    { t: 'text', s: ', then call ' },
    { t: 'code', s: 'stop(index)' },
    { t: 'text', s: '; ' },
    { t: 'code', s: 'end(index)' },
    {
      t: 'text',
      s: ' fires on settle. Prizes run clockwise along the perimeter with the button in the middle.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-lucky',
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
    fileLabel: 'Lucky Grid.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Lucky } from '@snui/uni';
</script>

<template>
  <sn-lucky />
</template>`,
  },
  demos: [
    {
      name: 'lucky-mp-basic',
      title: 'Basic usage',
      blurb: '3×3 grid with the play/stop two-phase animation.',
    },
    {
      name: 'lucky-mp-states',
      title: 'State & events',
      blurb: 'start / end event log + manual play()/stop(index); re-entrant calls ignored.',
    },
    {
      name: 'lucky-mp-grid',
      title: 'Grid size',
      blurb: '3×3 / 4×4; perimeter cells = 2(rows+cols) - 4.',
    },
    {
      name: 'lucky-mp-cell',
      title: 'Cell gap & height',
      blurb: 'gutter="16rpx" + cell-height="150rpx".',
    },
    {
      name: 'lucky-mp-speed',
      title: 'Speed & highlight',
      blurb: 'speed is the highlight step interval; prize color overrides the highlight.',
    },
    {
      name: 'lucky-mp-button-slot',
      title: 'Custom button',
      blurb: 'The #button slot scope provides isPlaying.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'rows', type: 'number', default: '3', desc: '行数（≥3）。' },
      { name: 'cols', type: 'number', default: '3', desc: '列数（≥3）。' },
      {
        name: 'prizes',
        type: 'SnLuckyPrize[]',
        default: '() => []',
        desc: '奖品列表（沿周长顺序排列，不足的格子显示占位）。',
      },
      { name: 'gutter', type: 'string', default: "'8rpx'", desc: '格子间距。' },
      { name: 'cellHeight', type: 'string', default: "'120rpx'", desc: '格子高度。' },
      { name: 'speed', type: 'number', default: '60', desc: '循环高亮步进间隔（ms）。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Lucky Grid ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Lucky } from '@snui/uni';",
    chipCopy: "import { Lucky } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-lucky', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Scratchcard', link: '/en/components/uni/scratchcard' },
    next: { text: 'Typing', link: '/en/components/uni/typing' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
