import { beforeEach, describe, expect, it } from 'vitest';
import { ChevronRight } from './sn-icon-set';
import { clearSnIcons, registerSnIcons, resolveIconByName } from './sn-icon-registry';
import type { IconData } from './sn-icon.vue';

const myIcon: IconData = { viewBox: '0 0 16 16', paths: ['M2 8h12'] };

/**
 * The registry is module state by design (write-once at app bootstrap), so
 * every test starts from a clean map to stay order-independent.
 */
describe('sn-icon-registry', () => {
  beforeEach(() => {
    clearSnIcons();
  });

  it('resolves nothing before anything is registered', () => {
    expect(resolveIconByName('ChevronRight')).toBeUndefined();
  });

  it('returns the registered icon data object for a known name', () => {
    registerSnIcons({ ChevronRight });
    expect(resolveIconByName('ChevronRight')).toBe(ChevronRight);
  });

  it('merges new registrations without dropping earlier ones', () => {
    registerSnIcons({ ChevronRight });
    registerSnIcons({ Mine: myIcon });
    expect(resolveIconByName('ChevronRight')).toBe(ChevronRight);
    expect(resolveIconByName('Mine')).toBe(myIcon);
  });

  it('overwrites a previously registered name', () => {
    registerSnIcons({ Mine: ChevronRight });
    registerSnIcons({ Mine: myIcon });
    expect(resolveIconByName('Mine')).toBe(myIcon);
  });

  it('empties the registry on clearSnIcons', () => {
    registerSnIcons({ ChevronRight });
    clearSnIcons();
    expect(resolveIconByName('ChevronRight')).toBeUndefined();
  });
});
