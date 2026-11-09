/** Notification (Web) — English page data. Props from notification SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const notificationDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Notification' },
  ],
  title: 'Notification',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Unlike ' },
    { t: 'code', s: 'SnAlert' },
    { t: 'text', s: ' (inline, stays in the document flow) and ' },
    { t: 'code', s: 'SnDialog' },
    {
      t: 'text',
      s: ' (blocking, requires a user decision), notifications are transient global overlays.',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/notification',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Notification.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Notification } from '@snui/vue-web';
</script>

<template>
  <Notification />
</template>`,
  },
  demos: [
    { name: 'notification-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'notification-web-types', title: 'Four semantic types', blurb: 'Four semantic types' },
    { name: 'notification-web-placement', title: 'Stack placement', blurb: 'Stack placement' },
    { name: 'notification-web-max', title: 'Max count', blurb: 'Max count' },
    {
      name: 'notification-web-custom',
      title: 'Custom content and handle-based closing',
      blurb: 'Custom content and handle-based closing',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: 'NotificationType | undefined',
        default: "'default'",
        desc: 'Semantic type — drives the built-in icon + colour.',
      },
      {
        name: 'title',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Bold heading line.',
      },
      {
        name: 'content',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Primary body text. Replaced by the default slot.',
      },
      {
        name: 'description',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Secondary body text under `content`.',
      },
      {
        name: 'meta',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Small footer-left caption.',
      },
      {
        name: 'duration',
        type: 'number | undefined',
        default: '3000',
        desc: 'Auto-destroy delay in ms. `<= 0` disables the countdown.',
      },
      {
        name: 'closable',
        type: 'boolean | undefined',
        default: 'true',
        desc: 'Render the close button.',
      },
      {
        name: 'keepAliveOnHover',
        type: 'boolean | undefined',
        default: 'true',
        desc: 'Pause the countdown while hovered.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Notification ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Notification } from '@snui/vue-web';",
    chipCopy: "import { Notification } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Notification', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    next: { text: 'loading-bar', link: '/en/components/web/loading-bar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
