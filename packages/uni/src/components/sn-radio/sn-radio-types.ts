/**
 * sn-radio contract — shared types for `sn-radio` / `sn-radio-group`.
 *
 * The group provides this context through `provide()`; children read it with
 * `inject()` and fall back to their own props when a field is `undefined`
 * (wd-radio's documented "继承自 wd-radio-group" defaults).
 */

import type { InjectionKey, Ref } from 'vue';

/** Value type shared by the group's selection and each radio's `value`. */
export type SnRadioValue = string | number | boolean;

/**
 * Group-level model type. `undefined` is the "nothing selected" sentinel —
 * wd-radio-group's default is unset, and `allowUncheck` needs a way to
 * express "back to unselected".
 */
export type SnRadioModelValue = SnRadioValue | undefined;

/** Shape preset — mirrors `wd-radio` `type`. */
export type SnRadioType = 'circle' | 'dot' | 'square' | 'button';

/** Marker position relative to the label. */
export type SnRadioPlacement = 'left' | 'right';

/** Layout direction of the group's children. */
export type SnRadioDirection = 'horizontal' | 'vertical';

/**
 * Layout variant (AUI additive — orthogonal to the wot-ui `type` marker
 * shape): `default` inline marker + label, `card` selectable card (custom
 * content via the `card` slot), `icon` square icon tile.
 */
export type SnChoiceVariant = 'default' | 'card';

/**
 * Where the marker / corner tick sits (AUI additive).
 *   - `leading` / `trailing` — inline before / after the label
 *   - `top-right` / `bottom-right` — absolute corner tick inside a card/tile
 *   - `none` — no marker; the card state alone carries the selection
 */
export type SnChoiceIndicatorPlacement =
  'leading' | 'trailing' | 'top-right' | 'bottom-right' | 'none';

/**
 * Which checked-state paint to apply (AUI additive).
 *   - `default`     — marker-only (existing behaviour)
 *   - `border`      — themed border
 *   - `fill`        — themed soft background
 *   - `border-fill` — both (default for `card` / `icon`)
 */
export type SnChoiceCheckedStyle = 'default' | 'border' | 'fill' | 'border-fill';

/**
 * Which side the label sits on (AUI additive). `marker-first` keeps the
 * historical order; `label-first` puts the label first and pushes the marker
 * to the far end — 标题在前、选择在后.
 */
export type SnChoiceLabelPlacement = 'marker-first' | 'label-first';

/**
 * Inline marker shape (AUI additive).
 *   - `ring`     — outlined circle / box with a small inner dot
 *   - `inverted` — the whole plate fills with the theme colour and the inner
 *                  dot is punched out in the surface colour (反转态)
 */
export type SnChoiceMarkerShape = 'base' | 'inverted' | 'check';

/** Context injected by `SnRadioGroup` into child `SnRadio` instances. */
export interface SnRadioGroupContext {
  /** Whether `value` is the currently selected entry. */
  isChecked: (value: SnRadioValue) => boolean;
  /** Select `value` (or clear it when `allowUncheck` is on). */
  select: (value: SnRadioValue) => void;
  /** Group-level disabled — ORs with the child's own `disabled`. */
  groupDisabled: Ref<boolean>;
  /** Group-level readonly — ORs with the child's own `readonly`. */
  groupReadonly: Ref<boolean>;
  /** Group-level shape preset. */
  groupType: Ref<SnRadioType>;
  /** Group-level checked color (empty string = token default). */
  groupCheckedColor: Ref<string>;
  /** Group-level unchecked color (empty string = token default). */
  groupUncheckedColor: Ref<string>;
  /** Group-level marker placement. */
  groupPlacement: Ref<SnRadioPlacement>;
  /** Group-level layout direction. */
  groupDirection: Ref<SnRadioDirection>;
  /** Group-level layout variant (AUI additive). */
  groupVariant: Ref<SnChoiceVariant | undefined>;
  /** Group-level indicator placement (AUI additive). */
  groupIndicatorPlacement: Ref<SnChoiceIndicatorPlacement | undefined>;
  /** Group-level checked paint (AUI additive). */
  groupCheckedStyle: Ref<SnChoiceCheckedStyle | undefined>;
  /** Group-level label side (AUI additive). */
  groupLabelPlacement: Ref<SnChoiceLabelPlacement | undefined>;
  /** Group-level marker shape (AUI additive). */
  groupMarkerShape: Ref<SnChoiceMarkerShape | undefined>;
}

export const SN_RADIO_GROUP_KEY: InjectionKey<SnRadioGroupContext> = Symbol('sn-radio-group');
