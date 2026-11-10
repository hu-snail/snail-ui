/** BackTop (Web) — English page data. Props from SnBackTop.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const backTopDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'BackTop' }],
  title: 'BackTop',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A floating button that appears once the user has scrolled past a threshold and smooth-scrolls the container back to the top when clicked. Typical use: long article or catalogue pages.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/back-top',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'BackTop.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { BackTop } from '@snui/vue-web';
</script>

<template>
  <BackTop />
</template>`,
  },
  demos: [
    { name: 'back-top-web-basic', title: 'Top web basic', blurb: 'Top web basic' },
    {
      name: 'back-top-web-visibility-height',
      title: 'Top web visibility height',
      blurb: 'Top web visibility height',
    },
    {
      name: 'back-top-web-change-position',
      title: 'Top web change position',
      blurb: 'Top web change position',
    },
    {
      name: 'back-top-web-target-container',
      title: 'Top web target container',
      blurb: 'Top web target container',
    },
    { name: 'back-top-web-control', title: 'Controlled visibility', blurb: 'Controlled by show; scroll ignored.' },
    { name: 'back-top-web-custom-content', title: 'Custom content', blurb: 'Default slot replaces the icon.' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean',
        default: 'undefined as any',
        desc: 'Controlled visibility. When omitted the component manages it itself from the scroll position (`v-model:show`).',
      },
      {
        name: 'right',
        type: 'string | number',
        default: '40',
        desc: 'Distance from the viewport right edge.',
      },
      {
        name: 'bottom',
        type: 'string | number',
        default: '40',
        desc: 'Distance from the viewport bottom edge.',
      },
      {
        name: 'to',
        type: 'HTMLElement | string',
        default: "'body'",
        desc: 'Element to render the button into. Accepted for API parity.',
      },
      {
        name: 'visibilityHeight',
        type: 'number',
        default: '180',
        desc: 'Scroll distance after which the button appears.',
      },
      {
        name: 'listenTo',
        type: 'string | HTMLElement | Document | (() => HTMLElement | Document)',
        default: '—',
        desc: 'Scroll container; auto-detected when omitted.',
      },
      {
        name: 'target (deprecated)',
        type: '() => HTMLElement',
        default: '—',
        desc: 'Deprecated scroll target callback; use `listenTo`. Mirrors n-back-top `target`.',
      },
      {
        name: 'onUpdateShow',
        type: '(value: boolean) => void',
        default: '—',
        desc: 'Called with the new visibility (mirrors `update:show`).',
      },
      {
        name: 'onShow (deprecated)',
        type: '() => void',
        default: '—',
        desc: 'Deprecated show callback; use `onUpdateShow` instead.',
      },
      {
        name: 'onHide (deprecated)',
        type: '() => void',
        default: '—',
        desc: 'Deprecated hide callback; use `onUpdateShow` instead.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnBackTop.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Custom button content — replaces the built-in arrow icon.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'BackTop ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { BackTop } from '@snui/vue-web';",
    chipCopy: "import { BackTop } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'BackTop', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
