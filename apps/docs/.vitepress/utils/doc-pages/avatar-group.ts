/**
 * AvatarGroup 头像组 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const avatarGroupDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'AvatarGroup 头像组' },
  ],
  title: 'AvatarGroup 头像组',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '把多个头像叠放成组，溢出部分自动折叠为「+N」汇总头像。' }],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/avatar-group',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'AvatarGroup 头像组.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { AvatarGroup } from '@snui/vue-web';
</script>

<template>
  <AvatarGroup />
</template>`,
  },
  demos: [
    {
      name: 'avatar-group-web-basic',
      title: '代码演示',
      blurb: '收紧叠放 / shrink 逐个缩小 / maxOptions 溢出折叠 + onExpand。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'maxOptions',
        type: 'SnAvatarGroupMaxOptions | number | undefined',
        default: 'undefined',
        desc: 'Overflow control: `{ max, onExpand }` or a plain number. When the slot renders more avatars than `max`, the group shows `max − 1` avatars plus a clickable `+k` summary that calls `onExpand`. Mirrors n-avatar-group `maxOptions`.',
      },
      {
        name: 'size',
        type: "number | 'small' | 'medium' | 'large' | undefined",
        default: "'medium'",
        desc: 'Size applied to the overflow summary avatar. Mirrors n-avatar-group `size`.',
      },
      {
        name: 'sizeBehavior',
        type: "'tightening' | 'shrink'",
        default: "'tightening'",
        desc: "Layout for the stack: 'tightening' overlaps avatars with a negative margin, 'shrink' scales each following avatar down slightly.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'AvatarGroup 头像组 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { AvatarGroup } from '@snui/vue-web';",
    chipCopy: "import { AvatarGroup } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'AvatarGroup', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'popselect', link: '/components/web/popselect' },
    next: { text: 'link', link: '/components/web/link' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
