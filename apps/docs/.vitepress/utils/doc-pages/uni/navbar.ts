/**
 * Navbar 导航栏（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-navbar.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const navbarDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Navbar 导航栏' },
  ],
  title: 'Navbar 导航栏',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '标题、左右文案与返回箭头：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-navbar',
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
    fileLabel: 'Navbar 导航栏.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Navbar } from '@snui/uni';
</script>

<template>
  <sn-navbar />
</template>`,
  },
  demos: [
    {
      name: 'navbar-mp-basic',
      title: '基础用法',
      blurb: 'title 标题；left-text / right-text 左右文案；left-arrow 返回箭头；bordered 下边框。',
    },
    {
      name: 'navbar-mp-slots',
      title: '左右插槽',
      blurb: '#left / #right 插槽自定义左右两侧内容。',
    },
    {
      name: 'navbar-mp-fixed',
      title: '固定定位（fixed / placeholder）',
      blurb: 'fixed 吸顶；placeholder 在原位置生成等高占位元素。',
    },
    {
      name: 'navbar-mp-disabled',
      title: '禁用侧按钮（left-disabled）',
      blurb: 'left-disabled / right-disabled 拦截对应侧点击，不触发事件。',
    },
    {
      name: 'navbar-mp-safe-area',
      title: '安全区与层级',
      blurb: 'safe-area-inset-top 补状态栏安全区；z-index 层级（仅 fixed 时生效）。',
    },
    {
      name: 'navbar-mp-capsule-slot',
      title: '胶囊插槽',
      blurb: '#capsule 占据左侧区；#title 自定义标题；custom-class / custom-style 落在根节点。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'title', type: 'string', default: "''", desc: '标题文字。' },
      { name: 'leftText', type: 'string', default: "''", desc: '左侧文案。' },
      { name: 'rightText', type: 'string', default: "''", desc: '右侧文案。' },
      { name: 'leftArrow', type: 'boolean', default: 'false', desc: '是否显示左侧返回箭头' },
      { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示下边框' },
      { name: 'fixed', type: 'boolean', default: 'false', desc: '是否固定到顶部' },
      {
        name: 'placeholder',
        type: 'boolean',
        default: 'false',
        desc: '固定时是否生成等高占位元素',
      },
      { name: 'zIndex', type: 'number', default: '10', desc: '导航栏层级（仅在 `fixed` 时写入）' },
      {
        name: 'safeAreaInsetTop',
        type: 'boolean',
        default: 'false',
        desc: '是否开启顶部安全区适配',
      },
      { name: 'leftDisabled', type: 'boolean', default: 'false', desc: '是否禁用左侧按钮' },
      { name: 'rightDisabled', type: 'boolean', default: 'false', desc: '是否禁用右侧按钮' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Navbar 导航栏 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Navbar } from '@snui/uni';",
    chipCopy: "import { Navbar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-navbar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-avatar-group', link: '/components/uni/avatar-group' },
    next: { text: 'sn-tabbar', link: '/components/uni/tabbar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
