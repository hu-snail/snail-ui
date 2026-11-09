/** Navbar · uni-app (uni-app) — English page data. Props from sn-navbar.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const navbarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Navbar · uni-app' },
  ],
  title: 'Navbar · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
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
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Navbar · uni-app.vue',
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
      title: 'Slots and fixed positioning',
      blurb:
        'left / right slots carry custom icons; fixed + placeholder pins the bar and renders the spacer.',
    },
    {
      name: 'navbar-mp-config',
      title: 'Disabled sides / safe area / capsule slot',
      blurb:
        'left-disabled / right-disabled veto taps; safe-area-inset-top adds the safe area; capsule slot plus custom-class / custom-style.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
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
    copy: 'Navbar · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Navbar } from '@snui/uni';",
    chipCopy: "import { Navbar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-navbar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-avatar-group', link: '/en/components/uni/avatar-group' },
    next: { text: 'sn-tabbar', link: '/en/components/uni/tabbar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
