<script lang="ts">
/**
 * Group context shared with member `SnImage`s (mirrors the upstream
 * imageGroupInjectionKey contract: register preview urls + open at index).
 */
import type { InjectionKey } from 'vue'

export interface SnImageGroupContext {
  /** Register a member image's preview url; returns the unregister fn. */
  registerImage: (id: number, url: string) => () => void
  /** Open the shared preview at the member's position. */
  open: (id: number) => void
}

export const SN_IMAGE_GROUP_INJECTION_KEY: InjectionKey<SnImageGroupContext> =
  Symbol('sn-image-group')
</script>

<script setup lang="ts">
/**
 * SnImageGroup — web-end image group with a shared preview (AUI-WEB-DD-010).
 *
 * Reference library: naive-ui `n-image-group`
 *   (https://www.naiveui.com/zh-CN/light/components/image)
 * Per AGENTS.md §112, props + semantics mirror n-image-group 1:1:
 *   srcList / current (v-model:current) / defaultCurrent / show
 *   (v-model:show) / defaultShow / show-toolbar / show-toolbar-tooltip /
 *   keep-drag-offset / render-toolbar / preview-next / preview-prev.
 *
 * Member `SnImage`s register their preview url through provide/inject and
 * all of them share ONE preview overlay owned by the group — including
 * prev/next switching with wrap-around. When `srcList` is set, the group
 * renders the preview from the list alone (member images are ignored, like
 * upstream, which throws in that combination — this implementation just
 * ignores them; registered member ids win otherwise).
 *
 * Documented divergences (not §112 violations):
 *   - `show-toolbar-tooltip` renders native `title` attributes (see
 *     SnImagePreview).
 *   - Setting `srcList` while member images are present ignores the members
 *     instead of throwing (upstream `throwError`s on register).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnImageGroup>
 *     <SnImage src="…" /><SnImage src="…" />
 *   </SnImageGroup>
 *   <SnImageGroup :src-list="urls" v-model:show="open" />
 */

import { computed, provide, ref } from 'vue'
import SnImagePreview from './SnImagePreview.vue'
import type { SnImageToolbarNodes } from './SnImagePreview.vue'

defineOptions({ name: 'SnImageGroup' })

const props = withDefaults(
  defineProps<{
    /** Standalone image list — the preview browses these urls. Mirrors `src-list`. */
    srcList?: string[] | undefined
    /** Current previewed index (v-model:current). Mirrors `current`. */
    current?: number | undefined
    /** Initial index for uncontrolled usage. Mirrors `default-current`. */
    defaultCurrent?: number
    /** Controlled preview visibility (v-model:show). Mirrors `show`. */
    show?: boolean | undefined
    /** Initial visibility for uncontrolled usage. Mirrors `default-show`. */
    defaultShow?: boolean
    /** Toolbar visibility inside the shared preview. Mirrors `show-toolbar`. */
    showToolbar?: boolean | undefined
    /** Native title hints on toolbar buttons. Mirrors `show-toolbar-tooltip`. */
    showToolbarTooltip?: boolean | undefined
    /** Keep the dragged offset after release. Mirrors `keep-drag-offset`. */
    keepDragOffset?: boolean | undefined
    /** Custom toolbar renderer. Mirrors `render-toolbar`. */
    renderToolbar?: ((props: { nodes: SnImageToolbarNodes }) => unknown) | undefined
  }>(),
  {
    srcList: undefined,
    current: undefined,
    defaultCurrent: 0,
    show: undefined,
    defaultShow: false,
    showToolbar: true,
    showToolbarTooltip: false,
    keepDragOffset: false,
    renderToolbar: undefined,
  },
)

const emit = defineEmits<{
  /** Preview index change (v-model:current). Mirrors `on-update:current`. */
  (e: 'update:current', value: number): void
  /** Preview visibility change (v-model:show). Mirrors `on-update:show`. */
  (e: 'update:show', value: boolean): void
  /** Next button clicked. Mirrors `on-preview-next`. */
  (e: 'preview-next'): void
  /** Previous button clicked. Mirrors `on-preview-prev`. */
  (e: 'preview-prev'): void
}>()

defineSlots<{
  /** Image group content (member SnImages). */
  default?(): unknown
}>()

/* ── Member registry (unused when srcList is set) ───────────────────────── */

const registeredUrls = ref(new Map<number, string>())

function registerImage(id: number, url: string): () => void {
  if (props.srcList) return () => {} // member images are ignored, like upstream
  registeredUrls.value.set(id, url)
  return () => {
    registeredUrls.value.delete(id)
  }
}

/** Ordered preview urls: srcList, else members sorted by registration id. */
const mergedUrls = computed<string[]>(() => {
  if (props.srcList) return props.srcList
  const ids = Array.from(registeredUrls.value.keys()).sort((a, b) => a - b)
  return ids.map((id) => registeredUrls.value.get(id) ?? '')
})

function open(id: number): void {
  if (props.srcList) return
  const ids = Array.from(registeredUrls.value.keys()).sort((a, b) => a - b)
  const index = ids.indexOf(id)
  if (index >= 0) setCurrentIndex(index)
  doUpdateShow(true)
}

provide(SN_IMAGE_GROUP_INJECTION_KEY, { registerImage, open })

/* ── Current index (controlled / uncontrolled) ──────────────────────────── */

const uncontrolledCurrent = ref(props.defaultCurrent)
const mergedCurrent = computed(() =>
  props.current !== undefined ? props.current : uncontrolledCurrent.value,
)

function setCurrentIndex(index: number): void {
  if (index === mergedCurrent.value) return
  uncontrolledCurrent.value = index
  emit('update:current', index)
}

/* ── Show (controlled / uncontrolled) ───────────────────────────────────── */

const uncontrolledShow = ref(props.defaultShow)
const mergedShow = computed(() =>
  props.show !== undefined ? props.show : uncontrolledShow.value,
)

function doUpdateShow(value: boolean): void {
  uncontrolledShow.value = value
  emit('update:show', value)
}

/* ── prev / next with wrap-around ───────────────────────────────────────── */

const currentUrl = computed(() => mergedUrls.value[mergedCurrent.value] ?? '')

function go(step: 1 | -1): void {
  const count = mergedUrls.value.length
  if (count > 0) {
    const index = mergedCurrent.value
    for (let i = 1; i <= count; i++) {
      const candidate = (((index + step * i) % count) + count) % count
      if (mergedUrls.value[candidate]) {
        setCurrentIndex(candidate)
        break
      }
    }
  }
  if (step === 1) emit('preview-next')
  else emit('preview-prev')
}
</script>

<template>
  <div data-snui-component="image-group" class="sn-image-group">
    <slot />
    <SnImagePreview
      :src="currentUrl"
      :show="mergedShow"
      :show-toolbar="showToolbar"
      :show-toolbar-tooltip="showToolbarTooltip"
      :keep-drag-offset="keepDragOffset"
      :render-toolbar="renderToolbar"
      :prev="() => go(-1)"
      :next="() => go(1)"
      @update:show="doUpdateShow"
    />
  </div>
</template>

<style scoped>
/* Layout-transparent wrapper: the reference renders no host element, so the
 * group must not become a flex/grid item of its own. */
.sn-image-group {
  display: contents;
}
</style>
