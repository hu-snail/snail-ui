/**
 * Web-end alias map (AUI-FOUND-005).
 *
 * Single source of truth for `--sn-web-*` aliases. Each entry is
 * `['--sn-web-xxx', '--aui-xxx']` — the Web CSS uses the alias and falls
 * through to the unified `--aui-*` base layer emitted by `@snui/tokens`.
 *
 * Per Spec-01 v1.2 §2.3:
 * - The list is readonly and ordered for deterministic CSS output.
 * - Adding a new alias requires updating this map AND keeping the static
 *   CSS in `styles/index.css` in sync (build-time consistency enforced by
 *   `variablesMatchStyles()` test).
 *
 * Per Spec-02 v1.1 §3.3:
 * - Web component CSS uses ONLY `--sn-web-*`. Direct reference to `--aui-*`
 *   or `--sn-mp-*` is forbidden by `token-check --dir packages/vue-web`.
 */
export const snWebAliasMap: ReadonlyArray<readonly [string, string]> = [
  // Semantic — color
  ['--sn-web-color-text-primary', '--aui-color-text-primary'],
  ['--sn-web-color-text-secondary', '--aui-color-text-secondary'],
  ['--sn-web-color-text-tertiary', '--aui-color-text-tertiary'],
  ['--sn-web-color-text-disabled', '--aui-color-text-disabled'],
  ['--sn-web-color-text-on-primary', '--aui-color-text-on-primary'],
  ['--sn-web-color-background-surface', '--aui-color-background-surface'],
  ['--sn-web-color-background-subtle', '--aui-color-background-subtle'],
  ['--sn-web-color-background-overlay', '--aui-color-background-overlay'],
  ['--sn-web-color-background-elevated', '--aui-color-background-elevated'],
  ['--sn-web-color-border-default', '--aui-color-border-default'],
  ['--sn-web-color-border-subtle', '--aui-color-border-subtle'],
  ['--sn-web-color-action-primary', '--aui-color-action-primary'],
  ['--sn-web-color-action-primary-hover', '--aui-color-action-primary-hover'],
  ['--sn-web-color-action-primary-soft', '--aui-color-action-primary-soft'],
  ['--sn-web-color-feedback-success', '--aui-color-feedback-success'],
  ['--sn-web-color-feedback-warning', '--aui-color-feedback-warning'],
  ['--sn-web-color-feedback-danger', '--aui-color-feedback-danger'],
  ['--sn-web-color-feedback-danger-hover', '--aui-color-feedback-danger-hover'],
  ['--sn-web-color-feedback-info', '--aui-color-feedback-info'],

  // Focus ring
  ['--sn-web-focus-ring', '--aui-focus-ring'],

  // Component tokens — Button (px)
  ['--sn-web-button-height-tiny', '--aui-button-height-tiny'],
  ['--sn-web-button-height-small', '--aui-button-height-small'],
  ['--sn-web-button-height-medium', '--aui-button-height-medium'],
  ['--sn-web-button-height-large', '--aui-button-height-large'],
  ['--sn-web-button-padding-x', '--aui-button-padding-x'],
  ['--sn-web-button-radius', '--aui-button-radius'],
  ['--sn-web-button-font-size', '--aui-button-font-size'],
  ['--sn-web-button-shadow', '--aui-button-shadow'],

  // Component tokens — Input (px)
  ['--sn-web-input-height-small', '--aui-input-height-small'],
  ['--sn-web-input-height-medium', '--aui-input-height-medium'],
  ['--sn-web-input-height-large', '--aui-input-height-large'],
  ['--sn-web-input-padding-x', '--aui-input-padding-x'],
  ['--sn-web-input-radius', '--aui-input-radius'],

  // Component tokens — Card (px)
  ['--sn-web-card-padding', '--aui-card-padding'],
  ['--sn-web-card-radius', '--aui-card-radius'],
  ['--sn-web-card-shadow', '--aui-card-shadow'],

  // Component tokens — Icon (px). Drives SnIcon size scale + stroke width.
  // Default sizeMedium (16px) matches lucide-vue-next's standard icon size.
  // Consumers override via :root { --sn-web-icon-size-medium: 18px; } etc.
  ['--sn-web-icon-size-tiny', '--aui-icon-size-tiny'],
  ['--sn-web-icon-size-small', '--aui-icon-size-small'],
  ['--sn-web-icon-size-medium', '--aui-icon-size-medium'],
  ['--sn-web-icon-size-large', '--aui-icon-size-large'],
  ['--sn-web-icon-size-xlarge', '--aui-icon-size-xlarge'],
  ['--sn-web-icon-stroke-width', '--aui-icon-stroke-width'],

  // Component tokens — Spin (px / unitless). Drives SnLoading.
  // `color` / `textColor` / `fontSize` / `descriptionGap` resolve through the
  // semantic layer in the base block; `opacitySpinning` is a bare number.
  ['--sn-web-spin-color', '--aui-spin-color'],
  ['--sn-web-spin-text-color', '--aui-spin-text-color'],
  ['--sn-web-spin-size-tiny', '--aui-spin-size-tiny'],
  ['--sn-web-spin-size-small', '--aui-spin-size-small'],
  ['--sn-web-spin-size-medium', '--aui-spin-size-medium'],
  ['--sn-web-spin-size-large', '--aui-spin-size-large'],
  ['--sn-web-spin-size-huge', '--aui-spin-size-huge'],
  ['--sn-web-spin-font-size', '--aui-spin-font-size'],
  ['--sn-web-spin-opacity-spinning', '--aui-spin-opacity-spinning'],
  ['--sn-web-spin-description-gap', '--aui-spin-description-gap'],

  // Component tokens — Skeleton (px / unitless). Drives SnSkeleton.
  // `color` / `colorEnd` / `radius` resolve through the semantic layer in the
  // base block; the height tiers are px.
  ['--sn-web-skeleton-color', '--aui-skeleton-color'],
  ['--sn-web-skeleton-color-end', '--aui-skeleton-color-end'],
  ['--sn-web-skeleton-radius', '--aui-skeleton-radius'],
  ['--sn-web-skeleton-height-small', '--aui-skeleton-height-small'],
  ['--sn-web-skeleton-height-medium', '--aui-skeleton-height-medium'],
  ['--sn-web-skeleton-height-large', '--aui-skeleton-height-large'],

  // Component tokens — Dialog (px / color / unitless). Drives SnDialog.
  // Full upstream `n-dialog` var surface: surface/text/border, icon per type,
  // close button, and the action row geometry.
  ['--sn-web-dialog-color', '--aui-dialog-color'],
  ['--sn-web-dialog-text-color', '--aui-dialog-text-color'],
  ['--sn-web-dialog-title-text-color', '--aui-dialog-title-text-color'],
  ['--sn-web-dialog-box-shadow', '--aui-dialog-box-shadow'],
  ['--sn-web-dialog-border', '--aui-dialog-border'],
  ['--sn-web-dialog-radius', '--aui-dialog-radius'],
  ['--sn-web-dialog-padding', '--aui-dialog-padding'],
  ['--sn-web-dialog-title-font-size', '--aui-dialog-title-font-size'],
  ['--sn-web-dialog-title-font-weight', '--aui-dialog-title-font-weight'],
  ['--sn-web-dialog-font-size', '--aui-dialog-font-size'],
  ['--sn-web-dialog-line-height', '--aui-dialog-line-height'],
  ['--sn-web-dialog-icon-size', '--aui-dialog-icon-size'],
  ['--sn-web-dialog-icon-margin', '--aui-dialog-icon-margin'],
  ['--sn-web-dialog-icon-margin-icon-top', '--aui-dialog-icon-margin-icon-top'],
  ['--sn-web-dialog-icon-color', '--aui-dialog-icon-color'],
  ['--sn-web-dialog-icon-color-info', '--aui-dialog-icon-color-info'],
  ['--sn-web-dialog-icon-color-success', '--aui-dialog-icon-color-success'],
  ['--sn-web-dialog-icon-color-warning', '--aui-dialog-icon-color-warning'],
  ['--sn-web-dialog-icon-color-error', '--aui-dialog-icon-color-error'],
  ['--sn-web-dialog-content-margin', '--aui-dialog-content-margin'],
  ['--sn-web-dialog-action-space', '--aui-dialog-action-space'],
  ['--sn-web-dialog-close-size', '--aui-dialog-close-size'],
  ['--sn-web-dialog-close-icon-size', '--aui-dialog-close-icon-size'],
  ['--sn-web-dialog-close-margin', '--aui-dialog-close-margin'],
  ['--sn-web-dialog-close-margin-icon-top', '--aui-dialog-close-margin-icon-top'],
  ['--sn-web-dialog-close-color', '--aui-dialog-close-color'],
  ['--sn-web-dialog-close-color-hover', '--aui-dialog-close-color-hover'],
  ['--sn-web-dialog-close-icon-color', '--aui-dialog-close-icon-color'],
  ['--sn-web-dialog-close-icon-color-hover', '--aui-dialog-close-icon-color-hover'],
  // Full upstream `n-drawer` var surface: surface/text/shadow, header/body/
  // footer padding + borders, and the close button + mask colours.
  ['--sn-web-drawer-color', '--aui-drawer-color'],
  ['--sn-web-drawer-text-color', '--aui-drawer-text-color'],
  ['--sn-web-drawer-title-text-color', '--aui-drawer-title-text-color'],
  ['--sn-web-drawer-box-shadow', '--aui-drawer-box-shadow'],
  ['--sn-web-drawer-line-height', '--aui-drawer-line-height'],
  ['--sn-web-drawer-radius', '--aui-drawer-radius'],
  ['--sn-web-drawer-header-padding', '--aui-drawer-header-padding'],
  ['--sn-web-drawer-body-padding', '--aui-drawer-body-padding'],
  ['--sn-web-drawer-footer-padding', '--aui-drawer-footer-padding'],
  ['--sn-web-drawer-title-font-size', '--aui-drawer-title-font-size'],
  ['--sn-web-drawer-title-font-weight', '--aui-drawer-title-font-weight'],
  ['--sn-web-drawer-header-border-bottom', '--aui-drawer-header-border-bottom'],
  ['--sn-web-drawer-footer-border-top', '--aui-drawer-footer-border-top'],
  ['--sn-web-drawer-close-size', '--aui-drawer-close-size'],
  ['--sn-web-drawer-close-icon-size', '--aui-drawer-close-icon-size'],
  ['--sn-web-drawer-close-icon-color', '--aui-drawer-close-icon-color'],
  ['--sn-web-drawer-close-icon-color-hover', '--aui-drawer-close-icon-color-hover'],
  ['--sn-web-drawer-close-color', '--aui-drawer-close-color'],
  ['--sn-web-drawer-close-color-hover', '--aui-drawer-close-color-hover'],
  ['--sn-web-drawer-mask-color', '--aui-drawer-mask-color'],
  // Semantic scale — spacing / radius / shadow / typography (AUI-TPL-001).
  // Component CSS historically only needed the button / input / card families,
  // so the semantic scales had no alias layer. Templates compose many
  // primitives into a full page and need the shared rhythm directly, rather
  // than inventing template-local pixel literals (Spec-02 v1.1 §3.3).
  ['--sn-web-spacing-0', '--aui-spacing-0'],
  ['--sn-web-spacing-1', '--aui-spacing-1'],
  ['--sn-web-spacing-2', '--aui-spacing-2'],
  ['--sn-web-spacing-3', '--aui-spacing-3'],
  ['--sn-web-spacing-4', '--aui-spacing-4'],
  ['--sn-web-spacing-5', '--aui-spacing-5'],
  ['--sn-web-spacing-6', '--aui-spacing-6'],
  ['--sn-web-spacing-8', '--aui-spacing-8'],
  ['--sn-web-spacing-10', '--aui-spacing-10'],
  ['--sn-web-spacing-12', '--aui-spacing-12'],
  ['--sn-web-radius-xs', '--aui-radius-xs'],
  ['--sn-web-radius-sm', '--aui-radius-sm'],
  ['--sn-web-radius-md', '--aui-radius-md'],
  ['--sn-web-radius-lg', '--aui-radius-lg'],
  ['--sn-web-radius-xl', '--aui-radius-xl'],
  ['--sn-web-radius-full', '--aui-radius-full'],
  ['--sn-web-shadow-xs', '--aui-shadow-xs'],
  ['--sn-web-shadow-sm', '--aui-shadow-sm'],
  ['--sn-web-shadow-md', '--aui-shadow-md'],
  ['--sn-web-shadow-lg', '--aui-shadow-lg'],
  ['--sn-web-font-family-body', '--aui-font-family-body'],
  ['--sn-web-font-family-heading', '--aui-font-family-heading'],
  ['--sn-web-font-family-code', '--aui-font-family-code'],
  ['--sn-web-font-size-xs', '--aui-font-size-xs'],
  ['--sn-web-font-size-sm', '--aui-font-size-sm'],
  ['--sn-web-font-size-md', '--aui-font-size-md'],
  ['--sn-web-font-size-lg', '--aui-font-size-lg'],
  ['--sn-web-font-size-xl', '--aui-font-size-xl'],
  ['--sn-web-font-size-2xl', '--aui-font-size-2xl'],
  ['--sn-web-font-weight-normal', '--aui-font-weight-normal'],
  ['--sn-web-font-weight-medium', '--aui-font-weight-medium'],
  ['--sn-web-font-weight-semibold', '--aui-font-weight-semibold'],
  ['--sn-web-font-weight-bold', '--aui-font-weight-bold'],
  ['--sn-web-font-line-height-tight', '--aui-font-line-height-tight'],
  ['--sn-web-font-line-height-normal', '--aui-font-line-height-normal'],
  ['--sn-web-font-line-height-loose', '--aui-font-line-height-loose'],
] as const

/** Render the alias layer as CSS `:root { ... }` block. */
export function renderSnWebStyles(): string {
  const body = snWebAliasMap
    .map(([alias, base]) => `  ${alias}: var(${base});`)
    .join('\n')
  return `:root {\n${body}\n}\n`
}

/** List all `--sn-web-*` alias names. */
export function listSnWebAliases(): ReadonlyArray<string> {
  return snWebAliasMap.map(([a]) => a)
}