#!/usr/bin/env node
// Copy src/styles/index.css to dist/styles/index.css after tsc build.
// Without this, the `"./styles"` package.json export points at a missing file.
import { mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const src = resolve(root, 'src/styles/index.css')
const dst = resolve(root, 'dist/styles/index.css')

if (!existsSync(src)) {
  // Stylesheet not authored yet (component library M0). Skip silently.
  console.log('• copy-styles: no src/styles/index.css; skipping')
  process.exit(0)
}

mkdirSync(dirname(dst), { recursive: true })
copyFileSync(src, dst)
console.log('✓ copy-styles:', dst)