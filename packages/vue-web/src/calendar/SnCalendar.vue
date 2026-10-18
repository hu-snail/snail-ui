<script setup lang="ts">
/**
 * SnCalendar — web-end month calendar panel (AUI-WEB-DD-001).
 *
 * Reference library: naive-ui `n-calendar`
 *   (https://www.naiveui.com/zh-CN/light/components/calendar)
 * Per AGENTS.md §112, props + semantics mirror n-calendar 1:1 (fetched
 * from naive-ui main `src/calendar/src/Calendar.tsx`):
 *   value / defaultValue (v-model:value, millisecond timestamps) /
 *   isDateDisabled(ts) / on-panel-change({ year, month }); slots:
 *   default ({ year, month, date }) + header ({ year, month }).
 *
 * Documented divergences (not §112 violations):
 *   - Weeks are Monday-first with fixed zh-CN labels ('周一'…'周日') shown
 *     inside the first row (the reference derives both from its i18n
 *     locale system; its zh-CN locale value anchors the grid Monday-first
 *     through the `dateArray` walk-back semantics).
 *   - Header title uses the numeric 'yyyy年M月' format (the reference
 *     formats the month name from its date locale).
 *   - The prev / 今天 / next action group is rendered as internal joined
 *     buttons with inline SVG chevrons (the reference composes
 *     NButtonGroup + NButton). There is no actions slot in the reference
 *     source either.
 *   - Grid length follows the reference `strip` behavior: 28 / 35 / 42
 *     cells depending on the month (a Monday-starting 28-day month is
 *     4 rows, not always 6).
 *   - Cells expose aria-selected / aria-disabled and the buttons carry
 *     aria-labels (the reference ships no ARIA attributes).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnCalendar v-model:value="ts" />
 *   <SnCalendar #="{ year, month, date }">{{ year }}-{{ month }}-{{ date }}</SnCalendar>
 *   <SnCalendar :is-date-disabled="(ts) => ts < Date.now()" @panel-change="onPanelChange" />
 */

import { computed, ref } from 'vue'
import {
  buildCalendarCells,
  panelInfoOf,
  startOfMonth,
  addMonths,
} from './date-grid'
import type { SnCalendarCell, SnCalendarDateItem } from './date-grid'

defineOptions({ name: 'SnCalendar' })

const props = withDefaults(
  defineProps<{
    /** Selected date (millisecond timestamp), v-model:value. Mirrors n-calendar `value`. */
    value?: number | null | undefined
    /** Uncontrolled initial selection (millisecond timestamp); also anchors the first panel month. Mirrors n-calendar `defaultValue`. */
    defaultValue?: number | null | undefined
    /** Return true to disable the date (receives the cell's local-midnight timestamp). Mirrors n-calendar `isDateDisabled`. */
    isDateDisabled?: ((date: number) => boolean | undefined) | undefined
  }>(),
  {
    value: undefined,
    defaultValue: null,
    isDateDisabled: undefined,
  },
)

const emit = defineEmits<{
  /** Selection changed: (timestamp, { year, month: 1-based, date }). Mirrors n-calendar `on-update:value`. */
  (e: 'update:value', value: number, time: SnCalendarDateItem): void
  /** Panel year/month switched. Mirrors n-calendar `on-panel-change` (month is 1-based). */
  (e: 'panel-change', info: { year: number; month: number }): void
}>()

defineSlots<{
  /** Custom content under the day number, per cell. Mirrors n-calendar `default`. */
  default?(props: { year: number; month: number; date: number }): unknown
  /** Custom header title. Mirrors n-calendar `header`. */
  header?(props: { year: number; month: number }): unknown
}>()

// Captured once at setup, exactly like the reference (`const now = Date.now()`).
const now = Date.now()

const uncontrolledValue = ref<number | null>(props.defaultValue ?? null)
const mergedValue = computed(() =>
  props.value !== undefined ? props.value : uncontrolledValue.value,
)

const monthTs = ref(startOfMonth(props.defaultValue ?? now))

const viewCells = computed(() =>
  buildCalendarCells(monthTs.value, mergedValue.value, now, props.isDateDisabled),
)

const panelYear = computed(() => panelInfoOf(monthTs.value).year)
const panelMonth = computed(() => panelInfoOf(monthTs.value).month)

function selectCell(cell: SnCalendarCell): void {
  if (cell.disabled) return
  // The reference re-anchors the panel to the clicked date's month, and
  // reports a panel change only for out-of-month cells.
  monthTs.value = startOfMonth(cell.ts)
  if (!cell.inCurrentMonth) {
    emit('panel-change', panelInfoOf(monthTs.value))
  }
  const time: SnCalendarDateItem = { year: cell.year, month: cell.month, date: cell.date }
  uncontrolledValue.value = cell.ts
  emit('update:value', cell.ts, time)
}

function shiftMonth(delta: number): void {
  monthTs.value = addMonths(monthTs.value, delta)
  emit('panel-change', panelInfoOf(monthTs.value))
}

function goToday(): void {
  const before = panelInfoOf(monthTs.value)
  monthTs.value = startOfMonth(now)
  const after = panelInfoOf(monthTs.value)
  // The reference fires onPanelChange only when the month actually changes.
  if (before.year !== after.year || before.month !== after.month) {
    emit('panel-change', after)
  }
}
</script>

<template>
  <div data-snui-component="calendar" class="sn-calendar">
    <div class="sn-calendar__header">
      <div class="sn-calendar__title">
        <slot name="header" :year="panelYear" :month="panelMonth">
          {{ panelYear }}年{{ panelMonth }}月
        </slot>
      </div>
      <div class="sn-calendar__actions">
        <button
          type="button"
          class="sn-calendar__btn sn-calendar__btn--icon"
          aria-label="上个月"
          @click="shiftMonth(-1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button type="button" class="sn-calendar__btn" @click="goToday">今天</button>
        <button
          type="button"
          class="sn-calendar__btn sn-calendar__btn--icon"
          aria-label="下个月"
          @click="shiftMonth(1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
    <div class="sn-calendar__dates" role="grid" aria-label="日历">
      <div
        v-for="(cell, index) in viewCells"
        :key="index"
        role="gridcell"
        class="sn-calendar__cell"
        :class="{
          'sn-calendar__cell--other-month': !cell.inCurrentMonth,
          'sn-calendar__cell--current': cell.isCurrentDate,
          'sn-calendar__cell--selected': cell.selected,
          'sn-calendar__cell--disabled': cell.disabled,
          'sn-calendar__cell--not-allowed': cell.disabled,
        }"
        :aria-selected="cell.selected ? 'true' : undefined"
        :aria-disabled="cell.disabled ? 'true' : undefined"
        @click="selectCell(cell)"
      >
        <div class="sn-calendar__date">
          <span class="sn-calendar__date-num" :title="cell.iso">{{ cell.date }}</span>
          <span v-if="index < 7" class="sn-calendar__date-week" :title="cell.iso">{{ cell.weekdayLabel }}</span>
        </div>
        <slot name="default" :year="cell.year" :month="cell.month" :date="cell.date" />
        <div class="sn-calendar__bar" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-calendar {
  display: flex;
  flex-direction: column;
  height: 720px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--sn-web-color-text-secondary);
}

/* ---------- Header ---------- */

.sn-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1;
  padding: 0 0 18px;
}

.sn-calendar__title {
  font-size: 22px;
  font-weight: 500;
  color: var(--sn-web-color-text-primary);
  transition: color 0.3s;
}

.sn-calendar__actions {
  display: flex;
  align-items: center;
}

/* Joined small-button group (reference renders NButtonGroup small). */
.sn-calendar__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 3px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  font-family: inherit;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s,
    color 0.3s;
}

.sn-calendar__btn:hover {
  background: var(--sn-web-color-background-subtle);
}

.sn-calendar__btn:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 1px;
}

.sn-calendar__btn--icon {
  width: 34px;
  padding: 0;
}

.sn-calendar__btn + .sn-calendar__btn {
  margin-left: -1px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.sn-calendar__btn:not(:last-child) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.sn-calendar__btn svg {
  width: 14px;
  height: 14px;
}

/* ---------- Month grid ---------- */

.sn-calendar__dates {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  flex: 1;
  border-top: 1px solid var(--sn-web-color-border-subtle);
  border-left: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 3px;
}

.sn-calendar__cell {
  box-sizing: border-box;
  position: relative;
  padding: 10px;
  border-right: 1px solid var(--sn-web-color-border-subtle);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  cursor: pointer;
  transition:
    color 0.3s,
    border-color 0.3s,
    background-color 0.3s;
}

.sn-calendar__cell:nth-child(7) {
  border-top-right-radius: 3px;
}

.sn-calendar__cell:nth-last-child(7) {
  border-bottom-left-radius: 3px;
}

.sn-calendar__cell:last-child {
  border-bottom-right-radius: 3px;
}

.sn-calendar__cell:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-calendar__cell--disabled {
  cursor: not-allowed;
}

/* ---------- Selection bar (3px bottom strip, like the reference) ---------- */

.sn-calendar__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background-color: transparent;
  transition: background-color 0.3s;
}

.sn-calendar__cell--selected .sn-calendar__bar {
  background-color: var(--sn-web-color-action-primary);
}

/* ---------- Date row ---------- */

.sn-calendar__date {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 1em;
  padding-bottom: 0.75em;
  line-height: 1;
  color: var(--sn-web-color-text-secondary);
}

.sn-calendar__date-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.8em;
  height: 1.8em;
  margin-left: -0.4em;
  border-radius: 50%;
  color: var(--sn-web-color-text-secondary);
  transition:
    color 0.3s,
    background-color 0.3s;
}

.sn-calendar__date-week {
  color: var(--sn-web-color-text-disabled);
  transition: color 0.3s;
}

/* Out-of-month and disabled cells gray out (reference shares one token). */
.sn-calendar__cell--other-month,
.sn-calendar__cell--disabled {
  color: var(--sn-web-color-text-disabled);
}

.sn-calendar__cell--other-month .sn-calendar__date-num,
.sn-calendar__cell--disabled .sn-calendar__date-num {
  color: var(--sn-web-color-text-disabled);
}

/* Today: filled circle (declared after the gray rules so it wins). */
.sn-calendar__cell--current .sn-calendar__date-num {
  color: var(--sn-web-color-text-on-primary);
  background-color: var(--sn-web-color-action-primary);
}
</style>
