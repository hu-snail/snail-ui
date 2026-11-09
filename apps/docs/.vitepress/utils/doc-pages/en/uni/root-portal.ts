/** RootPortal · uni-app (Mobile) (uni-app) — English page data. Props from sn-root-portal.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const rootPortalDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'RootPortal · uni-app (Mobile)' },
  ],
  title: 'RootPortal · uni-app (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The box below is ' },
    { t: 'code', s: 'overflow: hidden' },
    { t: 'text', s: ', so ordinary content is cut off. Wrapped in ' },
    { t: 'code', s: 'sn-root-portal' },
    { t: 'text', s: ', the content sits on the viewport layer and is no longer clipped.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-root-portal',
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
    fileLabel: 'RootPortal · uni-app (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { RootPortal } from '@snui/uni';
</script>

<template>
  <sn-root-portal />
</template>`,
  },
  demos: [
    {
      name: 'root-portal-mp-basic',
      title: 'Basic',
      blurb: 'Mount / unmount the portal layer and watch whether the ancestor clips the content.',
    },
    {
      name: 'root-portal-mp-custom',
      title: 'Custom class and inline style',
      blurb:
        'customClass drives the fixed layer (the preview makes it absolute so it does not cover the phone screen); customStyle adds inline styles.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: "Extra class on the fixed layer. Additive AUI hook, not part of wd-root-portal's surface: without a teleport target the layer is the only thing a caller can style, so it needs an escape hatch. Documented as additive.",
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Extra inline style on the fixed layer. Additive, same reason.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'RootPortal · uni-app (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { RootPortal } from '@snui/uni';",
    chipCopy: "import { RootPortal } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-root-portal', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-config-provider', link: '/en/components/uni/config-provider' },
    next: { text: 'sn-divider', link: '/en/components/uni/divider' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
