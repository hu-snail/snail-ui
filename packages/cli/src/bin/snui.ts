#!/usr/bin/env node
/**
 * @snui/cli bin entry — `pnpm snui <command>`.
 *
 * Commands implemented in M0.5 + AUI-FOUND-009:
 *   token-check   Scan component .vue files for color literals and
 *                 wrong-end alias references (--end web|mp).
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
   
  console.log(`snui — snail-aui CLI

Usage: snui <command>

Commands:
  token-check [--dir <path>] [--end web|mp]
                                Scan component .vue files for color literals
                                and (when --end is set) wrong-end alias
                                references. Default --dir: packages/vue-web/src
  pack-validate [--dir <path>] Validate Style Pack definitions
                                (default --dir: packages/style-packs/src)
  help                          Print this help message

Examples:
  pnpm snui token-check --dir packages/vue-web/src --end web
                                → forbids --sn-mp-* / --aui-* in Web component
  pnpm snui token-check --dir packages/uni/src     --end mp
                                → forbids --sn-web-* / --aui-* in uni component

Status: M0.5 + AUI-FOUND-009 (end-independent token-check).`)
  return 0
}

function parseDir(positional: ReadonlyArray<string>, flag: string, fallback: string): string {
  const idx = positional.indexOf(flag)
  if (idx >= 0 && idx + 1 < positional.length) return positional[idx + 1] ?? fallback
  return fallback
}

function parseEnd(positional: ReadonlyArray<string>): 'web' | 'mp' | undefined {
  const idx = positional.indexOf('--end')
  if (idx < 0 || idx + 1 >= positional.length) return undefined
  const v = positional[idx + 1]
  if (v === 'web' || v === 'mp') return v
  return undefined
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
      const end = parseEnd(positional)
      return runTokenCheck({ sourceDir: dir }, end)
    }
    case 'pack-validate': {
      const dir = parseDir(positional, '--dir', 'packages/style-packs/src')
      return runPackValidate({ packsDir: dir })
    }
    default:
       
      console.error(`unknown command: ${command}`)
      return help()
  }
}

main().then((code) => process.exit(code)).catch((err) => {
   
  console.error(err)
  process.exit(2)
})