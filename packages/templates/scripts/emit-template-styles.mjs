/**
 * Vite plugin: emit per-template CSS, and make each template carry its own.
 *
 * Why this exists. Vite's library mode defaults `cssCodeSplit` to `false`, so
 * every template's rules together with one copied share of the token cascade
 * used to land in a single `dist/styles/index.css` — 75 kB, of which ~43 kB was
 * templates a given consumer never mounts. Setting `cssCodeSplit: true` splits
 * the CSS per chunk, but Vite then emits one file per *component*
 * (`SnAiPrompt.css`, `sn-ai-message.css`, …) and, in library mode, nothing in
 * the JS points at them: the files exist but no importer references them, so a
 * consumer has to know which subset to pull in by hand.
 *
 * What this plugin does instead, in `generateBundle`:
 *   1. walks each entry's chunk graph depth-first (dependencies first, so the
 *      cascade order is preserved) and concatenates the CSS of that closure
 *      into one file per template — `styles/web-chat.css`, `styles/uni-chat.css`
 *   2. emits the shared token cascade once as `styles/tokens.css`
 *   3. appends `import '…/tokens.css'` + `import '…/<template>.css'` to the
 *      entry chunk, so `import { SnAiChat } from '@snui/templates/web/chat'`
 *      brings exactly that template's styles and nothing else
 *   4. deletes the per-component CSS assets the aggregation consumed
 *
 * The imports are appended rather than prepended on purpose: an `import`
 * declaration is hoisted, so appending keeps the original line numbers intact
 * and the sourcemap Vite already generated stays accurate.
 *
 * The token layer stays a separate file instead of being inlined into each
 * template: a consumer that mounts two templates then loads it once, because
 * both entry chunks import the same module.
 */
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

/**
 * Token layers concatenated into `dist/styles/tokens.css`, in cascade order:
 * the primitive `--aui-*` layer, then the web `--sn-web-*` and uni `--sn-mp-*`
 * alias layers. Template CSS is authored against those aliases, so a consumer
 * that imports a template without the token layer would get rules whose
 * colour / spacing references resolve to nothing.
 */
const TOKEN_SOURCES = [
  resolve(root, '../tokens/styles/index.css'),
  resolve(root, '../tokens-web/styles/index.css'),
  resolve(root, '../tokens-mp/styles/index.css'),
];

const TOKENS_FILE = 'styles/tokens.css';

/** `@import` cannot survive being placed after sibling rules. */
function stripAtImports(css) {
  return css
    .split('\n')
    .filter((line) => !/^\s*@import\b/i.test(line))
    .join('\n');
}

function readTokens() {
  return TOKEN_SOURCES.filter((file) => existsSync(file))
    .map((file) => stripAtImports(readFileSync(file, 'utf8')))
    .join('\n');
}

/** CSS Vite attributed to one chunk; the container differs across versions. */
function cssOf(chunk) {
  const meta = chunk.viteMetadata;
  if (!meta) return new Set();
  const set = typeof meta.get === 'function' ? meta.get('importedCss') : meta.importedCss;
  return set ?? new Set();
}

/** Depth-first over a chunk's static imports, collecting CSS dependencies first. */
function collectCss(bundle, chunk, seen, out) {
  if (seen.has(chunk.fileName)) return out;
  seen.add(chunk.fileName);
  for (const name of chunk.imports) {
    const dep = bundle[name];
    if (dep && dep.type === 'chunk') collectCss(bundle, dep, seen, out);
  }
  for (const file of cssOf(chunk)) if (!out.includes(file)) out.push(file);
  return out;
}

/** Module specifier for a file inside the bundle, relative to its importer. */
function specifier(fromFile, target) {
  const rel = relative(dirname(fromFile), target).split('\\').join('/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

/** `web/chat.js` → `web-chat.css`. */
function styleFileName(entryFileName) {
  return `styles/${entryFileName.replace(/\.js$/, '').replace(/\//g, '-')}.css`;
}

export function templateStyles() {
  let outDir = 'dist';

  return {
    name: 'snui-templates-styles',
    apply: 'build',

    configResolved(config) {
      outDir = config.build.outDir;
    },

    buildStart() {
      // `emptyOutDir: false` keeps vite-tsc output around, so stale CSS from an
      // earlier build would otherwise survive and be shipped.
      rmSync(resolve(root, outDir, 'styles'), { recursive: true, force: true });
    },

    generateBundle(_options, bundle) {
      const tokens = readTokens();
      if (tokens) this.emitFile({ type: 'asset', fileName: TOKENS_FILE, source: tokens });

      // Anything an entry did not lay claim to is an aggregation input; it is
      // dropped, so the shipped CSS is the token layer plus one file per
      // template and nothing else.
      const kept = new Set([TOKENS_FILE]);

      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue;

        const cssFiles = collectCss(bundle, chunk, new Set(), []);
        if (!cssFiles.length) continue;

        const fileName = styleFileName(chunk.fileName);
        kept.add(fileName);
        this.emitFile({
          type: 'asset',
          fileName,
          source: cssFiles.map((file) => bundle[file].source).join('\n'),
        });

        const injected = [TOKENS_FILE, fileName]
          .map((target) => `import ${JSON.stringify(specifier(chunk.fileName, target))};`)
          .join('\n');
        chunk.code = `${chunk.code}\n${injected}\n`;
      }

      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type === 'asset' && fileName.endsWith('.css') && !kept.has(fileName)) {
          delete bundle[fileName];
        }
      }
    },
  };
}
