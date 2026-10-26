<script setup lang="ts">
/**
 * SnListItem — one row of a `<SnList>` (AUI-WEB-DD-012).
 *
 * Reference library: naive-ui `n-list-item`
 *   (https://www.naiveui.com/zh-CN/light/components/list)
 * Per AGENTS.md §112, slots mirror n-list-item 1:1:
 *   prefix / default / suffix.
 *
 * The parent `<SnList>` provides `show-divider` via list-context.ts; an
 * item rendered outside a list degrades to a standalone row (divider on,
 * like the reference default) instead of throwing.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnList>
 *     <SnListItem>
 *       <template #prefix>1</template>
 *       内容
 *       <template #suffix>操作</template>
 *     </SnListItem>
 *   </SnList>
 */

import { inject, ref } from 'vue';
import { SN_LIST_INJECTION_KEY } from './list-context';

defineOptions({ name: 'SnListItem' });

defineSlots<{
  /** Row main content. */
  default?(): unknown;
  /** Leading content (avatar, index…). */
  prefix?(): unknown;
  /** Trailing content (actions, meta…). */
  suffix?(): unknown;
}>();

const list = inject(SN_LIST_INJECTION_KEY, undefined);
const showDivider = list ? list.showDivider : ref(true);
</script>

<template>
  <li class="sn-list-item">
    <div v-if="$slots.prefix" class="sn-list-item__prefix">
      <slot name="prefix" />
    </div>
    <div v-if="$slots.default" class="sn-list-item__main">
      <slot />
    </div>
    <div v-if="$slots.suffix" class="sn-list-item__suffix">
      <slot name="suffix" />
    </div>
    <div v-if="showDivider" class="sn-list-item__divider" />
  </li>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-list-item {
  position: relative;
  padding: 12px 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

/* Bordered / hoverable lists pad the rows (parent modifier drives it). */
.sn-list--bordered .sn-list-item,
.sn-list--hoverable .sn-list-item {
  padding: 12px 20px;
}

.sn-list-item__prefix {
  margin-right: 20px;
  /* flex: 0 lets suffix/prefix shrink to min-content and squeezes the main
   * column (suffix text wraps vertically); keep both at natural size. */
  flex: none;
}

.sn-list-item__suffix {
  margin-left: 20px;
  flex: none;
  text-align: right;
}

.sn-list-item__main {
  flex: 1;
  min-width: 0;
}

.sn-list-item__divider {
  height: 1px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: transparent;
  transition: background-color 0.3s ease;
  pointer-events: none;
}

.sn-list--show-divider .sn-list-item:not(:last-child) .sn-list-item__divider {
  background-color: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 6%,
    var(--sn-web-color-background-surface)
  );
}

.sn-list--hoverable .sn-list-item {
  border-radius: 3px;
}

/* Row hover mirrors naive hoverColor rgb(243,243,245) ≈ 4.7% ink on white. */
.sn-list--hoverable .sn-list-item:hover {
  background-color: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 4.7%,
    var(--sn-web-color-background-surface)
  );
}

.sn-list--hoverable .sn-list-item:hover .sn-list-item__divider {
  background-color: transparent;
}

.sn-list--clickable .sn-list-item {
  cursor: pointer;
}
</style>
