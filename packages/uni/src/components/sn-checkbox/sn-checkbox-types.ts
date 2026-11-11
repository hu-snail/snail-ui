/**
 * sn-checkbox contract — shared types for `sn-checkbox` / `sn-checkbox-group`.
 *
 * The group provides this context through `provide()`; children read it with
 * `inject()` and fall back to their own props when a field is `undefined`
 * (wd-checkbox's documented "继承自 CheckboxGroup" defaults).
 */

import type { InjectionKey, Ref } from 'vue';

/** Value type shared by group selection entries and checkbox `name`s. */
export type SnCheckboxValue = string | number | boolean;

/** Shape preset — mirrors `wd-checkbox` `type`. */
export type SnCheckboxType = 'circle' | 'square' | 'button' | 'dot';

/** Tick position relative to the label. */
export type SnCheckboxPlacement = 'left' | 'right';

/** Layout direction of the group's children. */
export type SnCheckboxDirection = 'horizontal' | 'vertical';

/** Size preset — `large` is the only named tier wd-checkbox documents. */
export type SnCheckboxSize = 'large' | undefined;

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
export type SnChoiceMarkerShape = 'base' | 'inverted';

/** One registered child, as seen by the group (`toggleAll` enumeration). */
export interface SnCheckboxChild {
  /** The child's `name` — the value stored in the group selection. */
  name: SnCheckboxValue;
  /** Effective disabled state (own prop OR'd with the group's). */
  isDisabled: () => boolean;
}

/** Context injected by `SnCheckboxGroup` into child `SnCheckbox` instances. */
export interface SnCheckboxGroupContext {
  /** Whether `name` is currently in the group selection. */
  isChecked: (name: SnCheckboxValue) => boolean;
  /** Request a selection change for `name`. */
  toggle: (name: SnCheckboxValue, nextChecked: boolean) => void;
  /** Group-level disabled — ORs with the child's own `disabled`. */
  groupDisabled: Ref<boolean>;
  /** Group-level readonly — ORs with the child's own `readonly`. */
  groupReadonly: Ref<boolean>;
  /** Group-level shape preset. */
  groupType: Ref<SnCheckboxType>;
  /** Group-level checked color (empty string = token default). */
  groupCheckedColor: Ref<string>;
  /** Group-level unchecked color (empty string = token default). */
  groupUncheckedColor: Ref<string>;
  /** Group-level size preset. */
  groupSize: Ref<SnCheckboxSize>;
  /** Group-level tick placement. */
  groupPlacement: Ref<SnCheckboxPlacement>;
  /** Group-level layout direction. */
  groupDirection: Ref<SnCheckboxDirection>;
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
  /** Register a child so `toggleAll` can enumerate the real options. */
  registerChild: (child: SnCheckboxChild) => void;
  /** Unregister a child on unmount — keeps the registry leak-free (§41). */
  unregisterChild: (name: SnCheckboxValue) => void;
}

export const SN_CHECKBOX_GROUP_KEY: InjectionKey<SnCheckboxGroupContext> =
  Symbol('sn-checkbox-group');
