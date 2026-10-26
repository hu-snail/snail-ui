<template>
  <div
    ref="rootRef"
    :class="[
      'sn-select',
      `sn-select--${size}`,
      {
        'sn-select--multiple': multiple,
        'sn-select--filterable': filterable,
        'sn-select--tag': tag,
        'sn-select--disabled': disabled,
        'sn-select--readonly': readonly,
        'sn-select--focused': isFocused,
        'sn-select--active': isMenuOpen,
        [`sn-select--status-${status}`]: status !== 'default',
        'sn-select--empty': isSelectionEmpty,
      },
      customClass,
    ]"
    :data-snui-component="'select'"
    :data-size="size"
    :data-status="status"
    :data-multiple="multiple ? 'true' : undefined"
    :style="wrapperStyle || undefined"
  >
    <div
      :class="['sn-select__selection', { 'sn-select__selection--multiple': multiple }]"
      role="combobox"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      :aria-controls="isMenuOpen ? menuId : undefined"
      :aria-activedescendant="activeDescendant ?? undefined"
      :aria-label="ariaLabel || label || 'Select'"
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
      <template v-if="multiple">
        <span v-for="item in visibleSelectedTags" :key="String(item.value)" class="sn-select__tag">
          <span class="sn-select__tag-label">{{ item.label }}</span>
          <button
            v-if="!disabled && !readonly"
            type="button"
            class="sn-select__tag-close"
            :aria-label="`Remove ${item.label}`"
            :tabindex="isFocused ? 0 : -1"
            @mousedown.prevent
            @click.stop="removeTag(item.value)"
          >
            <SnIcon :icon="CloseIcon" :size="9" />
          </button>
        </span>
        <span
          v-if="restTagCount > 0"
          class="sn-select__tag sn-select__tag--rest"
          :aria-label="`${restTagCount} more selected`"
        >
          <span class="sn-select__tag-label">+{{ restTagCount }}</span>
        </span>
      </template>

      <!-- Single: label text -->
      <span v-if="!multiple" class="sn-select__single-value">
        <template v-if="selectedLeafLabel !== null">{{ selectedLeafLabel }}</template>
        <span v-if="selectedLeafLabel === null" class="sn-select__placeholder">{{
          placeholder
        }}</span>
      </span>

      <!-- Multiple + empty: placeholder -->
      <span v-if="multiple && isSelectionEmpty" class="sn-select__placeholder">{{
        placeholder
      }}</span>

      <!-- Filterable internal search input -->
      <input
        v-if="filterable"
        ref="filterInputRef"
        v-model="query"
        type="text"
        class="sn-select__filter-input"
        :class="{ 'sn-select__filter-input--single-empty': !multiple && isSelectionEmpty }"
        :placeholder="
          (!multiple && isSelectionEmpty) || (multiple && isSelectionEmpty) ? placeholder : ''
        "
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
        @keydown="onTriggerKeyDown"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <!-- Suffix area: loading spinner | clear button | arrow -->
    <div class="sn-select__suffix">
      <span
        v-if="loading"
        class="sn-select__loading"
        aria-live="polite"
        aria-label="Loading options"
      >
        <SnIcon :icon="LoadingIcon" :size="13" />
      </span>
      <button
        v-else-if="clearable && !isSelectionEmpty && isInteractive"
        type="button"
        class="sn-select__clear"
        aria-label="Clear selection"
        :tabindex="-1"
        @mousedown.prevent
        @click.stop="clearSelection"
      >
        <SnIcon :icon="CloseIcon" :size="11" />
      </button>
      <span
        v-else
        class="sn-select__arrow"
        :class="{ 'sn-select__arrow--up': isMenuOpen }"
        aria-hidden="true"
      >
        <SnIcon :icon="ChevronDownIcon" :size="13" />
      </span>
    </div>

    <!-- Dropdown menu -->
    <Teleport to="body">
      <Transition name="sn-pop">
        <div
          v-if="isMenuOpen"
          :id="menuId"
          ref="menuRef"
          :class="[
            'sn-select-menu',
            `sn-select-menu--${placement}`,
            {
              'sn-select-menu--tag': tag,
            },
          ]"
          :style="menuStyle"
          role="listbox"
          :aria-label="ariaLabel || label || 'Options'"
          :aria-multiselectable="multiple ? 'true' : undefined"
          @mousedown.prevent
        >
          <div class="sn-select-menu__header">
            <slot name="header" />
          </div>
          <div
            ref="menuBodyRef"
            class="sn-select-menu__body"
            :style="menuBodyStyle"
            @scroll="onMenuScroll"
          >
            <template v-if="hasMenuContent">
              <template v-for="node in filteredNodes" :key="node.key">
                <div
                  v-if="node.kind === 'group'"
                  class="sn-select-menu__group"
                  role="group"
                  :aria-label="node.label"
                >
                  <div class="sn-select-menu__group-label" aria-hidden="true">{{ node.label }}</div>
                  <SnOption
                    v-for="child in node.children"
                    :key="child.key"
                    :label="child.label"
                    :value="child.value"
                    :disabled="child.disabled"
                  />
                </div>
                <SnOption
                  v-else
                  :label="node.label"
                  :value="node.value"
                  :disabled="node.disabled"
                />
              </template>
            </template>
            <div v-else class="sn-select-menu__empty">
              <slot name="empty">{{ emptyText }}</slot>
            </div>
          </div>
          <div class="sn-select-menu__action">
            <slot name="action" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnSelect — web-end select component.
 *
 * Reference library: naive-ui `n-select`
 *   (https://www.naiveui.com/zh-CN/light/components/select)
 * Props + semantics mirror n-select's main surface.
 *
 * Parity (this version):
 *   - modelValue (string | number | boolean | null | Array) / multiple
 *   - options: object options ({ label, value, disabled, children? } with
 *     labelField / valueField / childrenField remapping) or bare values
 *   - placeholder / clearable / disabled / readonly / size / status / tag
 *   - filterable: built-in case-insensitive label match; custom `filter`
 *     replaces it. `remote` keeps the full list mounted and delegates to
 *     the `search` event (host controls `loading` + swaps `options`).
 *   - maxTagCount (number): collapse to `+N`
 *   - loading: spinner replaces the arrow while fetching
 *   - keyboard: Enter select / Space open / ArrowUp+Down move highlight /
 *     Esc close / Backspace removes last tag (multiple)
 *   - events: update:modelValue, update:value, change, search, clear,
 *     focus, blur, scroll (menu bottom reached)
 *   - slots: header / empty / action
 *   - a11y: role=combobox trigger + role=listbox menu, aria-expanded,
 *     aria-activedescendant, aria-selected per option
 *
 * Dropdown positioning: absolute coordinates against the trigger rect
 * (bottom preferred, flips to top when the viewport lacks room — the
 * same simplified strategy SnTooltip documents; no full popper).
 * Horizontal = naive: panel left edge aligns with the trigger left edge;
 * when the panel would cross the viewport's right edge it shifts left so
 * the right edge fits (right-aligned shrink). While open, page/nested
 * scroll + resize re-run the reposition pass (useOverlayFollow).
 *
 * Per AGENTS.md §30/31: props / events / slots / tokens / accessibility
 * declared below; CSS uses `--sn-web-select-*` aliases + `--sn-web-color-*`
 * fallbacks only.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, toRef, watch } from 'vue';
import SnIcon from '../icon/SnIcon.vue';
import SnOption from './SnOption.vue';
import { useOverlayFollow } from '../_internal/use-overlay-follow';
import { ChevronDownIcon, CloseIcon, LoadingIcon } from './sn-select-icons';
import {
  defaultSelectFilter,
  SN_SELECT_MENU_KEY,
  type SnSelectFilter,
  type SnSelectLeafOption,
  type SnSelectMenuNode,
  type SnSelectOptionInput,
  type SnSelectSize,
  type SnSelectStatus,
  type SnSelectValue,
} from './sn-select-types';

defineOptions({ name: 'SnSelect' });

const props = withDefaults(
  defineProps<{
    /** Bound value: single value / null, or array when `multiple`. */
    modelValue?: SnSelectValue | SnSelectValue[] | null;
    /** Allow selecting several values (tag-style display). */
    multiple?: boolean;
    /** Option list: object options or bare values. */
    options?: SnSelectOptionInput[];
    /** Field remapping for object options (naive `label-field`). */
    labelField?: string;
    /** Field remapping for object options (naive `value-field`). */
    valueField?: string;
    /** Field remapping for group children (naive `children-field`). */
    childrenField?: string;
    /** Placeholder text when empty. */
    placeholder?: string;
    /** Show the clear (×) button when a value is present. */
    clearable?: boolean;
    /** Enable the internal filter input. */
    filterable?: boolean;
    /** Custom filter predicate (replaces the default label match). */
    filter?: SnSelectFilter | undefined;
    /** Disables interaction. */
    disabled?: boolean;
    /** Read-only — opens nothing, commits nothing. */
    readonly?: boolean;
    /** Visual size preset. */
    size?: SnSelectSize;
    /** Validation-driven visual status. */
    status?: SnSelectStatus;
    /**
     * Max visible tags before collapsing into `+N` (naive `max-tag-count`;
     * the `'responsive'` variant is simplified to a plain number).
     */
    maxTagCount?: number | undefined;
    /** Tag visual style (naive `tag`) — pill tags for values + menu rows. */
    tag?: boolean;
    /** Show the loading spinner in place of the arrow. */
    loading?: boolean;
    /** Remote search mode: typing emits `search`, host drives options + loading. */
    remote?: boolean;
    /** Accessible name for the trigger (fallback: `label`). */
    ariaLabel?: string;
    /** Accessible label forwarded to the menu listbox. */
    label?: string;
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
    options: () => [],
    labelField: 'label',
    valueField: 'value',
    childrenField: 'children',
    placeholder: 'Please select',
    clearable: false,
    filterable: false,
    filter: undefined,
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
    maxTagCount: undefined,
    tag: false,
    loading: false,
    remote: false,
    ariaLabel: '',
    label: '',
    emptyText: 'No options',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync. */
  (e: 'update:modelValue', value: SnSelectValue | SnSelectValue[] | null): void;
  /** naive-ui's `onUpdate:value` spelling. */
  (e: 'update:value', value: SnSelectValue | SnSelectValue[] | null): void;
  /** Selection committed (also fires for tag removal + clear). */
  (e: 'change', value: SnSelectValue | SnSelectValue[] | null): void;
  /** Filter query changed (`filterable`; every keystroke in `remote` too). */
  (e: 'search', query: string): void;
  /** Clear button activated. */
  (e: 'clear'): void;
  /** Trigger gained focus. */
  (e: 'focus', event: FocusEvent): void;
  /** Trigger lost focus. */
  (e: 'blur', event: FocusEvent): void;
  /** Menu body scrolled to the bottom (naive `scroll`). */
  (e: 'scroll', event: Event): void;
}>();

defineSlots<{
  /** Dropdown top area (naive `header`). */
  header?(): unknown;
  /** Empty state (naive `empty`). */
  empty?(): unknown;
  /** Dropdown bottom area (naive `action`). */
  action?(): unknown;
}>();

/* ─────────── Option normalization ─────────── */

const MENU_MAX_HEIGHT = 260;

/** Coerce a raw option entry into its label / value / disabled / children fields. */
function readOptionFields(
  raw: SnSelectOptionInput,
  index: number,
): {
  label: string;
  value: SnSelectValue;
  disabled: boolean;
  children: SnSelectOptionInput[] | undefined;
} {
  if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
    return { label: String(raw), value: raw, disabled: false, children: undefined };
  }
  const obj = raw;
  const labelRaw: unknown = obj[props.labelField];
  const valueRaw: unknown = obj[props.valueField];
  const disabledRaw: unknown = obj['disabled'];
  const childrenRaw: unknown = obj[props.childrenField];
  const children = Array.isArray(childrenRaw) ? (childrenRaw as SnSelectOptionInput[]) : undefined;
  const value: SnSelectValue =
    typeof valueRaw === 'string' || typeof valueRaw === 'number' || typeof valueRaw === 'boolean'
      ? valueRaw
      : index;
  return {
    label: labelRaw === undefined || labelRaw === null ? String(value) : String(labelRaw),
    value,
    disabled: disabledRaw === true,
    children,
  };
}

/** Normalize the `options` prop into leaf/group menu nodes (deterministic, pure). */
const normalizedNodes = computed<SnSelectMenuNode[]>(() => {
  const out: SnSelectMenuNode[] = [];
  props.options.forEach((raw, index) => {
    const fields = readOptionFields(raw, index);
    if (fields.children && fields.children.length > 0) {
      const children: SnSelectLeafOption[] = fields.children.map((childRaw, childIndex) => {
        const child = readOptionFields(childRaw, childIndex);
        return {
          kind: 'leaf',
          key: `${index}-${childIndex}`,
          label: child.label,
          value: child.value,
          disabled: child.disabled,
        };
      });
      out.push({
        kind: 'group',
        key: `g-${index}`,
        label: fields.label,
        children,
      });
    } else {
      out.push({
        kind: 'leaf',
        key: `${index}`,
        label: fields.label,
        value: fields.value,
        disabled: fields.disabled,
      });
    }
  });
  return out;
});

/** Flat selectable leaves (groups flattened, order preserved). */
const flatLeaves = computed<SnSelectLeafOption[]>(() => {
  const out: SnSelectLeafOption[] = [];
  for (const node of normalizedNodes.value) {
    if (node.kind === 'group') out.push(...node.children);
    else out.push(node);
  }
  return out;
});

/* ─────────── Selection state ─────────── */

/** Current selection as an array view regardless of mode. */
const selectedValues = computed<ReadonlyArray<SnSelectValue>>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : [];
  }
  const single: SnSelectValue | null | SnSelectValue[] = props.modelValue;
  if (single === null || single === undefined || Array.isArray(single)) return [];
  return [single];
});

const isSelectionEmpty = computed(() => selectedValues.value.length === 0);

/** Lookup from value -> label for tag display + single label. */
const labelByValue = computed<Map<SnSelectValue, string>>(() => {
  const map = new Map<SnSelectValue, string>();
  for (const leaf of flatLeaves.value) {
    if (!map.has(leaf.value)) map.set(leaf.value, leaf.label);
  }
  return map;
});

function labelFor(value: SnSelectValue): string {
  return labelByValue.value.get(value) ?? String(value);
}

/** Single-select display label (null → placeholder). */
const selectedLeafLabel = computed<string | null>(() => {
  if (props.multiple || isSelectionEmpty.value) return null;
  return labelFor(selectedValues.value[0] as SnSelectValue);
});

/** Tags visible before `maxTagCount` collapses the rest. */
const visibleSelectedTags = computed<Array<{ value: SnSelectValue; label: string }>>(() => {
  if (!props.multiple) return [];
  const list = selectedValues.value.map((value) => ({ value, label: labelFor(value) }));
  if (props.maxTagCount === undefined || props.maxTagCount < 0) return list;
  return list.slice(0, props.maxTagCount);
});

const restTagCount = computed<number>(() => {
  if (!props.multiple || props.maxTagCount === undefined || props.maxTagCount < 0) return 0;
  return Math.max(0, selectedValues.value.length - props.maxTagCount);
});

/* ─────────── Filter state ─────────── */

const query = ref('');
const filterInputRef = ref<HTMLInputElement | null>(null);

/** Nodes filtered by the current query (groups with zero surviving children drop out). */
const filteredNodes = computed<SnSelectMenuNode[]>(() => {
  // Remote mode: the host owns filtering (it swaps `options` on `search`);
  // the built-in filter must not hide rows it did not filter.
  if (query.value === '' || props.remote) return normalizedNodes.value;
  const predicate: SnSelectFilter = props.filter ?? defaultSelectFilter;
  const out: SnSelectMenuNode[] = [];
  for (const node of normalizedNodes.value) {
    if (node.kind === 'group') {
      const children = node.children.filter((child) => predicate(query.value, child));
      if (children.length > 0) {
        out.push({ ...node, children });
      }
    } else if (predicate(query.value, node)) {
      out.push(node);
    }
  }
  return out;
});

const hasMenuContent = computed(() => filteredNodes.value.length > 0);

/* ─────────── Open state ─────────── */

const rootRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const menuBodyRef = ref<HTMLElement | null>(null);

const isMenuOpen = ref(false);
const isFocused = ref(false);
const pendingValue = ref<SnSelectValue | null>(null);
const pendingIndex = ref(-1);

/** Selectable (non-disabled) leaves within the current filtered view. */
const selectableLeaves = computed<SnSelectLeafOption[]>(() => {
  const out: SnSelectLeafOption[] = [];
  for (const node of filteredNodes.value) {
    if (node.kind === 'group') {
      for (const child of node.children) {
        if (!child.disabled) out.push(child);
      }
    } else if (!node.disabled) {
      out.push(node);
    }
  }
  return out;
});

const isInteractive = computed(() => !props.disabled && !props.readonly);

/** Module-level counter so every SnSelect instance owns a unique menu id. */
let selectInstanceSeed = 0;
const instanceId = ++selectInstanceSeed;
const menuId = `sn-select-menu-${instanceId}`;

/** DOM id for one option row (aria-activedescendant target). */
function optionId(value: SnSelectValue): string {
  const index = selectableLeaves.value.findIndex((o) => o.value === value);
  return index === -1 ? '' : `sn-select-option-${instanceId}-${index}`;
}

const activeDescendant = computed<string | null>(() => {
  if (!isMenuOpen.value || pendingValue.value === null) return null;
  const id = optionId(pendingValue.value);
  return id === '' ? null : id;
});

provide(SN_SELECT_MENU_KEY, {
  selectedValues,
  pendingValue,
  menuDisabled: toRef(props, 'disabled'),
  menuSize: toRef(props, 'size'),
  optionId,
  isOptionSelected: (value: SnSelectValue) => selectedValues.value.includes(value),
  chooseOption,
  setPending: (value: SnSelectValue) => {
    pendingValue.value = value;
    pendingIndex.value = selectableLeaves.value.findIndex((o) => o.value === value);
  },
});

/* ─────────── Dropdown positioning (simplified popper) ─────────── */

const MENU_VIEWPORT_GAP = 4;
const placement = ref<'bottom' | 'top'>('bottom');
const menuStyle = ref<Record<string, string>>({});
const menuBodyStyle = computed<Record<string, string>>(() => ({
  'max-height': `${MENU_MAX_HEIGHT}px`,
}));

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

  // Width: at least the trigger width (naive behavior).
  const width = Math.max(rootRect.width, menuWidth);
  const left = Math.min(
    Math.max(MENU_VIEWPORT_GAP, rootRect.left),
    Math.max(MENU_VIEWPORT_GAP, vw - width - MENU_VIEWPORT_GAP),
  );

  // Bottom preferred; flip to top when the viewport lacks room below
  // but has room above.
  const roomBelow = vh - rootRect.bottom;
  const roomAbove = rootRect.top;
  let useTop = false;
  if (roomBelow < menuHeight && roomAbove > roomBelow) useTop = true;
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
  pendingIndex.value = -1;
  pendingValue.value = null;
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
  pendingIndex.value = -1;
  pendingValue.value = null;
}

/* ─────────── Selection commit ─────────── */

function emitChange(next: SnSelectValue | SnSelectValue[] | null): void {
  emit('update:modelValue', next);
  emit('update:value', next);
  emit('change', next);
}

function chooseOption(value: SnSelectValue): void {
  if (!isInteractive.value) return;
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = current.indexOf(value);
    if (index === -1) current.push(value);
    else current.splice(index, 1);
    emitChange(current);
  } else {
    emitChange(value);
    closeMenu();
    rootRef.value?.focus();
  }
}

function removeTag(value: SnSelectValue): void {
  if (!props.multiple || !isInteractive.value) return;
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  const next = current.filter((v) => v !== value);
  emitChange(next);
}

function clearSelection(): void {
  if (!isInteractive.value) return;
  emitChange(props.multiple ? [] : null);
  emit('clear');
}

/* ─────────── Keyboard ─────────── */

function movePending(delta: 1 | -1): void {
  const leaves = selectableLeaves.value;
  if (leaves.length === 0) return;
  let next = pendingIndex.value + delta;
  if (next < 0) next = leaves.length - 1;
  if (next >= leaves.length) next = 0;
  pendingIndex.value = next;
  const leaf = leaves[next];
  if (leaf) {
    pendingValue.value = leaf.value;
    void scrollPendingIntoView(leaf.value);
  }
}

async function scrollPendingIntoView(value: SnSelectValue): Promise<void> {
  await nextTick();
  const body = menuBodyRef.value;
  if (!body) return;
  const row = body.querySelector(`[data-value="${CSS.escape(String(value))}"]`);
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
      if (pendingValue.value !== null) {
        chooseOption(pendingValue.value);
      }
      break;
    }
    case ' ':
    case 'Spacebar': {
      // Space opens the menu but must not scroll the page.
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
    case 'Escape': {
      if (isMenuOpen.value) {
        event.preventDefault();
        closeMenu();
      }
      break;
    }
    case 'Backspace': {
      if (
        props.multiple &&
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
  emit('search', query.value);
  pendingIndex.value = -1;
  pendingValue.value = null;
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false;
  emit('blur', event);
}

/* ─────────── Menu scroll (bottom detection) ─────────── */

function onMenuScroll(event: Event): void {
  const body = menuBodyRef.value;
  if (!body) return;
  // Naive's `scroll` fires on menu bottom reach only — one emit per scroll.
  const nearBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 8;
  if (nearBottom) emit('scroll', event);
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
    // Options swapped (remote search) — re-measure the open menu.
    if (isMenuOpen.value) void nextTick(() => void repositionMenu());
  },
);

watch(isMenuOpen, (open) => {
  if (open) void nextTick(() => void repositionMenu());
});

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});
</script>

<style scoped>
.sn-select {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

.sn-select__selection {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  min-height: var(--sn-web-select-height, 34px);
  padding: 0 var(--sn-web-select-padding-x, 10px);
  width: var(--sn-web-select-width, 100%);
  box-sizing: border-box;
  border: 1px solid var(--sn-web-select-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-select-radius, 6px);
  background-color: var(--sn-web-select-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-select-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  transition:
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
  outline: none;
}

.sn-select__selection:focus-visible {
  border-color: var(--sn-web-select-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

.sn-select--active .sn-select__selection {
  border-color: var(--sn-web-select-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Sizes — height + font-size presets (mirror SnInput). */
.sn-select--mini {
  --sn-web-select-height: 22px;
  font-size: 11px;
}
.sn-select--tiny {
  --sn-web-select-height: 24px;
  font-size: 12px;
}
.sn-select--small {
  --sn-web-select-height: 28px;
  font-size: 13px;
}
.sn-select--medium {
  --sn-web-select-height: 32px;
  font-size: 14px;
}
.sn-select--large {
  --sn-web-select-height: 40px;
  font-size: 15px;
}

/* Multiple rows grow vertically with tags. */
.sn-select--multiple .sn-select__selection {
  min-height: var(--sn-web-select-height, 32px);
  padding-top: 3px;
  padding-bottom: 3px;
  cursor: text;
}

.sn-select__placeholder {
  color: var(--sn-web-select-placeholder-color, var(--sn-web-color-text-tertiary));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

.sn-select__single-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

/* Tag pills */
.sn-select__tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  height: calc(var(--sn-web-select-height, 32px) - 8px);
  padding: 0 var(--sn-web-select-tag-padding-x, 6px);
  border-radius: var(--sn-web-select-tag-radius, var(--sn-web-select-radius, 6px));
  background-color: var(--sn-web-select-tag-bg, var(--sn-web-color-background-soft));
  color: var(--sn-web-select-tag-text-color, var(--sn-web-color-text-primary));
  font-size: calc(1em - 1px);
  line-height: 1;
  white-space: nowrap;
  box-sizing: border-box;
}

.sn-select__tag--rest {
  background-color: transparent;
  border: 1px solid var(--sn-web-select-tag-rest-border-color, var(--sn-web-color-border-default));
}

.sn-select__tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-select-tag-close-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
  transition:
    color 0.15s ease-out,
    background-color 0.15s ease-out;
}

.sn-select__tag-close:hover {
  color: var(--sn-web-select-tag-close-color-hover, var(--sn-web-color-text-primary));
  background-color: var(
    --sn-web-select-tag-close-bg-hover,
    var(--sn-web-color-background-surface-hover)
  );
}

/* Internal filter input — sits inline after tags / value. */
.sn-select__filter-input {
  flex: 1;
  min-width: 1px;
  height: calc(var(--sn-web-select-height, 32px) - 8px);
  border: none;
  outline: none;
  padding: 0;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
}

.sn-select__filter-input::placeholder {
  color: var(--sn-web-select-placeholder-color, var(--sn-web-color-text-tertiary));
}

/* Single + empty: the input takes the whole row (label hidden). */
.sn-select__filter-input--single-empty {
  width: 100%;
}

/* Suffix: loading / clear / arrow */
.sn-select__suffix {
  position: absolute;
  right: var(--sn-web-select-suffix-right, 8px);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.sn-select__suffix > * {
  pointer-events: auto;
}

.sn-select__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-select-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
}

.sn-select__clear:hover {
  color: var(--sn-web-select-clear-color-hover, var(--sn-web-color-text-primary));
  background-color: var(
    --sn-web-select-clear-bg-hover,
    var(--sn-web-color-background-surface-hover)
  );
}

.sn-select__arrow {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-select-arrow-color, var(--sn-web-color-text-tertiary));
  transition: transform 0.18s ease-out;
}

.sn-select__arrow--up {
  transform: rotate(180deg);
}

.sn-select__loading {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-select-loading-color, var(--sn-web-color-action-primary));
  animation: sn-select-spin 0.9s linear infinite;
}

@keyframes sn-select-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Disabled / readonly */
.sn-select--disabled .sn-select__selection {
  cursor: not-allowed;
  background-color: var(--sn-web-select-bg-disabled, var(--sn-web-color-background-soft));
  color: var(--sn-web-select-text-color-disabled, var(--sn-web-color-text-disabled));
  border-color: var(--sn-web-select-border-color-disabled, var(--sn-web-color-border-subtle));
}

.sn-select--disabled .sn-select__placeholder {
  color: var(--sn-web-select-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-select--readonly .sn-select__selection {
  cursor: default;
  background-color: var(--sn-web-select-bg-readonly, var(--sn-web-color-background-soft));
}

/* Status */
.sn-select--status-error .sn-select__selection {
  border-color: var(--sn-web-color-feedback-danger);
}

.sn-select--status-warning .sn-select__selection {
  border-color: var(--sn-web-color-feedback-warning);
}

/* Tag mode: selected value renders as a pill in the trigger too. */
.sn-select--tag:not(.sn-select--multiple) .sn-select__single-value {
  display: inline-flex;
  align-items: center;
  height: calc(var(--sn-web-select-height, 32px) - 8px);
  padding: 0 var(--sn-web-select-tag-padding-x, 6px);
  border-radius: var(--sn-web-select-tag-radius, var(--sn-web-select-radius, 6px));
  background-color: var(--sn-web-select-tag-bg, var(--sn-web-color-background-soft));
}

/* Suffix overlap guard: leave room for the arrow / clear button. */
.sn-select__selection {
  padding-right: calc(var(--sn-web-select-padding-x, 10px) + 22px);
}
</style>

<style scoped>
/* Dropdown menu — teleported to body, so it needs its own (non-scoped-alias)
 * class names. Teleported nodes still receive the scoped attribute, so both
 * blocks live in the same SFC; a second <style scoped> keeps menu rules
 * grouped separately from trigger rules. */
.sn-select-menu {
  position: fixed;
  z-index: var(--sn-web-select-menu-z-index, 1000);
  min-width: 120px;
  padding: 4px 0;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-select-menu-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--sn-web-select-menu-radius, 3px);
  background-color: var(--sn-web-select-menu-bg, var(--sn-web-color-background-elevated));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-select-menu-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  font-family: inherit;
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-select-menu--bottom {
  transform-origin: center top;
}

.sn-select-menu--top {
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

.sn-select-menu__body {
  overflow-y: auto;
  overscroll-behavior: contain;
}

.sn-select-menu__group-label {
  padding: 6px var(--sn-web-select-option-padding-x, 10px) 2px;
  font-size: calc(1em - 2px);
  color: var(--sn-web-select-group-label-color, var(--sn-web-color-text-tertiary));
  white-space: nowrap;
}

.sn-select-menu__empty {
  padding: 12px var(--sn-web-select-option-padding-x, 10px);
  text-align: center;
  font-size: calc(1em - 1px);
  color: var(--sn-web-select-empty-color, var(--sn-web-color-text-tertiary));
}

.sn-select-menu__header:not(:empty),
.sn-select-menu__action:not(:empty) {
  padding: 4px var(--sn-web-select-option-padding-x, 10px);
  border-top: 1px solid var(--sn-web-select-menu-divider-color, var(--sn-web-color-border-subtle));
}

.sn-select-menu__header:not(:empty) {
  border-top: none;
  border-bottom: 1px solid
    var(--sn-web-select-menu-divider-color, var(--sn-web-color-border-subtle));
}
</style>
