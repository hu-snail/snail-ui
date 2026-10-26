/**
 * @snui/cli — token-check tests.
 *
 * Covers two scan classes:
 *   1. Color literal scan (--sn-*-* Token discipline).
 *   2. Wrong-end alias scan (AUI-FOUND-009 — v3.1 end-independent enforcement).
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

import {
  scanColorLiterals,
  scanWrongEndAliases,
  scanFile,
} from './token-check.js'

let tmpDir = ''

beforeAll(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'snui-token-check-'))
})

afterAll(() => {
  if (tmpDir) rmSync(tmpDir, { recursive: true, force: true })
})

function writeVue(name: string, content: string): string {
  const path = join(tmpDir, name)
  writeFileSync(path, content)
  return path
}

describe('@snui/cli — token-check color literals', () => {
  it('passes a clean Web component that uses only --sn-web-* aliases', async () => {
    const path = writeVue('CleanWeb.vue', `
<style scoped>
.btn {
  background-color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-border-default);
  color: var(--sn-web-color-text-on-primary);
}
</style>
`)
    const issues = await scanColorLiterals({ sourceDir: tmpDir })
    // Only this file in tmpDir; should be clean
    const fileIssues = issues.filter((i) => i.file === path)
    expect(fileIssues).toHaveLength(0)
  })

  it('flags a hex color literal on a CSS color line', async () => {
    const path = writeVue('HexLiteral.vue', `
<style scoped>
.bad {
  background-color: #1677ff;
}
</style>
`)
    const issues = await scanFile(path)
    const hexIssues = issues.filter((i) => i.rule === 'hex-literal')
    expect(hexIssues.length).toBeGreaterThan(0)
    expect(hexIssues[0]?.message).toContain('hex color literal')
  })

  it('flags rgb()/rgba() literals', async () => {
    const path = writeVue('RgbLiteral.vue', `
<style scoped>
.bad {
  color: rgba(0, 0, 0, 0.5);
}
</style>
`)
    const issues = await scanFile(path)
    const rgbIssues = issues.filter((i) => i.rule === 'rgb-literal')
    expect(rgbIssues.length).toBeGreaterThan(0)
  })
})

describe('@snui/cli — token-check wrong-end aliases (AUI-FOUND-009)', () => {
  it('passes Web component that uses only --sn-web-* aliases', async () => {
    const path = writeVue('WebClean.vue', `
<style scoped>
.btn {
  background-color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-border-default);
}
</style>
`)
    const issues = await scanWrongEndAliases({ sourceDir: tmpDir }, 'web')
    const fileIssues = issues.filter((i) => i.file === path)
    expect(fileIssues).toHaveLength(0)
  })

  it('flags Web component that references --sn-mp-* aliases', async () => {
    const path = writeVue('WebWithMp.vue', `
<style scoped>
.bad {
  background-color: var(--sn-mp-color-action-primary);
}
</style>
`)
    const issues = await scanWrongEndAliases({ sourceDir: tmpDir }, 'web')
    const wrongEndIssues = issues.filter((i) => i.file === path && i.rule === 'wrong-end-alias')
    expect(wrongEndIssues.length).toBeGreaterThan(0)
    expect(wrongEndIssues[0]?.message).toContain('--sn-mp-')
    expect(wrongEndIssues[0]?.message).toContain('web')
  })

  it('flags Web component that references --aui-* directly', async () => {
    const path = writeVue('WebWithAui.vue', `
<style scoped>
.bad {
  color: var(--aui-color-text-primary);
}
</style>
`)
    const issues = await scanWrongEndAliases({ sourceDir: tmpDir }, 'web')
    const wrongEndIssues = issues.filter((i) => i.file === path && i.rule === 'wrong-end-alias')
    expect(wrongEndIssues.length).toBeGreaterThan(0)
    expect(wrongEndIssues[0]?.message).toContain('--aui-')
  })

  it('passes MP component that uses only --sn-mp-* aliases', async () => {
    const path = writeVue('MpClean.vue', `
<style scoped>
.btn {
  background-color: var(--sn-mp-color-action-primary);
}
</style>
`)
    const issues = await scanWrongEndAliases({ sourceDir: tmpDir }, 'mp')
    const fileIssues = issues.filter((i) => i.file === path)
    expect(fileIssues).toHaveLength(0)
  })

  it('flags MP component that references --sn-web-* aliases', async () => {
    const path = writeVue('MpWithWeb.vue', `
<style scoped>
.bad {
  background-color: var(--sn-web-color-action-primary);
}
</style>
`)
    const issues = await scanWrongEndAliases({ sourceDir: tmpDir }, 'mp')
    const wrongEndIssues = issues.filter((i) => i.file === path && i.rule === 'wrong-end-alias')
    expect(wrongEndIssues.length).toBeGreaterThan(0)
    expect(wrongEndIssues[0]?.message).toContain('--sn-web-')
    expect(wrongEndIssues[0]?.message).toContain('mp')
  })
})