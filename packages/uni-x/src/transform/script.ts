/**
 * Script transform (ADR-0004). Vapor mode keeps TS as JS, so the surface is
 * minimal and defensive:
 *  - DOM event methods (`preventDefault` / `stopImmediatePropagation`) become
 *    optional calls — uni-app x event objects may not carry them.
 *  - `defineSlots<...>()` macro calls are stripped when their return value is
 *    unused: uvue compiler support for the macro is unconfirmed and the call
 *    is type-only. A consumed call (`const x = defineSlots...`) is reported
 *    for manual review instead of being stripped.
 */

import type { TextTransformResult, TransformIssue } from './types.ts';

export function transformScript(src: string, file: string): TextTransformResult {
  const issues: TransformIssue[] = [];
  let code = src;

  const guardCount =
    (code.match(/\.preventDefault\(\)/g)?.length ?? 0) +
    (code.match(/\.stopImmediatePropagation\(\)/g)?.length ?? 0);
  if (guardCount > 0) {
    code = code.replace(/\.preventDefault\(\)/g, '.preventDefault?.()');
    code = code.replace(/\.stopImmediatePropagation\(\)/g, '.stopImmediatePropagation?.()');
    issues.push({
      file,
      kind: 'script-guard',
      detail: `${guardCount} DOM event call(s) converted to optional calls`,
    });
  }

  const dsIdx: number = code.indexOf('defineSlots');
  if (dsIdx !== -1) {
    const before: string = code.slice(0, dsIdx).replace(/[\s]+$/, '');
    if (before.endsWith('=') || before.endsWith('return')) {
      issues.push({
        file,
        kind: 'defineSlots-manual',
        detail: 'defineSlots return value is consumed — manual review required',
      });
    } else {
      const end: number | null = findDefineSlotsEnd(code, dsIdx);
      if (end === null) {
        issues.push({ file, kind: 'defineSlots-manual', detail: 'defineSlots call could not be parsed' });
      } else {
        // Swallow the leading indentation of the call's own line.
        let lineStart = dsIdx;
        while (lineStart > 0 && (code.charAt(lineStart - 1) === ' ' || code.charAt(lineStart - 1) === '\t')) lineStart--;
        code = code.slice(0, lineStart) + code.slice(end);
        issues.push({ file, kind: 'defineSlots-stripped', detail: 'defineSlots macro call removed (type-only)' });
      }
    }
  }

  return { code, issues };
}

/** Finds the end (exclusive) of a `defineSlots<...>()` call starting at `start`. */
function findDefineSlotsEnd(code: string, start: number): number | null {
  let i = start + 'defineSlots'.length;
  while (i < code.length && /\s/.test(code.charAt(i))) i++;
  if (code.charAt(i) === '<') {
    let depth = 0;
    while (i < code.length) {
      const c: string = code.charAt(i);
      if (c === '<') depth++;
      else if (c === '>') {
        // Skip arrow-function `=>` inside the generic body.
        if (code.charAt(i - 1) !== '=' ) {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        }
      }
      i++;
    }
    while (i < code.length && /\s/.test(code.charAt(i))) i++;
  }
  if (code.charAt(i) !== '(') return null;
  let depth = 0;
  while (i < code.length) {
    const c: string = code.charAt(i);
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) return i + 1;
    }
    i++;
  }
  return null;
}
