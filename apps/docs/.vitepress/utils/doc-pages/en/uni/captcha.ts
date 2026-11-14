/** Captcha (uni-app x) — English page data. Props from sn-captcha.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const captchaDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Captcha' }],
  title: 'Captcha',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Not for: behavioural sliders (use ' },
    { t: 'code', s: 'sn-slide-verify' },
    {
      t: 'text',
      s: '), SMS / image code entry (host business), or server-side ticket validation (the host must do it).',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-captcha',
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
    fileLabel: 'Captcha.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Captcha } from '@snui/uni';
</script>

<template>
  <sn-captcha />
</template>`,
  },
  demos: [
    { name: 'captcha-mp-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'captcha-mp-verify', title: 'Inline display', blurb: 'Inline display' },
    { name: 'captcha-mp-popup', title: 'Tap to open', blurb: 'Tap to open' },
    {
      name: 'captcha-mp-interaction',
      title: 'Two-stage verification (slider chain)',
      blurb: 'Two-stage verification (slider chain)',
    },
    {
      name: 'captcha-mp-copy',
      title: 'Custom copy (tips / successText)',
      blurb: 'Custom copy (tips / successText)',
    },
    {
      name: 'captcha-mp-size-tolerance',
      title: 'Size & tolerance (width / height / tolerance)',
      blurb: 'Size & tolerance (width / height / tolerance)',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the captcha popup is shown (v-model).',
      },
      {
        name: 'src',
        type: 'string',
        default: "''",
        desc: 'Background image URL (network / package path, not base64).',
      },
      {
        name: 'width',
        type: 'number',
        default: '300',
        desc: 'Stage width in design px; the box fills its container up to this.',
      },
      { name: 'height', type: 'number', default: '200', desc: 'Stage height in design px.' },
      {
        name: 'tips',
        type: 'string',
        default: "''",
        desc: 'Hint text under the stage while dragging.',
      },
      { name: 'successText', type: 'string', default: "''", desc: 'Success text overlay.' },
      {
        name: 'tolerance',
        type: 'number',
        default: '10',
        desc: 'Snap tolerance around the target X (px design units).',
      },
      { name: 'zIndex', type: 'number', default: '100', desc: 'Stacking level of the popup.' },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Close the popup when the scrim is tapped.',
      },
      {
        name: 'refreshable',
        type: 'boolean',
        default: 'true',
        desc: 'Show the re-roll button (top-right of the stage).',
      },
      {
        name: 'inline',
        type: 'boolean',
        default: 'false',
        desc: 'Render embedded in the host layout instead of as a fixed popup — no scrim, no close button, no auto close (additive, AUI-OPT-12, AGENTS.md §112.3a). `v-model` is ignored; the host controls mounting.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Extra class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Extra inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Captcha ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Captcha } from '@snui/uni';",
    chipCopy: "import { Captcha } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-captcha', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'SlideVerify', link: '/en/components/uni/slide-verify' },
    next: { text: 'Popup', link: '/en/components/uni/popup' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
