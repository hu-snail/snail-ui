<template>
  <div
    ref="rootRef"
    :class="[
      'sn-color-picker',
      `sn-color-picker--${size}`,
      {
        'sn-color-picker--disabled': disabled,
        'sn-color-picker--readonly': readonly,
        'sn-color-picker--focused': isFocused,
        'sn-color-picker--active': isPanelOpen,
        'sn-color-picker--panel-only': panelOnly,
      },
      customClass,
    ]"
    :data-snui-component="'color-picker'"
    :data-size="size"
    :style="wrapperStyle || undefined"
  >
    <template v-if="!panelOnly">
      <div
        class="sn-color-picker__selection"
        role="combobox"
        aria-haspopup="dialog"
        :aria-expanded="isPanelOpen ? 'true' : 'false'"
        :aria-controls="isPanelOpen ? panelId : undefined"
        :aria-label="ariaLabel || 'Color picker'"
        :aria-readonly="readonly ? 'true' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :tabindex="isInteractive ? 0 : -1"
        @mousedown="onTriggerMouseDown"
        @click="onTriggerClick"
        @keydown="onTriggerKeyDown"
        @focus="onFocus"
        @blur="onBlur"
      >
        <span
          class="sn-color-picker__trigger-swatch"
          :style="{ backgroundColor: triggerSwatchColor }"
        />
        <span v-if="hasModelValue" class="sn-color-picker__value">{{ displayValue }}</span>
        <span v-else class="sn-color-picker__placeholder">{{ placeholder }}</span>
      </div>

      <!-- Suffix: clear | arrow -->
      <div class="sn-color-picker__suffix">
        <button
          v-if="clearable && hasModelValue && isInteractive"
          type="button"
          class="sn-color-picker__clear"
          aria-label="Clear color"
          :tabindex="-1"
          @mousedown.prevent
          @click.stop="clearValue"
        >
          <SnIcon :icon="CloseIcon" :size="11" />
        </button>
        <span
          v-else
          class="sn-color-picker__arrow"
          :class="{ 'sn-color-picker__arrow--up': isPanelOpen }"
          aria-hidden="true"
        >
          <SnIcon :icon="ChevronDownIcon" :size="13" />
        </span>
      </div>
    </template>

    <!-- Color panel — teleported to body; rendered in place when panel-only. -->
    <Teleport to="body" :disabled="panelOnly === true">
      <Transition name="sn-pop">
        <div
          v-if="panelOnly || isPanelOpen"
          :id="panelId"
          ref="panelRef"
          :class="[
            'sn-color-picker-panel',
            `sn-color-picker-panel--${placement}`,
            { 'sn-color-picker-panel--static': panelOnly },
          ]"
          :style="panelStyle"
          :role="panelOnly ? 'group' : 'dialog'"
          aria-label="Color picker panel"
          @mousedown.self.prevent
        >
          <!-- SV square -->
          <div
            ref="svRef"
            class="sn-color-picker-panel__sv"
            :style="{ backgroundColor: hueBackground(draft.h) }"
            @pointerdown="onSvPointerDown"
          >
            <div
              ref="svHandleRef"
              class="sn-color-picker-panel__sv-handle"
              role="slider"
              aria-label="Saturation and value"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuetext="`S ${Math.round(draft.s)}%, V ${Math.round(draft.v)}%`"
              :tabindex="isInteractive ? 0 : -1"
              :style="{
                left: `${draft.s}%`,
                top: `${100 - draft.v}%`,
                backgroundColor: previewColor,
              }"
              @keydown="onHandleKeyDown($event, 'sv')"
            />
          </div>

          <!-- Hue + alpha rails + current color preview -->
          <div class="sn-color-picker-panel__rails-row">
            <div class="sn-color-picker-panel__rails">
              <div
                ref="hueRef"
                class="sn-color-picker-panel__rail sn-color-picker-panel__hue"
                @pointerdown="onHuePointerDown"
              >
                <div
                  class="sn-color-picker-panel__thumb"
                  role="slider"
                  aria-label="Hue"
                  aria-valuemin="0"
                  aria-valuemax="360"
                  :aria-valuenow="Math.round(draft.h)"
                  :tabindex="isInteractive ? 0 : -1"
                  :style="{ left: `${(draft.h / 360) * 100}%` }"
                  @keydown="onHandleKeyDown($event, 'h')"
                />
              </div>
              <div
                v-if="showAlpha"
                ref="alphaRef"
                class="sn-color-picker-panel__rail sn-color-picker-panel__alpha"
                :style="alphaRailStyle"
                @pointerdown="onAlphaPointerDown"
              >
                <div
                  class="sn-color-picker-panel__thumb"
                  role="slider"
                  aria-label="Opacity"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-valuenow="Math.round(draft.a * 100)"
                  :tabindex="isInteractive ? 0 : -1"
                  :style="{ left: `${draft.a * 100}%` }"
                  @keydown="onHandleKeyDown($event, 'a')"
                />
              </div>
            </div>
            <span
              class="sn-color-picker-panel__preview"
              :style="{ backgroundColor: previewColor }"
              aria-hidden="true"
            />
          </div>

          <!-- Format select + value inputs -->
          <div class="sn-color-picker-panel__inputs">
            <div
              v-if="visibleModes.length > 1"
              ref="modeSelectRef"
              class="sn-color-picker-panel__mode"
              :class="{ 'sn-color-picker-panel__mode--open': isModeMenuOpen }"
            >
              <button
                ref="modeTriggerRef"
                type="button"
                class="sn-color-picker-panel__mode-trigger"
                aria-haspopup="listbox"
                :aria-expanded="isModeMenuOpen ? 'true' : 'false'"
                aria-label="Color format"
                :disabled="!isInteractive"
                @click="toggleModeMenu"
                @keydown="onModeTriggerKeyDown"
              >
                {{ modeLabel(activeMode) }}
                <SnIcon :icon="ChevronDownIcon" :size="12" />
              </button>
              <div
                v-if="isModeMenuOpen"
                class="sn-color-picker-panel__mode-menu"
                role="listbox"
                aria-label="Color format options"
              >
                <button
                  v-for="mode in visibleModes"
                  :key="mode"
                  type="button"
                  class="sn-color-picker-panel__mode-option"
                  :class="{ 'sn-color-picker-panel__mode-option--active': mode === activeMode }"
                  role="option"
                  :aria-selected="mode === activeMode ? 'true' : 'false'"
                  :tabindex="-1"
                  @click="onModeMenuSelect(mode)"
                  @keydown="onModeOptionKeyDown($event, mode)"
                >
                  {{ modeLabel(mode) }}
                </button>
              </div>
            </div>

            <!-- hex / hsl text field -->
            <div
              v-if="activeMode !== 'rgb'"
              class="sn-color-picker-panel__field"
              :class="{ 'sn-color-picker-panel__field--hex': activeMode === 'hex' }"
            >
              <span
                v-if="activeMode === 'hex'"
                class="sn-color-picker-panel__field-prefix"
                aria-hidden="true"
                >#</span
              >
              <input
                ref="inputRef"
                v-model="inputText"
                type="text"
                class="sn-color-picker-panel__input"
                aria-label="Color value"
                spellcheck="false"
                :disabled="!isInteractive"
                @keydown.enter.prevent="commitTextInput"
                @blur="commitTextInput"
              />
            </div>

            <!-- rgb channel fields -->
            <template v-else>
              <input
                v-for="ch in channelFields"
                :key="ch.key"
                v-model="channelText[ch.key]"
                type="text"
                inputmode="numeric"
                class="sn-color-picker-panel__channel"
                :aria-label="ch.label"
                spellcheck="false"
                maxlength="3"
                :disabled="!isInteractive"
                @keydown.enter.prevent="commitChannels"
                @blur="commitChannels"
              />
            </template>

            <!-- alpha percent field -->
            <div
              v-if="showAlpha"
              class="sn-color-picker-panel__field sn-color-picker-panel__field--alpha"
            >
              <input
                v-model="alphaText"
                type="text"
                inputmode="numeric"
                class="sn-color-picker-panel__input sn-color-picker-panel__alpha-input"
                aria-label="Opacity percent"
                maxlength="3"
                :disabled="!isInteractive"
                @keydown.enter.prevent="commitAlpha"
                @blur="commitAlpha"
              />
              <span class="sn-color-picker-panel__field-suffix" aria-hidden="true">%</span>
            </div>
          </div>

          <!-- Recently used colors -->
          <div class="sn-color-picker-panel__section">
            <div class="sn-color-picker-panel__section-title">最近使用颜色</div>
            <div v-if="recentColors.length > 0" class="sn-color-picker-panel__swatches">
              <button
                v-for="hex in recentColors"
                :key="`recent-${hex}`"
                type="button"
                class="sn-color-picker-panel__swatch"
                :style="{ backgroundColor: hex }"
                :aria-label="`Select ${hex}`"
                :disabled="!isInteractive"
                @click="selectSwatch(hex)"
              />
            </div>
            <div v-else class="sn-color-picker-panel__section-empty">暂无</div>
          </div>

          <!-- Preset colors -->
          <div v-if="normalizedSwatches.length > 0" class="sn-color-picker-panel__section">
            <div class="sn-color-picker-panel__section-title">系统预设颜色</div>
            <div class="sn-color-picker-panel__swatches">
              <button
                v-for="swatch in normalizedSwatches"
                :key="swatch.value"
                type="button"
                class="sn-color-picker-panel__swatch"
                :style="{ backgroundColor: swatch.css }"
                :aria-label="`Select ${swatch.value}`"
                :disabled="!isInteractive"
                @click="selectSwatch(swatch.value)"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnColorPicker — web-end color picker component.
 *
 * Reference layout: TDesign `t-color-picker` panel (format select, channel
 * inputs, recent + preset sections) merged with the naive-ui `n-color-picker`
 * value contract this component was built on.
 *
 * Surface (this version):
 *   - modelValue: CSS color string (`#rrggbb` internally lowercase; accepts
 *     `#rgb` / `#rrggbb` / `#rrggbbaa` / `rgb()` / `rgba()` / `hsl()` /
 *     `hsla()` — see sn-color-picker-types.ts). Output format follows the
 *     active format + `showAlpha`.
 *   - modes: ('rgb' | 'hsl' | 'hex')[] — rendered as a format dropdown in the
 *     input row (Hex / RGB / HSL). The active format decides the field
 *     layout: rgb → three 0–255 channel inputs, hex → text field with a
 *     decorative `#` prefix, hsl → plain text field.
 *   - showAlpha: alpha rail + percent input; rgba/hsla/8-digit-hex output
 *   - swatches: 系统预设颜色 preset section (hex strings; invalid dropped)
 *   - recent colors: 最近使用颜色 session history — module-scoped in-memory
 *     store shared by all picker instances (max 10, deduped, see
 *     sn-color-picker-recent.ts); recorded on every committed change
 *   - panelOnly: inline always-visible panel — no trigger, no teleport,
 *     no viewport positioning; ideal for embedding in toolbars/settings
 *   - size(mini/tiny/small/medium/large) / disabled / readonly /
 *     clearable (restores the default color) / defaultShow (open on mount)
 *   - panel: Teleport + viewport flip (bottom preferred — the simplified
 *     popper strategy SnSelect / SnTimePicker document), SV square with
 *     draggable handle + hue rail + optional alpha rail over a checkerboard
 *     + current-color preview + format select + value inputs + sections
 *   - pointer drag: document-level pointerdown/move/up with
 *     onBeforeUnmount cleanup (§41/§42); update:modelValue fires live
 *     while dragging, change fires on pointer release
 *   - keyboard: panel handles are role=slider; ArrowLeft/Right/Up/Down
 *     step hue/saturation/value ±1 (Shift ±10); alpha rail Arrow ±0.01;
 *     format dropdown opens with Enter/Space/ArrowDown, options rove with
 *     ArrowUp/Down, Escape closes
 *   - events: update:modelValue, change, clear, focus, blur
 *
 * Not ported (out of scope, see ai-description.md): on-update:value-style
 * granular events, gradient mode, `on-complete` per-channel callbacks,
 * renderers, internal actions slot, persistent (localStorage) recent colors.
 *
 * Per AGENTS.md §30/31: props / events / a11y are declared below; CSS uses
 * `--sn-web-color-picker-*` aliases with `--sn-web-color-*` fallbacks only.
 * Swatch/preview colors are DATA (bound inline styles from the value /
 * swatches props), not stylesheet styling — allowed by the task brief.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../icon/SnIcon.vue';
import { ChevronDownIcon, CloseIcon } from './sn-color-picker-icons';
import { useOverlayFollow } from '../_internal/use-overlay-follow';
import { recentColors, recordRecentColor } from './sn-color-picker-recent';
import {
  clamp,
  formatHsl,
  formatHsla,
  formatRgb,
  formatRgba,
  hsvToRgb,
  hueBackground,
  parseColor,
  rgbToHex,
  rgbToHsl,
  rgbaToHex,
  rgbToHsv,
  type Hsva,
  type SnColorPickerMode,
  type SnColorPickerSize,
} from './sn-color-picker-types';

defineOptions({ name: 'SnColorPicker' });

const DEFAULT_COLOR = '#000000';

/** Display labels for the format dropdown (TDesign-style casing). */
const MODE_LABELS: Record<SnColorPickerMode, string> = { hex: 'Hex', rgb: 'RGB', hsl: 'HSL' };

const props = withDefaults(
  defineProps<{
    /** Bound value: CSS color string, or null when empty. */
    modelValue?: string | null;
    /** Edit formats offered in the panel dropdown. */
    modes?: SnColorPickerMode[];
    /** Alpha rail + rgba/hsla output. */
    showAlpha?: boolean;
    /** Preset swatch section (hex strings; invalid entries are dropped). */
    swatches?: string[];
    /** Render the panel inline without the trigger (always visible). */
    panelOnly?: boolean;
    /** Visual size preset. */
    size?: SnColorPickerSize;
    /** Disables interaction. */
    disabled?: boolean;
    /** Read-only — opens nothing, commits nothing. */
    readonly?: boolean;
    /** Clear restores the default color (#000000) and emits `clear`. */
    clearable?: boolean;
    /** Open the panel immediately on mount (ignored with panelOnly). */
    defaultShow?: boolean;
    /** Empty-state text. */
    placeholder?: string;
    /** Accessible name for the trigger (fallback: 'Color picker'). */
    ariaLabel?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    modelValue: null,
    modes: () => ['rgb', 'hex'],
    showAlpha: false,
    swatches: () => [],
    panelOnly: false,
    size: 'medium',
    disabled: false,
    readonly: false,
    clearable: false,
    defaultShow: false,
    placeholder: 'Please pick a color',
    ariaLabel: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync — live while dragging + on every commit. */
  (e: 'update:modelValue', value: string | null): void;
  /** Value committed (pointer release, swatch, input, keyboard). */
  (e: 'change', value: string): void;
  /** Clear button activated (modelValue already reset to the default). */
  (e: 'clear'): void;
  /** Trigger gained focus. */
  (e: 'focus', event: FocusEvent): void;
  /** Trigger lost focus. */
  (e: 'blur', event: FocusEvent): void;
}>();

/* ─────────── Instance ids ─────────── */

let colorPickerInstanceSeed = 0;
const instanceId = ++colorPickerInstanceSeed;
const panelId = `sn-color-picker-panel-${instanceId}`;

/* ─────────── State ─────────── */

const rootRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const svRef = ref<HTMLElement | null>(null);
const hueRef = ref<HTMLElement | null>(null);
const alphaRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const modeSelectRef = ref<HTMLElement | null>(null);
const modeTriggerRef = ref<HTMLButtonElement | null>(null);

const isPanelOpen = ref(false);
const isFocused = ref(false);
const activeMode = ref<SnColorPickerMode>('rgb');
/** Panel working color — HSV space (hue/sat/value/alpha). */
const draft = ref<Hsva>({ h: 0, s: 0, v: 0, a: 1 });
/** Mode text input buffer (hex/hsl; committed on Enter / blur). */
const inputText = ref('');
/** RGB channel input buffers (0–255 strings; committed on Enter / blur). */
const channelText = ref<{ r: string; g: string; b: string }>({ r: '0', g: '0', b: '0' });
/** Alpha percent input buffer (0–100 string; committed on Enter / blur). */
const alphaText = ref('100');
/** Format dropdown open state. */
const isModeMenuOpen = ref(false);

/** RGB channel input descriptors (template v-for). */
const channelFields = [
  { key: 'r', label: 'Red' },
  { key: 'g', label: 'Green' },
  { key: 'b', label: 'Blue' },
] as const;

const isInteractive = computed(() => !props.disabled && !props.readonly);
const hasModelValue = computed(() => props.modelValue !== null && props.modelValue !== '');

/** Mode options actually rendered (dedup, keep prop order). */
const visibleModes = computed<SnColorPickerMode[]>(() => {
  const seen = new Set<string>();
  return props.modes.filter((mode) => {
    if (seen.has(mode)) return false;
    seen.add(mode);
    return true;
  });
});

/** Swatches normalized: invalid entries dropped, css + hex kept. */
const normalizedSwatches = computed<Array<{ value: string; css: string }>>(() => {
  const out: Array<{ value: string; css: string }> = [];
  for (const raw of props.swatches) {
    const parsed = parseColor(raw);
    if (parsed) out.push({ value: rgbToHex(parsed.r, parsed.g, parsed.b), css: raw });
  }
  return out;
});

/* ─────────── Color derivation ─────────── */

const draftRgb = computed(() => hsvToRgb(draft.value.h, draft.value.s, draft.value.v));
const draftHsl = computed(() => {
  const hsl = rgbToHsl(draftRgb.value.r, draftRgb.value.g, draftRgb.value.b);
  return { ...hsl, a: draft.value.a };
});

/** Panel handle/preview color — opaque (the alpha rail shows alpha). */
const previewColor = computed(() => rgbToHex(draftRgb.value.r, draftRgb.value.g, draftRgb.value.b));

/** Format the draft per active mode + showAlpha. */
function formatDraft(mode: SnColorPickerMode): string {
  const { r, g, b } = draftRgb.value;
  const a = draft.value.a;
  const useA = props.showAlpha && a < 1;
  if (mode === 'hex') return useA ? rgbaToHex(r, g, b, a) : rgbToHex(r, g, b);
  if (mode === 'rgb') return useA ? formatRgba(r, g, b, a) : formatRgb(r, g, b);
  const hsl = draftHsl.value;
  return useA ? formatHsla(hsl.h, hsl.s, hsl.l, a) : formatHsl(hsl.h, hsl.s, hsl.l);
}

/** Text-field display for the draft — hex mode strips the decorative `#`. */
function draftInputText(): string {
  const formatted = formatDraft(activeMode.value);
  return activeMode.value === 'hex' ? formatted.replace(/^#/, '') : formatted;
}

/** Model value normalized for the trigger display. */
const displayValue = computed<string>(() => {
  if (!hasModelValue.value) return '';
  const parsed = parseColor(props.modelValue ?? '');
  if (!parsed) return props.modelValue ?? '';
  return props.showAlpha
    ? rgbaToHex(parsed.r, parsed.g, parsed.b, parsed.a)
    : rgbToHex(parsed.r, parsed.g, parsed.b);
});

/** Trigger swatch background — the bound color, or the default when empty. */
const triggerSwatchColor = computed<string>(() => {
  if (hasModelValue.value) {
    const parsed = parseColor(props.modelValue ?? '');
    if (parsed) return rgbaToHex(parsed.r, parsed.g, parsed.b, parsed.a);
  }
  return DEFAULT_COLOR;
});

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});

/** Alpha rail: current color fading to transparent over a checkerboard. */
const alphaRailStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, ${rgbaToHex(draftRgb.value.r, draftRgb.value.g, draftRgb.value.b, 0)}, ${rgbToHex(draftRgb.value.r, draftRgb.value.g, draftRgb.value.b)}), conic-gradient(rgb(0 0 0 / 0.14) 0 25%, transparent 0 50%, rgb(0 0 0 / 0.14) 0 75%, transparent 0)`,
  backgroundSize: 'auto, 8px 8px',
}));

/* ─────────── Draft <-> inputs sync ─────────── */

/** Push the draft into every input buffer (live while dragging). */
function syncInputsFromDraft(): void {
  inputText.value = draftInputText();
  channelText.value = {
    r: String(Math.round(draftRgb.value.r)),
    g: String(Math.round(draftRgb.value.g)),
    b: String(Math.round(draftRgb.value.b)),
  };
  alphaText.value = String(Math.round(draft.value.a * 100));
}

/** Initialize the draft + inputs from the bound value (null → default). */
function initDraftFromModel(): void {
  const parsed = parseColor(props.modelValue ?? '');
  const base = parsed ?? parseColor(DEFAULT_COLOR);
  if (!base) return;
  const hsv = rgbToHsv(base.r, base.g, base.b);
  draft.value = { ...hsv, a: props.showAlpha ? base.a : 1 };
  syncInputsFromDraft();
}

/** Clamp the active format onto the offered modes. */
function ensureActiveMode(): void {
  if (!visibleModes.value.includes(activeMode.value)) {
    activeMode.value = visibleModes.value[0] ?? 'rgb';
  }
}

/* ─────────── Commit ─────────── */

/** Live sync (dragging) — no `change` event. */
function emitLive(): void {
  emit('update:modelValue', formatDraft(activeMode.value));
  syncInputsFromDraft();
}

/** Committed change — syncs v-model, fires `change`, records the history. */
function emitChange(): void {
  syncInputsFromDraft();
  const value = formatDraft(activeMode.value);
  emit('update:modelValue', value);
  emit('change', value);
  recordRecentColor(value);
}

function isSameHsva(a: Hsva, b: Hsva): boolean {
  return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
}

/* ─────────── Panel positioning (simplified popper) ─────────── */

const PANEL_VIEWPORT_GAP = 4;
const placement = ref<'bottom' | 'top'>('bottom');
const panelStyle = ref<Record<string, string>>({});

function repositionPanel(): void {
  if (props.panelOnly) return;
  const root = rootRef.value;
  const panel = panelRef.value;
  if (!root || !panel) return;
  const rootRect = root.getBoundingClientRect();
  // offsetWidth/offsetHeight read the layout box, which the sn-pop enter
  // transform (scale 0.92) does not distort — getBoundingClientRect would
  // measure the scaled panel while the enter transition is running.
  const panelWidth = panel.offsetWidth;
  const panelHeight = panel.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const left = Math.min(
    Math.max(PANEL_VIEWPORT_GAP, rootRect.left),
    Math.max(PANEL_VIEWPORT_GAP, vw - panelWidth - PANEL_VIEWPORT_GAP),
  );
  const roomBelow = vh - rootRect.bottom;
  const roomAbove = rootRect.top;
  const useTop = roomBelow < panelHeight && roomAbove > roomBelow;
  placement.value = useTop ? 'top' : 'bottom';
  const top = useTop ? Math.max(PANEL_VIEWPORT_GAP, rootRect.top - panelHeight) : rootRect.bottom;

  panelStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
  };
}

/* Scroll/resize follow: while the panel is open, any scroll (page or a
 * nested scrollable ancestor) or viewport resize re-runs repositionPanel so
 * the fixed-position panel stays glued to the trigger instead of detaching. */
const followViewport = useOverlayFollow(rootRef, panelRef, repositionPanel, isPanelOpen);

/* ─────────── Pointer drag (document listeners, §41/§42) ─────────── */

type DragTarget = 'sv' | 'hue' | 'alpha';

interface DragState {
  target: DragTarget;
  el: HTMLElement;
}

let dragState: DragState | null = null;

function railRatio(el: HTMLElement, event: PointerEvent): number {
  const rect = el.getBoundingClientRect();
  if (rect.width <= 0) return 0;
  return clamp((event.clientX - rect.left) / rect.width, 0, 1);
}

function svApply(el: HTMLElement, event: PointerEvent): void {
  const rect = el.getBoundingClientRect();
  const x = rect.width > 0 ? clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100) : 0;
  const y = rect.height > 0 ? clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100) : 0;
  draft.value.s = x;
  draft.value.v = 100 - y;
  emitLive();
}

function onDocumentPointerMove(event: PointerEvent): void {
  if (!dragState) return;
  if (dragState.target === 'sv') svApply(dragState.el, event);
  else if (dragState.target === 'hue') draft.value.h = railRatio(dragState.el, event) * 360;
  else draft.value.a = railRatio(dragState.el, event);
  emitLive();
}

function onDocumentPointerUp(): void {
  if (!dragState) return;
  dragState = null;
  emitChange();
}

function startDrag(target: DragTarget, el: HTMLElement | null, event: PointerEvent): void {
  if (!isInteractive.value || !el) return;
  event.preventDefault();
  dragState = { target, el };
  onDocumentPointerMove(event);
}

function onSvPointerDown(event: PointerEvent): void {
  startDrag('sv', svRef.value, event);
}

function onHuePointerDown(event: PointerEvent): void {
  startDrag('hue', hueRef.value, event);
}

function onAlphaPointerDown(event: PointerEvent): void {
  startDrag('alpha', alphaRef.value, event);
}

/* ─────────── Outside-click dismiss (§41/§42) ─────────── */

function onDocumentMouseDown(event: MouseEvent): void {
  const target = event.target as Node | null;
  if (!target) return;
  // The format dropdown closes on any press outside its own select box.
  if (isModeMenuOpen.value && !modeSelectRef.value?.contains(target)) {
    isModeMenuOpen.value = false;
  }
  if (props.panelOnly) return; // static panel never dismisses
  if (!isPanelOpen.value) return;
  if (rootRef.value && rootRef.value.contains(target)) return;
  if (panelRef.value && panelRef.value.contains(target)) return;
  closePanel();
}

/* ─────────── Open / close ─────────── */

/** Move focus into the first available value field (hex/hsl text, else r). */
function focusFirstField(): void {
  const target =
    inputRef.value ??
    panelRef.value?.querySelector<HTMLInputElement>('.sn-color-picker-panel__channel') ??
    null;
  target?.focus();
}

function openPanel(): void {
  if (props.panelOnly) return; // the static panel is always open
  if (!isInteractive.value || isPanelOpen.value) return;
  isPanelOpen.value = true;
  ensureActiveMode();
  initDraftFromModel();
  void nextTick(() => {
    repositionPanel();
    followViewport.start();
    focusFirstField();
  });
}

function closePanel(): void {
  if (!isPanelOpen.value) return;
  isPanelOpen.value = false;
  isModeMenuOpen.value = false;
  followViewport.stop();
  dragState = null;
}

/* ─────────── Format dropdown ─────────── */

function modeLabel(mode: SnColorPickerMode): string {
  return MODE_LABELS[mode];
}

function toggleModeMenu(): void {
  if (!isInteractive.value) return;
  isModeMenuOpen.value = !isModeMenuOpen.value;
}

function onModeMenuSelect(mode: SnColorPickerMode): void {
  if (!isInteractive.value) return;
  setActiveMode(mode);
  isModeMenuOpen.value = false;
  modeTriggerRef.value?.focus();
}

function onModeTriggerKeyDown(event: KeyboardEvent): void {
  if (!isInteractive.value) return;
  if (
    event.key === 'ArrowDown' ||
    event.key === 'Enter' ||
    event.key === ' ' ||
    event.key === 'Spacebar'
  ) {
    event.preventDefault();
    if (!isModeMenuOpen.value) isModeMenuOpen.value = true;
    return;
  }
  if (event.key === 'Escape' && isModeMenuOpen.value) {
    event.preventDefault();
    isModeMenuOpen.value = false;
  }
}

function onModeOptionKeyDown(event: KeyboardEvent, mode: SnColorPickerMode): void {
  const modes = visibleModes.value;
  const index = modes.indexOf(mode);
  if (index < 0) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    const next = modes[(index + step + modes.length) % modes.length];
    if (next === undefined) return;
    focusModeOption(next);
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    isModeMenuOpen.value = false;
    modeTriggerRef.value?.focus();
  }
}

function focusModeOption(mode: SnColorPickerMode): void {
  const options = modeSelectRef.value?.querySelectorAll<HTMLButtonElement>(
    '.sn-color-picker-panel__mode-option',
  );
  options?.[visibleModes.value.indexOf(mode)]?.focus();
}

/* ─────────── Interaction handlers ─────────── */

function setActiveMode(mode: SnColorPickerMode): void {
  if (!isInteractive.value || activeMode.value === mode) return;
  activeMode.value = mode;
  syncInputsFromDraft();
}

function selectSwatch(value: string): void {
  if (!isInteractive.value) return;
  const parsed = parseColor(value);
  if (!parsed) return;
  const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
  draft.value = { ...hsv, a: parsed.a };
  emitChange();
}

/** Enter/blur on the hex/hsl text field — apply when parseable (and changed), revert otherwise. */
function commitTextInput(): void {
  if (!isInteractive.value) return;
  const raw = inputText.value.trim();
  // The hex field renders a decorative `#` prefix; accept typed input with
  // or without it.
  const candidate =
    activeMode.value === 'hex' && raw !== '' && !raw.startsWith('#') ? `#${raw}` : raw;
  const parsed = parseColor(candidate);
  if (!parsed) {
    syncInputsFromDraft();
    return;
  }
  const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
  const next: Hsva = { ...hsv, a: parsed.a };
  if (isSameHsva(next, draft.value)) {
    // No-op confirm must not re-emit (SnTimePicker's Enter semantics).
    syncInputsFromDraft();
    return;
  }
  draft.value = next;
  emitChange();
}

/** Enter/blur on the RGB channel fields — 0–255 per channel, revert when invalid. */
function commitChannels(): void {
  if (!isInteractive.value) return;
  // Validate the raw fields first: parseColor clamps NaN to 0, which would
  // silently turn 'abc' into black instead of reverting.
  const channels = [channelText.value.r, channelText.value.g, channelText.value.b].map((text) =>
    Number.parseFloat(text),
  );
  if (channels.some((n) => Number.isNaN(n))) {
    syncInputsFromDraft();
    return;
  }
  const parsed = parseColor(`rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`);
  if (!parsed) {
    syncInputsFromDraft();
    return;
  }
  const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
  const next: Hsva = { ...hsv, a: draft.value.a };
  if (isSameHsva(next, draft.value)) {
    syncInputsFromDraft();
    return;
  }
  draft.value = next;
  emitChange();
}

/** Enter/blur on the alpha percent field — 0–100 → 0–1, revert when invalid. */
function commitAlpha(): void {
  if (!isInteractive.value) return;
  const pct = Number.parseFloat(alphaText.value);
  if (Number.isNaN(pct)) {
    alphaText.value = String(Math.round(draft.value.a * 100));
    return;
  }
  const a = clamp(pct / 100, 0, 1);
  if (a === draft.value.a) {
    alphaText.value = String(Math.round(draft.value.a * 100));
    return;
  }
  draft.value.a = a;
  emitChange();
}

function clearValue(): void {
  if (!isInteractive.value) return;
  emit('update:modelValue', DEFAULT_COLOR);
  emit('change', DEFAULT_COLOR);
  emit('clear');
  closePanel();
}

/* ─────────── Keyboard (panel handles) ─────────── */

/** Arrow step for hue / saturation / value (±1, Shift ±10) and alpha (±0.01). */
function onHandleKeyDown(event: KeyboardEvent, target: 'sv' | 'h' | 'a'): void {
  if (!isInteractive.value) return;
  const step = event.shiftKey ? 10 : 1;
  let handled = true;
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      if (target === 'sv') draft.value.s = clamp(draft.value.s - step, 0, 100);
      else if (target === 'h') draft.value.h = clamp(draft.value.h - step, 0, 360);
      else draft.value.a = clamp(draft.value.a - step / 100, 0, 1);
      break;
    case 'ArrowRight':
    case 'ArrowUp':
      if (target === 'sv') draft.value.s = clamp(draft.value.s + step, 0, 100);
      else if (target === 'h') draft.value.h = clamp(draft.value.h + step, 0, 360);
      else draft.value.a = clamp(draft.value.a + step / 100, 0, 1);
      break;
    default:
      handled = false;
  }
  if (!handled) return;
  event.preventDefault();
  emitChange();
}

/* ─────────── Trigger events ─────────── */

function onTriggerMouseDown(event: MouseEvent): void {
  event.preventDefault();
}

function onTriggerClick(): void {
  if (!isInteractive.value) return;
  if (isPanelOpen.value) closePanel();
  else openPanel();
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (!isInteractive.value) return;
  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'Spacebar':
      event.preventDefault();
      if (!isPanelOpen.value) openPanel();
      else closePanel();
      break;
    case 'Escape':
      if (isPanelOpen.value) {
        event.preventDefault();
        closePanel();
      }
      break;
    default:
      break;
  }
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false;
  emit('blur', event);
}

/* ─────────── Lifecycle (§41/§42) ─────────── */

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown);
  document.addEventListener('pointermove', onDocumentPointerMove);
  document.addEventListener('pointerup', onDocumentPointerUp);
  if (props.panelOnly) {
    // Static panel: visible from mount, so seed the draft + inputs now.
    ensureActiveMode();
    initDraftFromModel();
  } else if (props.defaultShow) {
    openPanel();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown);
  document.removeEventListener('pointermove', onDocumentPointerMove);
  document.removeEventListener('pointerup', onDocumentPointerUp);
  followViewport.stop();
});

watch(
  () => props.modelValue,
  () => {
    // External value change while visible — keep the panel in sync.
    if (isPanelOpen.value || props.panelOnly) initDraftFromModel();
  },
);

watch(
  () => [props.modes, props.showAlpha],
  () => {
    // Modes / alpha surface changed under a visible panel — re-clamp + re-seed.
    if (isPanelOpen.value || props.panelOnly) {
      ensureActiveMode();
      initDraftFromModel();
    }
  },
);
</script>

<style scoped>
.sn-color-picker {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

/* Panel-only hosts the static panel — no inline-flex trigger row. */
.sn-color-picker--panel-only {
  display: inline-block;
}

.sn-color-picker__selection {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: var(--sn-web-color-picker-height, 34px);
  padding: 0 var(--sn-web-color-picker-padding-x, 10px);
  padding-right: calc(var(--sn-web-color-picker-padding-x, 10px) + 22px);
  width: var(--sn-web-color-picker-width, 100%);
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-picker-border-color, var(--sn-web-color-border-subtle));
  border-radius: var(--sn-web-color-picker-radius, 6px);
  background-color: var(--sn-web-color-picker-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-color-picker-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  transition:
    border-color 0.18s ease-out,
    box-shadow 0.18s ease-out;
  outline: none;
}

.sn-color-picker__selection:focus-visible {
  border-color: var(--sn-web-color-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

.sn-color-picker--active .sn-color-picker__selection {
  border-color: var(--sn-web-color-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Sizes */
.sn-color-picker--mini {
  --sn-web-color-picker-height: 22px;
  font-size: 11px;
}
.sn-color-picker--tiny {
  --sn-web-color-picker-height: 24px;
  font-size: 12px;
}
.sn-color-picker--small {
  --sn-web-color-picker-height: 28px;
  font-size: 13px;
}
.sn-color-picker--medium {
  --sn-web-color-picker-height: 32px;
  font-size: 14px;
}
.sn-color-picker--large {
  --sn-web-color-picker-height: 40px;
  font-size: 15px;
}

.sn-color-picker__trigger-swatch {
  flex: none;
  width: var(--sn-web-color-picker-swatch-size, 16px);
  height: var(--sn-web-color-picker-swatch-size, 16px);
  border-radius: var(--sn-web-color-picker-swatch-radius, 4px);
  border: 1px solid var(--sn-web-color-picker-swatch-border, var(--sn-web-color-border-default));
  box-sizing: border-box;
}

.sn-color-picker__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
  font-variant-numeric: tabular-nums;
  text-transform: lowercase;
}

.sn-color-picker__placeholder {
  color: var(--sn-web-color-picker-placeholder-color, var(--sn-web-color-text-tertiary));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
}

/* Suffix */
.sn-color-picker__suffix {
  position: absolute;
  right: var(--sn-web-color-picker-suffix-right, 8px);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.sn-color-picker__suffix > * {
  pointer-events: auto;
}

.sn-color-picker__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-color-picker-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
}

.sn-color-picker__clear:hover {
  color: var(--sn-web-color-picker-clear-color-hover, var(--sn-web-color-text-primary));
  background-color: var(--sn-web-color-background-subtle);
}

.sn-color-picker__arrow {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-color-picker-arrow-color, var(--sn-web-color-text-tertiary));
  transition: transform 0.18s ease-out;
}

.sn-color-picker__arrow--up {
  transform: rotate(180deg);
}

/* Disabled / readonly */
.sn-color-picker--disabled .sn-color-picker__selection {
  cursor: not-allowed;
  background-color: var(--sn-web-color-picker-bg-disabled, var(--sn-web-color-background-subtle));
  color: var(--sn-web-color-picker-text-color-disabled, var(--sn-web-color-text-disabled));
  border-color: var(--sn-web-color-picker-border-color-disabled, var(--sn-web-color-border-subtle));
}

.sn-color-picker--readonly .sn-color-picker__selection {
  cursor: default;
  background-color: var(--sn-web-color-picker-bg-readonly, var(--sn-web-color-background-subtle));
}
</style>

<style scoped>
/* Color panel — teleported to body (same non-alias style-block convention
 * as the SnSelect menu / SnTimePicker panel); rendered in place when
 * panelOnly. */
.sn-color-picker-panel {
  position: fixed;
  z-index: var(--sn-web-color-picker-panel-z-index, 1000);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  box-sizing: border-box;
  width: var(--sn-web-color-picker-panel-width, 264px);
  border: 1px solid var(--sn-web-color-picker-panel-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--sn-web-color-picker-panel-radius, 4px);
  background-color: var(--sn-web-color-picker-panel-bg, var(--sn-web-color-background-elevated));
  /* naive-ui popover shadow — three faint layers, airy instead of heavy. */
  box-shadow: var(
    --sn-web-color-picker-panel-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
  font-family: inherit;
  font-size: var(--sn-web-color-picker-panel-font-size, 13px);
}

/* Panel-only — in flow, never fixed-positioned or popped. */
.sn-color-picker-panel--static {
  position: static;
}

/* The panel drops from the trigger edge it is anchored to. */
.sn-color-picker-panel--bottom {
  transform-origin: center top;
}

.sn-color-picker-panel--top {
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

/* SV square */
.sn-color-picker-panel__sv {
  position: relative;
  height: var(--sn-web-color-picker-sv-size, 180px);
  border-radius: var(--sn-web-color-picker-sv-radius, 6px);
  background-image:
    linear-gradient(to top, rgb(0 0 0), rgb(0 0 0 / 0)),
    linear-gradient(to right, rgb(255 255 255), rgb(255 255 255 / 0));
  background-blend-mode: normal;
  touch-action: none;
  cursor: crosshair;
}

.sn-color-picker-panel__sv-handle {
  position: absolute;
  width: 14px;
  height: 14px;
  transform: translate(-50%, -50%);
  border: 2px solid var(--sn-web-color-picker-handle-border, rgb(255 255 255));
  border-radius: 50%;
  box-shadow: 0 0 2px rgb(0 0 0 / 0.5);
  cursor: grab;
  outline: none;
}

.sn-color-picker-panel__sv-handle:focus-visible,
.sn-color-picker-panel__thumb:focus-visible {
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Rails + preview */
.sn-color-picker-panel__rails-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sn-color-picker-panel__rails {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sn-color-picker-panel__rail {
  position: relative;
  height: var(--sn-web-color-picker-rail-height, 12px);
  border-radius: var(--sn-web-color-picker-rail-radius, 6px);
  touch-action: none;
  cursor: pointer;
}

.sn-color-picker-panel__rail::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid var(--sn-web-color-picker-rail-border, rgb(0 0 0 / 0.06));
  box-sizing: border-box;
  pointer-events: none;
}

.sn-color-picker-panel__thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  border: 2px solid var(--sn-web-color-picker-handle-border, rgb(255 255 255));
  border-radius: 50%;
  box-shadow: 0 0 2px rgb(0 0 0 / 0.5);
  cursor: grab;
  outline: none;
}

.sn-color-picker-panel__preview {
  flex: none;
  width: var(--sn-web-color-picker-preview-size, 36px);
  height: var(--sn-web-color-picker-preview-size, 36px);
  border-radius: var(--sn-web-color-picker-preview-radius, 6px);
  border: 1px solid var(--sn-web-color-picker-swatch-border, var(--sn-web-color-border-default));
  box-sizing: border-box;
}

/* Format select + value inputs */
.sn-color-picker-panel__inputs {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sn-color-picker-panel__mode {
  position: relative;
  flex: none;
}

.sn-color-picker-panel__mode-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 6px 0 8px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-picker-input-border, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-color-picker-input-radius, 4px);
  background-color: var(--sn-web-color-picker-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-color-picker-input-color, var(--sn-web-color-text-primary));
  font-size: 12px;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
}

.sn-color-picker-panel__mode-trigger .sn-icon {
  color: var(--sn-web-color-picker-mode-arrow-color, var(--sn-web-color-text-tertiary));
}

.sn-color-picker-panel__mode-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 1;
  min-width: 100%;
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid var(--sn-web-color-picker-panel-border-color, rgba(0, 0, 0, 0.06));
  border-radius: var(--sn-web-color-picker-mode-menu-radius, 6px);
  background-color: var(--sn-web-color-picker-panel-bg, var(--sn-web-color-background-elevated));
  box-shadow: var(
    --sn-web-color-picker-panel-shadow,
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05)
  );
}

.sn-color-picker-panel__mode-option {
  padding: 4px 10px;
  border: none;
  border-radius: var(--sn-web-color-picker-mode-radius, 4px);
  background: transparent;
  color: var(--sn-web-color-picker-input-color, var(--sn-web-color-text-primary));
  font-size: 12px;
  font-family: inherit;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
}

.sn-color-picker-panel__mode-option:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-color-picker-panel__mode-option--active {
  color: var(--sn-web-color-picker-mode-color-active, var(--sn-web-color-action-primary));
  background-color: var(
    --sn-web-color-picker-mode-bg-active,
    var(--sn-web-color-action-primary-soft)
  );
}

/* Text / channel / alpha fields */
.sn-color-picker-panel__field {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

.sn-color-picker-panel__field-prefix,
.sn-color-picker-panel__field-suffix {
  position: absolute;
  color: var(--sn-web-color-picker-field-affix-color, var(--sn-web-color-text-tertiary));
  font-size: 12px;
  line-height: 1;
  pointer-events: none;
}

.sn-color-picker-panel__field-prefix {
  left: 8px;
}

.sn-color-picker-panel__field-suffix {
  right: 8px;
}

.sn-color-picker-panel__field--hex .sn-color-picker-panel__input {
  padding-left: 19px;
}

.sn-color-picker-panel__field--alpha {
  flex: none;
  width: var(--sn-web-color-picker-alpha-field-width, 56px);
}

.sn-color-picker-panel__field--alpha .sn-color-picker-panel__input {
  padding-right: 16px;
}

.sn-color-picker-panel__input {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 28px;
  padding: 0 8px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-picker-input-border, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-color-picker-input-radius, 4px);
  background-color: var(--sn-web-color-picker-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-color-picker-input-color, var(--sn-web-color-text-primary));
  font-size: 12px;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  outline: none;
}

.sn-color-picker-panel__channel {
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 4px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-color-picker-input-border, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-color-picker-input-radius, 4px);
  background-color: var(--sn-web-color-picker-input-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-color-picker-input-color, var(--sn-web-color-text-primary));
  font-size: 12px;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  text-align: center;
  outline: none;
}

.sn-color-picker-panel__input:focus-visible,
.sn-color-picker-panel__channel:focus-visible {
  border-color: var(--sn-web-color-action-primary);
}

.sn-color-picker-panel__input:disabled,
.sn-color-picker-panel__channel:disabled,
.sn-color-picker-panel__mode-trigger:disabled {
  cursor: not-allowed;
  color: var(--sn-web-color-picker-text-color-disabled, var(--sn-web-color-text-disabled));
  background-color: var(--sn-web-color-picker-bg-disabled, var(--sn-web-color-background-subtle));
}

/* Swatch sections */
.sn-color-picker-panel__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sn-color-picker-panel__section-title {
  color: var(--sn-web-color-picker-section-title-color, var(--sn-web-color-text-secondary));
  font-size: 12px;
  line-height: 1;
}

.sn-color-picker-panel__section-empty {
  color: var(--sn-web-color-picker-section-empty-color, var(--sn-web-color-text-tertiary));
  font-size: 12px;
  line-height: 1;
}

/* Swatches */
.sn-color-picker-panel__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sn-color-picker-panel__swatch {
  width: var(--sn-web-color-picker-swatch-size, 16px);
  height: var(--sn-web-color-picker-swatch-size, 16px);
  padding: 0;
  border: 1px solid var(--sn-web-color-picker-swatch-border, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-color-picker-swatch-radius, 4px);
  cursor: pointer;
}

.sn-color-picker-panel__swatch:hover {
  transform: scale(1.1);
}
</style>
