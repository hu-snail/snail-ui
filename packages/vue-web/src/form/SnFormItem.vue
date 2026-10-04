<script setup lang="ts">
/**
 * SnFormItem — web-end field wrapper (AUI-WEB-004).
 *
 * Lives inside an SnForm. Provides:
 *   - label slot
 *   - default slot (typically SnInput or similar)
 *   - error-message line below the field
 *
 * Registers itself with the parent SnForm on mount via the
 * `registerItem` helper exposed through provide/inject. Exposes its
 * imperative handle so the form can iterate validate() / resetField()
 * without DOM lookups.
 */

import { computed, inject, markRaw, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import SnIcon from '../icon/SnIcon.vue'
import {
  resolveIconByName,
  type IconComponent,
} from '../icon/sn-icon-registry'
import {
  FORM_CONTEXT_KEY,
  FORM_ITEM_STATE_KEY,
  type FormContext,
  type FormItemHandle,
  type FormItemState,
  type FormRule,
  getByPath,
  setByPath,
} from './sn-form-types'
import { validateValue } from './sn-form-validator'

defineOptions({ name: 'SnFormItem' })

const props = withDefaults(
  defineProps<{
    /** Dot-path into the form model. Matches the key in SnForm.rules. */
    prop?: string
    /** Visible field label (rendered through the `label` slot by default). */
    label?: string
    /** Marks the field as required — surfaces a * marker in the label. */
    required?: boolean
    /** Item-local rules. Merged with the parent SnForm's rules. */
    rules?: FormRule[]
    /** Show the message line. Inherits from SnForm by default. */
    showMessage?: boolean
    /** Override the form's label width for this item. */
    labelWidth?: number | string
    /** Override the form's label position for this item. */
    labelPosition?: 'left' | 'right' | 'top'
    /** Accessible label override (used when label is hidden but a11y needs an accessible name). */
    ariaLabel?: string
    /**
     * Optional icon rendered inline with the label. Accepts an icon
     * component (e.g. lucide-vue-next) directly. Use `iconName` for
     * the registry lookup path.
     */
    icon?: IconComponent
    /** Icon name resolved via the SnIcon registry. */
    iconName?: string
    /** Pixel / CSS size forwarded to the embedded SnIcon. Default 14. */
    iconSize?: number | string

    /* ── wot-ui `wd-form-item` 1:1 parity props ────────────────────────── */

    /** Item-level size — overrides the parent SnForm's size. */
    size?: 'small' | 'medium' | 'large'
    /** Right-align the field value within the cell. */
    valueAlign?: 'left' | 'right'
    /** Override the form-level asterisk position for required fields. */
    asteriskPosition?: 'left' | 'right'
    /** Override the form-level hide-asterisk flag. */
    hideAsterisk?: boolean | undefined
    /** Truncate long labels with ellipsis (mirrors `wd-form-item ellipsis`). */
    ellipsis?: boolean | undefined
    /** Add a horizontal divider below this item. */
    border?: boolean | undefined
    /** Override the form-level vertical center flag. */
    center?: boolean | undefined
    /** When true, the entire row is clickable and emits `click`. */
    clickable?: boolean
    /** Show a right arrow to indicate navigation. */
    isLink?: boolean
    /** Placeholder shown when the row contains no input (Cell-style). */
    placeholder?: string
    /** Helper text shown below the field (independent of validation message). */
    description?: string
  }>(),
  {
    showMessage: true,
    required: false,
    iconSize: 14,
    /* Inheritance-resolving booleans (border / center / ellipsis /
     * hideAsterisk) default to `undefined` so the computed can
     * distinguish "not set" (inherit from parent form) from
     * "explicitly false" via `resolveBool`. */
    hideAsterisk: undefined,
    border: undefined,
    center: undefined,
    ellipsis: undefined,
    clickable: false,
    isLink: false,
    placeholder: '',
    description: '',
  },
)

const emit = defineEmits<{
  /** Fired when the row is clicked and `clickable` is true. */
  (e: 'click', event: MouseEvent): void
}>()

const slots = defineSlots<{
  /** Default — the input element(s) for this field. */
  default?(): unknown
  /** Custom label content. Falls back to the `label` prop. */
  label?(): unknown
  /** Custom error / warning message content. */
  error?(): unknown
  /** Custom description content. Falls back to the `description` prop. */
  description?(): unknown
}>()

function onRowClick(event: MouseEvent): void {
  if (!props.clickable) return
  emit('click', event)
}

const ctx = inject(FORM_CONTEXT_KEY, null) as FormContext | null

/**
 * Resolve a boolean prop with a `undefined` form-inheritance semantics:
 *  - if the FormItem passed a concrete value, that wins;
 *  - else fall back to the parent SnForm's value;
 *  - else fall back to the explicit `fallback`.
 *
 * `withDefaults` cannot capture this — passing nothing looks like the
 * default `false`, not "inherit from context" — so we filter explicitly.
 */
function resolveBool(
  propValue: boolean | undefined,
  ctxValue: boolean | undefined,
  fallback = false,
): boolean {
  return propValue !== undefined ? propValue : ctxValue !== undefined ? ctxValue : fallback
}

/** Reactive error / warning state for this item. */
const status = ref<'default' | 'error' | 'warning'>('default')
const message = ref<string>('')

/** Initial value snapshot — used by `resetField()`. */
let initialValue: unknown = undefined

async function runValidation(): Promise<boolean> {
  if (!ctx || !props.prop) return true
  const rules = mergedRules()
  const value = getByPath(ctx.model, props.prop)
  const result = await validateValue(value, rules)
  if (result === '') {
    status.value = 'default'
    message.value = ''
    return true
  }
  status.value = 'error'
  message.value = result
  return false
}

function mergedRules(): FormRule[] {
  if (!ctx || !props.prop) return props.rules ?? []
  const formRules = ctx.rules[props.prop] ?? []
  return [...(props.rules ?? []), ...formRules]
}

const handle: FormItemHandle & { state?: FormItemState } = {
  prop: props.prop ?? '',
  async validate() {
    return runValidation()
  },
  resetField() {
    if (!ctx || !props.prop) return
    setByPath(ctx.model, props.prop, initialValue as never)
    status.value = 'default'
    message.value = ''
  },
  clearValidate() {
    status.value = 'default'
    message.value = ''
  },
}

// Wire state up so the parent can read it during validate().
const state: FormItemState = { status, message, handle }
handle.state = state
provide(FORM_ITEM_STATE_KEY, state)

// Register with the parent form (consume form's exposed API via a
// provide-key based event channel — see notes in SnForm.vue).
onMounted(() => {
  if (!ctx || !props.prop) return
  initialValue = deepClone(getByPath(ctx.model, props.prop))
  // Reach the form via the FormContext — the form has attached itself
  // via a side-channel provide.
  const form = (inject('sn-form-api' as never, null) as {
    registerItem?: (h: FormItemHandle) => void
  } | null)
  form?.registerItem?.(handle)
})

onBeforeUnmount(() => {
  if (!ctx || !props.prop) return
  const form = (inject('sn-form-api' as never, null) as {
    unregisterItem?: (prop: string) => void
  } | null)
  form?.unregisterItem?.(props.prop)
})

const showMsg = computed(() => {
  if (!ctx) return props.showMessage && message.value.length > 0
  const flag = props.showMessage !== undefined ? props.showMessage : ctx.showMessage
  return flag && message.value.length > 0
})

/** Resolved icon component (web). */
const resolvedIcon = computed<IconComponent | null>(() => {
  const icon = props.icon ?? (props.iconName ? resolveIconByName(props.iconName) : null)
  return icon ? markRaw(icon) : null
})

const hasIcon = computed(() => resolvedIcon.value !== null)

const classes = computed(() => [
  'sn-form-item',
  `sn-form-item--${props.labelPosition ?? ctx?.labelPosition ?? 'right'}`,
  `sn-form-item--status-${status.value}`,
  `sn-form-item--size-${props.size ?? ctx?.size ?? 'medium'}`,
  `sn-form-item--value-align-${props.valueAlign ?? ctx?.valueAlign ?? 'left'}`,
  `sn-form-item--asterisk-${props.asteriskPosition ?? ctx?.asteriskPosition ?? 'left'}`,
  {
    'sn-form-item--required': !!props.required,
    'sn-form-item--disabled': !!ctx?.disabled,
    'sn-form-item--with-icon': hasIcon.value,
    'sn-form-item--border': resolveBool(props.border, ctx?.border),
    'sn-form-item--center': resolveBool(props.center, ctx?.center),
    'sn-form-item--ellipsis': resolveBool(props.ellipsis, ctx?.ellipsis),
    'sn-form-item--hide-asterisk': resolveBool(props.hideAsterisk, ctx?.hideAsterisk),
    'sn-form-item--clickable': !!props.clickable,
    'sn-form-item--is-link': !!props.isLink,
  },
])

const labelStyle = computed(() => {
  const width = props.labelWidth ?? ctx?.labelWidth ?? 'auto'
  return width === 'auto' ? undefined : { width: typeof width === 'number' ? `${width}px` : width }
})

/**
 * Grid track width for the label column. `auto` lets the column hug
 * content (good for short labels); any explicit value (number = px,
 * string = CSS length) pins the column. Both `labelPosition: left` and
 * `labelPosition: right` consume this — without it the label column
 * is sized by the longest label across all items, which makes the
 * field column ragged.
 */
const gridStyle = computed(() => {
  const position = props.labelPosition ?? ctx?.labelPosition ?? 'right'
  if (position === 'top') return undefined
  const width = props.labelWidth ?? ctx?.labelWidth ?? 'auto'
  const track = width === 'auto' ? 'auto' : typeof width === 'number' ? `${width}px` : width
  return { gridTemplateColumns: `${track} 1fr` }
})

function deepClone<T>(value: T): T {
  if (value === null || value === undefined) return value
  if (typeof value !== 'object') return value
  if (Array.isArray(value)) return value.map(deepClone) as unknown as T
  const out: Record<string, unknown> = {}
  for (const k of Object.keys(value as Record<string, unknown>)) {
    out[k] = deepClone((value as Record<string, unknown>)[k])
  }
  return out as unknown as T
}
</script>

<template>
  <div
    :class="classes"
    :style="gridStyle"
    :data-snui-component="props.prop ? 'form-item' : 'form-item-static'"
    :data-prop="props.prop"
    :data-status="status"
    @click="onRowClick"
  >
    <label
      v-if="props.label || slots.label"
      class="sn-form-item__label"
      :style="labelStyle"
      :aria-label="ariaLabel"
    >
      <span v-if="required" class="sn-form-item__required" aria-hidden="true">*</span>
      <SnIcon
        v-if="resolvedIcon"
        class="sn-form-item__icon"
        :icon="resolvedIcon"
        :size="iconSize ?? 14"
      />
      <slot name="label">{{ props.label }}</slot>
    </label>

    <div class="sn-form-item__control">
      <slot>
        <span v-if="placeholder && !$slots.default" class="sn-form-item__placeholder">{{ placeholder }}</span>
      </slot>
      <p
        v-if="description || slots.description"
        class="sn-form-item__description"
      >
        <slot name="description">{{ description }}</slot>
      </p>
      <p
        v-if="showMsg"
        class="sn-form-item__message"
        :data-status="status"
        :aria-live="status === 'error' ? 'assertive' : 'polite'"
      >
        <slot name="error">{{ message }}</slot>
      </p>
      <span v-if="isLink" class="sn-form-item__arrow">›</span>
    </div>
  </div>
</template>

<style scoped>
.sn-form-item {
  display: grid;
  gap: 6px;
  align-items: start;
}
.sn-form-item--left,
.sn-form-item--right {
  grid-template-columns: auto 1fr;
  align-items: center;
}
.sn-form-item--left { grid-template-areas: 'label control'; }
.sn-form-item--right { grid-template-areas: 'label control'; }
.sn-form-item--left .sn-form-item__label { grid-area: label; text-align: left; }
.sn-form-item--right .sn-form-item__label { grid-area: label; text-align: right; }
.sn-form-item--top { grid-template-areas: 'label' 'control'; }
.sn-form-item--top .sn-form-item__label { grid-area: label; }

.sn-form-item__label {
  font-size: 13px;
  color: var(--sn-web-color-text-primary);
  padding: 0 8px 0 0;
  line-height: 32px;
}
.sn-form-item--top .sn-form-item__label {
  line-height: 1.4;
  padding: 0 0 4px;
}
.sn-form-item__required {
  color: var(--sn-web-color-feedback-danger);
  margin-right: 2px;
}
/* Asterisk on the right side of the label, mirrors wd-form-item. */
.sn-form-item--asterisk-right .sn-form-item__required {
  margin-left: 4px;
  margin-right: 0;
}

/* Ellipsis truncate long labels. */
.sn-form-item--ellipsis .sn-form-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Border between this item and the next. */
.sn-form-item--border {
  border-bottom: 1px solid var(--sn-web-color-border-subtle, rgba(0, 0, 0, 0.06));
  padding-bottom: 12px;
  margin-bottom: 12px;
}

/* Center the control column. */
.sn-form-item--center { align-items: center; }

/* Hide asterisk on required fields. */
.sn-form-item--hide-asterisk .sn-form-item__required { display: none; }

/* Clickable row — visual affordance only; click handler is on the root. */
.sn-form-item--clickable {
  cursor: pointer;
}
.sn-form-item--clickable:hover {
  background-color: var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.02));
}

/* Inline label icon — Sized via the SnIcon's own `1em` box, so it
 * inherits the label's font-size (13px) cleanly. */
.sn-form-item__icon {
  margin-right: 4px;
  color: var(--sn-web-color-text-secondary);
}

/* Size variants — drives default font / line-height for the control. */
.sn-form-item--size-small .sn-form-item__label { font-size: 12px; line-height: 28px; }
.sn-form-item--size-medium .sn-form-item__label { font-size: 13px; line-height: 32px; }
.sn-form-item--size-large .sn-form-item__label { font-size: 15px; line-height: 40px; }

/* Right-aligned value column. */
.sn-form-item--value-align-right .sn-form-item__control { text-align: right; }

/* Placeholder for cell-style items without an input. */
.sn-form-item__placeholder {
  color: var(--sn-web-color-text-tertiary);
}

/* Description text — wot-ui parity. */
.sn-form-item__description {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
  line-height: 1.4;
}

.sn-form-item__control {
  grid-area: control;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  min-width: 0;
}
.sn-form-item--top .sn-form-item__control {
  flex-direction: column;
  align-items: stretch;
}

/* Right arrow for is-link rows. */
.sn-form-item__arrow {
  color: var(--sn-web-color-text-tertiary);
  font-size: 18px;
  line-height: 1;
  margin-left: auto;
  flex: 0 0 auto;
}

.sn-form-item__message {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  flex: 1 1 100%;
}
.sn-form-item__message[data-status="error"] {
  color: var(--sn-web-color-feedback-danger);
}
.sn-form-item__message[data-status="warning"] {
  color: var(--sn-web-color-feedback-warning);
}

.sn-form-item--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>