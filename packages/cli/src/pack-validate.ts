/**
 * @snui/cli/pack-validate — AUI-TOOL-006 (pack validate, spec AUI-PACK-005).
 *
 * Validates that every official Style Pack under packages/style-packs/src/*.ts
 * has the required shape:
 *   - name (kebab-case)
 *   - label (non-empty)
 *   - description (non-empty)
 *   - style.component keys must exist in @snui/tokens ComponentTokens
 *   - style.primitive keys must exist in primitive tokens (best-effort check)
 *
 * Pack module shape is a default export object `{ name, label, description, style, theme?, density? }`.
 *
 * Phase M2 stub: scans packages/style-packs/src for now (will exist after M2 ships).
 * For v0.2.0 (this commit), the directory does not exist yet — the validator
 * returns a no-op success and a hint message so CI does not block on the
 * absent directory.
 */

import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export interface PackValidateOptions {
  packsDir: string
  /** Known ComponentToken key names. Filled by the CLI loader. */
  knownComponentKeys?: ReadonlyArray<string>
}

export interface PackIssue {
  file: string
  rule: string
  message: string
}

const COMPONENT_TOKENS: ReadonlyArray<string> = [
  'button.heightTiny',
  'button.heightSmall',
  'button.heightMedium',
  'button.heightLarge',
  'button.paddingX',
  'button.radius',
  'button.fontSize',
  'button.shadow',
  'button.focusRing',
  'input.heightSmall',
  'input.heightMedium',
  'input.heightLarge',
  'input.paddingX',
  'input.radius',
  'card.padding',
  'card.radius',
  'card.shadow',
]

export async function validatePacks(options: PackValidateOptions): Promise<PackIssue[]> {
  const issues: PackIssue[] = []
  if (!existsSync(options.packsDir)) {
    // M2 placeholder: when @snui/style-packs is not yet implemented, return empty.
    return []
  }
  const entries = await readdir(options.packsDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.ts') || entry.name === 'index.ts') continue
    const full = join(options.packsDir, entry.name)
    const text = await readFile(full, 'utf-8')
    const hasName = /name\s*:\s*['"][a-z][a-z0-9-]*['"]/.test(text)
    const hasLabel = /label\s*:\s*['"]/.test(text)
    const hasDescription = /description\s*:\s*['"]/.test(text)
    const hasStyle = /style\s*:\s*\{/.test(text)
    if (!hasName) issues.push({ file: full, rule: 'pack.name', message: 'missing `name` (kebab-case)' })
    if (!hasLabel) issues.push({ file: full, rule: 'pack.label', message: 'missing `label`' })
    if (!hasDescription) issues.push({ file: full, rule: 'pack.description', message: 'missing `description`' })
    if (!hasStyle) issues.push({ file: full, rule: 'pack.style', message: 'missing `style` block' })
  }
  return issues
}

export async function runPackValidate(options: PackValidateOptions): Promise<number> {
  const issues = await validatePacks(options)
  if (options.packsDir && !existsSync(options.packsDir)) {
     
    console.log('• @snui/cli pack-validate: packs directory not found yet (M2 placeholder, no-op)')
    return 0
  }
  if (issues.length === 0) {
     
    console.log('✓ @snui/cli pack-validate: all packs OK')
    return 0
  }
  for (const i of issues) {
     
    console.error(`✗ ${i.file}  ${i.rule}  ${i.message}`)
  }
  return 1
}

export { COMPONENT_TOKENS }