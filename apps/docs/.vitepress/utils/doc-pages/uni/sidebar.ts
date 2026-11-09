/**
 * Sidebar 侧边导航（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-sidebar.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const sidebarDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Sidebar 侧边导航' },
  ],
  title: 'Sidebar 侧边导航',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '打开 ' },
    { t: 'code', s: 'scroll-spy' },
    {
      t: 'text',
      s: ' 后，左侧高亮跟随右侧内容区的位置，而不只是用户的最近一次点击：宿主把滚动距离写进 ',
    },
    { t: 'code', s: 'scroll-top' },
    { t: 'text', s: '（' },
    { t: 'code', s: 'scroll-view' },
    { t: 'text', s: ' 的 ' },
    { t: 'code', s: '@scroll' },
    { t: 'text', s: ' 或页面 ' },
    { t: 'code', s: 'onPageScroll' },
    { t: 'text', s: '），每个条目用 ' },
    { t: 'code', s: 'anchor' },
    { t: 'text', s: ' 声明它负责的内容区块 ' },
    { t: 'code', s: 'id' },
    { t: 'text', s: '，容器用 ' },
    { t: 'code', s: 'anchor-selector' },
    { t: 'text', s: ' 一次量出这些区块的相对位置，解析出当前该高亮的条目。组件既不监听 ' },
    { t: 'code', s: 'window' },
    { t: 'text', s: '，也不持有滚动容器 —— 两端各自负责自己那半。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-sidebar',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Sidebar 侧边导航.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Sidebar } from '@snui/uni';
</script>

<template>
  <sn-sidebar />
</template>`,
  },
  demos: [
    {
      name: 'sidebar-mp-basic',
      title: '基础用法',
      blurb: 'v-model 绑定 value；sn-sidebar-item 的 label 渲染文案；右侧面板由 change 驱动。',
    },
    {
      name: 'sidebar-mp-badge',
      title: '图标与徽标',
      blurb: 'icon 图标；badge 数字徽标；is-dot 点状徽标；disabled 禁用选项。',
    },
    {
      name: 'sidebar-mp-guard',
      title: '切换拦截与 select 方法',
      blurb: 'before-change 拦截前两次切换；ref.select() 从代码切换；max 控制徽标上限。',
    },
    {
      name: 'sidebar-mp-scroll',
      title: '滚动联动（scroll-spy）',
      blurb: '滚动右侧内容区，左侧高亮自动跟随；点条目由 before-change 把内容区滚到目标区块。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'SnSidebarValue', default: '0', desc: '当前激活项的值。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      {
        name: 'scrollSpy',
        type: 'boolean',
        default: 'false',
        desc: '打开右侧内容区滚动联动（scroll-spy）：`scrollTop` 变化时自动切换高亮。 需要 item 声明 `anchor` 且 `anchorSelector` 能匹配到内容区块。',
      },
      {
        name: 'scrollTop',
        type: 'number',
        default: '0',
        desc: '内容区滚动距离（px），由宿主的 `scroll-view` `@scroll` 或页面 `onPageScroll` 上报。`scrollSpy` 打开时作为联动输入。',
      },
      {
        name: 'anchorSelector',
        type: 'string',
        default: "''",
        desc: '内容区块的 CSS 选择器，每个区块的 `id` 需与 item 的 `anchor` 一致。',
      },
      {
        name: 'scrollThreshold',
        type: 'number',
        default: '0',
        desc: '激活判定的额外偏移（px），例如顶部吸顶头部的高度：区块顶部进入该偏移 范围即视为激活。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Sidebar 侧边导航 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Sidebar } from '@snui/uni';",
    chipCopy: "import { Sidebar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-sidebar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-segmented', link: '/components/uni/segmented' },
    next: { text: 'sn-pagination', link: '/components/uni/pagination' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
