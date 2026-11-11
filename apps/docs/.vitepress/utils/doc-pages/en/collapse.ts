/** Collapse (Web) — English page data. Props from SnCollapse.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const collapseDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Layout' }, { text: 'Collapse' }],
  title: 'Collapse',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Collapsible content groups. Each ' },
    { t: 'code', s: 'SnCollapseItem' },
    {
      t: 'text',
      s: ' renders a header (title + caret) and a body (default slot) toggled by clicking the header. Used for FAQ sections, sidebar groups, settings panes.',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/collapse',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Collapse.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Collapse } from '@snui/vue-web';
</script>

<template>
  <Collapse />
</template>`,
  },
  demos: [
    { name: 'collapse-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'collapse-web-accordion', title: 'Accordion mode', blurb: 'Accordion mode' },
    { name: 'collapse-web-bordered', title: 'Bordered', blurb: 'Bordered' },
    {
      name: 'collapse-web-trigger',
      title: 'Hover trigger',
      blurb: 'trigger="hover" expands on mouseenter.',
    },
    {
      name: 'collapse-web-display-directive',
      title: 'Display directive',
      blurb: 'displayDirective="show" keeps the DOM mounted and toggles display.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'expandedNames',
        type: 'Array<string | number>',
        default: '() => []',
        desc: 'Names of currently expanded items (controlled).',
      },
      {
        name: 'defaultExpandedNames',
        type: 'Array<string | number>',
        default: '() => []',
        desc: 'Initial expanded names (uncontrolled).',
      },
      {
        name: 'accordion',
        type: 'boolean',
        default: 'false',
        desc: 'Allow expanding only one item at a time. Mirrors n-collapse `accordion`.',
      },
      {
        name: 'arrowPlacement',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Where to place the expand arrow. Mirrors n-collapse `arrowPlacement`.',
      },
      {
        name: 'trigger',
        type: "'click' | 'hover'",
        default: "'click'",
        desc: 'Trigger mode. Mirrors n-collapse `trigger`.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'false',
        desc: 'Whether to render a bordered container around the collapse group. Mirrors n-collapse `bordered`. Default false.',
      },
      {
        name: 'displayDirective',
        type: "'show' | 'if'",
        default: "'if'",
        desc: "How to render collapsed content: 'show' uses display (keeps DOM, cheap to toggle); 'if' uses v-if (saves DOM but re-mount cost on each toggle). Mirrors n-collapse `displayDirective`. Default 'if'.",
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnCollapse.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:expandedNames',
        payload: '(Array<string | number>)',
        desc: 'Fired with the complete next name array when the expanded set changes.',
      },
      {
        name: 'itemHeaderClick',
        payload: '(string | number)',
        desc: 'Fired with the item `name` when a header is clicked.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnCollapse.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'default', props: '—', desc: 'Sequence of `<SnCollapseItem>` children.' }],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Collapse ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Collapse } from '@snui/vue-web';",
    chipCopy: "import { Collapse } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Collapse', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
