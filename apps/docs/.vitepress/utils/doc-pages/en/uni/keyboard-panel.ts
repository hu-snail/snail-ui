/** KeyboardPanel · uni-app (uni-app) — English page data. Props from sn-keyboard-panel.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const keyboardPanelDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'KeyboardPanel · uni-app' },
  ],
  title: 'KeyboardPanel · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The bottom row always fills all three cells (same contract as ' },
    { t: 'code', s: 'sn-keyboard' },
    { t: 'text', s: '): a slot without an ' },
    { t: 'code', s: 'extraKey' },
    { t: 'text', s: ' renders the **collapse glyph key**, which emits ' },
    { t: 'code', s: 'collapse' },
    {
      t: 'text',
      s: ' here (there is no sheet to close — the host hides its own container or yields back to the syst',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-keyboard-panel',
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
    fileLabel: 'KeyboardPanel · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { KeyboardPanel } from '@snui/uni';
</script>

<template>
  <sn-keyboard-panel />
</template>`,
  },
  demos: [
    {
      name: 'keyboard-panel-mp-basic',
      title: 'Basic usage',
      blurb:
        'Embedded keypad panels: default / decimal (extraKey=.) / plate (mode=car); the glyph key emits collapse.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Current value (`v-model`).' },
      { name: 'mode', type: 'KeyboardMode', default: "'default'", desc: 'Layout preset.' },
      {
        name: 'maxlength',
        type: 'number',
        default: 'Number.POSITIVE_INFINITY',
        desc: 'Maximum value length.',
      },
      {
        name: 'showDeleteKey',
        type: 'boolean',
        default: 'true',
        desc: 'Render the delete key (default / car layouts).',
      },
      {
        name: 'randomKeyOrder',
        type: 'boolean',
        default: 'false',
        desc: 'Shuffle the digit keys.',
      },
      {
        name: 'extraKey',
        type: 'string | string[] | undefined',
        default: 'undefined',
        desc: 'Extra key(s) appended to the digit grid.',
      },
      {
        name: 'carLang',
        type: 'CarKeyboardLang',
        default: "'zh'",
        desc: "Car-plate language (`v-model:car-lang`, `mode: 'car'`).",
      },
      {
        name: 'autoSwitchLang',
        type: 'boolean',
        default: 'false',
        desc: 'Auto-switch the car language once the province is picked.',
      },
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Optional header title; the header renders only when it has content.',
      },
      { name: 'deleteText', type: 'string', default: "''", desc: 'Delete key label (aria).' },
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
    copy: 'KeyboardPanel · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { KeyboardPanel } from '@snui/uni';",
    chipCopy: "import { KeyboardPanel } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-keyboard-panel', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-keyboard', link: '/en/components/uni/keyboard' },
    next: { text: 'sn-plate-input', link: '/en/components/uni/plate-input' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
