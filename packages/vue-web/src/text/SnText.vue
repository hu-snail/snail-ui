<script setup lang="ts">
/**
 * SnText — web-end inline text (AUI-WEB-TY-001).
 *
 * Reference library: naive-ui `n-text`
 *   (https://www.naiveui.com/zh-CN/light/components/typography)
 * Per AGENTS.md §112, props + semantics mirror n-text 1:1:
 *   type / depth / strong / italic / underline / delete / code / tag.
 *
 * Documented divergences (not §112 violations):
 *   - `disabled` / `customClass` / `customStyle` are added per the component
 *     task spec; naive-ui drives them via theme + attr fallthrough instead.
 *   - naive-ui nests <strong>/<del>/<u>/<code> semantic wrappers; this
 *     version styles the single root element (underline + delete merge into
 *     one `text-decoration` declaration).
 *   - n-text `keyboard` and the deprecated `as` alias are not implemented.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnText>plain</SnText>
 *   <SnText type="error" delete>已删除</SnText>
 *   <SnText tag="blockquote" depth="3">引用</SnText>
 */

import { computed } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SnText' })

const props = withDefaults(
  defineProps<{
    /** Semantic type — drives the text color. Mirrors n-text `type`. */
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
    /** Gray scale — only applied for type="default". Mirrors n-text `depth`. */
    depth?: '1' | '2' | '3' | undefined
    /** Bolder text. Mirrors n-text `strong`. */
    strong?: boolean
    /** Italic text. Mirrors n-text `italic`. */
    italic?: boolean
    /** Underlined text. Mirrors n-text `underline`. */
    underline?: boolean
    /** Strike-through text. Mirrors n-text `delete`. */
    delete?: boolean
    /** Inline-code styling (mono font + subtle background). Mirrors n-text `code`. */
    code?: boolean
    /** Greyed-out text with a not-allowed cursor. */
    disabled?: boolean
    /** Rendered element. Mirrors n-text `tag`. */
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'blockquote'
    /** Extra class merged onto the rendered element. */
    customClass?: string
    /** Inline style merged onto the rendered element. */
    customStyle?: string | CSSProperties | undefined
  }>(),
  {
    type: 'default',
    depth: undefined,
    strong: false,
    italic: false,
    underline: false,
    delete: false,
    code: false,
    disabled: false,
    tag: 'span',
    customClass: '',
    customStyle: undefined,
  },
)

defineSlots<{
  /** Text content. */
  default?(): unknown
}>()

// n-text applies `depth` only to the default type — a colored text keeps its
// type color even when depth is set.
const effectiveDepth = computed(() => (props.type === 'default' ? props.depth : undefined))

// `text-decoration` is not additive across declarations: underline + delete
// must merge into one value to render "line-through underline".
const decorationStyle = computed<CSSProperties | undefined>(() => {
  const parts: string[] = []
  if (props.underline) parts.push('underline')
  if (props.delete) parts.push('line-through')
  return parts.length > 0 ? { textDecoration: parts.join(' ') } : undefined
})
</script>

<template>
  <component
    :is="tag"
    data-snui-component="text"
    class="sn-text"
    :class="[
      `sn-text--${type}`,
      effectiveDepth ? `sn-text--depth-${effectiveDepth}` : '',
      strong ? 'sn-text--strong' : '',
      italic ? 'sn-text--italic' : '',
      code ? 'sn-text--code' : '',
      disabled ? 'sn-text--disabled' : '',
      customClass,
    ]"
    :style="[decorationStyle, customStyle]"
  >
    <slot />
  </component>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-text {
  color: var(--sn-web-color-text-secondary);
  font-size: 14px;
}

/* Depth scales the neutral gray — only emitted for type="default". */
.sn-text--depth-1 {
  color: var(--sn-web-color-text-primary);
}

.sn-text--depth-3 {
  color: var(--sn-web-color-text-tertiary);
}

.sn-text--primary {
  color: var(--sn-web-color-action-primary);
}

.sn-text--info {
  color: var(--sn-web-color-feedback-info);
}

.sn-text--success {
  color: var(--sn-web-color-feedback-success);
}

.sn-text--warning {
  color: var(--sn-web-color-feedback-warning);
}

.sn-text--error {
  color: var(--sn-web-color-feedback-danger);
}

.sn-text--strong {
  font-weight: 500;
}

.sn-text--italic {
  font-style: italic;
}

.sn-text--code {
  padding: 2px 4px;
  border-radius: 2px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  background: var(--sn-web-color-background-subtle);
}

.sn-text--disabled {
  color: var(--sn-web-color-text-disabled);
  cursor: not-allowed;
}
</style>
