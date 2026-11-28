/**
 * Popover 气泡卡片（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-popover.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const popoverDocPage: SnDocPageData = {
  crumbs: [
    { text: "文档首页", link: "/" },
    { text: "导航组件 Navigation" },
    { text: "Popover 气泡卡片" },
  ],
  title: "Popover 气泡卡片",
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: "uni-app x 移动端", tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: "点击触发的气泡：normal 模式展示一段文字，menu 模式展示操作列表；气泡相对触发器定位，共 12 个方向。内容通过 " },
    { t: 'code', s: 'content' },
    { t: 'text', s: " 传入，展示模式由 " },
    { t: 'code', s: 'mode' },
    { t: 'text', s: " 决定；气泡单行显示，宽度随内容增长、不换行不截断。" },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: "已复制",
    },
    {
      icon: 'link',
      label: "查看源码",
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-popover',
    },
  ],
  features: [
    { text: "rpx 跨设备缩放", icon: 'layers' },
    { text: "easycom 自动注册", icon: 'eco' },
    { text: "触控交互优化", icon: 'touch' },
  ],
  usage: {
    hint: [{ t: 'text', s: "uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。" }],
    fileLabel: "Popover 气泡卡片.vue",
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SnPopover } from '@snui/uni';
</script>

<template>
  <sn-popover v-model="open" content="文字提示">
    <sn-button>显示气泡</sn-button>
  </sn-popover>
</template>`,
  },
  demos: [
    { name: 'popover-mp-basic', title: "基础用法", blurb: "点击触发器展开文字气泡，再点一次收起" },
    { name: 'popover-mp-placement', title: "弹出位置", blurb: "top / right / bottom / left 四个方向" },
    { name: 'popover-mp-alignment', title: "对齐方式", blurb: "同一方向上的 -start / 居中 / -end 三档对齐" },
    { name: 'popover-mp-menu', title: "菜单模式", blurb: "`menu` 模式把 content 渲染为操作列表，`iconClass` 指定行图标" },
    { name: 'popover-mp-content-slot', title: "内容插槽", blurb: "`#content` 插槽完全替换气泡正文" },
    { name: 'popover-mp-custom-style', title: "偏移与自定义样式", blurb: "offset 拉开距离，custom-style 覆盖气泡配色" },
    { name: 'popover-mp-height', title: "内容宽度", blurb: "气泡随内容增长，不换行不截断" },
    {
      name: 'popover-mp-rounded',
      title: '圆角箭头',
      blurb: 'arrow-shape="rounded"：软角方形箭头与气泡连体；与默认尖角对比。',
    },
    {
      name: 'popover-mp-border',
      title: '自定义边框',
      blurb: 'border-color：气泡主体画 1px 自定义颜色边框，并延续到尖角箭头连成一条闭合轮廓。',
    },
    { name: 'popover-mp-theme', title: "主题", blurb: "暗黑 / 浅色主题下气泡与箭头自动跟随" },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: "boolean",
        default: "false",
        desc: "是否显示（`v-model`）",
      },
      {
        name: 'content',
        type: "string | SnPopoverMenuItem[]",
        default: "''",
        desc: "`normal` 模式下为字符串，`menu` 模式下为行数组；由 `content` 插槽替换",
      },
      {
        name: 'mode',
        type: "'normal' | 'menu'",
        default: "'normal'",
        desc: "气泡展示模式：文字 / 菜单列表",
      },
      {
        name: 'placement',
        type: "PopoverPlacement",
        default: "'bottom'",
        desc: "气泡相对触发器的位置，共 12 个方向",
      },
      {
        name: 'offset',
        type: "number | number[] | { x: number; y: number }",
        default: "0",
        desc: "额外距离（px）；-start / -end 下位移气泡并反向补偿箭头，箭头始终指向触发器",
      },
      {
        name: 'visibleArrow',
        type: "boolean",
        default: "true",
        desc: "是否显示箭头；关闭后箭头占用的间距一并去掉",
      },
      {
        name: 'arrowShape',
        type: "'sharp' | 'rounded'",
        default: "'sharp'",
        desc: "箭头形状：尖角三角 / 圆角方钉（带圆角的方形，与气泡连为一体）",
      },
      {
        name: 'borderColor',
        type: "string",
        default: "''",
        desc: "自定义边框颜色（默认无边框）；设置后主体与尖角箭头连成一条闭合轮廓，圆角箭头模式仅主体描边",
      },
      {
        name: 'disabled',
        type: "boolean",
        default: "false",
        desc: "禁用触发器，点击无效；不阻止通过 `v-model` 控制显隐",
      },
      {
        name: 'showClose',
        type: "boolean",
        default: "false",
        desc: "是否在气泡右上角显示关闭按钮",
      },
      {
        name: 'customClass',
        type: "string",
        default: "''",
        desc: "根节点自定义类名",
      },
      {
        name: 'customStyle',
        type: "string",
        default: "''",
        desc: "根节点自定义内联样式；可在此覆盖 `--sn-popover-*` 变量",
      },
      {
        name: 'customArrow',
        type: "string",
        default: "''",
        desc: "箭头节点自定义类名",
      },
      {
        name: 'customPop',
        type: "string",
        default: "''",
        desc: "气泡容器自定义类名",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: "为 LLM 提供语义化组件契约",
    copy: "Popover 气泡卡片 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。",
    chip: "import { SnPopover } from '@snui/uni';",
    chipCopy: "import { SnPopover } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-popover', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Tooltip', link: '/components/uni/tooltip' },
    next: { text: 'Form', link: '/components/uni/form' },
  },
  toc: [
    { id: 'usage', text: "代码用法" },
    { id: 'demos', text: "案例 Demos" },
    { id: 'api', text: "API 属性参考" },
    { id: 'ai-native', text: "AI 原生集成" },
  ],
};
