/**
 * AUI Theme / Style / Density axes (AUI-TOKEN-004 input).
 *
 * Per AGENTS.md §36 + AUI-PRD-v1.2.md §36-38, Theme / Style / Density are
 * THREE INDEPENDENT dimensions, not stackable layers:
 *
 *   - Theme (Light/Dark/...) — owns color (text/background/border/action/feedback)
 *   - Style (Modern/Glass/Minimal/...) — owns radius / shadow / component shape
 *   - Density (Compact/Comfortable/...) — owns size / spacing / fontSize
 *
 * Each axis is described by a partial override of the layer below it:
 *   - Theme overrides primitive color
 *   - Style overrides primitive radius + shadow + component tokens
 *   - Density overrides primitive spacing + size + fontSize
 *
 * The three axes do NOT implicitly affect each other (PRD §36 "三个维度不得隐式
 * 修改其他维度").
 */

import type { PrimitiveTokens } from './primitive.js';
import type { SemanticTokens } from './semantic.js';
import type { ComponentTokens } from './component.js';

/** A Theme provides a partial primitive + semantic override for color tokens. */
export interface ThemeDefinition {
  /** Stable theme identifier — used as a CSS data-attribute hook. */
  readonly name: string;
  /** Optional primitive color override (full or partial). */
  readonly primitive?: Partial<PrimitiveTokens['color']>;
  /** Optional semantic color override — each color sub-shape may be partially overridden. */
  readonly semantic?: Partial<{
    readonly text: Partial<SemanticTokens['color']['text']>;
    readonly background: Partial<SemanticTokens['color']['background']>;
    readonly border: Partial<SemanticTokens['color']['border']>;
    readonly action: Partial<SemanticTokens['color']['action']>;
    readonly feedback: Partial<SemanticTokens['color']['feedback']>;
  }>;
}

/** A Style provides a partial override of primitive radius/shadow + component tokens. */
export interface StyleDefinition {
  readonly name: string;
  readonly primitive?: {
    readonly radius?: Partial<PrimitiveTokens['radius']>;
    readonly shadow?: Partial<PrimitiveTokens['shadow']>;
  };
  /** Component tokens are deeply partial — each component sub-shape may be partially overridden. */
  readonly component?: Partial<{
    readonly button: Partial<ComponentTokens['button']>;
    readonly input: Partial<ComponentTokens['input']>;
    readonly card: Partial<ComponentTokens['card']>;
  }>;
}

/** A Density provides a partial override of size / spacing / font primitives. */
export interface DensityDefinition {
  readonly name: string;
  readonly primitive?: {
    readonly spacing?: Partial<PrimitiveTokens['spacing']>;
    readonly size?: Partial<PrimitiveTokens['size']>;
    readonly font?: {
      readonly size?: Partial<PrimitiveTokens['font']['size']>;
      readonly lineHeight?: Partial<PrimitiveTokens['font']['lineHeight']>;
    };
  };
}

/** A Variant is an instance-level pre-set (e.g. primary/secondary button). */
export interface VariantDefinition {
  readonly name: string;
  /** Component-name → partial token override. */
  readonly component?: Partial<{
    readonly button: Partial<ComponentTokens['button']>;
    readonly input: Partial<ComponentTokens['input']>;
    readonly card: Partial<ComponentTokens['card']>;
  }>;
}

/** Combined environment passed to the resolver. */
export interface TokenEnvironment {
  readonly theme: ThemeDefinition;
  readonly style: StyleDefinition;
  readonly density: DensityDefinition;
  /** Optional variant layer (e.g. active button variant). */
  readonly variant?: VariantDefinition;
  /** Top-level instance overrides win over everything else. */
  readonly instanceOverrides?: Readonly<Record<string, string>>;
}

export const LIGHT_THEME: ThemeDefinition = {
  name: 'light',
  // No semantic overrides on purpose: the defaults in `semantic.ts` already
  // carry the light values. Re-stating them as `var()` self-references here
  // (the previous shape) emitted a `--aui-color-text-primary: var(--aui-color-
  // text-primary)` cycle into the runtime snippet.
  semantic: {},
};

export const DARK_THEME: ThemeDefinition = {
  name: 'dark',
  primitive: {
    // Inverted zinc ramp: in dark mode the low slots hold the *darkest*
    // colours (50 = darkest … 950 = lightest), mirroring the zinc values the
    // static `[data-theme="dark"], .dark` block emits in styles/index.css.
    gray: {
      50: '#09090b',
      100: '#18181b',
      200: '#27272a',
      300: '#3f3f46',
      400: '#52525b',
      500: '#71717a',
      600: '#a1a1aa',
      700: '#d4d4d8',
      800: '#e4e4e7',
      900: '#fafafa',
      950: '#ffffff',
    },
  },
  semantic: {
    // Literal colours, mirroring the static `[data-theme="dark"], .dark` block
    // in styles/index.css. `onPrimary` stays light on purpose: the accent keeps
    // its blue in both themes, so a dark-ramp slot would paint near-black text
    // on the blue button.
    text: {
      primary: '#fafafa',
      secondary: '#a1a1aa',
      tertiary: '#71717a',
      disabled: '#52525b',
      inverse: '#09090b',
      onPrimary: '#ffffff',
    },
    background: {
      surface: '#09090b',
      elevated: '#18181b',
      subtle: '#27272a',
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    border: {
      default: '#27272a',
      subtle: '#27272a',
    },
    feedback: {
      danger: '#7f1d1d',
      dangerHover: '#991b1b',
    },
  },
};

export const MODERN_STYLE: StyleDefinition = {
  name: 'modern',
};

export const COMPACT_DENSITY: DensityDefinition = {
  name: 'compact',
  primitive: {
    spacing: {
      '3': '6px',
      '4': '10px',
      '5': '14px',
    },
    size: {
      control: {
        sm: '20px',
        md: '28px',
        lg: '36px',
      },
    },
  },
};

export const COMFORTABLE_DENSITY: DensityDefinition = {
  name: 'comfortable',
};