/**
 * Radio 单选框（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-radio.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const radioDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Radio 单选框' }],
  title: 'Radio 单选框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '跨 uni-app 多端的单选组件对：' },
    { t: 'code', s: 'sn-radio-group' },
    { t: 'text', s: '（父，持有单值 ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: '）+ ' },
    { t: 'code', s: 'sn-radio' },
    { t: 'text', s: '（子，' },
    { t: 'code', s: 'value' },
    { t: 'text', s: ' 为标识）。easycom 自动注册（同目录下 ' },
    { t: 'code', s: 'sn-radio/' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-radio',
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
    fileLabel: 'Radio 单选框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Radio } from '@snui/uni';
</script>

<template>
  <sn-radio />
</template>`,
  },
  demos: [
    {
      name: 'radio-mp-basic',
      title: '基础用法',
      blurb: 'sn-radio-group 单值 v-model + sn-radio value。',
    },
    {
      name: 'radio-mp-type',
      title: '形状（`type`：`circle` / `dot` / `square` / `button`）',
      blurb: '四种形状：circle / dot / square / button（button 配 direction=horizontal）。',
    },
    {
      name: 'radio-mp-uncheck',
      title: '可反选（`allowUncheck`）',
      blurb: 'allowUncheck 再点一次取消选中，v-model 回到 undefined。',
    },
    {
      name: 'radio-mp-disabled-readonly',
      title: '禁用与只读（`disabled` / `readonly`）',
      blurb: '整组 disabled 禁用 / readonly 只读。',
    },
    {
      name: 'radio-mp-placement',
      title: '标记位置（`placement`）',
      blurb: "placement='right' 把选中标记放到右侧。",
    },
    {
      name: 'radio-mp-colors',
      title: '选中色（`checkedColor` / `uncheckedColor`）',
      blurb: 'checkedColor / uncheckedColor 组级下发与单项覆盖。',
    },
    {
      name: 'radio-mp-custom-style',
      title: '自定义类名与样式',
      blurb: 'customLabelClass 落在标签节点；customClass / customStyle 落在根节点。',
    },
    {
      name: 'radio-mp-card',
      title: '卡片模式（variant="card"）',
      blurb: '整块可点选卡片，card 插槽自定义内容，选中为主题色描边 + 浅底 + 右上角标。',
    },
    {
      name: 'radio-mp-icon',
      title: '图标模式（variant="icon"）',
      blurb: '方形图标砖网格，icon 插槽放字形，无文字行。',
    },
    {
      name: 'radio-mp-indicator',
      title: '指示器位置、选中态与标记形态',
      blurb: 'markerShape check 勾图标；indicatorPlacement top-right / bottom-right / none；checkedStyle border / fill。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'SnRadioValue',
        default: "''",
        desc: "This option's value — matched against the group's `v-model`.",
      },
      { name: 'type', type: 'SnRadioType | undefined', default: 'undefined', desc: '类型。' },
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
      {
        name: 'placement',
        type: 'SnRadioPlacement | undefined',
        default: 'undefined',
        desc: "继承父级（`'left'`）",
      },
      {
        name: 'direction',
        type: 'SnRadioDirection | undefined',
        default: 'undefined',
        desc: "继承父级（`'vertical'`）",
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
    copy: 'Radio 单选框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Radio } from '@snui/uni';",
    chipCopy: "import { Radio } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-radio', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Checkbox', link: '/components/uni/checkbox' },
    next: { text: 'Switch', link: '/components/uni/switch' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
