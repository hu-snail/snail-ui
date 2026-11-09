/** Dialog (Web) — English page data. Props from SnDialog.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dialogDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback' }, { text: 'Dialog' }],
  title: 'Dialog',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A modal **panel**: a titled card with an optional type icon, a body and a row of dialog buttons. Renders a confirmation / alert / info card that is meant to be placed inside an overlay.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/dialog',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Dialog.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Dialog } from '@snui/vue-web';
</script>

<template>
  <Dialog />
</template>`,
  },
  demos: [
    { name: 'dialog-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'dialog-web-types', title: 'Types and layout', blurb: 'Types and layout' },
    { name: 'dialog-web-async', title: 'Async confirm', blurb: 'Async confirm' },
    { name: 'dialog-web-action', title: 'Custom actions', blurb: 'Custom actions' },
    { name: 'dialog-web-borderless', title: 'Borderless', blurb: 'Borderless' },
    { name: 'dialog-web-slots', title: 'Slot overrides', blurb: 'Slot overrides' },
    { name: 'dialog-web-controlled', title: 'Controlled', blurb: 'Controlled' },
    { name: 'dialog-web-use-dialog', title: 'Use dialog', blurb: 'Use dialog' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'icon',
        type: 'IconComponent',
        default: 'undefined as any',
        desc: 'Custom icon component, replacing the per-`type` default.',
      },
      {
        name: 'type',
        type: 'DialogType',
        default: "'default'",
        desc: 'Semantic type — drives the default icon + its colour.',
      },
      {
        name: 'title',
        type: 'string',
        default: 'undefined as any',
        desc: 'Panel title. Mirrors n-dialog `title`.',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'true',
        desc: 'Show the close button. Mirrors n-dialog `closable`.',
      },
      {
        name: 'negativeText',
        type: 'string',
        default: 'undefined as any',
        desc: 'Cancel button label. Omit to hide the button.',
      },
      {
        name: 'positiveText',
        type: 'string',
        default: 'undefined as any',
        desc: 'Confirm button label. Omit to hide the button.',
      },
      {
        name: 'positiveButtonProps',
        type: 'Record<string, unknown>',
        default: 'undefined as any',
        desc: 'Extra props forwarded to the confirm button.',
      },
      {
        name: 'negativeButtonProps',
        type: 'Record<string, unknown>',
        default: 'undefined as any',
        desc: 'Extra props forwarded to the cancel button.',
      },
      {
        name: 'content',
        type: 'string',
        default: 'undefined as any',
        desc: 'Body text. Mirrors n-dialog `content`.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: 'Whether to render the type icon. Mirrors n-dialog `showIcon`.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Confirm button enters its loading state. Mirrors n-dialog `loading`.',
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'false',
        desc: 'Draw a border around the panel. Mirrors n-dialog `bordered`.',
      },
      {
        name: 'iconPlacement',
        type: 'IconPlacement',
        default: 'undefined as any',
        desc: "Icon above the title ('top') or inline before it ('left').",
      },
      {
        name: 'titleClass',
        type: 'string | Array<string | undefined>',
        default: 'undefined as any',
        desc: 'Extra class on the title row.',
      },
      {
        name: 'titleStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: 'Extra style on the title row.',
      },
      {
        name: 'contentClass',
        type: 'string | Array<string | undefined>',
        default: 'undefined as any',
        desc: 'Extra class on the body.',
      },
      {
        name: 'contentStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: 'Extra style on the body.',
      },
      {
        name: 'actionClass',
        type: 'string | Array<string | undefined>',
        default: 'undefined as any',
        desc: 'Extra class on the action row.',
      },
      {
        name: 'actionStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: 'Extra style on the action row.',
      },
      {
        name: 'closeFocusable',
        type: 'boolean',
        default: 'false',
        desc: 'Make the close button keyboard-focusable.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Dialog ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Dialog } from '@snui/vue-web';",
    chipCopy: "import { Dialog } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Dialog', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'Props Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
