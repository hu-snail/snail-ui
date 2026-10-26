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
  /** Text/icon colour placed on the accent (primary) surface. */
  readonly onPrimary: SemanticRef;
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
  /**
   * Hover variant of `danger` — consumed by destructive states (e.g. button
   * danger hover via the `--sn-web-color-feedback-danger-hover` alias).
   *
   * Unlike its siblings, this ref points at a primitive ramp slot
   * (`red-400`) rather than the semantic name itself, so resolver output
   * resolves without a theme override. Do not "fix" it into the circular
   * identity form the sibling entries use.
   */
  readonly dangerHover: SemanticRef;
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
    // Semantic → primitive references, as the layer model prescribes (§33). The
    // refs must name variables the runtime pass actually emits, otherwise the
    // snippet is invalid CSS: pointing at the semantic's own name produced a
    // `var()` cycle, and the old `--aui-color-bg-surface` spelling pointed at a
    // name only the static stylesheet defines.
    // `#ffffff` / the overlay rgba stay literal — no primitive expresses pure
    // white or a translucent scrim.
    text: {
      primary: 'var(--aui-color-gray-950)',
      secondary: 'var(--aui-color-gray-500)',
      tertiary: 'var(--aui-color-gray-400)',
      disabled: 'var(--aui-color-gray-300)',
      inverse: 'var(--aui-color-gray-50)',
      onPrimary: '#ffffff',
    },
    background: {
      surface: '#ffffff',
      elevated: '#ffffff',
      sunken: 'var(--aui-color-gray-100)',
      overlay: 'rgba(0, 0, 0, 0.8)',
      accent: 'var(--aui-color-blue-50)',
      subtle: 'var(--aui-color-gray-100)',
    },
    border: {
      subtle: 'var(--aui-color-gray-100)',
      default: 'var(--aui-color-gray-200)',
      strong: 'var(--aui-color-gray-300)',
      accent: 'var(--aui-color-blue-500)',
      focus: 'var(--aui-color-blue-500)',
    },
    action: {
      primary: 'var(--aui-color-blue-500)',
      primaryHover: 'var(--aui-color-blue-400)',
      primaryActive: 'var(--aui-color-blue-600)',
      secondary: 'var(--aui-color-gray-100)',
      secondaryHover: 'var(--aui-color-gray-200)',
    },
    feedback: {
      // The success colour is the stylesheet's emerald; the primitive green ramp
      // slots elsewhere (#22c55e), so this one keeps its literal.
      success: '#10b981',
      warning: 'var(--aui-color-amber-500)',
      danger: 'var(--aui-color-red-500)',
      dangerHover: 'var(--aui-color-red-400)',
      info: 'var(--aui-color-gray-500)',
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
