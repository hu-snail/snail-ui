/** InputNumber · Web (Web) — English page data. Props from input-number SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const inputNumberDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'InputNumber · Web' },
  ],
  title: 'InputNumber · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Numeric input with steppers (press-and-hold) plus a tail ↑ / ↓ spinner (up increments, down decrements), bounds clamp, precision, stepStrictly, format / parse.',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/input-number',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'InputNumber · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { InputNumber } from '@snui/vue-web';
</script>

<template>
  <InputNumber />
</template>`,
  },
  demos: [
    { name: 'input-number-web-basic', title: 'Basic', blurb: 'v-model + stepper buttons.' },
    {
      name: 'input-number-web-bounds',
      title: 'Bounds & step',
      blurb: 'min / max / step / stepStrictly snapping.',
    },
    { name: 'input-number-web-precision', title: 'Precision', blurb: 'Decimal rounding.' },
    {
      name: 'input-number-web-format',
      title: 'Format / parse',
      blurb: 'Display formatting + parse back to number.',
    },
    {
      name: 'input-number-web-layout',
      title: 'Button placement / sizes',
      blurb:
        'buttonPlacement: left / both / right; buttonMode: symbol (− +) / spinner (↑ ↓); five sizes.',
    },
    {
      name: 'input-number-web-states',
      title: 'Disabled / readonly / clearable',
      blurb: 'disabled / readonly / clearable.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | null',
        default: 'null',
        desc: 'Bound numeric value; `null` represents an empty field.',
      },
      {
        name: 'min',
        type: 'number',
        default: '—',
        desc: 'Lower bound. Out-of-range commits are clamped.',
      },
      {
        name: 'max',
        type: 'number',
        default: '—',
        desc: 'Upper bound. Out-of-range commits are clamped.',
      },
      {
        name: 'step',
        type: 'number',
        default: '1',
        desc: 'Step size for buttons / ArrowUp / ArrowDown.',
      },
      {
        name: 'precision',
        type: 'number',
        default: '—',
        desc: 'Decimal places forced on committed values (0–100).',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction (input, buttons, clear).',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — value visible, not editable.',
      },
      { name: 'placeholder', type: 'string', default: "''", desc: 'Placeholder text.' },
      {
        name: 'stepStrictly',
        type: 'boolean',
        default: 'false',
        desc: 'Require committed values to be integer multiples of `step`.',
      },
      {
        name: 'showButton',
        type: 'boolean',
        default: 'true',
        desc: 'Render the + / − stepper buttons.',
      },
      {
        name: 'buttonPlacement',
        type: "'left' | 'both' | 'right'",
        default: "'right'",
        desc: 'Where the stepper buttons are placed.',
      },
      {
        name: 'buttonMode',
        type: "'symbol' | 'spinner'",
        default: "'symbol'",
        desc: "Stepper glyph family — the two are mutually exclusive by design: `'symbol'` renders − / + buttons, `'spinner'` renders one ↑ / ↓ plate.",
      },
      {
        name: 'buttonBackground',
        type: 'string',
        default: '—',
        desc: 'Stepper button background — any CSS background value.',
      },
      {
        name: 'buttonHoverBackground',
        type: 'string',
        default: '—',
        desc: 'Stepper button hover background (painted in the `both` placement only).',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Show the clear (×) button when a value is present.',
      },
      {
        name: 'format',
        type: '(value: number) => string | number',
        default: '—',
        desc: 'Custom display formatter, e.g. to render the value as a percentage.',
      },
      {
        name: 'parse',
        type: '(input: string) => number | null',
        default: '—',
        desc: "Reverse of `format`; parses the user's text back into a number.",
      },
      {
        name: 'validator',
        type: '(value: number) => boolean',
        default: '—',
        desc: 'Custom validator; returning `false` rejects the commit.',
      },
      {
        name: 'border',
        type: "'all' | 'bottom' | 'none'",
        default: "'all'",
        desc: 'Border preset (see SnInput).',
      },
      { name: 'bordered', type: 'boolean', default: 'true', desc: 'bordered' },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Native ARIA label.' },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnInputNumber.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(number | null)',
        desc: '`v-model` sync; emits the current value when it changes.',
      },
      {
        name: 'change',
        payload: '(number | null)',
        desc: 'Fired when a committed value differs from the previous one.',
      },
      {
        name: 'input',
        payload: '(number | null)',
        desc: 'Emits the current value while the user types.',
      },
      { name: 'focus', payload: 'FocusEvent', desc: 'Fired when the input gains focus.' },
      { name: 'blur', payload: 'FocusEvent', desc: 'Fired when the input loses focus.' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnInputNumber.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      { name: 'prefix', props: '—', desc: "Custom content in the input's prefix area." },
      { name: 'suffix', props: '—', desc: "Custom content in the input's suffix area." },
      {
        name: 'minus-icon',
        props: '—',
        desc: 'Custom decrement glyph replacing the default − icon.',
      },
      {
        name: 'plus-icon',
        props: '—',
        desc: 'Custom increment glyph replacing the default + icon.',
      },
      {
        name: 'up-icon',
        props: '—',
        desc: 'Custom upper half of the ↑/↓ spinner, replacing the default ↑ chevron.',
      },
      {
        name: 'down-icon',
        props: '—',
        desc: 'Custom lower half of the ↑/↓ spinner, replacing the default ↓ chevron.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'InputNumber · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { InputNumber } from '@snui/vue-web';",
    chipCopy: "import { InputNumber } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'InputNumber', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'input', link: '/en/components/web/input' },
    next: { text: 'auto-complete', link: '/en/components/web/auto-complete' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
