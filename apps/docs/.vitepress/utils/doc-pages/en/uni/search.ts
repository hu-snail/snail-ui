/** Search · uni-app (uni-app) — English page data. Props from sn-search.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const searchDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Search · uni-app' },
  ],
  title: 'Search · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Cross-end search field for uni-app (H5 / WeChat MP / App). easycom auto-registration (',
    },
    { t: 'code', s: 'components/sn-search/sn-search.vue' },
    { t: 'text', s: ' → ' },
    { t: 'code', s: '<sn-search>' },
    { t: 'text', s: '); geometry in ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: ', colors from ' },
    { t: 'code', s: '--sn-mp-*' },
    {
      t: 'text',
      s: ' tokens. The component only handles input and events — the actual query runs ',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-search',
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
    fileLabel: 'Search · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Search } from '@snui/uni';
</script>

<template>
  <sn-search />
</template>`,
  },
  demos: [
    { name: 'search-mp-basic', title: 'Basic usage', blurb: 'v-model binding + the search event.' },
    {
      name: 'search-mp-variant',
      title: 'Variants (`variant`: `plain` / `filled` / `light`)',
      blurb: 'Three variants: plain / filled / light.',
    },
    {
      name: 'search-mp-cancel-states',
      title: 'Cancel text & states (`cancelTxt` / `hideCancel` / `placeholderLeft` / `disabled`)',
      blurb: 'cancelTxt + cancel event; hideCancel; placeholderLeft; disabled.',
    },
    {
      name: 'search-mp-input-attrs',
      title: 'Input attributes (`maxlength` / `focus` / `focusWhenClear` / `customInputClass`)',
      blurb:
        '`maxlength` caps the character count; `focus` focuses on mount; `focusWhenClear` refocuses after clear; `customInputClass` is appended to the inner input.',
    },
    {
      name: 'search-mp-placeholder-style',
      title:
        'Placeholder text & root styling (`placeholderStyle` / `placeholderClass` / `customClass` / `customStyle`)',
      blurb:
        '`placeholderStyle` / `placeholderClass` affect only the placeholder text; `customClass` / `customStyle` restyle the root frame and fill.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Bound query text (v-model).' },
      {
        name: 'customInputClass',
        type: 'string',
        default: "''",
        desc: 'Class on the inner native `<input>`.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'搜索'",
        desc: 'Placeholder text. wd-search defaults to `搜索`.',
      },
      {
        name: 'cancelTxt',
        type: 'string',
        default: "'取消'",
        desc: 'Text of the right-hand cancel button.',
      },
      {
        name: 'variant',
        type: "'plain' | 'filled' | 'light'",
        default: "'plain'",
        desc: 'Visual variant: `plain` (bordered), `filled` (tinted) or `light`.',
      },
      {
        name: 'hideCancel',
        type: 'boolean',
        default: 'false',
        desc: 'Hide the right-hand cancel text entirely.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction; a tap on the root still emits `click`.',
      },
      {
        name: 'maxlength',
        type: 'number | string',
        default: '-1',
        desc: 'Max character length. `-1` means unlimited.',
      },
      {
        name: 'placeholderLeft',
        type: 'boolean',
        default: 'false',
        desc: 'Left-align the placeholder instead of centering it.',
      },
      { name: 'focus', type: 'boolean', default: 'false', desc: 'Focus the field on mount.' },
      {
        name: 'focusWhenClear',
        type: 'boolean',
        default: 'false',
        desc: 'Refocus the field after the clear button is tapped.',
      },
      {
        name: 'placeholderStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style declarations for the placeholder pseudo-element.',
      },
      {
        name: 'placeholderClass',
        type: 'string',
        default: "''",
        desc: 'Class applied to the placeholder pseudo-element.',
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
    copy: 'Search · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Search } from '@snui/uni';",
    chipCopy: "import { Search } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-search', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-input-number', link: '/en/components/uni/input-number' },
    next: { text: 'sn-checkbox', link: '/en/components/uni/checkbox' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
