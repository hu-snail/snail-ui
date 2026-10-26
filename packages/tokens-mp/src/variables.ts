/**
 * MP-end alias map (AUI-FOUND-006).
 *
 * Per Spec-01 v1.2 §2.4: tokens-mp converts px values to rpx for size /
 * spacing / padding / radius components. Conversion rule: 1px = 2rpx
 * (assuming 375 design width / 750 rpx canvas).
 *
 * Color values are NOT converted — they remain identical hex literals or
 * `var(--aui-color-*)` indirection.
 *
 * Per Spec-02 v1.1 §3.3: uni component CSS uses ONLY `--sn-mp-*`.
 */

const PX_TO_RPX = 2 // 750 rpx design / 375 px design

function toRpx(px: string | number): string {
  const n = typeof px === 'string' ? parseFloat(px) : px
  return `${n * PX_TO_RPX}rpx`
}

/**
 * rpx-converted aliases for size / spacing / radius components.
 * Each entry is `['--sn-mp-xxx', '<literal-rpx>']` — the value is a literal
 * rpx string, NOT a `var()` reference, since CSS does not auto-convert units.
 */
export const snMpSizeMap: ReadonlyArray<readonly [string, string]> = [
  // Button sizes (px → rpx)
  ['--sn-mp-button-height-tiny', toRpx(24)],
  ['--sn-mp-button-height-small', toRpx(32)],
  ['--sn-mp-button-height-medium', toRpx(36)],
  ['--sn-mp-button-height-large', toRpx(44)],
  ['--sn-mp-button-padding-x', toRpx(12)],
  ['--sn-mp-button-radius', toRpx(6)],
  ['--sn-mp-button-font-size', toRpx(14)],

  // Input sizes
  ['--sn-mp-input-height-small', toRpx(28)],
  ['--sn-mp-input-height-medium', toRpx(34)],
  ['--sn-mp-input-height-large', toRpx(42)],
  ['--sn-mp-input-padding-x', toRpx(12)],
  ['--sn-mp-input-radius', toRpx(6)],

  // Card
  ['--sn-mp-card-padding', toRpx(16)],
  ['--sn-mp-card-radius', toRpx(8)],

  // Icon (5-tier size + stroke width).
  // Default sizeMedium 32rpx = 16px on a 375 viewport — matches lucide's
  // 16px standard icon. Mobile-side consumers override per-page:
  //   page { --sn-mp-icon-size-medium: 36rpx; }   /* slightly larger for touch */
  ['--sn-mp-icon-size-tiny', toRpx(12)],
  ['--sn-mp-icon-size-small', toRpx(14)],
  ['--sn-mp-icon-size-medium', toRpx(16)],
  ['--sn-mp-icon-size-large', toRpx(20)],
  ['--sn-mp-icon-size-xlarge', toRpx(24)],
  // stroke-width stays as raw design unit (no px/rpx conversion needed for
  // the SVG attribute); emitted literally so the runtime sees `2` not `4`.
  ['--sn-mp-icon-stroke-width', '2'],

  // Semantic scale — spacing / radius (AUI-TPL-001). The mp end converts the
  // px design values to rpx so uni templates share the web rhythm exactly;
  // without this layer a template would have to hard-code rpx literals and
  // drift from the shared 8pt scale.
  ['--sn-mp-spacing-0', toRpx(0)],
  ['--sn-mp-spacing-1', toRpx(2)],
  ['--sn-mp-spacing-2', toRpx(4)],
  ['--sn-mp-spacing-3', toRpx(8)],
  ['--sn-mp-spacing-4', toRpx(12)],
  ['--sn-mp-spacing-5', toRpx(16)],
  ['--sn-mp-spacing-6', toRpx(20)],
  ['--sn-mp-spacing-8', toRpx(24)],
  ['--sn-mp-spacing-10', toRpx(32)],
  ['--sn-mp-spacing-12', toRpx(40)],
  ['--sn-mp-radius-xs', toRpx(2)],
  ['--sn-mp-radius-sm', toRpx(4)],
  ['--sn-mp-radius-md', toRpx(6)],
  ['--sn-mp-radius-lg', toRpx(8)],
  ['--sn-mp-radius-xl', toRpx(12)],
  ['--sn-mp-radius-full', toRpx(9999)],

  // Typography (AUI-TPL-002). Templates set body copy, so the mp end needs the
  // font scale the web end already aliases. Line heights are unitless ratios
  // and live in `snMpUnitlessMap` instead — this map stays strictly rpx so its
  // contract (every value is a length) keeps holding.
  ['--sn-mp-font-size-xs', toRpx(11)],
  ['--sn-mp-font-size-sm', toRpx(12)],
  ['--sn-mp-font-size-md', toRpx(14)],
  ['--sn-mp-font-size-lg', toRpx(16)],
  ['--sn-mp-font-size-xl', toRpx(18)],
  ['--sn-mp-font-size-2xl', toRpx(20)],
]

/**
 * Pass-through aliases (no unit conversion) — colors, shadows, focus ring.
 * Each entry is `['--sn-mp-xxx', 'var(--aui-xxx)']`, so themes / Style Packs
 * affect both ends identically.
 */
export const snMpColorMap: ReadonlyArray<readonly [string, string]> = [
  ['--sn-mp-color-text-primary', 'var(--aui-color-text-primary)'],
  ['--sn-mp-color-text-secondary', 'var(--aui-color-text-secondary)'],
  ['--sn-mp-color-text-disabled', 'var(--aui-color-text-disabled)'],
  ['--sn-mp-color-text-tertiary', 'var(--aui-color-text-tertiary)'],
  ['--sn-mp-color-text-on-primary', 'var(--aui-color-text-on-primary)'],
  ['--sn-mp-color-background-surface', 'var(--aui-color-background-surface)'],
  ['--sn-mp-color-background-subtle', 'var(--aui-color-background-subtle)'],
  ['--sn-mp-color-background-elevated', 'var(--aui-color-background-elevated)'],
  ['--sn-mp-color-background-overlay', 'var(--aui-color-background-overlay)'],
  // Tinted surfaces used by soft / subtle variants and cell fill states.
  // They resolve through the semantic layer (not a literal rgba) so dark mode
  // flips them along with the rest of the palette — a hardcoded
  // `rgba(0,0,0,0.04)` stays invisible on a dark surface.
  ['--sn-mp-color-background-soft', 'var(--aui-color-background-subtle)'],
  ['--sn-mp-color-background-sunken', 'var(--aui-color-background-sunken)'],
  ['--sn-mp-color-border-default', 'var(--aui-color-border-default)'],
  ['--sn-mp-color-border-subtle', 'var(--aui-color-border-subtle)'],
  ['--sn-mp-color-action-primary', 'var(--aui-color-action-primary)'],
  ['--sn-mp-color-action-primary-hover', 'var(--aui-color-action-primary-hover)'],
  ['--sn-mp-color-action-primary-soft', 'var(--aui-color-action-primary-soft)'],
  ['--sn-mp-color-feedback-success', 'var(--aui-color-feedback-success)'],
  ['--sn-mp-color-feedback-success-soft', 'var(--aui-color-feedback-success-soft)'],
  ['--sn-mp-color-feedback-warning', 'var(--aui-color-feedback-warning)'],
  ['--sn-mp-color-feedback-warning-soft', 'var(--aui-color-feedback-warning-soft)'],
  ['--sn-mp-color-feedback-danger', 'var(--aui-color-feedback-danger)'],
  ['--sn-mp-color-feedback-danger-hover', 'var(--aui-color-feedback-danger-hover)'],
  ['--sn-mp-color-feedback-danger-soft', 'var(--aui-color-feedback-danger-soft)'],
  ['--sn-mp-color-feedback-info', 'var(--aui-color-feedback-info)'],
  // Input surface slots — referenced by sn-input / sn-form-item.
  ['--sn-mp-color-input-bg', 'var(--aui-color-background-surface)'],
  ['--sn-mp-color-input-text', 'var(--aui-color-text-primary)'],
  ['--sn-mp-color-input-placeholder', 'var(--aui-color-text-disabled)'],
  ['--sn-mp-color-input-border', 'var(--aui-color-border-default)'],
  ['--sn-mp-color-input-border-focus', 'var(--aui-color-action-primary)'],
  // Selection-control slots — consumed by sn-checkbox / sn-radio / sn-switch.
  // `control-unchecked` is the unchecked ring / inactive rail; it needs its own
  // slot because the neutral border token (`border-default`) sits at gray-200
  // in light mode, which is invisible against the near-black dark surface.
  // `control-knob` is the switch thumb / checkbox tick plate: it stays light in
  // both themes because the rail underneath it is a saturated brand fill.
  ['--sn-mp-color-control-unchecked', 'var(--aui-color-border-default)'],
  ['--sn-mp-color-control-knob', 'var(--aui-color-background-elevated)'],
  // Extra accent hues — the tag `type` set needs five more distinguishable
  // colours than the semantic palette carries. Each pair is solid + tint so a
  // tag can render both the filled (`dark`) and tinted (`light`) variant from
  // tokens only; the dark block re-declares the tints with a higher alpha.
  ['--sn-mp-color-volcano', 'var(--aui-color-volcano)'],
  ['--sn-mp-color-volcano-soft', 'var(--aui-color-volcano-soft)'],
  ['--sn-mp-color-lightblue', 'var(--aui-color-lightblue)'],
  ['--sn-mp-color-lightblue-soft', 'var(--aui-color-lightblue-soft)'],
  ['--sn-mp-color-cyan', 'var(--aui-color-cyan)'],
  ['--sn-mp-color-cyan-soft', 'var(--aui-color-cyan-soft)'],
  ['--sn-mp-color-pink', 'var(--aui-color-pink)'],
  ['--sn-mp-color-pink-soft', 'var(--aui-color-pink-soft)'],
  ['--sn-mp-color-purple', 'var(--aui-color-purple)'],
  ['--sn-mp-color-purple-soft', 'var(--aui-color-purple-soft)'],
  ['--sn-mp-shadow-xs', 'var(--aui-shadow-xs)'],
  ['--sn-mp-shadow-sm', 'var(--aui-shadow-sm)'],
  ['--sn-mp-shadow-md', 'var(--aui-shadow-md)'],
  ['--sn-mp-shadow-lg', 'var(--aui-shadow-lg)'],
  ['--sn-mp-focus-ring', 'var(--aui-focus-ring)'],
  ['--sn-mp-button-shadow', 'var(--aui-button-shadow)'],
  ['--sn-mp-card-shadow', 'var(--aui-card-shadow)'],
]

/**
 * Unitless scale aliases — ratios and raw design units that must NOT be
 * converted to rpx (a line-height of `1.5` means the same thing on every
 * device; `3rpx` would be meaningless). Kept apart from `snMpSizeMap` so that
 * map's "every value is an rpx length" contract keeps holding.
 */
export const snMpUnitlessMap: ReadonlyArray<readonly [string, string]> = [
  ['--sn-mp-font-line-height-tight', '1.2'],
  ['--sn-mp-font-line-height-normal', '1.5'],
  ['--sn-mp-font-line-height-loose', '1.8'],
  ['--sn-mp-font-weight-normal', '400'],
  ['--sn-mp-font-weight-medium', '500'],
  ['--sn-mp-font-weight-semibold', '600'],
  ['--sn-mp-font-weight-bold', '700'],
]

/** Combined: all aliases emitted by this package. */
export const snMpAliasMap: ReadonlyArray<readonly [string, string]> = [
  ...snMpSizeMap,
  ...snMpUnitlessMap,
  ...snMpColorMap,
]

export function renderSnMpStyles(): string {
  const body = snMpAliasMap.map(([a, v]) => `  ${a}: ${v};`).join('\n')
  return `:root {\n${body}\n}\n`
}

export function listSnMpAliases(): ReadonlyArray<string> {
  return snMpAliasMap.map(([a]) => a)
}

/**
 * Convert px → rpx explicitly. Exposed for tests + advanced Style Pack
 * scenarios where the consumer wants to compute rpx at runtime.
 */
export function pxToRpx(px: string | number): string {
  return toRpx(px)
}