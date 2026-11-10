/** Sidebar · uni-app (uni-app) — English page data. Props from sn-sidebar.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const sidebarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Sidebar · uni-app' },
  ],
  title: 'Sidebar · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'With ' },
    { t: 'code', s: 'scroll-spy' },
    {
      t: 'text',
      s: " on, the left highlight follows the position of the right-hand content instead of the user's last tap: the host reports its scroll distance through ",
    },
    { t: 'code', s: 'scroll-top' },
    { t: 'text', s: ' (a ' },
    { t: 'code', s: 'scroll-view' },
    { t: 'text', s: "'s " },
    { t: 'code', s: '@scroll' },
    { t: 'text', s: " or the page's " },
    { t: 'code', s: 'onPageScroll' },
    { t: 'text', s: '), each entry names the c' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-sidebar',
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
    fileLabel: 'Sidebar · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Sidebar } from '@snui/uni';
</script>

<template>
  <sn-sidebar />
</template>`,
  },
  demos: [
    {
      name: 'sidebar-mp-basic',
      title: 'Basic usage',
      blurb: 'v-model binds the value; each item renders its label; the panel is driven by change.',
    },
    {
      name: 'sidebar-mp-icon',
      title: 'Icons (`icon`)',
      blurb: 'The item icon resolves through the registry name.',
    },
    {
      name: 'sidebar-mp-badge',
      title: 'Badges (`badge` / `is-dot`)',
      blurb: 'badge renders a numeric marker; is-dot renders a dot (the max cap lives in sidebar-mp-guard).',
    },
    {
      name: 'sidebar-mp-disabled',
      title: 'Disabled items (`disabled`)',
      blurb: 'disabled blocks the entry — taps are ignored.',
    },
    {
      name: 'sidebar-mp-guard',
      title: 'Switch guard and the select method',
      blurb:
        'before-change blocks the first two switches; ref.select() switches from code; max caps the badge.',
    },
    {
      name: 'sidebar-mp-scroll',
      title: 'Scroll linkage (scroll-spy)',
      blurb:
        'Scroll the right pane and the left highlight follows; a tap jumps the content through before-change.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'SnSidebarValue', default: '0', desc: '当前激活项的值。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      {
        name: 'scrollSpy',
        type: 'boolean',
        default: 'false',
        desc: '打开右侧内容区滚动联动（scroll-spy）：`scrollTop` 变化时自动切换高亮。 需要 item 声明 `anchor` 且 `anchorSelector` 能匹配到内容区块。',
      },
      {
        name: 'scrollTop',
        type: 'number',
        default: '0',
        desc: '内容区滚动距离（px），由宿主的 `scroll-view` `@scroll` 或页面 `onPageScroll` 上报。`scrollSpy` 打开时作为联动输入。',
      },
      {
        name: 'anchorSelector',
        type: 'string',
        default: "''",
        desc: '内容区块的 CSS 选择器，每个区块的 `id` 需与 item 的 `anchor` 一致。',
      },
      {
        name: 'scrollThreshold',
        type: 'number',
        default: '0',
        desc: '激活判定的额外偏移（px），例如顶部吸顶头部的高度：区块顶部进入该偏移 范围即视为激活。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Sidebar · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Sidebar } from '@snui/uni';",
    chipCopy: "import { Sidebar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-sidebar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-segmented', link: '/en/components/uni/segmented' },
    next: { text: 'sn-pagination', link: '/en/components/uni/pagination' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
