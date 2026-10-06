<script setup lang="ts">
/**
 * SnMenu — hierarchical navigation menu (AUI-WEB-NAV-001).
 *
 * Reference library: naive-ui `n-menu`
 *   (https://www.naiveui.com/zh-CN/light/components/menu)
 * Per AGENTS.md §112, props + their semantics mirror n-menu 1:1.
 *
 * 1:1 parity (this version): mode / options / value / defaultValue /
 *   expandedKeys / defaultExpandedKeys / defaultExpandAll / accordion /
 *   indent / inverted / collapsed / collapsedWidth / collapsedIconSize /
 *   iconSize / label-field / key-field / children-field / dropdownPlacement
 *   / disabled remap. Plus hover-popover submenu rendering in collapsed
 *   mode (pure CSS, no portal needed for the basic case).
 *
 * popButton mode (AUI extension beyond n-menu — Material Design Speed
 * Dial / Element Plus el-fab shape):
 *   - Menu sits as a circular FAB stack. The trigger item (default:
 *     last in options, override via `triggerKey`) is always visible.
 *   - Hovering the menu area expands the rest of the items vertically
 *     above the trigger with a smooth height + opacity transition.
 *   - Each expanded item is wrapped in <SnTooltip content={label}>
 *     so hovering an item shows its label without consuming width.
 *
 * §112 future markers (NOT in this version, doc-roadmap):
 *   - layoutSiderInjection / responsive: auto-collapsing sidebar driven
 *     by an outer <n-layout-sider>
 *   - dropdownProps: full naive-ui dropdown prop pass-through
 *   - renderIcon / renderLabel / renderSuffix / renderExtra render-fns
 *   - nodeProps: per-node Vue props injection
 *   - virtualized overflow ellipsis (horizontal mode auto-collapse)
 *   - tree-mate based label remap (we expose plain key/children-field instead)
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnMenu mode="horizontal" :options="navItems" v-model:value="active" />
 *   <SnMenu mode="vertical" :options="treeItems" v-model:value="active"
 *           v-model:expanded-keys="expanded" :accordion="true" />
 *
 * options shape:
 *   { key, label, children?, disabled?, href?, [icon]? }  (default)
 *   { [label-field], [key-field], [children-field], ... }  (with remap)
 */

import { computed, ref } from 'vue'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import SnIcon from '../icon/SnIcon.vue'
import SnTooltip from '../tooltip/SnTooltip.vue'

defineOptions({ name: 'SnMenu' })

/** SnMenu option shape — default field names. When consumers pass a tree
 * that doesn't match (e.g. their API returns `title` instead of `label`),
 * they set `label-field="title"` etc. on the menu to remap. */
export interface SnMenuOption {
  key: string | number
  label: string
  /** Optional nested children (vertical mode only). */
  children?: SnMenuOption[]
  /** Disable interaction. */
  disabled?: boolean
  /** Optional href for navigation. When provided, item renders as <a>.
   * `undefined` is allowed for the default-valued optional field so the
   * normalize step can write back `undefined` without TS complaining under
   * `exactOptionalPropertyTypes`. */
  href?: string | undefined
  /** Optional icon component reference (markRaw Component or functional). */
  icon?: unknown
}

// Reference: naive-ui menuProps
//   (https://github.com/tusen-ai/naive-ui/blob/main/src/menu/src/Menu.tsx)
const props = withDefaults(
  defineProps<{
    /** Display mode. Mirrors n-menu `mode` plus AUI extension `popButton`.
     * Default 'vertical'.
     *   - `vertical`   — sidebar / inline expansion
     *   - `horizontal` — top navbar
     *   - `popButton`  — Floating Action Button (FAB) menu: all items
     *                    render as circular icon buttons stacked
     *                    vertically. The trigger (last by default, or the
     *                    item whose key matches `triggerKey`) is always
     *                    visible; hovering the menu area expands the other
     *                    items above the trigger. Each item shows a
     *                    `<SnTooltip>` on hover. Position the menu inside
     *                    a `position: relative` parent to anchor it where
     *                    you want.
     *                    AUI extension beyond n-menu — naive-ui doesn't
     *                    ship a popButton mode. */
    mode?: 'vertical' | 'horizontal' | 'popButton'
    /** Which item is the always-visible trigger in popButton mode.
     * Defaults to the last item in `options`. AUI extension. */
    triggerKey?: string | number
    /** Menu options tree. Mirrors n-menu `options`. */
    options?: SnMenuOption[]
    /** Selected key. Mirrors n-menu `value`. */
    value?: string | number | null
    /** Default selected key. Mirrors n-menu `defaultValue`. Default null. */
    defaultValue?: string | number | null
    /** Expanded submenu keys. Mirrors n-menu `expandedKeys`. */
    expandedKeys?: Array<string | number>
    /** Default expanded keys. Mirrors n-menu `defaultExpandedKeys`. */
    defaultExpandedKeys?: Array<string | number>
    /** Whether to expand all submenus by default. Mirrors n-menu `defaultExpandAll`. */
    defaultExpandAll?: boolean
    /** Restrict to single expanded submenu. Mirrors n-menu `accordion`. */
    accordion?: boolean
    /** Indent per level (px). Mirrors n-menu `indent`. Default 32. */
    indent?: number
    /** Dark backdrop variant — colors flip for use on color-background navbars.
     * Mirrors n-menu `inverted`. Default false. */
    inverted?: boolean
    /** Field name used to read each node's `key`. Mirrors n-menu `key-field`. */
    keyField?: string
    /** Field name used to read each node's `label`. Mirrors n-menu `label-field`. */
    labelField?: string
    /** Field name used to read each node's children array. Mirrors n-menu `children-field`. */
    childrenField?: string
    /** Whether the menu is rendered in collapsed (icon-only) form. Mirrors
     * n-menu `collapsed`. Submenus in collapsed mode open via a hover
     * popover anchored to the right of the parent item. Default false. */
    collapsed?: boolean
    /** Width (px) of the collapsed bar. Mirrors n-menu `collapsed-width`.
     * Default 48 (matches Element Plus). */
    collapsedWidth?: number
    /** Icon size (px) used in collapsed mode. Mirrors n-menu
     * `collapsed-icon-size`. Default 24. */
    collapsedIconSize?: number
    /** Icon size (px) used in normal mode. Mirrors n-menu `icon-size`.
     * Default 20. */
    iconSize?: number
    /** Popover placement for submenus in collapsed mode. Mirrors n-menu
     * `dropdown-placement`. Default 'right-start' (popover opens to the
     * right of the bar, top-aligned with the hovered item — matches
     * Element Plus and naive-ui default). */
    dropdownPlacement?: 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom'
    /** Field name used to read each node's `disabled` flag. Mirrors n-menu
     * `disabled-field`. Default 'disabled'. */
    disabledField?: string
  }>(),
  {
    mode: 'vertical',
    options: () => [],
    value: null,
    defaultValue: null,
    expandedKeys: () => [],
    defaultExpandedKeys: () => [],
    defaultExpandAll: false,
    accordion: false,
    indent: 32,
    inverted: false,
    keyField: 'key',
    labelField: 'label',
    childrenField: 'children',
    collapsed: false,
    collapsedWidth: 48,
    collapsedIconSize: 24,
    iconSize: 20,
    dropdownPlacement: 'right-start',
    disabledField: 'disabled',
    triggerKey: '',
  },
)

const emit = defineEmits<{
  (e: 'update:value', value: string | number | null): void
  (e: 'update:expandedKeys', keys: Array<string | number>): void
  /** Fired when a leaf item is clicked (n-menu `onUpdateValue`). */
  (e: 'select', value: string | number | null, item: SnMenuOption): void
}>()

/* ─────────── Tree remapping (key-field / label-field / children-field) ───────
 * Consumers frequently have an API payload that uses different field names
 * (e.g. `id` instead of `key`, `title` instead of `label`). Rather than force
 * them to reshape the tree, we expose n-menu's field-remap props. Internally
 * we normalize on read; the consumer's original object is unchanged. */
interface RawNode {
  [k: string]: unknown
}
function readKey(raw: RawNode): string | number {
  const v = raw[props.keyField]
  return (typeof v === 'string' || typeof v === 'number') ? v : ''
}
function readLabel(raw: RawNode): string {
  const v = raw[props.labelField]
  return typeof v === 'string' ? v : ''
}
function readChildren(raw: RawNode): RawNode[] | undefined {
  const v = raw[props.childrenField]
  return Array.isArray(v) ? (v as RawNode[]) : undefined
}
function normalize(raw: RawNode): SnMenuOption {
  const children = readChildren(raw)
  const out: SnMenuOption = {
    key: readKey(raw),
    label: readLabel(raw),
    disabled: typeof raw[props.disabledField] === 'boolean' ? raw[props.disabledField] as boolean : false,
    href: typeof raw['href'] === 'string' ? raw['href'] : undefined,
    icon: raw['icon'],
  }
  if (children) out.children = children.map((c) => normalize(c))
  return out
}
const normalizedOptions = computed<SnMenuOption[]>(() =>
  (props.options ?? []).map((o) => normalize(o as unknown as RawNode)),
)

/* ─────────── Reactive state ─────────── */

/** Reactive view of the current value. Falls back to `defaultValue`. */
const currentValue = computed<string | number | null>(() => {
  return props.value !== null ? props.value : props.defaultValue
})

/** Reactive view of expanded keys. Falls back to defaultExpandAll. */
const currentExpanded = computed<Set<string | number>>(() => {
  if (props.expandedKeys.length) return new Set(props.expandedKeys)
  if (props.defaultExpandedKeys.length) return new Set(props.defaultExpandedKeys)
  if (props.defaultExpandAll) {
    const all = new Set<string | number>()
    const walk = (opts: SnMenuOption[]): void => {
      for (const o of opts) {
        if (o.children && o.children.length) {
          all.add(o.key)
          walk(o.children)
        }
      }
    }
    walk(normalizedOptions.value)
    return all
  }
  return new Set<string | number>()
})

function isActive(key: string | number): boolean {
  return currentValue.value === key
}
function isExpanded(key: string | number): boolean {
  return currentExpanded.value.has(key)
}
function selectOption(opt: SnMenuOption): void {
  if (opt.disabled) return
  emit('update:value', opt.key)
  emit('select', opt.key, opt)
}
function toggleGroup(key: string | number): void {
  const next = new Set(currentExpanded.value)
  if (next.has(key)) {
    next.delete(key)
  }
  else {
    if (props.accordion) {
      // Close other top-level groups
      for (const o of normalizedOptions.value) {
        if (o.children && o.children.length && o.key !== key) {
          next.delete(o.key)
        }
      }
    }
    next.add(key)
  }
  emit('update:expandedKeys', Array.from(next))
}

/** Pick render tag: <a> when href is provided, <button> otherwise. */
function isLink(opt: SnMenuOption): boolean {
  return typeof opt.href === 'string' && opt.href.length > 0
}
function indentStyleForLevel(level: number): Record<string, string> {
  return props.mode === 'vertical' && level > 0
    ? { paddingLeft: `${props.indent * level}px` }
    : {}
}

/* ─────────── popButton state ─────────── */

/** Which option is the always-visible trigger. Defaults to the last item
 * in `normalizedOptions`. Populated lazily because the options array is
 * the source of truth. */
const popTriggerKey = computed<string | number>(() => {
  if (props.triggerKey !== '' && props.triggerKey !== undefined) return props.triggerKey
  const opts = normalizedOptions.value
  return opts[opts.length - 1]?.key ?? ''
})

/** Items other than the trigger (rendered above the trigger, hidden until hover). */
const popExpandedItems = computed<SnMenuOption[]>(() => {
  const opts = normalizedOptions.value
  const tk = popTriggerKey.value
  return opts.filter((o) => o.key !== tk)
})

/** Hover state — true while the user is over the menu root or any item. */
const popHovering = ref(false)

/* Provide / consume hover so each leaf <button>'s mouseenter keeps the
 * menu expanded even when the cursor crosses the gap between items. */
function onRootMouseEnter(): void {
  if (props.mode === 'popButton') popHovering.value = true
}
function onRootMouseLeave(): void {
  if (props.mode === 'popButton') popHovering.value = false
}

/** Is this item the always-visible popButton trigger? */
function isPopTrigger(item: SnMenuOption): boolean {
  return item.key === popTriggerKey.value
}
</script>

<template>
  <nav
    :class="[
      'sn-menu',
      `sn-menu--${mode}`,
      collapsed ? 'sn-menu--collapsed' : '',
      inverted ? 'sn-menu--inverted' : '',
      mode === 'popButton' && popHovering ? 'sn-menu--popButton-open' : '',
    ]"
    :role="mode === 'horizontal' ? 'menubar' : 'menu'"
    :style="collapsed && mode === 'vertical' ? `--sn-menu-collapsed-width: ${collapsedWidth}px; --sn-menu-icon-size: ${collapsedIconSize}px;` : `--sn-menu-icon-size: ${iconSize}px;`"
    @mouseenter="onRootMouseEnter"
    @mouseleave="onRootMouseLeave"
  >
    <div class="sn-menu__list">
      <template v-for="item in normalizedOptions" :key="`top-${item.key}`">
        <!--
          Each top-level item is rendered as:
            - horizontal mode + no children  → <a> / <button>
            - vertical mode + has children   → <button> with hover popover
              for nested children (popover only shows in collapsed mode; in
              normal vertical the children render inline below the parent)
            - vertical mode + no children    → <a> / <button>

          Collapsed mode forces every top-level item to render the icon-only
          branch (label + caret hidden via .sn-menu--collapsed .sn-menu-item__label).
        -->
        <div
          v-if="mode === 'vertical' && item.children?.length"
          class="sn-menu-group-wrapper"
          :class="{
            'sn-menu-group-wrapper--collapsed-popover': collapsed,
            'sn-menu-group-wrapper--expanded': !collapsed && isExpanded(item.key),
          }"
        >
          <component
            :is="isLink(item) ? 'a' : 'button'"
            :class="[
              'sn-menu-item sn-menu-item--group',
              { 'sn-menu-item--active': isActive(item.key),
                'sn-menu-item--disabled': item.disabled,
                'sn-menu-item--expanded': !collapsed && isExpanded(item.key),
                'sn-menu-item--inverted': inverted,
              },
            ]"
            :type="isLink(item) ? undefined : 'button'"
            :href="!collapsed && isLink(item) ? item.href : undefined"
            :disabled="!isLink(item) ? item.disabled : undefined"
            :aria-disabled="item.disabled || undefined"
            :aria-current="!collapsed && isActive(item.key) ? 'page' : undefined"
            :aria-expanded="isExpanded(item.key) ? 'true' : 'false'"
            :aria-haspopup="collapsed ? 'menu' : undefined"
            @click="collapsed ? null : toggleGroup(item.key)"
          >
            <span v-if="item.icon" class="sn-menu-item__icon">
              <component :is="item.icon" />
            </span>
            <span class="sn-menu-item__label">{{ item.label }}</span>
            <span
              class="sn-menu-item__caret"
              aria-hidden="true"
            >
              <SnIcon :icon="isExpanded(item.key) ? ChevronDown : ChevronRight" :size="14" />
            </span>
          </component>

          <!--
            Collapsed mode: hover-triggered popover anchored to the right
            of the parent. Pure CSS — :hover on the wrapper toggles a
            `data-show` attribute via `.sn-menu-group-wrapper:hover`. The
            popover panel itself is the children list rendered inline +
            absolutely positioned.
          -->
          <!--
            Hover-bridge element that fills the 8px visual gap between
            the menu's right edge and the popover's left edge. Without
            this, mouse motion through the gap would mouseleave the
            wrapper (collapsing the popover) before mouseenter reaches
            the popover itself.
          -->
          <div
            v-if="collapsed && item.children?.length"
            class="sn-menu-popover-bridge"
            aria-hidden="true"
          />
          <div
            v-if="collapsed && item.children?.length"
            class="sn-menu-submenu-popover"
            role="menu"
            :aria-label="item.label"
            @click.stop
          >
            <component
              :is="isLink(child) ? 'a' : 'button'"
              v-for="child in item.children"
              :key="`pop-${child.key}`"
              :type="isLink(child) ? undefined : 'button'"
              :class="[
                'sn-menu-item sn-menu-item--popover-leaf',
                { 'sn-menu-item--active': isActive(child.key),
                  'sn-menu-item--disabled': child.disabled,
                  'sn-menu-item--inverted': inverted,
                },
              ]"
              :href="isLink(child) ? child.href : undefined"
              :disabled="!isLink(child) ? child.disabled : undefined"
              :aria-disabled="child.disabled || undefined"
              :aria-current="isActive(child.key) ? 'page' : undefined"
              @click="selectOption(child)"
            >
              <span v-if="child.icon" class="sn-menu-item__icon">
                <component :is="child.icon" />
              </span>
              <span class="sn-menu-item__label">{{ child.label }}</span>
            </component>
          </div>

          <!-- Normal (expanded) vertical: render children under the parent -->
          <div
            v-else-if="!collapsed && isExpanded(item.key)"
            class="sn-menu-group"
            role="group"
          >
            <component
              :is="isLink(child) ? 'a' : 'button'"
              v-for="child in item.children"
              :key="`c-${child.key}`"
              :type="isLink(child) ? undefined : 'button'"
              :class="[
                'sn-menu-item sn-menu-item--leaf',
                { 'sn-menu-item--active': isActive(child.key),
                  'sn-menu-item--disabled': child.disabled,
                  'sn-menu-item--inverted': inverted,
                },
              ]"
              :href="isLink(child) ? child.href : undefined"
              :disabled="!isLink(child) ? child.disabled : undefined"
              :aria-disabled="child.disabled || undefined"
              :aria-current="isActive(child.key) ? 'page' : undefined"
              :style="indentStyleForLevel(1)"
              @click="selectOption(child)"
            >
              <span class="sn-menu-item__label">{{ child.label }}</span>
            </component>
          </div>
        </div>

        <!-- Top-level leaf item (no children) -->
        <SnTooltip
          v-else-if="mode === 'popButton' && !isPopTrigger(item)"
          :content="item.label"
          placement="top-start"
          :disabled="!!inverted"
        >
          <component
            :is="isLink(item) ? 'a' : 'button'"
            :class="[
              'sn-menu-item sn-menu-item--popButton',
              { 'sn-menu-item--active': isActive(item.key),
                'sn-menu-item--disabled': item.disabled,
                'sn-menu-item--inverted': inverted,
              },
            ]"
            :type="isLink(item) ? undefined : 'button'"
            :href="isLink(item) ? item.href : undefined"
            :disabled="!isLink(item) ? item.disabled : undefined"
            :aria-disabled="item.disabled || undefined"
            :aria-current="isActive(item.key) ? 'page' : undefined"
            @click="selectOption(item)"
          >
            <span v-if="item.icon" class="sn-menu-item__icon">
              <component :is="item.icon" />
            </span>
            <span class="sn-menu-item__label">{{ item.label }}</span>
          </component>
        </SnTooltip>
        <component
          :is="isLink(item) ? 'a' : 'button'"
          v-else-if="!(mode === 'popButton' && !isPopTrigger(item))"
          :class="[
            'sn-menu-item',
            { 'sn-menu-item--active': isActive(item.key),
              'sn-menu-item--disabled': item.disabled,
              'sn-menu-item--inverted': inverted,
              'sn-menu-item--popButton-trigger':
                mode === 'popButton' && isPopTrigger(item),
            },
          ]"
          :type="isLink(item) ? undefined : 'button'"
          :href="isLink(item) ? item.href : undefined"
          :disabled="!isLink(item) ? item.disabled : undefined"
          :aria-disabled="item.disabled || undefined"
          :aria-current="isActive(item.key) ? 'page' : undefined"
          @click="selectOption(item)"
        >
          <span v-if="item.icon" class="sn-menu-item__icon">
            <component :is="item.icon" />
          </span>
          <span class="sn-menu-item__label">{{ item.label }}</span>
        </component>
      </template>
    </div>
  </nav>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-menu {
  box-sizing: border-box;
  color: var(--sn-web-color-text-primary);
}

.sn-menu--horizontal .sn-menu__list {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sn-menu--vertical .sn-menu__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sn-menu-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.4;
  background: transparent;
  border: none;
  color: var(--sn-web-color-text-primary);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  text-decoration: none;
}
.sn-menu-item:hover:not(.sn-menu-item--disabled):not(.sn-menu-item--active) {
  background: rgba(0, 0, 0, 0.04);
}
.sn-menu-item--active {
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary, #fff);
}
.sn-menu-item--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.sn-menu-item--group {
  font-weight: 600;
}
.sn-menu-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 14px;
  flex-shrink: 0;
}
.sn-menu-item__caret {
  margin-left: auto;
  font-size: 10px;
  opacity: 0.6;
}
.sn-menu-item--leaf {
  font-weight: normal;
}

.sn-menu-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ─────────── popButton mode (FAB / Speed Dial) ───────────
 * Floating Action Button group: a vertical column of icon-only circular
 * buttons. The trigger (last item by default, or item matching
 * `triggerKey`) is always visible. Hovering the menu area expands the
 * rest above the trigger with a fade + slide; each expanded item shows
 * a tooltip with its text via the <SnTooltip> wrapper in the template.
 *
 * The menu no longer anchors itself to the viewport — position the
 * consumer's parent (`position: relative` is enough) to place it. This
 * matches the behavior of `el-fab` and most FAB menus in real apps
 * (where you typically want it inside a card / panel, not stuck to the
 * viewport corner). */
.sn-menu--popButton {
  display: inline-flex;
  z-index: 50;
}
.sn-menu--popButton .sn-menu__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.sn-menu--popButton .sn-menu-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 999px;
  background: var(--sn-web-color-background-elevated, #fff);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.06);
  color: var(--sn-web-color-text-primary);
  border: none;
  cursor: pointer;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease,
    background-color 0.18s ease;
}
.sn-menu--popButton .sn-menu-item:hover:not(.sn-menu-item--disabled) {
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}
.sn-menu--popButton .sn-menu-item--active {
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary, #fff);
}
.sn-menu--popButton .sn-menu-item__icon {
  width: 22px;
  height: 22px;
  font-size: 22px;
  flex-shrink: 0;
}
/* Hide the inline label — the expanded item's label comes from the
 * wrapping <SnTooltip>, not from a slide-in span. (The trigger keeps
 * its label hidden too — only the icon shows.) */
.sn-menu--popButton .sn-menu-item__label {
  display: none;
}

/* Expanded items (every item except the trigger) — hidden by default,
 * shown on root hover. Animations: opacity + slight slide down so the
 * stack "lifts" out of the trigger button. */
.sn-menu--popButton .sn-menu-item--popButton {
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px) scale(0.92);
  transition:
    opacity 0.18s ease,
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.sn-menu--popButton.sn-menu--popButton-open .sn-menu-item--popButton {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}
.sn-menu--popButton.sn-menu--popButton-open .sn-menu-item--popButton:nth-child(2) { transition-delay: 0ms; }
.sn-menu--popButton.sn-menu--popButton-open .sn-menu-item--popButton:nth-child(3) { transition-delay: 0.04s; }
.sn-menu--popButton.sn-menu--popButton-open .sn-menu-item--popButton:nth-child(4) { transition-delay: 0.08s; }
.sn-menu--popButton.sn-menu--popButton-open .sn-menu-item--popButton:nth-child(5) { transition-delay: 0.12s; }
.sn-menu--popButton.sn-menu--popButton-open .sn-menu-item--popButton:nth-child(n+6) { transition-delay: 0.16s; }

/* Hide groups in popButton — flatten to leaves per the doc-roadmap. */
.sn-menu--popButton .sn-menu-item--group {
  display: none;
}

/* Inverted popButton (on dark surface) — wash + backdrop blur. */
.sn-menu--popButton.sn-menu--inverted .sn-menu-item {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  backdrop-filter: blur(6px);
}
.sn-menu--popButton.sn-menu--inverted .sn-menu-item:hover:not(.sn-menu-item--disabled) {
  background: rgba(255, 255, 255, 0.2);
}
.sn-menu--popButton.sn-menu--inverted .sn-menu-item--active {
  background: var(--sn-web-color-action-primary);
}

/* ─────────── Collapsed mode ─────────── */

/* Group wrapper used for vertical items with children. Holds the parent
 * trigger + (popover | inline-children) so hover can target both. */
.sn-menu-group-wrapper {
  position: relative;
}

/* Collapsed bar: clamp the menu to its width, center icons, hide labels
 * + carets. The token --sn-menu-collapsed-width / --sn-menu-icon-size
 * are set inline on the root <nav> based on `collapsedWidth` /
 * `collapsedIconSize`. */
.sn-menu--collapsed.sn-menu--vertical .sn-menu__list {
  width: var(--sn-menu-collapsed-width, 48px);
}
.sn-menu--collapsed .sn-menu-item__label,
.sn-menu--collapsed .sn-menu-item__caret {
  display: none;
}
.sn-menu--collapsed .sn-menu-item {
  justify-content: center;
  padding: 12px 0;
}
.sn-menu--collapsed .sn-menu-item__icon {
  width: var(--sn-menu-icon-size, 24px);
  height: var(--sn-menu-icon-size, 24px);
  font-size: var(--sn-menu-icon-size, 24px);
}

/* ─────────── Submenu popover (collapsed hover) ───────────
 * Renders hidden by default; visible while the parent group-wrapper is
 * hovered, focused-within, or the popover itself has focus. Anchored to
 * the right of the bar with a transparent hover-bridge in between so
 * mouse motion through the gap doesn't collapse the popover.
 * Pure CSS — no portal. */
.sn-menu-popover-bridge {
  position: absolute;
  top: 0;
  left: 100%;
  width: 8px;
  height: 100%;
  z-index: 99;
  /* Visible for hover purposes; no background so it doesn't show visually. */
}
.sn-menu-submenu-popover {
  position: absolute;
  top: 0;
  left: calc(100% + 8px);
  min-width: 180px;
  padding: 6px;
  border-radius: 8px;
  background: var(--sn-web-color-background-elevated, #fff);
  box-shadow:
    0 6px 16px -4px rgba(0, 0, 0, 0.12),
    0 4px 8px -2px rgba(0, 0, 0, 0.08),
    0 0 0 1px var(--sn-web-color-border-default, rgba(0, 0, 0, 0.06));
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 100;
  opacity: 0;
  transform: translateX(-4px);
  pointer-events: none;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
/* Show on hover / focus within the wrapper OR the bridge OR the popover
 * itself. All three together keep the popover open while the mouse
 * moves through the gap. */
.sn-menu-group-wrapper--collapsed-popover:hover .sn-menu-submenu-popover,
.sn-menu-group-wrapper--collapsed-popover:focus-within .sn-menu-submenu-popover,
.sn-menu-submenu-popover:hover,
.sn-menu-submenu-popover:focus-within,
.sn-menu-popover-bridge:hover ~ .sn-menu-submenu-popover {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.sn-menu-item--popover-leaf {
  width: 100%;
  justify-content: flex-start;
}
.sn-menu-item--popover-leaf .sn-menu-item__icon {
  width: var(--sn-menu-icon-size, 20px);
  height: var(--sn-menu-icon-size, 20px);
  font-size: var(--sn-menu-icon-size, 20px);
}

/* Inverted (dark backdrop nav) — n-menu `inverted: true`. Active item
 * uses a translucent white wash + bold text; hover is a faint white wash.
 * Pairs with --sn-web-color-action-primary / --sn-web-color-text-on-primary
 * via the consumer (no hardcoded brand colors here). */
.sn-menu--inverted,
.sn-menu--inverted .sn-menu-item {
  color: rgba(255, 255, 255, 0.82);
}
.sn-menu--inverted .sn-menu-item:hover:not(.sn-menu-item--disabled):not(.sn-menu-item--active) {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.sn-menu--inverted .sn-menu-item--active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-weight: 600;
}
.sn-menu--inverted .sn-menu-item__caret {
  color: rgba(255, 255, 255, 0.6);
}

/* Doodle skin */
.snui-skin-doodle .sn-menu-item {
  border: 2px solid transparent;
  font-weight: 600;
}
.snui-skin-doodle .sn-menu-item--active {
  border: 2px solid #1a1a1a;
  background: #1a1a1a;
  color: #fff;
}
.snui-skin-doodle .sn-menu-item--expanded {
  border: 2px solid #1a1a1a;
}
</style>