import { describe, it, expect } from 'vitest';
import { compileExpression, evaluateExpression, type BindingContext } from './expression.js';
import { isAUIError } from './error.js';

const ctx: BindingContext = {
  state: { user: { name: 'snail', age: 30 }, count: 0 },
  props: { title: 'AUI', level: 3 },
  computed: { greeting: 'hello' },
};

describe('@snui/runtime — Safe Expression', () => {
  it('evaluates literals', () => {
    expect(evaluateExpression('42', ctx)).toBe(42);
    expect(evaluateExpression('"hello"', ctx)).toBe('hello');
    expect(evaluateExpression("'world'", ctx)).toBe('world');
    expect(evaluateExpression('true', ctx)).toBe(true);
    expect(evaluateExpression('null', ctx)).toBe(null);
  });

  it('reads state paths', () => {
    expect(evaluateExpression('state.user.name', ctx)).toBe('snail');
    expect(evaluateExpression('state.user.age', ctx)).toBe(30);
    expect(evaluateExpression('state.count', ctx)).toBe(0);
  });

  it('reads props paths', () => {
    expect(evaluateExpression('props.title', ctx)).toBe('AUI');
  });

  it('reads computed paths', () => {
    expect(evaluateExpression('computed.greeting', ctx)).toBe('hello');
  });

  it('returns undefined for missing paths (no throw)', () => {
    expect(evaluateExpression('state.user.email', ctx)).toBeUndefined();
    expect(evaluateExpression('state.deeply.nested.thing', ctx)).toBeUndefined();
  });

  it('handles arithmetic', () => {
    expect(evaluateExpression('1 + 2 * 3', ctx)).toBe(7);
    expect(evaluateExpression('(1 + 2) * 3', ctx)).toBe(9);
    expect(evaluateExpression('10 - 4', ctx)).toBe(6);
    expect(evaluateExpression('10 / 4', ctx)).toBe(2.5);
    expect(evaluateExpression('10 % 3', ctx)).toBe(1);
    expect(evaluateExpression('-5', ctx)).toBe(-5);
    expect(evaluateExpression('+5', ctx)).toBe(5);
  });

  it('handles string concat with +', () => {
    expect(evaluateExpression('"hi " + "there"', ctx)).toBe('hi there');
  });

  it('handles comparison operators', () => {
    expect(evaluateExpression('1 === 1', ctx)).toBe(true);
    expect(evaluateExpression('1 !== 2', ctx)).toBe(true);
    expect(evaluateExpression('1 < 2', ctx)).toBe(true);
    expect(evaluateExpression('2 > 1', ctx)).toBe(true);
    expect(evaluateExpression('1 <= 1', ctx)).toBe(true);
    expect(evaluateExpression('2 >= 2', ctx)).toBe(true);
    expect(evaluateExpression('1 == "1"', ctx)).toBe(true);
    expect(evaluateExpression('null == undefined', ctx)).toBe(true);
  });

  it('handles logical operators', () => {
    expect(evaluateExpression('true && false', ctx)).toBe(false);
    expect(evaluateExpression('true || false', ctx)).toBe(true);
    expect(evaluateExpression('!true', ctx)).toBe(false);
    expect(evaluateExpression('!0', ctx)).toBe(true);
  });

  it('handles ternary', () => {
    expect(evaluateExpression('true ? "yes" : "no"', ctx)).toBe('yes');
    expect(evaluateExpression('false ? "yes" : "no"', ctx)).toBe('no');
    expect(evaluateExpression('state.user.age > 18 ? "adult" : "minor"', ctx)).toBe('adult');
  });

  it('combines operators with precedence', () => {
    expect(evaluateExpression('1 + 2 === 3', ctx)).toBe(true);
    expect(evaluateExpression('1 + 2 * 3 === 7', ctx)).toBe(true);
    expect(evaluateExpression('(1 + 2) * 3 === 9', ctx)).toBe(true);
  });

  it('compileExpression returns reusable handle', () => {
    const c = compileExpression('state.count + 1');
    expect(c.source).toBe('state.count + 1');
    expect(c.evaluate(ctx)).toBe(1);
    expect(c.evaluate(ctx)).toBe(1);
  });

  it('rejects invalid syntax with AUI_EXPRESSION_INVALID', () => {
    try {
      evaluateExpression('state..user..estud..', ctx);
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      const a = e as { code: string };
      expect(a.code).toBe('AUI_EXPRESSION_INVALID');
    }
  });

  it('rejects unterminated string', () => {
    expect(() => evaluateExpression('"open string', ctx)).toThrow(
      expect.objectContaining({ code: 'AUI_EXPRESSION_INVALID' }),
    );
  });

  it('rejects unknown character', () => {
    expect(() => evaluateExpression('1 @ 2', ctx)).toThrow(
      expect.objectContaining({ code: 'AUI_EXPRESSION_INVALID' }),
    );
  });

  it('does NOT execute window / globalThis / etc', () => {
    // The expression engine has no `window` symbol in scope; this must return
    // undefined rather than throw or expose anything dangerous.
    expect(evaluateExpression('window', ctx)).toBeUndefined();
    expect(evaluateExpression('globalThis', ctx)).toBeUndefined();
    expect(evaluateExpression('document', ctx)).toBeUndefined();
  });
});