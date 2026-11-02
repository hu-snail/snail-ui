/**
 * Primary-color presets and the CSS-variable math behind primary switching.
 *
 * The token cascade (`@snui/tokens`) derives all action colors from three
 * variables: `--aui-color-action-primary`, `-hover`, `-soft`. Overriding
 * those three on the root element recolors every component at once. Hover
 * and soft tints differ per theme mode (the token file ships different
 * dark values), so resolution is mode-aware.
 */

export interface PrimaryColorPreset {
  /** Stable id persisted in localStorage. */
  id: string;
  /** Base hex — also used as the swatch background in the picker UI. */
  primary: string;
  lightHover: string;
  darkHover: string;
}

export const PRIMARY_PRESETS: readonly PrimaryColorPreset[] = [
  // 'blue' mirrors the token default (--aui-color-blue-500 family).
  { id: 'blue', primary: '#1677ff', lightHover: '#60a5fa', darkHover: '#3b82f6' },
  { id: 'violet', primary: '#7c3aed', lightHover: '#a78bfa', darkHover: '#8b5cf6' },
  { id: 'emerald', primary: '#059669', lightHover: '#34d399', darkHover: '#10b981' },
  { id: 'amber', primary: '#d97706', lightHover: '#fbbf24', darkHover: '#f59e0b' },
  { id: 'rose', primary: '#e11d48', lightHover: '#fb7185', darkHover: '#f43f5e' },
  { id: 'cyan', primary: '#0891b2', lightHover: '#22d3ee', darkHover: '#06b6d4' },
];

export const DEFAULT_PRESET_ID = 'blue';

export function findPreset(id: string): PrimaryColorPreset {
  return PRIMARY_PRESETS.find((preset) => preset.id === id) ?? PRIMARY_PRESETS[0]!;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (match === null) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(match[1]!, 16),
    g: parseInt(match[2]!, 16),
    b: parseInt(match[3]!, 16),
  };
}

export type ThemeMode = 'light' | 'dark';

export interface PrimaryVars {
  primary: string;
  hover: string;
  soft: string;
}

/**
 * Resolve the three override values for a preset under a theme mode.
 * Soft tint alpha matches the token file's dark/light conventions
 * (light: pale solid ≈ 12% tint, dark: 22% — see tokens styles/.dark block).
 */
export function resolvePrimaryVars(preset: PrimaryColorPreset, mode: ThemeMode): PrimaryVars {
  const { r, g, b } = hexToRgb(preset.primary);
  const alpha = mode === 'dark' ? 0.22 : 0.12;
  return {
    primary: preset.primary,
    hover: mode === 'dark' ? preset.darkHover : preset.lightHover,
    soft: `rgba(${r}, ${g}, ${b}, ${alpha})`,
  };
}
