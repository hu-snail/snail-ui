/**
 * AUI Component Tokens (AUI-TOKEN-003) — component-level tokens that resolve
 * through the semantic layer. Each component token value is a CSS variable
 * reference; Style overrides can vary the visual personality (Modern / Glass /
 * Minimal) without touching semantic or primitive layers.
 *
 * Per AUI-PRD-v3.0 §3 + ADR-0002:
 *   - Component tokens sit BELOW Semantic
 *   - Style axis overrides component tokens
 *   - Density axis only overrides size/spacing primitives
 *   - Component token names use kebab-case in resolver output (e.g. `--aui-button-height-tiny`)
 *   - All component tokens must have a `--sn-*` brand alias (one-to-one mapping)
 *
 * Per AGENTS.md §34 + Spec-01 §1.3, only kebab-case serialized names are valid
 * CSS variable identifiers. Internal property names remain camelCase to match
 * TypeScript conventions.
 */

import type { SemanticRef } from './semantic.js';

/** A button-grouped semantic + primitive ref bundle. */
export interface ButtonComponentTokens {
  readonly heightTiny: SemanticRef;
  readonly heightSmall: SemanticRef;
  readonly heightMedium: SemanticRef;
  readonly heightLarge: SemanticRef;
  readonly paddingX: SemanticRef;
  readonly radius: SemanticRef;
  readonly fontSize: SemanticRef;
  readonly shadow: SemanticRef;
  readonly focusRing: SemanticRef;
}

export interface InputComponentTokens {
  readonly heightSmall: SemanticRef;
  readonly heightMedium: SemanticRef;
  readonly heightLarge: SemanticRef;
  readonly paddingX: SemanticRef;
  readonly radius: SemanticRef;
}

export interface CardComponentTokens {
  readonly padding: SemanticRef;
  readonly radius: SemanticRef;
  readonly shadow: SemanticRef;
}

export interface ComponentTokens {
  readonly button: ButtonComponentTokens;
  readonly input: InputComponentTokens;
  readonly card: CardComponentTokens;
}

/**
 * Default Modern style component tokens. The Style axis can swap this entire
 * block (e.g. to a Glass-style that increases shadow + lowers radius).
 *
 * Per ADR-0002, every component token must be exposed under BOTH:
 *   - `--aui-button-{key}` (raw cascade output)
 *   - `--sn-button-{key}`   (brand alias — what components actually consume)
 */
export const DEFAULT_COMPONENT_TOKENS: ComponentTokens = {
  button: {
    heightTiny: '24px',
    heightSmall: '32px',
    heightMedium: '36px',
    heightLarge: '44px',
    paddingX: '12px',
    radius: '6px',
    fontSize: '14px',
    shadow: 'none',
    focusRing: 'rgba(22, 119, 255, 0.25)',
  },
  input: {
    heightSmall: '28px',
    heightMedium: '34px',
    heightLarge: '42px',
    paddingX: '12px',
    radius: '6px',
  },
  card: {
    padding: '16px',
    radius: '8px',
    shadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  },
};