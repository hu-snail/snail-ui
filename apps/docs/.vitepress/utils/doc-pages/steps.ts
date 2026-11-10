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
    { name: 'steps-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'steps-web-vertical', title: '垂直布局', blurb: '垂直布局' },
    { name: 'steps-web-size', title: '尺寸', blurb: '尺寸' },
    { name: 'steps-web-content-placement', title: '内容位置', blurb: '内容位置' },
    { name: 'steps-web-content', title: '富文本内容', blurb: '富文本内容' },
    { name: 'steps-web-custom-icon', title: '自定义图标', blurb: '自定义图标' },
    { name: 'steps-web-status', title: '状态总览', blurb: '状态总览' },
    { name: 'steps-web-clickable', title: '可点击切换', blurb: '可点击切换' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'current',
        type: 'number',
        default: '—',
        desc: '当前步骤索引（从 1 开始，对应 n-steps）。',
      },
      {
        name: 'status',
        type: "'process' | 'finish' | 'error' | 'wait'",
        default: "'process'",
        desc: '当前步骤的状态；未设置时取每个步骤自身的 `status`，再回退到 process。',
      },
      { name: 'size', type: "'small' | 'medium'", default: "'medium'", desc: '指示器的视觉尺寸。' },
      { name: 'vertical', type: 'boolean', default: 'false', desc: '竖向排列步骤。' },
      {
        name: 'contentPlacement',
        type: "'right' | 'bottom'",
        default: "'right'",
        desc: '标题相对指示器的位置（仅横向布局）。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnSteps.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:current',
        payload: '(current: number)',
        desc: '当前步骤变化时触发（点击可点击的步骤），支持 `v-model:current`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnSteps.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '默认插槽：一组 `<SnStep>` 子步骤。' },
      { name: 'finish-icon', props: '—', desc: '自定义已完成步骤的图标，替换默认对勾。' },
      { name: 'error-icon', props: '—', desc: '自定义出错步骤的图标，替换默认叉号。' },
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
