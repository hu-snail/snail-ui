/** Picker · uni-app x (uni-app x) — English page data. Props from sn-picker.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const pickerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Picker · uni-app x' },
  ],
  title: 'Picker · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Sheet picker: ' },
    { t: 'code', s: 'v-model:visible' },
    { t: 'text', s: ' drives the sheet; rolling only updates the draft and ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' is written on confirm.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-picker',
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
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Picker · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Picker } from '@snui/uni';
</script>

<template>
  <sn-picker />
</template>`,
  },
  demos: [
    {
      name: 'picker-mp-basic',
      title: 'Basic usage',
      blurb:
        'Sheet picker: `v-model:visible` drives the sheet; rolling only updates the draft and `v-model` is written on confirm.',
    },
    {
      name: 'picker-mp-cascade-confirm',
      title: 'Cascade & confirm guard (`cascade` / `beforeConfirm`)',
      blurb:
        '`cascade` turns `columns` into a tree and confirm returns the path; a `beforeConfirm` that returns false keeps the sheet open and leaves `v-model` untouched.',
    },
    {
      name: 'picker-mp-fields',
      title: 'Field mapping (`valueKey` / `labelKey` / `childrenKey`)',
      blurb:
        'A cascade tree with `valueKey` / `labelKey` / `childrenKey` mapping, so business data need not be reshaped into value / label / children.',
    },
    {
      name: 'picker-mp-button-text',
      title: 'Button labels (`cancelButtonText` / `confirmButtonText`)',
      blurb: '`cancelButtonText` / `confirmButtonText` override the cancel and confirm labels.',
    },
    {
      name: 'picker-mp-rows',
      title: 'Roller geometry (`itemHeight` / `visibleItemCount`)',
      blurb:
        '`itemHeight` tunes the row height and `visibleItemCount` the visible rows; `customViewClass` tweaks the roller.',
    },
    {
      name: 'picker-mp-immediate',
      title: 'Commit while scrolling (`immediateChange`)',
      blurb:
        '`immediateChange` writes `v-model` continuously during the roll instead of on confirm.',
    },
    {
      name: 'picker-mp-sheet',
      title: 'Sheet behavior (scrim / stacking / safe area)',
      blurb:
        'closeOnClickModal=false; safeAreaInsetBottom=false; zIndex; rootPortal; customClass / customStyle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'PickerValue[]',
        default: '() => []',
        desc: 'Confirmed value per column (`v-model`).',
      },
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Sheet visibility (`v-model:visible`).',
      },
      {
        name: 'columns',
        type: 'PickerColumn[]',
        default: '() => []',
        desc: 'Columns, or the option tree when `cascade` is set.',
      },
      {
        name: 'cascade',
        type: 'boolean',
        default: 'false',
        desc: 'Treat `columns` as a nested option tree.',
      },
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Toolbar title. Empty = no title row.',
      },
      { name: 'cancelButtonText', type: 'string', default: "'取消'", desc: 'Cancel button label.' },
      {
        name: 'confirmButtonText',
        type: 'string',
        default: "'确认'",
        desc: 'Confirm button label.',
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
        desc: 'Option key holding the label.',
      },
      {
        name: 'childrenKey',
        type: 'string',
        default: "'children'",
        desc: 'Option key holding the children (cascade mode).',
      },
      { name: 'itemHeight', type: 'number', default: '44', desc: 'Row height in px design units.' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: 'Number of visible rows.' },
      { name: 'value', type: 'PickerValue[]', default: '—', desc: 'value' },
      {
        name: 'selectedItems',
        type: 'Array<PickerOption | PickerValue>',
        default: '—',
        desc: 'selectedItems',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the mask closes the sheet.',
      },
      { name: 'zIndex', type: 'number', default: '15', desc: 'Stacking level.' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the sheet for the device safe area.',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Write `v-model` on every roll instead of only on confirm.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the sheet.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow.",
      },
      {
        name: 'customViewClass',
        type: 'string',
        default: "''",
        desc: 'Class forwarded to the roller body.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Picker · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Picker } from '@snui/uni';",
    chipCopy: "import { Picker } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-picker', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Slider', link: '/en/components/uni/slider' },
    next: { text: 'PickerView', link: '/en/components/uni/picker-view' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
