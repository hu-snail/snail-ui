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
