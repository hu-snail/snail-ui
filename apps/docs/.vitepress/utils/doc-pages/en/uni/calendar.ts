/** Calendar · uni-app (uni-app) — English page data. Props from sn-calendar.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const calendarDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Calendar · uni-app' },
  ],
  title: 'Calendar · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Sheet calendar: rolling only updates the draft and ' },
    { t: 'code', s: 'v-model' },
    { t: 'text', s: ' is written on confirm; cancel discards the draft. The entry row uses the ' },
    { t: 'code', s: 'sn-cell' },
    { t: 'text', s: ' card form and shows the confirmed value on the right.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-calendar',
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
    fileLabel: 'Calendar · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Calendar } from '@snui/uni';
</script>

<template>
  <sn-calendar />
</template>`,
  },
  demos: [
    { name: 'calendar-mp-basic', title: 'Basic usage', blurb: 'Basic usage' },
    {
      name: 'calendar-mp-card',
      title: 'Card entries (cells card pattern)',
      blurb: 'Card entries (cells card pattern)',
    },
    {
      name: 'calendar-mp-first-day-of-week',
      title: 'First day of week (firstDayOfWeek)',
      blurb: 'First day of week (firstDayOfWeek)',
    },
    {
      name: 'calendar-mp-formatter',
      title: 'Cell formatting (formatter)',
      blurb: 'Cell formatting (formatter)',
    },
    {
      name: 'calendar-mp-range-constraints',
      title: 'Range constraints (maxRange / allowSameDay / defaultTime)',
      blurb: 'Range constraints (maxRange / allowSameDay / defaultTime)',
    },
    {
      name: 'calendar-mp-header',
      title: 'Sheet header slot (`header`, AUI-added)',
      blurb: 'Sheet header slot (`header`, AUI-added)',
    },
    {
      name: 'calendar-mp-shortcuts-events',
      title: 'Shortcut callback & confirm veto (onShortcutsClick / beforeConfirm)',
      blurb: 'Shortcut callback & confirm veto (onShortcutsClick / beforeConfirm)',
    },
    {
      name: 'calendar-mp-declared-props',
      title: 'Declared parity props (timeFilter / hideSecond etc.)',
      blurb: 'Declared parity props (timeFilter / hideSecond etc.)',
    },
    {
      name: 'calendar-mp-lunar',
      title: 'Lunar captions (`showLunar`, AUI-added)',
      blurb: 'Lunar captions (`showLunar`, AUI-added)',
    },
    {
      name: 'calendar-mp-panel',
      title: 'Panel size & switching (panelHeight / switchMode)',
      blurb: 'Panel size & switching (panelHeight / switchMode)',
    },
    {
      name: 'calendar-mp-immediate-change',
      title: 'Immediate write-back (immediateChange)',
      blurb: 'Immediate write-back (immediateChange)',
    },
    {
      name: 'calendar-mp-sheet-chrome',
      title: 'Sheet chrome & footer slot',
      blurb: 'Sheet chrome & footer slot',
    },
    {
      name: 'calendar-mp-shortcuts-range',
      title: 'Shortcuts & range (`shortcuts` / `type`)',
      blurb: 'Shortcuts & range (`shortcuts` / `type`)',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'CalendarValue', default: 'null', desc: 'Selected value.' },
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Sheet visibility (`v-model:visible`).',
      },
      { name: 'type', type: 'CalendarType', default: "'date'", desc: 'Selection mode.' },
      {
        name: 'minDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Minimum date (timestamp).',
      },
      {
        name: 'maxDate',
        type: 'number | undefined',
        default: 'undefined',
        desc: 'Maximum date (timestamp).',
      },
      { name: 'firstDayOfWeek', type: 'number', default: '0', desc: 'First weekday of the grid.' },
      {
        name: 'formatter',
        type: 'CalendarFormatter | undefined',
        default: 'undefined',
        desc: 'Cell formatter hook.',
      },
      {
        name: 'maxRange',
        type: 'number',
        default: '0',
        desc: 'Maximum span for range types (days). `0` = unconstrained.',
      },
      {
        name: 'rangePrompt',
        type: 'string',
        default: "''",
        desc: 'Message shown when `maxRange` is exceeded.',
      },
      {
        name: 'allowSameDay',
        type: 'boolean',
        default: 'false',
        desc: 'Allow a zero-length range.',
      },
      {
        name: 'defaultTime',
        type: 'string | string[]',
        default: "'00:00:00'",
        desc: 'Default clock time applied to date / datetime values.',
      },
      { name: 'title', type: 'string', default: "'选择日期'", desc: 'Toolbar title.' },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the mask closes the sheet.',
      },
      { name: 'zIndex', type: 'number', default: '15', desc: 'Stacking level.' },
      { name: 'showConfirm', type: 'boolean', default: 'true', desc: 'Render the confirm button.' },
      { name: 'confirmText', type: 'string', default: "'确定'", desc: 'Confirm button label.' },
      {
        name: 'shortcuts',
        type: 'CalendarShortcut[]',
        default: '() => []',
        desc: 'Preset chips shown above the grid.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the sheet for the device safe area.',
      },
      {
        name: 'customViewClass',
        type: 'string',
        default: "''",
        desc: 'Class forwarded to the panel body.',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Emit `change` as soon as a cell is tapped.',
      },
      {
        name: 'panelHeight',
        type: 'number',
        default: '316',
        desc: 'Scrollable panel height in px design units.',
      },
      {
        name: 'showPanelTitle',
        type: 'boolean',
        default: 'true',
        desc: 'Render the per-month panel title.',
      },
      {
        name: 'switchMode',
        type: "'none' | 'month' | 'year-month'",
        default: "'none'",
        desc: 'Month-switch mode.',
      },
      { name: 'duration', type: 'number', default: '200', desc: 'Sheet animation duration in ms.' },
      {
        name: 'timeFilter',
        type: 'CalendarTimeFilter | undefined',
        default: 'undefined',
        desc: 'Time-option filter hook (datetime / datetimerange).',
      },
      {
        name: 'hideSecond',
        type: 'boolean',
        default: 'false',
        desc: 'Hide the seconds roller (datetime / datetimerange).',
      },
      { name: 'ellipsis', type: 'boolean', default: 'false', desc: 'Ellipsis the range text.' },
      {
        name: 'showTypeSwitch',
        type: 'boolean',
        default: 'true',
        desc: 'Show the day / week / month switch.',
      },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: 'Teleport the sheet out of the page flow (no portal host on MP).',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the sheet.' },
      {
        name: 'showLunar',
        type: 'boolean',
        default: 'false',
        desc: '农历角标（additive，AGENTS.md §112.3a）：转发给 `sn-calendar-view`， 格子下方显示农历日名，初一显示月名。`formatter` 可覆盖。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Calendar · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Calendar } from '@snui/uni';",
    chipCopy: "import { Calendar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-calendar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-cascader', link: '/en/components/uni/cascader' },
    next: { text: 'sn-calendar-view', link: '/en/components/uni/calendar-view' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
