import { describe, it, expect } from 'vitest';
import { AUI_VUE_WEB_VERSION } from './index.js';

describe('@aui/vue-web', () => {
  it('exports a semver version constant', () => {
    expect(AUI_VUE_WEB_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});