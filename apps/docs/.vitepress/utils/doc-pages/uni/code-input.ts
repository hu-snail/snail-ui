/**
 * CodeInput 验证码输入框（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-code-input.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const codeInputDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'CodeInput 验证码输入框' },
  ],
  title: 'CodeInput 验证码输入框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '方框验证码框：' },
    { t: 'code', s: 'length' },
    { t: 'text', s: ' 控制格子数，' },
    { t: 'code', s: 'mask' },
    { t: 'text', s: ' 控制是否显示圆点，' },
    { t: 'code', s: 'focused' },
    { t: 'text', s: ' 与键盘显隐联动；默认 ' },
    { t: 'code', s: 'gutter=8' },
    { t: 'text', s: '（16rpx 格子间距），传 ' },
    { t: 'code', s: 'gutter=0' },
    { t: 'text', s: ' 可回到贴合布局。' },
  ],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-code-input',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'CodeInput 验证码输入框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { CodeInput } from '@snui/uni';
</script>

<template>
  <sn-code-input />
</template>`,
  },
  demos: [
    {
      name: 'code-input-mp-basic',
      title: '基础用法',
      blurb: '方框验证码框：length 控制格子数，mask 控制是否显示圆点，focused 与键盘显隐联动。',
    },
    {
      name: 'code-input-mp-shape',
      title: '格子形状（`shape`）',
      blurb: "shape='box' 方框（默认）与 shape='underline' 下划线两种格子形状。",
    },
    {
      name: 'code-input-mp-background',
      title: '格子背景（`background`）',
      blurb: 'background 属性给格子自定义背景色（token 或任意 CSS 色均可）。',
    },
    {
      name: 'code-input-mp-border',
      title: '无边框（`border`）',
      blurb: "border='none' 去掉格子全部边框（含下划线底线），纯背景色格子；常与 background 搭配。",
    },
    {
      name: 'code-input-mp-error-gutter',
      title: '明文、错误态与间距（`mask` / `errorInfo` / `gutter`）',
      blurb:
        'mask=false 显示明文；errorInfo 覆盖 info 并把边框切成危险色；默认 16rpx 格子间距，gutter 可调。',
    },
    {
      name: 'code-input-mp-custom-style',
      title: '根节点自定义类名与样式（`customClass` / `customStyle`）',
      blurb: 'customClass 追加在根节点上；customStyle 追加在组件自身变量之后，可继续覆盖其它属性。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Current value (`v-model`).' },
      { name: 'mask', type: 'boolean', default: 'true', desc: '是否隐藏为圆点' },
      { name: 'info', type: 'string', default: "''", desc: 'Helper text below the boxes.' },
      {
        name: 'errorInfo',
        type: 'string',
        default: "''",
        desc: 'Error text below the boxes (takes precedence over `info`).',
      },
      {
        name: 'gutter',
        type: 'number | string',
        default: '8',
        desc: 'Gap between boxes. A number is treated as an rpx design value.',
      },
      {
        name: 'border',
        type: "'all' | 'none'",
        default: "'all'",
        desc: "Cell border: `all` (default) draws the reference frame; `none` strips every border in both shapes — background-only cells (additive). Named after sn-input's `border`.",
      },
      {
        name: 'shape',
        type: "'box' | 'underline'",
        default: "'box'",
        desc: 'Box shape: framed `box` cells or borderless `underline` cells (additive).',
      },
      {
        name: 'background',
        type: 'string',
        default: "''",
        desc: 'Cell background color (any CSS color or `var(--sn-mp-color-*)`, additive).',
      },
      { name: 'length', type: 'number', default: '6', desc: '方框数量' },
      {
        name: 'focused',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the field is focused (shows the caret).',
      },
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
    copy: 'CodeInput 验证码输入框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { CodeInput } from '@snui/uni';",
    chipCopy: "import { CodeInput } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-code-input', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-textarea', link: '/components/uni/textarea' },
    next: { text: 'sn-keyboard', link: '/components/uni/keyboard' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
