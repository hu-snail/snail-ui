/** Log · Web (Web) — English page data. Props from log SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const logDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback Components' }, { text: 'Log · Web' }],
  title: 'Log · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Fixed-height scrolling log viewer with reach / require-more events and a' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/log',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Log · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Log } from '@snui/vue-web';
</script>

<template>
  <Log />
</template>`,
  },
  demos: [
    { name: 'log-web-size', title: 'Size', blurb: 'rows controls the viewer height.' },
    { name: 'log-web-event', title: 'Events', blurb: 'require-more / reach-top / reach-bottom.' },
    { name: 'log-web-scroll', title: 'Scroll control', blurb: 'scrollTo with and without silent.' },
    { name: 'log-web-loading', title: 'Loading', blurb: 'loading pill toggle.' },
    {
      name: 'log-web-auto-bottom',
      title: 'Auto scroll to bottom',
      blurb: 'Appending data keeps the view at the bottom.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'log',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Log content; split into lines on `\\n`. Takes precedence over `lines`. Mirrors n-log `log`.',
      },
      {
        name: 'lines',
        type: 'string[]',
        default: '() => []',
        desc: 'Log lines; ignored when `log` is a non-empty string. Mirrors n-log `lines`.',
      },
      {
        name: 'trim',
        type: 'boolean',
        default: 'false',
        desc: 'Trim each displayed line. Mirrors n-log `trim`.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Show the loading indicator. Mirrors n-log `loading`.',
      },
      {
        name: 'fontSize',
        type: 'number',
        default: '14',
        desc: 'Text size in px. Mirrors n-log `font-size`.',
      },
      {
        name: 'lineHeight',
        type: 'number',
        default: '1.25',
        desc: 'Unitless line-height; rows stay aligned with the fixed height. Mirrors n-log `line-height`.',
      },
      {
        name: 'rows',
        type: 'number',
        default: '15',
        desc: 'Visible row count; the container height is rows × line-height × font-size. Mirrors n-log `rows`.',
      },
      {
        name: 'offsetTop',
        type: 'number',
        default: '0',
        desc: 'Top reach tolerance in px. Mirrors n-log `offset-top`.',
      },
      {
        name: 'offsetBottom',
        type: 'number',
        default: '0',
        desc: 'Bottom reach tolerance in px. Mirrors n-log `offset-bottom`.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnLog.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'reach-top',
        payload: '—',
        desc: 'Fired at the top, within `offset-top` (n-log `on-reach-top`).',
      },
      {
        name: 'reach-bottom',
        payload: '—',
        desc: 'Fired at the bottom, within `offset-bottom` (n-log `on-reach-bottom`).',
      },
      {
        name: 'require-more',
        payload: "'top' | 'bottom'",
        desc: "Fired past the tolerance, payload `'top' | 'bottom'` (n-log `on-require-more`).",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Log · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Log } from '@snui/vue-web';",
    chipCopy: "import { Log } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Log', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'list', link: '/en/components/web/list' },
    next: { text: 'number-animation', link: '/en/components/web/number-animation' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
