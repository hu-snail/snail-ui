/** Tree · Web (Web) — English page data. Props from tree SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const treeDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback Components' }, { text: 'Tree · Web' }],
  title: 'Tree · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Hierarchical data panel with expand/collapse, single/multiple selection,' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tree',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Tree · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tree } from '@snui/vue-web';
</script>

<template>
  <Tree />
</template>`,
  },
  demos: [
    { name: 'tree-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'tree-web-fields', title: 'Custom Fields', blurb: 'Custom Fields' },
    { name: 'tree-web-multiple', title: 'Multiple', blurb: 'Multiple' },
    { name: 'tree-web-cascade', title: 'Cascade', blurb: 'Cascade' },
    {
      name: 'tree-web-draggable',
      title: 'Drag & drop',
      blurb: 'Drag to reorder siblings or nest into folders.',
    },
    { name: 'tree-web-disabled', title: 'Disabled', blurb: 'Disabled' },
    { name: 'tree-web-prefix-suffix', title: 'Prefix & Suffix', blurb: 'Prefix & Suffix' },
    { name: 'tree-web-block-line', title: 'Block Line', blurb: 'Block Line' },
    { name: 'tree-web-line', title: 'Connector Lines', blurb: 'Connector Lines' },
    { name: 'tree-web-guide', title: 'Connector Lines', blurb: 'Connector Lines' },
    { name: 'tree-web-empty', title: 'Empty', blurb: 'Empty' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'data',
        type: 'SnTreeOption[]',
        default: '() => []',
        desc: 'Tree node data. Mirrors n-tree `data`.',
      },
      {
        name: 'keyField',
        type: 'string',
        default: "'key'",
        desc: 'Field name of the node key. Mirrors n-tree `key-field`.',
      },
      {
        name: 'labelField',
        type: 'string',
        default: "'label'",
        desc: 'Field name of the node label. Mirrors n-tree `label-field`.',
      },
      {
        name: 'childrenField',
        type: 'string',
        default: "'children'",
        desc: 'Field name of the child list. Mirrors n-tree `children-field`.',
      },
      {
        name: 'defaultExpandedKeys',
        type: 'SnTreeKey[]',
        default: '() => []',
        desc: 'Uncontrolled initially expanded keys. Mirrors n-tree `default-expanded-keys`.',
      },
      {
        name: 'expandedKeys',
        type: 'SnTreeKey[] | undefined',
        default: 'undefined',
        desc: 'Controlled expanded keys — `undefined` keeps it uncontrolled. Mirrors n-tree `expanded-keys`.',
      },
      {
        name: 'defaultExpandAll',
        type: 'boolean',
        default: 'false',
        desc: 'Expand every non-leaf node initially. Mirrors n-tree `default-expand-all`.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: 'true',
        desc: 'Allow selecting nodes by click. Mirrors n-tree `selectable`.',
      },
      {
        name: 'selectedKeys',
        type: 'SnTreeKey[] | undefined',
        default: 'undefined',
        desc: 'Controlled selected keys — `undefined` keeps it uncontrolled. Mirrors n-tree `selected-keys`.',
      },
      {
        name: 'defaultSelectedKeys',
        type: 'SnTreeKey[]',
        default: '() => []',
        desc: 'Uncontrolled initially selected keys. Mirrors n-tree `default-selected-keys`.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: 'Allow multiple selected nodes. Mirrors n-tree `multiple`.',
      },
      {
        name: 'cancelable',
        type: 'boolean',
        default: 'true',
        desc: 'Clicking a selected node deselects it. Mirrors n-tree `cancelable`.',
      },
      {
        name: 'checkable',
        type: 'boolean',
        default: 'false',
        desc: 'Render a checkbox per node. Mirrors n-tree `checkable`.',
      },
      {
        name: 'checkedKeys',
        type: 'SnTreeKey[] | undefined',
        default: 'undefined',
        desc: 'Controlled checked keys — `undefined` keeps it uncontrolled. Mirrors n-tree `checked-keys`.',
      },
      {
        name: 'defaultCheckedKeys',
        type: 'SnTreeKey[]',
        default: '() => []',
        desc: 'Uncontrolled initially checked keys. Mirrors n-tree `default-checked-keys`.',
      },
      {
        name: 'cascade',
        type: 'boolean',
        default: 'false',
        desc: 'Checkboxes cascade to children; parents show indeterminate state. Mirrors n-tree `cascade`.',
      },
      {
        name: 'blockLine',
        type: 'boolean',
        default: 'false',
        desc: 'Hover/selected background spans the whole node row. Mirrors n-tree `block-line`.',
      },
      {
        name: 'indent',
        type: 'number',
        default: '24',
        desc: 'Per-level indent width in px. Mirrors n-tree `indent`.',
      },
      {
        name: 'renderPrefix',
        type: 'SnTreeRenderSidePart | undefined',
        default: 'undefined',
        desc: 'Node prefix render fn. Mirrors n-tree `render-prefix`.',
      },
      {
        name: 'renderSuffix',
        type: 'SnTreeRenderSidePart | undefined',
        default: 'undefined',
        desc: 'Node suffix render fn. Mirrors n-tree `render-suffix`.',
      },
      {
        name: 'showLine',
        type: 'boolean',
        default: 'false',
        desc: 'Draw connector lines between parent and child rows.',
      },
      {
        name: 'lineMode',
        type: 'SnTreeLineMode',
        default: "'branch'",
        desc: 'Connector geometry: L-shaped branch lines (default) or indent guides.',
      },
      {
        name: 'lineStyle',
        type: 'SnTreeLineStyle',
        default: "'solid'",
        desc: 'Connector stroke style (solid by default).',
      },
      {
        name: 'lineCorner',
        type: 'SnTreeLineCorner',
        default: "'square'",
        desc: 'Connector elbow shape: right-angle L (default) or rounded quarter-arc.',
      },
      {
        name: 'lineColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Any CSS color / token for connector lines; overrides the CSS var fallback.',
      },
      {
        name: 'draggable',
        type: 'boolean',
        default: 'false',
        desc: 'Enable HTML5 drag & drop on rows. Mirrors n-tree `draggable`.',
      },
      {
        name: 'allowDrop',
        type: 'SnTreeAllowDrop | undefined',
        default: 'undefined',
        desc: 'Gate for drag & drop; mirrors n-tree `allow-drop`.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnTree.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:expandedKeys',
        payload:
          '(keys: SnTreeKey[], options: Array<SnTreeOption | null>, meta: { node: SnTreeOption | null; action: SnTreeExpandAction })',
        desc: 'Expansion changed; mirrors n-tree `on-update:expanded-keys`.',
      },
      {
        name: 'update:selectedKeys',
        payload:
          '(keys: SnTreeKey[], options: Array<SnTreeOption | null>, meta: { node: SnTreeOption | null; action: SnTreeSelectAction })',
        desc: 'Selection changed; mirrors n-tree `on-update:selected-keys`.',
      },
      {
        name: 'update:checkedKeys',
        payload:
          '(keys: SnTreeKey[], options: Array<SnTreeOption | null>, meta: { node: SnTreeOption | null; action: SnTreeCheckAction })',
        desc: 'Checking changed; mirrors n-tree `on-update:checked-keys`.',
      },
      {
        name: 'dragStart',
        payload: '(info: SnTreeDragInfo)',
        desc: 'A row started being dragged; mirrors n-tree `on-dragstart`.',
      },
      {
        name: 'dragEnter',
        payload: '(info: SnTreeDragInfo)',
        desc: 'A dragged row entered another row; mirrors n-tree `on-dragenter`.',
      },
      {
        name: 'dragLeave',
        payload: '(info: SnTreeDragInfo)',
        desc: 'A dragged row left another row; mirrors n-tree `on-dragleave`.',
      },
      {
        name: 'dragEnd',
        payload: '(info: SnTreeDragInfo)',
        desc: 'A drag ended (dropped or cancelled); mirrors n-tree `on-dragend`.',
      },
      {
        name: 'drop',
        payload: '(info: SnTreeDropInfo)',
        desc: 'A row was dropped on another row; mirrors n-tree `on-drop`.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnTree.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'empty', props: '—', desc: 'Rendered when `data` produces no rows.' }],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tree · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tree } from '@snui/vue-web';",
    chipCopy: "import { Tree } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Tree', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'timeline', link: '/en/components/web/timeline' },
    next: { text: 'infinite-scroll', link: '/en/components/web/infinite-scroll' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
