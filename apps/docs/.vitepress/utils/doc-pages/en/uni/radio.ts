/** Radio · uni-app (uni-app) — English page data. Props from sn-radio.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const radioDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Radio · uni-app' },
  ],
  title: 'Radio · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The radio pair for uni-app (H5 / WeChat MP / App): ' },
    { t: 'code', s: 'sn-radio-group' },
    { t: 'text', s: ' (parent, owns the single-value ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ') + ' },
    { t: 'code', s: 'sn-radio' },
    { t: 'text', s: ' (child, identified by ' },
    { t: 'code', s: 'value' },
    { t: 'text', s: '). easycom auto-registration (both files live in ' },
    { t: 'code', s: 'sn-radio/' },
    { t: 'text', s: '); geometry in ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: ', colors from ' },
    { t: 'code', s: '--sn-mp-*' },
    { t: 'text', s: ' to' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-radio',
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
    fileLabel: 'Radio · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Radio } from '@snui/uni';
</script>

<template>
  <sn-radio />
</template>`,
  },
  demos: [
    {
      name: 'radio-mp-basic',
      title: 'Basic usage',
      blurb: 'sn-radio-group single-value v-model + sn-radio value.',
    },
    {
      name: 'radio-mp-type',
      title: 'Shapes (`type`: `circle` / `dot` / `square` / `button`)',
      blurb: 'Four shapes: circle / dot / square / button (button with direction=horizontal).',
    },
    {
      name: 'radio-mp-uncheck',
      title: 'Uncheck on re-tap (`allowUncheck`)',
      blurb: '`allowUncheck` clears the selection back to undefined on a second tap.',
    },
    {
      name: 'radio-mp-disabled-readonly',
      title: 'Disabled & readonly (`disabled` / `readonly`)',
      blurb: 'Whole-group `disabled` locks the group; `readonly` makes it non-interactive.',
    },
    {
      name: 'radio-mp-placement',
      title: 'Marker placement (`placement`)',
      blurb: "placement='right' moves the check marker to the right side.",
    },
    {
      name: 'radio-mp-colors',
      title: 'Checked colors (`checkedColor` / `uncheckedColor`)',
      blurb: '`checkedColor` / `uncheckedColor` flow down from the group with a per-option override.',
    },
    {
      name: 'radio-mp-custom-style',
      title: 'Custom class names & styles',
      blurb:
        '`customLabelClass` lands on the label node; `customClass` / `customStyle` on the root.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'SnRadioValue',
        default: "''",
        desc: "This option's value — matched against the group's `v-model`.",
      },
      {
        name: 'type',
        type: 'SnRadioType | undefined',
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
        name: 'placement',
        type: 'SnRadioPlacement | undefined',
        default: 'undefined',
        desc: 'Marker position. Inherits from the group when not set.',
      },
      {
        name: 'direction',
        type: 'SnRadioDirection | undefined',
        default: 'undefined',
        desc: 'Layout direction (only meaningful inside a group).',
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
    copy: 'Radio · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Radio } from '@snui/uni';",
    chipCopy: "import { Radio } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-radio', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-checkbox', link: '/en/components/uni/checkbox' },
    next: { text: 'sn-switch', link: '/en/components/uni/switch' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
