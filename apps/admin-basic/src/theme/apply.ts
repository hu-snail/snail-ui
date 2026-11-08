/**
 * DOM side-effects for theming: theme mode toggles the `.dark` class the
 * token cascade keys on; primary color overrides the three action vars
 * inline on the root element (inline style wins over both `:root` and
 * `.dark` blocks, so one write recolors every mode).
 */
import { resolvePrimaryVars, type PrimaryColorPreset, type ThemeMode } from './presets';

export function applyThemeMode(root: HTMLElement, mode: ThemeMode): void {
  root.classList.toggle('dark', mode === 'dark');
}

export function applyPrimaryColor(
  root: HTMLElement,
  preset: PrimaryColorPreset,
  mode: ThemeMode,
): void {
  const vars = resolvePrimaryVars(preset, mode);
  root.style.setProperty('--aui-color-action-primary', vars.primary);
  root.style.setProperty('--aui-color-action-primary-hover', vars.hover);
  root.style.setProperty('--aui-color-action-primary-soft', vars.soft);
}
