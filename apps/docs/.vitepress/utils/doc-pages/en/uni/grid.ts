/** Grid · uni-app (uni-app) — English page data. Props from sn-grid.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const gridDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Grid · uni-app' },
  ],
  title: 'Grid · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-grid',
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
    fileLabel: 'Grid · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Grid } from '@snui/uni';
</script>

<template>
  <sn-grid />
</template>`,
  },
  demos: [
    {
      name: 'grid-mp-basic',
      title: 'Basic usage',
      blurb:
        'column=3 gives three columns; border draws the inner rules; icon resolves through the icon registry; value renders a badge.',
    },
    {
      name: 'grid-mp-layout',
      title: 'Columns, gutters and flow',
      blurb:
        'column=4 with gutter and square cells; direction=horizontal flows the content horizontally; reverse swaps icon and label.',
    },
    {
      name: 'grid-mp-clickable',
      title: 'Tap feedback (`clickable`)',
      blurb:
        'clickable makes cells tappable; hover-class customises the press feedback; the click event reports the cell.',
    },
    {
      name: 'grid-mp-look',
      title: 'Looks (`bg-color` / `center` / `icon-size`)',
      blurb:
        'bg-color background; center=false top alignment; icon-size for glyphs; custom-class / custom-style.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'column', type: 'number', default: '3', desc: '列数。' },
      { name: 'border', type: 'boolean', default: 'false', desc: '是否显示边框。' },
      { name: 'gutter', type: 'number', default: '0', desc: '格子之间的间距，默认单位为 px。' },
      { name: 'square', type: 'boolean', default: 'false', desc: '是否将格子固定为正方形。' },
      { name: 'clickable', type: 'boolean', default: 'false', desc: '是否开启格子点击反馈。' },
      {
        name: 'bgColor',
        type: 'string',
        default: "''",
        desc: '背景颜色设置（内联覆盖，空 = 令牌默认）。',
      },
      {
        name: 'hoverClass',
        type: 'string',
        default: "'sn-grid-item__content--hover'",
        desc: '指定 grid-item 按下去的样式类。',
      },
      { name: 'center', type: 'boolean', default: 'true', desc: '是否将格子内容居中显示。' },
      {
        name: 'direction',
        type: 'SnGridDirection',
        default: "'vertical'",
        desc: '格子内容排列的方向：horizontal / vertical。',
      },
      { name: 'reverse', type: 'boolean', default: 'false', desc: '是否调换图标和文本的位置。' },
      { name: 'iconSize', type: 'string', default: "'28px'", desc: '图标大小，默认单位为 px。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Grid · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Grid } from '@snui/uni';",
    chipCopy: "import { Grid } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-grid', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-sticky', link: '/en/components/uni/sticky' },
    next: { text: 'sn-drop-menu', link: '/en/components/uni/drop-menu' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
