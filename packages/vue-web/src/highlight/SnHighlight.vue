<script setup lang="ts">
/**
 * SnHighlight — web-end keyword highlighter for plain text (AUI-WEB-DD-009).
 *
 * Reference library: naive-ui `n-highlight`
 *   (https://www.naiveui.com/zh-CN/light/components/highlight)
 * Per AGENTS.md §112, props + semantics mirror n-highlight 1:1:
 *   text / patterns / highlight-tag / case-sensitive / auto-escape /
 *   highlight-class / highlight-style.
 *
 * Documented divergences (not §112 violations):
 *   - None functional. The split-and-mark algorithm mirrors the reference
 *     util exactly (matchAll over `('p1|p2|…')` with `g` / `gi` flags, so
 *     matches are left-to-right and non-overlapping; an empty `patterns`
 *     array or empty `text` renders the plain text only).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web. It ships no
 * mark styling of its own — the matched fragment keeps the browser default
 * `<mark>` appearance unless overridden through `highlight-style` /
 * `highlight-class`, so no color tokens are consumed by default.
 *
 * Usage:
 *   <SnHighlight text="Naive UI 是一个组件库" :patterns="['Naive UI']" />
 *   <SnHighlight text="…" :patterns="['…']" case-sensitive />
 *   <SnHighlight text="…" :patterns="['…']" highlight-tag="span" highlight-style="text-decoration: underline" />
 */

import { computed } from 'vue'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SnHighlight' })

const props = withDefaults(
  defineProps<{
    /** Full text to render. Mirrors n-highlight `text`. */
    text?: string | undefined
    /** Substrings to highlight; matched fragments render inside `highlight-tag`. Mirrors n-highlight `patterns`. */
    patterns?: string[]
    /** HTML element used for matched fragments. Mirrors n-highlight `highlight-tag`. */
    highlightTag?: string
    /** Case-sensitive matching. Mirrors n-highlight `case-sensitive`. */
    caseSensitive?: boolean
    /** Escape regex metacharacters in `patterns` so they match literally. Mirrors n-highlight `auto-escape`. */
    autoEscape?: boolean
    /** Extra class merged onto matched fragments. Mirrors n-highlight `highlight-class`. */
    highlightClass?: string | undefined
    /** Inline style (object or string) merged onto matched fragments. Mirrors n-highlight `highlight-style`. */
    highlightStyle?: CSSProperties | string | undefined
  }>(),
  {
    text: undefined,
    patterns: () => [],
    highlightTag: 'mark',
    caseSensitive: false,
    autoEscape: true,
    highlightClass: undefined,
    highlightStyle: undefined,
  },
)

/** One fragment of the segmented text; matched fragments become marks. */
interface SnHighlightSegment {
  text: string
  isMatch: boolean
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Mirrors the reference `splitAndMarkByRegex` util: walk every match of a
 * global regex and cut the source string into alternating plain/marked
 * fragments. Non-global regexes are a programming error here.
 */
function splitAndMarkByRegex(str: string, regex: RegExp): SnHighlightSegment[] {
  if (!regex.global) {
    throw new Error(
      'splitAndMarkByRegex requires a global regex (with "g" flag)',
    )
  }

  const result: SnHighlightSegment[] = []
  let lastIndex = 0
  for (const match of str.matchAll(regex)) {
    const index = match.index
    if (index > lastIndex) {
      result.push({ text: str.slice(lastIndex, index), isMatch: false })
    }
    result.push({ text: match[0], isMatch: true })
    lastIndex = index + match[0].length
  }
  if (lastIndex < str.length) {
    result.push({ text: str.slice(lastIndex), isMatch: false })
  }
  return result
}

const segments = computed<SnHighlightSegment[]>(() => {
  const { patterns, text } = props
  // Reference behavior: no patterns or no text → the text renders plain.
  if (patterns.length === 0 || !text) {
    return [{ text: text ?? '', isMatch: false }]
  }

  const pattern = patterns
    .map((word) => (props.autoEscape ? escapeRegExp(word) : word))
    .join('|')
  const regex = new RegExp(`(${pattern})`, props.caseSensitive ? 'g' : 'gi')
  return splitAndMarkByRegex(text, regex)
})
</script>

<template>
  <span data-snui-component="highlight" class="sn-highlight">
    <template v-for="(segment, index) in segments" :key="index">
      <component
        :is="highlightTag"
        v-if="segment.isMatch"
        class="sn-highlight__mark"
        :class="highlightClass"
        :style="highlightStyle"
      >{{ segment.text }}</component>
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>
