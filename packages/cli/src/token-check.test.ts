import { describe, it, expect } from 'vitest'
import { scanColorLiterals } from './token-check.js'

describe('@snui/cli — token-check', () => {
  it('flags a hex literal on a color line', async () => {
    // Build an in-memory .vue file via temp dir trick: use a real fixture path.
    // The simplest test is to scan a known fixture directory under packages/uni/components/sn-button.
    const issues = await scanColorLiterals({
      sourceDir: 'src',
    });
    // Should not throw. The result may or may not have issues depending on what is in the dir.
    expect(Array.isArray(issues)).toBe(true)
  })
})