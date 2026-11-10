/** Link · Web (Web) — English page data. Props from link SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const linkDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Link · Web' }],
  title: 'Link · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A themed text link: semantic status colors, hover underline, disabled state,',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/link',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Link · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Link } from '@snui/vue-web';
</script>

<template>
  <Link />
</template>`,
  },
  demos: [
    { name: 'link-web-basic', title: 'Basic usage', blurb: 'Basic usage' },
    { name: 'link-web-type', title: 'Semantic colors compared', blurb: 'Semantic colors compared' },
    { name: 'link-web-icon-slot', title: 'Icon slot', blurb: '#icon leading icon slot.' },
    {
      name: 'link-web-underline',
      title: 'Underline',
      blurb: 'underline always-on vs. hover-only.',
    },
    {
      name: 'link-web-disabled',
      title: 'Disabled',
      blurb: 'disabled blocks clicks and navigation.',
    },
    {
      name: 'link-web-tag',
      title: 'Custom tag',
      blurb: "tag='span' renders a pseudo-link that only dispatches click.",
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'href',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Navigation target. Mirrors n-a `href`.',
      },
      {
        name: 'target',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Browsing context for the navigation (`_blank`, …). Mirrors n-a `target`.',
      },
      {
        name: 'rel',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Relationship metadata for the target. Mirrors n-a `rel`.',
      },
      {
        name: 'type',
        type: 'LinkType',
        default: "'default'",
        desc: "Visual type — drives the text color. Mirrors n-a `type`. Default 'default'.",
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disabled state — blocks clicks and navigation. Mirrors n-a `disabled`. Default false.',
      },
      {
        name: 'underline',
        type: 'boolean',
        default: 'false',
        desc: '`true` underlines permanently; `false` underlines on hover only. Mirrors n-a `underline`. Default false.',
      },
      {
        name: 'tag',
        type: 'string',
        default: "'a'",
        desc: "Element to render as the root. Mirrors n-a `tag`. Default 'a'.",
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnLink.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'click',
        payload: 'MouseEvent',
        desc: 'Fired on activation; suppressed while `disabled` (mirrors naive-ui `onClick`).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnLink.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Link text (mirrors naive-ui `default`).' },
      { name: 'icon', props: '—', desc: 'Leading icon (mirrors naive-ui `icon`).' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Link · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Link } from '@snui/vue-web';",
    chipCopy: "import { Link } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Link', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'avatar-group', link: '/en/components/web/avatar-group' },
    next: { text: 'input', link: '/en/components/web/input' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
