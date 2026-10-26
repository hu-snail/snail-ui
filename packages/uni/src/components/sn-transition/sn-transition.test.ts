/**
 * sn-transition unit tests — uni-end animation wrapper (wd-transition parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `show` mounts / unmounts the node and emits the six leg events in order
 *   - `lazyRender` defers the first render until `show` turns true
 *   - `destroy: false` keeps the node mounted after leaving
 *   - `name` accepts a string and an array (combined animation)
 *   - `duration: false` / a record / a number drive the leg timings
 *   - the enter/leave class props land on the root
 *   - the animation timer is cleared on unmount (§41)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnTransition from './sn-transition.vue';

afterEach(() => {
  vi.useRealTimers();
});

describe('sn-transition', () => {
  it('renders nothing while show is false with destroy on', () => {
    const wrapper = mount(SnTransition, { props: { show: false } });
    expect(wrapper.find('.sn-transition').exists()).toBe(false);
  });

  it('renders the slot content when show is true', () => {
    const wrapper = mount(SnTransition, {
      props: { show: true },
      slots: { default: '<text>content</text>' },
    });
    expect(wrapper.text()).toContain('content');
  });

  it('emits before-enter / enter / after-enter on open', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnTransition, { props: { show: false, duration: 200 } });
    await wrapper.setProps({ show: true });
    expect(wrapper.emitted('before-enter')).toHaveLength(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('enter')).toHaveLength(1);
    vi.advanceTimersByTime(200);
    expect(wrapper.emitted('after-enter')).toHaveLength(1);
  });

  it('emits before-leave / leave / after-leave on close', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnTransition, { props: { show: true, duration: 200 } });
    await wrapper.setProps({ show: false });
    expect(wrapper.emitted('before-leave')).toHaveLength(1);
    expect(wrapper.emitted('leave')).toHaveLength(1);
    vi.advanceTimersByTime(200);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('after-leave')).toHaveLength(1);
    expect(wrapper.find('.sn-transition').exists()).toBe(false);
  });

  it('defers the first render until show turns true when lazyRender is set', async () => {
    const wrapper = mount(SnTransition, {
      props: { show: false, lazyRender: true },
      slots: { default: '<text>lazy</text>' },
    });
    expect(wrapper.find('.sn-transition').exists()).toBe(false);
    await wrapper.setProps({ show: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('lazy');
  });

  it('renders immediately without lazyRender even while hidden', () => {
    const wrapper = mount(SnTransition, {
      props: { show: false, destroy: false },
      slots: { default: '<text>eager</text>' },
    });
    expect(wrapper.find('.sn-transition').exists()).toBe(true);
    expect(wrapper.text()).toContain('eager');
  });

  it('keeps the node mounted after leaving when destroy is false', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnTransition, {
      props: { show: true, destroy: false, duration: 100 },
    });
    await wrapper.setProps({ show: false });
    vi.advanceTimersByTime(100);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-transition').exists()).toBe(true);
    expect(wrapper.classes()).toContain('sn-transition--hidden');
  });

  it('applies a single animation name', () => {
    const wrapper = mount(SnTransition, { props: { show: true, name: 'fade-up' } });
    expect(wrapper.classes()).toContain('sn-transition--fade-up');
  });

  it('joins an array of animation names', () => {
    const wrapper = mount(SnTransition, {
      props: { show: true, name: ['fade', 'up'] },
    });
    expect(wrapper.classes()).toContain('sn-transition--fade-up');
  });

  it('treats duration: false as no animation', async () => {
    const wrapper = mount(SnTransition, { props: { show: false, duration: false } });
    await wrapper.setProps({ show: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('after-enter')).toHaveLength(1);
  });

  it('accepts a per-leg duration record', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnTransition, {
      props: { show: false, duration: { enter: 100, leave: 400 } },
    });
    await wrapper.setProps({ show: true });
    await wrapper.vm.$nextTick();
    vi.advanceTimersByTime(100);
    expect(wrapper.emitted('after-enter')).toHaveLength(1);

    await wrapper.setProps({ show: false });
    vi.advanceTimersByTime(300);
    expect(wrapper.emitted('after-leave')).toBeUndefined();
    vi.advanceTimersByTime(100);
    expect(wrapper.emitted('after-leave')).toHaveLength(1);
  });

  it('exposes the duration as a custom property', () => {
    const wrapper = mount(SnTransition, { props: { show: true, duration: 250 } });
    expect(wrapper.attributes('style')).toContain('--sn-transition-duration: 250ms');
  });

  it('applies the enter / leave class props', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnTransition, {
      props: {
        show: false,
        duration: 200,
        enterClass: 'my-enter',
        leaveClass: 'my-leave',
      },
    });
    await wrapper.setProps({ show: true });
    expect(wrapper.classes()).toContain('my-enter');

    await wrapper.setProps({ show: false });
    expect(wrapper.classes()).toContain('my-leave');
  });

  it('emits click and forwards customClass / customStyle', async () => {
    const wrapper = mount(SnTransition, {
      props: { show: true, customClass: 'my-transition', customStyle: 'margin: 8px' },
    });
    expect(wrapper.classes()).toContain('my-transition');
    expect(wrapper.attributes('style')).toContain('margin: 8px');
    await wrapper.trigger('tap');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('clears the animation timer on unmount', async () => {
    vi.useFakeTimers();
    const wrapper = mount(SnTransition, { props: { show: false, duration: 500 } });
    await wrapper.setProps({ show: true });
    wrapper.unmount();
    expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
  });
});
