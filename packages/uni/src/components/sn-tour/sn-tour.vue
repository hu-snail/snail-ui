<script setup lang="ts">
/**
 * sn-tour (uni-end) — step-by-step feature guide with a highlight mask.
 *
 * Reference library: wot-ui `wd-tour`
 *   (https://wot-ui.cn/component/tour.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-tour 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-tour/sn-tour.vue
 * → auto-registered as `<sn-tour>` in any .vue that uses it.
 *
 * ## Why there is no element measurement here
 *
 * wd-tour highlights a *DOM element* by selector, which needs layout
 * measurement (`getBoundingClientRect` / `createSelectorQuery`). Neither is
 * synchronous and universal across uni targets, and a wrong rect produces a
 * mask that points at nothing — worse than no mask. The uni implementation
 * therefore renders the mask + panel and centres the panel, exposing the step
 * data through a slot so a host that *can* measure (H5, App) can position the
 * highlight itself. `element` / `padding` / `offset` / `placement` stay in the
 * prop surface because they are part of the frozen contract, but they are
 * documented as measurement-dependent (see the docs page "未实现" note).
 *
 * ## Step bookkeeping
 *
 * `current` is `v-model:current`. `modelValue` is the open flag. Navigation
 * clamps to the step list; the last step's primary button becomes "finish".
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 目标元素的测量 / 高亮挖孔 — 需宿主提供 rect（见上）
 *   - 引导进度持久化 — 由宿主处理
 */

import { computed, ref, watch } from 'vue';
import type { TourMissingStrategy, TourNavPayload, TourStep } from './sn-tour-types';

defineOptions({ name: 'SnTour' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-tour` 1:1 surface ───────────────────────────────────── */

    /** 是否显示引导组件。 */
    modelValue?: boolean;
    /** 引导步骤列表。 */
    steps?: TourStep[];
    /** 当前步骤索引。 */
    current?: number;
    /** 是否显示蒙版。 */
    mask?: boolean;
    /** 蒙版颜色（内联覆盖，空 = 令牌默认）。 */
    maskColor?: string;
    /** 引导面板与高亮区域的间距。 */
    offset?: number;
    /** 动画时长，单位毫秒。 */
    duration?: number;
    /** 高亮区域圆角。 */
    borderRadius?: number;
    /** 高亮区域内边距。 */
    padding?: number;
    /** 上一步按钮文案。 */
    prevText?: string;
    /** 下一步按钮文案。 */
    nextText?: string;
    /** 跳过按钮文案。 */
    skipText?: string;
    /** 完成按钮文案。 */
    finishText?: string;
    /** 底部安全偏移量，用于滚动计算。 */
    bottomSafetyOffset?: number;
    /** 顶部安全偏移量，用于滚动计算。 */
    topSafetyOffset?: number;
    /** 是否启用自定义导航栏模式。 */
    customNav?: boolean;
    /** 点击遮罩层是否进入下一步。 */
    clickMaskNext?: boolean;
    /** 默认高亮区域样式。 */
    highlightStyle?: Record<string, string>;
    /** 层级。 */
    zIndex?: number | undefined;
    /** 是否显示引导按钮。 */
    showTourButtons?: boolean;
    /** 目标元素缺失时的处理策略：skip / stop / hide。 */
    missingStrategy?: TourMissingStrategy;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    modelValue: false,
    steps: () => [],
    current: 0,
    mask: true,
    maskColor: '',
    offset: 20,
    duration: 300,
    borderRadius: 4,
    padding: 8,
    prevText: '上一步',
    nextText: '下一步',
    skipText: '跳过',
    finishText: '完成',
    bottomSafetyOffset: 100,
    topSafetyOffset: 0,
    customNav: false,
    clickMaskNext: false,
    highlightStyle: () => ({}),
    zIndex: undefined,
    showTourButtons: true,
    missingStrategy: 'stop',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** 显隐状态变化时触发。 */
  (e: 'update:modelValue', value: boolean): void;
  /** 当前步骤变化时触发。 */
  (e: 'update:current', value: number): void;
  /** 当前步骤变化时触发。 */
  (e: 'change', payload: { current: number }): void;
  /** 点击上一步时触发。 */
  (e: 'prev', payload: TourNavPayload): void;
  /** 点击下一步时触发。 */
  (e: 'next', payload: TourNavPayload): void;
  /** 点击完成时触发。 */
  (e: 'finish', payload: { current: number; total: number }): void;
  /** 点击跳过时触发。 */
  (e: 'skip', payload: { current: number; total: number }): void;
  /** 目标元素查询失败时触发。 */
  (e: 'error', payload: { message: string; element: string }): void;
}>();

defineSlots<{
  /** 自定义引导面板内容，作用域给出当前步骤。 */
  default?(scope: { step: TourStep | undefined; current: number; total: number }): unknown;
  /** 自定义底部操作区，作用域同上。 */
  footer?(scope: { step: TourStep | undefined; current: number; total: number }): unknown;
}>();

/** Total step count — guards every index computation below. */
const total = computed(() => props.steps.length);

/** Open state: uncontrolled fallback + controlled sync. */
const innerVisible = ref(props.modelValue);
watch(
  () => props.modelValue,
  (next) => {
    innerVisible.value = next;
  },
);

/** Step cursor: uncontrolled fallback + controlled sync. */
const innerCurrent = ref(props.current);
watch(
  () => props.current,
  (next) => {
    innerCurrent.value = next;
  },
);

/** Clamped cursor so a stale index never renders an empty panel. */
const currentIndex = computed(() => {
  if (total.value === 0) return 0;
  return Math.min(Math.max(0, innerCurrent.value), total.value - 1);
});

const currentStep = computed<TourStep | undefined>(() => props.steps[currentIndex.value]);

const isLastStep = computed(() => currentIndex.value >= total.value - 1);

function setVisible(value: boolean): void {
  innerVisible.value = value;
  emit('update:modelValue', value);
}

function setCurrent(next: number): void {
  if (next === currentIndex.value) return;
  innerCurrent.value = next;
  emit('update:current', next);
  emit('change', { current: next });
}

/** Shared `prev` / `next` payload. */
function navPayload(prevCurrent: number): TourNavPayload {
  return {
    prevCurrent,
    current: currentIndex.value,
    total: total.value,
    isElementInTop: currentIndex.value === 0,
  };
}

/** Step back; a no-op on the first step (wd-tour parity). */
function handlePrev(): void {
  if (currentIndex.value === 0) return;
  const previous = currentIndex.value;
  setCurrent(currentIndex.value - 1);
  emit('prev', navPayload(previous));
}

/** Step forward; on the last step this finishes instead. */
function handleNext(): void {
  if (isLastStep.value) {
    handleFinish();
    return;
  }
  const previous = currentIndex.value;
  setCurrent(currentIndex.value + 1);
  emit('next', navPayload(previous));
}

function handleFinish(): void {
  emit('finish', { current: currentIndex.value, total: total.value });
  setVisible(false);
}

function handleSkip(): void {
  emit('skip', { current: currentIndex.value, total: total.value });
  setVisible(false);
}

/** Mask tap — opt-in step advance, never a close. */
function onMaskTap(): void {
  if (props.clickMaskNext) handleNext();
}

/** Public imperative API — mirrors wd-tour's exposed methods (§14). */
defineExpose({ handlePrev, handleNext, handleFinish, handleSkip });

const rootClass = computed(() => [
  'sn-tour',
  {
    'sn-tour--mask': props.mask,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  if (props.zIndex !== undefined) parts.push(`z-index: ${props.zIndex}`);
  if (props.duration !== 300) parts.push(`--snui-tour-duration: ${props.duration}ms`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

const maskStyle = computed(() =>
  props.maskColor ? `background-color: ${props.maskColor}` : undefined,
);

const panelStyle = computed(() => {
  const parts = [`--snui-tour-radius: ${props.borderRadius}px`];
  return parts.join('; ');
});
</script>

<template>
  <view
    v-if="modelValue"
    data-snui-component="tour"
    :class="rootClass"
    :style="rootStyle"
    role="dialog"
    aria-modal="true"
    aria-label="Guide"
  >
    <view
      v-if="mask"
      class="sn-tour__mask"
      :style="maskStyle"
      aria-hidden="true"
      @tap="onMaskTap"
    />

    <view class="sn-tour__panel" :style="panelStyle">
      <view class="sn-tour__content">
        <slot :step="currentStep" :current="currentIndex" :total="total">
          <text class="sn-tour__text">{{ currentStep?.content }}</text>
        </slot>
      </view>

      <view class="sn-tour__footer">
        <slot name="footer" :step="currentStep" :current="currentIndex" :total="total">
          <view v-if="showTourButtons" class="sn-tour__actions">
            <view
              class="sn-tour__button sn-tour__skip"
              role="button"
              :aria-label="skipText"
              @tap="handleSkip"
            >
              <text class="sn-tour__button-text">{{ skipText }}</text>
            </view>

            <view class="sn-tour__nav">
              <view
                v-if="currentIndex > 0"
                class="sn-tour__button sn-tour__prev"
                role="button"
                :aria-label="prevText"
                @tap="handlePrev"
              >
                <text class="sn-tour__button-text">{{ prevText }}</text>
              </view>
              <view
                class="sn-tour__button sn-tour__next sn-tour__button--primary"
                role="button"
                :aria-label="isLastStep ? finishText : nextText"
                @tap="handleNext"
              >
                <text class="sn-tour__button-text sn-tour__button-text--primary">
                  {{ isLastStep ? finishText : nextText }}
                </text>
              </view>
            </view>
          </view>
        </slot>
      </view>

      <text class="sn-tour__progress" aria-hidden="true">
        {{ currentIndex + 1 }} / {{ total }}
      </text>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-tour {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.sn-tour__mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-tour__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  box-sizing: border-box;
  width: 560rpx;
  max-width: 80%;
  padding: var(--sn-mp-spacing-4);
  border-radius: var(--snui-tour-radius, var(--sn-mp-radius-lg));
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  box-shadow: var(--sn-mp-shadow-lg);
}

.sn-tour__content {
  display: flex;
  width: 100%;
}

.sn-tour__text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-tour__footer {
  display: flex;
  width: 100%;
}

.sn-tour__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.sn-tour__nav {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
}

.sn-tour__button {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 64rpx;
  padding: 0 var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-tour__button:active {
  opacity: 0.7;
}

.sn-tour__button--primary {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary);
}

.sn-tour__button-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-tour__button-text--primary {
  color: var(--sn-mp-color-text-on-primary);
}

.sn-tour__skip .sn-tour__button-text {
  color: var(--sn-mp-color-text-secondary);
}

.sn-tour__progress {
  position: absolute;
  right: var(--sn-mp-spacing-4);
  bottom: var(--sn-mp-spacing-4);
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

/* Doodle skin — heavier panel outline. */
.snui-skin-doodle .sn-tour__panel {
  border: 4rpx solid var(--sn-mp-color-text-primary);
}
</style>
