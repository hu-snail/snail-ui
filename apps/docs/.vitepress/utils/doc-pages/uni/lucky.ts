/**
 * Lucky 抽奖九宫格（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-lucky.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const luckyDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '业务组件 Business' },
    { text: 'Lucky 抽奖九宫格' },
  ],
  title: 'Lucky 抽奖九宫格',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '点击中间按钮开始；' },
    { t: 'code', s: 'start' },
    { t: 'text', s: ' 后在宿主请求结果，再调用 ' },
    { t: 'code', s: 'stop(index)' },
    { t: 'text', s: '，落定触发 ' },
    { t: 'code', s: 'end(index)' },
    { t: 'text', s: '。奖品沿周长顺时针排列，中间按钮占位。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-lucky',
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
    fileLabel: 'Lucky 抽奖九宫格.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Lucky } from '@snui/uni';
</script>

<template>
  <sn-lucky />
</template>`,
  },
  demos: [
    {
      name: 'lucky-mp',
      title: '代码演示',
      blurb: '3×3 九宫格，play/stop 两段式动画，自定义格子插槽。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'rows', type: 'number', default: '3', desc: '行数（≥3）。' },
      { name: 'cols', type: 'number', default: '3', desc: '列数（≥3）。' },
      {
        name: 'prizes',
        type: 'SnLuckyPrize[]',
        default: '() => []',
        desc: '奖品列表（沿周长顺序排列，不足的格子显示占位）。',
      },
      { name: 'gutter', type: 'string', default: "'8rpx'", desc: '格子间距。' },
      { name: 'cellHeight', type: 'string', default: "'120rpx'", desc: '格子高度。' },
      { name: 'speed', type: 'number', default: '60', desc: '循环高亮步进间隔（ms）。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Lucky 抽奖九宫格 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Lucky } from '@snui/uni';",
    chipCopy: "import { Lucky } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-lucky', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-scratchcard', link: '/components/uni/scratchcard' },
    next: { text: 'sn-typing', link: '/components/uni/typing' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
