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
  // The App-side rasterization (stroke-color resolution + SVG data URL) lives
  // IN the source now (sn-icon-mp.ts, shared with the MP branch), so the
  // patch set is template retargeting only.
  const source = readFileSync(
    join(import.meta.dirname, '../../../uni/src/components/sn-icon/sn-icon.vue'),
    'utf8',
  );
  const result = transformVueToUvue(source, 'sn-icon/sn-icon.vue');
  const mpModule = readFileSync(
    join(import.meta.dirname, '../../../uni/src/components/sn-icon/sn-icon-mp.ts'),
    'utf8',
  );

  it('renders IconData through <image> fed by the in-source data-URL module', () => {
    // App has no inline <svg> element; the uvue must consume the shared
    // sn-icon-mp module and must not keep a real <svg> element (markup-shaped
    // assertion: prose comments may still document the retired approach).
    expect(result.code).toContain('<image v-else-if="displayIcon"');
    expect(result.code).toContain(':src="iconDataUrl"');
    expect(result.code).toContain("from './sn-icon-mp'");
    expect(result.code).not.toContain('xmlns=');
  });

  it('resolves the stroke color through the cascade in the shared module', () => {
    // Regression: `currentColor` used to bake as a fixed `#1a1a1a` and
    // var(--token) strokes were emitted verbatim (invalid inside an SVG
    // image document) — icons on colored buttons rendered black on uni-app x.
    // The resolver is sn-icon-mp.ts (single source of truth for MP + App):
    // concrete colors bake verbatim, everything else reads back through
    // computedStyle with the ink constant as the never-blank fallback, and
    // both fields-callback result shapes are probed (uni-app x delivers the
    // NodeInfo itself; classic-style hosts deliver a one-element array).
    expect(mpModule).toContain('ICON_INK_FALLBACK');
    expect(mpModule).toContain("computedStyle: ['color']");
    expect(mpModule).toContain('readResolvedIconColor');
    expect(mpModule).toContain('JSON.stringify');
    expect(result.code).toContain('useMpIconColor');
  });

  it('keeps every sn-icon anchor applied', () => {
    const patches = PATCHES['sn-icon/sn-icon.vue'] ?? [];
    expect(result.issues.filter((i) => i.kind === 'patch').length).toBe(patches.length);
  });
});

describe('sn-circle ring patches (uni-app x)', () => {
  // Regression 1: the ring was a conic-gradient on a CSS-masked view — both
  // properties are unsupported on uni-app x App, so the component rendered
  // as a solid pie wedge over a full grey disc. The App-side ring must be a
  // stroked-circle SVG rasterized through <image>.
  // Regression 2 (device, HBuilderX 5.33 alpha): the App image SVG decoder
  // mis-renders arcs carrying in-document transforms — the rotate(-90) +
  // dasharray progress circle drew broken fragments and lost tracks on
  // multi-instance pages. The progress arc must be a precomputed M/A path:
  // numbers only, no transform attribute, no dasharray in the SVG document.
  // Run the real upstream source through the full pipeline — any upstream
  // drift against the anchors fails here at test time, not at build time.
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

  it('builds the progress arc as an exact SVG arc path — smooth at any stroke width', () => {
    // Accuracy regression: a chord polyline visibly faceted the thick band
    // ("gear" edges). The A command is exact circular geometry, so the band
    // stays smooth; direction rides the sweep-flag and the start point is
    // precomputed at 12 o'clock (no in-document transform / dasharray).
    expect(result.code).toContain('const startY: number = r2(50 - r)');
    expect(result.code).toContain('const largeArc: number = sweep > 180 ? 1 : 0');
    expect(result.code).toContain('const sweepFlag: number = props.clockwise ? 1 : 0');
    expect(result.code).toContain('A ${r} ${r} 0 ${largeArc} ${sweepFlag} ${endX} ${endY}');
    expect(result.code).toContain('Math.cos(endAngle)');
    expect(result.code).toContain('Math.sin(endAngle)');
    expect(result.code).toContain('data:image/svg+xml;utf8,${encodeURIComponent(svg)}');
    // The decoder-hostile attributes must stay gone. Assertions are
    // markup-shaped (`attribute="`) so prose comments may still document
    // the retired approaches.
    expect(result.code).not.toContain('stroke-dasharray="');
    expect(result.code).not.toContain('transform="');
    expect(result.code).not.toContain('scale(-1 1)');
    // No chord polyline fallback: it re-facets the band.
    expect(result.code).not.toContain('CHORD_MAX_DEG');
    expect(result.code).not.toContain("parts.join(' L ')");
  });

  it('starts the arc at 12 o’clock from precomputed coordinates', () => {
    // (50, 50 - r) is the top of the circle — baked as numbers, no rotate.
    expect(result.code).toContain('const startY: number = r2(50 - r)');
  });

  it('omits the progress path at 0% and strokes a plain full circle at 100%', () => {
    // 0%: a zero-length path would still dot under round caps — track only.
    expect(result.code).toContain('if (sweep > 0 && sweep < 360)');
    // 100%: a single-arc path is degenerate (start point == end point), so
    // the full ring strokes as a plain transform-free closed circle — the
    // exact shape the device already renders for the track.
    expect(result.code).toContain('else if (sweep >= 360)');
    expect(result.code).toContain('<circle cx="50" cy="50" r="${r}" fill="none" stroke="${stroke}"');
  });

  it('keeps the device-verified transform-free track circle', () => {
    // The track (plain circle, no transform, no dasharray) renders
    // correctly on device — untouched by the arc rework.
    expect(result.code).toContain('<circle cx="50" cy="50" r="${r}" fill="none" stroke="${track}"');
  });

  it('encodes strokeLinecap as a real stroke attribute', () => {
    // The conic sweep had no caps (API parity only); the SVG arc path does.
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
