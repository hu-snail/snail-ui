/**
 * Pagination 分页（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-pagination.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const paginationDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Pagination 分页' },
  ],
  title: 'Pagination 分页',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-pagination',
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
    fileLabel: 'Pagination 分页.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Pagination } from '@snui/uni';
</script>

<template>
  <sn-pagination />
</template>`,
  },
  demos: [
    {
      name: 'pagination-mp-basic',
      title: '基础用法',
      blurb: 'v-model 绑定页码；total-page 指定总页数；show-message 显示当前页 / 总页数。',
    },
    {
      name: 'pagination-mp-variant',
      title: '按钮风格与 total 推导',
      blurb:
        'total=95 / page-size=10 → 10 页；button-variant=base 带描边并显示翻页图标；dashed 虚线风格。',
    },
    {
      name: 'pagination-mp-disabled',
      title: '禁用状态',
      blurb: 'disabled 整控件冻结；首 / 末页时翻页按钮边界禁用，箭头图标随文字一起变灰。',
    },
    {
      name: 'pagination-mp-simple',
      title: '简单模式',
      blurb: 'simple 简单模式：prev / 页码计数 / next；带计数文字与纯计数两种形态。',
    },
    {
      name: 'pagination-mp-slots',
      title: '单页隐藏与插槽自定义',
      blurb: 'hide-if-one-page 单页时整体不渲染；四个插槽自定义翻页按钮与提示。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'number', default: '1', desc: '当前页码' },
      {
        name: 'totalPage',
        type: 'number',
        default: '1',
        desc: '总页数；传入 total 时优先根据 total 与 pageSize 计算。',
      },
      { name: 'total', type: 'number', default: '0', desc: '总数据条数（优先于 `totalPage`）' },
      { name: 'pageSize', type: 'number', default: '10', desc: '每页条数' },
      {
        name: 'prevText',
        type: 'string',
        default: "''",
        desc: '上一页按钮文字；未设置时使用内置文案。',
      },
      {
        name: 'nextText',
        type: 'string',
        default: "''",
        desc: '下一页按钮文字；未设置时使用内置文案。',
      },
      { name: 'showIcon', type: 'boolean', default: 'false', desc: '是否展示翻页图标' },
      { name: 'showMessage', type: 'boolean', default: 'false', desc: '是否展示文字提示' },
      {
        name: 'buttonVariant',
        type: "'base' | 'plain' | 'dashed' | 'text'",
        default: "'text'",
        desc: '分页按钮风格：base / plain / dashed / text。',
      },
      {
        name: 'hideIfOnePage',
        type: 'boolean',
        default: 'false',
        desc: '总页数只有一页时是否隐藏。',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '整控件禁用（冻结全部交互）' },
      {
        name: 'simple',
        type: 'boolean',
        default: 'false',
        desc: '简单模式：只展示 prev / 当前页 / next，不渲染页码条。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Pagination 分页 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Pagination } from '@snui/uni';",
    chipCopy: "import { Pagination } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-pagination', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-sidebar', link: '/components/uni/sidebar' },
    next: { text: 'sn-index-bar', link: '/components/uni/index-bar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
