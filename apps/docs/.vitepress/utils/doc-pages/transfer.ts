/**
 * Transfer 穿梭框 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const transferDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Transfer 穿梭框' }],
  title: 'Transfer 穿梭框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '穿梭框用左右两个面板呈现候选项与已选项，配合全选表头、四个移动按钮与面板内搜索完成批量勾选迁移。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/transfer',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Transfer 穿梭框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Transfer } from '@snui/vue-web';
</script>

<template>
  <Transfer />
</template>`,
  },
  demos: [
    { name: 'transfer-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'transfer-web-filter', title: '搜索过滤与面板标题', blurb: '搜索过滤与面板标题' },
    { name: 'transfer-web-render', title: '自定义行渲染', blurb: '自定义行渲染' },
    { name: 'transfer-web-disabled', title: '禁用态', blurb: '禁用态' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'options', type: 'SnTransferOption[]', default: '() => []', desc: '`[]`' },
      {
        name: 'value',
        type: 'SnTransferValue[] | undefined',
        default: 'undefined',
        desc: '当前值。',
      },
      {
        name: 'defaultValue',
        type: 'SnTransferValue[]',
        default: '() => []',
        desc: '非受控模式下的初始选中值。对应 n-transfer 的 `default-value`。',
      },
      {
        name: 'filterable',
        type: 'boolean',
        default: 'false',
        desc: '显示两侧搜索框，按 `label` 做包含匹配。',
      },
      {
        name: 'sourceFilterPlaceholder',
        type: 'string | undefined',
        default: 'undefined',
        desc: '源面板的过滤占位文案。对应 n-transfer 的 `source-filter-placeholder`。',
      },
      {
        name: 'targetFilterPlaceholder',
        type: 'string | undefined',
        default: 'undefined',
        desc: '目标面板的过滤占位文案。对应 n-transfer 的 `target-filter-placeholder`。',
      },
      {
        name: 'size',
        type: 'SnTransferSize',
        default: "'medium'",
        desc: 'Visual size of rows / buttons. Mirrors n-transfer `size`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: '禁用全部控件（勾选 / 移动按钮 / 搜索）。',
      },
      {
        name: 'sourceTitle',
        type: 'string | undefined',
        default: 'undefined',
        desc: '源面板标题（中文环境为固定默认值）。对应 n-transfer 的 `source-title`。',
      },
      {
        name: 'targetTitle',
        type: 'string | undefined',
        default: 'undefined',
        desc: '目标面板标题（中文环境为固定默认值）。对应 n-transfer 的 `target-title`。',
      },
      {
        name: 'renderSourceLabel',
        type: 'RenderLabelFn | undefined',
        default: 'undefined',
        desc: '源列表行的自定义标签渲染函数。对应 n-transfer 的 `render-source-label`。',
      },
      {
        name: 'renderTargetLabel',
        type: 'RenderLabelFn | undefined',
        default: 'undefined',
        desc: '目标列表行的自定义标签渲染函数。对应 n-transfer 的 `render-target-label`。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Transfer 穿梭框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Transfer } from '@snui/vue-web';",
    chipCopy: "import { Transfer } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Transfer', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'form', link: '/components/web/form' },
    next: { text: 'drag-sort', link: '/components/web/drag-sort' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
