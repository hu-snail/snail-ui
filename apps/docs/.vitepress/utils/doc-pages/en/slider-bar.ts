/** SliderBar (Web) — English page data. Props from slider-bar SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const sliderBarDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'SliderBar' }],
  title: 'SliderBar',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'outline: false' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/slider-bar',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'SliderBar.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { SliderBar } from '@snui/vue-web';
</script>

<template>
  <SliderBar />
</template>`,
  },
  demos: [
    {
      name: 'slider-bar-web-aurora',
      title: 'Aurora gradient',
      blurb: 'theme="aurora": purple-blue gradient fill, drifting star particles, round thumb.',
    },
    {
      name: 'slider-bar-web-column',
      title: 'Vertical (column)',
      blurb: 'variant="column" — the read-out merges into the track top.',
    },
    {
      name: 'slider-bar-web-range',
      title: 'Range (dual handles)',
      blurb: 'Price range with non-crossing handles and a custom formatValue read-out.',
    },
    {
      name: 'slider-bar-web-states',
      title: 'Disabled & reverse',
      blurb: 'disabled blocks all interaction; reverse flips the axis.',
    },
    {
      name: 'slider-bar-web-levels',
      title: 'Levels',
      blurb: 'levels maps the value onto discrete steps; ticks follow the range.',
    },
    {
      name: 'slider-bar-web-icons',
      title: 'Edge icons',
      blurb: 'leading-icon / trailing-icon semantic glyphs at both ends.',
    },
    {
      name: 'slider-bar-web-readout',
      title: 'Read-out formats',
      blurb: 'percent / value + valueSuffix / formatValue, plus tooltip and placement.',
    },
    {
      name: 'slider-bar-web-shape',
      title: 'Shape & thickness',
      blurb: 'radius × thickness combos: square 4px, token default, full capsule, thin bar.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SliderValue',
        default: '—',
        desc: 'Bound value. `[number, number]` when `range`.',
      },
      {
        name: 'defaultValue',
        type: 'SliderValue',
        default: '—',
        desc: 'Uncontrolled initial value.',
      },
      { name: 'min', type: 'number', default: '0', desc: 'Lower bound.' },
      { name: 'max', type: 'number', default: '100', desc: 'Upper bound.' },
      { name: 'step', type: 'number', default: '1', desc: 'Step increment (pointer + keyboard).' },
      {
        name: 'range',
        type: 'boolean',
        default: 'false',
        desc: 'Dual-handle mode; handles never cross.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disable interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Value visible but not editable.',
      },
      {
        name: 'reverse',
        type: 'boolean',
        default: 'false',
        desc: 'Invert the axis (RTL / bottom-up).',
      },
      {
        name: 'variant',
        type: 'BarVariant',
        default: "'bar'",
        desc: '`bar` horizontal capsule, `column` vertical strip.',
      },
      {
        name: 'theme',
        type: "'default' | 'aurora'",
        default: "'default'",
        desc: 'Visual theme. `aurora` paints the fill with a gradient, overlays a drifting star field and swaps in a large round thumb (hero / media scrubber look). `bar` / `column` keep the neutral flat surface.',
      },
      {
        name: 'gradient',
        type: 'string',
        default: '—',
        desc: 'Aurora fill gradient — any CSS `background` value.',
      },
      {
        name: 'sparkles',
        type: 'number',
        default: '—',
        desc: 'Aurora star-field density (0 = off).',
      },
      {
        name: 'animated',
        type: 'boolean',
        default: 'true',
        desc: 'Disable the aurora drift / twinkle animation.',
      },
      {
        name: 'showValue',
        type: 'boolean',
        default: 'false',
        desc: 'Show the inline read-out inside the bar.',
      },
      {
        name: 'iconPlacement',
        type: "'leading' | 'inside' | 'trailing'",
        default: "'inside'",
        desc: 'Where the `#icon` slot renders: `leading` (before the track, outside the fill) or `inside` (painted onto the fill so it rides the value).',
      },
      {
        name: 'label',
        type: 'string',
        default: '—',
        desc: 'Caption text painted INSIDE the bar at the leading edge.',
      },
      {
        name: 'suffix',
        type: 'string',
        default: '—',
        desc: 'Caption text painted INSIDE the bar at the trailing edge.',
      },
      {
        name: 'innerColor',
        type: 'string',
        default: '—',
        desc: 'Colour of the in-track text / glyph while the bar HAS a value. `aurora` defaults to white; the gradient is painted behind it.',
      },
      {
        name: 'innerColorEmpty',
        type: 'string',
        default: '—',
        desc: 'Colour of the in-track text / glyph at value 0 (the "empty" hint).',
      },
      {
        name: 'leadingIcon',
        type: 'string',
        default: '—',
        desc: 'Leading glyph painted inside the head of the track.',
      },
      {
        name: 'trailingIcon',
        type: 'string',
        default: '—',
        desc: 'Trailing glyph painted inside the tail of the track.',
      },
      {
        name: 'levels',
        type: 'Array<{ value: number; label: string; icon?: string }>',
        default: '—',
        desc: 'Discrete levels; the bar reads the active level instead of a percentage.',
      },
      {
        name: 'showLevels',
        type: 'boolean',
        default: 'true',
        desc: 'Draw a tick per level on the track.',
      },
      {
        name: 'levelThreshold',
        type: 'number',
        default: '0.5',
        desc: 'Minimum levels before a value may switch to the next level (hysteresis).',
      },
      {
        name: 'format',
        type: 'BarFormat',
        default: "'percent'",
        desc: 'Caption source: `percent` (default) or the raw value.',
      },
      {
        name: 'formatValue',
        type: '(value: number, percent: number) => string',
        default: '—',
        desc: 'Fully custom caption text (wins over `format`).',
      },
      {
        name: 'valueSuffix',
        type: 'string',
        default: "'%'",
        desc: 'Suffix appended to the default caption (`%` by default).',
      },
      { name: 'tooltip', type: 'boolean', default: 'true', desc: 'Show the drag bubble.' },
      {
        name: 'formatTooltip',
        type: '(value: number) => string | number',
        default: '—',
        desc: 'Formats the drag tooltip content.',
      },
      {
        name: 'placement',
        type: 'string',
        default: "'top'",
        desc: 'Bubble placement, 12 positions (horizontal) or left / right (column).',
      },
      {
        name: 'fillBackground',
        type: 'string',
        default: '—',
        desc: 'Fill background — any CSS background (solid / gradient / transparent).',
      },
      {
        name: 'barBackground',
        type: 'string',
        default: '—',
        desc: 'Bar background — any CSS background (solid / gradient / transparent).',
      },
      {
        name: 'thickness',
        type: 'number | string',
        default: '—',
        desc: 'Bar thickness in px (horizontal: height, column: width).',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Size tier — a shortcut for the thickness / radius scale, mirroring the button sizes: small 28 / medium 40 / large 52 (px).',
      },
      {
        name: 'height',
        type: 'string | number',
        default: '—',
        desc: 'Explicit height — any CSS length. Horizontal bars use it as the whole control height (track + caption row); the column variant uses it as the strip height.',
      },
      {
        name: 'radius',
        type: 'string',
        default: '—',
        desc: 'Bar corner radius — any CSS length (defaults to the radius token).',
      },
      {
        name: 'fade',
        type: 'boolean',
        default: 'true',
        desc: 'Column variant: fade the unfilled part away from the fill edge.',
      },
      {
        name: 'tooltipOnly',
        type: 'boolean',
        default: 'false',
        desc: 'Column variant: hide the caption and read the value from the tooltip.',
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Accessible name.' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnSliderBar.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: number | [number, number])',
        desc: '`v-model` sync: fired on every value change.',
      },
      {
        name: 'change',
        payload: '(value: number | [number, number])',
        desc: 'Fired on a committed change (drag end / keyboard commit / input commit).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnSliderBar.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'tooltip',
        props: '{ value: number }',
        desc: 'Custom tooltip content; the scope exposes the current handle value.',
      },
      {
        name: 'icon',
        props: '—',
        desc: 'Leading glyph inside the bar; opt-in, nothing renders by default.',
      },
      {
        name: 'start',
        props: '—',
        desc: 'Custom head glyph beside the track (overrides `leadingIcon`).',
      },
      { name: 'end', props: '—', desc: 'Custom tail glyph beside the track.' },
      {
        name: 'value',
        props:
          '{ value: number; level: string; levelIndex: number; percent: number; min: number; max: number; index: number; range: boolean }',
        desc: 'Inline read-out content; defaults to the formatted caption.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'SliderBar ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { SliderBar } from '@snui/vue-web';",
    chipCopy: "import { SliderBar } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SliderBar', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'slider', link: '/en/components/web/slider' },
    next: { text: 'rate', link: '/en/components/web/rate' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
