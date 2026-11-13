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
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
    { name: 'avatar-group-web-basic', title: '基础头像组', blurb: '默认收紧叠放。' },
    { name: 'avatar-group-web-max', title: '数量上限与展开回调', blurb: '数量上限与展开回调' },
    {
      name: 'avatar-group-web-square',
      title: '方形 / 圆角 / 圆形组',
      blurb: 'circle / round 让「+N」摘要与堆叠头像保持同形状。',
    },
    { name: 'avatar-group-web-shrink', title: '尺寸渐变与收紧叠放', blurb: '尺寸渐变与收紧叠放' },
    { name: 'avatar-group-web-image', title: '图片头像', blurb: '图片头像' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'maxOptions',
        type: 'SnAvatarGroupMaxOptions | number | undefined',
        default: 'undefined',
        desc: '最多展示的选项数。',
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
      {
        name: 'circle',
        type: 'boolean',
        default: 'false',
        desc: '圆形摘要头像（additive）——堆叠为圆形头像时让「+N」同形状。',
      },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: '圆角摘要头像（additive）——见 `circle`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnAvatarGroup.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: '头像列表，通常放置 `SnAvatar`。对齐 n-avatar-group `default`。',
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
