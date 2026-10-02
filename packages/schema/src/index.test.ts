import { describe, it, expect } from 'vitest';
import { AUI_SCHEMA_VERSION } from './index.js';

describe('@aui/schema', () => {
  it('exports a semver version constant', () => {
    expect(AUI_SCHEMA_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});