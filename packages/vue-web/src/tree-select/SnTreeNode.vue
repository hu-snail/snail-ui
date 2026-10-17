<template>
  <div
    :id="rowId"
    :class="['sn-tree-select-node', `sn-tree-select-node--${size}`, {
      'sn-tree-select-node--selected': selected,
      'sn-tree-select-node--pending': pending,
      'sn-tree-select-node--disabled': disabled,
    }]"
    role="treeitem"
    :aria-selected="selected ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-expanded="hasChildren ? (expanded ? 'true' : 'false') : undefined"
    :aria-level="level"
    :data-node-key="node.key"
    :data-value="String(node.value)"
    :style="rowStyle"
    @click.stop="onClick"
    @mouseenter="onHover"
    @mousedown.prevent
  >
    <!-- Expand / collapse switch (inline SVG, no emoji per AGENTS.md) -->
    <button
      v-if="hasChildren"
      type="button"
      class="sn-tree-select-node__switch"
      :class="{ 'sn-tree-select-node__switch--expanded': expanded }"
      :aria-label="expanded ? `Collapse ${node.label}` : `Expand ${node.label}`"
      :tabindex="-1"
      @click.stop="onSwitchClick"
      @mousedown.prevent
    >
      <svg
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m9 6 6 6-6 6" />
      </svg>
    </button>
    <span v-else class="sn-tree-select-node__switch-placeholder" aria-hidden="true" />

    <!-- Multiple: independent check mark (no cascade) -->
    <span
      v-if="isMultiple"
      class="sn-tree-select-node__check"
      :class="{ 'sn-tree-select-node__check--checked': selected }"
      aria-hidden="true"
    >
      <svg
        v-if="selected"
        viewBox="0 0 24 24"
        width="10"
        height="10"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m5 13 4 4 10-10" />
      </svg>
    </span>

    <span class="sn-tree-select-node__label">{{ node.label }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * SnTreeNode — one row inside the SnTreeSelect dropdown tree (internal).
 *
 * Rendered by SnTreeSelect through provide/inject (the same pattern
 * SnOption uses for SnSelect). Owns nothing: selected / pending /
 * expanded / disabled all come from the injected context; clicks bubble
 * up through it. Not exported from the package entry — SnTreeSelect is
 * the public surface.
 *
 * a11y: role=treeitem + aria-selected + aria-expanded + aria-level; the
 * parent menu carries role=tree.
 */
import { computed, inject } from 'vue'
import { SN_TREE_SELECT_MENU_KEY, type SnTreeSelectNode } from './sn-tree-select-types'

defineOptions({ name: 'SnTreeNode' })

const props = defineProps<{
  /** Normalized node descriptor (from SnTreeSelect's tree walk). */
  node: SnTreeSelectNode
}>()

const menu = inject(SN_TREE_SELECT_MENU_KEY, null)

/** Normalized children list (undefined for leaves). */
const children = computed<SnTreeSelectNode[] | undefined>(() => props.node.children)

const hasChildren = computed<boolean>(() =>
  children.value !== undefined && children.value.length > 0,
)

const selected = computed<boolean>(() => menu?.isNodeSelected(props.node.value) ?? false)
const pending = computed<boolean>(() => menu?.pendingKey.value === props.node.key)
const expanded = computed<boolean>(() => menu?.isNodeExpanded(props.node) ?? false)
const disabled = computed<boolean>(() =>
  props.node.disabled || (menu?.menuDisabled.value ?? false),
)
const size = computed(() => menu?.menuSize.value ?? 'medium')
/** Multiple mode is set once by the parent (prop-driven, never hot-swapped). */
const isMultiple = computed<boolean>(() => menu?.isMultiple ?? false)
const level = computed<number>(() => props.node.depth + 1)

const rowId = computed<string>(() => menu?.nodeId(props.node) ?? '')

/** Indent by depth — one unit per tree level (root = 0), driven by CSS. */
const rowStyle = computed<Record<string, string>>(() => ({
  '--sn-web-tree-select-node-depth': String(props.node.depth),
}))

function onClick(): void {
  if (disabled.value) return
  menu?.setPending(props.node.key)
  menu?.chooseNode(props.node.value)
}

function onSwitchClick(): void {
  if (props.node.disabled || (menu?.menuDisabled.value ?? false)) return
  menu?.toggleExpand(props.node)
}

function onHover(): void {
  if (disabled.value) return
  menu?.setPending(props.node.key)
}
</script>

<style scoped>
.sn-tree-select-node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: var(--sn-web-tree-select-option-height, 34px);
  box-sizing: border-box;
  font-family: inherit;
  font-size: var(--sn-web-tree-select-option-font-size, 14px);
  line-height: 1.4;
  color: var(--sn-web-tree-select-option-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  white-space: nowrap;
  /* Base horizontal padding; depth indent comes from the per-row CSS var. */
  padding-left: calc(
    var(--sn-web-tree-select-option-padding-x, 10px)
    + var(--sn-web-tree-select-node-depth, 0) * var(--sn-web-tree-select-indent, 18px)
  );
  padding-right: var(--sn-web-tree-select-option-padding-x, 10px);
}

/* Pending (keyboard / hover highlight) — soft fill, no border change. */
.sn-tree-select-node--pending {
  background-color: var(
    --sn-web-tree-select-option-bg-hover,
    var(--sn-web-color-background-surface-hover)
  );
}

/* Selected row — primary-tinted fill + text accent. The leading accent bar
 * doubles as the naive-style check affordance without an icon glyph. */
.sn-tree-select-node--selected {
  background-color: var(
    --sn-web-tree-select-option-bg-selected,
    var(--sn-web-color-action-primary-soft)
  );
  color: var(
    --sn-web-tree-select-option-text-color-selected,
    var(--sn-web-color-action-primary)
  );
  font-weight: 500;
}

.sn-tree-select-node--selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: var(--sn-web-tree-select-option-selected-bar-width, 3px);
  border-radius: var(--sn-web-tree-select-radius, 6px);
  background-color: var(
    --sn-web-tree-select-option-selected-bar-color,
    var(--sn-web-color-action-primary)
  );
}

.sn-tree-select-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sn-tree-select-node--disabled {
  cursor: not-allowed;
  color: var(
    --sn-web-tree-select-option-text-color-disabled,
    var(--sn-web-color-text-disabled)
  );
  background-color: transparent;
}

.sn-tree-select-node--disabled.sn-tree-select-node--selected {
  background-color: var(
    --sn-web-tree-select-option-bg-selected-disabled,
    var(--sn-web-color-background-soft)
  );
  color: var(
    --sn-web-tree-select-option-text-color-disabled,
    var(--sn-web-color-text-disabled)
  );
}

/* Pending outline for keyboard focus visibility inside the menu. */
.sn-tree-select-node--pending:focus-visible {
  outline: 2px solid var(--sn-web-tree-select-option-focus-outline, var(--sn-web-color-action-primary));
  outline-offset: -2px;
}

/* Expand / collapse switch */
.sn-tree-select-node__switch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-tree-select-radius, 6px);
  background: transparent;
  color: var(--sn-web-tree-select-switch-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
  transition: transform 0.16s ease-out, color 0.15s ease-out, background-color 0.15s ease-out;
}

.sn-tree-select-node__switch:hover {
  color: var(--sn-web-tree-select-switch-color-hover, var(--sn-web-color-text-primary));
  background-color: var(
    --sn-web-tree-select-switch-bg-hover,
    var(--sn-web-color-background-surface-hover)
  );
}

/* Expanded chevron points down; collapsed points right. */
.sn-tree-select-node__switch svg {
  transform: rotate(0deg);
  transition: transform 0.16s ease-out;
}

.sn-tree-select-node__switch--expanded svg {
  transform: rotate(90deg);
}

/* Leaf alignment placeholder — keeps labels on one grid with parents. */
.sn-tree-select-node__switch-placeholder {
  display: inline-flex;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

/* Independent (non-cascading) multiple check mark */
.sn-tree-select-node__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  margin-right: 2px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-tree-select-check-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-tree-select-check-radius, 4px);
  background-color: var(--sn-web-tree-select-check-bg, transparent);
  color: var(--sn-web-tree-select-check-mark-color, var(--sn-web-color-background-surface));
  transition: border-color 0.15s ease-out, background-color 0.15s ease-out;
}

.sn-tree-select-node__check--checked {
  border-color: var(--sn-web-tree-select-check-border-color-checked, var(--sn-web-color-action-primary));
  background-color: var(--sn-web-tree-select-check-bg-checked, var(--sn-web-color-action-primary));
}

/* Size presets — shrink row height / font as the trigger shrinks. */
.sn-tree-select-node--mini { min-height: var(--sn-web-tree-select-option-height, 26px); font-size: 11px; }
.sn-tree-select-node--tiny { min-height: var(--sn-web-tree-select-option-height, 28px); font-size: 12px; }
.sn-tree-select-node--small { min-height: var(--sn-web-tree-select-option-height, 30px); font-size: 13px; }
.sn-tree-select-node--medium { min-height: var(--sn-web-tree-select-option-height, 34px); font-size: 14px; }
.sn-tree-select-node--large { min-height: var(--sn-web-tree-select-option-height, 40px); font-size: 15px; }
</style>
