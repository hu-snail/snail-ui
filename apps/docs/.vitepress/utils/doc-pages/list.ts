/**
 * 列表 List 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const listDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: '列表 List' }],
  title: '列表 List',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '通用列表容器：header / 行 / footer 三段式，行内支持 prefix / suffix 槽位。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/list',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '列表 List.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { List } from '@snui/vue-web';
</script>

<template>
  <List />
</template>`,
  },
  demos: [
    { name: 'list-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'list-web-hoverable', title: '悬浮与可点击', blurb: '悬浮与可点击' },
    { name: 'list-web-border', title: '边框与分割线', blurb: '边框与分割线' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Font scale marker (emitted as a modifier class).',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'false',
        desc: '是否显示外边框（行内边距变为 12px 20px）',
      },
      { name: 'clickable', type: 'boolean', default: 'false', desc: '行是否显示可点击光标' },
      { name: 'hoverable', type: 'boolean', default: 'false', desc: '行悬浮时是否高亮' },
      {
        name: 'showDivider',
        type: 'boolean',
        default: 'true',
        desc: '在行与行之间渲染 1px 分隔线。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '列表 List 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { List } from '@snui/vue-web';",
    chipCopy: "import { List } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'List', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'video-player', link: '/components/web/video-player' },
    next: { text: 'log', link: '/components/web/log' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
