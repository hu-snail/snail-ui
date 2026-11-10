/**
 * Popselect 气泡选择器 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const popselectDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'Popselect 气泡选择器' },
  ],
  title: 'Popselect 气泡选择器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnPopselect' },
    {
      t: 'text',
      s: ' 是锚定在触发元素上的下拉选择菜单：点击弹出白底列表，支持单选 / 多选、分组选项、键盘导航与自定义行渲染，适合工具栏筛选、轻量切换等不需要完整选择框的场景。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/popselect',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Popselect 气泡选择器.vue',
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
    { name: 'popselect-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'popselect-web-multiple', title: '多选与滚动', blurb: '多选与滚动' },
    { name: 'popselect-web-groups', title: '分组选项', blurb: '分组选项' },
    { name: 'popselect-web-render', title: '自定义行渲染', blurb: '自定义行渲染' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'options',
        type: 'SnSelectOptionInput[]',
        default: '() => []',
        desc: '选项列表：裸值或 `{ label, value, disabled, children }` 对象；`children` 非空时渲染为分组标题。',
      },
      {
        name: 'value',
        type: 'SnPopselectValue | undefined',
        default: 'undefined',
        desc: '当前值。',
      },
      {
        name: 'defaultValue',
        type: 'SnPopselectValue | undefined',
        default: 'undefined',
        desc: '非受控模式下的初始值。对应 n-popselect 的 `defaultValue`；`multiple` 时默认 `[]`，否则 `null`。',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: '是否多选。多选提交数组并保持菜单打开。',
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
        desc: '是否限制菜单最大高度并在超出时滚动。',
      },
      {
        name: 'renderLabel',
        type: 'SnPopselectRenderLabel | undefined',
        default: 'undefined',
        desc: '自定义行标签渲染函数。对应 n-popselect 的 `renderLabel`。',
      },
      {
        name: 'renderOption',
        type: 'SnPopselectRenderOption | undefined',
        default: 'undefined',
        desc: '整行默认内容的包装渲染函数。对应 n-popselect 的 `renderOption`。',
      },
      {
        name: 'menuProps',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: '透传到列表容器的属性。',
      },
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: '菜单显示状态。`undefined` 为不受控模式，由内部状态维护。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Popselect 气泡选择器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Popselect } from '@snui/vue-web';",
    chipCopy: "import { Popselect } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Popselect', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'popconfirm', link: '/components/web/popconfirm' },
    next: { text: 'avatar-group', link: '/components/web/avatar-group' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
