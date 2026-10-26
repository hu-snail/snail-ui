/**
 * AUI Tokens package — framework-agnostic design tokens with Primitive /
 * Semantic / Component cascade and Theme / Style / Density axes.
 *
 *   AUI-TOKEN-001 Primitive Tokens    (raw design values, no semantic meaning)
 *   AUI-TOKEN-002 Semantic Tokens     (semantic aliases → primitive refs)
 *   AUI-TOKEN-003 Component Tokens    (component-shape aliases → semantic refs)
 *   AUI-TOKEN-004 Token Cascade       (Theme/Style/Density + variant + instance override)
 *
 * Consumers (renderer / components) read tokens via CSS `var(--aui-...)` —
 * the resolver emits a flat binding list ready for `:root` injection.
 */

export {
  DEFAULT_PRIMITIVE_TOKENS,
  type PrimitiveTokens,
  type ColorPalette,
  type ColorScale,
  type SpacingScale,
  type RadiusScale,
  type FontTokens,
  type FontFamilyTokens,
  type FontSizeTokens,
  type FontWeightTokens,
  type ShadowScale,
  type MotionTokens,
  type MotionDurationTokens,
  type MotionEasingTokens,
  type SizeTokens,
} from './primitive.js';

export {
  DEFAULT_SEMANTIC_TOKENS,
  type SemanticTokens,
  type SemanticRef,
  type ColorSemanticTokens,
  type ColorSemanticText,
  type ColorSemanticBackground,
  type ColorSemanticBorder,
  type ColorSemanticAction,
  type ColorSemanticFeedback,
  type SpacingSemanticTokens,
  type RadiusSemanticTokens,
  type ShadowSemanticTokens,
  type SizeSemanticTokens,
  type FontSemanticTokens,
  type MotionSemanticTokens,
} from './semantic.js';

export {
  DEFAULT_COMPONENT_TOKENS,
  type ComponentTokens,
  type ButtonComponentTokens,
  type InputComponentTokens,
  type CardComponentTokens,
} from './component.js';

export {
  LIGHT_THEME,
  DARK_THEME,
  MODERN_STYLE,
  COMPACT_DENSITY,
  COMFORTABLE_DENSITY,
  type ThemeDefinition,
  type StyleDefinition,
  type DensityDefinition,
  type VariantDefinition,
  type TokenEnvironment,
} from './theme.js';

export {
  resolveEnvironment,
  renderStyleBlock,
  type TokenBinding,
} from './resolver.js';

export {
  snCssVars,
  snVarName,
  auiVarName,
  type SnCssVarsOptions,
} from './css-vars.js';