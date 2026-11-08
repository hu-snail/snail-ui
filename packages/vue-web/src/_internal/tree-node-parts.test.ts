import { afterEach, describe, expect, it } from 'vitest';
import { h, isVNode } from 'vue';
import { mount } from '@vue/test-utils';
import { resolveTreeIcon, SnTreePart } from './tree-node-parts';
import { clearSnIcons, registerSnIcons } from '../icon/sn-icon-registry';

afterEach(() => {
  clearSnIcons();
});

describe('resolveTreeIcon', () => {
  it('returns null when no icon is configured', () => {
    expect(resolveTreeIcon(undefined)).toBe(null);
    expect(resolveTreeIcon(null)).toBe(null);
    expect(resolveTreeIcon(false)).toBe(null);
  });

  it('passes a VNode and a VNode array through untouched', () => {
    const vnode = h('svg', { viewBox: '0 0 24 24' });
    expect(resolveTreeIcon(vnode)).toBe(vnode);
    expect(resolveTreeIcon([vnode])).toEqual([vnode]);
  });

  it('mounts an icon component or a render fn as a VNode', () => {
    const icon = () => h('span', { class: 'probe-icon' });
    expect(isVNode(resolveTreeIcon(icon))).toBe(true);
    expect(isVNode(resolveTreeIcon(h('i')))).toBe(true);
  });

  it('resolves registered icon names through SnIcon', () => {
    registerSnIcons({ ProbeIcon: () => h('svg') });
    const result = resolveTreeIcon('ProbeIcon');
    expect(isVNode(result)).toBe(true);
    const w = mount({ render: () => result });
    expect(w.find('.sn-icon').exists()).toBe(true);
  });

  it('falls back to plain text for an unregistered name', () => {
    expect(resolveTreeIcon('Folder')).toBe('Folder');
  });
});

describe('SnTreePart', () => {
  it('renders a VNode instead of stringifying its circular object graph', () => {
    const w = mount(SnTreePart, {
      props: { content: h('span', { class: 'probe-icon' }, 'icon') },
    });
    expect(w.find('.probe-icon').text()).toBe('icon');
  });

  it('renders text and null parts', () => {
    expect(mount(SnTreePart, { props: { content: 'TS' } }).text()).toBe('TS');
    expect(mount(SnTreePart, { props: { content: null } }).text()).toBe('');
  });
});
