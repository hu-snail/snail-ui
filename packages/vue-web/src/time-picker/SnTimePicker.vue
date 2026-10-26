<template>
  <div
    ref="rootRef"
    :class="[
      'sn-time-picker',
      `sn-time-picker--${size}`,
      {
        'sn-time-picker--disabled': disabled,
        'sn-time-picker--readonly': readonly,
        'sn-time-picker--focused': isFocused,
        'sn-time-picker--active': isPanelOpen,
        [`sn-time-picker--status-${status}`]: status !== 'default',
      },
      customClass,
    ]"
    :data-snui-component="'time-picker'"
    :data-size="size"
    :data-status="status"
    :style="wrapperStyle || undefined"
  >
    <div
      class="sn-time-picker__selection"
      role="combobox"
      :aria-expanded="isPanelOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-controls="isPanelOpen ? panelId : undefined"
      :aria-activedescendant="activeDescendant ?? undefined"
      :aria-label="ariaLabel || 'Time picker'"
      :aria-invalid="status === 'error' ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :tabindex="isInteractive ? 0 : -1"
      @mousedown="onTriggerMouseDown"
      @click="onTriggerClick"
      @keydown="onTriggerKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <span v-if="displayText !== null" class="sn-time-picker__value">{{ displayText }}</span>
      <span v-else class="sn-time-picker__placeholder">{{ placeholder }}</span>
    </div>

    <!-- Suffix area: clear button | arrow -->
    <div class="sn-time-picker__suffix">
      <button
        v-if="clearable && hasValue && isInteractive"
        type="button"
        class="sn-time-picker__clear"
        aria-label="Clear time"
        :tabindex="-1"
        @mousedown.prevent
        @click.stop="clearValue"
      >
        <SnIcon :icon="CloseIcon" :size="11" />
      </button>
      <span
        v-else
        class="sn-time-picker__arrow"
        :class="{ 'sn-time-picker__arrow--up': isPanelOpen }"
        aria-hidden="true"
      >
        <SnIcon :icon="ChevronDownIcon" :size="13" />
      </span>
    </div>

    <!-- Time panel — teleported to body, one listbox per column -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="isPanelOpen"
          :id="panelId"
          ref="panelRef"
          :class="['sn-time-picker-panel', `sn-time-picker-panel--${placement}`]"
          :style="panelStyle"
          role="group"
          :aria-label="ariaLabel || 'Time picker panel'"
          @mousedown.prevent
        >
          <div
            v-for="col in visibleColumns"
            :key="col.key"
            class="sn-time-picker-col"
            :class="{ 'sn-time-picker-col--active': col.key === activeColumn }"
            role="listbox"
            :aria-label="col.ariaLabel"
          >
            <div
              v-for="item in col.items"
              :id="item.id"
              :key="item.value"
              class="sn-time-picker-item"
              :class="{ 'sn-time-picker-item--selected': item.isSelected }"
              role="option"
              :aria-selected="item.isSelected ? 'true' : 'false'"
              :data-column="col.key"
              :data-value="item.value"
              @click="onItemClick(col.key, item.value)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnTimePicker — web-end time picker component.
 *
 * Reference library: naive-ui `n-time-picker`
 *   (https://www.naiveui.com/zh-CN/light/components/time-picker)
 *
 * Parity (this version):
 *   - modelValue: millisecond timestamp (number) | null. The time-of-day
 *     part is edited in the host's local timezone and the date part is
 *     preserved on every commit (Date#getHours / Date#setHours — the
 *     reference library's convention).
 *   - format: 'HH:mm' | 'HH:mm:ss' — display format + panel column count.
 *     'HH:mm' treats the value as minute precision: the draft second is
 *     always 0, so any commit normalizes seconds away.
 *   - placeholder / clearable / disabled / readonly / size / status
 *   - use12Hours: 12-hour faces (1–12) plus an AM/PM column
 *   - panel: Teleport + viewport flip (bottom preferred, flips to top
 *     when the viewport lacks room — the simplified popper strategy
 *     SnSelect documents; no full popper, no reposition-on-scroll)
 *   - interaction semantics: every column interaction — cell click or
 *     keyboard Arrow step — commits immediately (the reference's
 *     update-on-interact behavior); Enter confirms the shown value and
 *     closes (committing the initialized draft when the model is null),
 *     Escape closes without committing a null model; Tab / Shift+Tab
 *     cycle the active column forward / backward
 *   - events: update:modelValue, change, focus, blur
 *   - a11y: role=combobox trigger + one role=listbox per column,
 *     aria-expanded / aria-controls / aria-activedescendant tracking the
 *     active column's selection, aria-selected per cell
 *
 * Not ported (out of scope for this pass): actions / formatted-value /
 * value-format / default-time / is-hour-disabled & friends.
 *
 * Per AGENTS.md §30/31: props / events / tokens / accessibility are
 * declared below; CSS uses `--sn-web-time-picker-*` aliases with
 * `--sn-web-color-*` fallbacks only.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../icon/SnIcon.vue';
import { ChevronDownIcon, CloseIcon } from './sn-time-picker-icons';
import { useOverlayFollow } from '../_internal/use-overlay-follow';
import {
  buildTimestamp,
  formatTimeOfDay,
  getTimeParts,
  isPMHour,
  pad2,
  rangeInclusive,
  to12Hour,
  to24Hour,
  wrapStep,
  type SnTimeParts,
  type SnTimePickerFormat,
  type SnTimePickerSize,
  type SnTimePickerStatus,
} from './sn-time-picker-types';

defineOptions({ name: 'SnTimePicker' });

const props = withDefaults(
  defineProps<{
    /** Bound value: millisecond timestamp, or null when empty. */
    modelValue?: number | null;
    /** Display format — also decides whether the seconds column renders. */
    format?: SnTimePickerFormat;
    /** Placeholder text when empty. */
    placeholder?: string;
    /** Show the clear (×) button when a value is present. */
    clearable?: boolean;
    /** Disables interaction. */
    disabled?: boolean;
    /** Read-only — opens nothing, commits nothing. */
    readonly?: boolean;
    /** Visual size preset. */
    size?: SnTimePickerSize;
    /** Validation-driven visual status. */
    status?: SnTimePickerStatus;
    /** 12-hour clock: hour faces 1–12 plus an AM/PM column. */
    use12Hours?: boolean;
    /** Accessible name for the trigger (fallback: 'Time picker'). */
    ariaLabel?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    modelValue: null,
    format: 'HH:mm:ss',
    placeholder: 'Please select time',
    clearable: false,
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
    use12Hours: false,
    ariaLabel: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — fires on every cell click and on Enter confirm. */
  (e: 'update:modelValue', value: number | null): void;
  /** Value committed (also fires for clear). */
  (e: 'change', value: number | null): void;
  /** Trigger gained focus. */
  (e: 'focus', event: FocusEvent): void;
  /** Trigger lost focus. */
  (e: 'blur', event: FocusEvent): void;
}>();

/* ─────────── Panel column model ─────────── */

/** Which column the keyboard is currently driving. */
type SnTimePickerColumnKey = 'hour' | 'minute' | 'second' | 'period';

/** One selectable cell inside a column listbox. */
interface SnTimePickerItem {
  value: number;
  label: string;
  isSelected: boolean;
  id: string;
}

/** One scrollable column (role=listbox) of the panel. */
interface SnTimePickerColumn {
  key: SnTimePickerColumnKey;
  ariaLabel: string;
  items: SnTimePickerItem[];
}

/** Module-level counter so every instance owns unique DOM ids. */
let timePickerInstanceSeed = 0;
const instanceId = ++timePickerInstanceSeed;
const panelId = `sn-time-picker-panel-${instanceId}`;

function itemId(key: SnTimePickerColumnKey, value: number): string {
  return `sn-time-picker-item-${instanceId}-${key}-${value}`;
}

/* ─────────── State ─────────── */

const rootRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

const isPanelOpen = ref(false);
const isFocused = ref(false);
const activeColumn = ref<SnTimePickerColumnKey>('hour');
/**
 * Draft parts shown in the panel. Re-initialized from `modelValue` on
 * every open; every interaction (cell click or keyboard step) mutates it
 * and commits immediately. Escape just closes — the next open
 * re-initializes from the bound value, so unconfirmed keyboard steps on
 * a null model are discarded.
 */
const draft = ref<SnTimeParts>({ hour: 0, minute: 0, second: 0 });

const showSeconds = computed(() => props.format === 'HH:mm:ss');
const isInteractive = computed(() => !props.disabled && !props.readonly);
const hasValue = computed(() => props.modelValue !== null);

/** Hour as shown in the hour column (1–12 face in 12-hour mode). */
const currentHourFace = computed(() =>
  props.use12Hours ? to12Hour(draft.value.hour) : draft.value.hour,
);

/* ─────────── Display ─────────── */

const displayText = computed<string | null>(() => {
  if (props.modelValue === null) return null;
  return formatTimeOfDay(getTimeParts(props.modelValue), {
    use12Hours: props.use12Hours,
    showSeconds: showSeconds.value,
  });
});

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});

/* ─────────── Draft <-> model sync ─────────── */

/**
 * Draft parts derived from the bound value. `null` starts at midnight;
 * 'HH:mm' zeroes the second because the picker is minute-precision then
 * (any commit normalizes seconds away — documented deviation).
 */
function draftPartsFromModel(): SnTimeParts {
  if (props.modelValue === null) return { hour: 0, minute: 0, second: 0 };
  const parts = getTimeParts(props.modelValue);
  if (!showSeconds.value) parts.second = 0;
  return parts;
}

function partsEqual(a: SnTimeParts, b: SnTimeParts): boolean {
  return a.hour === b.hour && a.minute === b.minute && a.second === b.second;
}

/** Apply one column's raw cell value to the draft (12-hour aware). */
function setDraftValue(key: SnTimePickerColumnKey, value: number): void {
  switch (key) {
    case 'hour':
      // In 12-hour mode the cell is a face (1–12); the current period
      // decides which 24-hour hour it maps to.
      draft.value.hour = props.use12Hours ? to24Hour(value, isPMHour(draft.value.hour)) : value;
      break;
    case 'minute':
      draft.value.minute = value;
      break;
    case 'second':
      draft.value.second = value;
      break;
    case 'period':
      // Keep the hour face, swap the half-of-day (12 AM <-> 12 PM).
      draft.value.hour = to24Hour(to12Hour(draft.value.hour), value === 1);
      break;
  }
}

/** Current cell value of a column (drives selection highlight + scroll). */
function columnActiveValue(key: SnTimePickerColumnKey): number {
  switch (key) {
    case 'hour':
      return currentHourFace.value;
    case 'minute':
      return draft.value.minute;
    case 'second':
      return draft.value.second;
    case 'period':
      return isPMHour(draft.value.hour) ? 1 : 0;
  }
}

/** Columns rendered this open — `format` decides seconds, `use12Hours` the period. */
const visibleColumns = computed<SnTimePickerColumn[]>(() => {
  const columns: SnTimePickerColumn[] = [];
  // 12-hour faces render in clock order (12, 1 … 11) like the reference.
  const hourValues = props.use12Hours ? [12, ...rangeInclusive(1, 11)] : rangeInclusive(0, 23);
  columns.push({
    key: 'hour',
    ariaLabel: props.use12Hours ? 'Hour (12-hour clock)' : 'Hour',
    items: hourValues.map((value) => ({
      value,
      label: pad2(value),
      isSelected: currentHourFace.value === value,
      id: itemId('hour', value),
    })),
  });
  columns.push({
    key: 'minute',
    ariaLabel: 'Minute',
    items: rangeInclusive(0, 59).map((value) => ({
      value,
      label: pad2(value),
      isSelected: draft.value.minute === value,
      id: itemId('minute', value),
    })),
  });
  if (showSeconds.value) {
    columns.push({
      key: 'second',
      ariaLabel: 'Second',
      items: rangeInclusive(0, 59).map((value) => ({
        value,
        label: pad2(value),
        isSelected: draft.value.second === value,
        id: itemId('second', value),
      })),
    });
  }
  if (props.use12Hours) {
    columns.push({
      key: 'period',
      ariaLabel: 'AM/PM',
      items: [
        { value: 0, label: 'AM', isSelected: !isPMHour(draft.value.hour), id: itemId('period', 0) },
        { value: 1, label: 'PM', isSelected: isPMHour(draft.value.hour), id: itemId('period', 1) },
      ],
    });
  }
  return columns;
});

/** aria-activedescendant target: the selected cell of the active column. */
const activeDescendant = computed<string | null>(() => {
  if (!isPanelOpen.value) return null;
  const column = visibleColumns.value.find((c) => c.key === activeColumn.value);
  const selected = column?.items.find((item) => item.isSelected);
  return selected?.id ?? null;
});

/* ─────────── Panel positioning (simplified popper) ─────────── */

const PANEL_VIEWPORT_GAP = 4;
const placement = ref<'bottom' | 'top'>('bottom');
const panelStyle = ref<Record<string, string>>({});

function repositionPanel(): void {
  const root = rootRef.value;
  const panel = panelRef.value;
  if (!root || !panel) return;
  const rootRect = root.getBoundingClientRect();
  // offsetWidth/offsetHeight read the layout box, which the sn-pop enter
  // transform (scale 0.92) does not distort — getBoundingClientRect would
  // measure the scaled panel while the enter transition is running.
  const panelWidth = panel.offsetWidth;
  const panelHeight = panel.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Width: at least the trigger width (naive behavior).
  const width = Math.max(rootRect.width, panelWidth);
  const left = Math.min(
    Math.max(PANEL_VIEWPORT_GAP, rootRect.left),
    Math.max(PANEL_VIEWPORT_GAP, vw - width - PANEL_VIEWPORT_GAP),
  );

  // Bottom preferred; flip to top when the viewport lacks room below
  // but has room above.
  const roomBelow = vh - rootRect.bottom;
  const roomAbove = rootRect.top;
  const useTop = roomBelow < panelHeight && roomAbove > roomBelow;
  placement.value = useTop ? 'top' : 'bottom';

  const top = useTop ? Math.max(PANEL_VIEWPORT_GAP, rootRect.top - panelHeight) : rootRect.bottom;

  panelStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    'min-width': `${Math.round(rootRect.width)}px`,
  };
}

/* Scroll/resize follow: while the panel is open, any scroll (page or a
 * nested scrollable ancestor) or viewport resize re-runs repositionPanel so
 * the fixed-position panel stays glued to the trigger instead of detaching. */
const followViewport = useOverlayFollow(rootRef, panelRef, repositionPanel, isPanelOpen);

/* ─────────── Column scrolling ─────────── */

/** Scroll one column so its cell for `value` is visible. */
function scrollColumnTo(key: SnTimePickerColumnKey, value: number): void {
  const panel = panelRef.value;
  if (!panel) return;
  // Columns render in visibleColumns order; DOM order matches.
  const index = visibleColumns.value.findIndex((c) => c.key === key);
  const columnEl = panel.querySelectorAll<HTMLElement>('.sn-time-picker-col')[index];
  columnEl
    ?.querySelector(`[data-value="${CSS.escape(String(value))}"]`)
    ?.scrollIntoView({ block: 'nearest' });
}

function scrollAllColumnsIntoView(): void {
  for (const column of visibleColumns.value) {
    scrollColumnTo(column.key, columnActiveValue(column.key));
  }
}

async function scrollActiveColumnIntoView(): Promise<void> {
  await nextTick();
  scrollColumnTo(activeColumn.value, columnActiveValue(activeColumn.value));
}

/* ─────────── Outside-click dismiss (§41/§42) ─────────── */

function onDocumentMouseDown(event: MouseEvent): void {
  if (!isPanelOpen.value) return;
  const target = event.target as Node | null;
  if (!target) return;
  if (rootRef.value && rootRef.value.contains(target)) return;
  if (panelRef.value && panelRef.value.contains(target)) return;
  closePanel();
}

/* ─────────── Open / close ─────────── */

function openPanel(): void {
  if (!isInteractive.value || isPanelOpen.value) return;
  isPanelOpen.value = true;
  draft.value = draftPartsFromModel();
  activeColumn.value = visibleColumns.value[0]?.key ?? 'hour';
  void nextTick(() => {
    repositionPanel();
    followViewport.start();
    scrollAllColumnsIntoView();
  });
}

function closePanel(): void {
  if (!isPanelOpen.value) return;
  isPanelOpen.value = false;
  followViewport.stop();
}

/* ─────────── Commit ─────────── */

/** Commit the draft: keep the bound value's date, replace the time-of-day. */
function commitDraft(): void {
  const base = props.modelValue ?? Date.now();
  const next = buildTimestamp(base, { ...draft.value });
  emit('update:modelValue', next);
  emit('change', next);
}

function clearValue(): void {
  if (!isInteractive.value) return;
  emit('update:modelValue', null);
  emit('change', null);
  closePanel();
}

/** Click semantics: apply + commit immediately; the panel stays open. */
function onItemClick(key: SnTimePickerColumnKey, value: number): void {
  if (!isInteractive.value) return;
  setDraftValue(key, value);
  activeColumn.value = key;
  commitDraft();
}

/* ─────────── Keyboard ─────────── */

function stepActive(delta: 1 | -1): void {
  const key = activeColumn.value;
  if (key === 'period') {
    // AM <-> PM is a two-state toggle, not a stepped range.
    setDraftValue('period', isPMHour(draft.value.hour) ? 0 : 1);
  } else {
    const min = key === 'hour' && props.use12Hours ? 1 : 0;
    const max = key === 'hour' ? (props.use12Hours ? 12 : 23) : 59;
    const current = key === 'hour' ? currentHourFace.value : draft.value[key];
    setDraftValue(key, wrapStep(current, delta, min, max));
  }
  // Keyboard steps commit immediately — same update-on-interact
  // semantics as a cell click.
  commitDraft();
  void scrollActiveColumnIntoView();
}

function cycleActiveColumn(delta: 1 | -1): void {
  const keys = visibleColumns.value.map((c) => c.key);
  const index = keys.indexOf(activeColumn.value);
  const next = keys[(index + delta + keys.length) % keys.length] ?? keys[0];
  if (next) {
    activeColumn.value = next;
    void scrollActiveColumnIntoView();
  }
}

/**
 * Enter semantics: confirm what the panel shows, then close. Commits when
 * the model is null (the initialized draft) or when the shown draft no
 * longer matches the bound value; a no-op Enter on an unchanged value
 * must not re-emit.
 */
function confirmDraft(): void {
  if (props.modelValue === null || !partsEqual(draftPartsFromModel(), draft.value)) {
    commitDraft();
  }
  closePanel();
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (!isInteractive.value) return;
  switch (event.key) {
    case 'Enter': {
      event.preventDefault();
      if (!isPanelOpen.value) {
        openPanel();
        return;
      }
      confirmDraft();
      break;
    }
    case ' ':
    case 'Spacebar': {
      // Space opens the panel but must not scroll the page.
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      break;
    }
    case 'ArrowDown': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      stepActive(1);
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      stepActive(-1);
      break;
    }
    case 'Tab': {
      // While the panel is open, Tab cycles columns (Shift = backward)
      // instead of leaving the component — focus stays on the trigger.
      if (isPanelOpen.value) {
        event.preventDefault();
        cycleActiveColumn(event.shiftKey ? -1 : 1);
      }
      break;
    }
    case 'Escape': {
      if (isPanelOpen.value) {
        event.preventDefault();
        // Draft is re-initialized on the next open, so closing discards it.
        closePanel();
      }
      break;
    }
    default:
      break;
  }
}

/* ─────────── Trigger events ─────────── */

function onTriggerMouseDown(event: MouseEvent): void {
  // Keep focus on the trigger — no text-selection caret on the wrapper.
  event.preventDefault();
}

function onTriggerClick(): void {
  if (!isInteractive.value) return;
  if (isPanelOpen.value) closePanel();
  else openPanel();
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false;
  emit('blur', event);
}

/* ─────────── Listeners lifecycle (§41/§42) ─────────── */

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown);
  followViewport.stop();
});

watch(
  () => props.modelValue,
  () => {
    // External value change while open — keep the panel in sync.
    if (isPanelOpen.value) {
      draft.value = draftPartsFromModel();
      void nextTick(() => scrollAllColumnsIntoView());
    }
  },
);

watch(
  () => [props.format, props.use12Hours],
  () => {
    // Column layout changed under an open panel (e.g. format swapped) —
    // re-clamp the active column and re-measure.
    if (isPanelOpen.value) {
      const keys = visibleColumns.value.map((c) => c.key);
      if (!keys.includes(activeColumn.value)) {
        activeColumn.value = keys[0] ?? 'hour';
      }
      void nextTick(() => repositionPanel());
    }
  },
);
</script>

<style scoped>
.sn-time-picker {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

.sn-time-picker__selection {
  display: inline-flex;
  align-items: center;
  min-height: var(--sn-web-time-picker-height, 34px);
  padding: 0 var(--sn-web-time-picker-padding-x, 10px);
  width: var(--sn-web-time-picker-width, 100%);
  box-sizing: border-box;
  border: 1px solid var(--sn-web-time-picker-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-time-picker-radius, 6px);
  background-color: var(--sn-web-time-picker-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-time-picker-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  transition:
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
  outline: none;
}

.sn-time-picker__selection:focus-visible {
  border-color: var(--sn-web-time-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

.sn-time-picker--active .sn-time-picker__selection {
  border-color: var(--sn-web-time-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Sizes — height + font-size presets (mirror SnSelect / SnInput). */
.sn-time-picker--mini {
  --sn-web-time-picker-height: 22px;
  font-size: 11px;
}
.sn-time-picker--tiny {
  --sn-web-time-picker-height: 24px;
  font-size: 12px;
}
.sn-time-picker--small {
  --sn-web-time-picker-height: 28px;
  font-size: 13px;
}
.sn-time-picker--medium {
  --sn-web-time-picker-height: 32px;
  font-size: 14px;
}
.sn-time-picker--large {
  --sn-web-time-picker-height: 40px;
  font-size: 15px;
}

.sn-time-picker__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
  font-variant-numeric: tabular-nums;
}

.sn-time-picker__placeholder {
  color: var(--sn-web-time-picker-placeholder-color, var(--sn-web-color-text-tertiary));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

/* Suffix: clear / arrow */
.sn-time-picker__suffix {
  position: absolute;
  right: var(--sn-web-time-picker-suffix-right, 8px);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.sn-time-picker__suffix > * {
  pointer-events: auto;
}

.sn-time-picker__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-time-picker-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
}

.sn-time-picker__clear:hover {
  color: var(--sn-web-time-picker-clear-color-hover, var(--sn-web-color-text-primary));
  background-color: var(--sn-web-color-background-subtle);
}

.sn-time-picker__arrow {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-time-picker-arrow-color, var(--sn-web-color-text-tertiary));
  transition: transform 0.18s ease-out;
}

.sn-time-picker__arrow--up {
  transform: rotate(180deg);
}

/* Disabled / readonly */
.sn-time-picker--disabled .sn-time-picker__selection {
  cursor: not-allowed;
  background-color: var(--sn-web-time-picker-bg-disabled, var(--sn-web-color-background-subtle));
  color: var(--sn-web-time-picker-text-color-disabled, var(--sn-web-color-text-disabled));
  border-color: var(--sn-web-time-picker-border-color-disabled, var(--sn-web-color-border-subtle));
}

.sn-time-picker--disabled .sn-time-picker__placeholder {
  color: var(--sn-web-time-picker-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-time-picker--readonly .sn-time-picker__selection {
  cursor: default;
  background-color: var(--sn-web-time-picker-bg-readonly, var(--sn-web-color-background-subtle));
}

/* Status */
.sn-time-picker--status-error .sn-time-picker__selection {
  border-color: var(--sn-web-color-feedback-danger);
}

.sn-time-picker--status-warning .sn-time-picker__selection {
  border-color: var(--sn-web-color-feedback-warning);
}

/* Suffix overlap guard: leave room for the arrow / clear button. */
.sn-time-picker__selection {
  padding-right: calc(var(--sn-web-time-picker-padding-x, 10px) + 22px);
}
</style>

<style scoped>
/* Time panel — teleported to body, so it lives in its own (non-scoped-alias)
 * style block, mirroring the SnSelect menu convention. Teleported nodes
 * still receive the scoped attribute, so both blocks stay in this SFC. */
.sn-time-picker-panel {
  display: flex;
  gap: 2px;
  position: fixed;
  z-index: var(--sn-web-time-picker-panel-z-index, 1000);
  padding: 4px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-time-picker-panel-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--sn-web-time-picker-panel-radius, 3px);
  background-color: var(--sn-web-time-picker-panel-bg, var(--sn-web-color-background-elevated));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-time-picker-panel-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  font-family: inherit;
  font-size: var(--sn-web-time-picker-panel-font-size, 13px);
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-time-picker-panel--bottom {
  transform-origin: center top;
}

.sn-time-picker-panel--top {
  transform-origin: center bottom;
}

/* sn-pop — naive fade-in-scale-up: enter rises into place, leave fades out. */
.sn-pop-enter-active {
  transition:
    opacity 0.18s cubic-bezier(0, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0, 0, 0.2, 1);
}

.sn-pop-leave-active {
  transition:
    opacity 0.15s cubic-bezier(0, 0, 0.2, 1),
    transform 0.15s cubic-bezier(0, 0, 0.2, 1);
}

.sn-pop-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.92);
}

.sn-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.sn-time-picker-col {
  width: var(--sn-web-time-picker-col-width, 56px);
  height: var(--sn-web-time-picker-panel-height, 224px);
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: var(--sn-web-time-picker-col-radius, 4px);
  /* The columns scroll as a whole; the scrollbar would only flicker
   * while keyboard-stepping, so hide it like the reference does. */
  scrollbar-width: none;
}

.sn-time-picker-col::-webkit-scrollbar {
  display: none;
}

.sn-time-picker-col--active {
  background-color: var(--sn-web-time-picker-col-bg-active, var(--sn-web-color-background-subtle));
}

.sn-time-picker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--sn-web-time-picker-item-height, 32px);
  border-radius: var(--sn-web-time-picker-item-radius, 4px);
  color: var(--sn-web-time-picker-item-color, var(--sn-web-color-text-primary));
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  user-select: none;
  transition:
    background-color 0.12s ease-out,
    color 0.12s ease-out;
}

.sn-time-picker-item:hover {
  background-color: var(
    --sn-web-time-picker-item-bg-hover,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04))
  );
}

.sn-time-picker-item--selected {
  background-color: var(--sn-web-time-picker-item-bg-selected, var(--sn-web-color-action-primary));
  color: var(--sn-web-time-picker-item-text-color-selected, var(--sn-web-color-text-on-primary));
}

.sn-time-picker-item--selected:hover {
  background-color: var(
    --sn-web-time-picker-item-bg-selected-hover,
    var(--sn-web-color-action-primary-hover)
  );
}
</style>
