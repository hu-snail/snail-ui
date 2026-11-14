/** Button (Web) — English page data. Props from button SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const buttonDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Button' }],
  title: 'Button',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '5 tiers ' },
    { t: 'code', s: 'tiny' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'small' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'medium' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'large' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'huge' },
    { t: 'text', s: ', mapped to ' },
    { t: 'code', s: '--sn-web-button-height-{size}' },
    { t: 'text', s: '.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/button',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Button.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Button } from '@snui/vue-web';
</script>

<template>
  <Button />
</template>`,
  },
  demos: [
    {
      name: 'button-web-basic',
      title: 'Basic usage',
      blurb: '6 semantic types: default / primary / info / success / warning / error.',
    },
    {
      name: 'button-web-size',
      title: 'Sizes',
      blurb: '5 height tiers, covering everything from compact lists to hero CTAs.',
    },
    {
      name: 'button-web-shape',
      title: 'Block & round',
      blurb: 'block spans the parent width; round applies pill-shaped corners.',
    },
    {
      name: 'button-web-state',
      title: 'States',
      blurb:
        'disabled fully disables; loading shows spinner and is unclickable; can manually toggle loading state.',
    },
    {
      name: 'button-web-variant',
      title: 'Variant: text / ghost / dashed',
      blurb:
        'text — text-only button; ghost — transparent bg + colored border; dashed — dashed border.',
    },
    {
      name: 'button-web-emphasis',
      title: 'Circle / Strong / Secondary / Tertiary / Quaternary',
      blurb:
        'circle — round icon-only; strong — primary shadow; secondary / tertiary / quaternary — text variant emphasis gradient.',
    },
    {
      name: 'button-web-color',
      title: 'Custom color',
      blurb:
        'color prop sets custom CSS color → `--sn-button-color` token override; gradients layer via background-image.',
    },
    {
      name: 'button-web-tag',
      title: 'Tag-based rendering (`<a>` / `<div>` / `<span>`)',
      blurb: "tag='a' renders as link; tag='div' as container; default tag='button'.",
    },
    {
      name: 'button-web-icon-placement',
      title: 'iconPlacement + showIcon',
      blurb:
        "iconPlacement 'right' puts icon on the right; showIcon false hides icon entirely (loading still renders spinner).",
    },
    {
      name: 'button-web-attr-type',
      title: 'attrType + focusable',
      blurb: 'attrType for form submit / reset; focusable false removes tab focus.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' | 'tertiary'",
        default: "'default'",
        desc: 'Button visual type. Mirrors n-button.type.',
      },
      { name: 'round', type: 'boolean', default: 'false', desc: 'Pill-shaped (radius: 999px).' },
      {
        name: 'circle',
        type: 'boolean',
        default: 'false',
        desc: 'Fully circular — equal padding on all sides.',
      },
      {
        name: 'block',
        type: 'boolean',
        default: 'false',
        desc: 'Renders block-level (full width).',
      },
      {
        name: 'text',
        type: 'boolean',
        default: 'false',
        desc: 'Plain-text style — transparent background, no border.',
      },
      {
        name: 'dashed',
        type: 'boolean',
        default: 'false',
        desc: 'Dashed border style for placeholder / disabled-state visuals.',
      },
      {
        name: 'ghost',
        type: 'boolean',
        default: 'false',
        desc: 'Ghost style — transparent background, colored border.',
      },
      {
        name: 'secondary',
        type: 'boolean',
        default: 'false',
        desc: 'Reverse the colored hover state.',
      },
      {
        name: 'tertiary',
        type: 'boolean',
        default: 'false',
        desc: 'Lower-emphasis text variant of `text`.',
      },
      {
        name: 'quaternary',
        type: 'boolean',
        default: 'false',
        desc: 'Even lower-emphasis text variant.',
      },
      {
        name: 'strong',
        type: 'boolean',
        default: 'false',
        desc: 'Stronger emphasis on filled variants.',
      },
      {
        name: 'color',
        type: 'string',
        default: '—',
        desc: 'Custom button color (any valid CSS). Overrides `type` color.',
      },
      {
        name: 'size',
        type: "'tiny' | 'small' | 'medium' | 'large' | 'huge'",
        default: "'medium'",
        desc: 'Button size. Drives height + font-size.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disabled state — skips click event and aria-disabled.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Loading state — shows spinner and skips click event.',
      },
      {
        name: 'attrType',
        type: "'button' | 'submit' | 'reset' | undefined",
        default: 'undefined',
        desc: 'Native button type attribute (button / submit / reset).',
      },
      {
        name: 'tag',
        type: "'button' | 'a' | 'div' | 'span'",
        default: "'button'",
        desc: 'HTML tag rendered as the root. Allows rendering as `<a>` or arbitrary element for navigation. Defaults to `<button>`.',
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Native ARIA label override.' },
      {
        name: 'focusable',
        type: 'boolean',
        default: 'true',
        desc: 'Tabindex override (default 0; -1 to remove from tab order).',
      },
      {
        name: 'icon',
        type: 'IconComponent',
        default: '—',
        desc: 'Icon component to render before the default slot. Bundlers walk the named import statically and tree-shake unused icons.',
      },
      {
        name: 'iconName',
        type: 'string',
        default: '—',
        desc: 'Icon name resolved via the SnIcon registry (populated by `registerSnIcons()` at app bootstrap). Convenience prop so the common case does not require wrapping `<SnIcon>` in a slot.',
      },
      {
        name: 'iconPlacement',
        type: "'left' | 'right'",
        default: "'left'",
        desc: "Icon placement: 'left' (default) or 'right' of the slot.",
      },
      {
        name: 'iconSize',
        type: 'number | string',
        default: '14',
        desc: 'Pixel / CSS size forwarded to the embedded SnIcon. Default 14.',
      },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: 'Whether to show the icon at all. `false` hides icon even if `icon` or `iconName` is set. Defaults to `true`.',
      },
      {
        name: 'htmlType',
        type: "'button' | 'submit' | 'reset' | undefined",
        default: 'undefined',
        desc: '`attrType` wins when both are set.',
      },
      { name: 'bordered', type: 'boolean', default: 'true', desc: 'bordered' },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnButton.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'click',
        payload: 'MouseEvent',
        desc: 'Native click; skipped while `disabled` or `loading`.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnButton.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'default', props: '—', desc: 'Default slot — button label.' },
      { name: 'icon', props: '—', desc: 'Custom icon slot — renders before default content.' },
      {
        name: 'loading',
        props: '—',
        desc: 'Custom loading indicator — replaces the default spinner.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Button ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Button } from '@snui/vue-web';",
    chipCopy: "import { Button } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Button', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    next: { text: 'divider', link: '/en/components/web/divider' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
