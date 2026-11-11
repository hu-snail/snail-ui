/** Time · Web (Web) — English page data. Props from time SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const timeDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback Components' }, { text: 'Time · Web' }],
  title: 'Time · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Time formatter (n-time aligned): renders a timestamp / Date as datetime, date-only or relative text in a native ',
    },
    { t: 'code', s: '<time>' },
    { t: 'text', s: ' element.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/time',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Time · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Time } from '@snui/vue-web';
</script>

<template>
  <Time />
</template>`,
  },
  demos: [
    { name: 'time-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'time-web-type', title: 'Type', blurb: 'Type' },
    { name: 'time-web-format', title: 'Format', blurb: 'Format' },
    { name: 'time-web-relative', title: 'Relative', blurb: 'Relative' },
    { name: 'time-web-unix', title: 'Unix', blurb: 'Unix' },
    { name: 'time-web-timezone', title: 'Time zone', blurb: 'Time zone' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'time',
        type: 'number | Date | undefined',
        default: 'undefined',
        desc: 'Time to render (ms timestamp or Date). Defaults to the mount time. Mirrors n-time `time`.',
      },
      {
        name: 'type',
        type: "'relative' | 'date' | 'datetime'",
        default: "'datetime'",
        desc: 'Rendered representation. Mirrors n-time `type`.',
      },
      {
        name: 'to',
        type: 'number | Date | undefined',
        default: 'undefined',
        desc: 'Base time for `type="relative"`. Defaults to the mount time. Mirrors n-time `to`.',
      },
      {
        name: 'unix',
        type: 'boolean',
        default: 'false',
        desc: 'Interpret `time` / `to` as unix timestamps in seconds. Mirrors n-time `unix`.',
      },
      {
        name: 'format',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Custom format string (date-fns token subset, see header). Mirrors n-time `format`.',
      },
      {
        name: 'text',
        type: 'boolean',
        default: 'false',
        desc: 'Render a bare text node instead of a `<time>` element. Mirrors n-time `text`.',
      },
      {
        name: 'timeZone',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'IANA time zone used when formatting. Mirrors n-time `timeZone`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Time · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Time } from '@snui/vue-web';",
    chipCopy: "import { Time } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Time', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'thing', link: '/en/components/web/thing' },
    next: { text: 'timeline', link: '/en/components/web/timeline' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
