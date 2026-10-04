#!/usr/bin/env node
// Concatenate token CSS + vite-extracted component scoped CSS into one
// barrel at dist/styles/index.css.
//
// Token sources (resolved in priority order, first found wins):
//   1. packages/uni/src/styles/index.css           (uni-specific overrides)
//   2. ../tokens-mp/styles/index.css               (--sn-mp-* alias layer)
//   3. ../tokens/styles/index.css                  (--aui-* primitive layer)
//
// Mirrors packages/vue-web/scripts/copy-styles.mjs.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const sources = [
  resolve(root, '../tokens/styles/index.css'),
  resolve(root, '../tokens-mp/styles/index.css'),
  resolve(root, 'src/styles/index.css'),
]

const componentCss = resolve(root, 'dist/styles/index.css')
const dst = componentCss

mkdirSync(dirname(dst), { recursive: true })

let tokensBundle = ''
for (const src of sources) {
  if (existsSync(src)) {
    tokensBundle += readFileSync(src, 'utf8') + '\n'
  }
}

let body = ''
if (existsSync(componentCss)) {
  body = readFileSync(componentCss, 'utf8')
}

// Only prepend tokens if they aren't already at the top of dst (idempotency
// on repeated builds).
const tokensSignature = tokensBundle.trim().slice(0, 80)
if (tokensBundle && !body.startsWith(tokensSignature)) {
  writeFileSync(dst, `${tokensBundle}\n${body}`, 'utf8')
  console.log('✓ copy-styles:', dst, '(tokens + components)')
} else if (!existsSync(dst)) {
  writeFileSync(dst, '/* No styles yet */\n', 'utf8')
  console.log('✓ copy-styles:', dst, '(empty placeholder)')
} else {
  console.log('✓ copy-styles:', dst, '(already up to date)')
}