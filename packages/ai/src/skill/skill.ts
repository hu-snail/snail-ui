/**
 * @snui/ai/skill — exports the Skill file content as a string.
 *
 * AI Skill is a structured Markdown contract (see skill.md). This module
 * exposes it to TypeScript consumers (CLI / docs site / MCP server) without
 * requiring filesystem access at runtime.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Path to the bundled Skill markdown file (relative to compiled dist). */
export const SKILL_PATH = join(__dirname, 'skill.md')

/** Read the Skill file synchronously. Used at MCP server boot. */
export function loadSkill(): string {
  return readFileSync(SKILL_PATH, 'utf-8')
}

/** Identity helper to inline the skill text. */
export const SKILL_CONTENT: string = loadSkill()

/** Stable Skill version identifier (bumped only when Skill text changes). */
export const SKILL_VERSION = '0.1.0'