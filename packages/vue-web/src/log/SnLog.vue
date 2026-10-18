<script setup lang="ts">
/**
 * SnLog — web-end scrolling log viewer (AUI-WEB-DD-013).
 *
 * Reference library: naive-ui `n-log`
 *   (https://www.naiveui.com/zh-CN/light/components/log)
 * Per AGENTS.md §112, props + semantics mirror n-log 1:1:
 *   log / lines / trim / loading / font-size / line-height / rows /
 *   offset-top / offset-bottom / on-reach-top / on-reach-bottom /
 *   on-require-more / scrollTo method.
 *
 * Documented divergences (not §112 violations):
 *   - `language` / `hljs` highlighting is NOT implemented (no new dependency
 *     allowed per task spec) — future marker.
 *   - `spin-props` is NOT implemented; the loading indicator is an internal
 *     inline-SVG spinner — future marker.
 *   - Scrolling uses a native overflow container instead of the reference
 *     custom scrollbar, so the scroll geometry (offsetTop / offsetBottom /
 *     reach events / scrollTo) behaves identically but the scrollbar is the
 *     browser default.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnLog :log="text" />
 *   <SnLog :log="text" :rows="8" trim loading />
 *   <SnLog ref="log" :log="text" @require-more="loadMore" />
 */

import { computed, nextTick, ref } from 'vue'

defineOptions({ name: 'SnLog' })

/** Options for the exposed `scrollTo` method (mirrors the reference LogInst). */
export interface SnLogScrollToOptions {
  /** Absolute scroll offset in px. */
  top?: number
  /** Named scroll position. */
  position?: 'top' | 'bottom'
  /** Suppress reach / require-more events for the triggered scroll. */
  silent?: boolean
}

const props = withDefaults(
  defineProps<{
    /** Log content; split into lines on `\n`. Takes precedence over `lines`. Mirrors n-log `log`. */
    log?: string | undefined
    /** Log lines; ignored when `log` is a non-empty string. Mirrors n-log `lines`. */
    lines?: string[]
    /** Trim each displayed line. Mirrors n-log `trim`. */
    trim?: boolean
    /** Show the loading indicator. Mirrors n-log `loading`. */
    loading?: boolean
    /** Text size in px. Mirrors n-log `font-size`. */
    fontSize?: number
    /** Unitless line-height; rows stay aligned with the fixed height. Mirrors n-log `line-height`. */
    lineHeight?: number
    /** Visible row count; the container height is rows × line-height × font-size. Mirrors n-log `rows`. */
    rows?: number
    /** Top reach tolerance in px. Mirrors n-log `offset-top`. */
    offsetTop?: number
    /** Bottom reach tolerance in px. Mirrors n-log `offset-bottom`. */
    offsetBottom?: number
  }>(),
  {
    log: undefined,
    lines: () => [],
    trim: false,
    loading: false,
    fontSize: 14,
    lineHeight: 1.25,
    rows: 15,
    offsetTop: 0,
    offsetBottom: 0,
  },
)

const emit = defineEmits<{
  /** Scrolled to the top (within `offset-top`). Mirrors n-log `on-reach-top`. */
  (e: 'reach-top'): void
  /** Scrolled to the bottom (within `offset-bottom`). Mirrors n-log `on-reach-bottom`. */
  (e: 'reach-bottom'): void
  /** Scrolled past the top/bottom tolerance; payloads `top` / `bottom`. Mirrors n-log `on-require-more`. */
  (e: 'require-more', from: 'top' | 'bottom'): void
}>()

const scrollRef = ref<HTMLDivElement | null>(null)
const silentRef = ref(false)

/** `Math.round(rows * lineHeight * fontSize)px`, mirroring the reference. */
const containerHeight = computed(
  () => `${Math.round(props.rows * props.lineHeight * props.fontSize)}px`,
)

const contentFontSize = computed(() => `${props.fontSize}px`)

const logLineHeight = computed(() => String(props.lineHeight))

const mergedLines = computed<string[]>(() => {
  // Reference: an empty `log` string falls through to `lines`.
  if (props.log) return props.log.split('\n')
  return props.lines
})

function consumeSilent(): void {
  void nextTick(() => {
    silentRef.value = false
  })
}

function handleScroll(event: Event): void {
  if (silentRef.value) {
    consumeSilent()
    return
  }
  const container = event.target as HTMLElement
  const content = container.firstElementChild as HTMLElement | null
  const containerHeightPx = container.offsetHeight
  const scrollTop = container.scrollTop
  const contentHeight = content ? content.offsetHeight : containerHeightPx
  const scrollBottom = contentHeight - scrollTop - containerHeightPx
  if (scrollTop <= props.offsetTop) {
    emit('require-more', 'top')
    emit('reach-top')
  }
  if (scrollBottom <= props.offsetBottom) {
    emit('require-more', 'bottom')
    emit('reach-bottom')
  }
}

/* The reference throttles wheel-driven require-more to 300ms (lodash). */
const WHEEL_THROTTLE_MS = 300
let lastWheelAt = 0

function handleWheel(event: WheelEvent): void {
  const now = Date.now()
  if (now - lastWheelAt < WHEEL_THROTTLE_MS) return
  lastWheelAt = now

  if (silentRef.value) {
    consumeSilent()
    return
  }
  const container = scrollRef.value
  if (!container) return
  const content = container.firstElementChild as HTMLElement | null
  const contentHeight = content ? content.offsetHeight : 0
  const scrollBottom = contentHeight - container.scrollTop - container.offsetHeight
  if (container.scrollTop === 0 && event.deltaY < 0) {
    emit('require-more', 'top')
  }
  if (scrollBottom <= 0 && event.deltaY > 0) {
    emit('require-more', 'bottom')
  }
}

function scrollTo(options: SnLogScrollToOptions): void {
  const container = scrollRef.value
  if (!container) return
  if (options.silent) silentRef.value = true
  if (options.top !== undefined) {
    container.scrollTop = options.top
    return
  }
  if (options.position === 'bottom') {
    container.scrollTop = container.scrollHeight
  } else if (options.position === 'top') {
    container.scrollTop = 0
  }
}

defineExpose({ scrollTo })
</script>

<template>
  <div
    data-snui-component="log"
    class="sn-log"
    :style="{ lineHeight: logLineHeight, height: containerHeight }"
    @wheel.passive="handleWheel"
  >
    <div ref="scrollRef" class="sn-log__scroll" @scroll="handleScroll">
      <div class="sn-log__content" :style="{ fontSize: contentFontSize }">
        <pre v-for="(line, index) in mergedLines" :key="index" class="sn-log__line">{{ trim ? line.trim() : line }}</pre>
      </div>
    </div>
    <Transition name="sn-log-fade">
      <div v-if="loading" class="sn-log__loader" role="status">
        <svg class="sn-log__loader-spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="42 14" />
        </svg>
        <span class="sn-log__loader-text">加载中</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-log {
  position: relative;
  box-sizing: border-box;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  color: var(--sn-web-color-text-primary);
}

.sn-log__scroll {
  height: 100%;
  overflow: auto;
}

.sn-log__line {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ---------- Loader pill (reference cssr: 34px pill, right 16px top 8px,
 * 1px borderColor border, modalColor surface, textColor2 label) ---------- */

.sn-log__loader {
  position: absolute;
  right: 16px;
  top: 8px;
  box-sizing: border-box;
  height: 34px;
  border-radius: 17px;
  border: 1px solid color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface));
  background: var(--sn-web-color-background-elevated);
  color: var(--sn-web-color-text-secondary);
  font-size: 14px;
  line-height: 34px;
  white-space: nowrap;
  overflow: hidden;
}

.sn-log__loader-text {
  display: inline-block;
  vertical-align: bottom;
  line-height: 34px;
  padding-left: 40px;
  padding-right: 20px;
  white-space: nowrap;
}

.sn-log__loader-spinner {
  position: absolute;
  left: 12px;
  top: calc(50% - 10px);
  width: 20px;
  height: 20px;
  color: var(--sn-web-color-action-primary);
  animation: sn-log-spin 1s linear infinite;
}

@keyframes sn-log-spin {
  to {
    transform: rotate(360deg);
  }
}

.sn-log-fade-enter-active,
.sn-log-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.sn-log-fade-enter-from,
.sn-log-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
