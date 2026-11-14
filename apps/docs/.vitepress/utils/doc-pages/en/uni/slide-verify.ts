/** SlideVerify · uni-app x (uni-app x) — English page data. Props from sn-slide-verify.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const slideVerifyDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'SlideVerify · uni-app x' },
  ],
  title: 'SlideVerify · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Drag-to-confirm: reaching the right edge (within ' },
    { t: 'code', s: 'tolerance' },
    { t: 'text', s: ') fires ' },
    { t: 'code', s: 'success' },
    { t: 'text', s: '; a short drag fires ' },
    { t: 'code', s: 'fail' },
    { t: 'text', s: ' and snaps back.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-slide-verify',
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
    fileLabel: 'SlideVerify · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SlideVerify } from '@snui/uni';
</script>

<template>
  <sn-slide-verify />
</template>`,
  },
  demos: [
    {
      name: 'slide-verify-mp-basic',
      title: 'Basic usage',
      blurb:
        'Drag-to-confirm: reaching the right edge (within `tolerance`) fires `success`; a short drag fires `fail` and snaps back.',
    },
    {
      name: 'slide-verify-mp-text',
      title: 'Copy (`text` / `successText`)',
      blurb: '`text` / `successText` override the built-in hint and success copy.',
    },
    {
      name: 'slide-verify-mp-color',
      title: 'Track colors (`backgroundColor`)',
      blurb:
        '`backgroundColor` / `activeBackgroundColor` override the track fill and the dragged-over tint.',
    },
    {
      name: 'slide-verify-mp-disabled',
      title: 'Disabled (`disabled`)',
      blurb: '`disabled` blocks dragging.',
    },
    {
      name: 'slide-verify-mp-icons',
      title: 'Icon glyphs (`icon` / `successIcon`)',
      blurb:
        '`icon` / `successIcon` follow the iconfont convention; `cssIcon` renders as a bare class; `iconSize` / `successIconSize` size the two glyphs independently.',
    },
    {
      name: 'slide-verify-mp-tolerance',
      title: 'Tolerance (`tolerance`)',
      blurb: '`tolerance` widens the right-edge slack (px).',
    },
    {
      name: 'slide-verify-mp-custom-style',
      title: 'Root styling',
      blurb: '`customClass` / `customStyle` land on the root node.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'tolerance',
        type: 'number',
        default: '10',
        desc: 'Pixels of slack at the right edge.',
      },
      { name: 'text', type: 'string', default: "''", desc: 'Hint text. Empty = built-in copy.' },
      {
        name: 'successText',
        type: 'string',
        default: "''",
        desc: 'Success text. Empty = built-in copy.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables dragging.' },
      {
        name: 'backgroundColor',
        type: 'string',
        default: "''",
        desc: 'Track background color (CSS color). Empty = token default.',
      },
      {
        name: 'activeBackgroundColor',
        type: 'string',
        default: "''",
        desc: 'Track background color once verified (CSS color). Empty = token default.',
      },
      {
        name: 'icon',
        type: 'string',
        default: "''",
        desc: 'Handle glyph name (iconfont). Default `double-right` upstream.',
      },
      {
        name: 'successIcon',
        type: 'string',
        default: "''",
        desc: 'Success glyph name (iconfont). Default `check-circle-fill` upstream.',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "'sn-icon'",
        desc: 'Iconfont class-name prefix.',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'Render the name as a bare CSS class (`true` = also apply the raw name).',
      },
      {
        name: 'iconSize',
        type: 'number | string',
        default: '28',
        desc: 'Handle glyph size — a bare number is rpx.',
      },
      {
        name: 'successIconSize',
        type: 'number | string',
        default: '28',
        desc: 'Success glyph size — a bare number is rpx.',
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
    copy: 'SlideVerify · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { SlideVerify } from '@snui/uni';",
    chipCopy: "import { SlideVerify } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-slide-verify', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Signature', link: '/en/components/uni/signature' },
    next: { text: 'Captcha', link: '/en/components/uni/captcha' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
