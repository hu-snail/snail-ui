<script setup lang="ts">
/**
 * sn-cascader (uni-end) — tabbed hierarchical selector sheet.
 *
 * Reference library: wot-ui `wd-cascader`
 *   (https://wot-ui.cn/component/cascader.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-cascader 1:1 except
 * for the documented omission. Anything new added here MUST also be added to
 * the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-cascader/sn-cascader.vue
 * → auto-registered as `<sn-cascader>` in any .vue that uses it.
 *
 * ## Two modes
 *
 * Static (`checkStrictly: false`): a leaf tap confirms immediately with the
 * leaf value. `checkStrictly: true` lets any level be confirmed, and the
 * confirm button becomes visible.
 *
 * Lazy (`lazyLoad` provided): a non-leaf tap asks the host for the children
 * through `resolve()`. In that mode the emitted `value` is the whole path,
 * which is also what wot-ui does — a lazy tree has no leaf value until the
 * last level resolves.
 *
 * ## Documented omission
 *
 * `root-portal` is not implemented (uni-app miniprograms have no portal host
 * — same divergence as `sn-popup`).
 *
 * ## In-flight guards (AGENTS.md §39 / §41)
 *
 * A lazy-load request is tracked by a generation token, so a sheet closed
 * mid-request cannot write into a disposed component. No timers, no global
 * listeners.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 数据拉取 — 由宿主在 `lazyLoad` 里完成
 *   - 弹层定位 / 动画 — 用 sn-popup
 */

import { computed, ref, watch } from 'vue'
import SnPopup from '../sn-popup/sn-popup.vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import { Check as CheckIcon } from '../sn-icon/sn-icon-set'
import type {
  CascaderConfirmPayload,
  CascaderLazyLoad,
  CascaderOption,
  CascaderValue,
} from './sn-cascader-types'

defineOptions({ name: 'SnCascader' })

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-cascader` 1:1 surface ───────────────────────────────── */

    /** Selected value — a leaf value, or a path array in lazy mode. */
    modelValue?: CascaderValue | CascaderValue[] | undefined
    /** Sheet visibility (`v-model:visible`). */
    visible?: boolean
    /** Option tree. */
    options?: CascaderOption[]
    /** Toolbar title. */
    title?: string
    /** Veto hook for confirm. */
    beforeConfirm?: ((payload: CascaderConfirmPayload) => boolean | Promise<boolean>) | undefined
    /** Allow confirming any level, not just leaves. */
    checkStrictly?: boolean
    /** Confirm button label (only rendered in `checkStrictly` / lazy mode). */
    confirmText?: string
    /** Option key holding the value. */
    valueKey?: string
    /** Option key holding the text. */
    textKey?: string
    /** Option key holding the children. */
    childrenKey?: string
    /** Option key holding the tip. */
    tipKey?: string
    /** Option key marking a leaf in lazy mode. */
    isLeafKey?: string
    /** Lazy-load hook. */
    lazyLoad?: CascaderLazyLoad | undefined
    /** Tapping the mask closes the sheet. */
    closeOnClickModal?: boolean
    /** Stacking level. */
    zIndex?: number
    /** Pad the sheet for the device safe area. */
    safeAreaInsetBottom?: boolean
    /** Width of the active indicator bar. A number is an rpx design value. */
    lineWidth?: number | string | undefined
    /** Height of the active indicator bar. A number is an rpx design value. */
    lineHeight?: number | string | undefined
    /** Indicator placement style. */
    lineTheme?: 'normal' | 'text' | 'underline' | 'dot'
    /** Class on the root node. */
    customClass?: string
    /** Inline style on the sheet. */
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
    options: () => [],
    title: '',
    beforeConfirm: undefined,
    checkStrictly: false,
    confirmText: '确认',
    valueKey: 'value',
    textKey: 'text',
    childrenKey: 'children',
    tipKey: 'tip',
    isLeafKey: 'isLeaf',
    lazyLoad: undefined,
    closeOnClickModal: true,
    zIndex: 15,
    safeAreaInsetBottom: true,
    lineWidth: undefined,
    lineHeight: undefined,
    lineTheme: 'normal',
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: CascaderValue | CascaderValue[]): void
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', payload: CascaderConfirmPayload): void
  (e: 'close'): void
}>()

/* ── Node accessors ────────────────────────────────────────────────────── */

function readString(raw: CascaderOption, key: string): string {
  const value = raw[key]
  return value === undefined || value === null ? '' : String(value)
}

function nodeValue(raw: CascaderOption): CascaderValue {
  const value = raw[props.valueKey]
  if (typeof value === 'string' || typeof value === 'number') return value
  return readString(raw, props.textKey)
}

function nodeText(raw: CascaderOption): string {
  return readString(raw, props.textKey)
}

function nodeTip(raw: CascaderOption): string {
  return readString(raw, props.tipKey)
}

function nodeChildren(raw: CascaderOption): CascaderOption[] {
  const value = raw[props.childrenKey]
  return Array.isArray(value) ? (value as CascaderOption[]) : []
}

function isLeafNode(raw: CascaderOption): boolean {
  if (props.lazyLoad) return raw[props.isLeafKey] === true
  return nodeChildren(raw).length === 0
}

/* ── Tab state ─────────────────────────────────────────────────────────── */

/** Options shown per tab. Tab 0 is the root list. */
const tabs = ref<CascaderOption[][]>([props.options])
/** Selected node per tab. */
const selectedPath = ref<CascaderOption[]>([])
/** Active tab index. */
const activeTab = ref(0)
/** Loading flags per tab. */
const loadingTab = ref<number | null>(null)

/** Generation token so a stale lazy-load resolve is dropped (§39). */
let requestToken = 0

/** Seed the tabs from `modelValue` when it is a path array. */
function seedFromValue(): void {
  const value = props.modelValue
  tabs.value = [props.options]
  selectedPath.value = []
  activeTab.value = 0
  if (!Array.isArray(value) || value.length === 0) return
  let level = props.options
  const path: CascaderOption[] = []
  for (const wanted of value) {
    const found = level.find(option => nodeValue(option) === wanted)
    if (!found) break
    path.push(found)
    const children = nodeChildren(found)
    if (children.length === 0) break
    level = children
    tabs.value.push(children)
  }
  selectedPath.value = path
  activeTab.value = path.length
}

watch(
  () => props.visible,
  (value) => {
    if (!value) {
      requestToken += 1
      loadingTab.value = null
      return
    }
    seedFromValue()
  },
  { immediate: true },
)

watch(
  () => props.options,
  () => {
    if (props.visible) seedFromValue()
  },
  { deep: true },
)

/** Can the current selection be confirmed? */
const canConfirm = computed(() => {
  if (props.lazyLoad) return selectedPath.value.length > 0
  if (props.checkStrictly) return selectedPath.value.length > 0
  const last = selectedPath.value[selectedPath.value.length - 1]
  return last !== undefined && isLeafNode(last)
})

/** Value written on confirm. */
const currentValue = computed<CascaderValue | CascaderValue[]>(() => {
  if (props.lazyLoad) return selectedPath.value.map(nodeValue)
  const last = selectedPath.value[selectedPath.value.length - 1]
  return last ? nodeValue(last) : ''
})

/** Emit a leaf confirmation immediately (static mode, not strict). */
function confirmStatic(): void {
  emit('update:modelValue', currentValue.value)
  emit('confirm', {
    value: currentValue.value,
    selectedOptions: selectedPath.value.slice(),
  })
  emit('update:visible', false)
}

function commitSelection(): void {
  if (!canConfirm.value) return
  if (!props.checkStrictly && !props.lazyLoad) {
    confirmStatic()
    return
  }
  emit('update:modelValue', currentValue.value)
  emit('confirm', {
    value: currentValue.value,
    selectedOptions: selectedPath.value.slice(),
  })
  emit('update:visible', false)
}

async function onConfirm(): Promise<void> {
  if (!canConfirm.value) return
  if (props.beforeConfirm) {
    const verdict = await props.beforeConfirm({
      value: currentValue.value,
      selectedOptions: selectedPath.value.slice(),
    })
    if (verdict === false) return
  }
  commitSelection()
}

/* ── Interaction ───────────────────────────────────────────────────────── */

function truncate(level: number): void {
  tabs.value = tabs.value.slice(0, level + 1)
  selectedPath.value = selectedPath.value.slice(0, level)
}

function onOptionTap(tabIndex: number, option: CascaderOption): void {
  if (option.disabled === true) return
  truncate(tabIndex)
  selectedPath.value = [...selectedPath.value.slice(0, tabIndex), option]
  activeTab.value = tabIndex

  if (isLeafNode(option)) {
    if (!props.checkStrictly && !props.lazyLoad) confirmStatic()
    return
  }

  const children = nodeChildren(option)
  if (children.length > 0) {
    tabs.value = [...tabs.value.slice(0, tabIndex + 1), children]
    activeTab.value = tabIndex + 1
    return
  }

  if (!props.lazyLoad) return
  requestLazy(tabIndex, option)
}

function requestLazy(tabIndex: number, option: CascaderOption): void {
  const lazyLoad = props.lazyLoad
  if (!lazyLoad) return
  requestToken += 1
  const token = requestToken
  loadingTab.value = tabIndex
  lazyLoad(option, tabIndex, (children) => {
    if (token !== requestToken) return
    loadingTab.value = null
    if (!Array.isArray(children) || children.length === 0) return
    tabs.value = [...tabs.value.slice(0, tabIndex + 1), children]
    activeTab.value = tabIndex + 1
  })
}

function onTabTap(tabIndex: number): void {
  activeTab.value = tabIndex
}

function onCancel(): void {
  emit('close')
  emit('update:visible', false)
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const popupClass = computed(() => ['sn-cascader-popup', props.customClass].filter(Boolean).join(' '))

const rootStyle = computed(() => props.customStyle)

const indicatorStyle = computed(() => {
  const vars: string[] = []
  if (props.lineWidth !== undefined) {
    const width = typeof props.lineWidth === 'number' ? `${props.lineWidth * 2}rpx` : props.lineWidth
    vars.push(`--sn-cascader-line-width: ${width}`)
  }
  if (props.lineHeight !== undefined) {
    const height = typeof props.lineHeight === 'number' ? `${props.lineHeight * 2}rpx` : props.lineHeight
    vars.push(`--sn-cascader-line-height: ${height}`)
  }
  return vars.join('; ') || undefined
})

function isSelected(tabIndex: number, option: CascaderOption): boolean {
  const selected = selectedPath.value[tabIndex]
  if (!selected) return false
  return nodeValue(selected) === nodeValue(option)
}

/** Tabs actually rendered: the visible tab list plus one pending tab. */
const tabCount = computed(() => tabs.value.length)

function tabTitle(index: number): string {
  const selected = selectedPath.value[index]
  return selected ? nodeText(selected) : ''
}
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
    <view class="sn-cascader" :data-snui-component="'cascader'">
      <view class="sn-cascader__toolbar">
        <view
          class="sn-cascader__action sn-cascader__cancel"
          role="button"
          aria-label="cancel"
          @tap="onCancel"
        >取消</view>
        <text v-if="props.title" class="sn-cascader__title">{{ props.title }}</text>
        <view
          v-if="props.checkStrictly || props.lazyLoad"
          :class="['sn-cascader__action', 'sn-cascader__confirm', { 'sn-cascader__confirm--disabled': !canConfirm }]"
          role="button"
          :aria-label="props.confirmText"
          :aria-disabled="canConfirm ? undefined : 'true'"
          @tap="onConfirm"
        >{{ props.confirmText }}</view>
        <view v-else class="sn-cascader__action sn-cascader__placeholder" aria-hidden="true" />
      </view>

      <view class="sn-cascader__tabs" role="tablist">
        <view
          v-for="index in tabCount"
          :key="index"
          :class="['sn-cascader__tab', { 'sn-cascader__tab--active': activeTab === index - 1 }]"
          role="tab"
          :aria-selected="activeTab === index - 1 ? 'true' : 'false'"
          @tap="onTabTap(index - 1)"
        >
          <text class="sn-cascader__tab-text">{{ tabTitle(index - 1) }}</text>
          <view
            v-if="activeTab === index - 1"
            :class="['sn-cascader__line', `sn-cascader__line--${props.lineTheme}`]"
            :style="indicatorStyle"
            aria-hidden="true"
          />
        </view>
      </view>

      <view class="sn-cascader__panels">
        <scroll-view
          v-for="(tab, tabIndex) in tabs"
          v-show="activeTab === tabIndex"
          :key="tabIndex"
          class="sn-cascader__panel"
          scroll-y
        >
          <view v-if="loadingTab === tabIndex" class="sn-cascader__loading" role="status" aria-live="polite">
            <text class="sn-cascader__loading-text">loading</text>
          </view>

          <view
            v-for="option in tab"
            :key="String(nodeValue(option))"
            :class="[
              'sn-cascader__option',
              {
                'sn-cascader__option--selected': isSelected(tabIndex, option),
                'sn-cascader__option--disabled': option.disabled === true,
              },
            ]"
            role="button"
            :aria-pressed="isSelected(tabIndex, option) ? 'true' : 'false'"
            :aria-disabled="option.disabled === true ? 'true' : undefined"
            @tap="onOptionTap(tabIndex, option)"
          >
            <view class="sn-cascader__option-main">
              <text class="sn-cascader__option-text">{{ nodeText(option) }}</text>
              <text v-if="nodeTip(option)" class="sn-cascader__option-tip">{{ nodeTip(option) }}</text>
            </view>
            <view v-if="isSelected(tabIndex, option)" class="sn-cascader__check" aria-hidden="true">
              <SnIcon :icon="CheckIcon" :size="28" />
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-cascader {
  display: block;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-cascader__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88rpx;
  padding: 0 var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-cascader__title {
  flex: 1 1 auto;
  text-align: center;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-cascader__action {
  flex: 0 0 auto;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-secondary);
}

.sn-cascader__confirm {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-cascader__confirm--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-cascader__placeholder {
  width: 96rpx;
}

.sn-cascader__tabs {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4) 0;
  overflow-x: auto;
}

.sn-cascader__tab {
  position: relative;
  flex: 0 0 auto;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md) var(--sn-mp-radius-md) 0 0;
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-cascader__tab--active {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-cascader__line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--sn-cascader-line-height, 4rpx);
  background-color: var(--sn-mp-color-action-primary);
}

.sn-cascader__line--dot {
  left: 50%;
  right: auto;
  width: var(--sn-cascader-line-width, 24rpx);
  margin-left: calc(var(--sn-cascader-line-width, 24rpx) / -2);
  border-radius: var(--sn-mp-radius-full);
}

.sn-cascader__line--text {
  left: var(--sn-mp-spacing-3);
  right: var(--sn-mp-spacing-3);
}

.sn-cascader__line--underline {
  left: 0;
  right: 0;
}

.sn-cascader__panels {
  max-height: 640rpx;
  overflow: hidden;
}

.sn-cascader__panel {
  max-height: 640rpx;
}

.sn-cascader__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-cascader__option-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
}

.sn-cascader__option-text {
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-primary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-cascader__option--selected .sn-cascader__option-text {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-cascader__option-tip {
  margin-top: var(--sn-mp-spacing-1);
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-cascader__option--disabled {
  opacity: 0.5;
}

.sn-cascader__check {
  display: flex;
  align-items: center;
  color: var(--sn-mp-color-action-primary);
}

.sn-cascader__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-8);
  color: var(--sn-mp-color-action-primary);
}

/* Doodle skin — heavier row rules. */
.snui-skin-doodle .sn-cascader__option {
  border-bottom-width: 4rpx;
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
