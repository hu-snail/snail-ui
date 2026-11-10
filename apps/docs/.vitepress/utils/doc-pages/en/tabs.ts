/** Tabs (Web) — English page data. Props from SnTabs.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const tabsDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'Tabs' }],
  title: 'Tabs',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Tabbed panels. ' },
    { t: 'code', s: 'SnTabs' },
    { t: 'text', s: ' renders a tab strip; each ' },
    { t: 'code', s: 'SnTabPane' },
    {
      t: 'text',
      s: ' child contributes one tab and its panel content. Used for detail-page section switching, settings panes, dashboard views.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tabs',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Tabs.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tabs } from '@snui/vue-web';
</script>

<template>
  <Tabs />
</template>`,
  },
  demos: [
    { name: 'tabs-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'tabs-web-card-segment', title: 'Cards and segments', blurb: 'Cards and segments' },
    { name: 'tabs-web-chrome', title: 'Chrome-style tabs', blurb: 'Chrome-style tabs' },
    { name: 'tabs-web-chrome-toolbar', title: 'Chrome toolbar', blurb: 'Chrome toolbar' },
    { name: 'tabs-web-size', title: 'Size', blurb: 'Size' },
    { name: 'tabs-web-addable', title: 'Add and close', blurb: 'Add and close' },
    { name: 'tabs-web-before-leave', title: 'Before-leave guard', blurb: 'Before-leave guard' },
    { name: 'tabs-web-trigger', title: 'Trigger area', blurb: 'Trigger area' },
    { name: 'tabs-web-display-directive', title: 'Pane retention', blurb: 'Pane retention' },
    { name: 'tabs-web-bar-width', title: 'Bar width', blurb: 'Bar width' },
    { name: 'tabs-web-disabled', title: 'Disabled tabs', blurb: 'Disabled tabs' },
    {
      name: 'tabs-web-placement-left',
      title: 'Left placement',
      blurb: 'placement="left" — a vertical tab strip.',
    },
    { name: 'tabs-web-pane-style', title: 'Style hooks', blurb: 'Style hooks' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'value',
        type: 'string | number',
        default: '—',
        desc: 'Currently active pane name (controlled, `v-model:value`).',
      },
      {
        name: 'defaultValue',
        type: 'string | number',
        default: '—',
        desc: 'Initial active pane name (uncontrolled).',
      },
      {
        name: 'trigger',
        type: "'click' | 'hover'",
        default: "'click'",
        desc: 'Whether tabs activate on click or hover. Mirrors n-tabs `trigger`.',
      },
      {
        name: 'type',
        type: "'line' | 'card' | 'bar' | 'segment' | 'chrome'",
        default: "'bar'",
        desc: "Tab visual style. Mirrors n-tabs `type` (default `'bar'`) and adds `'chrome'` — a browser-style tab strip. `'chrome'` is an additive divergence from the reference, which has no browser chrome; it is tuned for the horizontal placements (top / bottom).",
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: "Tab strip size. Mirrors n-tabs `size`. Default 'medium'.",
      },
      {
        name: 'placement',
        type: "'top' | 'right' | 'bottom' | 'left' | 'start' | 'end'",
        default: "'top'",
        desc: 'Where the tab strip sits relative to the panes. Mirrors n-tabs `placement`. Deprecated `start` / `end` aliases map to left/right.',
      },
      {
        name: 'closable',
        type: 'boolean',
        default: 'false',
        desc: 'Show a close button on each tab. Mirrors n-tabs `closable`.',
      },
      {
        name: 'addable',
        type: 'boolean | { disabled?: boolean }',
        default: 'false',
        desc: 'Show a trailing "+" tab; accepts `true` or `{ disabled }` (naive-ui `addable`).',
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'false',
        desc: 'Animate the pane height on switch. Mirrors n-tabs `animated`.',
      },
      {
        name: 'justifyContent',
        type: "'space-between' | 'space-around' | 'space-evenly' | 'center' | 'start' | 'end'",
        default: '—',
        desc: 'Distribute tab strip items along the main axis. Mirrors n-tabs `justifyContent`.',
      },
      {
        name: 'tabsPadding',
        type: 'number',
        default: '0',
        desc: 'Extra padding (px) around the tab strip. Mirrors n-tabs `tabsPadding`. Default 0.',
      },
      {
        name: 'showScrollButton',
        type: 'boolean',
        default: 'false',
        desc: 'Show the scroll buttons when the strip overflows. Mirrors n-tabs `showScrollButton`.',
      },
      {
        name: 'tabStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Per-tab inline style. Mirrors n-tabs `tabStyle`.',
      },
      {
        name: 'tabClass',
        type: 'string',
        default: '—',
        desc: 'Per-tab class. Mirrors n-tabs `tabClass`.',
      },
      {
        name: 'addTabStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Add-tab inline style. Mirrors n-tabs `addTabStyle`.',
      },
      {
        name: 'addTabClass',
        type: 'string',
        default: '—',
        desc: 'Add-tab class. Mirrors n-tabs `addTabClass`.',
      },
      {
        name: 'paneClass',
        type: 'string',
        default: '—',
        desc: 'Class applied to every pane wrapper. Mirrors n-tabs `paneClass`.',
      },
      {
        name: 'paneStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style applied to every pane wrapper. Mirrors n-tabs `paneStyle`.',
      },
      {
        name: 'barWidth',
        type: 'number',
        default: '—',
        desc: "Fixed width for the active bar, in px. When omitted the bar matches the active tab's own width. Mirrors n-tabs `barWidth`.",
      },
      {
        name: 'centerActiveTab',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the active tab scrolled to the centre of the strip. Mirrors n-tabs `centerActiveTab`. Only meaningful when the strip overflows.',
      },
      {
        name: 'paneWrapperClass',
        type: 'string',
        default: '—',
        desc: 'Class on the pane wrapper element. Mirrors n-tabs `paneWrapperClass`.',
      },
      {
        name: 'paneWrapperStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Style on the pane wrapper element. Mirrors n-tabs `paneWrapperStyle`.',
      },
      {
        name: 'onBeforeLeave',
        type: '(name: string | number, oldName: string | number | null) => boolean | Promise<boolean>',
        default: '—',
        desc: 'Guard before switching tabs; `false` (or a promise resolving `false`) blocks it.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnTabs.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:value',
        payload: '(value: string | number)',
        desc: 'Fired when the active pane changes (`v-model:value`).',
      },
      {
        name: 'close',
        payload: '(name: string | number)',
        desc: 'Fired when a tab close button is clicked (naive-ui `onClose`).',
      },
      { name: 'add', payload: '—', desc: 'Fired when the add tab is clicked (naive-ui `onAdd`).' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnTabs.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Default slot: a sequence of `<SnTabPane>` children.' },
      {
        name: 'prefix',
        props: '—',
        desc: 'Content placed before the tab strip (naive-ui `prefix`).',
      },
      {
        name: 'suffix',
        props: '—',
        desc: 'Content placed after the tab strip (naive-ui `suffix`).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tabs ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tabs } from '@snui/vue-web';",
    chipCopy: "import { Tabs } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Tabs', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
