<script setup lang="ts">
/**
 * SnDrawerContent — header / body / footer scaffold for a drawer
 * (AUI-WEB-FB-003, child of SnDrawer).
 *
 * Reference library: naive-ui `n-drawer-content`
 *   (https://www.naiveui.com/zh-CN/light/components/drawer)
 * Per AGENTS.md §112, props + slot shape mirror n-drawer-content 1:1.
 *
 * Must be placed inside a `<SnDrawer>`: the close button asks the parent
 * drawer to hide through `provide`/`inject` (upstream's `drawerInjectionKey`).
 *
 * Behaviour mirrors n-drawer-content:
 *   - The header row renders when a `header` slot, a `title`, or `closable`
 *     is present — a bare `closable` drawer still shows its header so the
 *     close button has a home.
 *   - The header title is exposed to assistive tech as `role="heading"`
 *     `aria-level="1"`.
 *   - The footer only renders when the `footer` slot is filled.
 *   - The body always renders; its scroll container is the drawer's
 *     content wrapper.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnDrawer v-model:show="open">
 *     <SnDrawerContent title="设置" closable>
 *       <template #footer>…</template>
 *     </SnDrawerContent>
 *   </SnDrawer>
 */

import { computed, inject, type CSSProperties } from 'vue'
import { useLocale } from '../locales/use-locale'
import { X } from 'lucide-vue-next'
import SnIcon from '../icon/SnIcon.vue'
import { SN_DRAWER_INJECTION_KEY, type SnDrawerApi } from './drawer-context'

defineOptions({ name: 'SnDrawerContent' })

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale()

const props = withDefaults(
  defineProps<{
    /** Header title. Mirrors n-drawer-content `title`. */
    title?: string
    /** Extra class on the header row. */
    headerClass?: string
    /** Extra style on the header row. */
    headerStyle?: string | CSSProperties
    /** Extra class on the footer row. */
    footerClass?: string
    /** Extra style on the footer row. */
    footerStyle?: string | CSSProperties
    /** Extra class on the body. */
    bodyClass?: string
    /** Extra style on the body. */
    bodyStyle?: string | CSSProperties
    /** Extra class on the body's inner wrapper. */
    bodyContentClass?: string
    /** Extra style on the body's inner wrapper. */
    bodyContentStyle?: string | CSSProperties
    /** Accepted for API parity. See SnDrawer's `nativeScrollbar` note. */
    nativeScrollbar?: boolean
    /** Render the header close button. Mirrors n-drawer-content `closable`. */
    closable?: boolean
  }>(),
  {
    title: undefined as any,
    headerClass: undefined as any,
    headerStyle: undefined as any,
    footerClass: undefined as any,
    footerStyle: undefined as any,
    bodyClass: undefined as any,
    bodyStyle: undefined as any,
    bodyContentClass: undefined as any,
    bodyContentStyle: undefined as any,
    nativeScrollbar: true,
    closable: false,
  },
)

const emit = defineEmits<{
  /** Close button clicked. Mirrors n-drawer-content's implicit close. */
  (e: 'close'): void
}>()

const slots = defineSlots<{
  /** Drawer body. */
  default?(): unknown
  /** Header row — replaces `title`. */
  header?(): unknown
  /** Footer row. Rendered only when filled. */
  footer?(): unknown
}>()

const drawer = inject<SnDrawerApi | undefined>(SN_DRAWER_INJECTION_KEY, undefined)

/** The header row needs a home for the close button even without a title. */
const hasHeader = computed<boolean>(
  () => slots.header !== undefined || Boolean(props.title) || props.closable === true,
)

const hasFooter = computed(() => slots.footer !== undefined)

function handleCloseClick(): void {
  emit('close')
  drawer?.doUpdateShow(false)
}
</script>

<template>
  <div
    data-snui-component="SnDrawerContent"
    class="sn-drawer-content"
    :class="nativeScrollbar === false && 'sn-drawer-content--native-scrollbar'"
    role="none"
  >
    <div
      v-if="hasHeader"
      class="sn-drawer-header"
      :class="headerClass"
      :style="headerStyle"
      role="none"
    >
      <div class="sn-drawer-header__main" role="heading" aria-level="1">
        <slot name="header">{{ title }}</slot>
      </div>
      <button
        v-if="closable"
        type="button"
        class="sn-drawer-header__close"
        :aria-label="locale.Common.close"
        data-snui-component="SnDrawerClose"
        @click="handleCloseClick"
      >
        <SnIcon :icon="X" />
      </button>
    </div>

    <div
      class="sn-drawer-body"
      :class="bodyClass"
      :style="bodyStyle"
      role="none"
    >
      <div
        class="sn-drawer-body-content-wrapper"
        :class="bodyContentClass"
        :style="bodyContentStyle"
        role="none"
      >
        <slot />
      </div>
    </div>

    <div
      v-if="hasFooter"
      class="sn-drawer-footer"
      :class="footerClass"
      :style="footerStyle"
      role="none"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-drawer-content {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sn-drawer-body {
  flex: 1 0 0;
  overflow: hidden;
}

.sn-drawer-body-content-wrapper {
  box-sizing: border-box;
  padding: var(--sn-web-drawer-body-padding);
}

.sn-drawer-content--native-scrollbar .sn-drawer-body-content-wrapper {
  height: 100%;
  overflow: auto;
}

.sn-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sn-web-drawer-header-padding);
  font-size: var(--sn-web-drawer-title-font-size);
  font-weight: var(--sn-web-drawer-title-font-weight);
  line-height: 1;
  color: var(--sn-web-drawer-title-text-color);
  border-bottom: var(--sn-web-drawer-header-border-bottom);
  transition: border 0.3s ease;
}

.sn-drawer-header__main {
  flex: 1;
}

.sn-drawer-header__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: var(--sn-web-drawer-close-size);
  height: var(--sn-web-drawer-close-size);
  margin-left: 6px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-drawer-close-size);
  font-size: var(--sn-web-drawer-close-icon-size);
  background: var(--sn-web-drawer-close-color);
  color: var(--sn-web-drawer-close-icon-color);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.sn-drawer-header__close:hover {
  background: var(--sn-web-drawer-close-color-hover);
  color: var(--sn-web-drawer-close-icon-color-hover);
}

.sn-drawer-header__close:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 2px;
}

.sn-drawer-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--sn-web-drawer-footer-padding);
  border-top: var(--sn-web-drawer-footer-border-top);
  transition: border 0.3s ease;
}
</style>
