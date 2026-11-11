/** Icon (Web) — English page data. Props from icon SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const iconDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Icon' }],
  title: 'Icon',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Wrapper component for [lucide-vue-next](https://lucide.dev/guide/packages/lucide-vue-next). **Tree-shakeable by design**: named imports of individual icons let the bundler drop unused ones, so the production bundle contains only the icons you actually referenc',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/icon',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Icon.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Icon } from '@snui/vue-web';
</script>

<template>
  <Icon />
</template>`,
  },
  demos: [
    {
      name: 'icon-web-basic',
      title: 'Basic usage',
      blurb: 'Direct icon-component usage; 4 icons, 4 named imports, 4 paths in the bundle.',
    },
    {
      name: 'icon-web-size',
      title: 'Sizes',
      blurb: 'Five sizes (14 / 18 / 24 / 32 / 48).',
    },
    {
      name: 'icon-web-stroke',
      title: 'Stroke width',
      blurb: 'Three stroke widths (1 / 2 / 3) + absolute stroke (no scale with size).',
    },
    {
      name: 'icon-web-registry',
      title: 'Registry pattern',
      blurb:
        'registerSnIcons({ ... }) once, then look up icons by string `name` anywhere in the app.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'icon',
        type: 'IconComponent',
        default: '—',
        desc: "Pass a lucide-style icon component directly. This is the recommended path — the bundler can statically analyze the named import and tree-shake every icon you didn't reference.",
      },
      {
        name: 'name',
        type: 'string',
        default: '—',
        desc: 'Or look up an icon previously registered via `registerSnIcons()`. Use this for data-driven icon resolution (e.g. menu config from a server that ships icon names as strings).',
      },
      {
        name: 'size',
        type: 'number | string | undefined',
        default: '16',
        desc: 'Pixel size (or CSS length). Forwarded to the inner icon component.',
      },
      {
        name: 'color',
        type: 'string | undefined',
        default: "'currentColor'",
        desc: 'Stroke color. Inherits from `currentColor` by default.',
      },
      {
        name: 'strokeWidth',
        type: 'number | string | undefined',
        default: '2',
        desc: "Stroke width in design-units. Default 2 (lucide's standard).",
      },
      {
        name: 'strokeWidthAbsolute',
        type: 'boolean | undefined',
        default: 'false',
        desc: "If true, stroke width is interpreted in absolute pixels rather than scaling with `size`. Matches lucide's `absoluteStrokeWidth`.",
      },
      {
        name: 'defaultClass',
        type: 'string | undefined',
        default: '—',
        desc: 'Optional CSS class for the inner SVG element.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Icon ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Icon } from '@snui/vue-web';",
    chipCopy: "import { Icon } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Icon', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'divider', link: '/en/components/web/divider' },
    next: { text: 'text', link: '/en/components/web/text' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
