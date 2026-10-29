<script setup lang="ts">
/**
 * sn-pagination (uni-end) — page stepper for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-pagination`
 *   (https://wot-ui.cn/component/pagination.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-pagination 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-pagination/sn-pagination.vue
 * → auto-registered as `<sn-pagination>` in any .vue that uses it.
 *
 * ## Total-page resolution order
 *
 * `totalPage` is the primary input, but wd-pagination documents that a given
 * `total` + `pageSize` pair wins: the page count is then derived, because the
 * consumer has expressed the data size rather than the page size. That keeps
 * one source of truth (the dataset) from disagreeing with a hand-written count.
 *
 * ## Mobile page window
 *
 * A phone cannot fit a full numeric strip. The visible window is therefore
 * clamped to five entries centred on the current page with ellipses on either
 * side — the same idiom wd-pagination uses at narrow widths.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 数据分页 / 请求 — 由宿主按 `change` 自行请求
 *   - 页码跳转输入 — 移动端不使用，交给宿主自定义 `size` 插槽
 */

import { computed, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { ChevronLeft, ChevronRight } from '../sn-icon/sn-icon-set';
import type { PaginationSlotScope } from './sn-pagination-types';

defineOptions({ name: 'SnPagination' });

/** Buttons per side of the current page when the window is clamped. */
const PAGE_WINDOW = 2;

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-pagination` 1:1 surface ─────────────────────────────── */

    /** 当前页码。 */
    modelValue?: number;
    /** 总页数；传入 total 时优先根据 total 与 pageSize 计算。 */
    totalPage?: number;
    /** 总数据条数。 */
    total?: number;
    /** 每页条数。 */
    pageSize?: number;
    /** 上一页按钮文字；未设置时使用内置文案。 */
    prevText?: string;
    /** 下一页按钮文字；未设置时使用内置文案。 */
    nextText?: string;
    /** 是否展示翻页图标。 */
    showIcon?: boolean;
    /** 是否展示文字提示。 */
    showMessage?: boolean;
    /** 分页按钮风格：base / plain / dashed / text。 */
    buttonVariant?: 'base' | 'plain' | 'dashed' | 'text';
    /** 总页数只有一页时是否隐藏。 */
    hideIfOnePage?: boolean;
    /** 是否整体禁用。 */
    disabled?: boolean;
    /** 简单模式：只展示 prev / 当前页 / next，不渲染页码条。 */
    simple?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    modelValue: 1,
    totalPage: 1,
    total: 0,
    pageSize: 10,
    prevText: '',
    nextText: '',
    showIcon: false,
    showMessage: false,
    buttonVariant: 'text',
    hideIfOnePage: false,
    customClass: '',
    customStyle: '',
    disabled: false,
    simple: false,
  },
);

const emit = defineEmits<{
  /** v-model 同步。 */
  (e: 'update:modelValue', value: number): void;
  /** 页码变化时触发。 */
  (e: 'change', payload: { value: number }): void;
}>();

defineSlots<{
  /** 自定义上一页按钮，作用域 `{ modelValue, totalPageNum, total, pageSize }`。 */
  prev?(scope: PaginationSlotScope): unknown;
  /** 自定义中间页码区域，作用域同上。 */
  size?(scope: PaginationSlotScope): unknown;
  /** 自定义下一页按钮，作用域同上。 */
  next?(scope: PaginationSlotScope): unknown;
  /** 自定义底部提示信息，`showMessage` 为 true 时生效。 */
  message?(scope: PaginationSlotScope): unknown;
}>();

/** Derived page count: `total` + `pageSize` wins over `totalPage`. */
const totalPageNum = computed<number>(() => {
  if (props.total > 0) {
    return Math.max(1, Math.ceil(props.total / Math.max(1, props.pageSize)));
  }
  return Math.max(1, props.totalPage);
});

/** Uncontrolled fallback + controlled sync — both modes stay in step. */
const innerValue = ref(props.modelValue);
watch(
  () => props.modelValue,
  (next) => {
    innerValue.value = next;
  },
);

/** Clamp the model into range so a stale page never renders an empty window. */
const currentPage = computed<number>(() =>
  Math.min(Math.max(1, innerValue.value), totalPageNum.value),
);

/** True when the control is hidden because there is only one page. */
const isHidden = computed(() => props.hideIfOnePage && totalPageNum.value === 1);

/**
 * Visible page entries. `'ellipsis'` marks a gap; numbers are real pages.
 * The window is always contiguous and clamped to the ends.
 */
const pageItems = computed<(number | 'ellipsis')[]>(() => {
  const total = totalPageNum.value;
  const current = currentPage.value;
  const span = PAGE_WINDOW * 2 + 1;
  if (total <= span) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const start = Math.max(2, current - PAGE_WINDOW);
  const end = Math.min(total - 1, current + PAGE_WINDOW);
  const items: (number | 'ellipsis')[] = [1];
  if (start > 2) items.push('ellipsis');
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
});

const slotScope = computed<PaginationSlotScope>(() => ({
  modelValue: currentPage.value,
  totalPageNum: totalPageNum.value,
  total: props.total,
  pageSize: props.pageSize,
}));

/** Commit a page. Out-of-range targets are ignored, not clamped. */
function goTo(page: number): void {
  if (props.disabled) return;
  if (page < 1 || page > totalPageNum.value) return;
  if (page === currentPage.value) return;
  innerValue.value = page;
  emit('update:modelValue', page);
  emit('change', { value: page });
}

const canPrev = computed(() => currentPage.value > 1);
const canNext = computed(() => currentPage.value < totalPageNum.value);

const rootClass = computed(() => [
  'sn-pagination',
  `sn-pagination--${props.buttonVariant}`,
  { 'sn-pagination--disabled': props.disabled },
  props.customClass,
]);

const messageText = computed(() => `${currentPage.value} / ${totalPageNum.value}`);
</script>

<template>
  <view
    v-if="!isHidden"
    data-snui-component="pagination"
    :class="rootClass"
    :style="customStyle || undefined"
    :aria-disabled="props.disabled || undefined"
    role="navigation"
    aria-label="Pagination"
  >
    <view class="sn-pagination__nav">
      <view
        class="sn-pagination__button sn-pagination__prev"
        :class="{ 'sn-pagination__button--disabled': !canPrev || props.disabled }"
        role="button"
        :aria-disabled="!canPrev || props.disabled"
        :aria-label="prevText || 'Previous page'"
        :hover-class="canPrev && !props.disabled ? 'sn-pagination__button--pressed' : 'none'"
        @tap="goTo(currentPage - 1)"
      >
        <!-- MP 编译器不支持 <slot> 上的 v-bind="obj" 批量传参，显式展开（key 与
             PaginationSlotScope 一致，消费者用法不变）。 -->
        <slot
          name="prev"
          :modelValue="slotScope.modelValue"
          :totalPageNum="slotScope.totalPageNum"
          :total="slotScope.total"
          :pageSize="slotScope.pageSize"
        >
          <SnIcon v-if="showIcon" :icon="ChevronLeft" :size="28" />
          <text v-if="prevText" class="sn-pagination__text">{{ prevText }}</text>
        </slot>
      </view>

      <view v-if="!props.simple" class="sn-pagination__pages">
        <slot
          name="size"
          :modelValue="slotScope.modelValue"
          :totalPageNum="slotScope.totalPageNum"
          :total="slotScope.total"
          :pageSize="slotScope.pageSize"
        >
          <template v-for="(item, index) in pageItems" :key="`${item}-${index}`">
            <text v-if="item === 'ellipsis'" class="sn-pagination__ellipsis" aria-hidden="true"
              >…</text
            >
            <view
              v-else
              class="sn-pagination__page"
              :class="{ 'sn-pagination__page--active': item === currentPage }"
              role="button"
              :aria-current="item === currentPage ? 'page' : undefined"
              :aria-label="`Page ${item}`"
              hover-class="sn-pagination__page--pressed"
              @tap="goTo(item)"
            >
              <text class="sn-pagination__page-text">{{ item }}</text>
            </view>
          </template>
        </slot>
      </view>

      <view v-if="props.simple" class="sn-pagination__simple">
        <slot
          name="size"
          :modelValue="slotScope.modelValue"
          :totalPageNum="slotScope.totalPageNum"
          :total="slotScope.total"
          :pageSize="slotScope.pageSize"
        >
          <text class="sn-pagination__simple-text">{{ messageText }}</text>
        </slot>
      </view>

      <view
        class="sn-pagination__button sn-pagination__next"
        :class="{ 'sn-pagination__button--disabled': !canNext || props.disabled }"
        role="button"
        :aria-disabled="!canNext || props.disabled"
        :aria-label="nextText || 'Next page'"
        :hover-class="canNext && !props.disabled ? 'sn-pagination__button--pressed' : 'none'"
        @tap="goTo(currentPage + 1)"
      >
        <slot
          name="next"
          :modelValue="slotScope.modelValue"
          :totalPageNum="slotScope.totalPageNum"
          :total="slotScope.total"
          :pageSize="slotScope.pageSize"
        >
          <text v-if="nextText" class="sn-pagination__text">{{ nextText }}</text>
          <SnIcon v-if="showIcon" :icon="ChevronRight" :size="28" />
        </slot>
      </view>
    </view>

    <view v-if="showMessage" class="sn-pagination__message">
      <slot
        name="message"
        :modelValue="slotScope.modelValue"
        :totalPageNum="slotScope.totalPageNum"
        :total="slotScope.total"
        :pageSize="slotScope.pageSize"
      >
        <text class="sn-pagination__message-text">{{ messageText }}</text>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  width: 100%;
}

.sn-pagination__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-mp-spacing-1);
  width: 100%;
}

.sn-pagination__button {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-1);
  min-width: 56rpx;
  height: 56rpx;
  padding: 0 var(--sn-mp-spacing-2);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-pagination__button--pressed,
.sn-pagination__page--pressed {
  opacity: 0.6;
}

.sn-pagination__button--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-pagination__pages {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-1);
  min-width: 0;
}

.sn-pagination__page {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 52rpx;
  height: 52rpx;
  padding: 0 var(--sn-mp-spacing-1);
  border-radius: var(--sn-mp-radius-sm);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-pagination__page--active {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-pagination__page-text {
  color: inherit;
  font-size: inherit;
}

.sn-pagination__ellipsis {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-pagination__text {
  color: inherit;
  font-size: inherit;
}

.sn-pagination__message {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-pagination__message-text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

/* Button variants — border treatment only; colour stays the action token. */
.sn-pagination--base .sn-pagination__button,
.sn-pagination--base .sn-pagination__page {
  border-color: var(--sn-mp-color-border-default);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-pagination--plain .sn-pagination__button,
.sn-pagination--plain .sn-pagination__page {
  border-color: var(--sn-mp-color-action-primary);
}

.sn-pagination--dashed .sn-pagination__button,
.sn-pagination--dashed .sn-pagination__page {
  border-style: dashed;
  border-color: var(--sn-mp-color-action-primary);
}

/* Doodle skin — heavier active page. */
.snui-skin-doodle .sn-pagination__page--active {
  font-weight: var(--sn-mp-font-weight-bold);
}

/* Whole-control disabled state (Ant-style 禁用). */
/* Whole-control disabled state (Ant-style 禁用). */
.sn-pagination--disabled .sn-pagination__button,
.sn-pagination--disabled .sn-pagination__page,
.sn-pagination--disabled .sn-pagination__ellipsis,
.sn-pagination--disabled .sn-pagination__simple-text {
  color: var(--sn-mp-color-text-disabled);
}

.sn-pagination--disabled .sn-pagination__page--active {
  background-color: var(--sn-mp-color-background-disabled, var(--sn-mp-color-action-primary));
  color: var(--sn-mp-color-text-disabled);
}

/* Simple mode — prev / 1 / n / next with no numeric strip. */
.sn-pagination__simple {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.sn-pagination__simple-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
