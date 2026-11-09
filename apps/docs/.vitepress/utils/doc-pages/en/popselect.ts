/** Popselect · Web (Web) — English page data. Props from popselect SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const popselectDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Popselect · Web' },
  ],
  title: 'Popselect · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Click to open, single selection. The selected row is marked with primary text and a check glyph; the menu closes after committing.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/popselect',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Popselect · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popselect } from '@snui/vue-web';
</script>

<template>
  <Popselect />
</template>`,
  },
  demos: [
    { name: 'popselect-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    {
      name: 'popselect-web-multiple',
      title: 'Multiple and scrolling',
      blurb: 'Multiple and scrolling',
    },
    { name: 'popselect-web-groups', title: 'Grouped options', blurb: 'Grouped options' },
    { name: 'popselect-web-render', title: 'Custom row rendering', blurb: 'Custom row rendering' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'options',
        type: 'SnSelectOptionInput[]',
        default: '() => []',
        desc: 'Option list — bare values or `{ label, value, disabled, children }` records. Mirrors n-popselect `options`.',
      },
      {
        name: 'value',
        type: 'SnPopselectValue | undefined',
        default: 'undefined',
        desc: 'Selected value(s). When `undefined`, falls back to uncontrolled mode. Mirrors n-popselect `value`.',
      },
      {
        name: 'defaultValue',
        type: 'SnPopselectValue | undefined',
        default: 'undefined',
        desc: 'Initial value for uncontrolled mode. Mirrors n-popselect `defaultValue`. Default: `[]` when `multiple`, else `null`.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: 'Toggle / multi-select mode. Mirrors n-popselect `multiple`.',
      },
      {
        name: 'trigger',
        type: "'click' | 'hover' | 'manual' | 'focus'",
        default: "'click'",
        desc: "What gesture opens the menu. Mirrors n-popselect `trigger`. Default 'click'.",
      },
      {
        name: 'placement',
        type: 'SnPopselectPlacement',
        default: "'bottom'",
        desc: "Where to render the menu relative to the trigger. Mirrors n-popselect `placement`. Default 'bottom'.",
      },
      {
        name: 'scrollable',
        type: 'boolean',
        default: 'false',
        desc: 'Cap the menu height and scroll overflowing rows. Mirrors n-popselect `scrollable`. Default false.',
      },
      {
        name: 'renderLabel',
        type: 'SnPopselectRenderLabel | undefined',
        default: 'undefined',
        desc: 'Custom row label renderer. Mirrors n-popselect `renderLabel`.',
      },
      {
        name: 'renderOption',
        type: 'SnPopselectRenderOption | undefined',
        default: 'undefined',
        desc: 'Wrapper for the whole default row. Mirrors n-popselect `renderOption`.',
      },
      {
        name: 'menuProps',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Attributes spread onto the listbox element.',
      },
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Whether the menu is shown. When `undefined`, falls back to uncontrolled mode. Mirrors n-popselect `show`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Popselect · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Popselect } from '@snui/vue-web';",
    chipCopy: "import { Popselect } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Popselect', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'popconfirm', link: '/en/components/web/popconfirm' },
    next: { text: 'avatar-group', link: '/en/components/web/avatar-group' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
