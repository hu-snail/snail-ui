/** Thing · Web (Web) — English page data. Props from thing SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const thingDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Thing · Web' },
  ],
  title: 'Thing · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Structured content block with avatar / header / extra / description /' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/thing',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Thing · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Thing } from '@snui/vue-web';
</script>

<template>
  <Thing />
</template>`,
  },
  demos: [
    {
      name: 'thing-web-basic',
      title: 'Examples',
      blurb: 'title / description / body + footer / action slots.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string',
        default: '—',
        desc: 'Title text; the `header` slot overrides it.',
      },
      {
        name: 'titleExtra',
        type: 'string',
        default: '—',
        desc: 'Extra content at the far end of the header row.',
      },
      {
        name: 'description',
        type: 'string',
        default: '—',
        desc: 'Description text; the `description` slot overrides it.',
      },
      {
        name: 'content',
        type: 'string',
        default: '—',
        desc: 'Content text; the `default` slot overrides it.',
      },
      {
        name: 'contentIndented',
        type: 'boolean',
        default: 'false',
        desc: 'Indent the whole content column under the header instead of the avatar (requires the `avatar` slot to matter).',
      },
      {
        name: 'descriptionClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the description block.',
      },
      {
        name: 'descriptionStyle',
        type: 'string | CSSProperties',
        default: '—',
        desc: 'Style applied to the description block.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the content block.',
      },
      {
        name: 'contentStyle',
        type: 'string | CSSProperties',
        default: '—',
        desc: 'Style applied to the content block.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Thing · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Thing } from '@snui/vue-web';",
    chipCopy: "import { Thing } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Thing', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'table', link: '/en/components/web/table' },
    next: { text: 'time', link: '/en/components/web/time' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
