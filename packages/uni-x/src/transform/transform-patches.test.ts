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
    // Regression: `currentColor` used to bake as `#1a1a1a` and var(--token)
    // strokes were emitted verbatim (invalid inside an SVG image document) —
    // icons on colored buttons rendered black on uni-app x.
    expect(result.code).not.toContain(`'#1a1a1a'`);
    expect(result.code).toContain('resolvedIconColor');
    expect(result.code).toContain("computedStyle: ['color']");
    expect(result.code).toContain('isConcreteIconColor');
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
