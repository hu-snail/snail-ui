/**
 * AUI Tokens — built-in colour themes (AUI-TOKEN-004 / ADR-0010).
 *
 * Theme / Style / Density are three independent axes (see `theme.ts`). This
 * module ships the **colour axis**: `LIGHT_THEME` and `DARK_THEME` stay in
 * `theme.ts` as the structural baselines, and the five presets below swap only
 * the brand hue, so a host can re-skin without touching neutrals, radius,
 * density or any component rule.
 *
 * Why the neutrals stay put: a theme owns colour, but the *neutral* ramp is
 * what makes text readable at every contrast level. Re-tinting the grays per
 * theme would force five parallel ramp audits and every new component would
 * quietly fail one of them. Brand hue is what users recognise as "the theme",
 * so that is the axis the presets move — and it is the axis the components are
 * already wired to through `--sn-*-action-primary` / `-border-focus` / etc.
 *
 * Consumed by:
 *   - `snCssVars()` — emits one `[data-theme="<name>"]` block per preset
 *   - `@snui/style-packs` — packs can name a theme instead of inlining colours
 *   - `apps/docs` theme editor — the five presets surface as one-click choices
 */

import type { ThemeDefinition } from './theme.js';

/**
 * A built-in theme plus the copy the docs site and the MCP tools render.
 *
 * Structurally a `ThemeDefinition`, so it can be handed straight to
 * `snCssVars({ theme })` or a style pack's `theme` field.
 */
export interface BuiltinTheme extends ThemeDefinition {
  /** Human-readable label (zh-first, matching the rest of the docs). */
  readonly label: string;
  /** One-line description for docs / MCP listings. */
  readonly description: string;
}

/**
 * Build the semantic override for a brand hue.
 *
 * Every preset overrides exactly the slots that carry the brand: the active
 * surface tint, the accent/border ring, and the three action states. Everything
 * else (text, surfaces, feedback) stays on the light defaults, which is what
 * keeps `DEFAULT_SEMANTIC_TOKENS` the single source of neutrals.
 *
 * @param hue Primitive ramp name, e.g. `'green'`.
 * @param onPrimary Text colour on top of a solid `action.primary` fill.
 */
function brandTheme(
  name: string,
  label: string,
  description: string,
  hue: 'blue' | 'green' | 'amber' | 'purple' | 'red',
  onPrimary: string,
): BuiltinTheme {
  return {
    name,
    label,
    description,
    semantic: {
      text: { onPrimary },
      background: { accent: `var(--aui-color-${hue}-50)` },
      border: {
        accent: `var(--aui-color-${hue}-500)`,
        focus: `var(--aui-color-${hue}-500)`,
      },
      action: {
        primary: `var(--aui-color-${hue}-500)`,
        primaryHover: `var(--aui-color-${hue}-400)`,
        primaryActive: `var(--aui-color-${hue}-600)`,
      },
    },
  };
}

/** Cool blue — the calm default-most preset, explicit rather than implicit. */
export const AZURE_THEME: BuiltinTheme = brandTheme(
  'azure',
  'Azure（晴空蓝）',
  '冷静的蓝品牌色，中性色与浅色基线一致，适合后台与工具型产品。',
  'blue',
  '#ffffff',
);

/** Green — growth/success-leaning, used where the product talks about progress. */
export const FOREST_THEME: BuiltinTheme = brandTheme(
  'forest',
  'Forest（森林绿）',
  '绿色品牌色，天然贴近「成功 / 增长」语义，适合数据与运营类界面。',
  'green',
  '#ffffff',
);

/** Amber — warm and attention-drawing; needs dark text to stay readable. */
export const EMBER_THEME: BuiltinTheme = brandTheme(
  'ember',
  'Ember（暖琥珀）',
  '琥珀品牌色，暖调、吸睛；实心按钮上的文字用深色以保证对比度。',
  'amber',
  '#18181b',
);

/** Purple — expressive; pairs with creative and AI-facing surfaces. */
export const VIOLET_THEME: BuiltinTheme = brandTheme(
  'violet',
  'Violet（静紫）',
  '紫色品牌色，偏表达性，适合创作、AI 与营销类界面。',
  'purple',
  '#ffffff',
);

/** Red — the strongest accent; reserved for high-energy or alerting products. */
export const CRIMSON_THEME: BuiltinTheme = brandTheme(
  'crimson',
  'Crimson（绯红）',
  '红色品牌色，视觉冲击最强，适合活动页与需要强提示的产品。',
  'red',
  '#ffffff',
);

/** All built-in colour themes, in docs display order. */
export const BUILTIN_THEMES: ReadonlyArray<BuiltinTheme> = [
  AZURE_THEME,
  FOREST_THEME,
  EMBER_THEME,
  VIOLET_THEME,
  CRIMSON_THEME,
];

/** Lookup a built-in theme by name. Returns `undefined` for unknown names. */
export function getBuiltinTheme(name: string): BuiltinTheme | undefined {
  return BUILTIN_THEMES.find((theme) => theme.name === name);
}
