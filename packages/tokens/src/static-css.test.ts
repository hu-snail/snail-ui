/**
 * @snui/tokens — static stylesheet emission tests (FB-004 follow-up).
 *
 * `styles/index.css` is a hand-flattened cascade (semantic names resolve to
 * raw palette values), so it drifts from `src/component.ts` silently: a leaf
 * added to DEFAULT_COMPONENT_TOKENS without a CSS declaration, or a var()
 * reference to a name nobody emits, both render as the empty string at
 * runtime. That exact regression shipped the focus-ring and drawer-mask
 * chains broken. This file pins the contract stated at the top of
 * `styles/index.css`:
 *
 *   1. every DEFAULT_COMPONENT_TOKENS leaf is emitted as
 *      `--aui-{family}-{kebab}` with a value identical to the TS source;
 *   2. every leaf has a `--sn-{family}-{kebab}` mirror whose value is exactly
 *      `var(--aui-{family}-{kebab})` (ADR-0002 dual exposure);
 *   3. no var() reference anywhere in the stylesheet dangles.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { DEFAULT_COMPONENT_TOKENS } from './component.js';

const here = dirname(fileURLToPath(import.meta.url));
const stylesheetPath = join(here, '..', 'styles', 'index.css');

/** Strip block comments so a name mentioned only in prose cannot pass. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

const bare = stripComments(readFileSync(stylesheetPath, 'utf-8'));

/** name → value; first declaration wins (the :root block precedes `.dark`). */
const declared = new Map<string, string>();
const declarationRe = /(--[a-z0-9-]+)\s*:\s*([^;]+);/g;
let match: RegExpExecArray | null;
while ((match = declarationRe.exec(bare)) !== null) {
  if (!declared.has(match[1]!)) {
    declared.set(match[1]!, match[2]!.trim());
  }
}

/** Every custom property referenced through var() inside the stylesheet. */
const referenced = new Set<string>();
const referenceRe = /var\((--[a-z0-9-]+)/g;
while ((match = referenceRe.exec(bare)) !== null) {
  referenced.add(match[1]!);
}

/** camelCase → kebab-case, the same rule the resolver applies to var names. */
function toKebab(name: string): string {
  return name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

/** Flatten DEFAULT_COMPONENT_TOKENS into `[cssVarName, tsValue]` leaves. */
function collectLeaves(): Array<[string, string]> {
  const leaves: Array<[string, string]> = [];
  function walk(prefix: string, value: unknown): void {
    if (typeof value === 'string') {
      leaves.push([prefix, value]);
      return;
    }
    if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        walk(`${prefix}-${toKebab(key)}`, child);
      }
    }
  }
  const families = DEFAULT_COMPONENT_TOKENS as Record<string, unknown>;
  for (const [family, tokens] of Object.entries(families)) {
    walk(`--aui-${family}`, tokens);
  }
  return leaves;
}

describe('@snui/tokens — static stylesheet emission', () => {
  it('emits every DEFAULT_COMPONENT_TOKENS leaf with its exact TS value', () => {
    const leaves = collectLeaves();
    // Lower bound guards against the walk silently collecting nothing.
    expect(leaves.length).toBeGreaterThanOrEqual(80);
    for (const [name, tsValue] of leaves) {
      expect(declared.has(name), `${name} is missing from styles/index.css`).toBe(true);
      // CSS 侧经过 prettier（如 rgba 空格规范化），按去空白后的值比较：
      // 漂移检测针对语义（颜色/长度），不针对排版。
      const normalize = (value: string): string => value.replace(/\s+/g, '');
      expect(normalize(declared.get(name) ?? ''), `${name} drifted from src/component.ts`).toBe(
        normalize(tsValue),
      );
    }
  });

  it('mirrors every component leaf as --sn-* pointing at the --aui-* original', () => {
    for (const [name] of collectLeaves()) {
      const mirror = name.replace(/^--aui-/, '--sn-');
      expect(declared.get(mirror), `${mirror} is missing from styles/index.css`).toBe(
        `var(${name})`,
      );
    }
  });

  it('leaves no var() reference dangling inside the stylesheet', () => {
    expect(referenced.size).toBeGreaterThanOrEqual(50);
    const dangling = [...referenced].filter((name) => !declared.has(name));
    expect(dangling, 'referenced but never declared in styles/index.css').toEqual([]);
  });
});
