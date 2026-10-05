<script setup lang="ts">
/**
 * SnDivider — visual separator between content blocks.
 *
 * Per Spec-02 v1.1 §5 (end: web), Web-side component CSS uses only
 * `--sn-web-*` aliases (px units). The `end: web` marker in
 * ai-description.md is consumed by `@snui/cli` and MCP tools for
 * per-end filtering.
 *
 * Usage:
 *   <SnDivider />
 *   <SnDivider direction="vertical" />
 *   <SnDivider dashed>中间文字</SnDivider>
 *
 * Not responsible for:
 *   - 复杂布局（用 SnSpace / SnLayout）
 *   - 装饰图标 / 动画
 */

import { useSlots } from 'vue'

defineOptions({ name: 'SnDivider' })

const props = withDefaults(
  defineProps<{
    /** Axis: horizontal (full-width line) or vertical (inline line). */
    direction?: 'horizontal' | 'vertical'
    /** Dashed instead of solid. */
    dashed?: boolean
    /** Optional color override (CSS color value). */
    color?: string
    /** Vertical margin (only for horizontal direction). */
    marginSize?: 'small' | 'medium' | 'large'
  }>(),
  {
    direction: 'horizontal',
    dashed: false,
    color: '',
    marginSize: 'medium',
  },
)

defineSlots<{
  /** Optional content shown on the line (e.g. "OR"). */
  default?(): unknown
}>()

// useSlots() reference keeps vue-tsc treating this file as a Vue SFC and
// emits the compiled JS to dist/divider/SnDivider.vue.js. Without an
// explicit `import { ... } from 'vue'`, vue-tsc may skip JS emission and
// leave raw SFC markup in dist — which trips up downstream consumers that
// resolve `import { SnDivider } from '@snui/vue-web'` via the package
// main entry.
void useSlots
</script>

<template>
  <div
    role="separator"
    :aria-orientation="direction === 'vertical' ? 'vertical' : 'horizontal'"
    :class="[
      'sn-divider',
      `sn-divider--${direction}`,
      `sn-divider--margin-${marginSize}`,
      dashed ? 'sn-divider--dashed' : '',
      $slots.default ? 'sn-divider--with-text' : '',
    ]"
    :style="color ? { borderColor: color } : undefined"
  >
    <span v-if="$slots.default && direction === 'horizontal'" class="sn-divider__text">
      <slot />
    </span>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-divider {
  background: transparent;
}

.sn-divider--horizontal {
  display: flex;
  align-items: center;
  width: 100%;
  border-top: 1px solid var(--sn-web-color-border-default);
}

.sn-divider--horizontal.sn-divider--dashed {
  border-top-style: dashed;
}

.sn-divider--vertical {
  display: inline-block;
  align-self: stretch;
  height: 1em;
  margin: 0 8px;
  border-left: 1px solid var(--sn-web-color-border-default);
  vertical-align: middle;
}

.sn-divider--vertical.sn-divider--dashed {
  border-left-style: dashed;
}

.sn-divider--margin-small {
  margin: 8px 0;
}

.sn-divider--margin-medium {
  margin: 16px 0;
}

.sn-divider--margin-large {
  margin: 24px 0;
}

.sn-divider__text {
  padding: 0 12px;
  color: var(--sn-web-color-text-secondary);
  font-size: 14px;
  background: var(--sn-web-color-background-surface);
}

/* Doodle skin: thick ink dashed line + sticker-bordered text label. */
.snui-skin-doodle .sn-divider--horizontal {
  border-top-width: 2.5px;
  border-top-color: #1a1a1a;
  border-top-style: dashed;
}
.snui-skin-doodle .sn-divider--vertical {
  border-left-width: 2.5px;
  border-left-color: #1a1a1a;
  border-left-style: dashed;
}
.snui-skin-doodle .sn-divider__text {
  padding: 2px 10px;
  border: 2px solid #1a1a1a;
  border-radius: 10px 2px / 2px 10px;
  font-weight: 700;
  background: var(--sn-web-color-background-surface);
  box-shadow: 2px 2px 0 #1a1a1a;
}
</style>