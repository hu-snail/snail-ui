/**
 * SortButton 排序按钮（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-sort-button.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const sortButtonDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'SortButton 排序按钮' },
  ],
  title: 'SortButton 排序按钮',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-sort-button 三态排序：1 升序 / 0 重置 / -1 降序；默认在升序与降序之间切换。',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-sort-button',
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
    fileLabel: 'SortButton 排序按钮.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SortButton } from '@snui/uni';
</script>

<template>
  <sn-sort-button />
</template>`,
  },
  demos: [
    {
      name: 'sort-button-mp-basic',
      title: '基础用法',
      blurb: 'sn-sort-button 三态排序：1 升序 / 0 重置 / -1 降序；默认在升序与降序之间切换。',
    },
    {
      name: 'sort-button-mp-cycle',
      title: '排序循环（`allowReset` / `descFirst`）',
      blurb: 'allowReset 把 0 纳入循环；descFirst 首次点击进入降序。',
    },
    {
      name: 'sort-button-mp-line',
      title: '下划线（`line`）',
      blurb: 'line 给按钮文字加下划线。',
    },
    {
      name: 'sort-button-mp-custom-style',
      title: '根节点自定义类名与样式（`customClass` / `customStyle`）',
      blurb:
        'customClass 追加在根节点上；customStyle 是根节点内联样式，可覆盖内边距 / 底色 / 圆角。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'SortButtonValue', default: '0', desc: '-1`' },
      { name: 'title', type: 'string', default: "''", desc: 'Button label.' },
      { name: 'allowReset', type: 'boolean', default: 'false', desc: '循环是否包含重置态' },
      { name: 'descFirst', type: 'boolean', default: 'false', desc: '优先切换到降序' },
      { name: 'line', type: 'boolean', default: 'false', desc: '显示下划线' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SortButton 排序按钮 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { SortButton } from '@snui/uni';",
    chipCopy: "import { SortButton } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-sort-button', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Upload', link: '/components/uni/upload' },
    next: { text: 'Signature', link: '/components/uni/signature' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
