/** DropMenu · uni-app (uni-app) — English page data. Props from sn-drop-menu.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dropMenuDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'DropMenu · uni-app' },
  ],
  title: 'DropMenu · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Every row supports three icon sources, precedence ' },
    { t: 'code', s: 'iconData' },
    { t: 'text', s: ' (object) > ' },
    { t: 'code', s: 'iconUrl' },
    { t: 'text', s: ' (image) > ' },
    { t: 'code', s: 'icon' },
    { t: 'text', s: ' (name resolution chain); ' },
    { t: 'code', s: 'iconSize' },
    {
      t: 'text',
      s: ' sets the row and check-glyph size (tier names tiny/small/medium/large/xlarge map to ',
    },
    { t: 'code', s: '--sn-mp-icon-size-*' },
    { t: 'text', s: ', empty = medium), a' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-drop-menu',
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
    fileLabel: 'DropMenu · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DropMenu } from '@snui/uni';
</script>

<template>
  <sn-drop-menu />
</template>`,
  },
  demos: [
    {
      name: 'drop-menu-mp-basic',
      title: 'Basic usage',
      blurb: 'Sort menu with one disabled row; picking a row reports selectedItem.',
    },
    {
      name: 'drop-menu-mp-direction',
      title: 'Expansion direction',
      blurb: 'Down / up comparison; the arrow follows the direction.',
    },
    {
      name: 'drop-menu-mp-icon',
      title: 'Option icons',
      blurb:
        'Three icon sources compared: IconData object, name resolution, image URL; iconSize tiers; selected-row check glyph.',
    },
    {
      name: 'drop-menu-mp-guard',
      title: 'Toggle guard / field keys',
      blurb: 'Upwards panel + beforeToggle blocking the first two taps + custom field names.',
    },
    {
      name: 'drop-menu-mp-panel',
      title: 'No scrim / panel height / custom panel',
      blurb:
        'modal=false; close-on-click-modal=false; popup-height cap; custom-popup-class / custom-popup-style; disabled; default slot.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number',
        default: "''",
        desc: 'Current selected value (v-model).',
      },
      { name: 'options', type: 'SnDropMenuOption[]', default: '() => []', desc: 'Option rows.' },
      {
        name: 'direction',
        type: 'DropDirection',
        default: "'down'",
        desc: 'Menu expansion direction.',
      },
      {
        name: 'zIndex',
        type: 'number',
        default: '12',
        desc: 'Stacking level of the scrim + panel.',
      },
      {
        name: 'modal',
        type: 'boolean',
        default: 'true',
        desc: 'Render the scrim behind the panel.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Close the menu when the scrim is tapped.',
      },
      {
        name: 'duration',
        type: 'number',
        default: 'DEFAULT_DURATION',
        desc: 'Open / close animation duration in ms.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable the whole menu — taps are ignored.',
      },
      {
        name: 'iconName',
        type: 'string',
        default: "'check'",
        desc: "Icon name of the selected row's glyph (registry / built-in catalogue).",
      },
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Menu title; when set it replaces the selected option label in the bar.',
      },
      {
        name: 'icon',
        type: 'string',
        default: "'caret-down'",
        desc: 'Icon name of the bar arrow (registry / built-in catalogue).',
      },
      {
        name: 'iconSize',
        type: 'string | number',
        default: "''",
        desc: 'Glyph scale for the arrow, the selected-row check and every option icon: a named tier (`tiny|small|medium|large|xlarge`) maps to `--sn-mp-icon-size-*`, a number stays px, any other string passes through. Empty = the `medium` tier.',
      },
      {
        name: 'beforeToggle',
        type: 'DropMenuBeforeToggle',
        default: '—',
        desc: 'Guard called before the menu toggles; `false` blocks the toggle.',
      },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Field name of the option value.',
      },
      {
        name: 'labelKey',
        type: 'string',
        default: "'label'",
        desc: 'Field name of the option label.',
      },
      { name: 'tipKey', type: 'string', default: "'tip'", desc: 'Field name of the option tip.' },
      {
        name: 'customPopupClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the option list panel.',
      },
      {
        name: 'customPopupStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the option list panel.',
      },
      {
        name: 'popupHeight',
        type: 'string',
        default: "''",
        desc: 'Height of the option list panel; empty = at most 80% of the viewport.',
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
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for `wd-drop-menu` parity, NOT implemented — miniprogram has no portal host, so the panel cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'DropMenu · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { DropMenu } from '@snui/uni';",
    chipCopy: "import { DropMenu } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-drop-menu', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-grid', link: '/en/components/uni/grid' },
    next: { text: 'sn-tooltip', link: '/en/components/uni/tooltip' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
