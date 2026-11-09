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
    {
      name: 'notification-web-basic',
      title: '代码演示',
      blurb: 'Provider 包裹 + 四种类型通知触发 + destroyAll',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: 'NotificationType | undefined',
        default: "'default'",
        desc: 'Semantic type — drives the built-in icon + colour.',
      },
      {
        name: 'title',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Bold heading line.',
      },
      {
        name: 'content',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Primary body text. Replaced by the default slot.',
      },
      {
        name: 'description',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Secondary body text under `content`.',
      },
      {
        name: 'meta',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Small footer-left caption.',
      },
      {
        name: 'duration',
        type: 'number | undefined',
        default: '3000',
        desc: 'Auto-destroy delay in ms. `<= 0` disables the countdown.',
      },
      {
        name: 'closable',
        type: 'boolean | undefined',
        default: 'true',
        desc: 'Render the close button.',
      },
      {
        name: 'keepAliveOnHover',
        type: 'boolean | undefined',
        default: 'true',
        desc: 'Pause the countdown while hovered.',
      },
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
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
