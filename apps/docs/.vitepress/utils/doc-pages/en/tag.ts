/** Tag · Web (Web) — English page data. Props from tag SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const tagDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Tag · Web' }],
  title: 'Tag · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Tag component (n-tag aligned). Six-color types, closable, checkable,' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tag',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Tag · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tag } from '@snui/vue-web';
</script>

<template>
  <Tag />
</template>`,
  },
  demos: [
    { name: 'tag-web-basic', title: 'Basic', blurb: 'Six-color type + three sizes + pills.' },
    {
      name: 'tag-web-closable',
      title: 'Closable',
      blurb: 'close event + internal hide + close-icon slot + blocked while loading.',
    },
    {
      name: 'tag-web-checkable',
      title: 'Checkable',
      blurb: 'v-model:checked + type-colored checked state + Enter/Space.',
    },
    {
      name: 'tag-web-shapes',
      title: 'Special shapes',
      blurb:
        'shape: square / round / skew / ribbon / fold / ticket, combinable with closable / checkable / color.',
    },
    {
      name: 'tag-web-icon',
      title: 'Icon & avatar',
      blurb: 'icon slot (replaced by the spinner while loading) + avatar slot.',
    },
    {
      name: 'tag-web-loading',
      title: 'Loading',
      blurb: 'loading shows an inline spinner; close and toggle are blocked; aria-busy.',
    },
    {
      name: 'tag-web-color',
      title: 'Custom colors',
      blurb:
        'color accepts a string or a { color, borderColor, textColor } object; text color is auto-picked for contrast when textColor is omitted.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'",
        default: "'default'",
        desc: 'Semantic type — drives colors. Mirrors n-tag `type`.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Tag scale. Mirrors n-tag `size`.',
      },
      {
        name: 'shape',
        type: "'square' | 'round' | 'skew' | 'ribbon' | 'fold' | 'ticket'",
        default: "'square'",
        desc: 'Special-shape variant (AUI additive, §112.3a). `square` is the plain rectangle; `round` is the capsule.',
      },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: "Pill-shaped corners. Mirrors n-tag `round`; sugar for `shape: 'round'`.",
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        desc: 'Render the close button. Mirrors n-tag `closable`.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Inline spinner; blocks close + toggle while active (AUI additive).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disabled interactions (no toggle, no close). Mirrors n-tag `disabled`.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'true',
        desc: 'Draw the surrounding border. Mirrors n-tag `bordered`.',
      },
      {
        name: 'color',
        type: 'string | TagCustomColor | undefined',
        default: 'undefined',
        desc: 'Custom colors. Mirrors n-tag `color`: a plain background string or a `{ color, borderColor, textColor }` object. Text color is picked automatically for contrast when `textColor` is not given.',
      },
      {
        name: 'checkable',
        type: 'boolean',
        default: 'false',
        desc: 'Click toggles the checked state. Mirrors n-tag `checkable`.',
      },
      {
        name: 'checked',
        type: 'boolean',
        default: 'false',
        desc: 'Checked state (v-model:checked). Mirrors n-tag `checked`.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnTag.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'close',
        payload: '—',
        desc: 'Fired on close-button click; the tag then hides itself (naive-ui `onClose`).',
      },
      {
        name: 'update:checked',
        payload: '(checked: boolean)',
        desc: 'Fired on a checkable toggle; supports `v-model:checked` (naive-ui `checked`).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnTag.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Tag label.' },
      {
        name: 'icon',
        props: '—',
        desc: 'Leading icon, replaced by the spinner while `loading` (naive-ui `icon`).',
      },
      { name: 'avatar', props: '—', desc: 'Leading avatar, before the icon (naive-ui `avatar`).' },
      { name: 'close-icon', props: '—', desc: 'Custom close glyph (naive-ui `close-icon`).' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tag · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tag } from '@snui/vue-web';",
    chipCopy: "import { Tag } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Tag', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'avatar', link: '/en/components/web/avatar' },
    next: { text: 'dropdown', link: '/en/components/web/dropdown' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
