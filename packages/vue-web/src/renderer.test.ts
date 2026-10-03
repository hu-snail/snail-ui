import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { defineComponent, h } from 'vue';
import type { UISchema } from '@snui/protocol';
import { createComponentRegistry } from './registry.js';
import { Button } from './button.js';
import { createVueRenderer } from './renderer.js';

/**
 * End-to-end smoke test: build a UISchema → register components → mount via
 * the Vue renderer into a happy-dom target → verify real DOM output.
 *
 * This exercises the full Phase 1 → Phase 2 boundary (Vue renderer consuming
 * protocol schemas + protocol-defined component contracts). It's the closest
 * analog to "open the app" we have without a host playground.
 */

function buildTarget(): HTMLDivElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

function clearDom(): void {
  document.body.innerHTML = '';
}

describe('@snui/vue-web — End-to-end smoke', () => {
  let target: HTMLDivElement;
  beforeEach(() => {
    target = buildTarget();
  });
  afterEach(() => {
    clearDom();
  });

  it('mounts a Button and renders the bound text into the DOM', () => {
    const registry = createComponentRegistry();
    registry.register('button', Button);

    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'submit',
        type: 'button',
        props: { variant: 'primary', size: 'medium', text: 'Submit Order' },
      },
    };

    const app = createVueRenderer({ registry }).mount(schema, target);
    expect(app).toBeDefined();
    const btn = target.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn!.textContent?.trim()).toBe('Submit Order');
    expect(btn!.getAttribute('type')).toBe('button');
    app.unmount();
  });

  it('respects the Button variant + size prop (CSS var tokens)', () => {
    const registry = createComponentRegistry();
    registry.register('button', Button);

    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'b1',
        type: 'button',
        props: { variant: 'danger', size: 'large', text: 'Delete' },
      },
    };

    const app = createVueRenderer({ registry }).mount(schema, target);
    const btn = target.querySelector('button')!;
    expect(btn.textContent?.trim()).toBe('Delete');
    const style = btn.getAttribute('style') ?? '';
    expect(style).toContain('--aui-color-action-danger');
    // ButtonTokens.size.large.height → var(--aui-control-height-lg)
    expect(style).toContain('--aui-control-height-lg');
    expect(style).toContain('--aui-spacing-lg');
    app.unmount();
  });

  it('falls back to a registered "div" fallback when the type is unknown', () => {
    const registry = createComponentRegistry();
    registry.register('button', Button);
    // Provide a minimal div fallback (renderer falls back card → div).
    const DivFallback = defineComponent({
      name: 'SnuiDiv',
      setup(_props, { slots }) {
        return () => h('div', { class: 'snui-div' }, slots.default?.());
      },
    });
    registry.register('div', DivFallback);

    const schema: UISchema = {
      version: '1.0.0',
      root: { id: 'r', type: 'unknown-type' },
    };

    const app = createVueRenderer({ registry }).mount(schema, target);
    // The SnuiRoot wrapper uses <div> as its mount container too — count divs.
    const divs = target.querySelectorAll('div');
    expect(divs.length).toBeGreaterThan(0);
    // The fallback should have our marker class.
    expect(target.querySelector('div.snui-div')).not.toBeNull();
    app.unmount();
  });

  it('component registry resolves the registered Button component', () => {
    // Sanity check that vue-web's registry correctly tracks the Button component.
    const registry = createComponentRegistry();
    registry.register('button', Button);
    const component = registry.resolve('button');
    expect(component).toBeDefined();
    // Vue 3 components can be either a function or an object — defineComponent
    // returns an object with `.setup`/`.name`/etc.
    expect(['function', 'object']).toContain(typeof component);
    // The Vue component's own name comes from defineComponent({ name: 'SnuiButton' })
    expect((component as { name?: string }).name).toBe('SnuiButton');
  });
});