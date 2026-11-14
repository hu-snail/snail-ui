/** Signature · uni-app x (uni-app x) — English page data. Props from sn-signature.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const signatureDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Signature · uni-app x' },
  ],
  title: 'Signature · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Signature pad: touchstart / touchmove sample the points and ' },
    { t: 'code', s: 'confirm' },
    { t: 'text', s: ' reports the stroke geometry (' },
    { t: 'code', s: 'paths' },
    { t: 'text', s: ').' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-signature',
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
    fileLabel: 'Signature · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Signature } from '@snui/uni';
</script>

<template>
  <sn-signature />
</template>`,
  },
  demos: [
    {
      name: 'signature-mp-basic',
      title: 'Basic usage',
      blurb:
        'Signature pad: touchstart / touchmove sample the points and `confirm` reports the stroke geometry (`paths`).',
    },
    {
      name: 'signature-mp-history',
      title: 'Undo / redo (`enableHistory`)',
      blurb: '`enableHistory` renders the undo / redo buttons; the pad owns its own history stack.',
    },
    {
      name: 'signature-mp-pen',
      title: 'Pen look (`penColor` / `lineWidth`)',
      blurb: '`penColor` overrides the stroke color and `lineWidth` sets the width.',
    },
    {
      name: 'signature-mp-disabled',
      title: 'Disabled (`disabled`)',
      blurb: '`disabled` locks the pad and drawing is ignored.',
    },
    {
      name: 'signature-mp-button-labels',
      title:
        'Button labels (`confirmText` / `clearText` / `revokeText` / `restoreText` / `undoText` / `redoText`)',
      blurb:
        'confirmText / clearText; revokeText / restoreText under enableHistory; undoText / redoText overrides.',
    },
    {
      name: 'signature-mp-size',
      title: 'Pad size & background',
      blurb:
        '`height` (a number is an rpx design value) / `width`; `backgroundColor` overrides the pad background token.',
    },
    {
      name: 'signature-mp-scroll',
      title: 'Pad scrolling (`disableScroll`)',
      blurb: '`disableScroll=false` keeps the page scrollable while drawing.',
    },
    {
      name: 'signature-mp-step',
      title: 'Undo step (`step`)',
      blurb: 'step=2 undoes two strokes at a time (needs `enableHistory`).',
    },
    {
      name: 'signature-mp-export',
      title: 'Export params (`fileType` / `quality` / `exportScale`)',
      blurb:
        'fileType / quality / exportScale (used by the host when exporting; this build never rasterizes).',
    },
    {
      name: 'signature-mp-stroke',
      title: 'Stroke params (`pressure` / `lineWidth`)',
      blurb:
        'pressure / maxWidth / minWidth / minSpeed (pressure simulation is not implemented); `lineWidth` sets the stroke width directly.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'penColor',
        type: 'string',
        default: "''",
        desc: 'Stroke color (CSS color). Empty = `--sn-mp-color-text-primary`.',
      },
      { name: 'lineWidth', type: 'number', default: '3', desc: 'Stroke width in px design units.' },
      { name: 'confirmText', type: 'string', default: "'确认'", desc: 'Confirm button label.' },
      { name: 'clearText', type: 'string', default: "'清空'", desc: 'Clear button label.' },
      { name: 'revokeText', type: 'string', default: "'撤回'", desc: 'Undo button label.' },
      { name: 'restoreText', type: 'string', default: "'恢复'", desc: 'Redo button label.' },
      {
        name: 'undoText',
        type: 'string',
        default: "''",
        desc: 'Undo button label (`undo-text`; wins over `revokeText` when set).',
      },
      {
        name: 'redoText',
        type: 'string',
        default: "''",
        desc: 'Redo button label (`redo-text`; wins over `restoreText` when set).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables drawing and every button.',
      },
      {
        name: 'height',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Pad height. A number is an rpx design value.',
      },
      {
        name: 'width',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Pad width. A number is an rpx design value.',
      },
      {
        name: 'backgroundColor',
        type: 'string',
        default: "''",
        desc: 'Pad background color (CSS color). Empty = token default.',
      },
      {
        name: 'disableScroll',
        type: 'boolean',
        default: 'true',
        desc: 'Intercept touchmove so the page behind cannot scroll while drawing.',
      },
      {
        name: 'enableHistory',
        type: 'boolean',
        default: 'false',
        desc: 'Keep an undo / redo history.',
      },
      {
        name: 'step',
        type: 'number',
        default: '1',
        desc: 'Number of strokes undo / redo moves per tap.',
      },
      { name: 'fileType', type: "'png' | 'jpg'", default: "'png'", desc: 'Export image type.' },
      { name: 'quality', type: 'number', default: '0.92', desc: 'Export image quality, 0–1.' },
      { name: 'exportScale', type: 'number', default: '1', desc: 'Export scale factor.' },
      { name: 'pressure', type: 'boolean', default: 'false', desc: 'Enable pressure simulation.' },
      {
        name: 'maxWidth',
        type: 'number',
        default: '4',
        desc: 'Max stroke width under pressure (design px).',
      },
      {
        name: 'minWidth',
        type: 'number',
        default: '2',
        desc: 'Min stroke width under pressure (design px).',
      },
      {
        name: 'minSpeed',
        type: 'number',
        default: '1.5',
        desc: 'Minimum pointer speed before pressure widening kicks in.',
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
    copy: 'Signature · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Signature } from '@snui/uni';",
    chipCopy: "import { Signature } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-signature', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'SortButton', link: '/en/components/uni/sort-button' },
    next: { text: 'SlideVerify', link: '/en/components/uni/slide-verify' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
