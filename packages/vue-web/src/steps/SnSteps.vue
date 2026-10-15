<script setup lang="ts">
/**
 * SnSteps — step/progress indicator for multi-stage flows (AUI-WEB-NAV-004).
 *
 * Reference library: naive-ui `n-steps`
 *   (https://www.naiveui.com/zh-CN/light/components/steps)
 * Per AGENTS.md §112, props + semantics mirror n-steps 1:1.
 *
 * 1:1 parity (this version): current / status / size / vertical /
 *   contentPlacement / onUpdate:current, plus the `finish-icon` and
 *   `error-icon` slots (see SnStep for the per-step surface).
 *
 * Children (`<SnStep>`) read the shared config through provide/inject, so
 * each step derives its own status from `current` + its ordinal position
 * without prop drilling.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnSteps :current="1" @update:current="onUpdate">
 *     <SnStep title="填写信息" description="基础资料" />
 *     <SnStep title="确认订单" description="核对明细" />
 *     <SnStep title="完成" description="提交成功" />
 *   </SnSteps>
 */

import { provide, toRef } from 'vue'
import {
  snStepsInjectionKey,
  type SnStepsContext,
} from './sn-steps-context'

defineOptions({ name: 'SnSteps' })

const props = withDefaults(
  defineProps<{
    /** Index of the current (active) step. 1-based, mirrors n-steps. */
    current?: number
    /** Status applied to the current step. Falls back to each step's own
     * `status` prop, then 'process'. Mirrors n-steps `status`. */
    status?: 'process' | 'finish' | 'error' | 'wait'
    /** Visual size of the indicators. Mirrors n-steps `size`. */
    size?: 'small' | 'medium'
    /** Lay the steps out vertically. Mirrors n-steps `vertical`. */
    vertical?: boolean
    /** Where the title sits relative to the indicator (horizontal only).
     * Mirrors n-steps `contentPlacement`. */
    contentPlacement?: 'right' | 'bottom'
  }>(),
  {
    current: undefined as any,
    status: 'process',
    size: 'medium',
    vertical: false,
    contentPlacement: 'right',
  },
)

const emit = defineEmits<{
  /** Current step changed (click on a clickable step). `v-model:current`. */
  (e: 'update:current', current: number): void
}>()

/** Monotonic counter backing `registerStep()`. Reset per SnSteps instance. */
let stepCounter = 0

defineSlots<{
  /** A sequence of `<SnStep>` children. */
  default?(): unknown
  /** Custom icon shown on finished steps (replaces the default check mark). */
  'finish-icon'?(): unknown
  /** Custom icon shown on errored steps (replaces the default cross). */
  'error-icon'?(): unknown
}>()

const ctx: SnStepsContext = {
  current: toRef(props, 'current'),
  status: toRef(props, 'status'),
  size: toRef(props, 'size'),
  vertical: toRef(props, 'vertical'),
  contentPlacement: toRef(props, 'contentPlacement'),
  onStepClick: (index: number) => emit('update:current', index),
  /**
   * 1-based ordinal assigned in mount order. Child steps call this during
   * their setup, which yields the same `internalIndex` n-steps assigns by
   * walking its slot vnodes — but works through injection, so `<SnStep>`
   * does not need to be a direct template child to be counted correctly.
   */
  registerStep: () => {
    stepCounter += 1
    return stepCounter
  },
}

provide(snStepsInjectionKey, ctx)

// Referenced in the template via $slots so vue-tsc keeps this file as a
// Vue SFC and emits compiled JS into dist (see SnDivider for the same note).
void ctx
</script>

<template>
  <div
    class="sn-steps"
    data-snui-component="steps"
    :class="[
      `sn-steps--${size}`,
      vertical ? 'sn-steps--vertical' : '',
      !vertical && contentPlacement === 'bottom' ? 'sn-steps--content-bottom' : '',
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-steps {
  display: flex;
  width: 100%;
  flex-direction: row;
}

/* Vertical + content-bottom stacks the steps instead of laying them out
 * along the main axis. */
.sn-steps--vertical,
.sn-steps--content-bottom {
  flex-direction: column;
}
</style>
