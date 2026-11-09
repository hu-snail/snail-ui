/** Dropdown · Web (Web) — English page data. Props from dropdown SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dropdownDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Dropdown · Web' },
  ],
  title: 'Dropdown · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Dropdown menu (n-dropdown aligned). Click / hover triggers, six placements with flip, scroll-follow.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/dropdown',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Dropdown · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Dropdown } from '@snui/vue-web';
</script>

<template>
  <Dropdown />
</template>`,
  },
  demos: [
    {
      name: 'dropdown-web-basic',
      title: 'Basic',
      blurb: 'Click trigger + options (with divider).',
    },
    {
      name: 'dropdown-web-hover',
      title: 'Hover trigger',
      blurb: '300ms close delay, cancelled on panel hover.',
    },
    { name: 'dropdown-web-placement', title: 'Placement', blurb: 'Six placements + flip.' },
    {
      name: 'dropdown-web-submenu',
      title: 'Submenu',
      blurb: 'Slide-out second level + keyboard nav.',
    },
    {
      name: 'dropdown-web-context-menu',
      title: 'Context menu (right-click)',
      blurb: 'trigger=contextMenu: right-click opens at the pointer; icon rows; select closes.',
    },
    {
      name: 'dropdown-web-content-slot',
      title: 'Custom panel (#content slot)',
      blurb: '#content slot: custom icon rows, danger row, footer; close() dismisses.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'options',
        type: 'SnDropdownOption[]',
        default: '() => []',
        desc: "Menu options — action rows and `type: 'divider'` separators, mixed.",
      },
      {
        name: 'placement',
        type: 'SnDropdownPlacement',
        default: "'bottom'",
        desc: 'Where the panel anchors to the trigger (six bottom/top presets).',
      },
      {
        name: 'trigger',
        type: 'SnDropdownTrigger',
        default: "'hover'",
        desc: "What gesture opens the menu; the keyboard path works regardless. `'contextMenu'` opens on right-click anchored to the pointer.",
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables opening entirely.' },
      {
        name: 'size',
        type: 'SnDropdownSize',
        default: "'medium'",
        desc: 'Panel size preset — row height + font.',
      },
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Controlled show state. When passed, the panel only follows it and `update:show` is emitted instead of flipping internal state; omit for uncontrolled behavior.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Dropdown · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Dropdown } from '@snui/vue-web';",
    chipCopy: "import { Dropdown } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Dropdown', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tag', link: '/en/components/web/tag' },
    next: { text: 'popover', link: '/en/components/web/popover' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
