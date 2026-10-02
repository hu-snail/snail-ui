import { describe, it, expect } from 'vitest';
import { AUI_PROTOCOL_VERSION } from './index.js';

describe('@aui/protocol', () => {
  it('exports a semver version constant', () => {
    expect(AUI_PROTOCOL_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});