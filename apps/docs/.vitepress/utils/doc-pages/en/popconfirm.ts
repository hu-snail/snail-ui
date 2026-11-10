/** Popconfirm · Web (Web) — English page data. Props from popconfirm SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const popconfirmDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Popconfirm · Web' },
  ],
  title: 'Popconfirm · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Click to open; default labels are Cancel / Confirm and the confirm button is primary; returning ',
    },
    { t: 'code', s: 'false' },
    { t: 'text', s: ' keeps the bubble open.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/popconfirm',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Popconfirm · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popconfirm } from '@snui/vue-web';
</script>

<template>
  <Popconfirm />
</template>`,
  },
  demos: [
    { name: 'popconfirm-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'popconfirm-web-async', title: 'Async confirm', blurb: 'Async confirm' },
    { name: 'popconfirm-web-icon', title: 'Icon variants', blurb: 'Icon variants' },
    { name: 'popconfirm-web-action', title: 'Custom action row', blurb: 'Custom action row' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Whether to show the popconfirm. When `undefined`, falls back to uncontrolled mode. Mirrors n-popconfirm `show`.',
      },
      {
        name: 'defaultShow',
        type: 'boolean',
        default: 'false',
        desc: 'Initial show value for uncontrolled mode. Mirrors n-popconfirm `defaultShow`. Default false.',
      },
      {
        name: 'trigger',
        type: "'hover' | 'click' | 'focus' | 'manual'",
        default: "'click'",
        desc: "What user gesture opens the bubble. Mirrors n-popconfirm `trigger`. Default 'click'.",
      },
      {
        name: 'placement',
        type: 'SnPopconfirmPlacement',
        default: "'top'",
        desc: "Where to render the bubble relative to the trigger. Mirrors n-popconfirm `placement`. Default 'top'.",
      },
      {
        name: 'delay',
        type: 'number | [number, number]',
        default: '100',
        desc: 'Open debounce in ms. Mirrors n-popover `delay`. Default 100.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '100',
        desc: 'Close debounce in ms. Mirrors n-popover `duration`. Default 100.',
      },
      {
        name: 'showArrow',
        type: 'boolean',
        default: 'false',
        desc: 'Show the directional arrow. Default false.',
      },
      {
        name: 'arrowPointToCenter',
        type: 'boolean',
        default: 'false',
        desc: "Point the arrow at the trigger's centre. Default false.",
      },
      {
        name: 'arrowClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Class on the arrow element.',
      },
      {
        name: 'arrowStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: 'Style on the arrow element.',
      },
      {
        name: 'content',
        type: 'string',
        default: "''",
        desc: 'The confirmation message. Rendered between the icon and the action row.',
      },
      {
        name: 'icon',
        type: 'IconComponent | undefined',
        default: 'undefined',
        desc: 'Leading icon component. Default: lucide `AlertTriangle` in the feedback-warning colour. Mirrors n-popconfirm `icon`.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: 'Show the leading icon at all. Mirrors n-popconfirm `showIcon`. Default true.',
      },
      {
        name: 'negativeText',
        type: 'string',
        default: '—',
        desc: 'Cancel button label. Mirrors n-popconfirm `negativeText`. Default: locale Popconfirm.negativeText.',
      },
      {
        name: 'positiveText',
        type: 'string',
        default: '—',
        desc: 'Confirm button label. Mirrors n-popconfirm `positiveText`. Default: locale Popconfirm.positiveText.',
      },
      {
        name: 'negativeButtonProps',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Extra props forwarded to the cancel SnButton.',
      },
      {
        name: 'positiveButtonProps',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Extra props forwarded to the confirm SnButton.',
      },
      {
        name: 'onPositiveClick',
        type: '((e: MouseEvent) => SnPopconfirmActionReturn)',
        default: '—',
        desc: 'Called on confirm click; return `false` to keep it open (mirrors n-popconfirm).',
      },
      {
        name: 'onNegativeClick',
        type: '((e: MouseEvent) => SnPopconfirmActionReturn)',
        default: '—',
        desc: 'Called on cancel click; return `false` to keep it open (mirrors n-popconfirm).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable showing entirely. Mirrors n-popconfirm `disabled`.',
      },
      {
        name: 'displayDirective',
        type: "'if' | 'show' | undefined",
        default: "'if'",
        desc: "`'if'` unmounts the bubble on hide; `'show'` keeps the node and toggles `display`. Default 'if'.",
      },
      {
        name: 'flip',
        type: 'boolean',
        default: 'true',
        desc: 'Flip to the opposite side when space runs out. Default true.',
      },
      {
        name: 'keepAliveOnHover',
        type: 'boolean',
        default: 'true',
        desc: 'Keep the bubble open while the pointer is inside it (hover).',
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'true',
        desc: 'Animate the bubble in/out. Default true.',
      },
      {
        name: 'width',
        type: "number | 'trigger' | undefined",
        default: 'undefined',
        desc: "Pin the bubble width to the trigger's width, or set a fixed px width. Mirrors n-popover `width`.",
      },
      {
        name: 'to',
        type: 'string | HTMLElement | false | undefined',
        default: "'body'",
        desc: "Teleport target. `false` renders inline. Default 'body'.",
      },
      {
        name: 'zIndex',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit stacking order.',
      },
      {
        name: 'contentClass',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Class on the inner body.',
      },
      {
        name: 'contentStyle',
        type: 'CSSProperties | undefined',
        default: 'undefined',
        desc: 'Style on the inner body.',
      },
      {
        name: 'onClickoutside',
        type: '((e: MouseEvent) => void)',
        default: '—',
        desc: 'Called when a click lands outside the bubble and its trigger.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnPopconfirm.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:show',
        payload: '(show: boolean)',
        desc: 'Fired when show state changes (`v-model:show`).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnPopconfirm.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'default',
        props: '—',
        desc: 'Trigger element (the visible target, e.g. a delete button).',
      },
      {
        name: 'icon',
        props: '—',
        desc: 'Leading icon area; overrides the `icon` prop and default glyph.',
      },
      { name: 'action', props: '—', desc: 'Action row; replaces the two built-in buttons.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Popconfirm · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Popconfirm } from '@snui/vue-web';",
    chipCopy: "import { Popconfirm } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Popconfirm', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'popover', link: '/en/components/web/popover' },
    next: { text: 'popselect', link: '/en/components/web/popselect' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
