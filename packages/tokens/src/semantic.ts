/**
 * AUI Semantic Tokens (AUI-TOKEN-002) — semantic names mapped to primitive refs.
 *
 * Each semantic token value is a CSS variable reference that ultimately resolves
 * to a primitive. Themes (Light/Dark) swap the underlying primitive block; the
 * semantic layer stays structurally identical so consumer code is theme-agnostic.
 *
 * Per AGENTS.md §34, components consume via `var(--aui-color-action-primary)` —
 * the resolver (AUI-TOKEN-004) is responsible for generating the actual CSS
 * variable bindings for both primitive values and semantic aliases.
 */

/** A semantic token's value is a CSS variable name. */
export type SemanticRef = string;

export interface ColorSemanticText {
  readonly primary: SemanticRef;
  readonly secondary: SemanticRef;
  readonly tertiary: SemanticRef;
  readonly disabled: SemanticRef;
  readonly inverse: SemanticRef;
  readonly onAccent: SemanticRef;
}

export interface ColorSemanticBackground {
  readonly surface: SemanticRef;
  readonly elevated: SemanticRef;
  readonly sunken: SemanticRef;
  readonly overlay: SemanticRef;
  readonly accent: SemanticRef;
  readonly subtle: SemanticRef;
}

export interface ColorSemanticBorder {
  readonly subtle: SemanticRef;
  readonly default: SemanticRef;
  readonly strong: SemanticRef;
  readonly accent: SemanticRef;
  readonly focus: SemanticRef;
}

export interface ColorSemanticAction {
  readonly primary: SemanticRef;
  readonly primaryHover: SemanticRef;
  readonly primaryActive: SemanticRef;
  readonly secondary: SemanticRef;
  readonly secondaryHover: SemanticRef;
}

export interface ColorSemanticFeedback {
  readonly success: SemanticRef;
  readonly warning: SemanticRef;
  readonly danger: SemanticRef;
  readonly info: SemanticRef;
}

export interface ColorSemanticTokens {
  readonly text: ColorSemanticText;
  readonly background: ColorSemanticBackground;
  readonly border: ColorSemanticBorder;
  readonly action: ColorSemanticAction;
  readonly feedback: ColorSemanticFeedback;
}

export interface SpacingSemanticTokens {
  readonly inset: {
    readonly xs: SemanticRef;
    readonly sm: SemanticRef;
    readonly md: SemanticRef;
    readonly lg: SemanticRef;
  };
  readonly stack: {
    readonly xs: SemanticRef;
    readonly sm: SemanticRef;
    readonly md: SemanticRef;
    readonly lg: SemanticRef;
  };
}

export interface RadiusSemanticTokens {
  readonly control: SemanticRef;
  readonly card: SemanticRef;
  readonly pill: SemanticRef;
}

export interface ShadowSemanticTokens {
  readonly control: SemanticRef;
  readonly card: SemanticRef;
  readonly overlay: SemanticRef;
}

export interface SizeSemanticTokens {
  readonly control: {
    readonly sm: SemanticRef;
    readonly md: SemanticRef;
    readonly lg: SemanticRef;
  };
}

export interface FontSemanticTokens {
  readonly family: {
    readonly body: SemanticRef;
    readonly heading: SemanticRef;
    readonly code: SemanticRef;
  };
  readonly size: {
    readonly body: SemanticRef;
    readonly caption: SemanticRef;
    readonly heading: SemanticRef;
  };
}

export interface MotionSemanticTokens {
  readonly duration: {
    readonly fast: SemanticRef;
    readonly base: SemanticRef;
    readonly slow: SemanticRef;
  };
  readonly easing: {
    readonly standard: SemanticRef;
    readonly emphasized: SemanticRef;
  };
}

export interface SemanticTokens {
  readonly color: ColorSemanticTokens;
  readonly spacing: SpacingSemanticTokens;
  readonly radius: RadiusSemanticTokens;
  readonly shadow: ShadowSemanticTokens;
  readonly size: SizeSemanticTokens;
  readonly font: FontSemanticTokens;
  readonly motion: MotionSemanticTokens;
}

/**
 * Light theme defaults — semantic refs are written as CSS variable names that
 * resolve into primitive values. The runtime resolver (AUI-TOKEN-004) walks
 * each ref to its primitive value and emits the final binding table.
 */
export const DEFAULT_SEMANTIC_TOKENS: SemanticTokens = {
  color: {
    text: {
      primary: 'var(--aui-color-text-primary)',
      secondary: 'var(--aui-color-text-secondary)',
      tertiary: 'var(--aui-color-text-tertiary)',
      disabled: 'var(--aui-color-text-disabled)',
      inverse: 'var(--aui-color-text-inverse)',
      onAccent: 'var(--aui-color-text-on-accent)',
    },
    background: {
      surface: 'var(--aui-color-bg-surface)',
      elevated: 'var(--aui-color-bg-elevated)',
      sunken: 'var(--aui-color-bg-sunken)',
      overlay: 'var(--aui-color-bg-overlay)',
      accent: 'var(--aui-color-bg-accent)',
      subtle: 'var(--aui-color-bg-subtle)',
    },
    border: {
      subtle: 'var(--aui-color-border-subtle)',
      default: 'var(--aui-color-border-default)',
      strong: 'var(--aui-color-border-strong)',
      accent: 'var(--aui-color-border-accent)',
      focus: 'var(--aui-color-border-focus)',
    },
    action: {
      primary: 'var(--aui-color-action-primary)',
      primaryHover: 'var(--aui-color-action-primary-hover)',
      primaryActive: 'var(--aui-color-action-primary-active)',
      secondary: 'var(--aui-color-action-secondary)',
      secondaryHover: 'var(--aui-color-action-secondary-hover)',
    },
    feedback: {
      success: 'var(--aui-color-feedback-success)',
      warning: 'var(--aui-color-feedback-warning)',
      danger: 'var(--aui-color-feedback-danger)',
      info: 'var(--aui-color-feedback-info)',
    },
  },
  spacing: {
    inset: {
      xs: 'var(--aui-spacing-inset-xs)',
      sm: 'var(--aui-spacing-inset-sm)',
      md: 'var(--aui-spacing-inset-md)',
      lg: 'var(--aui-spacing-inset-lg)',
    },
    stack: {
      xs: 'var(--aui-spacing-stack-xs)',
      sm: 'var(--aui-spacing-stack-sm)',
      md: 'var(--aui-spacing-stack-md)',
      lg: 'var(--aui-spacing-stack-lg)',
    },
  },
  radius: {
    control: 'var(--aui-radius-control)',
    card: 'var(--aui-radius-card)',
    pill: 'var(--aui-radius-pill)',
  },
  shadow: {
    control: 'var(--aui-shadow-control)',
    card: 'var(--aui-shadow-card)',
    overlay: 'var(--aui-shadow-overlay)',
  },
  size: {
    control: {
      sm: 'var(--aui-size-control-sm)',
      md: 'var(--aui-size-control-md)',
      lg: 'var(--aui-size-control-lg)',
    },
  },
  font: {
    family: {
      body: 'var(--aui-font-family-body)',
      heading: 'var(--aui-font-family-heading)',
      code: 'var(--aui-font-family-code)',
    },
    size: {
      body: 'var(--aui-font-size-body)',
      caption: 'var(--aui-font-size-caption)',
      heading: 'var(--aui-font-size-heading)',
    },
  },
  motion: {
    duration: {
      fast: 'var(--aui-motion-duration-fast)',
      base: 'var(--aui-motion-duration-base)',
      slow: 'var(--aui-motion-duration-slow)',
    },
    easing: {
      standard: 'var(--aui-motion-easing-standard)',
      emphasized: 'var(--aui-motion-easing-emphasized)',
    },
  },
};