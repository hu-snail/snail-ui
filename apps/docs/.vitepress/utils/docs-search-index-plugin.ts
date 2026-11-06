/**
 * Vite virtual module: `virtual:sn-docs-search-index` → the build-time
 * docs corpus (see docs-search-source.ts) as an ES module.
 *
 * ## Why a virtual module
 *
 * The indexer is Node-only (fs). Client code must not import it directly —
 * in dev a raw fs import would break in the browser, and a JSON file would
 * be cached stale. The virtual module resolves server-side at request time,
 * and in dev we invalidate it whenever a markdown file changes so HMR
 * picks up content edits without a restart.
 *
 * In production builds the module is evaluated once, so the payload ships
 * inside the client bundle (gzip-friendly: prose is plain text).
 */

import { watch } from 'node:fs';
import type { Plugin } from 'vite';
import { buildDocsSearchIndex } from './docs-search-source';

export const DOCS_SEARCH_VIRTUAL = 'virtual:sn-docs-search-index';
const RESOLVED = '\0' + DOCS_SEARCH_VIRTUAL;

/**
 * Create the vite plugin.
 *
 * `fallbackRoot` is the VitePress srcDir as the config module sees it
 * (`fileURLToPath(new URL('.', import.meta.url))`). It is only a fallback:
 * VitePress bundles the config before running it, so in the dev server
 * `import.meta.url` resolves to that bundle rather than to `apps/docs` — a
 * root that contains no markdown, which silently produced an EMPTY index.
 * The reliable source of truth is the vite `root` (VitePress sets it to the
 * srcDir), captured in `configResolved`; if both miss, `load` warns instead
 * of shipping `[]` to the client.
 */
export function docsSearchIndexPlugin(fallbackRoot: string): Plugin {
  let cached: string | null = null;
  let watcher: ReturnType<typeof watch> | undefined;
  let debounce: ReturnType<typeof setTimeout> | undefined;
  let root = fallbackRoot;

  /** Build (once per corpus revision) and serialize the corpus. */
  function collect(): string {
    if (cached !== null) return cached;
    let docs = buildDocsSearchIndex(root);
    if (docs.length === 0 && root !== fallbackRoot) {
      docs = buildDocsSearchIndex(fallbackRoot);
    }
    cached = JSON.stringify(docs);
    return cached;
  }

  return {
    name: 'sn-docs-search-index',
    configResolved(config) {
      // VitePress runs vite with root = srcDir = the markdown corpus root.
      if (config.root) {
        root = config.root;
        cached = null;
      }
    },
    resolveId(id) {
      if (id === DOCS_SEARCH_VIRTUAL) return RESOLVED;
      return null;
    },
    load(id) {
      if (id !== RESOLVED) return null;
      const payload = collect();
      if (payload === '[]') {
        this.warn(
          `[sn-docs-search-index] 在 "${root}" 下没有找到任何 markdown，检索索引为空（检查 vite root）`,
        );
      }
      // Default export = DocsSearchDoc[] (shape guaranteed by the indexer).
      return `export default ${payload};`;
    },
    configureServer(server) {
      // Dev: rebuild lazily on the next request after any md change.
      watcher = watch(root, { recursive: true }, (_event, filename) => {
        if (!filename || !filename.endsWith('.md')) return;
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(() => {
          cached = null;
          const mod = server.moduleGraph.getModuleById(RESOLVED);
          if (mod) server.moduleGraph.invalidateModule(mod);
          // Full reload keeps panel state simple; md edits are rare.
          server.ws.send({ type: 'full-reload' });
        }, 400);
      });
      watcher.unref?.();
    },
    buildEnd() {
      watcher?.close();
    },
  };
}
