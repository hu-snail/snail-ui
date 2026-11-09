/**
 * Switch 开关（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-switch.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const switchDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Switch 开关' }],
  title: 'Switch 开关',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '跨 uni-app 多端的开关控件。easycom 自动注册（' },
    { t: 'code', s: 'components/sn-switch/sn-switch.vue' },
    { t: 'text', s: ' → ' },
    { t: 'code', s: '<sn-switch>' },
    { t: 'text', s: '），几何值使用 ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: '，颜色全部走 ' },
    { t: 'code', s: '--sn-mp-*' },
    { t: 'text', s: ' token。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-switch',
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
    fileLabel: 'Switch 开关.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Switch } from '@snui/uni';
</script>

<template>
  <sn-switch />
</template>`,
  },
  demos: [
    { name: 'switch-mp-basic', title: '基础用法', blurb: 'v-model + change 事件。' },
    {
      name: 'switch-mp-appearance',
      title:
        '外观（`activeText` / `inactiveText` / `shape` / `size` / `activeColor` / `inactiveColor`）',
      blurb: '轨道文案、square 形状、自定义尺寸、自定义颜色。',
    },
    {
      name: 'switch-mp-before-change',
      title:
        '受控守卫与状态（`activeValue` / `inactiveValue` / `beforeChange` / `loading` / `disabled`）',
      blurb: '字符串 activeValue/inactiveValue；beforeChange 拦截；loading；disabled。',
    },
    {
      name: 'switch-mp-icons',
      title: '图标（`activeActionIcon` / `inactiveActionIcon` / `activeIcon` / `inactiveIcon`）',
      blurb:
        'activeActionIcon / inactiveActionIcon 旋钮图标；activeIcon / inactiveIcon 轨道图标；图标与文案混用。',
    },
    {
      name: 'switch-mp-css-icons',
      title:
        'CSS 类图标（`activeActionCssIcon` / `inactiveActionCssIcon` / `activeCssIcon` / `inactiveCssIcon` / `classPrefix`）',
      blurb:
        'activeActionCssIcon / inactiveActionCssIcon；activeCssIcon / inactiveCssIcon；classPrefix。',
    },
    {
      name: 'switch-mp-loading-custom',
      title: '加载与自定义样式（`loadingProps` / `customClass` / `customStyle`）',
      blurb:
        'loading（旋钮内 spinner）；loadingProps（声明但未参与渲染）；customClass；customStyle。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnSwitchValue',
        default: 'false',
        desc: 'Bound value — compared against `activeValue` / `inactiveValue`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction and dims the rail.',
      },
      {
        name: 'inactiveActionIcon',
        type: 'string',
        default: "''",
        desc: 'Knob icon while inactive (registry-resolved via sn-icon).',
      },
      {
        name: 'activeActionIcon',
        type: 'string',
        default: "''",
        desc: 'Knob icon while active (registry-resolved via sn-icon).',
      },
      {
        name: 'activeIcon',
        type: 'string',
        default: "''",
        desc: 'Rail icon while active — overrides `activeText`.',
      },
      {
        name: 'inactiveIcon',
        type: 'string',
        default: "''",
        desc: 'Rail icon while inactive — overrides `inactiveText`.',
      },
      {
        name: 'classPrefix',
        type: 'string',
        default: "'wd-icon'",
        desc: 'CSS class prefix used for icon lookup (wd-switch parity, informational).',
      },
      {
        name: 'inactiveActionCssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `inactiveActionIcon` is a CSS class name, not an icon name.',
      },
      {
        name: 'activeActionCssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `activeActionIcon` is a CSS class name, not an icon name.',
      },
      {
        name: 'activeCssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `activeIcon` is a CSS class name, not an icon name.',
      },
      {
        name: 'inactiveCssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `inactiveIcon` is a CSS class name, not an icon name.',
      },
      {
        name: 'activeText',
        type: 'string',
        default: "''",
        desc: 'Label shown inside the rail while active.',
      },
      {
        name: 'inactiveText',
        type: 'string',
        default: "''",
        desc: 'Label shown inside the rail while inactive.',
      },
      {
        name: 'activeValue',
        type: 'SnSwitchValue',
        default: 'true',
        desc: 'Value that means "on". Compared by strict equality.',
      },
      {
        name: 'inactiveValue',
        type: 'SnSwitchValue',
        default: 'false',
        desc: 'Value that means "off". Compared by strict equality.',
      },
      {
        name: 'activeColor',
        type: 'string',
        default: "''",
        desc: 'Active rail color (user CSS color; falls back to the token default).',
      },
      {
        name: 'inactiveColor',
        type: 'string',
        default: "''",
        desc: 'Inactive rail color (user CSS color; falls back to the token default).',
      },
      {
        name: 'size',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Rail size — a number is treated as an rpx design value.',
      },
      { name: 'shape', type: "'round' | 'square'", default: "'round'", desc: 'Rail shape.' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Shows a spinner in the knob and blocks interaction while pending.',
      },
      { name: 'color', type: 'string', default: '—', desc: 'color' },
      {
        name: 'size',
        type: 'number | string',
        default: 'undefined',
        desc: 'Rail size — a number is treated as an rpx design value.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Switch 开关 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Switch } from '@snui/uni';",
    chipCopy: "import { Switch } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-switch', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-radio', link: '/components/uni/radio' },
    next: { text: 'sn-rate', link: '/components/uni/rate' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
