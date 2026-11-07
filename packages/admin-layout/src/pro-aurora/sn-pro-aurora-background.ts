/**
 * Full-bleed background presets of the `aurora` layout style
 * (@snui/admin-layout).
 *
 * Pure functions over plain data — the component only spreads the returned CSS
 * custom properties onto its root and the stylesheet does the painting, so the
 * whole preset matrix (solid / image / gradient 光晕 / mesh 弥散) is unit
 * testable without a browser.
 *
 * Colors are never hardcoded: the defaults are `--sn-web-*` tokens, so a
 * preset follows the host's theme (and dark mode) automatically. A host can
 * re-point any glow through `backgroundColors`.
 *
 * The gradient/mesh shapes are exposed as CSS custom properties rather than an
 * inline `background-image`, which keeps the *arrangement* (positions, blur,
 * opacity) in the scoped stylesheet and the *palette* in the props.
 */

import type { SnProLayoutAuroraBackground } from './sn-pro-aurora-types';

/** CSS variable carrying the `image` preset's URL. */
export const AURORA_BG_IMAGE_VAR = '--sn-pro-aurora-bg-image';
/** CSS variables carrying the `gradient` / `mesh` presets' glow colors. */
export const AURORA_GLOW_VARS = [
  '--sn-pro-aurora-glow-1',
  '--sn-pro-aurora-glow-2',
  '--sn-pro-aurora-glow-3',
  '--sn-pro-aurora-glow-4',
] as const;

/** Glows painted by each preset. */
export const AURORA_GLOW_COUNT: Record<'gradient' | 'mesh', number> = {
  gradient: 2,
  mesh: 4,
};

const DEFAULT_GLOW_A = 'var(--sn-web-color-action-primary)';
const DEFAULT_GLOW_B = 'var(--sn-web-color-feedback-info)';

/** Default palette — an accent pair cycled over however many glows a preset paints. */
export function auroraDefaultGlow(index: number): string {
  return index % 2 === 0 ? DEFAULT_GLOW_A : DEFAULT_GLOW_B;
}

/**
 * Turn a URL into a CSS `url("…")` token.
 *
 * Returns `undefined` for a blank URL so callers can leave the preset's
 * variable unset (the stylesheet then falls back to the solid surface instead
 * of painting a broken `url()`).
 */
export function cssUrl(url: string): string | undefined {
  const trimmed = url.trim();
  if (trimmed === '') return undefined;
  let safe = '';
  for (const char of trimmed) {
    // A raw quote / paren / backslash would terminate the `url("…")` token
    // early, and whitespace would split the declaration. All of them are
    // percent-encoded in any valid URL anyway.
    //
    // `encodeURIComponent` is NOT used here on purpose: it leaves `'`, `(` and
    // `)` untouched (they are legal in a URI path), and those are exactly the
    // characters that break the token.
    safe += UNSAFE_URL_CHAR.test(char) || WHITESPACE_CHAR.test(char) ? percentEncode(char) : char;
  }
  return `url("${safe}")`;
}

/** Characters that break a quoted `url()` token. */
const UNSAFE_URL_CHAR = /["'()\\]/;
/** Whitespace never belongs unescaped in a quoted url token either. */
const WHITESPACE_CHAR = /\s/;

/** Single-character percent encoding, including the chars `encodeURIComponent` spares. */
function percentEncode(char: string): string {
  return `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`;
}

/**
 * Resolve the glow palette: host colors win, blanks are dropped, and the
 * default pair fills whatever is missing (so `mesh` always gets 4 entries
 * even when the host passes one color).
 */
export function auroraGlowColors(
  colors: readonly string[] | undefined,
  count: number,
): string[] {
  const provided = (colors ?? []).map((color) => color.trim()).filter((color) => color !== '');
  const resolved: string[] = [];
  for (let index = 0; index < count; index += 1) {
    resolved.push(provided[index] ?? auroraDefaultGlow(index));
  }
  return resolved;
}

/**
 * CSS custom properties for one background preset.
 *
 * Returns an empty object for `solid` (and for `image` without a URL) — the
 * stylesheet's base surface is then the whole background.
 */
export function auroraBackgroundVars(input: {
  type: SnProLayoutAuroraBackground;
  image?: string | undefined;
  colors?: readonly string[] | undefined;
}): Record<string, string> {
  switch (input.type) {
    case 'image': {
      const url = cssUrl(input.image ?? '');
      return url === undefined ? {} : { [AURORA_BG_IMAGE_VAR]: url };
    }
    case 'gradient':
    case 'mesh': {
      const glows = auroraGlowColors(input.colors, AURORA_GLOW_COUNT[input.type]);
      const vars: Record<string, string> = {};
      glows.forEach((color, index) => {
        const name = AURORA_GLOW_VARS[index];
        if (name !== undefined) vars[name] = color;
      });
      return vars;
    }
    case 'solid':
    default:
      return {};
  }
}
