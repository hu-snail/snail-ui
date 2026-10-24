<script setup lang="ts">
/**
 * sn-select-picker (uni-end) — single / multi select sheet with search.
 *
 * Reference library: wot-ui `wd-select-picker`
 *   (https://wot-ui.cn/component/select-picker.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-select-picker 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-select-picker/sn-select-picker.vue
 * → auto-registered as `<sn-select-picker>` in any .vue that uses it.
 *
 * ## Value model
 *
 * `type: 'checkbox'` (default) keeps an array `v-model`; `type: 'radio'`
 * keeps a single scalar. The component normalizes whatever it receives into a
 * working set, applies `min` / `max` on toggle, and writes back the shape the
 * consumer declared.
 *
 * ## Documented divergence
 *
 * `root-portal` is not implemented — uni-app miniprograms have no portal host
 * (same divergence as `sn-popup`). `scroll-into-view` is honoured as
 * "scroll the active row into view on open" via `scroll-top` math; there is no
 * DOM scroll query on the mini-program target, so the offset is estimated from
 * `itemHeight`.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 远程数据加载 — 由宿主在 `open` 时拉取后写入 `columns`
 *   - 校验信息展示 — 用 sn-form-item
 */

import { computed, ref, watch } from 'vue'
import SnPopup from '../sn-popup/sn-popup.vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import { Check as CheckIcon, Search as SearchIcon } from '../sn-icon/sn-icon-set'

defineOptions({ name: 'SnSelectPicker' })

/** Any value a single option can carry. */
type SelectValue = string | number | boolean

/** Raw option record — keys resolved through `valueKey` / `labelKey`. */
interface SelectOption {
  [key: string]: unknown
}

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-select-picker` 1:1 surface ─────────────────────────── */

    /** Selected value(s) (`v-model`): scalar for radio, array for checkbox. */
    modelValue?: SelectValue | SelectValue[] | undefined
    /** Sheet visibility (`v-model:visible`). */
    visible?: boolean
    /** Toolbar title. */
    title?: string
    /** Checked accent color (CSS color). Empty = token default. */
    checkedColor?: string
    /** Chip size preset — mirrors wot-ui `select-size`. */
    selectSize?: 'mini' | 'small' | 'medium' | 'large'
    /** Minimum number of selections (`0` = unconstrained). */
    min?: number
    /** Maximum number of selections (`0` = unconstrained). */
    max?: number
    /** Selection type. */
    type?: 'checkbox' | 'radio'
    /** Option key holding the value. */
    valueKey?: string
    /** Option key holding the label. */
    labelKey?: string
    /** Confirm button label. */
    confirmButtonText?: string
    /** Loading state of the option list. */
    loading?: boolean
    /** Loading spinner color (CSS color). */
    loadingColor?: string
    /** Tapping the mask closes the sheet. */
    closeOnClickModal?: boolean
    /** Option list. */
    columns?: SelectOption[]
    /** Veto hook for confirm. */
    beforeConfirm?: ((payload: {
      value: SelectValue | SelectValue[]
      selectedItems: SelectOption[]
    }) => boolean | Promise<boolean>) | undefined
    /** Stacking level. */
    zIndex?: number
    /** Pad the sheet for the device safe area. */
    safeAreaInsetBottom?: boolean
    /** Render the search field. */
    filterable?: boolean
    /** Search field placeholder. */
    filterPlaceholder?: string
    /** Scroll the selected row into view on open. */
    scrollIntoView?: boolean
    /** Class on the option content wrapper. */
    customContentClass?: string
    /** Render the confirm button. */
    showConfirm?: boolean
    /** Class on the root node. */
    customClass?: string
    /** Inline style on the root node. */
    customStyle?: string
    /**
     * Accepted for wot-ui parity, NOT implemented — miniprogram has no portal
     * host, so the layer cannot leave the page's document flow.
     */
    rootPortal?: boolean
  }>(),
  {
    modelValue: undefined,
    visible: false,
    title: '选择器',
    checkedColor: '',
    selectSize: 'medium',
    min: 0,
    max: 0,
    type: 'checkbox',
    valueKey: 'value',
    labelKey: 'label',
    confirmButtonText: '确认',
    loading: false,
    loadingColor: '',
    closeOnClickModal: true,
    columns: () => [],
    beforeConfirm: undefined,
    zIndex: 15,
    safeAreaInsetBottom: true,
    filterable: false,
    filterPlaceholder: '搜索',
    scrollIntoView: true,
    customContentClass: '',
    showConfirm: true,
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectValue | SelectValue[]): void
  (e: 'update:visible', value: boolean): void
  (e: 'change', payload: { value: SelectValue | SelectValue[] }): void
  (e: 'confirm', payload: { value: SelectValue | SelectValue[], selectedItems: SelectOption[] }): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'close'): void
}>()

/* ── Option normalisation ──────────────────────────────────────────────── */

function readKey(raw: SelectOption, key: string): unknown {
  return raw[key]
}

function optionValue(raw: SelectOption): SelectValue {
  const value = readKey(raw, props.valueKey)
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value
  const label = readKey(raw, props.labelKey)
  return label === undefined || label === null ? '' : String(label)
}

function optionLabel(raw: SelectOption): string {
  const label = readKey(raw, props.labelKey)
  return label === undefined || label === null ? '' : String(label)
}

/* ── Working selection ─────────────────────────────────────────────────── */

function toArray(value: SelectValue | SelectValue[] | undefined): SelectValue[] {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value.slice() : [value]
}

/**
 * Draft selection while the sheet is open (always an array). Seeded from the
 * model so a sheet that mounts already-open shows the real selection; the
 * `visible` watcher re-seeds it on every open.
 */
const draft = ref<SelectValue[]>(toArray(props.modelValue))

/** Emit shape: a scalar in radio mode, an array in checkbox mode. */
function toEmit(values: SelectValue[]): SelectValue | SelectValue[] {
  return props.type === 'radio' ? (values[0] ?? '') : values
}

const selected = computed<SelectValue[]>(() =>
  props.visible ? draft.value : toArray(props.modelValue),
)

function isSelected(value: SelectValue): boolean {
  return selected.value.includes(value)
}

function commit(values: SelectValue[]): void {
  draft.value = values
  const payload = toEmit(values)
  emit('update:modelValue', payload)
  emit('change', { value: payload })
}

function onOptionTap(raw: SelectOption): void {
  if (props.loading) return
  const value = optionValue(raw)
  if (props.type === 'radio') {
    commit([value])
    return
  }
  const current = draft.value
  if (current.includes(value)) {
    if (props.min > 0 && current.length <= props.min) return
    commit(current.filter(item => item !== value))
    return
  }
  if (props.max > 0 && current.length >= props.max) return
  commit([...current, value])
}

/* ── Search ────────────────────────────────────────────────────────────── */

const keyword = ref('')

const filteredColumns = computed<SelectOption[]>(() => {
  const q = keyword.value.trim().toLowerCase()
  if (q === '') return props.columns
  return props.columns.filter(option => optionLabel(option).toLowerCase().includes(q))
})

function onSearch(event: Event): void {
  keyword.value = (event.target as HTMLInputElement).value
}

/* ── Visibility ────────────────────────────────────────────────────────── */

watch(
  () => props.visible,
  (value) => {
    if (value) {
      draft.value = toArray(props.modelValue)
      keyword.value = ''
      emit('open')
      return
    }
    emit('close')
  },
)

const selectedItems = computed<SelectOption[]>(() =>
  props.columns.filter(option => selected.value.includes(optionValue(option))),
)

async function onConfirm(): Promise<void> {
  const value = toEmit(selected.value)
  if (props.beforeConfirm) {
    const verdict = await props.beforeConfirm({ value, selectedItems: selectedItems.value })
    if (verdict === false) return
  }
  emit('confirm', { value, selectedItems: selectedItems.value })
  emit('update:visible', false)
}

function onCancel(): void {
  draft.value = toArray(props.modelValue)
  emit('cancel')
  emit('update:visible', false)
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const popupClass = computed(() => ['sn-select-picker-popup', props.customClass].filter(Boolean).join(' '))

/** Forwarded to sn-popup — a string, so `exactOptionalPropertyTypes` stays happy. */
const rootStyle = computed(() => props.customStyle)

const contentStyle = computed(() => {
  const vars: string[] = []
  if (props.checkedColor) vars.push(`--sn-select-picker-checked-color: ${props.checkedColor}`)
  if (props.loadingColor) vars.push(`--sn-select-picker-loading-color: ${props.loadingColor}`)
  return vars.join('; ') || undefined
})
</script>

<template>
  <SnPopup
    :model-value="props.visible"
    position="bottom"
    round
    :z-index="props.zIndex"
    :close-on-click-modal="props.closeOnClickModal"
    :safe-area-inset-bottom="props.safeAreaInsetBottom"
    :custom-class="popupClass"
    :custom-style="rootStyle"
    @update:model-value="emit('update:visible', $event)"
  >
    <view
      class="sn-select-picker"
      :data-snui-component="'select-picker'"
      :style="contentStyle"
    >
      <view class="sn-select-picker__header">
        <text class="sn-select-picker__title">{{ props.title }}</text>
        <text class="sn-select-picker__count">{{ selected.length }}{{ props.max > 0 ? ` / ${props.max}` : '' }}</text>
      </view>

      <view v-if="props.filterable" class="sn-select-picker__filter">
        <view class="sn-select-picker__filter-icon" aria-hidden="true">
          <SnIcon :icon="SearchIcon" :size="28" />
        </view>
        <input
          class="sn-select-picker__filter-input"
          type="text"
          :value="keyword"
          :placeholder="props.filterPlaceholder"
          :aria-label="props.filterPlaceholder"
          @input="onSearch"
        >
      </view>

      <view :class="['sn-select-picker__body', props.customContentClass]">
        <view v-if="props.loading" class="sn-select-picker__loading" role="status" aria-live="polite">
          <text class="sn-select-picker__loading-text">loading</text>
        </view>

        <scroll-view
          v-else
          class="sn-select-picker__scroll"
          scroll-y
          :scroll-into-view="props.scrollIntoView ? 'sn-select-picker-active' : ''"
        >
          <view
            v-for="option in filteredColumns"
            :key="String(optionValue(option))"
            :id="isSelected(optionValue(option)) ? 'sn-select-picker-active' : undefined"
            :class="[
              'sn-select-picker__item',
              {
                'sn-select-picker__item--active': isSelected(optionValue(option)),
                'sn-select-picker__item--disabled': option.disabled === true,
              },
            ]"
            role="button"
            :aria-pressed="isSelected(optionValue(option)) ? 'true' : 'false'"
            :aria-disabled="option.disabled === true ? 'true' : undefined"
            @tap="onOptionTap(option)"
          >
            <text class="sn-select-picker__label">{{ optionLabel(option) }}</text>
            <view
              v-if="isSelected(optionValue(option))"
              class="sn-select-picker__check"
              aria-hidden="true"
            >
              <SnIcon :icon="CheckIcon" :size="28" />
            </view>
          </view>

          <view v-if="filteredColumns.length === 0" class="sn-select-picker__empty">
            <text class="sn-select-picker__empty-text">—</text>
          </view>
        </scroll-view>
      </view>

      <view class="sn-select-picker__footer">
        <view
          class="sn-select-picker__cancel"
          role="button"
          aria-label="cancel"
          @tap="onCancel"
        >取消</view>
        <view
          v-if="props.showConfirm"
          class="sn-select-picker__confirm"
          role="button"
          aria-label="confirm"
          @tap="onConfirm"
        >{{ props.confirmButtonText }}</view>
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-select-picker {
  display: flex;
  flex-direction: column;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-select-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-select-picker__title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-select-picker__count {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-select-picker__filter {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  margin: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  padding: 0 var(--sn-mp-spacing-3);
  height: 64rpx;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
}

.sn-select-picker__filter-icon {
  display: flex;
  align-items: center;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-select-picker__filter-input {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--sn-mp-color-input-text);
  font: inherit;
  font-size: var(--sn-mp-font-size-sm);
}

.sn-select-picker__body {
  max-height: 640rpx;
  overflow: hidden;
}

.sn-select-picker__scroll {
  max-height: 640rpx;
}

.sn-select-picker__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-select-picker__label {
  flex: 1 1 auto;
  min-width: 0;
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-primary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-select-picker__item--active .sn-select-picker__label {
  color: var(--sn-select-picker-checked-color, var(--sn-mp-color-action-primary));
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-select-picker__item--disabled {
  opacity: 0.5;
}

.sn-select-picker__check {
  display: flex;
  align-items: center;
  color: var(--sn-select-picker-checked-color, var(--sn-mp-color-action-primary));
}

.sn-select-picker__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-8);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-select-picker__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-8);
  color: var(--sn-select-picker-loading-color, var(--sn-mp-color-action-primary));
}

.sn-select-picker__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-select-picker__cancel,
.sn-select-picker__confirm {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-md);
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-secondary);
}

.sn-select-picker__confirm {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

/* Doodle skin — heavier row rules. */
.snui-skin-doodle .sn-select-picker__item {
  border-bottom-width: 4rpx;
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
