/**
 * Tree 树形控件 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const treeDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Tree 树形控件' },
  ],
  title: 'Tree 树形控件',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '以缩进层级展示树形数据，支持节点展开/收起、单选/多选、以及带级联与半选态的复选勾选。',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tree',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Tree 树形控件.vue',
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
    {
      name: 'tree-web-basic',
      title: '代码演示',
      blurb: 'defaultExpandedKeys 展开父级，v-model:selected-keys 单选。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
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
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tree 树形控件 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tree } from '@snui/vue-web';",
    chipCopy: "import { Tree } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Tree', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'timeline', link: '/components/web/timeline' },
    next: { text: 'infinite-scroll', link: '/components/web/infinite-scroll' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
