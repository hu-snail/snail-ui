/** LoadMore · uni-app (uni-app) — English page data. Props from sn-loadmore.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const loadmoreDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'LoadMore · uni-app' },
  ],
  title: 'LoadMore · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The three ' },
    { t: 'code', s: '*-text' },
    { t: 'text', s: ' props override the defaults; the ' },
    { t: 'code', s: 'loading' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'finished' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'error' },
    { t: 'text', s: " slots fully replace that state's content." },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-loadmore',
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
    fileLabel: 'LoadMore · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Loadmore } from '@snui/uni';
</script>

<template>
  <sn-loadmore />
</template>`,
  },
  demos: [
    {
      name: 'loadmore-mp-basic',
      title: 'Basic usage',
      blurb: 'Switch between the three states and count retries.',
    },
    {
      name: 'loadmore-mp-text',
      title: 'Custom texts and slots',
      blurb: 'Custom texts and a custom loading slot.',
    },
    {
      name: 'loadmore-mp-custom',
      title: 'Spinner props and custom styles',
      blurb:
        'loading-props swaps spinner shape and color / custom-class dashed outline / custom-style radius.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'state',
        type: 'LoadMoreState',
        default: "''",
        desc: 'Current load state; empty renders nothing.',
      },
      {
        name: 'loadingText',
        type: 'string',
        default: "'正在努力加载中...'",
        desc: 'Text shown while loading.',
      },
      {
        name: 'finishedText',
        type: 'string',
        default: "'已加载完毕'",
        desc: 'Text shown once everything is loaded.',
      },
      {
        name: 'errorText',
        type: 'string',
        default: "'加载失败'",
        desc: 'Text shown after a failure.',
      },
      {
        name: 'loadingProps',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'Props forwarded to the inner sn-loading.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'LoadMore · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Loadmore } from '@snui/uni';",
    chipCopy: "import { Loadmore } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-loadmore', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-skeleton', link: '/en/components/uni/skeleton' },
    next: { text: 'sn-paging', link: '/en/components/uni/paging' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
