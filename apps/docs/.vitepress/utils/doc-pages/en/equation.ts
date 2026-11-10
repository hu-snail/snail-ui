/** Equation · Web (PC) (Web) — English page data. Props from equation SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const equationDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Equation · Web (PC)' },
  ],
  title: 'Equation · Web (PC)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'LaTeX math rendering (mirrors n-equation). KaTeX is bundled — works out of' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/equation',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Equation · Web (PC).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Equation } from '@snui/vue-web';
</script>

<template>
  <Equation />
</template>`,
  },
  demos: [
    { name: 'equation-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'equation-web-katex-options', title: 'Katex options', blurb: 'Katex options' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'string',
        default: "''",
        desc: 'LaTeX expression string. Mirrors n-equation `value`.',
      },
      {
        name: 'katex',
        type: 'SnEquationKatex | undefined',
        default: 'undefined',
        desc: 'Custom katex-like renderer; overrides the bundled one. Mirrors n-equation `katex`.',
      },
      {
        name: 'katexOptions',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Options forwarded to renderToString (e.g. displayMode / macros). Mirrors n-equation `katexOptions`.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Equation · Web (PC) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Equation } from '@snui/vue-web';",
    chipCopy: "import { Equation } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Equation', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'empty', link: '/en/components/web/empty' },
    next: { text: 'image', link: '/en/components/web/image' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
