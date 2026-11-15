/**
 * uni-host resolver tests.
 *
 * The resolver is the single source of the compiler-contract knowledge from
 * AUI-UNI-FB-012: the uni compilers rewrite a free `uni` identifier into
 * their injected API module, and `globalThis.uni` is never assigned on
 * classic uni-app mini-programs. Behaviour-level stubbing (globalThis.uni)
 * is shared by every consumer test; this file pins the source convention
 * itself, since the failure it guards only exists after compilation.
 */

import { describe, expect, it } from 'vitest';
// Vite-native raw import — reads the helper as text without filesystem path
// gymnastics (vitest's import.meta.url is not a file:// URL under this setup).
import helperSource from './uni-host.ts?raw';
import { resolveUniHost } from './uni-host';

describe('resolveUniHost', () => {
  it('should resolve the globalThis stub in a plain test host', () => {
    const stub = { getSystemInfoSync: () => ({ platform: 'mp-weixin' }) };
    const host = globalThis as { uni?: unknown };
    const original = host.uni;
    host.uni = stub;
    try {
      expect(resolveUniHost<{ getSystemInfoSync: () => unknown }>()).not.toBeNull();
      expect(resolveUniHost<{ getSystemInfoSync: () => unknown }>()?.getSystemInfoSync()).toEqual({
        platform: 'mp-weixin',
      });
    } finally {
      host.uni = original;
    }
  });

  it('should return null when no uni runtime exists', () => {
    const host = globalThis as { uni?: unknown };
    const original = host.uni;
    Reflect.deleteProperty(globalThis, 'uni');
    try {
      expect(resolveUniHost<unknown>()).toBeNull();
    } finally {
      host.uni = original;
    }
  });

  it('should read uni through the free identifier with a globalThis fallback', () => {
    // Regression (MP): the free identifier is the only channel the uni
    // compilers rewrite (`globalThis.uni` stays unset on classic MP). The
    // try/catch keeps hosts without any `uni` binding (plain vitest) on the
    // global slot, which is exactly what the test stubs target.
    expect(helperSource).toMatch(/return uni as T/);
    expect(helperSource).toMatch(/declare const uni: unknown/);
    expect(helperSource).toMatch(/globalThis as \{ uni\?: T \}/);
  });
});
