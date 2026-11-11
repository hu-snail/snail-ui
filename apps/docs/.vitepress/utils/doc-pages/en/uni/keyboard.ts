/** Keyboard · uni-app x (uni-app x) — English page data. Props from sn-keyboard.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const keyboardDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Keyboard · uni-app x' },
  ],
  title: 'Keyboard · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The bottom row always fills all three cells: a slot without an ' },
    { t: 'code', s: 'extraKey' },
    {
      t: 'text',
      s: ' renders the **collapse-to-system glyph key** (tapping it acts like the close button and fires ',
    },
    { t: 'code', s: 'close' },
    { t: 'text', s: '), so there is never a hole or an over-wide ' },
    { t: 'code', s: '0' },
    { t: 'text', s: '; the header close button shows a circ' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-keyboard',
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
    fileLabel: 'Keyboard · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Keyboard } from '@snui/uni';
</script>

<template>
  <sn-keyboard />
</template>`,
  },
  demos: [
    {
      name: 'keyboard-mp-basic',
      title: 'Basic usage',
      blurb:
        'Default numeric keypad: bottom row [collapse][0][⌫], `maxlength` caps the value; pair it with a read-only field.',
    },
    {
      name: 'keyboard-mp-decimal',
      title: 'Decimal (`extraKey="."`)',
      blurb: '`extraKey=.` takes the bottom-left slot for amount input.',
    },
    {
      name: 'keyboard-mp-idcard',
      title: 'ID number (`extraKey="X"`)',
      blurb: '`extraKey=X` provides the checksum-digit key; `maxlength=18` for ID numbers.',
    },
    {
      name: 'keyboard-mp-car-custom',
      title: 'Car & custom modes (`mode` / `extraKey` / `autoSwitchLang`)',
      blurb:
        '`mode=car` shows the plate keypad and `autoSwitchLang` flips to letters after the province; `mode=custom` adds a large action column and `extraKey` appends a key.',
    },
    {
      name: 'keyboard-mp-labels',
      title: 'Key labels (deleteText / closeText)',
      blurb: 'deleteText / closeText; zIndex.',
    },
    {
      name: 'keyboard-mp-delete-key',
      title: 'Delete key toggle (showDeleteKey)',
      blurb: 'showDeleteKey=false renders no delete key.',
    },
    {
      name: 'keyboard-mp-random-order',
      title: 'Shuffled keys (randomKeyOrder)',
      blurb: 'randomKeyOrder shuffles the digit keys.',
    },
    {
      name: 'keyboard-mp-scrim',
      title: 'Scrim & sheet behaviour',
      blurb:
        'modal; hideOnClickOutside=false; lockScroll=false; safeAreaInsetBottom; rootPortal; customClass / customStyle.',
    },
    {
      name: 'keyboard-mp-close-loading',
      title: 'Close-button loading (closeButtonLoading)',
      blurb: 'closeButtonLoading: spinner in the close key, with an optional close-text.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Visibility (`v-model:visible`).',
      },
      { name: 'modelValue', type: 'string', default: "''", desc: 'Current value (`v-model`).' },
      { name: 'title', type: 'string', default: "''", desc: 'Keyboard title.' },
      { name: 'mode', type: 'KeyboardMode', default: "'default'", desc: 'Layout preset.' },
      { name: 'zIndex', type: 'number', default: '100', desc: 'Stacking level.' },
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
        name: 'closeText',
        type: 'string',
        default: "''",
        desc: 'Close button label (header, or the custom-mode action column).',
      },
      { name: 'deleteText', type: 'string', default: "''", desc: 'Delete key label.' },
      {
        name: 'closeButtonLoading',
        type: 'boolean',
        default: 'false',
        desc: 'Show a spinner in the close button while pending.',
      },
      { name: 'modal', type: 'boolean', default: 'false', desc: 'Render an opaque scrim.' },
      {
        name: 'hideOnClickOutside',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping outside the panel closes the keyboard.',
      },
      {
        name: 'lockScroll',
        type: 'boolean',
        default: 'true',
        desc: 'Intercept touchmove on the scrim so the page behind cannot scroll.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the keyboard for the device safe area.',
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
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the panel.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the panel cannot leave the page's document flow. Forwarded to `sn-popup`, which declares the same parity-only prop.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Keyboard · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Keyboard } from '@snui/uni';",
    chipCopy: "import { Keyboard } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-keyboard', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'CodeInput', link: '/en/components/uni/code-input' },
    next: { text: 'KeyboardPanel', link: '/en/components/uni/keyboard-panel' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
