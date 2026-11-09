/** Drawer (Web) — English page data. Props from SnDrawer.vue. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const drawerDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Feedback' }, { text: 'Drawer' }],
  title: 'Drawer',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A **slide-in overlay**: a mask plus a panel that slides in from one of the four edges (',
    },
    { t: 'code', s: 'left' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'right' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'top' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'bottom' },
    {
      t: 'text',
      s: '). It hosts arbitrary content and is usually used for forms, settings and detail views.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/drawer',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Drawer.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Drawer } from '@snui/vue-web';
</script>

<template>
  <Drawer />
</template>`,
  },
  demos: [
    { name: 'drawer-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'drawer-web-content', title: 'Rich content', blurb: 'Rich content' },
    { name: 'drawer-web-resizable', title: 'Resizable', blurb: 'Resizable' },
    { name: 'drawer-web-multiple', title: 'Nested drawers', blurb: 'Nested drawers' },
    { name: 'drawer-web-target', title: 'Custom container', blurb: 'Custom container' },
    { name: 'drawer-web-scroll', title: 'Scrollable content', blurb: 'Scrollable content' },
    {
      name: 'drawer-web-closable',
      title: 'Closable and intercept',
      blurb: 'Closable and intercept',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'show',
        type: 'boolean',
        default: 'false',
        desc: 'Visibility. Mirrors n-drawer `show`.',
      },
      {
        name: 'width',
        type: 'number | string',
        default: 'undefined as any',
        desc: 'Panel width. Applies to `left`/`right`. Number is px.',
      },
      {
        name: 'height',
        type: 'number | string',
        default: 'undefined as any',
        desc: 'Panel height. Applies to `top`/`bottom`. Number is px.',
      },
      {
        name: 'placement',
        type: 'SnDrawerPlacement',
        default: "'right'",
        desc: 'Which edge the panel slides in from.',
      },
      {
        name: 'maskClosable',
        type: 'boolean',
        default: 'true',
        desc: 'Close the drawer when the mask is clicked.',
      },
      {
        name: 'showMask',
        type: "boolean | 'transparent'",
        default: 'true',
        desc: "Render the mask; `'transparent'` keeps it clickable but invisible.",
      },
      {
        name: 'to',
        type: 'string | HTMLElement',
        default: 'undefined as any',
        desc: 'Teleport target. Mirrors n-drawer `to`.',
      },
      {
        name: 'displayDirective',
        type: 'SnDrawerDisplayDirective',
        default: "'if'",
        desc: "`'if'` unmounts after leaving; `'show'` keeps the node.",
      },
      {
        name: 'nativeScrollbar',
        type: 'boolean',
        default: 'true',
        desc: 'Accepted for API parity. Upstream swaps to a virtual scrollbar when `false`; this version renders the native container either way but still applies the `--native-scrollbar` class hook. See §112 markers.',
      },
      {
        name: 'defaultWidth',
        type: 'number | string',
        default: '251',
        desc: 'Fallback size used before any drag resize happens, and as the initial value when neither `width` nor `height` is set. Number is px. Mirrors n-drawer `defaultWidth` / `defaultHeight` (both 251 upstream).',
      },
      {
        name: 'defaultHeight',
        type: 'number | string',
        default: '251',
        desc: 'Vertical counterpart of `defaultWidth`. See above.',
      },
      {
        name: 'resizable',
        type: 'boolean',
        default: 'false',
        desc: 'Let the user drag the inner edge to resize the panel. Upstream emits `update:width` / `update:height` on drag, which the host binds back so it owns the resulting size. Mirrors n-drawer `resizable`. Default false.',
      },
      {
        name: 'maxWidth',
        type: 'number',
        default: 'undefined as any',
        desc: 'Upper drag bound, in px. Only meaningful with `resizable`.',
      },
      {
        name: 'maxHeight',
        type: 'number',
        default: 'undefined as any',
        desc: 'Upper drag bound, in px. Only meaningful with `resizable`.',
      },
      {
        name: 'minWidth',
        type: 'number',
        default: 'undefined as any',
        desc: 'Lower drag bound, in px. Only meaningful with `resizable`.',
      },
      {
        name: 'minHeight',
        type: 'number',
        default: 'undefined as any',
        desc: 'Lower drag bound, in px. Only meaningful with `resizable`.',
      },
      {
        name: 'autoFocus',
        type: 'boolean',
        default: 'true',
        desc: 'Focus the first focusable element inside the panel once it opens. Mirrors n-drawer `autoFocus`. Default true.',
      },
      {
        name: 'trapFocus',
        type: 'boolean',
        default: 'true',
        desc: 'Cycle Tab / Shift+Tab inside the panel so focus cannot escape to the page behind the mask. Mirrors n-drawer `trapFocus`. Default true; upstream force-disables it when `showMask` is `false`.',
      },
      {
        name: 'scrollbarProps',
        type: 'SnDrawerScrollbarProps',
        default: 'undefined as any',
        desc: 'Passed through to the scroll container. Upstream models a full virtual scrollbar (`ScrollbarProps`); this version applies the scroll-related subset (`trigger` / `xScrollable` / `onScroll`) and ignores the rest.',
      },
      {
        name: 'zIndex',
        type: 'number',
        default: 'undefined as any',
        desc: 'Stacking order of the overlay.',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: 'Extra class on the scroll container.',
      },
      {
        name: 'contentStyle',
        type: 'string | CSSProperties',
        default: 'undefined as any',
        desc: 'Extra style on the scroll container.',
      },
      {
        name: 'closeOnEsc',
        type: 'boolean',
        default: 'true',
        desc: 'Close the drawer when Escape is pressed.',
      },
      {
        name: 'blockScroll',
        type: 'boolean',
        default: 'true',
        desc: 'Lock `<html>` scroll while open.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Drawer ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Drawer } from '@snui/vue-web';",
    chipCopy: "import { Drawer } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Drawer', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {},
  toc: [
    { id: 'usage', text: 'Code Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'Props Reference' },
    { id: 'ai-native', text: 'AI-Native Integration' },
  ],
};
