/**
 * Alert 提示 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const alertDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Alert 提示' }],
  title: 'Alert 提示',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnAlert' },
    { t: 'text', s: ' 是行内反馈条，用于在页面或区块内持续展示一条需要用户注意的信息。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/alert',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Alert 提示.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Alert } from '@snui/vue-web';
</script>

<template>
  <Alert />
</template>`,
  },
  demos: [
    { name: 'alert-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'alert-web-title', title: '标题显隐', blurb: '仅正文时不渲染标题行。' },
    { name: 'alert-web-bordered', title: '边框控制', blurb: '边框控制' },
    { name: 'alert-web-icon', title: '自定义图标', blurb: '自定义图标' },
    { name: 'alert-web-no-icon', title: '隐藏图标', blurb: '隐藏图标' },
    { name: 'alert-web-closable', title: '可关闭与拦截', blurb: '可关闭与拦截' },
    { name: 'alert-web-slots', title: '插槽覆盖', blurb: '插槽覆盖' },
    { name: 'alert-web-marquee', title: '滚动公告', blurb: '滚动公告' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Alert heading. Mirrors n-alert `title`.',
      },
      { name: 'showIcon', type: 'boolean', default: 'true', desc: '是否显示前置类型图标。' },
      {
        name: 'type',
        type: "'info' | 'warning' | 'error' | 'success' | 'default'",
        default: "'default'",
        desc: 'Semantic type — drives color + default icon. Mirrors n-alert `type`.',
      },
      { name: 'bordered', type: 'boolean', default: 'true', desc: '是否绘制外边框。' },
      { name: 'closable', type: 'boolean', default: 'false', desc: '是否渲染关闭按钮。' },
      {
        name: 'onClose',
        type: '() => unknown',
        default: '—',
        desc: '点击关闭时调用；返回 `false` 或 `false` 的 Promise 可阻止关闭。对齐 n-alert `onClose`。',
      },
      {
        name: 'onAfterLeave',
        type: '() => void',
        default: '—',
        desc: '离开过渡结束后调用。对齐 n-alert `onAfterLeave`。',
      },
      {
        name: 'onAfterHide (deprecated)',
        type: '() => void',
        default: '—',
        desc: '已废弃的离开回调，请改用 `onAfterLeave`。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnAlert.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'closeClick',
        payload: '—',
        desc: '点击关闭按钮时触发；在 `onClose` 否决结果返回前派发。',
      },
      { name: 'leave', payload: '—', desc: '离开过渡结束后触发，此时警告已被移除。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnAlert.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '警告主体内容。' },
      { name: 'icon', props: '—', desc: '自定义图标，替换内置的类型图标。' },
      { name: 'header', props: '—', desc: '自定义头部，替换 `title` 属性。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Alert 提示 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Alert } from '@snui/vue-web';",
    chipCopy: "import { Alert } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Alert', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'page-header', link: '/components/web/page-header' },
    next: { text: 'dialog', link: '/components/web/dialog' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
