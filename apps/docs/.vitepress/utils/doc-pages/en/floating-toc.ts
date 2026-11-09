/** FloatingToc (Web) — English page data. Props from floating-toc SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const floatingTocDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'FloatingToc' },
  ],
  title: 'FloatingToc',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Avoid it on pages short enough not to scroll.' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/floating-toc',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'FloatingToc.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { FloatingToc } from '@snui/vue-web';
</script>

<template>
  <FloatingToc />
</template>`,
  },
  demos: [
    {
      name: 'floating-toc-web-basic',
      title: 'Examples',
      blurb: 'Rail tracks scrolling; hover expands the section list',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'placement',
        type: "'left' | 'right'",
        default: "'right'",
        desc: 'Side of the page the TOC sits on.',
      },
      {
        name: 'triggerMode',
        type: "'hover' | 'press'",
        default: "'hover'",
        desc: '`hover` opens on pointer / focus entry; `press` toggles on click.',
      },
      {
        name: 'hoverAction',
        type: "'open' | 'preview'",
        default: "'open'",
        desc: 'What resting the pointer on the rail does. `open` (default, HeroUI parity) expands the full panel after `openDelay`. `preview` instead shows a title + summary card for the single bar under the pointer and leaves the panel to click / keyboard — the two are mutually exclusive so they never stack on screen.',
      },
      {
        name: 'open',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Controlled open state. Omit it to keep the TOC uncontrolled.',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        default: 'false',
        desc: 'Initial open state when uncontrolled.',
      },
      {
        name: 'openDelay',
        type: 'number',
        default: '200',
        desc: 'Delay before opening on hover / focus, in ms.',
      },
      {
        name: 'closeDelay',
        type: 'number',
        default: '300',
        desc: 'Delay before closing on exit, in ms.',
      },
      {
        name: 'scrollContainer',
        type: 'string | HTMLElement | undefined',
        default: 'undefined',
        desc: 'Scroll container (selector or element). Auto-detected when omitted.',
      },
      {
        name: 'bound',
        type: 'number',
        default: '0',
        desc: 'Distance in px between the container top and the active line.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'FloatingToc ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { FloatingToc } from '@snui/vue-web';",
    chipCopy: "import { FloatingToc } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'FloatingToc', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    next: { text: 'float-button', link: '/en/components/web/float-button' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
