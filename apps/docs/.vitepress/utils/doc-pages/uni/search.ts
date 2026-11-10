/**
 * Search 搜索框（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-search.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const searchDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Search 搜索框' }],
  title: 'Search 搜索框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '跨 uni-app 多端的搜索输入框。easycom 自动注册（' },
    { t: 'code', s: 'components/sn-search/sn-search.vue' },
    { t: 'text', s: ' → ' },
    { t: 'code', s: '<sn-search>' },
    { t: 'text', s: '），几何值使用 ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: '，颜色全部走 ' },
    { t: 'code', s: '--sn-mp-*' },
    { t: 'text', s: ' token。组件只负责输入与事件，真正的查询由宿主在 ' },
    { t: 'code', s: 'search' },
    { t: 'text', s: ' 事件里执行。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-search',
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
    fileLabel: 'Search 搜索框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Search } from '@snui/uni';
</script>

<template>
  <sn-search />
</template>`,
  },
  demos: [
    { name: 'search-mp-basic', title: '基础用法', blurb: 'v-model 绑定 + search 事件。' },
    {
      name: 'search-mp-variant',
      title: '变体（`variant`：`plain` / `filled` / `light`）',
      blurb: '三种 variant：plain / filled / light。',
    },
    {
      name: 'search-mp-cancel-states',
      title: '取消文案与状态（`cancelTxt` / `hideCancel` / `placeholderLeft` / `disabled`）',
      blurb: 'cancelTxt + cancel 事件；hideCancel；placeholderLeft；disabled。',
    },
    {
      name: 'search-mp-input-attrs',
      title: '输入属性（`maxlength` / `focus` / `focusWhenClear` / `customInputClass`）',
      blurb:
        'maxlength 限制字符数；focus 挂载即聚焦；focusWhenClear 清空后重新聚焦；customInputClass 追加到内部输入节点。',
    },
    {
      name: 'search-mp-placeholder-style',
      title:
        '占位文本与根节点样式（`placeholderStyle` / `placeholderClass` / `customClass` / `customStyle`）',
      blurb:
        'placeholderStyle / placeholderClass 只作用于占位文本；customClass / customStyle 改根包装的外框与底色。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Bound query text (v-model).' },
      {
        name: 'customInputClass',
        type: 'string',
        default: "''",
        desc: 'Class on the inner native `<input>`.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'搜索'",
        desc: 'Placeholder text. wd-search defaults to `搜索`.',
      },
      {
        name: 'cancelTxt',
        type: 'string',
        default: "'取消'",
        desc: 'Text of the right-hand cancel button.',
      },
      {
        name: 'variant',
        type: "'plain' | 'filled' | 'light'",
        default: "'plain'",
        desc: 'Visual variant: `plain` (bordered), `filled` (tinted) or `light`.',
      },
      { name: 'hideCancel', type: 'boolean', default: 'false', desc: '隐藏右侧取消文案。' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用，阻断所有交互事件。' },
      { name: 'maxlength', type: 'number | string', default: '-1', desc: '`-1`' },
      {
        name: 'placeholderLeft',
        type: 'boolean',
        default: 'false',
        desc: '占位符左对齐（默认居中）。',
      },
      { name: 'focus', type: 'boolean', default: 'false', desc: '挂载即聚焦。' },
      {
        name: 'focusWhenClear',
        type: 'boolean',
        default: 'false',
        desc: '清空后自动聚焦（uni 端为占位实现）。',
      },
      {
        name: 'placeholderStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style declarations for the placeholder pseudo-element.',
      },
      {
        name: 'placeholderClass',
        type: 'string',
        default: "''",
        desc: 'Class applied to the placeholder pseudo-element.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Search 搜索框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Search } from '@snui/uni';",
    chipCopy: "import { Search } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-search', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-input-number', link: '/components/uni/input-number' },
    next: { text: 'sn-checkbox', link: '/components/uni/checkbox' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
