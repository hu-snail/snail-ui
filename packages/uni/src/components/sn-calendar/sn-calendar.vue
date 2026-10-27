<script setup lang="ts">
/**
 * sn-calendar (uni-end) — calendar sheet built on sn-calendar-view.
 *
 * Reference library: wot-ui `wd-calendar`
 *   (https://wot-ui.cn/component/calendar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-calendar 1:1 except
 * for the documented omissions. Anything new added here MUST also be added to
 * the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-calendar/sn-calendar.vue
 * → auto-registered as `<sn-calendar>` in any .vue that uses it.
 *
 * ## Documented divergences (CONTRIBUTING §9)
 *
 *   - `week` / `weekrange` types are not offered (see `sn-calendar-view`).
 *   - `inner-display-format`, `ellipsis`, `show-type-switch`,
 *     `time-filter`, `hide-second`, `on-shortcuts-click`, `root-portal` ARE
 *     declared so a wd-calendar config type-checks unchanged, but this build
 *     has no time roller and no portal host, so they have no rendering effect
 *     yet. `shortcuts` itself IS implemented (a row of chips that writes a
 *     preset value) and `on-shortcuts-click` is invoked after a chip tap.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 月份网格本体 — 用 sn-calendar-view
 *   - 弹层定位 / 动画 — 用 sn-popup
 */

import { computed, ref, watch } from 'vue';
import SnPopup from '../sn-popup/sn-popup.vue';
import SnCalendarView from '../sn-calendar-view/sn-calendar-view.vue';
import type {
  CalendarFormatter,
  CalendarTimeFilter,
  CalendarType,
  CalendarValue,
} from '../sn-calendar-view/sn-calendar-view-types';

defineOptions({ name: 'SnCalendar' });

/** One shortcut chip. */
interface CalendarShortcut {
  /** Visible label. */
  text: string;
  /** Value written when the chip is tapped. */
  value?: CalendarValue;
  /** Relative day offset helper (`-7` = one week ago). */
  days?: number;
}

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-calendar` 1:1 surface ────────────────────────────────── */

    /** Selected value. */
    modelValue?: CalendarValue;
    /** Sheet visibility (`v-model:visible`). */
    visible?: boolean;
    /** Selection mode. */
    type?: CalendarType;
    /** Minimum date (timestamp). */
    minDate?: number | undefined;
    /** Maximum date (timestamp). */
    maxDate?: number | undefined;
    /** First weekday of the grid. */
    firstDayOfWeek?: number;
    /** Cell formatter hook. */
    formatter?: CalendarFormatter | undefined;
    /** Maximum span for range types (days). `0` = unconstrained. */
    maxRange?: number;
    /** Message shown when `maxRange` is exceeded. */
    rangePrompt?: string;
    /** Allow a zero-length range. */
    allowSameDay?: boolean;
    /** Default clock time applied to date / datetime values. */
    defaultTime?: string | string[];
    /** Toolbar title. */
    title?: string;
    /** Tapping the mask closes the sheet. */
    closeOnClickModal?: boolean;
    /** Stacking level. */
    zIndex?: number;
    /** Render the confirm button. */
    showConfirm?: boolean;
    /** Confirm button label. */
    confirmText?: string;
    /** Preset chips shown above the grid. */
    shortcuts?: CalendarShortcut[];
    /** Pad the sheet for the device safe area. */
    safeAreaInsetBottom?: boolean;
    /** Veto hook for confirm. */
    beforeConfirm?: ((value: CalendarValue) => boolean | Promise<boolean>) | undefined;
    /** Class forwarded to the panel body. */
    customViewClass?: string;
    /** Emit `change` as soon as a cell is tapped. */
    immediateChange?: boolean;
    /** Scrollable panel height in px design units. */
    panelHeight?: number;
    /** Render the per-month panel title. */
    showPanelTitle?: boolean;
    /** Month-switch mode. */
    switchMode?: 'none' | 'month' | 'year-month';
    /** Sheet animation duration in ms. */
    duration?: number;
    /*
     * Parity-only props: declared so a wd-calendar config type-checks
     * unchanged. This build has no time roller and no portal host, so the
     * visual ones are inert; `onShortcutsClick` IS invoked (see
     * `onShortcutTap`).
     */
    /** Time-option filter hook (datetime / datetimerange). */
    timeFilter?: CalendarTimeFilter | undefined;
    /** Hide the seconds roller (datetime / datetimerange). */
    hideSecond?: boolean;
    /** Custom range-panel echo: fixed text, or a formatter of the value. */
    innerDisplayFormat?: string | ((value: CalendarValue) => string);
    /** Ellipsis the range text. */
    ellipsis?: boolean;
    /** Show the day / week / month switch. */
    showTypeSwitch?: boolean;
    /** Called after a shortcut chip writes its value. */
    onShortcutsClick?: ((shortcut: CalendarShortcut) => void) | undefined;
    /** Teleport the sheet out of the page flow (no portal host on MP). */
    rootPortal?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the sheet. */
    customStyle?: string;
  }>(),
  {
    modelValue: null,
    visible: false,
    type: 'date',
    minDate: undefined,
    maxDate: undefined,
    firstDayOfWeek: 0,
    formatter: undefined,
    maxRange: 0,
    rangePrompt: '',
    allowSameDay: false,
    defaultTime: '00:00:00',
    title: '选择日期',
    closeOnClickModal: true,
    zIndex: 15,
    showConfirm: true,
    confirmText: '确定',
    shortcuts: () => [],
    safeAreaInsetBottom: true,
    beforeConfirm: undefined,
    customViewClass: '',
    immediateChange: false,
    panelHeight: 316,
    showPanelTitle: true,
    switchMode: 'none',
    duration: 200,
    customClass: '',
    customStyle: '',
    timeFilter: undefined,
    hideSecond: false,
    innerDisplayFormat: '',
    ellipsis: false,
    showTypeSwitch: true,
    onShortcutsClick: undefined,
    rootPortal: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: CalendarValue): void;
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', payload: { value: CalendarValue }): void;
  (e: 'change', payload: { value: CalendarValue }): void;
  (e: 'cancel'): void;
  (e: 'open'): void;
}>();

/** Draft value while the sheet is open. */
const draft = ref<CalendarValue>(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    if (props.immediateChange) return;
    draft.value = value;
  },
  { deep: true },
);

watch(
  () => props.visible,
  (value) => {
    if (!value) return;
    draft.value = props.modelValue;
    emit('open');
  },
);

const viewValue = computed<CalendarValue>(() =>
  props.immediateChange ? props.modelValue : draft.value,
);

function onViewChange(payload: { value: CalendarValue }): void {
  if (props.immediateChange) emit('update:modelValue', payload.value);
  else draft.value = payload.value;
  emit('change', payload);
}

function requestClose(): void {
  emit('update:visible', false);
}

function onCancel(): void {
  // Drop the draft so reopening starts from the committed model.
  draft.value = props.modelValue;
  emit('cancel');
  requestClose();
}

async function onConfirm(): Promise<void> {
  const value = viewValue.value;
  if (props.beforeConfirm) {
    const verdict = await props.beforeConfirm(value);
    if (verdict === false) return;
  }
  if (!props.immediateChange) emit('update:modelValue', value);
  emit('confirm', { value });
  requestClose();
}

/* ── Shortcuts ─────────────────────────────────────────────────────────── */

/** Resolve a shortcut chip to a concrete value. */
function shortcutValue(shortcut: CalendarShortcut): CalendarValue {
  let stamp: number;
  if (typeof shortcut.value === 'number') {
    stamp = shortcut.value;
  } else {
    const offset = shortcut.days ?? 0;
    const target = new Date();
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + offset);
    stamp = target.getTime();
  }
  // Reshape into the value the declared `type` expects (AGENTS.md §27).
  if (props.type === 'daterange' || props.type === 'datetimerange' || props.type === 'monthrange') {
    return [stamp, stamp];
  }
  if (props.type === 'dates') return [stamp];
  return stamp;
}

function onShortcutTap(shortcut: CalendarShortcut): void {
  draft.value = shortcutValue(shortcut);
  if (props.immediateChange) emit('update:modelValue', draft.value);
  // wd-calendar parity: the hook fires after the chip wrote its value, so the
  // host can react (close the sheet, log, prefill a range…) without a watcher.
  props.onShortcutsClick?.(shortcut);
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const popupClass = computed(() =>
  ['sn-calendar-popup', props.customClass].filter(Boolean).join(' '),
);

/** Forwarded to sn-popup — a string, so `exactOptionalPropertyTypes` stays happy. */
const rootStyle = computed(() => props.customStyle);

const viewClass = computed(() => props.customViewClass);
</script>

<template>
  <SnPopup
    :model-value="props.visible"
    position="bottom"
    round
    :z-index="props.zIndex"
    :duration="props.duration"
    :close-on-click-modal="props.closeOnClickModal"
    :safe-area-inset-bottom="props.safeAreaInsetBottom"
    :custom-class="popupClass"
    :custom-style="rootStyle"
    :root-portal="props.rootPortal"
    @update:model-value="emit('update:visible', $event)"
  >
    <view class="sn-calendar" :data-snui-component="'calendar'">
      <view class="sn-calendar__header">
        <text class="sn-calendar__title">{{ props.title }}</text>
      </view>

      <view v-if="props.shortcuts.length > 0" class="sn-calendar__shortcuts">
        <view
          v-for="shortcut in props.shortcuts"
          :key="shortcut.text"
          class="sn-calendar__shortcut"
          role="button"
          :aria-label="shortcut.text"
          @tap="onShortcutTap(shortcut)"
          ><text>{{ shortcut.text }}</text></view
        >
      </view>

      <SnCalendarView
        :class="viewClass"
        :model-value="viewValue"
        :type="props.type"
        :min-date="props.minDate"
        :max-date="props.maxDate"
        :first-day-of-week="props.firstDayOfWeek"
        :formatter="props.formatter"
        :max-range="props.maxRange"
        :range-prompt="props.rangePrompt"
        :allow-same-day="props.allowSameDay"
        :default-time="props.defaultTime"
        :panel-height="props.panelHeight"
        :show-panel-title="props.showPanelTitle"
        :switch-mode="props.switchMode"
        :immediate-change="props.immediateChange"
        @change="onViewChange"
      />

      <view class="sn-calendar__footer">
        <view class="sn-calendar__footer-left">
          <slot name="confirm-left" />
        </view>
        <view class="sn-calendar__actions">
          <view class="sn-calendar__cancel" role="button" aria-label="cancel" @tap="onCancel"
            ><text>取消</text></view
          >
          <view
            v-if="props.showConfirm"
            class="sn-calendar__confirm"
            role="button"
            :aria-label="props.confirmText"
            @tap="onConfirm"
            ><text>{{ props.confirmText }}</text></view
          >
        </view>
        <view class="sn-calendar__footer-right">
          <slot name="confirm-right" />
        </view>
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-calendar {
  display: block;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-calendar__header {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88rpx;
  padding: 0 var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-calendar__title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-calendar__shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
}

.sn-calendar__shortcut {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-calendar__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-calendar__footer-left,
.sn-calendar__footer-right {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.sn-calendar__actions {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  margin-left: auto;
}

.sn-calendar__cancel,
.sn-calendar__confirm {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-md);
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-secondary);
}

.sn-calendar__confirm {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

/* Doodle skin — hand-drawn header rule. */
.snui-skin-doodle .sn-calendar__header {
  border-bottom-width: 4rpx;
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
