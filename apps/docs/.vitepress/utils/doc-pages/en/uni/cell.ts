/** Cell · uni-app (uni-app) — English page data. Props from sn-cell.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const cellDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Cell · uni-app' },
  ],
  title: 'Cell · uni-app',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-cell',
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
    fileLabel: 'Cell · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Cell } from '@snui/uni';
</script>

<template>
  <sn-cell />
</template>`,
  },
  demos: [
    {
      name: 'cell-mp-basic',
      title: 'Basic usage',
      blurb:
        'cell-group title / value render the section heading; insert gives the rounded card look; an empty value falls back to placeholder.',
    },
    {
      name: 'cell-mp-link',
      title: 'Links, icons and tap feedback',
      blurb:
        'is-link adds the arrow and tap feedback; prefix-icon adds a leading icon; arrow-direction=down points the arrow down; clickable gives feedback without an arrow.',
    },
    {
      name: 'cell-mp-layout',
      title: 'Layout, required marks and alignment',
      blurb:
        'layout=vertical stacks title over value; required adds the asterisk (asterisk-position moves it); title-width / value-align control width and alignment.',
    },
    {
      name: 'cell-mp-icon',
      title: 'Icon sources and sizes',
      blurb:
        'Three icon sources compared: built-in icon-set object, image URL, registry name; iconSize set to tiny/small/medium/large/xlarge tiers; iconColor through colour tokens.',
    },
    {
      name: 'cell-mp-card',
      title: 'Card cells',
      blurb:
        'Card mode: each row stands alone with a leading icon + title + right arrow; enabling it on the group inherits to every row.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'title', type: 'string', default: "''", desc: '左侧标题。' },
      { name: 'value', type: 'string | number | undefined', default: "''", desc: '右侧内容。' },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        desc: '占位符，仅在 value 为空时显示。',
      },
      { name: 'label', type: 'string', default: "''", desc: '标题下方描述信息。' },
      {
        name: 'prefixIcon',
        type: 'string',
        default: "''",
        desc: '前置图标名：registry（`registerSnIcons`）→ 内置目录（kebab-case）→ Provider 依次解析。',
      },
      {
        name: 'suffixIcon',
        type: 'string',
        default: "''",
        desc: '后置图标名：解析链同 `prefixIcon`。',
      },
      {
        name: 'iconSize',
        type: 'string | number | undefined',
        default: '—',
        desc: '图标大小：裸数字按 rpx（750 设计稿）；档位名 tiny/small/medium/large/xlarge 映射 `--sn-mp-icon-size-*`；其它字符串透传。',
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
        name: 'to',
        type: 'string',
        default: "''",
        desc: '跳转地址（仅随 `click` 透出，组件不自行跳转）。',
      },
      {
        name: 'replace',
        type: 'boolean',
        default: 'false',
        desc: '跳转时是否替换当前页面历史（仅随 `click` 透出）。',
      },
      { name: 'clickable', type: 'boolean', default: 'false', desc: '是否开启点击反馈。' },
      {
        name: 'isLink',
        type: 'boolean',
        default: 'false',
        desc: '是否展示右侧箭头并开启点击反馈。',
      },
      {
        name: 'arrowDirection',
        type: "'left' | 'up' | 'down' | 'right'",
        default: "'right'",
        desc: '箭头方向：left / up / down / right。',
      },
      {
        name: 'size',
        type: "'default' | 'large'",
        default: "'default'",
        desc: '单元格大小，支持 large。',
      },
      {
        name: 'border',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: '是否显示内边框，优先级高于 cell-group 同名属性。',
      },
      {
        name: 'titleWidth',
        type: 'string | number | undefined',
        default: '—',
        desc: '左侧标题宽度。',
      },
      { name: 'center', type: 'boolean | undefined', default: 'undefined', desc: '是否垂直居中。' },
      {
        name: 'layout',
        type: "'horizontal' | 'vertical' | undefined",
        default: '—',
        desc: '单元格布局方式：horizontal / vertical。',
      },
      {
        name: 'valueAlign',
        type: 'SnCellValueAlign | undefined',
        default: '—',
        desc: '右侧内容对齐方式。',
      },
      { name: 'required', type: 'boolean', default: 'false', desc: '是否显示必填星号。' },
      {
        name: 'asteriskPosition',
        type: "'start' | 'end'",
        default: "'start'",
        desc: '必填星号位置：start / end。',
      },
      { name: 'hideAsterisk', type: 'boolean', default: 'false', desc: '是否隐藏必填星号。' },
      { name: 'ellipsis', type: 'boolean', default: 'false', desc: '内容是否超出隐藏显示省略号。' },
      { name: 'useTitleSlot', type: 'boolean', default: 'true', desc: '是否启用 title 插槽。' },
      { name: 'useLabelSlot', type: 'boolean', default: 'true', desc: '是否启用 label 插槽。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      { name: 'customPrefixClass', type: 'string', default: "''", desc: '前置图标自定义样式类。' },
      { name: 'customSuffixClass', type: 'string', default: "''", desc: '后置图标自定义样式类。' },
      { name: 'customLabelClass', type: 'string', default: "''", desc: 'label 区域自定义样式类。' },
      { name: 'customValueClass', type: 'string', default: "''", desc: 'value 区域自定义样式类。' },
      { name: 'customTitleClass', type: 'string', default: "''", desc: 'title 区域自定义样式类。' },
      {
        name: 'prefixIconData',
        type: 'IconData',
        default: '—',
        desc: '前置图标数据对象（内置图标集 / 自定义 IconData），优先于 `prefixIcon` 名。',
      },
      {
        name: 'suffixIconData',
        type: 'IconData',
        default: '—',
        desc: '后置图标数据对象（内置图标集 / 自定义 IconData），优先于 `suffixIcon` 名。',
      },
      {
        name: 'prefixIconUrl',
        type: 'string',
        default: "''",
        desc: '前置图片地址：渲染为 `<image>`，优先级低于 `prefixIconData`、高于 `prefixIcon`。',
      },
      {
        name: 'suffixIconUrl',
        type: 'string',
        default: "''",
        desc: '后置图片地址：渲染为 `<image>`，优先级低于 `suffixIconData`、高于 `suffixIcon`。',
      },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: '图标颜色（仅 SVG 图标；请传 `var(--sn-mp-color-*)` token）。',
      },
      {
        name: 'card',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: '卡片形态：该行渲染为独立圆角卡片（脱离分组或组内显式开启时生效）；组的整卡形态由 sn-cell-group 的 card 承担。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Cell · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Cell } from '@snui/uni';",
    chipCopy: "import { Cell } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-cell', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-layout', link: '/en/components/uni/layout' },
    next: { text: 'sn-fab', link: '/en/components/uni/fab' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
