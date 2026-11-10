/** Avatar · Web (Web) — English page data. Props from avatar SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const avatarDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Avatar · Web' }],
  title: 'Avatar · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Avatar (n-avatar aligned). Image / text / icon with automatic fallback.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/avatar',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Avatar · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Avatar } from '@snui/vue-web';
</script>

<template>
  <Avatar />
</template>`,
  },
  demos: [
    { name: 'avatar-web-basic', title: 'Basic', blurb: 'Image src + sizes.' },
    { name: 'avatar-web-shapes', title: 'Shapes & color', blurb: 'round / circle / color.' },
    {
      name: 'avatar-web-fallback',
      title: 'Fallback',
      blurb: 'Load error → fallbackText / icon; resets when src changes.',
    },
    {
      name: 'avatar-web-lazy',
      title: 'Lazy loading',
      blurb:
        'Avatars in a long scrollable list: lazy uses the native loading=lazy attribute; adding intersection-observer-options defers the request until the avatar enters the viewport (point root at the scroll container).',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'size',
        type: "number | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Pixel size, or a named scale. Mirrors n-avatar `size`.',
      },
      { name: 'src', type: 'string | undefined', default: 'undefined', desc: 'Image URL.' },
      {
        name: 'color',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Background color (any CSS color value). Mirrors n-avatar `color`.',
      },
      {
        name: 'objectFit',
        type: "'fill' | 'contain' | 'cover' | 'none' | 'scale-down'",
        default: "'cover'",
        desc: 'Image fit inside the box. Mirrors n-avatar `objectFit`.',
      },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: 'Pill-shaped corners. Mirrors n-avatar `round`.',
      },
      {
        name: 'circle',
        type: 'boolean',
        default: 'false',
        desc: 'Circular. Mirrors n-avatar `circle`.',
      },
      {
        name: 'fallbackText',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Text thumbnail shown when there is no image.',
      },
      {
        name: 'icon',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'SnIcon registry name for the placeholder glyph.',
      },
      {
        name: 'lazy',
        type: 'boolean',
        default: 'false',
        desc: 'Load on viewport entry. Same contract as SnImage `lazy`.',
      },
      {
        name: 'intersectionObserverOptions',
        type: 'LazyVisibilityOptions | undefined',
        default: 'undefined',
        desc: 'IntersectionObserver config for lazy loading (see SnImage).',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnAvatar.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'error',
        payload: 'Event',
        desc: 'Fired when the image fails to load; switches to fallback (n-avatar `onError`).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnAvatar.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Custom avatar content — shown when there is no image.',
      },
      {
        name: 'icon',
        props: '—',
        desc: 'Placeholder glyph — replaces `icon` or the builtin person SVG.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Avatar · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Avatar } from '@snui/vue-web';",
    chipCopy: "import { Avatar } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Avatar', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'text', link: '/en/components/web/text' },
    next: { text: 'tag', link: '/en/components/web/tag' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
