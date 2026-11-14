/**
 * Materialize @snui/uni-x as a real directory inside this app's node_modules.
 *
 * pnpm links workspace packages as symlinks, and HBuilderX's vite-based web
 * compile resolves symlinked packages through their real paths — package
 * `exports` subpaths (`@snui/uni-x/components/...`) and intra-package relative
 * imports (`../../utils/outside-close`) both fail vite:import-analysis on
 * every demo page. Copying the published surface (package.json "files": dist +
 * package.json + README.md) into a real directory removes the symlink from
 * the equation. Rerun after every `pnpm -F @snui/uni-x build`.
 *
 * Run: pnpm -F @snui/uni-demo-x sync-uni-x
 */
import { cpSync, existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkgDir = join(appRoot, 'node_modules', '@snui', 'uni-x');
const srcRoot = resolve(appRoot, '..', '..', 'packages', 'uni-x');

const srcPkg = JSON.parse(readFileSync(join(srcRoot, 'package.json'), 'utf8'));
/** package.json "files" — the npm publish surface, mirrored 1:1 here. */
const fileDirs = ['dist'];
const fileRootFiles = ['package.json', 'README.md'];

const missing = [
  ...fileDirs.map((d) => join(srcRoot, d)),
  ...fileRootFiles.map((f) => join(srcRoot, f)),
].filter((p) => !existsSync(p));
if (missing.length > 0) {
  console.error(`[sync-uni-x] missing source artifacts (run pnpm -F @snui/uni-x build first): ${missing.join(', ')}`);
  process.exit(1);
}

rmSync(pkgDir, { force: true, recursive: true });
for (const dir of fileDirs) cpSync(join(srcRoot, dir), join(pkgDir, dir), { recursive: true });
for (const file of fileRootFiles) cpSync(join(srcRoot, file), join(pkgDir, file));

// `uni-x build` wipes dist before rewriting it. A copy taken mid-build leaves a
// partial tree behind and HBuilderX then fails with "Could not resolve
// '@snui/uni-x/components/...'" on every page — fail loudly instead of
// reporting a successful sync of an incomplete copy.
const countComponents = (root) =>
  readdirSync(join(root, 'dist', 'components')).filter((name) => !name.startsWith('._')).length;
const expected = countComponents(srcRoot);
const copied = countComponents(pkgDir);
if (copied !== expected) {
  console.error(
    `[sync-uni-x] incomplete copy: ${copied}/${expected} components. ` +
      'The uni-x build was probably still running — rerun this script after it finishes.',
  );
  process.exit(1);
}

console.log(
  `[sync-uni-x] materialized real-dir copy at apps/uni-demo-x/node_modules/@snui/uni-x (${copied} components)`,
);
