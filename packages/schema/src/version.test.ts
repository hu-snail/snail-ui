import { describe, it, expect } from 'vitest';
import { parseSchemaVersion, isCompatible, CURRENT_SCHEMA_VERSION } from './version.js';

describe('@snui/schema — Version', () => {
  describe('parseSchemaVersion', () => {
    it('parses simple semver', () => {
      const v = parseSchemaVersion('1.2.3');
      expect(v).toEqual({ major: 1, minor: 2, patch: 3, raw: '1.2.3' });
    });

    it('parses pre-release', () => {
      const v = parseSchemaVersion('1.0.0-rc.1');
      expect(v?.major).toBe(1);
      expect(v?.minor).toBe(0);
      expect(v?.patch).toBe(0);
    });

    it('parses build metadata', () => {
      const v = parseSchemaVersion('1.0.0+build.7');
      expect(v?.patch).toBe(0);
    });

    it('returns null for invalid semver', () => {
      expect(parseSchemaVersion('v1.0')).toBeNull();
      expect(parseSchemaVersion('1.0')).toBeNull();
      expect(parseSchemaVersion('1.0.0.0')).toBeNull();
    });
  });

  describe('isCompatible', () => {
    it('accepts same version', () => {
      expect(isCompatible('1.0.0', '1.0.0')).toEqual({ compatible: true });
    });

    it('accepts higher patch in same major.minor', () => {
      expect(isCompatible('1.0.5', '1.0.0')).toEqual({ compatible: true });
    });

    it('rejects higher minor in same major', () => {
      const r = isCompatible('1.2.0', '1.1.0');
      expect(r.compatible).toBe(false);
      expect(r.reason).toContain('schema minor (2) > runtime minor (1)');
    });

    it('rejects major mismatch without allowMajor', () => {
      const r = isCompatible('2.0.0', '1.0.0');
      expect(r.compatible).toBe(false);
      expect(r.reason).toContain('major version mismatch');
    });

    it('accepts major mismatch with allowMajor', () => {
      expect(isCompatible('2.0.0', '1.0.0', { allowMajor: true })).toEqual({ compatible: true });
    });

    it('rejects non-semver schema version', () => {
      const r = isCompatible('garbage', '1.0.0');
      expect(r.compatible).toBe(false);
      expect(r.reason).toContain('schema version "garbage" is not semver');
    });

    it('CURRENT_SCHEMA_VERSION parses cleanly', () => {
      expect(parseSchemaVersion(CURRENT_SCHEMA_VERSION)?.raw).toBe(CURRENT_SCHEMA_VERSION);
    });
  });
});