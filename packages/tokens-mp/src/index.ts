/**
 * @snui/tokens-mp — public API.
 *
 * Generates the `--sn-mp-*` alias layer for uni-app mobile end. Size /
 * spacing / radius use rpx (px × 2 for 750 design width). Color passes
 * through to the unified `--aui-*` base layer.
 *
 * Per Spec-01 v1.2 §2.4 + Spec-02 v1.1 §3.3, uni component CSS uses ONLY
 * `var(--sn-mp-*)`.
 *
 * Typical usage:
 * ```ts
 * import '@snui/tokens-mp/styles'           // static stylesheet (preferred)
 * import { renderSnMpStyles, pxToRpx } from '@snui/tokens-mp'
 * ```
 */

export {
  snMpAliasMap,
  snMpSizeMap,
  snMpColorMap,
  renderSnMpStyles,
  listSnMpAliases,
  pxToRpx,
} from './variables.js'