/**
 * Checkbox 复选框（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-checkbox.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const checkboxDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Checkbox 复选框' }],
  title: 'Checkbox 复选框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '跨 uni-app 多端的复选组件对：' },
    { t: 'code', s: 'sn-checkbox-group' },
    { t: 'text', s: '（父，持有数组 ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: '）+ ' },
    { t: 'code', s: 'sn-checkbox' },
    { t: 'text', s: '（子，' },
    { t: 'code', s: 'name' },
    { t: 'text', s: ' 为标识）。easycom 自动注册（同目录下 ' },
    { t: 'code', s: 'sn-checkbox/' },
    { t: 'text', s: '），几何值使用 ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: '，颜色全部走 ' },
    { t: 'code', s: '--sn-mp-*' },
    { t: 'text', s: ' token。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-checkbox',
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
    fileLabel: 'Checkbox 复选框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Checkbox } from '@snui/uni';
</script>

<template>
  <sn-checkbox />
</template>`,
  },
  demos: [
    {
      name: 'checkbox-mp-basic',
      title: '基础用法',
      blurb: 'sn-checkbox-group 数组 v-model + sn-checkbox name。',
    },
    {
      name: 'checkbox-mp-type',
      title: '形状（`type`：`circle` / `square` / `button` / `dot`）',
      blurb: '四种形状：circle / square / button / dot。',
    },
    {
      name: 'checkbox-mp-group-limits',
      title:
        '数量限制与状态（`min` / `max` / `disabled` / `readonly` / `indeterminate` / `toggleAll`）',
      blurb:
        'min/max 限制；整组 disabled / readonly；indeterminate 半选；toggleAll 全选 / 全不选。',
    },
    {
      name: 'checkbox-mp-standalone-style',
      title:
        '独立用法与剩余属性（`v-model` / `trueValue` / `falseValue` / `checkedColor` / `size` / `placement` / `maxWidth`）',
      blurb:
        '独立 v-model 与 trueValue / falseValue；checkedColor / uncheckedColor；size large、placement right；maxWidth + customLabelClass；customClass / customStyle。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'SnCheckboxValue', default: 'false', desc: '绑定值。' },
      {
        name: 'name',
        type: 'SnCheckboxValue',
        default: "''",
        desc: 'Identity inside `sn-checkbox-group` (also the standalone value).',
      },
      { name: 'type', type: 'SnCheckboxType | undefined', default: 'undefined', desc: '类型。' },
      {
        name: 'checkedColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: '选中颜色（CSS 颜色，内联覆盖）。',
      },
      {
        name: 'uncheckedColor',
        type: 'string | undefined',
        default: 'undefined',
        desc: '未选中颜色。',
      },
      { name: 'disabled', type: 'boolean | undefined', default: 'undefined', desc: '禁用当前项。' },
      { name: 'readonly', type: 'boolean | undefined', default: 'undefined', desc: '只读当前项。' },
      { name: 'indeterminate', type: 'boolean', default: 'false', desc: '半选状态。' },
      { name: 'trueValue', type: 'SnCheckboxValue', default: 'true', desc: '选中时取的值。' },
      { name: 'falseValue', type: 'SnCheckboxValue', default: 'false', desc: '未选中时取的值。' },
      { name: 'size', type: 'SnCheckboxSize', default: 'undefined', desc: '继承父级' },
      {
        name: 'placement',
        type: 'SnCheckboxPlacement | undefined',
        default: 'undefined',
        desc: "继承父级（`'left'`）",
      },
      {
        name: 'direction',
        type: 'SnCheckboxDirection | undefined',
        default: 'undefined',
        desc: "继承父级（`'vertical'`）",
      },
      {
        name: 'maxWidth',
        type: 'string',
        default: "''",
        desc: 'Max width of the label text (CSS length).',
      },
      {
        name: 'customLabelClass',
        type: 'string',
        default: "''",
        desc: 'Class on the label text node.',
      },
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
    copy: 'Checkbox 复选框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Checkbox } from '@snui/uni';",
    chipCopy: "import { Checkbox } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-checkbox', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-search', link: '/components/uni/search' },
    next: { text: 'sn-radio', link: '/components/uni/radio' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
