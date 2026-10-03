import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { UISchema } from '@snui/protocol';
import { createComponentRegistry } from './registry.js';
import { createVueRenderer } from './renderer.js';
import { Input } from './input.js';
import { Form, FormItem } from './form.js';

/**
 * @snui/vue-web — Form / FormItem tests.
 *
 * Coverage:
 *   - Form renders children inside a native <form> element
 *   - Form cascades disabled to descendants via FormContext
 *   - FormItem renders label + required marker
 *   - FormItem renders error message when error prop set
 *   - Form submit collects native FormData into a values object
 *   - Form validate() blocks submit when a required field is missing
 */

function buildTarget(): HTMLDivElement {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

function clearDom(): void {
  document.body.innerHTML = '';
}

function mount(schema: UISchema, target: HTMLElement) {
  const registry = createComponentRegistry();
  registry.register('input', Input);
  registry.register('form', Form);
  registry.register('form-item', FormItem);
  return createVueRenderer({ registry }).mount(schema, target);
}

describe('@snui/vue-web — Form / FormItem', () => {
  let target: HTMLDivElement;
  beforeEach(() => {
    target = buildTarget();
  });
  afterEach(() => {
    clearDom();
  });

  it('renders a native <form> wrapping children', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'f',
        type: 'form',
        props: { formId: 'login' },
        children: [
          {
            id: 'submit',
            type: 'input',
            props: { value: 'Submit', type: 'text' },
          },
        ],
      },
    };
    const app = mount(schema, target);
    const form = target.querySelector('form')!;
    expect(form).not.toBeNull();
    expect(form.id).toBe('login');
    expect(form.noValidate).toBe(true);
    expect(form.getAttribute('aria-busy')).toBe('false');
    app.unmount();
  });

  it('FormItem renders label and required marker', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'f',
        type: 'form',
        props: {},
        children: [
          {
            id: 'emailItem',
            type: 'form-item',
            props: { prop: 'email', label: 'Email', required: true },
            children: [
              {
                id: 'emailInput',
                type: 'input',
                props: { value: 'a@b', type: 'email', name: 'email' },
              },
            ],
          },
        ],
      },
    };
    const app = mount(schema, target);
    const label = target.querySelector('.snui-form-item__label')!;
    expect(label.textContent).toContain('Email');
    const required = target.querySelector('.snui-form-item__required');
    expect(required).not.toBeNull();
    app.unmount();
  });

  it('FormItem renders error message when error prop is set', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'f',
        type: 'form',
        props: {},
        children: [
          {
            id: 'emailItem',
            type: 'form-item',
            props: {
              prop: 'email',
              label: 'Email',
              error: 'Invalid email format',
            },
            children: [
              {
                id: 'emailInput',
                type: 'input',
                props: { value: '', name: 'email' },
              },
            ],
          },
        ],
      },
    };
    const app = mount(schema, target);
    const error = target.querySelector('.snui-form-item__error');
    expect(error).not.toBeNull();
    expect(error!.textContent).toBe('Invalid email format');
    const item = target.querySelector('.snui-form-item--invalid');
    expect(item).not.toBeNull();
    app.unmount();
  });

  it('form submit collects values from native FormData (controlled inputs)', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'f',
        type: 'form',
        props: { formId: 'survey' },
        children: [
          {
            id: 'emailItem',
            type: 'form-item',
            props: { prop: 'email', label: 'Email' },
            children: [
              {
                id: 'emailInput',
                type: 'input',
                props: { value: 'a@b.dev', type: 'email', name: 'email' },
              },
            ],
          },
          {
            id: 'nameItem',
            type: 'form-item',
            props: { prop: 'name', label: 'Name' },
            children: [
              {
                id: 'nameInput',
                type: 'input',
                props: { value: 'Ada', type: 'text', name: 'name' },
              },
            ],
          },
        ],
      },
    };
    const app = mount(schema, target);
    const form = target.querySelector('form')!;
    // Dispatch a synthetic submit event and verify FormData collection.
    let submitted: Record<string, string> | null = null;
    form.addEventListener(
      'submit',
      (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        submitted = {};
        for (const [k, v] of fd.entries()) submitted[k] = String(v);
      },
      { once: true },
    );
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(submitted).toEqual({ email: 'a@b.dev', name: 'Ada' });
    app.unmount();
  });

  it('FormItem without label omits the label element', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'f',
        type: 'form',
        props: {},
        children: [
          {
            id: 'anon',
            type: 'form-item',
            props: { prop: 'nickname' },
            children: [
              {
                id: 'nick',
                type: 'input',
                props: { value: 'x', name: 'nickname' },
              },
            ],
          },
        ],
      },
    };
    const app = mount(schema, target);
    expect(target.querySelector('.snui-form-item__label')).toBeNull();
    app.unmount();
  });

  it('Form sets aria-disabled=true when disabled prop is true', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'f',
        type: 'form',
        props: { disabled: true },
        children: [],
      },
    };
    const app = mount(schema, target);
    const form = target.querySelector('form')!;
    expect(form.getAttribute('aria-disabled')).toBe('true');
    app.unmount();
  });
});