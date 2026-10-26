/**
 * sn-popup unit tests — uni-end positioned popup (wd-popup parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - v-model controls presence; `update:modelValue` + `close` fire on close
 *   - `position` / `round` / `closable` drive the class surface
 *   - `closeOnClickModal` decides whether a scrim tap closes
 *   - `lazyRender` defers slot rendering until the first open
 *   - `hideWhenClose=false` keeps the node mounted after closing
 *   - the animation timer is cleared on unmount (§41)
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnPopup from './sn-popup.vue';

describe('sn-popup', () => {
  it('renders nothing when modelValue is false', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: false } });
    expect(wrapper.find('.sn-popup').exists()).toBe(false);
  });

  it('renders the panel and slot content when modelValue is true', () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true },
      slots: { default: '<text>panel body</text>' },
    });
    expect(wrapper.find('.sn-popup__panel').exists()).toBe(true);
    expect(wrapper.text()).toContain('panel body');
  });

  it('defaults to the center anchor with the fade animation', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true } });
    expect(wrapper.classes()).toContain('sn-popup--center');
    expect(wrapper.classes()).toContain('sn-popup--anim-fade');
  });

  it('applies the anchor-specific class for each position', () => {
    for (const position of ['center', 'top', 'bottom', 'left', 'right'] as const) {
      const wrapper = mount(SnPopup, { props: { modelValue: true, position } });
      expect(wrapper.classes()).toContain(`sn-popup--${position}`);
    }
  });

  it('picks a slide animation that matches the anchor by default', () => {
    const bottom = mount(SnPopup, { props: { modelValue: true, position: 'bottom' } });
    expect(bottom.classes()).toContain('sn-popup--anim-slide-up');

    const right = mount(SnPopup, { props: { modelValue: true, position: 'right' } });
    expect(right.classes()).toContain('sn-popup--anim-slide-left');
  });

  it('lets `transition` override the anchor default', () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, position: 'bottom', transition: 'zoom-in' },
    });
    expect(wrapper.classes()).toContain('sn-popup--anim-zoom-in');
    expect(wrapper.classes()).not.toContain('sn-popup--anim-slide-up');
  });

  it('renders the close button only when closable', () => {
    const without = mount(SnPopup, { props: { modelValue: true } });
    expect(without.find('.sn-popup__close').exists()).toBe(false);

    const withClose = mount(SnPopup, { props: { modelValue: true, closable: true } });
    expect(withClose.find('.sn-popup__close').exists()).toBe(true);
    expect(withClose.find('.sn-popup__close').attributes('role')).toBe('button');
  });

  it('closes via the close button (update:modelValue + close)', async () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, closable: true } });
    await wrapper.find('.sn-popup__close').trigger('tap');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('closes on scrim tap by default and emits click-modal', async () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true } });
    await wrapper.find('.sn-popup__modal').trigger('tap');
    expect(wrapper.emitted('click-modal')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('emits click-modal but stays open when closeOnClickModal is false', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, closeOnClickModal: false },
    });
    await wrapper.find('.sn-popup__modal').trigger('tap');
    expect(wrapper.emitted('click-modal')).toHaveLength(1);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.emitted('close')).toBeUndefined();
  });

  it('omits the scrim when modal is false', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, modal: false } });
    expect(wrapper.find('.sn-popup__modal').exists()).toBe(false);
  });

  it('defers slot rendering until the first open when lazyRender is on', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: false, lazyRender: true, duration: false },
      slots: { default: '<text>lazy body</text>' },
    });
    expect(wrapper.text()).not.toContain('lazy body');

    await wrapper.setProps({ modelValue: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('lazy body');
  });

  it('renders the slot immediately when lazyRender is off', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, lazyRender: false },
      slots: { default: '<text>eager body</text>' },
    });
    expect(wrapper.text()).toContain('eager body');
  });

  it('finishes the leave leg when the popup closes inside the enter tick (regression)', async () => {
    vi.useFakeTimers();
    try {
      // Open then immediately close: the enter leg is still awaiting its tick,
      // so without a generation guard its timer would clobber the leave timer
      // and `after-leave` would never fire.
      const wrapper = mount(SnPopup, { props: { modelValue: false, duration: 200 } });
      await wrapper.setProps({ modelValue: true });
      await wrapper.setProps({ modelValue: false });
      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('after-leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('adds the round class and the safe-area class', () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, round: true, safeAreaInsetBottom: true },
    });
    expect(wrapper.classes()).toContain('sn-popup--round');
    expect(wrapper.classes()).toContain('sn-popup--safe-bottom');
  });

  it('forwards zIndex, customClass, customStyle and modalStyle', () => {
    const wrapper = mount(SnPopup, {
      // `8px`, not `8rpx`: happy-dom drops CSS lengths it cannot parse.
      props: {
        modelValue: true,
        zIndex: 42,
        customClass: 'my-popup',
        customStyle: 'padding: 8px',
        modalStyle: 'opacity: 0.5',
      },
    });
    expect(wrapper.classes()).toContain('my-popup');
    expect(wrapper.attributes('style')).toContain('z-index: 42');
    expect(wrapper.find('.sn-popup__panel').attributes('style')).toContain('padding: 8px');
    expect(wrapper.find('.sn-popup__modal').attributes('style')).toContain('opacity: 0.5');
  });

  it('emits the enter legs when modelValue flips to true', async () => {
    const wrapper = mount(SnPopup, { props: { modelValue: false, duration: false } });
    await wrapper.setProps({ modelValue: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('before-enter')).toHaveLength(1);
    expect(wrapper.emitted('enter')).toHaveLength(1);
    expect(wrapper.emitted('after-enter')).toHaveLength(1);
  });

  it('emits the leave legs and unmounts after the leave duration', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(SnPopup, { props: { modelValue: true, duration: 300 } });
      await wrapper.setProps({ modelValue: false });
      expect(wrapper.emitted('before-leave')).toHaveLength(1);
      expect(wrapper.emitted('leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(true);

      vi.advanceTimersByTime(300);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('after-leave')).toHaveLength(1);
      expect(wrapper.find('.sn-popup').exists()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps the node after closing when hideWhenClose is false', async () => {
    const wrapper = mount(SnPopup, {
      props: { modelValue: true, hideWhenClose: false, duration: false },
    });
    await wrapper.setProps({ modelValue: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-popup').exists()).toBe(true);
    expect(wrapper.classes()).toContain('sn-popup--hidden');
  });

  it('intercepts the touchmove gesture on the scrim when lockScroll is on', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, lockScroll: true } });
    const event = new Event('touchmove', { cancelable: true, bubbles: true });
    wrapper.find('.sn-popup__modal').element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('lets the touchmove gesture through when lockScroll is off', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true, lockScroll: false } });
    const event = new Event('touchmove', { cancelable: true, bubbles: true });
    wrapper.find('.sn-popup__modal').element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('marks the panel as a modal dialog for assistive tech', () => {
    const wrapper = mount(SnPopup, { props: { modelValue: true } });
    const panel = wrapper.find('.sn-popup__panel');
    expect(panel.attributes('role')).toBe('dialog');
    expect(panel.attributes('aria-modal')).toBe('true');
  });

  it('clears the pending animation timer on unmount (no leak)', async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(SnPopup, { props: { modelValue: true, duration: 300 } });
      await wrapper.setProps({ modelValue: false });
      wrapper.unmount();
      expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
    } finally {
      vi.useRealTimers();
    }
  });
});
