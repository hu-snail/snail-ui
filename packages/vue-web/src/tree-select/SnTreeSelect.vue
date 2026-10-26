<template>
  <div
    ref="rootRef"
    :class="[
      'sn-tree-select',
      `sn-tree-select--${size}`,
      {
        'sn-tree-select--multiple': isMulti,
        'sn-tree-select--filterable': filterable,
        'sn-tree-select--disabled': disabled,
        'sn-tree-select--readonly': readonly,
        'sn-tree-select--focused': isFocused,
        'sn-tree-select--active': isMenuOpen,
        [`sn-tree-select--status-${status}`]: status !== 'default',
        'sn-tree-select--empty': isSelectionEmpty,
      },
      customClass,
    ]"
    :data-snui-component="'tree-select'"
    :data-size="size"
    :data-status="status"
    :data-multiple="isMulti ? 'true' : undefined"
    :style="wrapperStyle || undefined"
  >
    <div
      ref="triggerRef"
      :class="['sn-tree-select__selection', { 'sn-tree-select__selection--multiple': isMulti }]"
      role="combobox"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      aria-haspopup="tree"
      :aria-controls="isMenuOpen ? menuId : undefined"
      :aria-activedescendant="activeDescendant ?? undefined"
      :aria-label="ariaLabel || 'Tree select'"
      :aria-invalid="status === 'error' ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      aria-orientation="vertical"
      :tabindex="isInteractive ? 0 : -1"
      @mousedown="onTriggerMouseDown"
      @click="onTriggerClick"
      @keydown="onTriggerKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <!-- Multiple: tag list -->
      <template v-if="isMulti">
        <span v-for="tag in selectedTags" :key="String(tag.value)" class="sn-tree-select__tag">
          <span class="sn-tree-select__tag-label">{{ tag.label }}</span>
          <button
            v-if="!disabled && !readonly"
            type="button"
            class="sn-tree-select__tag-close"
            :aria-label="`Remove ${tag.label}`"
            :tabindex="isFocused ? 0 : -1"
            @mousedown.prevent
            @click.stop="removeTag(tag.value)"
          >
            <svg
              viewBox="0 0 24 24"
              width="9"
              height="9"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6 18 18" />
            </svg>
          </button>
        </span>
      </template>

      <!-- Single: label text -->
      <span v-if="!isMulti" class="sn-tree-select__single-value">
        <template v-if="selectedLabel !== null">{{ selectedLabel }}</template>
        <span v-if="selectedLabel === null" class="sn-tree-select__placeholder">{{
          placeholder
        }}</span>
      </span>

      <!-- Multiple + empty: placeholder -->
      <span v-if="isMulti && isSelectionEmpty" class="sn-tree-select__placeholder">{{
        placeholder
      }}</span>

      <!-- Filterable internal search input -->
      <input
        v-if="filterable"
        ref="filterInputRef"
        v-model="query"
        type="text"
        class="sn-tree-select__filter-input"
        :class="{ 'sn-tree-select__filter-input--single-empty': !isMulti && isSelectionEmpty }"
        :placeholder="isSelectionEmpty ? placeholder : ''"
        :disabled="disabled"
        :readonly="readonly || !isMenuOpen"
        :aria-label="'Type to filter options'"
        :aria-autocomplete="'list'"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        :aria-controls="isMenuOpen ? menuId : undefined"
        :aria-activedescendant="activeDescendant ?? undefined"
        :tabindex="-1"
        autocomplete="off"
        @input="onFilterInput"
        @keydown.stop="onTriggerKeyDown"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <!-- Suffix area: clear button | arrow -->
    <div class="sn-tree-select__suffix">
      <button
        v-if="clearable && !isSelectionEmpty && isInteractive"
        type="button"
        class="sn-tree-select__clear"
        aria-label="Clear selection"
        :tabindex="-1"
        @mousedown.prevent
        @click.stop="clearSelection"
      >
        <svg
          viewBox="0 0 24 24"
          width="11"
          height="11"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="M6 6 18 18" />
        </svg>
      </button>
      <span
        v-else
        class="sn-tree-select__arrow"
        :class="{ 'sn-tree-select__arrow--up': isMenuOpen }"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>

    <!-- Dropdown tree menu -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="isMenuOpen"
          :id="menuId"
          ref="menuRef"
          :class="['sn-tree-select-menu', `sn-tree-select-menu--${placement}`]"
          :style="menuStyle"
          role="tree"
          :aria-label="ariaLabel || 'Options'"
          :aria-multiselectable="isMulti ? 'true' : undefined"
          @mousedown.prevent
        >
          <div ref="menuBodyRef" class="sn-tree-select-menu__body">
            <template v-if="visibleNodes.length > 0">
              <div
                v-for="node in visibleNodes"
                :key="node.key"
                :id="nodeDomId(node.key)"
                :class="[
                  'sn-tree-select-node',
                  {
                    'sn-tree-select-node--selected': isSelected(node),
                    'sn-tree-select-node--pending': pendingKey === node.key,
                    'sn-tree-select-node--disabled': node.disabled,
                  },
                ]"
                role="treeitem"
                :aria-selected="isSelected(node) ? 'true' : 'false'"
                :aria-disabled="node.disabled ? 'true' : undefined"
                :aria-expanded="
                  hasChildren(node) ? (isNodeExpanded(node) ? 'true' : 'false') : undefined
                "
                :aria-level="node.depth + 1"
                :data-key="node.key"
                :data-value="String(node.value)"
                :style="nodeStyle(node)"
                @click="chooseNode(node)"
                @mouseenter="onNodeEnter(node)"
              >
                <button
                  v-if="hasChildren(node)"
                  type="button"
                  class="sn-tree-select-node__switcher"
                  :class="{ 'sn-tree-select-node__switcher--expanded': isNodeExpanded(node) }"
                  :aria-label="
                    isNodeExpanded(node) ? `Collapse ${node.label}` : `Expand ${node.label}`
                  "
                  :tabindex="-1"
                  @click.stop="toggleExpand(node)"
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
                <span v-else class="sn-tree-select-node__switcher-placeholder" aria-hidden="true" />
                <span class="sn-tree-select-node__label">{{ node.label }}</span>
              </div>
            </template>
            <div v-else class="sn-tree-select-menu__empty">
              <slot name="empty">{{ emptyText }}</slot>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnTreeSelect — web-end tree select component.
 *
 * Reference library: naive-ui `n-tree-select`
 *   (https://www.naiveui.com/zh-CN/light/components/tree-select)
 * Props + semantics mirror n-tree-select's main surface.
 *
 * Parity (this version):
 *   - modelValue (string | number | null | Array) / multiple
 *   - checkable merged into multiple (simplification: one multi-select
 *     mode; selections are independent — no cascade check strategy)
 *   - options: tree of { label, key | value, disabled?, children? } with
 *     labelField / keyField / childrenField remapping
 *   - leaf AND parent nodes are selectable — choosing a parent commits
 *     the parent's own value only
 *   - defaultExpandAll (non-controlled expansion; expandedKeys control
 *     simplified away)
 *   - placeholder / clearable / filterable (label match, ancestors of
 *     matches auto-expand while filtering) / disabled / readonly /
 *     size / status
 *   - keyboard: ArrowUp/Down move highlight, ArrowLeft collapse (or jump
 *     to parent), ArrowRight expand (or descend to first child), Enter
 *     select, Esc close, Backspace removes last tag (multiple)
 *   - events: update:modelValue, change, clear, focus, blur
 *   - slot: empty
 *   - a11y: role=combobox trigger + role=tree menu with role=treeitem
 *     rows (aria-level / aria-expanded / aria-selected), highlight via
 *     aria-activedescendant
 *
 * Per AGENTS.md §30/31: props / events / slots / tokens / accessibility
 * declared below; CSS uses `--sn-web-tree-select-*` aliases +
 * `--sn-web-color-*` fallbacks only.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import {
  defaultTreeSelectFilter,
  type SnTreeSelectNode,
  type SnTreeSelectOptionInput,
  type SnTreeSelectSize,
  type SnTreeSelectStatus,
  type SnTreeSelectValue,
} from './sn-tree-select-types';
import { useOverlayFollow } from '../_internal/use-overlay-follow';

defineOptions({ name: 'SnTreeSelect' });

const props = withDefaults(
  defineProps<{
    /** Bound value: single value / null, or array in multi mode. */
    modelValue?: SnTreeSelectValue | SnTreeSelectValue[] | null;
    /** Allow selecting several values (tag-style display, no cascade). */
    multiple?: boolean;
    /** Alias of `multiple` (checkable tree mode merged into multi-select). */
    checkable?: boolean;
    /** Tree option list ({ label, key | value, disabled?, children? }). */
    options?: SnTreeSelectOptionInput[];
    /** Expand every parent on first render (non-controlled expansion). */
    defaultExpandAll?: boolean;
    /** Placeholder text when empty. */
    placeholder?: string;
    /** Show the clear (×) button when a value is present. */
    clearable?: boolean;
    /** Enable the internal filter input (label match + ancestor expand). */
    filterable?: boolean;
    /** Disables interaction. */
    disabled?: boolean;
    /** Read-only — opens nothing, commits nothing. */
    readonly?: boolean;
    /** Visual size preset. */
    size?: SnTreeSelectSize;
    /** Validation-driven visual status. */
    status?: SnTreeSelectStatus;
    /** Field remapping for option labels. */
    labelField?: string;
    /** Field remapping for option keys (falls back to `value` field). */
    keyField?: string;
    /** Field remapping for child nodes. */
    childrenField?: string;
    /** Accessible name for the trigger. */
    ariaLabel?: string;
    /** Empty-state text (overridden by the `empty` slot). */
    emptyText?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    modelValue: null,
    multiple: false,
    checkable: false,
    options: () => [],
    defaultExpandAll: false,
    placeholder: 'Please select',
    clearable: false,
    filterable: false,
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
    labelField: 'label',
    keyField: 'key',
    childrenField: 'children',
    ariaLabel: '',
    emptyText: 'No data',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync. */
  (e: 'update:modelValue', value: SnTreeSelectValue | SnTreeSelectValue[] | null): void;
  /** Selection committed (also fires for tag removal + clear). */
  (e: 'change', value: SnTreeSelectValue | SnTreeSelectValue[] | null): void;
  /** Clear button activated. */
  (e: 'clear'): void;
  /** Trigger gained focus. */
  (e: 'focus', event: FocusEvent): void;
  /** Trigger lost focus. */
  (e: 'blur', event: FocusEvent): void;
}>();

defineSlots<{
  /** Empty state (no options / no filter match). */
  empty?(): unknown;
}>();

/* ─────────── Option normalization ─────────── */

/**
 * Normalize raw option objects into SnTreeSelectNode trees.
 * `key` is a path-based render identity (unique per position);
 * `value` is what selection commits. Deterministic + pure.
 */
function normalizeTree(
  list: SnTreeSelectOptionInput[],
  depth: number,
  parentPath: string,
  parentKeys: string[],
): SnTreeSelectNode[] {
  const out: SnTreeSelectNode[] = [];
  list.forEach((raw, index) => {
    if (raw === null || typeof raw !== 'object') return;
    const labelRaw: unknown = raw[props.labelField];
    const keyRaw: unknown = raw[props.keyField] !== undefined ? raw[props.keyField] : raw['value'];
    const disabledRaw: unknown = raw['disabled'];
    const childrenRaw: unknown = raw[props.childrenField];
    const value: SnTreeSelectValue =
      typeof keyRaw === 'string' || typeof keyRaw === 'number' ? keyRaw : index;
    const path = parentPath === '' ? `${index}` : `${parentPath}/${index}`;
    const children = Array.isArray(childrenRaw)
      ? normalizeTree(childrenRaw as SnTreeSelectOptionInput[], depth + 1, path, [
          ...parentKeys,
          path,
        ])
      : undefined;
    out.push({
      key: path,
      label: labelRaw === undefined || labelRaw === null ? String(value) : String(labelRaw),
      value,
      disabled: disabledRaw === true,
      depth,
      children,
      parentKeys,
    });
  });
  return out;
}

const normalizedNodes = computed<SnTreeSelectNode[]>(() => normalizeTree(props.options, 0, '', []));

/** Lookup from committed value -> node (labels for tags / single display). */
const nodeByValue = computed<Map<SnTreeSelectValue, SnTreeSelectNode>>(() => {
  const map = new Map<SnTreeSelectValue, SnTreeSelectNode>();
  const walk = (nodes: SnTreeSelectNode[]): void => {
    for (const node of nodes) {
      if (!map.has(node.value)) map.set(node.value, node);
      if (node.children !== undefined) walk(node.children);
    }
  };
  walk(normalizedNodes.value);
  return map;
});

/** Keys of every parent node (drives defaultExpandAll seeding). */
const allParentKeys = computed<Set<string>>(() => {
  const set = new Set<string>();
  const walk = (nodes: SnTreeSelectNode[]): void => {
    for (const node of nodes) {
      if (node.children !== undefined && node.children.length > 0) {
        set.add(node.key);
        walk(node.children);
      }
    }
  };
  walk(normalizedNodes.value);
  return set;
});

function hasChildren(node: SnTreeSelectNode): boolean {
  return node.children !== undefined && node.children.length > 0;
}

/* ─────────── Selection state ─────────── */

/** Multi-select mode: `multiple` or its merged alias `checkable`. */
const isMulti = computed(() => props.multiple || props.checkable);

/** Current selection as an array view regardless of mode. */
const selectedValues = computed<ReadonlyArray<SnTreeSelectValue>>(() => {
  if (isMulti.value) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }
  const single = props.modelValue;
  if (single === null || single === undefined || Array.isArray(single)) return [];
  return [single];
});

const isSelectionEmpty = computed(() => selectedValues.value.length === 0);

function labelFor(value: SnTreeSelectValue): string {
  return nodeByValue.value.get(value)?.label ?? String(value);
}

/** Single-select display label (null → placeholder). */
const selectedLabel = computed<string | null>(() => {
  if (isMulti.value || isSelectionEmpty.value) return null;
  const first = selectedValues.value[0];
  return first === undefined ? null : labelFor(first);
});

/** Tags for multi-select display. */
const selectedTags = computed<Array<{ value: SnTreeSelectValue; label: string }>>(() =>
  selectedValues.value.map((value) => ({ value, label: labelFor(value) })),
);

function isSelected(node: SnTreeSelectNode): boolean {
  return selectedValues.value.includes(node.value);
}

/* ─────────── Expansion state (non-controlled) ─────────── */

const expandedKeys = ref<Set<string>>(new Set());
/** Set once the user toggles a switcher — stops defaultExpandAll reseeding. */
let hasUserToggled = false;

function isNodeExpanded(node: SnTreeSelectNode): boolean {
  if (!hasChildren(node)) return false;
  const filter = filterState.value;
  if (filter !== null) {
    // While filtering every ancestor of a match renders expanded.
    return node.children?.some((child) => filter.visible.has(child.key)) ?? false;
  }
  return expandedKeys.value.has(node.key);
}

function toggleExpand(node: SnTreeSelectNode): void {
  if (!hasChildren(node)) return;
  hasUserToggled = true;
  const next = new Set(expandedKeys.value);
  if (next.has(node.key)) next.delete(node.key);
  else next.add(node.key);
  expandedKeys.value = next;
}

/* ─────────── Filter state ─────────── */

const query = ref('');

/** Matched + visible key sets while a filter query is active (null = off). */
interface TreeFilterState {
  matched: Set<string>;
  visible: Set<string>;
}

const filterState = computed<TreeFilterState | null>(() => {
  const pattern = query.value;
  if (pattern === '') return null;
  const matched = new Set<string>();
  const visible = new Set<string>();
  const walk = (nodes: SnTreeSelectNode[]): boolean => {
    let hasMatch = false;
    for (const node of nodes) {
      if (defaultTreeSelectFilter(pattern, node.label)) matched.add(node.key);
      const childHit =
        node.children !== undefined && node.children.length > 0 ? walk(node.children) : false;
      if (matched.has(node.key) || childHit) {
        visible.add(node.key);
        hasMatch = true;
      }
    }
    return hasMatch;
  };
  walk(normalizedNodes.value);
  return { matched, visible };
});

/**
 * Depth-first visible nodes: while filtering, only filter-visible nodes
 * render and every ancestor of a match is descended into (auto-expand);
 * otherwise only user-expanded parents are descended into.
 */
const visibleNodes = computed<SnTreeSelectNode[]>(() => {
  const filter = filterState.value;
  const out: SnTreeSelectNode[] = [];
  const walk = (nodes: SnTreeSelectNode[]): void => {
    for (const node of nodes) {
      if (filter !== null && !filter.visible.has(node.key)) continue;
      out.push(node);
      if (node.children === undefined || node.children.length === 0) continue;
      if (filter !== null || expandedKeys.value.has(node.key)) walk(node.children);
    }
  };
  walk(normalizedNodes.value);
  return out;
});

/* ─────────── Open state / ids / pending ─────────── */

const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const menuBodyRef = ref<HTMLElement | null>(null);
const filterInputRef = ref<HTMLInputElement | null>(null);

const isMenuOpen = ref(false);
const isFocused = ref(false);
const pendingKey = ref<string | null>(null);

const isInteractive = computed(() => !props.disabled && !props.readonly);

const instanceId = useId();
const menuId = `sn-tree-select-menu-${instanceId}`;

/** DOM id for one node row (aria-activedescendant target). */
function nodeDomId(key: string): string {
  const index = visibleNodes.value.findIndex((node) => node.key === key);
  return index === -1 ? '' : `${menuId}-node-${index}`;
}

const activeDescendant = computed<string | null>(() => {
  if (!isMenuOpen.value || pendingKey.value === null) return null;
  const id = nodeDomId(pendingKey.value);
  return id === '' ? null : id;
});

/** Inline custom property driving the depth indent (tokenized calc). */
function nodeStyle(node: SnTreeSelectNode): Record<string, string> {
  return { '--sn-web-tree-select-node-level': String(node.depth) };
}

/* ─────────── Dropdown positioning (simplified popper) ─────────── */

const MENU_VIEWPORT_GAP = 4;
const placement = ref<'bottom' | 'top'>('bottom');
const menuStyle = ref<Record<string, string>>({});

async function repositionMenu(): Promise<void> {
  const root = rootRef.value;
  const menu = menuRef.value;
  if (!root || !menu) return;
  const rootRect = root.getBoundingClientRect();
  // offsetWidth/offsetHeight read the layout box, which the sn-pop enter
  // transform (scale 0.92) does not distort — getBoundingClientRect would
  // measure the scaled panel while the enter transition is running.
  const menuWidth = menu.offsetWidth;
  const menuHeight = menu.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const width = Math.max(rootRect.width, menuWidth);
  const left = Math.min(
    Math.max(MENU_VIEWPORT_GAP, rootRect.left),
    Math.max(MENU_VIEWPORT_GAP, vw - width - MENU_VIEWPORT_GAP),
  );

  // Bottom preferred; flip to top when the viewport lacks room below
  // but has room above.
  const roomBelow = vh - rootRect.bottom;
  const roomAbove = rootRect.top;
  const useTop = roomBelow < menuHeight && roomAbove > roomBelow;
  placement.value = useTop ? 'top' : 'bottom';

  const top = useTop ? Math.max(MENU_VIEWPORT_GAP, rootRect.top - menuHeight) : rootRect.bottom;

  menuStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    'min-width': `${Math.round(rootRect.width)}px`,
  };
}

/* Scroll/resize follow: while the menu is open, any scroll (page or a nested
 * scrollable ancestor) or viewport resize re-runs repositionMenu so the
 * fixed-position menu stays glued to the trigger instead of detaching. */
const followViewport = useOverlayFollow(rootRef, menuRef, repositionMenu, isMenuOpen);

/* ─────────── Outside-click dismiss (§41/§42) ─────────── */

function onDocumentMouseDown(event: MouseEvent): void {
  if (!isMenuOpen.value) return;
  const target = event.target as Node | null;
  if (!target) return;
  if (rootRef.value && rootRef.value.contains(target)) return;
  if (menuRef.value && menuRef.value.contains(target)) return;
  closeMenu();
}

/* ─────────── Open / close ─────────── */

function openMenu(): void {
  if (!isInteractive.value || isMenuOpen.value) return;
  isMenuOpen.value = true;
  pendingKey.value = null;
  void nextTick(() => {
    void repositionMenu();
    followViewport.start();
    if (props.filterable) {
      filterInputRef.value?.focus();
    }
  });
}

function closeMenu(): void {
  if (!isMenuOpen.value) return;
  isMenuOpen.value = false;
  followViewport.stop();
  query.value = '';
  pendingKey.value = null;
}

/* ─────────── Selection commit ─────────── */

function emitChange(next: SnTreeSelectValue | SnTreeSelectValue[] | null): void {
  emit('update:modelValue', next);
  emit('change', next);
}

function chooseNode(node: SnTreeSelectNode): void {
  if (!isInteractive.value || node.disabled) return;
  if (isMulti.value) {
    // Independent toggles — no cascade between parent and children.
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = current.indexOf(node.value);
    if (index === -1) current.push(node.value);
    else current.splice(index, 1);
    emitChange(current);
  } else {
    emitChange(node.value);
    closeMenu();
    triggerRef.value?.focus();
  }
}

function removeTag(value: SnTreeSelectValue): void {
  if (!isMulti.value || !isInteractive.value) return;
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  emitChange(current.filter((v) => v !== value));
}

function clearSelection(): void {
  if (!isInteractive.value) return;
  emitChange(isMulti.value ? [] : null);
  emit('clear');
}

/* ─────────── Keyboard ─────────── */

function pendingNode(): SnTreeSelectNode | null {
  if (pendingKey.value === null) return null;
  return visibleNodes.value.find((node) => node.key === pendingKey.value) ?? null;
}

function movePending(delta: 1 | -1): void {
  const nodes = visibleNodes.value;
  if (nodes.length === 0) return;
  const currentIndex =
    pendingKey.value === null ? -1 : nodes.findIndex((node) => node.key === pendingKey.value);
  let next = currentIndex + delta;
  if (next < 0) next = nodes.length - 1;
  if (next >= nodes.length) next = 0;
  const node = nodes[next];
  if (node) {
    pendingKey.value = node.key;
    void scrollPendingIntoView(node.key);
  }
}

/** ArrowRight — expand the pending parent, or descend to its first child. */
function expandPending(): void {
  const node = pendingNode();
  if (!node) return;
  if (!hasChildren(node)) return;
  if (!expandedKeys.value.has(node.key)) {
    hasUserToggled = true;
    const next = new Set(expandedKeys.value);
    next.add(node.key);
    expandedKeys.value = next;
  } else {
    movePending(1);
  }
}

/** ArrowLeft — collapse the pending parent, or jump to the parent row. */
function collapsePending(): void {
  const node = pendingNode();
  if (!node) return;
  if (hasChildren(node) && expandedKeys.value.has(node.key)) {
    hasUserToggled = true;
    const next = new Set(expandedKeys.value);
    next.delete(node.key);
    expandedKeys.value = next;
  } else if (node.parentKeys.length > 0) {
    const parentKey = node.parentKeys[node.parentKeys.length - 1];
    if (parentKey !== undefined) {
      pendingKey.value = parentKey;
      void scrollPendingIntoView(parentKey);
    }
  }
}

async function scrollPendingIntoView(key: string): Promise<void> {
  await nextTick();
  const body = menuBodyRef.value;
  if (!body) return;
  const row = body.querySelector(`[data-key="${CSS.escape(key)}"]`);
  row?.scrollIntoView({ block: 'nearest' });
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (!isInteractive.value) return;
  switch (event.key) {
    case 'Enter': {
      event.preventDefault();
      if (!isMenuOpen.value) {
        openMenu();
        return;
      }
      const node = pendingNode();
      if (node) chooseNode(node);
      break;
    }
    case ' ':
    case 'Spacebar': {
      // While filtering the input owns the space keystroke.
      if (props.filterable && isMenuOpen.value) break;
      event.preventDefault();
      if (!isMenuOpen.value) openMenu();
      break;
    }
    case 'ArrowDown': {
      event.preventDefault();
      if (!isMenuOpen.value) openMenu();
      movePending(1);
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      if (!isMenuOpen.value) openMenu();
      movePending(-1);
      break;
    }
    case 'ArrowRight': {
      if (!isMenuOpen.value) return;
      event.preventDefault();
      expandPending();
      break;
    }
    case 'ArrowLeft': {
      if (!isMenuOpen.value) return;
      event.preventDefault();
      collapsePending();
      break;
    }
    case 'Escape': {
      if (isMenuOpen.value) {
        event.preventDefault();
        closeMenu();
      }
      break;
    }
    case 'Backspace': {
      if (
        isMulti.value &&
        isMenuOpen.value &&
        query.value === '' &&
        selectedValues.value.length > 0
      ) {
        event.preventDefault();
        const last = selectedValues.value[selectedValues.value.length - 1];
        if (last !== undefined) removeTag(last);
      }
      break;
    }
    default:
      break;
  }
}

/* ─────────── Trigger events ─────────── */

function onTriggerMouseDown(event: MouseEvent): void {
  // Keep focus on the trigger (or filter input) — never the text-selection
  // caret dance on the wrapper.
  if (props.filterable && isMenuOpen.value) return;
  event.preventDefault();
}

function onTriggerClick(): void {
  if (!isInteractive.value) return;
  if (isMenuOpen.value) closeMenu();
  else openMenu();
}

function onFilterInput(): void {
  pendingKey.value = null;
}

function onNodeEnter(node: SnTreeSelectNode): void {
  if (!isInteractive.value || node.disabled) return;
  pendingKey.value = node.key;
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false;
  emit('blur', event);
}

/* ─────────── Listeners lifecycle (§41/§42) ─────────── */

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown);
  followViewport.stop();
});

watch(
  () => props.options,
  () => {
    // Seed (or re-seed before any user toggle) the expansion set for
    // defaultExpandAll; also re-measure an open menu after options swap.
    if (props.defaultExpandAll && !hasUserToggled) {
      expandedKeys.value = new Set(allParentKeys.value);
    }
    if (isMenuOpen.value) void nextTick(() => void repositionMenu());
  },
  { immediate: true },
);

watch(isMenuOpen, (open) => {
  if (open) void nextTick(() => void repositionMenu());
});

const wrapperStyle = computed<string>(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});
</script>

<style scoped>
.sn-tree-select {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

.sn-tree-select__selection {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  min-height: var(--sn-web-tree-select-height, 32px);
  padding: 0 var(--sn-web-tree-select-padding-x, 10px);
  width: var(--sn-web-tree-select-width, 100%);
  box-sizing: border-box;
  border: 1px solid var(--sn-web-tree-select-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-tree-select-radius, 6px);
  background-color: var(--sn-web-tree-select-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-tree-select-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  transition:
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
  outline: none;
}

.sn-tree-select__selection:focus-visible {
  border-color: var(--sn-web-tree-select-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-tree-select-focus-ring, var(--sn-web-focus-ring));
}

.sn-tree-select--active .sn-tree-select__selection {
  border-color: var(--sn-web-tree-select-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-tree-select-focus-ring, var(--sn-web-focus-ring));
}

/* Sizes — height + font-size presets (mirror SnSelect). */
.sn-tree-select--mini {
  --sn-web-tree-select-height: 22px;
  font-size: 11px;
}
.sn-tree-select--tiny {
  --sn-web-tree-select-height: 24px;
  font-size: 12px;
}
.sn-tree-select--small {
  --sn-web-tree-select-height: 28px;
  font-size: 13px;
}
.sn-tree-select--medium {
  --sn-web-tree-select-height: 32px;
  font-size: 14px;
}
.sn-tree-select--large {
  --sn-web-tree-select-height: 40px;
  font-size: 15px;
}

/* Multiple rows grow vertically with tags. */
.sn-tree-select--multiple .sn-tree-select__selection {
  min-height: var(--sn-web-tree-select-height, 32px);
  padding-top: 3px;
  padding-bottom: 3px;
  cursor: text;
}

.sn-tree-select__placeholder {
  color: var(--sn-web-tree-select-placeholder-color, var(--sn-web-color-text-tertiary));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

.sn-tree-select__single-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

/* Tag pills */
.sn-tree-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: calc(var(--sn-web-tree-select-height, 32px) - 8px);
  padding: 0 var(--sn-web-tree-select-tag-padding-x, 6px);
  border-radius: var(--sn-web-tree-select-tag-radius, var(--sn-web-tree-select-radius, 6px));
  background-color: var(--sn-web-tree-select-tag-bg, var(--sn-web-color-background-subtle));
  color: var(--sn-web-tree-select-tag-text-color, var(--sn-web-color-text-primary));
  font-size: calc(1em - 1px);
  line-height: 1;
  white-space: nowrap;
  box-sizing: border-box;
}

.sn-tree-select__tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-tree-select-tag-close-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
  transition:
    color 0.15s ease-out,
    background-color 0.15s ease-out;
}

.sn-tree-select__tag-close:hover {
  color: var(--sn-web-tree-select-tag-close-color-hover, var(--sn-web-color-text-primary));
  background-color: var(--sn-web-tree-select-tag-close-bg-hover, rgba(0, 0, 0, 0.06));
}

/* Internal filter input — sits inline after tags / value. */
.sn-tree-select__filter-input {
  flex: 1;
  min-width: 1px;
  height: calc(var(--sn-web-tree-select-height, 32px) - 8px);
  border: none;
  outline: none;
  padding: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
}

.sn-tree-select__filter-input::placeholder {
  color: var(--sn-web-tree-select-placeholder-color, var(--sn-web-color-text-tertiary));
}

/* Single + empty: the input takes the whole row (label hidden). */
.sn-tree-select__filter-input--single-empty {
  width: 100%;
}

/* Suffix: clear / arrow */
.sn-tree-select__suffix {
  position: absolute;
  right: var(--sn-web-tree-select-suffix-right, 8px);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.sn-tree-select__suffix > * {
  pointer-events: auto;
}

.sn-tree-select__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-tree-select-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
}

.sn-tree-select__clear:hover {
  color: var(--sn-web-tree-select-clear-color-hover, var(--sn-web-color-text-primary));
  background-color: var(--sn-web-tree-select-clear-bg-hover, rgba(0, 0, 0, 0.06));
}

.sn-tree-select__arrow {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-tree-select-arrow-color, var(--sn-web-color-text-tertiary));
  transition: transform 0.18s ease-out;
}

.sn-tree-select__arrow--up {
  transform: rotate(180deg);
}

/* Disabled / readonly */
.sn-tree-select--disabled .sn-tree-select__selection {
  cursor: not-allowed;
  background-color: var(--sn-web-tree-select-bg-disabled, var(--sn-web-color-background-subtle));
  color: var(--sn-web-tree-select-text-color-disabled, var(--sn-web-color-text-disabled));
  border-color: var(--sn-web-tree-select-border-color-disabled, var(--sn-web-color-border-subtle));
}

.sn-tree-select--disabled .sn-tree-select__placeholder {
  color: var(--sn-web-tree-select-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-tree-select--readonly .sn-tree-select__selection {
  cursor: default;
  background-color: var(--sn-web-tree-select-bg-readonly, var(--sn-web-color-background-subtle));
}

/* Status */
.sn-tree-select--status-error .sn-tree-select__selection {
  border-color: var(--sn-web-color-feedback-danger);
}

.sn-tree-select--status-warning .sn-tree-select__selection {
  border-color: var(--sn-web-color-feedback-warning);
}

/* Suffix overlap guard: leave room for the arrow / clear button. */
.sn-tree-select__selection {
  padding-right: calc(var(--sn-web-tree-select-padding-x, 10px) + 22px);
}
</style>

<style scoped>
/* Dropdown tree menu — teleported to body, so it needs its own (non-scoped-
 * alias) class names. Teleported nodes still receive the scoped attribute,
 * so both blocks live in the same SFC (SnSelect convention). */
.sn-tree-select-menu {
  position: fixed;
  z-index: var(--sn-web-tree-select-menu-z-index, 1000);
  min-width: 120px;
  padding: 4px 0;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-tree-select-menu-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--sn-web-tree-select-menu-radius, 3px);
  background-color: var(--sn-web-tree-select-menu-bg, var(--sn-web-color-background-elevated));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-tree-select-menu-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  font-family: inherit;
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-tree-select-menu--bottom {
  transform-origin: center top;
}

.sn-tree-select-menu--top {
  transform-origin: center bottom;
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

.sn-tree-select-menu__body {
  overflow-y: auto;
  overscroll-behavior: contain;
  max-height: var(--sn-web-tree-select-menu-max-height, 260px);
}

.sn-tree-select-menu__empty {
  padding: var(--sn-web-tree-select-empty-padding-y, 12px)
    var(--sn-web-tree-select-node-padding-x, 10px);
  text-align: center;
  font-size: calc(1em - 1px);
  color: var(--sn-web-tree-select-empty-color, var(--sn-web-color-text-tertiary));
}

/* Tree node rows — indent driven by the per-row level custom property. */
.sn-tree-select-node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: var(--sn-web-tree-select-node-min-height, 30px);
  padding-right: var(--sn-web-tree-select-node-padding-x, 10px);
  padding-left: calc(
    var(--sn-web-tree-select-node-padding-x, 10px) + var(--sn-web-tree-select-node-level, 0) *
      var(--sn-web-tree-select-node-indent, 16px)
  );
  box-sizing: border-box;
  font-family: inherit;
  font-size: var(--sn-web-tree-select-node-font-size, 14px);
  line-height: 1.4;
  color: var(--sn-web-tree-select-node-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  white-space: nowrap;
}

.sn-tree-select-node--pending {
  background-color: var(
    --sn-web-tree-select-node-bg-hover,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.045))
  );
}

.sn-tree-select-node--selected {
  background-color: var(--sn-web-tree-select-node-bg-selected, rgba(22, 119, 255, 0.1));
  color: var(--sn-web-tree-select-node-text-color-selected, var(--sn-web-color-action-primary));
  font-weight: 500;
}

.sn-tree-select-node--selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: var(--sn-web-tree-select-node-selected-bar-width, 3px);
  border-radius: var(--sn-web-tree-select-radius, 6px);
  background-color: var(
    --sn-web-tree-select-node-selected-bar-color,
    var(--sn-web-color-action-primary)
  );
}

.sn-tree-select-node__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sn-tree-select-node--disabled {
  cursor: not-allowed;
  color: var(--sn-web-tree-select-node-text-color-disabled, var(--sn-web-color-text-disabled));
  background-color: transparent;
}

.sn-tree-select-node--disabled.sn-tree-select-node--selected {
  background-color: var(
    --sn-web-tree-select-node-bg-selected-disabled,
    var(--sn-web-color-background-subtle)
  );
  color: var(--sn-web-tree-select-node-text-color-disabled, var(--sn-web-color-text-disabled));
}

/* Expand / collapse switcher */
.sn-tree-select-node__switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex: none;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-tree-select-switcher-radius, 4px);
  background: transparent;
  color: var(--sn-web-tree-select-switcher-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
  transition: color 0.15s ease-out;
}

.sn-tree-select-node__switcher:hover {
  color: var(--sn-web-tree-select-switcher-color-hover, var(--sn-web-color-text-primary));
}

.sn-tree-select-node__switcher svg {
  transition: transform 0.15s ease-out;
}

.sn-tree-select-node__switcher--expanded svg {
  transform: rotate(90deg);
}

/* Leaf alignment spacer — same width as the switcher. */
.sn-tree-select-node__switcher-placeholder {
  width: 16px;
  flex: none;
}
</style>
