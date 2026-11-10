/**
 * Log 日志 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const logDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Log 日志' }],
  title: 'Log 日志',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '固定高度的滚动日志查看器，支持按行渲染、触边加载与加载指示。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/log',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Log 日志.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Log } from '@snui/vue-web';
</script>

<template>
  <Log />
</template>`,
  },
  demos: [
    { name: 'log-web-size', title: '尺寸', blurb: '尺寸' },
    { name: 'log-web-event', title: '事件', blurb: '事件' },
    { name: 'log-web-scroll', title: '滚动控制', blurb: '滚动控制' },
    { name: 'log-web-loading', title: '加载中', blurb: '加载中' },
    { name: 'log-web-auto-bottom', title: '滚动到最新', blurb: '滚动到最新' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'log',
        type: 'string | undefined',
        default: 'undefined',
        desc: '日志内容，按 `\\n` 分行；非空时优先于 `lines`',
      },
      { name: 'lines', type: 'string[]', default: '() => []', desc: '按行传入日志内容' },
      { name: 'trim', type: 'boolean', default: 'false', desc: '是否去掉每行首尾空白' },
      { name: 'loading', type: 'boolean', default: 'false', desc: '是否显示加载中' },
      {
        name: 'fontSize',
        type: 'number',
        default: '14',
        desc: '文本字号（px）。对应 n-log 的 `font-size`。',
      },
      {
        name: 'lineHeight',
        type: 'number',
        default: '1.25',
        desc: '无单位行高；行仍与固定高度对齐。对应 n-log 的 `line-height`。',
      },
      { name: 'rows', type: 'number', default: '15', desc: '可视行数，决定容器高度' },
      {
        name: 'offsetTop',
        type: 'number',
        default: '0',
        desc: '距顶部触发阈值（px）。对应 n-log 的 `offset-top`。',
      },
      {
        name: 'offsetBottom',
        type: 'number',
        default: '0',
        desc: '距底部触发阈值（px）。对应 n-log 的 `offset-bottom`。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnLog.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'reach-top',
        payload: '—',
        desc: '滚动到顶部（在 `offset-top` 容差内）时触发（对齐 n-log `on-reach-top`）。',
      },
      {
        name: 'reach-bottom',
        payload: '—',
        desc: '滚动到底部（在 `offset-bottom` 容差内）时触发（对齐 n-log `on-reach-bottom`）。',
      },
      {
        name: 'require-more',
        payload: "'top' | 'bottom'",
        desc: '越过上/下容差时触发，载荷标识方向（对齐 n-log `on-require-more`）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Log 日志 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Log } from '@snui/vue-web';",
    chipCopy: "import { Log } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Log', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'list', link: '/components/web/list' },
    next: { text: 'number-animation', link: '/components/web/number-animation' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
