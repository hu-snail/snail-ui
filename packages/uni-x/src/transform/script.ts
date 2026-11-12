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

/**
 * Import specifiers: @snui/uni sources reference sibling components as
 * `.vue` (correct for the classic uni-app build), but the dist tree ships
 * `.uvue` entities — unrewritten specifiers fail resolution the moment a
 * real compiler sees them (first caught by the uni-demo-x web compile).
 * Type-only imports point at the pure-ts `<comp>-types` entity instead of
 * the .uvue: type contracts live outside SFCs on uni-app x (sn-icon-types
 * pattern; SnFabAction / SnDialerPrize follow it too).
 */
export function transformImportSpecifiers(src: string, file: string): TextTransformResult {
  const issues: TransformIssue[] = [];
  let code = src;
  const typeImports = code.match(
    /^import\s+type\s*\{[^}]*\}\s*from\s*'(\.{1,2}\/[^']*sn-icon\/sn-icon)\.vue';/gm,
  )?.length;
  if (typeImports) {
    code = code.replace(
      /^(import\s+type\s*\{[^}]*\}\s*from\s+')(\.{1,2}\/[^']*sn-icon\/sn-icon)\.vue(';)/gm,
      '$1$2-types$3',
    );
    issues.push({
      file,
      kind: 'import-rewrite',
      detail: `${typeImports} type import(s) redirected to sn-icon-types`,
    });
  }
  const valueImports = code.match(/from\s+'(\.{1,2}\/[^']*)\.vue'/g)?.length ?? 0;
  if (valueImports > 0) {
    code = code.replace(/(from\s+')(\.{1,2}\/[^']*)\.vue(')/g, '$1$2.uvue$3');
    issues.push({
      file,
      kind: 'import-rewrite',
      detail: `${valueImports} relative .vue import(s) rewritten to .uvue`,
    });
  }
  return { code: rewriteKebabTags(code, file), issues };
}

/**
 * Kebab sub-component tags backed by an explicit import are rewritten to the
 * PascalCase binding name: the local binding resolves the tag directly, and
 * the easycom regex (`^sn-`, case-sensitive) cannot hijack PascalCase tags.
 * Left in kebab, a dist component's inner tag gets rewritten by the consumer
 * compiler to `@snui/uni-x/components/<c>/<c>.uvue` — a path that only
 * exists for top-level easycom entities (first broken by sn-rich-text-node,
 * whose entity lives inside its parent's directory). Tags without a local
 * import are left alone (easycom fallback still applies).
 */
function rewriteKebabTags(code: string, file: string): string {
  const bindings = new Map<string, string>();
  for (const m of code.matchAll(
    /import\s+(Sn[A-Za-z0-9]+)\s+from\s+'(?:\.\.?\/|@snui\/)[^']*\.(?:uvue|vue)';/g,
  )) {
    const binding: string = m[1]!;
    bindings.set(binding.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(), binding);
  }
  if (bindings.size === 0) return code;
  const tplStart: number = code.indexOf('<template>');
  const tplEnd: number = code.lastIndexOf('</template>');
  if (tplStart === -1 || tplEnd === -1) return code;
  let tpl = code.slice(tplStart, tplEnd);
  for (const [kebab, pascal] of bindings) {
    tpl = tpl.replaceAll(new RegExp(`<${kebab}(?=[\\s/>])`, 'g'), `<${pascal}`);
    tpl = tpl.replaceAll(`</${kebab}>`, `</${pascal}>`);
  }
  return code.slice(0, tplStart) + tpl + code.slice(tplEnd);
}

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
        issues.push({
          file,
          kind: 'defineSlots-manual',
          detail: 'defineSlots call could not be parsed',
        });
      } else {
        // Swallow the leading indentation of the call's own line.
        let lineStart = dsIdx;
        while (
          lineStart > 0 &&
          (code.charAt(lineStart - 1) === ' ' || code.charAt(lineStart - 1) === '\t')
        )
          lineStart--;
        code = code.slice(0, lineStart) + code.slice(end);
        issues.push({
          file,
          kind: 'defineSlots-stripped',
          detail: 'defineSlots macro call removed (type-only)',
        });
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
        if (code.charAt(i - 1) !== '=') {
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
