/**
 * AUI Token Cascade / Resolver (AUI-TOKEN-004).
 *
 * Cascade priority (low → high):
 *   1. Default primitive tokens
 *   2. Theme overrides  →  primitive color + semantic color
 *   3. Style overrides  →  primitive radius/shadow + component tokens
 *   4. Density overrides →  primitive spacing/size/fontSize
 *   5. Variant overrides → component tokens
 *   6. Instance overrides → flat record, top-most priority
 *
 * Output: an array of `{ name, value }` bindings ready to inject via
 * `el.style.setProperty(name, value)` or a `<style>` block. Bindings are
 * emitted in dependency order (primitives first) so semantic / component
 * bindings can reference earlier entries via `var(--aui-...)`.
 *
 * Per AUI-PRD-v1.2.md §37, "高层只能覆盖明确声明允许覆盖的 Token" — the resolver
 * strictly merges only the documented slots (color for theme, radius/shadow/
 * component for style, spacing/size/fontSize for density).
 */

import { DEFAULT_PRIMITIVE_TOKENS, type PrimitiveTokens } from './primitive.js';
import { DEFAULT_SEMANTIC_TOKENS, type SemanticTokens } from './semantic.js';
import { DEFAULT_COMPONENT_TOKENS, type ComponentTokens } from './component.js';
import type {
  DensityDefinition,
  StyleDefinition,
  ThemeDefinition,
  TokenEnvironment,
  VariantDefinition,
} from './theme.js';

/** A resolved token ready for CSS variable injection. */
export interface TokenBinding {
  /** CSS custom property name (always begins with `--`). */
  readonly name: string;
  /** Resolved value — may be a literal or another `var(...)` reference. */
  readonly value: string;
}

/** Deep-merge `override` into `base` (only own enumerable string-valued leaves). */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === null || override === undefined) return base;
  if (typeof override !== 'object') return override as T;
  const baseObj = base as Record<string, unknown>;
  const overrideObj = override as Record<string, unknown>;
  const out: Record<string, unknown> = { ...baseObj };
  for (const key of Object.keys(overrideObj)) {
    const baseVal = baseObj[key];
    const overrideVal = overrideObj[key];
    if (
      baseVal !== null
      && typeof baseVal === 'object'
      && !Array.isArray(baseVal)
      && overrideVal !== null
      && typeof overrideVal === 'object'
      && !Array.isArray(overrideVal)
    ) {
      out[key] = deepMerge(baseVal, overrideVal);
    } else if (overrideVal !== undefined) {
      out[key] = overrideVal;
    }
  }
  return out as T;
}

function mergePrimitiveByAxes(base: PrimitiveTokens, theme: ThemeDefinition, density: DensityDefinition): PrimitiveTokens {
  let color: PrimitiveTokens['color'] = base.color;
  if (theme.primitive) color = deepMerge(color, theme.primitive);

  let spacing: PrimitiveTokens['spacing'] = base.spacing;
  let size: PrimitiveTokens['size'] = base.size;
  let font: PrimitiveTokens['font'] = base.font;
  if (density.primitive) {
    if (density.primitive.spacing) spacing = deepMerge(spacing, density.primitive.spacing);
    if (density.primitive.size) size = deepMerge(size, density.primitive.size);
    if (density.primitive.font) {
      font = {
        ...font,
        size: deepMerge(font.size, density.primitive.font.size),
        lineHeight: deepMerge(font.lineHeight, density.primitive.font.lineHeight),
      };
    }
  }

  return {
    color,
    spacing,
    radius: base.radius,
    shadow: base.shadow,
    font,
    motion: base.motion,
    size,
  };
}

function mergeSemanticByTheme(base: SemanticTokens, theme: ThemeDefinition): SemanticTokens {
  if (!theme.semantic) return base;
  return {
    color: deepMerge(base.color, theme.semantic),
    spacing: base.spacing,
    radius: base.radius,
    shadow: base.shadow,
    size: base.size,
    font: base.font,
    motion: base.motion,
  };
}

function mergeComponentByAxes(
  base: ComponentTokens,
  style: StyleDefinition,
  variant: VariantDefinition | undefined,
): ComponentTokens {
  let result = base;
  if (style.component) result = deepMerge(result, style.component);
  if (variant?.component) result = deepMerge(result, variant.component);
  return result;
}

/** Emit primitive CSS variable bindings (color/spacing/radius/shadow/font/motion/size). */
function emitPrimitiveBindings(primitives: PrimitiveTokens): TokenBinding[] {
  const out: TokenBinding[] = [];

  // color.{name}.{ramp}
  const color = primitives.color;
  for (const palette of Object.keys(color) as Array<keyof PrimitiveTokens['color']>) {
    const scale = color[palette];
    if (typeof scale === 'string') {
      out.push({ name: `--aui-color-${palette}`, value: scale });
    } else {
      for (const ramp of Object.keys(scale) as unknown as Array<keyof typeof scale>) {
        out.push({ name: `--aui-color-${palette}-${ramp}`, value: scale[ramp] });
      }
    }
  }

  for (const key of Object.keys(primitives.spacing) as Array<keyof PrimitiveTokens['spacing']>) {
    out.push({ name: `--aui-spacing-${key}`, value: primitives.spacing[key] });
  }
  for (const key of Object.keys(primitives.radius) as Array<keyof PrimitiveTokens['radius']>) {
    out.push({ name: `--aui-radius-${key}`, value: primitives.radius[key] });
  }
  for (const key of Object.keys(primitives.shadow) as Array<keyof PrimitiveTokens['shadow']>) {
    out.push({ name: `--aui-shadow-${key}`, value: primitives.shadow[key] });
  }

  for (const familyKey of Object.keys(primitives.font.family) as Array<keyof PrimitiveTokens['font']['family']>) {
    out.push({ name: `--aui-font-family-${familyKey}`, value: primitives.font.family[familyKey] });
  }
  for (const key of Object.keys(primitives.font.size) as Array<keyof PrimitiveTokens['font']['size']>) {
    out.push({ name: `--aui-font-size-${key}`, value: primitives.font.size[key] });
  }
  for (const key of Object.keys(primitives.font.weight) as Array<keyof PrimitiveTokens['font']['weight']>) {
    out.push({ name: `--aui-font-weight-${key}`, value: primitives.font.weight[key] });
  }
  for (const key of Object.keys(primitives.font.lineHeight) as Array<keyof PrimitiveTokens['font']['lineHeight']>) {
    out.push({ name: `--aui-font-line-height-${key}`, value: primitives.font.lineHeight[key] });
  }

  for (const key of Object.keys(primitives.motion.duration) as Array<keyof PrimitiveTokens['motion']['duration']>) {
    out.push({ name: `--aui-motion-duration-${key}`, value: primitives.motion.duration[key] });
  }
  for (const key of Object.keys(primitives.motion.easing) as Array<keyof PrimitiveTokens['motion']['easing']>) {
    out.push({ name: `--aui-motion-easing-${key}`, value: primitives.motion.easing[key] });
  }

  for (const groupKey of Object.keys(primitives.size) as Array<keyof PrimitiveTokens['size']>) {
    const groupValue = primitives.size[groupKey];
    for (const key of Object.keys(groupValue) as Array<keyof typeof groupValue>) {
      out.push({ name: `--aui-size-${groupKey}-${key}`, value: groupValue[key] });
    }
  }

  return out;
}

/**
 * Emit semantic CSS variable bindings — each value is a `var(--aui-color-...)`
 * reference (kept as-is from the default semantic table; theme overrides replace
 * the value with a primitive ref).
 */
function emitSemanticBindings(semantic: SemanticTokens): TokenBinding[] {
  const out: TokenBinding[] = [];

  function emitPath(prefix: string, value: unknown): void {
    if (typeof value === 'string') {
      out.push({ name: `--aui-${prefix}`, value });
      return;
    }
    if (value !== null && typeof value === 'object') {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        emitPath(`${prefix}-${k}`, v);
      }
    }
  }

  emitPath('color', semantic.color);
  emitPath('spacing', semantic.spacing);
  emitPath('radius', semantic.radius);
  emitPath('shadow', semantic.shadow);
  emitPath('size', semantic.size);
  emitPath('font', semantic.font);
  emitPath('motion', semantic.motion);
  return out;
}

/**
 * Emit component CSS variable bindings. Per ADR-0002 + Spec-01 §1.3:
 *   - camelCase property names are converted to kebab-case CSS identifiers
 *     (e.g. `heightMedium` → `--aui-button-height-medium`)
 *   - One-to-one `--sn-*` alias is emitted in the same pass (see css-vars.ts
 *     `renderAliasBlock` which loops over the same binding list)
 */
function emitComponentBindings(component: ComponentTokens): TokenBinding[] {
  const out: TokenBinding[] = [];

  function emitKey(componentPrefix: string, propKey: string, value: unknown): void {
    if (typeof value !== 'string') return;
    const cssKey = camelToKebab(propKey);
    out.push({ name: `--aui-${componentPrefix}-${cssKey}`, value });
  }

  for (const k of Object.keys(component.button) as Array<keyof ComponentTokens['button']>) {
    emitKey('button', k as string, component.button[k]);
  }
  for (const k of Object.keys(component.input) as Array<keyof ComponentTokens['input']>) {
    emitKey('input', k as string, component.input[k]);
  }
  for (const k of Object.keys(component.card) as Array<keyof ComponentTokens['card']>) {
    emitKey('card', k as string, component.card[k]);
  }
  return out;
}

/** `heightMedium` → `height-medium`. Pure ASCII, no locale-dependent upper case. */
function camelToKebab(input: string): string {
  return input.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`);
}

/**
 * Resolve the entire environment into a flat list of CSS variable bindings,
 * already in dependency order. Instance overrides win last; any binding that
 * matches an instance override key is replaced with the override value.
 */
export function resolveEnvironment(env: TokenEnvironment): TokenBinding[] {
  const primitive = mergePrimitiveByAxes(DEFAULT_PRIMITIVE_TOKENS, env.theme, env.density);
  const semantic = mergeSemanticByTheme(DEFAULT_SEMANTIC_TOKENS, env.theme);
  const component = mergeComponentByAxes(DEFAULT_COMPONENT_TOKENS, env.style, env.variant);

  const bindings: TokenBinding[] = [
    ...emitPrimitiveBindings(primitive),
    ...emitSemanticBindings(semantic),
    ...emitComponentBindings(component),
  ];

  if (env.instanceOverrides) {
    const map = new Map<string, string>();
    for (const [k, v] of Object.entries(env.instanceOverrides)) {
      map.set(k, v);
    }
    return bindings.map((b) => (map.has(b.name) ? { name: b.name, value: map.get(b.name)! } : b));
  }
  return bindings;
}

/** Convenience: render bindings as a single CSS `<style>` block string. */
export function renderStyleBlock(bindings: readonly TokenBinding[]): string {
  const body = bindings.map((b) => `  ${b.name}: ${b.value};`).join('\n');
  return `:root {\n${body}\n}`;
}

/**
 * Internal helper: merge primitives/semantic/component by axis. Exposed for
 * unit tests so they can verify the cascade without re-implementing it.
 */
export const __internal = {
  mergePrimitiveByAxes,
  mergeSemanticByTheme,
  mergeComponentByAxes,
  deepMerge,
};