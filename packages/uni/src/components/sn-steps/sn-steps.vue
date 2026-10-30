<script setup lang="ts">
/**
 * sn-steps (uni-end) — horizontal / vertical step progress indicator.
 *
 * Reference library: wot-ui `wd-steps`
 *   (https://wot-ui.cn/component/steps.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-steps 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-steps/sn-steps.vue
 * → auto-registered as `<sn-steps>` in any .vue that uses it.
 *
 * ## Who decides a step's status
 *
 * wd-step lets `status` be explicit; when it is not given, the container's
 * `active` index decides (`index < active` → finished, `=== active` →
 * process, else wait). That resolution lives in the step, not here, so a step
 * can still override it locally — see `sn-steps-types.ts`.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Additive surface (AUI-OPT-09, AGENTS.md §112.3a):
 *   - `connector` — connector line style (solid / dashed / dotted).
 *
 * Not responsible for:
 *   - 单个步骤的渲染 — 用 sn-step
 *   - 步骤之间的业务流转 — 由宿主按 `active` 驱动
 */

import { computed, provide, ref, toRef } from 'vue';
import { SN_STEPS_KEY, type SnStepConnector } from './sn-steps-types';

defineOptions({ name: 'SnSteps' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-steps` 1:1 surface ──────────────────────────────────── */

    /** 当前激活步骤下标。 */
    active?: number;
    /** 是否垂直方向展示。 */
    vertical?: boolean;
    /** 是否使用点状步骤条。 */
    dot?: boolean;
    /** 步骤条间距，默认自动计算。 */
    space?: string;
    /** 是否水平居中，只对横向步骤条有效。 */
    alignCenter?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;

    /* ── additive (AUI-OPT-09, AGENTS.md §112.3a) ───────────────────────── */

    /**
     * 连接线样式：`solid`（默认）/ `dashed`（虚线）/ `dotted`（点线）。
     * 用真实元素 + `border-style` 切换，不使用伪元素（AGENTS.md §116）。
     */
    connector?: SnStepConnector;
  }>(),
  {
    active: 0,
    vertical: false,
    dot: false,
    space: '',
    alignCenter: false,
    customClass: '',
    customStyle: '',
    connector: 'solid',
  },
);

defineSlots<{
  /** Step 列表。 */
  default?(): unknown;
}>();

/** Registered step ids in DOM order. */
const stepIds = ref<number[]>([]);

/** Number of registered steps — drives the "last step" flag. */
const stepCount = computed(() => stepIds.value.length);

function registerStep(uid: number): number {
  stepIds.value = [...stepIds.value, uid];
  return stepIds.value.length - 1;
}

function unregisterStep(uid: number): void {
  stepIds.value = stepIds.value.filter((entry) => entry !== uid);
}

provide(SN_STEPS_KEY, {
  active: toRef(props, 'active'),
  vertical: toRef(props, 'vertical'),
  dot: toRef(props, 'dot'),
  space: toRef(props, 'space'),
  alignCenter: toRef(props, 'alignCenter'),
  connector: toRef(props, 'connector'),
  registerStep,
  unregisterStep,
  stepCount,
});

const rootClass = computed(() => [
  'sn-steps',
  {
    'sn-steps--vertical': props.vertical,
    'sn-steps--horizontal': !props.vertical,
    'sn-steps--dot': props.dot,
    'sn-steps--center': props.alignCenter && !props.vertical,
  },
  props.customClass,
]);
</script>

<template>
  <view
    data-snui-component="steps"
    :class="rootClass"
    :style="customStyle || undefined"
    role="list"
  >
    <slot />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only; geometry in rpx (750 design canvas). */
.sn-steps {
  display: flex;
  width: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-steps--horizontal {
  flex-direction: row;
  align-items: flex-start;
}

.sn-steps--horizontal.sn-steps--center {
  justify-content: center;
}

.sn-steps--vertical {
  flex-direction: column;
  align-items: stretch;
}
</style>
