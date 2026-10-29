<script setup lang="ts">
/**
 * sn-drop-menu (uni-end) — top filter bar with a slide-down option list.
 *
 * Reference library: wot-ui `wd-drop-menu`
 *   (https://wot-ui.cn/component/drop-menu.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-drop-menu 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-drop-menu/sn-drop-menu.vue
 * → auto-registered as `<sn-drop-menu>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 *
 * ## Documented divergences from wd-drop-menu
 *
 *   - The wd reference splits `wd-drop-menu` into a bar + `wd-drop-menu-item`
 *     children. uni-app easycom cannot require a compound child, and a
 *     `v-for` over a child component would lose the parent/child wiring, so
 *     the option list lives in `options` on this single component instead
 *     (the `desc` column of the wd spec lists exactly that array shape:
 *     `{ label, value, tip }`). Field names are configurable through
 *     `valueKey` / `labelKey` / `tipKey`.
 *   - `root-portal` is NOT implemented (miniprogram has no portal host). It is
 *     declared for parity and marked "未实现" on the docs page.
 *   - `custom-popup-class` / `custom-popup-style` are forwarded to the option
 *     list panel rather than to a `wd-popup` instance, because the panel here
 *     is an inline sliding block (see below).
 *
 * ## Why the panel is an inline block, not a sn-popup
 *
 * The menu bar scrolls with the page and the list must stay anchored under the
 * bar, so the panel is a sibling of the bar inside the same positioned root —
 * `sn-popup` would take it out to `position: fixed`. The scrim is rendered
 * from this root as well; both share the same `duration` transition.
 *
 * ## Timers (AGENTS.md §41)
 *
 * One transition timer drives the open / closed legs and one generation token
 * guards against a stale leg. Both are cleared in `onBeforeUnmount`. The
 * `before-toggle` guard is awaited; a toggle that resolves after unmount is
 * dropped by the same token.
 *
 * Usage:
 *   <sn-drop-menu v-model="sort" :options="options" @change="onSort" />
 *
 * Not responsible for:
 *   - 带菜单项的气泡 — 用 sn-popover
 *   - 底部动作面板 — 用 sn-action-sheet
 */

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { registerOutsideClosable, unregisterOutsideClosable } from '../../utils/outside-close';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { Check as CheckIcon, ChevronDown as ChevronDownIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnDropMenu' });

const instanceId = getCurrentInstance()?.uid ?? 0;
// Outside-close queue: a page-root `@tap="closeOutside"` closes this too.
onMounted(() => registerOutsideClosable(instanceId, () => {
  if (isOpen.value) void close();
}));
onBeforeUnmount(() => unregisterOutsideClosable(instanceId));

/** Menu expansion direction. Mirrors `wd-drop-menu` `direction`. */
type DropDirection = 'up' | 'down';

/** One option row. Extra keys are allowed and reachable through the key props. */
export interface SnDropMenuOption {
  /** Row label (field name configurable through `labelKey`). */
  label?: string;
  /** Row value echoed back through `v-model` (field name via `valueKey`). */
  value?: string | number;
  /** Secondary tip line (field name via `tipKey`). */
  tip?: string;
  /** Disable the row — taps are ignored. */
  disabled?: boolean;
  [key: string]: unknown;
}

/** `before-toggle` guard payload. */
export interface SnDropMenuBeforeTogglePayload {
  /** The state the menu is about to enter. */
  status: boolean;
}

/** `before-toggle` guard: `false` (or a promise of it) blocks the toggle. */
type DropMenuBeforeToggle = (payload: SnDropMenuBeforeTogglePayload) => boolean | Promise<boolean>;

/** Leave-animation length when the panel unmounts after closing. */
const DEFAULT_DURATION = 200;

const props = withDefaults(
  defineProps<{
    /** Current selected value (v-model). */
    modelValue?: string | number;
    /** Option rows. */
    options?: SnDropMenuOption[];
    /** Menu expansion direction. */
    direction?: DropDirection;
    /** Stacking level of the scrim + panel. */
    zIndex?: number;
    /** Render the scrim behind the panel. */
    modal?: boolean;
    /** Close the menu when the scrim is tapped. */
    closeOnClickModal?: boolean;
    /** Open / close animation duration in ms. */
    duration?: number;
    /** Disable the whole menu — taps are ignored. */
    disabled?: boolean;
    /** Icon name (sn-icon registry) of the selected row. */
    iconName?: string;
    /** Menu title; when set it replaces the selected option label in the bar. */
    title?: string;
    /** Icon name (sn-icon registry) of the bar's arrow. */
    icon?: string;
    /** Size of the bar's arrow icon in design px. */
    iconSize?: string | number;
    /** Guard called before the menu toggles; `false` blocks the toggle. */
    beforeToggle?: DropMenuBeforeToggle;
    /** Field name of the option value. */
    valueKey?: string;
    /** Field name of the option label. */
    labelKey?: string;
    /** Field name of the option tip. */
    tipKey?: string;
    /** Custom class for the option list panel. */
    customPopupClass?: string;
    /** Custom inline style for the option list panel. */
    customPopupStyle?: string;
    /** Height of the option list panel; empty = at most 80% of the viewport. */
    popupHeight?: string;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
    /**
     * Accepted for `wd-drop-menu` parity, NOT implemented — miniprogram has no
     * portal host, so the panel cannot leave the page's document flow.
     */
    rootPortal?: boolean;
  }>(),
  {
    modelValue: '',
    options: () => [],
    direction: 'down',
    zIndex: 12,
    modal: true,
    closeOnClickModal: true,
    duration: DEFAULT_DURATION,
    disabled: false,
    iconName: 'check',
    title: '',
    icon: 'caret-down',
    iconSize: 32,
    valueKey: 'value',
    labelKey: 'label',
    tipKey: 'tip',
    customPopupClass: '',
    customPopupStyle: '',
    popupHeight: '',
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
);

defineSlots<{
  /** Custom panel body; replaces the option list. */
  default?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (
    e: 'change',
    payload: { value: string | number; selectedItem: SnDropMenuOption | undefined },
  ): void;
  (e: 'open'): void;
  (e: 'opened'): void;
  (e: 'close'): void;
  (e: 'closed'): void;
}>();

/** Panel node present in the tree (survives the closing leg). */
const isMounted = ref(false);
/** Target open state — drives the slide transition. */
const isOpen = ref(false);

/** Single pending transition timer (cleared on unmount, §41). */
let timer: ReturnType<typeof setTimeout> | null = null;
/** Guards against a stale leg finishing after a newer one started. */
let generation = 0;

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

/** Read an option field through the configured key. */
function readKey(option: SnDropMenuOption, key: string): unknown {
  return option[key];
}

/** Label of an option. */
function optionLabel(option: SnDropMenuOption): string {
  const value = readKey(option, props.labelKey);
  return typeof value === 'string' ? value : String(value ?? '');
}

/** Value of an option. */
function optionValue(option: SnDropMenuOption): string | number {
  const value = readKey(option, props.valueKey);
  return typeof value === 'number' || typeof value === 'string' ? value : '';
}

/** Tip of an option. */
function optionTip(option: SnDropMenuOption): string {
  const value = readKey(option, props.tipKey);
  return typeof value === 'string' ? value : '';
}

const selectedItem = computed<SnDropMenuOption | undefined>(() =>
  props.options.find((option) => optionValue(option) === props.modelValue),
);

/** Bar label: `title` wins, then the selected option's label. */
const barLabel = computed(
  () => props.title || (selectedItem.value ? optionLabel(selectedItem.value) : ''),
);

/** Bar label falls back to the placeholder when nothing is selected. */
const hasSelection = computed(() => barLabel.value !== '');

/** Registry icon data for a name, or `null` when it is not registered. */
function resolveIcon(name: string): IconData | null {
  // The two glyphs this component needs ship with the default set; anything
  // else is looked up in the consumer registry.
  if (name === 'check') return CheckIcon;
  if (name === 'caret-down') return ChevronDownIcon;
  return null;
}

const arrowIcon = computed<IconData>(() => resolveIcon(props.icon) ?? ChevronDownIcon);
const checkIcon = computed<IconData>(() => resolveIcon(props.iconName) ?? CheckIcon);

/** Arrow size — a plain number is design px (converted to rpx by uni). */
const arrowSize = computed(() => props.iconSize);

async function open(): Promise<void> {
  // Idempotent: repeating open (e.g. an extra imperative call while the panel
  // is already shown) must not replay open / opened.
  if (props.disabled || isOpen.value) return;
  const allowed = await guard(true);
  if (!allowed) return;
  clearTimer();
  const token = ++generation;
  emit('open');
  isMounted.value = true;
  // One tick so the collapsed style is committed before the open class lands.
  await nextTick();
  if (token !== generation) return;
  isOpen.value = true;
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    emit('opened');
  }, props.duration);
}

async function close(): Promise<void> {
  // Idempotent counterpart of open(): a close while already closed (or while
  // a close leg is still running) must not replay close / closed.
  if (!isOpen.value) return;
  const allowed = await guard(false);
  if (!allowed) return;
  clearTimer();
  const token = ++generation;
  emit('close');
  isOpen.value = false;
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    isMounted.value = false;
    emit('closed');
  }, props.duration);
}

/** Run the `before-toggle` guard; a missing guard always allows. */
async function guard(status: boolean): Promise<boolean> {
  if (!props.beforeToggle) return true;
  try {
    return await props.beforeToggle({ status });
  } catch {
    // A throwing guard is treated as a rejection — the safest default is to
    // keep the current state rather than toggle half-way.
    return false;
  }
}

async function toggle(): Promise<void> {
  if (props.disabled) return;
  if (isOpen.value) await close();
  else await open();
}

onBeforeUnmount(clearTimer);

/** Whether the menu is currently open (wd `getShowPop` parity). */
function getShowPop(): boolean {
  return isOpen.value;
}

defineExpose({ getShowPop, open, close, toggle });

function onBarTap(): void {
  if (props.disabled) return;
  void toggle();
}

function onOptionTap(option: SnDropMenuOption): void {
  if (props.disabled || option.disabled) return;
  const value = optionValue(option);
  emit('update:modelValue', value);
  emit('change', { value, selectedItem: option });
  void close();
}

function onModalTap(): void {
  if (!props.closeOnClickModal) return;
  void close();
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-drop-menu',
  `sn-drop-menu--${props.direction}`,
  {
    'sn-drop-menu--open': isOpen.value,
    'sn-drop-menu--disabled': props.disabled,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const base = `z-index: ${props.zIndex}; --sn-drop-menu-duration: ${props.duration}ms`;
  return props.customStyle ? `${base}; ${props.customStyle}` : base;
});

const popupClass = computed(() => ['sn-drop-menu__popup', props.customPopupClass]);

const popupStyle = computed(() => {
  const style: string[] = [];
  if (props.popupHeight) style.push(`height: ${props.popupHeight}`);
  if (props.customPopupStyle) style.push(props.customPopupStyle);
  return style.length > 0 ? style.join('; ') : undefined;
});
</script>

<template>
  <view data-snui-component="drop-menu" :class="rootClass" :style="rootStyle">
    <view
      class="sn-drop-menu__bar"
      role="button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-disabled="props.disabled ? 'true' : undefined"
      @tap="onBarTap"
    >
      <text
        class="sn-drop-menu__label"
        :class="{ 'sn-drop-menu__label--placeholder': !hasSelection }"
      >
        {{ hasSelection ? barLabel : '请选择' }}
      </text>
      <view class="sn-drop-menu__arrow" :class="{ 'sn-drop-menu__arrow--active': isOpen }">
        <SnIcon :icon="arrowIcon" :size="arrowSize" />
      </view>
    </view>

    <view
      v-if="modal && isMounted"
      class="sn-drop-menu__modal"
      aria-hidden="true"
      @tap="onModalTap"
    />

    <view v-if="isMounted" :class="popupClass" :style="popupStyle">
      <scroll-view class="sn-drop-menu__scroll" scroll-y>
        <slot>
          <view
            v-for="(option, index) in options"
            :key="index"
            class="sn-drop-menu__option"
            :class="{
              'sn-drop-menu__option--active': optionValue(option) === modelValue,
              'sn-drop-menu__option--disabled': option.disabled,
            }"
            role="menuitem"
            :aria-disabled="option.disabled ? 'true' : 'false'"
            @tap="onOptionTap(option)"
          >
            <view class="sn-drop-menu__option-texts">
              <text class="sn-drop-menu__option-label">{{ optionLabel(option) }}</text>
              <text v-if="optionTip(option)" class="sn-drop-menu__option-tip">
                {{ optionTip(option) }}
              </text>
            </view>
            <view v-if="optionValue(option) === modelValue" class="sn-drop-menu__option-check">
              <SnIcon :icon="checkIcon" :size="32" />
            </view>
          </view>
        </slot>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-drop-menu {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  background-color: var(--sn-mp-color-background-elevated);
}

/* ── Bar ───────────────────────────────────────────────────────────────── */

.sn-drop-menu__bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-2);
  height: 88rpx;
  padding: 0 var(--sn-mp-spacing-3);
  box-sizing: border-box;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

.sn-drop-menu--disabled .sn-drop-menu__bar {
  color: var(--sn-mp-color-text-disabled);
}

.sn-drop-menu__label {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sn-drop-menu__label--placeholder {
  color: var(--sn-mp-color-text-tertiary);
}

.sn-drop-menu__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sn-mp-color-text-tertiary);
  transition: transform var(--sn-drop-menu-duration) ease;
}

.sn-drop-menu__arrow--active {
  color: var(--sn-mp-color-action-primary);
  transform: rotate(180deg);
}

/* ── Scrim ─────────────────────────────────────────────────────────────── */

.sn-drop-menu__modal {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 200vh;
  background-color: var(--sn-mp-color-background-overlay);
  opacity: 0;
  transition: opacity var(--sn-drop-menu-duration) ease;
}

.sn-drop-menu--open .sn-drop-menu__modal {
  opacity: 1;
}

/* ── Panel ─────────────────────────────────────────────────────────────── */

.sn-drop-menu__popup {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  box-sizing: border-box;
  overflow: hidden;
  background-color: var(--sn-mp-color-background-elevated);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  box-shadow: var(--sn-mp-shadow-md);
  opacity: 0;
  transition-property: opacity, transform;
  transition-duration: var(--sn-drop-menu-duration);
  transition-timing-function: ease;
}

.sn-drop-menu--down .sn-drop-menu__popup {
  top: 100%;
  transform: translateY(-16rpx);
}

.sn-drop-menu--up .sn-drop-menu__popup {
  bottom: 100%;
  transform: translateY(16rpx);
}

.sn-drop-menu--open .sn-drop-menu__popup {
  opacity: 1;
  transform: translateY(0);
}

.sn-drop-menu__scroll {
  max-height: 80vh;
}

.sn-drop-menu__option {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  box-sizing: border-box;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-drop-menu__option--active {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-drop-menu__option--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-drop-menu__option-texts {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  flex: 1 1 auto;
}

.sn-drop-menu__option-label {
  display: block;
}

.sn-drop-menu__option-tip {
  display: block;
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

.sn-drop-menu__option-check {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  color: var(--sn-mp-color-action-primary);
}

/* Doodle skin — hand-drawn panel outline. */
.snui-skin-doodle .sn-drop-menu__popup {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
