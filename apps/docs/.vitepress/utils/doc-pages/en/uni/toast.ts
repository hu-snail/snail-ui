/** Toast · uni-app (uni-app) — English page data. Props from sn-toast.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const toastDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Toast · uni-app' },
  ],
  title: 'Toast · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Centred and horizontal by default; auto-closes after ' },
    { t: 'code', s: 'duration' },
    { t: 'text', s: ' ms. ' },
    { t: 'code', s: 'duration=0' },
    { t: 'text', s: ' keeps it open (tapping emits ' },
    { t: 'code', s: 'click' },
    { t: 'text', s: ').' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-toast',
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
    fileLabel: 'Toast · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Toast } from '@snui/uni';
</script>

<template>
  <sn-toast />
</template>`,
  },
  demos: [
    {
      name: 'toast-mp-basic',
      title: 'Basic usage',
      blurb:
        'Plain text / success icon (top) / loading icon, vertical (bottom, never auto-closes).',
    },
    {
      name: 'toast-mp-icon',
      title: 'Icons and loading shapes',
      blurb: 'Four status glyphs and four loading shapes.',
    },
    {
      name: 'toast-mp-icon-style',
      title: 'Glyph size & colors',
      blurb: 'icon-size / icon-color and loading-size / loading-color.',
    },
    {
      name: 'toast-mp-cover',
      title: 'Click-blocking scrim (`cover`)',
      blurb: 'cover renders a transparent full-screen scrim that blocks taps.',
    },
    {
      name: 'toast-mp-z-index',
      title: 'Stacking & styling',
      blurb: 'z-index=300 plus a custom-style inline style.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the toast is shown (v-model). Component-form counterpart of `show`.',
      },
      { name: 'msg', type: 'string', default: "''", desc: 'Message text.' },
      {
        name: 'duration',
        type: 'number',
        default: '2000',
        desc: 'Auto-close delay in ms; `0` keeps the toast open.',
      },
      {
        name: 'direction',
        type: 'ToastDirection',
        default: "'horizontal'",
        desc: 'Layout direction of icon + text.',
      },
      {
        name: 'iconName',
        type: 'ToastIconType',
        default: "''",
        desc: 'Built-in icon kind; empty renders no icon.',
      },
      {
        name: 'iconSize',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Icon size (bare number = rpx, string passes through).',
      },
      {
        name: 'loadingType',
        type: 'ToastLoadingType',
        default: "'circular'",
        desc: 'Spinner shape used when `iconName` is `loading`.',
      },
      {
        name: 'loadingColor',
        type: 'string',
        default: "''",
        desc: 'Spinner color (any CSS color value).',
      },
      {
        name: 'loadingSize',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Spinner size (bare number = rpx, string passes through).',
      },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: 'Status glyph color (any CSS color value).',
      },
      {
        name: 'position',
        type: 'ToastPosition',
        default: "'middle'",
        desc: 'Anchor of the toast box.',
      },
      { name: 'zIndex', type: 'number', default: '100', desc: 'Stacking level.' },
      {
        name: 'cover',
        type: 'boolean',
        default: 'false',
        desc: 'Render a transparent full-screen scrim that blocks the page behind.',
      },
      {
        name: 'iconClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the icon node (parity; uni icons are IconData).',
      },
      {
        name: 'classPrefix',
        type: 'string',
        default: "'wd-icon'",
        desc: 'Icon class prefix (parity; inert on the uni end).',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'CSS-icon mode (parity; inert on the uni end).',
      },
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'Instance id used by the function API (parity only, no effect here).',
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
        desc: 'Custom inline style for the toast box.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Toast · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Toast } from '@snui/uni';",
    chipCopy: "import { Toast } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-toast', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-circle', link: '/en/components/uni/circle' },
    next: { text: 'sn-notify', link: '/en/components/uni/notify' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
