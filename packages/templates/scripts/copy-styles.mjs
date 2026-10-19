#!/usr/bin/env node
// Concatenate token CSS + vite-extracted template CSS into one barrel at
// dist/styles/index.css.
//
// Template CSS is authored against `var(--sn-web-*)` (web) and `var(--sn-mp-*)`
// (uni). Those aliases resolve to the shared `--aui-*` cascade, so the barrel
// must ship the whole chain — otherwise a consumer who imports
// `@snui/templates/styles` alone gets template rules whose colour / spacing
// references resolve to nothing.
//
// Token sources (resolved in priority order, all appended when present):
//   1. ../tokens/styles/index.css        (--aui-* base layer)
//   2. ../tokens-web/styles/index.css    (--sn-web-* alias layer)
//   3. ../tokens-mp/styles/index.css     (--sn-mp-* alias layer, rpx)
//
// vite emits the template CSS first (assetFileNames: 'styles/index.css' in
// vite.config.js). This script runs after `vite build` and PREPENDS the tokens
// to the same file. @import rules are stripped: they cannot survive being
// placed after sibling tokens, and vite's CSS parser only accepts @import at
// the top of a file.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const sources = [
  resolve(root, '../tokens/styles/index.css'),
  resolve(root, '../tokens-web/styles/index.css'),
  resolve(root, '../tokens-mp/styles/index.css'),
]

const dst = resolve(root, 'dist/styles/index.css')
mkdirSync(dirname(dst), { recursive: true })

function stripAtImports(css) {
  return css
    .split('\n')
    .filter((line) => !/^\s*@import\b/i.test(line))
    .join('\n')
}

let tokensBundle = ''
for (const src of sources) {
  if (existsSync(src)) {
    tokensBundle += stripAtImports(readFileSync(src, 'utf8')) + '\n'
  }
}

const body = existsSync(dst) ? stripAtImports(readFileSync(dst, 'utf8')) : ''

// Idempotent on repeated builds: only prepend tokens if not already there.
const signature = tokensBundle.trim().slice(0, 80)
let output = ''
if (tokensBundle && !body.startsWith(signature)) {
  output = `${tokensBundle}\n${body}`
} else if (body) {
  output = body
} else {
  output = '/* No styles yet */\n'
}

writeFileSync(dst, output, 'utf8')
console.log('✓ copy-styles:', dst, body ? '(tokens + templates)' : '(tokens only)')
