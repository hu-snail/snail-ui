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

import { describe, expect, it, vi } from 'vitest';
// Vite-native raw import — reads the helper as text without filesystem path
// gymnastics (vitest's import.meta.url is not a file:// URL under this setup).
import helperSource from './uni-host.ts?raw';
import { pickSelectorQueryHost, resolveUniHost } from './uni-host';

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

describe('pickSelectorQueryHost', () => {
  const makeHost = () => {
    const exec = vi.fn();
    return {
      exec,
      host: {
        createSelectorQuery: () => ({
          in: vi.fn(),
          select: () => ({
            boundingClientRect: (cb: (rect: { width: number }) => void) => {
              cb({ width: 120 });
              return { exec };
            },
          }),
          exec,
        }),
      } as never,
    };
  };

  it('should prefer the mp $scope host so the query scopes to the component subtree', () => {
    const scope = makeHost();
    const uniHost = makeHost();
    const picked = pickSelectorQueryHost(scope.host, uniHost.host, 'proxy');
    expect(picked).not.toBeNull();
    expect(picked?.queryScope).toBe(scope.host);
    expect(picked?.createQuery).toBe(scope.host.createSelectorQuery);
  });

  it('should fall back to the uni host with the component proxy as query scope', () => {
    const uniHost = makeHost();
    const picked = pickSelectorQueryHost(undefined, uniHost.host, 'proxy');
    expect(picked).not.toBeNull();
    expect(picked?.createQuery).toBe(uniHost.host.createSelectorQuery);
    expect(picked?.queryScope).toBe('proxy');
  });

  it('should return null when neither host can create queries', () => {
    expect(pickSelectorQueryHost(undefined, undefined, 'proxy')).toBeNull();
    expect(pickSelectorQueryHost({ /* no createSelectorQuery */ }, {}, 'proxy')).toBeNull();
  });
});
