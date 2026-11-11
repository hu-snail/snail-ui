/** Avatar · uni-app x (Mobile) (uni-app x) — English page data. Props from sn-avatar.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const avatarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Avatar · uni-app x (Mobile)' },
  ],
  title: 'Avatar · uni-app x (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Three content layers plus a custom background:' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-avatar',
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
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Avatar · uni-app x (Mobile).vue',
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
      title: 'Basic usage',
      blurb: 'Text initials, icon, custom background colours and an image avatar.',
    },
    {
      name: 'avatar-mp-size',
      title: 'Size (`size`)',
      blurb: 'Presets small / normal / medium / large; custom numeric and percentage sizes.',
    },
    {
      name: 'avatar-mp-shape',
      title: 'Shape (`shape`)',
      blurb: 'Round and square shapes.',
    },
    {
      name: 'avatar-mp-fallback',
      title: 'Load-failure fallback',
      blurb: 'Image fails → alt text → text → icon, with an error event.',
    },
    {
      name: 'avatar-mp-css-icon',
      title: 'Font icons (`cssIcon` / `iconPrefix`)',
      blurb:
        'cssIcon + iconPrefix build the font-icon class; a string cssIcon is the prefix itself; placeholder glyphs prove the class landed on the glyph node.',
    },
    {
      name: 'avatar-mp-mode',
      title: 'Image fit (`mode`)',
      blurb:
        'mode is forwarded to the inner image (aspectFill crops / aspectFit letterboxes); plus customClass / customStyle root styling.',
    },
    {
      name: 'avatar-mp-status',
      title: 'Presence status (`status`)',
      blurb: 'online green dot / offline grey dot (AUI addition), announced via aria-label.',
    },
    {
      name: 'avatar-mp-badge',
      title: 'Badge avatars (badge composition)',
      blurb: 'sn-badge wrapping sn-avatar: count badge / icon avatar / dot.',
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
        desc: 'CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。',
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Avatar · uni-app x (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Avatar } from '@snui/uni';",
    chipCopy: "import { Avatar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-avatar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Badge', link: '/en/components/uni/badge' },
    next: { text: 'AvatarGroup', link: '/en/components/uni/avatar-group' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
