/**
 * @snui/style-packs — Style Pack public types.
 *
 * Per AUI-PRD-v3.0 §3 + ADR-0002 + Spec-01 §2.2:
 *   A Style Pack is a pure-data object describing token overrides.
 *   It can additionally declare `skinCss` (path to a CSS file with
 *   .snui-skin-{name} scoped rules) and `resources` (fonts / SVG textures).
 *   Pack must NOT modify component DOM, props, or behavior — only visual layer.
 */

import type {
  ThemeDefinition,
  StyleDefinition,
  DensityDefinition,
} from '@snui/tokens'

export interface StylePackDefinition {
  /** kebab-case unique identifier. */
  name: string
  /** Human-readable label. */
  label: string
  /** Description (consumed by docs + MCP). */
  description?: string

  // --- Token layer ---
  theme?: ThemeDefinition
  style: StyleDefinition
  density?: DensityDefinition

  // --- Skin CSS layer ---
  /** Path to a CSS file containing .snui-skin-{name} scoped rules. */
  skinCss?: string

  // --- Resource layer ---
  /** URLs to extra resources (fonts, textures) to preload. */
  resources?: ReadonlyArray<string>

  /** Preview thumbnail path (consumed by docs site). */
  previewImage?: string
}

export type { ThemeDefinition, StyleDefinition, DensityDefinition }