#!/usr/bin/env node
/**
 * Builds every published entry of @snui/admin-layout.
 *
 * The vite CLI accepts exactly one config object per invocation, and every
 * entry needs its OWN build (see the note in ../vite.config.js: one build per
 * entry is what makes each layout's stylesheet self-contained). This script
 * therefore calls vite's programmatic `build()` once per entry, in order, with
 * only the first one emptying dist.
 *
 * Usage:
 *   node scripts/build-entries.mjs            # build all entries
 *   node scripts/build-entries.mjs --watch    # watch-build all entries
 *
 * `--watch` keeps a Rollup watcher per entry (each rebuilds on source change);
 * the process stays alive until Ctrl-C.
 *
 * `configFile: false` is deliberate and load-bearing: the configs below are
 * already resolved in-process, so letting vite ALSO auto-load vite.config.js
 * would register `@vitejs/plugin-vue` twice — the second instance then tries to
 * parse the first instance's compiled JS output as an SFC and fails with
 * "At least one <template> or <script> is required in a single file component".
 */

import { fileURLToPath, URL } from 'node:url';
import { build } from 'vite';
import { layoutEntryConfigs } from '../vite.config.js';

/** Package root — keeps vite's `root` stable whatever the caller's CWD is. */
const root = fileURLToPath(new URL('..', import.meta.url));
const watch = process.argv.includes('--watch');

/** `build()` resolves with a Rollup watcher in watch mode; watchers must stay
 * referenced so they keep running. */
const watchers = [];

for (const config of layoutEntryConfigs) {
  const effective = {
    ...config,
    root,
    configFile: false,
    ...(watch ? { build: { ...config.build, watch: {} } } : {}),
  };
  const result = await build(effective);
  if (watch) watchers.push(result);
}

if (watch) {
  // eslint-disable-next-line no-console
  console.log(`[admin-layout] watching ${watchers.length} entries`);
}
