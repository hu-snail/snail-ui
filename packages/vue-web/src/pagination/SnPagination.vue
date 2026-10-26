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
 * Documented divergences (not §112 violations):
 *   - The `…` markers between page groups are static, aria-hidden
 *     indicators — the reference's hover-to-jump fast-forward /
 *     fast-backward buttons are not implemented.
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

import { computed, ref, watch } from 'vue';
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
        class="sn-pagination__item"
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
        class="sn-pagination__item"
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
    <ul v-else class="sn-pagination__pages">
      <li class="sn-pagination__page-item">
        <SnButton
          class="sn-pagination__item"
          text
          size="small"
          :disabled="isDisabled || mergedPage <= 1"
          :aria-label="paginationLocale.prevPage"
          @click="go(mergedPage - 1)"
        >
          <slot name="prev"><SnIcon :icon="ChevronLeft" :size="16" /></slot>
        </SnButton>
      </li>
      <li
        v-for="(item, index) in displayItems"
        :key="`${item}-${index}`"
        class="sn-pagination__page-item"
      >
        <span v-if="typeof item === 'string'" class="sn-pagination__ellipsis" aria-hidden="true">
          …
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
      </li>
      <li class="sn-pagination__page-item">
        <SnButton
          class="sn-pagination__item"
          text
          size="small"
          :disabled="isDisabled || mergedPage >= mergedPageCount"
          :aria-label="paginationLocale.nextPage"
          @click="go(mergedPage + 1)"
        >
          <slot name="next"><SnIcon :icon="ChevronRight" :size="16" /></slot>
        </SnButton>
      </li>
    </ul>

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

/* Page list */
.sn-pagination__pages {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sn-pagination__page-item {
  display: inline-flex;
  align-items: center;
}

/* Page item overrides on top of SnButton text variant (transparent base):
 * `.sn-pagination .sn-pagination__item` keeps specificity above the
 * button's own single-class rules. */
.sn-pagination .sn-pagination__item {
  min-width: var(--sn-web-button-height-small, 28px);
  height: var(--sn-web-button-height-small, 28px);
  padding: 0 6px;
  font-size: 14px;
  font-weight: 400;
}

.sn-pagination .sn-pagination__item.sn-pagination__item--active {
  background-color: color-mix(in srgb, var(--sn-web-color-action-primary) 16%, transparent);
  color: var(--sn-web-color-action-primary);
  font-weight: 500;
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
