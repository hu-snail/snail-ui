/**
 * Style-barrel builder for @snui/vue-web.
 *
 * `@snui/vue-web/styles` (dist/styles/index.css) must be a COMPLETE barrel:
 * the `--aui-*` primitive layer, the `--sn-web-*` alias layer, the component
 * scoped CSS extracted by `vite build`, plus the KaTeX stylesheet. Only the
 * component CSS comes out of vite; everything else is assembled here.
 *
 * This lives in its own module because the barrel has TWO producers:
 *   1. `scripts/copy-styles.mjs` — the CLI step in `package.json` `build`
 *   2. the `snui-style-barrel` plugin in `vite.config.js` — runs on every
 *      `writeBundle`, which is what makes `vite build --watch`
 *      (`pnpm dev:vue-web`) emit a complete barrel too.
 *
 * Why that second producer is mandatory: `vite build` overwrites
 * dist/styles/index.css with component CSS ONLY. Component rules consume
 * `var(--sn-web-*)` without fallbacks (`.sn-button--primary { background-color:
 * var(--sn-web-color-action-primary) }`). With the token layers stripped, every
 * such declaration is invalid at computed-value time, so components collapse to
 * unstyled boxes. apps/docs imports exactly this file
 * (`import '@snui/vue-web/styles'` in .vitepress/theme/index.ts), which is why a
 * watch rebuild used to blank out the whole documentation site.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Package root: packages/vue-web. */
export const PACKAGE_ROOT = resolve(__dirname, '..');

/** Marker guarding the appended KaTeX block (keeps the append idempotent). */
export const KATEX_MARKER = '/* KaTeX (SnEquation) */';

/**
 * Token sources in cascade order (first definition wins):
 *   1. ../tokens/styles/index.css      — `--aui-*` primitive layer
 *   2. ../tokens-web/styles/index.css  — `--sn-web-*` alias layer
 *   3. src/styles/index.css            — web-specific overrides
 */
function tokenSources(root) {
  return [
    resolve(root, '../tokens/styles/index.css'),
    resolve(root, '../tokens-web/styles/index.css'),
    resolve(root, 'src/styles/index.css'),
  ];
}

/**
 * Drop `@import` rules.
 *
 * They are only legal at the top of a stylesheet, and the assembled barrel puts
 * sibling layers before them. Their targets are inlined from `tokenSources()`
 * instead, which is also why the merged file has a single `:root` cascade.
 */
function stripAtImports(css) {
  return css
    .split('\n')
    .filter((line) => !/^\s*@import\b/i.test(line))
    .join('\n');
}

/**
 * Append the KaTeX stylesheet + copy its fonts next to the barrel. SnEquation
 * renders KaTeX markup but `katex` stays an external dependency, so consumers
 * get the CSS from this barrel.
 */
function appendKatex(css, barrelPath, root) {
  if (css.includes(KATEX_MARKER)) return css;

  let katexDir;
  try {
    const require = createRequire(import.meta.url);
    katexDir = dirname(require.resolve('katex/package.json', { paths: [root] }));
  } catch {
    // katex is optional for callers that assemble a barrel outside the real
    // package (the regression test): ship the rest instead of failing.
    return css;
  }

  const katexCssPath = resolve(katexDir, 'dist/katex.min.css');
  if (!existsSync(katexCssPath)) return css;

  const fontsSrc = resolve(katexDir, 'dist/fonts');
  const fontsDest = resolve(dirname(barrelPath), 'fonts');
  if (existsSync(fontsSrc)) {
    mkdirSync(fontsDest, { recursive: true });
    for (const font of readdirSync(fontsSrc)) {
      copyFileSync(resolve(fontsSrc, font), resolve(fontsDest, font));
    }
  }

  return `${css}\n\n${KATEX_MARKER}\n${readFileSync(katexCssPath, 'utf8')}\n`;
}

/**
 * Assemble dist/styles/index.css in place.
 *
 * Idempotent: re-running over an already-complete barrel is a no-op, so the
 * watch hook and the one-shot CLI step can both run without duplicating the
 * token layers.
 *
 * @param {{ root?: string, katex?: boolean }} [options]
 * @returns {{ path: string, hasTokens: boolean, hadComponents: boolean, hasKatex: boolean }}
 */
export function buildStyleBarrel({ root = PACKAGE_ROOT, katex = true } = {}) {
  const barrelPath = resolve(root, 'dist/styles/index.css');
  mkdirSync(dirname(barrelPath), { recursive: true });

  let tokensBundle = '';
  for (const source of tokenSources(root)) {
    if (!existsSync(source)) continue;
    tokensBundle += `${stripAtImports(readFileSync(source, 'utf8'))}\n`;
  }

  const body = existsSync(barrelPath) ? stripAtImports(readFileSync(barrelPath, 'utf8')) : '';

  // The barrel vite just wrote starts with component CSS, so `body` will not
  // carry the token signature and the layers get prepended. If a previous run
  // already produced a complete barrel (vite skips rewriting an unchanged CSS
  // asset), the signature matches and we leave it alone.
  const signature = tokensBundle.trim().slice(0, 80);
  const hasTokens = tokensBundle.length > 0;
  const assembled =
    hasTokens && !body.startsWith(signature) ? `${tokensBundle}\n${body}` : body;

  const rendered = assembled.trim().length > 0 ? assembled : '/* No styles yet */\n';
  const output = katex ? appendKatex(rendered, barrelPath, root) : rendered;
  writeFileSync(barrelPath, output, 'utf8');

  return {
    path: barrelPath,
    hasTokens,
    hadComponents: rendered !== '/* No styles yet */\n',
    hasKatex: output.includes(KATEX_MARKER),
  };
}
