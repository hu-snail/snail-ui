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
  /** Optional semantic color override. */
  readonly semantic?: Partial<SemanticTokens['color']>;
}

/** A Style provides a partial override of primitive radius/shadow + component tokens. */
export interface StyleDefinition {
  readonly name: string;
  readonly primitive?: {
    readonly radius?: Partial<PrimitiveTokens['radius']>;
    readonly shadow?: Partial<PrimitiveTokens['shadow']>;
  };
  readonly component?: Partial<ComponentTokens>;
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
  readonly component?: Partial<ComponentTokens>;
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
  semantic: {
    text: {
      primary: 'var(--aui-color-text-primary)',
      secondary: 'var(--aui-color-text-secondary)',
      tertiary: 'var(--aui-color-text-tertiary)',
      disabled: 'var(--aui-color-text-disabled)',
      inverse: 'var(--aui-color-text-inverse)',
      onAccent: 'var(--aui-color-text-on-accent)',
    },
  },
};

export const DARK_THEME: ThemeDefinition = {
  name: 'dark',
  primitive: {
    gray: {
      50: '#0a0a0a',
      100: '#171717',
      200: '#262626',
      300: '#404040',
      400: '#525252',
      500: '#737373',
      600: '#a3a3a3',
      700: '#d4d4d4',
      800: '#e5e5e5',
      900: '#f5f5f5',
      950: '#fafafa',
    },
  },
  semantic: {
    text: {
      primary: 'var(--aui-color-gray-100)',
      secondary: 'var(--aui-color-gray-300)',
      tertiary: 'var(--aui-color-gray-500)',
      disabled: 'var(--aui-color-gray-700)',
      inverse: 'var(--aui-color-gray-900)',
      onAccent: 'var(--aui-color-gray-50)',
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