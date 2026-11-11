/**
 * Checkbox group provide/inject contract — internal to `src/checkbox/`.
 *
 * Kept inside the checkbox folder so no shared wiring (install.ts /
 * index.ts / resolver.ts) is touched; the key mirrors the string-key
 * convention used by tabs (`'sn-tabs-active-value'`).
 */

import type { InjectionKey, Ref } from 'vue';

/** Value type shared by group options and checkbox `value` props. */
export type SnCheckboxValue = string | number | boolean;

/**
 * Layout variant (AUI additive): `default` inline marker + label,
 * `card` selectable card (`#card` slot for content), `icon` square icon tile.
 */
export type SnCheckboxVariant = 'default' | 'card';

/**
 * Where the marker (or corner tick) sits.
 *   - `leading` / `trailing` — inline before / after the label
 *   - `top-right` / `bottom-right` — absolute corner tick inside a card/tile
 *   - `none` — no marker; selection is carried by the card state alone
 */
export type SnCheckboxIndicatorPlacement =
  'leading' | 'trailing' | 'top-right' | 'bottom-right' | 'none';

/**
 * Which checked-state paint to apply.
 *   - `default`     — marker-only (existing behaviour)
 *   - `border`      — themed border
 *   - `fill`        — themed soft background
 *   - `border-fill` — both (default for `card` / `icon` variants)
 */
export type SnCheckboxCheckedStyle = 'default' | 'border' | 'fill' | 'border-fill';

/**
 * Which side the label sits on (AUI additive). `marker-first` keeps the
 * historical order; `label-first` puts the label first and pushes the box to
 * the far end ("标题在前、选择在后").
 */
export type SnCheckboxLabelPlacement = 'marker-first' | 'label-first';

/**
 * Marker shape for the inline form (AUI additive). `ring` is the historical
 * outlined box; `inverted` fills the box with the theme colour and punches
 * the tick out in the surface colour (反转态).
 */
export type SnCheckboxMarkerShape = 'base' | 'inverted';

/** Shape accepted by `SnCheckboxGroup`'s `options` prop entries. */
export interface SnCheckboxGroupOption {
  label?: string;
  value: SnCheckboxValue;
  disabled?: boolean;
  /** Per-option layout variant override (additive). */
  variant?: SnCheckboxVariant;
  /** Per-option indicator placement override (additive). */
  indicatorPlacement?: SnCheckboxIndicatorPlacement;
  /** Per-option checked paint override (additive). */
  checkedStyle?: SnCheckboxCheckedStyle;
  /** Per-option label side override (additive). */
  labelPlacement?: SnCheckboxLabelPlacement;
  /** Per-option marker shape override (additive). */
  markerShape?: SnCheckboxMarkerShape;
}

/** Context injected by SnCheckboxGroup into child SnCheckbox instances. */
export interface SnCheckboxGroupContext {
  /** Reactive selected value list (group-level v-model). */
  selectedValues: Ref<SnCheckboxValue[]>;
  /** Group-level disabled flag — ORs with the child's own `disabled`. */
  groupDisabled: Ref<boolean>;
  /** Group size preset; wins over the child's own `size`. */
  groupSize: Ref<'mini' | 'tiny' | 'small' | 'medium' | 'large' | undefined>;
  /** Group-level layout variant, overridable per checkbox (additive). */
  groupVariant: Ref<SnCheckboxVariant | undefined>;
  /** Group-level indicator placement, overridable per checkbox (additive). */
  groupIndicatorPlacement: Ref<SnCheckboxIndicatorPlacement | undefined>;
  /** Group-level checked paint, overridable per checkbox (additive). */
  groupCheckedStyle: Ref<SnCheckboxCheckedStyle | undefined>;
  /** Group-level label side, overridable per checkbox (additive). */
  groupLabelPlacement: Ref<SnCheckboxLabelPlacement | undefined>;
  /** Group-level marker shape, overridable per checkbox (additive). */
  groupMarkerShape: Ref<SnCheckboxMarkerShape | undefined>;
  /** Toggle one child's membership in the selection. */
  toggleValue: (value: SnCheckboxValue, nextChecked: boolean) => void;
  /** Whether the child is registered inside a group. */
  isInsideGroup: true;
}

export const SN_CHECKBOX_GROUP_KEY: InjectionKey<SnCheckboxGroupContext> =
  Symbol('sn-checkbox-group');
