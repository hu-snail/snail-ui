#!/usr/bin/env node
// CLI step for `pnpm --filter @snui/vue-web build`.
//
// The assembly itself lives in scripts/build-style-barrel.mjs so that the watch
// build (vite.config.js `snui-style-barrel` plugin) can produce the exact same
// barrel — see that file for the token sources and the root cause it guards.
import { buildStyleBarrel } from './build-style-barrel.mjs';

const { path, hasTokens, hadComponents, hasKatex } = buildStyleBarrel();

const parts = [];
if (hasTokens) parts.push('tokens');
if (hadComponents) parts.push('components');
if (hasKatex) parts.push('katex');
console.log(
  `✓ copy-styles: ${path} (${parts.length > 0 ? parts.join(' + ') : 'empty placeholder'})`,
);
