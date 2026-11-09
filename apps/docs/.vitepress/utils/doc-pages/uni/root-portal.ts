/**
 * RootPortal 根节点传送（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-root-portal.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const rootPortalDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'RootPortal 根节点传送' },
  ],
  title: 'RootPortal 根节点传送',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '下方容器设了 ' },
    { t: 'code', s: 'overflow: hidden' },
    { t: 'text', s: '，普通内容会被裁掉；包在 ' },
    { t: 'code', s: 'sn-root-portal' },
    { t: 'text', s: ' 里之后，内容浮在视口层上，不再被裁。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-root-portal',
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
    fileLabel: 'RootPortal 根节点传送.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { RootPortal } from '@snui/uni';
</script>

<template>
  <sn-root-portal />
</template>`,
  },
  demos: [
    {
      name: 'root-portal-mp-basic',
      title: '基础用法',
      blurb: '挂载 / 卸载传送层，观察内容是否被祖先裁剪。',
    },
    {
      name: 'root-portal-mp-custom',
      title: '自定义类名与内联样式',
      blurb:
        'customClass 控制固定层（预览里改 absolute 以免盖住手机屏），customStyle 追加内联样式。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: "Extra class on the fixed layer. Additive AUI hook, not part of wd-root-portal's surface: without a teleport target the layer is the only thing a caller can style, so it needs an escape hatch. Documented as additive.",
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Extra inline style on the fixed layer. Additive, same reason.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'RootPortal 根节点传送 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { RootPortal } from '@snui/uni';",
    chipCopy: "import { RootPortal } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-root-portal', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-config-provider', link: '/components/uni/config-provider' },
    next: { text: 'sn-divider', link: '/components/uni/divider' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
