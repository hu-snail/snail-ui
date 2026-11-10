/** Anchor (Web) — English page data. Props from SnAnchor.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const anchorDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'Anchor' }],
  title: 'Anchor',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'In-page navigation that highlights the link for the section currently in view and scrolls to a section when its link is clicked. Typical use: documentation sidebars, long-form article outlines, settings pages with grouped sections.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/anchor',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Anchor.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Anchor } from '@snui/vue-web';
</script>

<template>
  <Anchor />
</template>`,
  },
  demos: [
    { name: 'anchor-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'anchor-web-ignore-gap', title: 'Highlight detection', blurb: 'Highlight detection' },
    { name: 'anchor-web-affix', title: 'Affixed', blurb: 'Affixed' },
    { name: 'anchor-web-scrollto', title: 'Programmatic scroll', blurb: 'Programmatic scroll' },
    { name: 'anchor-web-variants', title: 'Style variants', blurb: 'Style variants' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'block' | 'rail'",
        default: "'rail'",
        desc: '`rail` shows a vertical rail with a sliding bar; `block` is a plain list. Mirrors n-anchor `type`.',
      },
      {
        name: 'showRail',
        type: 'boolean',
        default: 'true',
        desc: 'Show the rail (ignored when `type` is `block`). Mirrors `showRail`.',
      },
      {
        name: 'showBackground',
        type: 'boolean',
        default: 'true',
        desc: 'Show the highlight behind the active link. Mirrors `showBackground`.',
      },
      {
        name: 'bound',
        type: 'number',
        default: '12',
        desc: 'Distance from the scroll target top at which a section becomes active. Mirrors n-anchor `bound`.',
      },
      {
        name: 'internalScrollable',
        type: 'boolean',
        default: 'false',
        desc: 'Accept for API parity; content is rendered in normal flow.',
      },
      {
        name: 'ignoreGap',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the previous link active while a section is scrolled out of view, instead of activating the fully-scrolled-past link.',
      },
      {
        name: 'offsetTarget',
        type: 'string | OffsetTarget | (() => HTMLElement)',
        default: '—',
        desc: 'Element used to measure section offsets; defaults to `document`.',
      },
      {
        name: 'affix',
        type: 'boolean',
        default: 'false',
        desc: 'Wrap the anchor in SnAffix so it stays in view. Mirrors `affix`.',
      },
      {
        name: 'listenTo',
        type: 'string | HTMLElement | Document | (() => HTMLElement | Document)',
        default: '—',
        desc: 'Forwarded to `SnAffix` as the scroll container when `affix` is true.',
      },
      {
        name: 'top',
        type: 'number',
        default: 'undefined as any',
        desc: 'Forwarded to SnAffix when `affix` is true.',
      },
      {
        name: 'bottom',
        type: 'number',
        default: 'undefined as any',
        desc: 'Forwarded to SnAffix when `affix` is true.',
      },
      {
        name: 'triggerTop',
        type: 'number',
        default: 'undefined as any',
        desc: 'Forwarded to SnAffix when `affix` is true.',
      },
      {
        name: 'triggerBottom',
        type: 'number',
        default: 'undefined as any',
        desc: 'Forwarded to SnAffix when `affix` is true.',
      },
      { name: 'offsetTop', type: 'number', default: 'undefined as any', desc: 'offsetTop' },
      { name: 'offsetBottom', type: 'number', default: 'undefined as any', desc: 'offsetBottom' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnAnchor.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'default', props: '—', desc: '`SnAnchorLink` children.' }],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Anchor ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Anchor } from '@snui/vue-web';",
    chipCopy: "import { Anchor } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Anchor', tone: 'accent' },
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
