/** Timeline · Web (Web) — English page data. Props from timeline SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const timelineDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Timeline · Web' },
  ],
  title: 'Timeline · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Event rail: node dots + connecting lines, each item with title, content, time and',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/timeline',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Timeline · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Timeline } from '@snui/vue-web';
</script>

<template>
  <Timeline />
</template>`,
  },
  demos: [
    { name: 'timeline-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'timeline-web-size', title: 'Size', blurb: 'Size' },
    { name: 'timeline-web-customize-dot', title: 'Custom node', blurb: 'Custom node' },
    { name: 'timeline-web-customize-line', title: 'Custom line style', blurb: 'Custom line style' },
    { name: 'timeline-web-item-placement', title: 'Item placement', blurb: 'Item placement' },
    { name: 'timeline-web-mode', title: 'Display modes', blurb: 'Display modes' },
    {
      name: 'timeline-web-label',
      title: 'Vertical timeline with labels',
      blurb: 'Vertical timeline with labels',
    },
    { name: 'timeline-web-horizontal', title: 'Horizontal timeline', blurb: 'Horizontal timeline' },
    { name: 'timeline-web-label-position', title: 'Label position', blurb: 'Label position' },
    { name: 'timeline-web-customize-icon', title: 'Custom icon', blurb: 'Custom icon' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: "'vertical' | 'horizontal'",
        default: '—',
        desc: 'Layout axis. Wins over the legacy `horizontal` flag when set.',
      },
      {
        name: 'mode',
        type: "'left' | 'right' | 'top' | 'bottom' | 'alternate'",
        default: '—',
        desc: 'Which side the rail (the axis) sits on — the content takes the opposite side — or `alternate` to flip per item (an item `position` overrides its parity). Vertical reads left / right, horizontal reads top / bottom; off-axis values are normalized. Wins over the legacy `item-placement`.',
      },
      {
        name: 'labelPosition',
        type: "'same' | 'relative'",
        default: "'relative'",
        desc: 'Where item labels render: across the axis from the content (`relative`, default) or on the content side next to the rail (`same`).',
      },
      {
        name: 'horizontal',
        type: 'boolean',
        default: 'false',
        desc: 'Legacy flag: lay the items out horizontally (`direction="horizontal"` preferred).',
      },
      {
        name: 'itemPlacement',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Legacy: which side the rail sits on (vertical mode only). `mode` preferred.',
      },
      {
        name: 'size',
        type: "'medium' | 'large'",
        default: "'medium'",
        desc: 'Title scale of the items.',
      },
      { name: 'iconSize', type: 'number', default: '—', desc: 'Node/icon edge length in px.' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnTimeline.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'default', props: '—', desc: '`<SnTimelineItem>` entries (direct children).' }],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Timeline · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Timeline } from '@snui/vue-web';",
    chipCopy: "import { Timeline } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Timeline', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'time', link: '/en/components/web/time' },
    next: { text: 'tree', link: '/en/components/web/tree' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
