<script setup lang="ts">
/**
 * SnMenu — hierarchical navigation menu (AUI-WEB-NAV-001).
 *
 * Reference library: naive-ui `n-menu`
 *   (https://www.naiveui.com/zh-CN/light/components/menu)
 * Per AGENTS.md §112, the props that drive the docs-site chrome (mode,
 * options, value, expandedKeys, onUpdate*) are 1:1 with n-menu.
 *
 * Advanced n-menu features (suffix / collapsed / collapsedWidth /
 * layoutSiderInjection / dropdown submenu / virtualized overflow ellipsis
 * / tree-mate based label field remapping) are §112 future markers.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnMenu mode="horizontal" :options="navItems" v-model:value="active" />
 *   <SnMenu mode="vertical" :options="treeItems" v-model:value="active"
 *           v-model:expanded-keys="expanded" />
 *
 * options shape:
 *   { key, label, children?: SnMenuOption[], disabled?: boolean, href?: string, icon?: Component }
 */

import { computed } from 'vue'

defineOptions({ name: 'SnMenu' })

/** SnMenu option shape — flat-friendly, recursive for vertical mode. */
export interface SnMenuOption {
  key: string | number
  label: string
  /** Optional nested children (vertical mode only). */
  children?: SnMenuOption[]
  /** Disable interaction. */
  disabled?: boolean
  /** Optional href for navigation. When provided, item renders as <a>. */
  href?: string
  /** Optional icon component reference. */
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
  },
)

const emit = defineEmits<{
  (e: 'update:value', value: string | number | null): void
  (e: 'update:expandedKeys', keys: Array<string | number>): void
  /** Fired when a leaf item is clicked (n-menu `onUpdateValue`). */
  (e: 'select', value: string | number | null, item: SnMenuOption): void
}>()

/** Reactive view of the current value. Falls back to `defaultValue`. */
const currentValue = computed<string | number |null>(() => {
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
    walk(props.options ?? [])
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
      for (const o of props.options ?? []) {
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
    :class="['sn-menu', `sn-menu--${mode}`]"
    :role="mode === 'horizontal' ? 'menubar' : 'menu'"
  >
    <div class="sn-menu__list">
      <template v-for="item in options" :key="`top-${item.key}`">
        <component
          :is="isLink(item) ? 'a' : 'button'"
          v-if="mode === 'horizontal' || !item.children?.length"
          :class="[
            'sn-menu-item',
            { 'sn-menu-item--active': isActive(item.key),
              'sn-menu-item--disabled': item.disabled,
              'sn-menu-item--group': !!item.children?.length,
              'sn-menu-item--expanded': isExpanded(item.key) && !!item.children?.length,
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
            { 'sn-menu-item--expanded': isExpanded(item.key) },
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