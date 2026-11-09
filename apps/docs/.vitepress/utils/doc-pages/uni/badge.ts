/**
 * Badge 徽标（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-badge.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const badgeDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Badge 徽标' }],
  title: 'Badge 徽标',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '数值角标，配合 ' },
    { t: 'code', s: 'max' },
    { t: 'text', s: ' 做溢出收敛：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-badge',
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
    fileLabel: 'Badge 徽标.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Badge } from '@snui/uni';
</script>

<template>
  <sn-badge />
</template>`,
  },
  demos: [
    {
      name: 'badge-mp-basic',
      title: '基础用法',
      blurb: '数值角标：普通数值、max 溢出显示 99+、五种语义类型。',
    },
    {
      name: 'badge-mp-shape',
      title: '形态与偏移',
      blurb:
        'isDot 圆点；shape 圆 / 方 / 气泡；border 描边；top / right 偏移；bgColor 自定义底色。',
    },
    {
      name: 'badge-mp-visibility',
      title: '显隐规则',
      blurb: 'value=0 默认不显示；showZero 显示 0；hidden 强制隐藏；数值变化实时反映。',
    },
    {
      name: 'badge-mp-custom',
      title: '根节点自定义类名与样式（`customClass` / `customStyle`）',
      blurb:
        'customClass 给包裹容器加虚线框；customStyle 加内边距与底色；两者叠加；角标自身 type / bgColor / 偏移的对照。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '显示值（数字或字符串）。数字超出 `max` 时显示 `{max}+`。',
      },
      {
        name: 'max',
        type: 'number | undefined',
        default: 'undefined',
        desc: '最大值，超过后显示 `{max}+`，仅当 `value` 为数字时生效。',
      },
      {
        name: 'top',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '为正时，角标向下偏移对应像素。',
      },
      {
        name: 'right',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: '为正时，角标向左偏移对应像素。',
      },
      { name: 'isDot', type: 'boolean', default: 'false', desc: '圆点模式，不显示数值' },
      { name: 'hidden', type: 'boolean', default: 'false', desc: '隐藏角标（被包裹内容照常渲染）' },
      {
        name: 'type',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | undefined",
        default: 'undefined',
        desc: '类型：primary / success / warning / danger / info。 不设置时用危险色（红）—— 默认角标为红色。',
      },
      { name: 'bgColor', type: 'string', default: '—', desc: '角标背景色（内联覆盖）' },
      {
        name: 'showZero',
        type: 'boolean',
        default: 'false',
        desc: '是否显示 `0`（默认 `0` 不渲染角标）。',
      },
      {
        name: 'shape',
        type: "'circle' | 'square' | 'bubble'",
        default: "'circle'",
        desc: '徽标形状：circle / square / bubble。',
      },
      {
        name: 'border',
        type: 'boolean',
        default: 'false',
        desc: '是否显示描边（与背景同宽的一道分隔环）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Badge 徽标 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Badge } from '@snui/uni';",
    chipCopy: "import { Badge } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-badge', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-tag', link: '/components/uni/tag' },
    next: { text: 'sn-avatar', link: '/components/uni/avatar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
