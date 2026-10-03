/**
 * AUI Component Tokens (AUI-TOKEN-003) — component-level tokens that resolve
 * through the semantic layer. Each component token value is a CSS variable
 * reference; Style overrides can vary the visual personality (Modern / Glass /
 * Minimal) without touching semantic or primitive layers.
 *
 * Per AGENTS.md §33-35:
 *   - Component tokens sit BELOW Semantic
 *   - Style axis overrides component tokens
 *   - Density axis only overrides size/spacing primitives
 */

import type { SemanticRef } from './semantic.js';

export interface ButtonComponentTokens {
  readonly heightSm: SemanticRef;
  readonly heightMd: SemanticRef;
  readonly heightLg: SemanticRef;
  readonly paddingX: SemanticRef;
  readonly radius: SemanticRef;
  readonly fontSize: SemanticRef;
  readonly shadow: SemanticRef;
}

export interface InputComponentTokens {
  readonly heightSm: SemanticRef;
  readonly heightMd: SemanticRef;
  readonly heightLg: SemanticRef;
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
 */
export const DEFAULT_COMPONENT_TOKENS: ComponentTokens = {
  button: {
    heightSm: 'var(--aui-size-control-sm)',
    heightMd: 'var(--aui-size-control-md)',
    heightLg: 'var(--aui-size-control-lg)',
    paddingX: 'var(--aui-spacing-inset-md)',
    radius: 'var(--aui-radius-control)',
    fontSize: 'var(--aui-font-size-body)',
    shadow: 'var(--aui-shadow-control)',
  },
  input: {
    heightSm: 'var(--aui-size-control-sm)',
    heightMd: 'var(--aui-size-control-md)',
    heightLg: 'var(--aui-size-control-lg)',
    paddingX: 'var(--aui-spacing-inset-sm)',
    radius: 'var(--aui-radius-control)',
  },
  card: {
    padding: 'var(--aui-spacing-inset-lg)',
    radius: 'var(--aui-radius-card)',
    shadow: 'var(--aui-shadow-card)',
  },
};