/** Transition · uni-app (uni-app) — English page data. Props from sn-transition.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const transitionDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'Transition · uni-app' },
  ],
  title: 'Transition · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'An array ' },
    { t: 'code', s: 'name' },
    { t: 'text', s: ' is joined into ' },
    { t: 'code', s: 'sn-transition--<a>-<b>' },
    { t: 'text', s: ' (e.g. ' },
    { t: 'code', s: '["fade", "up"]' },
    { t: 'text', s: ' → ' },
    { t: 'code', s: 'fade-up' },
    { t: 'text', s: '); an object ' },
    { t: 'code', s: 'duration' },
    { t: 'text', s: ' sets the enter / leave legs separately; ' },
    { t: 'code', s: 'destroy=false' },
    { t: 'text', s: ' keeps the node mounted after leaving (' },
    { t: 'code', s: 'display: none' },
    { t: 'text', s: ').' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-transition',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Transition · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Transition } from '@snui/uni';
</script>

<template>
  <sn-transition />
</template>`,
  },
  demos: [
    {
      name: 'transition-mp-basic',
      title: 'Basic usage',
      blurb: 'Switching between fade / fade-up / zoom-in / slide-up.',
    },
    {
      name: 'transition-mp-config',
      title: 'Combining, per-leg durations and destroy',
      blurb:
        'Combined animation, enter 100ms / leave 600ms, destroy=false, plus the event sequence.',
    },
    {
      name: 'transition-mp-custom-class',
      title: 'Per-stage classes and root styling',
      blurb:
        'All six stage classes with the event sequence; customClass dashed frame + customStyle inline radius; a customClass-only control.',
    },
    {
      name: 'transition-mp-lazy',
      title: 'Lazy rendering and blocking touch scroll',
      blurb:
        'lazy-render on / off with the slot render state; disable-touch-move checked against a background scroll area.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'show', type: 'boolean', default: 'false', desc: 'Whether the content is shown.' },
      {
        name: 'duration',
        type: 'TransitionDuration',
        default: 'DEFAULT_DURATION',
        desc: 'Animation duration in ms; `false` disables it, a record sets per-leg.',
      },
      {
        name: 'lazyRender',
        type: 'boolean',
        default: 'false',
        desc: 'Defer the very first render until `show` turns true.',
      },
      {
        name: 'name',
        type: 'TransitionName | TransitionName[] | undefined',
        default: 'undefined',
        desc: 'One animation name, or several to combine.',
      },
      {
        name: 'destroy',
        type: 'boolean',
        default: 'true',
        desc: 'Hide with `display: none` once the leave animation finished.',
      },
      {
        name: 'enterClass',
        type: 'string',
        default: "''",
        desc: 'Class applied on the enter start frame.',
      },
      {
        name: 'enterActiveClass',
        type: 'string',
        default: "''",
        desc: 'Class applied while entering.',
      },
      {
        name: 'enterToClass',
        type: 'string',
        default: "''",
        desc: 'Class applied on the enter end frame.',
      },
      {
        name: 'leaveClass',
        type: 'string',
        default: "''",
        desc: 'Class applied on the leave start frame.',
      },
      {
        name: 'leaveActiveClass',
        type: 'string',
        default: "''",
        desc: 'Class applied while leaving.',
      },
      {
        name: 'leaveToClass',
        type: 'string',
        default: "''",
        desc: 'Class applied on the leave end frame.',
      },
      {
        name: 'disableTouchMove',
        type: 'boolean',
        default: 'false',
        desc: 'Intercept touchmove so the page behind cannot scroll.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Transition · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Transition } from '@snui/uni';",
    chipCopy: "import { Transition } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-transition', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-fab', link: '/en/components/uni/fab' },
    next: { text: 'sn-resize', link: '/en/components/uni/resize' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
