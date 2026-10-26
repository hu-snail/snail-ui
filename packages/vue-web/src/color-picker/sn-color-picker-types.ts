/**
 * SnColorPicker shared types + pure color helpers — internal to
 * `src/color-picker/`.
 *
 * The public value contract is a CSS color string: `#rrggbb` (internal
 * canonical form, lowercase), or `#rrggbbaa` / `rgba(...)` / `hsla(...)`
 * when `showAlpha` is on and alpha < 1. `parseColor` accepts `#rgb`,
 * `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()`.
 *
 * Helpers are pure and exported so tests can exercise the arithmetic
 * directly (AGENTS.md §43/§46). Kept in a plain `.ts` module (same
 * convention as sn-time-picker-types.ts / sn-select-types.ts) so no
 * shared wiring (install.ts / index.ts / resolver.ts) is touched.
 */

/** Visual size preset (AUI convention adds `mini` below the reference `tiny`). */
export type SnColorPickerSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large';

/** Color edit modes offered as panel tabs (naive-ui `modes`). */
export type SnColorPickerMode = 'rgb' | 'hsl' | 'hex';

/** RGBA color — channels in 0–255, alpha in 0–1. */
export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** HSL color — hue 0–360, saturation / lightness 0–100, alpha 0–1. */
export interface Hsla {
  h: number;
  s: number;
  l: number;
  a: number;
}

/** HSV(A) — the panel's working space. hue 0–360, s/v 0–100, alpha 0–1. */
export interface Hsva {
  h: number;
  s: number;
  v: number;
  a: number;
}

/** Clamp `value` into [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Two-digit lowercase hex for one 0–255 channel. */
function channelHex(channel: number): string {
  return Math.round(clamp(channel, 0, 255))
    .toString(16)
    .padStart(2, '0');
}

/** `#rrggbb` — lowercase, no alpha. */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${channelHex(r)}${channelHex(g)}${channelHex(b)}`;
}

/** `#rrggbbaa` when alpha < 1, else `#rrggbb` (lowercase). */
export function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const base = rgbToHex(r, g, b);
  return a < 1 ? `${base}${channelHex(clamp(a, 0, 1) * 255)}` : base;
}

/** `rgb(r, g, b)` — channels clamped to 0–255, naive-ui spacing. */
export function formatRgb(r: number, g: number, b: number): string {
  return `rgb(${Math.round(clamp(r, 0, 255))}, ${Math.round(clamp(g, 0, 255))}, ${Math.round(clamp(b, 0, 255))})`;
}

/** `rgba(r, g, b, a)` — channels clamped, alpha trimmed to 2 decimals. */
export function formatRgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${Math.round(clamp(r, 0, 255))}, ${Math.round(clamp(g, 0, 255))}, ${Math.round(clamp(b, 0, 255))}, ${round2(a)})`;
}

/** `hsl(h, s%, l%)`. */
export function formatHsl(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

/** `hsla(h, s%, l%, a)`. */
export function formatHsla(h: number, s: number, l: number, a: number): string {
  return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${round2(a)})`;
}

/** Round to 2 decimals (alpha display 0.5 instead of 0.49999…). */
function round2(value: number): string {
  return String(Math.round(clamp(value, 0, 1) * 100) / 100);
}

/**
 * Parse a CSS color string into RGBA. Supported: `#rgb`, `#rgba`,
 * `#rrggbb`, `#rrggbbaa`, `rgb()`, `rgba()`, `hsl()`, `hsla()` —
 * case-insensitive, commas optional in the functional forms.
 * Returns null for anything unparseable (never throws).
 */
export function parseColor(input: string): Rgba | null {
  const text = input.trim().toLowerCase();
  if (text === '') return null;
  if (text.startsWith('#')) return parseHex(text);
  const fn = /^(\w+)\(([^)]*)\)$/.exec(text);
  if (!fn || fn[1] === undefined || fn[2] === undefined) return null;
  const parts = fn[2].split(/[,/\s]+/).filter((p) => p !== '');
  const alphaToken = parts.length > 3 ? parts[3] : undefined;
  if (fn[1] === 'rgb' || fn[1] === 'rgba') {
    if (parts.length < 3) return null;
    const r = clamp(Number.parseFloat(parts[0] ?? ''), 0, 255);
    const g = clamp(Number.parseFloat(parts[1] ?? ''), 0, 255);
    const b = clamp(Number.parseFloat(parts[2] ?? ''), 0, 255);
    const a = alphaToken === undefined ? 1 : clampAlpha(alphaToken);
    if ([r, g, b].some(Number.isNaN) || Number.isNaN(a)) return null;
    return { r, g, b, a };
  }
  if (fn[1] === 'hsl' || fn[1] === 'hsla') {
    if (parts.length < 3) return null;
    const h = Number.parseFloat(parts[0] ?? '');
    const s = Number.parseFloat(parts[1] ?? '');
    const l = Number.parseFloat(parts[2] ?? '');
    const a = alphaToken === undefined ? 1 : clampAlpha(alphaToken);
    if ([h, s, l].some(Number.isNaN) || Number.isNaN(a)) return null;
    const rgb = hslToRgb(wrapHue(h), s, l);
    return { ...rgb, a };
  }
  return null;
}

/** `#rgb` / `#rgba` / `#rrggbb` / `#rrggbbaa` → RGBA. */
function parseHex(text: string): Rgba | null {
  const digits = text.slice(1).replace(/[^0-9a-f]/g, '');
  if (digits.length !== 3 && digits.length !== 4 && digits.length !== 6 && digits.length !== 8) {
    return null;
  }
  const list = [...digits];
  let r: number;
  let g: number;
  let b: number;
  let a: number;
  if (list.length <= 4) {
    r = parseInt((list[0] ?? '') + (list[0] ?? ''), 16);
    g = parseInt((list[1] ?? '') + (list[1] ?? ''), 16);
    b = parseInt((list[2] ?? '') + (list[2] ?? ''), 16);
    a = list.length === 4 ? parseInt((list[3] ?? '') + (list[3] ?? ''), 16) / 255 : 1;
  } else {
    r = parseInt(digits.slice(0, 2), 16);
    g = parseInt(digits.slice(2, 4), 16);
    b = parseInt(digits.slice(4, 6), 16);
    a = list.length === 8 ? parseInt(digits.slice(6, 8), 16) / 255 : 1;
  }
  if ([r, g, b, a].some(Number.isNaN)) return null;
  return { r, g, b, a };
}

/** Clamp a functional-form alpha token ('0.5' / '50%'). */
function clampAlpha(token: string): number {
  const raw = Number.parseFloat(token);
  if (Number.isNaN(raw)) return Number.NaN;
  return token.endsWith('%') ? clamp(raw / 100, 0, 1) : clamp(raw, 0, 1);
}

/** Wrap hue into [0, 360). */
function wrapHue(h: number): number {
  const wrapped = h % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

/** RGB (0–255) → HSL (h 0–360, s/l 0–100). */
export function rgbToHsl(r: number, g: number, b: number): Hsla {
  const rr = clamp(r, 0, 255) / 255;
  const gg = clamp(g, 0, 255) / 255;
  const bb = clamp(b, 0, 255) / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : (d / (1 - Math.abs(2 * l - 1))) * 100;
  return { h, s, l: l * 100, a: 1 };
}

/** HSL (h 0–360, s/l 0–100) → RGB (0–255). */
export function hslToRgb(h: number, s: number, l: number): Rgba {
  const hh = wrapHue(h) / 360;
  const ss = clamp(s, 0, 100) / 100;
  const ll = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * ll - 1)) * ss;
  const x = c * (1 - Math.abs(((hh * 6) % 2) - 1));
  const m = ll - c / 2;
  let rgb: [number, number, number];
  const sector = Math.floor(hh * 6) % 6;
  if (sector === 0) rgb = [c, x, 0];
  else if (sector === 1) rgb = [x, c, 0];
  else if (sector === 2) rgb = [0, c, x];
  else if (sector === 3) rgb = [0, x, c];
  else if (sector === 4) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return { r: (rgb[0] + m) * 255, g: (rgb[1] + m) * 255, b: (rgb[2] + m) * 255, a: 1 };
}

/** RGB (0–255) → HSV (h 0–360, s/v 0–100). */
export function rgbToHsv(r: number, g: number, b: number): Hsva {
  const rr = clamp(r, 0, 255) / 255;
  const gg = clamp(g, 0, 255) / 255;
  const bb = clamp(b, 0, 255) / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6;
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : (d / max) * 100;
  return { h, s, v: max * 100, a: 1 };
}

/** HSV (h 0–360, s/v 0–100) → RGB (0–255). */
export function hsvToRgb(h: number, s: number, v: number): Rgba {
  const hh = wrapHue(h) / 60;
  const ss = clamp(s, 0, 100) / 100;
  const vv = clamp(v, 0, 100) / 100;
  const c = vv * ss;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = vv - c;
  let rgb: [number, number, number];
  const sector = Math.floor(hh) % 6;
  if (sector === 0) rgb = [c, x, 0];
  else if (sector === 1) rgb = [x, c, 0];
  else if (sector === 2) rgb = [0, c, x];
  else if (sector === 3) rgb = [0, x, c];
  else if (sector === 4) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return { r: (rgb[0] + m) * 255, g: (rgb[1] + m) * 255, b: (rgb[2] + m) * 255, a: 1 };
}

/** Pure-hue CSS background for the SV area's underlay (`hsv(h, 100%, 100%)`). */
export function hueBackground(h: number): string {
  return `hsl(${Math.round(wrapHue(h))}, 100%, 50%)`;
}
