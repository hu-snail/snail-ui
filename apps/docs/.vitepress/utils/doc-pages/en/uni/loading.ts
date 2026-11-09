/** Loading · uni-app (uni-app) — English page data. Props from sn-loading.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const loadingDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Loading · uni-app' },
  ],
  title: 'Loading · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Defaults to the ' },
    { t: 'code', s: 'circular' },
    { t: 'text', s: ' ring; ' },
    { t: 'code', s: 'type' },
    { t: 'text', s: ' switches between the four shapes.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-loading',
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
    fileLabel: 'Loading · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Loading } from '@snui/uni';
</script>

<template>
  <sn-loading />
</template>`,
  },
  demos: [
    {
      name: 'loading-mp-basic',
      title: 'Basic usage',
      blurb: 'circular / spinner / dots / wave — the four spinner shapes.',
    },
    {
      name: 'loading-mp-text',
      title: 'Text, direction and size',
      blurb: 'text label, horizontal layout, size, color and the default slot.',
    },
    {
      name: 'loading-mp-custom',
      title: 'Inherited color and custom class names',
      blurb:
        'inherit-color from the parent / root class and inline style / scaling the spinner alone.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'type', type: 'LoadingType', default: "'circular'", desc: 'Spinner shape.' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Spinner color override (any CSS color value).',
      },
      {
        name: 'size',
        type: 'number | string',
        default: "''",
        desc: 'Base size — a bare number is treated as rpx, a string passes through.',
      },
      {
        name: 'text',
        type: 'string',
        default: "''",
        desc: 'Text shown next to / below the spinner.',
      },
      {
        name: 'direction',
        type: 'LoadingDirection',
        default: "'vertical'",
        desc: 'Layout direction of spinner + text.',
      },
      {
        name: 'inheritColor',
        type: 'boolean',
        default: 'false',
        desc: "Inherit the parent's `color` instead of the token default.",
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
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customSpinnerClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the spinner box only.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Loading · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Loading } from '@snui/uni';",
    chipCopy: "import { Loading } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-loading', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-action-sheet', link: '/en/components/uni/action-sheet' },
    next: { text: 'sn-progress', link: '/en/components/uni/progress' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
