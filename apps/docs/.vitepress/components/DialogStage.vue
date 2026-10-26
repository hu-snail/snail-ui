<script setup lang="ts">
/**
 * DialogStage — the docs-site demo shell that gives `SnDialog` the modal
 * chrome it deliberately does not own.
 *
 * Per SnDialog.vue's scope note: the component is the *card*, not the overlay.
 * Upstream parity for the overlay is `useDialog()` / `DialogProvider`, which is
 * a separate WBS item. Until that provider lands, the docs demos still need to
 * look like a real modal, so this stage reproduces the overlay shape here —
 * in the docs app only, with no change to the public surface of the library.
 *
 * What it adds on top of the card:
 *   - Teleport to `<body>` so the panel escapes any ancestor with `overflow`
 *     or a stacking context (the reason a demo card used to clip the dialog).
 *   - A full-viewport mask painted with the same token chain the drawer uses
 *     (`--sn-web-color-background-overlay`, 45% black).
 *   - Centred panel, `Esc` + mask-click to close, `<html>` scroll lock.
 *   - `z-index` above the VitePress nav (VitePress uses ≤ 100 locally).
 *
 * Not modelled (matches the library's current gap, same as SnDrawer):
 * focus trapping. It is called out in the component docs, not faked here.
 *
 * Usage — wrap the `<SnDialog>`, drive `show`:
 *   <DialogStage v-model:show="open">
 *     <SnDialog title="…" @positive-click="…" />
 *   </DialogStage>
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  /** Visibility. Use with `v-model:show`. */
  show?: boolean
  /** Close on `Esc`. */
  closeOnEsc?: boolean
  /** Close on mask click. */
  maskClosable?: boolean
  /** Teleport target. Defaults to `body`. */
  to?: string
  /** Stacking order. Sits above the VitePress nav by default. */
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  closeOnEsc: true,
  maskClosable: true,
  to: 'body',
  zIndex: 2000,
})

const emit = defineEmits<{
  'update:show': [value: boolean]
  /** Fired after the mask or `Esc` closed the dialog. */
  close: []
}>()

const containerStyle = computed(() => ({ zIndex: String(props.zIndex) }))

/**
 * Same scroll-lock contract as SnDrawer: remember whatever `<html>` had, put
 * it back on close *and* on unmount so a hot-reload cannot strand the page.
 */
const isLocked = ref(false)
let memoizedOverflow: string | null = null

function lockScroll(): void {
  if (typeof document === 'undefined' || isLocked.value) return
  memoizedOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  isLocked.value = true
}

function unlockScroll(): void {
  if (typeof document === 'undefined' || !isLocked.value) return
  document.documentElement.style.overflow = memoizedOverflow ?? ''
  memoizedOverflow = null
  isLocked.value = false
}

watch(
  () => props.show,
  (value) => {
    if (value) lockScroll()
    else unlockScroll()
  },
  { immediate: true },
)

onBeforeUnmount(unlockScroll)

function requestClose(): void {
  emit('update:show', false)
  emit('close')
}

function handleMaskClick(): void {
  if (props.maskClosable) requestClose()
}

function handleKeydown(event: KeyboardEvent): void {
  if (!props.closeOnEsc) return
  // Mirrors the drawer: a keydown that belongs to an IME composition is not a
  // dismissal gesture.
  if (event.key !== 'Escape' || event.isComposing) return
  event.stopPropagation()
  requestClose()
}
</script>

<template>
  <Teleport :to="to">
    <div
      v-show="show"
      class="dlg-stage"
      :style="containerStyle"
      role="none"
      @keydown="handleKeydown"
    >
      <Transition name="dlg-stage-fade">
        <div
          v-if="show"
          aria-hidden="true"
          class="dlg-stage__mask"
          @click="handleMaskClick"
        />
      </Transition>

      <Transition name="dlg-stage-pop">
        <div
          v-if="show"
          class="dlg-stage__panel"
          role="none"
        >
          <slot />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.dlg-stage {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.dlg-stage__mask {
  position: absolute;
  inset: 0;
  /* The library token is 80% black — heavier than the reference dialog mask,
   * and with the old demo defaults (three dialogs auto-opened on load) the
   * masks stacked into near-opaque black. Derive ~44% from the same token. */
  background: color-mix(in srgb, var(--sn-web-color-background-overlay) 55%, transparent);
}

.dlg-stage__panel {
  position: relative;
  /* The dialog owns its own 446px width + border; the stage only places it. */
  display: flex;
  justify-content: center;
  max-width: 100%;
}

.dlg-stage-fade-enter-active,
.dlg-stage-fade-leave-active {
  transition: opacity 0.24s ease;
}
.dlg-stage-fade-enter-from,
.dlg-stage-fade-leave-to {
  opacity: 0;
}

.dlg-stage-pop-enter-active,
.dlg-stage-pop-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}
.dlg-stage-pop-enter-from,
.dlg-stage-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-8px);
}
</style>
