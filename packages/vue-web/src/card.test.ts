import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { UISchema } from '@snui/protocol';
import { createComponentRegistry } from './registry.js';
import { createVueRenderer } from './renderer.js';
import { Card } from './card.js';

/**
 * @snui/vue-web — Card component tests.
 *
 * Coverage:
 *   - Default Card renders title + description + body
 *   - Footer slot is rendered when provided
 *   - variant=elevated applies shadow token
 *   - bordered=false removes border styling
 *   - padding=lg applies the large padding token
 *   - Title / description ids are wired to aria-labelledby/aria-describedby
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
  registry.register('card', Card);
  return createVueRenderer({ registry }).mount(schema, target);
}

describe('@snui/vue-web — Card', () => {
  let target: HTMLDivElement;
  beforeEach(() => {
    target = buildTarget();
  });
  afterEach(() => {
    clearDom();
  });

  it('renders title + description + body content', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'card',
        type: 'card',
        props: {
          title: 'Order #1024',
          description: 'Placed today',
          bordered: true,
        },
        children: [
          { id: 'amount', type: 'card', props: { title: 'inside' } },
        ],
      },
    };
    const app = mount(schema, target);
    const card = target.querySelector('section.snui-card')!;
    expect(card).not.toBeNull();
    expect(card.getAttribute('role')).toBe('region');
    const title = card.querySelector('.snui-card__title');
    expect(title?.textContent).toBe('Order #1024');
    const desc = card.querySelector('.snui-card__description');
    expect(desc?.textContent).toBe('Placed today');
    // body should render the nested card
    expect(card.querySelector('.snui-card__body > section.snui-card')).not.toBeNull();
    app.unmount();
  });

  it('applies elevation styling when shadow=true', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'c',
        type: 'card',
        props: { title: 'Shadow', shadow: true },
      },
    };
    const app = mount(schema, target);
    const card = target.querySelector('section.snui-card')!;
    expect(card.classList.contains('snui-card--elevated')).toBe(true);
    const style = card.getAttribute('style') ?? '';
    expect(style).toContain('--aui-shadow-md');
    app.unmount();
  });

  it('removes bordered styling when bordered=false', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'c',
        type: 'card',
        props: { title: 'No border', bordered: false },
      },
    };
    const app = mount(schema, target);
    const card = target.querySelector('section.snui-card')!;
    expect(card.classList.contains('snui-card--bordered')).toBe(false);
    app.unmount();
  });

  it('applies large padding token when padding=lg', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'c',
        type: 'card',
        props: { title: 'Spacious', padding: 'lg' },
      },
    };
    const app = mount(schema, target);
    const card = target.querySelector('section.snui-card')!;
    const style = card.getAttribute('style') ?? '';
    expect(style).toContain('--aui-spacing-lg');
    app.unmount();
  });

  it('wires aria-labelledby + aria-describedby to title / description ids', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'c',
        type: 'card',
        props: { title: 'Aria', description: 'helper' },
      },
    };
    const app = mount(schema, target);
    const card = target.querySelector('section.snui-card')!;
    const labelledby = card.getAttribute('aria-labelledby');
    const describedby = card.getAttribute('aria-describedby');
    expect(labelledby).toBeTruthy();
    expect(describedby).toBeTruthy();
    const title = card.querySelector('.snui-card__title');
    expect(title?.id).toBe(labelledby);
    const desc = card.querySelector('.snui-card__description');
    expect(desc?.id).toBe(describedby);
    app.unmount();
  });

  it('omits header when both title and description are missing', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'c',
        type: 'card',
        props: {},
      },
    };
    const app = mount(schema, target);
    expect(target.querySelector('.snui-card__header')).toBeNull();
    expect(target.querySelector('.snui-card__title')).toBeNull();
    app.unmount();
  });

  it('omits footer when footer slot is empty', () => {
    const schema: UISchema = {
      version: '1.0.0',
      root: {
        id: 'c',
        type: 'card',
        props: { title: 'No footer' },
      },
    };
    const app = mount(schema, target);
    expect(target.querySelector('.snui-card__footer')).toBeNull();
    app.unmount();
  });
});