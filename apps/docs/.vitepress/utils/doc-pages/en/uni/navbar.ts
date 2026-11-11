/** Navbar · uni-app x (uni-app x) — English page data. Props from sn-navbar.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const navbarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Navbar · uni-app x' },
  ],
  title: 'Navbar · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Title, side labels and the back arrow:' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-navbar',
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
    fileLabel: 'Navbar · uni-app x.vue',
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
      title: 'Basic usage',
      blurb:
        'title renders the heading; left-text / right-text add side labels; left-arrow shows the back arrow; bordered draws the bottom hairline.',
    },
    {
      name: 'navbar-mp-slots',
      title: 'Left & right slots',
      blurb: 'The #left / #right slots carry custom side content.',
    },
    {
      name: 'navbar-mp-fixed',
      title: 'Fixed positioning (`fixed` / `placeholder`)',
      blurb: 'fixed pins the bar; placeholder renders an equal-height spacer in place.',
    },
    {
      name: 'navbar-mp-disabled',
      title: 'Disabled sides (`left-disabled`)',
      blurb: 'left-disabled / right-disabled veto the corresponding side without emitting.',
    },
    {
      name: 'navbar-mp-safe-area',
      title: 'Safe area & stacking',
      blurb: 'safe-area-inset-top adds the status-bar padding; z-index applies while fixed.',
    },
    {
      name: 'navbar-mp-capsule-slot',
      title: 'Capsule slot',
      blurb:
        '#capsule takes over the left zone; #title replaces the heading; custom-class / custom-style land on the root.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'title', type: 'string', default: "''", desc: '标题文字。' },
      { name: 'leftText', type: 'string', default: "''", desc: '左侧文案。' },
      { name: 'rightText', type: 'string', default: "''", desc: '右侧文案。' },
      { name: 'leftArrow', type: 'boolean', default: 'false', desc: '是否显示左侧返回箭头。' },
      { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示下边框。' },
      { name: 'fixed', type: 'boolean', default: 'false', desc: '是否固定到顶部。' },
      {
        name: 'placeholder',
        type: 'boolean',
        default: 'false',
        desc: '固定到顶部时，是否在原位置生成一个等高的占位元素。',
      },
      { name: 'zIndex', type: 'number', default: '10', desc: '导航栏 z-index。' },
      {
        name: 'safeAreaInsetTop',
        type: 'boolean',
        default: 'false',
        desc: '是否开启顶部安全区适配。',
      },
      {
        name: 'leftDisabled',
        type: 'boolean',
        default: 'false',
        desc: '是否禁用左侧按钮（透明度降低且不触发事件）。',
      },
      {
        name: 'rightDisabled',
        type: 'boolean',
        default: 'false',
        desc: '是否禁用右侧按钮（透明度降低且不触发事件）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Navbar · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Navbar } from '@snui/uni';",
    chipCopy: "import { Navbar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-navbar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'AvatarGroup', link: '/en/components/uni/avatar-group' },
    next: { text: 'Tabbar', link: '/en/components/uni/tabbar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
