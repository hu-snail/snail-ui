/**
 * Notification 通知 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const notificationDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Notification 通知' },
  ],
  title: 'Notification 通知',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnNotificationProvider' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'useNotification()' },
    {
      t: 'text',
      s: ' 提供全局通知：在屏幕的某个角落堆叠展示轻量反馈卡片，到时自动消失，也可以随时手动关闭。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/notification',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Notification 通知.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Notification } from '@snui/vue-web';
</script>

<template>
  <Notification />
</template>`,
  },
  demos: [
    { name: 'notification-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'notification-web-types', title: '四种语义类型', blurb: '四种语义类型' },
    { name: 'notification-web-placement', title: '堆叠方位', blurb: '堆叠方位' },
    { name: 'notification-web-max', title: '数量上限', blurb: '数量上限' },
    {
      name: 'notification-web-custom',
      title: '自定义内容与句柄关闭',
      blurb: '自定义内容与句柄关闭',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: 'NotificationType | undefined',
        default: "'default'",
        desc: 'Semantic type — drives the built-in icon + colour.',
      },
      { name: 'title', type: 'string | undefined', default: 'undefined', desc: '标题行（加粗）。' },
      { name: 'content', type: 'string | undefined', default: 'undefined', desc: '正文。' },
      {
        name: 'description',
        type: 'string | undefined',
        default: 'undefined',
        desc: '正文下方的次级说明文字。',
      },
      {
        name: 'meta',
        type: 'string | undefined',
        default: 'undefined',
        desc: '底部小字备注（如时间戳）。',
      },
      {
        name: 'avatar',
        type: '(() => unknown)',
        default: '—',
        desc: '前导头像渲染函数，由 API 选项传入。',
      },
      {
        name: 'footer',
        type: '(() => unknown)',
        default: '—',
        desc: '底部渲染函数，由 API 选项传入。',
      },
      {
        name: 'duration',
        type: 'number | undefined',
        default: '3000',
        desc: '自动关闭延时（ms）；`0` 或负数表示不自动关闭。',
      },
      {
        name: 'closable',
        type: 'boolean | undefined',
        default: 'true',
        desc: '是否渲染右上角关闭按钮。',
      },
      {
        name: 'keepAliveOnHover',
        type: 'boolean | undefined',
        default: 'true',
        desc: '指针悬停在通知上时暂停 `duration` 倒计时，移开后以剩余时间继续。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnNotification.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      { name: 'destroy', payload: '—', desc: '卡片需要被移除时触发（点击关闭或倒计时结束）。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnNotification.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'avatar', props: '—', desc: '头像区域内容，覆盖 `avatar` 渲染函数。' },
      { name: 'icon', props: '—', desc: '类型图标区域内容，覆盖内置语义图标。' },
      { name: 'header', props: '—', desc: '标题区域内容，覆盖 `title` 属性。' },
      { name: 'default', props: '—', desc: '正文内容，覆盖 `content` 属性。' },
      { name: 'footer', props: '—', desc: '底部区域内容，覆盖 `footer` 渲染函数。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Notification 通知 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Notification } from '@snui/vue-web';",
    chipCopy: "import { Notification } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Notification', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'skeleton', link: '/components/web/skeleton' },
    next: { text: 'loading-bar', link: '/components/web/loading-bar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
