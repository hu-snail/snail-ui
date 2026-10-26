/**
 * @snui/tokens-web tests — AUI-FOUND-005.
 *
 * Verifies the alias layer is well-formed and consistent with the static
 * stylesheet. Per Spec-01 v1.2 §2.3 + AGENTS.md §43 test-first.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { snWebAliasMap, renderSnWebStyles, listSnWebAliases } from './variables.js';

const here = dirname(fileURLToPath(import.meta.url));
const stylesheetPath = join(here, '..', 'styles', 'index.css');

describe('@snui/tokens-web alias layer', () => {
  it('declares at least the v3.0 button + input + card + semantic color set', () => {
    const aliases = listSnWebAliases();
    // semantic colors
    expect(aliases).toContain('--sn-web-color-action-primary');
    expect(aliases).toContain('--sn-web-color-text-on-primary');
    // tertiary backs secondary-level copy in docs prose + home page
    expect(aliases).toContain('--sn-web-color-text-tertiary');
    expect(aliases).toContain('--sn-web-color-background-surface');
    // overlay / elevated back the modal masks (dialog stage, drawer, modal)
    expect(aliases).toContain('--sn-web-color-background-overlay');
    expect(aliases).toContain('--sn-web-color-background-elevated');
    expect(aliases).toContain('--sn-web-color-border-default');
    // button component tokens
    expect(aliases).toContain('--sn-web-button-radius');
    expect(aliases).toContain('--sn-web-button-height-medium');
    // input + card
    expect(aliases).toContain('--sn-web-input-radius');
    expect(aliases).toContain('--sn-web-card-radius');
    // icon (AUI-WEB-002 follow-up)
    expect(aliases).toContain('--sn-web-icon-size-medium');
    expect(aliases).toContain('--sn-web-icon-size-tiny');
    expect(aliases).toContain('--sn-web-icon-size-small');
    expect(aliases).toContain('--sn-web-icon-size-large');
    expect(aliases).toContain('--sn-web-icon-size-xlarge');
    expect(aliases).toContain('--sn-web-icon-stroke-width');
    expect(aliases).toContain('--sn-web-focus-ring');
    // spin (AUI-WEB-FB-006)
    expect(aliases).toContain('--sn-web-spin-color');
    expect(aliases).toContain('--sn-web-spin-text-color');
    expect(aliases).toContain('--sn-web-spin-size-medium');
    expect(aliases).toContain('--sn-web-spin-size-huge');
    expect(aliases).toContain('--sn-web-spin-font-size');
    expect(aliases).toContain('--sn-web-spin-opacity-spinning');
    expect(aliases).toContain('--sn-web-spin-description-gap');
    // skeleton (AUI-WEB-FB-007)
    expect(aliases).toContain('--sn-web-skeleton-color');
    expect(aliases).toContain('--sn-web-skeleton-color-end');
    expect(aliases).toContain('--sn-web-skeleton-radius');
    expect(aliases).toContain('--sn-web-skeleton-height-small');
    expect(aliases).toContain('--sn-web-skeleton-height-medium');
    expect(aliases).toContain('--sn-web-skeleton-height-large');
    // dialog (AUI-WEB-FB-001)
    expect(aliases).toContain('--sn-web-dialog-color');
    expect(aliases).toContain('--sn-web-dialog-title-text-color');
    expect(aliases).toContain('--sn-web-dialog-icon-color-error');
    expect(aliases).toContain('--sn-web-dialog-close-margin-icon-top');
    // drawer (AUI-WEB-FB-003)
    expect(aliases).toContain('--sn-web-drawer-color');
    expect(aliases).toContain('--sn-web-drawer-header-padding');
    expect(aliases).toContain('--sn-web-drawer-footer-border-top');
    expect(aliases).toContain('--sn-web-drawer-mask-color');
    // semantic scale (AUI-TPL-001) — templates compose pages from these
    expect(aliases).toContain('--sn-web-spacing-5');
    expect(aliases).toContain('--sn-web-spacing-8');
    expect(aliases).toContain('--sn-web-radius-lg');
    expect(aliases).toContain('--sn-web-shadow-md');
    expect(aliases).toContain('--sn-web-font-size-md');
    expect(aliases).toContain('--sn-web-font-weight-semibold');
    expect(aliases).toContain('--sn-web-font-line-height-normal');
  });

  it('maps every alias to a `--aui-*` base layer reference', () => {
    for (const [alias, base] of snWebAliasMap) {
      expect(alias.startsWith('--sn-web-')).toBe(true);
      expect(base.startsWith('--aui-')).toBe(true);
    }
  });

  it('has unique aliases (no duplicate mappings)', () => {
    const aliases = listSnWebAliases();
    expect(new Set(aliases).size).toBe(aliases.length);
  });

  it('produces a `:root { ... }` block containing all aliases', () => {
    const css = renderSnWebStyles();
    expect(css.startsWith(':root {')).toBe(true);
    expect(css.endsWith('}\n')).toBe(true);
    for (const [alias] of snWebAliasMap) {
      expect(css).toContain(`${alias}: var(`);
    }
  });

  it('keeps the static stylesheet in sync with the JS alias map', async () => {
    const css = await readFile(stylesheetPath, 'utf-8');
    for (const [alias, base] of snWebAliasMap) {
      // each alias must appear in static CSS
      expect(css).toContain(`${alias}: var(${base});`);
    }
    // no stray --sn-web-* declarations in static CSS that are missing from JS
    const cssAliases = [...css.matchAll(/--sn-web-[a-z0-9-]+/g)].map((m) => m[0]);
    const jsAliases = new Set(listSnWebAliases());
    for (const found of cssAliases) {
      expect(jsAliases.has(found)).toBe(true);
    }
  });

  it('exports no runtime side effects', () => {
    // renderSnWebStyles() must be a pure string builder; the export itself
    // must not read env / write to fs / call network.
    const a = renderSnWebStyles();
    const b = renderSnWebStyles();
    expect(a).toBe(b);
  });
});
