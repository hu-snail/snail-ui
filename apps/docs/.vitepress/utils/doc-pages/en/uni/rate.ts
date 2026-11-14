/** Rate · uni-app x (uni-app x) — English page data. Props from sn-rate.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const rateDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Rate · uni-app x' }],
  title: 'Rate · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Basic sn-rate: ' },
    { t: 'code', s: 'num' },
    { t: 'text', s: ' sets the icon count, tapping an icon writes ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: '.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-rate',
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
    fileLabel: 'Rate · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Rate } from '@snui/uni';
</script>

<template>
  <sn-rate />
</template>`,
  },
  demos: [
    {
      name: 'rate-mp-basic',
      title: 'Basic usage',
      blurb: 'Basic sn-rate: `num` sets the icon count, tapping an icon writes `v-model`.',
    },
    {
      name: 'rate-mp-half',
      title: 'Half stars (`allowHalf`)',
      blurb: '`allowHalf` lets the value land on `.5` steps.',
    },
    {
      name: 'rate-mp-clearable',
      title: 'Clearable (`clearable`)',
      blurb: '`clearable` clears back to null on re-tap of the current score.',
    },
    {
      name: 'rate-mp-color',
      title: 'Rating colors (`activeColor`)',
      blurb: '`activeColor` accepts a per-icon array (red → orange → …).',
    },
    {
      name: 'rate-mp-readonly',
      title: 'Readonly (`readonly`)',
      blurb: '`readonly` blocks taps; the score is display-only.',
    },
    {
      name: 'rate-mp-space',
      title: 'Gap & full-row spread (`space` / `size` / `block`)',
      blurb:
        '`space` sets the icon gap (a number is an rpx design value ×2); `size` the glyph size; `block` spreads the icons across the row.',
    },
    {
      name: 'rate-mp-icon',
      title: 'Custom icons (`icon` / `activeIcon`)',
      blurb:
        '`icon` / `activeIcon` resolve through the sn-icon registry; `iconPrefix` is parity only; `color` / `activeColor` override the colors.',
    },
    {
      name: 'rate-mp-css-icon',
      title: 'CSS-class glyphs (`cssIcon`)',
      blurb:
        'A string `cssIcon` renders as a bare class and the boolean form applies both `icon` / `active-icon` names.',
    },
    {
      name: 'rate-mp-disabled',
      title: 'Disabled (`disabled`)',
      blurb: '`disabled` dims the icons and ignores taps.',
    },
    {
      name: 'rate-mp-custom-style',
      title: 'Root styling (`customClass` / `customStyle`)',
      blurb: '`customClass` / `customStyle` are appended to the root node.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | null',
        default: 'null',
        desc: 'Current score (`v-model`); `null` = nothing selected.',
      },
      { name: 'num', type: 'number', default: '5', desc: 'Number of icons.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — the icons render but do not react to taps.',
      },
      {
        name: 'size',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Icon size. A number is treated as a px design value.',
      },
      {
        name: 'space',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Gap between icons. A number is treated as an rpx design value.',
      },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Inactive icon color (CSS color). Empty = token default.',
      },
      {
        name: 'activeColor',
        type: 'string | string[]',
        default: "''",
        desc: 'Active icon color — a single color or one per icon.',
      },
      {
        name: 'icon',
        type: 'string',
        default: "'star'",
        desc: 'Inactive icon name (registry-resolved), default `star`.',
      },
      {
        name: 'activeIcon',
        type: 'string',
        default: "'star'",
        desc: 'Active icon name (registry-resolved), default `star`.',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: 'Icon class prefix (wd-rate parity; informational on the uni end).',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'Treat `icon` / `activeIcon` as CSS class names instead of icon names.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables every icon.' },
      { name: 'allowHalf', type: 'boolean', default: 'false', desc: 'Allow half-star selection.' },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Tapping the current score clears it back to `null`.',
      },
      {
        name: 'block',
        type: 'boolean',
        default: 'false',
        desc: 'Stretch the icons across the full row width.',
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
    copy: 'Rate · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Rate } from '@snui/uni';",
    chipCopy: "import { Rate } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-rate', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Switch', link: '/en/components/uni/switch' },
    next: { text: 'Slider', link: '/en/components/uni/slider' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
