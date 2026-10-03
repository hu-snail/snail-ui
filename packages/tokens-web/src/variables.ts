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
  ['--sn-web-color-text-disabled', '--aui-color-text-disabled'],
  ['--sn-web-color-text-on-primary', '--aui-color-text-on-primary'],
  ['--sn-web-color-background-surface', '--aui-color-background-surface'],
  ['--sn-web-color-background-subtle', '--aui-color-background-subtle'],
  ['--sn-web-color-border-default', '--aui-color-border-default'],
  ['--sn-web-color-border-subtle', '--aui-color-border-subtle'],
  ['--sn-web-color-action-primary', '--aui-color-action-primary'],
  ['--sn-web-color-action-primary-hover', '--aui-color-action-primary-hover'],
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