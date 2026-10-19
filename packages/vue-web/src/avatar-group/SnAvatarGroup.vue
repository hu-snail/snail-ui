<script setup lang="ts">
/**
 * SnAvatarGroup — web-end avatar stack (AUI-WEB-DD-026).
 *
 * Reference library: naive-ui `n-avatar-group`
 *   (https://www.naiveui.com/zh-CN/light/components/avatar)
 * Per AGENTS.md §112, props + semantics mirror n-avatar-group 1:1:
 *   maxOptions ({ max, onExpand } | number) / size. Slot: default
 *   (SnAvatar list).
 *
 * Documented divergences (not §112 violations):
 *   - `sizeBehavior` ('tightening' | 'shrink') is implemented per the
 *     task spec; the reference documents only `maxOptions` + `size` on
 *     the group, so treat it as a local extension.
 *   - `size` styles the overflow summary avatar; child avatars come from
 *     the slot and keep their own size (the reference injects the group
 *     size into child n-avatars, which would require modifying SnAvatar).
 *   - Overflow rule: with `max: n` the group renders n − 1 avatars and a
 *     `+k` summary (k = total − n + 1), matching the reference.
 *   - No config-provider / RTL integration (web-end v3 has no provider
 *     yet).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnAvatarGroup :max-options="{ max: 3, onExpand: showAll }">
 *     <SnAvatar v-for="u in users" :key="u.id" :src="u.avatar" />
 *   </SnAvatarGroup>
 */

import { computed, useSlots, type CSSProperties } from 'vue'
import { Comment, Fragment } from 'vue'
import SnAvatar from '../avatar/SnAvatar.vue'

defineOptions({ name: 'SnAvatarGroup' })

/** Mirrors n-avatar-group `maxOptions`. */
export interface SnAvatarGroupMaxOptions {
  max: number
  onExpand?: () => void
}

const props = withDefaults(
  defineProps<{
    /**
     * Overflow control: `{ max, onExpand }` or a plain number. When the
     * slot renders more avatars than `max`, the group shows `max − 1`
     * avatars plus a clickable `+k` summary that calls `onExpand`.
     * Mirrors n-avatar-group `maxOptions`.
     */
    maxOptions?: SnAvatarGroupMaxOptions | number | undefined
    /** Size applied to the overflow summary avatar. Mirrors n-avatar-group `size`. */
    size?: number | 'small' | 'medium' | 'large' | undefined
    /**
     * Layout for the stack: 'tightening' overlaps avatars with a negative
     * margin, 'shrink' scales each following avatar down slightly.
     */
    sizeBehavior?: 'tightening' | 'shrink'
  }>(),
  {
    maxOptions: undefined,
    size: 'medium',
    sizeBehavior: 'tightening',
  },
)

defineSlots<{
  /** Avatar list — render SnAvatar elements. Mirrors n-avatar-group `default`. */
  default?(): unknown
}>()

const slots = useSlots()

/* ─────────── Slot vnodes ─────────── */
/** Flatten fragments / nested arrays and drop comment nodes. */
const avatarNodes = computed<{ vnode: unknown; key: number }[]>(() => {
  const out: { vnode: unknown; key: number }[] = []
  let key = 0
  const push = (value: unknown): void => {
    // Slots can hand back nested arrays (template v-for) or Fragment
    // vnodes — recurse into both so every avatar is counted once.
    if (Array.isArray(value)) {
      for (const entry of value) push(entry)
      return
    }
    const node = value as { type?: unknown; children?: unknown } | null
    if (!node || node.type === Comment) return
    if (node.type === Fragment && Array.isArray(node.children)) {
      push(node.children)
      return
    }
    out.push({ vnode: value, key: key++ })
  }
  push(slots.default?.() ?? [])
  return out
})

const totalCount = computed(() => avatarNodes.value.length)

/** `maxOptions` as a number is an alias for `{ max: n }` (no expand hook). */
const maxCount = computed<number | undefined>(() => {
  if (props.maxOptions === undefined) return undefined
  return typeof props.maxOptions === 'number' ? props.maxOptions : props.maxOptions.max
})

const onExpand = computed(() =>
  props.maxOptions !== undefined && typeof props.maxOptions === 'object'
    ? props.maxOptions.onExpand
    : undefined,
)

const overflowing = computed(
  () => maxCount.value !== undefined && totalCount.value > maxCount.value,
)

/** With `max: n` the visible avatars are the first n − 1 (reference rule). */
const shownNodes = computed(() => {
  if (!overflowing.value || maxCount.value === undefined) return avatarNodes.value
  const shown = Math.max(maxCount.value - 1, 0)
  return avatarNodes.value.slice(0, shown)
})

const restCount = computed(() => {
  if (!overflowing.value) return 0
  return totalCount.value - shownNodes.value.length
})

/* ─────────── Layout ─────────── */

/** Overlap depth for the tightening stack (px). */
const OVERLAP = 10
/** Per-index scale step for the shrink stack. */
const SHRINK_STEP = 0.06
const SHRINK_MIN = 0.7

function itemStyle(index: number): CSSProperties | undefined {
  if (props.sizeBehavior === 'tightening') {
    return index === 0 ? undefined : { marginLeft: `-${OVERLAP}px` }
  }
  const scale = Math.max(SHRINK_MIN, 1 - index * SHRINK_STEP)
  if (scale >= 1) return undefined
  return { transform: `scale(${scale})`, transformOrigin: 'left center' }
}

function handleExpand(): void {
  onExpand.value?.()
}

const restIsClickable = computed(() => onExpand.value !== undefined)
</script>

<template>
  <div data-snui-component="avatar-group" class="sn-avatar-group" :class="`sn-avatar-group--${sizeBehavior}`">
    <span
      v-for="(item, index) in shownNodes"
      :key="item.key"
      class="sn-avatar-group__item"
      :style="itemStyle(index)"
    >
      <component :is="item.vnode" />
    </span>
    <span v-if="restCount > 0" class="sn-avatar-group__rest">
      <component
        :is="restIsClickable ? 'button' : 'span'"
        class="sn-avatar-group__rest-trigger"
        :type="restIsClickable ? 'button' : undefined"
        :aria-label="restIsClickable ? `还有 ${restCount} 个头像` : undefined"
        @click="handleExpand"
      >
        <SnAvatar :size="size ?? 'medium'" class="sn-avatar-group__rest-avatar">+{{ restCount }}</SnAvatar>
      </component>
    </span>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-avatar-group {
  display: inline-flex;
  align-items: center;
}

.sn-avatar-group__item {
  display: inline-flex;
  flex: 0 0 auto;
  position: relative;
}

.sn-avatar-group--tightening .sn-avatar-group__item {
  box-shadow: 0 0 0 2px var(--sn-web-color-background-surface, #fff);
  border-radius: 3px;
}

.sn-avatar-group__rest {
  display: inline-flex;
  flex: 0 0 auto;
}

/* Tightening: the summary overlaps the last avatar the same way. */
.sn-avatar-group--tightening .sn-avatar-group__rest {
  margin-left: -10px;
}

.sn-avatar-group__rest-trigger {
  display: inline-flex;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: default;
}

button.sn-avatar-group__rest-trigger {
  cursor: pointer;
}

button.sn-avatar-group__rest-trigger:focus-visible {
  outline: var(--sn-web-focus-ring, 2px solid var(--sn-web-color-action-primary));
  outline-offset: 2px;
  border-radius: 3px;
}

.sn-avatar-group__rest-avatar {
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
  background: var(--sn-web-color-background-subtle);
}
</style>
