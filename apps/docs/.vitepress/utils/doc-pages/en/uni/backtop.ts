/** Backtop · uni-app (uni-app) — English page data. Props from sn-backtop.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const backtopDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Backtop · uni-app' },
  ],
  title: 'Backtop · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The host passes the scroll distance through ' },
    { t: 'code', s: 'scroll-top' },
    { t: 'text', s: ' (from ' },
    { t: 'code', s: 'onPageScroll' },
    { t: 'text', s: ' or a ' },
    { t: 'code', s: 'scroll-view' },
    { t: 'text', s: "'s " },
    { t: 'code', s: '@scroll' },
    { t: 'text', s: '); past the ' },
    { t: 'code', s: 'top' },
    { t: 'text', s: ' threshold the button fades in. Tapping scrolls back via ' },
    { t: 'code', s: 'uni.pageScrollTo' },
    { t: 'text', s: ', and the host can also listen to ' },
    { t: 'code', s: 'click' },
    { t: 'text', s: ' to scroll its own ' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-backtop',
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
    fileLabel: 'Backtop · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Backtop } from '@snui/uni';
</script>

<template>
  <sn-backtop />
</template>`,
  },
  demos: [
    {
      name: 'backtop-mp-basic',
      title: 'Basic usage',
      blurb:
        'Real scrolling inside a scroll-view: the button fades in past the threshold and scrolls back for real on tap.',
    },
    {
      name: 'backtop-mp-shape',
      title: 'Shape, size and content forms',
      blurb:
        'Circle / square × size × content form: icon-only buttons stay perfectly round / square, icon + label buttons adapt to the content.',
    },
    {
      name: 'backtop-mp-theme',
      title: 'Themes',
      blurb:
        'Semantic themes: primary / success / warning / danger / info fills with automatic content inversion.',
    },
    {
      name: 'backtop-mp-threshold',
      title: 'Visibility threshold (`top`)',
      blurb: 'top=120 threshold; the button appears once scroll-top crosses it.',
    },
    {
      name: 'backtop-mp-icon-style',
      title: 'Icon styling & stacking',
      blurb: 'icon-style recolors the glyph; z-index stacking; custom-class on the root.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'scrollTop', type: 'number', default: '0', desc: '页面滚动距离（由宿主提供）。' },
      { name: 'text', type: 'string', default: "''", desc: '按钮文字。' },
      {
        name: 'top',
        type: 'number',
        default: '300',
        desc: '滚动距离超过该值时显示按钮，单位为 px。',
      },
      { name: 'duration', type: 'number', default: '100', desc: '返回顶部滚动时间，单位为 ms。' },
      { name: 'zIndex', type: 'number', default: '10', desc: '组件层级。' },
      { name: 'iconStyle', type: 'string', default: "''", desc: '自定义图标样式。' },
      {
        name: 'shape',
        type: "'circle' | 'square'",
        default: "'circle'",
        desc: '按钮形状：circle / square。',
      },
      { name: 'bottom', type: 'number', default: '100', desc: '距离屏幕底部的距离，单位为 px。' },
      { name: 'right', type: 'number', default: '20', desc: '距离屏幕右侧的距离，单位为 px。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '自定义根节点样式。' },
      { name: 'customClass', type: 'string', default: "''", desc: '自定义根节点样式类。' },
      {
        name: 'size',
        type: 'BacktopSize',
        default: "'medium'",
        desc: '按钮尺寸档位；图标随档位取 `--sn-mp-icon-size-*` token。',
      },
      {
        name: 'theme',
        type: 'BacktopTheme',
        default: "'default'",
        desc: '按钮主题填充；内容色自动反转为 on-primary。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Backtop · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Backtop } from '@snui/uni';",
    chipCopy: "import { Backtop } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-backtop', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-index-bar', link: '/en/components/uni/index-bar' },
    next: { text: 'sn-tour', link: '/en/components/uni/tour' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
