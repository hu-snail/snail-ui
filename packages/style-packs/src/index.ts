/**
 * @snui/style-packs — public entry.
 *
 * Per AUI-PRD-v3.0 §3 + ADR-0002 + Spec-01 §2.2:
 *   - Named exports for each official pack
 *   - Default export is an `allPacks` registry for docs site consumption
 */

export { defaultPack } from './default.js'
export { iosPack } from './ios.js'
export { darkPack } from './dark.js'
export type { StylePackDefinition } from './types.js'

import { defaultPack } from './default.js'
import { iosPack } from './ios.js'
import { darkPack } from './dark.js'

import type { StylePackDefinition } from './types.js'

/** All official packs, in display order for the docs site. */
export const allPacks: ReadonlyArray<StylePackDefinition> = [defaultPack, iosPack, darkPack]

/** Lookup by name. Returns undefined for unknown packs. */
export function getPack(name: string): StylePackDefinition | undefined {
  return allPacks.find((p) => p.name === name)
}