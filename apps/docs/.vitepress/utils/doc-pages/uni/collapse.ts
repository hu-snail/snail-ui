/**
 * Collapse 折叠面板（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-collapse.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const collapseDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Collapse 折叠面板' },
  ],
  title: 'Collapse 折叠面板',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '普通模式下 ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' 为 ' },
    { t: 'code', s: 'string[]' },
    { t: 'text', s: '，可同时展开多个面板：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-collapse',
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
    fileLabel: 'Collapse 折叠面板.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Collapse } from '@snui/uni';
</script>

<template>
  <sn-collapse />
</template>`,
  },
  demos: [
    {
      name: 'collapse-mp-basic',
      title: '基础用法',
      blurb: 'v-model 绑定展开的 name 数组；多个面板可同时展开。',
    },
    {
      name: 'collapse-mp-accordion',
      title: '手风琴模式',
      blurb: 'accordion 手风琴模式，v-model 为字符串；disabled 面板无法展开。',
    },
    {
      name: 'collapse-mp-viewmore',
      title: '查看更多模式',
      blurb:
        'viewmore 查看更多模式，v-model 为布尔值；line-num 控制收起显示行数；底部渲染展开 / 收起按钮。',
    },
    {
      name: 'collapse-mp-card',
      title: '卡片形态',
      blurb:
        'collapse card 让每个面板独立成卡，卡片标题可配图标；单个面板也可用 card 脱离容器形态单独成卡。',
    },
    {
      name: 'collapse-mp-icon',
      title: '标题图标与图标尺寸',
      blurb:
        '标题图标三种来源：内置图标集对象、图片地址、名称解析链；iconSize 档位 tiny/small/medium/large 与自定义长度；iconColor 走颜色 token。',
    },
    {
      name: 'collapse-mp-slots',
      title: 'more 插槽、item 边框与 before-expend',
      blurb:
        'more 插槽 + custom-more-slot-class；item border=false；before-expend 拦截展开；title 插槽。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnCollapseModelValue',
        default: '() => [] as string[]',
        desc: '绑定值；普通模式为 string[]，手风琴模式为 string，查看更多模式为 boolean。',
      },
      {
        name: 'accordion',
        type: 'boolean',
        default: 'false',
        desc: '是否开启手风琴模式（同时只开一项）。',
      },
      {
        name: 'viewmore',
        type: 'boolean',
        default: 'false',
        desc: '是否开启查看更多模式（单个内容块 + 收起行数）。',
      },
      {
        name: 'useMoreSlot',
        type: 'boolean',
        default: 'false',
        desc: '查看更多模式下是否启用 more 插槽。',
      },
      { name: 'lineNum', type: 'number', default: '2', desc: '查看更多模式下收起显示行数' },
      {
        name: 'customMoreSlotClass',
        type: 'string',
        default: "''",
        desc: '查看更多模式下 more 插槽外部自定义类名。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      {
        name: 'card',
        type: 'boolean',
        default: 'false',
        desc: '卡片形态：每个面板渲染为独立圆角卡片，容器透明并以 token 间距分行。',
      },
      {
        name: 'iconSize',
        type: 'string | number | undefined',
        default: '—',
        desc: '图标尺寸（面板箭头与标题图标共享）：数字按 px，档位名映射 `--sn-mp-icon-size-*`，其它字符串透传。',
      },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: '图标颜色（面板箭头与标题图标共享）：传 `var(--sn-mp-color-*)` token；面板自身设置优先。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Collapse 折叠面板 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Collapse } from '@snui/uni';",
    chipCopy: "import { Collapse } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-collapse', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-steps', link: '/components/uni/steps' },
    next: { text: 'sn-sticky', link: '/components/uni/sticky' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
