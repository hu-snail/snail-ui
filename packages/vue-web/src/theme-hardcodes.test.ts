/**
 * Theme-adaptation guard — every colour a component hard-codes must be listed
 * here with a reason.
 *
 * ## Why this exists
 *
 * "All components follow the theme" is not a state you reach once; it is a
 * state you keep. Before this test, 95 literals had accumulated across 21
 * components: shadows that ignored the style axis (doodle/ios flatten them),
 * a white slider thumb that stayed white in dark mode, and hover washes built
 * from `rgba(0,0,0,…)` that vanish on a dark surface. None of that is visible
 * in a light-mode screenshot, so nothing caught it.
 *
 * The rule the components are held to:
 *   - colours that carry *chrome* (surface, text, border, action, shadow)
 *     must be tokens, because Theme / Style / Density own them;
 *   - colours that describe *content or media* may be literal — a hue rail is
 *     the 0–360° spectrum, carousel dots sit on arbitrary imagery, the doodle
 *     skin draws in ink. Those are listed below.
 *
 * ## How to use it
 *
 * A new literal fails the build. Either replace it with a token, or add it to
 * `ALLOWED` **with a reason** — the reason is the thing a reviewer reads.
 * Removing a literal without deleting its allowlist entry also fails, so the
 * list cannot rot into a lie.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

// `import.meta.url` is not a file: URL under the happy-dom transform, so the
// package root comes from the runner's cwd (vitest runs per package).
const SRC_DIR = join(process.cwd(), 'src');

/** One literal colour a file is allowed to hard-code, and why. */
interface AllowedColor {
  readonly color: string;
  readonly why: string;
}

/**
 * Per-file allowlist, keyed by path relative to `packages/vue-web/src`.
 *
 * Keep the `why` short and factual: it is what stops someone deleting the
 * entry "because the test is annoying".
 */
const ALLOWED: Readonly<Record<string, readonly AllowedColor[]>> = {
  // ── Doodle skin: the hand-drawn style draws with ink on paper. The pack's
  // whole point is a non-token border/shadow treatment, and it is scoped to
  // `.snui-skin-doodle`, so it cannot leak into a themed component.
  'breadcrumb/SnBreadcrumbItem.vue': [{ color: '#1a1a1a', why: 'doodle ink border' }],
  'button/SnButton.vue': [{ color: '#1a1a1a', why: 'doodle ink border/shadow' }],
  'card/SnCard.vue': [
    { color: '#1a1a1a', why: 'doodle ink border' },
    { color: '#fff', why: 'text on the doodle ink fill' },
  ],
  'collapse/SnCollapseItem.vue': [{ color: '#1a1a1a', why: 'doodle ink border' }],
  'divider/SnDivider.vue': [{ color: '#1a1a1a', why: 'doodle ink line' }],
  'form/SnForm.vue': [{ color: '#1a1a1a', why: 'doodle ink underline' }],
  'form/SnFormItem.vue': [{ color: '#1a1a1a', why: 'doodle ink label' }],
  'grid/SnGrid.vue': [{ color: '#1a1a1a', why: 'doodle ink grid line' }],
  'input/SnInput.vue': [{ color: '#1a1a1a', why: 'doodle ink underline' }],
  'tabs/SnTabs.vue': [{ color: '#1a1a1a', why: 'doodle ink tab border' }],

  // ── Menu's inverted variant: an explicitly dark navigation surface that
  // ships with its own light text. `#001529` is the reference (naive) plate,
  // the white alphas are its hover/active/caret states.
  'menu/SnMenu.vue': [
    { color: '#001529', why: 'inverted nav plate' },
    { color: '#1a1a1a', why: 'doodle ink' },
    { color: '#fff', why: 'text on inverted / doodle fills' },
    { color: 'rgba(0, 0, 0, 0.04)', why: 'hover wash on the inverted submenu (light popover)' },
    { color: 'rgba(255, 255, 255, 0.08)', why: 'inverted hover wash' },
    { color: 'rgba(255, 255, 255, 0.12)', why: 'inverted active wash' },
    { color: 'rgba(255, 255, 255, 0.18)', why: 'inverted item wash' },
    { color: 'rgba(255, 255, 255, 0.2)', why: 'inverted hover wash (strong)' },
    { color: 'rgba(255, 255, 255, 0.6)', why: 'inverted caret' },
    { color: 'rgba(255, 255, 255, 0.82)', why: 'inverted label' },
  ],

  // ── On-media chrome: carousel dots/arrows and caption text are drawn over
  // arbitrary imagery, so white is the only safe choice regardless of theme.
  'carousel/SnCarousel.vue': [
    { color: 'rgba(255, 255, 255, 0.2)', why: 'on-media arrow plate' },
    { color: 'rgba(255, 255, 255, 0.3)', why: 'on-media dot / arrow hover' },
    { color: 'rgba(255, 255, 255, 0.5)', why: 'on-media dot focus' },
    { color: 'rgba(255, 255, 255, 1)', why: 'on-media active dot / arrow glyph' },
  ],
  'carousel/SnCarouselItem.vue': [
    { color: 'rgba(255, 255, 255, 0.7)', why: 'on-media caption description' },
    { color: 'rgba(255, 255, 255, 0.9)', why: 'on-media caption title' },
  ],
  'progress/SnProgress.vue': [
    { color: 'rgba(255, 255, 255, 0.22)', why: 'shine stripe inside the coloured fill' },
  ],

  // ── Colour picker: the SV square and the hue rail are the colour space
  // itself. Tokenising them would make the picker lie about what it shows.
  'color-picker/SnColorPicker.vue': [
    { color: 'rgb(0 0 0)', why: 'SV square black axis' },
    { color: 'rgb(0 0 0 / 0)', why: 'SV square transparent end' },
    { color: 'rgb(0 0 0 / 0.5)', why: 'SV handle outline' },
    { color: 'rgb(0 0 0 / 0.25)', why: 'rail thumb shadow' },
    { color: 'rgb(255 255 255)', why: 'SV square white axis' },
    { color: 'rgb(255 255 255 / 0)', why: 'SV square transparent end' },
    { color: 'rgb(255, 0, 0)', why: 'hue rail 0°' },
    { color: 'rgb(255, 255, 0)', why: 'hue rail 60°' },
    { color: 'rgb(0, 255, 0)', why: 'hue rail 120°' },
    { color: 'rgb(0, 255, 255)', why: 'hue rail 180°' },
    { color: 'rgb(0, 0, 255)', why: 'hue rail 240°' },
    { color: 'rgb(255, 0, 255)', why: 'hue rail 300°' },
  ],

  // ── Slider-bar: the stars twinkle inside the coloured fill (content, not
  // chrome), and the remaining shadows describe the floating thumb.
  'slider-bar/SnSliderBar.vue': [
    { color: '#ffffff', why: 'stars inside the fill' },
    { color: 'rgba(0, 0, 0, 0.06)', why: 'thumb 1px ring' },
    { color: 'rgba(0, 0, 0, 0.25)', why: 'tooltip shadow' },
    { color: 'rgba(0, 0, 0, 0.28)', why: 'aurora handle shadow' },
    { color: 'rgba(0, 0, 0, 0.3)', why: 'handle focus shadow' },
    { color: 'rgba(255, 255, 255, 0.9)', why: 'star glow' },
  ],
};

/**
 * Extract every hard-coded colour from a component's `<style>` blocks.
 *
 * Skips comment lines and anything inside `var(...)` / `url(...)` — a token's
 * fallback is not a hard-code, it is the documented last resort before the
 * token layer loads.
 */
function hardcodedColors(source: string): string[] {
  const colors: string[] = [];
  const styleBlocks = source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g);

  for (const block of styleBlocks) {
    const body = block[1] ?? '';
    const stack: string[] = [];
    let index = 0;

    while (index < body.length) {
      if (body.startsWith('var(', index)) {
        stack.push('var');
        index += 4;
        continue;
      }
      if (body.startsWith('url(', index)) {
        stack.push('url');
        index += 4;
        continue;
      }
      const char = body[index];
      if (char === '(') {
        stack.push('(');
        index += 1;
        continue;
      }
      if (char === ')') {
        stack.pop();
        index += 1;
        continue;
      }
      if (char === '#' || body.startsWith('rgb', index) || body.startsWith('hsl', index)) {
        const match = /^(#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\))/.exec(
          body.slice(index),
        );
        if (match) {
          if (!stack.includes('var')) {
            const lineStart = body.lastIndexOf('\n', index) + 1;
            const lineEnd = body.indexOf('\n', index);
            const declaration = body.slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
            const isComment = /^(\*|\/\*|\/\/)/.test(declaration);
            if (!isComment) colors.push(match[1]);
          }
          index += match[0].length;
          continue;
        }
      }
      index += 1;
    }
  }

  return colors;
}

/** Every component file under `src`, relative to it. */
function componentFiles(dir: string = SRC_DIR): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...componentFiles(full));
    else if (entry.name.endsWith('.vue')) out.push(relative(SRC_DIR, full).replace(/\\/g, '/'));
  }
  return out;
}

describe('component theme adaptation', () => {
  it('should not hard-code any colour outside the documented allowlist', () => {
    const violations: string[] = [];

    for (const file of componentFiles()) {
      const allowed = new Set((ALLOWED[file] ?? []).map((entry) => entry.color));
      const seen = new Set(hardcodedColors(readFileSync(join(SRC_DIR, file), 'utf8')));
      for (const color of seen) {
        if (!allowed.has(color)) violations.push(`${file}: ${color}`);
      }
    }

    expect(
      violations,
      'Use a --sn-web-* token, or add the literal to ALLOWED with a reason ' +
        '(theme-hardcodes.test.ts).',
    ).toEqual([]);
  });

  it('should not keep allowlist entries that no longer exist', () => {
    // A stale entry silently re-authorises the colour if it ever comes back.
    const stale: string[] = [];

    for (const [file, entries] of Object.entries(ALLOWED)) {
      const seen = new Set(hardcodedColors(readFileSync(join(SRC_DIR, file), 'utf8')));
      for (const entry of entries) {
        if (!seen.has(entry.color)) stale.push(`${file}: ${entry.color} (${entry.why})`);
      }
    }

    expect(stale, 'Drop these allowlist entries — the literal is gone.').toEqual([]);
  });
});
