import { describe, it, expect } from 'vitest';
import { UINodeSchema, type UINode } from './ui-node.js';

const minimalValid: UINode = { id: 'root', type: 'card' };

describe('@snui/protocol — UINodeSchema', () => {
  it('accepts a minimal valid UINode (id + type only)', () => {
    const result = UINodeSchema.safeParse(minimalValid);
    expect(result.success).toBe(true);
  });

  it('accepts an optional props record with JSON-compatible entries', () => {
    const result = UINodeSchema.safeParse({
      id: 'btn',
      type: 'button',
      props: { label: 'Submit', variant: 'primary', disabled: false },
    });
    expect(result.success).toBe(true);
  });

  it('accepts nested children (3 levels deep)', () => {
    const tree: UINode = {
      id: 'root',
      type: 'card',
      children: [
        {
          id: 'header',
          type: 'header',
          children: [
            {
              id: 'title',
              type: 'text',
              props: { content: 'Hello' },
            },
          ],
        },
        {
          id: 'body',
          type: 'text',
        },
      ],
    };
    const result = UINodeSchema.safeParse(tree);
    expect(result.success).toBe(true);
  });

  it('accepts forward-reference slots as arbitrary unknown', () => {
    const node: UINode = {
      id: 'a',
      type: 'input',
      bindings: { value: { $bind: 'local.form.email' } },
      events: { change: { action: 'submit' } },
      style: { color: 'red' },
      accessibility: { ariaLabel: 'Email field' },
      capability: { feature: 'autocomplete', fallback: 'input' },
    };
    const result = UINodeSchema.safeParse(node);
    expect(result.success).toBe(true);
  });

  it('rejects when id is missing', () => {
    const result = UINodeSchema.safeParse({ type: 'card' });
    expect(result.success).toBe(false);
  });

  it('rejects when type is missing', () => {
    const result = UINodeSchema.safeParse({ id: 'root' });
    expect(result.success).toBe(false);
  });

  it('rejects when id is an empty string', () => {
    const result = UINodeSchema.safeParse({ id: '', type: 'card' });
    expect(result.success).toBe(false);
  });

  it('rejects when type is an empty string', () => {
    const result = UINodeSchema.safeParse({ id: 'root', type: '' });
    expect(result.success).toBe(false);
  });

  it('rejects when children is not an array', () => {
    const result = UINodeSchema.safeParse({ id: 'root', type: 'card', children: 'not-array' });
    expect(result.success).toBe(false);
  });

  it('rejects unknown top-level keys (strict schema)', () => {
    const result = UINodeSchema.safeParse({ id: 'root', type: 'card', sneaky: 'oops' });
    expect(result.success).toBe(false);
  });
});