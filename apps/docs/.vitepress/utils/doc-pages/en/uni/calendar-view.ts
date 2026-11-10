/** CalendarView · uni-app (uni-app) — English page data. Props from sn-calendar-view.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const calendarViewDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'CalendarView · uni-app' },
  ],
  title: 'CalendarView · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Flat month grid: minDate / maxDate bound the month range; tapping a day writes its timestamp back.',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-calendar-view',
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
    fileLabel: 'CalendarView · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { CalendarView } from '@snui/uni';
</script>

<template>
  <sn-calendar-view />
</template>`,
  },
  demos: [
    {
      name: 'calendar-view-mp-basic',
      title: 'Basic usage',
      blurb:
        'Flat month grid: minDate / maxDate bound the month range; tapping a day writes its timestamp back.',
    },
    {
      name: 'calendar-view-mp-range',
      title: 'Range selection (type="daterange")',
      blurb:
        '`type=daterange` selects a span; `maxRange` caps it and shows the prompt.',
    },
    {
      name: 'calendar-view-mp-switch-mode',
      title: 'Month / year switching (switchMode)',
      blurb: '`switchMode=month` switches to one month with prev / next controls.',
    },
    {
      name: 'calendar-view-mp-first-day-of-week',
      title: 'First day of week',
      blurb: '`firstDayOfWeek=1` starts the week on Monday.',
    },
    {
      name: 'calendar-view-mp-formatter',
      title: 'Cell formatting',
      blurb: '`formatter` captions weekends.',
    },
    {
      name: 'calendar-view-mp-panel-title',
      title: 'Panel title (showPanelTitle)',
      blurb: '`showPanelTitle=false` drops the month caption so only the grid remains.',
    },
    {
      name: 'calendar-view-mp-same-day',
      title: 'Same start & end day (allowSameDay)',
      blurb: '`allowSameDay` lets both range ends be the same day.',
    },
    {
      name: 'calendar-view-mp-default-time',
      title: 'Default time & immediate write-back',
      blurb:
        '`defaultTime` sets the clock time written back; `immediateChange` fires on tap.',
    },
    {
      name: 'calendar-view-mp-time-props',
      title: 'Declared time-column props',
      blurb:
        '`timeFilter` / `timeItemHeight` / `timeVisibleItemCount` / `hideSecond` exist for parity only (no time roller in this build); `customClass` / `customStyle` land on the root.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'CalendarValue',
        default: 'null',
        desc: 'Selected value — a timestamp, a timestamp list, or `null`.',
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
      {
        name: 'firstDayOfWeek',
        type: 'number',
        default: '0',
        desc: 'First weekday of the grid (0 = Sunday).',
      },
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
        desc: 'Maximum span for the range types (in days). `0` = unconstrained.',
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
        desc: 'Allow the range start and end to be the same day.',
      },
      {
        name: 'showPanelTitle',
        type: 'boolean',
        default: 'true',
        desc: 'Render the per-month panel title.',
      },
      {
        name: 'defaultTime',
        type: 'string | string[]',
        default: "'00:00:00'",
        desc: 'Default clock time applied to date / datetime values.',
      },
      {
        name: 'panelHeight',
        type: 'number',
        default: '316',
        desc: 'Scrollable panel height in px design units.',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: 'Emit `change` as soon as a cell is tapped.',
      },
      {
        name: 'switchMode',
        type: "'none' | 'month' | 'year-month'",
        default: "'none'",
        desc: 'Month-switch mode. `none` renders every month flat.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
      {
        name: 'timeFilter',
        type: 'CalendarTimeFilter | undefined',
        default: 'undefined',
        desc: 'Time-column filter hook (`wd-calendar-view` `time-filter`). Declared for parity; this build renders no time roller, so the hook is never invoked. Documented as 「未实现」.',
      },
      {
        name: 'timeItemHeight',
        type: 'number',
        default: '44',
        desc: 'Time row height (`wd-calendar-view` `time-item-height`). Declared for parity.',
      },
      {
        name: 'timeVisibleItemCount',
        type: 'number',
        default: '6',
        desc: 'Visible time rows (`wd-calendar-view` `time-visible-item-count`). Declared for parity.',
      },
      {
        name: 'hideSecond',
        type: 'boolean',
        default: 'false',
        desc: 'Hide the seconds column (`wd-calendar-view` `hide-second`). Declared for parity.',
      },
      {
        name: 'showLunar',
        type: 'boolean',
        default: 'false',
        desc: '农历角标（additive，AGENTS.md §112.3a）：在格子下方显示农历日名 （初二、十五…），初一显示月名（正月 / 闰六月）。`formatter` 的 `bottomInfo` 优先级更高，可覆盖农历文案。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'CalendarView · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { CalendarView } from '@snui/uni';",
    chipCopy: "import { CalendarView } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-calendar-view', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-calendar', link: '/en/components/uni/calendar' },
    next: { text: 'sn-date-strip', link: '/en/components/uni/date-strip' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
