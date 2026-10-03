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
]

/**
 * Pass-through color aliases (no unit conversion). Each entry is
 * `['--sn-mp-xxx', 'var(--aui-xxx)']` — colors flow through to the unified
 * base layer so that themes / Style Packs affect both ends identically.
 */
export const snMpColorMap: ReadonlyArray<readonly [string, string]> = [
  ['--sn-mp-color-text-primary', 'var(--aui-color-text-primary)'],
  ['--sn-mp-color-text-secondary', 'var(--aui-color-text-secondary)'],
  ['--sn-mp-color-text-disabled', 'var(--aui-color-text-disabled)'],
  ['--sn-mp-color-text-on-primary', 'var(--aui-color-text-on-primary)'],
  ['--sn-mp-color-background-surface', 'var(--aui-color-background-surface)'],
  ['--sn-mp-color-background-subtle', 'var(--aui-color-background-subtle)'],
  ['--sn-mp-color-border-default', 'var(--aui-color-border-default)'],
  ['--sn-mp-color-border-subtle', 'var(--aui-color-border-subtle)'],
  ['--sn-mp-color-action-primary', 'var(--aui-color-action-primary)'],
  ['--sn-mp-color-action-primary-hover', 'var(--aui-color-action-primary-hover)'],
  ['--sn-mp-color-feedback-success', 'var(--aui-color-feedback-success)'],
  ['--sn-mp-color-feedback-warning', 'var(--aui-color-feedback-warning)'],
  ['--sn-mp-color-feedback-danger', 'var(--aui-color-feedback-danger)'],
  ['--sn-mp-color-feedback-danger-hover', 'var(--aui-color-feedback-danger-hover)'],
  ['--sn-mp-color-feedback-info', 'var(--aui-color-feedback-info)'],
  ['--sn-mp-focus-ring', 'var(--aui-focus-ring)'],
]

/** Combined: all aliases emitted by this package. */
export const snMpAliasMap: ReadonlyArray<readonly [string, string]> = [
  ...snMpSizeMap,
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