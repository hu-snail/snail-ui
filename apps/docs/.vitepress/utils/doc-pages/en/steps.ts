/** Steps (Web) — English page data. Props from SnSteps.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const stepsDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'Steps' }],
  title: 'Steps',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Step / progress indicator for multi-stage flows: wizards, checkout, onboarding, approval pipelines. ',
    },
    { t: 'code', s: 'SnSteps' },
    { t: 'text', s: ' owns the shared flow state; each ' },
    { t: 'code', s: 'SnStep' },
    { t: 'text', s: ' child renders one indicator + its title/description.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/steps',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Steps.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Steps } from '@snui/vue-web';
</script>

<template>
  <Steps />
</template>`,
  },
  demos: [
    { name: 'steps-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'steps-web-vertical', title: 'Vertical layout', blurb: 'Vertical layout' },
    { name: 'steps-web-size', title: 'Size', blurb: 'Size' },
    { name: 'steps-web-content-placement', title: 'Content placement', blurb: 'Content placement' },
    { name: 'steps-web-content', title: 'Rich content', blurb: 'Rich content' },
    { name: 'steps-web-custom-icon', title: 'Custom icon', blurb: 'Custom icon' },
    { name: 'steps-web-status', title: 'Status overview', blurb: 'Status overview' },
    { name: 'steps-web-clickable', title: 'Clickable', blurb: 'Clickable' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'current',
        type: 'number',
        default: 'undefined as any',
        desc: 'Index of the current (active) step. 1-based, mirrors n-steps.',
      },
      {
        name: 'status',
        type: "'process' | 'finish' | 'error' | 'wait'",
        default: "'process'",
        desc: "Status applied to the current step. Falls back to each step's own `status` prop, then 'process'. Mirrors n-steps `status`.",
      },
      {
        name: 'size',
        type: "'small' | 'medium'",
        default: "'medium'",
        desc: 'Visual size of the indicators. Mirrors n-steps `size`.',
      },
      {
        name: 'vertical',
        type: 'boolean',
        default: 'false',
        desc: 'Lay the steps out vertically. Mirrors n-steps `vertical`.',
      },
      {
        name: 'contentPlacement',
        type: "'right' | 'bottom'",
        default: "'right'",
        desc: 'Where the title sits relative to the indicator (horizontal only). Mirrors n-steps `contentPlacement`.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnSteps.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:current',
        payload: '(current: number)',
        desc: 'Fired when the current step changes via a click; supports `v-model:current`.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnSteps.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Default slot: a sequence of `<SnStep>` children.' },
      {
        name: 'finish-icon',
        props: '—',
        desc: 'Custom icon for finished steps (replaces the default check mark).',
      },
      {
        name: 'error-icon',
        props: '—',
        desc: 'Custom icon for errored steps (replaces the default cross).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Steps ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Steps } from '@snui/vue-web';",
    chipCopy: "import { Steps } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Steps', tone: 'accent' },
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
