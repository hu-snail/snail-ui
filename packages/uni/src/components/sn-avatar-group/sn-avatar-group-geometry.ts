/**
 * sn-avatar-group geometry — pure functions behind the stack layout.
 *
 * Why this lives outside the SFC: happy-dom (the uni test environment) drops
 * `rpx` declarations from the inline `style` attribute, so the computed clip
 * window can never be asserted through the DOM (the same limitation the other
 * uni components' tests document). Keeping the arithmetic in a pure module
 * lets the numbers be tested exactly, while the component test keeps checking
 * the observable DOM shape (classes / bubble text / `overflow`).
 *
 * The model:
 *   - every member avatar pulls itself one `overlap` toward the previous one,
 *     so member `k` starts at `k × (diameter − overlap)`;
 *   - `maxCount` counts SLOTS, and the collapse bubble takes the last slot, so
 *     an overflowing group renders `maxCount − 1` avatars;
 *   - the clip window is exactly as long as the visible members occupy, and
 *     clips the rest.
 */

/** Named size presets → rpx diameter (mirrors sn-avatar's presets). */
export const SIZE_PRESETS: Readonly<Record<'large' | 'medium' | 'normal' | 'small', number>> = {
  large: 112,
  medium: 96,
  normal: 72,
  small: 48,
};

/** Share of the diameter one avatar overlaps onto the previous one. */
export const OVERLAP_RATIO = 0.35;

/**
 * Resolve a size to an rpx diameter.
 *
 * Mirrors sn-avatar: a bare number is px, a preset name maps to its rpx value,
 * and an explicit `rpx` / `px` length is honoured. Anything else (percent,
 * keyword) returns `null` — the group then skips the clip.
 */
export function toRpx(size: string | number): number | null {
  if (typeof size === 'number') return size * 2;
  const preset = SIZE_PRESETS[size as keyof typeof SIZE_PRESETS];
  if (preset !== undefined) return preset;
  const match = /^(\d+(?:\.\d+)?)(rpx|px)$/.exec(size.trim());
  if (match === null) return null;
  const value = Number(match[1]);
  return match[2] === 'px' ? value * 2 : value;
}

/** A usable limit is a positive integer count; anything else means "no limit". */
export function usableLimit(maxCount: number | undefined): number | null {
  if (typeof maxCount !== 'number' || !Number.isFinite(maxCount) || maxCount < 1) return null;
  return Math.floor(maxCount);
}

/** Everything the template needs to lay the stack out. */
export interface SnAvatarGroupGeometry {
  /** Avatar diameter in rpx (`null` when the size cannot be measured). */
  diameter: number | null;
  /** Overlap step in rpx (`null` when the size cannot be measured). */
  overlap: number | null;
  /** Avatars left visible (the collapse bubble owns the last slot). */
  visible: number;
  /** Avatars hidden behind the collapse bubble. */
  hidden: number;
  /** True when the group clips its stack. */
  clipping: boolean;
  /** Clip window length along the stack axis in rpx (0 while not clipping). */
  length: number;
  /** Which edge gets the compensation padding. */
  paddingSide: 'left' | 'right' | 'top';
  /** Stack axis (true = vertical column). */
  vertical: boolean;
}

/** Resolve the whole stack geometry for the current props + slot count. */
export function resolveGeometry(options: {
  total: number;
  maxCount: number | undefined;
  size: string | number;
  vertical: boolean;
  cascading: 'left-up' | 'right-up';
}): SnAvatarGroupGeometry {
  const limit = usableLimit(options.maxCount);
  const diameter = toRpx(options.size);
  // An unmeasurable size cannot host a clip window, so the group gives up on
  // the limit entirely: everything stays visible and no bubble is rendered.
  const overflow = limit !== null && diameter !== null && options.total > limit;
  const visible = overflow && limit !== null ? Math.max(limit - 1, 0) : options.total;
  const hidden = Math.max(options.total - visible, 0);
  const overlap = diameter === null ? null : Math.round(diameter * OVERLAP_RATIO);
  const clipping = overflow && overlap !== null;
  const length =
    clipping && diameter !== null && overlap !== null ? visible * (diameter - overlap) : 0;
  const paddingSide: SnAvatarGroupGeometry['paddingSide'] = options.vertical
    ? 'top'
    : options.cascading === 'left-up'
      ? 'right'
      : 'left';
  return {
    diameter,
    overlap,
    visible,
    hidden,
    clipping,
    length,
    paddingSide,
    vertical: options.vertical,
  };
}
