/** FloatButton · Web (Web) — English page data. Props from float-button SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const floatButtonDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'FloatButton · Web' },
  ],
  title: 'FloatButton · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'above the trigger when opened.' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/float-button',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'FloatButton · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { FloatButton } from '@snui/vue-web';
</script>

<template>
  <FloatButton />
</template>`,
  },
  demos: [
    { name: 'float-button-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'float-button-web-placement', title: 'The eight anchors', blurb: 'The eight anchors' },
    { name: 'float-button-web-group', title: 'Group', blurb: 'Group' },
    { name: 'float-button-web-direction', title: 'Opening direction', blurb: 'Opening direction' },
    { name: 'float-button-web-badge', title: 'Badge', blurb: 'badge count bubble + badge-dot.' },
    {
      name: 'float-button-web-link',
      title: 'Link button',
      blurb: 'href + target switch to an <a> root.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: 'SnFloatButtonType',
        default: "'default'",
        desc: "Filled color: surface background (`'default'`) or brand fill (`'primary'`).",
      },
      {
        name: 'shape',
        type: 'SnFloatButtonShape',
        default: "'circle'",
        desc: "`'circle'` (default) or `'square'` — square stacks the icon above a `description` line.",
      },
      {
        name: 'icon',
        type: 'IconComponent | undefined',
        default: '—',
        desc: 'Lucide-style icon component; the `icon` slot overrides it.',
      },
      {
        name: 'iconSize',
        type: 'number | string',
        default: '18',
        desc: 'Pixel / CSS size forwarded to the embedded SnIcon.',
      },
      {
        name: 'description',
        type: 'string',
        default: '—',
        desc: 'Text under the icon. Rendered for `shape="square"` only; the `description` slot overrides it.',
      },
      {
        name: 'tooltip',
        type: 'string | undefined',
        default: '—',
        desc: 'Sets the native `title` and the accessible name on the root. No tooltip component is used. The explicit `| undefined` is required by `exactOptionalPropertyTypes` for props forwarded into the template.',
      },
      {
        name: 'badge',
        type: 'number | string',
        default: '—',
        desc: "Count bubble; hidden when `undefined`, `0` or `''`.",
      },
      {
        name: 'badgeDot',
        type: 'boolean',
        default: 'false',
        desc: 'Render a dot instead of the count (used when there is no number to show).',
      },
      {
        name: 'href',
        type: 'string',
        default: '—',
        desc: 'When set, the root renders `<a href>` instead of `<button type="button">`.',
      },
      {
        name: 'target',
        type: "'_blank' | '_self' | '_parent' | '_top'",
        default: '—',
        desc: 'Native link target. Only meaningful together with `href`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disabled state — no `click` event, `aria-disabled` on the root.',
      },
      { name: 'visible', type: 'boolean', default: 'true', desc: '`v-if` the whole button.' },
      {
        name: 'placement',
        type: 'SnFloatButtonPlacement',
        default: "'bottom-right'",
        desc: 'Fixed corner. Ignored inside `<SnFloatButtonGroup>` — the group positions its children.',
      },
      {
        name: 'right',
        type: 'number | string',
        default: '—',
        desc: 'Explicit distance from the viewport right edge; overrides `placement`.',
      },
      {
        name: 'bottom',
        type: 'number | string',
        default: '—',
        desc: 'Explicit distance from the viewport bottom edge; overrides `placement`.',
      },
      {
        name: 'top',
        type: 'number | string',
        default: '—',
        desc: 'Explicit distance from the viewport top edge; overrides `placement`.',
      },
      {
        name: 'left',
        type: 'number | string',
        default: '—',
        desc: 'Explicit distance from the viewport left edge; overrides `placement`.',
      },
      {
        name: 'zIndex',
        type: 'number',
        default: '1000',
        desc: 'Stacking order of the fixed root. Ignored inside a group.',
      },
      {
        name: 'fixed',
        type: 'boolean',
        default: 'true',
        desc: '`false` pins the button to its nearest positioned ancestor instead of the viewport — drop it into a `position: relative` hero/section (or set `container`) when the button belongs to that block, not to the page.',
      },
      {
        name: 'container',
        type: 'string | HTMLElement | undefined',
        default: 'undefined',
        desc: 'Explicit positioning context (selector or element) for `fixed: false`. When omitted the root only switches to `position: absolute`, so the offset resolves against the nearest positioned ancestor.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnFloatButton.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      { name: 'click', payload: 'MouseEvent', desc: 'Native click; not emitted while `disabled`.' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnFloatButton.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'icon', props: '—', desc: 'Replaces the icon.' },
      {
        name: 'default',
        props: '—',
        desc: 'Replaces the whole inner content (icon + description).',
      },
      { name: 'description', props: '—', desc: 'Replaces the `description` text.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'FloatButton · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { FloatButton } from '@snui/vue-web';",
    chipCopy: "import { FloatButton } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'FloatButton', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'floating-toc', link: '/en/components/web/floating-toc' },
    next: { text: 'pagination', link: '/en/components/web/pagination' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
