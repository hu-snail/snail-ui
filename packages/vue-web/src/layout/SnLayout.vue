<script setup lang="ts">
/**
 * SnLayout — web-end page frame container (AUI-WEB-LAYOUT-006).
 *
 * Reference library: naive-ui `n-layout`
 *   (https://www.naiveui.com/zh-CN/light/components/layout)
 * Per AGENTS.md §112, props + semantics mirror n-layout 1:1 for the
 * declared surface: hasSider / position ('static' | 'absolute') /
 * contentStyle / siderStyle. headerStyle / footerStyle extend the same
 * passthrough model to the Header / Footer pieces (naive applies those
 * inline on n-layout-header / n-layout-footer directly).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Orchestration contract (matches naive-ui composition semantics):
 *   - default: vertical flex column (header → content → footer stack)
 *   - `has-sider`: horizontal flex row (sider + rest, nest an inner
 *     SnLayout for the header/content/footer stack)
 *   - `position="absolute"`: root fills its nearest positioned ancestor
 *     (inset 0), so an absolute SnLayoutSider anchors to it
 *
 * Simplified vs naive (intentional v0.1 scope cut, see ai-description.md):
 *   - single root element, no inner scroll-container split
 *   - `natively` / `onScroll` / scrollbar props not implemented
 *
 * Usage:
 *   <SnLayout>
 *     <SnLayoutHeader>top</SnLayoutHeader>
 *     <SnLayoutContent>main</SnLayoutContent>
 *     <SnLayoutFooter>bottom</SnLayoutFooter>
 *   </SnLayout>
 *
 *   <!-- With sider: -->
 *   <SnLayout has-sider>
 *     <SnLayoutSider show-trigger />
 *     <SnLayout>
 *       <SnLayoutHeader>top</SnLayoutHeader>
 *       <SnLayoutContent>main</SnLayoutContent>
 *     </SnLayout>
 *   </SnLayout>
 */

import { computed, provide, toRef } from 'vue'
import type { CSSProperties } from 'vue'
import { SN_LAYOUT_KEY } from './sn-layout-types'
import type { SnLayoutPosition, SnLayoutStyleValue } from './sn-layout-types'

defineOptions({ name: 'SnLayout' })

// Reference: naive-ui layoutProps
//   (https://github.com/tusen-ai/naive-ui/blob/main/src/layout/src/Layout.tsx)
// hasSider / position / contentStyle / siderStyle match n-layout 1:1.
// headerStyle / footerStyle follow the same passthrough contract for the
// sibling pieces.
const props = withDefaults(
  defineProps<{
    /** Whether the layout arranges children in a row (sider present).
     * Mirrors n-layout `has-sider`. Default false. */
    hasSider?: boolean
    /** Positioning mode. 'static' keeps normal flow; 'absolute' pins the
     * root to inset 0. Mirrors n-layout `position`. Default 'static'. */
    position?: SnLayoutPosition
    /** Inline style forwarded to SnLayoutContent children. Mirrors
     * n-layout `content-style`. */
    contentStyle?: SnLayoutStyleValue
    /** Inline style forwarded to SnLayoutHeader children. */
    headerStyle?: SnLayoutStyleValue
    /** Inline style forwarded to SnLayoutFooter children. */
    footerStyle?: SnLayoutStyleValue
    /** Inline style forwarded to SnLayoutSider children. Mirrors
     * n-layout `sider-style`. */
    siderStyle?: SnLayoutStyleValue
  }>(),
  {
    hasSider: false,
    position: 'static',
  },
)

defineSlots<{
  /** Layout pieces: SnLayoutHeader / SnLayoutContent / SnLayoutFooter /
   * SnLayoutSider (or a nested SnLayout when combining sider + stack). */
  default?(): unknown
}>()

provide(SN_LAYOUT_KEY, {
  hasSider: toRef(props, 'hasSider'),
  position: toRef(props, 'position'),
  contentStyle: toRef(props, 'contentStyle'),
  headerStyle: toRef(props, 'headerStyle'),
  footerStyle: toRef(props, 'footerStyle'),
  siderStyle: toRef(props, 'siderStyle'),
  isInsideLayout: true,
})

const rootStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    display: 'flex',
    flexDirection: props.hasSider ? 'row' : 'column',
  }
  if (props.hasSider) {
    style.flexWrap = 'nowrap'
  }
  if (props.position === 'absolute') {
    style.position = 'absolute'
    style.top = '0'
    style.right = '0'
    style.bottom = '0'
    style.left = '0'
  }
  return style
})
</script>

<template>
  <div
    :class="[
      'sn-layout',
      hasSider ? 'sn-layout--has-sider' : '',
      position === 'absolute' ? 'sn-layout--absolute' : '',
    ]"
    :style="rootStyle"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-layout {
  position: relative; /* static layouts still anchor absolute siders */
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
}

.sn-layout--has-sider {
  flex-wrap: nowrap;
}
</style>
