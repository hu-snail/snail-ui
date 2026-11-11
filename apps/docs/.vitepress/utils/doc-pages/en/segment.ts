/** Segment · Web — English page data. Props from the SnSegment SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const segmentDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Segment · Web' }],
  title: 'Segment · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Segmented control for picking one value from a small set of options (heroui ' },
    { t: 'code', s: 'Segment' },
    { t: 'text', s: ' aligned). The indicator slides between items; three sizes, a ghost variant, root / per-item disabling and optional separators are supported.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/segment',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'SnSegment.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ref } from 'vue';
import { SnSegment } from '@snui/vue-web';

const view = ref('dashboard');
const views = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics' },
];
</script>

<template>
  <SnSegment v-model="view" :options="views" />
</template>`,
  },
  demos: [
    { name: 'segment-web-basic', title: 'Basic', blurb: 'Declare options through an array, bind with v-model.' },
    {
      name: 'segment-web-controlled',
      title: 'Controlled',
      blurb: 'Drive modelValue from external state and rewrite the selection any time (heroui selectedKey semantics).',
    },
    {
      name: 'segment-web-sizes',
      title: 'Sizes',
      blurb: 'sm / md / lg presets — 28 / 32 / 40 px total height, matching heroui.',
    },
    {
      name: 'segment-web-ghost',
      title: 'Variant',
      blurb: 'ghost: transparent shell + accent indicator; default: subtle shell + white thumb.',
    },
    {
      name: 'segment-web-separators',
      title: 'With separators',
      blurb: 'Dividers between adjacent unselected items, hidden next to the selection (heroui Segment.Separator).',
    },
    {
      name: 'segment-web-disabled',
      title: 'Disabled',
      blurb: 'disabled locks the whole group; per-item disabled skips the item in keyboard navigation.',
    },
    {
      name: 'segment-web-icons',
      title: 'With icons',
      blurb: 'Pass a component to icon for icon-only items (theme-switcher pattern); announce them via ariaLabel.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'options',
        type: 'SnSegmentOption[]',
        default: '—',
        desc: 'Items: { value, label?, icon?, disabled?, ariaLabel? } (heroui Segment.Item list).',
      },
      {
        name: 'modelValue',
        type: 'string | number',
        default: 'undefined',
        desc: 'Selected key (v-model); omit for uncontrolled mode (heroui selectedKey).',
      },
      {
        name: 'defaultValue',
        type: 'string | number',
        default: 'undefined',
        desc: 'Initial key for the uncontrolled mode (heroui defaultSelectedKey).',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        desc: 'Size — 28 / 32 / 40 px total heights (heroui size).',
      },
      {
        name: 'variant',
        type: "'default' | 'ghost'",
        default: "'default'",
        desc: 'Visual variant (heroui variant).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable every item (heroui isDisabled).',
      },
      {
        name: 'separators',
        type: 'boolean',
        default: 'false',
        desc: 'Render dividers; hidden adjacent to the selection (heroui Segment.Separator).',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names align 1:1 with the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnSegment.vue' },
      { t: 'text', s: '; the payload column lists callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(key: string | number)',
        desc: 'Selection change — supports v-model (heroui onSelectionChange).',
      },
      {
        name: 'change',
        payload: '(key: string | number)',
        desc: 'Selection change (listener-style alias).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'No slots — items are declared through ' },
      { t: 'code', s: 'options' },
      { t: 'text', s: ' (icon takes a component, label takes text); custom item markup is out of scope.' },
    ],
    rows: [],
  },
  ai: {
    badge: 'ai-description.md · Built-in',
    heading: 'Semantic component contract for LLMs',
    copy: 'Segment ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt() to produce machine-readable docs.',
    chip: "import { SnSegment } from '@snui/vue-web';",
    chipCopy: "import { SnSegment } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Segment', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'radiogroup', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tag', link: '/en/components/web/tag' },
    next: { text: 'dropdown', link: '/en/components/web/dropdown' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Demos' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI Native' },
  ],
};
