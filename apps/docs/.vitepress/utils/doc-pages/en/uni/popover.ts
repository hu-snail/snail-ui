/** Popover · uni-app x (uni-app x) — English page data. Props from sn-popover.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const popoverDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Popover · uni-app x' },
  ],
  title: 'Popover · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Two presentations: the anchored bubble (' },
    { t: 'code', s: 'anchor' },
    { t: 'text', s: ') and a fixed bottom sheet (' },
    { t: 'code', s: 'sheet' },
    {
      t: 'text',
      s: '). The rich card carries a tinted icon plate + bold title + muted subtitle + description + full-width action pills; menu rows gain a muted second line. The card width is fixed through ',
    },
    { t: 'code', s: '--sn-popover-width' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-popover-menu-width' },
    {
      t: 'text',
      s: ' — uni-app x App drops max-content sizing, so a fixed width keeps H5 / miniprogram / App identical; the height always follows the content.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-popover',
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
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Popover · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Popover } from '@snui/uni';
</script>

<template>
  <sn-popover />
</template>`,
  },
  demos: [
    {
      name: 'popover-mp-basic',
      title: 'Basic usage',
      blurb: 'Rich card: icon plate + title + description + corner close',
    },
    { name: 'popover-mp-alignment', title: 'Alignment', blurb: 'top family -start / center / -end' },
    {
      name: 'popover-mp-placement',
      title: 'Placement',
      blurb: 'top / left / right / bottom bubbles with arrows',
    },
    {
      name: 'popover-mp-notification',
      title: 'Notification card',
      blurb: 'subtitle timestamp + full-width action pill (closes by default)',
    },
    {
      name: 'popover-mp-sheet',
      title: 'Bottom sheet',
      blurb: 'presentation="sheet": mask + handle + centred heading + rich rows + Cancel',
    },
    {
      name: 'popover-mp-menu',
      title: 'Menu mode & glyph sources',
      blurb: 'Rich rows (content title + description line), per-row colored glyph plates and the four glyph sources',
    },
    {
      name: 'popover-mp-height',
      title: 'Auto height',
      blurb: 'Long copy wraps inside the fixed width; the card grows, never clips',
    },
    {
      name: 'popover-mp-icon-class',
      title: 'Legacy icon field (iconClass)',
      blurb: 'The legacy iconClass still works: names resolve through SnIcon, URLs render as images.',
    },
    {
      name: 'popover-mp-content-slot',
      title: 'content slot',
      blurb: 'The #content slot fully replaces the bubble body in both modes.',
    },
    {
      name: 'popover-mp-custom-style',
      title: 'Node classes & offset',
      blurb: 'custom-arrow / custom-pop append classes; custom-style overrides --sn-popover-width / glyph-plate tokens.',
    },
    { name: 'popover-mp-theme', title: 'Dark theme', blurb: 'Dark theme' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the bubble is shown (v-model).',
      },
      {
        name: 'content',
        type: 'string | SnPopoverMenuItem[]',
        default: "''",
        desc: 'Bubble body: a string in `normal` mode, a list in `menu` mode.',
      },
      { name: 'mode', type: 'PopoverMode', default: "'normal'", desc: 'Bubble display mode.' },
      { name: 'placement', type: 'PopoverPlacement', default: "'bottom'", desc: 'Bubble anchor.' },
      {
        name: 'offset',
        type: 'PopoverOffset',
        default: '0',
        desc: 'Extra gap in design px — extends the gap on the placement-family axis, shifts the bubble on the cross axis (folded into the measured placement).',
      },
      {
        name: 'visibleArrow',
        type: 'boolean',
        default: 'true',
        desc: 'Render the arrow pointing at the trigger.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the trigger — taps are ignored and the bubble stays closed.',
      },
      {
        name: 'showClose',
        type: 'boolean',
        default: 'false',
        desc: 'Render a close button inside the bubble.',
      },
      {
        name: 'presentation',
        type: "'anchor' | 'sheet'",
        default: "'anchor'",
        desc: 'Where the popover appears (additive): pinned bubble vs fixed bottom sheet.',
      },
      { name: 'title', type: 'string', default: "''", desc: 'Bold card title (additive).' },
      {
        name: 'subtitle',
        type: 'string',
        default: "''",
        desc: 'Muted line under the title — a timestamp, or the sheet description (additive).',
      },
      { name: 'iconData', type: 'IconData', default: '—', desc: 'Header glyph as inline SVG data (additive). Highest precedence.' },
      { name: 'iconUrl', type: 'string', default: "''", desc: 'Header glyph as an image address (additive).' },
      { name: 'icon', type: 'string', default: "''", desc: 'Header glyph as an SnIcon registry name (additive).' },
      { name: 'actions', type: 'SnPopoverAction[]', default: '[]', desc: 'Full-width pill buttons under the body (additive).' },
      { name: 'closeOnAction', type: 'boolean', default: 'true', desc: 'Close after an action / menu row tap (additive).' },
      {
        name: 'cancelText',
        type: 'string',
        default: "''",
        desc: 'Sheet Cancel pill label — empty hides the pill (additive).',
      },
      {
        name: 'closeOnClickOutside',
        type: 'boolean',
        default: 'true',
        desc: 'Close the bubble when the user taps outside it (additive, AUI-OPT-07). The close rides the page-root `closeOutside` channel and never swallows the tap — the same gesture still lands on whatever button sits under it. Pass `false` to unregister the outside-close while mounted.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Extra class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'customArrow',
        type: 'string',
        default: "''",
        desc: 'Extra class on the CSS fallback arrow node (the measured SVG chrome paints its own arrow).',
      },
      { name: 'customPop', type: 'string', default: "''", desc: 'Extra class on the bubble node.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for `wd-popover` parity, NOT implemented — miniprogram has no portal host, so the bubble cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Popover · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Popover } from '@snui/uni';",
    chipCopy: "import { Popover } from '@snui/uni';",
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
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
