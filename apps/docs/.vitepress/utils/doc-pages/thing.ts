/**
 * 东西 Thing 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const thingDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: '东西 Thing' }],
  title: '东西 Thing',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '结构化内容块：头像 / 标题 / 附加信息 / 描述 / 正文 / 尾部 / 操作七个区域。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/thing',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '东西 Thing.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Thing } from '@snui/vue-web';
</script>

<template>
  <Thing />
</template>`,
  },
  demos: [
    { name: 'thing-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'thing-web-indent', title: '内容缩进', blurb: '内容缩进' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'title', type: 'string', default: '—', desc: '标题，`header` 插槽可覆盖' },
      { name: 'titleExtra', type: 'string', default: '—', desc: '表头行末端的额外内容。' },
      { name: 'description', type: 'string', default: '—', desc: '描述，`description` 插槽可覆盖' },
      { name: 'content', type: 'string', default: '—', desc: '正文，`default` 插槽可覆盖' },
      {
        name: 'contentIndented',
        type: 'boolean',
        default: 'false',
        desc: '让整个内容列缩进到标题之下，而不是只缩进头像（需 `avatar` 插槽生效）。',
      },
      { name: 'descriptionClass', type: 'string', default: '—', desc: '描述区块附加的类名。' },
      {
        name: 'descriptionStyle',
        type: 'string | CSSProperties',
        default: '—',
        desc: '描述区块附加的样式。',
      },
      { name: 'contentClass', type: 'string', default: '—', desc: '内容区块附加的类名。' },
      {
        name: 'contentStyle',
        type: 'string | CSSProperties',
        default: '—',
        desc: '内容区块附加的样式。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '东西 Thing 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Thing } from '@snui/vue-web';",
    chipCopy: "import { Thing } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Thing', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'table', link: '/components/web/table' },
    next: { text: 'time', link: '/components/web/time' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
