/**
 * Dialer 大转盘（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-dialer.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dialerDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '业务组件 Business' },
    { text: 'Dialer 大转盘' },
  ],
  title: 'Dialer 大转盘',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '点击中心 GO 触发 ' },
    { t: 'code', s: 'click' },
    { t: 'text', s: '（此时请求后端），拿到结果调用 ' },
    { t: 'code', s: 'run(index)' },
    { t: 'text', s: '，旋转结束派发 ' },
    { t: 'code', s: 'done(index)' },
    { t: 'text', s: '。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-dialer',
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
    fileLabel: 'Dialer 大转盘.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Dialer } from '@snui/uni';
</script>

<template>
  <sn-dialer />
</template>`,
  },
  demos: [
    {
      name: 'dialer-mp',
      title: '代码演示',
      blurb: '6 奖品转盘，点击 GO 随机落点，done 展示结果。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'prizeList',
        type: 'SnDialerPrize[]',
        default: '() => []',
        desc: '奖品列表（2-12 项）。',
      },
      { name: 'turns', type: 'number', default: '5', desc: '旋转圈数。' },
      { name: 'duration', type: 'number', default: '3', desc: '旋转时长（秒）。' },
      {
        name: 'size',
        type: 'string',
        default: "'600rpx'",
        desc: '转盘直径（rpx / px 长度字符串）。',
      },
      {
        name: 'prizeBgColors',
        type: 'string[]',
        default: "() => ['#FFF0A3'",
        desc: '交替扇区背景色。',
      },
      { name: 'borderColor', type: 'string', default: "'#FFD752'", desc: '扇区描边色。' },
      { name: 'fontSize', type: 'string', default: "'24rpx'", desc: '奖品名字号。' },
      {
        name: 'color',
        type: 'string',
        default: "'var(--sn-mp-color-text-primary)'",
        desc: '奖品名颜色。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Dialer 大转盘 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Dialer } from '@snui/uni';",
    chipCopy: "import { Dialer } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-dialer', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-barcode', link: '/components/uni/barcode' },
    next: { text: 'sn-scratchcard', link: '/components/uni/scratchcard' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
