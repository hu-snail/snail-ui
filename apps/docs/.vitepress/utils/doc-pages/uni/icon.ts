/**
 * sn-icon 图标（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-icon.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const iconDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'sn-icon 图标' }],
  title: 'sn-icon 图标',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '跨端图标基础组件。四条渲染路径：**iconfont 字形**（' },
    { t: 'code', s: 'name' },
    { t: 'text', s: ' + ' },
    { t: 'code', s: 'classPrefix' },
    { t: 'text', s: '）、**内置图标目录**（string ' },
    { t: 'code', s: 'icon' },
    {
      t: 'text',
      s: '）、**第三方图标源按需加载**（Iconify / 自定义 Provider）、**inline SVG 数据**（',
    },
    { t: 'code', s: 'IconData' },
    { t: 'text', s: ' 对象）。全部路径共用同一个 ' },
    { t: 'code', s: 'size' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'color' },
    { t: 'text', s: ' / 描边契约。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-icon',
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
    fileLabel: 'sn-icon 图标.vue',
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
      title: '用法',
      blurb:
        'string icon API：内置目录名称直接渲染；registry 同名覆盖；与 SnButton 的 #icon slot 集成。',
    },
    {
      name: 'icon-mp-basic',
      title: '基础用法',
      blurb:
        '5 个内置 shortcut 图标（ChevronRight / Search / Settings / Heart / Trash）。每个 named import 是一个独立的 ESM 数据模块。',
    },
    {
      name: 'icon-mp-size',
      title: '尺寸与描边',
      blurb:
        '五档尺寸（14 / 18 / 24 / 32 / 48）+ 三档描边宽度（1 / 2 / 3）。移动端推荐 32rpx 为默认点击目标。',
    },
    {
      name: 'icon-mp-registry',
      title: '自定义 + 按钮集成',
      blurb: '自定义 IconData + SnButton 的 #icon slot 集成（Plus / 自定义 / X）。',
    },
    {
      name: 'icon-mp-custom',
      title: '根节点自定义类名与样式（`customClass` / `customStyle`）',
      blurb:
        'customClass 加虚线框；customStyle 字符串改颜色 / 内边距 / 底色；两者叠加；color prop 对照。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
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
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'sn-icon 图标 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Icon } from '@snui/uni';",
    chipCopy: "import { Icon } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-icon', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-button', link: '/components/uni/button' },
    next: { text: 'sn-text', link: '/components/uni/text' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
