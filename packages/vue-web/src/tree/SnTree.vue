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
 *   render-suffix / show-line / draggable / allow-drop. AUI additive:
 *   `line-style` ('solid' | 'dashed') selects the connector stroke,
 *   `line-corner` ('square' | 'rounded') selects the elbow shape and
 *   `line-color` overrides the stroke color (resolved by the shared flat-row
 *   layout in `_internal/tree-line-layout.ts`); `line-mode` picks the L-shaped
 *   branches or indent guides.
 *   TreeOption fields: key / label / children / disabled / isLeaf / icon /
 *   prefix / suffix / checkboxDisabled. Events emit
 *   `(keys, options, { node, action })` payloads like n-tree's `on-update:*`;
 *   drag & drop emits `dragStart` / `dragEnter` / `dragLeave` / `dragEnd` /
 *   `drop`.
 *
 * Documented divergences (not §112 violations):
 *   - The task-scoped subset only. Deferred (future markers, not in the
 *     API tables): virtual-scroll, keyboard
 *     navigation, check-strategy (fixed to `all`), on-load async children,
 *     accordion, block-node, ellipsis, expand-on-click, filter/pattern,
 *     node-props, render-label, render-switcher-icon,
 *     checkbox-placement, override-default-node-click-behavior,
 *     scrollbar-props, controlled indeterminate-keys, watch-props, and the
 *     `scrollTo` / `getCheckedData` / `getIndeterminateData` methods.
 *   - Drag & drop is a single-level model: no drag-left-to-reparent offset
 *     levels and no auto-expand on dragenter yet.
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

import { computed, ref } from 'vue';
import { useLocale } from '../locales/use-locale';
import { resolveTreeLineLayout } from '../_internal/tree-line-layout';
import { resolveTreeIcon, SnTreePart } from '../_internal/tree-node-parts';
import type { VNodeChild } from 'vue';
import type { SnTreeLineLayout } from '../_internal/tree-line-layout';
import type {
  SnTreeAllowDrop,
  SnTreeCheckAction,
  SnTreeDragInfo,
  SnTreeDropInfo,
  SnTreeDropPosition,
  SnTreeExpandAction,
  SnTreeKey,
  SnTreeLineCorner,
  SnTreeLineMode,
  SnTreeLineStyle,
  SnTreeNormalizedData,
  SnTreeOption,
  SnTreeRenderSidePart,
  SnTreeSelectAction,
  SnTreeNode,
} from './sn-tree-types';

defineOptions({ name: 'SnTree' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

const props = withDefaults(
  defineProps<{
    /** Tree node data. Mirrors n-tree `data`. */
    data?: SnTreeOption[];
    /** Field name of the node key. Mirrors n-tree `key-field`. */
    keyField?: string;
    /** Field name of the node label. Mirrors n-tree `label-field`. */
    labelField?: string;
    /** Field name of the child list. Mirrors n-tree `children-field`. */
    childrenField?: string;
    /** Uncontrolled initially expanded keys. Mirrors n-tree `default-expanded-keys`. */
    defaultExpandedKeys?: SnTreeKey[];
    /** Controlled expanded keys — `undefined` keeps it uncontrolled. Mirrors n-tree `expanded-keys`. */
    expandedKeys?: SnTreeKey[] | undefined;
    /** Expand every non-leaf node initially. Mirrors n-tree `default-expand-all`. */
    defaultExpandAll?: boolean;
    /** Allow selecting nodes by click. Mirrors n-tree `selectable`. */
    selectable?: boolean;
    /** Controlled selected keys — `undefined` keeps it uncontrolled. Mirrors n-tree `selected-keys`. */
    selectedKeys?: SnTreeKey[] | undefined;
    /** Uncontrolled initially selected keys. Mirrors n-tree `default-selected-keys`. */
    defaultSelectedKeys?: SnTreeKey[];
    /** Allow multiple selected nodes. Mirrors n-tree `multiple`. */
    multiple?: boolean;
    /** Clicking a selected node deselects it. Mirrors n-tree `cancelable`. */
    cancelable?: boolean;
    /** Render a checkbox per node. Mirrors n-tree `checkable`. */
    checkable?: boolean;
    /** Controlled checked keys — `undefined` keeps it uncontrolled. Mirrors n-tree `checked-keys`. */
    checkedKeys?: SnTreeKey[] | undefined;
    /** Uncontrolled initially checked keys. Mirrors n-tree `default-checked-keys`. */
    defaultCheckedKeys?: SnTreeKey[];
    /** Checkboxes cascade to children; parents show indeterminate state. Mirrors n-tree `cascade`. */
    cascade?: boolean;
    /** Hover/selected background spans the whole node row. Mirrors n-tree `block-line`. */
    blockLine?: boolean;
    /** Per-level indent width in px. Mirrors n-tree `indent`. */
    indent?: number;
    /** Node prefix render fn. Mirrors n-tree `render-prefix`. */
    renderPrefix?: SnTreeRenderSidePart | undefined;
    /** Node suffix render fn. Mirrors n-tree `render-suffix`. */
    renderSuffix?: SnTreeRenderSidePart | undefined;
    /** Draw connector lines between parent and child rows. */
    showLine?: boolean;
    /** Connector geometry: L-shaped branch lines (default) or indent guides. */
    lineMode?: SnTreeLineMode;
    /** Connector stroke style (solid by default). */
    lineStyle?: SnTreeLineStyle;
    /** Connector elbow shape: right-angle L (default) or rounded quarter-arc. */
    lineCorner?: SnTreeLineCorner;
    /** Any CSS color / token for connector lines; overrides the CSS var fallback. */
    lineColor?: string | undefined;
    /** Enable HTML5 drag & drop on rows. Mirrors n-tree `draggable`. */
    draggable?: boolean;
    /** Gate for drag & drop; mirrors n-tree `allow-drop`. */
    allowDrop?: SnTreeAllowDrop | undefined;
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
    showLine: false,
    lineMode: 'branch',
    lineStyle: 'solid',
    lineCorner: 'square',
    lineColor: undefined,
    draggable: false,
    allowDrop: undefined,
  },
);

/** Expose `lineColor` as the same token the CSS already reads, so a prop
 * value takes precedence without breaking host-level `var(...)` overrides. */
const lineVars = computed<Record<string, string>>(() =>
  props.lineColor ? { '--sn-web-tree-line-color': props.lineColor } : {},
);

const emit = defineEmits<{
  /** Expansion changed — mirrors n-tree `on-update:expanded-keys`. */
  (
    e: 'update:expandedKeys',
    keys: SnTreeKey[],
    options: Array<SnTreeOption | null>,
    meta: { node: SnTreeOption | null; action: SnTreeExpandAction },
  ): void;
  /** Selection changed — mirrors n-tree `on-update:selected-keys`. */
  (
    e: 'update:selectedKeys',
    keys: SnTreeKey[],
    options: Array<SnTreeOption | null>,
    meta: { node: SnTreeOption | null; action: SnTreeSelectAction },
  ): void;
  /** Checking changed — mirrors n-tree `on-update:checked-keys`. */
  (
    e: 'update:checkedKeys',
    keys: SnTreeKey[],
    options: Array<SnTreeOption | null>,
    meta: { node: SnTreeOption | null; action: SnTreeCheckAction },
  ): void;
  /** A row started being dragged — mirrors n-tree `on-dragstart`. */
  (e: 'dragStart', info: SnTreeDragInfo): void;
  /** A dragged row entered another row — mirrors n-tree `on-dragenter`. */
  (e: 'dragEnter', info: SnTreeDragInfo): void;
  /** A dragged row left another row — mirrors n-tree `on-dragleave`. */
  (e: 'dragLeave', info: SnTreeDragInfo): void;
  /** A drag ended (dropped or cancelled) — mirrors n-tree `on-dragend`. */
  (e: 'dragEnd', info: SnTreeDragInfo): void;
  /** A row was dropped on another row — mirrors n-tree `on-drop`. */
  (e: 'drop', info: SnTreeDropInfo): void;
}>();

defineSlots<{
  /** Rendered when `data` produces no rows. */
  empty?(): unknown;
}>();

/** Prefix for auto-generated keys on nodes missing the key field. */
const AUTO_KEY_PREFIX = '__sn_auto__';

function childrenOf(option: SnTreeOption): SnTreeOption[] {
  const raw = option[props.childrenField];
  return Array.isArray(raw) ? (raw as SnTreeOption[]) : [];
}

/** Flatten `data` into nodeMap + rootKeys + per-node descendants. */
const normalized = computed<SnTreeNormalizedData>(() => {
  const nodeMap = new Map<SnTreeKey, SnTreeNode>();
  const rootKeys: SnTreeKey[] = [];
  const walk = (
    options: SnTreeOption[],
    level: number,
    parentKey: SnTreeKey | null,
    parentPath: string,
  ): void => {
    options.forEach((option, index) => {
      const rawKey: unknown = option[props.keyField];
      const ownPath = `${parentPath}/${index}`;
      const key: SnTreeKey =
        typeof rawKey === 'string' || typeof rawKey === 'number'
          ? rawKey
          : `${AUTO_KEY_PREFIX}${ownPath}`;
      const rawLabel: unknown = option[props.labelField];
      const childOptions = childrenOf(option);
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
      };
      nodeMap.set(key, node);
      if (parentKey === null) {
        rootKeys.push(key);
      } else {
        nodeMap.get(parentKey)?.childKeys.push(key);
      }
      walk(childOptions, level + 1, key, ownPath);
    });
  };
  walk(props.data, 0, null, '');

  const descendants = new Map<SnTreeKey, SnTreeKey[]>();
  for (const [key, node] of nodeMap) {
    const acc: SnTreeKey[] = [];
    const stack: SnTreeKey[] = [...node.childKeys];
    while (stack.length > 0) {
      const current = stack.pop();
      if (current === undefined) break;
      acc.push(current);
      const childKeys = nodeMap.get(current)?.childKeys;
      if (childKeys !== undefined) stack.push(...childKeys);
    }
    descendants.set(key, acc);
  }
  return { nodeMap, rootKeys, descendants };
});

function allNonLeafKeys(): SnTreeKey[] {
  const keys: SnTreeKey[] = [];
  for (const [key, node] of normalized.value.nodeMap) {
    if (!node.isLeaf) keys.push(key);
  }
  return keys;
}

const uncontrolledExpandedKeys = ref<Set<SnTreeKey>>(
  props.defaultExpandAll ? new Set(allNonLeafKeys()) : new Set(props.defaultExpandedKeys),
);
const uncontrolledSelectedKeys = ref<Set<SnTreeKey>>(new Set(props.defaultSelectedKeys));
const uncontrolledCheckedKeys = ref<Set<SnTreeKey>>(
  expandForCascade(new Set(props.defaultCheckedKeys)),
);

/** Expand a key set with each key's descendants (cascade normalization). */
function expandForCascade(source: Set<SnTreeKey>): Set<SnTreeKey> {
  if (!props.cascade) return source;
  const expandedInput = new Set(source);
  for (const key of source) {
    for (const descendant of normalized.value.descendants.get(key) ?? []) {
      expandedInput.add(descendant);
    }
  }
  return expandedInput;
}

/** Resolved indent width — `exactOptionalPropertyTypes` keeps the optional
 * prop `number | undefined` in type space, so the default is re-applied here. */
const indentWidth = computed(() => props.indent ?? 24);

const expandedSet = computed<Set<SnTreeKey>>(() =>
  props.expandedKeys === undefined ? uncontrolledExpandedKeys.value : new Set(props.expandedKeys),
);

const selectedSet = computed<Set<SnTreeKey>>(() =>
  props.selectedKeys === undefined ? uncontrolledSelectedKeys.value : new Set(props.selectedKeys),
);

/**
 * Raw checked keys. The uncontrolled set is stored in "expanded" form
 * (checking a parent writes every descendant). Controlled input is
 * normalized here: under `cascade` a parent key in `checked-keys` implies
 * its whole subtree, mirroring treemate behavior.
 */
const checkedSet = computed<Set<SnTreeKey>>(() => {
  if (props.checkedKeys === undefined) return uncontrolledCheckedKeys.value;
  return expandForCascade(new Set(props.checkedKeys));
});

/** Keys that a cascade check/uncheck on `key` touches (skips disabled). */
function checkableTargets(key: SnTreeKey): SnTreeKey[] {
  const { nodeMap, descendants } = normalized.value;
  if (!nodeMap.has(key)) return [];
  const all: SnTreeKey[] = [key, ...(descendants.get(key) ?? [])];
  return all.filter((target) => {
    const node = nodeMap.get(target);
    return node !== undefined && !node.disabled && !node.checkboxDisabled;
  });
}

function resolveCheckedState(
  node: SnTreeNode,
  checked: Set<SnTreeKey>,
): { checked: boolean; indeterminate: boolean } {
  if (!props.checkable) return { checked: false, indeterminate: false };
  if (!props.cascade) return { checked: checked.has(node.key), indeterminate: false };
  const targets = checkableTargets(node.key);
  if (targets.length > 0 && targets.every((target) => checked.has(target))) {
    return { checked: true, indeterminate: false };
  }
  return { checked: false, indeterminate: targets.some((target) => checked.has(target)) };
}

function keysToOptions(keys: SnTreeKey[]): Array<SnTreeOption | null> {
  const { nodeMap } = normalized.value;
  return keys.map((key) => nodeMap.get(key)?.option ?? null);
}

function resolveSidePart(part: string | (() => VNodeChild) | undefined): VNodeChild {
  if (typeof part === 'function') return part();
  if (typeof part === 'string') return part;
  return null;
}

/** One visible row per currently rendered node (depth-first). */
interface SnTreeRow {
  node: SnTreeNode;
  nonLeaf: boolean;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  indeterminate: boolean;
  checkboxDisabled: boolean;
  iconNode: VNodeChild;
  prefixNode: VNodeChild;
  suffixNode: VNodeChild;
  /** Connector lines for this row; `null` when `showLine` is off. */
  lines: SnTreeLineLayout | null;
}

const rows = computed<SnTreeRow[]>(() => {
  const { nodeMap, rootKeys } = normalized.value;
  const expandedKeysSet = expandedSet.value;
  const selectedKeysSet = selectedSet.value;
  const checkedKeysSet = checkedSet.value;
  const result: SnTreeRow[] = [];
  const visit = (keys: SnTreeKey[]): void => {
    for (const key of keys) {
      const node = nodeMap.get(key);
      if (node === undefined) continue;
      const isExpanded = !node.isLeaf && expandedKeysSet.has(key);
      const checkedState = resolveCheckedState(node, checkedKeysSet);
      const isSelected = selectedKeysSet.has(key);
      const info = {
        option: node.option,
        checked: checkedState.checked,
        selected: isSelected,
      };
      result.push({
        node,
        nonLeaf: !node.isLeaf,
        expanded: isExpanded,
        selected: isSelected,
        checked: checkedState.checked,
        indeterminate: checkedState.indeterminate,
        checkboxDisabled: node.checkboxDisabled,
        iconNode: resolveTreeIcon(node.option.icon),
        prefixNode: props.renderPrefix
          ? props.renderPrefix(info)
          : resolveSidePart(node.option.prefix),
        suffixNode: props.renderSuffix
          ? props.renderSuffix(info)
          : resolveSidePart(node.option.suffix),
        lines: null,
      });
      if (isExpanded) visit(node.childKeys);
    }
  };
  visit(rootKeys);

  // The flat visible-row depths are enough to resolve every branch guide —
  // collapsed nodes never contribute rows, so termination stays correct.
  if (props.showLine) {
    const layouts = resolveTreeLineLayout(
      result.map((row) => row.node.level),
      props.lineMode,
    );
    result.forEach((row, index) => {
      row.lines = layouts[index] ?? null;
    });
  }
  return result;
});

function handleSwitcherClick(row: SnTreeRow): void {
  const node = row.node;
  if (!row.nonLeaf || node.disabled) return;
  const wasExpanded = expandedSet.value.has(node.key);
  const next = new Set(expandedSet.value);
  const action: SnTreeExpandAction = wasExpanded ? 'collapse' : 'expand';
  if (wasExpanded) next.delete(node.key);
  else next.add(node.key);
  if (props.expandedKeys === undefined) uncontrolledExpandedKeys.value = next;
  emit('update:expandedKeys', [...next], keysToOptions([...next]), {
    node: node.option,
    action,
  });
}

function handleNodeClick(row: SnTreeRow): void {
  if (!props.selectable) return;
  const node = row.node;
  if (node.disabled) return;
  const wasSelected = selectedSet.value.has(node.key);
  const next = new Set(selectedSet.value);
  let action: SnTreeSelectAction;
  if (props.multiple) {
    if (wasSelected) {
      next.delete(node.key);
      action = 'unselect';
    } else {
      next.add(node.key);
      action = 'select';
    }
  } else {
    if (wasSelected && props.cancelable) {
      next.delete(node.key);
      action = 'unselect';
    } else {
      next.clear();
      next.add(node.key);
      action = 'select';
    }
  }
  if (props.selectedKeys === undefined) uncontrolledSelectedKeys.value = next;
  emit('update:selectedKeys', [...next], keysToOptions([...next]), {
    node: node.option,
    action,
  });
}

function handleCheckboxClick(row: SnTreeRow): void {
  if (!props.checkable) return;
  const node = row.node;
  if (node.disabled || node.checkboxDisabled) return;
  const nextChecked = !row.checked;
  const mutated = new Set(checkedSet.value);
  const targets = props.cascade ? checkableTargets(node.key) : [node.key];
  for (const target of targets) {
    if (nextChecked) mutated.add(target);
    else mutated.delete(target);
  }
  if (props.checkedKeys === undefined) uncontrolledCheckedKeys.value = mutated;
  const displayed: SnTreeKey[] = props.cascade
    ? displayedCascadeCheckedKeys(mutated)
    : [...mutated];
  emit('update:checkedKeys', displayed, keysToOptions(displayed), {
    node: node.option,
    action: nextChecked ? 'check' : 'uncheck',
  });
}

/* ─────────── Drag & drop ─────────── */

/** Key of the row currently being dragged (native HTML5 drag). */
const draggingKey = ref<SnTreeKey | null>(null);
/** Hovered drop slot: target key + resolved position. */
const dropTarget = ref<{ key: SnTreeKey; position: SnTreeDropPosition } | null>(null);

/** Built-in guards + the caller's `allowDrop` gate (mirrors n-tree). */
function canDrop(row: SnTreeRow, position: SnTreeDropPosition, phase: 'drag' | 'drop'): boolean {
  const dragKey = draggingKey.value;
  if (!props.draggable || dragKey === null) return false;
  if (row.node.disabled || row.node.key === dragKey) return false;
  // A node can never be dropped into its own subtree.
  if (normalized.value.descendants.get(dragKey)?.includes(row.node.key)) return false;
  if (position === 'inside' && row.node.isLeaf) return false;
  return props.allowDrop
    ? props.allowDrop({ node: row.node.option, dropPosition: position, phase })
    : true;
}

/** Edge bands → before/after, the middle band → inside (leaf rows split in half). */
function resolveDropPosition(
  event: DragEvent,
  row: SnTreeRow,
  el: HTMLElement,
  phase: 'drag' | 'drop',
): SnTreeDropPosition {
  const rect = el.getBoundingClientRect();
  const offsetY = event.clientY - rect.top;
  if (canDrop(row, 'inside', phase)) {
    if (offsetY <= 8) return 'before';
    if (offsetY >= rect.height - 8) return 'after';
    return 'inside';
  }
  return offsetY <= rect.height / 2 ? 'before' : 'after';
}

function handleDragStart(event: DragEvent, row: SnTreeRow): void {
  if (!props.draggable || row.node.disabled) {
    event.preventDefault();
    return;
  }
  draggingKey.value = row.node.key;
  dropTarget.value = null;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(row.node.key));
  }
  emit('dragStart', { node: row.node.option, event });
}

function handleDragEnter(event: DragEvent, row: SnTreeRow): void {
  if (!props.draggable || draggingKey.value === null) return;
  // Ignore enter events from descendants bubbling up.
  if (event.target !== event.currentTarget) return;
  emit('dragEnter', { node: row.node.option, event });
}

function handleDragOver(event: DragEvent, row: SnTreeRow): void {
  if (draggingKey.value === null) return;
  const position = resolveDropPosition(event, row, event.currentTarget as HTMLElement, 'drag');
  if (!canDrop(row, position, 'drag')) {
    if (dropTarget.value?.key === row.node.key) dropTarget.value = null;
    return;
  }
  // Required for the browser to fire `drop`.
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  if (dropTarget.value?.key !== row.node.key || dropTarget.value.position !== position) {
    dropTarget.value = { key: row.node.key, position };
  }
}

function handleDragLeave(event: DragEvent, row: SnTreeRow): void {
  if (draggingKey.value === null) return;
  const el = event.currentTarget as HTMLElement;
  const related = event.relatedTarget as Node | null;
  if (related !== null && el.contains(related)) return;
  if (dropTarget.value?.key === row.node.key) dropTarget.value = null;
  emit('dragLeave', { node: row.node.option, event });
}

function handleDrop(event: DragEvent, row: SnTreeRow): void {
  if (draggingKey.value === null) return;
  event.preventDefault();
  const position = resolveDropPosition(event, row, event.currentTarget as HTMLElement, 'drop');
  const dragKey = draggingKey.value;
  if (canDrop(row, position, 'drop')) {
    const dragNode = normalized.value.nodeMap.get(dragKey)?.option;
    if (dragNode) {
      emit('drop', {
        node: row.node.option,
        dragNode,
        dropPosition: position,
        event,
      });
    }
  }
  // `dragend` fires right after `drop`; keep the dragged key so that handler
  // still emits `dragEnd` and clears both refs.
  dropTarget.value = null;
}

function handleDragEnd(event: DragEvent, row: SnTreeRow): void {
  if (draggingKey.value !== null) emit('dragEnd', { node: row.node.option, event });
  resetDragState();
}

function resetDragState(): void {
  draggingKey.value = null;
  dropTarget.value = null;
}

/** Keys whose cascade targets are all checked (emitted shape). */
function displayedCascadeCheckedKeys(raw: Set<SnTreeKey>): SnTreeKey[] {
  const { nodeMap } = normalized.value;
  const out: SnTreeKey[] = [];
  for (const [key] of nodeMap) {
    const targets = checkableTargets(key);
    if (targets.length > 0 && targets.every((target) => raw.has(target))) {
      out.push(key);
    }
  }
  return out;
}
</script>

<template>
  <div
    data-snui-component="tree"
    class="sn-tree"
    :class="{
      'sn-tree--block-line': blockLine,
      'sn-tree--show-line': showLine,
      'sn-tree--line-guide': showLine && lineMode === 'guide',
      'sn-tree--line-dashed': showLine && lineStyle === 'dashed',
      'sn-tree--line-rounded': showLine && lineMode === 'branch' && lineCorner === 'rounded',
    }"
    :style="lineVars"
    role="tree"
  >
    <div v-for="row in rows" :key="row.node.key" class="sn-tree__node-wrapper">
      <span v-if="row.lines" class="sn-tree__line-layer" aria-hidden="true">
        <span
          v-for="segment in row.lines.verticals"
          :key="`v-${segment.index}`"
          class="sn-tree__line sn-tree__line--vertical"
          :class="{
            'sn-tree__line--half': segment.half,
            'sn-tree__line--elbow': row.lines.horizontalIndex === segment.index,
          }"
          :style="{ left: `${segment.index * indentWidth + indentWidth / 2}px` }"
        />
        <span
          v-if="row.lines.horizontalIndex !== null"
          class="sn-tree__line sn-tree__line--horizontal"
          :style="{
            left: `${row.lines.horizontalIndex * indentWidth + indentWidth / 2}px`,
            width: `${Math.max(0, indentWidth - 8)}px`,
          }"
        />
      </span>
      <div
        class="sn-tree__node"
        :class="[
          {
            'sn-tree__node--selected': row.selected,
            'sn-tree__node--disabled': row.node.disabled,
            'sn-tree__node--selectable': selectable && !row.node.disabled,
            'sn-tree__node--dragging': draggingKey === row.node.key,
            'sn-tree__node--drop-before':
              dropTarget?.key === row.node.key && dropTarget.position === 'before',
            'sn-tree__node--drop-inside':
              dropTarget?.key === row.node.key && dropTarget.position === 'inside',
            'sn-tree__node--drop-after':
              dropTarget?.key === row.node.key && dropTarget.position === 'after',
          },
        ]"
        role="treeitem"
        :aria-selected="selectable ? row.selected : undefined"
        :aria-expanded="row.nonLeaf ? row.expanded : undefined"
        :aria-disabled="row.node.disabled || undefined"
        :draggable="draggable && !row.node.disabled"
        @dragstart="handleDragStart($event, row)"
        @dragenter="handleDragEnter($event, row)"
        @dragover="handleDragOver($event, row)"
        @dragleave="handleDragLeave($event, row)"
        @drop="handleDrop($event, row)"
        @dragend="handleDragEnd($event, row)"
      >
        <span
          class="sn-tree__indent"
          :style="{ width: `${row.node.level * indentWidth}px` }"
          aria-hidden="true"
        />
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
          :aria-disabled="row.node.disabled || row.checkboxDisabled || undefined"
          @click.stop="handleCheckboxClick(row)"
        >
          <svg class="sn-tree__checkbox-box" viewBox="0 0 14 14" aria-hidden="true">
            <rect class="sn-tree__checkbox-frame" x="1" y="1" width="12" height="12" rx="2" />
            <path class="sn-tree__checkbox-check" d="M3.2 7.3 5.9 10 10.8 4.5" />
            <path class="sn-tree__checkbox-dash" d="M3.5 7H10.5" />
          </svg>
        </span>
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
          :aria-label="row.expanded ? locale.Tree.collapse : locale.Tree.expand"
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
        <div
          class="sn-tree__node-content"
          :class="{
            'sn-tree__node-content--selected': row.selected,
          }"
          @click="handleNodeClick(row)"
        >
          <span v-if="row.iconNode != null" class="sn-tree__node-icon">
            <SnTreePart :content="row.iconNode" />
          </span>
          <span v-if="row.prefixNode != null" class="sn-tree__node-prefix">
            <SnTreePart :content="row.prefixNode" />
          </span>
          <span class="sn-tree__node-text">{{ row.node.label }}</span>
          <span v-if="row.suffixNode != null" class="sn-tree__node-suffix">
            <SnTreePart :content="row.suffixNode" />
          </span>
        </div>
      </div>
    </div>
    <div v-if="rows.length === 0" class="sn-tree__empty">
      <slot name="empty">{{ locale.Empty.description }}</slot>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

/* Metrics mirror n-tree: 14px text, 24px node content, 3px row padding,
 * 2px node radius (borderRadiusSmall), 24px default indent, hover ≈ 4.7%
 * ink / pressed ≈ 7% ink (naive hoverColor / pressedColor). */
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

/* ---------- Connector lines ---------- */

/* The wrapper (not the node) is the positioning context: full-height
 * verticals join seamlessly across adjacent rows, and its symmetric padding
 * puts top: 50% exactly on the node content's center line. */
.sn-tree--show-line .sn-tree__node-wrapper {
  position: relative;
}

.sn-tree__line-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.sn-tree__line {
  position: absolute;
  color: var(--sn-web-tree-line-color, var(--sn-web-color-border-default));
}

.sn-tree__line--vertical {
  top: 0;
  bottom: 0;
  border-left: 1px solid currentColor;
}

.sn-tree__line--vertical.sn-tree__line--half {
  bottom: 50%;
}

.sn-tree__line--horizontal {
  top: 50%;
  border-top: 1px solid currentColor;
}

.sn-tree--line-dashed .sn-tree__line--vertical {
  border-left-style: dashed;
}

.sn-tree--line-dashed .sn-tree__line--horizontal {
  border-top-style: dashed;
}

/* Rounded elbow (AUI additive `line-corner="rounded"`).
 *
 * A compact quarter-circle: the branch leaves the parent trunk through
 * `border-left` + `border-bottom` + `border-bottom-left-radius: R`, with the
 * same radius on both axes. The box is R tall and starts just above the row
 * center line, so the arc peels off the straight trunk and flattens into the
 * horizontal segment within a few pixels — a subtle rounded corner rather
 * than a tall sweep over half the row.
 *
 * A non-last child keeps the full-height straight guide, so the trunk stays
 * unbroken while the branch curves away from it (a Y, not a notch). A branch's
 * last child trims that guide at the arc's top edge, so the arc alone closes
 * the branch.
 *
 * `--sn-web-tree-line-radius` (default 3px) is the corner radius on both axes;
 * keep it well below half the row height so the arc still reads as a corner. */
.sn-tree--line-rounded .sn-tree__line--horizontal {
  box-sizing: border-box;
  /* +1px keeps the bottom border's stroke on the same y as square mode's
   * `top: 50%` + `border-top: 1px`. */
  top: calc(50% - var(--sn-web-tree-line-radius, 3px) + 1px);
  height: var(--sn-web-tree-line-radius, 3px);
  border-top: 0;
  border-bottom: 1px solid currentColor;
  border-left: 1px solid currentColor;
  border-bottom-left-radius: var(--sn-web-tree-line-radius, 3px);
}

/* Last child of a branch: stop the straight guide where the arc starts, so
 * the bend (not a doubled line) terminates the branch. */
.sn-tree--line-rounded .sn-tree__line--vertical.sn-tree__line--elbow.sn-tree__line--half {
  bottom: calc(50% + var(--sn-web-tree-line-radius, 3px) - 1px);
}

.sn-tree--line-rounded.sn-tree--line-dashed .sn-tree__line--horizontal {
  border-bottom-style: dashed;
}

.sn-tree__node {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 2px;
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
  /* naive checkbox border = rgb(224,224,230) ≈ 12% ink on white — the
   * "slightly emphasized" mix, not the heavier --sn-web-color-border-default. */
  stroke: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 12%,
    var(--sn-web-color-background-surface)
  );
  transition:
    fill 0.15s ease,
    stroke 0.15s ease;
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

.sn-tree__checkbox:hover:not(.sn-tree__checkbox--disabled):not(.sn-tree__checkbox--checked):not(
    .sn-tree__checkbox--indeterminate
  )
  .sn-tree__checkbox-frame {
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
  border-radius: 2px;
  user-select: none;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.sn-tree__node--selectable .sn-tree__node-content {
  cursor: pointer;
}

.sn-tree__node--disabled .sn-tree__node-content {
  color: var(--sn-web-color-text-disabled);
  cursor: not-allowed;
}

.sn-tree__node-icon {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  color: var(--sn-web-color-text-tertiary);
}

/* Icon components carry their own size (lucide defaults to 24); keep every
 * data-level icon inside the 14px slot used by the rest of the row. */
.sn-tree__node-icon :deep(svg),
.sn-tree__node-icon :deep(.sn-icon) {
  width: 14px;
  height: 14px;
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

.sn-tree:not(.sn-tree--block-line)
  .sn-tree__node:not(.sn-tree__node--disabled)
  .sn-tree__node-content:hover {
  background: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 4.7%,
    var(--sn-web-color-background-surface)
  );
}

.sn-tree:not(.sn-tree--block-line) .sn-tree__node--selectable .sn-tree__node-content:active {
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 7%, transparent);
}

.sn-tree:not(.sn-tree--block-line) .sn-tree__node-content--selected {
  background: color-mix(in srgb, var(--sn-web-color-action-primary) 10%, transparent);
}

/* Hover / pressed / selected — block-line: backgrounds on the whole row. */

.sn-tree--block-line .sn-tree__node:not(.sn-tree__node--disabled):hover {
  background: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 4.7%,
    var(--sn-web-color-background-surface)
  );
}

.sn-tree--block-line .sn-tree__node--selectable:not(.sn-tree__node--selected):active {
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 7%, transparent);
}

.sn-tree--block-line .sn-tree__node--selected {
  background: color-mix(in srgb, var(--sn-web-color-action-primary) 10%, transparent);
}

/* ---------- Drag & drop ---------- */

.sn-tree__node--dragging {
  opacity: 0.45;
}

.sn-tree__node--drop-before::before,
.sn-tree__node--drop-after::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  height: 2px;
  border-radius: 1px;
  background: var(--sn-web-color-action-primary);
  pointer-events: none;
}

.sn-tree__node--drop-before::before {
  top: -1px;
}

.sn-tree__node--drop-after::after {
  bottom: -1px;
}

/* `inside` is the move-into target; keep it above both hover variants. */
.sn-tree:not(.sn-tree--block-line) .sn-tree__node--drop-inside,
.sn-tree--block-line .sn-tree__node--drop-inside:hover {
  border-radius: 4px;
  background: color-mix(in srgb, var(--sn-web-color-action-primary) 10%, transparent);
  box-shadow: inset 0 0 0 1px var(--sn-web-color-action-primary);
}

/* ---------- Empty state ---------- */

.sn-tree__empty {
  padding: 24px 0;
  color: var(--sn-web-color-text-tertiary);
  text-align: center;
}
</style>
