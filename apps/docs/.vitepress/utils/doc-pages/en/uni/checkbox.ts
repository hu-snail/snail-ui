/** Checkbox · uni-app x (uni-app x) — English page data. Props from sn-checkbox.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const checkboxDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Checkbox · uni-app x' },
  ],
  title: 'Checkbox · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The checkbox pair for uni-app x (H5 / WeChat MP / App): ' },
    { t: 'code', s: 'sn-checkbox-group' },
    { t: 'text', s: ' (parent, owns the array ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ') + ' },
    { t: 'code', s: 'sn-checkbox' },
    { t: 'text', s: ' (child, identified by ' },
    { t: 'code', s: 'name' },
    { t: 'text', s: '). easycom auto-registration (both files live in ' },
    { t: 'code', s: 'sn-checkbox/' },
    { t: 'text', s: '); geometry in ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: ', colors from `--sn-mp-*' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-checkbox',
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
    fileLabel: 'Checkbox · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Checkbox } from '@snui/uni';
</script>

<template>
  <sn-checkbox />
</template>`,
  },
  demos: [
    {
      name: 'checkbox-mp-basic',
      title: 'Basic usage',
      blurb: 'sn-checkbox-group array v-model + sn-checkbox name.',
    },
    {
      name: 'checkbox-mp-type',
      title: 'Shapes (`type`: `circle` / `square` / `button` / `dot`)',
      blurb: 'Four shapes: circle / square / button / dot.',
    },
    {
      name: 'checkbox-mp-group-limits',
      title: 'Count limits (min / max)',
      blurb: 'min/max cap how many options may be checked.',
    },
    {
      name: 'checkbox-mp-group-state',
      title: 'Group state & half-check',
      blurb: 'Whole-group disabled / readonly; indeterminate half-check.',
    },
    {
      name: 'checkbox-mp-toggle-all',
      title: 'Select all / clear all (toggleAll)',
      blurb: 'toggleAll via expose, select-all / clear-all.',
    },
    {
      name: 'checkbox-mp-standalone',
      title: 'Standalone usage & custom values',
      blurb: 'Standalone `v-model` with `trueValue` / `falseValue`.',
    },
    {
      name: 'checkbox-mp-colors',
      title: 'Checked colors (checkedColor)',
      blurb: 'checkedColor / uncheckedColor.',
    },
    {
      name: 'checkbox-mp-placement',
      title: 'Layout & label (placement / maxWidth)',
      blurb: '`size` large and `placement` right; `maxWidth` + `customLabelClass`.',
    },
    {
      name: 'checkbox-mp-custom-style',
      title: 'Custom style',
      blurb: 'customClass / customStyle land on the component nodes.',
    },
    {
      name: 'checkbox-mp-card',
      title: 'Card variant',
      blurb:
        'Whole card is selectable; card slot for custom content; selected = themed border + soft fill + top-right tick.',
    },
    {
      name: 'checkbox-mp-indicator',
      title: 'Indicator placement & checked paint',
      blurb: 'indicatorPlacement top-right / bottom-right / none; checkedStyle border / fill.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnCheckboxValue',
        default: 'false',
        desc: 'Bound value when used standalone. Ignored inside a group.',
      },
      {
        name: 'name',
        type: 'SnCheckboxValue',
        default: "''",
        desc: 'Identity inside `sn-checkbox-group` (also the standalone value).',
      },
      {
        name: 'type',
        type: 'SnCheckboxType | undefined',
        default: 'undefined',
        desc: 'Shape preset. Inherits from the group when not set.',
      },
      {
        name: 'checkedColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Checked color. Inherits from the group when not set.',
      },
      {
        name: 'uncheckedColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Unchecked color. Inherits from the group when not set.',
      },
      {
        name: 'disabled',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Disables this option. Inherits from the group when not set.',
      },
      {
        name: 'readonly',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Read-only. Inherits from the group when not set.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        desc: 'Half-checked state (highest visual priority, wd-checkbox parity).',
      },
      {
        name: 'trueValue',
        type: 'SnCheckboxValue',
        default: 'true',
        desc: 'Value emitted when checked (standalone mode).',
      },
      {
        name: 'falseValue',
        type: 'SnCheckboxValue',
        default: 'false',
        desc: 'Value emitted when unchecked (standalone mode).',
      },
      {
        name: 'size',
        type: 'SnCheckboxSize',
        default: 'undefined',
        desc: 'Size preset. Inherits from the group when not set.',
      },
      {
        name: 'placement',
        type: 'SnCheckboxPlacement | undefined',
        default: 'undefined',
        desc: 'Tick position. Inherits from the group when not set.',
      },
      {
        name: 'direction',
        type: 'SnCheckboxDirection | undefined',
        default: 'undefined',
        desc: 'Layout direction (only meaningful inside a group).',
      },
      {
        name: 'maxWidth',
        type: 'string',
        default: "''",
        desc: 'Max width of the label text (CSS length).',
      },
      {
        name: 'customLabelClass',
        type: 'string',
        default: "''",
        desc: 'Class on the label text node.',
      },
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
    copy: 'Checkbox · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Checkbox } from '@snui/uni';",
    chipCopy: "import { Checkbox } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-checkbox', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Search', link: '/en/components/uni/search' },
    next: { text: 'Radio', link: '/en/components/uni/radio' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
