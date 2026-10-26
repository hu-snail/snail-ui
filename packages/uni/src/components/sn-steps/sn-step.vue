<script setup lang="ts">
/**
 * sn-step (uni-end) — one step in a `sn-steps` container.
 *
 * Reference library: wot-ui `wd-step`
 *   (https://wot-ui.cn/component/steps.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-step 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * Lives next to `sn-steps.vue` so the provide/inject contract types
 * (`sn-steps-types.ts`) stay beside both halves of the pair.
 *
 * ## Status resolution
 *
 * An explicit `status` always wins. Otherwise the container's `active` index
 * decides: steps before it are `finished`, the one at it is `process`, the
 * rest are `wait`. That keeps a plain `<sn-step title="…" />` list working
 * with nothing but `:active`.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 激活下标本身 — 由 sn-steps 持有
 *   - 步骤间流转 — 由宿主驱动
 */

import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { Check, X } from '../sn-icon/sn-icon-set';
import { nextUid } from '../../utils/uid';
import { SN_STEPS_KEY, type SnStepStatus } from './sn-steps-types';

defineOptions({ name: 'SnStep' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-step` 1:1 surface ───────────────────────────────────── */

    /** 步骤标题，不传时显示默认文案。 */
    title?: string;
    /** 步骤描述。 */
    description?: string;
    /** 步骤图标名（经 `registerSnIcons()` 注册）。 */
    icon?: string;
    /** 步骤状态：finished / process / error / wait（不传时由 active 推导）。 */
    status?: SnStepStatus | undefined;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    title: '',
    description: '',
    icon: '',
    status: undefined,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 自定义步骤图标。 */
  icon?(): unknown;
  /** 自定义步骤标题。 */
  title?(): unknown;
  /** 自定义步骤描述。 */
  description?(): unknown;
}>();

const steps = inject(SN_STEPS_KEY, null);

const uid = nextUid();

/** Index inside the container; `-1` until the mount hook has run. */
const stepIndex = ref(-1);

/** Resolved status: explicit prop wins, otherwise derived from `active`. */
const resolvedStatus = computed<SnStepStatus>(() => {
  if (props.status) return props.status;
  const active = steps?.active.value ?? 0;
  if (stepIndex.value < 0) return 'wait';
  if (stepIndex.value < active) return 'finished';
  if (stepIndex.value === active) return 'process';
  return 'wait';
});

const isLast = computed(() => {
  const count = steps?.stepCount.value ?? 0;
  return stepIndex.value >= 0 && stepIndex.value === count - 1;
});

const isVertical = computed(() => steps?.vertical.value ?? false);
const isDot = computed(() => steps?.dot.value ?? false);

/** Gap between the indicator and the next one — `space` overrides the default. */
const itemStyle = computed(() => {
  const space = steps?.space.value ?? '';
  if (!space) return undefined;
  return isVertical.value ? `padding-bottom: ${space}` : `width: ${space}`;
});

onMounted(() => {
  if (!steps) return;
  stepIndex.value = steps.registerStep(uid);
});
onBeforeUnmount(() => steps?.unregisterStep(uid));

const rootClass = computed(() => [
  'sn-step',
  `sn-step--${resolvedStatus.value}`,
  {
    'sn-step--last': isLast.value,
    'sn-step--vertical': isVertical.value,
    'sn-step--horizontal': !isVertical.value,
    'sn-step--dot': isDot.value,
  },
  props.customClass,
]);
</script>

<template>
  <view
    data-snui-component="step"
    :class="rootClass"
    :style="[customStyle || undefined, itemStyle]"
    role="listitem"
    :aria-current="resolvedStatus === 'process' ? 'step' : undefined"
  >
    <view class="sn-step__header">
      <view class="sn-step__indicator">
        <slot name="icon">
          <SnIcon v-if="resolvedStatus === 'finished' && !icon" :icon="Check" :size="24" />
          <SnIcon v-else-if="resolvedStatus === 'error' && !icon" :icon="X" :size="24" />
          <text
            v-else-if="resolvedStatus === 'wait' || resolvedStatus === 'process'"
            class="sn-step__number"
          >
            {{ stepIndex + 1 }}
          </text>
        </slot>
      </view>
      <view v-if="!isLast && !isDot" class="sn-step__line" aria-hidden="true" />
    </view>

    <view class="sn-step__content">
      <view class="sn-step__title-row">
        <slot name="title">
          <text class="sn-step__title">{{ title }}</text>
        </slot>
      </view>
      <slot name="description">
        <text v-if="description" class="sn-step__description">{{ description }}</text>
      </slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-step {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  box-sizing: border-box;
  min-width: 0;
}

.sn-step--horizontal {
  align-items: center;
}

.sn-step--vertical {
  flex-direction: row;
  align-items: flex-start;
}

.sn-step__header {
  display: flex;
  align-items: center;
  width: 100%;
}

.sn-step--vertical .sn-step__header {
  flex-direction: column;
  width: auto;
  height: 100%;
}

.sn-step__indicator {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-step--dot .sn-step__indicator {
  width: 16rpx;
  height: 16rpx;
  border: none;
  background-color: var(--sn-mp-color-border-default);
}

.sn-step--finished .sn-step__indicator {
  border-color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-step--process .sn-step__indicator {
  border-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-action-primary);
}

.sn-step--error .sn-step__indicator {
  border-color: var(--sn-mp-color-feedback-danger);
  background-color: var(--sn-mp-color-feedback-danger);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-step--dot.sn-step--finished .sn-step__indicator,
.sn-step--dot.sn-step--process .sn-step__indicator {
  background-color: var(--sn-mp-color-action-primary);
}

.sn-step--dot.sn-step--error .sn-step__indicator {
  background-color: var(--sn-mp-color-feedback-danger);
}

.sn-step__number {
  color: inherit;
  font-size: inherit;
  line-height: 1;
}

.sn-step__line {
  flex: 1 1 auto;
  height: 2rpx;
  background-color: var(--sn-mp-color-border-default);
}

.sn-step--vertical .sn-step__line {
  width: 2rpx;
  height: 100%;
  min-height: 40rpx;
}

.sn-step--finished .sn-step__line {
  background-color: var(--sn-mp-color-action-primary);
}

.sn-step--dot .sn-step__line {
  height: 2rpx;
  background-color: var(--sn-mp-color-border-subtle);
}

.sn-step__content {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  min-width: 0;
  padding: var(--sn-mp-spacing-2) 0;
}

.sn-step--vertical .sn-step__content {
  padding: 0 0 var(--sn-mp-spacing-5) var(--sn-mp-spacing-3);
}

.sn-step__title-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.sn-step__title {
  overflow: hidden;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-step--process .sn-step__title {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-step--error .sn-step__title {
  color: var(--sn-mp-color-feedback-danger);
}

.sn-step__description {
  overflow: hidden;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}

/* Doodle skin — heavier indicator ring. */
.snui-skin-doodle .sn-step__indicator {
  border-width: 4rpx;
}
</style>
