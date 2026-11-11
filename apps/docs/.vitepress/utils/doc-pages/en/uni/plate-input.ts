/** PlateInput · uni-app (uni-app) — English page data. Props from sn-plate-input.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const plateInputDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'PlateInput · uni-app' },
  ],
  title: 'PlateInput · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Tap the box row to raise the plate keyboard: picking the first province character flips to the letter/digit layout; holding delete repeats; tapping the field again or the close button collapses it; clearing starts the next plate back on provinces.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-plate-input',
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
    fileLabel: 'PlateInput · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { PlateInput } from '@snui/uni';
</script>

<template>
  <sn-plate-input />
</template>`,
  },
  demos: [
    {
      name: 'plate-input-mp-basic',
      title: 'Basic usage',
      blurb:
        'Tap the boxes to raise the scrim-free car keyboard (province → letters auto-switch, hold-to-repeat delete); tap the field again or close to collapse.',
    },
    {
      name: 'plate-input-mp-new-energy',
      title: 'New-energy plates (`maxlength=8`)',
      blurb: '`maxlength=8` renders eight boxes for new-energy plates.',
    },
    {
      name: 'plate-input-mp-disabled',
      title: 'Disabled (`disabled`)',
      blurb: '`disabled` freezes the field; taps no longer raise the keyboard.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string',
        default: "''",
        desc: 'Current value (`v-model`), e.g. `京A12345`.',
      },
      {
        name: 'maxlength',
        type: 'number',
        default: '7',
        desc: 'Plate length in boxes — 7 for standard plates, 8 for new-energy.',
      },
      { name: 'title', type: 'string', default: "'请输入车牌号'", desc: 'Keyboard title.' },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Freeze the field (tapping no longer opens the keyboard).',
      },
      {
        name: 'visible',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Keyboard visibility (`v-model:visible`). Uncontrolled when omitted — the field opens on tap; one-way bindings keep full control.',
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
    copy: 'PlateInput · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { PlateInput } from '@snui/uni';",
    chipCopy: "import { PlateInput } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-plate-input', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-keyboard-panel', link: '/en/components/uni/keyboard-panel' },
    next: { text: 'sn-input-number', link: '/en/components/uni/input-number' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
