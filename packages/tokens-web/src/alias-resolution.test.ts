/**
 * @snui/tokens-web — cross-layer alias resolution tests (FB-004 follow-up).
 *
 * Every `--sn-web-*` alias expands to `var(--aui-*)` and relies on the
 * `@snui/tokens` static cascade to emit the target. Before the FB-004
 * follow-up that cascade simply did not emit several targets (the dialog /
 * drawer / spin / skeleton families, `--aui-focus-ring`,
 * `--aui-color-feedback-danger-hover`), so the aliases silently resolved to
 * the empty string at runtime — invisible focus rings, transparent drawer
 * masks. This suite reads the real base stylesheet and fails when any alias
 * target, or a documented second hop of the overlay chain, is not declared.
 *
 * The base stylesheet is read via a relative path on purpose: the alias layer
 * deliberately keeps zero package dependencies on `@snui/tokens` (it only
 * references CSS variable names), so there is no package-export resolution
 * to lean on — the monorepo layout is the contract being pinned.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { snWebAliasMap } from './variables.js';

const here = dirname(fileURLToPath(import.meta.url));
const baseStylesheetPath = join(here, '..', '..', 'tokens', 'styles', 'index.css');

/** All custom-property names declared in a stylesheet, comments ignored. */
function declaredNames(css: string): Set<string> {
  const names = new Set<string>();
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of bare.matchAll(/(--[a-z0-9-]+)\s*:/g)) {
    names.add(match[1]!);
  }
  return names;
}

const aliasTargets = new Set(snWebAliasMap.map(([, base]) => base));
const declared = declaredNames(readFileSync(baseStylesheetPath, 'utf-8'));

describe('@snui/tokens-web — alias targets resolve in the base cascade', () => {
  it('declares every var(--aui-*) alias target in the @snui/tokens stylesheet', () => {
    // Lower bound guards against an emptied alias map silently passing.
    expect(aliasTargets.size).toBeGreaterThanOrEqual(100);
    const missing = [...aliasTargets].filter((target) => !declared.has(target));
    expect(missing, 'missing from packages/tokens/styles/index.css').toEqual([]);
  });

  it('emits the second hops of the dialog / drawer overlay chains', () => {
    // --sn-web-drawer-mask-color resolves through --aui-drawer-mask-color to
    // --aui-color-background-overlay, and dialog / drawer surfaces sit on
    // --aui-color-background-elevated. Those hop names are not alias targets
    // themselves, so they need an explicit check.
    const secondHops = ['--aui-color-background-overlay', '--aui-color-background-elevated'];
    for (const hop of secondHops) {
      expect(declared.has(hop), `${hop} must be emitted by the base cascade`).toBe(true);
    }
  });

  /**
   * A consuming stylesheet that references an unregistered `--sn-web-*` name
   * gets `var(<undefined>)` — which CSS resolves to the guaranteed-invalid
   * value, i.e. `background: <nothing>`. That is exactly how a docs overlay
   * ended up fully transparent while every component still looked fine.
   *
   * Scope note (deliberately narrow): the library still carries a known set of
   * pre-existing NO_ALIAS references in sibling components (tooltip / tabs /
   * card / input / …), tracked as the AUI-FOUND token-debt batch. Those are
   * listed in `KNOWN_UNREGISTERED` so this guard protects the surfaces this
   * change owns — the docs app and the feedback components — without going red
   * on debt that is out of scope here. Shrinking that list is the follow-up.
   */
  it('references only registered aliases from the docs app and feedback components', () => {
    const consumers = [
      join(here, '..', '..', '..', 'apps', 'docs', '.vitepress'),
      join(here, '..', '..', 'vue-web', 'src', 'dialog'),
      join(here, '..', '..', 'vue-web', 'src', 'drawer'),
      join(here, '..', '..', 'vue-web', 'src', 'steps'),
    ];
    const registered = new Set(snWebAliasMap.map(([alias]) => alias));
    // Pre-existing token debt, out of scope here: several older demos and
    // components were written against short alias names that never existed
    // (`--sn-web-color-text` instead of `-text-primary`, and friends). They
    // resolve to nothing today, same class of bug as the overlay above, and
    // are tracked in the AUI-FOUND token-debt batch. Listed so this guard can
    // protect the surfaces this change owns without red-flagging old debt.
    const knownUnregistered = new Set([
      '--sn-web-color-text',
      '--sn-web-color-border',
      '--sn-web-color-background',
      '--sn-web-color-primary',
      '--sn-web-color-success',
      '--sn-web-color-background-code',
      '--sn-web-color-tooltip-background',
      '--sn-web-color-feedback-danger-soft',
      '--sn-web-color-feedback-warning-soft',
      '--sn-web-input-border-color-focus',
      '--sn-web-input-placeholder-color',
      '--sn-web-input-shadow',
      '--sn-web-bezier-ease',
    ]);
    const unknown: string[] = [];
    let scannedFiles = 0;

    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        // `dist` is a build artifact (vitepress output), not a source file.
        if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('._'))
          continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
          continue;
        }
        if (!/\.(vue|css|ts)$/.test(entry.name)) continue;
        scannedFiles += 1;
        const body = readFileSync(full, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
        // `var(--sn-web-x, <fallback>)` is the sanctioned override-hook shape:
        // an unregistered name is fine as long as the author supplied a literal
        // fallback, because the declaration can still resolve. A *bare*
        // `var(--sn-web-x)` with no fallback is the dangerous form — that is
        // exactly how the overlay above turned transparent.
        for (const match of body.matchAll(/var\(\s*(--sn-web-[a-z0-9-]+)\s*(,[^)]*)?\)/g)) {
          const name = match[1]!;
          if (registered.has(name) || knownUnregistered.has(name)) continue;
          const hasFallback = Boolean(match[2]);
          if (!hasFallback) {
            unknown.push(`${name} (${entry.name})`);
          }
        }
      }
    };

    for (const dir of consumers) walk(dir);

    // Lower bound: an empty walk (bad path / renamed folder) must not pass.
    expect(scannedFiles).toBeGreaterThanOrEqual(20);
    expect([...new Set(unknown)], 'unregistered --sn-web-* references').toEqual([]);
  });
});
