<script setup lang="ts">
/**
 * sn-sort-button (uni-end) — tri-state sort toggle.
 *
 * Reference library: wot-ui `wd-sort-button`
 *   (https://wot-ui.cn/component/sort-button.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-sort-button 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-sort-button/sn-sort-button.vue
 * → auto-registered as `<sn-sort-button>` in any .vue that uses it.
 *
 * ## Value cycle
 *
 * `1` ascending, `0` reset, `-1` descending. Tapping cycles
 * `0 → 1 → -1 → 0` by default; `descFirst` flips the first hop to
 * `0 → -1 → 1 → 0`, and `allowReset: false` drops the reset state from the
 * cycle so it becomes `0 → 1 ↔ -1`.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 排序请求 / 列表重排 — 由宿主在 `change` 里处理
 */

import { computed } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import { ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from '../sn-icon/sn-icon-set'

defineOptions({ name: 'SnSortButton' })

/** `1` ascending, `0` reset, `-1` descending. */
type SortButtonValue = 1 | 0 | -1

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-sort-button` 1:1 surface ─────────────────────────────── */

    /** Current direction (`v-model`). */
    modelValue?: SortButtonValue
    /** Button label. */
    title?: string
    /** Include the reset state in the tap cycle. */
    allowReset?: boolean
    /** Cycle to descending before ascending. */
    descFirst?: boolean
    /** Render an underline under the label. */
    line?: boolean
    /** Class on the root node. */
    customClass?: string
    /** Inline style on the root node. */
    customStyle?: string
  }>(),
  {
    modelValue: 0,
    title: '',
    allowReset: false,
    descFirst: false,
    line: false,
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: SortButtonValue): void
  (e: 'change', payload: { value: SortButtonValue }): void
}>()

/**
 * The next direction for the current one.
 *
 * With `allowReset` the full three-state cycle rotates
 * (`0 → 1 → -1 → 0`, or `0 → -1 → 1 → 0` when `descFirst`). Without it the
 * reset state is only the initial one and the button toggles between
 * `1` and `-1`.
 */
function nextValue(current: SortButtonValue): SortButtonValue {
  if (current === 0) return props.descFirst ? -1 : 1
  if (current === 1) {
    if (props.descFirst) return props.allowReset ? 0 : -1
    return -1
  }
  if (props.descFirst) return 1
  return props.allowReset ? 0 : 1
}

function onTap(): void {
  const next = nextValue(props.modelValue)
  emit('update:modelValue', next)
  emit('change', { value: next })
}

const isActive = computed(() => props.modelValue !== 0)

const rootClass = computed(() => [
  'sn-sort-button',
  {
    'sn-sort-button--active': isActive.value,
    'sn-sort-button--asc': props.modelValue === 1,
    'sn-sort-button--desc': props.modelValue === -1,
    'sn-sort-button--line': props.line,
  },
  props.customClass,
])

const rootStyle = computed(() => props.customStyle || undefined)

/** Chevron shown for the current direction (`ChevronDown` when reset). */
const arrowIcon = computed(() => (props.modelValue === 1 ? ChevronUpIcon : ChevronDownIcon))

const ariaSort = computed(() => {
  if (props.modelValue === 1) return 'ascending'
  if (props.modelValue === -1) return 'descending'
  return 'none'
})
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'sort-button'"
    role="button"
    :aria-label="title || 'sort'"
    :aria-sort="ariaSort"
    tabindex="0"
    @tap="onTap"
  >
    <text class="sn-sort-button__title">{{ title }}</text>
    <view class="sn-sort-button__arrow" aria-hidden="true">
      <SnIcon :icon="arrowIcon" :size="24" />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-sort-button {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  font-family: inherit;
  color: var(--sn-mp-color-text-secondary);
}

.sn-sort-button--active {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-sort-button__title {
  font-size: var(--sn-mp-font-size-md);
  line-height: 1.4;
}

.sn-sort-button__arrow {
  display: flex;
  align-items: center;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-sort-button--active .sn-sort-button__arrow {
  color: var(--sn-mp-color-action-primary);
}

/* `line` renders the underline under the whole control. */
.sn-sort-button--line {
  border-bottom: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: 0;
}

.sn-sort-button--line.sn-sort-button--active {
  border-bottom-color: var(--sn-mp-color-action-primary);
}

/* Doodle skin — hand-drawn underline. */
.snui-skin-doodle .sn-sort-button--line {
  border-bottom-width: 4rpx;
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
