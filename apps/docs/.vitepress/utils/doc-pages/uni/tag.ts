/**
 * Tag 标签（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-tag.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tagDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Tag 标签' }],
  title: 'Tag 标签',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '十种语义色，覆盖状态与分类两类常见场景：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tag',
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
    fileLabel: 'Tag 标签.vue',
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
      title: '基础用法',
      blurb:
        '十种语义色：default / primary / success / warning / danger / volcano / lightblue / cyan / pink / purple。',
    },
    {
      name: 'tag-mp-size',
      title: '尺寸（size）',
      blurb: '尺寸 small / default / large / extra-large 四档对比。',
    },
    {
      name: 'tag-mp-round-mark',
      title: '胶囊与标记形（round / mark）',
      blurb: 'round 胶囊形；mark 非对称圆角标记形；两者可叠加。',
    },
    {
      name: 'tag-mp-variant',
      title: '变体',
      blurb:
        'variant 五档：dark 实心填充、light 浅色底、plain 描边、dashed 虚线描边、text 纯文字。',
    },
    {
      name: 'tag-mp-shape',
      title: '形状',
      blurb:
        'shape 六种形态：square 直角、round 胶囊、skew 平行四边形、ribbon 右端旗标、fold 右上折角、ticket 两侧票券缺口。',
    },
    {
      name: 'tag-mp-icon',
      title: '图标',
      blurb:
        'icon 内置目录名（无需注册）与 IconData 对象（sn-icon-set 具名导入）；iconUrl 位图图标，尺寸随标签字号缩放。',
    },
    {
      name: 'tag-mp-closable',
      title: '可关闭标签（closable）',
      blurb: 'closable 可移除的筛选条件，@close 实时移除；清空后点虚线标签恢复。',
    },
    {
      name: 'tag-mp-dynamic',
      title: '动态新增标签（dynamic）',
      blurb: 'dynamic 行内输入，@confirm 确认后进入已添加列表，同样可关闭。',
    },
    {
      name: 'tag-mp-color',
      title: '自定义颜色（bgColor / color）',
      blurb:
        'bgColor 品牌色接管（底色与边框同步改）；color 只改文字色；附带 customClass / customStyle 根节点样式。',
    },
    {
      name: 'tag-mp-css-icon',
      title: '字体图标（cssIcon）',
      blurb:
        'iconPrefix + cssIcon 拼出字体图标类；字符串 cssIcon 直接当前缀；几何形占位验证类名挂载。',
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
        desc: '是否按 CSS 图标处理。',
      },
      {
        name: 'shape',
        type: "'square' | 'round' | 'skew' | 'ribbon' | 'fold' | 'ticket'",
        default: "'square'",
        desc: '异形形态（AUI-OPT-17，§112.3a）：square 直角矩形、skew 平行四边形、 ribbon 右端旗标、fold 右上折角、ticket 两侧票券缺口、round 胶囊。 非 square 时优先于 `round` sugar。',
      },
      { name: 'closable', type: 'boolean', default: 'false', desc: '是否可关闭' },
      {
        name: 'dynamic',
        type: 'boolean',
        default: 'false',
        desc: '是否为新增标签（渲染行内输入）',
      },
      { name: 'color', type: 'string', default: "''", desc: '文字颜色（内联覆盖）。' },
      { name: 'bgColor', type: 'string', default: "''", desc: '背景色和边框色（内联覆盖）。' },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: "是否圆角（胶囊形）。等价于 `shape: 'round'` 的 sugar，`shape` 优先。",
      },
      { name: 'mark', type: 'boolean', default: 'false', desc: '是否标记样式（非对称圆角）' },
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tag 标签 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tag } from '@snui/uni';",
    chipCopy: "import { Tag } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tag', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Gap', link: '/components/uni/gap' },
    next: { text: 'Badge', link: '/components/uni/badge' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
