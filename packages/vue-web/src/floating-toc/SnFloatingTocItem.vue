<script setup lang="ts">
/**
 * SnFloatingTocItem — a pressable entry inside the expanded panel
 * (AUI-WEB-NAV-010).
 *
 * Reference library: HeroUI Pro `FloatingToc.Item`. `href` / `title` are AUI
 * additions (see {@link SnFloatingTocBar}); when the default slot is used the
 * item is a plain slot host and `href` still drives activation.
 *
 * Renders a real `<button type="button">`, so native button attributes pass
 * through and Enter / Space work for free.
 */

import { computed, inject } from 'vue';
import { snFloatingTocInjectionKey } from './sn-floating-toc-context';
import { clampLevel } from './sn-floating-toc-utils';

defineOptions({ name: 'SnFloatingTocItem', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** Highlights this item as the currently active section. */
    active?: boolean | undefined;
    /** Nesting depth (1 = top-level). Deeper levels are indented. */
    level?: number;
    /** Section anchor (`'#intro'`) this entry navigates to. */
    href?: string;
    /** Label. Falls back to the matching bar's title via the root registry. */
    title?: string;
  }>(),
  {
    active: undefined,
    level: 1,
    href: '',
    title: '',
  },
);

defineSlots<{ default?(): unknown }>();

const context = inject(snFloatingTocInjectionKey, null);

const level = computed(() => clampLevel(props.level));

const isActive = computed(() => props.active ?? context?.activeHref.value === props.href);

/** Explicit `title` first, else the registry entry the bar registered for
 *  the same `href` — HeroUI shows the section label in both places. */
const registryTitle = computed(
  () => context?.sections.value.find((section) => section.href === props.href)?.title ?? '',
);

const label = computed(() => props.title || registryTitle.value);

const style = computed(() => ({
  '--floating-toc-level': level.value,
  paddingInlineStart: `calc(var(--sn-web-spacing-2) + (var(--floating-toc-level) - 1) * var(--floating-toc-item-indent))`,
}));

function handleClick(): void {
  if (!props.href) return;
  context?.activateSection(props.href);
  // HeroUI closes the panel on selection; a host `@click` still runs.
  context?.requestClose();
}
</script>

<template>
  <button
    v-bind="$attrs"
    type="button"
    class="sn-floating-toc__item"
    data-snui-component="floating-toc-item"
    :data-active="isActive ? 'true' : 'false'"
    :data-level="level"
    :style="style"
    :aria-current="isActive ? 'location' : undefined"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
.sn-floating-toc__item {
  display: block;
  width: 100%;
  padding-block: var(--sn-web-spacing-1);
  padding-inline-end: var(--sn-web-spacing-2);
  overflow: hidden;
  border: none;
  border-radius: var(--sn-web-radius-sm);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-family: var(--sn-web-font-family-body);
  font-size: var(--sn-web-font-size-sm);
  line-height: var(--sn-web-font-line-height-normal);
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.sn-floating-toc__item:hover,
.sn-floating-toc__item[data-hovered='true'] {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}

.sn-floating-toc__item:active,
.sn-floating-toc__item[data-pressed='true'] {
  background: var(--sn-web-color-background-overlay);
}

.sn-floating-toc__item[data-active='true'] {
  color: var(--floating-toc-color-active);
  font-weight: var(--sn-web-font-weight-medium);
}

.sn-floating-toc__item:disabled,
.sn-floating-toc__item[aria-disabled='true'] {
  color: var(--sn-web-color-text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.sn-floating-toc__item:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: -2px;
}
</style>
