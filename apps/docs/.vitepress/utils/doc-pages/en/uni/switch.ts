/** Switch · uni-app (uni-app) — English page data. Props from sn-switch.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const switchDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Switch · uni-app' },
  ],
  title: 'Switch · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Cross-end on/off toggle for uni-app (H5 / WeChat MP / App). easycom auto-registration (',
    },
    { t: 'code', s: 'components/sn-switch/sn-switch.vue' },
    { t: 'text', s: ' → ' },
    { t: 'code', s: '<sn-switch>' },
    { t: 'text', s: '); geometry in ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: ', colors from ' },
    { t: 'code', s: '--sn-mp-*' },
    { t: 'text', s: ' tokens.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-switch',
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
    fileLabel: 'Switch · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Switch } from '@snui/uni';
</script>

<template>
  <sn-switch />
</template>`,
  },
  demos: [
    { name: 'switch-mp-basic', title: 'Basic usage', blurb: 'v-model + the change event.' },
    {
      name: 'switch-mp-appearance',
      title:
        'Appearance (`activeText` / `inactiveText` / `shape` / `size` / `activeColor` / `inactiveColor`)',
      blurb: 'Rail text, square shape, custom size, custom colors.',
    },
    {
      name: 'switch-mp-before-change',
      title:
        'Guard & states (`activeValue` / `inactiveValue` / `beforeChange` / `loading` / `disabled`)',
      blurb: 'String activeValue/inactiveValue; beforeChange veto; loading; disabled.',
    },
    {
      name: 'switch-mp-icons',
      title: 'Icons (`activeActionIcon` / `inactiveActionIcon` / `activeIcon` / `inactiveIcon`)',
      blurb:
        'activeActionIcon / inactiveActionIcon knob glyphs; activeIcon / inactiveIcon rail glyphs; glyph mixed with a text label.',
    },
    {
      name: 'switch-mp-css-icons',
      title:
        'CSS-class icons (`activeActionCssIcon` / `inactiveActionCssIcon` / `activeCssIcon` / `inactiveCssIcon` / `classPrefix`)',
      blurb:
        'activeActionCssIcon / inactiveActionCssIcon; activeCssIcon / inactiveCssIcon; classPrefix.',
    },
    {
      name: 'switch-mp-loading-custom',
      title: 'Loading & custom styling (`loadingProps` / `customClass` / `customStyle`)',
      blurb:
        'loading (spinner in the knob); loadingProps (declared but not rendered); customClass; customStyle.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnSwitchValue',
        default: 'false',
        desc: 'Bound value — compared against `activeValue` / `inactiveValue`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction and dims the rail.',
      },
      {
        name: 'inactiveActionIcon',
        type: 'string',
        default: "''",
        desc: 'Knob icon while inactive (registry-resolved via sn-icon).',
      },
      {
        name: 'activeActionIcon',
        type: 'string',
        default: "''",
        desc: 'Knob icon while active (registry-resolved via sn-icon).',
      },
      {
        name: 'activeIcon',
        type: 'string',
        default: "''",
        desc: 'Rail icon while active — overrides `activeText`.',
      },
      {
        name: 'inactiveIcon',
        type: 'string',
        default: "''",
        desc: 'Rail icon while inactive — overrides `inactiveText`.',
      },
      {
        name: 'classPrefix',
        type: 'string',
        default: "'wd-icon'",
        desc: 'CSS class prefix used for icon lookup (wd-switch parity, informational).',
      },
      {
        name: 'inactiveActionCssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `inactiveActionIcon` is a CSS class name, not an icon name.',
      },
      {
        name: 'activeActionCssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `activeActionIcon` is a CSS class name, not an icon name.',
      },
      {
        name: 'activeCssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `activeIcon` is a CSS class name, not an icon name.',
      },
      {
        name: 'inactiveCssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `inactiveIcon` is a CSS class name, not an icon name.',
      },
      {
        name: 'activeText',
        type: 'string',
        default: "''",
        desc: 'Label shown inside the rail while active.',
      },
      {
        name: 'inactiveText',
        type: 'string',
        default: "''",
        desc: 'Label shown inside the rail while inactive.',
      },
      {
        name: 'activeValue',
        type: 'SnSwitchValue',
        default: 'true',
        desc: 'Value that means "on". Compared by strict equality.',
      },
      {
        name: 'inactiveValue',
        type: 'SnSwitchValue',
        default: 'false',
        desc: 'Value that means "off". Compared by strict equality.',
      },
      {
        name: 'activeColor',
        type: 'string',
        default: "''",
        desc: 'Active rail color (user CSS color; falls back to the token default).',
      },
      {
        name: 'inactiveColor',
        type: 'string',
        default: "''",
        desc: 'Inactive rail color (user CSS color; falls back to the token default).',
      },
      {
        name: 'size',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Rail size — a number is treated as an rpx design value.',
      },
      { name: 'shape', type: "'round' | 'square'", default: "'round'", desc: 'Rail shape.' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Shows a spinner in the knob and blocks interaction while pending.',
      },
      { name: 'color', type: 'string', default: '—', desc: 'color' },
      {
        name: 'size',
        type: 'number | string',
        default: 'undefined',
        desc: 'Rail size — a number is treated as an rpx design value.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Switch · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Switch } from '@snui/uni';",
    chipCopy: "import { Switch } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-switch', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-radio', link: '/en/components/uni/radio' },
    next: { text: 'sn-rate', link: '/en/components/uni/rate' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
