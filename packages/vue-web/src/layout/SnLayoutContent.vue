<script setup lang="ts">
/**
 * SnLayoutContent — web-end layout main region (AUI-WEB-LAYOUT-006).
 *
 * Reference library: naive-ui `n-layout-content`
 *   (https://www.naiveui.com/zh-CN/light/components/layout)
 * Per AGENTS.md §112, semantics mirror n-layout-content 1:1 (the flexible,
 * scrollable main region inside an SnLayout stack). n-layout-content
 * declares no props; the flex-grow / scroll behavior is built in, and
 * SnLayout's `content-style` passthrough is merged into the root style
 * via provide/inject (see sn-layout-types.ts).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 */

import { computed, inject } from 'vue'
import type { CSSProperties } from 'vue'
import { SN_LAYOUT_KEY } from './sn-layout-types'
import type { SnLayoutStyleValue } from './sn-layout-types'

defineOptions({ name: 'SnLayoutContent' })

const layout = inject(SN_LAYOUT_KEY, null)

const baseStyle = computed<CSSProperties>(() => ({
  flex: '1 1 auto',
  minHeight: '0',
  overflowY: 'auto',
}))

const injectedStyle = computed<SnLayoutStyleValue | undefined>(
  () => layout?.contentStyle.value,
)
</script>

<template>
  <div class="sn-layout-content" :style="[baseStyle, injectedStyle]">
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-layout-content {
  box-sizing: border-box;
}
</style>
