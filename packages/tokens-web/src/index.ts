/**
 * @snui/tokens-web — public API.
 *
 * Generates the `--sn-web-*` alias layer that references the shared
 * `--aui-*` base layer from `@snui/tokens`. Web-end components must consume
 * only `var(--sn-web-*)` per Spec-01 v1.2 §2 + Spec-02 v1.1 §3.3.
 *
 * Typical usage:
 * ```ts
 * import '@snui/tokens-web/styles'           // static stylesheet (preferred)
 * import { renderSnWebStyles } from '@snui/tokens-web'
 * const css = renderSnWebStyles()            // dynamic generation
 * ```
 */

export { snWebAliasMap, renderSnWebStyles, listSnWebAliases } from './variables.js'