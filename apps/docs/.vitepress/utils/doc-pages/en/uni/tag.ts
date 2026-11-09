/** Tag · uni-app (Mobile) (uni-app) — English page data. Props from sn-tag.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tagDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Tag · uni-app (Mobile)' },
  ],
  title: 'Tag · uni-app (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Ten semantic colours covering both status and category cases:' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tag',
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
    fileLabel: 'Tag · uni-app (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tag } from '@snui/uni';
</script>

<template>
  <sn-tag />
</template>`,
  },
  demos: [
    {
      name: 'tag-mp-basic',
      title: 'Basic usage',
      blurb:
        'Ten semantic colours: default / primary / success / warning / danger / volcano / lightblue / cyan / pink / purple.',
    },
    {
      name: 'tag-mp-size',
      title: 'Size and shape',
      blurb:
        'Sizes small / medium / large / extra-large; round pill; mark asymmetric-corner marker.',
    },
    {
      name: 'tag-mp-variant',
      title: 'Variants',
      blurb:
        'Five variants: dark solid fill, light tinted fill, plain bordered, dashed dashed border, text label only.',
    },
    {
      name: 'tag-mp-shape',
      title: 'Shapes',
      blurb: 'Six shape values: square, round, skew, ribbon, fold, ticket.',
    },
    {
      name: 'tag-mp-icon',
      title: 'Icons',
      blurb:
        'Built-in catalog names (no registration) and IconData objects (named imports from sn-icon-set); iconUrl bitmap icons scale with the tag font.',
    },
    {
      name: 'tag-mp-closable',
      title: 'Closable / new tag',
      blurb:
        'closable removes filter chips (tap the dashed tag to restore all); dynamic adds tags through the inline input.',
    },
    {
      name: 'tag-mp-color-custom',
      title: 'Custom colours and root styling',
      blurb:
        'bgColor brand-colour takeover (fill and border change together); color overrides the label only; iconPrefix + cssIcon font-glyph classes; customClass and customStyle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'size',
        type: "'small' | 'medium' | 'large' | 'extra-large' | 'default'",
        default: "'default'",
        desc: '标签尺寸，可选值为 small、medium、large、extra-large、default。',
      },
      {
        name: 'icon',
        type: 'string | IconData',
        default: "''",
        desc: '左侧图标：字符串 = 经内置解析链（`registerSnIcons()` 注册表 → 内置 目录）解析的图标名；`IconData` 对象 = 直接渲染的 SVG 数据。`cssIcon` 开启时字符串走字体图标路径，不再进入 SVG 解析链。',
      },
      {
        name: 'iconUrl',
        type: 'string',
        default: "''",
        desc: '图片图标 URL（AUI-OPT-17）：渲染为 `<image>`，尺寸与图标档位 token 对齐。优先级低于 `icon` 插槽、高于 `icon`。',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: '图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。',
      },
      {
        name: 'shape',
        type: "'square' | 'round' | 'skew' | 'ribbon' | 'fold' | 'ticket'",
        default: "'square'",
        desc: '异形形态（AUI-OPT-17，§112.3a）：square 直角矩形、skew 平行四边形、 ribbon 右端旗标、fold 右上折角、ticket 两侧票券缺口、round 胶囊。 非 square 时优先于 `round` sugar。',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        desc: '是否可关闭（渲染关闭按钮，点击 emit `close`）。',
      },
      {
        name: 'dynamic',
        type: 'boolean',
        default: 'false',
        desc: '是否为新增标签（渲染输入框，确认后 emit `confirm`）。',
      },
      { name: 'color', type: 'string', default: "''", desc: '文字颜色（内联覆盖）。' },
      { name: 'bgColor', type: 'string', default: "''", desc: '背景色和边框色（内联覆盖）。' },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: "是否圆角（胶囊形）。等价于 `shape: 'round'` 的 sugar，`shape` 优先。",
      },
      {
        name: 'mark',
        type: 'boolean',
        default: 'false',
        desc: '是否标记样式（左上 / 右下不对称圆角）。',
      },
      {
        name: 'variant',
        type: "'light' | 'dark' | 'plain' | 'dashed' | 'text'",
        default: "'dark'",
        desc: '标签变体：light / dark / plain / dashed / text。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tag · uni-app (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tag } from '@snui/uni';",
    chipCopy: "import { Tag } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tag', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-gap', link: '/en/components/uni/gap' },
    next: { text: 'sn-badge', link: '/en/components/uni/badge' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
