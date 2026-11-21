/** Notify · uni-app x (uni-app x) — English page data. Props from sn-notify.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const notifyDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Notify · uni-app x' },
  ],
  title: 'Notify · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'A stacked card notification anchored to the top (or bottom) edge: every message renders as an elevated rounded card — semantic-colored title and glyph, secondary description, close pill — that slides in smoothly from the screen edge; older cards glide down and peek out below the front card (deck stack). Swipe-to-dismiss and per-card customization included. Fills and text colors all come from semantic tokens (' },
    { t: 'code', s: '--sn-mp-color-action-primary' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-feedback-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: '), all overridden in the dark block of ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    { t: 'text', s: ', so it adapts to dark mode automatically.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-notify',
    },
  ],
  features: [
    { text: 'Deck card stacking', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Swipe-to-dismiss interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'Place one <sn-notify> per page as the queue container and drive it through the template ref (show / hide / hideAll). Each show() call takes the full message config: title is required, type picks the semantic color (default / primary / success / warning / danger), icon accepts a custom IconData (null hides it), duration = 0 keeps the card open, and an empty closeText renders an icon-only close pill. Top-anchored stacks clear the status bar automatically (safeAreaInsetTop) — no manual offset needed.',
      },
    ],
    fileLabel: 'Notify · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ref } from 'vue';
import type { SnNotifyInstance } from '@snui/uni';

const notify = ref<SnNotifyInstance | null>(null);

function upgradeDone(): void {
  notify.value?.show({
    title: 'Plan upgraded',
    description: 'You can continue using all features',
    type: 'success',
  });
}
</script>

<template>
  <sn-notify ref="notify" position="top" :duration="4000" />
  <sn-button type="success" @tap="upgradeDone">Upgrade</sn-button>
</template>`,
  },
  demos: [
    {
      name: 'notify-mp-basic',
      title: 'Basic usage',
      blurb: 'Five semantic card colors (default / primary / success / warning / danger) + hide all.',
    },
    {
      name: 'notify-mp-variant',
      title: 'Stacking and position',
      blurb: 'Multi-message deck stack (older cards peek below), maxVisible cap, bottom anchor.',
    },
    {
      name: 'notify-mp-style',
      title: 'Customization',
      blurb: 'Custom icon / background / radius / X close pill / sticky duration / fully custom card slot.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'position', type: 'NotifyPosition', default: "'top'", desc: 'Stack anchor: top slides in from the top edge, bottom from the bottom edge.' },
      { name: 'duration', type: 'number', default: '4000', desc: 'Default auto-dismiss delay in ms; `0` keeps cards open.' },
      { name: 'maxVisible', type: 'number', default: '3', desc: 'Queue cap; the deepest card closes with reason overflow.' },
      { name: 'zIndex', type: 'number', default: '9990', desc: 'Stacking level.' },
      { name: 'closable', type: 'boolean', default: 'true', desc: 'Render the close pill by default.' },
      { name: 'closeText', type: 'string', default: "'Close'", desc: 'Default close pill label; overridable per message.' },
      { name: 'swipeToDismiss', type: 'boolean', default: 'true', desc: 'The front card supports horizontal swipe-to-dismiss.' },
      { name: 'safeAreaInsetTop', type: 'boolean', default: 'true', desc: 'Top-anchored stacks automatically clear the status bar (the card still floats above the page navbar by design); H5 has no status bar and stays flat. Set false on hosts whose fixed layer already starts below the bar.' },
      { name: 'safeHeight', type: 'number | string | undefined', default: 'undefined', desc: 'Extra top offset in px (stacked on top of the status-bar inset); a string takes over padding-top entirely and replaces the auto inset.' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Custom class for the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Custom inline style for the root node.' },
    ],
  },
  events: {
    hint: [{ t: 'text', s: 'open / click payloads are { id, title, description, type }; close additionally carries a reason.' }],
    rows: [
      { name: 'open', payload: 'SnNotifyOpenPayload', desc: 'A message was queued.' },
      { name: 'close', payload: 'SnNotifyClosePayload', desc: 'A card started leaving; reason: auto (timer) / close (pill) / swipe / api (ref call) / overflow (queue cap).' },
      { name: 'click', payload: 'SnNotifyOpenPayload', desc: 'The front card body was tapped.' },
    ],
  },
  slots: {
    hint: [{ t: 'text', s: 'The slot applies to every card of its container; branch on item.id for per-card rendering.' }],
    rows: [
      { name: 'card', props: '{ id, title, description, type }', desc: 'Fully replaces the card content; render your own close trigger and call hide(id).' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Notify · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Notify } from '@snui/uni';",
    chipCopy: "import { Notify } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-notify', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Toast', link: '/en/components/uni/toast' },
    next: { text: 'NoticeBar', link: '/en/components/uni/notice-bar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
