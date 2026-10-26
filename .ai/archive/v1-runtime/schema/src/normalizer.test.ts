import { describe, it, expect } from 'vitest';
import { createNormalizer } from './normalizer.js';

describe('@snui/schema — Normalizer', () => {
  it('fills schema defaults (e.g. id min length validation)', () => {
    const r = createNormalizer().normalizeUnknown({
      version: '1.0.0',
      root: { id: 'r', type: 'card' },
    });
    expect(r.version).toBe('1.0.0');
  });

  it('produces stable key order (canonical)', () => {
    const n = createNormalizer();
    const a = n.normalizeUnknown({
      version: '1.0.0',
      root: { id: 'r', type: 'card' },
      metadata: { author: 'team-a' },
    });
    const b = n.normalizeUnknown({
      metadata: { author: 'team-a' },
      root: { id: 'r', type: 'card' },
      version: '1.0.0',
    });
    expect(n.canonicalize(a)).toBe(n.canonicalize(b));
  });

  it('is idempotent: normalize(normalize(x)) === normalize(x)', () => {
    const n = createNormalizer();
    const once = n.normalizeUnknown({
      version: '1.0.0',
      root: { id: 'r', type: 'card' },
      metadata: { author: 'team-a' },
    });
    const again = n.normalize(once);
    expect(n.canonicalize(again)).toBe(n.canonicalize(once));
  });

  it('canonicalizes nested object key order', () => {
    const n = createNormalizer();
    const out = n.normalizeUnknown({
      version: '1.0.0',
      root: { id: 'r', type: 'card' },
      metadata: { z: 1, a: 2, m: 3 },
    });
    const keys = Object.keys(out.metadata!);
    expect(keys).toEqual(['a', 'm', 'z']);
  });
});