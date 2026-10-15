/**
 * SnUI Web install tests — `app.use(SnUI)` global registration.
 *
 * Per AGENTS.md §32 the plugin only wires components onto the app; the thing
 * worth pinning is that it registers exactly the components the package
 * exports. A component missing here works when imported by name but is an
 * unknown custom element for consumers relying on global registration.
 */

import { describe, expect, it, vi } from 'vitest'
import { SnUI } from './install'
import type { SnUIOptions } from './install'
import * as indexExports from './index'

/** `SnUI` is the plugin itself, not a component; the others are non-components. */
const NON_COMPONENT_EXPORTS = new Set(['SnUI'])

function exportedComponents(): string[] {
  return Object.keys(indexExports)
    .filter(
      (name) =>
        /^Sn[A-Z]/.test(name) &&
        !NON_COMPONENT_EXPORTS.has(name) &&
        indexExports[name as keyof typeof indexExports],
    )
    .sort()
}

function createFakeApp(): { component: ReturnType<typeof vi.fn>; registered: Map<string, unknown> } {
  const registered = new Map<string, unknown>()
  return {
    registered,
    component: vi.fn((name: string, value: unknown) => {
      registered.set(name, value)
    }),
  }
}

describe('SnUI install', () => {
  describe('install', () => {
    it('should register every exported component', () => {
      const app = createFakeApp()

      SnUI.install(app as never)

      expect([...app.registered.keys()].sort()).toEqual(exportedComponents())
    })

    it('should register each component under its own name', () => {
      const app = createFakeApp()

      SnUI.install(app as never)

      expect(app.registered.get('SnButton')).toBe(indexExports.SnButton)
      expect(app.registered.get('SnAlert')).toBe(indexExports.SnAlert)
      expect(app.registered.get('SnAffix')).toBe(indexExports.SnAffix)
      expect(app.registered.get('SnBackTop')).toBe(indexExports.SnBackTop)
    })

    it('should skip excluded components', () => {
      const app = createFakeApp()

      SnUI.install(app as never, { exclude: ['SnButton', 'SnAlert'] } satisfies SnUIOptions)

      expect(app.registered.has('SnButton')).toBe(false)
      expect(app.registered.has('SnAlert')).toBe(false)
      expect(app.registered.has('SnDivider')).toBe(true)
    })

    it('should register everything when no options are given', () => {
      const app = createFakeApp()

      SnUI.install(app as never, undefined)

      expect(app.registered.size).toBe(exportedComponents().length)
    })
  })
})
