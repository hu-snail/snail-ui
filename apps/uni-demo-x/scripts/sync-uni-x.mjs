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
import { cpSync, existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkgDir = join(appRoot, 'node_modules', '@snui', 'uni-x');
const srcRoot = resolve(appRoot, '..', '..', 'packages', 'uni-x');

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

// Copy into a sibling staging directory, then swap it in with ONE rename.
// The rm-then-copy that used to live here left the tree partial for the
// length of the copy, and an HBuilderX compile reading mid-copy failed with
// ENOENT on files it had already seen (e.g. sn-picker-view-drag.ts, seen
// 2026-11-27). A same-volume rename is atomic: a compile resolves either the
// old tree or the complete new one, never a half-copied one.
const stagingDir = `${pkgDir}.syncing`;
rmSync(stagingDir, { force: true, recursive: true });
for (const dir of fileDirs) cpSync(join(srcRoot, dir), join(stagingDir, dir), { recursive: true });
for (const file of fileRootFiles) cpSync(join(srcRoot, file), join(stagingDir, file));

// `uni-x build` wipes dist before rewriting it. A copy taken mid-build leaves a
// partial tree behind — fail loudly instead of swapping it in, and leave the
// previous (complete) copy in place.
const countComponents = (root) =>
  readdirSync(join(root, 'dist', 'components')).filter((name) => !name.startsWith('._')).length;
const expected = countComponents(srcRoot);
const copied = countComponents(stagingDir);
if (copied !== expected) {
  console.error(
    `[sync-uni-x] incomplete copy: ${copied}/${expected} components. ` +
      'The uni-x build was probably still running — rerun this script after it finishes.',
  );
  rmSync(stagingDir, { force: true, recursive: true });
  process.exit(1);
}

try {
  rmSync(pkgDir, { force: true, recursive: true });
  renameSync(stagingDir, pkgDir);
} catch {
  // The rename window is one syscall, but a compile can still hold the old
  // directory open; fall back to swapping in place rather than failing.
  cpSync(stagingDir, pkgDir, { recursive: true });
  rmSync(stagingDir, { force: true, recursive: true });
}

console.log(
  `[sync-uni-x] materialized real-dir copy at apps/uni-demo-x/node_modules/@snui/uni-x (${copied} components)`,
);
