/** Loading (Web) — English page data. Props from SnLoading.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const loadingDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback' }, { text: 'Loading' }],
  title: 'Loading',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Loading indicator. Two modes share one component:' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/loading',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Loading.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Loading } from '@snui/vue-web';
</script>

<template>
  <Loading />
</template>`,
  },
  demos: [
    { name: 'loading-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'loading-web-wrapper', title: 'Wrapper mode', blurb: 'Wrapper mode' },
    { name: 'loading-web-description', title: 'Loading text', blurb: 'Loading text' },
    { name: 'loading-web-customize-icon', title: 'Custom glyph', blurb: 'Custom glyph' },
    { name: 'loading-web-delay', title: 'Delayed display', blurb: 'Delayed display' },
    { name: 'loading-web-custom', title: 'Color and scale', blurb: 'Color and scale' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'size',
        type: "'tiny' | 'small' | 'medium' | 'large' | 'huge' | number",
        default: "'medium'",
        desc: 'Size tier, or a number treated as px. Mirrors n-spin `size`.',
      },
      {
        name: 'show',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the spinner is visible. Mirrors n-spin `show`.',
      },
      {
        name: 'delay',
        type: 'number',
        default: 'undefined as any',
        desc: 'Defer the spinner by N ms; hiding is always immediate. Mirrors `delay`.',
      },
      {
        name: 'rotate',
        type: 'boolean',
        default: 'true',
        desc: 'Rotate a custom `icon` slot. Ignored for the built-in spinner, which is animated by SMIL. Mirrors n-spin `rotate`.',
      },
      {
        name: 'description',
        type: 'string',
        default: 'undefined as any',
        desc: 'Text under the spinner. Mirrors n-spin `description`.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: 'Class applied to the wrapped content. Mirrors `contentClass`.',
      },
      {
        name: 'contentStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: 'Style applied to the wrapped content. Mirrors `contentStyle`.',
      },
      {
        name: 'stroke',
        type: 'string',
        default: 'undefined as any',
        desc: 'Custom arc colour. Mirrors n-spin `stroke`.',
      },
      {
        name: 'strokeWidth',
        type: 'number',
        default: 'undefined as any',
        desc: 'Arc thickness in SVG units. Mirrors n-spin `strokeWidth`.',
      },
      {
        name: 'scale',
        type: 'number',
        default: 'undefined as any',
        desc: 'Overall scale factor. Mirrors n-spin `scale`.',
      },
      {
        name: 'radius',
        type: 'number',
        default: 'undefined as any',
        desc: 'SVG arc radius in design units. Mirrors n-spin `radius`.',
      },
      {
        name: 'spinning',
        type: 'boolean',
        default: 'undefined as any',
        desc: 'Deprecated upstream alias for `show`; wins when both are set. Mirrors n-spin `spinning`.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnLoading.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Wrapped content; when present the spinner overlays it.',
      },
      {
        name: 'description',
        props: '—',
        desc: 'Rich description under the spinner; overrides the `description` prop.',
      },
      { name: 'icon', props: '—', desc: 'Custom spinner graphic replacing the built-in SVG arc.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Loading ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Loading } from '@snui/vue-web';",
    chipCopy: "import { Loading } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Loading', tone: 'accent' },
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
