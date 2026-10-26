/**
 * sn-resize unit tests — element size observation (wot-ui `wd-resize` parity).
 *
 * Tests verify observable behaviour, not the polling internals (AGENTS.md §46):
 *   - the wrapper renders its slot and the measured container
 *   - `customClass` / `customStyle` / `customContainerClass` are forwarded
 *   - with no uni runtime (the vitest environment), nothing throws and no
 *     `resize` event is fabricated
 *   - the poll is disposed on unmount (§41)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnResize from './sn-resize.vue';

describe('sn-resize', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (globalThis as { uni?: unknown }).uni;
  });

  it('renders slot content inside the measured container', () => {
    const wrapper = mount(SnResize, { slots: { default: 'content' } });
    expect(wrapper.text()).toContain('content');
    expect(wrapper.find('.sn-resize__container').exists()).toBe(true);
  });

  it('forwards customClass and customStyle to the root', () => {
    const wrapper = mount(SnResize, {
      props: { customClass: 'my-wrap', customStyle: 'padding: 4px' },
      slots: { default: 'x' },
    });
    expect(wrapper.classes()).toContain('my-wrap');
    expect(wrapper.attributes('style')).toContain('padding: 4px');
  });

  it('forwards customContainerClass to the measured node', () => {
    const wrapper = mount(SnResize, {
      props: { customContainerClass: 'my-inner' },
      slots: { default: 'x' },
    });
    expect(wrapper.find('.sn-resize__container').classes()).toContain('my-inner');
  });

  it('exposes the component marker for inspection', () => {
    const wrapper = mount(SnResize, { slots: { default: 'x' } });
    expect(wrapper.attributes('data-snui-component')).toBe('resize');
  });

  it('does not emit without a uni runtime', async () => {
    const wrapper = mount(SnResize, { slots: { default: 'x' } });
    vi.advanceTimersByTime(500);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('resize')).toBeUndefined();
  });

  it('emits the measured box when the uni query reports one', async () => {
    const rect = { width: 120, height: 40, top: 10, left: 4, bottom: 50, right: 124 };
    const exec = vi.fn();
    const query = {
      in: () => query,
      select: () => ({
        boundingClientRect: (cb: (r: unknown) => void) => {
          cb(rect);
          return { exec };
        },
      }),
    };
    (globalThis as { uni?: unknown }).uni = { createSelectorQuery: () => query };

    const wrapper = mount(SnResize, { slots: { default: 'x' } });
    vi.advanceTimersByTime(200);
    await wrapper.vm.$nextTick();

    const events = wrapper.emitted('resize');
    expect(events).toBeDefined();
    expect(events?.[0]?.[0]).toEqual({
      width: 120,
      height: 40,
      top: 10,
      left: 4,
      bottom: 50,
      right: 124,
    });
  });

  it('suppresses repeat emissions for an unchanged box', async () => {
    const rect = { width: 120, height: 40, top: 10, left: 4, bottom: 50, right: 124 };
    const query = {
      in: () => query,
      select: () => ({
        boundingClientRect: (cb: (r: unknown) => void) => {
          cb(rect);
          return { exec: vi.fn() };
        },
      }),
    };
    (globalThis as { uni?: unknown }).uni = { createSelectorQuery: () => query };

    const wrapper = mount(SnResize, { slots: { default: 'x' } });
    vi.advanceTimersByTime(600);
    await wrapper.vm.$nextTick();

    // One emission, not six — the poll runs ~6 times in 600ms.
    expect(wrapper.emitted('resize')).toHaveLength(1);
  });

  it('stops polling after unmount', async () => {
    const rect = { width: 10, height: 10, top: 0, left: 0, bottom: 10, right: 10 };
    const boundingClientRect = vi.fn((cb: (r: unknown) => void) => {
      cb(rect);
      return { exec: vi.fn() };
    });
    const query = {
      in: () => query,
      select: () => ({ boundingClientRect }),
    };
    (globalThis as { uni?: unknown }).uni = { createSelectorQuery: () => query };

    const wrapper = mount(SnResize, { slots: { default: 'x' } });
    vi.advanceTimersByTime(300);
    const callsBeforeUnmount = boundingClientRect.mock.calls.length;

    wrapper.unmount();
    vi.advanceTimersByTime(1000);

    expect(boundingClientRect.mock.calls.length).toBe(callsBeforeUnmount);
  });
});
