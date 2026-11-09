/** TreeSelect · Web (Web) — English page data. Props from tree-select SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const treeSelectDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'TreeSelect · Web' },
  ],
  title: 'TreeSelect · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Tree selector. Teleport tree panel (indent + expand arrows), single / multiple / filterable.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tree-select',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'TreeSelect · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { TreeSelect } from '@snui/vue-web';
</script>

<template>
  <TreeSelect />
</template>`,
  },
  demos: [
    { name: 'tree-select-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'tree-select-web-multiple', title: 'Multiple', blurb: 'Multiple' },
    {
      name: 'tree-select-web-filter',
      title: 'Expand-all + filterable',
      blurb: 'Expand-all + filterable',
    },
    { name: 'tree-select-web-fields', title: 'Custom fields', blurb: 'Custom fields' },
    {
      name: 'tree-select-web-states',
      title: 'Clearable / disabled',
      blurb: 'Clearable / disabled',
    },
    { name: 'tree-select-web-line', title: 'Connector Lines', blurb: 'Connector Lines' },
    { name: 'tree-select-web-guide', title: 'Connector Lines', blurb: 'Connector Lines' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnTreeSelectValue | SnTreeSelectValue[] | null',
        default: 'null',
        desc: 'Bound value: single value / null, or array in multi mode.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: 'Allow selecting several values (tag-style display, no cascade).',
      },
      {
        name: 'checkable',
        type: 'boolean',
        default: 'false',
        desc: 'Alias of `multiple` (checkable tree mode merged into multi-select).',
      },
      {
        name: 'options',
        type: 'SnTreeSelectOptionInput[]',
        default: '() => []',
        desc: 'Tree option list ({ label, key | value, disabled?, children? }).',
      },
      {
        name: 'defaultExpandAll',
        type: 'boolean',
        default: 'false',
        desc: 'Expand every parent on first render (non-controlled expansion).',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Please select'",
        desc: 'Placeholder text when empty.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Show the clear (×) button when a value is present.',
      },
      {
        name: 'filterable',
        type: 'boolean',
        default: 'false',
        desc: 'Enable the internal filter input (label match + ancestor expand).',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — opens nothing, commits nothing.',
      },
      { name: 'size', type: 'SnTreeSelectSize', default: "'medium'", desc: 'Visual size preset.' },
      {
        name: 'status',
        type: 'SnTreeSelectStatus',
        default: "'default'",
        desc: 'Validation-driven visual status.',
      },
      {
        name: 'labelField',
        type: 'string',
        default: "'label'",
        desc: 'Field remapping for option labels.',
      },
      {
        name: 'keyField',
        type: 'string',
        default: "'key'",
        desc: 'Field remapping for option keys (falls back to `value` field).',
      },
      {
        name: 'childrenField',
        type: 'string',
        default: "'children'",
        desc: 'Field remapping for child nodes.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible name for the trigger.',
      },
      {
        name: 'emptyText',
        type: 'string',
        default: "'No data'",
        desc: 'Empty-state text (overridden by the `empty` slot).',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
      {
        name: 'showLine',
        type: 'boolean',
        default: 'false',
        desc: 'Draw connector lines between parent and child rows.',
      },
      {
        name: 'lineMode',
        type: 'SnTreeSelectLineMode',
        default: "'branch'",
        desc: 'Connector geometry: L-shaped branch lines (default) or indent guides.',
      },
      {
        name: 'lineStyle',
        type: 'SnTreeSelectLineStyle',
        default: "'solid'",
        desc: 'Connector stroke style (solid by default).',
      },
      {
        name: 'lineCorner',
        type: 'SnTreeSelectLineCorner',
        default: "'square'",
        desc: 'Connector elbow shape: right-angle L (default) or rounded quarter-arc.',
      },
      {
        name: 'lineColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Any CSS color / token for connector lines; overrides the CSS var fallback.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'TreeSelect · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { TreeSelect } from '@snui/vue-web';",
    chipCopy: "import { TreeSelect } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'TreeSelect', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'cascader', link: '/en/components/web/cascader' },
    next: { text: 'time-picker', link: '/en/components/web/time-picker' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
