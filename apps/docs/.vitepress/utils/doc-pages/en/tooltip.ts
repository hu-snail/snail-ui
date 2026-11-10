/** Tooltip (Web) — English page data. Props from SnTooltip.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const tooltipDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Navigation' }, { text: 'Tooltip' }],
  title: 'Tooltip',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A lightweight floating hint anchored to a trigger element: hovering, clicking or focusing the trigger reveals a short piece of text beside it. Content is expected to be non-interactive — a tooltip disappears as soon as the pointer leaves, so it must never host controls.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tooltip',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Tooltip.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tooltip } from '@snui/vue-web';
</script>

<template>
  <Tooltip />
</template>`,
  },
  demos: [
    { name: 'tooltip-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'tooltip-web-trigger', title: 'Trigger area', blurb: 'Trigger area' },
    { name: 'tooltip-web-placement', title: 'All placements', blurb: 'All placements' },
    { name: 'tooltip-web-appearance', title: 'Appearance', blurb: 'Appearance' },
    { name: 'tooltip-web-content-slot', title: 'Slot content', blurb: 'Slot content' },
    { name: 'tooltip-web-event', title: 'Events', blurb: 'Events' },
    { name: 'tooltip-web-controlled', title: 'Controlled', blurb: 'Controlled' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Whether to show the tooltip. When `undefined`, falls back to uncontrolled mode using internal state. Mirrors n-tooltip `show`.',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: 'Initial show value for uncontrolled mode. Mirrors n-tooltip `defaultShow`. Default false.',
      },
      {
        name: 'trigger',
        type: "'hover' | 'click' | 'focus' | 'manual'",
        default: "'hover'",
        desc: "What user gesture opens the tooltip. Mirrors n-tooltip `trigger`. Default 'hover'. 'manual' disables any automatic show/hide — only `show` / `update:show` controls the state.",
      },
      {
        name: 'placement',
        type: 'SnTooltipPlacement',
        default: "'top'",
        desc: "Where to render the tooltip relative to the trigger — 12 Arco-style directions: `top` / `tl` / `tr` / `bottom` / `bl` / `br` / `left` / `lt` / `lb` / `right` / `rt` / `rb` (letter 2 = the bubble edge that aligns with the trigger: `tl` = Left edges flush, `lb` = Bottom edges flush). Legacy naive-ui values (`top-start` / …) are accepted as deprecated aliases. Default 'top'.",
      },
      {
        name: 'delay',
        type: 'number | [number, number]',
        default: '100',
        desc: 'Open/close debounce in ms. Single number = same delay for open+close. Use an array `[open, close]` for asymmetric delays (e.g. snappier open, slower close). Mirrors n-tooltip `delay`. Default 100.',
      },
      {
        name: 'arrow',
        type: 'boolean',
        default: 'true',
        desc: 'Show the directional arrow. Mirrors n-tooltip `arrow`. Default true.',
      },
      {
        name: 'content',
        type: 'string | undefined',
        default: "''",
        desc: 'The tooltip body. Can be a plain string or any Vue-renderable value. Mirrors n-tooltip `content`.',
      },
      {
        name: 'wrapped',
        type: 'boolean',
        default: 'true',
        desc: 'Render the trigger inside a wrapper `<span>` that owns the pointer listeners. Set to `false` when the slot already renders a focusable element and the extra wrapper would break layout. Mirrors n-popover `raw` (inverted: this library defaults to wrapping). Default true.',
      },
      {
        name: 'raw',
        type: 'boolean',
        default: 'false',
        desc: "Skip the library's own bubble styling so the caller can paint the popover entirely. Mirrors n-popover `raw`. Default false.",
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'true',
        desc: 'Animate the popover in/out. Mirrors n-popover `animated`. Default true.',
      },
      {
        name: 'arrowPointToCenter',
        type: 'boolean',
        default: 'false',
        desc: "Point the arrow at the trigger's centre rather than its edge. Mirrors n-popover `arrowPointToCenter`. Default false.",
      },
      {
        name: 'arrowClass',
        type: 'string',
        default: 'undefined as any',
        desc: 'Class on the arrow element. Mirrors n-popover `arrowClass`.',
      },
      {
        name: 'arrowStyle',
        type: 'CSSProperties',
        default: 'undefined as any',
        desc: 'Style on the arrow element. Mirrors n-popover `arrowStyle`.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: 'Class on the scrollable body. Mirrors n-popover `contentClass`.',
      },
      {
        name: 'contentStyle',
        type: 'CSSProperties',
        default: 'undefined as any',
        desc: 'Style on the scrollable body. Mirrors n-popover `contentStyle`.',
      },
      {
        name: 'displayDirective',
        type: "'if' | 'show'",
        default: "'if'",
        desc: "`'if'` unmounts the popover on hide; `'show'` keeps the node and toggles `display`. Mirrors n-popover `displayDirective`. Default 'if'.",
      },
      {
        name: 'duration',
        type: 'number',
        default: '100',
        desc: 'How long the popover lingers before closing, in ms. Distinct from `delay`, which gates opening. Mirrors n-popover `duration`. Default 100.',
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
        name: 'overlap',
        type: 'boolean',
        default: 'false',
        desc: 'Let the popover overlap the trigger instead of sitting beside it. Mirrors n-popover `overlap`. Default false.',
      },
      {
        name: 'scrollable',
        type: 'boolean',
        default: 'false',
        desc: 'Make the popover body scrollable once it exceeds `max-height`. Mirrors n-popover `scrollable`. Default false.',
      },
      {
        name: 'to',
        type: 'string | HTMLElement | false',
        default: "'body'",
        desc: "Where to teleport the popover. `false` keeps it inline (useful inside transform-heavy ancestors). Mirrors n-popover `to`. Default 'body'.",
      },
      {
        name: 'width',
        type: "number | 'trigger'",
        default: 'undefined as any',
        desc: "Pin the popover width to the trigger's width. Mirrors n-popover `width` = `'trigger'`; a number sets a fixed width in px.",
      },
      {
        name: 'zIndex',
        type: 'number',
        default: 'undefined as any',
        desc: 'Explicit stacking order. Mirrors n-popover `zIndex`.',
      },
      {
        name: 'onClickoutside',
        type: '(e: MouseEvent) => void',
        default: '—',
        desc: "Outside click while `trigger` is `'click'`; mirrors n-popover `onClickoutside`.",
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable showing entirely. Mirrors n-tooltip `disabled`. Default false.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnTooltip.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:show',
        payload: '(show: boolean)',
        desc: 'Show state changed (`v-model:show`); mirrors n-tooltip `on-update-show`.',
      },
      {
        name: 'show',
        payload: '—',
        desc: 'Fired when the popover appears; mirrors n-tooltip `on-show`.',
      },
      {
        name: 'hide',
        payload: '—',
        desc: 'Fired when the popover hides; mirrors n-tooltip `on-hide`.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnTooltip.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'The trigger element (e.g. a button) that anchors the popover.',
      },
      {
        name: 'content',
        props: '—',
        desc: 'Popover body; falls back to the `content` prop when empty.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tooltip ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tooltip } from '@snui/vue-web';",
    chipCopy: "import { Tooltip } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Tooltip', tone: 'accent' },
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
