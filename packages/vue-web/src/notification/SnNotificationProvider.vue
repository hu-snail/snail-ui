<script setup lang="ts">
/**
 * SnNotificationProvider — mounts the notification stack, provides the
 * `useNotification()` API to its subtree (AUI-WEB-FB-012).
 *
 * Reference library: naive-ui `n-notification-provider`
 *   (https://www.naiveui.com/zh-CN/light/components/notification)
 * Per AGENTS.md §112, semantics mirror `n-notification-provider` 1:1:
 * `placement` / `max` drive the stack; the provider exposes the same
 * `NotificationApi` shape (`create` / `info` / `success` / `warning` /
 * `error` / `destroyAll`) through the context key consumed by
 * `useNotification()`.
 *
 * Behaviour mirrors the reference provider:
 *   - `placement` defaults to 'top-right'; the container is `position: fixed`
 *     on the matching screen corner, `flex-direction: column`, gap 8px.
 *   - `max` caps the stack: pushing beyond the cap evicts the oldest card
 *     first (the reference library drops the oldest entry too).
 *   - The stack is teleported to `body` so it is never clipped by an
 *     ancestor's `overflow` / transform; `z-index` defaults to 6000+.
 *   - Cards enter/leave/move through `<TransitionGroup>` — slide + fade with
 *     a height collapse, so pushing a card animates the siblings out of the
 *     way exactly like the reference.
 *   - `onAfterEnter` / `onAfterLeave` option callbacks fire from the stack's
 *     transition hooks (mapped back to their entry via the card's
 *     `data-snui-key` attribute); `onClose` fires on every destroy path.
 *
 * Divergence from the reference provider (documented):
 *   - Upstream merges defaults from `n-config-provider`; here `placement` /
 *     `max` are per-instance props only (SnConfigProvider does not cover the
 *     notification stack yet).
 *   - The container reads `--sn-web-*` tokens in CSS instead of upstream's
 *     JS theme object (AGENTS.md §34).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnNotificationProvider>
 *     <SomeDescendant />  ← calls useNotification() inside its setup()
 *   </SnNotificationProvider>
 */

import { computed, provide, ref } from 'vue'
import type { CSSProperties } from 'vue'
import SnNotification from './SnNotification.vue'
import { notificationApiInjectionKey } from './use-notification'
import type {
  NotificationApi,
  NotificationOptions,
  NotificationPlacement,
  NotificationReactive,
} from './notification-types'

defineOptions({ name: 'SnNotificationProvider' })

const props = withDefaults(
  defineProps<{
    /**
     * Screen corner (or edge) anchoring the stack. Mirrors the reference
     * `placement` prop; defaults to 'top-right'.
     */
    placement?: NotificationPlacement
    /**
     * Maximum number of cards on screen at once. Pushing beyond the cap
     * evicts the oldest card first.
     */
    max?: number
    /**
     * Teleport target for the stack container. Mirrors the reference `to`
     * prop; defaults to 'body'.
     */
    to?: string | HTMLElement
    /**
     * Extra inline style for the stack container. Mirrors the reference
     * `containerStyle` prop.
     */
    containerStyle?: string | CSSProperties
    /**
     * Let the stack scroll internally when it outgrows the viewport.
     * Mirrors the reference `scrollable` prop.
     */
    scrollable?: boolean
  }>(),
  {
    placement: 'top-right',
    max: Infinity,
    to: 'body',
    scrollable: false,
  },
)

/** One entry in the stack: its options plus a stable transition key. */
interface NotificationEntry {
  key: number
  options: NotificationOptions
}

const entries = ref<NotificationEntry[]>([])
let seed = 0

function nextKey(): number {
  seed += 1
  return seed
}

/**
 * Options survive the removal of their entry so `onAfterLeave` can still
 * fire when the card's leave transition completes. Cleaned up per key.
 */
const optionsByKey = new Map<number, NotificationOptions>()

/**
 * Remove an entry by key. Fires the entry's `onClose` callback; the card's
 * leave transition then plays, and `onAfterLeave` fires when it completes.
 */
function destroyByKey(key: number): void {
  const index = entries.value.findIndex((entry) => entry.key === key)
  if (index === -1) {
    return
  }
  entries.value.splice(index, 1)
  optionsByKey.get(key)?.onClose?.()
}

function destroyEntry(entry: NotificationEntry): void {
  destroyByKey(entry.key)
}

/**
 * Push a notification. `forceType` comes from the per-type shortcuts
 * (`info()` / `success()` / …) — it wins over a conflicting `options.type`,
 * mirroring the reference API's per-type methods.
 */
function create(options: NotificationOptions, forceType?: NotificationOptions['type']): NotificationReactive {
  const resolved: NotificationOptions = forceType
    ? { ...options, type: forceType }
    : options
  const key = nextKey()
  entries.value.push({ key, options: resolved })
  optionsByKey.set(key, resolved)

  // Cap the stack: evict the oldest entries first (same policy as the
  // reference library's `max`).
  const cap = props.max
  if (Number.isFinite(cap) && entries.value.length > cap) {
    const overflow = entries.value.length - cap
    const evicted = entries.value.splice(0, overflow)
    for (const evictedEntry of evicted) {
      optionsByKey.get(evictedEntry.key)?.onClose?.()
    }
  }

  return {
    destroy: () => destroyByKey(key),
  }
}

const api: NotificationApi = {
  create: (options) => create(options),
  info: (options) => create(options, 'info'),
  success: (options) => create(options, 'success'),
  warning: (options) => create(options, 'warning'),
  error: (options) => create(options, 'error'),
  destroyAll: () => {
    const all = entries.value
    entries.value = []
    for (const entry of all) {
      optionsByKey.get(entry.key)?.onClose?.()
    }
  },
}

provide(notificationApiInjectionKey, api)

/** Per-placement fixed positioning. */
const PLACEMENT_STYLE: Record<NotificationPlacement, Record<string, string>> = {
  top: {
    top: 'var(--sn-web-notification-offset, 24px)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  'top-right': {
    top: 'var(--sn-web-notification-offset, 24px)',
    right: 'var(--sn-web-notification-offset, 24px)',
  },
  'top-left': {
    top: 'var(--sn-web-notification-offset, 24px)',
    left: 'var(--sn-web-notification-offset, 24px)',
  },
  bottom: {
    bottom: 'var(--sn-web-notification-offset, 24px)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  'bottom-right': {
    bottom: 'var(--sn-web-notification-offset, 24px)',
    right: 'var(--sn-web-notification-offset, 24px)',
  },
  'bottom-left': {
    bottom: 'var(--sn-web-notification-offset, 24px)',
    left: 'var(--sn-web-notification-offset, 24px)',
  },
}

const containerStyle = computed(() => {
  const style: Record<string, string> = { ...PLACEMENT_STYLE[props.placement] }
  // Bottom stacks must grow *upward*; top stacks grow downward.
  style.flexDirection = props.placement.startsWith('bottom') ? 'column-reverse' : 'column'
  return style
})

/** Consumer-supplied extra container style (reference `containerStyle`). */
const containerStyleProp = computed(() => props.containerStyle)

/**
 * Enter/leave slide direction: 'down' for top placements (cards slide in
 * from above), 'up' for bottom ones (cards slide up from below).
 */
const slideDirection = computed(() =>
  props.placement.startsWith('bottom') ? 'up' : 'down',
)

/** Map a transition-hook element back to its entry via `data-snui-key`. */
function entryKeyOf(el: Element): number {
  const raw = el.getAttribute('data-snui-key')
  const key = raw === null ? Number.NaN : Number(raw)
  return Number.isFinite(key) ? key : Number.NaN
}

function handleAfterEnter(el: Element): void {
  optionsByKey.get(entryKeyOf(el))?.onAfterEnter?.()
}

function handleAfterLeave(el: Element): void {
  const key = entryKeyOf(el)
  optionsByKey.get(key)?.onAfterLeave?.()
  optionsByKey.delete(key)
}
</script>

<template>
  <Teleport :to="to">
    <div
      class="sn-notification-container"
      :class="[
        `sn-notification-container--${placement}`,
        scrollable && 'sn-notification-container--scrollable',
      ]"
      :style="[containerStyle, containerStyleProp]"
      role="region"
      aria-label="Notifications"
      data-snui-component="notification-provider"
    >
      <TransitionGroup
        :name="`sn-notification-${slideDirection}`"
        @after-enter="handleAfterEnter"
        @after-leave="handleAfterLeave"
      >
        <SnNotification
          v-for="entry in entries"
          :key="entry.key"
          v-bind="entry.options"
          :data-snui-key="entry.key"
          @destroy="destroyEntry(entry)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
  <slot />
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 * No notification-specific token exists yet, so sizes read
 * `var(--sn-web-notification-*, <fallback>)` — overridable, with the
 * fallback as the built-in default. */

.sn-notification-container {
  position: fixed;
  z-index: var(--sn-web-notification-z-index, 6000);
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-notification-gap, 8px);
  /* The container is an overlay: clicks pass through the empty space, only
   * the cards themselves are interactive. */
  pointer-events: none;
}

/* scrollable: the stack scrolls internally instead of overflowing the
 * viewport (reference `scrollable` prop). */
.sn-notification-container--scrollable {
  max-height: calc(100vh - 2 * var(--sn-web-notification-offset, 24px));
  overflow-y: auto;
}

/*
 * ── TransitionGroup enter/leave/move classes ─────────────────────────────
 * Slide + fade, plus a height collapse so siblings close the gap smoothly
 * when a card is removed. 'down' = top placements (slide in from above);
 * 'up' = bottom placements (slide up from below).
 */

.sn-notification-down-enter-active,
.sn-notification-up-enter-active {
  transition:
    opacity 0.25s cubic-bezier(0, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0, 0, 0.2, 1);
}

.sn-notification-down-leave-active,
.sn-notification-up-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.sn-notification-down-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.sn-notification-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.sn-notification-down-leave-to,
.sn-notification-up-leave-to {
  opacity: 0;
}

/* Height collapse while a card leaves: the gap lives on the container, so a
 * leaving card neutralises its share via a negative margin on the matching
 * side and the siblings slide smoothly instead of snapping. */
.sn-notification-down-leave-active {
  margin-bottom: calc(-1 * var(--sn-web-notification-gap, 8px));
}

.sn-notification-up-leave-active {
  margin-top: calc(-1 * var(--sn-web-notification-gap, 8px));
}
</style>
