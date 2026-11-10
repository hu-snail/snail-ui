/**
 * 时间线 Timeline 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const timelineDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: '时间线 Timeline' },
  ],
  title: '时间线 Timeline',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '事件轨道：节点圆点 + 连接线，每项可带标题、正文、时间与语义色。支持纵向 / 横向、',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/timeline',
    },
  ],
  usage: {
    hint: [],
    fileLabel: '时间线 Timeline.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Timeline } from '@snui/vue-web';
</script>

<template>
  <Timeline />
</template>`,
  },
  demos: [
    { name: 'timeline-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'timeline-web-size', title: '尺寸', blurb: '尺寸' },
    { name: 'timeline-web-customize-dot', title: '自定义节点', blurb: '自定义节点' },
    { name: 'timeline-web-customize-line', title: '自定义轴线风格', blurb: '自定义轴线风格' },
    { name: 'timeline-web-item-placement', title: '轨道位置', blurb: '轨道位置' },
    { name: 'timeline-web-mode', title: '时间轴展示类型', blurb: '时间轴展示类型' },
    { name: 'timeline-web-label', title: '纵向时间轴（标签）', blurb: '纵向时间轴（标签）' },
    { name: 'timeline-web-horizontal', title: '横向时间轴', blurb: '横向时间轴' },
    { name: 'timeline-web-label-position', title: '标签文本位置', blurb: '标签文本位置' },
    { name: 'timeline-web-customize-icon', title: '自定义图标', blurb: '自定义图标' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'direction',
        type: "'vertical' | 'horizontal'",
        default: '—',
        desc: 'Layout axis. Wins over the legacy `horizontal` flag when set.',
      },
      {
        name: 'mode',
        type: "'left' | 'right' | 'top' | 'bottom' | 'alternate'",
        default: '—',
        desc: 'Which side the rail (the axis) sits on — the content takes the opposite side — or `alternate` to flip per item (an item `position` overrides its parity). Vertical reads left / right, horizontal reads top / bottom; off-axis values are normalized. Wins over the legacy `item-placement`.',
      },
      {
        name: 'labelPosition',
        type: "'same' | 'relative'",
        default: "'relative'",
        desc: 'Where item labels render: across the axis from the content (`relative`, default) or on the content side next to the rail (`same`).',
      },
      {
        name: 'horizontal',
        type: 'boolean',
        default: 'false',
        desc: '兼容保留：水平排布（推荐 `direction`）',
      },
      {
        name: 'itemPlacement',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Legacy: which side the rail sits on (vertical mode only). `mode` preferred.',
      },
      {
        name: 'size',
        type: "'medium' | 'large'",
        default: "'medium'",
        desc: 'Title scale of the items.',
      },
      { name: 'iconSize', type: 'number', default: '—', desc: '节点 / 图标的边长（px）。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnTimeline.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'default', props: '—', desc: '`<SnTimelineItem>` 子项（直接子节点）。' }],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: '时间线 Timeline 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Timeline } from '@snui/vue-web';",
    chipCopy: "import { Timeline } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Timeline', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'time', link: '/components/web/time' },
    next: { text: 'tree', link: '/components/web/tree' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
