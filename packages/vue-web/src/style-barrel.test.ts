/**
 * Regression tests for the `@snui/vue-web/styles` barrel assembler.
 *
 * Bug (AUI-WEB-FB-018): the docs site rendered unstyled components because
 * dist/styles/index.css shipped without the `--aui-*` / `--sn-web-*` token
 * layers — `vite build` (and therefore `vite build --watch`) rewrites that file
 * with component CSS only, and the token layers were prepended by a one-shot
 * script that watch mode never ran. Every
 * `var(--sn-web-*)` consumer (e.g. `.sn-button--primary { background-color:
 * var(--sn-web-color-action-primary) }`) then became invalid at computed-value
 * time and the component lost its color / size / radius.
 *
 * The tests drive the assembler over a synthetic package root, so they assert
 * the shipped artefact shape without touching the real dist/.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { buildStyleBarrel } from '../scripts/build-style-barrel.mjs';

const COMPONENT_CSS = '.sn-button--primary[data-v-abc] {\n  background-color: var(--sn-web-color-action-primary);\n}\n';

const fixtures: string[] = [];

function writeFixture(file: string, contents: string) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents, 'utf8');
}

/** Synthetic package root: <tmp>/vue-web, with ../tokens and ../tokens-web siblings. */
function createPackageRoot(): string {
  const parent = mkdtempSync(join(tmpdir(), 'snui-style-barrel-'));
  fixtures.push(parent);
  const root = join(parent, 'vue-web');

  writeFixture(
    join(parent, 'tokens/styles/index.css'),
    ':root {\n  --aui-color-action-primary: #1677ff;\n}\n',
  );
  writeFixture(
    join(parent, 'tokens-web/styles/index.css'),
    ':root {\n  --sn-web-color-action-primary: var(--aui-color-action-primary);\n}\n',
  );
  writeFixture(
    join(root, 'src/styles/index.css'),
    '@import "@snui/tokens/styles/index.css";\n\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation: none;\n  }\n}\n',
  );
  writeFixture(join(root, 'dist/styles/index.css'), COMPONENT_CSS);

  return root;
}

function readBarrel(root: string): string {
  return readFileSync(join(root, 'dist/styles/index.css'), 'utf8');
}

afterEach(() => {
  for (const dir of fixtures.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('buildStyleBarrel', () => {
  it('should prepend the token layers ahead of the component CSS', () => {
    const root = createPackageRoot();

    buildStyleBarrel({ root, katex: false });

    const css = readBarrel(root);
    expect(css).toContain('--aui-color-action-primary: #1677ff;');
    expect(css).toContain('--sn-web-color-action-primary: var(--aui-color-action-primary);');
    expect(css).toContain('.sn-button--primary[data-v-abc]');
    expect(css.indexOf('--sn-web-color-action-primary:')).toBeLessThan(
      css.indexOf('.sn-button--primary'),
    );
  });

  it('should restore the token layers after vite rewrites the barrel', () => {
    const root = createPackageRoot();

    buildStyleBarrel({ root, katex: false });
    // `vite build --watch` re-emits the CSS asset with component CSS only.
    writeFixture(join(root, 'dist/styles/index.css'), COMPONENT_CSS);
    buildStyleBarrel({ root, katex: false });

    const css = readBarrel(root);
    expect(css).toContain('--sn-web-color-action-primary: var(--aui-color-action-primary);');
    expect(css.match(/--sn-web-color-action-primary:/g) ?? []).toHaveLength(1);
  });

  it('should be idempotent on repeated runs', () => {
    const root = createPackageRoot();

    buildStyleBarrel({ root, katex: false });
    const once = readBarrel(root);
    buildStyleBarrel({ root, katex: false });

    expect(readBarrel(root)).toBe(once);
  });

  it('should inline the token layers instead of keeping @import rules', () => {
    const root = createPackageRoot();

    buildStyleBarrel({ root, katex: false });

    const css = readBarrel(root);
    expect(css).not.toMatch(/^\s*@import\b/m);
    expect(css).toContain('prefers-reduced-motion');
  });
});
