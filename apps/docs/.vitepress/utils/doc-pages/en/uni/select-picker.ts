/** SelectPicker · uni-app (uni-app) — English page data. Props from sn-select-picker.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const selectPickerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'SelectPicker · uni-app' },
  ],
  title: 'SelectPicker · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The checkbox type takes an array ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: '; min / max cap the selection; tapping a row toggles it.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-select-picker',
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
    fileLabel: 'SelectPicker · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SelectPicker } from '@snui/uni';
</script>

<template>
  <sn-select-picker />
</template>`,
  },
  demos: [
    {
      name: 'select-picker-mp-basic',
      title: 'Basic usage',
      blurb:
        'The checkbox type takes an array `v-model`; min / max cap the selection; tapping a row toggles it.',
    },
    {
      name: 'select-picker-mp-type-radio',
      title: 'Radio mode (`type=radio`)',
      blurb: '`type=radio` writes a scalar instead of an array.',
    },
    {
      name: 'select-picker-mp-filterable',
      title: 'Filterable (`filterable`)',
      blurb:
        '`filterable` adds a search box that filters on the label; `filterPlaceholder` customizes its hint.',
    },
    {
      name: 'select-picker-mp-fields',
      title: 'Field mapping (`valueKey` / `labelKey`)',
      blurb: '`valueKey` / `labelKey` point the component at custom field names.',
    },
    {
      name: 'select-picker-mp-chip-size',
      title: 'Chip size & confirm (`selectSize` / `showConfirm`)',
      blurb:
        '`selectSize` picks the chip size; `showConfirm=false` hides the confirm button; `confirmButtonText` overrides its label.',
    },
    {
      name: 'select-picker-mp-checked-color',
      title: 'Checked color (`checkedColor`)',
      blurb: '`checkedColor` overrides the accent of the checked row.',
    },
    {
      name: 'select-picker-mp-loading',
      title: 'Loading state (`loading`)',
      blurb: '`loading` shows the option list as loading; `loadingColor` recolors the spinner.',
    },
    {
      name: 'select-picker-mp-before-confirm',
      title: 'Confirm guard (`beforeConfirm`)',
      blurb: 'A `beforeConfirm` returning false leaves the model untouched.',
    },
    {
      name: 'select-picker-mp-sheet',
      title: 'Sheet behavior & styling',
      blurb:
        'closeOnClickModal; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle.',
    },
    {
      name: 'select-picker-mp-scroll-into-view',
      title: 'Scroll into view (`scrollIntoView`)',
      blurb:
        '`scrollIntoView` scrolls the selected row into view on open; `customContentClass` restyles the content area.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SelectValue | SelectValue[] | undefined',
        default: 'undefined',
        desc: 'Selected value(s) (`v-model`): scalar for radio, array for checkbox.',
      },
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Sheet visibility (`v-model:visible`).',
      },
      { name: 'title', type: 'string', default: "'选择器'", desc: 'Toolbar title.' },
      {
        name: 'checkedColor',
        type: 'string',
        default: "''",
        desc: 'Checked accent color (CSS color). Empty = token default.',
      },
      {
        name: 'selectSize',
        type: "'mini' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Chip size preset — mirrors wot-ui `select-size`.',
      },
      {
        name: 'min',
        type: 'number',
        default: '0',
        desc: 'Minimum number of selections (`0` = unconstrained).',
      },
      {
        name: 'max',
        type: 'number',
        default: '0',
        desc: 'Maximum number of selections (`0` = unconstrained).',
      },
      {
        name: 'type',
        type: "'checkbox' | 'radio'",
        default: "'checkbox'",
        desc: 'Selection type.',
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
        name: 'confirmButtonText',
        type: 'string',
        default: "'确认'",
        desc: 'Confirm button label.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Loading state of the option list.',
      },
      {
        name: 'loadingColor',
        type: 'string',
        default: "''",
        desc: 'Loading spinner color (CSS color).',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the mask closes the sheet.',
      },
      { name: 'columns', type: 'SelectOption[]', default: '() => []', desc: 'Option list.' },
      { name: 'value', type: 'SelectValue | SelectValue[]', default: '—', desc: 'value' },
      { name: 'selectedItems', type: 'SelectOption[]', default: '—', desc: 'selectedItems' },
      { name: 'zIndex', type: 'number', default: '15', desc: 'Stacking level.' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the sheet for the device safe area.',
      },
      { name: 'filterable', type: 'boolean', default: 'false', desc: 'Render the search field.' },
      {
        name: 'filterPlaceholder',
        type: 'string',
        default: "'搜索'",
        desc: 'Search field placeholder.',
      },
      {
        name: 'scrollIntoView',
        type: 'boolean',
        default: 'true',
        desc: 'Scroll the selected row into view on open.',
      },
      {
        name: 'customContentClass',
        type: 'string',
        default: "''",
        desc: 'Class on the option content wrapper.',
      },
      { name: 'showConfirm', type: 'boolean', default: 'true', desc: 'Render the confirm button.' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'SelectPicker · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { SelectPicker } from '@snui/uni';",
    chipCopy: "import { SelectPicker } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-select-picker', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-picker-view', link: '/en/components/uni/picker-view' },
    next: { text: 'sn-cascader', link: '/en/components/uni/cascader' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
