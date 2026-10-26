import { describe, expect, it } from 'vitest';
import * as iconSet from './sn-icon-set';

/**
 * sn-icon renders every entry of `IconData.paths` as `<path :d="d" />`.
 * A full element string (e.g. `<circle … />`) pasted into the array is
 * silently dropped by the SVG parser — the icon renders without that shape.
 * Regression for the Search / Settings / User / Bell circle fix: every entry
 * must be a bare path `d` string, never an element.
 */
describe('sn-icon-set', () => {
  it('keeps every icon path a bare `d` string (no element markup)', () => {
    for (const [name, icon] of Object.entries(iconSet)) {
      if (typeof icon !== 'object' || icon === null || !('paths' in icon)) continue;
      const paths = (icon as { paths: readonly string[] }).paths;
      for (const d of paths) {
        expect(d.startsWith('<'), `${name} path must not contain element markup`).toBe(false);
      }
    }
  });
});
