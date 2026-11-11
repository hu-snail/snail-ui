/**
 * Tabs 标签页（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-tab.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tabsDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Tabs 标签页' },
  ],
  title: 'Tabs 标签页',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '面板内容由宿主提供，' },
    { t: 'code', s: 'sn-tabs' },
    { t: 'text', s: ' 只渲染导航条与面板容器，所以面板里可以直接放 ' },
    { t: 'code', s: 'sn-paging' },
    { t: 'text', s: '；' },
    { t: 'code', s: 'sn-tab' },
    { t: 'text', s: ' 默认 ' },
    { t: 'code', s: 'lazy' },
    { t: 'text', s: '，首次激活才挂载面板，分页列表的首次请求也随之推迟到首次切页：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tabs',
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
    fileLabel: 'Tabs 标签页.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tabs } from '@snui/uni';
</script>

<template>
  <sn-tabs />
</template>`,
  },
  demos: [
    {
      name: 'tabs-mp-basic',
      title: '基础用法',
      blurb: 'v-model 绑定索引或名称两种写法；sn-tab 的 title 渲染页签标题，默认插槽渲染面板内容。',
    },
    {
      name: 'tabs-mp-type',
      title: '导航形态与选中态',
      blurb:
        'type=line/card/tag 三种形态；active-theme=text/fill/pill 三种选中态；形态与选中态可任意组合。',
    },
    {
      name: 'tabs-mp-icon',
      title: '页签图标（icon）',
      blurb: 'icon 传图标数据与图标名两种写法（badge-props 见 tabs-mp-badge）。',
    },
    {
      name: 'tabs-mp-badge',
      title: '角标配置',
      blurb: 'badge-props 的数字角标、溢出上限、点状角标与语义色；零值显示与隐藏。',
    },
    {
      name: 'tabs-mp-line',
      title: '底部条样式（line-theme）',
      blurb: 'line-theme=normal/underline/dot 三种底部条；line-width/line-height 覆盖尺寸。',
    },
    {
      name: 'tabs-mp-disabled',
      title: '禁用页签（disabled）',
      blurb: 'disabled 页签不可切换，点击只触发 disabled 事件。',
    },
    {
      name: 'tabs-mp-scroll',
      title: '滚动导航与自动滑出',
      blurb:
        'slidable-num 阈值触发滚动；slidable=always 强制滚动；选中项自动滑入可视区（外部改值同样生效）。',
    },
    {
      name: 'tabs-mp-swiper',
      title: '内容区滑动',
      blurb:
        'swipeable 原生 swiper 内容区；duration / swiper-easing / swiper-height；滑到禁用页签弹回。',
    },
    {
      name: 'tabs-mp-paging',
      title: '与分页列表组合',
      blurb:
        '每个页签面板承载一个 sn-paging 列表；下拉刷新 / 触底翻页；懒加载面板让首次请求跟随首次切页。',
    },
    {
      name: 'tabs-mp-animate',
      title: '切换动画（animated）',
      blurb: 'animated / duration：底部条过渡 + 选中项平滑滚入。',
    },
    {
      name: 'tabs-mp-sticky',
      title: '吸顶（sticky）',
      blurb: 'sticky + offset-top 让页签条吸顶并留出偏移。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'name', type: 'SnTabsValue | undefined', default: 'undefined', desc: '该项的标识。' },
      { name: 'title', type: 'string', default: "''", desc: '标签标题。' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
      { name: 'lazy', type: 'boolean', default: 'true', desc: '是否懒加载内容（首次激活后渲染）' },
      {
        name: 'badgeProps',
        type: 'SnTabBadgeProps | undefined',
        default: '—',
        desc: '标题角标配置，透传 `sn-badge`（见下表）',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      { name: 'icon', type: 'IconData | string | undefined', default: '—', desc: '图标。' },
      {
        name: 'iconImage',
        type: 'string',
        default: "''",
        desc: '标题左侧图标图片地址（URL / base64），优先于 `icon`。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tabs 标签页 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tabs } from '@snui/uni';",
    chipCopy: "import { Tabs } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tabs', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Tabbar', link: '/components/uni/tabbar' },
    next: { text: 'Segmented', link: '/components/uni/segmented' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
