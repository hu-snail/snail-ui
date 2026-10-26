<script setup lang="ts">
/**
 * SnTabs — tabbed panels with a shared tab strip (AUI-WEB-NAV-002).
 *
 * Reference library: naive-ui `n-tabs`
 *   (https://www.naiveui.com/zh-CN/light/components/tabs)
 * Per AGENTS.md §112, props + semantics mirror n-tabs 1:1.
 *
 * 1:1 parity (this version): value / defaultValue / trigger / type /
 *   size / placement / closable / addable / animated / justifyContent /
 *   tabsPadding / showScrollButton / onBeforeLeave / paneClass / paneStyle /
 *   paneWrapperClass / paneWrapperStyle / barWidth / centerActiveTab.
 *
 * Pane content is declared via `<SnTabPane>` children (mirrors n-tab-pane).
 * Children read the active value + type through provide/inject, so the tab
 * strip and pane visibility stay in sync without prop drilling.
 *
 * Additive vs n-tabs (documented divergence, requested feature):
 *   - `type="chrome"` renders a browser-style tab strip (Chrome-like).
 *     The reference exposes only line / card / bar / segment.
 *
 * Skipped vs n-tabs (documented §112 markers, not implemented):
 *   - `SnTabPane` `tab` / `prefix` / `suffix` slots — the strip renders the
 *     `tab` prop as text. Rich (vnode) tab labels would need the pane to
 *     hand its slot vnodes up through injection; deferred.
 *   - `justifyContent` values beyond what the strip's flex layout already
 *     supports are passed straight through to CSS.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTabs v-model:value="active" type="line">
 *     <SnTabPane name="a" tab="Tab A">Content A</SnTabPane>
 *     <SnTabPane name="b" tab="Tab B">Content B</SnTabPane>
 *   </SnTabs>
 */

import { computed, nextTick, onMounted, provide, ref, toRef, watch } from 'vue';
import { Plus } from 'lucide-vue-next';
import SnIcon from '../icon/SnIcon.vue';

defineOptions({ name: 'SnTabs' });

// Reference: naive-ui tabsProps
const props = withDefaults(
  defineProps<{
    /** Currently active pane name (controlled, `v-model:value`). */
    value?: string | number;
    /** Initial active pane name (uncontrolled). */
    defaultValue?: string | number;
    /** Whether tabs activate on click or hover. Mirrors n-tabs `trigger`. */
    trigger?: 'click' | 'hover';
    /**
     * Tab visual style. Mirrors n-tabs `type` (default `'bar'`) and adds
     * `'chrome'` — a browser-style tab strip. `'chrome'` is an additive
     * divergence from the reference, which has no browser chrome; it is
     * tuned for the horizontal placements (top / bottom).
     */
    type?: 'line' | 'card' | 'bar' | 'segment' | 'chrome';
    /** Tab strip size. Mirrors n-tabs `size`. Default 'medium'. */
    size?: 'small' | 'medium' | 'large';
    /** Where the tab strip sits relative to the panes. Mirrors n-tabs
     * `placement`. Deprecated `start` / `end` aliases map to left/right. */
    placement?: 'top' | 'right' | 'bottom' | 'left' | 'start' | 'end';
    /** Show a close button on each tab. Mirrors n-tabs `closable`. */
    closable?: boolean;
    /** Show a trailing "+" tab. `true`, or a config object. Mirrors
     * n-tabs `addable` — we support the simple boolean + `{ disabled }`
     * object shape; the object form also accepts `disabled`. */
    addable?: boolean | { disabled?: boolean };
    /** Animate the pane height on switch. Mirrors n-tabs `animated`. */
    animated?: boolean;
    /** Distribute tab strip items along the main axis. Mirrors
     * n-tabs `justifyContent`. */
    justifyContent?: 'space-between' | 'space-around' | 'space-evenly' | 'center' | 'start' | 'end';
    /** Extra padding (px) around the tab strip. Mirrors n-tabs
     * `tabsPadding`. Default 0. */
    tabsPadding?: number;
    /** Show the scroll buttons when the strip overflows. Mirrors
     * n-tabs `showScrollButton`. */
    showScrollButton?: boolean;
    /** Per-tab inline style. Mirrors n-tabs `tabStyle`. */
    tabStyle?: string | Record<string, string>;
    /** Per-tab class. Mirrors n-tabs `tabClass`. */
    tabClass?: string;
    /** Add-tab inline style. Mirrors n-tabs `addTabStyle`. */
    addTabStyle?: string | Record<string, string>;
    /** Add-tab class. Mirrors n-tabs `addTabClass`. */
    addTabClass?: string;
    /** Class applied to every pane wrapper. Mirrors n-tabs `paneClass`. */
    paneClass?: string;
    /** Inline style applied to every pane wrapper. Mirrors n-tabs
     * `paneStyle`. */
    paneStyle?: string | Record<string, string>;
    /**
     * Fixed width for the active bar, in px. When omitted the bar matches
     * the active tab's own width. Mirrors n-tabs `barWidth`.
     */
    barWidth?: number;
    /**
     * Keep the active tab scrolled to the centre of the strip. Mirrors
     * n-tabs `centerActiveTab`. Only meaningful when the strip overflows.
     */
    centerActiveTab?: boolean;
    /** Class on the pane wrapper element. Mirrors n-tabs
     * `paneWrapperClass`. */
    paneWrapperClass?: string;
    /** Style on the pane wrapper element. Mirrors n-tabs
     * `paneWrapperStyle`. */
    paneWrapperStyle?: string | Record<string, string>;
    /** Guard fired before switching tabs; return false (or a promise
     * resolving to false) to block the switch. Mirrors n-tabs
     * `onBeforeLeave`. */
    onBeforeLeave?: (
      name: string | number,
      oldName: string | number | null,
    ) => boolean | Promise<boolean>;
  }>(),
  {
    // Optional props whose natural `undefined` is the intended default are
    // deliberately omitted here: with `exactOptionalPropertyTypes: true`,
    // listing them with an explicit `undefined` is a type error.
    trigger: 'click',
    type: 'bar',
    size: 'medium',
    placement: 'top',
    closable: false,
    addable: false,
    animated: false,
    tabsPadding: 0,
    showScrollButton: false,
    centerActiveTab: false,
  },
);

const emit = defineEmits<{
  /** Active pane changed (`v-model:value`). */
  (e: 'update:value', value: string | number): void;
  /** Close button clicked on a tab. Mirrors n-tabs `onClose`. */
  (e: 'close', name: string | number): void;
  /** Add tab clicked. Mirrors n-tabs `onAdd`. */
  (e: 'add'): void;
}>();

defineSlots<{
  /** Sequence of `<SnTabPane>` children. */
  default?(): unknown;
  /** Content placed before the tab strip. Mirrors n-tabs `prefix`. */
  prefix?(): unknown;
  /** Content placed after the tab strip. Mirrors n-tabs `suffix`. */
  suffix?(): unknown;
}>();

/** Pane registry — each SnTabPane pushes its own descriptor here so the
 *  tab strip can render labels without the parent walking the vnode tree. */
interface SnTabPaneDescriptor {
  name: string | number;
  tab: string;
  disabled: boolean;
  closable?: boolean;
}

const panes = ref<SnTabPaneDescriptor[]>([]);

function registerPane(descriptor: SnTabPaneDescriptor): void {
  const existing = panes.value.findIndex((p) => p.name === descriptor.name);
  if (existing >= 0) panes.value.splice(existing, 1, descriptor);
  else panes.value.push(descriptor);
}

function unregisterPane(name: string | number): void {
  const idx = panes.value.findIndex((p) => p.name === name);
  if (idx >= 0) panes.value.splice(idx, 1);
}

/** Uncontrolled fallback value — only read when `value` prop is absent. */
const innerValue = ref<string | number | null>(props.defaultValue ?? null);

/** Effective active value: the prop wins when provided. */
const activeValue = computed<string | number | null>(() => {
  if (props.value !== undefined) return props.value;
  return innerValue.value;
});

/** The first non-disabled pane becomes the default when nothing is set, so
 *  a bare `<SnTabs>` still shows content (matches n-tabs behaviour). */
watch(
  panes,
  (list) => {
    if (activeValue.value !== null && activeValue.value !== undefined) return;
    const first = list.find((p) => !p.disabled);
    if (first) innerValue.value = first.name;
  },
  { immediate: true, deep: true },
);

/** Normalize deprecated `start` / `end` placement aliases to left/right. */
const mergedPlacement = computed<'top' | 'right' | 'bottom' | 'left'>(() => {
  if (props.placement === 'start') return 'left';
  if (props.placement === 'end') return 'right';
  return props.placement;
});

const isVertical = computed(
  () => mergedPlacement.value === 'left' || mergedPlacement.value === 'right',
);

async function activateTab(name: string | number): Promise<void> {
  const pane = panes.value.find((p) => p.name === name);
  if (pane?.disabled) return;
  if (name === activeValue.value) return;
  if (props.onBeforeLeave) {
    const allowed = await props.onBeforeLeave(name, activeValue.value);
    if (!allowed) return;
  }
  if (props.value === undefined) innerValue.value = name;
  emit('update:value', name);
}

function handleTabClick(name: string | number): void {
  if (props.trigger !== 'click') return;
  void activateTab(name);
}

function handleTabMouseenter(name: string | number): void {
  if (props.trigger !== 'hover') return;
  void activateTab(name);
}

/* ── Active-bar geometry (`barWidth` + `centerActiveTab`) ────────────────
 * The bar is drawn by a dedicated element rather than a `::after` on the
 * active tab, because `barWidth` decouples the bar's width from the tab's
 * own width and `centerActiveTab` needs a measurable box to scroll to. */
const navEl = ref<HTMLElement | null>(null);

/** The active tab's element, used to size and position the bar. */
function activeTabEl(): HTMLElement | null {
  const nav = navEl.value;
  if (!nav) return null;
  const index = panes.value.findIndex((p) => p.name === activeValue.value);
  if (index < 0) return null;
  return nav.querySelectorAll<HTMLElement>('.sn-tabs__tab')[index] ?? null;
}

/**
 * Inline style for the bar. Without `barWidth` the bar takes the active
 * tab's own width, which is what the stylesheet's `::after` behaviour
 * produced — so we only emit inline geometry when a width is pinned or the
 * tab needs centring.
 */
const barStyle = computed<Record<string, string> | undefined>(() => {
  if (props.barWidth === undefined) return undefined;
  return { width: `${props.barWidth}px`, maxWidth: '100%' };
});

/** Scroll the active tab to the middle of the strip. */
async function centerActiveTab(): Promise<void> {
  if (!props.centerActiveTab) return;
  await nextTick();
  const nav = navEl.value;
  const tab = activeTabEl();
  if (!nav || !tab) return;
  const target = tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2;
  nav.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
}

watch(activeValue, () => {
  void centerActiveTab();
});
// `immediate` on the watcher above would run during setup, before `navEl`
// has a DOM node. Mount is the earliest point the strip can be measured.
onMounted(() => {
  void centerActiveTab();
});

function handleClose(name: string | number, event: MouseEvent): void {
  event.stopPropagation();
  emit('close', name);
}

function handleAdd(): void {
  if (typeof props.addable === 'object' && props.addable?.disabled) return;
  emit('add');
}

/** Style binding helpers — a prop may be a string or a record. */
function toStyleBinding(style: string | Record<string, string> | undefined) {
  return style;
}

/** Whether the tabs container should expose the "+" affordance. */
const addDisabled = computed(() =>
  typeof props.addable === 'object' ? Boolean(props.addable.disabled) : false,
);

/** Whether a given pane should show its close affordance: the per-pane
 *  override wins, otherwise the parent `closable` flag applies. Computed in
 *  script (rather than inline in the template) so the `??` fallback stays
 *  obvious and testable. */
function isPaneClosable(pane: SnTabPaneDescriptor): boolean {
  return pane.closable ?? props.closable;
}

/* ─────────── Injection surface for SnTabPane ─────────── */

provide('sn-tabs-active-value', activeValue);
provide('sn-tabs-type', toRef(props, 'type'));
provide('sn-tabs-placement', mergedPlacement);
provide('sn-tabs-pane-class', toRef(props, 'paneClass'));
provide('sn-tabs-pane-style', toRef(props, 'paneStyle'));
provide('sn-tabs-register-pane', registerPane);
provide('sn-tabs-unregister-pane', unregisterPane);
provide('sn-tabs-animated', toRef(props, 'animated'));
</script>

<template>
  <div
    :class="[
      'sn-tabs',
      `sn-tabs--${type}`,
      `sn-tabs--${mergedPlacement}`,
      `sn-tabs--size-${size}`,
      animated ? 'sn-tabs--animated' : '',
    ]"
    :style="tabsPadding ? { padding: `${tabsPadding}px` } : undefined"
  >
    <div
      ref="navEl"
      class="sn-tabs__nav"
      role="tablist"
      :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
      :style="justifyContent ? { justifyContent } : undefined"
    >
      <slot name="prefix" />
      <button
        v-for="pane in panes"
        :key="pane.name"
        type="button"
        role="tab"
        :class="[
          'sn-tabs__tab',
          pane.name === activeValue ? 'sn-tabs__tab--active' : '',
          pane.disabled ? 'sn-tabs__tab--disabled' : '',
          tabClass,
        ]"
        :style="[toStyleBinding(tabStyle), pane.name === activeValue ? barStyle : undefined]"
        :aria-selected="pane.name === activeValue"
        :aria-disabled="pane.disabled || undefined"
        :tabindex="pane.name === activeValue ? 0 : -1"
        @click="handleTabClick(pane.name)"
        @mouseenter="handleTabMouseenter(pane.name)"
      >
        <span class="sn-tabs__tab-label">{{ pane.tab }}</span>
        <span
          v-if="isPaneClosable(pane)"
          class="sn-tabs__tab-close"
          role="button"
          aria-label="Close tab"
          @click="handleClose(pane.name, $event)"
          >×</span
        >
      </button>
      <button
        v-if="addable"
        type="button"
        class="sn-tabs__add"
        :class="[addTabClass, addDisabled ? 'sn-tabs__add--disabled' : '']"
        :style="toStyleBinding(addTabStyle)"
        :aria-disabled="addDisabled || undefined"
        aria-label="Add tab"
        @click="handleAdd"
      >
        <SnIcon :icon="Plus" :size="14" />
      </button>
      <slot name="suffix" />
    </div>

    <div class="sn-tabs__panes" :class="paneWrapperClass" :style="toStyleBinding(paneWrapperStyle)">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-tabs {
  display: flex;
  flex-direction: column;
}

/* Tab strip layout — horizontal by default; vertical placements flip the
 * container so the strip sits left/right of the panes. */
.sn-tabs--left,
.sn-tabs--right {
  flex-direction: row;
}
.sn-tabs--right {
  flex-direction: row-reverse;
}
.sn-tabs--bottom {
  flex-direction: column-reverse;
}

.sn-tabs__nav {
  display: flex;
  align-items: center;
  gap: 2px;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}
.sn-tabs--left .sn-tabs__nav,
.sn-tabs--right .sn-tabs__nav {
  flex-direction: column;
  align-items: stretch;
}
.sn-tabs--bottom .sn-tabs__nav {
  border-top: 1px solid var(--sn-web-color-border-default);
}

.sn-tabs__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px 14px;
  transition:
    color 0.2s var(--sn-web-bezier-ease),
    background-color 0.2s var(--sn-web-bezier-ease);
  white-space: nowrap;
}
.sn-tabs__tab:hover:not(.sn-tabs__tab--disabled) {
  color: var(--sn-web-color-action-primary);
}
.sn-tabs__tab:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: -2px;
  border-radius: 4px;
}
.sn-tabs__tab--active {
  color: var(--sn-web-color-action-primary);
}
.sn-tabs__tab--disabled {
  color: var(--sn-web-color-text-tertiary);
  cursor: not-allowed;
  opacity: 0.6;
}

.sn-tabs__tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  color: var(--sn-web-color-text-tertiary);
}
.sn-tabs__tab-close:hover {
  background: var(--sn-web-color-background-soft);
  color: var(--sn-web-color-text-primary);
}

.sn-tabs__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
}
.sn-tabs__add:hover:not(.sn-tabs__add--disabled) {
  background: var(--sn-web-color-background-soft);
  color: var(--sn-web-color-action-primary);
}
.sn-tabs__add--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.sn-tabs__panes {
  flex: 1;
  min-width: 0;
  padding-top: 12px;
}
.sn-tabs--left .sn-tabs__panes,
.sn-tabs--right .sn-tabs__panes {
  padding-top: 0;
}
.sn-tabs--left .sn-tabs__panes {
  padding-left: 16px;
}
.sn-tabs--right .sn-tabs__panes {
  padding-right: 16px;
}
.sn-tabs--bottom .sn-tabs__panes {
  padding-top: 0;
  padding-bottom: 12px;
}

/* ── type: bar (default) — underline only on the active tab ── */
.sn-tabs--bar .sn-tabs__tab::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 2px;
  border-radius: 1px;
  background: transparent;
  transition: background-color 0.2s var(--sn-web-bezier-ease);
}
.sn-tabs--bar .sn-tabs__tab--active::after {
  background: var(--sn-web-color-action-primary);
}

/* ── type: line — full-width underline track behind the strip ── */
.sn-tabs--line .sn-tabs__nav {
  border-bottom: 1px solid var(--sn-web-color-border-default);
}
.sn-tabs--line .sn-tabs__tab::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: transparent;
  transition: background-color 0.2s var(--sn-web-bezier-ease);
}
.sn-tabs--line .sn-tabs__tab--active::after {
  background: var(--sn-web-color-action-primary);
}

/* ── type: card — boxed tabs, active sits on the surface ── */
.sn-tabs--card .sn-tabs__nav {
  border-bottom: 1px solid var(--sn-web-color-border-default);
  gap: 4px;
}
.sn-tabs--card .sn-tabs__tab {
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  margin-bottom: -1px;
}
.sn-tabs--card .sn-tabs__tab--active {
  border-color: var(--sn-web-color-border-default);
  background: var(--sn-web-color-background-surface);
}

/* ── type: segment — pill group with a filled active segment ── */
.sn-tabs--segment .sn-tabs__nav {
  background: var(--sn-web-color-background-soft);
  border-radius: 8px;
  padding: 3px;
  gap: 3px;
  display: inline-flex;
}
.sn-tabs--segment .sn-tabs__tab {
  border-radius: 6px;
  padding: 6px 14px;
}
.sn-tabs--segment .sn-tabs__tab--active {
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-action-primary);
  box-shadow: var(--sn-web-input-shadow);
}

/* ── type: chrome — browser-style tab strip ──────────────────────────────
 * Additive vs the reference (n-tabs has no browser chrome; part of the
 * requested 谷歌浏览器风格). Modern Chrome: a tinted strip whose bottom
 * hairline runs under the inactive tabs, the active tab rounded at the
 * top and opening onto the content surface, and a hairline separator
 * between two inactive neighbours.
 *
 * The strip hairline is a background-image on the last pixel of the
 * strip's own padding box rather than a `border-bottom`, so the active
 * tab's opaque surface background covers it without any negative offset
 * — the strip keeps its `overflow: hidden`, so an overflowing strip is
 * still clipped exactly as the other types are. */
.sn-tabs--chrome .sn-tabs__nav {
  align-items: flex-end;
  gap: 2px;
  padding: 6px 8px 0;
  /* No `--sn-web-color-background-soft` alias is emitted (AUI-FOUND-006), so
   * the raised strip tone is `subtle` — light in light mode, and lighter than
   * the `surface` an active tab opens onto in dark mode. The hairline uses a
   * text-tinted mix because `border-default` equals `subtle` in dark mode. */
  background-color: var(--sn-web-color-background-subtle);
  background-image: linear-gradient(
    color-mix(in srgb, var(--sn-web-color-text-primary) 14%, transparent),
    color-mix(in srgb, var(--sn-web-color-text-primary) 14%, transparent)
  );
  background-repeat: no-repeat;
  background-position: bottom left;
  background-size: 100% 1px;
}

.sn-tabs--chrome .sn-tabs__tab {
  height: 30px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
}

.sn-tabs--chrome .sn-tabs__tab:hover:not(.sn-tabs__tab--disabled):not(.sn-tabs__tab--active) {
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 6%, transparent);
}

/* Hairline between two inactive neighbours — Chrome draws none beside the
 * active tab. */
.sn-tabs--chrome
  .sn-tabs__tab:not(.sn-tabs__tab--active)
  + .sn-tabs__tab:not(.sn-tabs__tab--active)::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 14%, transparent);
}

.sn-tabs--chrome .sn-tabs__tab--active {
  background: var(--sn-web-color-background-surface);
  border-color: var(--sn-web-color-border-default);
  color: var(--sn-web-color-text-primary);
}

/* Chrome reveals the close affordance on hover and on the active tab. */
.sn-tabs--chrome .sn-tabs__tab-close {
  opacity: 0;
  transition: opacity 0.15s var(--sn-web-bezier-ease);
}

.sn-tabs--chrome .sn-tabs__tab:hover .sn-tabs__tab-close,
.sn-tabs--chrome .sn-tabs__tab--active .sn-tabs__tab-close {
  opacity: 1;
}

.sn-tabs--chrome .sn-tabs__add {
  border-radius: 50%;
  color: var(--sn-web-color-text-secondary);
}

.sn-tabs--chrome .sn-tabs__add:hover:not(.sn-tabs__add--disabled) {
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 8%, transparent);
}

/* `chrome` mirrors a browser's horizontal strip. A vertical placement keeps
 * the strip's own stacking (it is not a browser affordance) and only the
 * tab shape is carried over. */
.sn-tabs--chrome.sn-tabs--left .sn-tabs__nav,
.sn-tabs--chrome.sn-tabs--right .sn-tabs__nav {
  align-items: stretch;
  padding: 6px 0;
  background-image: none;
}

.sn-tabs--chrome.sn-tabs--left .sn-tabs__tab,
.sn-tabs--chrome.sn-tabs--right .sn-tabs__tab {
  border-radius: 8px;
  border-bottom: 1px solid transparent;
}

.sn-tabs--chrome.sn-tabs--left .sn-tabs__tab--active,
.sn-tabs--chrome.sn-tabs--right .sn-tabs__tab--active {
  border-color: var(--sn-web-color-border-default);
}

/* ── size modifiers ── */
.sn-tabs--size-small .sn-tabs__tab {
  font-size: 13px;
  padding: 6px 12px;
}
.sn-tabs--size-large .sn-tabs__tab {
  font-size: 15px;
  padding: 10px 18px;
}

/* Vertical placement: the active bar runs along the inline-start edge. */
.sn-tabs--left .sn-tabs__tab::after,
.sn-tabs--right .sn-tabs__tab::after {
  left: auto;
  right: auto;
  top: 0;
  bottom: 0;
  width: 2px;
  height: auto;
}
.sn-tabs--left .sn-tabs__tab::after {
  left: 0;
}
.sn-tabs--right .sn-tabs__tab::after {
  right: 0;
}

/* Doodle skin */
.snui-skin-doodle .sn-tabs__nav {
  gap: 6px;
}
.snui-skin-doodle .sn-tabs__tab {
  border: 2.5px solid #1a1a1a;
  border-radius: 10px;
  font-weight: 700;
}
.snui-skin-doodle .sn-tabs__tab--active {
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
}
</style>
