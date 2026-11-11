/**
 * Typing 输入中（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-typing.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const typingDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '业务组件 Business' },
    { text: 'Typing 输入中' },
  ],
  title: 'Typing 输入中',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '默认文案「输入中」+ 3 圆点；文案可清空只留圆点，颜色 / 数量 / 速度可调。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-typing',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Typing 输入中.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Typing } from '@snui/uni';
</script>

<template>
  <sn-typing />
</template>`,
  },
  demos: [
    { name: 'typing-mp-basic', title: '基础用法', blurb: '默认文案 + 聊天气泡占位场景。' },
    {
      name: 'typing-mp-states',
      title: '状态与事件',
      blurb: '会话模拟：发送后 peer 进入 typing 态，回复到达换上真实消息。',
    },
    { name: 'typing-mp-text', title: '文案开关（text）', blurb: 'text="" 只显示圆点。' },
    {
      name: 'typing-mp-dot-count',
      title: '圆点数量（dotCount）',
      blurb: 'dot-count 1 / 3 / 5（夹取到 1-5）。',
    },
    { name: 'typing-mp-speed', title: '脉动速度（speed）', blurb: '180ms 快 / 600ms 慢。' },
    {
      name: 'typing-mp-dot-color',
      title: '圆点颜色（activeDotColor）',
      blurb: 'active-dot-color 主题色。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'text',
        type: 'string',
        default: "'输入中'",
        desc: '随圆点一起展示的文案（空字符串则只显示圆点）。',
      },
      { name: 'dotCount', type: 'number', default: '3', desc: '圆点数量（1-5 自动夹取）' },
      { name: 'speed', type: 'number', default: '350', desc: '单点脉动周期（ms）' },
      {
        name: 'activeDotColor',
        type: 'string',
        default: "'var(--sn-mp-color-action-primary)'",
        desc: '圆点颜色（非激活观感由低透明度表达）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Typing 输入中 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Typing } from '@snui/uni';",
    chipCopy: "import { Typing } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-typing', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Lucky', link: '/components/uni/lucky' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
