/** PageHeader · Web (Web) — English page data. Props from page-header SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const pageHeaderDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'PageHeader · Web' },
  ],
  title: 'PageHeader · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'A page-level header: a back control, title / subtitle, an extra action area' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/page-header',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'PageHeader · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { PageHeader } from '@snui/vue-web';
</script>

<template>
  <PageHeader />
</template>`,
  },
  demos: [
    { name: 'page-header-web-basic', title: 'Basic header', blurb: 'Basic header' },
    { name: 'page-header-web-composite', title: 'Composite header', blurb: 'Composite header' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Page title text; the `title` slot takes precedence. Mirrors n-page-header `title`.',
      },
      {
        name: 'subtitle',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Subtitle under the title; the `subtitle` slot takes precedence. Mirrors n-page-header `subtitle`.',
      },
      {
        name: 'extra',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Right-side extra content; the `extra` slot takes precedence. Mirrors n-page-header `extra`.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnPageHeader.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      { name: 'back', payload: 'MouseEvent', desc: 'Fired when the back control is activated.' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnPageHeader.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'header', props: '—', desc: 'Replaces the whole header row.' },
      { name: 'back', props: '—', desc: 'Replaces the back control entirely.' },
      { name: 'icon', props: '—', desc: 'Replaces the back glyph inside the control.' },
      { name: 'title', props: '—', desc: 'Title content; used when `title` is not passed.' },
      {
        name: 'subtitle',
        props: '—',
        desc: 'Subtitle content; used when `subtitle` is not passed.',
      },
      { name: 'extra', props: '—', desc: 'Extra content; used when `extra` is not passed.' },
      { name: 'footer', props: '—', desc: 'Bottom area, separated by a top border.' },
      { name: 'default', props: '—', desc: 'Content between the header and the footer.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'PageHeader · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { PageHeader } from '@snui/vue-web';",
    chipCopy: "import { PageHeader } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'PageHeader', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'pagination', link: '/en/components/web/pagination' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
