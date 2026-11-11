/** Popup · uni-app x (uni-app x) — English page data. Props from sn-popup.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const popupDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Popup · uni-app x' },
  ],
  title: 'Popup · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The scrim and panel use ' },
    { t: 'code', s: '--sn-mp-color-background-overlay' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: ', both overridden in the ' },
    { t: 'code', s: '.sn-theme-dark' },
    { t: 'text', s: ' block of ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    {
      t: 'text',
      s: ', so dark mode adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-popup',
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
    fileLabel: 'Popup · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popup } from '@snui/uni';
</script>

<template>
  <sn-popup />
</template>`,
  },
  demos: [
    { name: 'popup-mp-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'popup-mp-position', title: 'Positions', blurb: 'Positions' },
    {
      name: 'popup-mp-config',
      title: 'Scrim and close behaviour',
      blurb: 'Scrim and close behaviour',
    },
    {
      name: 'popup-mp-custom-style',
      title: 'Panel & scrim styling',
      blurb: 'modal-style lands on the scrim; custom-style lands on the panel.',
    },
    {
      name: 'popup-mp-render',
      title: 'Lazy render & safe area',
      blurb: 'lazy-render=false renders up front; safe-area-inset-bottom pads the sheet.',
    },
    {
      name: 'popup-mp-scroll',
      title: 'Styles, lazy render and safe area',
      blurb: 'Styles, lazy render and safe area',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the popup is visible (v-model).',
      },
      {
        name: 'transition',
        type: "PopupTransition | ''",
        default: "''",
        desc: 'Animation name; empty falls back to the default for `position`.',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        desc: "Show the close button in the panel's top-right corner.",
      },
      {
        name: 'position',
        type: 'PopupPosition',
        default: "'center'",
        desc: 'Anchor of the panel.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the scrim closes the popup (emits `click-modal` either way).',
      },
      {
        name: 'duration',
        type: 'PopupDuration',
        default: 'DEFAULT_DURATION',
        desc: 'Animation duration in ms. `false` = no animation, record = per-leg.',
      },
      { name: 'modal', type: 'boolean', default: 'true', desc: 'Render the scrim.' },
      { name: 'zIndex', type: 'number', default: '10', desc: 'Stacking level of the root node.' },
      {
        name: 'hideWhenClose',
        type: 'boolean',
        default: 'true',
        desc: 'Remove the node from the tree once the leave animation finished.',
      },
      { name: 'modalStyle', type: 'string', default: "''", desc: 'Inline style for the scrim.' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'false',
        desc: 'Pad the bottom sheet for the device safe area.',
      },
      {
        name: 'lazyRender',
        type: 'boolean',
        default: 'true',
        desc: 'Defer panel content rendering until the popup is first opened.',
      },
      {
        name: 'lockScroll',
        type: 'boolean',
        default: 'true',
        desc: 'Intercept touchmove on the scrim so the page behind cannot scroll.',
      },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: 'Rounded corners, adapted to `position`.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the panel.',
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
    copy: 'Popup · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Popup } from '@snui/uni';",
    chipCopy: "import { Popup } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-popup', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Captcha', link: '/en/components/uni/captcha' },
    next: { text: 'Overlay', link: '/en/components/uni/overlay' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
