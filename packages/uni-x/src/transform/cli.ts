/**
 * Build CLI: emits the npm-consumable uni-app x artifact from @snui/uni sources.
 *
 * The package publishes `dist/` directly — consumers `npm install @snui/uni-x`
 * and point easycom at the package path. No build or copy steps on the user side.
 *
 * Output (dist/, gitignored, shipped via package.json `files`):
 *   dist/components/<comp>/<comp>.uvue   (easycom layout)
 *   dist/components/<comp>/<helper>.ts   (copied, patched)
 *   dist/theme/index.css                 (class-only tokens)
 *   dist/PORTING-REPORT.md  (+ copy at package root for review)
 *
 * Exits non-zero when a patch anchor goes missing (upstream drift).
 */

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { transformCss } from './css.ts';
import { applyPatches } from './patches.ts';
import { transformVueToUvue } from './index.ts';
import type { IssueKind, TransformIssue } from './types.ts';

const pkgRoot: string = process.cwd();
const uniComponentsDir: string = resolve(pkgRoot, '../../packages/uni/src/components');
const tokenSources: string[] = [
  resolve(pkgRoot, '../../packages/tokens/styles/index.css'),
  resolve(pkgRoot, '../../packages/tokens-mp/styles/index.css'),
];
const distDir: string = resolve(pkgRoot, 'dist');
const componentsDir: string = join(distDir, 'components');

interface FileOutcome {
  relPath: string;
  issues: TransformIssue[];
}

const outcomes: FileOutcome[] = [];

function isSkipFile(name: string): boolean {
  // `._*` AppleDouble files appear on this macOS external volume and must
  // never be treated as component sources.
  return name.startsWith('._') || /\.(test|spec)\.(ts|vue)$/.test(name);
}

function transformComponents(): { uvueCount: number; tsCount: number } {
  let uvueCount = 0;
  let tsCount = 0;
  for (const compDir of readdirSync(uniComponentsDir, { withFileTypes: true })) {
    if (!compDir.isDirectory()) continue;
    const compName: string = compDir.name;
    const outDir: string = join(componentsDir, compName);
    mkdirSync(outDir, { recursive: true });
    for (const entry of readdirSync(join(uniComponentsDir, compName), { withFileTypes: true })) {
      if (!entry.isFile() || isSkipFile(entry.name)) continue;
      const relPath = `${compName}/${entry.name}`;
      const srcPath: string = join(uniComponentsDir, compName, entry.name);
      const source: string = readFileSync(srcPath, 'utf8');
      if (entry.name.endsWith('.vue')) {
        const result = transformVueToUvue(source, relPath);
        writeFileSync(join(outDir, entry.name.replace(/\.vue$/, '.uvue')), result.code);
        outcomes.push({ relPath: relPath.replace(/\.vue$/, '.uvue'), issues: result.issues });
        uvueCount++;
      } else if (entry.name.endsWith('.ts')) {
        const issues: TransformIssue[] = [];
        const patched: string = applyPatches(source, relPath, issues);
        writeFileSync(join(outDir, entry.name), patched);
        outcomes.push({ relPath, issues });
        tsCount++;
      }
    }
  }
  return { uvueCount, tsCount };
}

function emitTheme(): void {
  const parts: string[] = [
    '/*',
    ' * @snui/uni-x theme — class-only token layer for uni-app x App (ADR-0004).',
    ' *',
    ' * Generated from @snui/tokens + @snui/tokens-mp. `:root` / `page` selectors',
    ' * are rewritten to `.sn-theme-root` (sn-config-provider adds it to its root',
    ' * node; non-provider hosts must put the class on their page root view).',
    ' * Import from App.uvue:  @import "@snui/uni-x/theme/index.css";',
    ' */',
    '',
  ];
  for (const file of tokenSources) {
    const css: string = readFileSync(file, 'utf8');
    const result = transformCss(css, 'tokens', relative(distDir, file));
    parts.push(
      `/* ---- source: ${relative(resolve(pkgRoot, '../..'), file)} ---- */`,
      result.css,
      '',
    );
  }
  mkdirSync(join(distDir, 'theme'), { recursive: true });
  writeFileSync(join(distDir, 'theme', 'index.css'), `${parts.join('\n')}\n`);
}

const KIND_LABELS: Record<IssueKind, string> = {
  'pseudo-element': 'pseudo-element rule dropped',
  'pseudo-class': 'pseudo-class rule dropped',
  'attribute-selector': 'attribute-selector rule dropped',
  'tag-only-selector': 'tag-only selector dropped',
  'combinator-unsupported': 'deep/sibling selector dropped',
  'unsupported-property': 'unsupported property stripped',
  'stray-sfc-content': 'stray SFC content dropped',
  'template-bare-text': 'bare text wrapped in <text>',
  'template-attr': 'template attribute rewritten',
  'script-guard': 'script DOM guard',
  'defineSlots-stripped': 'defineSlots stripped',
  'defineSlots-manual': 'defineSlots needs manual review',
  patch: 'patch applied',
};

function emitReport(counts: { uvueCount: number; tsCount: number }): void {
  const byKind = new Map<IssueKind, number>();
  const byFile = new Map<string, TransformIssue[]>();
  for (const outcome of outcomes) {
    if (outcome.issues.length === 0) continue;
    byFile.set(outcome.relPath, outcome.issues);
    for (const issue of outcome.issues) byKind.set(issue.kind, (byKind.get(issue.kind) ?? 0) + 1);
  }

  const lines: string[] = [
    '# uni-x PORTING-REPORT',
    '',
    `> Generated by \`pnpm -F @snui/uni-x build\` from @snui/uni sources — see ADR-0004.`,
    `> ${counts.uvueCount} .uvue + ${counts.tsCount} .ts emitted; ${outcomes.length} file(s) with transform notes.`,
    '',
    '## Issue summary',
    '',
    '| kind | count |',
    '| --- | --- |',
  ];
  for (const [kind, count] of [...byKind.entries()].sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${kind} | ${count} |`);
  }
  lines.push('', '## Manual-port flags (curated)', '');
  for (const flag of MANUAL_FLAGS) lines.push(`- ${flag}`);
  lines.push('', '## Per-file notes', '');
  for (const [file, issues] of [...byFile.entries()].sort()) {
    lines.push(`### ${file}`, '');
    for (const issue of issues) {
      const at: string = issue.line !== undefined ? ` (line ${issue.line})` : '';
      lines.push(
        `- ${KIND_LABELS[issue.kind]} — \`${issue.kind}\`${at}: ${issue.detail.replace(/\n/g, ' ')}`,
      );
    }
    lines.push('');
  }
  const report: string = `${lines.join('\n')}\n`;
  writeFileSync(join(distDir, 'PORTING-REPORT.md'), report);
  writeFileSync(resolve(pkgRoot, 'PORTING-REPORT.md'), report);
}

const MANUAL_FLAGS: string[] = [
  '**sn-table** — uvue officially supports `<component :is>` on App (vue/built-in docs), but cellRenderers pass a slot *function* as the value; that shape needs compile verification on device.',
  '**sn-sticky** — `position: sticky` is unsupported on App vapor and the built-in sticky-section/sticky-header only work inside list-view; the component degrades to normal flow (patched + documented).',
  '**sn-form-item** — consumed `defineSlots` return (`const slots = defineSlots…`); verify the macro exists on the vapor compiler.',
  '**sn-qr-code** — canvas runs on the W3C-aligned 2d context of uni-app x (bitmap sizing + `toDataURL` export patched in); verify first-paint bitmap timing and the roundRect/gradient fallbacks on device.',
  '**sn-paging** — scroll-view `refresher` slot content + refresherpulling/refresh/restore/abort contract: verify the custom refresher renders and `refresher-triggered` collapses on uvue devices; load-more rides native `@scrolltolower`.',
  '**sn-icon** — IconData path renders via `<image>` + SVG data URL; verify App-side SVG decode, otherwise use the iconfont glyph path (`name` prop).',
  '**Style packs** — skins ARE variable-injected: two-level skin rules flatten into single-class `--snx-*` blocks (measured: 59 components, 1097 injected vars, 434 consumers). Only 9 interactive-state rules (`:hover`/`:active`) are dropped — pseudo-classes are unrepresentable on App (ADR-0004 revision).',
  '**Device-verify list** — hover-class press states, `aria-*` pass-through, `:style`-injected CSS variables, `gap`, keyframes under bytecode rendering, fixed + safe-area (see README).',
];

function main(): void {
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(componentsDir, { recursive: true });
  const counts = transformComponents();
  emitTheme();
  emitReport(counts);
  const dropped: number = outcomes.reduce(
    (acc, o) =>
      acc +
      o.issues.filter(
        (i) =>
          i.kind.startsWith('pseudo') ||
          i.kind === 'combinator-unsupported' ||
          i.kind === 'attribute-selector' ||
          i.kind === 'tag-only-selector',
      ).length,
    0,
  );
  console.log(
    `[uni-x] emitted ${counts.uvueCount} .uvue + ${counts.tsCount} .ts, ` +
      `${dropped} rule(s) dropped+reported → dist/PORTING-REPORT.md`,
  );
}

main();
