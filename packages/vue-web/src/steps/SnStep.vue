<script setup lang="ts">
/**
 * SnStep — one step inside `<SnSteps>` (AUI-WEB-NAV-004).
 *
 * Reference library: naive-ui `n-step`
 *   (https://www.naiveui.com/zh-CN/light/components/steps)
 * Per AGENTS.md §112, props + semantics mirror n-step 1:1.
 *
 * 1:1 parity (this version): status / title / description / disabled, plus
 *   the `default`, `icon` and `title` slots.
 *
 * Status resolution mirrors n-step exactly:
 *   1. explicit `status` prop wins;
 *   2. otherwise derived from the parent `current`: index < current →
 *      'finish', index === current → parent `status`, index > current →
 *      'wait'.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnSteps :current="1">
 *     <SnStep title="填写信息" description="基础资料" />
 *   </SnSteps>
 */

import { computed, inject } from 'vue'
import { Check, X } from 'lucide-vue-next'
import SnIcon from '../icon/SnIcon.vue'
import { snStepsInjectionKey } from './sn-steps-context'

defineOptions({ name: 'SnStep' })

const props = withDefaults(
  defineProps<{
    /** Explicit status override. When omitted the status is derived from
     * the parent `SnSteps` `current` index. Mirrors n-step `status`. */
    status?: 'process' | 'finish' | 'error' | 'wait'
    /** Step title text. Mirrors n-step `title`. */
    title?: string
    /** Step description text. Mirrors n-step `description`. */
    description?: string
    /** Disable interaction (no click, dimmed). Mirrors n-step `disabled`. */
    disabled?: boolean
  }>(),
  {
    status: undefined as any,
    title: '',
    description: '',
    disabled: false,
  },
)

defineSlots<{
  /** Step body — overrides the `description` prop when provided. */
  default?(): unknown
  /** Indicator content — overrides the index number / status icon. */
  icon?(): unknown
  /** Step title — overrides the `title` prop. */
  title?(): unknown
}>()

const injected = inject(snStepsInjectionKey, null)

if (!injected) {
  throw new Error(
    '[snui] SnStep must be placed inside SnSteps (missing sn-steps context).',
  )
}

// Re-bind after the guard: TS does not preserve the null-narrowing of
// `injected` inside the closures below, so `steps` is a fresh non-null const.
const steps = injected

/**
 * Ordinal position of this step. SnStep children register in mount order
 * via a parent-provided counter, matching n-steps' `internalIndex`.
 */
const internalIndex = steps.registerStep()

const mergedStatus = computed<'process' | 'finish' | 'error' | 'wait'>(() => {
  if (props.status) return props.status
  const current = steps.current.value
  if (current === undefined) return 'process'
  if (internalIndex < current) return 'finish'
  if (internalIndex === current) return steps.status.value || 'process'
  return 'wait'
})

const isClickable = computed(() => !props.disabled && !!steps.current.value)

function handleClick() {
  if (props.disabled) return
  steps.onStepClick(internalIndex)
}
</script>

<template>
  <div
    class="sn-step"
    data-snui-component="step"
    :class="[
      `sn-step--${mergedStatus}-status`,
      disabled ? 'sn-step--disabled' : '',
      isClickable ? 'sn-step--clickable' : '',
      $slots.default || description ? 'sn-step--show-description' : '',
    ]"
    @click="handleClick"
  >
    <!-- Vertical / content-right: indicator and content sit side by side. -->
    <div v-if="steps.vertical.value" class="sn-step__indicator">
      <div class="sn-step__indicator-slot">
        <slot name="icon">
          <SnIcon
            v-if="mergedStatus === 'finish' || mergedStatus === 'error'"
            :icon="mergedStatus === 'finish' ? Check : X"
            class="sn-step__status-icon"
          />
          <span v-else class="sn-step__index">{{ internalIndex }}</span>
        </slot>
      </div>
      <div class="sn-step__splitor" />
    </div>

    <!-- Horizontal + contentPlacement="bottom": line row above content. -->
    <template v-else-if="steps.contentPlacement.value === 'bottom'">
      <div class="sn-step__line">
        <div class="sn-step__indicator sn-step__indicator--row">
          <div class="sn-step__indicator-slot">
            <slot name="icon">
              <SnIcon
                v-if="mergedStatus === 'finish' || mergedStatus === 'error'"
                :icon="mergedStatus === 'finish' ? Check : X"
                class="sn-step__status-icon"
              />
              <span v-else class="sn-step__index">{{ internalIndex }}</span>
            </slot>
          </div>
        </div>
        <div class="sn-step__splitor" />
      </div>
    </template>

    <!-- Horizontal + contentPlacement="right": circle first, then content;
         the connector line lives inside the content header, right after the
         title (naive-ui DOM form). -->
    <template v-else>
      <div class="sn-step__indicator sn-step__indicator--row">
        <div class="sn-step__indicator-slot">
          <slot name="icon">
            <SnIcon
              v-if="mergedStatus === 'finish' || mergedStatus === 'error'"
              :icon="mergedStatus === 'finish' ? Check : X"
              class="sn-step__status-icon"
            />
            <span v-else class="sn-step__index">{{ internalIndex }}</span>
          </slot>
        </div>
      </div>
    </template>

    <div class="sn-step__content">
      <div class="sn-step__content-header">
        <div class="sn-step__content-header-title">
          <slot name="title">{{ title }}</slot>
        </div>
        <!-- Connector line after the title, horizontal + content-right only
             (naive-ui: `!vertical && contentPlacement === 'right'`). -->
        <div
          v-if="!steps.vertical.value && steps.contentPlacement.value === 'right'"
          class="sn-step__splitor sn-step__splitor--inline"
        />
      </div>
      <div v-if="$slots.default || description" class="sn-step__content-description">
        <slot>{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-step {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: flex-start;
  box-sizing: border-box;
}

.sn-step--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.sn-step--clickable {
  cursor: pointer;
}

.sn-step--clickable:hover .sn-step__content-header-title {
  color: var(--sn-web-color-action-primary);
}

/* ---------- Indicator ---------- */

.sn-step__indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sn-step__indicator--row {
  flex-direction: row;
  align-items: center;
  flex: none;
}

.sn-step__indicator-slot {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 50%;
  font-size: 13px;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.sn-step__index {
  line-height: 1;
  color: var(--sn-web-color-text-secondary);
}

.sn-step__status-icon {
  color: currentColor;
}

/* ---------- Splitor (connector line) ---------- */

.sn-step__splitor {
  flex: 1;
  background: var(--sn-web-color-border-default);
}

/* Inline splitor: sits in the content header after the title and fills the
 * remaining row (naive-ui: height 1px, margin 0 12px). */
.sn-step__content-header > .sn-step__splitor--inline {
  height: 1px;
  margin: 0 12px;
}

/* The last step has nothing to connect to (naive-ui `:last-child`). */
.sn-step:last-child .sn-step__splitor {
  display: none;
}

.sn-step__indicator > .sn-step__splitor {
  width: 1px;
  min-height: 32px;
  margin: 8px 0;
}

.sn-step__line > .sn-step__splitor {
  height: 1px;
  margin: 0 12px;
  align-self: center;
}

/* ---------- Content ---------- */

.sn-step__content {
  flex: 1;
  min-width: 0;
}

/* Title row: the title never wraps (naive-ui `white-space: nowrap;
 * flex: 0`); the connector line fills the rest of the row. The 9px inset
 * mirrors naive-ui's content-header margin-left against the indicator. */
.sn-step__content-header {
  display: flex;
  align-items: center;
  margin-left: 9px;
}

.sn-step__content-header-title {
  flex: none;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: var(--sn-web-color-text-primary);
}

.sn-step__content-description {
  margin-top: 2px;
  margin-left: 9px;
  font-size: 13px;
  line-height: 20px;
  color: var(--sn-web-color-text-secondary);
}

/* ---------- Status modifiers ---------- */

.sn-step--process-status .sn-step__indicator-slot {
  border-color: var(--sn-web-color-action-primary);
  background: var(--sn-web-color-action-primary);
}

.sn-step--process-status .sn-step__index {
  color: var(--sn-web-color-text-on-primary);
}

.sn-step--process-status .sn-step__content-header-title {
  color: var(--sn-web-color-action-primary);
  font-weight: 600;
}

.sn-step--finish-status .sn-step__indicator-slot {
  border-color: var(--sn-web-color-action-primary);
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
}

.sn-step--finish-status .sn-step__splitor {
  background: var(--sn-web-color-action-primary);
}

.sn-step--error-status .sn-step__indicator-slot {
  border-color: var(--sn-web-color-feedback-danger);
  background: var(--sn-web-color-feedback-danger);
  color: var(--sn-web-color-text-on-primary);
}

.sn-step--error-status .sn-step__content-header-title {
  color: var(--sn-web-color-feedback-danger);
}

.sn-step--wait-status .sn-step__indicator-slot {
  border-color: var(--sn-web-color-border-default);
  background: transparent;
}

.sn-step--wait-status .sn-step__content-header-title {
  color: var(--sn-web-color-text-secondary);
}

/* ---------- Sizes ---------- */

.sn-steps--small .sn-step__indicator-slot {
  width: 20px;
  height: 20px;
  font-size: 12px;
}

.sn-steps--small .sn-step__content-header-title {
  font-size: 13px;
  line-height: 20px;
}

.sn-steps--small .sn-step__content-description {
  font-size: 12px;
  line-height: 18px;
}

/* ---------- Vertical layout ---------- */

.sn-steps--vertical .sn-step {
  flex-direction: row;
}

.sn-steps--vertical .sn-step__content {
  padding-bottom: 16px;
}

/* ---------- Content-bottom layout ---------- */

.sn-steps--content-bottom .sn-step {
  flex-direction: column;
}

.sn-steps--content-bottom .sn-step__line {
  display: flex;
  width: 100%;
  align-items: center;
}

.sn-steps--content-bottom .sn-step__indicator-slot {
  flex: none;
}

.sn-steps--content-bottom .sn-step__content {
  padding-top: 8px;
}

/* The 9px header/description inset is a content-right + vertical affordance;
 * under content-bottom the text aligns flush with the indicator column
 * (naive-ui overrides margin-left to 0 the same way). */
.sn-steps--content-bottom .sn-step__content-header,
.sn-steps--content-bottom .sn-step__content-description {
  margin-left: 0;
}
</style>
