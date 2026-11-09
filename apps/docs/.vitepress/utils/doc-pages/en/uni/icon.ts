/** sn-icon (uni-app) — English page data. Props from sn-icon.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const iconDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'sn-icon' }],
  title: 'sn-icon',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Cross-end icon component for ' },
    { t: 'code', s: '@snui/uni' },
    { t: 'text', s: '. Four rendering paths share one ' },
    { t: 'code', s: 'size' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'color' },
    { t: 'text', s: ' / stroke contract: **iconfont glyphs** (' },
    { t: 'code', s: 'name' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'classPrefix' },
    { t: 'text', s: '), the **built-in icon catalog** (string ' },
    { t: 'code', s: 'icon' },
    { t: 'text', s: '), **third-party icon sources on demand** (Iconify / custom p' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-icon',
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
    fileLabel: 'sn-icon.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Icon } from '@snui/uni';
</script>

<template>
  <sn-icon />
</template>`,
  },
  demos: [
    {
      name: 'icon-mp-string',
      title: '1. String icon — built-in catalog (recommended)',
      blurb: '1. String icon — built-in catalog (recommended)',
    },
    {
      name: 'icon-mp-gallery',
      title: 'Built-in catalog gallery (search + categories)',
      blurb: 'Built-in catalog gallery (search + categories)',
    },
    {
      name: 'icon-mp-iconify',
      title: '2. Iconify on demand (third-party icon libraries)',
      blurb: '2. Iconify on demand (third-party icon libraries)',
    },
    {
      name: 'icon-mp-name',
      title: '4. Alibaba iconfont (font glyphs)',
      blurb: '4. Alibaba iconfont (font glyphs)',
    },
    {
      name: 'icon-mp-css',
      title: '4. Alibaba iconfont (font glyphs)',
      blurb: '4. Alibaba iconfont (font glyphs)',
    },
    { name: 'icon-mp-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'icon-mp-size', title: 'Sizes & stroke', blurb: 'Sizes & stroke' },
    {
      name: 'icon-mp-registry',
      title: 'Custom + button integration',
      blurb: 'Custom + button integration',
    },
    {
      name: 'icon-mp-custom',
      title: 'Root class and inline style (`customClass` / `customStyle`)',
      blurb: 'Root class and inline style (`customClass` / `customStyle`)',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'icon',
        type: 'IconData | string | undefined',
        default: '—',
        desc: '图标数据 / 图标名。对象 = SVG path 数据（tree-shakeable）；字符串 = registry → 内置目录 → Provider（`prefix:rest`）依次解析。与 `name` 二选一；两者同时给出时 `name`（iconfont 字形）优先。',
      },
      {
        name: 'name',
        type: 'string | undefined',
        default: '—',
        desc: 'iconfont 字形名 — wot-ui 的原生 API（`wd-icon`）。 渲染 `<view class="{classPrefix}-{name}">`，任何类名遵循 `{prefix}-{name}` 约定的 iconfont（如阿里 iconfont 项目）都能直接用。 需要宿主 app 加载对应的 iconfont 样式表。',
      },
      {
        name: 'classPrefix',
        type: 'string | undefined',
        default: '—',
        desc: 'iconfont 类名前缀。wot-ui 默认 `wd-icon`；本包默认 `sn-icon`。',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string | undefined',
        default: '—',
        desc: '把 `name` 渲染成 CSS 图标：`<view class="{name}">`（无前缀）。镜像 wot-ui 的 `css-icon`，用于指向任意 class（自定义子集 / 背景图方案）。',
      },
      {
        name: 'size',
        type: 'number | string | undefined',
        default: '—',
        desc: "尺寸。数字按 px；无单位数字字符串（'48'，常见于未绑定的模板属性） 按 rpx（750 设计稿）归一；带单位字符串（'32rpx' / '1.5em'）原样输出。",
      },
      {
        name: 'color',
        type: 'string | undefined',
        default: '—',
        desc: '描边 / 字形颜色。默认 `currentColor`（继承父元素 color）。',
      },
      {
        name: 'strokeWidth',
        type: 'number | string | undefined',
        default: '—',
        desc: '描边宽度（设计单位，默认 2 = lucide 标准）。',
      },
      {
        name: 'strokeWidthAbsolute',
        type: 'boolean | undefined',
        default: '—',
        desc: 'true 时描边按绝对像素而非随 size 缩放（镜像 lucide absoluteStrokeWidth）。',
      },
      {
        name: 'customClass',
        type: 'string | undefined',
        default: '—',
        desc: '根节点 class（镜像 wot-ui custom-class）。',
      },
      {
        name: 'customStyle',
        type: 'string | Record<string, string> | undefined',
        default: '—',
        desc: '根节点内联样式（镜像 wot-ui custom-style）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'sn-icon ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Icon } from '@snui/uni';",
    chipCopy: "import { Icon } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-icon', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-button', link: '/en/components/uni/button' },
    next: { text: 'sn-text', link: '/en/components/uni/text' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
