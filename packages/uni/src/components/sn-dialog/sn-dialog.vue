<script setup lang="ts">
/**
 * sn-dialog (uni-end) — modal alert / confirm / prompt box for mobile.
 *
 * Reference library: wot-ui `wd-dialog`
 *   (https://wot-ui.cn/component/dialog.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-dialog 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-dialog/sn-dialog.vue
 * → auto-registered as `<sn-dialog>` in any .vue that uses it.
 *
 * ## Component-style only (function API not implemented)
 *
 * wd-dialog ships a function API (`useDialog().confirm(...)`) that mounts its
 * own instance. uni-app has no reliable programmatic mount point on every
 * target, so this round exposes the component form only:
 *
 *   <sn-dialog v-model="visible" type="confirm" title="删除" msg="…"
 *              @confirm="onConfirm" @cancel="onCancel" />
 *
 * The function-style helpers (`show` / `alert` / `confirm` / `prompt` /
 * `close`) are documented as "未实现".
 *
 * ## Documented divergences from wd-dialog
 *
 *   - `root-portal` is not implemented (no portal host on miniprogram).
 *   - `selector` is accepted for API parity but has no effect in the
 *     component form (there is no global instance registry).
 *   - `iconProps` / `inputProps` / `textareaProps` are `Record<string, unknown>`
 *     passthroughs to sn-icon / sn-input / sn-textarea instead of typed
 *     `Partial<IconProps>` (the uni-end components take their own prop types).
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 * No schema validation; no business logic.
 *
 * Not responsible for:
 *   - 底部动作面板 — 用 sn-action-sheet
 *   - 通用弹层 / 位置动画 — 用 sn-popup
 *   - 轻提示（无按钮）— 用 sn-toast / sn-notify
 */
import { resolveFeedbackIcon } from '../sn-icon/sn-icon-feedback'

import { computed, markRaw, ref, watch } from 'vue'
import SnButton from '../sn-button/sn-button.vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'
import { X as XIcon } from '../sn-icon/sn-icon-set'
import SnInput from '../sn-input/sn-input.vue'
import SnPopup from '../sn-popup/sn-popup.vue'
import SnTextarea from '../sn-textarea/sn-textarea.vue'

defineOptions({ name: 'SnDialog' })

/** Dialog flavour. Mirrors `wd-dialog` `type`. */
type DialogType = 'alert' | 'confirm' | 'prompt'

/** Button style. Mirrors `wd-dialog` `theme`. */
type DialogTheme = 'button' | 'text'

/** Action button arrangement. Mirrors `wd-dialog` `action-layout`. */
type DialogActionLayout = 'horizontal' | 'vertical'

/**
 * Button option. Mirrors `wd-dialog` `confirm-button-props` /
 * `cancel-button-props`: a string is the button label, an object is spread
 * onto the inner sn-button, `null` hides the button.
 */
type DialogButtonOption = string | Record<string, unknown> | null

/** One custom action row (`wd-dialog` `actions` entry). */
interface DialogAction {
  /** Button label. */
  name?: string
  /** Button text color. */
  color?: string
  /** Disable the row. */
  disabled?: boolean
}

/** `confirm` payload — `inputValue` is only meaningful for `type="prompt"`. */
interface DialogConfirmPayload {
  action: 'confirm'
  inputValue: string | number
}

const props = withDefaults(
  defineProps<{
    /** Whether the dialog is visible (v-model). Component-form counterpart of `useDialog().show()`. */
    modelValue?: boolean
    /** Title text. */
    title?: string
    /** Message body text. */
    msg?: string
    /** Dialog flavour: `alert` (one button), `confirm` (two), `prompt` (two + input). */
    type?: DialogType
    /** Button style: filled buttons or borderless text buttons. */
    theme?: DialogTheme
    /** Stacking level of the dialog. */
    zIndex?: number
    /** Defer body rendering until the dialog is first opened. */
    lazyRender?: boolean
    /** Full-width image above the body. */
    headerImage?: string
    /** Status icon: `success` / `info` / `warning` / `danger`, or a registry icon name. */
    icon?: string
    /** Status icon color (any CSS color value). */
    iconColor?: string
    /** Props forwarded to the inner sn-icon. */
    iconProps?: Record<string, unknown>
    /** Initial value of the prompt input. */
    inputValue?: string | number
    /** Props forwarded to the inner sn-input (prompt mode). */
    inputProps?: Record<string, unknown>
    /** When non-empty, prompt mode renders sn-textarea instead of sn-input. */
    textareaProps?: Record<string, unknown>
    /** Regexp the prompt value must match. */
    inputPattern?: RegExp | undefined
    /** Function validator — return `true`, or a message / `false` on failure. */
    inputValidate?: ((inputValue: string | number) => boolean | string) | undefined
    /** Fallback message shown when prompt validation fails. */
    inputError?: string
    /** Show the validation message under the input. */
    showErr?: boolean
    /** Action button arrangement. */
    actionLayout?: DialogActionLayout
    /** Show the cancel button. Defaults to `false` for `alert`, `true` otherwise. */
    showCancelButton?: boolean | undefined
    /** Confirm button label. */
    confirmButtonText?: string
    /** Cancel button label. */
    cancelButtonText?: string
    /** Confirm button option (label / extra props / `null` to hide). */
    confirmButtonProps?: DialogButtonOption
    /** Cancel button option (label / extra props / `null` to hide). */
    cancelButtonProps?: DialogButtonOption | undefined
    /** Custom action rows; when set they replace the confirm / cancel buttons. */
    actions?: DialogAction[]
    /** Close when the scrim is tapped. */
    closeOnClickModal?: boolean
    /** Show the close button in the top-right corner. */
    showClose?: boolean
    /** Guard before confirming — return `false` (or resolve `false`) to veto. */
    beforeConfirm?: (() => boolean | Promise<boolean>) | undefined
    /** Instance id used by the function API (parity only, no effect here). */
    selector?: string
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the panel. */
    customStyle?: string
    /**
     * Accepted for wot-ui parity, NOT implemented — miniprogram has no portal
     * host, so the layer cannot leave the page's document flow.
     */
    rootPortal?: boolean
  }>(),
  {
    modelValue: false,
    title: '',
    msg: '',
    type: 'alert',
    theme: 'button',
    zIndex: 99,
    lazyRender: true,
    headerImage: '',
    icon: '',
    iconColor: '',
    iconProps: () => ({}),
    inputValue: '',
    inputProps: () => ({}),
    textareaProps: () => ({}),
    inputPattern: undefined,
    inputValidate: undefined,
    inputError: '',
    showErr: false,
    actionLayout: 'horizontal',
    showCancelButton: undefined,
    confirmButtonText: '',
    cancelButtonText: '',
    confirmButtonProps: () => ({}),
    cancelButtonProps: undefined,
    actions: () => [],
    closeOnClickModal: false,
    showClose: false,
    beforeConfirm: undefined,
    selector: '',
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
)

defineSlots<{
  /** Custom header area, above everything else. */
  header?(): unknown
  /** Custom image area (replaces `headerImage`). */
  image?(): unknown
  /** Custom title area. Replaces the icon + title block. */
  title?(props: { icon: IconData | null; title: string; iconProps: Record<string, unknown> }): unknown
  /** Custom body area. Replaces `msg` and the prompt field. */
  default?(props: {
    msg: string
    type: DialogType
    inputValue: string | number
    showErr: boolean
    inputError: string
  }): unknown
  /** Custom action area. Replaces the button row. */
  actions?(props: { confirm: () => void; cancel: () => void; close: () => void }): unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:inputValue', value: string | number): void
  (e: 'confirm', payload: DialogConfirmPayload): void
  (e: 'cancel'): void
  (e: 'close'): void
  (e: 'select', payload: { item: DialogAction; index: number }): void
}>()

/**
 * Status glyphs come from the shared feedback icon table
 * (AGENTS.md §113: inline SVG paths, never emoji). A registry lookup still
 * wins so an app can override `icon` with its own icon pack.
 */

/** v-model proxy over the popup. */
const visible = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

/** Prompt value, kept in sync with the `inputValue` prop. */
const currentInput = ref<string | number>(props.inputValue)
watch(() => props.inputValue, (value) => {
  currentInput.value = value
})

/** Validation message currently displayed. */
const currentInputError = ref('')
/** A confirm guard is running (blocks double taps). */
const isConfirming = ref(false)

const statusIcon = computed<IconData | null>(() => {
  if (!props.icon) return null
  const registry = resolveIconByName(props.icon)
  if (registry) return markRaw(registry)
  return resolveFeedbackIcon(props.icon)
})

const iconStyle = computed(() => (props.iconColor ? `color: ${props.iconColor}` : undefined))

/** Cancel button visibility — `alert` hides it unless overridden. */
const showsCancel = computed(() => props.showCancelButton ?? props.type !== 'alert')

/** Resolve a button option into `{ label, props, visible }`. */
function resolveButtonOption(
  option: DialogButtonOption | undefined,
  fallbackLabel: string,
  visible: boolean,
): { label: string; attrs: Record<string, unknown>; visible: boolean } {
  if (option === null) return { label: '', attrs: {}, visible: false }
  if (typeof option === 'string') return { label: option || fallbackLabel, attrs: {}, visible }
  return { label: fallbackLabel, attrs: option ?? {}, visible }
}

const confirmButton = computed(() =>
  resolveButtonOption(props.confirmButtonProps, props.confirmButtonText || '确定', true),
)
const cancelButton = computed(() =>
  resolveButtonOption(props.cancelButtonProps, props.cancelButtonText || '取消', showsCancel.value),
)

/** Prompt mode renders the multi-line field when `textareaProps` is populated. */
const usesTextarea = computed(() => Object.keys(props.textareaProps).length > 0)

/** Run the prompt validators. Returns `true` when the value is acceptable. */
function validateInput(): boolean {
  const value = currentInput.value
  if (props.inputPattern && !props.inputPattern.test(String(value))) {
    currentInputError.value = props.inputError
    return false
  }
  if (props.inputValidate) {
    const result = props.inputValidate(value)
    if (result !== true) {
      currentInputError.value = typeof result === 'string' ? result : props.inputError
      return false
    }
  }
  currentInputError.value = ''
  return true
}

function onInputChange(value: string | number): void {
  currentInput.value = value
  emit('update:inputValue', value)
  // Clear a stale validation message as soon as the user edits the value.
  if (currentInputError.value) currentInputError.value = ''
}

/** Close request: sync v-model + emit `close`. */
function requestClose(): void {
  emit('update:modelValue', false)
  emit('close')
}

async function handleConfirm(): Promise<void> {
  if (isConfirming.value) return
  if (props.type === 'prompt' && !validateInput()) return
  if (props.beforeConfirm) {
    isConfirming.value = true
    let allowed = false
    try {
      allowed = await props.beforeConfirm()
    } finally {
      isConfirming.value = false
    }
    if (!allowed) return
  }
  emit('confirm', { action: 'confirm', inputValue: currentInput.value })
  requestClose()
}

function handleCancel(): void {
  emit('cancel')
  requestClose()
}

function onCloseTap(): void {
  requestClose()
}

function onActionTap(item: DialogAction, index: number): void {
  if (item.disabled) return
  emit('select', { item, index })
  requestClose()
}

const popupClass = computed(() => ['sn-dialog', props.customClass].filter(Boolean).join(' '))

/**
 * Non-undefined views of the props the template forwards into child props /
 * slot props. `withDefaults` narrows the runtime value, but the template still
 * types a bare prop identifier as `T | undefined`; passing that into a child
 * prop declared `T` trips `exactOptionalPropertyTypes`.
 */
const titleText = computed(() => props.title)
const msgText = computed(() => props.msg)
const dialogType = computed(() => props.type)
const showsError = computed(() => props.showErr)
const iconPropsValue = computed(() => props.iconProps)
const actionList = computed(() => props.actions)

const bodyClass = computed(() => [
  'sn-dialog__body',
  `sn-dialog__body--${props.type}`,
])

const actionsClass = computed(() => [
  'sn-dialog__actions',
  `sn-dialog__actions--${props.actionLayout}`,
  { 'sn-dialog__actions--text': props.theme === 'text' },
])
</script>

<template>
  <SnPopup
    v-model="visible"
    position="center"
    round
    :z-index="props.zIndex"
    :lazy-render="props.lazyRender"
    :close-on-click-modal="props.closeOnClickModal"
    :custom-class="popupClass"
    :custom-style="props.customStyle"
    @close="emit('close')"
  >
    <view :class="bodyClass" data-snui-component="dialog">
      <view
        v-if="showClose"
        class="sn-dialog__close"
        role="button"
        aria-label="close"
        @tap="onCloseTap"
      >
        <SnIcon :icon="XIcon" :size="32" />
      </view>

      <slot name="header" />

      <image
        v-if="headerImage"
        class="sn-dialog__header-image"
        :src="headerImage"
        mode="widthFix"
      />
      <slot name="image" />

      <view v-if="statusIcon" class="sn-dialog__icon" :style="iconStyle">
        <slot
          name="title"
          :icon="statusIcon"
          :title="titleText"
          :icon-props="iconPropsValue"
        >
          <SnIcon :icon="statusIcon" :size="88" v-bind="iconProps" />
        </slot>
      </view>

      <text v-if="title" class="sn-dialog__title">{{ title }}</text>

      <slot
        name="default"
        :msg="msgText"
        :type="dialogType"
        :input-value="currentInput"
        :show-err="showsError"
        :input-error="currentInputError"
      >
        <text v-if="msg" class="sn-dialog__msg">{{ msg }}</text>

        <view v-if="type === 'prompt'" class="sn-dialog__field">
          <SnTextarea
            v-if="usesTextarea"
            v-bind="textareaProps"
            :model-value="currentInput"
            class="sn-dialog__textarea"
            @update:model-value="onInputChange"
          />
          <SnInput
            v-else
            v-bind="inputProps"
            :model-value="currentInput"
            class="sn-dialog__input"
            @update:model-value="onInputChange"
          />
          <text v-if="showErr && currentInputError" class="sn-dialog__error">
            {{ currentInputError }}
          </text>
        </view>
      </slot>

      <view :class="actionsClass">
        <slot
          name="actions"
          :confirm="handleConfirm"
          :cancel="handleCancel"
          :close="onCloseTap"
        >
          <template v-if="actionList.length > 0">
            <view
              v-for="(item, index) in actionList"
              :key="index"
              class="sn-dialog__action"
              :class="{
                'sn-dialog__action--disabled': item.disabled,
                'sn-dialog__action--bold': index === actionList.length - 1,
              }"
              :style="item.color ? `color: ${item.color}` : undefined"
              role="button"
              :aria-disabled="item.disabled ? 'true' : 'false'"
              @tap="onActionTap(item, index)"
            >
              <text class="sn-dialog__action-text">{{ item.name }}</text>
            </view>
          </template>
          <template v-else>
            <SnButton
              v-if="cancelButton.visible"
              class="sn-dialog__cancel"
              :variant="theme === 'text' ? 'text' : 'base'"
              v-bind="cancelButton.attrs"
              @click="handleCancel"
            >
              {{ cancelButton.label }}
            </SnButton>
            <SnButton
              v-if="confirmButton.visible"
              class="sn-dialog__confirm"
              type="primary"
              :variant="theme === 'text' ? 'text' : 'base'"
              v-bind="confirmButton.attrs"
              @click="handleConfirm"
            >
              {{ confirmButton.label }}
            </SnButton>
          </template>
        </slot>
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-dialog__body {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  color: var(--sn-mp-color-text-primary);
}

.sn-dialog__close {
  position: absolute;
  top: -16rpx;
  right: -16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-dialog__header-image {
  width: 100%;
  margin-bottom: var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-lg);
}

.sn-dialog__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sn-mp-spacing-3);
  color: var(--sn-mp-color-action-primary);
}

.sn-dialog__title {
  margin-bottom: var(--sn-mp-spacing-3);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-xl);
  font-weight: var(--sn-mp-font-weight-medium);
  line-height: var(--sn-mp-font-line-height-tight);
}

.sn-dialog__msg {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-dialog__field {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  margin-top: var(--sn-mp-spacing-4);
}

.sn-dialog__error {
  margin-top: var(--sn-mp-spacing-2);
  color: var(--sn-mp-color-feedback-danger);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  text-align: left;
}

.sn-dialog__actions {
  display: flex;
  width: 100%;
  margin-top: var(--sn-mp-spacing-6);
  gap: var(--sn-mp-spacing-3);
}

.sn-dialog__actions--horizontal {
  flex-direction: row;
}

.sn-dialog__actions--vertical {
  flex-direction: column;
}

.sn-dialog__cancel,
.sn-dialog__confirm {
  flex: 1 1 0;
}

.sn-dialog__actions--text {
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
}

.sn-dialog__action {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-3);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-dialog__action--bold .sn-dialog__action-text {
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-dialog__action--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-dialog__action-text {
  font-size: inherit;
}
</style>
