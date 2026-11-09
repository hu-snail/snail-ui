/**
 * ConfigProvider 全局配置（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-config-provider.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const configProviderDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'ConfigProvider 全局配置' },
  ],
  title: 'ConfigProvider 全局配置',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'uni-app 运行在无 ' },
    { t: 'code', s: 'document' },
    { t: 'text', s: '、无 ' },
    { t: 'code', s: ':root' },
    { t: 'text', s: ' 的小程序与原生 App 上，web 端「给 ' },
    { t: 'code', s: '<html>' },
    { t: 'text', s: ' 加 ' },
    { t: 'code', s: '.dark' },
    { t: 'text', s: '」的做法不可用。本组件把主题表达为**自身根节点上的 class**（' },
    { t: 'code', s: '.sn-theme-dark' },
    { t: 'text', s: '），子组件据此解析各自的 ' },
    { t: 'code', s: '--sn-mp-color-*' },
    { t: 'text', s: ' 别名，因此作用范围天然被限制在这个子树内。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-config-provider',
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
    fileLabel: 'ConfigProvider 全局配置.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ConfigProvider } from '@snui/uni';
</script>

<template>
  <sn-config-provider />
</template>`,
  },
  demos: [
    {
      name: 'config-provider-mp-basic',
      title: '基础用法',
      blurb: '包裹子树即可继承配置；页面其余部分不受影响。',
    },
    {
      name: 'config-provider-mp-dark',
      title: '深色模式',
      blurb: 'theme 设为 dark，仅该子树切换为深色；同级内容保持浅色。',
    },
    {
      name: 'config-provider-mp-vars',
      title: '主题变量覆盖',
      blurb: 'themeVars 覆盖主色与背景；两种键写法等价。',
    },
    {
      name: 'config-provider-mp-dark',
      title: '暗色模式',
      blurb: '同一页面内浅色与深色两个子树并存，互不影响。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'skin',
        type: 'string',
        default: "''",
        desc: "当前激活的 Style Pack 标识（kebab-case）。'default' 或空 = 无 skin class。",
      },
      {
        name: 'theme',
        type: 'ConfigProviderTheme',
        default: "'light'",
        desc: 'Theme mode for this subtree. Mirrors `wd-config-provider` theme.',
      },
      {
        name: 'themeVars',
        type: 'ConfigProviderThemeVars',
        default: '() => ({})',
        desc: 'Per-subtree CSS variable overrides. Mirrors `wd-config-provider` theme-vars.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class on the root node. Mirrors `wd-config-provider` custom-class.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style on the root node. Mirrors `wd-config-provider` custom-style.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'ConfigProvider 全局配置 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { ConfigProvider } from '@snui/uni';",
    chipCopy: "import { ConfigProvider } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-config-provider', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-resize', link: '/components/uni/resize' },
    next: { text: 'sn-root-portal', link: '/components/uni/root-portal' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
