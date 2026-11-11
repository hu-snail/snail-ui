/** Input · uni-app x (uni-app x) — English page data. Props from sn-input.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const inputDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Input · uni-app x' },
  ],
  title: 'Input · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Cross-end controlled input for uni-app x (H5 / WeChat MP / App). Geometry in rpx, tokens drive the surface.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-input',
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
    fileLabel: 'Input · uni-app x.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Input } from '@snui/uni';
</script>

<template>
  <sn-input />
</template>`,
  },
  demos: [
    { name: 'input-mp-basic', title: 'Basic', blurb: 'v-model binding.' },
    {
      name: 'input-mp-types',
      title: 'Types',
      blurb:
        '16 types: text / password / email / number / digit / idcard / nickname / safe-password / tel / url / search / textarea.',
    },
    { name: 'input-mp-sizes', title: 'Sizes', blurb: '3 sizes (rpx: 56/72/88).' },
    { name: 'input-mp-status', title: 'Status', blurb: 'default / error / warning.' },
    { name: 'input-mp-states', title: 'States', blurb: 'disabled / readonly / required + aria-*.' },
    {
      name: 'input-mp-clearable',
      title: 'Clear button (clearable)',
      blurb: 'clearable × button clears the value in one tap.',
    },
    {
      name: 'input-mp-count',
      title: 'Character count (showCount)',
      blurb: 'showCount / showWordLimit + maxlength counter.',
    },
    {
      name: 'input-mp-password-toggle',
      title: 'Show Password',
      blurb: "type='password' + showPassword renders eye toggle.",
    },
    {
      name: 'input-mp-prefix-suffix',
      title: 'Prefix / Suffix Icon',
      blurb:
        'prefixIcon / suffixIcon through the SnIcon resolution chain; iconPrefix / iconSuffix / cssIcon css-class fallbacks.',
    },
    {
      name: 'input-mp-radius',
      title: 'Radius (`radius`)',
      blurb:
        "radius: 'default' | 'sm' | 'lg' | 'xl' | 'pill' | 'square', tiers map to --sn-mp-radius-*.",
    },
    {
      name: 'input-mp-border',
      title: 'Border',
      blurb: "border: 'all' | 'bottom' | 'none' (bordered alias).",
    },
    {
      name: 'input-mp-bg',
      title: 'Background',
      blurb: "bg: 'surface' | 'transparent' | 'soft'; customBg.",
    },
    {
      name: 'input-mp-align',
      title: 'Right alignment (alignRight)',
      blurb: 'amount fields right-align.',
    },
    {
      name: 'input-mp-compact',
      title: 'Compact inline form (compact)',
      blurb: 'compact + border="bottom": an inline row inside Cell / FormItem.',
    },
    {
      name: 'input-mp-inputmode',
      title: 'Soft keyboard hint (inputmode)',
      blurb: 'inputmode soft-keyboard hint.',
    },
    {
      name: 'input-mp-confirm-type',
      title: 'Confirm button label (confirmType)',
      blurb: 'confirm-type: the soft-keyboard confirm button label.',
    },
    {
      name: 'input-mp-keyboard-hold',
      title: 'Keyboard hold & page push',
      blurb: 'hold-keyboard / adjust-position / always-embed.',
    },
    {
      name: 'input-mp-cursor-selection',
      title: 'Caret & selection',
      blurb: 'cursor / selection-start / selection-end.',
    },
    {
      name: 'input-mp-clear-trigger',
      title: 'Clear button details (clearTrigger / focusWhenClear)',
      blurb: 'clearTrigger always / focus; focusWhenClear.',
    },
    {
      name: 'input-mp-focus',
      title: 'Autofocus (focus)',
      blurb: 'focus on mount.',
    },
    {
      name: 'input-mp-placeholder',
      title: 'Placeholder styling (placeholderClass / placeholderStyle)',
      blurb: 'placeholderClass + placeholderStyle.',
    },
    {
      name: 'input-mp-word-limit',
      title: 'Word-count alias (`showWordLimit`)',
      blurb: 'showWordLimit + maxlength; equivalent to showCount.',
    },
    {
      name: 'input-mp-cursor-spacing',
      title: 'Cursor spacing (cursorSpacing)',
      blurb: 'cursorSpacing: keep the caret a fixed distance above the keyboard.',
    },
    {
      name: 'input-mp-confirm-hold',
      title: 'Keyboard hold on confirm (confirmHold)',
      blurb: 'confirmHold: the confirm key does not dismiss the keyboard.',
    },
    {
      name: 'input-mp-composition',
      title: 'Composition input (ignoreCompositionEvent)',
      blurb: 'ignoreCompositionEvent=false: input fires mid-composition.',
    },
    {
      name: 'input-mp-enable-native',
      title: 'Native input (enableNative)',
      blurb: 'enableNative=false: Alipay MP renders the simulated widget.',
    },
    {
      name: 'input-mp-custom-class',
      title: 'Custom style mount points (`customClass` / `customStyle` / `customInputClass`)',
      blurb: 'customClass + customStyle on the root; customInputClass on the inner native field.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number',
        default: "''",
        desc: "Bound value. Coerced to `number` when type='number' / 'digit'.",
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Mobile-first size preset. Drives rpx height + font-size.',
      },
      { name: 'placeholder', type: 'string', default: "''", desc: 'Placeholder text.' },
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
        desc: 'Class applied to the placeholder pseudo-element (uni-app x MP).',
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
        name: 'required',
        type: 'boolean',
        default: 'false',
        desc: 'Required for form submission. Renders `aria-required`.',
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Accessible label.' },
      {
        name: 'maxlength',
        type: 'number',
        default: '—',
        desc: 'Max character length (cross-end: most MP vendors honor this).',
      },
      { name: 'minlength', type: 'number', default: '—', desc: 'Min character length.' },
      {
        name: 'showCount',
        type: 'boolean',
        default: 'false',
        desc: 'Show the running `current / max` counter (right-aligned). Aliased as `showWordLimit` for wot-ui parity.',
      },
      {
        name: 'showWordLimit',
        type: 'boolean',
        default: 'false',
        desc: 'wot-ui alias for `showCount`.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Show × button to clear value.',
      },
      {
        name: 'clearTrigger',
        type: "'always' | 'focus'",
        default: "'always'",
        desc: 'When the clear button is shown. `always` shows whenever there is a value; `focus` shows only when the input is focused. Mirrors `wd-input` clear-trigger.',
      },
      {
        name: 'focusWhenClear',
        type: 'boolean',
        default: 'true',
        desc: 'After clicking the clear button, refocus the input.',
      },
      {
        name: 'showPassword',
        type: 'boolean',
        default: 'false',
        desc: "Render an inline eye-toggle that flips between password and text. Applies only when `type === 'password'`.",
      },
      {
        name: 'prefixIcon',
        type: 'string',
        default: "''",
        desc: 'Front-icon name. Resolved via the local sn-icon registry.',
      },
      {
        name: 'suffixIcon',
        type: 'string',
        default: "''",
        desc: 'Tail-icon name. Resolved via the local sn-icon registry.',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: 'CSS class names for the prefix icon (when prefixIcon is treated as class).',
      },
      {
        name: 'iconSuffix',
        type: 'string',
        default: "''",
        desc: 'CSS class names for the suffix icon (when suffixIcon is treated as class).',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'CSS-icon mode. When `true`, `prefixIcon` / `suffixIcon` are treated as class names applied directly to a span (rather than resolved through the sn-icon registry).',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status. Driven by sn-form-item validation; manual override allowed.',
      },
      { name: 'min', type: 'number', default: '—', desc: 'Lower bound (numeric input only).' },
      { name: 'max', type: 'number', default: '—', desc: 'Upper bound (numeric input only).' },
      { name: 'step', type: 'number', default: '—', desc: 'Step (numeric input only).' },
      { name: 'rows', type: 'number', default: '3', desc: 'Textarea row count (textarea only).' },
      {
        name: 'border',
        type: "'all' | 'bottom' | 'none'",
        default: "'all'",
        desc: "Border preset (wot-ui parity). 3-way supersedes the legacy boolean. - `all`    — full 1rpx border on all sides (default). - `bottom` — only the bottom edge gets a border (inline form rows). - `none`   — no border at all. The older boolean `bordered` prop is kept as a deprecated alias — `bordered: true` === `border: 'all'`, `bordered: false` === `border: 'none'`.",
      },
      { name: 'bordered', type: 'boolean', default: 'true', desc: 'bordered' },
      {
        name: 'bg',
        type: "'surface' | 'transparent' | 'soft'",
        default: "'surface'",
        desc: 'Background tone. `surface` (default) uses the elevated card color; `transparent` removes the background for inputs that sit directly on a colored banner; `soft` is a subtle secondary fill.',
      },
      {
        name: 'customBg',
        type: 'string',
        default: "''",
        desc: 'Custom hex / rbg / named color overrides the bg tone.',
      },
      {
        name: 'radius',
        type: "'default' | 'sm' | 'lg' | 'xl' | 'pill' | 'square'",
        default: "'default'",
        desc: 'Border-radius preset (AUI additive). Tiers map to the mp radius tokens; `default` keeps `--sn-mp-input-radius`: - `sm`      — `--sn-mp-radius-sm` (8rpx) - `default` — `--sn-mp-input-radius` (12rpx) - `lg`      — `--sn-mp-radius-lg` (16rpx) - `xl`      — `--sn-mp-radius-xl` (24rpx) - `pill`    — fully rounded field - `square`  — right-angled',
      },
      {
        name: 'alignRight',
        type: 'boolean',
        default: 'false',
        desc: 'Right-align the value (numeric / amount fields).',
      },
      {
        name: 'compact',
        type: 'boolean',
        default: 'false',
        desc: 'Compact layout — strips default padding / background so the field nests cleanly inside FormItem / Cell. Mirrors `wd-input` compact.',
      },
      { name: 'focus', type: 'boolean', default: 'false', desc: 'Initial focus on mount.' },
      {
        name: 'inputmode',
        type: "'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'",
        default: "'text'",
        desc: 'HTML inputmode hint.',
      },
      {
        name: 'customInputClass',
        type: 'string',
        default: "''",
        desc: 'Class on the inner native `<input>` / `<textarea>`.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
      {
        name: 'error',
        type: 'boolean',
        default: 'false',
        desc: 'Error state (`wd-input` `error`). Drives the `sn-input--error` class and `aria-invalid`. Independent of the legacy 3-way `status` prop — either one turns the error chrome on.',
      },
      {
        name: 'confirmType',
        type: "'send' | 'search' | 'next' | 'go' | 'done'",
        default: "'done'",
        desc: 'Soft-keyboard confirm button label. `send` | `search` | `next` | `go` | `done` (default `done`).',
      },
      {
        name: 'holdKeyboard',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the soft keyboard up after the field blurs.',
      },
      {
        name: 'adjustPosition',
        type: 'boolean',
        default: 'true',
        desc: 'Auto-scroll the page when keyboard covers the field.',
      },
      {
        name: 'alwaysEmbed',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the input mounted even when detached (uni-app x MP opt-in).',
      },
      { name: 'cursor', type: 'number', default: '-1', desc: 'Initial caret position.' },
      {
        name: 'selectionStart',
        type: 'number',
        default: '-1',
        desc: 'Initial selection range start.',
      },
      { name: 'selectionEnd', type: 'number', default: '-1', desc: 'Initial selection range end.' },
      {
        name: 'cursorSpacing',
        type: 'number',
        default: '0',
        desc: 'Distance kept between the caret and the soft keyboard (px).',
      },
      {
        name: 'confirmHold',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the keyboard up when the confirm key is tapped.',
      },
      {
        name: 'ignoreCompositionEvent',
        type: 'boolean',
        default: 'true',
        desc: 'Ignore IME composition events. `false` re-enables composition events and lets `input` fire mid-composition (uni-app x MP native attribute).',
      },
      {
        name: 'enableNative',
        type: 'boolean',
        default: 'true',
        desc: 'Alipay MP: render the native input widget instead of the simulated one — `false` avoids the page shifting when the keyboard opens.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Input · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Input } from '@snui/uni';",
    chipCopy: "import { Input } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-input', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Form', link: '/en/components/uni/form' },
    next: { text: 'Textarea', link: '/en/components/uni/textarea' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
