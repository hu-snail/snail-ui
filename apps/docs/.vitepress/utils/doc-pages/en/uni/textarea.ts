/** Textarea · uni-app (uni-app) — English page data. Props from sn-textarea.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const textareaDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Textarea · uni-app' },
  ],
  title: 'Textarea · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Cross-end multi-line text input for uni-app (H5 / WeChat MP / App). easycom auto-registration (',
    },
    { t: 'code', s: 'components/sn-textarea/sn-textarea.vue' },
    { t: 'text', s: ' → ' },
    { t: 'code', s: '<sn-textarea>' },
    { t: 'text', s: '); geometry in ' },
    { t: 'code', s: 'rpx' },
    { t: 'text', s: ', colors from ' },
    { t: 'code', s: '--sn-mp-*' },
    { t: 'text', s: ' tokens.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-textarea',
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
    fileLabel: 'Textarea · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Textarea } from '@snui/uni';
</script>

<template>
  <sn-textarea />
</template>`,
  },
  demos: [
    { name: 'textarea-mp-basic', title: 'Basic usage', blurb: 'v-model binding + placeholder.' },
    {
      name: 'textarea-mp-counter-clear',
      title: 'Word limit & clear (`showWordLimit` / `clearable`)',
      blurb: 'showWordLimit + maxlength counter; clearable; error state.',
    },
    {
      name: 'textarea-mp-states',
      title: 'States (`autoHeight` / `readonly` / `disabled` / `compact`)',
      blurb: 'autoHeight / readonly / disabled / compact.',
    },
    {
      name: 'textarea-mp-prefix-icon',
      title:
        'Leading icon & placeholder (`prefixIcon` / `iconPrefix` / `cssIcon` / `placeholderStyle` / `placeholderClass`)',
      blurb:
        'prefixIcon via the registry; iconPrefix + cssIcon via a CSS class; placeholderStyle / placeholderClass restyle the placeholder.',
    },
    {
      name: 'textarea-mp-clear-trigger',
      title: 'Clear timing (`clearTrigger` / `focusWhenClear`)',
      blurb:
        'clearTrigger: always / focus controls when the × shows; focusWhenClear controls re-focus after clearing.',
    },
    {
      name: 'textarea-mp-mp-runtime',
      title: 'Native miniprogram attributes (MP-only)',
      blurb:
        'focus / autoFocus / fixed / cursor / selection-* / cursorSpacing / adjustPosition / disableDefaultPadding / holdKeyboard / confirmType / confirmHold / showConfirmBar / ignoreCompositionEvent / enableNative / inputmode.',
    },
    {
      name: 'textarea-mp-custom-class',
      title: 'Custom style mount points (`customClass` / `customStyle` / `customTextareaClass`)',
      blurb: 'customClass + customStyle on the root; customTextareaClass on the inner textarea.',
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
        desc: 'Bound value (v-model). Numbers are rendered as their string form.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'请输入...'",
        desc: 'Placeholder text. wd-textarea defaults to `请输入...`.',
      },
      {
        name: 'placeholderStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style declarations for the placeholder pseudo-element.',
      },
      {
        name: 'placeholderClass',
        type: 'string',
        default: "''",
        desc: 'Class applied to the placeholder pseudo-element (uni-app MP).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction. Native `disabled` attribute is set.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — value is visible but not editable.',
      },
      {
        name: 'maxlength',
        type: 'number',
        default: '-1',
        desc: 'Max character length. `-1` means unlimited (wd-textarea default).',
      },
      { name: 'clearable', type: 'boolean', default: 'false', desc: 'Show the × clear button.' },
      {
        name: 'prefixIcon',
        type: 'string',
        default: "''",
        desc: 'Front icon name, resolved through the sn-icon registry.',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: 'Front icon CSS class (bypasses the sn-icon registry).',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'When `true`, `prefixIcon` is treated as a CSS class name.',
      },
      {
        name: 'showWordLimit',
        type: 'boolean',
        default: 'false',
        desc: 'Show the running `current / max` counter. Requires `maxlength`.',
      },
      {
        name: 'clearTrigger',
        type: "'always' | 'focus'",
        default: "'always'",
        desc: 'When the clear button is shown: `always` or only while focused.',
      },
      {
        name: 'focusWhenClear',
        type: 'boolean',
        default: 'true',
        desc: 'Refocus the field after the clear button is tapped.',
      },
      {
        name: 'error',
        type: 'boolean',
        default: 'false',
        desc: 'Error state — red border + `aria-invalid`.',
      },
      { name: 'focus', type: 'boolean', default: 'false', desc: 'Focus the field on mount.' },
      {
        name: 'autoFocus',
        type: 'boolean',
        default: 'false',
        desc: 'Auto-focus + raise the soft keyboard on mount.',
      },
      {
        name: 'autoHeight',
        type: 'boolean',
        default: 'false',
        desc: 'Grow the field height with its content.',
      },
      {
        name: 'fixed',
        type: 'boolean',
        default: 'false',
        desc: 'Fixed-position mode — prevents the field from being pushed by the keyboard.',
      },
      {
        name: 'cursorSpacing',
        type: 'number',
        default: '0',
        desc: 'Distance kept between the caret and the soft keyboard (px).',
      },
      {
        name: 'cursor',
        type: 'number',
        default: '-1',
        desc: 'Initial caret position. `-1` means "unset".',
      },
      {
        name: 'confirmType',
        type: "'send' | 'search' | 'next' | 'go' | 'done' | undefined",
        default: 'undefined',
        desc: 'Soft-keyboard confirm button label.',
      },
      {
        name: 'confirmHold',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the keyboard up when the confirm button is tapped.',
      },
      {
        name: 'showConfirmBar',
        type: 'boolean',
        default: 'true',
        desc: 'Show the "完成" toolbar above the soft keyboard.',
      },
      {
        name: 'selectionStart',
        type: 'number',
        default: '-1',
        desc: 'Initial selection range start. Pairs with `selectionEnd`.',
      },
      {
        name: 'selectionEnd',
        type: 'number',
        default: '-1',
        desc: 'Initial selection range end. Pairs with `selectionStart`.',
      },
      {
        name: 'adjustPosition',
        type: 'boolean',
        default: 'true',
        desc: 'Auto-scroll the page when the keyboard covers the field.',
      },
      {
        name: 'disableDefaultPadding',
        type: 'boolean',
        default: 'false',
        desc: 'Drop the iOS default inner padding.',
      },
      {
        name: 'holdKeyboard',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the keyboard up when the page is tapped while focused.',
      },
      {
        name: 'ignoreCompositionEvent',
        type: 'boolean',
        default: 'true',
        desc: 'Ignore composition events; `false` emits `input` mid-composition.',
      },
      {
        name: 'inputmode',
        type: "'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'",
        default: "'text'",
        desc: 'Soft-keyboard type hint.',
      },
      {
        name: 'enableNative',
        type: 'boolean',
        default: 'true',
        desc: 'Alipay MP: use the native textarea (avoids the keyboard push-up jump).',
      },
      {
        name: 'compact',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: 'Compact layout — strips the default padding / background so the field nests inside a form row. `undefined` lets `sn-form-item` decide.',
      },
      {
        name: 'customTextareaClass',
        type: 'string',
        default: "''",
        desc: 'Class on the inner native `<textarea>`.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Textarea · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Textarea } from '@snui/uni';",
    chipCopy: "import { Textarea } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-textarea', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-input', link: '/en/components/uni/input' },
    next: { text: 'sn-code-input', link: '/en/components/uni/code-input' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
