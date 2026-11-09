/**
 * AUI Tokens — Brand layer (`--sn-*` aliases over `--aui-*`).
 *
 * v2.0 refactor: tokens keep their internal `--aui-*` names for backwards
 * compatibility with v1.x and the resolved cascade, but every component
 * authored against @snui/vue-web or @snui/uni consumes tokens via the
 * `--sn-*` namespace. This file emits the alias layer.
 *
 *   --sn-color-action-primary → var(--aui-color-action-primary)
 *
 * Why two namespaces?
 *   1. Tokens stay framework-agnostic (`--aui-` is the design-system language)
 *   2. Components are Sn-branded (`--sn-` is the component-library contract)
 *   3. Themes / forks can override the alias layer without touching primitives
 */

import {
  LIGHT_THEME,
  DARK_THEME,
  MODERN_STYLE,
  COMFORTABLE_DENSITY,
  type DensityDefinition,
  type StyleDefinition,
  type ThemeDefinition,
  type TokenEnvironment,
} from './theme.js';
import { renderStyleBlock, resolveEnvironment, type TokenBinding } from './resolver.js';
import { BUILTIN_THEMES } from './themes.js';

const SN_PREFIX = '--sn-';
const AUI_PREFIX = '--aui-';

export interface SnCssVarsOptions {
  readonly theme?: ThemeDefinition;
  readonly style?: StyleDefinition;
  readonly density?: DensityDefinition;
  /** Extra instance-level overrides: `'--sn-color-foo' → '#fff'`. */
  readonly instanceOverrides?: Readonly<Record<string, string>>;
  /** Whether to include the dark-theme override under `[data-theme="dark"]`. Default: true. */
  readonly withDark?: boolean;
  /**
   * Whether to emit one `[data-theme="<name>"]` block per built-in colour
   * theme (`BUILTIN_THEMES`). Default: true.
   *
   * Emitting them all costs a few KB and lets a host switch themes with a
   * single attribute (`documentElement.dataset.theme = 'forest'`) instead of
   * re-rendering the stylesheet from JS.
   */
  readonly withThemeBlocks?: boolean;
}

/** Convert `--aui-foo-bar` to `--sn-foo-bar`. Identity for non-prefixed names. */
export function snVarName(auiName: string): string {
  if (auiName.startsWith(AUI_PREFIX)) {
    return SN_PREFIX + auiName.slice(AUI_PREFIX.length);
  }
  return auiName;
}

/** Inverse: `--sn-foo-bar` → `--aui-foo-bar`. */
export function auiVarName(snName: string): string {
  if (snName.startsWith(SN_PREFIX)) {
    return AUI_PREFIX + snName.slice(SN_PREFIX.length);
  }
  return snName;
}

/**
 * Produce a complete `<style>` string with:
 *   - `--aui-*` bindings for the requested theme / style / density (light)
 *   - `--sn-*` aliases pointing at the above
 *   - `[data-theme="dark"]` block overriding primitive color + `--sn-*` aliases
 *
 * Usage:
 *   const css = snCssVars({ theme: CUSTOM_THEME })
 *   document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`)
 */
export function snCssVars(options: SnCssVarsOptions = {}): string {
  const lightEnv: TokenEnvironment = {
    theme: options.theme ?? LIGHT_THEME,
    style: options.style ?? MODERN_STYLE,
    density: options.density ?? COMFORTABLE_DENSITY,
    ...(options.instanceOverrides ? { instanceOverrides: options.instanceOverrides } : {}),
  };

  const lightBindings = resolveEnvironment(lightEnv);
  const lightAui = renderStyleBlock(lightBindings);
  const lightAlias = renderAliasBlock(lightBindings);

  if (options.withDark === false) {
    return `${lightAui}\n${lightAlias}`;
  }

  const darkEnv: TokenEnvironment = {
    theme: options.theme?.name === 'dark' ? options.theme : DARK_THEME,
    style: options.style ?? MODERN_STYLE,
    density: options.density ?? COMFORTABLE_DENSITY,
  };
  const darkBindings = resolveEnvironment(darkEnv);
  // Dark block: match BOTH selectors the ecosystem uses — `[data-theme="dark"]`
  // (library / template default) and `.dark` (VitePress and other class-based
  // hosts). Emitting both keeps an injected runtime theme readable on a
  // `.dark` site, which previously fell back to the light values.
  const darkSelector = '[data-theme="dark"], .dark';
  const darkAui = renderStyleBlock(darkBindings).replace(/:root/, darkSelector);
  const darkAlias = renderAliasBlock(darkBindings, darkSelector);

  const blocks = [lightAui, lightAlias];
  if (options.withThemeBlocks !== false) blocks.push(...renderBuiltinThemeBlocks(options));
  // Dark last: with both `data-theme="forest"` and `.dark` present they would
  // tie on specificity, so the later block decides — and dark must win.
  blocks.push(darkAui, darkAlias);

  return blocks.join('\n');
}

/**
 * One `[data-theme="<name>"]` block per built-in colour theme.
 *
 * Only the theme axis changes per block; style and density are held at the
 * caller's values so switching theme never reshapes a component.
 */
function renderBuiltinThemeBlocks(options: SnCssVarsOptions): string[] {
  const style = options.style ?? MODERN_STYLE;
  const density = options.density ?? COMFORTABLE_DENSITY;
  const blocks: string[] = [];

  for (const theme of BUILTIN_THEMES) {
    // The requested theme is already the light block; re-emitting it under an
    // attribute selector would just duplicate the same declarations.
    if (options.theme?.name === theme.name) continue;
    const bindings = resolveEnvironment({ theme, style, density });
    const selector = `[data-theme="${theme.name}"]`;
    blocks.push(
      renderStyleBlock(bindings).replace(/:root/, selector),
      renderAliasBlock(bindings, selector),
    );
  }

  return blocks;
}

function renderAliasBlock(bindings: readonly TokenBinding[], selector = ':root'): string {
  const lines = bindings.map((b) => `  ${snVarName(b.name)}: ${b.value};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}
