/**
 * Steps 步骤条 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const stepsDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Steps 步骤条' },
  ],
  title: 'Steps 步骤条',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnSteps' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'SnStep' },
    {
      t: 'text',
      s: ' 展示一个多步骤流程的进度：每个节点有标题、描述与状态，当前所处位置一目了然。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/steps',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Steps 步骤条.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Steps } from '@snui/vue-web';
</script>

<template>
  <Steps />
</template>`,
  },
  demos: [
    { name: 'steps-web-basic', title: '代码演示', blurb: '横向基础布局，状态随 current 推导' },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'status',
        type: "'process' | 'finish' | 'error' | 'wait'",
        default: 'undefined as any',
        desc: 'Explicit status override. When omitted the status is derived from the parent `SnSteps` `current` index. Mirrors n-step `status`.',
      },
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Step title text. Mirrors n-step `title`.',
      },
      {
        name: 'description',
        type: 'string',
        default: "''",
        desc: 'Step description text. Mirrors n-step `description`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable interaction (no click, dimmed). Mirrors n-step `disabled`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Steps 步骤条 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Steps } from '@snui/vue-web';",
    chipCopy: "import { Steps } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Steps', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tabs', link: '/components/web/tabs' },
    next: { text: 'tooltip', link: '/components/web/tooltip' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
