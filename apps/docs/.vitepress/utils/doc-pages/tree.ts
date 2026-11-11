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
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
    { name: 'tree-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'tree-web-fields', title: '自定义字段名', blurb: '自定义字段名' },
    { name: 'tree-web-multiple', title: '多选', blurb: '多选' },
    { name: 'tree-web-cascade', title: '级联勾选', blurb: '级联勾选' },
    { name: 'tree-web-draggable', title: '拖拽节点', blurb: '拖拽调整顺序 / 移入文件夹。' },
    { name: 'tree-web-disabled', title: '禁用与状态', blurb: '禁用与状态' },
    { name: 'tree-web-prefix-suffix', title: '前缀与后缀', blurb: '前缀与后缀' },
    {
      name: 'tree-web-block-line',
      title: '整行选中（block-line）',
      blurb: '整行选中（block-line）',
    },
    { name: 'tree-web-line', title: '连接线（show-line）', blurb: '连接线（show-line）' },
    { name: 'tree-web-guide', title: '连接线（show-line）', blurb: '连接线（show-line）' },
    { name: 'tree-web-empty', title: '空状态', blurb: '空状态' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'data', type: 'SnTreeOption[]', default: '() => []', desc: '树节点数据' },
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
        desc: '初始展开的节点（非受控）',
      },
      {
        name: 'expandedKeys',
        type: 'SnTreeKey[] | undefined',
        default: 'undefined',
        desc: '展开的节点 key。',
      },
      { name: 'defaultExpandAll', type: 'boolean', default: 'false', desc: '初始展开全部非叶节点' },
      { name: 'selectable', type: 'boolean', default: 'true', desc: '点击节点是否可选中' },
      {
        name: 'selectedKeys',
        type: 'SnTreeKey[] | undefined',
        default: 'undefined',
        desc: '选中的节点 key。',
      },
      {
        name: 'defaultSelectedKeys',
        type: 'SnTreeKey[]',
        default: '() => []',
        desc: '初始选中节点（非受控）',
      },
      { name: 'multiple', type: 'boolean', default: 'false', desc: '允许多选节点' },
      {
        name: 'cancelable',
        type: 'boolean',
        default: 'true',
        desc: '再次点击已选中节点是否取消选中',
      },
      { name: 'checkable', type: 'boolean', default: 'false', desc: '显示节点复选框' },
      {
        name: 'checkedKeys',
        type: 'SnTreeKey[] | undefined',
        default: 'undefined',
        desc: '勾选的节点 key。',
      },
      {
        name: 'defaultCheckedKeys',
        type: 'SnTreeKey[]',
        default: '() => []',
        desc: '初始勾选节点（非受控）',
      },
      {
        name: 'cascade',
        type: 'boolean',
        default: 'false',
        desc: '勾选向下级联；父级按子级勾选状态呈现全选/半选',
      },
      { name: 'blockLine', type: 'boolean', default: 'false', desc: '悬停/选中背景铺满整行' },
      { name: 'indent', type: 'number', default: '24', desc: '每一级缩进宽度（px）' },
      {
        name: 'renderPrefix',
        type: 'SnTreeRenderSidePart | undefined',
        default: 'undefined',
        desc: '节点前缀渲染函数',
      },
      {
        name: 'renderSuffix',
        type: 'SnTreeRenderSidePart | undefined',
        default: 'undefined',
        desc: '节点后缀渲染函数',
      },
      {
        name: 'showLine',
        type: 'boolean',
        default: 'false',
        desc: '显示父子节点连接线（L 形引导线）',
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
        desc: '连接线颜色（任意 CSS 色值或 token）；覆盖 `--sn-web-tree-line-color`',
      },
      { name: 'draggable', type: 'boolean', default: 'false', desc: '开启行的 HTML5 拖拽' },
      {
        name: 'allowDrop',
        type: 'SnTreeAllowDrop | undefined',
        default: 'undefined',
        desc: '拖拽 / 放置闸门；默认禁止拖入叶节点',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnTree.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:expandedKeys',
        payload:
          '(keys: SnTreeKey[], options: Array<SnTreeOption | null>, meta: { node: SnTreeOption | null; action: SnTreeExpandAction })',
        desc: '展开状态变化时触发；对齐 n-tree `on-update:expanded-keys`。',
      },
      {
        name: 'update:selectedKeys',
        payload:
          '(keys: SnTreeKey[], options: Array<SnTreeOption | null>, meta: { node: SnTreeOption | null; action: SnTreeSelectAction })',
        desc: '选中状态变化时触发；对齐 n-tree `on-update:selected-keys`。',
      },
      {
        name: 'update:checkedKeys',
        payload:
          '(keys: SnTreeKey[], options: Array<SnTreeOption | null>, meta: { node: SnTreeOption | null; action: SnTreeCheckAction })',
        desc: '勾选状态变化时触发；对齐 n-tree `on-update:checked-keys`。',
      },
      {
        name: 'dragStart',
        payload: '(info: SnTreeDragInfo)',
        desc: '行开始被拖拽时触发；对齐 n-tree `on-dragstart`。',
      },
      {
        name: 'dragEnter',
        payload: '(info: SnTreeDragInfo)',
        desc: '拖拽行进入另一行时触发；对齐 n-tree `on-dragenter`。',
      },
      {
        name: 'dragLeave',
        payload: '(info: SnTreeDragInfo)',
        desc: '拖拽行离开另一行时触发；对齐 n-tree `on-dragleave`。',
      },
      {
        name: 'dragEnd',
        payload: '(info: SnTreeDragInfo)',
        desc: '拖拽结束（放下或取消）时触发；对齐 n-tree `on-dragend`。',
      },
      {
        name: 'drop',
        payload: '(info: SnTreeDropInfo)',
        desc: '行被放到另一行上时触发；对齐 n-tree `on-drop`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnTree.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'empty', props: '—', desc: '`data` 无可用行时渲染。' }],
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
