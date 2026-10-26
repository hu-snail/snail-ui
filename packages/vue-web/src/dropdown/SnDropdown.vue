<template>
  <div
    ref="rootRef"
    :class="['sn-dropdown', { 'sn-dropdown--disabled': disabled }]"
    :data-snui-component="'dropdown'"
    :data-size="size"
    aria-haspopup="menu"
    :aria-expanded="isVisible ? 'true' : 'false'"
    :aria-controls="isVisible ? menuId : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="onTriggerClick"
    @keydown="onTriggerKeyDown"
    @mouseenter="onTriggerMouseEnter"
    @mouseleave="onTriggerMouseLeave"
  >
    <slot />

    <!-- Main menu panel -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="isVisible"
          :id="menuId"
          ref="menuRef"
          :class="[
            'sn-dropdown-menu',
            `sn-dropdown-menu--${resolvedPlacement}`,
            `sn-dropdown-menu--${size}`,
          ]"
          :style="menuStyle"
          role="menu"
          aria-orientation="vertical"
          :aria-activedescendant="activeDescendant ?? undefined"
          @mouseenter="onMenuMouseEnter"
          @mouseleave="onMenuMouseLeave"
        >
          <template v-for="node in normalizedNodes" :key="node.key">
            <div
              v-if="node.kind === 'divider'"
              class="sn-dropdown-menu__divider"
              role="separator"
            />
            <div
              v-else
              :id="optionId(node)"
              :class="['sn-dropdown-option', {
                'sn-dropdown-option--disabled': node.disabled,
                'sn-dropdown-option--pending': isPending(node),
                'sn-dropdown-option--parent': node.hasChildren,
              }]"
              role="menuitem"
              tabindex="-1"
              :aria-disabled="node.disabled ? 'true' : undefined"
              :aria-haspopup="node.hasChildren ? 'menu' : undefined"
              :aria-expanded="node.hasChildren ? (openSubmenuIndex === node.index ? 'true' : 'false') : undefined"
              :data-key="String(node.key)"
              @mouseenter="onOptionMouseEnter(node, $event)"
              @click="onOptionClick(node, $event)"
            >
              <span v-if="node.icon" class="sn-dropdown-option__icon">
                <component :is="node.icon" />
              </span>
              <span class="sn-dropdown-option__label">{{ node.label }}</span>
              <span v-if="node.hasChildren" class="sn-dropdown-option__arrow" aria-hidden="true">
                <SnIcon :icon="ChevronRightIcon" :size="13" />
              </span>
            </div>
          </template>
        </div>
      </Transition>
    </Teleport>

    <!-- Right-slide submenu panel (one nesting level) -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="isVisible && submenuParent !== null"
          ref="submenuRef"
          :class="[
            'sn-dropdown-menu',
            'sn-dropdown-submenu',
            `sn-dropdown-submenu--${submenuSide}`,
            `sn-dropdown-menu--${size}`,
          ]"
          :style="submenuStyle"
          role="menu"
          aria-orientation="vertical"
          :aria-label="submenuParent ? `${submenuParent.label} submenu` : undefined"
          :aria-activedescendant="submenuActiveDescendant ?? undefined"
          @mouseenter="onMenuMouseEnter"
          @mouseleave="onMenuMouseLeave"
        >
          <template v-for="child in submenuParent.children" :key="child.key">
            <div
              v-if="child.kind === 'divider'"
              class="sn-dropdown-menu__divider"
              role="separator"
            />
            <div
              v-else
              :id="subOptionId(child)"
              :class="['sn-dropdown-option', {
                'sn-dropdown-option--disabled': child.disabled,
                'sn-dropdown-option--pending': isSubPending(child),
              }]"
              role="menuitem"
              tabindex="-1"
              :aria-disabled="child.disabled ? 'true' : undefined"
              :data-key="String(child.key)"
              @mouseenter="onSubOptionEnter(child)"
              @click="onSubOptionClick(child)"
            >
              <span v-if="child.icon" class="sn-dropdown-option__icon">
                <component :is="child.icon" />
              </span>
              <span class="sn-dropdown-option__label">{{ child.label }}</span>
            </div>
          </template>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnDropdown — web-end dropdown action menu.
 *
 * Reference library: naive-ui `n-dropdown`
 *   (https://www.naiveui.com/zh-CN/light/components/dropdown)
 * Props + semantics mirror n-dropdown's core surface.
 *
 * Parity (this version):
 *   - options: action rows { key, label, disabled?, icon?, children? } mixed
 *     with separators { type: 'divider', key? }
 *   - placement: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' |
 *     'top-start' | 'top-end' — the vertical half flips when the viewport
 *     lacks room, keeping the alignment suffix (bottom-start → top-start)
 *   - trigger: 'click' | 'hover'. Hover closes on a fixed 300ms grace delay
 *     (enter on trigger or panel cancels it); the keyboard surface works
 *     regardless of the trigger type
 *   - disabled / size ('small' | 'medium' | 'large')
 *   - show (controlled) + update:show; uncontrolled when omitted — in
 *     controlled mode the component only emits and the panel follows the prop
 *   - events: select(key, option) after a row activation, clickoutside
 *   - children: ONE right-slide submenu level anchored to the parent row
 *     (right-start; flips left near the viewport's right edge); deeper
 *     levels are ignored
 *   - keyboard: Enter/Space/ArrowDown open, ArrowUp/Down move the highlight
 *     (wraps, skips disabled rows and dividers), ArrowRight enters a
 *     submenu, ArrowLeft leaves it, Enter commits, Esc closes everything
 *   - a11y: role=menu / menuitem / separator, aria-haspopup + aria-expanded
 *     on the trigger, aria-activedescendant for the keyboard highlight
 *
 * Simplifications vs n-dropdown (documented, not accidental):
 *   - dropdown is an action menu — no selected-value state to highlight
 *   - no render-fn props (renderIcon / renderLabel), no arrow, no focus
 *     trap: the trigger slot is expected to render a focusable element and
 *     its keydown bubbles to this wrapper
 *
 * Positioning: Teleport to body + fixed coordinates against the trigger
 * rect (same strategy as SnSelect — no full popper), scroll/resize follow
 * via useOverlayFollow while open. The submenu follows its parent ROW the
 * same way. Per AGENTS.md §41/§42 every timer, listener and follower is
 * torn down on close + unmount.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SnIcon from '../icon/SnIcon.vue'
import { useOverlayFollow } from '../_internal/use-overlay-follow'
import { ChevronRightIcon } from './sn-dropdown-icons'
import {
  normalizeDropdownOptions,
  type SnDropdownItemNode,
  type SnDropdownKey,
  type SnDropdownMenuNode,
  type SnDropdownOption,
  type SnDropdownPlacement,
  type SnDropdownSize,
  type SnDropdownTrigger,
} from './sn-dropdown-types'

defineOptions({ name: 'SnDropdown' })

const props = withDefaults(
  defineProps<{
    /** Menu options — action rows and `type: 'divider'` separators, mixed. */
    options?: SnDropdownOption[]
    /** Where the panel anchors to the trigger (six bottom/top presets). */
    placement?: SnDropdownPlacement
    /** What gesture opens the menu; the keyboard path works regardless. */
    trigger?: SnDropdownTrigger
    /** Disables opening entirely. */
    disabled?: boolean
    /** Panel size preset — row height + font. */
    size?: SnDropdownSize
    /**
     * Controlled show state. When passed, the panel only follows it and
     * `update:show` is emitted instead of flipping internal state; omit
     * for uncontrolled behavior.
     */
    show?: boolean | undefined
  }>(),
  {
    options: () => [],
    placement: 'bottom',
    trigger: 'hover',
    disabled: false,
    size: 'medium',
    show: undefined,
  },
)

const emit = defineEmits<{
  /** Show-state sync (v-model:show; fired in controlled AND uncontrolled mode). */
  (e: 'update:show', show: boolean): void
  /** A row was activated (click / Enter). Parent rows open their submenu. */
  (e: 'select', key: SnDropdownKey, option: SnDropdownOption): void
  /** A mousedown landed outside the trigger and both panels while open. */
  (e: 'clickoutside', event: MouseEvent): void
}>()

defineSlots<{
  /**
   * Trigger content. Render a focusable element (e.g. a button) so keyboard
   * users can reach the menu — its keydown bubbles to this wrapper.
   */
  default?(): unknown
}>()

/* ─────────── Option normalization (§27: pure + deterministic) ─────────── */

const normalizedNodes = computed<SnDropdownMenuNode[]>(() =>
  normalizeDropdownOptions(props.options),
)

/** Keyboard-walkable main rows (dividers + disabled skipped, parents kept). */
const keyboardNodes = computed<SnDropdownItemNode[]>(() =>
  normalizedNodes.value.filter(
    (node): node is SnDropdownItemNode => node.kind === 'item' && !node.disabled,
  ),
)

/* ─────────── Show state (controlled vs uncontrolled) ─────────── */

const rootRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)
const submenuRef = ref<HTMLElement | null>(null)
const parentItemRef = ref<HTMLElement | null>(null)

const pendingIndex = ref(-1)
const pendingSubIndex = ref(-1)
const openSubmenuIndex = ref<number | null>(null)

const uncontrolledShow = ref(false)
const isControlled = computed(() => props.show !== undefined)
const isVisible = computed(() =>
  isControlled.value ? (props.show as boolean) : uncontrolledShow.value,
)

function setVisible(next: boolean): void {
  if (props.disabled && next) return
  if (isVisible.value === next) return
  if (!isControlled.value) uncontrolledShow.value = next
  emit('update:show', next)
}

function openMenu(): void {
  if (props.disabled || isVisible.value) return
  setVisible(true)
}

function closeMenu(): void {
  if (!isVisible.value) return
  setVisible(false)
}

/* ─────────── Stable DOM ids (aria-activedescendant targets) ─────────── */

let dropdownInstanceSeed = 0
const instanceId = ++dropdownInstanceSeed
const menuId = `sn-dropdown-menu-${instanceId}`

function optionId(node: SnDropdownItemNode): string {
  return `sn-dropdown-option-${instanceId}-${node.index}`
}

function subOptionId(node: SnDropdownItemNode): string {
  return `sn-dropdown-sub-${instanceId}-${node.index}`
}

/* ─────────── Keyboard highlight ─────────── */

function pendingNode(): SnDropdownItemNode | null {
  return keyboardNodes.value[pendingIndex.value] ?? null
}

function isPending(node: SnDropdownItemNode): boolean {
  return pendingNode() === node
}

const activeDescendant = computed<string | null>(() => {
  const node = pendingNode()
  return isVisible.value && node ? optionId(node) : null
})

function movePending(delta: 1 | -1): void {
  const nodes = keyboardNodes.value
  if (nodes.length === 0) return
  let next = pendingIndex.value + delta
  if (next < 0) next = nodes.length - 1
  if (next >= nodes.length) next = 0
  pendingIndex.value = next
}

/* ─────────── Submenu state ─────────── */

const submenuParent = computed<SnDropdownItemNode | null>(() => {
  if (openSubmenuIndex.value === null) return null
  const node = normalizedNodes.value[openSubmenuIndex.value]
  return node && node.kind === 'item' && node.children.length > 0 ? node : null
})

const isSubmenuOpen = computed(() => submenuParent.value !== null)

const keyboardSubNodes = computed<SnDropdownItemNode[]>(() => {
  const parent = submenuParent.value
  if (!parent) return []
  return parent.children.filter(
    (node): node is SnDropdownItemNode => node.kind === 'item' && !node.disabled,
  )
})

function isSubPending(node: SnDropdownItemNode): boolean {
  return keyboardSubNodes.value[pendingSubIndex.value] === node
}

const submenuActiveDescendant = computed<string | null>(() => {
  if (!isSubmenuOpen.value) return null
  const node = keyboardSubNodes.value[pendingSubIndex.value]
  return node ? subOptionId(node) : null
})

function movePendingSub(delta: 1 | -1): void {
  const nodes = keyboardSubNodes.value
  if (nodes.length === 0) return
  let next = pendingSubIndex.value + delta
  if (next < 0) next = nodes.length - 1
  if (next >= nodes.length) next = 0
  pendingSubIndex.value = next
}

/* ─────────── Panel positioning (simplified popper, SnSelect strategy) ─────────── */

const MENU_VIEWPORT_GAP = 4
const SUBMENU_GAP = 4

const resolvedPlacement = ref<SnDropdownPlacement>(props.placement)
const menuStyle = ref<Record<string, string>>({})
const submenuSide = ref<'right' | 'left'>('right')
const submenuStyle = ref<Record<string, string>>({})

async function repositionMenu(): Promise<void> {
  const root = rootRef.value
  const menu = menuRef.value
  if (!root || !menu) return
  const rootRect = root.getBoundingClientRect()
  // offsetWidth/Height read the layout box, which the sn-pop enter
  // transform (scale 0.92) does not distort — getBoundingClientRect would
  // measure the scaled panel while the enter transition is running.
  const menuWidth = menu.offsetWidth
  const menuHeight = menu.offsetHeight
  const vw = window.innerWidth
  const vh = window.innerHeight

  const [sideRaw, alignRaw] = props.placement.split('-')
  const side = sideRaw === 'top' ? 'top' : 'bottom'
  const align = alignRaw === 'start' ? 'start' : alignRaw === 'end' ? 'end' : 'center'

  // Horizontal: alignment preset, clamped into the viewport.
  let left: number
  if (align === 'start') left = rootRect.left
  else if (align === 'end') left = rootRect.right - menuWidth
  else left = rootRect.left + rootRect.width / 2 - menuWidth / 2
  left = Math.min(
    Math.max(MENU_VIEWPORT_GAP, left),
    Math.max(MENU_VIEWPORT_GAP, vw - menuWidth - MENU_VIEWPORT_GAP),
  )

  // Requested side preferred; flip when it lacks room and the other has more.
  const roomBelow = vh - rootRect.bottom
  const roomAbove = rootRect.top
  let useTop = side === 'top'
  if (side === 'bottom' && roomBelow < menuHeight && roomAbove > roomBelow) useTop = true
  if (side === 'top' && roomAbove < menuHeight && roomBelow > roomAbove) useTop = false
  const sideWord: 'top' | 'bottom' = useTop ? 'top' : 'bottom'
  resolvedPlacement.value = align === 'center' ? sideWord : `${sideWord}-${align}`

  const top = useTop
    ? Math.max(MENU_VIEWPORT_GAP, rootRect.top - menuHeight)
    : rootRect.bottom

  menuStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
  }
}

async function repositionSubmenu(): Promise<void> {
  const item = parentItemRef.value
  const panel = submenuRef.value
  if (!item || !panel) return
  const itemRect = item.getBoundingClientRect()
  const panelWidth = panel.offsetWidth
  const panelHeight = panel.offsetHeight
  const vw = window.innerWidth
  const vh = window.innerHeight

  // Right of the parent row by default; flip to the left when it would
  // cross the viewport's right edge and the left side has room.
  let left = itemRect.right + SUBMENU_GAP
  if (
    left + panelWidth > vw - MENU_VIEWPORT_GAP
    && itemRect.left - panelWidth - SUBMENU_GAP >= MENU_VIEWPORT_GAP
  ) {
    left = itemRect.left - panelWidth - SUBMENU_GAP
    submenuSide.value = 'left'
  } else {
    submenuSide.value = 'right'
  }
  const top = Math.min(
    Math.max(MENU_VIEWPORT_GAP, itemRect.top),
    Math.max(MENU_VIEWPORT_GAP, vh - panelHeight - MENU_VIEWPORT_GAP),
  )

  submenuStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
  }
}

/* Scroll/resize follow: while a panel is open, any scroll (page or a nested
 * scrollable ancestor) or viewport resize re-runs its reposition pass so the
 * fixed-position panels stay glued to their anchors. */
const followViewport = useOverlayFollow(rootRef, menuRef, repositionMenu, isVisible)
const followSubmenu = useOverlayFollow(parentItemRef, submenuRef, repositionSubmenu, isSubmenuOpen)

/* ─────────── Submenu open / close ─────────── */

function openSubmenuFor(node: SnDropdownItemNode, element?: EventTarget | null): void {
  if (props.disabled || node.disabled || !node.hasChildren) return
  openSubmenuIndex.value = node.index
  pendingSubIndex.value = -1
  parentItemRef.value = element instanceof HTMLElement
    ? element
    : menuRef.value?.querySelector<HTMLElement>(`#${CSS.escape(optionId(node))}`) ?? null
  void nextTick(() => {
    void repositionSubmenu()
    followSubmenu.start()
  })
}

function closeSubmenu(): void {
  if (openSubmenuIndex.value === null) return
  openSubmenuIndex.value = null
  pendingSubIndex.value = -1
  parentItemRef.value = null
  followSubmenu.stop()
}

/* ─────────── Hover trigger (300ms close grace) ─────────── */

const HOVER_CLOSE_DELAY = 300
let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null

function cancelHoverClose(): void {
  if (hoverCloseTimer !== null) {
    clearTimeout(hoverCloseTimer)
    hoverCloseTimer = null
  }
}

function scheduleHoverClose(): void {
  cancelHoverClose()
  hoverCloseTimer = setTimeout(() => {
    hoverCloseTimer = null
    closeMenu()
  }, HOVER_CLOSE_DELAY)
}

function onTriggerMouseEnter(): void {
  if (props.trigger !== 'hover') return
  cancelHoverClose()
  openMenu()
}

function onTriggerMouseLeave(): void {
  if (props.trigger !== 'hover') return
  scheduleHoverClose()
}

function onMenuMouseEnter(): void {
  if (props.trigger !== 'hover') return
  // Pointer moved from the trigger into a panel (or between panels) —
  // cancel the pending close so the gap crossing doesn't dismiss.
  cancelHoverClose()
}

function onMenuMouseLeave(): void {
  if (props.trigger !== 'hover') return
  scheduleHoverClose()
}

/* ─────────── Trigger click + keyboard ─────────── */

function onTriggerClick(): void {
  if (props.trigger !== 'click') return
  if (isVisible.value) closeMenu()
  else openMenu()
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (props.disabled) return
  switch (event.key) {
    case 'Enter': {
      event.preventDefault()
      if (!isVisible.value) {
        openMenu()
        return
      }
      if (isSubmenuOpen.value) {
        commitPendingSub()
        return
      }
      commitPending()
      break
    }
    case ' ':
    case 'Spacebar': {
      // Space opens the menu but must not scroll the page.
      event.preventDefault()
      if (!isVisible.value) openMenu()
      break
    }
    case 'ArrowDown': {
      event.preventDefault()
      if (!isVisible.value) openMenu()
      else if (isSubmenuOpen.value) movePendingSub(1)
      else movePending(1)
      break
    }
    case 'ArrowUp': {
      event.preventDefault()
      if (!isVisible.value) openMenu()
      else if (isSubmenuOpen.value) movePendingSub(-1)
      else movePending(-1)
      break
    }
    case 'ArrowRight': {
      if (isSubmenuOpen.value) break
      event.preventDefault()
      const node = pendingNode()
      if (node) openSubmenuFor(node)
      break
    }
    case 'ArrowLeft': {
      if (isSubmenuOpen.value) {
        event.preventDefault()
        closeSubmenu()
      }
      break
    }
    case 'Escape': {
      if (isVisible.value) {
        event.preventDefault()
        closeMenu()
      }
      break
    }
    default:
      break
  }
}

function commitPending(): void {
  const node = pendingNode()
  if (!node) return
  if (node.hasChildren) {
    openSubmenuFor(node)
    return
  }
  selectItem(node)
}

function commitPendingSub(): void {
  const node = keyboardSubNodes.value[pendingSubIndex.value]
  if (node) selectItem(node)
}

/* ─────────── Row interactions ─────────── */

function selectItem(node: SnDropdownItemNode): void {
  emit('select', node.key, node.raw)
  closeMenu()
}

function onOptionMouseEnter(node: SnDropdownItemNode, event: MouseEvent): void {
  if (props.disabled) return
  // Hover paints the same highlight surface as the keyboard.
  const idx = keyboardNodes.value.findIndex(entry => entry.index === node.index)
  if (idx !== -1) pendingIndex.value = idx
  if (node.hasChildren) openSubmenuFor(node, event.currentTarget)
  else closeSubmenu()
}

function onOptionClick(node: SnDropdownItemNode, event: MouseEvent): void {
  if (props.disabled || node.disabled) return
  if (node.hasChildren) {
    // Click-trigger toggles the submenu; hover-trigger already opened it
    // on mouseenter, so a click must not immediately close it again.
    if (props.trigger === 'click' && openSubmenuIndex.value === node.index) {
      closeSubmenu()
      return
    }
    openSubmenuFor(node, event.currentTarget)
    return
  }
  selectItem(node)
}

function onSubOptionEnter(node: SnDropdownItemNode): void {
  if (props.disabled || node.disabled) return
  pendingSubIndex.value = keyboardSubNodes.value.findIndex(entry => entry.index === node.index)
}

function onSubOptionClick(node: SnDropdownMenuNode): void {
  if (props.disabled) return
  if (node.kind !== 'item' || node.disabled) return
  selectItem(node)
}

/* ─────────── Outside-click dismiss (§41/§42) ─────────── */

function onDocumentMouseDown(event: MouseEvent): void {
  if (!isVisible.value) return
  const target = event.target as Node | null
  if (!target) return
  if (rootRef.value?.contains(target)) return
  if (menuRef.value?.contains(target)) return
  if (submenuRef.value?.contains(target)) return
  emit('clickoutside', event)
  closeMenu()
}

/* ─────────── Listeners lifecycle (§41/§42) ─────────── */

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown)
  cancelHoverClose()
  followViewport.stop()
  followSubmenu.stop()
})

watch(() => props.options, () => {
  // Options swapped while open — re-measure both panels.
  if (!isVisible.value) return
  void nextTick(() => {
    void repositionMenu()
    if (isSubmenuOpen.value) void repositionSubmenu()
  })
})

watch(() => props.disabled, (disabled) => {
  if (disabled) closeMenu()
})

watch(isVisible, (open) => {
  if (open) {
    void nextTick(() => {
      void repositionMenu()
      followViewport.start()
    })
    return
  }
  // Every close (any trigger source, controlled or not) resets highlight
  // + submenu state; opens keep a pending highlight set synchronously by
  // the keyboard path before this watcher runs.
  pendingIndex.value = -1
  pendingSubIndex.value = -1
  followViewport.stop()
  closeSubmenu()
})
</script>

<style scoped>
.sn-dropdown {
  display: inline-flex;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

.sn-dropdown--disabled {
  cursor: not-allowed;
}
</style>

<style scoped>
/* Panels — teleported to body, so they need their own (non-scoped-alias)
 * class names. Teleported nodes still receive the scoped attribute, so both
 * blocks live in the same SFC; a second <style scoped> keeps panel rules
 * grouped separately from trigger rules. The submenu shares .sn-dropdown-menu
 * for base panel styling and adds .sn-dropdown-submenu for its own identity. */
.sn-dropdown-menu {
  position: fixed;
  z-index: var(--sn-web-dropdown-menu-z-index, 1000);
  min-width: 112px;
  padding: var(--sn-web-dropdown-menu-padding-y, 5px) 0;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-dropdown-menu-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-dropdown-menu-radius, 3px);
  background-color: var(
    --sn-web-dropdown-menu-bg,
    var(--sn-web-color-background-elevated)
  );
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-dropdown-menu-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  font-family: inherit;
}

/* Size presets — row height + font (mirror the naive small/medium/large). */
.sn-dropdown-menu--small { --sn-web-dropdown-option-height: 28px; font-size: 13px; }
.sn-dropdown-menu--medium { --sn-web-dropdown-option-height: 34px; font-size: 14px; }
.sn-dropdown-menu--large { --sn-web-dropdown-option-height: 40px; font-size: 15px; }

/* The panel drops from the trigger edge it is anchored to. */
.sn-dropdown-menu--bottom,
.sn-dropdown-menu--bottom-start,
.sn-dropdown-menu--bottom-end {
  transform-origin: center top;
}

.sn-dropdown-menu--top,
.sn-dropdown-menu--top-start,
.sn-dropdown-menu--top-end {
  transform-origin: center bottom;
}

/* Submenu slides from the side it is anchored to. */
.sn-dropdown-submenu--right {
  transform-origin: left center;
}

.sn-dropdown-submenu--left {
  transform-origin: right center;
}

/* sn-pop — naive fade-in-scale-up: enter rises into place, leave fades out. */
.sn-pop-enter-active {
  transition:
    opacity 0.18s cubic-bezier(0, 0, 0.2, 1),
    transform 0.18s cubic-bezier(0, 0, 0.2, 1);
}

.sn-pop-leave-active {
  transition:
    opacity 0.15s cubic-bezier(0, 0, 0.2, 1),
    transform 0.15s cubic-bezier(0, 0, 0.2, 1);
}

.sn-pop-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.92);
}

.sn-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Action rows */
.sn-dropdown-option {
  display: flex;
  align-items: center;
  gap: 6px;
  height: var(--sn-web-dropdown-option-height, 34px);
  padding: 0 var(--sn-web-dropdown-option-padding-x, 12px);
  box-sizing: border-box;
  color: var(--sn-web-dropdown-option-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: background-color 0.15s ease-out;
}

/* Hover and keyboard highlight share one surface. */
.sn-dropdown-option:hover,
.sn-dropdown-option--pending {
  background-color: var(
    --sn-web-dropdown-option-bg-hover,
    var(--sn-web-color-background-subtle)
  );
}

.sn-dropdown-option--disabled {
  color: var(
    --sn-web-dropdown-option-text-color-disabled,
    var(--sn-web-color-text-disabled)
  );
  cursor: not-allowed;
}

.sn-dropdown-option--disabled:hover {
  background-color: transparent;
}

.sn-dropdown-option__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sn-dropdown-option__icon {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-dropdown-option-icon-color, var(--sn-web-color-text-secondary));
}

/* Clamp consumer-provided icons into the row's icon box (SnMenu precedent). */
.sn-dropdown-option__icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.sn-dropdown-option__arrow {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  color: var(--sn-web-dropdown-option-arrow-color, var(--sn-web-color-text-tertiary));
}

.sn-dropdown-menu__divider {
  height: 1px;
  margin: var(--sn-web-dropdown-divider-margin, 5px 0);
  background-color: var(
    --sn-web-dropdown-divider-color,
    var(--sn-web-color-border-subtle)
  );
}
</style>
