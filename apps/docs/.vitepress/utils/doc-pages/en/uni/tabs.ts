/** Tabs · uni-app x (uni-app x) — English page data. Props from sn-tab.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tabsDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Tabs · uni-app x' },
  ],
  title: 'Tabs · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The full ' },
    { t: 'code', s: 'badge-props' },
    { t: 'text', s: ' surface: ' },
    { t: 'code', s: 'value' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'max' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'isDot' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'type' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'showZero' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'hidden' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'shape' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'border' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'top' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'right' },
    { t: 'text', s: ':' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tabs',
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
    fileLabel: 'Tabs · uni-app x.vue',
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
      title: 'Basic usage',
      blurb:
        'v-model bound to the index and to the name; sn-tab renders the title in the strip and the default slot as the panel.',
    },
    {
      name: 'tabs-mp-type',
      title: 'Nav form and active emphasis',
      blurb:
        'type=line/card/tag forms; active-theme=text/fill/pill emphasis; any combination works.',
    },
    {
      name: 'tabs-mp-icon',
      title: 'Tab icons (`icon`)',
      blurb: 'icon as data and as a name (badge-props live in tabs-mp-badge).',
    },
    {
      name: 'tabs-mp-badge',
      title: 'Badge configuration',
      blurb:
        'badge-props numeric value, overflow cap, dot badge and semantic colours; zero value and hidden.',
    },
    {
      name: 'tabs-mp-line',
      title: 'Bar styles (`line-theme`)',
      blurb: 'line-theme=normal/underline/dot; line-width/line-height overrides.',
    },
    {
      name: 'tabs-mp-disabled',
      title: 'Disabled tabs (`disabled`)',
      blurb: 'A disabled tab cannot be switched; a tap only emits the disabled event.',
    },
    {
      name: 'tabs-mp-scroll',
      title: 'Scroll navigation and auto scroll-into-view',
      blurb:
        'slidable-num threshold turns scrolling on; slidable=always forces it; the selection scrolls into view (an external value write works too).',
    },
    {
      name: 'tabs-mp-swiper',
      title: 'Content-area swipe',
      blurb:
        'swipeable native swiper body; duration / swiper-easing / swiper-height; swiping onto a disabled pane snaps back.',
    },
    {
      name: 'tabs-mp-paging',
      title: 'Composed with a paged list',
      blurb:
        'Each pane hosts an sn-paging list; pull-to-refresh and load-more; the lazy pane defers the first query to the first switch.',
    },
    {
      name: 'tabs-mp-animate',
      title: 'Switch animation (`animated`)',
      blurb: 'animated / duration: bar transition plus scroll-into-view.',
    },
    {
      name: 'tabs-mp-sticky',
      title: 'Sticky pinning (`sticky`)',
      blurb: 'sticky + offset-top pins the strip and leaves an offset.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'name',
        type: 'SnTabsValue | undefined',
        default: 'undefined',
        desc: '标签唯一标识，默认取索引。',
      },
      { name: 'title', type: 'string', default: "''", desc: '标签标题。' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用。' },
      {
        name: 'lazy',
        type: 'boolean',
        default: 'true',
        desc: '是否懒加载内容（首次激活后才渲染）。',
      },
      {
        name: 'badgeProps',
        type: 'SnTabBadgeProps | undefined',
        default: '—',
        desc: '标题角标配置，透传给 `sn-badge`（对齐 wd-tab `badge-props`）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      {
        name: 'icon',
        type: 'IconData | string | undefined',
        default: '—',
        desc: '导航项标题左侧图标：IconData 数据或注册 / 内置图标名。',
      },
      {
        name: 'iconImage',
        type: 'string',
        default: "''",
        desc: '标题左侧图标图片地址（URL / base64），优先于 `icon`。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tabs · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tabs } from '@snui/uni';",
    chipCopy: "import { Tabs } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tabs', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Tabbar', link: '/en/components/uni/tabbar' },
    next: { text: 'Segmented', link: '/en/components/uni/segmented' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
