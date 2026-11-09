/** NoticeBar · uni-app (uni-app) — English page data. Props from sn-notice-bar.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const noticeBarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'NoticeBar · uni-app' },
  ],
  title: 'NoticeBar · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'With ' },
    { t: 'code', s: 'direction="vertical"' },
    { t: 'text', s: ' and a ' },
    { t: 'code', s: 'text' },
    { t: 'text', s: ' array, one line shows at a time and each rotation emits ' },
    { t: 'code', s: 'next' },
    { t: 'text', s: '.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-notice-bar',
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
    fileLabel: 'NoticeBar · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { NoticeBar } from '@snui/uni';
</script>

<template>
  <sn-notice-bar />
</template>`,
  },
  demos: [
    { name: 'notice-bar-mp-basic', title: 'Basic usage', blurb: 'Marquee / static / wrapping.' },
    {
      name: 'notice-bar-mp-type',
      title: 'Types and closing',
      blurb: 'Three tints plus a closable notice (restorable).',
    },
    {
      name: 'notice-bar-mp-vertical',
      title: 'Vertical rotation',
      blurb: 'Three announcements rotating, with the current index shown.',
    },
    {
      name: 'notice-bar-mp-marquee',
      title: 'Icon, delay and speed',
      blurb: 'Registry prefix icon / delay=3 / speed=120.',
    },
    {
      name: 'notice-bar-mp-custom',
      title: 'Custom colors and class names',
      blurb: 'Overridden text and fill color / custom-class border / custom-style radius.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'text',
        type: 'string | string[]',
        default: "''",
        desc: 'Notice text — a string or an array of lines.',
      },
      {
        name: 'type',
        type: 'NoticeBarType',
        default: "'warning'",
        desc: 'Semantic type — drives the tint.',
      },
      {
        name: 'prefix',
        type: 'string',
        default: "''",
        desc: 'Left icon name (sn-icon registry); empty falls back to the type glyph.',
      },
      {
        name: 'scrollable',
        type: 'boolean',
        default: 'true',
        desc: 'Enable the marquee. `false` shows a static (optionally wrapped) strip.',
      },
      {
        name: 'delay',
        type: 'number',
        default: '1',
        desc: 'Delay before the marquee starts, in seconds.',
      },
      {
        name: 'speed',
        type: 'number',
        default: '50',
        desc: 'Marquee speed in px per second (converted into a cycle duration).',
      },
      { name: 'closable', type: 'boolean', default: 'false', desc: 'Show the close button.' },
      {
        name: 'wrapable',
        type: 'boolean',
        default: 'false',
        desc: 'Wrap long text onto multiple lines; only applies when `scrollable` is false.',
      },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Text and icon color override (any CSS color value).',
      },
      {
        name: 'backgroundColor',
        type: 'string',
        default: "''",
        desc: 'Background color override (any CSS color value).',
      },
      {
        name: 'direction',
        type: 'NoticeBarDirection',
        default: "'horizontal'",
        desc: 'Scroll axis.',
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
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'NoticeBar · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { NoticeBar } from '@snui/uni';",
    chipCopy: "import { NoticeBar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-notice-bar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-notify', link: '/en/components/uni/notify' },
    next: { text: 'sn-empty', link: '/en/components/uni/empty' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
