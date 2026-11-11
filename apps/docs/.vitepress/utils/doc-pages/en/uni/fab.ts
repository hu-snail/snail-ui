/** Fab · uni-app (uni-app) — English page data. Props from sn-fab.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const fabDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Fab · uni-app' }],
  title: 'Fab · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'With ' },
    { t: 'code', s: 'draggable' },
    { t: 'text', s: ', hold the trigger to drag it; on release it clamps back inside the ' },
    { t: 'code', s: 'gap' },
    { t: 'text', s: ' safe area (clamped to the viewport when ' },
    { t: 'code', s: 'uni.getSystemInfoSync()' },
    {
      t: 'text',
      s: ' is available). Dragging and expanding do not interfere. Desktop H5 additionally supports mouse dragging ',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-fab',
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
    fileLabel: 'Fab · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Fab } from '@snui/uni';
</script>

<template>
  <sn-fab />
</template>`,
  },
  demos: [
    {
      name: 'fab-mp-basic',
      title: 'Basic usage',
      blurb:
        'A bottom-right floating button sliding out three icon+text pills upwards; picking one shows the feedback and collapses.',
    },
    {
      name: 'fab-mp-direction',
      title: 'Expansion direction',
      blurb:
        'up (bottom-right) / down (top-left) / left (right-center) / right (left-center), each expanding its icon actions; picking one records the direction feedback.',
    },
    {
      name: 'fab-mp-fan',
      title: 'Fan expansion (`mode="fan"`)',
      blurb:
        'A symmetric centre fan at bottom-center plus oblique fans at bottom-right / top-left (icon bubbles, folding-fan sweep); items auto-close on tap.',
    },
    {
      name: 'fab-mp-drag',
      title: 'Dragging (`draggable`)',
      blurb:
        'Hold the bottom-right button to drag it; it clamps into the safe area on release and still expands afterwards.',
    },
    {
      name: 'fab-mp-position',
      title: 'Positions and themes',
      blurb:
        'Top-left / top-right / bottom-left / bottom-center anchors, each with a pill group whose direction follows the anchor.',
    },
    {
      name: 'fab-mp-expandable',
      title: 'Click-only (`expandable`)',
      blurb: 'expandable=false taps the trigger without expanding and emits click only (counter).',
    },
    {
      name: 'fab-mp-disabled',
      title: 'Disabled (`disabled`)',
      blurb: 'disabled blocks every interaction, trigger at half opacity.',
    },
    {
      name: 'fab-mp-trigger-icons',
      title: 'Trigger icon dual-track',
      blurb:
        'The icon-name track (inactive-icon / active-icon, resolved via registerSnIcons) next to the trigger-slot IconData track.',
    },
    {
      name: 'fab-mp-type',
      title: 'Theme color (`type`)',
      blurb: 'Swatches switch the FAB type live (5 themes); items record the pick and collapse.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'active',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the menu is expanded (v-model:active).',
      },
      { name: 'type', type: 'FabType', default: "'primary'", desc: 'Color theme.' },
      { name: 'position', type: 'FabPosition', default: "'right-bottom'", desc: 'Anchor preset.' },
      { name: 'draggable', type: 'boolean', default: 'false', desc: 'Allow dragging the trigger.' },
      {
        name: 'direction',
        type: 'FabDirection',
        default: "'up'",
        desc: 'Menu expansion direction (`up` / `down` alias `top` / `bottom`).',
      },
      {
        name: 'mode',
        type: 'FabMode',
        default: "'line'",
        desc: 'Expansion shape: stack (`line`, wd-fab 1:1) or arc (`fan`, additive).',
      },
      {
        name: 'actions',
        type: 'SnFabAction[]',
        default: '() => []',
        desc: 'Fan-mode action items (structured source; the slot is ignored in fan mode).',
      },
      {
        name: 'fanRadius',
        type: 'number',
        default: '96',
        desc: 'Fan radius in px — distance from the trigger centre to an item centre.',
      },
      {
        name: 'fanMotion',
        type: 'FabMotion',
        default: "'bloom'",
        desc: 'Fan expansion motion: radial bloom or folding-fan arc sweep.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable the whole button.' },
      {
        name: 'inactiveIcon',
        type: 'string',
        default: "'plus'",
        desc: 'Icon while collapsed (registry name).',
      },
      {
        name: 'activeIcon',
        type: 'string',
        default: "'close'",
        desc: 'Icon while expanded (registry name).',
      },
      { name: 'zIndex', type: 'number', default: '99', desc: 'Stacking level.' },
      {
        name: 'gap',
        type: 'SnFabGap',
        default: '() => ({ top: 16',
        desc: 'Default gap from each screen edge.',
      },
      {
        name: 'expandable',
        type: 'boolean',
        default: 'true',
        desc: 'Expand the menu on tap; `false` emits `click` instead.',
      },
      {
        name: 'top',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit distance from the top edge (overrides `gap.top`).',
      },
      {
        name: 'bottom',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit distance from the bottom edge (overrides `gap.bottom`).',
      },
      {
        name: 'left',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit distance from the left edge (overrides `gap.left`).',
      },
      {
        name: 'right',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Explicit distance from the right edge (overrides `gap.right`).',
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
    copy: 'Fab · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Fab } from '@snui/uni';",
    chipCopy: "import { Fab } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-fab', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-cell', link: '/en/components/uni/cell' },
    next: { text: 'sn-transition', link: '/en/components/uni/transition' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
