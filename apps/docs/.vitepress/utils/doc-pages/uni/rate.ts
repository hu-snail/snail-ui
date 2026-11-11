/**
 * Rate 评分（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-rate.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const rateDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Rate 评分' }],
  title: 'Rate 评分',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'sn-rate 基础评分：num 控制图标数量，tap 图标写回 v-model。' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-rate',
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
    fileLabel: 'Rate 评分.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Rate } from '@snui/uni';
</script>

<template>
  <sn-rate />
</template>`,
  },
  demos: [
    {
      name: 'rate-mp-basic',
      title: '基础用法',
      blurb: 'sn-rate 基础评分：num 控制图标数量，tap 图标写回 v-model。',
    },
    {
      name: 'rate-mp-half',
      title: '半星（`allowHalf`）',
      blurb: 'allowHalf 允许半星评分，v-model 出现 .5。',
    },
    {
      name: 'rate-mp-clearable',
      title: '可清空（`clearable`）',
      blurb: 'clearable 再次点击当前分数清空为 null。',
    },
    {
      name: 'rate-mp-color',
      title: '评分颜色（`activeColor`）',
      blurb: 'activeColor 支持逐图标数组（红 → 橙 → …）。',
    },
    {
      name: 'rate-mp-readonly',
      title: '只读（`readonly`）',
      blurb: 'readonly 拦掉点击，仅展示评分。',
    },
    {
      name: 'rate-mp-space',
      title: '间距与铺满（`space` / `size` / `block`）',
      blurb: 'space 控制图标间距（数字按 rpx 设计值 ×2）；size 控制图标尺寸；block 均分整行宽度。',
    },
    {
      name: 'rate-mp-icon',
      title: '自定义图标（`icon` / `activeIcon`）',
      blurb:
        'icon / activeIcon 走 sn-icon 注册表；iconPrefix 仅为对齐；color / activeColor 覆盖颜色。',
    },
    {
      name: 'rate-mp-css-icon',
      title: 'CSS 类图标（`cssIcon`）',
      blurb: 'cssIcon 传字符串按裸类名渲染、布尔形式挂 icon / active-icon 两个类名。',
    },
    {
      name: 'rate-mp-disabled',
      title: '禁用（`disabled`）',
      blurb: 'disabled 图标变淡且点击无效。',
    },
    {
      name: 'rate-mp-custom-style',
      title: '根节点样式（`customClass` / `customStyle`）',
      blurb: 'customClass / customStyle 追加在根节点上。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'number | null', default: 'null', desc: '绑定值。' },
      { name: 'num', type: 'number', default: '5', desc: '图标数量' },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读' },
      { name: 'size', type: 'string | number | undefined', default: 'undefined', desc: '尺寸。' },
      { name: 'space', type: 'string | number | undefined', default: 'undefined', desc: '间距。' },
      {
        name: 'color',
        type: 'string',
        default: "''",
        desc: 'Inactive icon color (CSS color). Empty = token default.',
      },
      {
        name: 'activeColor',
        type: 'string | string[]',
        default: "''",
        desc: 'Active icon color — a single color or one per icon.',
      },
      {
        name: 'icon',
        type: 'string',
        default: "'star'",
        desc: 'Inactive icon name (registry-resolved), default `star`.',
      },
      {
        name: 'activeIcon',
        type: 'string',
        default: "'star'",
        desc: 'Active icon name (registry-resolved), default `star`.',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: 'Icon class prefix (wd-rate parity; informational on the uni end).',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: '是否按 CSS 图标处理。',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
      { name: 'allowHalf', type: 'boolean', default: 'false', desc: '允许半选' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '再次点击当前分数清空为 null' },
      { name: 'block', type: 'boolean', default: 'false', desc: '块级撑满整行' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Rate 评分 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Rate } from '@snui/uni';",
    chipCopy: "import { Rate } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-rate', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Switch', link: '/components/uni/switch' },
    next: { text: 'Slider', link: '/components/uni/slider' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
