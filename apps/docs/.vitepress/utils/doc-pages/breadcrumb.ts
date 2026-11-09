/**
 * Breadcrumb 面包屑 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const breadcrumbDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Breadcrumb 面包屑' },
  ],
  title: 'Breadcrumb 面包屑',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnBreadcrumb' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'SnBreadcrumbItem' },
    {
      t: 'text',
      s: ' 展示当前位置在层级结构中的路径，并提供逐级返回的入口。每项自行渲染尾随分隔符。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/breadcrumb',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Breadcrumb 面包屑.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Breadcrumb } from '@snui/vue-web';
</script>

<template>
  <Breadcrumb />
</template>`,
  },
  demos: [
    {
      name: 'breadcrumb-web-basic',
      title: '实时预览',
      blurb: '默认分隔符 / 自定义分隔符 / 最后一页不可点',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'separator',
        type: 'string',
        default: "'/'",
        desc: 'Separator glyph between items. Mirrors n-breadcrumb `separator`.',
      },
      {
        name: 'maxCount',
        type: 'number',
        default: 'Infinity',
        desc: 'Maximum number of items to display. When the total exceeds this count, the trail renders as `head(1) + ellipsis + tail(maxCount-1)` — the middle items are folded into a single `…` affordance. Default Infinity (show all). AUI extension beyond n-breadcrumb (naive-ui handles long breadcrumbs via a dropdown slot on the middle item; this prop gives consumers a faster declarative cap). Algorithm matches Element Plus `max-count` / NextUI `maxItems`: - head always shows the first 1 item - tail shows the last `maxCount - 1` items - everything between is collapsed into an ellipsis',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Breadcrumb 面包屑 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Breadcrumb } from '@snui/vue-web';",
    chipCopy: "import { Breadcrumb } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Breadcrumb', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'menu', link: '/components/web/menu' },
    next: { text: 'tabs', link: '/components/web/tabs' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
