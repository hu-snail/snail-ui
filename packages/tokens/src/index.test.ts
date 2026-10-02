import { describe, it, expect } from 'vitest';
import { AUI_TOKENS_VERSION } from './index.js';

describe('@aui/tokens', () => {
  it('exports a semver version constant', () => {
    expect(AUI_TOKENS_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});