/**
 * Avatar 头像（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-avatar.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const avatarDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Avatar 头像' }],
  title: 'Avatar 头像',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '三种内容层与自定义底色：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-avatar',
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
    fileLabel: 'Avatar 头像.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Avatar } from '@snui/uni';
</script>

<template>
  <sn-avatar />
</template>`,
  },
  demos: [
    {
      name: 'avatar-mp-basic',
      title: '基础用法',
      blurb: '文字首字母、图标、自定义背景色、图片头像。',
    },
    {
      name: 'avatar-mp-size',
      title: '尺寸（size）',
      blurb: '预设尺寸 small / normal / medium / large；自定义数值与百分比尺寸。',
    },
    {
      name: 'avatar-mp-shape',
      title: '形状（shape）',
      blurb: 'round 圆形与 square 方形。',
    },
    {
      name: 'avatar-mp-fallback',
      title: '加载失败回退',
      blurb: '图片失败 → alt 文本 → 文字 → 图标，同时触发 error 事件。',
    },
    {
      name: 'avatar-mp-mode',
      title: '图片裁切（mode）',
      blurb:
        'mode 透传给内部 image（aspectFill 裁切 / aspectFit 留白）；附带 customClass / customStyle 根节点样式。',
    },
    {
      name: 'avatar-mp-status',
      title: '在线状态（status）',
      blurb: 'online 绿点 / offline 灰点（AUI 追加能力），状态追加进 aria-label。',
    },
    {
      name: 'avatar-mp-badge',
      title: '微标头像（badge 组合）',
      blurb: 'sn-badge 包裹 sn-avatar 组合出微标头像：数字角标 / 图标头像 / 红点。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'src',
        type: 'string',
        default: "''",
        desc: '图片地址。加载失败时按 `alt` → 文字 → 图标 顺序回退。',
      },
      {
        name: 'text',
        type: 'string',
        default: "''",
        desc: '文本内容（无图片 / 图片失败时显示）。',
      },
      {
        name: 'icon',
        type: 'string',
        default: "''",
        desc: '图标名称（经 `registerSnIcons()` 注册的 sn-icon 名称）。',
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
        name: 'size',
        type: 'string | number',
        default: "'normal'",
        desc: '头像尺寸：large / medium / normal / small，或自定义数值 / 单位字符串。',
      },
      {
        name: 'shape',
        type: "'round' | 'square'",
        default: "'round'",
        desc: '头像形状：round / square。',
      },
      { name: 'bgColor', type: 'string', default: "''", desc: '背景颜色（内联覆盖默认底色）。' },
      { name: 'color', type: 'string', default: "''", desc: '文字颜色（内联覆盖默认文字色）。' },
      { name: 'alt', type: 'string', default: "''", desc: '图片加载失败时的占位文本。' },
      {
        name: 'mode',
        type: 'string',
        default: "'aspectFill'",
        desc: '图片填充模式，同 uni-app x image 组件的 mode。',
      },
      {
        name: 'status',
        type: "'online' | 'offline' | ''",
        default: "''",
        desc: '在线状态（AUI 追加，wd-avatar 无此能力，见文件头注释）： `online` 绿点 / `offline` 灰点；不传则不渲染状态点。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Avatar 头像 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Avatar } from '@snui/uni';",
    chipCopy: "import { Avatar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-avatar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Badge', link: '/components/uni/badge' },
    next: { text: 'AvatarGroup', link: '/components/uni/avatar-group' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
