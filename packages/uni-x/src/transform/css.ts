/**
 * ucss transform (ADR-0004): rewrites a component stylesheet into the subset
 * uni-app x App (vapor) accepts.
 *
 * Decision per selector (postcss-parsed, `@keyframes` bodies untouched):
 *  - compound class selectors (`.a.b`) → kept as-is
 *  - tag prefix (`textarea.sn-input__native`) → tag stripped
 *  - tag-only / attribute / pseudo-class / pseudo-element selectors → dropped + reported
 *  - two-level descendant `.a .b` where the target is exactly one class →
 *    flattened into CSS custom-property context injection:
 *      `.a .b { color: red }` + base `.b { color: blue }`
 *      ⇒ `.a { --snx-b-color: red }` + `.b { color: var(--snx-b-color, blue) }`
 *    (the custom property inherits through the tree, reproducing descendant
 *    scoping without relationship selectors)
 *  - deeper descendants / sibling combinators → dropped + reported
 *
 * Idempotent by construction: transformed output contains no descendant or
 * pseudo selectors, so re-running the transform is a no-op (§27).
 */

import postcss from 'postcss';
import type { AtRule, Rule } from 'postcss';
import type { CssMode, CssTransformResult, IssueKind, TransformIssue } from './types.ts';

/** Properties with no native equivalent on uni-app x App; stripped + reported. */
const STRIPPED_PROPERTIES = new Set([
  'cursor',
  'user-select',
  '-webkit-user-select',
  'outline',
  'appearance',
]);

interface ParsedCompound {
  tag: string | null;
  classes: string[];
  hasAttr: boolean;
  pseudos: string[];
  pseudoEls: string[];
}

interface ComplexPart {
  /** Combinator that precedes this compound (null for the first one). */
  combinator: ' ' | '>' | '+' | '~' | null;
  compoundStr: string;
}

type SelectorDecision =
  | { action: 'keep'; selector: string }
  | { action: 'flatten'; containerSelector: string; targetClass: string }
  | { action: 'drop'; kind: IssueKind; detail: string };

function skipParens(s: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < s.length; i++) {
    const c: string = s.charAt(i);
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return s.length;
}

/** Top-level whitespace split that skips parens (a `var(--a, b)` value stays
 * one part). */
function splitTopLevel(value: string): string[] {
  const parts: string[] = [];
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    const c: string = value.charAt(i);
    if (c === '(') i = skipParens(value, i);
    else if (/\s/.test(c)) {
      if (i > start) parts.push(value.slice(start, i));
      start = i + 1;
    }
  }
  if (start < value.length) parts.push(value.slice(start));
  return parts;
}

const BORDER_STYLE_WORDS = new Set([
  'none',
  'hidden',
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
]);

/** Split border shorthands into the longhands the flattener needs — skin
 * rules override `border-top-width` / `border-top-color` individually, and
 * the injected var() fallbacks must know the base shorthand's own values.
 * The plain `border` shorthand expands too: a base like
 * `border: 2rpx solid transparent` must yield longhand base entries, or the
 * flatten of a skin's `border-width` override cannot find a base value and
 * falls back to the property initial (uni-app x 4.0+: 3px `medium`) — the
 * heavy-black-frame regression. Unparseable values (e.g. a bare var()) stay
 * whole: per-CSS a shorthand carrying var() must resolve every longhand from
 * that one reference, and baking width/style defaults would falsify it. */
function expandBorderShorthand(prop: string, value: string): Array<[string, string]> {
  const m: RegExpMatchArray | null = prop.match(/^border(?:-(top|right|bottom|left))?$/);
  if (!m) return [[prop, value]];
  const side: string = m[1] === undefined ? '' : `-${m[1]}`;
  const width: string[] = [];
  const style: string[] = [];
  const color: string[] = [];
  for (const part of splitTopLevel(value)) {
    if (BORDER_STYLE_WORDS.has(part)) style.push(part);
    else if (width.length === 0 && /^(0|[-0-9.]+(?:rpx|px|rem|em|%)|thin|medium|thick)$/.test(part))
      width.push(part);
    else color.push(part);
  }
  return [
    [`border${side}-width`, width.join(' ') || 'medium'],
    [`border${side}-style`, style.join(' ') || 'none'],
    [`border${side}-color`, color.join(' ') || 'currentColor'],
  ];
}

function parseCompound(input: string): ParsedCompound {
  const out: ParsedCompound = {
    tag: null,
    classes: [],
    hasAttr: false,
    pseudos: [],
    pseudoEls: [],
  };
  let i = 0;
  while (i < input.length) {
    const c: string = input.charAt(i);
    if (c === '*') {
      i++;
      continue;
    }
    if (c === '.') {
      const m = /^[\w-]+/.exec(input.slice(i + 1));
      if (m === null) throw new Error(`unparseable class in "${input}"`);
      out.classes.push(m[0]);
      i += 1 + m[0].length;
      continue;
    }
    if (c === '[') {
      out.hasAttr = true;
      const end = input.indexOf(']', i);
      i = end === -1 ? input.length : end + 1;
      continue;
    }
    if (c === ':') {
      if (input.charAt(i + 1) === ':') {
        const m = /^[\w-]+/.exec(input.slice(i + 2));
        if (m !== null) {
          out.pseudoEls.push(m[0]);
          i += 2 + m[0].length;
        } else {
          i += 2;
        }
        continue;
      }
      const m = /^[\w-]+/.exec(input.slice(i + 1));
      const name: string = m?.[0] ?? '';
      if (m !== null) i += 1 + name.length;
      else i += 1;
      if (input.charAt(i) === '(') {
        i = skipParens(input, i);
        if (name !== '') out.pseudos.push(`${name}()`);
      } else if (name !== '') {
        out.pseudos.push(name);
      }
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      const m = /^[a-zA-Z][\w-]*/.exec(input.slice(i));
      if (m !== null) {
        out.tag = out.tag ?? m[0];
        i += m[0].length;
        continue;
      }
    }
    i++;
  }
  return out;
}

/** Splits a complex selector into compounds on combinators, ignoring brackets/parens. */
function splitComplex(sel: string): ComplexPart[] {
  const parts: ComplexPart[] = [];
  let buf = '';
  let pendingComb: ' ' | '>' | '+' | '~' | null = null;
  const flush = (): void => {
    const trimmed: string = buf.trim();
    if (trimmed !== '') parts.push({ combinator: pendingComb, compoundStr: trimmed });
    buf = '';
  };
  let i = 0;
  while (i < sel.length) {
    const c: string = sel.charAt(i);
    if (c === '[') {
      const end = sel.indexOf(']', i);
      const stop = end === -1 ? sel.length : end + 1;
      buf += sel.slice(i, stop);
      i = stop;
      continue;
    }
    if (c === '(') {
      const stop: number = skipParens(sel, i);
      buf += sel.slice(i, stop);
      i = stop;
      continue;
    }
    if (c === '>' || c === '+' || c === '~') {
      flush();
      pendingComb = c;
      i++;
      continue;
    }
    if (/\s/.test(c)) {
      let j = i;
      while (j < sel.length && /\s/.test(sel.charAt(j))) j++;
      const next: string = sel.charAt(j);
      if (next !== '>' && next !== '+' && next !== '~' && buf.trim() !== '' && j < sel.length) {
        flush();
        pendingComb = ' ';
      }
      i = j;
      continue;
    }
    buf += c;
    i++;
  }
  flush();
  return parts;
}

function decideSelector(rawSelector: string): SelectorDecision {
  const parts: ComplexPart[] = splitComplex(rawSelector);
  if (parts.length === 0)
    return { action: 'drop', kind: 'tag-only-selector', detail: `empty selector "${rawSelector}"` };
  const parsed = parts.map((p) => parseCompound(p.compoundStr));
  for (let idx = 0; idx < parsed.length; idx++) {
    const c: ParsedCompound = parsed[idx]!;
    if (c.hasAttr)
      return {
        action: 'drop',
        kind: 'attribute-selector',
        detail: `attribute selector in "${rawSelector}"`,
      };
    if (c.pseudoEls.length > 0)
      return {
        action: 'drop',
        kind: 'pseudo-element',
        detail: `pseudo-element in "${rawSelector}"`,
      };
    if (c.pseudos.length > 0)
      return { action: 'drop', kind: 'pseudo-class', detail: `pseudo-class in "${rawSelector}"` };
    if (c.classes.length === 0)
      return {
        action: 'drop',
        kind: 'tag-only-selector',
        detail: `tag-only selector "${rawSelector}"`,
      };
  }
  const rebuilt: string[] = parsed.map((c) => `.${c.classes.join('.')}`);
  if (parsed.length === 1) return { action: 'keep', selector: rebuilt[0]! };
  const second: ComplexPart = parts[1]!;
  const secondCompound: ParsedCompound = parsed[1]!;
  if (
    parsed.length === 2 &&
    (second.combinator === ' ' || second.combinator === '>') &&
    secondCompound.classes.length === 1
  ) {
    return {
      action: 'flatten',
      containerSelector: rebuilt[0]!,
      targetClass: secondCompound.classes[0]!,
    };
  }
  const comb: string = second.combinator ?? ' ';
  const kind: IssueKind =
    comb === '+' || comb === '~' ? 'combinator-unsupported' : 'combinator-unsupported';
  return {
    action: 'drop',
    kind,
    detail: `selector "${rawSelector}" (${parsed.length} levels, "${comb}")`,
  };
}

function insideKeyframes(rule: Rule): boolean {
  let parent: (Rule | AtRule | postcss.Root | undefined) | undefined = rule.parent;
  while (parent !== undefined && parent.type !== 'root') {
    if (parent.type === 'atrule' && /^(?:-webkit-)?keyframes$/.test((parent as AtRule).name))
      return true;
    parent = parent.parent;
  }
  return false;
}

interface BaseEntry {
  decls: Map<string, postcss.Declaration>;
}

/**
 * "Container context absent" must mean "as if this rule never existed". For
 * border longhands that is NOT the unset default on uni-app x: since 4.0 the
 * App engine aligns border-width with W3C, whose initial value is `medium`
 * (3px), and border-color's initial is `currentColor` — so a fallback-less
 * var() paints a 3px solid ink frame the moment any surviving declaration
 * provides `border-style: solid` (real-device regression, picker indicator).
 * An explicit no-border fallback keeps the absent state inert on any engine.
 */
function borderLonghandFallback(prop: string): string | null {
  if (/^border(?:-(?:top|right|bottom|left))?-width$/.test(prop)) return '0';
  if (/^border(?:-(?:top|right|bottom|left))?-style$/.test(prop)) return 'none';
  if (/^border(?:-(?:top|right|bottom|left))?-color$/.test(prop)) return 'transparent';
  return null;
}

function transformComponent(root: postcss.Root, file: string, issues: TransformIssue[]): void {
  // Pass 0 — collect base declarations per single-class selector (last wins).
  const baseEntries = new Map<string, BaseEntry>();
  root.walkRules((rule) => {
    if (insideKeyframes(rule)) return;
    const parts: ComplexPart[] = splitComplex(rule.selector);
    if (parts.length !== 1) return;
    const compound: ParsedCompound = parseCompound(parts[0]!.compoundStr);
    if (
      compound.tag !== null ||
      compound.hasAttr ||
      compound.pseudos.length > 0 ||
      compound.pseudoEls.length > 0 ||
      compound.classes.length !== 1
    ) {
      return;
    }
    const key: string = compound.classes[0]!;
    let entry = baseEntries.get(key);
    if (entry === undefined) {
      entry = { decls: new Map() };
      baseEntries.set(key, entry);
    }
    rule.walkDecls((decl) => {
      if (!decl.prop.startsWith('--')) {
        for (const [prop, value] of expandBorderShorthand(decl.prop, decl.value)) {
          entry!.decls.set(prop, postcss.decl({ prop, value }));
        }
      }
    });
  });

  const syntheticRules = new Map<string, postcss.Rule>();
  const ensureBaseDecl = (targetClass: string, prop: string, varName: string): void => {
    const entry = baseEntries.get(targetClass);
    if (entry === undefined) {
      let rule = syntheticRules.get(targetClass);
      if (rule === undefined) {
        rule = postcss.rule({ selector: `.${targetClass}` });
        syntheticRules.set(targetClass, rule);
        root.append(rule);
      }
      const borderFallback: string | null = borderLonghandFallback(prop);
      rule.append({
        prop,
        value: borderFallback === null ? `var(${varName})` : `var(${varName}, ${borderFallback})`,
      });
      return;
    }
    const baseDecl = entry.decls.get(prop);
    if (baseDecl !== undefined) {
      // Keep the original value as the var() fallback: outside the container
      // context the declaration resolves to the original base value.
      const original: string = baseDecl.value;
      const injected: string = `var(${varName}, ${original})`;
      if (baseDecl.parent === undefined) {
        // Shorthand-derived synthetic entry (expandBorderShorthand): there is
        // no real node to rewrite, so append the longhand with its fallback
        // onto the target rule — with the skin inactive the var() resolves
        // to the base value instead of the longhand's *initial* (3px medium
        // + currentColor), which used to shatter the 1px base line.
        entry.decls.set(prop, postcss.decl({ prop, value: injected }));
        root.walkRules((r) => {
          if (insideKeyframes(r)) return;
          const parts: ComplexPart[] = splitComplex(r.selector);
          if (
            parts.length === 1 &&
            parseCompound(parts[0]!.compoundStr).classes.join('.') === targetClass
          ) {
            r.append({ prop, value: injected });
            return false;
          }
          return undefined;
        });
        return;
      }
      baseDecl.value = injected;
      return;
    }
    // Base rule exists but never declared this prop: append the var() so the
    // container context can still reach the element ("rule was the only
    // styling" case). Border longhands additionally carry an explicit
    // no-border fallback — an unset var() would otherwise resolve to the
    // initial `medium` width / `currentColor` (see borderLonghandFallback),
    // not to "no border".
    const borderFallback: string | null = borderLonghandFallback(prop);
    const fallbackLess: string =
      borderFallback === null ? `var(${varName})` : `var(${varName}, ${borderFallback})`;
    entry.decls.set(prop, postcss.decl({ prop, value: fallbackLess }));
    root.walkRules((r) => {
      if (insideKeyframes(r)) return;
      const parts: ComplexPart[] = splitComplex(r.selector);
      if (
        parts.length === 1 &&
        parseCompound(parts[0]!.compoundStr).classes.join('.') === targetClass
      ) {
        r.append({ prop, value: fallbackLess });
        return false;
      }
      return undefined;
    });
  };

  const containerDeclCache = new Map<string, postcss.Rule>();
  const pushContainerDecl = (containerSelector: string, prop: string, value: string): void => {
    let rule = containerDeclCache.get(containerSelector);
    if (rule === undefined) {
      const existing: Rule | undefined = root.nodes.find(
        (n): n is Rule => n.type === 'rule' && (n as Rule).selector === containerSelector,
      );
      if (existing !== undefined) {
        rule = existing;
      } else {
        rule = postcss.rule({ selector: containerSelector });
        root.append(rule);
      }
      containerDeclCache.set(containerSelector, rule);
    }
    const dup = rule.nodes.some(
      (n) =>
        n.type === 'decl' &&
        (n as postcss.Declaration).prop === prop &&
        (n as postcss.Declaration).value === value,
    );
    if (!dup) rule.append({ prop, value });
  };

  const injected = new Set<string>();

  root.walkRules((rule) => {
    if (insideKeyframes(rule)) return;
    const selectors: string[] = rule.selectors;
    const kept: string[] = [];
    const flattens: { containerSelector: string; targetClass: string }[] = [];
    for (const sel of selectors) {
      const decision: SelectorDecision = decideSelector(sel);
      if (decision.action === 'keep') {
        kept.push(decision.selector);
      } else if (decision.action === 'flatten') {
        flattens.push({
          containerSelector: decision.containerSelector,
          targetClass: decision.targetClass,
        });
      } else {
        issues.push({
          file,
          kind: decision.kind,
          detail: decision.detail,
          line: rule.source?.start?.line,
        });
      }
    }

    if (flattens.length > 0) {
      for (const decl of rule.nodes) {
        if (decl.type !== 'decl') continue;
        const d = decl as postcss.Declaration;
        for (const op of flattens) {
          if (d.prop.startsWith('--')) {
            pushContainerDecl(op.containerSelector, d.prop, d.value);
            continue;
          }
          // Border shorthands split into longhands so each part gets its own
          // var() slot and its own base-value fallback (same contract as the
          // base-collection pass below).
          for (const [prop, value] of expandBorderShorthand(d.prop, d.value)) {
            const varName = `--snx-${op.targetClass}-${prop}`;
            pushContainerDecl(op.containerSelector, varName, value);
            const injectKey = `${op.targetClass}.${prop}`;
            if (!injected.has(injectKey)) {
              injected.add(injectKey);
              ensureBaseDecl(op.targetClass, prop, varName);
            }
          }
        }
      }
      if (kept.length === 0) rule.remove();
      else rule.selector = kept.join(', ');
      return;
    }

    if (kept.length > 0 && kept.join(', ') !== rule.selector) rule.selector = kept.join(', ');
    if (kept.length === 0) rule.remove();
  });

  // Property-level strip (no native equivalent on App).
  const doomed: postcss.Declaration[] = [];
  root.walkDecls((decl) => {
    if (STRIPPED_PROPERTIES.has(decl.prop)) doomed.push(decl);
  });
  for (const decl of doomed) {
    issues.push({
      file,
      kind: 'unsupported-property',
      detail: `${decl.prop} stripped`,
      line: decl.source?.start?.line,
    });
    decl.remove();
  }

  // uni-app x resets flex-direction to `column` on every platform (W3C
  // default is row — uni-app-x/css reset table). Flex containers relying on
  // the W3C default stack vertically on App AND web, so a rule declaring a
  // flex display without an explicit direction gets `flex-direction: row`
  // injected to preserve W3C-authored geometry.
  let flexRows = 0;
  root.walkRules((rule) => {
    if (insideKeyframes(rule)) return;
    let hasFlexDisplay = false;
    let hasDirection = false;
    rule.walkDecls((decl) => {
      const prop = decl.prop.toLowerCase();
      const value = decl.value.toLowerCase();
      if (prop === 'display' && /flex/.test(value)) hasFlexDisplay = true;
      if (prop === 'flex-direction') hasDirection = true;
    });
    if (hasFlexDisplay && !hasDirection) {
      rule.append({ prop: 'flex-direction', value: 'row' });
      flexRows++;
    }
  });
  if (flexRows > 0) {
    issues.push({
      file,
      kind: 'flex-direction-row',
      detail: `${flexRows} flex container(s) given explicit flex-direction: row (uni-app x column default)`,
    });
  }
}

function transformTokens(root: postcss.Root, file: string, issues: TransformIssue[]): void {
  root.walkRules((rule) => {
    const rewritten: string[] = [];
    for (const sel of rule.selectors) {
      if (sel === ':root') {
        rewritten.push('.sn-theme-root');
        continue;
      }
      if (sel === 'page' || sel.startsWith('page.')) {
        rewritten.push(`.sn-theme-root${sel.slice('page'.length)}`);
        continue;
      }
      rewritten.push(sel);
    }
    rule.selector = rewritten.join(', ');
  });
  issues.push({
    file,
    kind: 'patch',
    detail: 'token selectors rewritten to class-only (.sn-theme-root)',
  });
}

export function transformCss(css: string, mode: CssMode, file: string): CssTransformResult {
  const issues: TransformIssue[] = [];
  const root: postcss.Root = postcss.parse(css, { from: file });
  if (mode === 'tokens') transformTokens(root, file, issues);
  else transformComponent(root, file, issues);
  return { css: root.toString(), issues };
}
