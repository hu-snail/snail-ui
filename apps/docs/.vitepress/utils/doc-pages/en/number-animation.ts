/** NumberAnimation · Web (Web) — English page data. Props from number-animation SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const numberAnimationDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'NumberAnimation · Web' },
  ],
  title: 'NumberAnimation · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Animated number (n-number-animation aligned): tweens a number from ' },
    { t: 'code', s: 'from' },
    { t: 'text', s: ' to ' },
    { t: 'code', s: 'to' },
    { t: 'text', s: ' with decimal precision, thousand separators and locale support.' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/number-animation',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'NumberAnimation · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { NumberAnimation } from '@snui/vue-web';
</script>

<template>
  <NumberAnimation />
</template>`,
  },
  demos: [
    { name: 'number-animation-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'number-animation-web-precision', title: 'Precision', blurb: 'Precision' },
    { name: 'number-animation-web-separator', title: 'Separator', blurb: 'Separator' },
    { name: 'number-animation-web-intl', title: 'Locale', blurb: 'Locale' },
    { name: 'number-animation-web-finish', title: 'Finish', blurb: 'Finish' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'to',
        type: 'number',
        default: '0',
        desc: 'Target value; the animation runs from `from` towards `to`. Mirrors n-number-animation `to`.',
      },
      {
        name: 'precision',
        type: 'number',
        default: '0',
        desc: 'Digits kept after the decimal point. Mirrors n-number-animation `precision`.',
      },
      {
        name: 'showSeparator',
        type: 'boolean',
        default: 'false',
        desc: 'Format the integer part with locale thousands separators. Mirrors n-number-animation `showSeparator`.',
      },
      {
        name: 'locale',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'BCP-47 locale for Intl.NumberFormat (separators + decimal mark). Mirrors n-number-animation `locale`.',
      },
      {
        name: 'from',
        type: 'number',
        default: '0',
        desc: 'Start value. Mirrors n-number-animation `from`.',
      },
      {
        name: 'active',
        type: 'boolean',
        default: 'true',
        desc: 'Start / restart the animation. Mirrors n-number-animation `active`.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '2000',
        desc: 'Animation duration in ms (non-reactive, captured at setup). Mirrors n-number-animation `duration`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'NumberAnimation · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { NumberAnimation } from '@snui/vue-web';",
    chipCopy: "import { NumberAnimation } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'NumberAnimation', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'log', link: '/en/components/web/log' },
    next: { text: 'qr-code', link: '/en/components/web/qr-code' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
