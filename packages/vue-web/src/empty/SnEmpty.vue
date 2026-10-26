<script setup lang="ts">
/**
 * SnEmpty — empty-state placeholder (AUI-WEB-DD-006).
 *
 * Reference library: naive-ui `n-empty`
 *   (https://www.naiveui.com/zh-CN/light/components/empty)
 * Per AGENTS.md §112, props + slots mirror n-empty 1:1:
 *   description / show-description / show-icon / size;
 *   slots: default (replaces the description) / extra / icon.
 *
 * The default glyph is an inline SVG port of the reference empty-icon
 * artwork (a document with a strike-through circle) — per AGENTS.md §113
 * component icons are always inline SVG, never SnIcon / emoji.
 *
 * Documented divergences (not §112 violations):
 *   - The `render-icon` render-function prop is not implemented; use the
 *     `icon` slot instead.
 *   - The description falls back to the fixed zh locale string `无数据`;
 *     the reference resolves it through its locale system.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnEmpty />
 *   <SnEmpty description="没有更多了" size="small" />
 *   <SnEmpty><template #extra><SnButton size="small">重试</SnButton></template></SnEmpty>
 */

import { computed } from 'vue';

defineOptions({ name: 'SnEmpty' });

const props = withDefaults(
  defineProps<{
    /** Description text; the `default` slot overrides it. */
    description?: string;
    /** Render the description line. */
    showDescription?: boolean;
    /** Render the default glyph (or the `icon` slot). */
    showIcon?: boolean;
    /** Visual scale of the glyph + description. */
    size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge';
  }>(),
  {
    showDescription: true,
    showIcon: true,
    size: 'medium',
  },
);

defineSlots<{
  /** Replaces the description line. */
  default?(): unknown;
  /** Additional content below the description (e.g. a retry button). */
  extra?(): unknown;
  /** Custom glyph — replaces the default inline SVG. */
  icon?(): unknown;
}>();

const descriptionText = computed(() => props.description ?? '无数据');
</script>

<template>
  <div data-snui-component="empty" class="sn-empty" :class="`sn-empty--${size}`">
    <div v-if="showIcon" class="sn-empty__icon" aria-hidden="true">
      <slot v-if="$slots.icon" name="icon" />
      <svg v-else viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
        <path
          d="M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z"
          fill="currentColor"
        />
        <path
          d="M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z"
          fill="currentColor"
        />
      </svg>
    </div>
    <div v-if="showDescription" class="sn-empty__description">
      <slot v-if="$slots.default" />
      <template v-else>{{ descriptionText }}</template>
    </div>
    <div v-if="$slots.extra" class="sn-empty__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-empty {
  --sn-empty-icon-size: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}

.sn-empty--tiny {
  --sn-empty-icon-size: 28px;
  font-size: 12px;
}

.sn-empty--small {
  --sn-empty-icon-size: 34px;
  font-size: 12px;
}

.sn-empty--large {
  --sn-empty-icon-size: 46px;
  font-size: 15px;
}

.sn-empty--huge {
  --sn-empty-icon-size: 52px;
  font-size: 16px;
}

.sn-empty__icon {
  width: var(--sn-empty-icon-size);
  height: var(--sn-empty-icon-size);
  font-size: var(--sn-empty-icon-size);
  line-height: var(--sn-empty-icon-size);
  color: var(--sn-web-color-text-disabled);
  transition: color 0.3s ease;
}

.sn-empty__icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.sn-empty__icon + .sn-empty__description {
  margin-top: 8px;
}

.sn-empty__description {
  transition: color 0.3s ease;
  color: var(--sn-web-color-text-disabled);
}

.sn-empty__extra {
  text-align: center;
  transition: color 0.3s ease;
  margin-top: 12px;
  color: var(--sn-web-color-text-secondary);
}
</style>
