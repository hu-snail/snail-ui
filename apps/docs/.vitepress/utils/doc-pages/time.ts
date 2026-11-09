/**
 * Time 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const timeDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Time' }],
  title: 'Time',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '时间格式化：把时间戳 / Date 渲染成日期时间、纯日期或相对时间，默认输出原生 ' },
    { t: 'code', s: '<time>' },
    { t: 'text', s: ' 元素。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/time',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Time.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Time } from '@snui/vue-web';
</script>

<template>
  <Time />
</template>`,
  },
  demos: [
    { name: 'time-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'time-web-type', title: '类型', blurb: '类型' },
    { name: 'time-web-format', title: '格式化', blurb: '格式化' },
    { name: 'time-web-relative', title: '相对时间', blurb: '相对时间' },
    { name: 'time-web-unix', title: 'Unix 时间戳', blurb: 'Unix 时间戳' },
    { name: 'time-web-timezone', title: '时区', blurb: '时区' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'time',
        type: 'number | Date | undefined',
        default: 'undefined',
        desc: 'Time to render (ms timestamp or Date). Defaults to the mount time. Mirrors n-time `time`.',
      },
      {
        name: 'type',
        type: "'relative' | 'date' | 'datetime'",
        default: "'datetime'",
        desc: 'Rendered representation. Mirrors n-time `type`.',
      },
      {
        name: 'to',
        type: 'number | Date | undefined',
        default: 'undefined',
        desc: 'Base time for `type="relative"`. Defaults to the mount time. Mirrors n-time `to`.',
      },
      {
        name: 'unix',
        type: 'boolean',
        default: 'false',
        desc: 'Interpret `time` / `to` as unix timestamps in seconds. Mirrors n-time `unix`.',
      },
      {
        name: 'format',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Custom format string (date-fns token subset, see header). Mirrors n-time `format`.',
      },
      {
        name: 'text',
        type: 'boolean',
        default: 'false',
        desc: 'Render a bare text node instead of a `<time>` element. Mirrors n-time `text`.',
      },
      {
        name: 'timeZone',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'IANA time zone used when formatting. Mirrors n-time `timeZone`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Time 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Time } from '@snui/vue-web';",
    chipCopy: "import { Time } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Time', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'thing', link: '/components/web/thing' },
    next: { text: 'timeline', link: '/components/web/timeline' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
