<script setup lang="ts">
/**
 * SnCode — web-end code block with optional line-number gutter (AUI-WEB-DD-002).
 *
 * Reference library: naive-ui `n-code`
 *   (https://www.naiveui.com/zh-CN/light/components/code)
 * Per AGENTS.md §112, props + semantics mirror n-code 1:1:
 *   code / language / trim / inline / word-wrap / show-line-numbers / uri /
 *   default slot.
 *
 * Documented divergences (not §112 violations):
 *   - `hljs` is NOT implemented (no new dependency allowed per task spec):
 *     `language="json"` tokenizes through a built-in minimal JSON highlighter
 *     (key / string / number / keyword / punct classes colored via semantic
 *     tokens + color-mix); every other language renders as plain monospace
 *     text. hljs integration is a future marker.
 *   - `trim` only applies on the highlighted (json) path — mirroring the
 *     reference, where trimming happens inside the hljs branch; the plain
 *     branch renders the raw string untouched.
 *   - Line numbers are counted from the DISPLAYED text (trim-applied on the
 *     json path, raw prop in slot mode) so the gutter and the code stay
 *     strictly aligned; the reference counts from the raw `code` prop, which
 *     desynchronizes the two columns when trim removes blank lines.
 *   - The `uri` decode falls back to the raw string on malformed input
 *     instead of throwing.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnCode :code="source" language="json" show-line-numbers />
 *   <SnCode :code="source" word-wrap />
 *   <SnCode code="const x = 1" inline />
 */

import { computed, useSlots } from 'vue'

defineOptions({ name: 'SnCode' })

const props = withDefaults(
  defineProps<{
    /** Source code text. Mirrors n-code `code`. */
    code?: string
    /** Highlighter language. Only `json` tokenizes (built-in); others render plain. Mirrors n-code `language`. */
    language?: string | undefined
    /** Trim the displayed code on the highlighted path. Mirrors n-code `trim`. */
    trim?: boolean
    /** Inline (single-line) rendering without the pre wrapper. Mirrors n-code `inline`. */
    inline?: boolean
    /** Soft-wrap overflowing lines. Mirrors n-code `word-wrap`. */
    wordWrap?: boolean
    /** Show the line-number gutter (ignored when inline or word-wrap). Mirrors n-code `show-line-numbers`. */
    showLineNumbers?: boolean
    /** Decode `code` as a URI component before display. Mirrors n-code `uri`. */
    uri?: boolean
  }>(),
  {
    code: '',
    language: undefined,
    trim: true,
    inline: false,
    wordWrap: false,
    showLineNumbers: false,
    uri: false,
  },
)

defineSlots<{
  /** Custom code content; replaces the rendered code (the gutter still follows `code`). */
  default?(): unknown
}>()

/** One lexical segment of the displayed code. `type: null` renders plain text. */
interface SnCodeSegment {
  text: string
  type: 'key' | 'string' | 'number' | 'keyword' | 'punct' | null
}

const slots = useSlots()

const mergedShowLineNumbers = computed(
  () => props.showLineNumbers && !props.inline && !props.wordWrap,
)

function decodeUri(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const decodedCode = computed(() =>
  props.uri ? decodeUri(props.code) : props.code,
)

const isJsonHighlighted = computed(() => props.language === 'json')

/** The text actually displayed. Plain mode stays raw (reference no-hljs branch). */
const displayedCode = computed(() => {
  if (!isJsonHighlighted.value) return decodedCode.value
  return props.trim ? decodedCode.value.trim() : decodedCode.value
})

const segments = computed<SnCodeSegment[]>(() => {
  if (!isJsonHighlighted.value) {
    return [{ text: displayedCode.value, type: null }]
  }
  return tokenizeJson(displayedCode.value)
})

const lineNumbers = computed(() => {
  // Slot mode: the reference still derives the gutter from the raw `code` prop.
  const source = slots.default ? props.code : displayedCode.value
  const lineCount = source.split('\n').length
  const numbers: string[] = []
  for (let i = 1; i <= lineCount; i += 1) numbers.push(String(i))
  return numbers.join('\n')
})

function isDigit(char: string): boolean {
  return char >= '0' && char <= '9'
}

/**
 * Minimal deterministic JSON tokenizer (no dependency, no innerHTML).
 * Mirrors the reference contract at the visual level only: keys, strings,
 * numbers, keywords and punctuation get their own token class.
 */
function tokenizeJson(source: string): SnCodeSegment[] {
  const segments: SnCodeSegment[] = []
  let plain = ''
  let i = 0

  const flushPlain = (): void => {
    if (plain !== '') {
      segments.push({ text: plain, type: null })
      plain = ''
    }
  }

  while (i < source.length) {
    // charAt keeps the element type `string` under noUncheckedIndexedAccess.
    const char = source.charAt(i)

    if (char === '"') {
      let end = i + 1
      while (end < source.length) {
        if (source.charAt(end) === '\\') {
          end += 2
          continue
        }
        if (source.charAt(end) === '"') {
          end += 1
          break
        }
        end += 1
      }
      const literal = source.slice(i, end)
      let look = end
      while (look < source.length && /\s/.test(source.charAt(look))) look += 1
      flushPlain()
      segments.push({ text: literal, type: source.charAt(look) === ':' ? 'key' : 'string' })
      i = end
      continue
    }

    if (isDigit(char) || (char === '-' && isDigit(source.charAt(i + 1)))) {
      let end = i + 1
      while (end < source.length && /[0-9+.\-eE]/.test(source.charAt(end))) end += 1
      flushPlain()
      segments.push({ text: source.slice(i, end), type: 'number' })
      i = end
      continue
    }

    if (/[A-Za-z]/.test(char)) {
      let end = i + 1
      while (end < source.length && /[A-Za-z0-9_$]/.test(source.charAt(end))) end += 1
      const word = source.slice(i, end)
      flushPlain()
      segments.push({
        text: word,
        type: word === 'true' || word === 'false' || word === 'null' ? 'keyword' : null,
      })
      i = end
      continue
    }

    if ('{}[],:'.includes(char)) {
      flushPlain()
      segments.push({ text: char, type: 'punct' })
      i += 1
      continue
    }

    plain += char
    i += 1
  }

  flushPlain()
  return segments
}
</script>

<template>
  <code
    data-snui-component="code"
    class="sn-code"
    :class="[
      inline ? 'sn-code--inline' : '',
      wordWrap ? 'sn-code--word-wrap' : '',
      mergedShowLineNumbers ? 'sn-code--show-line-numbers' : '',
    ]"
  >
    <pre v-if="mergedShowLineNumbers" class="sn-code__line-numbers" aria-hidden="true">{{ lineNumbers }}</pre>
    <slot>
      <pre v-if="!inline" class="sn-code__code"><template v-for="(segment, index) in segments" :key="index"><span v-if="segment.type" :class="`sn-code__tok sn-code__tok--${segment.type}`">{{ segment.text }}</span><template v-else>{{ segment.text }}</template></template></pre>
      <template v-else><template v-for="(segment, index) in segments" :key="index"><span v-if="segment.type" :class="`sn-code__tok sn-code__tok--${segment.type}`">{{ segment.text }}</span><template v-else>{{ segment.text }}</template></template></template>
    </slot>
  </code>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 14px;
  color: var(--sn-web-color-text-primary);
}

/* Block surface: light neutral plate (4.5% ink) with a 1px emphasized border
 * (12% ink) and 3px radius. Inline mode stays a bare fragment. */
.sn-code:not(.sn-code--inline) {
  display: block;
  box-sizing: border-box;
  padding: 12px 16px;
  line-height: 1.7;
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 4.5%, var(--sn-web-color-background-surface));
  border: 1px solid color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface));
  border-radius: 3px;
}

/* The gutter and the code block share the same inherited line-height so the
 * rows line up exactly (reference cssr: display:flex on the show-line-numbers
 * modifier, padding-right: 12px on the gutter). */
.sn-code:not(.sn-code--inline).sn-code--show-line-numbers {
  display: flex;
}

.sn-code pre {
  margin: 0;
  line-height: inherit;
  font-size: inherit;
  font-family: inherit;
}

.sn-code__line-numbers {
  user-select: none;
  white-space: pre;
  padding-right: 12px;
  text-align: right;
  color: var(--sn-web-color-text-tertiary);
}

.sn-code__code {
  white-space: pre;
  /* Scroll long lines inside the block (gutter stays put in flex mode). */
  overflow-x: auto;
  min-width: 0;
}

.sn-code--word-wrap .sn-code__code {
  white-space: pre-wrap;
  word-break: break-all;
}

/* ---------- Built-in JSON token palette (semantic colors) ---------- */

.sn-code__tok--key {
  color: var(--sn-web-color-action-primary);
}

.sn-code__tok--string {
  color: var(--sn-web-color-feedback-success);
}

.sn-code__tok--number {
  color: var(--sn-web-color-feedback-warning);
}

.sn-code__tok--keyword {
  color: var(--sn-web-color-feedback-info);
}

.sn-code__tok--punct {
  color: color-mix(in srgb, var(--sn-web-color-text-secondary) 80%, transparent);
}
</style>
