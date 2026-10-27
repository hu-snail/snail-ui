<template>
  <div
    ref="rootRef"
    :class="[
      'sn-cascader',
      `sn-cascader--${size}`,
      {
        'sn-cascader--filterable': filterable,
        'sn-cascader--multiple': multiple,
        'sn-cascader--disabled': disabled,
        'sn-cascader--readonly': readonly,
        'sn-cascader--focused': isFocused,
        'sn-cascader--active': isMenuOpen,
        [`sn-cascader--status-${status}`]: status !== 'default',
      },
    ]"
    :data-snui-component="'cascader'"
    :data-size="size"
    :data-status="status"
  >
    <div
      ref="triggerRef"
      class="sn-cascader__selection"
      role="combobox"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-controls="isMenuOpen ? menuId : undefined"
      :aria-activedescendant="activeDescendant ?? undefined"
      :aria-label="ariaLabel !== '' ? ariaLabel : 'Cascader'"
      :aria-invalid="status === 'error' ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :tabindex="isInteractive ? 0 : -1"
      @mousedown="onTriggerMouseDown"
      @click="onTriggerClick"
      @keydown="onKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <!-- Single: label / placeholder text -->
      <span v-if="!multiple && !filterable" class="sn-cascader__single-value">
        <template v-if="selectedLabel !== null">{{ selectedLabel }}</template>
        <span v-else class="sn-cascader__placeholder">{{ placeholder }}</span>
      </span>

      <!-- Single + filterable: committed label -->
      <span
        v-if="!multiple && filterable && selectedLabel !== null"
        class="sn-cascader__single-value"
        >{{ selectedLabel }}</span
      >

      <!-- Multiple: one tag per committed leaf path -->
      <template v-if="multiple">
        <span v-for="tag in visibleTags" :key="tag.key" class="sn-cascader__tag">
          <span class="sn-cascader__tag-label">{{ tag.label }}</span>
          <button
            v-if="isInteractive"
            type="button"
            class="sn-cascader__tag-close"
            :aria-label="`Remove ${tag.label}`"
            :tabindex="-1"
            @mousedown.prevent
            @click.stop="removeTag(tag.values)"
          >
            <SnIcon :icon="CloseIcon" :size="9" />
          </button>
        </span>
        <span
          v-if="restTagCount > 0"
          class="sn-cascader__tag sn-cascader__tag--rest"
          :aria-label="`${restTagCount} more selected`"
        >
          <span class="sn-cascader__tag-label">+{{ restTagCount }}</span>
        </span>
        <span v-if="selectedTags.length === 0" class="sn-cascader__placeholder">{{
          placeholder
        }}</span>
      </template>
      <input
        v-if="filterable"
        ref="filterInputRef"
        v-model="query"
        type="text"
        class="sn-cascader__filter-input"
        :class="{ 'sn-cascader__filter-input--empty': isSelectionEmpty }"
        :placeholder="isSelectionEmpty ? placeholder : ''"
        :disabled="disabled"
        :readonly="readonly || !isMenuOpen"
        aria-label="Type to filter options"
        aria-autocomplete="list"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        :aria-controls="isMenuOpen ? menuId : undefined"
        :aria-activedescendant="activeDescendant ?? undefined"
        :tabindex="-1"
        autocomplete="off"
        @click.stop
        @input="onFilterInput"
        @keydown.stop="onKeyDown"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <!-- Suffix area: clear button | arrow -->
    <div class="sn-cascader__suffix">
      <button
        v-if="clearable && !isSelectionEmpty && isInteractive"
        type="button"
        class="sn-cascader__clear"
        aria-label="Clear selection"
        :tabindex="-1"
        @mousedown.prevent
        @click.stop="clearSelection"
      >
        <SnIcon :icon="CloseIcon" :size="11" />
      </button>
      <span
        v-else
        class="sn-cascader__arrow"
        :class="{ 'sn-cascader__arrow--up': isMenuOpen }"
        aria-hidden="true"
      >
        <SnIcon :icon="ChevronDownIcon" :size="13" />
      </span>
    </div>

    <!-- Dropdown: cascading columns (or the filter match list) -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="isMenuOpen"
          :id="menuId"
          ref="menuRef"
          :class="['sn-cascader-menu', `sn-cascader-menu--${placement}`]"
          :style="menuStyle"
          @mousedown.prevent
        >
          <div v-if="showEmptyState" class="sn-cascader-menu__empty">
            <slot name="empty">{{ emptyText }}</slot>
          </div>
          <div v-else-if="isFiltering" class="sn-cascader-menu__columns">
            <div
              class="sn-cascader-menu__column"
              role="listbox"
              aria-label="Matching options"
              :aria-multiselectable="multiple ? 'true' : undefined"
            >
              <div
                v-for="node in filteredLeaves"
                :key="node.key"
                :id="optionDomId(node)"
                :class="optionClasses(node)"
                role="option"
                :aria-selected="isNodeSelected(node) ? 'true' : 'false'"
                :aria-disabled="node.disabled ? 'true' : undefined"
                :data-key="node.key"
                :title="pathText(node)"
                @click="onOptionClick(node)"
                @mouseenter="onOptionMouseEnter(node)"
              >
                <span
                  v-if="multiple"
                  :class="checkboxClasses(node)"
                  aria-hidden="true"
                  @click.stop="onCheckboxClick(node)"
                >
                  <span
                    v-if="nodeCheckState(node) === 'all'"
                    class="sn-cascader-option__checkbox-tick"
                  />
                  <span
                    v-else-if="nodeCheckState(node) === 'some'"
                    class="sn-cascader-option__checkbox-dash"
                  />
                </span>
                <span class="sn-cascader-option__label">{{ pathText(node) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="sn-cascader-menu__columns">
            <div
              v-for="(column, columnIndex) in expandedColumns"
              :key="columnIndex"
              class="sn-cascader-menu__column"
              role="listbox"
              :aria-label="`Level ${columnIndex + 1}`"
              :aria-multiselectable="multiple ? 'true' : undefined"
            >
              <div
                v-for="node in column"
                :key="node.key"
                :id="optionDomId(node)"
                :class="optionClasses(node)"
                role="option"
                :aria-selected="isNodeSelected(node) ? 'true' : 'false'"
                :aria-disabled="node.disabled ? 'true' : undefined"
                :data-key="node.key"
                :title="node.label"
                @click="onOptionClick(node)"
                @mouseenter="onOptionMouseEnter(node)"
              >
                <span
                  v-if="multiple"
                  :class="checkboxClasses(node)"
                  aria-hidden="true"
                  @click.stop="onCheckboxClick(node)"
                >
                  <span
                    v-if="nodeCheckState(node) === 'all'"
                    class="sn-cascader-option__checkbox-tick"
                  />
                  <span
                    v-else-if="nodeCheckState(node) === 'some'"
                    class="sn-cascader-option__checkbox-dash"
                  />
                </span>
                <span class="sn-cascader-option__label">{{ node.label }}</span>
                <span v-if="!node.isLeaf" class="sn-cascader-option__expand" aria-hidden="true">
                  <SnIcon :icon="ChevronRightIcon" :size="12" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnCascader — web-end cascader component.
 *
 * Reference library: naive-ui `n-cascader`
 *   (https://www.naiveui.com/zh-CN/light/components/cascader)
 * Props + semantics mirror n-cascader's main surface.
 *
 * Parity (this version, single-select + tree-check core):
 *   - modelValue: single mode binds one full leaf path (root-first array of
 *     values); multiple mode binds an array of leaf paths; clear commits an
 *     empty value either way
 *   - options: tree options ({ label, value, disabled?, children? }) with
 *     labelField / valueField / childrenField remapping
 *   - placeholder / clearable / filterable / disabled / readonly / size /
 *     status / expandTrigger ('click' | 'hover')
 *   - multiple: checkbox cascade — a checked parent commits every selectable
 *     descendant leaf path; trigger renders one removable tag per committed
 *     path (maxTagCount collapses the rest into `+N`); the menu stays open
 *     while toggling
 *   - filterable: built-in case-insensitive match on the FULL path text
 *     (labels joined with ' / '), so matching a parent keeps its leaves;
 *     matches render as a flat list of full-path rows
 *   - keyboard: Enter select-or-open / Space open / ArrowUp+Down move the
 *     highlight in the active column / ArrowRight expand + enter the child
 *     column / ArrowLeft collapse to the parent column / Esc close
 *   - events: update:modelValue, change, clear, focus, blur
 *   - slot: empty
 *   - a11y: role=combobox trigger + role=listbox per column, aria-expanded,
 *     aria-activedescendant, aria-selected / aria-disabled per option,
 *     aria-multiselectable per column in multiple mode
 *
 * Dropdown positioning: absolute coordinates against the trigger rect
 * (bottom preferred, flips to top when the viewport lacks room — the same
 * simplified strategy SnSelect / SnTooltip document; no full popper).
 *
 * Hover expansion (expandTrigger='hover') only binds mouseenter on option
 * rows rendered by this SFC's template — those listeners die with the DOM,
 * so no manual cleanup is needed. The only document-level listener is the
 * outside-click mousedown, removed in onBeforeUnmount (§41/§42).
 *
 * Per AGENTS.md §30/31: props / events / slots / tokens / accessibility
 * declared below; CSS uses `--sn-web-cascader-*` aliases +
 * `--sn-web-color-*` fallbacks only.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../icon/SnIcon.vue';
import { useOverlayFollow } from '../_internal/use-overlay-follow';
import { ChevronDownIcon, ChevronRightIcon, CloseIcon } from './sn-cascader-icons';
import {
  cascaderPathKey,
  collectCascaderLeaves,
  collectSelectableLeaves,
  defaultCascaderFilter,
  findPathByValues,
  keyChainOf,
  normalizeCascaderOptions,
  type SnCascaderExpandTrigger,
  type SnCascaderNode,
  type SnCascaderOptionInput,
  type SnCascaderPath,
  type SnCascaderSize,
  type SnCascaderStatus,
  type SnCascaderValue,
} from './sn-cascader-types';

defineOptions({ name: 'SnCascader' });

const props = withDefaults(
  defineProps<{
    /**
     * Bound value. Single mode: one full leaf path (root-first). Multiple
     * mode: an array of leaf paths. Clear commits an empty value either way.
     */
    modelValue?: Array<SnCascaderValue> | Array<Array<SnCascaderValue>> | null;
    /** Tree option list ({ label, value, disabled?, children? }). */
    options?: SnCascaderOptionInput[];
    /** Label key remapping for object options. */
    labelField?: string;
    /** Value key remapping for object options. */
    valueField?: string;
    /** Children key remapping for object options. */
    childrenField?: string;
    /** Placeholder text when empty. */
    placeholder?: string;
    /** Show the clear (×) button when a value is present. */
    clearable?: boolean;
    /** Enable the internal filter input (matches on the full path text). */
    filterable?: boolean;
    /** Disables interaction. */
    disabled?: boolean;
    /** Read-only — opens nothing, commits nothing. */
    readonly?: boolean;
    /** Visual size preset. */
    size?: SnCascaderSize;
    /** Validation-driven visual status. */
    status?: SnCascaderStatus;
    /** How parent nodes expand the next column. */
    expandTrigger?: SnCascaderExpandTrigger;
    /**
     * Multiple selection (tree check) mode — every row renders a checkbox;
     * checking a parent cascades to all of its selectable descendant leaves
     * and `modelValue` holds one path per committed leaf.
     */
    multiple?: boolean;
    /** Max visible tags before the rest collapse into `+N` (multiple only). */
    maxTagCount?: number | undefined;
    /** Accessible name for the trigger. */
    ariaLabel?: string;
    /** Empty-state text (overridden by the `empty` slot). */
    emptyText?: string;
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    labelField: 'label',
    valueField: 'value',
    childrenField: 'children',
    placeholder: 'Please select',
    clearable: false,
    filterable: false,
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
    expandTrigger: 'click',
    multiple: false,
    maxTagCount: undefined,
    ariaLabel: '',
    emptyText: 'No options',
  },
);

const emit = defineEmits<{
  /** v-model sync — one leaf path (single) or an array of leaf paths (multiple). */
  (e: 'update:modelValue', value: SnCascaderPath | SnCascaderPath[]): void;
  /** Selection committed (also fires for clear). */
  (e: 'change', value: SnCascaderPath | SnCascaderPath[]): void;
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

/** Display separator between path labels in the trigger + filter rows. */
const PATH_SEPARATOR = ' / ';

/* ─────────── Option normalization (pure, deterministic) ─────────── */

const normalizedNodes = computed<SnCascaderNode[]>(() =>
  normalizeCascaderOptions(props.options, {
    labelField: props.labelField,
    valueField: props.valueField,
    childrenField: props.childrenField,
  }),
);

/* ─────────── Selection echo ─────────── */

/** True elements of a single-mode bound value (string | number). */
function isValueEntry(entry: unknown): entry is SnCascaderValue {
  return typeof entry === 'string' || typeof entry === 'number';
}

/** Single-mode bound path (null in multiple mode or for malformed values). */
const singleBoundPath = computed<SnCascaderPath | null>(() => {
  if (props.multiple) return null;
  const value: unknown = props.modelValue;
  if (!Array.isArray(value) || value.length === 0) return null;
  return value.every(isValueEntry) ? value : null;
});

const selectedPath = computed<SnCascaderNode[] | null>(() => {
  const path = singleBoundPath.value;
  if (path === null) return null;
  return findPathByValues(normalizedNodes.value, path);
});

/** Multiple-mode bound leaf paths (malformed entries are ignored). */
const selectedPaths = computed<SnCascaderPath[]>(() => {
  if (!props.multiple) return [];
  const value: unknown = props.modelValue;
  if (!Array.isArray(value)) return [];
  return value.filter(
    (entry): entry is SnCascaderPath => Array.isArray(entry) && entry.every(isValueEntry),
  );
});

/** Keys of the committed leaf paths — checkbox state source. */
const checkedLeafKeys = computed<Set<string>>(
  () => new Set(selectedPaths.value.map((path) => cascaderPathKey(path))),
);

const selectedKey = computed<string | null>(
  () => selectedPath.value?.[selectedPath.value.length - 1]?.key ?? null,
);

const selectedLabel = computed<string | null>(() =>
  selectedPath.value === null
    ? null
    : selectedPath.value.map((node) => node.label).join(PATH_SEPARATOR),
);

/** Empty in the active mode — drives the placeholder + filter input echo. */
const isSelectionEmpty = computed(() =>
  props.multiple ? selectedPaths.value.length === 0 : selectedPath.value === null,
);

/** Resolved trigger tags — one per committed path; unknown paths skipped. */
const selectedTags = computed<{ key: string; values: SnCascaderPath; label: string }[]>(() =>
  selectedPaths.value.flatMap((path) => {
    const nodes = findPathByValues(normalizedNodes.value, path);
    if (nodes === null) return [];
    return [
      {
        key: cascaderPathKey(path),
        values: [...path],
        label: nodes.map((node) => node.label).join(PATH_SEPARATOR),
      },
    ];
  }),
);

/** Tags visible before maxTagCount collapses the rest into `+N`. */
const visibleTags = computed(() => {
  if (props.maxTagCount === undefined || props.maxTagCount < 0) return selectedTags.value;
  return selectedTags.value.slice(0, props.maxTagCount);
});

const restTagCount = computed(() => {
  if (props.maxTagCount === undefined || props.maxTagCount < 0) return 0;
  return Math.max(0, selectedTags.value.length - props.maxTagCount);
});

/* ─────────── Filter state ─────────── */

const query = ref('');
const filterInputRef = ref<HTMLInputElement | null>(null);

const isFiltering = computed(() => props.filterable && query.value !== '');

const filteredLeaves = computed<SnCascaderNode[]>(() => {
  if (!isFiltering.value) return [];
  return collectCascaderLeaves(normalizedNodes.value).filter((node) =>
    defaultCascaderFilter(query.value, node.pathLabels.join(PATH_SEPARATOR)),
  );
});

const showEmptyState = computed(() =>
  isFiltering.value ? filteredLeaves.value.length === 0 : normalizedNodes.value.length === 0,
);

/* ─────────── Open state ─────────── */

const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const isMenuOpen = ref(false);
const isFocused = ref(false);
/** Keys of the expanded ancestors (root-first) — the columns spine. */
const expandedKeys = ref<string[]>([]);
/** Keyboard-active column index (0 = root level). */
const activeColumn = ref(0);
/** Keyboard / hover highlight target (aria-activedescendant source). */
const pendingKey = ref<string | null>(null);

const isInteractive = computed(() => !props.disabled && !props.readonly);

/** Module-level counter so every SnCascader instance owns a unique menu id. */
let cascaderInstanceSeed = 0;
const instanceId = ++cascaderInstanceSeed;
const menuId = `sn-cascader-menu-${instanceId}`;

/** DOM id for one option row (aria-activedescendant target). */
function optionDomId(node: SnCascaderNode): string {
  return `sn-cascader-option-${instanceId}-${node.key}`;
}

const activeDescendant = computed<string | null>(() => {
  if (!isMenuOpen.value || pendingKey.value === null) return null;
  return `sn-cascader-option-${instanceId}-${pendingKey.value}`;
});

/** Visible columns: the root list plus every expanded ancestor's children. */
const expandedColumns = computed<SnCascaderNode[][]>(() => {
  const columns: SnCascaderNode[][] = [normalizedNodes.value];
  let level = normalizedNodes.value;
  for (const key of expandedKeys.value) {
    const parent = level.find((node) => node.key === key);
    if (parent === undefined || parent.isLeaf) break;
    columns.push(parent.children);
    level = parent.children;
  }
  return columns;
});

/** Resolve an index-path key back to its node (walks the tree by index). */
function nodeAtKey(key: string): SnCascaderNode | null {
  let level = normalizedNodes.value;
  let node: SnCascaderNode | null = null;
  for (const part of key.split('-')) {
    const index = Number(part);
    const next = level[index];
    if (next === undefined) return null;
    node = next;
    level = next.children;
  }
  return node;
}

/** Visual selected tint — single: committed leaf; multiple: checked leaf. */
function isNodeVisuallySelected(node: SnCascaderNode): boolean {
  if (!props.multiple) return node.key === selectedKey.value;
  return node.isLeaf && checkedLeafKeys.value.has(cascaderPathKey(node.pathValues));
}

/** aria-selected source — single: committed leaf; multiple: check state. */
function isNodeSelected(node: SnCascaderNode): boolean {
  if (!props.multiple) return node.key === selectedKey.value;
  return nodeCheckState(node) === 'all';
}

/** Checkbox state of one row — 'all' | 'some' | 'none' (multiple mode). */
function nodeCheckState(node: SnCascaderNode): 'all' | 'some' | 'none' {
  if (node.isLeaf) {
    return checkedLeafKeys.value.has(cascaderPathKey(node.pathValues)) ? 'all' : 'none';
  }
  const leaves = collectSelectableLeaves(node);
  if (leaves.length === 0) return 'none';
  const checkedCount = leaves.filter((leaf) =>
    checkedLeafKeys.value.has(cascaderPathKey(leaf.pathValues)),
  ).length;
  if (checkedCount === 0) return 'none';
  return checkedCount === leaves.length ? 'all' : 'some';
}

/** Checkbox box classes for one row (multiple mode only). */
function checkboxClasses(node: SnCascaderNode): Array<string | Record<string, boolean>> {
  const state = nodeCheckState(node);
  const checkable = node.isLeaf || collectSelectableLeaves(node).length > 0;
  return [
    'sn-cascader-option__checkbox',
    {
      'sn-cascader-option__checkbox--checked': state === 'all',
      'sn-cascader-option__checkbox--indeterminate': state === 'some',
      'sn-cascader-option__checkbox--disabled': node.disabled || !checkable,
    },
  ];
}

function optionClasses(node: SnCascaderNode): Array<string | Record<string, boolean>> {
  return [
    'sn-cascader-option',
    `sn-cascader-option--${props.size}`,
    {
      'sn-cascader-option--selected': isNodeVisuallySelected(node),
      'sn-cascader-option--in-path': !node.isLeaf && expandedKeys.value.includes(node.key),
      'sn-cascader-option--pending': node.key === pendingKey.value,
      'sn-cascader-option--disabled': node.disabled,
    },
  ];
}

function pathText(node: SnCascaderNode): string {
  return node.pathLabels.join(PATH_SEPARATOR);
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

  // Width: at least the trigger width.
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
  // Reopen on the committed selection. Single: the bound path's ancestors
  // re-expand and the leaf is highlighted. Multiple: the first bound path
  // (if any) re-expands so its checked rows are visible.
  const path = selectedPath.value;
  const firstBoundPath = selectedPaths.value[0];
  const firstCheckedPath =
    props.multiple && path === null && firstBoundPath !== undefined
      ? findPathByValues(normalizedNodes.value, firstBoundPath)
      : null;
  const openPath = path ?? firstCheckedPath;
  if (openPath !== null && openPath.length > 0) {
    expandedKeys.value = openPath.slice(0, -1).map((node) => node.key);
    activeColumn.value = expandedKeys.value.length;
    pendingKey.value = openPath[openPath.length - 1]?.key ?? null;
  } else {
    expandedKeys.value = [];
    activeColumn.value = 0;
    pendingKey.value = null;
  }
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
  expandedKeys.value = [];
  activeColumn.value = 0;
  pendingKey.value = null;
}

/* ─────────── Expansion ─────────── */

function expandNode(node: SnCascaderNode, focusFirstChild: boolean): void {
  if (node.isLeaf || node.disabled) return;
  expandedKeys.value = keyChainOf(node.key);
  activeColumn.value = node.depth + 1;
  if (focusFirstChild) {
    const childColumn = expandedColumns.value[node.depth + 1] ?? [];
    const first = childColumn.find((child) => !child.disabled);
    pendingKey.value = first?.key ?? null;
  } else {
    pendingKey.value = node.key;
  }
}

/* ─────────── Selection commit ─────────── */

function emitChange(next: SnCascaderPath | SnCascaderPath[]): void {
  emit('update:modelValue', next);
  emit('change', next);
}

function chooseNode(node: SnCascaderNode): void {
  if (!isInteractive.value || node.disabled || !node.isLeaf) return;
  // Multiple mode: row click toggles the check and keeps the menu open.
  if (props.multiple) {
    toggleLeaf(node);
    return;
  }
  emitChange([...node.pathValues]);
  closeMenu();
  triggerRef.value?.focus();
}

/* ─────────── Multiple (tree check) commit ─────────── */

/** Toggle one leaf path in the bound array (menu stays open). */
function toggleLeaf(node: SnCascaderNode): void {
  const key = cascaderPathKey(node.pathValues);
  const exists = checkedLeafKeys.value.has(key);
  emitChange(
    exists
      ? selectedPaths.value.filter((path) => cascaderPathKey(path) !== key)
      : [...selectedPaths.value, [...node.pathValues]],
  );
}

/** Toggle a parent — cascade all of its selectable descendant leaf paths. */
function toggleParent(node: SnCascaderNode): void {
  const leaves = collectSelectableLeaves(node);
  if (leaves.length === 0) return;
  const allChecked = leaves.every((leaf) =>
    checkedLeafKeys.value.has(cascaderPathKey(leaf.pathValues)),
  );
  if (allChecked) {
    const removing = new Set(leaves.map((leaf) => cascaderPathKey(leaf.pathValues)));
    emitChange(selectedPaths.value.filter((path) => !removing.has(cascaderPathKey(path))));
    return;
  }
  const additions = leaves
    .filter((leaf) => !checkedLeafKeys.value.has(cascaderPathKey(leaf.pathValues)))
    .map((leaf) => [...leaf.pathValues]);
  emitChange([...selectedPaths.value, ...additions]);
}

/** Checkbox click — leaf toggles itself, parent cascades its subtree. */
function onCheckboxClick(node: SnCascaderNode): void {
  if (!isInteractive.value || node.disabled) return;
  if (node.isLeaf) toggleLeaf(node);
  else toggleParent(node);
}

/** Remove one committed path via its trigger tag close button. */
function removeTag(path: SnCascaderPath): void {
  if (!isInteractive.value) return;
  const key = cascaderPathKey(path);
  emitChange(selectedPaths.value.filter((entry) => cascaderPathKey(entry) !== key));
}

function clearSelection(): void {
  if (!isInteractive.value) return;
  emitChange([]);
  emit('clear');
}

/* ─────────── Option row events ─────────── */

function onOptionClick(node: SnCascaderNode): void {
  if (node.disabled) return;
  if (node.isLeaf) {
    chooseNode(node);
    return;
  }
  // Parents expand on click in both trigger modes (harmless under hover).
  expandNode(node, true);
}

function onOptionMouseEnter(node: SnCascaderNode): void {
  if (node.disabled) return;
  pendingKey.value = node.key;
  if (props.expandTrigger === 'hover' && !node.isLeaf && !expandedKeys.value.includes(node.key)) {
    expandNode(node, false);
  }
}

/* ─────────── Keyboard ─────────── */

/** Selectable nodes of the current keyboard context (filter list or column). */
function currentSelectableNodes(): SnCascaderNode[] {
  if (isFiltering.value) return filteredLeaves.value.filter((node) => !node.disabled);
  const column = expandedColumns.value[activeColumn.value] ?? [];
  return column.filter((node) => !node.disabled);
}

function movePending(delta: 1 | -1): void {
  const list = currentSelectableNodes();
  if (list.length === 0) return;
  const currentIndex = list.findIndex((node) => node.key === pendingKey.value);
  const nextIndex =
    currentIndex === -1
      ? delta > 0
        ? 0
        : list.length - 1
      : (currentIndex + delta + list.length) % list.length;
  const next = list[nextIndex];
  pendingKey.value = next?.key ?? null;
}

function activatePending(): void {
  if (pendingKey.value === null) return;
  const node = nodeAtKey(pendingKey.value);
  if (node === null) return;
  if (node.isLeaf) chooseNode(node);
  else expandNode(node, true);
}

function moveColumnLeft(): void {
  if (isFiltering.value) return;
  const current = activeColumn.value;
  if (current <= 0) return;
  // The parent being collapsed back into — it becomes the highlight target.
  const collapsingParentKey = expandedKeys.value[current - 1];
  expandedKeys.value = expandedKeys.value.slice(0, current - 1);
  activeColumn.value = current - 1;
  if (collapsingParentKey !== undefined) pendingKey.value = collapsingParentKey;
}

function onKeyDown(event: KeyboardEvent): void {
  if (!isInteractive.value) return;
  // Space inside the filter input must type a space, not toggle the menu.
  if (event.target === filterInputRef.value && event.key === ' ') return;
  switch (event.key) {
    case 'Enter': {
      event.preventDefault();
      if (!isMenuOpen.value) openMenu();
      else activatePending();
      break;
    }
    case ' ':
    case 'Spacebar': {
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
      if (isMenuOpen.value) {
        event.preventDefault();
        if (pendingKey.value !== null) {
          const node = nodeAtKey(pendingKey.value);
          if (node !== null && !node.isLeaf) expandNode(node, true);
        }
      }
      break;
    }
    case 'ArrowLeft': {
      if (isMenuOpen.value) {
        event.preventDefault();
        moveColumnLeft();
      }
      break;
    }
    case 'Escape': {
      if (isMenuOpen.value) {
        event.preventDefault();
        closeMenu();
      }
      break;
    }
    default:
      break;
  }
}

/* ─────────── Trigger events ─────────── */

function onTriggerMouseDown(event: MouseEvent): void {
  // Keep focus on the trigger (or filter input) — but let the filter input
  // receive the caret while the menu is open.
  if (props.filterable && isMenuOpen.value) return;
  event.preventDefault();
}

function onTriggerClick(): void {
  if (!isInteractive.value) return;
  if (isMenuOpen.value) closeMenu();
  else openMenu();
}

function onFilterInput(): void {
  // Jump the highlight to the first selectable match (filter rows).
  pendingKey.value = filteredLeaves.value.find((node) => !node.disabled)?.key ?? null;
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
    // Options swapped — re-measure the open menu.
    if (isMenuOpen.value) void nextTick(() => void repositionMenu());
  },
);

watch(isMenuOpen, (open) => {
  if (open) void nextTick(() => void repositionMenu());
});
</script>

<style scoped>
.sn-cascader {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

.sn-cascader__selection {
  display: inline-flex;
  align-items: center;
  min-height: var(--sn-web-cascader-height, 34px);
  padding: 0 var(--sn-web-cascader-padding-x, 10px);
  width: var(--sn-web-cascader-width, 100%);
  box-sizing: border-box;
  border: 1px solid var(--sn-web-cascader-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-cascader-radius, 6px);
  background-color: var(--sn-web-cascader-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-cascader-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  transition:
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
  outline: none;
}

/* Suffix overlap guard: leave room for the arrow / clear button. */
.sn-cascader__selection {
  padding-right: calc(var(--sn-web-cascader-padding-x, 10px) + 22px);
}

/* Multiple mode: tag rows wrap and the trigger grows vertically. */
.sn-cascader--multiple .sn-cascader__selection {
  min-height: var(--sn-web-cascader-height, 34px);
  height: auto;
  padding-top: 2px;
  padding-bottom: 2px;
  cursor: pointer;
}

/* Tag pills — one per committed leaf path (mirror SnSelect tags). */
.sn-cascader__tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: calc(var(--sn-web-cascader-height, 34px) - 10px);
  max-width: 100%;
  padding: 0 var(--sn-web-cascader-tag-padding-x, 6px);
  border-radius: var(--sn-web-cascader-tag-radius, 4px);
  background-color: var(--sn-web-cascader-tag-bg, var(--sn-web-color-background-soft));
  color: var(--sn-web-cascader-tag-text-color, var(--sn-web-color-text-primary));
  font-size: calc(1em - 1px);
  line-height: 1;
  white-space: nowrap;
  box-sizing: border-box;
}

.sn-cascader__tag-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sn-cascader__tag--rest {
  background-color: transparent;
  border: 1px solid var(--sn-web-cascader-tag-rest-border-color, var(--sn-web-color-border-default));
}

.sn-cascader__tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-cascader-tag-close-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
  transition:
    color 0.15s ease-out,
    background-color 0.15s ease-out;
}

.sn-cascader__tag-close:hover {
  color: var(--sn-web-cascader-tag-close-color-hover, var(--sn-web-color-text-primary));
  background-color: var(
    --sn-web-cascader-tag-close-bg-hover,
    var(--sn-web-color-background-surface-hover)
  );
}

.sn-cascader__selection:focus-visible {
  border-color: var(--sn-web-cascader-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

.sn-cascader--active .sn-cascader__selection {
  border-color: var(--sn-web-cascader-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Sizes — height + font-size presets (mirror SnSelect). */
.sn-cascader--mini {
  --sn-web-cascader-height: 22px;
  font-size: 11px;
}
.sn-cascader--tiny {
  --sn-web-cascader-height: 24px;
  font-size: 12px;
}
.sn-cascader--small {
  --sn-web-cascader-height: 28px;
  font-size: 13px;
}
.sn-cascader--medium {
  --sn-web-cascader-height: 32px;
  font-size: 14px;
}
.sn-cascader--large {
  --sn-web-cascader-height: 40px;
  font-size: 15px;
}

.sn-cascader__placeholder {
  color: var(--sn-web-cascader-placeholder-color, var(--sn-web-color-text-tertiary));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

.sn-cascader__single-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

/* Internal filter input — sits inline after the committed label. */
.sn-cascader__filter-input {
  flex: 1;
  min-width: 1px;
  height: calc(var(--sn-web-cascader-height, 32px) - 8px);
  border: none;
  outline: none;
  padding: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
}

.sn-cascader__filter-input::placeholder {
  color: var(--sn-web-cascader-placeholder-color, var(--sn-web-color-text-tertiary));
}

/* No committed value: the input takes the whole row and shows the placeholder. */
.sn-cascader__filter-input--empty {
  width: 100%;
}

/* Suffix: clear / arrow */
.sn-cascader__suffix {
  position: absolute;
  right: var(--sn-web-cascader-suffix-right, 8px);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.sn-cascader__suffix > * {
  pointer-events: auto;
}

.sn-cascader__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-cascader-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
}

.sn-cascader__clear:hover {
  color: var(--sn-web-cascader-clear-color-hover, var(--sn-web-color-text-primary));
  background-color: var(
    --sn-web-cascader-clear-bg-hover,
    var(--sn-web-color-background-surface-hover)
  );
}

.sn-cascader__arrow {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-cascader-arrow-color, var(--sn-web-color-text-tertiary));
  transition: transform 0.18s ease-out;
}

.sn-cascader__arrow--up {
  transform: rotate(180deg);
}

/* Disabled / readonly */
.sn-cascader--disabled .sn-cascader__selection {
  cursor: not-allowed;
  background-color: var(--sn-web-cascader-bg-disabled, var(--sn-web-color-background-soft));
  color: var(--sn-web-cascader-text-color-disabled, var(--sn-web-color-text-disabled));
  border-color: var(--sn-web-cascader-border-color-disabled, var(--sn-web-color-border-subtle));
}

.sn-cascader--disabled .sn-cascader__placeholder {
  color: var(--sn-web-cascader-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-cascader--readonly .sn-cascader__selection {
  cursor: default;
  background-color: var(--sn-web-cascader-bg-readonly, var(--sn-web-color-background-soft));
}

/* Status */
.sn-cascader--status-error .sn-cascader__selection {
  border-color: var(--sn-web-color-feedback-danger);
}

.sn-cascader--status-warning .sn-cascader__selection {
  border-color: var(--sn-web-color-feedback-warning);
}
</style>

<style scoped>
/* Dropdown menu — teleported to body, so it needs its own (non-scoped-alias)
 * class names. Teleported nodes still receive the scoped attribute, so both
 * blocks live in the same SFC; a second <style scoped> keeps menu rules
 * grouped separately from trigger rules. */
.sn-cascader-menu {
  position: fixed;
  z-index: var(--sn-web-cascader-menu-z-index, 1000);
  min-width: 120px;
  padding: 4px 0;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-cascader-menu-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--sn-web-cascader-menu-radius, 3px);
  background-color: var(--sn-web-cascader-menu-bg, var(--sn-web-color-background-elevated));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-cascader-menu-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  font-family: inherit;
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-cascader-menu--bottom {
  transform-origin: center top;
}

.sn-cascader-menu--top {
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

.sn-cascader-menu__columns {
  display: flex;
  align-items: stretch;
  max-height: var(--sn-web-cascader-menu-max-height, 260px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Fixed per-column width — does NOT adapt to content (naive-ui parity);
 * long labels ellipsize inside the row instead of stretching the panel. */
.sn-cascader-menu__column {
  width: var(--sn-web-cascader-column-width, 160px);
  flex-shrink: 0;
  padding: 2px 0;
  box-sizing: border-box;
}

.sn-cascader-menu__column + .sn-cascader-menu__column {
  border-left: 1px solid
    var(--sn-web-cascader-menu-divider-color, var(--sn-web-color-border-subtle));
}

.sn-cascader-menu__empty {
  padding: 12px var(--sn-web-cascader-option-padding-x, 10px);
  min-width: var(--sn-web-cascader-column-width, 160px);
  text-align: center;
  font-size: calc(1em - 1px);
  color: var(--sn-web-cascader-empty-color, var(--sn-web-color-text-tertiary));
}

/* Option rows */
.sn-cascader-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 var(--sn-web-cascader-option-padding-x, 10px);
  min-height: var(--sn-web-cascader-option-height, 34px);
  box-sizing: border-box;
  font-family: inherit;
  font-size: var(--sn-web-cascader-option-font-size, 14px);
  line-height: 1.4;
  color: var(--sn-web-cascader-option-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  white-space: nowrap;
}

.sn-cascader-option__label {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multiple-mode checkbox — presentational glyph (the row itself carries the
 * option semantics); tick / dash scale in like SnCheckbox's mark. */
.sn-cascader-option__checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--sn-web-cascader-checkbox-size, 14px);
  height: var(--sn-web-cascader-checkbox-size, 14px);
  border: 1px solid var(--sn-web-cascader-checkbox-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-cascader-checkbox-radius, 3px);
  background-color: var(--sn-web-cascader-checkbox-bg, var(--sn-web-color-background-surface));
  box-sizing: border-box;
  transition:
    background-color 0.18s ease-out,
    border-color 0.18s ease-out;
}

.sn-cascader-option__checkbox-tick {
  width: 7px;
  height: 4px;
  margin-top: -2px;
  border-left: 2px solid
    var(--sn-web-cascader-checkbox-check-color, var(--sn-web-color-text-on-primary));
  border-bottom: 2px solid
    var(--sn-web-cascader-checkbox-check-color, var(--sn-web-color-text-on-primary));
  transform: rotate(-45deg);
}

.sn-cascader-option__checkbox-dash {
  width: 8px;
  height: 0;
  border-bottom: 2px solid
    var(--sn-web-cascader-checkbox-check-color, var(--sn-web-color-text-on-primary));
}

.sn-cascader-option__checkbox--checked,
.sn-cascader-option__checkbox--indeterminate {
  background-color: var(--sn-web-cascader-checkbox-bg-checked, var(--sn-web-color-action-primary));
  border-color: var(
    --sn-web-cascader-checkbox-border-color-checked,
    var(--sn-web-color-action-primary)
  );
}

.sn-cascader-option--disabled .sn-cascader-option__checkbox {
  background-color: var(
    --sn-web-cascader-checkbox-bg-disabled,
    var(--sn-web-color-background-soft)
  );
  border-color: var(
    --sn-web-cascader-checkbox-border-color-disabled,
    var(--sn-web-color-border-subtle)
  );
}

.sn-cascader-option__expand {
  align-items: center;
  margin-left: auto;
  color: var(--sn-web-cascader-option-expand-color, var(--sn-web-color-text-tertiary));
}

/* Pending (keyboard / hover highlight) — soft fill, no border change. */
.sn-cascader-option--pending {
  background-color: var(
    --sn-web-cascader-option-bg-hover,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04))
  );
}

/* Expanded ancestor — text accent marks the walked path. */
.sn-cascader-option--in-path {
  color: var(--sn-web-cascader-option-text-color-in-path, var(--sn-web-color-action-primary));
  font-weight: 500;
}

/* Selected leaf — primary-tinted fill; the leading accent bar doubles as
 * the check-mark affordance without an icon glyph. */
.sn-cascader-option--selected {
  background-color: var(
    --sn-web-cascader-option-bg-selected,
    var(--sn-web-color-action-primary-soft)
  );
  color: var(--sn-web-cascader-option-text-color-selected, var(--sn-web-color-action-primary));
  font-weight: 500;
}

.sn-cascader-option--selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: var(--sn-web-cascader-option-selected-bar-width, 3px);
  border-radius: var(--sn-web-cascader-radius, 6px);
  background-color: var(
    --sn-web-cascader-option-selected-bar-color,
    var(--sn-web-color-action-primary)
  );
}

.sn-cascader-option--disabled {
  cursor: not-allowed;
  color: var(--sn-web-cascader-option-text-color-disabled, var(--sn-web-color-text-disabled));
  background-color: transparent;
}

.sn-cascader-option--disabled.sn-cascader-option--selected {
  background-color: var(
    --sn-web-cascader-option-bg-selected-disabled,
    var(--sn-web-color-background-soft)
  );
  color: var(--sn-web-cascader-option-text-color-disabled, var(--sn-web-color-text-disabled));
}

/* Size presets — shrink row height / font as the trigger shrinks. */
.sn-cascader-option--mini {
  min-height: var(--sn-web-cascader-option-height, 26px);
  font-size: 11px;
}
.sn-cascader-option--tiny {
  min-height: var(--sn-web-cascader-option-height, 28px);
  font-size: 12px;
}
.sn-cascader-option--small {
  min-height: var(--sn-web-cascader-option-height, 30px);
  font-size: 13px;
}
.sn-cascader-option--medium {
  min-height: var(--sn-web-cascader-option-height, 34px);
  font-size: 14px;
}
.sn-cascader-option--large {
  min-height: var(--sn-web-cascader-option-height, 40px);
  font-size: 15px;
}
</style>
