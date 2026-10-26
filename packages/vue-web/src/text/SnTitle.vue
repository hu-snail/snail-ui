<script setup lang="ts">
/**
 * SnTitle — web-end section heading (AUI-WEB-TY-002).
 *
 * Reference library: naive-ui `n-title`
 *   (https://www.naiveui.com/zh-CN/light/components/typography)
 * Thin wrapper over SnText: `level` maps to the h1-h6 element and the
 * reference header font scale (30 / 22 / 18 / 16 / 16 / 16 px, weight 500).
 * Styling props forward 1:1 to SnText.
 *
 * Divergence: no outer margins — vertical rhythm is owned by the page layout.
 *
 * Usage:
 *   <SnTitle :level="2">标题</SnTitle>
 *   <SnTitle :level="3" type="primary">重点章节</SnTitle>
 */

import { computed } from 'vue'
import SnText from './SnText.vue'

defineOptions({ name: 'SnTitle' })

const props = withDefaults(
  defineProps<{
    /** Heading level — renders <h1>…<h6> at the matching font size. Mirrors n-title `level`. */
    level?: 1 | 2 | 3 | 4 | 5 | 6
    /** Semantic type — drives the heading color. Mirrors n-title `type`. */
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
    /** Gray scale — only applied for type="default". Mirrors n-title `depth`. */
    depth?: '1' | '2' | '3' | undefined
    /** Bolder text. Mirrors n-title `strong`. */
    strong?: boolean
    /** Italic text. Mirrors n-title `italic`. */
    italic?: boolean
    /** Underlined text. Mirrors n-title `underline`. */
    underline?: boolean
    /** Strike-through text. Mirrors n-title `delete`. */
    delete?: boolean
  }>(),
  {
    level: 1,
    type: 'default',
    depth: undefined,
    strong: false,
    italic: false,
    underline: false,
    delete: false,
  },
)

defineSlots<{
  /** Heading content. */
  default?(): unknown
}>()

const headingTag = computed<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>(
  () => `h${props.level}`,
)

// `delete` cannot be referenced bare in a template expression (JS keyword),
// so the forwarded props are built here.
const forwardedProps = computed(() => ({
  type: props.type,
  depth: props.depth,
  strong: props.strong,
  italic: props.italic,
  underline: props.underline,
  delete: props.delete,
}))
</script>

<template>
  <SnText
    v-bind="forwardedProps"
    :tag="headingTag"
    class="sn-title"
    :class="`sn-title--level-${level}`"
  >
    <slot />
  </SnText>
</template>

<style scoped>
/* Two-class selectors beat SnText's single-class font-size regardless of
 * stylesheet injection order. */

.sn-title {
  font-weight: 500;
}

.sn-title.sn-title--level-1 {
  font-size: 30px;
}

.sn-title.sn-title--level-2 {
  font-size: 22px;
}

.sn-title.sn-title--level-3 {
  font-size: 18px;
}

.sn-title.sn-title--level-4 {
  font-size: 16px;
}

.sn-title.sn-title--level-5 {
  font-size: 16px;
}

.sn-title.sn-title--level-6 {
  font-size: 16px;
}
</style>
