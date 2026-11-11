/**
 * NumberAnimation 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const numberAnimationDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'NumberAnimation 数字动画' },
  ],
  title: 'NumberAnimation 数字动画',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '数值动画：数字从 ' },
    { t: 'code', s: 'from' },
    { t: 'text', s: ' 缓动滚动到 ' },
    { t: 'code', s: 'to' },
    { t: 'text', s: '，支持精度、千分位分隔符与国际化。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/number-animation',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'NumberAnimation.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { NumberAnimation } from '@snui/vue-web';
</script>

<template>
  <NumberAnimation />
</template>`,
  },
  demos: [
    { name: 'number-animation-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'number-animation-web-precision', title: '精度', blurb: '精度' },
    { name: 'number-animation-web-separator', title: '分隔符', blurb: '分隔符' },
    { name: 'number-animation-web-intl', title: '国际化', blurb: '国际化' },
    { name: 'number-animation-web-finish', title: '结束回调', blurb: '结束回调' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'to', type: 'number', default: '0', desc: '目标值' },
      { name: 'precision', type: 'number', default: '0', desc: '小数位数' },
      {
        name: 'showSeparator',
        type: 'boolean',
        default: 'false',
        desc: '整数部分按语言环境加千分位。对应 n-number-animation 的 `showSeparator`。',
      },
      {
        name: 'locale',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'BCP-47 语言（默认跟随运行时 locale）',
      },
      { name: 'from', type: 'number', default: '0', desc: '起始值' },
      { name: 'active', type: 'boolean', default: 'true', desc: '是否播放动画（true 时从头开始）' },
      { name: 'duration', type: 'number', default: '2000', desc: '动画时长 ms（非响应式）' },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnNumberAnimation.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [{ name: 'finish', payload: '—', desc: '动画到达 `to` 时触发。' }],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'NumberAnimation 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { NumberAnimation } from '@snui/vue-web';",
    chipCopy: "import { NumberAnimation } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'NumberAnimation', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'log', link: '/components/web/log' },
    next: { text: 'qr-code', link: '/components/web/qr-code' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
