<script setup lang="ts">
/**
 * SnProSearch — generic menu search box of @snui/admin-layout.
 *
 * A shared layout piece (not tied to any single layout style): every layout
 * that wants a "search the menu" box composes this one, so the matching rules
 * live in exactly one place (`searchMenuOptions`, pure + unit-tested).
 *
 * Behaviour:
 *   - flat result list of *menu hits* — each row shows the matched label plus
 *     its ancestor trail (`系统管理 / 用户管理`), so the location is obvious;
 *   - opens while focused + query length >= `minLength`;
 *   - `↓` / `↑` walk the list (wrapping), `Enter` activates, `Esc` dismisses;
 *   - rows use `mousedown.prevent` so the field keeps focus and the click wins
 *     against the blur that would otherwise close the panel first;
 *   - choosing a row only emits `select(key, item)` — **navigation stays in the
 *     host** (`router.push`), same boundary as every other piece of this package.
 *
 * The package stays i18n-free: every string arrives through a prop with a
 * built-in Chinese default.
 */
import { computed, ref, useId, watch } from 'vue';
import { Search } from 'lucide-vue-next';
import { SnInput } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';
import { searchMenuOptions } from '../menu/sn-menu-search';
import type { MenuSearchOptions, SnProMenuHit } from '../menu/sn-menu-search';

defineOptions({ name: 'SnProSearch' });

const props = withDefaults(
  defineProps<{
    /** Menu tree to search (the layout's `menus`). */
    menus?: SnMenuOption[] | undefined;
    /** Controlled query text (`v-model`). Omitted → the field keeps its own. */
    modelValue?: string | undefined;
    /** Placeholder text. */
    placeholder?: string | undefined;
    /** Minimum (trimmed) query length before the panel opens. Default 1. */
    minLength?: number | undefined;
    /** Maximum number of hits offered. Default 10. */
    maxResults?: number | undefined;
    /** Field size preset (forwarded to SnInput). Default 'medium'. */
    size?: 'small' | 'medium' | 'large' | undefined;
    /** Show the clear (×) button. Default true. */
    clearable?: boolean | undefined;
    /** Disable the field entirely. Default false. */
    disabled?: boolean | undefined;
    /** Accessible label of the field / result list. */
    searchLabel?: string | undefined;
    /** Copy shown when the query matches nothing. */
    emptyText?: string | undefined;
    /** Offer group rows (nodes with children) as results too. Default false. */
    includeGroups?: boolean | undefined;
    /** Extra predicate over matched hits — see {@link MenuSearchOptions}. */
    filter?: ((query: string, hit: SnProMenuHit) => boolean) | undefined;
    /** Close the panel after a hit is chosen. Default true. */
    closeOnSelect?: boolean | undefined;
  }>(),
  {
    menus: () => [],
    // Explicit undefined keeps the field uncontrolled when the host omits
    // `v-model` (same pattern as SnProLayout's collapsed prop).
    modelValue: undefined,
    placeholder: '搜索菜单',
    minLength: 1,
    maxResults: 10,
    size: 'medium',
    clearable: true,
    disabled: false,
    searchLabel: '搜索菜单',
    emptyText: '没有匹配的菜单',
    includeGroups: false,
    filter: undefined,
    closeOnSelect: true,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  /** Every keystroke, with the raw query. */
  (e: 'search', query: string): void;
  /** A hit was activated — the HOST navigates. */
  (e: 'select', key: string | number, item: SnMenuOption): void;
  (e: 'open'): void;
  (e: 'close'): void;
}>();

// ── Query state: controlled (v-model) with an uncontrolled fallback ──────
const innerQuery = ref('');
const query = computed(() => props.modelValue ?? innerQuery.value);

function setQuery(value: string): void {
  innerQuery.value = value;
  emit('update:modelValue', value);
}

// ── Visibility ───────────────────────────────────────────────────────────
/** Focus/dismiss state. Separate from `focused` so Esc can dismiss while the
 * field keeps focus (naive-ui's search/select behaviour). */
const openState = ref(false);
const trimmedLength = computed(() => query.value.trim().length);
const panelVisible = computed(
  () => !props.disabled && openState.value && trimmedLength.value >= props.minLength,
);

// ── Hits ─────────────────────────────────────────────────────────────────
const hits = computed<SnProMenuHit[]>(() => {
  if (trimmedLength.value < props.minLength) return [];
  const base: MenuSearchOptions = {
    maxResults: props.maxResults,
    includeGroups: props.includeGroups,
  };
  const config: MenuSearchOptions =
    props.filter === undefined ? base : { ...base, filter: props.filter };
  return searchMenuOptions(props.menus, query.value, config);
});

const activeIndex = ref(0);

// Reset the highlight whenever the result set or the query changes, so the
// first row is highlighted for the freshly typed query.
watch([hits, query], () => {
  activeIndex.value = 0;
});

watch(panelVisible, (visible, previous) => {
  if (visible === previous) return;
  if (visible) emit('open');
  else emit('close');
});

// ── Interaction ──────────────────────────────────────────────────────────
function onFocus(): void {
  openState.value = true;
}

function onBlur(): void {
  openState.value = false;
}

function onInput(value: string | number): void {
  const next = String(value);
  setQuery(next);
  openState.value = true;
  emit('search', next);
}

function onClear(): void {
  setQuery('');
  openState.value = false;
  emit('search', '');
}

function move(delta: number): void {
  const count = hits.value.length;
  if (count === 0) return;
  activeIndex.value = (activeIndex.value + delta + count) % count;
}

function choose(hit: SnProMenuHit): void {
  // `path` is inclusive — the last entry IS the matched node (the value the
  // host maps to a route).
  const item = hit.path[hit.path.length - 1];
  if (item === undefined) return;
  emit('select', hit.key, item);
  if (props.closeOnSelect) openState.value = false;
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    if (panelVisible.value) openState.value = false;
    return;
  }
  if (!panelVisible.value) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    move(1);
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    move(-1);
    return;
  }
  if (event.key === 'Enter') {
    const hit = hits.value[activeIndex.value];
    if (hit === undefined) return;
    event.preventDefault();
    choose(hit);
  }
}

// ── A11y wiring ──────────────────────────────────────────────────────────
const listboxId = `sn-pro-search-${useId()}`;

function optionId(index: number): string {
  return `${listboxId}-option-${index}`;
}

const activeDescendant = computed<string | null>(() =>
  panelVisible.value && hits.value[activeIndex.value] !== undefined
    ? optionId(activeIndex.value)
    : null,
);

/** Ancestor trail above the matched node, e.g. `系统管理 / 审计日志`. */
function pathText(hit: SnProMenuHit): string {
  return hit.path
    .slice(0, -1)
    .map((node) => node.label)
    .join(' / ');
}
</script>

<template>
  <!-- keydown is bound on this wrapper (not on SnInput) so the native keydown
       of the inner <input> is caught by bubbling, whatever SnInput does with
       its own attribute fallthrough. -->
  <div class="sn-pro-search" :class="{ 'sn-pro-search--open': panelVisible }" @keydown="onKeydown">
    <SnInput
      :model-value="query"
      type="search"
      :size="props.size"
      :placeholder="props.placeholder"
      :clearable="props.clearable"
      :disabled="props.disabled"
      :aria-label="props.searchLabel"
      role="combobox"
      aria-autocomplete="list"
      :aria-controls="listboxId"
      :aria-expanded="panelVisible ? 'true' : 'false'"
      :aria-activedescendant="activeDescendant ?? undefined"
      @update:model-value="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @clear="onClear"
    >
      <template #prefix>
        <Search :size="16" aria-hidden="true" />
      </template>
    </SnInput>

    <div v-if="panelVisible" class="sn-pro-search__panel">
      <ul
        :id="listboxId"
        class="sn-pro-search__list"
        role="listbox"
        :aria-label="props.searchLabel"
      >
        <li
          v-for="(hit, index) in hits"
          :id="optionId(index)"
          :key="hit.key"
          class="sn-pro-search__option"
          :class="{ 'sn-pro-search__option--active': index === activeIndex }"
          role="option"
          :aria-selected="index === activeIndex"
          @mousedown.prevent="choose(hit)"
          @mouseenter="activeIndex = index"
        >
          <span class="sn-pro-search__option-label">{{ hit.label }}</span>
          <span v-if="hit.path.length > 1" class="sn-pro-search__option-path">
            {{ pathText(hit) }}
          </span>
        </li>
      </ul>
      <p v-if="hits.length === 0" class="sn-pro-search__empty">{{ props.emptyText }}</p>
    </div>
  </div>
</template>

<style scoped>
.sn-pro-search {
  position: relative;
  width: 100%;
  min-width: 0;
}

.sn-pro-search__panel {
  position: absolute;
  top: calc(100% + var(--sn-web-spacing-1));
  right: 0;
  left: 0;
  z-index: 20;
  box-sizing: border-box;
  max-height: 280px;
  overflow-y: auto;
  padding: var(--sn-web-spacing-2);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-md);
  background-color: var(--sn-web-color-background-elevated);
  box-shadow: var(--sn-web-shadow-lg, 0 6px 16px rgba(0, 0, 0, 0.12));
}

.sn-pro-search__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sn-pro-search__option {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border-radius: var(--sn-web-radius-sm);
  cursor: pointer;
}

.sn-pro-search__option--active {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-pro-search__option-label {
  font-size: var(--sn-web-font-size-sm);
  color: var(--sn-web-color-text-primary);
}

.sn-pro-search__option-path {
  overflow: hidden;
  font-size: var(--sn-web-font-size-xs);
  color: var(--sn-web-color-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-pro-search__empty {
  margin: 0;
  padding: var(--sn-web-spacing-3);
  font-size: var(--sn-web-font-size-sm);
  color: var(--sn-web-color-text-tertiary);
  text-align: center;
}
</style>
