<script setup lang="ts">
/**
 * SnParagraph — web-end body paragraph (AUI-WEB-TY-003).
 *
 * Reference library: naive-ui `n-paragraph`
 *   (https://www.naiveui.com/zh-CN/light/components/typography)
 * Thin wrapper over SnText that renders a <p> and adds a line-height scale
 * (`spacing`). Styling props forward 1:1 to SnText.
 *
 * Divergence: no outer margins — vertical rhythm is owned by the page layout.
 *
 * Usage:
 *   <SnParagraph>正文段落</SnParagraph>
 *   <SnParagraph spacing="tight" depth="3">紧凑说明文字</SnParagraph>
 */

import { computed } from 'vue';
import SnText from './SnText.vue';

defineOptions({ name: 'SnParagraph' });

const props = withDefaults(
  defineProps<{
    /** Line-height scale: tight 1.4 / base 1.6 / loose 1.8. */
    spacing?: 'tight' | 'base' | 'loose';
    /** Semantic type — drives the text color. Mirrors n-paragraph `type`. */
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
    /** Gray scale — only applied for type="default". Mirrors n-paragraph `depth`. */
    depth?: '1' | '2' | '3' | undefined;
    /** Bolder text. Mirrors n-paragraph `strong`. */
    strong?: boolean;
    /** Italic text. Mirrors n-paragraph `italic`. */
    italic?: boolean;
    /** Underlined text. Mirrors n-paragraph `underline`. */
    underline?: boolean;
    /** Strike-through text. Mirrors n-paragraph `delete`. */
    delete?: boolean;
  }>(),
  {
    spacing: 'base',
    type: 'default',
    depth: undefined,
    strong: false,
    italic: false,
    underline: false,
    delete: false,
  },
);

defineSlots<{
  /** Paragraph content. */
  default?(): unknown;
}>();

// `delete` cannot be referenced bare in a template expression (JS keyword),
// so the forwarded props are built here.
const forwardedProps = computed(() => ({
  type: props.type,
  depth: props.depth,
  strong: props.strong,
  italic: props.italic,
  underline: props.underline,
  delete: props.delete,
}));
</script>

<template>
  <SnText v-bind="forwardedProps" tag="p" class="sn-paragraph" :class="`sn-paragraph--${spacing}`">
    <slot />
  </SnText>
</template>

<style scoped>
.sn-paragraph {
  margin: 0;
  line-height: 1.6;
}

.sn-paragraph--tight {
  line-height: 1.4;
}

.sn-paragraph--loose {
  line-height: 1.8;
}
</style>
