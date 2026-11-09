/** Input · Web (Web) — English page data. Props from input SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const inputDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Input · Web' }],
  title: 'Input · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Controlled input. Renders a native ' },
    { t: 'code', s: '<input>' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '<textarea>' },
    { t: 'text', s: ' styled through the token alias layer.' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/input',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Input · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Input } from '@snui/vue-web';
</script>

<template>
  <Input />
</template>`,
  },
  demos: [
    { name: 'input-basic', title: 'Basic', blurb: 'Two-way v-model binding.' },
    {
      name: 'input-types',
      title: 'Types',
      blurb:
        '12 types: text / password / email / number / digit / idcard / nickname / safe-password / tel / url / search / textarea.',
    },
    {
      name: 'input-sizes',
      title: 'Sizes',
      blurb: '5 height tiers, covering compact search to hero forms.',
    },
    {
      name: 'input-status',
      title: 'Status',
      blurb: 'default / error / warning — driven by FormItem validation, manual override allowed.',
    },
    {
      name: 'input-states',
      title: 'States',
      blurb: 'disabled / readonly / required — sets aria-* attributes accordingly.',
    },
    {
      name: 'input-clearable-count',
      title: 'Clearable + Counter',
      blurb:
        "clearable × button; clearTrigger 'always' | 'focus'; showCount / showWordLimit + maxlength.",
    },
    {
      name: 'input-password-toggle',
      title: 'Show Password',
      blurb: "type='password' + showPassword renders eye toggle.",
    },
    {
      name: 'input-prefix-suffix',
      title: 'Prefix / Suffix Icon',
      blurb: 'prefixIcon / suffixIcon rendered through SnIcon; cssIcon falls back to CSS class.',
    },
    {
      name: 'input-bordered-bg-radius',
      title: 'Border / Background / Radius',
      blurb: "border: 'all' | 'bottom' | 'none' (bordered alias); bg / customBg; radius tiers.",
    },
    {
      name: 'input-align-compact',
      title: 'alignRight / compact / inputmode',
      blurb: 'amount-field right-align; compact mode; inputmode soft-keyboard hint.',
    },
    {
      name: 'input-custom',
      title: 'customClass / customStyle / customInputClass',
      blurb: 'Three class / style hooks at root / inner / via slot.',
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
        desc: 'Bound value. String for text-like types; number coerced for `type="number"`.',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Drives height + font-size.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        desc: 'Placeholder text. Forwarded to the native input/textarea.',
      },
      {
        name: 'placeholderStyle',
        type: 'string',
        default: "''",
        desc: 'Inline CSS for the placeholder pseudo-element. Accepts a string of declarations (e.g. `color: #999; font-size: 12px;`) per the `wd-input` placeholder-style contract.',
      },
      {
        name: 'placeholderClass',
        type: 'string',
        default: "''",
        desc: 'Class applied to the placeholder pseudo-element.',
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
        desc: 'Required for form submission. Renders `aria-required="true"`.',
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Native ARIA label.' },
      {
        name: 'maxlength',
        type: 'number',
        default: '—',
        desc: 'Max character length. Pairs with `showCount`.',
      },
      {
        name: 'minlength',
        type: 'number',
        default: '—',
        desc: 'Min character length. Validates on blur / submit.',
      },
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
        desc: 'Show the clear (×) button when the field has a non-empty value.',
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
        desc: 'Front-icon name. Resolved via `registerSnIcons()`. Use the `prefix` slot for arbitrary rich content.',
      },
      {
        name: 'suffixIcon',
        type: 'string',
        default: "''",
        desc: 'Tail-icon name. Resolved via `registerSnIcons()`.',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'CSS-icon mode. When `true`, `prefixIcon` / `suffixIcon` are treated as class names applied directly to a span (rather than resolved through the SnIcon registry).',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status. Driven by FormItem validation; manual override allowed.',
      },
      { name: 'min', type: 'number', default: '—', desc: 'Lower bound (numeric input only).' },
      { name: 'max', type: 'number', default: '—', desc: 'Upper bound (numeric input only).' },
      { name: 'step', type: 'number', default: '—', desc: 'Step (numeric input only).' },
      { name: 'rows', type: 'number', default: '3', desc: 'Textarea row count (textarea only).' },
      {
        name: 'border',
        type: "'all' | 'bottom' | 'none'",
        default: "'all'",
        desc: "Border preset. - `all`    — full 1px border on all sides (default). - `bottom` — only the bottom edge gets a border, top / left / right are transparent. Common for inline form rows. - `none`   — no border at all. The older boolean `bordered` prop is kept as a deprecated alias — `bordered: true` === `border: 'all'`, `bordered: false` === `border: 'none'`.",
      },
      {
        name: 'bordered',
        type: 'boolean',
        default: 'true',
        desc: "bordered: true   → border: 'all' bordered: false  → border: 'none'",
      },
      {
        name: 'bg',
        type: "'surface' | 'transparent' | 'soft'",
        default: "'surface'",
        desc: 'Background tone. `surface` (default) uses the elevated card color; `transparent` removes the background (e.g. for inputs that sit directly on a colored banner); `soft` is a subtle secondary fill.',
      },
      {
        name: 'radius',
        type: "'default' | 'sm' | 'lg' | 'xl' | 'pill' | 'square'",
        default: "'default'",
        desc: 'Border-radius preset (AUI additive). Tiers map to the web radius tokens; `default` keeps `--sn-web-input-radius`: - `sm`      — `--sn-web-radius-sm` - `default` — `--sn-web-input-radius` - `lg`      — `--sn-web-radius-lg` - `xl`      — `--sn-web-radius-xl` - `pill`    — fully rounded field (search-bar style) - `square`  — right-angled',
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
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Input · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Input } from '@snui/vue-web';",
    chipCopy: "import { Input } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Input', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'link', link: '/en/components/web/link' },
    next: { text: 'input-number', link: '/en/components/web/input-number' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
