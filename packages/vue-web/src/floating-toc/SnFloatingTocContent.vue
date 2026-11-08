<script setup lang="ts">
/**
 * SnFloatingTocContent — the floating panel that expands next to the bars
 * (AUI-WEB-NAV-010).
 *
 * Reference library: HeroUI Pro `FloatingToc.Content`.
 *
 * `placement` defaults to the root's `placement` (HeroUI derives it the same
 * way) and can be overridden per instance; `offset` is the distance in px
 * between the rail and the panel.
 *
 * The panel is not teleported: it stays next to the trigger inside the fixed
 * root, so plain CSS places it and no portal container is needed. It is
 * unmounted while closed — nothing to focus-trap and nothing to dispose
 * (AGENTS.md §41).
 *
 * The open test happens in the render function, not in the template, because
 * a template expression that reads `context?.isOpen.value` compiles to
 * `_ctx.context?.isOpen.value`. In <script setup> a template read of a *ref*
 * used to be auto-unwrapped; with optional chaining the compiler can no longer
 * prove the read is a ref, so the subscription is dropped and the template
 * never re-renders when the panel opens or closes (the panel stayed on screen
 * after Escape / a second press-mode toggle). `open` below is a plain computed
 * read through `withCtx`, which tracks as expected.
 */

import { computed, inject } from 'vue';
import { snFloatingTocInjectionKey } from './sn-floating-toc-context';

defineOptions({ name: 'SnFloatingTocContent', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** Distance in px from the trigger. */
    offset?: number;
    /** Side the panel is placed on. Defaults to the side opposite the root's
     *  `placement`, i.e. towards the page content. */
    placement?: 'left' | 'right' | undefined;
    /** Accessible name of the panel (`role="dialog"`). */
    ariaLabel?: string | undefined;
  }>(),
  {
    offset: 8,
    placement: undefined,
    ariaLabel: undefined,
  },
);

defineSlots<{ default?(): unknown }>();

const context = inject(snFloatingTocInjectionKey, null);

const isOpen = computed(() => context?.isOpen.value === true);

/**
 * Side the panel is placed on, relative to the rail.
 *
 * HeroUI derives it from the root placement and it is the *opposite* one: a
 * TOC anchored to the right edge must open leftwards (into the page), or the
 * panel would render outside the viewport. Passing `placement` overrides it.
 */
const side = computed<'left' | 'right'>(() => {
  if (props.placement) return props.placement;
  return context?.placement.value === 'left' ? 'right' : 'left';
});

/** HeroUI Popover parity: Escape closes the panel from anywhere inside it. */
function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return;
  event.preventDefault();
  context?.setOpen(false);
}
</script>

<template>
  <Transition name="sn-floating-toc-panel">
    <div
      v-if="isOpen"
      v-bind="$attrs"
      class="sn-floating-toc__content"
      data-snui-component="floating-toc-content"
      :data-placement="side"
      :style="{ '--floating-toc-content-offset': `${offset}px` }"
      role="dialog"
      :aria-label="ariaLabel"
      @keydown="handleKeydown"
    >
      <slot />
    </div>
  </Transition>
</template>

<style scoped>
.sn-floating-toc__content {
  position: absolute;
  top: 50%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 160px;
  max-width: var(--floating-toc-content-width);
  max-height: 60vh;
  padding: var(--sn-web-spacing-2);
  overflow-y: auto;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-lg);
  background: var(--sn-web-color-background-elevated);
  box-shadow: var(--sn-web-shadow-lg);
  transform: translateY(-50%);
}

.sn-floating-toc__content[data-placement='right'] {
  left: calc(100% + var(--floating-toc-content-offset));
}

.sn-floating-toc__content[data-placement='left'] {
  right: calc(100% + var(--floating-toc-content-offset));
}

/* ---------- Slide-in entry (HeroUI `data-entering` / `data-exiting`) ---------- */

.sn-floating-toc-panel-enter-active,
.sn-floating-toc-panel-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.sn-floating-toc-panel-enter-from,
.sn-floating-toc-panel-leave-to {
  opacity: 0;
}

.sn-floating-toc-panel-enter-from[data-placement='right'],
.sn-floating-toc-panel-leave-to[data-placement='right'] {
  transform: translateY(-50%) translateX(-6px);
}

.sn-floating-toc-panel-enter-from[data-placement='left'],
.sn-floating-toc-panel-leave-to[data-placement='left'] {
  transform: translateY(-50%) translateX(6px);
}
</style>
