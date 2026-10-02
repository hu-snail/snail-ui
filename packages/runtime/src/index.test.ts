import { describe, it, expect } from 'vitest';
import { AUI_RUNTIME_VERSION } from './index.js';

describe('@aui/runtime', () => {
  it('exports a semver version constant', () => {
    expect(AUI_RUNTIME_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});