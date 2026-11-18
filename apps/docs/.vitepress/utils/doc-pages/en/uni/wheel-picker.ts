/** WheelPicker · uni-app x (uni-app x) — English page data. Props from sn-wheel-picker.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const wheelPickerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'WheelPicker · uni-app x' },
  ],
  title: 'WheelPicker · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Inline wheel-style roller: the selected row sits on a rounded pill band with a distance fade, and sliding ticks a short haptic per detent (App / mini-program; H5 skips silently). A preset wrapper over ' },
    { t: 'code', s: 'sn-picker-view' },
    { t: 'text', s: ' with `wheel` switched on.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-wheel-picker',
    },
  ],
  features: [
    { text: 'Wheel pill selection band', icon: 'layers' },
    { text: 'Slide haptic (App / MP)', icon: 'touch' },
    { text: 'easycom auto-registration', icon: 'eco' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'WheelPicker · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { WheelPicker } from '@snui/uni';
</script>

<template>
  <sn-wheel-picker />
</template>`,
  },
  demos: [
    {
      name: 'wheel-picker-mp-basic',
      title: 'Basic usage',
      blurb: 'Inline year roller: pill band + distance fade + slide haptic (on by default).',
    },
    {
      name: 'wheel-picker-mp-vibrate',
      title: 'Slide haptic switch (`vibrateShort`)',
      blurb: '`vibrateShort` defaults to true; pass false for a silent slide. Compare on device (App / MP).',
    },
    {
      name: 'wheel-picker-mp-reminder',
      title: 'Reminder sheet assembly (`sn-popup`)',
      blurb: 'sn-popup + custom header + wheel roller + block confirm button assembles a reminder-time sheet.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'PickerValue[]', default: '() => []', desc: 'Selected value per column (`v-model`).' },
      { name: 'columns', type: 'PickerColumn[]', default: '() => []', desc: 'Columns; the option tree when `cascade` is set.' },
      { name: 'itemHeight', type: 'number', default: '44', desc: 'Row height in px design units.' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: 'Number of visible rows (odd keeps a centered selection).' },
      { name: 'valueKey', type: 'string', default: "'value'", desc: 'Option key holding the value.' },
      { name: 'labelKey', type: 'string', default: "'label'", desc: 'Option key holding the label.' },
      { name: 'childrenKey', type: 'string', default: "'children'", desc: 'Option key holding the children (cascade).' },
      { name: 'immediateChange', type: 'boolean', default: 'false', desc: 'Emit `change` while dragging.' },
      { name: 'cascade', type: 'boolean', default: 'false', desc: 'Treat `columns` as a nested tree.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables the roller.' },
      {
        name: 'vibrateShort',
        type: 'boolean',
        default: 'true',
        desc: 'Slide haptic (additive): fires `uni.vibrateShort({ type: "light" })` per detent on App / MP; taps and programmatic writes stay silent.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the root node.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · built in',
    heading: 'Semantic component contract for LLMs',
    copy: 'WheelPicker ships an AI-Friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { WheelPicker } from '@snui/uni';",
    chipCopy: "import { WheelPicker } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-wheel-picker', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'PickerView', link: '/en/components/uni/picker-view' },
    next: { text: 'SelectPicker', link: '/en/components/uni/select-picker' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI Native' },
  ],
};
