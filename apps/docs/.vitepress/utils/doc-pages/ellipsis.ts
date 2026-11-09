/**
 * Ellipsis 文本省略 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const ellipsisDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Ellipsis 文本省略' },
  ],
  title: 'Ellipsis 文本省略',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '把文本截断在一行或 N 行内，溢出时通过气泡展示完整内容，也可点击原地展开。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/ellipsis',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Ellipsis 文本省略.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Ellipsis } from '@snui/vue-web';
</script>

<template>
  <Ellipsis />
</template>`,
  },
  demos: [
    { name: 'ellipsis-web-basic', title: '基础截断', blurb: '基础截断' },
    { name: 'ellipsis-web-lines', title: '单行与多行对照', blurb: '单行与多行对照' },
    { name: 'ellipsis-web-expand', title: '点击展开与收起', blurb: '点击展开与收起' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'expandTrigger',
        type: "'click' | 'none'",
        default: "'none'",
        desc: "Whether clicking the text toggles the expanded state. Mirrors n-ellipsis `expandTrigger`. Default 'none'.",
      },
      {
        name: 'lineClamp',
        type: 'number',
        default: '1',
        desc: '截断行数，`1` 为单行省略，大于 1 为多行省略',
      },
      {
        name: 'tooltip',
        type: 'boolean | SnEllipsisTooltipOptions',
        default: 'true',
        desc: '是否显示浮层提示。',
      },
      {
        name: 'width',
        type: "number | 'screen' | undefined",
        default: 'undefined',
        desc: "Box width; a number is px, 'screen' is 100vw. Mirrors n-ellipsis `width`.",
      },
      {
        name: 'fade',
        type: 'boolean',
        default: 'false',
        desc: '截断边缘烟雾渐隐（多行在底部，单行在行尾）',
      },
      {
        name: 'expandPosition',
        type: "'suffix' | 'bottom' | 'none'",
        default: "'none'",
        desc: "Where the expand / collapse toggle renders: `suffix` (inline, flush with the last text line), `bottom` (its own row below the text), or `none` (no toggle — use `expandTrigger` on the text). Default 'none'.",
      },
      {
        name: 'expandText',
        type: 'string | undefined',
        default: 'undefined',
        desc: '收起状态的展开操作文案',
      },
      {
        name: 'collapseText',
        type: 'string | undefined',
        default: 'undefined',
        desc: '展开状态的收起操作文案',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Ellipsis 文本省略 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Ellipsis } from '@snui/vue-web';",
    chipCopy: "import { Ellipsis } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Ellipsis', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'watermark', link: '/components/web/watermark' },
    next: { text: 'virtual-list', link: '/components/web/virtual-list' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
