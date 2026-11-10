/** PickerView · uni-app (uni-app) — English page data. Props from sn-picker-view.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const pickerViewDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'PickerView · uni-app' },
  ],
  title: 'PickerView · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Single-column roller: pass a string array as ' },
    { t: 'code', s: 'columns' },
    { t: 'text', s: ' and tap a row to select it.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-picker-view',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'PickerView · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { PickerView } from '@snui/uni';
</script>

<template>
  <sn-picker-view />
</template>`,
  },
  demos: [
    {
      name: 'picker-view-mp-basic',
      title: 'Basic usage',
      blurb: 'Single-column roller: pass a string array as `columns` and tap a row to select it.',
    },
    {
      name: 'picker-view-mp-cascade',
      title: 'Cascade mode (`cascade`)',
      blurb:
        'With `cascade`, `columns` is a tree and the following columns are derived from the path.',
    },
    {
      name: 'picker-view-mp-disabled',
      title: 'Disabled (`disabled`)',
      blurb: '`disabled` freezes every column; dragging is ignored.',
    },
    {
      name: 'picker-view-mp-rows',
      title: 'Roller geometry (`itemHeight` / `visibleItemCount`)',
      blurb:
        '`itemHeight` tunes the row height (px design units → rpx) and `visibleItemCount` the visible rows.',
    },
    {
      name: 'picker-view-mp-keys',
      title: 'Custom field names (`valueKey` / `labelKey` / `childrenKey`)',
      blurb:
        '`valueKey` / `labelKey` / `childrenKey` read custom field names, so business data need not be renamed.',
    },
    {
      name: 'picker-view-mp-immediate',
      title: 'Live commit while dragging (`immediateChange`)',
      blurb: '`immediateChange` fires `change` continuously while dragging for live updates.',
    },
    {
      name: 'picker-view-mp-custom-style',
      title: 'Root styling (`customClass` / `customStyle`)',
      blurb: '`customClass` / `customStyle` land on the root and restyle the roller frame and fill.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'PickerValue[]',
        default: '() => []',
        desc: 'Selected value per column (`v-model`).',
      },
      {
        name: 'columns',
        type: 'PickerColumn[]',
        default: '() => []',
        desc: 'Columns. Each entry is a column of primitives / option objects. In `cascade` mode pass the option *tree* here instead: the component derives the visible columns from the selected path.',
      },
      {
        name: 'itemHeight',
        type: 'number',
        default: '44',
        desc: 'Row height in px design units (converted to rpx for layout).',
      },
      {
        name: 'visibleItemCount',
        type: 'number',
        default: '6',
        desc: 'Number of visible rows; must be odd so a row can sit in the middle.',
      },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Option key holding the value.',
      },
      {
        name: 'labelKey',
        type: 'string',
        default: "'label'",
        desc: 'Option key holding the visible label.',
      },
      {
        name: 'childrenKey',
        type: 'string',
        default: "'children'",
        desc: 'Option key holding the children (cascade mode only).',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Emit `change` while dragging instead of only on release.',
      },
      {
        name: 'cascade',
        type: 'boolean',
        default: 'false',
        desc: 'Treat `columns` as a nested option tree.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables the whole roller.' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'PickerView · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { PickerView } from '@snui/uni';",
    chipCopy: "import { PickerView } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-picker-view', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-picker', link: '/en/components/uni/picker' },
    next: { text: 'sn-select-picker', link: '/en/components/uni/select-picker' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
