/**
 * Popover 气泡卡片（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-popover.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../../components/doc-page/types';

export const popoverDocPageEn: SnDocPageData = {
  crumbs: [
    { text: "Home", link: "/en/" },
    { text: "Navigation" },
    { text: "Popover" },
  ],
  title: "Popover",
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: "uni-app x mobile", tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: "A tap-triggered bubble: normal mode shows a short text, menu mode shows an action list; it is anchored to its trigger in one of 12 placements. The content is passed through " },
    { t: 'code', s: 'content' },
    { t: 'text', s: " and the display mode is set by " },
    { t: 'code', s: 'mode' },
    { t: 'text', s: "; the bubble is single-line — it grows with its content and never wraps or clips." },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: "Copied",
    },
    {
      icon: 'link',
      label: "View source",
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-popover',
    },
  ],
  features: [
    { text: "rpx scales across devices", icon: 'layers' },
    { text: "easycom auto-register", icon: 'eco' },
    { text: "Touch optimised", icon: 'touch' },
  ],
  usage: {
    hint: [{ t: 'text', s: "uni-app x registers the component through easycom — no manual import; see the code below for an explicit import." }],
    fileLabel: "Popover.vue",
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SnPopover } from '@snui/uni';
</script>

<template>
  <sn-popover v-model="open" content="A text hint">
    <sn-button>Show bubble</sn-button>
  </sn-popover>
</template>`,
  },
  demos: [
    { name: 'popover-mp-basic', title: "Basic usage", blurb: "Tap the trigger to open a text bubble; tap it again to close" },
    { name: 'popover-mp-placement', title: "Placement", blurb: "Four directions — top / right / bottom / left" },
    { name: 'popover-mp-alignment', title: "Alignment", blurb: "-start / centred / -end on one side" },
    { name: 'popover-mp-menu', title: "Menu mode", blurb: "Menu mode renders content as an action list; iconClass names the row icon" },
    { name: 'popover-mp-content-slot', title: "Content slot", blurb: "The #content slot fully replaces the bubble body" },
    { name: 'popover-mp-custom-style', title: "Offset & custom style", blurb: "offset pushes the bubble away; custom-style recolours it" },
    { name: 'popover-mp-height', title: "Content width", blurb: "The bubble grows with its content — no wrapping, no clipping" },
    {
      name: 'popover-mp-rounded',
      title: 'Rounded arrow',
      blurb: 'arrow-shape="rounded" — a soft-cornered square tip fused with the bubble; compared with the default sharp triangle.',
    },
    {
      name: 'popover-mp-border',
      title: 'Custom border',
      blurb: 'border-color — a 1px consumer-coloured border on the bubble body; the arrow follows the fill.',
    },
    { name: 'popover-mp-theme', title: "Theme", blurb: "The bubble and arrow follow the dark / light theme" },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: "boolean",
        default: "false",
        desc: "Whether the bubble is shown (`v-model`).",
      },
      {
        name: 'content',
        type: "string | SnPopoverMenuItem[]",
        default: "''",
        desc: "A string in `normal` mode, a row list in `menu` mode; replaced by the `content` slot",
      },
      {
        name: 'mode',
        type: "'normal' | 'menu'",
        default: "'normal'",
        desc: "Bubble display mode: text or action list",
      },
      {
        name: 'placement',
        type: "PopoverPlacement",
        default: "'bottom'",
        desc: "Where the bubble sits relative to the trigger — 12 placements",
      },
      {
        name: 'offset',
        type: "number | number[] | { x: number; y: number }",
        default: "0",
        desc: "Extra distance in px; on -start / -end it shifts the bubble and counter-shifts the arrow so it keeps pointing at the trigger",
      },
      {
        name: 'visibleArrow',
        type: "boolean",
        default: "true",
        desc: "Render the arrow; when off, its gap is dropped from the placement too",
      },
      {
        name: 'disabled',
        type: "boolean",
        default: "false",
        desc: "Disables the trigger — a trigger tap is ignored; a page-driven `v-model` still works",
      },
      {
        name: 'showClose',
        type: "boolean",
        default: "false",
        desc: "Render a close button at the bubble's top-right corner",
      },
      {
        name: 'customClass',
        type: "string",
        default: "''",
        desc: "Extra class on the root node",
      },
      {
        name: 'customStyle',
        type: "string",
        default: "''",
        desc: "Custom inline style for the root node; override `--sn-popover-*` tokens here",
      },
      {
        name: 'customArrow',
        type: "string",
        default: "''",
        desc: "Extra class on the arrow node",
      },
      {
        name: 'customPop',
        type: "string",
        default: "''",
        desc: "Extra class on the bubble container",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: "A machine-readable contract for LLMs",
    copy: "Popover · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().",
    chip: "import { SnPopover } from '@snui/uni';",
    chipCopy: "import { SnPopover } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-popover', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Tooltip', link: '/en/components/uni/tooltip' },
    next: { text: 'Form', link: '/en/components/uni/form' },
  },
  toc: [
    { id: 'usage', text: "Usage" },
    { id: 'demos', text: "Examples" },
    { id: 'api', text: "API reference" },
    { id: 'ai-native', text: "AI-native integration" },
  ],
};
