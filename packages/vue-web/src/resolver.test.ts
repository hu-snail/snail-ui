/**
 * SnUIResolver tests — AUI-WEB-TOOL (unplugin-vue-components resolver).
 *
 * The resolver is the auto-import entry point. A component that ships but is
 * missing from `PUBLIC_COMPONENTS` fails silently at the consumer's build time
 * (Vue treats `<SnX>` as an unknown custom element), so the list/match
 * invariants are worth pinning down.
 */

import { describe, expect, it } from 'vitest';
import { PUBLIC_COMPONENTS, SnUIResolver } from './resolver';
import * as indexExports from './index';

describe('SnUIResolver', () => {
  describe('resolve', () => {
    it('should resolve a shipped component to the library entry', () => {
      const resolver = SnUIResolver();
      const result = resolver.resolve('SnButton');

      expect(result).toEqual({
        name: 'default',
        from: '@snui/vue-web',
        sideEffects: '@snui/vue-web/styles',
      });
    });

    it('should honour a custom library option', () => {
      const resolver = SnUIResolver({ library: 'my-aliased-snui' });
      const result = resolver.resolve('SnButton');

      expect(result?.from).toBe('my-aliased-snui');
      expect(result?.sideEffects).toBe('my-aliased-snui/styles');
    });

    it('should return undefined for an unknown component', () => {
      const resolver = SnUIResolver();

      expect(resolver.resolve('SnNotAThing')).toBeUndefined();
      expect(resolver.resolve('NButton')).toBeUndefined();
    });

    it('should report itself as a component resolver', () => {
      expect(SnUIResolver().type).toBe('component');
    });
  });

  describe('PUBLIC_COMPONENTS', () => {
    /** `SnUI` is the install plugin, not a component — it is legitimately absent. */
    const NON_COMPONENT_EXPORTS = new Set(['SnUI']);

    it('should match the Sn* component value exports of the package entry', () => {
      // Every exported `Sn*` component must be auto-importable, and the
      // resolver must not advertise a component the package does not export.
      const exported = Object.keys(indexExports)
        .filter(
          (name) =>
            /^Sn[A-Z]/.test(name) &&
            !NON_COMPONENT_EXPORTS.has(name) &&
            indexExports[name as keyof typeof indexExports],
        )
        .sort();

      expect([...PUBLIC_COMPONENTS].sort()).toEqual(exported);
    });

    it('should resolve every listed component', () => {
      const resolver = SnUIResolver();

      for (const name of PUBLIC_COMPONENTS) {
        expect(resolver.resolve(name), `${name} should resolve`).toBeDefined();
      }
    });

    it('should not contain duplicates', () => {
      expect(new Set(PUBLIC_COMPONENTS).size).toBe(PUBLIC_COMPONENTS.length);
    });
  });
});
