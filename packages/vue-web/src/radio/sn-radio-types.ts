/**
 * Shared types + injection contract for SnRadio / SnRadioButton /
 * SnRadioGroup (AUI-WEB-RADIO-001).
 *
 * Mirrors naive-ui's radio injection contract — the group owns the
 * `modelValue` / `name` / `size` / `status` / `disabled` state and each
 * child radio reads it to derive its own checked / interactive state.
 * Keeping this in a plain `.ts` module avoids a circular import between
 * parent and child SFCs.
 */
import type { InjectionKey, Ref } from 'vue';

/** Radio value type — string / number / boolean, like naive-ui. */
export type SnRadioValue = string | number | boolean;

/** Visual size preset shared by radio + group. */
export type SnRadioSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large';

/** Validation-driven visual status. */
export type SnRadioStatus = 'default' | 'error' | 'warning';

/**
 * Layout variant (AUI additive — orthogonal to uni's marker `type`):
 *   - `default` — inline marker + label (existing behaviour)
 *   - `card`    — the whole row is a selectable card; custom content via `#card`
 *   - `icon`    — square icon tile, centred glyph only (icon-grid pickers)
 */
export type SnChoiceVariant = 'default' | 'card' | 'icon';

/**
 * Where the marker (or corner tick) sits.
 *   - `leading` / `trailing` — inline before / after the label
 *   - `top-right` / `bottom-right` — absolute corner tick inside a card/tile
 *   - `none` — no marker; selection is carried by the card state alone
 */
export type SnChoiceIndicatorPlacement =
  'leading' | 'trailing' | 'top-right' | 'bottom-right' | 'none';

/**
 * Which checked-state paint to apply.
 *   - `default`     — marker-only (existing behaviour)
 *   - `border`      — themed border
 *   - `fill`        — themed soft background
 *   - `border-fill` — both (default for `card` / `icon` variants)
 */
export type SnChoiceCheckedStyle = 'default' | 'border' | 'fill' | 'border-fill';

/**
 * Which side the label sits on (AUI additive). `marker-first` keeps the
 * historical order (marker → label); `label-first` puts the label first and
 * pushes the marker to the far end — "标题在前、选择在后".
 */
export type SnChoiceLabelPlacement = 'marker-first' | 'label-first';

/**
 * Marker shape for the inline form (AUI additive).
 *   - `ring`     — outlined circle with a small inner dot (historical)
 *   - `inverted` — the whole circle fills with the theme colour and the inner
 *                  dot is punched out in the surface colour (反转态)
 */
export type SnChoiceMarkerShape = 'ring' | 'inverted';

/** Option shape for the group's `options` prop (naive-ui parity). */
export interface SnRadioOption {
  label?: string;
  value?: SnRadioValue;
  disabled?: boolean;
  readonly?: boolean;
  size?: SnRadioSize;
  status?: SnRadioStatus;
  /** Per-option layout variant override (additive). */
  variant?: SnChoiceVariant;
  /** Per-option indicator placement override (additive). */
  indicatorPlacement?: SnChoiceIndicatorPlacement;
  /** Per-option checked paint override (additive). */
  checkedStyle?: SnChoiceCheckedStyle;
  /** Per-option label side override (additive). */
  labelPlacement?: SnChoiceLabelPlacement;
  /** Per-option marker shape override (additive). */
  markerShape?: SnChoiceMarkerShape;
}

export interface SnRadioGroupContext {
  /** Group's bound value — the child compares its `checkedValue` against it. */
  modelValue: Ref<SnRadioValue | null>;
  /** Shared native `name` so browser arrow-key navigation works. */
  name: Ref<string | undefined>;
  /** Group-level size, overridable per radio. */
  size: Ref<SnRadioSize>;
  /** Group-level status, overridable per radio. */
  status: Ref<SnRadioStatus>;
  /** Group-level disabled, OR-ed with the child's own `disabled`. */
  disabled: Ref<boolean>;
  /** Group-level layout variant, overridable per radio (additive). */
  variant: Ref<SnChoiceVariant | undefined>;
  /** Group-level indicator placement, overridable per radio (additive). */
  indicatorPlacement: Ref<SnChoiceIndicatorPlacement | undefined>;
  /** Group-level checked paint, overridable per radio (additive). */
  checkedStyle: Ref<SnChoiceCheckedStyle | undefined>;
  /** Group-level label side, overridable per radio (additive). */
  labelPlacement: Ref<SnChoiceLabelPlacement | undefined>;
  /** Group-level marker shape, overridable per radio (additive). */
  markerShape: Ref<SnChoiceMarkerShape | undefined>;
  /** Bubble a radio activation up to the group's `update:modelValue` emit. */
  onChange: (value: SnRadioValue) => void;
}

export const snRadioGroupInjectionKey: InjectionKey<SnRadioGroupContext> = Symbol('sn-radio-group');
