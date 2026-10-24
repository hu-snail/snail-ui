<script setup lang="ts">
/**
 * sn-action-sheet (uni-end) — bottom action panel for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-action-sheet`
 *   (https://wot-ui.cn/component/action-sheet.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-action-sheet 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-action-sheet/sn-action-sheet.vue
 * → auto-registered as `<sn-action-sheet>` in any .vue that uses it.
 *
 * ## Composition
 *
 * The panel is a `sn-popup` anchored to `bottom` with `round` corners, so the
 * scrim, the slide animation, `lockScroll` and the leave cleanup are the popup's
 * (no timer is created here — nothing to dispose).
 *
 * ## Documented divergences from wd-action-sheet
 *
 *   - `root-portal` is not implemented (no portal host on miniprogram).
 *   - `panels` renders a one-dimensional grid; a two-dimensional
 *     `Panel[][]` (multi-row) input is flattened row by row, and `select`
 *     reports `{ item, rowIndex, colIndex }` for it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 * No schema validation; no business logic.
 *
 * Not responsible for:
 *   - 居中确认框 / 输入框 — 用 sn-dialog
 *   - 通用弹层 — 用 sn-popup
 *   - 轻提示 — 用 sn-toast
 */

import { computed, markRaw } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'
import SnPopup from '../sn-popup/sn-popup.vue'

defineOptions({ name: 'SnActionSheet' })

/** One list row. Mirrors the `Action` row group of the wd reference table. */
export interface SnActionSheetAction {
  /** Row label. */
  name?: string
  /** Secondary description shown under the label. */
  description?: string
  /** Text color override for this row. */
  color?: string
  /** Icon name (sn-icon registry) or image URL. */
  icon?: string
  /** Disable the row — taps are ignored. */
  disabled?: boolean
}

/** One grid cell. Mirrors the `Panel` row group of the wd reference table. */
export interface SnActionSheetPanel {
  /** Cell label. */
  title?: string
  /** Cell identifier echoed back through `select`. */
  name?: string
  /** Icon name (sn-icon registry) or image URL. */
  icon?: string
}

const props = withDefaults(
  defineProps<{
    /** Whether the sheet is visible (v-model). */
    modelValue?: boolean
    /** List rows. */
    actions?: SnActionSheetAction[]
    /** Grid cells; a nested array is treated as multiple rows. */
    panels?: Array<SnActionSheetPanel | SnActionSheetPanel[]>
    /** Title text above the list. */
    title?: string
    /** Cancel button label. An empty string hides the cancel button. */
    cancelText?: string
    /** Close the sheet after a row / cell is selected. */
    closeOnClickAction?: boolean
    /** Close the sheet when the scrim is tapped. */
    closeOnClickModal?: boolean
    /** Animation duration in ms. */
    duration?: number
    /** Stacking level of the sheet. */
    zIndex?: number
    /** Defer panel content rendering until the sheet is first opened. */
    lazyRender?: boolean
    /** Pad the bottom sheet for the device safe area. */
    safeAreaInsetBottom?: boolean
    /** Custom class for the title area. */
    customTitleClass?: string
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
    actions: () => [],
    panels: () => [],
    title: '',
    cancelText: '',
    closeOnClickAction: true,
    closeOnClickModal: true,
    duration: 200,
    zIndex: 10,
    lazyRender: true,
    safeAreaInsetBottom: true,
    customTitleClass: '',
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
)

defineSlots<{
  /** Content above the list, inside the panel. */
  default?(): unknown
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', payload: {
    item: SnActionSheetAction | SnActionSheetPanel
    index?: number
    rowIndex?: number
    colIndex?: number
  }): void
  (e: 'cancel'): void
  (e: 'close'): void
  (e: 'click-modal'): void
  (e: 'enter'): void
  (e: 'after-enter'): void
  (e: 'leave'): void
  (e: 'after-leave'): void
}>()

const visible = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

/** Looks like an image source rather than a registry icon name. */
function isImageSource(value: string): boolean {
  return /^(https?:|data:|\/\/|\/|\.{1,2}\/)/.test(value)
}

/** Grid normalised to rows — a flat `Panel[]` becomes a single row. */
const panelRows = computed<SnActionSheetPanel[][]>(() => {
  const rows: SnActionSheetPanel[][] = []
  let current: SnActionSheetPanel[] = []
  for (const entry of props.panels) {
    if (Array.isArray(entry)) {
      if (current.length > 0) rows.push(current)
      current = []
      rows.push(entry)
    } else {
      current.push(entry)
    }
  }
  if (current.length > 0) rows.push(current)
  return rows
})

/** Registry icon data for a row / cell, or `null` when it is an image URL. */
function resolveRowIcon(icon: string | undefined): IconData | null {
  if (!icon) return null
  const data = resolveIconByName(icon)
  return data ? markRaw(data) : null
}

function rowIconIsImage(icon: string | undefined): boolean {
  return Boolean(icon) && isImageSource(icon as string)
}

/**
 * Actions with a non-undefined array type. `withDefaults` narrows the prop at
 * runtime but the template still sees `Row[] | undefined`, so a computed keeps
 * the `v-for` / `.length` access type-safe under `strict`.
 */
const actionList = computed(() => props.actions)

/** Should the cancel button render? Empty label hides it. */
const showsCancel = computed(() => props.cancelText !== '')

function close(): void {
  emit('update:modelValue', false)
}

function onActionTap(action: SnActionSheetAction, index: number): void {
  if (action.disabled) return
  emit('select', { item: action, index })
  if (props.closeOnClickAction) close()
}

function onPanelTap(panel: SnActionSheetPanel, rowIndex: number, colIndex: number): void {
  emit('select', { item: panel, rowIndex, colIndex })
  if (props.closeOnClickAction) close()
}

function onCancelTap(): void {
  emit('cancel')
  close()
}

function onPopupClose(): void {
  emit('close')
}

const popupClass = computed(() => ['sn-action-sheet', props.customClass].filter(Boolean).join(' '))

const titleClass = computed(() => ['sn-action-sheet__title', props.customTitleClass])
</script>

<template>
  <SnPopup
    v-model="visible"
    position="bottom"
    round
    :duration="props.duration"
    :z-index="props.zIndex"
    :lazy-render="props.lazyRender"
    :safe-area-inset-bottom="props.safeAreaInsetBottom"
    :close-on-click-modal="props.closeOnClickModal"
    :custom-class="popupClass"
    :custom-style="props.customStyle"
    @close="onPopupClose"
    @click-modal="emit('click-modal')"
    @enter="emit('enter')"
    @after-enter="emit('after-enter')"
    @leave="emit('leave')"
    @after-leave="emit('after-leave')"
  >
    <view class="sn-action-sheet__body" data-snui-component="action-sheet">
      <text v-if="title" :class="titleClass">{{ title }}</text>
      <slot />

      <view v-if="panelRows.length > 0" class="sn-action-sheet__panels">
        <view
          v-for="(row, rowIndex) in panelRows"
          :key="rowIndex"
          class="sn-action-sheet__panel-row"
        >
          <view
            v-for="(panel, colIndex) in row"
            :key="colIndex"
            class="sn-action-sheet__panel"
            role="button"
            @tap="onPanelTap(panel, rowIndex, colIndex)"
          >
            <image
              v-if="rowIconIsImage(panel.icon)"
              class="sn-action-sheet__panel-icon"
              :src="panel.icon"
              mode="aspectFit"
            />
            <view v-else-if="resolveRowIcon(panel.icon)" class="sn-action-sheet__panel-icon">
              <SnIcon :icon="resolveRowIcon(panel.icon)!" :size="48" />
            </view>
            <text class="sn-action-sheet__panel-title">{{ panel.title }}</text>
          </view>
        </view>
      </view>

      <view v-if="actionList.length > 0" class="sn-action-sheet__actions">
        <view
          v-for="(action, index) in actionList"
          :key="index"
          class="sn-action-sheet__action"
          :class="{ 'sn-action-sheet__action--disabled': action.disabled }"
          :style="action.color ? `color: ${action.color}` : undefined"
          role="button"
          :aria-disabled="action.disabled ? 'true' : 'false'"
          @tap="onActionTap(action, index)"
        >
          <image
            v-if="rowIconIsImage(action.icon)"
            class="sn-action-sheet__action-icon"
            :src="action.icon"
            mode="aspectFit"
          />
          <view v-else-if="resolveRowIcon(action.icon)" class="sn-action-sheet__action-icon">
            <SnIcon :icon="resolveRowIcon(action.icon)!" :size="40" />
          </view>
          <view class="sn-action-sheet__action-texts">
            <text class="sn-action-sheet__action-name">{{ action.name }}</text>
            <text v-if="action.description" class="sn-action-sheet__action-desc">
              {{ action.description }}
            </text>
          </view>
        </view>
      </view>

      <view v-if="showsCancel" class="sn-action-sheet__gap" />

      <view
        v-if="showsCancel"
        class="sn-action-sheet__cancel"
        role="button"
        @tap="onCancelTap"
      >
        <text class="sn-action-sheet__cancel-text">{{ cancelText }}</text>
      </view>
    </view>
  </SnPopup>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-action-sheet__body {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: var(--sn-mp-color-text-primary);
}

.sn-action-sheet__title {
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-3);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  text-align: center;
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-action-sheet__panels {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4) 0;
}

.sn-action-sheet__panel-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.sn-action-sheet__panel {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-2);
  color: var(--sn-mp-color-text-primary);
}

.sn-action-sheet__panel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  color: var(--sn-mp-color-action-primary);
}

.sn-action-sheet__panel-title {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-action-sheet__actions {
  display: flex;
  flex-direction: column;
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-action-sheet__action {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-5) var(--sn-mp-spacing-4);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  line-height: var(--sn-mp-font-line-height-normal);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-action-sheet__action--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-action-sheet__action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
}

.sn-action-sheet__action-texts {
  display: flex;
  flex-direction: column;
}

.sn-action-sheet__action-name {
  font-size: inherit;
  color: inherit;
}

.sn-action-sheet__action-desc {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-action-sheet__gap {
  height: 16rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-action-sheet__cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-5) var(--sn-mp-spacing-4);
  background-color: var(--sn-mp-color-background-elevated);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-action-sheet__cancel-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
