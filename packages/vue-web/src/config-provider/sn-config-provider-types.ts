/**
 * SnConfigProvider font configuration — naive-ui "fonts" doc equivalent.
 *
 * Web font stacks are host-app concerns (they need @font-face / network
 * fonts), so the provider does not load fonts: it only emits the CSS
 * variable overrides that the token cascade consumes. See the Fonts guide.
 */

/**
 * Per-role font-family overrides applied by `<SnConfigProvider :font>`.
 *
 * Each key maps onto the semantic font-family token:
 *   - `body`    → `--aui-font-family-body` (applied to `<body>` too)
 *   - `heading` → `--aui-font-family-heading`
 *   - `code`    → `--aui-font-family-code`
 *
 * Keys that are omitted keep the token default (the primitive sans/mono
 * stacks from `@snui/tokens`). Values are font-family lists exactly as in
 * CSS (quotes allowed; `</style` sequences are stripped before emission so
 * a value can never break out of the provider's style tag).
 */
export interface SnFontOverride {
  /** Body / default font stack (cascades to every component via `inherit`). */
  body?: string;
  /** Heading font stack, exposed as `--aui-font-family-heading`. */
  heading?: string;
  /** Code / mono font stack, exposed as `--aui-font-family-code`. */
  code?: string;
}
