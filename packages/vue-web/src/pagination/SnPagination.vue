<script setup lang="ts">
/**
 * SnPagination — web-end pagination (AUI-WEB-NAV-009).
 *
 * Reference library: naive-ui `n-pagination`
 *   (https://www.naiveui.com/zh-CN/light/components/pagination)
 * Per AGENTS.md §112, props + semantics mirror n-pagination 1:1.
 *
 * Parity checklist (props):
 *   page / itemCount / pageSize / defaultPage / defaultPageSize /
 *   pageCount / pageSizes / showQuickJumper / showSizePicker / pageSlot /
 *   showTotal / simple / disabled.
 * Parity checklist (events):
 *   update:page (on-update:page) / update:pageSize (on-update:page-size).
 * Parity checklist (slots):
 *   prev / next / prefix / suffix / label ({ page }).
 *
 * Beyond naive:
 *   - `quickSwitch` (default on): clicking an `…` ellipsis opens a small
 *     panel listing the pages hidden in that gap — one click jumps there
 *     (the documented divergence below is now covered).
 *   - Prev / next arrows render with a bordered button style and the whole
 *     pager uses flex centering (icons / numbers vertically centred).
 *
 * Documented divergences (not §112 violations):
 *   - `showQuickJumper` accepts `boolean` only (the reference also allows
 *     `{ goButton }`; no go-button is rendered here).
 *   - `prefix` / `suffix` are exposed as Vue slots (the reference declares
 *     them as render-function props; slots are the idiomatic Vue mapping).
 *   - `itemCount` defaults to `0` instead of being required.
 *   - Fixed zh locale strings (共 N 条 / 跳至 / N / 页), following the
 *     SnEmpty zh-locale precedent; no config-provider / RTL integration.
 *   - Theme values map to web tokens: item height 28px via
 *     --sn-web-button-height-small (fallback 28px), active page =
 *     action-primary tint + primary text (reference uses itemColorActive /
 *     itemTextColorActive), 8px item gap.
 *
 * Controlled / uncontrolled: `page` / `pageSize` fall back to internal
 * state seeded by `defaultPage` / `defaultPageSize` when left undefined
 * (same pattern as SnTooltip `show` / `defaultShow`).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnPagination :item-count="97" show-total />
 *   <SnPagination v-model:page="page" :item-count="200" show-quick-jumper
 *                 show-size-picker :page-sizes="[10, 20, 50]" />
 *   <SnPagination :item-count="45" simple />
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import SnButton from '../button/SnButton.vue';
import SnIcon from '../icon/SnIcon.vue';
import SnInput from '../input/SnInput.vue';
import SnSelect from '../select/SnSelect.vue';
import type { SnSelectValue } from '../select/sn-select-types';
defineOptions({ name: 'SnPagination' });

import { useLocale } from '../locales/use-locale';

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();
/** Active Pagination locale namespace (naive-ui i18n). */
const paginationLocale = computed(() => locale.value.Pagination);

/** A rendered pager item: a page number or an ellipsis marker. */
type PaginationDisplayItem = number | 'start-ellipsis' | 'end-ellipsis';

/** naive pageSizes entry: plain number or explicit label/value pair. */
type PaginationPageSize = number | { label: string; value: number };

const props = withDefaults(
  defineProps<{
    /** Current page (controlled). When undefined the component is uncontrolled. Mirrors n-pagination `page`. */
    page?: number | undefined;
    /** Total item count used to derive the page count. Mirrors n-pagination `itemCount`. */
    itemCount?: number;
    /** Page size (controlled). `undefined` / `null` falls back to internal state. Mirrors n-pagination `pageSize`. */
    pageSize?: number | null | undefined;
    /** Initial page for uncontrolled mode. Mirrors n-pagination `defaultPage`. */
    defaultPage?: number;
    /** Initial page size for uncontrolled mode. Mirrors n-pagination `defaultPageSize`. */
    defaultPageSize?: number;
    /** Explicit page count — takes precedence over itemCount / pageSize. Mirrors n-pagination `pageCount`. */
    pageCount?: number | undefined;
    /** Options for the size picker; plain numbers render as `N / 页`. Mirrors n-pagination `pageSizes`. */
    pageSizes?: PaginationPageSize[];
    /** Render the quick page-jumper input. Mirrors n-pagination `showQuickJumper`. */
    showQuickJumper?: boolean;
    /** Render the page-size picker. Mirrors n-pagination `showSizePicker`. */
    showSizePicker?: boolean;
    /**
     * Maximum number of page buttons rendered before collapsing into
     * first / last / neighborhood + ellipsis. Mirrors n-pagination
     * `pageSlot`. Default 9.
     */
    pageSlot?: number;
    /** Show the `共 N 条` total. Mirrors n-pagination `showTotal`. */
    showTotal?: boolean;
    /** Compact mode: prev / page input / page count / next only. Mirrors n-pagination `simple`. */
    simple?: boolean;
    /**
     * Quick switch (快速切换): clicking an `…` ellipsis opens a small panel
     * listing the pages hidden in that gap — one click jumps there. On by
     * default; set `false` to keep the ellipsis a static marker.
     */
    quickSwitch?: boolean;
    /** Disable every control. Mirrors n-pagination `disabled`. */
    disabled?: boolean;
  }>(),
  {
    page: undefined,
    itemCount: 0,
    pageSize: undefined,
    defaultPage: 1,
    defaultPageSize: 10,
    pageCount: undefined,
    pageSizes: () => [10, 20, 30, 40],
    showQuickJumper: false,
    showSizePicker: false,
    pageSlot: 9,
    showTotal: false,
    simple: false,
    quickSwitch: true,
    disabled: false,
  },
);

const emit = defineEmits<{
  /** Page committed (button click / jumper). Mirrors n-pagination `on-update:page`. */
  (e: 'update:page', page: number): void;
  /** Page size committed via the size picker. Mirrors n-pagination `on-update:page-size`. */
  (e: 'update:pageSize', pageSize: number): void;
}>();

defineSlots<{
  /** Custom arrow content for the prev button. Mirrors n-pagination `prev`. */
  prev?(): unknown;
  /** Custom arrow content for the next button. Mirrors n-pagination `next`. */
  next?(): unknown;
  /** Content rendered before the pager. Mirrors n-pagination `prefix`. */
  prefix?(): unknown;
  /** Content rendered after the pager. Mirrors n-pagination `suffix`. */
  suffix?(): unknown;
  /** Custom page-number label; receives `{ page }`. Mirrors n-pagination `label`. */
  label?(props: { page: number }): unknown;
}>();

/**
 * Definite-boolean view of `disabled`. Under `exactOptionalPropertyTypes`
 * the raw prop type keeps `| undefined`, which child component prop
 * types (SnButton / SnInput / SnSelect) reject — same narrowing as
 * SnDialog's `isLoading`.
 */
const isDisabled = computed(() => props.disabled === true);

/* ─────────── Controlled / uncontrolled page + pageSize ─────────── */

const isPageControlled = computed(() => props.page !== undefined);
const isPageSizeControlled = computed(
  () => props.pageSize !== undefined && props.pageSize !== null,
);

const uncontrolledPage = ref(props.defaultPage);
const uncontrolledPageSize = ref(props.defaultPageSize);

const mergedPageSize = computed(() =>
  isPageSizeControlled.value ? (props.pageSize as number) : uncontrolledPageSize.value,
);

const mergedPageCount = computed(() => {
  if (props.pageCount !== undefined) return Math.max(props.pageCount, 0);
  return Math.max(1, Math.ceil(props.itemCount / mergedPageSize.value));
});

const mergedPage = computed(() => {
  const raw = isPageControlled.value ? (props.page as number) : uncontrolledPage.value;
  return Math.min(Math.max(1, raw), Math.max(mergedPageCount.value, 1));
});

/** Commit a page change. Always emits; writes internal state only when uncontrolled. */
function go(next: number): void {
  if (props.disabled) return;
  const target = Math.min(Math.max(Math.round(next), 1), Math.max(mergedPageCount.value, 1));
  if (target === mergedPage.value) return;
  if (!isPageControlled.value) uncontrolledPage.value = target;
  emit('update:page', target);
}

/** Commit a page-size change via the size picker. */
function setPageSize(next: number): void {
  if (props.disabled) return;
  if (next === mergedPageSize.value) return;
  if (!isPageSizeControlled.value) uncontrolledPageSize.value = next;
  emit('update:pageSize', next);
}

/* ─────────── Ellipsis collapsing (first / last / neighborhood) ─────────── */

const displayItems = computed<PaginationDisplayItem[]>(() =>
  buildDisplayItems(mergedPage.value, mergedPageCount.value, props.pageSlot),
);

/**
 * Page > pageSlot collapses to: [1, (…), neighborhood, (…), N]. The
 * neighborhood window keeps `pageSlot - 4` pages when both ellipsis
 * markers show; when one side drops its marker the window extends to
 * reclaim the freed slot (e.g. pageSlot 9 → 7 pages near the edges).
 */
function buildDisplayItems(
  page: number,
  pageCount: number,
  pageSlot: number,
): PaginationDisplayItem[] {
  if (pageCount <= 0) return [];
  if (pageCount <= pageSlot) {
    const all: PaginationDisplayItem[] = [];
    for (let i = 1; i <= pageCount; i++) all.push(i);
    return all;
  }
  const middleCount = Math.max(pageSlot - 4, 1);
  let start = Math.max(2, page - Math.floor(middleCount / 2));
  let end = Math.min(pageCount - 1, start + middleCount - 1);
  start = Math.max(2, end - middleCount + 1);
  const showStartEllipsis = start > 2;
  const showEndEllipsis = end < pageCount - 1;
  if (!showStartEllipsis && showEndEllipsis) end = Math.min(pageCount - 1, pageSlot - 2);
  if (!showEndEllipsis && showStartEllipsis) start = Math.max(2, pageCount - pageSlot + 3);

  const items: PaginationDisplayItem[] = [1];
  if (showStartEllipsis) items.push('start-ellipsis');
  for (let i = start; i <= end; i++) items.push(i);
  if (showEndEllipsis) items.push('end-ellipsis');
  items.push(pageCount);
  return items;
}

/* ─────────── Quick jumper ─────────── */

const jumperValue = ref(String(mergedPage.value));

watch(mergedPage, (page) => {
  jumperValue.value = String(page);
  simpleInputValue.value = String(page);
  openQuickPanel.value = null;
});

/** Enter / blur commit: parse, clamp into [1, pageCount], reset the field. */
function commitJumper(): void {
  const parsed = Number.parseInt(jumperValue.value, 10);
  if (Number.isNaN(parsed)) {
    jumperValue.value = String(mergedPage.value);
    return;
  }
  const target = Math.min(Math.max(parsed, 1), Math.max(mergedPageCount.value, 1));
  jumperValue.value = String(target);
  go(target);
}

/* ─────────── Ellipsis quick switch (快速切换) ─────────── */

type QuickPanelSide = 'start-ellipsis' | 'end-ellipsis';
const openQuickPanel = ref<QuickPanelSide | null>(null);
const quickPanelUp = ref(false);
const rootRef = ref<HTMLElement | null>(null);

/**
 * The hidden page range each `…` marker stands for. `null` when the marker
 * is absent or its gap is empty (nothing to switch to).
 */
const quickRanges = computed<{
  'start-ellipsis': [number, number] | null;
  'end-ellipsis': [number, number] | null;
}>(() => {
  const items = displayItems.value;
  const startIdx = items.indexOf('start-ellipsis');
  const endIdx = items.indexOf('end-ellipsis');
  const startGap: [number, number] | null =
    startIdx > -1 && typeof items[startIdx + 1] === 'number'
      ? [2, (items[startIdx + 1] as number) - 1]
      : null;
  const endGap: [number, number] | null =
    endIdx > -1 && typeof items[endIdx - 1] === 'number'
      ? [(items[endIdx - 1] as number) + 1, mergedPageCount.value - 1]
      : null;
  const valid = (range: [number, number] | null): [number, number] | null =>
    range !== null && range[0] <= range[1] ? range : null;
  return { 'start-ellipsis': valid(startGap), 'end-ellipsis': valid(endGap) };
});

function quickPagesFor(item: PaginationDisplayItem): number[] {
  const range =
    item === 'start-ellipsis' || item === 'end-ellipsis' ? quickRanges.value[item] : null;
  if (range === null) return [];
  const pages: number[] = [];
  for (let p = range[0]; p <= range[1]; p += 1) pages.push(p);
  return pages;
}

/** Toggle the gap panel; flips upward when the viewport lacks room below. */
function toggleQuickPanel(item: QuickPanelSide, event: MouseEvent): void {
  if (openQuickPanel.value === item) {
    openQuickPanel.value = null;
    return;
  }
  const button = event.currentTarget as HTMLElement | null;
  quickPanelUp.value =
    button !== null &&
    typeof window !== 'undefined' &&
    button.getBoundingClientRect().bottom + 236 > window.innerHeight;
  openQuickPanel.value = item;
}

function quickGo(page: number): void {
  go(page);
  openQuickPanel.value = null;
}

function onDocumentMousedown(event: MouseEvent): void {
  if (openQuickPanel.value === null) return;
  const target = event.target as Node | null;
  if (rootRef.value && target instanceof Node && rootRef.value.contains(target)) return;
  openQuickPanel.value = null;
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMousedown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMousedown);
});

/* ─────────── Simple mode input ─────────── */

const simpleInputValue = ref(String(mergedPage.value));

function commitSimpleInput(): void {
  const parsed = Number.parseInt(simpleInputValue.value, 10);
  if (Number.isNaN(parsed)) {
    simpleInputValue.value = String(mergedPage.value);
    return;
  }
  const target = Math.min(Math.max(parsed, 1), Math.max(mergedPageCount.value, 1));
  simpleInputValue.value = String(target);
  go(target);
}

/* ─────────── Size picker ─────────── */

const pageSizeOptions = computed(() =>
  props.pageSizes.map((entry) =>
    typeof entry === 'number'
      ? { label: `${entry} / 页`, value: entry }
      : { label: entry.label, value: entry.value },
  ),
);

function onPageSizeSelect(value: SnSelectValue | SnSelectValue[] | null): void {
  if (typeof value === 'number' && !Number.isNaN(value)) setPageSize(value);
}
</script>

<template>
  <nav
    ref="rootRef"
    data-snui-component="pagination"
    class="sn-pagination"
    :class="{
      'sn-pagination--simple': simple,
      'sn-pagination--disabled': disabled,
    }"
    role="navigation"
    :aria-label="paginationLocale.navigationAriaLabel"
  >
    <div v-if="$slots.prefix" class="sn-pagination__prefix">
      <slot name="prefix" />
    </div>
    <span v-if="showTotal" class="sn-pagination__total">{{
      paginationLocale.total.replace('{total}', String(itemCount))
    }}</span>

    <!-- Simple mode: prev / page input / count / next -->
    <div v-if="simple" class="sn-pagination__simple">
      <SnButton
        class="sn-pagination__item sn-pagination__item--nav"
        text
        size="small"
        :disabled="isDisabled || mergedPage <= 1"
        :aria-label="paginationLocale.prevPage"
        @click="go(mergedPage - 1)"
      >
        <slot name="prev"><SnIcon :icon="ChevronLeft" :size="16" /></slot>
      </SnButton>
      <SnInput
        v-model="simpleInputValue"
        class="sn-pagination__simple-input"
        size="small"
        :disabled="isDisabled"
        :aria-label="paginationLocale.currentPageStatus.replace('{total}', String(mergedPageCount))"
        @confirm="commitSimpleInput"
        @blur="commitSimpleInput"
      />
      <span class="sn-pagination__simple-separator">/ {{ mergedPageCount }}</span>
      <SnButton
        class="sn-pagination__item sn-pagination__item--nav"
        text
        size="small"
        :disabled="isDisabled || mergedPage >= mergedPageCount"
        :aria-label="paginationLocale.nextPage"
        @click="go(mergedPage + 1)"
      >
        <slot name="next"><SnIcon :icon="ChevronRight" :size="16" /></slot>
      </SnButton>
    </div>

    <!-- Full mode: prev / pages / next -->
    <div v-else class="sn-pagination__pages">
      <div class="sn-pagination__page-item">
        <SnButton
          class="sn-pagination__item sn-pagination__item--nav"
          text
          size="small"
          :disabled="isDisabled || mergedPage <= 1"
          :aria-label="paginationLocale.prevPage"
          @click="go(mergedPage - 1)"
        >
          <slot name="prev"><SnIcon :icon="ChevronLeft" :size="16" /></slot>
        </SnButton>
      </div>
      <div
        v-for="(item, index) in displayItems"
        :key="`${item}-${index}`"
        class="sn-pagination__page-item"
      >
        <span v-if="typeof item === 'string'" class="sn-pagination__ellipsis-wrap">
          <button
            v-if="quickSwitch && quickRanges[item]"
            type="button"
            class="sn-pagination__ellipsis sn-pagination__ellipsis--switch"
            :class="{ 'sn-pagination__ellipsis--open': openQuickPanel === item }"
            :aria-label="paginationLocale.jumpLabel"
            aria-haspopup="true"
            :aria-expanded="openQuickPanel === item ? 'true' : 'false'"
            @click.stop="toggleQuickPanel(item, $event)"
            @keydown.esc.stop="openQuickPanel = null"
          >
            …
          </button>
          <span v-else class="sn-pagination__ellipsis" aria-hidden="true">…</span>
          <div
            v-if="quickSwitch && openQuickPanel === item"
            class="sn-pagination__quick-panel"
            :class="{ 'sn-pagination__quick-panel--up': quickPanelUp }"
            role="listbox"
            :aria-label="paginationLocale.jumpLabel"
          >
            <button
              v-for="p in quickPagesFor(item)"
              :key="p"
              type="button"
              role="option"
              class="sn-pagination__quick-item"
              :class="{ 'sn-pagination__quick-item--active': p === mergedPage }"
              :aria-selected="p === mergedPage ? 'true' : 'false'"
              :aria-current="p === mergedPage ? 'page' : undefined"
              @click.stop="quickGo(p)"
            >
              {{ p }}
            </button>
          </div>
        </span>
        <SnButton
          v-else
          class="sn-pagination__item"
          :class="{ 'sn-pagination__item--active': item === mergedPage }"
          text
          size="small"
          :disabled="isDisabled"
          :aria-label="paginationLocale.page.replace('{page}', String(item))"
          :aria-current="item === mergedPage ? 'page' : undefined"
          @click="go(item)"
        >
          <slot name="label" :page="item">{{ item }}</slot>
        </SnButton>
      </div>
      <div class="sn-pagination__page-item">
        <SnButton
          class="sn-pagination__item sn-pagination__item--nav"
          text
          size="small"
          :disabled="isDisabled || mergedPage >= mergedPageCount"
          :aria-label="paginationLocale.nextPage"
          @click="go(mergedPage + 1)"
        >
          <slot name="next"><SnIcon :icon="ChevronRight" :size="16" /></slot>
        </SnButton>
      </div>
    </div>

    <div v-if="showQuickJumper && !simple" class="sn-pagination__jumper">
      <span class="sn-pagination__jumper-label">{{ paginationLocale.jumpLabel }}</span>
      <SnInput
        v-model="jumperValue"
        class="sn-pagination__jumper-input"
        size="small"
        :disabled="isDisabled"
        :aria-label="paginationLocale.jumpAriaLabel"
        @confirm="commitJumper"
        @blur="commitJumper"
      />
    </div>

    <div v-if="showSizePicker" class="sn-pagination__size-picker">
      <SnSelect
        class="sn-pagination__size-select"
        size="small"
        :model-value="mergedPageSize"
        :options="pageSizeOptions"
        :disabled="isDisabled"
        :aria-label="paginationLocale.perPage"
        @update:model-value="onPageSizeSelect"
      />
    </div>

    <div v-if="$slots.suffix" class="sn-pagination__suffix">
      <slot name="suffix" />
    </div>
  </nav>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-pagination {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}

.sn-pagination--disabled {
  cursor: not-allowed;
}

.sn-pagination__prefix,
.sn-pagination__suffix {
  display: inline-flex;
  align-items: center;
}

.sn-pagination__total {
  color: var(--sn-web-color-text-tertiary);
}

/* Page list (plain divs — a semantic <ul> would inherit the host doc
 * stylesheet's `li + li` margins and break the row centring). */
.sn-pagination__pages {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
}

.sn-pagination__page-item {
  position: relative;
  display: flex;
  align-items: center;
}

/* Page item overrides on top of SnButton text variant (transparent base):
 * `.sn-pagination .sn-pagination__item` keeps specificity above the
 * button's own single-class rules. Flex centering pins the icon / label
 * to the exact middle (the mis-alignment fix). */
.sn-pagination .sn-pagination__item {
  min-width: var(--sn-web-button-height-small, 28px);
  height: var(--sn-web-button-height-small, 28px);
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  font-size: 14px;
  font-weight: 400;
}

.sn-pagination .sn-pagination__item.sn-pagination__item--active {
  background-color: color-mix(in srgb, var(--sn-web-color-action-primary) 16%, transparent);
  color: var(--sn-web-color-action-primary);
  font-weight: 500;
}

/* Prev / next arrows get a bordered button look (element-plus style) while
 * page numbers stay borderless. */
.sn-pagination .sn-pagination__item--nav {
  padding: 0;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-button-radius-small, 6px);
  background-color: var(--sn-web-color-background-surface);
  transition:
    border-color 0.18s ease-out,
    color 0.18s ease-out;
}

.sn-pagination .sn-pagination__item--nav:not(:disabled):hover {
  border-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-action-primary);
}

.sn-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--sn-web-button-height-small, 28px);
  height: var(--sn-web-button-height-small, 28px);
  color: var(--sn-web-color-text-secondary);
  user-select: none;
}

/* Quick switch — the `…` marker becomes a jump button over its gap. */
.sn-pagination__ellipsis-wrap {
  position: relative;
  display: inline-flex;
}

.sn-pagination__ellipsis--switch {
  padding: 0;
  border: none;
  border-radius: var(--sn-web-button-radius-small, 4px);
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  transition:
    background-color 0.15s ease-out,
    color 0.15s ease-out;
}

.sn-pagination__ellipsis--switch:hover,
.sn-pagination__ellipsis--switch--open.sn-pagination__ellipsis--switch {
  background-color: var(--sn-web-color-background-soft);
  color: var(--sn-web-color-action-primary);
}

.sn-pagination__quick-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--sn-web-pagination-quick-z-index, 100);
  display: flex;
  flex-direction: column;
  min-width: 56px;
  max-height: 232px;
  /* One axis of scrolling only — the styled vertical bar; horizontal
   * overflow (3-digit pages + scrollbar width) is clipped away. */
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 4px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 8px;
  background-color: var(--sn-web-color-background-elevated);
  box-shadow: var(
    --sn-web-pagination-quick-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
}

.sn-pagination__quick-panel--up {
  top: auto;
  bottom: calc(100% + 4px);
}

.sn-pagination__quick-item {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Fill the panel content box (border-box) so the vertical scrollbar's
   * width never pushes a horizontal scrollbar into existence. */
  width: 100%;
  box-sizing: border-box;
  height: 28px;
  padding: 0 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--sn-web-color-text-primary);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}

.sn-pagination__quick-item:hover {
  background-color: var(--sn-web-color-background-soft);
}

.sn-pagination__quick-item--active {
  background-color: color-mix(in srgb, var(--sn-web-color-action-primary) 16%, transparent);
  color: var(--sn-web-color-action-primary);
  font-weight: 500;
}

/* Simple mode */
.sn-pagination__simple {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.sn-pagination__simple-input {
  width: 56px;
}

.sn-pagination__simple-separator {
  color: var(--sn-web-color-text-tertiary);
}

/* Quick jumper */
.sn-pagination__jumper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.sn-pagination__jumper-label {
  color: var(--sn-web-color-text-tertiary);
}

.sn-pagination__jumper-input {
  width: 60px;
}

/* Size picker */
.sn-pagination__size-picker {
  display: inline-flex;
  align-items: center;
}

.sn-pagination__size-select {
  width: 104px;
}
</style>
