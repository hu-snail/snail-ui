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

  it('gives every icon a non-empty paths array of non-empty strings', () => {
    for (const [name, icon] of Object.entries(iconSet)) {
      if (typeof icon !== 'object' || icon === null || !('paths' in icon)) continue;
      const paths = (icon as { paths: readonly string[] }).paths;
      expect(paths.length, `${name} must declare at least one path`).toBeGreaterThan(0);
      for (const d of paths) {
        expect(typeof d, `${name} path must be a string`).toBe('string');
        expect(d.length, `${name} path must be non-empty`).toBeGreaterThan(0);
      }
    }
  });

  it('defaults every viewBox to the lucide 24x24 grid', () => {
    for (const [name, icon] of Object.entries(iconSet)) {
      if (typeof icon !== 'object' || icon === null || !('paths' in icon)) continue;
      const viewBox = (icon as { viewBox?: string }).viewBox;
      expect(viewBox, `${name} viewBox`).toBe('0 0 24 24');
    }
  });

  it('ships the password-toggle pair required by the SnIcon contract', () => {
    // AGENTS.md §113: Eye / EyeOff back the sn-input visibility toggle.
    expect(iconSet.Eye.paths.length).toBeGreaterThan(0);
    expect(iconSet.EyeOff.paths.length).toBeGreaterThan(0);
  });

  it('ships the navigation shortcuts used by cell / navbar demos', () => {
    expect(iconSet.ChevronRight.paths).toEqual(['m9 18 6-6-6-6']);
    expect(iconSet.ArrowLeft.paths).toEqual(['M19 12H5', 'm12 19-7-7 7-7']);
  });
});
