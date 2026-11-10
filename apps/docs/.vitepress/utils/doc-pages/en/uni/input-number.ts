/** InputNumber · uni-app (uni-app) — English page data. Props from sn-input-number.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const inputNumberDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'InputNumber · uni-app' },
  ],
  title: 'InputNumber · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Basic sn-input-number: min / max bounds, step and precision.' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-input-number',
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
    fileLabel: 'InputNumber · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { InputNumber } from '@snui/uni';
</script>

<template>
  <sn-input-number />
</template>`,
  },
  demos: [
    {
      name: 'input-number-mp-basic',
      title: 'Basic usage',
      blurb: 'Basic sn-input-number: min / max bounds, step and precision.',
    },
    {
      name: 'input-number-mp-theme-state',
      title: 'Themes & states (`theme` / `round` / `disabled` / `longPress`)',
      blurb:
        'Four themes (default / outline / outline-split / primary), plus round, disabled and long-press repeat.',
    },
    {
      name: 'input-number-mp-controls',
      title:
        'Disabling the field and each button independently (`disableInput` / `disableMinus` / `disablePlus` / `withoutInput` / `inputWidth`)',
      blurb:
        'disableInput / disableMinus / disablePlus; withoutInput leaves the buttons only; inputWidth.',
    },
    {
      name: 'input-number-mp-commit-hooks',
      title:
        'Value rules & commit timing (`stepStrictly` / `allowNull` / `placeholder` / `beforeChange` / `immediateChange` / `updateOnInit` / `inputType` / `adjustPosition` / `custom*`)',
      blurb:
        'stepStrictly; allowNull + placeholder; beforeChange veto; immediateChange=false; updateOnInit; inputType; adjustPosition.',
    },
    {
      name: 'input-number-mp-custom-class',
      title: 'Custom styling (`customClass` / `customStyle`)',
      blurb: 'The customClass and customStyle mount points.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | string',
        default: '0',
        desc: 'Bound value (`v-model`).',
      },
      { name: 'min', type: 'number', default: '1', desc: 'Lower bound.' },
      { name: 'max', type: 'number', default: 'Number.MAX_SAFE_INTEGER', desc: 'Upper bound.' },
      { name: 'step', type: 'number', default: '1', desc: 'Increment / decrement step.' },
      {
        name: 'stepStrictly',
        type: 'boolean',
        default: 'false',
        desc: 'Snap every committed value onto the `step` grid.',
      },
      {
        name: 'precision',
        type: 'number | string',
        default: '0',
        desc: 'Decimal places kept after every commit.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables the whole stepper.' },
      {
        name: 'disableInput',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the editable field only (buttons stay live).',
      },
      {
        name: 'disableMinus',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the minus button only.',
      },
      {
        name: 'disablePlus',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the plus button only.',
      },
      {
        name: 'withoutInput',
        type: 'boolean',
        default: 'false',
        desc: 'Hide the field — buttons only.',
      },
      {
        name: 'inputWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Field width. A number is treated as an rpx design value.',
      },
      {
        name: 'allowNull',
        type: 'boolean',
        default: 'false',
        desc: 'Allow the field to hold an empty string.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        desc: 'Placeholder shown while the field is empty.',
      },
      {
        name: 'adjustPosition',
        type: 'boolean',
        default: 'true',
        desc: 'Auto-scroll the page when the soft keyboard covers the field.',
      },
      {
        name: 'longPress',
        type: 'boolean',
        default: 'false',
        desc: 'Repeat the step while the button is held down.',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'true',
        desc: 'Emit while typing; `false` commits on blur / button only.',
      },
      {
        name: 'updateOnInit',
        type: 'boolean',
        default: 'true',
        desc: 'Emit a corrected value on mount (clamped / snapped / rounded).',
      },
      {
        name: 'inputType',
        type: "'number' | 'digit'",
        default: "'digit'",
        desc: 'Native keyboard type for the field.',
      },
      { name: 'theme', type: 'InputNumberTheme', default: "'default'", desc: 'Visual theme.' },
      { name: 'round', type: 'boolean', default: 'false', desc: 'Fully rounded action buttons.' },
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
    copy: 'InputNumber · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { InputNumber } from '@snui/uni';",
    chipCopy: "import { InputNumber } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-input-number', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-plate-input', link: '/en/components/uni/plate-input' },
    next: { text: 'sn-search', link: '/en/components/uni/search' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
