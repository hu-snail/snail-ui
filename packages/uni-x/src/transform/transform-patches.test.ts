import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { transformVueToUvue } from './index.ts';
import { PATCHES } from './patches.ts';

describe('sn-qr-code canvas patches (uni-app x)', () => {
  it('should apply every qr-code anchor patch to a source containing all anchors', () => {
    const patches = PATCHES['sn-qr-code/sn-qr-code.vue'] ?? [];
    expect(patches.length).toBeGreaterThanOrEqual(5);
    // A source containing every anchor verbatim guarantees every patch fires.
    const source = `<script setup lang="ts">\n${patches
      .map((p) => p.anchor)
      .join('\n')}\n</script>\n<template>\n  <view />\n</template>\n`;
    const result = transformVueToUvue(source, 'sn-qr-code/sn-qr-code.vue');
    expect(result.issues.filter((i) => i.kind === 'patch').length).toBe(patches.length);
    expect(result.code).toContain('applyCanvasBitmapSize');
    expect(result.code).toContain('toDataURL');
    expect(result.code).toContain('getDeviceInfo');
  });
});

describe('sn-icon color patches (uni-app x)', () => {
  // Run the real upstream source through the full pipeline — any upstream
  // drift against the anchors fails here at test time, not at build time.
  const source = readFileSync(
    join(import.meta.dirname, '../../../uni/src/components/sn-icon/sn-icon.vue'),
    'utf8',
  );
  const result = transformVueToUvue(source, 'sn-icon/sn-icon.vue');

  it('resolves the stroke color through the cascade instead of a fixed ink', () => {
    // Regression: `currentColor` used to bake as a fixed `#1a1a1a` and
    // var(--token) strokes were emitted verbatim (invalid inside an SVG
    // image document) — icons on colored buttons rendered black on
    // uni-app x. The bake must go through the resolved-color state, with
    // the ink constant only as the availability fallback.
    expect(result.code).not.toContain(`? '#1a1a1a'`);
    expect(result.code).toContain('resolvedIconColor');
    expect(result.code).toContain('ICON_INK_FALLBACK');
    expect(result.code).toContain("computedStyle: ['color']");
    expect(result.code).toContain('isConcreteIconColor');
  });

  it('probes both fields-callback result shapes', () => {
    // uni-app x delivers the NodeInfo itself (ret.color); classic-style
    // hosts deliver a one-element array. Regression: reading nodes[0] only
    // resolved nothing on App and blanked every icon.
    expect(result.code).toContain('Array.isArray(ret)');
    expect(result.code).toContain('readResolvedColor');
    expect(result.code).toContain('JSON.stringify');
  });

  it('renders IconData through <image> with a per-instance query class', () => {
    expect(result.code).toContain('<image v-else-if="displayIcon"');
    expect(result.code).toContain('sn-icon--u${iconUid}');
    expect(result.code).toContain('createSelectorQuery');
  });

  it('keeps every sn-icon anchor applied', () => {
    const patches = PATCHES['sn-icon/sn-icon.vue'] ?? [];
    expect(result.issues.filter((i) => i.kind === 'patch').length).toBe(patches.length);
  });
});

describe('sn-circle ring patches (uni-app x)', () => {
  // Regression: the ring was a conic-gradient on a CSS-masked view — both
  // properties are unsupported on uni-app x App, so the component rendered
  // as a solid pie wedge over a full grey disc. The App-side ring must be a
  // stroked-circle SVG rasterized through <image>. Run the real upstream
  // source through the full pipeline — any upstream drift against the
  // anchors fails here at test time, not at build time.
  const source = readFileSync(
    join(import.meta.dirname, '../../../uni/src/components/sn-circle/sn-circle.vue'),
    'utf8',
  );
  const result = transformVueToUvue(source, 'sn-circle/sn-circle.vue');
  const templateBlock = result.code.slice(
    result.code.indexOf('<template'),
    result.code.indexOf('</template>'),
  );
  const styleBlock = result.code.slice(
    result.code.indexOf('<style'),
    result.code.indexOf('</style>'),
  );

  it('keeps every sn-circle anchor applied', () => {
    const patches = PATCHES['sn-circle/sn-circle.vue'] ?? [];
    expect(patches.length).toBeGreaterThanOrEqual(5);
    expect(result.issues.filter((i) => i.kind === 'patch').length).toBe(patches.length);
  });

  it('rasterizes the ring through <image> instead of conic/mask CSS', () => {
    expect(templateBlock).toContain('<image class="sn-circle__ring-img" :src="ringDataUrl"');
    expect(templateBlock).toContain('sn-circle__probe-p${circleUid}');
    expect(templateBlock).toContain('sn-circle__probe-t${circleUid}');
    expect(templateBlock).not.toContain('sn-circle__track');
    expect(templateBlock).not.toContain('sn-circle__arc');
    // App background-image takes linear-gradient only; mask is unsupported.
    expect(styleBlock).not.toContain('conic-gradient');
    expect(styleBlock).not.toContain('-webkit-mask');
    expect(styleBlock).not.toContain('mask:');
    expect(styleBlock).toContain('.sn-circle__ring-img');
    expect(styleBlock).toContain('.sn-circle__probe');
  });

  it('computes the dash arc in JS from the viewBox geometry', () => {
    // Percent → arc-length math must run before assembly; the SVG document
    // only receives numbers.
    expect(result.code).toContain('const circumference: number = 2 * Math.PI * radius');
    expect(result.code).toContain('stroke-dasharray="${r2(arc)} ${r2(circumference)}"');
    expect(result.code).toContain('data:image/svg+xml;utf8,${encodeURIComponent(svg)}');
  });

  it('starts the arc at 12 o’clock and mirrors it for counter-clockwise', () => {
    expect(result.code).toContain("props.clockwise\n    ? 'rotate(-90 50 50)'");
    expect(result.code).toContain('translate(100 0) scale(-1 1) rotate(-90 50 50)');
  });

  it('encodes strokeLinecap as a real stroke attribute', () => {
    // The conic sweep had no caps (API parity only); the SVG arc does.
    expect(result.code).toContain('stroke-linecap="${props.strokeLinecap}"');
  });

  it('resolves ring colors through the cascade instead of baking var() into the data URL', () => {
    // A literal var() is invalid inside an SVG image document and falls back
    // to black ink — tokens must be read back via probe computedStyle
    // (sn-icon strategy), with ink constants as the never-blank fallback.
    expect(result.code).toContain('isConcreteCircleColor');
    expect(result.code).toContain("computedStyle: ['color']");
    expect(result.code).toContain('PROGRESS_INK_FALLBACK');
    expect(result.code).toContain('TRACK_INK_FALLBACK');
    // The data URL reads resolved state only.
    expect(result.code).toContain('stroke="${stroke}"');
    expect(result.code).toContain('stroke="${track}"');
    expect(result.code).not.toContain('stroke="var(--sn-mp-color-action-primary)"');
  });

  it('degrades gradient-map colors to the last stop solid on App', () => {
    expect(result.code).toContain('entries[entries.length - 1]');
  });
});
