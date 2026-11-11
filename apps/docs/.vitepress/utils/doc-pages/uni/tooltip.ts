/**
 * Tooltip 文字提示（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-tooltip.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tooltipDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Tooltip 文字提示' },
  ],
  title: 'Tooltip 文字提示',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '气泡默认是「普通表面」配色：底色取 ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: '（亮色主题即白色）、文字取 ' },
    { t: 'code', s: '--sn-mp-color-text-primary' },
    { t: 'text', s: '。这两个 token 都在 ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    { t: 'text', s: ' 的 ' },
    { t: 'code', s: '.sn-theme-dark' },
    { t: 'text', s: ' 块里覆盖，因此暗色下自动变成深底浅字，无需额外处理。需要自定义配色时，用 ' },
    { t: 'code', s: 'custom-style="--sn-tooltip-bg: …; --sn-tooltip-color: …"' },
    { t: 'text', s: ' 覆盖（对齐 wot-u' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tooltip',
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
    fileLabel: 'Tooltip 文字提示.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tooltip } from '@snui/uni';
</script>

<template>
  <sn-tooltip />
</template>`,
  },
  demos: [
    {
      name: 'tooltip-mp-basic',
      title: '基础用法',
      blurb: '点击按钮切换提示气泡，点击气泡外部自动关闭。',
    },
    {
      name: 'tooltip-mp-placement',
      title: '弹出方向',
      blurb: '12 个方位全部展示（wot-ui demo 网格布局），一次只开一个。',
    },
    {
      name: 'tooltip-mp-arrow',
      title: '箭头（visible-arrow）',
      blurb: 'visible-arrow=false 去掉指向触发器的箭头。',
    },
    {
      name: 'tooltip-mp-close',
      title: '关闭按钮与偏移',
      blurb: 'show-close 显示关闭按钮；offset 调整与触发器的间距。',
    },
    {
      name: 'tooltip-mp-disabled',
      title: '禁用（disabled）',
      blurb: 'disabled 禁用触发器，点击不打开气泡。',
    },
    {
      name: 'tooltip-mp-content',
      title: '多行内容与 content 插槽',
      blurb:
        '数组 content 渲染多行；content 插槽自定义气泡结构；offset 的 [x, y] 与 { x, y } 两种写法。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'boolean', default: 'false', desc: '是否显示（`v-model`）' },
      {
        name: 'content',
        type: 'string | TooltipContentRow[]',
        default: "''",
        desc: 'Bubble text; an array renders one line per entry.',
      },
      { name: 'placement', type: 'TooltipPlacement', default: "'bottom'", desc: 'Bubble anchor.' },
      { name: 'offset', type: 'PopoverOffset', default: '0', desc: '{ x?, y? }`' },
      { name: 'visibleArrow', type: 'boolean', default: 'true', desc: '是否显示箭头' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
      { name: 'showClose', type: 'boolean', default: 'false', desc: '是否显示关闭按钮' },
      {
        name: 'customArrow',
        type: 'string',
        default: "''",
        desc: 'Extra class on the arrow node.',
      },
      { name: 'customPop', type: 'string', default: "''", desc: 'Extra class on the bubble node.' },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for `wd-tooltip` parity, NOT implemented — miniprogram has no portal host, so the bubble cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tooltip 文字提示 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tooltip } from '@snui/uni';",
    chipCopy: "import { Tooltip } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tooltip', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'DropMenu', link: '/components/uni/drop-menu' },
    next: { text: 'Popover', link: '/components/uni/popover' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
