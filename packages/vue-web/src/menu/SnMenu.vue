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
 *   indent / inverted / options.icon / label-field / key-field /
 *   children-field remap (so consumers can pass API-shaped trees without
 *   reshaping).
 *
 * §112 future markers (NOT in this version, doc-roadmap):
 *   - collapsed / collapsedWidth: sidecar collapse-to-bar layout
 *   - layoutSiderInjection / responsive: auto-collapsing sidebar
 *   - dropdown submenu (dropdownProps)
 *   - renderIcon / renderLabel / renderSuffix / renderExtra render-fns
 *   - nodeProps: per-node Vue props injection
 *   - virtualized overflow ellipsis
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

import { computed } from 'vue'

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
    /** Display mode. Mirrors n-menu `mode`. Default 'vertical'. */
    mode?: 'vertical' | 'horizontal'
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
    disabled: typeof raw['disabled'] === 'boolean' ? raw['disabled'] : false,
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
</script>

<template>
  <nav
    :class="[
      'sn-menu',
      `sn-menu--${mode}`,
      inverted ? 'sn-menu--inverted' : '',
    ]"
    :role="mode === 'horizontal' ? 'menubar' : 'menu'"
  >
    <div class="sn-menu__list">
      <template v-for="item in normalizedOptions" :key="`top-${item.key}`">
        <component
          :is="isLink(item) ? 'a' : 'button'"
          v-if="mode === 'horizontal' || !item.children?.length"
          :class="[
            'sn-menu-item',
            { 'sn-menu-item--active': isActive(item.key),
              'sn-menu-item--disabled': item.disabled,
              'sn-menu-item--group': !!item.children?.length,
              'sn-menu-item--expanded': isExpanded(item.key) && !!item.children?.length,
              'sn-menu-item--inverted': inverted,
            },
          ]"
          :type="isLink(item) ? undefined : 'button'"
          :href="isLink(item) ? item.href : undefined"
          :disabled="!isLink(item) ? item.disabled : undefined"
          :aria-disabled="item.disabled || undefined"
          :aria-current="isActive(item.key) ? 'page' : undefined"
          :aria-expanded="mode === 'vertical' && item.children?.length ? (isExpanded(item.key) ? 'true' : 'false') : undefined"
          :style="indentStyleForLevel(0)"
          @click="mode === 'vertical' && item.children?.length ? toggleGroup(item.key) : selectOption(item)"
        >
          <span v-if="item.icon" class="sn-menu-item__icon"><component :is="item.icon" /></span>
          <span class="sn-menu-item__label">{{ item.label }}</span>
          <span
            v-if="mode === 'vertical' && item.children?.length"
            class="sn-menu-item__caret"
            aria-hidden="true"
          >{{ isExpanded(item.key) ? '▾' : '▸' }}</span>
        </component>
        <!-- Vertical mode: group header only (when no children rendered) -->
        <button
          v-else-if="mode === 'vertical' && item.children?.length"
          type="button"
          :class="[
            'sn-menu-item sn-menu-item--group',
            { 'sn-menu-item--expanded': isExpanded(item.key),
              'sn-menu-item--inverted': inverted,
            },
          ]"
          :aria-expanded="isExpanded(item.key) ? 'true' : 'false'"
          @click="toggleGroup(item.key)"
        >
          <span v-if="item.icon" class="sn-menu-item__icon"><component :is="item.icon" /></span>
          <span class="sn-menu-item__label">{{ item.label }}</span>
          <span class="sn-menu-item__caret" aria-hidden="true">{{ isExpanded(item.key) ? '▾' : '▸' }}</span>
        </button>
        <!-- Vertical mode: nested children when group expanded -->
        <div
          v-if="mode === 'vertical' && item.children?.length && isExpanded(item.key)"
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