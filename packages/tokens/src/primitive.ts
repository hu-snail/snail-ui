/**
 * AUI Primitive Tokens (AUI-TOKEN-001) — framework-agnostic raw design values.
 *
 * Per AGENTS.md §33-35:
 *   Primitive → Semantic → Component → Style Override → Schema/Instance Override.
 *
 * Primitives have NO semantic meaning — they are raw values keyed by category.
 * Consumers should resolve through the Semantic layer; primitives are exposed
 * primarily so themes (Light/Dark) can swap raw palettes.
 */

export interface ColorScale {
  readonly 50: string;
  readonly 100: string;
  readonly 200: string;
  readonly 300: string;
  readonly 400: string;
  readonly 500: string;
  readonly 600: string;
  readonly 700: string;
  readonly 800: string;
  readonly 900: string;
  readonly 950: string;
}

export interface ColorPalette {
  readonly gray: ColorScale;
  readonly blue: ColorScale;
  readonly green: ColorScale;
  readonly red: ColorScale;
  readonly amber: ColorScale;
  readonly purple: ColorScale;
  readonly transparent: string;
  readonly current: string;
  readonly inherit: string;
}

export interface SpacingScale {
  readonly '0': string;
  readonly '1': string;
  readonly '2': string;
  readonly '3': string;
  readonly '4': string;
  readonly '5': string;
  readonly '6': string;
  readonly '8': string;
  readonly '10': string;
  readonly '12': string;
  readonly '16': string;
  readonly '20': string;
  readonly '24': string;
}

export interface RadiusScale {
  readonly none: string;
  readonly xs: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly full: string;
}

export interface FontFamilyTokens {
  readonly sans: string;
  readonly serif: string;
  readonly mono: string;
}

export interface FontSizeTokens {
  readonly xs: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
  readonly '2xl': string;
  readonly '3xl': string;
}

export interface FontWeightTokens {
  readonly normal: string;
  readonly medium: string;
  readonly semibold: string;
  readonly bold: string;
}

export interface FontTokens {
  readonly family: FontFamilyTokens;
  readonly size: FontSizeTokens;
  readonly weight: FontWeightTokens;
  readonly lineHeight: {
    readonly tight: string;
    readonly normal: string;
    readonly loose: string;
  };
}

export interface ShadowScale {
  readonly none: string;
  readonly xs: string;
  readonly sm: string;
  readonly md: string;
  readonly lg: string;
  readonly xl: string;
}

export interface MotionDurationTokens {
  readonly instant: string;
  readonly fast: string;
  readonly base: string;
  readonly slow: string;
  readonly slower: string;
}

export interface MotionEasingTokens {
  readonly linear: string;
  readonly standard: string;
  readonly emphasized: string;
}

export interface MotionTokens {
  readonly duration: MotionDurationTokens;
  readonly easing: MotionEasingTokens;
}

export interface SizeTokens {
  readonly control: {
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
  };
  readonly icon: {
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
  };
}

export interface PrimitiveTokens {
  readonly color: ColorPalette;
  readonly spacing: SpacingScale;
  readonly radius: RadiusScale;
  readonly font: FontTokens;
  readonly shadow: ShadowScale;
  readonly motion: MotionTokens;
  readonly size: SizeTokens;
}

/**
 * Default primitive scale. Values follow an 8pt rhythm for spacing/radius
 * and a 50–950 hue ramp for color (Tailwind-style ramp). Theme swaps override
 * the `color` block; Style overrides the radius/shadow block; Density overrides
 * the spacing/size block.
 */
export const DEFAULT_PRIMITIVE_TOKENS: PrimitiveTokens = {
  color: {
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#1677ff',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    amber: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
    transparent: 'transparent',
    current: 'currentColor',
    inherit: 'inherit',
  },
  spacing: {
    '0': '0',
    '1': '2px',
    '2': '4px',
    '3': '8px',
    '4': '12px',
    '5': '16px',
    '6': '20px',
    '8': '24px',
    '10': '32px',
    '12': '40px',
    '16': '56px',
    '20': '72px',
    '24': '96px',
  },
  radius: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  font: {
    family: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif: 'Georgia, "Times New Roman", serif',
      mono: '"SF Mono", Monaco, Menlo, Consolas, monospace',
    },
    size: {
      xs: '11px',
      sm: '12px',
      md: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
    },
    weight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      loose: '1.8',
    },
  },
  shadow: {
    none: 'none',
    xs: '0 1px 2px rgba(0,0,0,0.04)',
    sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)',
    lg: '0 8px 16px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
    xl: '0 16px 32px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)',
  },
  motion: {
    duration: {
      instant: '0ms',
      fast: '120ms',
      base: '200ms',
      slow: '320ms',
      slower: '480ms',
    },
    easing: {
      linear: 'linear',
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    },
  },
  size: {
    control: {
      sm: '24px',
      md: '32px',
      lg: '40px',
    },
    icon: {
      sm: '12px',
      md: '16px',
      lg: '20px',
    },
  },
};