<script setup lang="ts">
/**
 * SnBreadcrumbItem — leaf / separator-aware breadcrumb child (AUI-WEB-NAV-003).
 *
 * Reference library: naive-ui `n-breadcrumb-item`
 *   (https://www.naiveui.com/zh-CN/light/components/breadcrumb)
 * Per AGENTS.md §112, prop names + slot shape mirror n-breadcrumb-item 1:1.
 *
 * 1:1 parity (this version):
 *   - href / clickable / separator / showSeparator / onClick
 *   - default slot + separator slot
 *   - aria-current="location" when window.location.href matches href
 *   - icon prop (extension beyond naive-ui; matches the SnIcon-on-everywhere
 *     §113 contract — never let users paste a Unicode glyph here)
 *
 * n-breadcrumb-item renders the separator INSIDE the <li> (next to the
 * link). SnBreadcrumbItem mirrors that exactly: the `<li>` owns both the
 * link element and the trailing separator `<span>`.
 */

import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import SnIcon from '../icon/SnIcon.vue'
import type { IconComponent } from '../icon/sn-icon-registry'

defineOptions({ name: 'SnBreadcrumbItem' })

const props = withDefaults(
  defineProps<{
    /** When set, renders as <a href>. Mirrors n-breadcrumb-item `href`. */
    href?: string
    /** Whether the item is interactive (clickable / hover). Mirrors
     * n-breadcrumb-item `clickable`. Default true. */
    clickable?: boolean
    /** Per-item separator override (falls back to parent SnBreadcrumb.separator).
     * Mirrors n-breadcrumb-item `separator`. */
    separator?: string
    /** Whether to render a trailing separator. Mirrors n-breadcrumb-item
     * `showSeparator`. Default true. */
    showSeparator?: boolean
    /** Optional leading icon. SnIcon-wrapped (per AGENTS §113). */
    icon?: IconComponent
    /** Click handler. Mirrors n-breadcrumb-item `onClick`. */
    onClick?: (e: MouseEvent) => void
  }>(),
  {
    href: '',
    clickable: true,
    separator: '',
    showSeparator: true,
  },
)

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

defineSlots<{
  /** Item label content. */
  default?(): unknown
  /** Per-item separator override slot. Takes precedence over the
   *  `separator` prop and over the parent SnBreadcrumb.separator. */
  separator?(): unknown
}>()

type SeparatorFn = () => string
const getParentSeparator = inject<SeparatorFn>('sn-breadcrumb-separator', () => '/')

/** Renders the item as <a> when href is set, otherwise <span>. Mirrors
 *  n-breadcrumb-item's htmlTagRef. */
const htmlTag = computed<'a' | 'span'>(() => (props.href ? 'a' : 'span'))

/* ─────────── aria-current: location ───────────
 * n-breadcrumb-item sets aria-current="location" when the browser URL
 * matches the item's href. We poll window.location on a ref so SPA route
 * changes also re-evaluate (component re-renders). SSR-safe — the ref is
 * only updated after onMounted runs (no `window` access during setup). */
const currentHref = ref('')
function syncLocation(): void {
  if (typeof window !== 'undefined') currentHref.value = window.location.href
}
onMounted(() => {
  syncLocation()
  window.addEventListener('popstate', syncLocation)
  window.addEventListener('snui:route-change', syncLocation)
})
onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('popstate', syncLocation)
  window.removeEventListener('snui:route-change', syncLocation)
})

const ariaCurrent = computed<'location' | null>(() => {
  if (!props.href) return null
  // Strip fragment + query for the comparison — naive-ui compares the
  // full URL but most apps treat the path as the canonical match.
  try {
    const here = new URL(currentHref.value)
    const there = new URL(props.href, currentHref.value || undefined)
    if (here.pathname !== there.pathname) return null
  } catch {
    if (currentHref.value !== props.href) return null
  }
  return 'location'
})

/** Effective separator: item's `separator` prop > parent separator > '/'. */
const effectiveSeparator = computed<string>(() => props.separator || getParentSeparator())

function handleClick(e: MouseEvent): void {
  props.onClick?.(e)
}
</script>

<template>
  <li
    :class="[
      'sn-breadcrumb-item',
      clickable ? 'sn-breadcrumb-item--clickable' : 'sn-breadcrumb-item--disabled',
    ]"
  >
    <component
      :is="htmlTag"
      :class="[
        'sn-breadcrumb-item__link',
        icon ? 'sn-breadcrumb-item__link--has-icon' : '',
      ]"
      :href="href || undefined"
      :aria-current="ariaCurrent ?? undefined"
      @click="handleClick"
    >
      <SnIcon
        v-if="icon"
        :icon="icon"
        :size="14"
        class="sn-breadcrumb-item__icon"
      />
      <slot />
    </component>
    <span
      v-if="showSeparator"
      class="sn-breadcrumb-item__separator"
      role="separator"
      aria-hidden="true"
    >
      <slot name="separator">{{ effectiveSeparator }}</slot>
    </span>
  </li>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  list-style: none;
}

.sn-breadcrumb-item__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--sn-web-color-text-secondary);
  text-decoration: none;
  border-radius: 4px;
  padding: 2px 4px;
  margin: -2px -4px;
  transition: color 0.2s var(--sn-web-bezier-ease, ease);
}

.sn-breadcrumb-item--clickable .sn-breadcrumb-item__link {
  cursor: pointer;
}
.sn-breadcrumb-item--clickable .sn-breadcrumb-item__link:hover {
  color: var(--sn-web-color-text-primary);
  background: var(--sn-web-color-background-subtle);
}

.sn-breadcrumb-item__link[aria-current='location'] {
  color: var(--sn-web-color-text-primary);
  font-weight: 500;
}

.sn-breadcrumb-item__icon {
  flex: none;
}

.sn-breadcrumb-item__separator {
  margin: 0 6px;
  color: var(--sn-web-color-text-secondary);
  opacity: 0.6;
  user-select: none;
}

/* Doodle skin */
.snui-skin-doodle .sn-breadcrumb-item__separator {
  font-weight: 700;
}
</style>