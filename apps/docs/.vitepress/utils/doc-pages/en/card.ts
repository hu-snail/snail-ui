/** Card · Web (PC) (Web) — English page data. Props from card SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const cardDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Layout Components' },
    { text: 'Card · Web (PC)' },
  ],
  title: 'Card · Web (PC)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/card',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Card · Web (PC).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Card } from '@snui/vue-web';
</script>

<template>
  <Card />
</template>`,
  },
  demos: [
    {
      name: 'card-web',
      title: 'Basic usage',
      blurb:
        'Default variant (bordered) + elevated variant (borderless + shadow). Shows title + header slot + footer slot + body.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string | (() => unknown)',
        default: '—',
        desc: 'Title text or render function; rendered in the header without the header slot.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the content (body) region.',
      },
      {
        name: 'contentStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to the content (body) region.',
      },
      {
        name: 'contentScrollable',
        type: 'boolean',
        default: '—',
        desc: 'Make content region scrollable when overflowing. Naive UI wires this to NScrollbar; we render a max-height + overflow:auto shell that approximates that behavior without pulling in the full virtualized scrollbar.',
      },
      {
        name: 'headerClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the header region.',
      },
      {
        name: 'headerStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to the header region.',
      },
      {
        name: 'headerExtraClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the header-extra region.',
      },
      {
        name: 'headerExtraStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to the header-extra region.',
      },
      {
        name: 'footerClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to the footer region.',
      },
      {
        name: 'footerStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to the footer region.',
      },
      {
        name: 'embedded',
        type: 'boolean',
        default: '—',
        desc: 'Embedded variant — strips outer border + shadow for nested cards.',
      },
      {
        name: 'segmented',
        type: "| boolean | { content?: boolean | 'soft'; footer?: boolean | 'soft'; action?: boolean | 'soft' }",
        default: '—',
        desc: 'Divider lines between regions; boolean or `{ content?, footer?, action? }`.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large' | 'huge'",
        default: '—',
        desc: 'Card size preset. Drives padding + font-size.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: '—',
        desc: 'Show 1px outer border. Default true.',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: '—',
        desc: 'Show close button in header. Requires `onClose` to do anything.',
      },
      { name: 'hoverable', type: 'boolean', default: '—', desc: 'Apply hover-lift visual cue.' },
      {
        name: 'role',
        type: 'string',
        default: '—',
        desc: "Accessible role attribute. Default 'region'.",
      },
      {
        name: 'tag',
        type: 'keyof HTMLElementTagNameMap',
        default: '—',
        desc: "Root tag. Default 'div'.",
      },
      {
        name: 'cover',
        type: '() => unknown',
        default: '—',
        desc: 'Render function for the cover region (above the header).',
      },
      {
        name: 'content',
        type: 'string | (() => unknown)',
        default: '—',
        desc: 'Content text or render function; rendered in the body without the default slot.',
      },
      {
        name: 'footer',
        type: '() => unknown',
        default: '—',
        desc: 'Render function for the footer region.',
      },
      {
        name: 'action',
        type: '() => unknown',
        default: '—',
        desc: 'Render function for the action region (below the footer).',
      },
      {
        name: 'headerExtra',
        type: '() => unknown',
        default: '—',
        desc: 'Render function for the header-extra region.',
      },
      {
        name: 'closeFocusable',
        type: 'boolean',
        default: '—',
        desc: 'Close button focusable (keyboard tab). Default true.',
      },
      {
        name: 'variant',
        type: "'default' | 'outlined' | 'elevated'",
        default: '—',
        desc: "Web-only convenience alias: visual variant. Maps to (bordered, |) combinations. 'default' → bordered true + shadow false. 'outlined' → bordered true + shadow false (alias of default; kept for nav parity with prior docs). 'elevated' → bordered false + shadow true.",
      },
      {
        name: 'padding',
        type: "'none' | 'sm' | 'md' | 'lg'",
        default: '—',
        desc: 'Web-only convenience alias: padding sub-axis. Maps to `size`.',
      },
      {
        name: 'shadow',
        type: 'boolean',
        default: '—',
        desc: 'Web-only convenience alias: show shadow.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: '—',
        desc: 'Native ARIA label. Forwarded to the root element when provided.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnCard.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'close',
        payload: '—',
        desc: 'Fired when the close button is clicked (only when `closable` is true).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnCard.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Card body content (between header and footer).' },
      { name: 'cover', props: '—', desc: 'Cover region (above header).' },
      { name: 'header', props: '—', desc: 'Header region — overrides the `title` prop.' },
      { name: 'header-extra', props: '—', desc: 'Header-extra region (right side of header).' },
      { name: 'footer', props: '—', desc: 'Footer region.' },
      { name: 'action', props: '—', desc: 'Action region (below footer).' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Card · Web (PC) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Card } from '@snui/vue-web';",
    chipCopy: "import { Card } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Card', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'drag-sort', link: '/en/components/web/drag-sort' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
