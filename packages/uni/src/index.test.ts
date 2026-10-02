import { describe, it, expect } from 'vitest';
import { AUI_UNI_VERSION } from './index.js';

describe('@aui/uni', () => {
  it('exports a semver version constant', () => {
    expect(AUI_UNI_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});