<script setup lang="ts">
/**
 * SnList — generic list container (AUI-WEB-DD-012).
 *
 * Reference library: naive-ui `n-list`
 *   (https://www.naiveui.com/zh-CN/light/components/list)
 * Per AGENTS.md §112, props + slots mirror n-list 1:1:
 *   size / bordered / clickable / hoverable / show-divider;
 *   slots: header / default / footer.
 *
 * Items (`<SnListItem>`) read `show-divider` through list-context.ts.
 *
 * Documented divergences (not §112 violations):
 *   - `size` is accepted and emitted as a `sn-list--<size>` modifier
 *     class only; the reference theme defines a single list fontSize, so
 *     the prop has no metric effect there either.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnList bordered hoverable>
 *     <template #header>通知</template>
 *     <SnListItem>内容</SnListItem>
 *     <template #footer>共 3 条</template>
 *   </SnList>
 */

import { provide, toRef } from 'vue';
import { SN_LIST_INJECTION_KEY } from './list-context';

defineOptions({ name: 'SnList' });

const props = withDefaults(
  defineProps<{
    /** Font scale marker (emitted as a modifier class). */
    size?: 'small' | 'medium' | 'large';
    /** Draw the outer border with rounded corners. */
    bordered?: boolean;
    /** Rows get the pointer cursor. */
    clickable?: boolean;
    /** Rows highlight on hover. */
    hoverable?: boolean;
    /** Render the 1px divider between rows. */
    showDivider?: boolean;
  }>(),
  {
    size: 'medium',
    bordered: false,
    clickable: false,
    hoverable: false,
    showDivider: true,
  },
);

defineSlots<{
  /** `<SnListItem>` rows. */
  default?(): unknown;
  /** Header content (bordered off from the rows). */
  header?(): unknown;
  /** Footer content. */
  footer?(): unknown;
}>();

provide(SN_LIST_INJECTION_KEY, {
  showDivider: toRef(props, 'showDivider'),
});
</script>

<template>
  <ul
    data-snui-component="list"
    class="sn-list"
    :class="[
      `sn-list--${size}`,
      bordered ? 'sn-list--bordered' : '',
      showDivider ? 'sn-list--show-divider' : '',
      hoverable ? 'sn-list--hoverable' : '',
      clickable ? 'sn-list--clickable' : '',
    ]"
  >
    <li v-if="$slots.header" class="sn-list__header">
      <slot name="header" />
    </li>
    <slot />
    <li v-if="$slots.footer" class="sn-list__footer">
      <slot name="footer" />
    </li>
  </ul>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-list {
  margin: 0;
  font-size: 14px;
  padding: 0;
  list-style-type: none;
  color: var(--sn-web-color-text-secondary);
  background-color: var(--sn-web-color-background-surface);
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}

/* naive list borderColor = dividerColor (≈6% ink on white) — the hairline
 * mix, not the heavier --sn-web-color-border-* tokens. */
.sn-list--bordered {
  border: 1px solid
    color-mix(in srgb, var(--sn-web-color-text-primary) 6%, var(--sn-web-color-background-surface));
  border-radius: 3px;
}

.sn-list__header,
.sn-list__footer {
  padding: 12px 0;
  box-sizing: border-box;
  list-style: none;
  transition: border-color 0.3s ease;
}

.sn-list__header:not(:last-child) {
  border-bottom: 1px solid
    color-mix(in srgb, var(--sn-web-color-text-primary) 6%, var(--sn-web-color-background-surface));
}

/* Bordered / hoverable lists pad the header/footer like the rows. */
.sn-list--bordered .sn-list__header,
.sn-list--bordered .sn-list__footer,
.sn-list--hoverable .sn-list__header,
.sn-list--hoverable .sn-list__footer {
  padding: 12px 20px;
}
</style>
