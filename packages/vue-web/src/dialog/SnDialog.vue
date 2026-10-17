<script setup lang="ts">
/**
 * SnDialog — the dialog *panel*: a titled card with an optional type icon,
 * body content and an action row of buttons (AUI-WEB-FB-001).
 *
 * Reference library: naive-ui `n-dialog`
 *   (https://www.naiveui.com/zh-CN/light/components/dialog)
 * Per AGENTS.md §112, props + semantics mirror n-dialog 1:1.
 *
 * 1:1 parity (this version): icon / type / title / closable / negativeText /
 *   positiveText / positiveButtonProps / negativeButtonProps / content /
 *   action / showIcon / loading / bordered / iconPlacement / titleClass /
 *   titleStyle / contentClass / contentStyle / actionClass / actionStyle /
 *   onPositiveClick / onNegativeClick / onClose / closeFocusable / slots
 *   default / header / icon / action / close.
 *
 * Scope note — this is the *card*, not the overlay:
 *   Upstream's `useDialog()` mounts a `DialogProvider` that wraps this card in
 *   a modal mask + `VLazyTeleport`. That provider is a separate WBS item
 *   (FB-002-ish); here SnDialog is the presentational panel only. It is
 *   designed to be dropped inside a `SnModal`/provider as-is.
 *
 * Behaviour mirrors n-dialog:
 *   - `type` drives the default icon and the icon colour ('default' maps to
 *     'info' for the icon, exactly like upstream's `createKey('iconColor',
 *     type)` + `iconRenderMap`).
 *   - `iconPlacement` defaults to 'left'; 'top' centres the icon above the
 *     title and switches the icon/close margins to their `*IconTop` variant.
 *   - The action row only renders when there is something to put in it:
 *     an `action` slot, an `action` callback, or positive/negative text.
 *   - The positive button's `type` follows the dialog `type`, falling back to
 *     'primary' for 'default'. Only the positive button shows `loading`.
 *   - `content--last` drops the bottom margin when the action row is absent.
 *
 *   - The panel pops on mount: the card is wrapped in
 *     `<Transition name="sn-dialog-pop" appear>` (opacity + scale, 220ms in /
 *     180ms out), so a caller's plain `v-if="show"` animates like the
 *     upstream provider-mounted dialog instead of snapping in. Vue plays the
 *     leave transition when the component unmounts (the hooks live on the
 *     panel element, which `remove()` consults).
 *
 * Divergence from n-dialog (documented):
 *   - Upstream reads ~25 `--n-*` vars from a JS theme object. This library
 *     reads the `--sn-web-dialog-*` token block in CSS instead, so no inline
 *     style is needed at all — which also means the dialog is themeable by
 *     overriding tokens rather than props. The panel shadow
 *     (`--sn-web-dialog-box-shadow`) carries the upstream dialog value.
 *   - Icons use lucide (`Info` / `CircleCheck` / `TriangleAlert` / `CircleX`
 *     / `X`) via SnIcon, matching this library's icon strategy rather than
 *     upstream's bespoke SVG icon set.
 *   - Upstream's `rtl` handling and the `iconPlacement` config-provider
 *     fallback are not modelled (SnConfigProvider does not cover Dialog yet).
 *   - `width: 446px` lives on the provider/overlay upstream, not on the card.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnDialog title="确认删除" positive-text="删除" negative-text="取消" />
 *   <SnDialog type="warning" title="警告" content="..." />
 *   <SnDialog icon-placement="top" title="成功" type="success" />
 */

import { computed } from 'vue'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-vue-next'
import SnButton from '../button/SnButton.vue'
import SnIcon from '../icon/SnIcon.vue'
import type { IconComponent } from '../icon/sn-icon-registry'

defineOptions({ name: 'SnDialog' })

/** `n-dialog` iconPlacement values. */
export type SnDialogIconPlacement = 'left' | 'top'

/** `n-dialog` type values. */
export type SnDialogType = 'info' | 'success' | 'warning' | 'error' | 'default'

type IconPlacement = SnDialogIconPlacement
type DialogType = SnDialogType

/**
 * Upstream `iconRenderMap`. 'default' shares the 'info' glyph — this is the
 * same table upstream indexes by `type`.
 */
const ICON_BY_TYPE: Record<DialogType, IconComponent> = {
  default: Info as IconComponent,
  info: Info as IconComponent,
  success: CircleCheck as IconComponent,
  warning: TriangleAlert as IconComponent,
  error: CircleX as IconComponent,
}

/**
 * Upstream resolves the icon colour with `createKey('iconColor', type)`, so
 * 'default' falls through to the base `iconColor`. We reproduce that by
 * mapping the type to the token suffix ('' for the base colour).
 */
const ICON_COLOR_SUFFIX_BY_TYPE: Record<DialogType, string> = {
  default: '',
  info: '-info',
  success: '-success',
  warning: '-warning',
  error: '-error',
}

const props = withDefaults(
  defineProps<{
    /** Custom icon component, replacing the per-`type` default. */
    icon?: IconComponent
    /** Semantic type — drives the default icon + its colour. */
    type?: DialogType
    /** Panel title. Mirrors n-dialog `title`. */
    title?: string
    /** Show the close button. Mirrors n-dialog `closable`. */
    closable?: boolean
    /** Cancel button label. Omit to hide the button. */
    negativeText?: string
    /** Confirm button label. Omit to hide the button. */
    positiveText?: string
    /** Extra props forwarded to the confirm button. */
    positiveButtonProps?: Record<string, unknown>
    /** Extra props forwarded to the cancel button. */
    negativeButtonProps?: Record<string, unknown>
    /** Body text. Mirrors n-dialog `content`. */
    content?: string
    /** Whether to render the type icon. Mirrors n-dialog `showIcon`. */
    showIcon?: boolean
    /** Confirm button enters its loading state. Mirrors n-dialog `loading`. */
    loading?: boolean
    /** Draw a border around the panel. Mirrors n-dialog `bordered`. */
    bordered?: boolean
    /** Icon above the title ('top') or inline before it ('left'). */
    iconPlacement?: IconPlacement
    /** Extra class on the title row. */
    titleClass?: string | Array<string | undefined>
    /** Extra style on the title row. */
    titleStyle?: string | Record<string, string | number>
    /** Extra class on the body. */
    contentClass?: string | Array<string | undefined>
    /** Extra style on the body. */
    contentStyle?: string | Record<string, string | number>
    /** Extra class on the action row. */
    actionClass?: string | Array<string | undefined>
    /** Extra style on the action row. */
    actionStyle?: string | Record<string, string | number>
    /** Make the close button keyboard-focusable. */
    closeFocusable?: boolean
  }>(),
  {
    icon: undefined as any,
    type: 'default',
    title: undefined as any,
    closable: true,
    negativeText: undefined as any,
    positiveText: undefined as any,
    positiveButtonProps: undefined as any,
    negativeButtonProps: undefined as any,
    content: undefined as any,
    showIcon: true,
    loading: false,
    bordered: false,
    iconPlacement: undefined as any,
    titleClass: undefined as any,
    titleStyle: undefined as any,
    contentClass: undefined as any,
    contentStyle: undefined as any,
    actionClass: undefined as any,
    actionStyle: undefined as any,
    closeFocusable: false,
  },
)

const emit = defineEmits<{
  /** Confirm button clicked. Mirrors n-dialog `onPositiveClick`. */
  (e: 'positive-click', event: MouseEvent): void
  /** Cancel button clicked. Mirrors n-dialog `onNegativeClick`. */
  (e: 'negative-click', event: MouseEvent): void
  /** Close button clicked. Mirrors n-dialog `onClose`. */
  (e: 'close'): void
}>()

const slots = defineSlots<{
  /** Dialog body — replaces `content`. */
  default?(): unknown
  /** Title row — replaces `title`. */
  header?(): unknown
  /** Type icon — replaces the built-in per-type glyph. */
  icon?(): unknown
  /** Action row — replaces the built-in buttons entirely. */
  action?(): unknown
  /** Close button — replaces the built-in close glyph. */
  close?(): unknown
}>()

const mergedIconPlacement = computed<IconPlacement>(() => props.iconPlacement ?? 'left')

const mergedIcon = computed<IconComponent>(
  () => props.icon ?? ICON_BY_TYPE[props.type],
)

/** Token suffix for the icon colour; '' means the base `icon-color` token. */
const iconColorVar = computed(
  () => `var(--sn-web-dialog-icon-color${ICON_COLOR_SUFFIX_BY_TYPE[props.type]})`,
)

/**
 * Resolved flags for the confirm button. `loading` is optional in the props
 * type (TS2379 under `exactOptionalPropertyTypes`), so it is narrowed to a
 * definite boolean before being handed to SnButton.
 */
const isLoading = computed(() => props.loading === true)

/** Positive button inherits the dialog type, mirroring upstream's fallback. */
const positiveButtonType = computed(() =>
  props.type === 'default' ? 'primary' : props.type,
)

/**
 * The action row is skipped entirely when there is nothing to render —
 * upstream checks the slot, then `action`, then the two text props.
 */
const hasActionRow = computed(
  () =>
    slots.action !== undefined ||
    Boolean(props.positiveText) ||
    Boolean(props.negativeText),
)

const isTopIcon = computed(() => mergedIconPlacement.value === 'top')

/**
 * Upstream builds `const icon = showIcon ? <NBaseIcon>…</NBaseIcon> : null`
 * and then uses that same `icon` node in whichever placement applies. So the
 * `showIcon` gate is the only thing that decides whether an icon renders —
 * including a user-supplied `#icon` slot.
 */
const hasIcon = computed(() => props.showIcon)

/** The close button only exists when `closable` and the slot is unused. */
const showBuiltinClose = computed(() => props.closable && slots.close === undefined)
</script>

<template>
  <Transition name="sn-dialog-pop" appear>
    <div
      data-snui-component="SnDialog"
      class="sn-dialog"
      :class="[
        closable && 'sn-dialog--closable',
        `sn-dialog--icon-${mergedIconPlacement}`,
        bordered && 'sn-dialog--bordered',
      ]"
      role="dialog"
      :aria-modal="false"
    >
      <!-- Close button: user slot wins, otherwise the built-in glyph. -->
      <slot v-if="closable && slots.close" name="close" />
      <button
        v-else-if="showBuiltinClose"
        type="button"
        class="sn-dialog__close"
        aria-label="关闭"
        :tabindex="closeFocusable ? 0 : -1"
        data-snui-component="SnDialogClose"
        @click="emit('close')"
      >
        <SnIcon :icon="X" />
      </button>

      <!-- 'top' placement hoists the icon into its own centred row. -->
      <div v-if="hasIcon && isTopIcon" class="sn-dialog__icon-container">
        <span class="sn-dialog__icon" :style="{ color: iconColorVar }">
          <slot name="icon">
            <SnIcon :icon="mergedIcon" />
          </slot>
        </span>
      </div>

      <div class="sn-dialog__title" :class="titleClass" :style="titleStyle">
        <span v-if="hasIcon && !isTopIcon" class="sn-dialog__icon" :style="{ color: iconColorVar }">
          <slot name="icon">
            <SnIcon :icon="mergedIcon" />
          </slot>
        </span>
        <slot name="header">{{ title }}</slot>
      </div>

      <div
        class="sn-dialog__content"
        :class="[!hasActionRow && 'sn-dialog__content--last', contentClass]"
        :style="contentStyle"
      >
        <slot>{{ content }}</slot>
      </div>

      <div
        v-if="hasActionRow"
        class="sn-dialog__action"
        :class="actionClass"
        :style="actionStyle"
      >
        <slot name="action">
          <SnButton
            v-if="negativeText"
            v-bind="negativeButtonProps"
            ghost
            size="small"
            @click="emit('negative-click', $event)"
          >
            {{ negativeText }}
          </SnButton>
          <SnButton
            v-if="positiveText"
            v-bind="positiveButtonProps"
            :type="positiveButtonType"
            size="small"
            :loading="isLoading"
            :disabled="isLoading"
            @click="emit('positive-click', $event)"
          >
            {{ positiveText }}
          </SnButton>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-dialog {
  position: relative;
  box-sizing: border-box;
  margin: auto;
  padding: var(--sn-web-dialog-padding);
  background: var(--sn-web-dialog-color);
  color: var(--sn-web-dialog-text-color);
  border-radius: var(--sn-web-dialog-radius);
  /* Upstream n-dialog panel shadow (light, 3-layer). The value lives on the
   * token (`--aui-dialog-box-shadow`), not inline, per §34. */
  box-shadow: var(--sn-web-dialog-box-shadow);
  line-height: var(--sn-web-dialog-line-height);
  word-break: break-word;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}

.sn-dialog--bordered {
  border: var(--sn-web-dialog-border);
  /* Upstream's dialog border is nearly invisible next to its shadow — drop
   * the colour one step below the default border (same treatment as the
   * drawer header / footer rules). */
  border-color: var(--sn-web-color-border-subtle);
}

.sn-dialog__close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-dialog-close-size);
  height: var(--sn-web-dialog-close-size);
  margin: var(--sn-web-dialog-close-margin);
  padding: 0;
  border: none;
  border-radius: var(--sn-web-dialog-close-size);
  font-size: var(--sn-web-dialog-close-icon-size);
  background: var(--sn-web-dialog-close-color);
  color: var(--sn-web-dialog-close-icon-color);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.sn-dialog__close:hover {
  background: var(--sn-web-dialog-close-color-hover);
  color: var(--sn-web-dialog-close-icon-color-hover);
}

.sn-dialog__close:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 2px;
}

.sn-dialog__icon-container {
  display: flex;
  justify-content: center;
}

.sn-dialog__icon {
  font-size: var(--sn-web-dialog-icon-size);
  transition: color 0.3s ease;
}

.sn-dialog__title {
  display: flex;
  align-items: center;
  font-size: var(--sn-web-dialog-title-font-size);
  font-weight: var(--sn-web-dialog-title-font-weight);
  color: var(--sn-web-dialog-title-text-color);
  transition: color 0.3s ease;
}

.sn-dialog__content {
  position: relative;
  margin: var(--sn-web-dialog-content-margin);
  font-size: var(--sn-web-dialog-font-size);
  word-break: break-word;
}

.sn-dialog__content--last {
  margin-bottom: 0;
}

.sn-dialog__action {
  display: flex;
  justify-content: flex-end;
}

.sn-dialog__action > :not(:last-child) {
  margin-right: var(--sn-web-dialog-action-space);
}

/* ── icon-left: inline icon + room for the close button ─────────────── */

.sn-dialog--icon-left .sn-dialog__icon {
  margin: var(--sn-web-dialog-icon-margin);
}

.sn-dialog--icon-left.sn-dialog--closable .sn-dialog__title {
  padding-right: calc(var(--sn-web-dialog-close-size) + 6px);
}

/* ── icon-top: centred column layout ───────────────────────────────── */

.sn-dialog--icon-top .sn-dialog__close {
  margin: var(--sn-web-dialog-close-margin-icon-top);
}

.sn-dialog--icon-top .sn-dialog__icon {
  margin: var(--sn-web-dialog-icon-margin-icon-top);
}

.sn-dialog--icon-top .sn-dialog__title,
.sn-dialog--icon-top .sn-dialog__action {
  justify-content: center;
}

.sn-dialog--icon-top .sn-dialog__content {
  text-align: center;
}

/* ── mount / leave animation ──────────────────────────────────────────
 * The card scales up from 92% while fading in (220ms) and settles back to
 * 95% on the way out (180ms), both on the same decelerating bezier as the
 * drawer slide. `appear` on the template <Transition> is what makes a
 * caller's plain `v-if="show"` animate like the upstream provider-mounted
 * dialog. */

.sn-dialog-pop-enter-active {
  transition:
    opacity 0.22s cubic-bezier(0, 0, 0.2, 1),
    transform 0.22s cubic-bezier(0, 0, 0.2, 1);
}

.sn-dialog-pop-leave-active {
  transition:
    opacity 0.18s cubic-bezier(0, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0, 0, 0.2, 1);
}

.sn-dialog-pop-enter-from {
  opacity: 0;
  transform: scale(0.92);
}

.sn-dialog-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
