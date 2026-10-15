<script setup lang="ts">
/**
 * SnAnchorLink — one navigable entry inside `<SnAnchor>` (AUI-WEB-NAV-007).
 *
 * Reference library: naive-ui `n-anchor-link`
 *   (https://www.naiveui.com/zh-CN/light/components/anchor)
 * Per AGENTS.md §112, props + semantics mirror n-anchor-link 1:1.
 *
 * 1:1 parity (this version): title / href, plus the `title` and `default`
 *   slots. `default` holds nested links (sub-sections).
 *
 * Behaviour mirrors n-anchor-link:
 *   - The link reports its href and its title element to the parent anchor on
 *     mount, and removes both on unmount.
 *   - It becomes active when its `href` equals the parent's active href, and
 *     asks the parent to slide the rail bar onto its title element.
 *   - Clicking asks the parent to scroll to the section and activate it.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnAnchorLink title="简介" href="#intro" />
 */

import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { snAnchorInjectionKey } from './sn-anchor-context'

defineOptions({ name: 'SnAnchorLink' })

const props = withDefaults(
  defineProps<{
    /** Link label. Mirrors n-anchor-link `title`. */
    title?: string
    /** Target section id, e.g. `#intro`. Mirrors n-anchor-link `href`. */
    href?: string
  }>(),
  {
    title: '',
    href: undefined as any,
  },
)

defineSlots<{
  /** Nested `SnAnchorLink` children (sub-sections). */
  default?(): unknown
  /** Link label — overrides the `title` prop. */
  title?(): unknown
}>()

const anchor = inject(snAnchorInjectionKey, null)

if (!anchor) {
  throw new Error(
    '[snui] SnAnchorLink must be placed inside SnAnchor (missing sn-anchor context).',
  )
}

// Re-bind after the guard so TS keeps the non-null type inside closures.
const anchorContext = anchor

const titleRef = ref<HTMLElement | null>(null)

const active = computed(
  () => !!props.href && props.href === anchorContext.activeHref.value,
)

// ---------- Parent registration ----------

onMounted(() => {
  if (props.href !== undefined) anchorContext.collectedLinkHrefs.push(props.href)
  if (titleRef.value) anchorContext.titleEls.push(titleRef.value)
})

// Move the rail bar onto this link as it becomes active.
watch(active, (value) => {
  if (value && titleRef.value) {
    anchorContext.updateBarPosition(titleRef.value)
  }
})

onBeforeUnmount(() => {
  const hrefIndex = anchorContext.collectedLinkHrefs.indexOf(props.href ?? '')
  if (hrefIndex > -1) anchorContext.collectedLinkHrefs.splice(hrefIndex, 1)

  const el = titleRef.value
  if (el) {
    const elIndex = anchorContext.titleEls.indexOf(el)
    if (elIndex > -1) anchorContext.titleEls.splice(elIndex, 1)
  }
})

function handleClick(): void {
  if (props.href !== undefined) anchorContext.setActiveHref(props.href)
}
</script>

<template>
  <div
    class="sn-anchor-link"
    data-snui-component="anchor-link"
    :class="active ? 'sn-anchor-link--active' : ''"
  >
    <a
      ref="titleRef"
      class="sn-anchor-link__title"
      :href="href"
      :title="title || undefined"
      @click="handleClick"
    >
      <slot name="title">{{ title }}</slot>
    </a>
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-anchor-link {
  position: relative;
  z-index: 1;
  padding-left: 16px;
}

.sn-anchor-link__title {
  display: block;
  padding: 4px 0;
  border-radius: 4px;
  font-size: 14px;
  line-height: 22px;
  color: var(--sn-web-color-text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  cursor: pointer;
}

.sn-anchor-link__title:hover {
  color: var(--sn-web-color-action-primary-hover);
}

.sn-anchor-link__title:active {
  color: var(--sn-web-color-action-primary);
}

.sn-anchor-link--active > .sn-anchor-link__title {
  color: var(--sn-web-color-action-primary);
  font-weight: 500;
}

.sn-anchor-link__title:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 2px;
}

/* Nested links are indented one level per depth. */
.sn-anchor-link .sn-anchor-link {
  padding-left: 16px;
}
</style>
