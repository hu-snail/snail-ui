import { describe, it, expect } from 'vitest';
import { AUI_AI_VERSION } from './index.js';

describe('@aui/ai', () => {
  it('exports a semver version constant', () => {
    expect(AUI_AI_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});