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
  const darkAui = renderStyleBlock(darkBindings).replace(/:root/, '[data-theme="dark"]');
  const darkAlias = renderAliasBlock(darkBindings, '[data-theme="dark"]');

  return [lightAui, lightAlias, darkAui, darkAlias].join('\n');
}

function renderAliasBlock(bindings: readonly TokenBinding[], selector = ':root'): string {
  const lines = bindings.map((b) => `  ${snVarName(b.name)}: ${b.value};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}
