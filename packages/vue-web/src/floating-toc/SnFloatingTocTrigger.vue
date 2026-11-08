<script setup lang="ts">
/**
 * SnFloatingTocTrigger — the hover / focus / press target that wraps the bar
 * indicators (AUI-WEB-NAV-010).
 *
 * Reference library: HeroUI Pro `FloatingToc.Trigger`. It owns no props; only
 * pointer, focus and keyboard handling:
 *   - hover mode: pointer entry schedules an open after `openDelay` (or, with
 *     the root's `hoverAction="preview"`, arms the per-bar card instead),
 *     exit schedules a close after `closeDelay`;
 *   - focus / blur open and close the full panel in every mode, so the
 *     section list is always reachable by keyboard;
 *   - `Enter` / `Space` toggle, `Escape` closes, Arrow keys walk the active
 *     section and scroll to it.
 *
 * It renders a focusable `span` (`role="button"`, `tabindex="0"`) because the
 * rail is not a form control; native `span` attributes pass through, as in
 * HeroUI.
 */

import { computed, inject } from 'vue';
import { snFloatingTocInjectionKey } from './sn-floating-toc-context';

defineOptions({ name: 'SnFloatingTocTrigger', inheritAttrs: false });

defineSlots<{ default?(): unknown }>();

const context = inject(snFloatingTocInjectionKey, null);

// Template reads must go through computed wrappers: `context?.isOpen.value`
// in a template loses the ref auto-unwrap behind the optional chain and
// silently drops the render subscription (see SnFloatingTocContent).
const isOpen = computed(() => context?.isOpen.value === true);
const side = computed(() => context?.placement.value ?? 'right');

function handlePointerEnter(): void {
  // Pointer and focus differ: in `hoverAction: 'preview'` the pointer only
  // arms the per-bar card, while focus still needs the full panel.
  context?.triggerPointerEnter();
}

function handlePointerLeave(): void {
  context?.triggerPointerLeave();
}

function handleFocus(): void {
  context?.requestOpen();
}

function handleBlur(): void {
  context?.requestClose();
}

function handleClick(): void {
  // Pointer vs keyboard differ: in hover mode a click confirms an already
  // open panel rather than closing it, while `Enter` / `Space` stay a toggle.
  context?.triggerActivate();
}

function handleKeydown(event: KeyboardEvent): void {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      context?.toggleOpen();
      break;
    case 'Escape':
      event.preventDefault();
      context?.setOpen(false);
      break;
    case 'ArrowDown':
      event.preventDefault();
      context?.moveActive(1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      context?.moveActive(-1);
      break;
    default:
      break;
  }
}
</script>

<template>
  <span
    v-bind="$attrs"
    class="sn-floating-toc__trigger"
    data-snui-component="floating-toc-trigger"
    :data-placement="side"
    :data-open="isOpen ? 'true' : 'false'"
    role="button"
    tabindex="0"
    aria-haspopup="dialog"
    :aria-expanded="isOpen ? 'true' : 'false'"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
    @focus="handleFocus"
    @blur="handleBlur"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </span>
</template>

<style scoped>
.sn-floating-toc__trigger {
  display: flex;
  flex-direction: column;
  gap: var(--floating-toc-bar-gap);
  padding: 6px 2px;
  border-radius: var(--sn-web-radius-sm);
  cursor: pointer;
  outline: none;
}

.sn-floating-toc__trigger[data-placement='right'] {
  align-items: flex-start;
}

.sn-floating-toc__trigger[data-placement='left'] {
  align-items: flex-end;
}

.sn-floating-toc__trigger:focus-visible,
.sn-floating-toc__trigger[data-focus-visible='true'] {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 2px;
}
</style>
