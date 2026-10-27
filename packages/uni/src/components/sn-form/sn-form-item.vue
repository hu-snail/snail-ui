<script setup lang="ts">
/**
 * sn-form-item — uni-end field wrapper (AUI-MP-004).
 *
 * Mirror of packages/vue-web/src/form/SnFormItem.vue with the same
 * rules-engine and provide/inject contract; only the rendering
 * surface is uni-shaped (view + rpx).
 */

import { computed, inject, markRaw, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import type { Ref } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveIconByName } from '../sn-icon/sn-icon-registry';
import {
  FORM_CONTEXT_KEY,
  FORM_ITEM_STATE_KEY,
  type FormContext,
  type FormItemHandle,
  type FormItemState,
  type FormRule,
  getByPath,
  setByPath,
} from './sn-form-types';
import { validateValue } from './sn-form-validator';

defineOptions({ name: 'SnFormItem' });

const props = withDefaults(
  defineProps<{
    prop?: string;
    label?: string;
    required?: boolean;
    rules?: FormRule[];
    /**
     * Show the validation message. `undefined` inherits the form-level
     * `showMessage` (withDefaults must not fill this — an explicit default
     * would shadow the form flag and make it dead).
     */
    showMessage?: boolean | undefined;
    /**
     * Render a status glyph before the validation message.
     *
     * Overrides the form-level `status-icon`; when omitted the form's value is
     * used. Declared here as well because an item may want the glyph without
     * turning it on for the whole form.
     */
    statusIcon?: boolean | undefined;
    labelWidth?: number | string;
    labelPosition?: 'left' | 'right' | 'top';
    ariaLabel?: string;
    /**
     * Optional icon data (frozen `{ viewBox, paths }`) rendered inline
     * with the label. Use `iconName` for the registry lookup path.
     */
    iconData?: IconData;
    /** Icon name resolved via the sn-icon registry. */
    iconName?: string;
    /** rpx / pixel size forwarded to the embedded sn-icon. Default 32. */
    iconSize?: number | string;

    /* ── wot-ui `wd-form-item` 1:1 parity props ────────────────────────── */

    /** Item-level size — overrides the parent SnForm's size. */
    size?: 'small' | 'medium' | 'large';
    /** Right-align the field value within the cell. */
    valueAlign?: 'left' | 'right';
    /** Override the form-level asterisk position. */
    asteriskPosition?: 'left' | 'right';
    /** Override the form-level hide-asterisk flag. */
    hideAsterisk?: boolean | undefined;
    /** Truncate long labels with ellipsis. */
    ellipsis?: boolean | undefined;
    /** Add a horizontal divider below this item. */
    border?: boolean | undefined;
    /** Override the form-level vertical center flag. */
    center?: boolean | undefined;
    /** When true, the entire row is clickable and emits `click`. */
    clickable?: boolean;
    /** Show a right arrow to indicate navigation. */
    isLink?: boolean;
    /** Placeholder shown when no input slot is provided. */
    placeholder?: string;
    /** Helper text shown below the field. */
    description?: string;
  }>(),
  {
    required: false,
    iconSize: 32,
    /* Inheritance-resolving booleans default to `undefined` so the
     * computed can distinguish 'not set' (inherit from form) from
     * 'explicitly false' via resolveBool. */
    hideAsterisk: undefined,
    border: undefined,
    center: undefined,
    ellipsis: undefined,
    statusIcon: undefined,
    showMessage: undefined,
    clickable: false,
    isLink: false,
    placeholder: '',
    description: '',
  },
);

const slots = defineSlots<{
  default?(): unknown;
  label?(): unknown;
  error?(): unknown;
  description?(): unknown;
}>();

const ctx = inject(FORM_CONTEXT_KEY, null) as FormContext | null;

const emit = defineEmits<{
  /** Fired when the row is clicked and `clickable` is true. */
  (e: 'click', event: Event): void;
}>();

/**
 * Resolve a boolean prop with `undefined`-aware inheritance semantics:
 *  - if the FormItem passed a concrete value, that wins;
 *  - else fall back to the parent SnForm's value;
 *  - else fall back to `fallback`.
 *
 * `withDefaults` cannot capture this — passing nothing looks like the
 * default `false`, not 'inherit from context'.
 */
function resolveBool(
  propValue: boolean | undefined,
  ctxValue: boolean | undefined,
  fallback = false,
): boolean {
  return propValue !== undefined ? propValue : ctxValue !== undefined ? ctxValue : fallback;
}

function onRowClick(event: Event): void {
  if (!props.clickable) return;
  emit('click', event);
}

const status = ref<'default' | 'error' | 'warning'>('default');
const message = ref<string>('');

let initialValue: unknown = undefined;

async function runValidation(): Promise<boolean> {
  if (!ctx || !props.prop) return true;
  const rules = mergedRules();
  const value = getByPath(ctx.model, props.prop);
  const result = await validateValue(value, rules);
  if (result === '') {
    status.value = 'default';
    message.value = '';
    return true;
  }
  status.value = 'error';
  message.value = result;
  return false;
}

function mergedRules(): FormRule[] {
  if (!ctx || !props.prop) return props.rules ?? [];
  const formRules = ctx.rules[props.prop] ?? [];
  return [...(props.rules ?? []), ...formRules];
}

const handle: FormItemHandle & { state?: FormItemState } = {
  prop: props.prop ?? '',
  async validate() {
    return runValidation();
  },
  resetField() {
    if (!ctx || !props.prop) return;
    setByPath(ctx.model, props.prop, initialValue as never);
    status.value = 'default';
    message.value = '';
  },
  clearValidate() {
    status.value = 'default';
    message.value = '';
  },
};

const state: FormItemState = { status, message, handle };
handle.state = state;
provide(FORM_ITEM_STATE_KEY, state);

/** The form's last registered prop; the divider is drawn on every other row.
 * Reactive on purpose: the tail moves while siblings mount / unmount. */
const formApi = inject('sn-form-api' as never, null) as {
  registerItem?: (h: FormItemHandle) => void;
  unregisterItem?: (prop: string) => void;
  lastProp?: Ref<string>;
} | null;

const isLast = computed(
  () => props.prop !== '' && formApi?.lastProp?.value === props.prop,
);

onMounted(() => {
  if (!ctx || !props.prop) return;
  initialValue = deepClone(getByPath(ctx.model, props.prop));
  formApi?.registerItem?.(handle);
});

onBeforeUnmount(() => {
  if (!ctx || !props.prop) return;
  formApi?.unregisterItem?.(props.prop);
});

const showMsg = computed(() => {
  // The form-level `showMessage` / `errorType` flags stay live: an item that
  // does not pass its own flag inherits the form, and `errorType: 'none'`
  // suppresses inline messages entirely.
  if ((ctx?.errorType ?? 'message') === 'none') return false;
  const flag = resolveBool(props.showMessage, ctx?.showMessage, true);
  return flag && message.value.length > 0;
});

/**
 * Show a status glyph next to the message.
 *
 * `statusIcon` used to be a prop that reached the context but was then
 * hard-coded to `false`, so passing it had no effect at all. It now flows
 * through: the item-level prop wins over the form-level default.
 *
 * The glyph is a plain character rather than an icon component: the form must
 * stay usable without an icon pack loaded, and a text marker needs no font.
 */
const showStatusIcon = computed<boolean>(() => {
  const flag = props.statusIcon ?? ctx?.statusIcon ?? false;
  return flag && message.value.length > 0;
});

/** Glyph for the current validation state. */
const statusGlyph = computed<string>(() => {
  // `status` is three-state here (no `success` state is produced by the
  // validator), so the glyph only needs to distinguish error from warning.
  if (status.value === 'error') return '!';
  if (status.value === 'warning') return '!';
  return '';
});

/** Resolved icon data (uni). */
const resolvedIconData = computed<IconData | null>(() => {
  const icon = props.iconData ?? (props.iconName ? resolveIconByName(props.iconName) : null);
  return icon ? markRaw(icon) : null;
});

const hasIcon = computed(() => resolvedIconData.value !== null);

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
    /* Registered-order last item replaces `:deep(.sn-form-item:last-child)`. */
    'sn-form-item--last': isLast.value,
    'sn-form-item--layout-vertical': (props.labelPosition ?? ctx?.labelPosition) !== 'top' && ctx?.layout === 'vertical',
    'sn-form-item--center': resolveBool(props.center, ctx?.center),
    'sn-form-item--ellipsis': resolveBool(props.ellipsis, ctx?.ellipsis),
    'sn-form-item--hide-asterisk': resolveBool(props.hideAsterisk, ctx?.hideAsterisk),
    'sn-form-item--clickable': !!props.clickable,
    'sn-form-item--is-link': !!props.isLink,
  },
]);

const labelStyle = computed(() => {
  const width = props.labelWidth ?? ctx?.labelWidth ?? 'auto';
  return width === 'auto'
    ? undefined
    : { width: typeof width === 'number' ? `${width}rpx` : width };
});

const gridStyle = computed(() => {
  const position = props.labelPosition ?? ctx?.labelPosition ?? 'right';
  if (position === 'top') return undefined;
  const width = props.labelWidth ?? ctx?.labelWidth ?? 'auto';
  const track = width === 'auto' ? 'auto' : typeof width === 'number' ? `${width}rpx` : width;
  return { gridTemplateColumns: `${track} 1fr` };
});

function deepClone<T>(value: T): T {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone) as unknown as T;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(value as Record<string, unknown>)) {
    out[k] = deepClone((value as Record<string, unknown>)[k]);
  }
  return out as unknown as T;
}
</script>

<template>
  <view
    :class="classes"
    :style="gridStyle"
    :data-snui-component="props.prop ? 'form-item' : 'form-item-static'"
    :data-prop="props.prop"
    :data-status="status"
    :hover-class="clickable ? 'sn-form-item--pressed' : 'none'"
    @tap="onRowClick"
  >
    <view
      v-if="props.label || slots.label"
      class="sn-form-item__label"
      :style="labelStyle"
      :aria-label="ariaLabel"
    >
      <text v-if="required" class="sn-form-item__required" aria-hidden="true">*</text>
      <SnIcon
        v-if="resolvedIconData"
        class="sn-form-item__icon"
        :icon="resolvedIconData"
        :size="iconSize ?? 32"
      />
      <slot name="label">{{ props.label }}</slot>
    </view>

    <view class="sn-form-item__control">
      <slot>
        <text v-if="placeholder && !slots.default" class="sn-form-item__placeholder">{{
          placeholder
        }}</text>
      </slot>
      <view v-if="description || slots.description" class="sn-form-item__description">
        <slot name="description">{{ description }}</slot>
      </view>
      <view
        v-if="showMsg"
        class="sn-form-item__message"
        :data-status="status"
        :aria-live="status === 'error' ? 'assertive' : 'polite'"
      >
        <!--
          Status glyph. `status-icon` used to be accepted and silently dropped;
          it now actually renders. Kept as text so no icon pack is required.
        -->
        <text
          v-if="showStatusIcon && statusGlyph !== ''"
          class="sn-form-item__status-icon"
          :data-status="status"
          aria-hidden="true"
          >{{ statusGlyph }}</text
        >
        <slot name="error">{{ message }}</slot>
      </view>
      <text v-if="isLink" class="sn-form-item__arrow">›</text>
    </view>
  </view>
</template>

<style scoped>
.sn-form-item {
  display: grid;
  gap: 12rpx;
  align-items: start;
}
.sn-form-item--left,
.sn-form-item--right {
  grid-template-columns: auto 1fr;
  align-items: center;
}
.sn-form-item--left .sn-form-item__label {
  grid-area: auto;
  text-align: left;
}
.sn-form-item--right .sn-form-item__label {
  grid-area: auto;
  text-align: right;
}
.sn-form-item--top {
  grid-template-areas: 'auto' 'auto';
}

.sn-form-item__label {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-primary);
  padding: 0 16rpx 0 0;
  line-height: 1.4;
}
.sn-form-item__required {
  color: var(--sn-mp-color-feedback-danger);
  margin-right: 4rpx;
}
/* Asterisk on the right side of the label, mirrors wd-form-item. */
.sn-form-item--asterisk-right .sn-form-item__required {
  margin-left: 4rpx;
  margin-right: 0;
}

/* Ellipsis truncate long labels. */
.sn-form-item--ellipsis .sn-form-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* Border between this item and the next. The style/color/width come from the
 * form root as variables so skins can restyle it without a `:deep()` rule. */
.sn-form-item--border {
  padding-bottom: 24rpx;
  margin-bottom: 24rpx;
  border-bottom-style: var(--sn-form-item-border-style, solid);
  border-bottom-color: var(--sn-form-item-border-color, var(--sn-mp-color-border-subtle));
  border-bottom-width: var(--sn-form-item-border-width, 2rpx);
}
.sn-form-item--border.sn-form-item--last {
  border-bottom-style: none;
  margin-bottom: 0;
}

/* Center the control column. */
.sn-form-item--center {
  align-items: center;
}

/* Vertical form layout: the form root sets the flag on the context, the item
 * binds `--layout-vertical` and stacks its own columns. */
.sn-form-item--layout-vertical {
  grid-template-columns: 1fr;
  align-items: stretch;
}
.sn-form-item--layout-vertical .sn-form-item__label {
  text-align: left;
  padding: 0;
}
.sn-form-item--layout-vertical .sn-form-item__control {
  flex-direction: column;
  align-items: stretch;
}

/* Hide asterisk on required fields. */
.sn-form-item--hide-asterisk .sn-form-item__required {
  display: none;
}

/* Clickable row. */
.sn-form-item--clickable {
  cursor: pointer;
}
/* Press feedback rides hover-class (§116.2 — App has no :active pseudo). */
.sn-form-item--pressed {
  background-color: var(--sn-mp-color-background-soft);
}

/* Inline label icon — sized via SnIcon's own rpx box. */
.sn-form-item__icon {
  margin-right: 8rpx;
  color: var(--sn-mp-color-text-secondary);
}

/* Size variants — drives default font / line-height for the control. */
.sn-form-item--size-small .sn-form-item__label {
  font-size: 24rpx;
  line-height: 56rpx;
}
.sn-form-item--size-medium .sn-form-item__label {
  font-size: 28rpx;
  line-height: 72rpx;
}
.sn-form-item--size-large .sn-form-item__label {
  font-size: 32rpx;
  line-height: 88rpx;
}

/* Right-aligned value column. */
.sn-form-item--value-align-right .sn-form-item__control {
  text-align: right;
}

/* Placeholder for cell-style items without an input. */
.sn-form-item__placeholder {
  color: var(--sn-mp-color-text-tertiary);
}

/* Description text — wot-ui parity. */
.sn-form-item__description {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
  line-height: 1.4;
}

.sn-form-item__control {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}
.sn-form-item--top .sn-form-item__control {
  flex-direction: column;
  align-items: stretch;
}

/* Right arrow for is-link rows. */
.sn-form-item__arrow {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 32rpx;
  line-height: 1;
  margin-left: auto;
  flex: 0 0 auto;
}

.sn-form-item__message {
  font-size: 24rpx;
  line-height: 1.4;
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

/* Status glyph — sits before the message text, tinted by validation state. */
.sn-form-item__status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  font-size: 20rpx;
  line-height: 1;
  flex: 0 0 auto;
  color: var(--sn-mp-color-text-on-primary);
  background: var(--sn-mp-color-text-tertiary);
}
.sn-form-item__status-icon[data-status='error'] {
  background: var(--sn-mp-color-feedback-danger);
}
.sn-form-item__status-icon[data-status='warning'] {
  background: var(--sn-mp-color-feedback-warning);
}
.sn-form-item__status-icon[data-status='success'] {
  background: var(--sn-mp-color-feedback-success);
}
.sn-form-item__message[data-status='error'] {
  color: var(--sn-mp-color-feedback-danger);
}
.sn-form-item__message[data-status='warning'] {
  color: var(--sn-mp-color-feedback-warning);
}

.sn-form-item--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Doodle skin. */
.snui-skin-doodle .sn-form-item__label {
  font-weight: 700;
  color: #1a1a1a;
}
.snui-skin-doodle .sn-form-item__message {
  font-weight: 600;
  padding: 4rpx 12rpx;
  border: 3rpx solid currentColor;
  border-radius: 12rpx 4rpx / 4rpx 12rpx;
}
</style>
