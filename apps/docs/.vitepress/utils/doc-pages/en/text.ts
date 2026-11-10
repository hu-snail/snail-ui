/** Text · Web (Web) — English page data. Props from text SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const textDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Text · Web' }],
  title: 'Text · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Typography (n-text / n-title / n-paragraph aligned). Six-color types, depth scale, inline styles, code background.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/text',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Text · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Text } from '@snui/vue-web';
</script>

<template>
  <Text />
</template>`,
  },
  demos: [
    { name: 'text-web-basic', title: 'Basic', blurb: 'Default text + six-color type.' },
    {
      name: 'text-web-styles',
      title: 'Style modifiers',
      blurb: 'strong / italic / underline / delete / code / disabled.',
    },
    {
      name: 'text-web-depth',
      title: 'Depth scale',
      blurb: "depth='1'-'3' applies to the default type.",
    },
    {
      name: 'text-web-title',
      title: 'Title & paragraph',
      blurb: 'SnTitle levels 1-6; SnParagraph line-height presets.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'",
        default: "'default'",
        desc: 'Semantic type — drives the text color. Mirrors n-text `type`.',
      },
      {
        name: 'depth',
        type: "'1' | '2' | '3' | undefined",
        default: 'undefined',
        desc: 'Gray scale — only applied for type="default". Mirrors n-text `depth`.',
      },
      {
        name: 'strong',
        type: 'boolean',
        default: 'false',
        desc: 'Bolder text. Mirrors n-text `strong`.',
      },
      {
        name: 'italic',
        type: 'boolean',
        default: 'false',
        desc: 'Italic text. Mirrors n-text `italic`.',
      },
      {
        name: 'underline',
        type: 'boolean',
        default: 'false',
        desc: 'Underlined text. Mirrors n-text `underline`.',
      },
      {
        name: 'delete',
        type: 'boolean',
        default: 'false',
        desc: 'Strike-through text. Mirrors n-text `delete`.',
      },
      {
        name: 'code',
        type: 'boolean',
        default: 'false',
        desc: 'Inline-code styling (mono font + subtle background). Mirrors n-text `code`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Greyed-out text with a not-allowed cursor.',
      },
      {
        name: 'tag',
        type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'blockquote'",
        default: "'span'",
        desc: 'Rendered element. Mirrors n-text `tag`.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Extra class merged onto the rendered element.',
      },
      {
        name: 'customStyle',
        type: 'string | CSSProperties | undefined',
        default: 'undefined',
        desc: 'Inline style merged onto the rendered element.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnText.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'default', props: '—', desc: 'Text content.' }],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Text · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Text } from '@snui/vue-web';",
    chipCopy: "import { Text } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Text', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'icon', link: '/en/components/web/icon' },
    next: { text: 'avatar', link: '/en/components/web/avatar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
