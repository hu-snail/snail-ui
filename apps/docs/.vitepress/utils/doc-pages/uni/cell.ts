/**
 * Cell 单元格（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-cell.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const cellDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Cell 单元格' }],
  title: 'Cell 单元格',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：' }],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-cell',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Cell 单元格.vue',
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
      title: '基础用法',
      blurb:
        'cell-group 的 title / value 渲染分组标题；insert 圆角卡片风格；value 为空时显示 placeholder。',
    },
    {
      name: 'cell-mp-link',
      title: '链接、图标与点击反馈',
      blurb:
        'is-link 箭头 + 点击反馈；prefix-icon 前置图标；arrow-direction=down 朝下箭头；clickable 仅点击反馈无箭头。',
    },
    {
      name: 'cell-mp-layout',
      title: '布局、必填与对齐',
      blurb:
        'layout=vertical 纵向布局；required 必填星号（asterisk-position 控制位置）；title-width / value-align 控制列宽与对齐。',
    },
    {
      name: 'cell-mp-icon',
      title: '图标来源与尺寸',
      blurb:
        '三种图标来源对比：内置图标集对象、图片地址、注册表名；iconSize 传 tiny/small/medium/large/xlarge 档位；iconColor 走颜色 token。',
    },
    {
      name: 'cell-mp-card',
      title: '卡片单元格',
      blurb: 'card 模式下每行独立成卡：左侧图标 + 标题 + 右箭头；分组开启可整组继承。',
    },
  ],
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
      { name: 'iconSize', type: 'string | number | undefined', default: '—', desc: '图标尺寸。' },
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
        desc: '是否按 CSS 图标处理。',
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
        desc: '跳转是否替换历史（仅随 `click` 透出）',
      },
      { name: 'clickable', type: 'boolean', default: 'false', desc: '是否开启点击反馈' },
      { name: 'isLink', type: 'boolean', default: 'false', desc: '是否展示右侧箭头并开启点击反馈' },
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
      { name: 'border', type: 'boolean | undefined', default: 'undefined', desc: '是否展示外边框' },
      {
        name: 'titleWidth',
        type: 'string | number | undefined',
        default: '—',
        desc: '标题列宽度。',
      },
      {
        name: 'center',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: '子单元格垂直居中（继承）',
      },
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
        desc: '值的对齐方式。',
      },
      { name: 'required', type: 'boolean', default: 'false', desc: '是否显示必填星号' },
      {
        name: 'asteriskPosition',
        type: "'start' | 'end'",
        default: "'start'",
        desc: '必填星号位置：start / end。',
      },
      { name: 'hideAsterisk', type: 'boolean', default: 'false', desc: '是否隐藏必填星号' },
      { name: 'ellipsis', type: 'boolean', default: 'false', desc: '内容超出是否省略' },
      { name: 'useTitleSlot', type: 'boolean', default: 'true', desc: '是否启用 `title` 插槽' },
      { name: 'useLabelSlot', type: 'boolean', default: 'true', desc: '是否启用 `label` 插槽' },
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
        desc: '前置图标数据对象（内置图标集 / 自定义），优先于 `prefixIcon`',
      },
      {
        name: 'suffixIconData',
        type: 'IconData',
        default: '—',
        desc: '后置图标数据对象（内置图标集 / 自定义），优先于 `suffixIcon`',
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
        desc: '子单元格卡片形态（继承）',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Cell 单元格 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Cell } from '@snui/uni';",
    chipCopy: "import { Cell } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-cell', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Layout', link: '/components/uni/layout' },
    next: { text: 'Fab', link: '/components/uni/fab' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
