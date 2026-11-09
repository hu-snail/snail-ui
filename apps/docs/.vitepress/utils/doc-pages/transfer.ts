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
    {
      name: 'transfer-web-basic',
      title: '代码演示',
      blurb: 'v-model:value 双面板穿梭 + 已选顺序回显。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'options',
        type: 'SnTransferOption[]',
        default: '() => []',
        desc: 'Transferable entries. Mirrors n-transfer `options`.',
      },
      {
        name: 'value',
        type: 'SnTransferValue[] | undefined',
        default: 'undefined',
        desc: 'Selected (right-panel) values (controlled). Mirrors n-transfer `value`.',
      },
      {
        name: 'defaultValue',
        type: 'SnTransferValue[]',
        default: '() => []',
        desc: 'Initial selected values for uncontrolled mode. Mirrors n-transfer `default-value`.',
      },
      {
        name: 'filterable',
        type: 'boolean',
        default: 'false',
        desc: 'Show the per-panel filter input. Mirrors n-transfer `filterable`.',
      },
      {
        name: 'sourceFilterPlaceholder',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Filter placeholder in the source panel. Mirrors n-transfer `source-filter-placeholder`.',
      },
      {
        name: 'targetFilterPlaceholder',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Filter placeholder in the target panel. Mirrors n-transfer `target-filter-placeholder`.',
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
        desc: 'Disable every control. Mirrors n-transfer `disabled`.',
      },
      {
        name: 'sourceTitle',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Source panel title (fixed zh default). Mirrors n-transfer `source-title`.',
      },
      {
        name: 'targetTitle',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Target panel title (fixed zh default). Mirrors n-transfer `target-title`.',
      },
      {
        name: 'renderSourceLabel',
        type: 'RenderLabelFn | undefined',
        default: 'undefined',
        desc: 'Custom label renderer for source rows. Mirrors n-transfer `render-source-label`.',
      },
      {
        name: 'renderTargetLabel',
        type: 'RenderLabelFn | undefined',
        default: 'undefined',
        desc: 'Custom label renderer for target rows. Mirrors n-transfer `render-target-label`.',
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
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
