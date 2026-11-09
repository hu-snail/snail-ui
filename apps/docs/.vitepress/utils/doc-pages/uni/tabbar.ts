/**
 * Tabbar 标签栏（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-tabbar.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tabbarDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Tabbar 标签栏' },
  ],
  title: 'Tabbar 标签栏',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tabbar',
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
    fileLabel: 'Tabbar 标签栏.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tabbar } from '@snui/uni';
</script>

<template>
  <sn-tabbar />
</template>`,
  },
  demos: [
    {
      name: 'tabbar-mp-playground',
      title: '基础用法',
      blurb:
        '标签栏固定在屏幕底部；形态胶囊（标准 / 毛玻璃 / 凸起）、边框 / 安全区 / 占位 / 徽标开关、激活色切换，全部设置项实时生效。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'SnTabbarValue', default: '—', desc: '`0`' },
      { name: 'fixed', type: 'boolean', default: '—', desc: '是否固定在底部' },
      { name: 'bordered', type: 'boolean', default: '—', desc: '是否显示顶部边框' },
      { name: 'safeAreaInsetBottom', type: 'boolean', default: '—', desc: '是否设置底部安全区' },
      {
        name: 'shape',
        type: "'default' | 'round'",
        default: '—',
        desc: '标签栏形状：default / round。',
      },
      {
        name: 'activeColor',
        type: 'string',
        default: '—',
        desc: '激活标签颜色（图标 + 文字，空 = 令牌默认）',
      },
      {
        name: 'inactiveColor',
        type: 'string',
        default: '—',
        desc: '未激活标签颜色（图标 + 文字，空 = 令牌默认）',
      },
      { name: 'placeholder', type: 'boolean', default: '—', desc: '固定时是否生成等高占位元素' },
      { name: 'zIndex', type: 'number', default: '—', desc: '组件层级（仅在 `fixed` 时写入）' },
      {
        name: 'glass',
        type: 'boolean',
        default: '—',
        desc: '毛玻璃风格：半透明表面 + backdrop-filter 模糊（additive）',
      },
      { name: 'customClass', type: 'string', default: '—', desc: '根节点自定义类名' },
      { name: 'customStyle', type: 'string', default: '—', desc: '根节点自定义 inline style' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tabbar 标签栏 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tabbar } from '@snui/uni';",
    chipCopy: "import { Tabbar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tabbar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-navbar', link: '/components/uni/navbar' },
    next: { text: 'sn-tabs', link: '/components/uni/tabs' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
