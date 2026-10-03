import { describe, it, expect } from 'vitest';
import { createAUIError, isAUIError, toAUIError, ERROR_CODE_NAMESPACE } from './error.js';

describe('@snui/runtime — AUIError', () => {
  it('auto-prefixes code with the AUI_ namespace', () => {
    const e = createAUIError({ code: 'RUNTIME_BOOM', message: 'fail' });
    expect(e.code.startsWith(ERROR_CODE_NAMESPACE)).toBe(true);
    expect(e.code).toBe('AUI_RUNTIME_BOOM');
  });

  it('does not double-prefix an already-namespaced code', () => {
    const e = createAUIError({ code: 'AUI_RUNTIME_BOOM', message: 'fail' });
    expect(e.code).toBe('AUI_RUNTIME_BOOM');
  });

  it('rejects empty message', () => {
    expect(() => createAUIError({ code: 'X', message: '' })).toThrow();
    expect(() => createAUIError({ code: 'X', message: '   ' })).toThrow();
  });

  it('rejects non UPPER_SNAKE_CASE code', () => {
    expect(() => createAUIError({ code: 'lower-case', message: 'x' })).toThrow();
    expect(() => createAUIError({ code: 'MixedCase', message: 'x' })).toThrow();
  });

  it('isAUIError identifies structured errors', () => {
    expect(isAUIError(createAUIError({ code: 'OK', message: 'y' }))).toBe(true);
    expect(isAUIError(new Error('plain'))).toBe(false);
    expect(isAUIError(null)).toBe(false);
    expect(isAUIError('string')).toBe(false);
  });

  it('toAUIError wraps native Error preserving cause', () => {
    const original = new Error('boom');
    const wrapped = toAUIError(original);
    expect(wrapped.code.startsWith('AUI_')).toBe(true);
    expect(wrapped.message).toBe('boom');
    expect(wrapped.cause).toBe(original);
  });

  it('frozen — mutation throws in strict mode', () => {
    const e = createAUIError({ code: 'OK', message: 'y' });
    expect(Object.isFrozen(e)).toBe(true);
  });
});