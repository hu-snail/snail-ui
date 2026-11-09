/**
 * AvatarGroup 头像组（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-avatar-group.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const avatarGroupDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'AvatarGroup 头像组' },
  ],
  title: 'AvatarGroup 头像组',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '如需显式 import：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-avatar-group',
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
    fileLabel: 'AvatarGroup 头像组.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { AvatarGroup } from '@snui/uni';
</script>

<template>
  <sn-avatar-group />
</template>`,
  },
  demos: [
    {
      name: 'avatar-mp-group',
      title: '基础用法',
      blurb:
        '最大数量折叠（max-count）、自定义折叠文本（collapse-avatar）、叠层方向（cascading）、垂直堆叠（vertical）与统一尺寸 / 形状。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'maxCount',
        type: 'number | undefined',
        default: 'undefined',
        desc: '最大显示数量（含折叠头像占用的 1 个位置），超出后显示折叠头像。',
      },
      {
        name: 'cascading',
        type: "'left-up' | 'right-up'",
        default: "'left-up'",
        desc: '叠层方向：left-up（向左叠）/ right-up（向右叠）。',
      },
      {
        name: 'collapseAvatar',
        type: 'string',
        default: "''",
        desc: '超出最大数量时折叠头像显示文本；留空时自动显示 `+N`。',
      },
      {
        name: 'vertical',
        type: 'boolean',
        default: 'false',
        desc: '是否垂直展示（垂直时忽略 `cascading`）。',
      },
      {
        name: 'shape',
        type: "'round' | 'square'",
        default: "'round'",
        desc: '统一设置组内头像形状。',
      },
      {
        name: 'size',
        type: 'string | number',
        default: "'normal'",
        desc: '统一设置组内头像尺寸（预设名 / 数值 px / `rpx` 长度）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'AvatarGroup 头像组 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { AvatarGroup } from '@snui/uni';",
    chipCopy: "import { AvatarGroup } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-avatar-group', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-avatar', link: '/components/uni/avatar' },
    next: { text: 'sn-navbar', link: '/components/uni/navbar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
