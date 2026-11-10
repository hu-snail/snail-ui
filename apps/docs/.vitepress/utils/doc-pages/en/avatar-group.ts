/** AvatarGroup · Web (Web) — English page data. Props from avatar-group SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const avatarGroupDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'AvatarGroup · Web' },
  ],
  title: 'AvatarGroup · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Stacks avatars in a row and collapses the overflow into a ' },
    { t: 'code', s: '+k' },
    { t: 'text', s: ' summary' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/avatar-group',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'AvatarGroup · Web.vue',
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
    { name: 'avatar-group-web-basic', title: 'Basic group', blurb: 'A single default tightening group.' },
    {
      name: 'avatar-group-web-max',
      title: 'Overflow cap and expand callback',
      blurb: 'Overflow cap and expand callback',
    },
    {
      name: 'avatar-group-web-shrink',
      title: 'Shrink behavior vs tightening',
      blurb: 'Shrink behavior vs tightening',
    },
    { name: 'avatar-group-web-image', title: 'Image avatars', blurb: 'Image avatars' },
  ],
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
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnAvatarGroup.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Avatar list — render `SnAvatar` elements. Mirrors n-avatar-group `default`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'AvatarGroup · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { AvatarGroup } from '@snui/vue-web';",
    chipCopy: "import { AvatarGroup } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'AvatarGroup', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'popselect', link: '/en/components/web/popselect' },
    next: { text: 'link', link: '/en/components/web/link' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
