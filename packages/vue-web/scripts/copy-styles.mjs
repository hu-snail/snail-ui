#!/usr/bin/env node
// Concatenate token CSS + vite-extracted component scoped CSS into one
// barrel at dist/styles/index.css.
//
// Token sources (resolved in priority order, first found wins):
//   1. ../tokens/styles/index.css          (--aui-* primitive layer)
//   2. ../tokens-web/styles/index.css      (--sn-web-* alias layer)
//   3. src/styles/index.css                (web-specific overrides;
//
//                                           STRIP @import rules — they
//                                           don't survive being placed
//                                           after sibling tokens, and
//                                           they break vite's CSS parser
//                                           which only allows @import
//                                           at the top of the file)
//
// vite emits the component CSS first (assetFileNames:
// 'styles/index.css' in vite.config.js). This script runs after
// `vite build` and PREPENDS the global tokens to the same file so
// consumers get one barrel: `@snui/vue-web/styles` = tokens + components.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const sources = [
  resolve(root, '../tokens/styles/index.css'),
  resolve(root, '../tokens-web/styles/index.css'),
  resolve(root, 'src/styles/index.css'),
]

const componentCss = resolve(root, 'dist/styles/index.css')
const dst = componentCss

mkdirSync(dirname(dst), { recursive: true })

function stripAtImports(css) {
  // Drop @import rules + the line that contains them. They don't survive
  // being placed after non-@import content per CSS spec, and vite's CSS
  // parser refuses to process them at non-leading positions.
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

let body = ''
if (existsSync(componentCss)) {
  body = stripAtImports(readFileSync(componentCss, 'utf8'))
}

// Idempotent on repeated builds: only prepend tokens if not already there.
const tokensSignature = tokensBundle.trim().slice(0, 80)
let output = ''
if (tokensBundle && !body.startsWith(tokensSignature)) {
  output = `${tokensBundle}\n${body}`
} else if (body) {
  output = body
} else {
  output = '/* No styles yet */\n'
}

// Append KaTeX CSS + fonts (used by SnEquation). katex.min.css references
// fonts with relative `url(fonts/...)` paths, so the font files are copied
// next to the barrel at dist/styles/fonts/ and the CSS is appended verbatim.
// Idempotent: guarded by a marker comment.
function appendKatex(css) {
  const marker = '/* KaTeX (SnEquation) */'
  if (css.includes(marker)) {
    return css
  }
  const req = createRequire(import.meta.url)
  let katexDir
  try {
    katexDir = dirname(req.resolve('katex/package.json', { paths: [root] }))
  } catch {
    return css // katex not installed — SnEquation falls back to 'no katex provided'
  }
  const katexCssPath = resolve(katexDir, 'dist/katex.min.css')
  if (!existsSync(katexCssPath)) {
    return css
  }
  const fontsSrc = resolve(katexDir, 'dist/fonts')
  if (existsSync(fontsSrc)) {
    const fontsDst = resolve(dirname(dst), 'fonts')
    mkdirSync(fontsDst, { recursive: true })
    for (const fontFile of readdirSync(fontsSrc)) {
      copyFileSync(resolve(fontsSrc, fontFile), resolve(fontsDst, fontFile))
    }
  }
  return `${css}\n${marker}\n${readFileSync(katexCssPath, 'utf8')}\n`
}

const hadBody = output !== '/* No styles yet */\n'
const withKatex = appendKatex(output)
writeFileSync(dst, withKatex, 'utf8')
if (withKatex.includes('/* KaTeX (SnEquation) */')) {
  console.log('✓ copy-styles:', dst, hadBody ? '(tokens + components + katex)' : '(katex only)')
} else {
  console.log('✓ copy-styles:', dst, hadBody ? '(tokens + components)' : '(empty placeholder)')
}