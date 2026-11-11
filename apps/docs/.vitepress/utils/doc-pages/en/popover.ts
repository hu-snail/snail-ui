/** Popover · Web (Web) — English page data. Props from popover SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const popoverDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Popover · Web' }],
  title: 'Popover · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Hover by default. ' },
    { t: 'code', s: 'header' },
    { t: 'text', s: ' provides the title section, ' },
    { t: 'code', s: 'content' },
    { t: 'text', s: ' the body; ' },
    { t: 'code', s: 'show-arrow' },
    { t: 'text', s: ' draws the pointer and the common placements can be compared.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/popover',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Popover · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popover } from '@snui/vue-web';
</script>

<template>
  <Popover />
</template>`,
  },
  demos: [
    { name: 'popover-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    {
      name: 'popover-web-trigger',
      title: 'Triggers and controlled mode',
      blurb: 'Triggers and controlled mode',
    },
    { name: 'popover-web-placement', title: 'Twelve placements', blurb: 'Twelve placements' },
    { name: 'popover-web-delay', title: 'Open / close timing', blurb: 'Open / close timing' },
    { name: 'popover-web-width', title: 'Width control', blurb: 'Width control' },
    {
      name: 'popover-web-scrollable',
      title: 'Long scrollable content',
      blurb: 'Long scrollable content',
    },
    { name: 'popover-web-slots', title: 'Custom header and body', blurb: 'Custom header and body' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Whether to show the popover. When `undefined`, falls back to uncontrolled mode using internal state. Mirrors n-popover `show`.',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: 'Initial show value for uncontrolled mode. Mirrors n-popover `defaultShow`. Default false.',
      },
      {
        name: 'trigger',
        type: "'hover' | 'click' | 'focus' | 'manual'",
        default: "'hover'",
        desc: "What user gesture opens the popover. Mirrors n-popover `trigger`. Default 'hover'. 'manual' disables any automatic show/hide — only `show` / `update:show` controls the state.",
      },
      {
        name: 'placement',
        type: 'SnPopoverPlacement',
        default: "'top'",
        desc: "Where to render the bubble relative to the trigger. Mirrors n-popover `placement`. Default 'top'.",
      },
      {
        name: 'delay',
        type: 'number | [number, number]',
        default: '100',
        desc: 'Open debounce in ms. Single number = same delay for open+close. Use an array `[open, close]` for asymmetric delays. Mirrors n-popover `delay`. Default 100.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '100',
        desc: 'How long the popover lingers before closing, in ms. Mirrors n-popover `duration`. Default 100.',
      },
      {
        name: 'showArrow',
        type: 'boolean',
        default: 'false',
        desc: 'Show the directional arrow. Mirrors n-popover `showArrow`. Default false (naive convention — tooltips have arrows, popovers opt in).',
      },
      {
        name: 'arrow',
        type: 'boolean',
        default: 'true',
        desc: 'Extra alias of `showArrow` kept for SnTooltip parity. The arrow renders only when both `showArrow` and `arrow` are true.',
      },
      {
        name: 'arrowPointToCenter',
        type: 'boolean',
        default: 'false',
        desc: "Point the arrow at the trigger's centre rather than its edge. Mirrors n-popover `arrowPointToCenter`. Default false.",
      },
      {
        name: 'arrowClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Class on the arrow element. Mirrors n-popover `arrowClass`.',
      },
      {
        name: 'arrowStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: 'Style on the arrow element. Mirrors n-popover `arrowStyle`.',
      },
      {
        name: 'header',
        type: 'string',
        default: "''",
        desc: 'Card title. Rendered in a bold section above the body. Mirrors n-popover `header`.',
      },
      {
        name: 'content',
        type: 'string',
        default: "''",
        desc: 'The bubble body. Plain string or any Vue-renderable value. Mirrors n-popover `content`.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable showing entirely. Mirrors n-popover `disabled`. Default false.',
      },
      {
        name: 'raw',
        type: 'boolean',
        default: 'false',
        desc: "Skip the library's own card styling so the caller paints the bubble entirely. Mirrors n-popover `raw`. Default false.",
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'true',
        desc: 'Animate the bubble in/out. Mirrors n-popover `animated`. Default true.',
      },
      {
        name: 'overlap',
        type: 'boolean',
        default: 'false',
        desc: 'Let the bubble overlap the trigger instead of sitting beside it. Mirrors n-popover `overlap`. Default false.',
      },
      {
        name: 'scrollable',
        type: 'boolean',
        default: 'false',
        desc: 'Make the body scrollable once it exceeds `max-height`. Mirrors n-popover `scrollable`. Default false.',
      },
      {
        name: 'displayDirective',
        type: "'if' | 'show'",
        default: "'if'",
        desc: "`'if'` unmounts the bubble on hide; `'show'` keeps the node and toggles `display`. Mirrors n-popover `displayDirective`. Default 'if'.",
      },
      {
        name: 'flip',
        type: 'boolean',
        default: 'true',
        desc: 'Flip to the opposite side when the chosen placement would overflow the viewport. Mirrors n-popover `flip`. Default true.',
      },
      {
        name: 'keepAliveOnHover',
        type: 'boolean',
        default: 'true',
        desc: 'Keep the popover open while the pointer is inside it (hover trigger only). Mirrors n-popover `keepAliveOnHover`. Default true.',
      },
      {
        name: 'width',
        type: "number | 'trigger' | undefined",
        default: 'undefined',
        desc: "Pin the bubble width to the trigger's width. Mirrors n-popover `width` = `'trigger'`; a number sets a fixed width in px.",
      },
      {
        name: 'to',
        type: 'string | HTMLElement | false',
        default: "'body'",
        desc: "Where to teleport the bubble. `false` keeps it inline (useful inside transform-heavy ancestors). Mirrors n-popover `to`. Default 'body'.",
      },
      {
        name: 'zIndex',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit stacking order. Mirrors n-popover `zIndex`.',
      },
      {
        name: 'contentClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Class on the body section. Mirrors n-popover `contentClass`.',
      },
      {
        name: 'contentStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: 'Style on the body section. Mirrors n-popover `contentStyle`.',
      },
      {
        name: 'onClickoutside',
        type: '((e: MouseEvent) => void)',
        default: '—',
        desc: 'Called when a click lands outside the bubble/trigger (mirrors n-popover).',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnPopover.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:show',
        payload: '(show: boolean)',
        desc: 'Fired when show state changes (`v-model:show`).',
      },
      { name: 'show', payload: '—', desc: 'Fired when the popover appears (local addition).' },
      { name: 'hide', payload: '—', desc: 'Fired when the popover hides (local addition).' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnPopover.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Trigger element (the visible target, e.g. a button).' },
      { name: 'header', props: '—', desc: 'Card title; overrides the `header` prop.' },
      { name: 'content', props: '—', desc: 'Bubble body; overrides the `content` prop.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Popover · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Popover } from '@snui/vue-web';",
    chipCopy: "import { Popover } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Popover', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'dropdown', link: '/en/components/web/dropdown' },
    next: { text: 'popconfirm', link: '/en/components/web/popconfirm' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
