<script setup lang="ts">
/**
 * SnTree — web-end hierarchical tree (AUI-WEB-DD-021).
 *
 * Reference library: naive-ui `n-tree`
 *   (https://www.naiveui.com/zh-CN/light/components/tree)
 * Per AGENTS.md §112, props + semantics mirror n-tree 1:1 (scoped subset):
 *   data / key-field / label-field / children-field / default-expanded-keys /
 *   expanded-keys (v-model:expanded-keys) / default-expand-all / selectable /
 *   selected-keys (v-model:selected-keys) / default-selected-keys / multiple /
 *   cancelable / checkable / checked-keys (v-model:checked-keys) /
 *   default-checked-keys / cascade / block-line / indent / render-prefix /
 *   render-suffix. TreeOption fields: key / label / children / disabled /
 *   isLeaf / prefix / suffix / checkboxDisabled. Events emit
 *   `(keys, options, { node, action })` payloads like n-tree's `on-update:*`.
 *
 * Documented divergences (not §112 violations):
 *   - The task-scoped subset only. Deferred (future markers, not in the
 *     API tables): draggable + drag events, virtual-scroll, keyboard
 *     navigation, check-strategy (fixed to `all`), on-load async children,
 *     accordion, block-node, ellipsis, expand-on-click, filter/pattern,
 *     node-props, render-label, render-switcher-icon, show-line,
 *     checkbox-placement, override-default-node-click-behavior,
 *     scrollbar-props, controlled indeterminate-keys, watch-props, and the
 *     `scrollTo` / `getCheckedData` / `getIndeterminateData` methods.
 *   - Expand/collapse renders without the motion animation (direct show/hide).
 *   - Nodes missing `key` get a deterministic `__sn_auto__…` key instead of
 *     failing.
 *   - Disabled nodes block every interaction (naive-ui still allows expanding
 *     a disabled node's switcher).
 *   - The empty state is a plain text row (customizable via the `empty`
 *     slot), not the `n-empty` sub-component.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTree :data="data" default-expanded-keys="['a']" />
 *   <SnTree :data="data" checkable cascade v-model:checked-keys="checked" />
 *   <SnTree :data="data" multiple v-model:selected-keys="selected" />
 */

import { computed, ref } from 'vue'
import type { VNodeChild } from 'vue'
import type {
  SnTreeCheckAction,
  SnTreeExpandAction,
  SnTreeKey,
  SnTreeNormalizedData,
  SnTreeOption,
  SnTreeRenderSidePart,
  SnTreeSelectAction,
  SnTreeNode,
} from './sn-tree-types'

defineOptions({ name: 'SnTree' })

const props = withDefaults(
  defineProps<{
    /** Tree node data. Mirrors n-tree `data`. */
    data?: SnTreeOption[]
    /** Field name of the node key. Mirrors n-tree `key-field`. */
    keyField?: string
    /** Field name of the node label. Mirrors n-tree `label-field`. */
    labelField?: string
    /** Field name of the child list. Mirrors n-tree `children-field`. */
    childrenField?: string
    /** Uncontrolled initially expanded keys. Mirrors n-tree `default-expanded-keys`. */
    defaultExpandedKeys?: SnTreeKey[]
    /** Controlled expanded keys — `undefined` keeps it uncontrolled. Mirrors n-tree `expanded-keys`. */
    expandedKeys?: SnTreeKey[] | undefined
    /** Expand every non-leaf node initially. Mirrors n-tree `default-expand-all`. */
    defaultExpandAll?: boolean
    /** Allow selecting nodes by click. Mirrors n-tree `selectable`. */
    selectable?: boolean
    /** Controlled selected keys — `undefined` keeps it uncontrolled. Mirrors n-tree `selected-keys`. */
    selectedKeys?: SnTreeKey[] | undefined
    /** Uncontrolled initially selected keys. Mirrors n-tree `default-selected-keys`. */
    defaultSelectedKeys?: SnTreeKey[]
    /** Allow multiple selected nodes. Mirrors n-tree `multiple`. */
    multiple?: boolean
    /** Clicking a selected node deselects it. Mirrors n-tree `cancelable`. */
    cancelable?: boolean
    /** Render a checkbox per node. Mirrors n-tree `checkable`. */
    checkable?: boolean
    /** Controlled checked keys — `undefined` keeps it uncontrolled. Mirrors n-tree `checked-keys`. */
    checkedKeys?: SnTreeKey[] | undefined
    /** Uncontrolled initially checked keys. Mirrors n-tree `default-checked-keys`. */
    defaultCheckedKeys?: SnTreeKey[]
    /** Checkboxes cascade to children; parents show indeterminate state. Mirrors n-tree `cascade`. */
    cascade?: boolean
    /** Hover/selected background spans the whole node row. Mirrors n-tree `block-line`. */
    blockLine?: boolean
    /** Per-level indent width in px. Mirrors n-tree `indent`. */
    indent?: number
    /** Node prefix render fn. Mirrors n-tree `render-prefix`. */
    renderPrefix?: SnTreeRenderSidePart | undefined
    /** Node suffix render fn. Mirrors n-tree `render-suffix`. */
    renderSuffix?: SnTreeRenderSidePart | undefined
  }>(),
  {
    data: () => [],
    keyField: 'key',
    labelField: 'label',
    childrenField: 'children',
    defaultExpandedKeys: () => [],
    expandedKeys: undefined,
    defaultExpandAll: false,
    selectable: true,
    selectedKeys: undefined,
    defaultSelectedKeys: () => [],
    multiple: false,
    cancelable: true,
    checkable: false,
    checkedKeys: undefined,
    defaultCheckedKeys: () => [],
    cascade: false,
    blockLine: false,
    indent: 24,
    renderPrefix: undefined,
    renderSuffix: undefined,
  },
)

const emit = defineEmits<{
  /** Expansion changed — mirrors n-tree `on-update:expanded-keys`. */
  (
    e: 'update:expandedKeys',
    keys: SnTreeKey[],
    options: Array<SnTreeOption | null>,
    meta: { node: SnTreeOption | null, action: SnTreeExpandAction },
  ): void
  /** Selection changed — mirrors n-tree `on-update:selected-keys`. */
  (
    e: 'update:selectedKeys',
    keys: SnTreeKey[],
    options: Array<SnTreeOption | null>,
    meta: { node: SnTreeOption | null, action: SnTreeSelectAction },
  ): void
  /** Checking changed — mirrors n-tree `on-update:checked-keys`. */
  (
    e: 'update:checkedKeys',
    keys: SnTreeKey[],
    options: Array<SnTreeOption | null>,
    meta: { node: SnTreeOption | null, action: SnTreeCheckAction },
  ): void
}>()

defineSlots<{
  /** Rendered when `data` produces no rows. */
  empty?(): unknown
}>()

/** Prefix for auto-generated keys on nodes missing the key field. */
const AUTO_KEY_PREFIX = '__sn_auto__'

function childrenOf(option: SnTreeOption): SnTreeOption[] {
  const raw = option[props.childrenField]
  return Array.isArray(raw) ? (raw as SnTreeOption[]) : []
}

/** Flatten `data` into nodeMap + rootKeys + per-node descendants. */
const normalized = computed<SnTreeNormalizedData>(() => {
  const nodeMap = new Map<SnTreeKey, SnTreeNode>()
  const rootKeys: SnTreeKey[] = []
  const walk = (
    options: SnTreeOption[],
    level: number,
    parentKey: SnTreeKey | null,
    parentPath: string,
  ): void => {
    options.forEach((option, index) => {
      const rawKey: unknown = option[props.keyField]
      const ownPath = `${parentPath}/${index}`
      const key: SnTreeKey
        = typeof rawKey === 'string' || typeof rawKey === 'number'
          ? rawKey
          : `${AUTO_KEY_PREFIX}${ownPath}`
      const rawLabel: unknown = option[props.labelField]
      const childOptions = childrenOf(option)
      const node: SnTreeNode = {
        key,
        option,
        label: typeof rawLabel === 'string' ? rawLabel : String(rawLabel ?? ''),
        level,
        parentKey,
        childKeys: [],
        isLeaf: option.isLeaf === true || childOptions.length === 0,
        disabled: option.disabled === true,
        checkboxDisabled: option.checkboxDisabled === true,
      }
      nodeMap.set(key, node)
      if (parentKey === null) {
        rootKeys.push(key)
      }
      else {
        nodeMap.get(parentKey)?.childKeys.push(key)
      }
      walk(childOptions, level + 1, key, ownPath)
    })
  }
  walk(props.data, 0, null, '')

  const descendants = new Map<SnTreeKey, SnTreeKey[]>()
  for (const [key, node] of nodeMap) {
    const acc: SnTreeKey[] = []
    const stack: SnTreeKey[] = [...node.childKeys]
    while (stack.length > 0) {
      const current = stack.pop()
      if (current === undefined) break
      acc.push(current)
      const childKeys = nodeMap.get(current)?.childKeys
      if (childKeys !== undefined) stack.push(...childKeys)
    }
    descendants.set(key, acc)
  }
  return { nodeMap, rootKeys, descendants }
})

function allNonLeafKeys(): SnTreeKey[] {
  const keys: SnTreeKey[] = []
  for (const [key, node] of normalized.value.nodeMap) {
    if (!node.isLeaf) keys.push(key)
  }
  return keys
}

const uncontrolledExpandedKeys = ref<Set<SnTreeKey>>(
  props.defaultExpandAll
    ? new Set(allNonLeafKeys())
    : new Set(props.defaultExpandedKeys),
)
const uncontrolledSelectedKeys = ref<Set<SnTreeKey>>(
  new Set(props.defaultSelectedKeys),
)
const uncontrolledCheckedKeys = ref<Set<SnTreeKey>>(
  expandForCascade(new Set(props.defaultCheckedKeys)),
)

/** Expand a key set with each key's descendants (cascade normalization). */
function expandForCascade(source: Set<SnTreeKey>): Set<SnTreeKey> {
  if (!props.cascade) return source
  const expandedInput = new Set(source)
  for (const key of source) {
    for (const descendant of normalized.value.descendants.get(key) ?? []) {
      expandedInput.add(descendant)
    }
  }
  return expandedInput
}

/** Resolved indent width — `exactOptionalPropertyTypes` keeps the optional
 * prop `number | undefined` in type space, so the default is re-applied here. */
const indentWidth = computed(() => props.indent ?? 24)

const expandedSet = computed<Set<SnTreeKey>>(() =>
  props.expandedKeys === undefined
    ? uncontrolledExpandedKeys.value
    : new Set(props.expandedKeys),
)

const selectedSet = computed<Set<SnTreeKey>>(() =>
  props.selectedKeys === undefined
    ? uncontrolledSelectedKeys.value
    : new Set(props.selectedKeys),
)

/**
 * Raw checked keys. The uncontrolled set is stored in "expanded" form
 * (checking a parent writes every descendant). Controlled input is
 * normalized here: under `cascade` a parent key in `checked-keys` implies
 * its whole subtree, mirroring treemate behavior.
 */
const checkedSet = computed<Set<SnTreeKey>>(() => {
  if (props.checkedKeys === undefined) return uncontrolledCheckedKeys.value
  return expandForCascade(new Set(props.checkedKeys))
})

/** Keys that a cascade check/uncheck on `key` touches (skips disabled). */
function checkableTargets(key: SnTreeKey): SnTreeKey[] {
  const { nodeMap, descendants } = normalized.value
  if (!nodeMap.has(key)) return []
  const all: SnTreeKey[] = [key, ...(descendants.get(key) ?? [])]
  return all.filter((target) => {
    const node = nodeMap.get(target)
    return node !== undefined && !node.disabled && !node.checkboxDisabled
  })
}

function resolveCheckedState(
  node: SnTreeNode,
  checked: Set<SnTreeKey>,
): { checked: boolean, indeterminate: boolean } {
  if (!props.checkable) return { checked: false, indeterminate: false }
  if (!props.cascade) return { checked: checked.has(node.key), indeterminate: false }
  const targets = checkableTargets(node.key)
  if (targets.length > 0 && targets.every(target => checked.has(target))) {
    return { checked: true, indeterminate: false }
  }
  return { checked: false, indeterminate: targets.some(target => checked.has(target)) }
}

function keysToOptions(keys: SnTreeKey[]): Array<SnTreeOption | null> {
  const { nodeMap } = normalized.value
  return keys.map(key => nodeMap.get(key)?.option ?? null)
}

function resolveSidePart(
  part: string | (() => VNodeChild) | undefined,
): VNodeChild {
  if (typeof part === 'function') return part()
  if (typeof part === 'string') return part
  return null
}

/** One visible row per currently rendered node (depth-first). */
interface SnTreeRow {
  node: SnTreeNode
  nonLeaf: boolean
  expanded: boolean
  selected: boolean
  checked: boolean
  indeterminate: boolean
  checkboxDisabled: boolean
  prefixNode: VNodeChild
  suffixNode: VNodeChild
}

const rows = computed<SnTreeRow[]>(() => {
  const { nodeMap, rootKeys } = normalized.value
  const expandedKeysSet = expandedSet.value
  const selectedKeysSet = selectedSet.value
  const checkedKeysSet = checkedSet.value
  const result: SnTreeRow[] = []
  const visit = (keys: SnTreeKey[]): void => {
    for (const key of keys) {
      const node = nodeMap.get(key)
      if (node === undefined) continue
      const isExpanded = !node.isLeaf && expandedKeysSet.has(key)
      const checkedState = resolveCheckedState(node, checkedKeysSet)
      const isSelected = selectedKeysSet.has(key)
      const info = {
        option: node.option,
        checked: checkedState.checked,
        selected: isSelected,
      }
      result.push({
        node,
        nonLeaf: !node.isLeaf,
        expanded: isExpanded,
        selected: isSelected,
        checked: checkedState.checked,
        indeterminate: checkedState.indeterminate,
        checkboxDisabled: node.checkboxDisabled,
        prefixNode: props.renderPrefix
          ? props.renderPrefix(info)
          : resolveSidePart(node.option.prefix),
        suffixNode: props.renderSuffix
          ? props.renderSuffix(info)
          : resolveSidePart(node.option.suffix),
      })
      if (isExpanded) visit(node.childKeys)
    }
  }
  visit(rootKeys)
  return result
})

function handleSwitcherClick(row: SnTreeRow): void {
  const node = row.node
  if (!row.nonLeaf || node.disabled) return
  const wasExpanded = expandedSet.value.has(node.key)
  const next = new Set(expandedSet.value)
  const action: SnTreeExpandAction = wasExpanded ? 'collapse' : 'expand'
  if (wasExpanded) next.delete(node.key)
  else next.add(node.key)
  if (props.expandedKeys === undefined) uncontrolledExpandedKeys.value = next
  emit('update:expandedKeys', [...next], keysToOptions([...next]), {
    node: node.option,
    action,
  })
}

function handleNodeClick(row: SnTreeRow): void {
  if (!props.selectable) return
  const node = row.node
  if (node.disabled) return
  const wasSelected = selectedSet.value.has(node.key)
  const next = new Set(selectedSet.value)
  let action: SnTreeSelectAction
  if (props.multiple) {
    if (wasSelected) {
      next.delete(node.key)
      action = 'unselect'
    }
    else {
      next.add(node.key)
      action = 'select'
    }
  }
  else {
    if (wasSelected && props.cancelable) {
      next.delete(node.key)
      action = 'unselect'
    }
    else {
      next.clear()
      next.add(node.key)
      action = 'select'
    }
  }
  if (props.selectedKeys === undefined) uncontrolledSelectedKeys.value = next
  emit('update:selectedKeys', [...next], keysToOptions([...next]), {
    node: node.option,
    action,
  })
}

function handleCheckboxClick(row: SnTreeRow): void {
  if (!props.checkable) return
  const node = row.node
  if (node.disabled || node.checkboxDisabled) return
  const nextChecked = !row.checked
  const mutated = new Set(checkedSet.value)
  const targets = props.cascade ? checkableTargets(node.key) : [node.key]
  for (const target of targets) {
    if (nextChecked) mutated.add(target)
    else mutated.delete(target)
  }
  if (props.checkedKeys === undefined) uncontrolledCheckedKeys.value = mutated
  const displayed: SnTreeKey[] = props.cascade
    ? displayedCascadeCheckedKeys(mutated)
    : [...mutated]
  emit('update:checkedKeys', displayed, keysToOptions(displayed), {
    node: node.option,
    action: nextChecked ? 'check' : 'uncheck',
  })
}

/** Keys whose cascade targets are all checked (emitted shape). */
function displayedCascadeCheckedKeys(raw: Set<SnTreeKey>): SnTreeKey[] {
  const { nodeMap } = normalized.value
  const out: SnTreeKey[] = []
  for (const [key] of nodeMap) {
    const targets = checkableTargets(key)
    if (targets.length > 0 && targets.every(target => raw.has(target))) {
      out.push(key)
    }
  }
  return out
}
</script>

<template>
  <div
    data-snui-component="tree"
    class="sn-tree"
    :class="{ 'sn-tree--block-line': blockLine }"
    role="tree"
  >
    <div
      v-for="row in rows"
      :key="row.node.key"
      class="sn-tree__node-wrapper"
    >
      <div
        class="sn-tree__node"
        :class="[
          {
            'sn-tree__node--selected': row.selected,
            'sn-tree__node--disabled': row.node.disabled,
            'sn-tree__node--selectable': selectable && !row.node.disabled,
          },
        ]"
        role="treeitem"
        :aria-selected="selectable ? row.selected : undefined"
        :aria-expanded="row.nonLeaf ? row.expanded : undefined"
        :aria-disabled="row.node.disabled || undefined"
      >
        <span
          class="sn-tree__indent"
          :style="{ width: `${row.node.level * indentWidth}px` }"
          aria-hidden="true"
        />
        <span
          class="sn-tree__switcher"
          :class="{
            'sn-tree__switcher--expanded': row.expanded,
            'sn-tree__switcher--hide': !row.nonLeaf,
          }"
          :style="{ width: `${indentWidth}px` }"
          role="button"
          tabindex="-1"
          :aria-expanded="row.nonLeaf ? row.expanded : undefined"
          :aria-label="row.expanded ? '收起' : '展开'"
          @click.stop="handleSwitcherClick(row)"
        >
          <svg
            class="sn-tree__switcher-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </span>
        <span
          v-if="checkable"
          class="sn-tree__checkbox"
          :class="{
            'sn-tree__checkbox--checked': row.checked,
            'sn-tree__checkbox--indeterminate': row.indeterminate,
            'sn-tree__checkbox--disabled': row.node.disabled || row.checkboxDisabled,
          }"
          :style="{ width: `${indentWidth}px` }"
          role="checkbox"
          :aria-checked="row.indeterminate ? 'mixed' : row.checked ? 'true' : 'false'"
          :aria-disabled="(row.node.disabled || row.checkboxDisabled) || undefined"
          @click.stop="handleCheckboxClick(row)"
        >
          <svg class="sn-tree__checkbox-box" viewBox="0 0 14 14" aria-hidden="true">
            <rect
              class="sn-tree__checkbox-frame"
              x="1"
              y="1"
              width="12"
              height="12"
              rx="2"
            />
            <path class="sn-tree__checkbox-check" d="M3.2 7.3 5.9 10 10.8 4.5" />
            <path class="sn-tree__checkbox-dash" d="M3.5 7H10.5" />
          </svg>
        </span>
        <div
          class="sn-tree__node-content"
          :class="{
            'sn-tree__node-content--selected': row.selected,
          }"
          @click="handleNodeClick(row)"
        >
          <span v-if="row.prefixNode != null" class="sn-tree__node-prefix">
            {{ row.prefixNode }}
          </span>
          <span class="sn-tree__node-text">{{ row.node.label }}</span>
          <span v-if="row.suffixNode != null" class="sn-tree__node-suffix">
            {{ row.suffixNode }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="rows.length === 0" class="sn-tree__empty">
      <slot name="empty">无数据</slot>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

/* Metrics mirror n-tree: 14px text, 24px node content, 3px row padding,
 * 3px radius, 24px default indent. */
.sn-tree {
  font-size: 14px;
  line-height: 1.5;
  color: var(--sn-web-color-text-primary);
  outline: none;
}

.sn-tree__node-wrapper {
  box-sizing: border-box;
  padding: 3px 0;
}

.sn-tree__node {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 3px;
}

.sn-tree__indent {
  flex-grow: 0;
  flex-shrink: 0;
  height: 0;
}

/* ---------- Switcher ---------- */

.sn-tree__switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 24px;
  color: var(--sn-web-color-text-tertiary);
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease;
}

.sn-tree__switcher--expanded {
  transform: rotate(90deg);
}

.sn-tree__switcher--hide {
  visibility: hidden;
}

.sn-tree__switcher-icon {
  display: block;
  width: 14px;
  height: 14px;
}

/* ---------- Checkbox (visuals mirror n-checkbox) ---------- */

.sn-tree__checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 24px;
  cursor: pointer;
  user-select: none;
}

.sn-tree__checkbox-box {
  display: block;
  width: 14px;
  height: 14px;
}

.sn-tree__checkbox-frame {
  fill: transparent;
  stroke: var(--sn-web-color-border-default);
  transition: fill 0.15s ease, stroke 0.15s ease;
}

.sn-tree__checkbox-check,
.sn-tree__checkbox-dash {
  fill: none;
  stroke: var(--sn-web-color-text-on-primary);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  visibility: hidden;
}

.sn-tree__checkbox--checked .sn-tree__checkbox-frame,
.sn-tree__checkbox--indeterminate .sn-tree__checkbox-frame {
  fill: var(--sn-web-color-action-primary);
  stroke: var(--sn-web-color-action-primary);
}

.sn-tree__checkbox--checked .sn-tree__checkbox-check {
  visibility: visible;
}

.sn-tree__checkbox--indeterminate .sn-tree__checkbox-dash {
  visibility: visible;
}

.sn-tree__checkbox:hover:not(.sn-tree__checkbox--disabled):not(.sn-tree__checkbox--checked):not(.sn-tree__checkbox--indeterminate) .sn-tree__checkbox-frame {
  stroke: var(--sn-web-color-action-primary);
}

.sn-tree__checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ---------- Node content ---------- */

.sn-tree__node-content {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  min-height: 24px;
  box-sizing: border-box;
  padding: 0 6px 0 4px;
  border-radius: 3px;
  user-select: none;
  transition: background-color 0.3s, color 0.3s;
}

.sn-tree__node--selectable .sn-tree__node-content {
  cursor: pointer;
}

.sn-tree__node--disabled .sn-tree__node-content {
  color: var(--sn-web-color-text-disabled);
  cursor: not-allowed;
}

.sn-tree__node-prefix {
  display: inline-flex;
  margin-right: 8px;
}

.sn-tree__node-text {
  flex-grow: 1;
  max-width: 100%;
}

.sn-tree__node-suffix {
  display: inline-flex;
}

/* Hover / pressed / selected — default: backgrounds on the content part. */

.sn-tree:not(.sn-tree--block-line) .sn-tree__node:not(.sn-tree__node--disabled) .sn-tree__node-content:hover {
  background: var(--sn-web-color-background-subtle);
}

.sn-tree:not(.sn-tree--block-line) .sn-tree__node--selectable .sn-tree__node-content:active {
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 8%, transparent);
}

.sn-tree:not(.sn-tree--block-line) .sn-tree__node-content--selected {
  background: color-mix(
    in srgb,
    var(--sn-web-color-action-primary) 10%,
    transparent
  );
}

/* Hover / pressed / selected — block-line: backgrounds on the whole row. */

.sn-tree--block-line .sn-tree__node:not(.sn-tree__node--disabled):hover {
  background: var(--sn-web-color-background-subtle);
}

.sn-tree--block-line .sn-tree__node--selectable:not(.sn-tree__node--selected):active {
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 8%, transparent);
}

.sn-tree--block-line .sn-tree__node--selected {
  background: color-mix(
    in srgb,
    var(--sn-web-color-action-primary) 10%,
    transparent
  );
}

/* ---------- Empty state ---------- */

.sn-tree__empty {
  padding: 24px 0;
  color: var(--sn-web-color-text-tertiary);
  text-align: center;
}
</style>
