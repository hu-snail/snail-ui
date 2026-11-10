/** AvatarGroup (uni-app) — English page data. Props from sn-avatar-group.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const avatarGroupDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'AvatarGroup' }],
  title: 'AvatarGroup',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: "The group's " },
    { t: 'code', s: 'size' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'shape' },
    { t: 'text', s: ' **override** the same prop on every member ' },
    { t: 'code', s: 'sn-avatar' },
    {
      t: 'text',
      s: ' (the reference\'s "uniformly set the group\'s avatars" contract). Members also receive the stack overlap and separating ring; a standalone ',
    },
    { t: 'code', s: 'sn-avatar' },
    { t: 'text', s: ' is unaffected.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-avatar-group',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'AvatarGroup.vue',
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
      title: 'Basic usage',
      blurb:
        'Max-count collapse, custom collapse text (collapse-avatar), cascading direction, vertical stacking and uniform size / shape.',
    },
  ],
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'AvatarGroup ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { AvatarGroup } from '@snui/uni';",
    chipCopy: "import { AvatarGroup } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-avatar-group', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-avatar', link: '/en/components/uni/avatar' },
    next: { text: 'sn-navbar', link: '/en/components/uni/navbar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
