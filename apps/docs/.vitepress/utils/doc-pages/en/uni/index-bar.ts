/** IndexBar · uni-app x (uni-app x) — English page data. Props from sn-index-bar.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const indexBarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'IndexBar · uni-app x' },
  ],
  title: 'IndexBar · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Each ' },
    { t: 'code', s: 'sn-index-anchor' },
    { t: 'text', s: "'s " },
    { t: 'code', s: 'index' },
    {
      t: 'text',
      s: " becomes both the sidebar entry and that group's heading; tapping an entry jumps to the group:",
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-index-bar',
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
    fileLabel: 'IndexBar · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { IndexBar } from '@snui/uni';
</script>

<template>
  <sn-index-bar />
</template>`,
  },
  demos: [
    {
      name: 'index-bar-mp-basic',
      title: 'Basic usage',
      blurb:
        'The anchor index generates the sidebar entry; tapping it jumps to the group; sticky pins the bar.',
    },
    {
      name: 'index-bar-mp-custom',
      title: 'Custom content and the change event',
      blurb:
        'Group content is custom; change reports the active index; without sticky the bar scrolls with the list.',
    },
    {
      name: 'index-bar-mp-scrollto',
      title: 'The scrollTo method and custom styling',
      blurb: 'scrollTo(index) jumps to a group from code; custom-class / custom-style on the root.',
    },
    {
      name: 'index-bar-mp-contacts',
      title: 'Full-page contacts directory',
      blurb:
        'Full-page contacts: the compact preview is interactive (search filter); tap Full page for the fullscreen screen (Navbar + search + index bar + count bar); tap a contact for the profile page.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'sticky', type: 'boolean', default: 'false', desc: '索引是否吸顶。' },
      {
        name: 'showIndicator',
        type: 'boolean',
        default: 'false',
        desc: '是否在列表视口中央显示当前索引提示气泡（AUI 追加能力， additive (AUI-OPT-05, AGENTS.md §112.3a)；wd-index-bar 无对应 prop）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'IndexBar · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { IndexBar } from '@snui/uni';",
    chipCopy: "import { IndexBar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-index-bar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Pagination', link: '/en/components/uni/pagination' },
    next: { text: 'Backtop', link: '/en/components/uni/backtop' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
