<script setup lang="ts">
/**
 * SnTabPane — a single tabbed panel (AUI-WEB-NAV-002).
 *
 * Reference library: naive-ui `n-tab-pane`. Per AGENTS.md §112, prop names
 * + slot shape mirror the reference child component.
 *
 * Must be placed inside a parent `<SnTabs>`. On mount it registers itself
 * with the parent so the tab strip can render the label; on unmount it
 * de-registers. Visibility is driven by whether this pane's `name` equals
 * the parent's active value.
 *
 * Usage:
 *   <SnTabPane name="a" tab="Tab A">Content A</SnTabPane>
 */

import { computed, inject, onBeforeUnmount, ref, watch, type Ref } from 'vue'

defineOptions({ name: 'SnTabPane' })

const props = withDefaults(
  defineProps<{
    /** Unique identifier within the parent SnTabs. Required. */
    name: string | number
    /** Tab label shown in the strip. Mirrors n-tab-pane `tab`. */
    tab?: string | number
    /** Disable activation of this pane. Mirrors n-tab-pane `disabled`. */
    disabled?: boolean
    /** How hidden pane content is handled: 'if' unmounts, 'show' keeps the
     * DOM and toggles display, 'show:lazy' keeps the DOM after first show.
     * Mirrors n-tab-pane `displayDirective`. Default 'if'. */
    displayDirective?: 'if' | 'show' | 'show:lazy'
    /** Per-pane closable override. Mirrors n-tab-pane `closable`, which
     * declares `default: undefined` precisely so that an absent value stays
     * `undefined` (letting the parent flag win) instead of Vue's boolean
     * casting turning it into `false`. The explicit `| undefined` in the
     * type keeps that distinction intact. */
    closable?: boolean | undefined
  }>(),
  {
    // `tab` is intentionally omitted: its natural `undefined` is the
    // default, and listing it explicitly breaks under
    // `exactOptionalPropertyTypes: true`.
    disabled: false,
    displayDirective: 'if',
    // `closable` must stay `undefined` when not passed so the parent's flag
    // wins. Vue's boolean casting would otherwise coerce an absent Boolean
    // prop to `false` (mirrors n-tab-pane's `default: undefined`).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    closable: undefined as any,
  },
)

defineSlots<{
  /** Pane body content. */
  default?(): unknown
}>()

/**
 * §112 marker: n-tab-pane also exposes `tab` / `prefix` / `suffix` slots for
 * rich (vnode) tab labels. Not implemented here — the strip renders the
 * `tab` prop as plain text. See SnTabs header comment.
 */

interface SnTabPaneDescriptor {
  name: string | number
  tab: string
  disabled: boolean
  closable?: boolean
}

const activeValue = inject<Ref<string | number | null>>('sn-tabs-active-value', ref(null))
const paneClass = inject<Ref<string | undefined>>('sn-tabs-pane-class', ref(undefined))
const paneStyle = inject<Ref<string | Record<string, string> | undefined>>(
  'sn-tabs-pane-style',
  ref(undefined),
)
const registerPane = inject<(d: SnTabPaneDescriptor) => void>('sn-tabs-register-pane', () => {})
const unregisterPane = inject<(name: string | number) => void>('sn-tabs-unregister-pane', () => {})

/** Label text registered with the parent strip. Falls back to `name` so a
 *  pane without an explicit `tab` still renders something. */
const label = computed<string>(() => {
  if (props.tab !== undefined) return String(props.tab)
  return String(props.name)
})

function syncRegistration(): void {
  registerPane({
    name: props.name,
    tab: label.value,
    disabled: props.disabled,
    closable: props.closable,
  })
}

syncRegistration()

watch(
  () => [props.name, label.value, props.disabled, props.closable],
  () => { syncRegistration() },
)

onBeforeUnmount(() => {
  unregisterPane(props.name)
})

/** Whether this pane is the active one. */
const isActive = computed(() => activeValue.value === props.name)

/** Track whether we have ever been shown — needed for 'show:lazy'. */
const hasBeenShown = ref(false)
watch(isActive, (active) => {
  if (active) hasBeenShown.value = true
}, { immediate: true })

/** Mount strategy ('if' → only while active; 'show'/'show:lazy' → keep DOM). */
const shouldMount = computed(() => {
  switch (props.displayDirective) {
    case 'show':
      return true
    case 'show:lazy':
      return hasBeenShown.value
    case 'if':
    default:
      return isActive.value
  }
})

/** Whether to hide via CSS (only meaningful in 'show' modes). */
const shouldHide = computed(() => (
  props.displayDirective !== 'if' && !isActive.value
))
</script>

<template>
  <div
    v-if="shouldMount"
    v-show="!shouldHide"
    :class="['sn-tabs-pane', paneClass]"
    :style="paneStyle"
    role="tabpanel"
    :aria-hidden="isActive ? undefined : 'true'"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-tabs-pane {
  color: var(--sn-web-color-text-primary);
  font-size: 14px;
  line-height: 1.6;
}
</style>
