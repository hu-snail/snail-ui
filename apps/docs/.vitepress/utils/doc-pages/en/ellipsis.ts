/** Ellipsis · Web (Web) — English page data. Props from ellipsis SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const ellipsisDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Ellipsis · Web' },
  ],
  title: 'Ellipsis · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Clamps text to one or N lines, reveals the full content in a tooltip on' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/ellipsis',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Ellipsis · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Ellipsis } from '@snui/vue-web';
</script>

<template>
  <Ellipsis />
</template>`,
  },
  demos: [
    { name: 'ellipsis-web-basic', title: 'Basic clamping', blurb: 'Basic clamping' },
    {
      name: 'ellipsis-web-lines',
      title: 'Single line vs multi-line',
      blurb: 'Single line vs multi-line',
    },
    {
      name: 'ellipsis-web-expand',
      title: 'Click to expand and collapse',
      blurb: 'Click to expand and collapse',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'expandTrigger',
        type: "'click' | 'none'",
        default: "'none'",
        desc: "Whether clicking the text toggles the expanded state. Mirrors n-ellipsis `expandTrigger`. Default 'none'.",
      },
      {
        name: 'lineClamp',
        type: 'number',
        default: '1',
        desc: 'Row count before clamping. 1 = single line. Mirrors n-ellipsis `lineClamp`. Default 1.',
      },
      {
        name: 'tooltip',
        type: 'boolean | SnEllipsisTooltipOptions',
        default: 'true',
        desc: 'Show a tooltip with the full text when the content overflows. `true` uses the defaults; an object forwards SnTooltip props. Mirrors n-ellipsis `tooltip`. Default true.',
      },
      {
        name: 'width',
        type: "number | 'screen' | undefined",
        default: 'undefined',
        desc: "Box width; a number is px, 'screen' is 100vw. Mirrors n-ellipsis `width`.",
      },
      {
        name: 'fade',
        type: 'boolean',
        default: 'false',
        desc: 'Smoke mask over the clamped edge so the text fades out instead of ending at a hard cut: bottom fade for multi-line clamps, right fade for the single line. Default false.',
      },
      {
        name: 'expandPosition',
        type: "'suffix' | 'bottom' | 'none'",
        default: "'none'",
        desc: "Where the expand / collapse toggle renders: `suffix` (inline, flush with the last text line), `bottom` (its own row below the text), or `none` (no toggle — use `expandTrigger` on the text). Default 'none'.",
      },
      {
        name: 'expandText',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Toggle label while collapsed. Defaults to the locale 展开.',
      },
      {
        name: 'collapseText',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Toggle label while expanded. Defaults to the locale 收起.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnEllipsis.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Text content that gets clamped; mirrors naive-ui `n-ellipsis` `default`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Ellipsis · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Ellipsis } from '@snui/vue-web';",
    chipCopy: "import { Ellipsis } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Ellipsis', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'watermark', link: '/en/components/web/watermark' },
    next: { text: 'virtual-list', link: '/en/components/web/virtual-list' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
