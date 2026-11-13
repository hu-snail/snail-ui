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

  it('builds the progress arc as a polyline path — pure M/L commands, numbers only in the SVG document', () => {
    // Device regressions (HBuilderX 5.33 alpha): the App image SVG decoder
    // mis-rendered first the rotate(-90)+dasharray circle and then the
    // precomputed M/A arc path — arcs vanished or drew fragments. The arc is
    // therefore a polyline of short chords (≤6°), carrying direction inside
    // the coordinate math: M/L paths carry no transform, no dasharray, and
    // no arc-command curve math — the rendering surface every SVG engine
    // implements.
    expect(result.code).toContain('CHORD_MAX_DEG = 6');
    expect(result.code).toContain('function arcSegments(sweep: number): number');
    expect(result.code).toContain('const sign: number = props.clockwise ? 1 : -1');
    expect(result.code).toContain('const stepRad: number = ((sweep / segments) * Math.PI) / 180');
    expect(result.code).toContain("M ${parts.join(' L ')}");
    expect(result.code).toContain('Math.cos(a)');
    expect(result.code).toContain('Math.sin(a)');
    expect(result.code).toContain('data:image/svg+xml;utf8,${encodeURIComponent(svg)}');
    // The decoder-hostile attributes must stay gone. Assertions are
    // markup-shaped (`attribute="`) so prose comments may still document
    // the retired approaches.
    expect(result.code).not.toContain('stroke-dasharray="');
    expect(result.code).not.toContain('transform="');
    expect(result.code).not.toContain('scale(-1 1)');
    expect(result.code).not.toContain('sweepFlag');
    expect(result.code).not.toContain('largeArc');
  });

  it('starts the polyline at 12 oclock from precomputed coordinates', () => {
    // startAngle = -90° is the top of the circle — baked into the angle
    // constant, no rotate and no arc-start flags.
    expect(result.code).toContain('const startAngle: number = -Math.PI / 2');
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
