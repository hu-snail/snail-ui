import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { createComponentRegistry } from './registry.js';

const stubComponent = defineComponent({
  name: 'StubComponent',
  render: () => h('div'),
});

describe('@snui/vue-web — ComponentRegistry', () => {
  it('registers and resolves a component by type', () => {
    const r = createComponentRegistry();
    r.register('stub', stubComponent);
    expect(r.resolve('stub')).toBe(stubComponent);
    expect(r.has('stub')).toBe(true);
  });

  it('returns undefined for unknown types', () => {
    const r = createComponentRegistry();
    expect(r.resolve('unknown')).toBeUndefined();
    expect(r.has('unknown')).toBe(false);
  });

  it('rejects duplicate registration', () => {
    const r = createComponentRegistry();
    r.register('dup', stubComponent);
    expect(() => r.register('dup', stubComponent)).toThrow(/already registered/);
  });

  it('rejects empty type strings', () => {
    const r = createComponentRegistry();
    expect(() => r.register('', stubComponent)).toThrow(/non-empty string/);
  });

  it('removes a registered type', () => {
    const r = createComponentRegistry();
    r.register('x', stubComponent);
    expect(r.remove('x')).toBe(true);
    expect(r.has('x')).toBe(false);
  });

  it('returns false when removing a non-registered type', () => {
    const r = createComponentRegistry();
    expect(r.remove('nope')).toBe(false);
  });

  it('lists registered types as a frozen array', () => {
    const r = createComponentRegistry();
    r.register('a', stubComponent);
    r.register('b', stubComponent);
    const list = r.list();
    expect(list).toEqual(['a', 'b']);
    expect(Object.isFrozen(list)).toBe(true);
  });

  it('seeds with initial components via constructor', () => {
    const seed = new Map([['preset', stubComponent]]);
    const r = createComponentRegistry(seed);
    expect(r.has('preset')).toBe(true);
  });
});