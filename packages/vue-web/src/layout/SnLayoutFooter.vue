<script setup lang="ts">
/**
 * SnLayoutFooter — web-end layout bottom bar (AUI-WEB-LAYOUT-006).
 *
 * Reference library: naive-ui `n-layout-footer`
 *   (https://www.naiveui.com/zh-CN/light/components/layout)
 * Per AGENTS.md §112, semantics mirror n-layout-footer 1:1 (a fixed bottom
 * region inside an SnLayout stack). n-layout-footer declares no props;
 * the footer height is driven by the `--sn-web-layout-footer-height`
 * token (default 64px), and SnLayout's `footer-style` passthrough is
 * merged into the root style via provide/inject (see sn-layout-types.ts).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 */

import { computed, inject } from 'vue'
import type { CSSProperties } from 'vue'
import { SN_LAYOUT_KEY } from './sn-layout-types'
import type { SnLayoutStyleValue } from './sn-layout-types'

defineOptions({ name: 'SnLayoutFooter' })

const layout = inject(SN_LAYOUT_KEY, null)

/** Height token: override app-wide via :root { --sn-web-layout-footer-height }.
 * NOTE: no space after the comma inside var() — happy-dom's CSSOM (test
 * env) drops `var(--x, 64px)` declarations; the two forms are equivalent
 * in browsers. */
const FOOTER_HEIGHT_TOKEN = 'var(--sn-web-layout-footer-height,64px)'

const baseStyle = computed<CSSProperties>(() => ({
  flex: '0 0 auto',
  height: FOOTER_HEIGHT_TOKEN,
}))

const injectedStyle = computed<SnLayoutStyleValue | undefined>(
  () => layout?.footerStyle.value,
)
</script>

<template>
  <div class="sn-layout-footer" :style="[baseStyle, injectedStyle]">
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-layout-footer {
  box-sizing: border-box;
}
</style>
