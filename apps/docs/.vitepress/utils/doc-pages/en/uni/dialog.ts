/** Dialog · uni-app (uni-app) — English page data. Props from sn-dialog.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dialogDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'Dialog · uni-app' },
  ],
  title: 'Dialog · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The panel surface, text and status colors all come from semantic tokens (' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-text-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-feedback-*' },
    { t: 'text', s: '), all overridden in the dark block of ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    { t: 'text', s: ', so it adapts automatically. Verif' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-dialog',
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
    fileLabel: 'Dialog · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Dialog } from '@snui/uni';
</script>

<template>
  <sn-dialog />
</template>`,
  },
  demos: [
    {
      name: 'dialog-mp-basic',
      title: 'Basic usage',
      blurb: 'alert / confirm / prompt, with length validation on prompt.',
    },
    {
      name: 'dialog-mp-variant',
      title: 'Flavours and icons',
      blurb: 'success / warning icons, text-theme buttons, stacked buttons.',
    },
    {
      name: 'dialog-mp-actions',
      title: 'Custom actions and guards',
      blurb: 'Custom action rows (with a disabled entry) and a beforeConfirm veto.',
    },
    {
      name: 'dialog-mp-custom',
      title: 'Custom panel styles',
      blurb:
        'custom-style adds padding and a min-width; selector / root-portal are parity declarations.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: 'Whether the dialog is visible (v-model). Component-form counterpart of `useDialog().show()`.',
      },
      { name: 'title', type: 'string', default: "''", desc: 'Title text.' },
      { name: 'msg', type: 'string', default: "''", desc: 'Message body text.' },
      {
        name: 'type',
        type: 'DialogType',
        default: "'alert'",
        desc: 'Dialog flavour: `alert` (one button), `confirm` (two), `prompt` (two + input).',
      },
      {
        name: 'theme',
        type: 'DialogTheme',
        default: "'button'",
        desc: 'Button style: filled buttons or borderless text buttons.',
      },
      { name: 'zIndex', type: 'number', default: '99', desc: 'Stacking level of the dialog.' },
      {
        name: 'lazyRender',
        type: 'boolean',
        default: 'true',
        desc: 'Defer body rendering until the dialog is first opened.',
      },
      {
        name: 'headerImage',
        type: 'string',
        default: "''",
        desc: 'Full-width image above the body.',
      },
      {
        name: 'icon',
        type: 'string',
        default: "''",
        desc: 'Status icon: `success` / `info` / `warning` / `danger`, or a registry icon name.',
      },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: 'Status icon color (any CSS color value).',
      },
      {
        name: 'iconProps',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'Props forwarded to the inner sn-icon.',
      },
      {
        name: 'inputValue',
        type: 'string | number',
        default: "''",
        desc: 'Initial value of the prompt input.',
      },
      {
        name: 'inputProps',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'Props forwarded to the inner sn-input (prompt mode).',
      },
      {
        name: 'textareaProps',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'When non-empty, prompt mode renders sn-textarea instead of sn-input.',
      },
      {
        name: 'inputPattern',
        type: 'RegExp | undefined',
        default: 'undefined',
        desc: 'Regexp the prompt value must match.',
      },
      {
        name: 'inputError',
        type: 'string',
        default: "''",
        desc: 'Fallback message shown when prompt validation fails.',
      },
      {
        name: 'showErr',
        type: 'boolean',
        default: 'false',
        desc: 'Show the validation message under the input.',
      },
      {
        name: 'actionLayout',
        type: 'DialogActionLayout',
        default: "'horizontal'",
        desc: 'Action button arrangement.',
      },
      {
        name: 'showCancelButton',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Show the cancel button. Defaults to `false` for `alert`, `true` otherwise.',
      },
      { name: 'confirmButtonText', type: 'string', default: "''", desc: 'Confirm button label.' },
      { name: 'cancelButtonText', type: 'string', default: "''", desc: 'Cancel button label.' },
      {
        name: 'confirmButtonProps',
        type: 'DialogButtonOption',
        default: '() => ({})',
        desc: 'Confirm button option (label / extra props / `null` to hide).',
      },
      {
        name: 'cancelButtonProps',
        type: 'DialogButtonOption | undefined',
        default: 'undefined',
        desc: 'Cancel button option (label / extra props / `null` to hide).',
      },
      {
        name: 'actions',
        type: 'DialogAction[]',
        default: '() => []',
        desc: 'Custom action rows; when set they replace the confirm / cancel buttons.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'false',
        desc: 'Close when the scrim is tapped.',
      },
      {
        name: 'showClose',
        type: 'boolean',
        default: 'false',
        desc: 'Show the close button in the top-right corner.',
      },
      {
        name: 'selector',
        type: 'string',
        default: "''",
        desc: 'Instance id used by the function API (parity only, no effect here).',
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
        desc: 'Custom inline style for the panel.',
      },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Dialog · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Dialog } from '@snui/uni';",
    chipCopy: "import { Dialog } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-dialog', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-overlay', link: '/en/components/uni/overlay' },
    next: { text: 'sn-action-sheet', link: '/en/components/uni/action-sheet' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
