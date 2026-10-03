#!/usr/bin/env node
/**
 * @snui/cli bin entry — `pnpm snui <command>`.
 *
 * Commands implemented in M0.5 (AUI-TOOL-001~005):
 *   token-check   Scan component .vue files for color literals
 *   pack-validate Validate Style Pack definitions
 *   docs          (placeholder, M1)
 *   llms          (placeholder, M1)
 *   ai-meta       (placeholder, M2)
 *
 * Per AGENTS.md §23, this CLI must not evaluate arbitrary user input —
 * it dispatches to fixed command handlers with pre-defined signatures.
 */

import { runTokenCheck } from '../token-check.js'
import { runPackValidate } from '../pack-validate.js'

interface CliArgs {
  command: string
  positional: ReadonlyArray<string>
}

function parseArgs(argv: ReadonlyArray<string>): CliArgs {
  const [, , command, ...positional] = argv
  return { command: command ?? 'help', positional }
}

function help(): number {
  // eslint-disable-next-line no-console
  console.log(`snui — snail-aui CLI

Usage: snui <command>

Commands:
  token-check [--dir <path>]   Scan component .vue files for color literals
                                (default --dir: packages/vue-web/src)
  pack-validate [--dir <path>] Validate Style Pack definitions
                                (default --dir: packages/style-packs/src)
  help                          Print this help message

Status: M0.5 baseline (FOUND/TOOL phase).`)
  return 0
}

function parseDir(positional: ReadonlyArray<string>, flag: string, fallback: string): string {
  const idx = positional.indexOf(flag)
  if (idx >= 0 && idx + 1 < positional.length) return positional[idx + 1] ?? fallback
  return fallback
}

async function main(): Promise<number> {
  const { command, positional } = parseArgs(process.argv)
  switch (command) {
    case 'help':
    case '--help':
    case '-h':
      return help()
    case 'token-check': {
      const dir = parseDir(positional, '--dir', 'packages/vue-web/src')
      return runTokenCheck({ sourceDir: dir })
    }
    case 'pack-validate': {
      const dir = parseDir(positional, '--dir', 'packages/style-packs/src')
      return runPackValidate({ packsDir: dir })
    }
    default:
      // eslint-disable-next-line no-console
      console.error(`unknown command: ${command}`)
      return help()
  }
}

main().then((code) => process.exit(code)).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(2)
})