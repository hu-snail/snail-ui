import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Packaging regression guards (§103) — the dist tree must be consumable via
 * the package exports map. Both bugs shipped silently once:
 *
 * 1. Generated components import `../../utils/*`, which resolved OUTSIDE the
 *    published package until cli.ts started emitting dist/utils/.
 * 2. `.ts` co-files imported types from `sn-icon.vue`, which does not exist
 *    in dist (only `.uvue`) — types now live in sn-icon-types.ts.
 */
describe('uni-x dist packaging', () => {
  const dist = resolve(__dirname, '../../../uni-x/dist');

  beforeAll(() => {
    execSync('node src/transform/cli.ts', { cwd: resolve(__dirname, '../..') });
  }, 240_000);

  it('should ship shared utils referenced by generated components', () => {
    for (const util of ['outside-close.ts', 'sn-lunar.ts', 'sn-size.ts', 'uid.ts']) {
      expect(existsSync(join(dist, 'utils', util)), `dist/utils/${util}`).toBe(true);
    }
  });

  it('should not leave .vue imports in emitted ts co-files', () => {
    const set = readFileSync(join(dist, 'components/sn-icon/sn-icon-set.ts'), 'utf8');
    expect(set).not.toMatch(/from\s+'\.[^']*\.vue'/);
    const registry = readFileSync(join(dist, 'components/sn-icon/sn-icon-registry.ts'), 'utf8');
    expect(registry).not.toMatch(/from\s+'\.[^']*\.vue'/);
  });

  it('should resolve every ../../utils import from dist/components', () => {
    const btn = readFileSync(join(dist, 'components/sn-button/sn-button.uvue'), 'utf8');
    const target = join(dist, 'components/sn-button', '../../utils/uid.ts');
    if (btn.includes('../../utils/')) {
      expect(existsSync(target), '../../utils target must exist in dist').toBe(true);
    }
  });
});
