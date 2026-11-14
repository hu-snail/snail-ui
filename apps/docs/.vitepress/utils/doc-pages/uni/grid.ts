/**
 * Grid 宫格（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-grid.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const gridDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '导航组件 Navigation' }, { text: 'Grid 宫格' }],
  title: 'Grid 宫格',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-grid',
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
    fileLabel: 'Grid 宫格.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Grid } from '@snui/uni';
</script>

<template>
  <sn-grid />
</template>`,
  },
  demos: [
    {
      name: 'grid-mp-basic',
      title: '基础用法',
      blurb: 'column=3 三列；border 显示内边框；icon 经图标注册表解析；value 渲染角标。',
    },
    {
      name: 'grid-mp-layout',
      title: '列数、间距与排列',
      blurb:
        'column=4 + gutter 间距 + square 正方形；direction=horizontal 横向排列；reverse 调换图标与文字位置。',
    },
    {
      name: 'grid-mp-clickable',
      title: '点击反馈（clickable）',
      blurb: 'clickable 开启格子点击；hover-class 自定义按压反馈；click 事件回报点击格子。',
    },
    {
      name: 'grid-mp-look',
      title: '外观（bg-color / center / icon-size）',
      blurb:
        'bg-color 背景色；center=false 顶对齐；icon-size 图标尺寸；custom-class / custom-style。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'column', type: 'number', default: '3', desc: '列数' },
      { name: 'border', type: 'boolean', default: 'false', desc: '是否显示边框' },
      { name: 'gutter', type: 'number', default: '0', desc: '格子之间的间距（px）' },
      { name: 'square', type: 'boolean', default: 'false', desc: '是否将格子固定为正方形' },
      { name: 'clickable', type: 'boolean', default: 'false', desc: '是否开启格子点击反馈' },
      {
        name: 'bgColor',
        type: 'string',
        default: "''",
        desc: '背景颜色设置（内联覆盖，空 = 令牌默认）。',
      },
      {
        name: 'hoverClass',
        type: 'string',
        default: "'sn-grid-item__content--hover'",
        desc: '指定 grid-item 按下去的样式类。',
      },
      { name: 'center', type: 'boolean', default: 'true', desc: '是否将格子内容居中显示' },
      {
        name: 'direction',
        type: 'SnGridDirection',
        default: "'vertical'",
        desc: '格子内容排列的方向：horizontal / vertical。',
      },
      { name: 'reverse', type: 'boolean', default: 'false', desc: '是否调换图标和文本的位置' },
      { name: 'iconSize', type: 'string', default: "'28px'", desc: '图标大小，默认单位为 px。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Grid 宫格 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Grid } from '@snui/uni';",
    chipCopy: "import { Grid } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-grid', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Sticky', link: '/components/uni/sticky' },
    next: { text: 'DropMenu', link: '/components/uni/drop-menu' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
