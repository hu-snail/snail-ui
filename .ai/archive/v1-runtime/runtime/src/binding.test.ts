import { describe, it, expect } from 'vitest';
import type { UIBinding, UIAction } from '@snui/protocol';
import {
  resolveBinding,
  matchEventBindings,
  dispatchEvent,
  resolveEventAction,
  type BindingContext,
} from './index.js';
import { isAUIError } from './error.js';

const ctx: BindingContext = {
  state: { user: { name: 'snail' }, form: { email: 'a@b.c' } },
  props: { title: 'AUI', meta: { id: 'p1' } },
  computed: { fullName: 'snail aui' },
};

const ACTIONS: UIAction[] = [
  { id: 'submit', type: 'http' },
  { id: 'reset', type: 'state' },
];

describe('@snui/runtime — Binding Resolver', () => {
  it('resolves state binding', () => {
    const b: UIBinding = { kind: 'state', path: 'user.name' };
    expect(resolveBinding(b, ctx).value).toBe('snail');
  });

  it('resolves state binding with deeper dot path', () => {
    const b: UIBinding = { kind: 'state', path: 'form.email' };
    expect(resolveBinding(b, ctx).value).toBe('a@b.c');
  });

  it('resolves computed binding', () => {
    const b: UIBinding = { kind: 'computed', name: 'fullName' };
    expect(resolveBinding(b, ctx).value).toBe('snail aui');
  });

  it('resolves prop binding (strips props. prefix)', () => {
    const b: UIBinding = { kind: 'prop', path: 'props.title' };
    expect(resolveBinding(b, ctx).value).toBe('AUI');
    const b2: UIBinding = { kind: 'prop', path: 'props.meta.id' };
    expect(resolveBinding(b2, ctx).value).toBe('p1');
  });

  it('resolves expression binding via the safe engine', () => {
    const b: UIBinding = { kind: 'expression', expr: 'state.user.name + " <" + props.title + ">"' };
    expect(resolveBinding(b, ctx).value).toBe('snail <AUI>');
  });

  it('resolves event binding to its trigger name', () => {
    const b: UIBinding = { kind: 'event', trigger: 'click' };
    const out = resolveBinding(b, ctx);
    expect(out.kind).toBe('event');
    expect((out as unknown as { trigger: string }).trigger).toBe('click');
  });

  it('throws on missing computed binding with stable code', () => {
    const b: UIBinding = { kind: 'computed', name: 'doesNotExist' };
    try {
      resolveBinding(b, ctx);
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      expect((e as { code: string }).code).toBe('AUI_BINDING_COMPUTED_MISSING');
    }
  });

  it('throws on prop binding missing props. prefix', () => {
    const b = { kind: 'prop', path: 'title' } as unknown as UIBinding;
    try {
      resolveBinding(b, ctx);
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      expect((e as { code: string }).code).toBe('AUI_BINDING_PROP_INVALID');
    }
  });
});

describe('@snui/runtime — Event Binding Dispatch', () => {
  it('matchEventBindings returns bindings whose trigger matches the fired event', () => {
    const node = {
      id: 'n1',
      events: {
        click: { kind: 'event', trigger: 'click' } as UIBinding,
        change: { kind: 'event', trigger: 'change' } as UIBinding,
      },
    };
    const matched = matchEventBindings({ node, event: { type: 'click' }, context: ctx });
    expect(matched.length).toBe(1);
    expect((matched[0]! as { trigger: string }).trigger).toBe('click');
  });

  it('dispatchEvent returns trigger + value + context for every match', () => {
    const node = {
      id: 'n1',
      events: {
        click: { kind: 'event', trigger: 'click' } as UIBinding,
      },
    };
    const dispatched = dispatchEvent({
      node,
      event: { type: 'click', value: { x: 1 } },
      context: ctx,
    });
    expect(dispatched.length).toBe(1);
    expect(dispatched[0]!.trigger).toBe('click');
    expect(dispatched[0]!.value).toEqual({ x: 1 });
    expect(dispatched[0]!.context).toBe(ctx);
  });

  it('resolveEventAction finds action by trigger id', () => {
    const node = {
      id: 'n1',
      events: {
        submit: { kind: 'event', trigger: 'click' } as UIBinding,
        reset: { kind: 'event', trigger: 'click' } as UIBinding,
      },
    };
    const actions = resolveEventAction({ node, event: { type: 'click' }, context: ctx }, ACTIONS);
    expect(actions.map((a) => a.id).sort()).toEqual(['reset', 'submit']);
  });

  it('resolveEventAction returns [] when no events match', () => {
    const node = {
      id: 'n1',
      events: { click: { kind: 'event', trigger: 'click' } as UIBinding },
    };
    const actions = resolveEventAction({ node, event: { type: 'blur' }, context: ctx }, ACTIONS);
    expect(actions.length).toBe(0);
  });

  it('rejects non-event bindings on a node.events slot', () => {
    const node = {
      id: 'n1',
      events: {
        click: { kind: 'state', path: 'foo' } as unknown as UIBinding,
      },
    };
    try {
      matchEventBindings({ node, event: { type: 'click' }, context: ctx });
      expect.fail('should have thrown');
    } catch (e) {
      expect(isAUIError(e)).toBe(true);
      expect((e as { code: string }).code).toBe('AUI_BINDING_EVENT_KIND_MISMATCH');
    }
  });
});