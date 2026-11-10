/** Layout · Web (Web) — English page data. Props from layout SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const layoutDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Layout Components' }, { text: 'Layout · Web' }],
  title: 'Layout · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Page layout family (n-layout five-piece): SnLayout / SnLayoutSider / SnLayoutHeader / SnLayoutContent / SnLayoutFooter.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/layout',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Layout · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Layout } from '@snui/vue-web';
</script>

<template>
  <Layout />
</template>`,
  },
  demos: [
    {
      name: 'layout-web-basic',
      title: 'Basic three-section',
      blurb: 'Header / Content / Footer vertical stack.',
    },
    {
      name: 'layout-web-sider',
      title: 'With sider (hasSider)',
      blurb: 'Horizontal + Sider collapse trigger.',
    },
    {
      name: 'layout-web-collapse',
      title: 'Collapse mode',
      blurb: 'transform (keep DOM) / width (reflow) modes.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'hasSider',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the layout arranges children in a row (sider present). Mirrors n-layout `has-sider`. Default false.',
      },
      {
        name: 'position',
        type: 'SnLayoutPosition',
        default: "'static'",
        desc: "Positioning mode. 'static' keeps normal flow; 'absolute' pins the root to inset 0. Mirrors n-layout `position`. Default 'static'.",
      },
      {
        name: 'contentStyle',
        type: 'SnLayoutStyleValue',
        default: '—',
        desc: 'Inline style forwarded to SnLayoutContent children. Mirrors n-layout `content-style`.',
      },
      {
        name: 'headerStyle',
        type: 'SnLayoutStyleValue',
        default: '—',
        desc: 'Inline style forwarded to SnLayoutHeader children.',
      },
      {
        name: 'footerStyle',
        type: 'SnLayoutStyleValue',
        default: '—',
        desc: 'Inline style forwarded to SnLayoutFooter children.',
      },
      {
        name: 'siderStyle',
        type: 'SnLayoutStyleValue',
        default: '—',
        desc: 'Inline style forwarded to SnLayoutSider children. Mirrors n-layout `sider-style`.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnLayout.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Layout child components (e.g. `SnLayoutSider`), or a nested `SnLayout`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Layout · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Layout } from '@snui/vue-web';",
    chipCopy: "import { Layout } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Layout', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'flex', link: '/en/components/web/flex' },
    next: { text: 'split', link: '/en/components/web/split' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
