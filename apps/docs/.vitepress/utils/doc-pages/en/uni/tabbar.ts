/** Tabbar · uni-app x (uni-app x) — English page data. Props from sn-tabbar.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tabbarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Tabbar · uni-app x' },
  ],
  title: 'Tabbar · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'The component follows the easycom convention, so **no import is needed in a template**:',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tabbar',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Tabbar · uni-app x.vue',
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
      title: 'Basic usage',
      blurb:
        'Full playground: the bar is fixed to the screen bottom; mode (standard / glass / elevate), top border, safe area, placeholder, badges and active colour all switch live.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnTabbarValue',
        default: '—',
        desc: '选中标签的索引值或者名称。',
      },
      { name: 'fixed', type: 'boolean', default: '—', desc: '是否固定在底部。' },
      { name: 'bordered', type: 'boolean', default: '—', desc: '是否显示顶部边框。' },
      { name: 'safeAreaInsetBottom', type: 'boolean', default: '—', desc: '是否设置底部安全区。' },
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
        desc: '激活标签颜色（内联覆盖，空 = 令牌默认）。',
      },
      {
        name: 'inactiveColor',
        type: 'string',
        default: '—',
        desc: '未激活标签颜色（内联覆盖，空 = 令牌默认）。',
      },
      {
        name: 'placeholder',
        type: 'boolean',
        default: '—',
        desc: '固定在底部时，是否生成等高占位元素。',
      },
      { name: 'zIndex', type: 'number', default: '—', desc: '组件层级。' },
      {
        name: 'glass',
        type: 'boolean',
        default: '—',
        desc: '毛玻璃风格（additive，Human 指令 2026-11-01）：背景换成半透明表面 + backdrop-filter 高斯模糊；固定在底部时页面内容从栏后透出。`bordered` 照常叠加。',
      },
      { name: 'customClass', type: 'string', default: '—', desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: '—', desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tabbar · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tabbar } from '@snui/uni';",
    chipCopy: "import { Tabbar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tabbar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Navbar', link: '/en/components/uni/navbar' },
    next: { text: 'Tabs', link: '/en/components/uni/tabs' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
