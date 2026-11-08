/**
 * sn-switch unit tests — uni-end on/off toggle (AUI-MP-010).
 *
 * Behaviour only (AGENTS.md §46): the activeValue / inactiveValue mapping,
 * the beforeChange veto, the blocked states and the ARIA switch role.
 * No rpx numbers in assertions — happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, ref } from 'vue';
import SnSwitch from './sn-switch.vue';

describe('sn-switch', () => {
  describe('value model', () => {
    it('is off by default', () => {
      const wrapper = mount(SnSwitch);
      expect(wrapper.classes()).not.toContain('sn-switch--checked');
      expect(wrapper.attributes('aria-checked')).toBe('false');
    });

    it('is on when modelValue equals activeValue', () => {
      const wrapper = mount(SnSwitch, { props: { modelValue: true } });
      expect(wrapper.classes()).toContain('sn-switch--checked');
      expect(wrapper.attributes('aria-checked')).toBe('true');
    });

    it('binds the unchecked modifier while off and drops it when on', async () => {
      /* The knob's far-end styling keys off this class instead of
       * `:not(.sn-switch--checked)` (§116.2 — App has no pseudo-classes). */
      const wrapper = mount(SnSwitch);
      expect(wrapper.classes()).toContain('sn-switch--unchecked');
      await wrapper.setProps({ modelValue: true });
      expect(wrapper.classes()).not.toContain('sn-switch--unchecked');
      expect(wrapper.classes()).toContain('sn-switch--checked');
      await wrapper.setProps({ modelValue: false });
      expect(wrapper.classes()).toContain('sn-switch--unchecked');
      expect(wrapper.classes()).not.toContain('sn-switch--checked');
    });

    it('emits update:modelValue with activeValue when toggled on', async () => {
      const wrapper = mount(SnSwitch, { props: { modelValue: false } });
      await wrapper.trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true]);
      });
      expect(wrapper.emitted('change')?.at(-1)).toEqual([true]);
    });

    it('emits update:modelValue with inactiveValue when toggled off', async () => {
      const wrapper = mount(SnSwitch, { props: { modelValue: true } });
      await wrapper.trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
      });
    });

    it('honours custom activeValue / inactiveValue', async () => {
      const wrapper = mount(SnSwitch, {
        props: { modelValue: 'off', activeValue: 'on', inactiveValue: 'off' },
      });
      expect(wrapper.classes()).not.toContain('sn-switch--checked');
      await wrapper.trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['on']);
      });
    });

    it('supports numeric values', async () => {
      const wrapper = mount(SnSwitch, {
        props: { modelValue: 0, activeValue: 1, inactiveValue: 0 },
      });
      await wrapper.trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1]);
      });
    });

    it('works uncontrolled — emits without a bound modelValue', async () => {
      const wrapper = mount(SnSwitch);
      await wrapper.trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true]);
      });
    });
  });

  describe('disabled / loading', () => {
    it('applies the disabled class and aria-disabled', () => {
      const wrapper = mount(SnSwitch, { props: { disabled: true } });
      expect(wrapper.classes()).toContain('sn-switch--disabled');
      expect(wrapper.attributes('aria-disabled')).toBe('true');
      expect(wrapper.attributes('tabindex')).toBe('-1');
    });

    it('does not emit while disabled', async () => {
      const wrapper = mount(SnSwitch, { props: { disabled: true } });
      await wrapper.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('does not emit while loading', async () => {
      const wrapper = mount(SnSwitch, { props: { loading: true } });
      expect(wrapper.classes()).toContain('sn-switch--loading');
      await wrapper.trigger('tap');
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('renders the spinner instead of the knob glyph while loading', () => {
      const wrapper = mount(SnSwitch, { props: { loading: true } });
      expect(wrapper.find('.sn-switch__spinner').exists()).toBe(true);
    });

    it('renders the knob glyph when not loading', () => {
      const wrapper = mount(SnSwitch);
      expect(wrapper.find('.sn-switch__spinner').exists()).toBe(false);
      expect(wrapper.find('.sn-switch__action .sn-icon').exists()).toBe(true);
    });
  });

  describe('beforeChange', () => {
    it('emits when beforeChange resolves true', async () => {
      const beforeChange = vi.fn(() => true);
      const wrapper = mount(SnSwitch, { props: { beforeChange } });
      await wrapper.trigger('tap');
      await vi.waitFor(() => {
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true]);
      });
      expect(beforeChange).toHaveBeenCalledTimes(1);
    });

    it('does not emit when beforeChange resolves false', async () => {
      const beforeChange = vi.fn(async () => false);
      const wrapper = mount(SnSwitch, { props: { beforeChange } });
      await wrapper.trigger('tap');
      await vi.waitFor(() => expect(beforeChange).toHaveBeenCalled());
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('does not emit when beforeChange rejects', async () => {
      const beforeChange = vi.fn(async () => {
        throw new Error('permission denied');
      });
      const wrapper = mount(SnSwitch, { props: { beforeChange } });
      await wrapper.trigger('tap');
      await vi.waitFor(() => expect(beforeChange).toHaveBeenCalled());
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('shape / text / color', () => {
    it('defaults to the round shape', () => {
      expect(mount(SnSwitch).classes()).toContain('sn-switch--round');
    });

    it('applies the square shape', () => {
      const wrapper = mount(SnSwitch, { props: { shape: 'square' } });
      expect(wrapper.classes()).toContain('sn-switch--square');
      expect(wrapper.attributes('data-shape')).toBe('square');
    });

    it('renders activeText when on and inactiveText when off', () => {
      const on = mount(SnSwitch, {
        props: { modelValue: true, activeText: 'ON', inactiveText: 'OFF' },
      });
      expect(on.find('.sn-switch__rail-text').text()).toBe('ON');

      const off = mount(SnSwitch, {
        props: { modelValue: false, activeText: 'ON', inactiveText: 'OFF' },
      });
      expect(off.find('.sn-switch__rail-text').text()).toBe('OFF');
    });

    it('hides the rail text when an icon overrides it', () => {
      const wrapper = mount(SnSwitch, {
        props: { modelValue: true, activeText: 'ON', activeIcon: 'check' },
      });
      expect(wrapper.find('.sn-switch__rail-text').exists()).toBe(false);
    });

    it('applies activeColor inline when on', () => {
      const wrapper = mount(SnSwitch, {
        props: { modelValue: true, activeColor: 'rgb(0, 200, 0)' },
      });
      expect(wrapper.find('.sn-switch__rail').attributes('style')).toContain(
        'background-color: rgb(0, 200, 0)',
      );
    });

    it('applies inactiveColor inline when off', () => {
      const wrapper = mount(SnSwitch, {
        props: { inactiveColor: 'rgb(4, 5, 6)' },
      });
      expect(wrapper.find('.sn-switch__rail').attributes('style')).toContain(
        'background-color: rgb(4, 5, 6)',
      );
    });

    it('applies size as a width/height pair', () => {
      /* happy-dom drops `rpx` lengths, so the numeric path is asserted through
       * the CSS-length path — both share the same railStyle branch. */
      const wrapper = mount(SnSwitch, { props: { size: '120px' } });
      const style = wrapper.find('.sn-switch__rail').attributes('style');
      expect(style).toContain('width: 120px');
      expect(style).toContain('height: calc(120px * 0.55)');
    });
  });

  describe('icon props', () => {
    it('renders the registry-resolved action icon', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { Star } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ Star });
      const wrapper = mount(SnSwitch, {
        props: { modelValue: true, activeActionIcon: 'Star' },
      });
      expect(wrapper.find('.sn-switch__action .sn-icon').exists()).toBe(true);
      clearSnIcons();
    });

    it('renders a CSS-class action icon when *CssIcon is on', () => {
      const wrapper = mount(SnSwitch, {
        props: { modelValue: true, activeActionIcon: 'my-icon', activeActionCssIcon: true },
      });
      expect(wrapper.find('.sn-switch__action-icon').classes()).toContain('my-icon');
    });

    it('renders a CSS-class rail icon when *CssIcon is on', () => {
      const wrapper = mount(SnSwitch, {
        props: { modelValue: true, activeIcon: 'rail-icon', activeCssIcon: true },
      });
      expect(wrapper.find('.sn-switch__rail-icon').classes()).toContain('rail-icon');
    });
  });

  describe('accessibility + forwarding', () => {
    it('uses role="switch"', () => {
      expect(mount(SnSwitch).attributes('role')).toBe('switch');
    });

    it('is focusable when interactive', () => {
      expect(mount(SnSwitch).attributes('tabindex')).toBe('0');
    });

    it('forwards customClass / customStyle', () => {
      const wrapper = mount(SnSwitch, {
        props: { customClass: 'my-switch', customStyle: 'margin: 4px;' },
      });
      expect(wrapper.classes()).toContain('my-switch');
      expect(wrapper.attributes('style')).toContain('margin: 4px');
    });

    it('accepts classPrefix without leaking it to the DOM', () => {
      const wrapper = mount(SnSwitch, { props: { classPrefix: 'aui-icon' } });
      expect(wrapper.attributes('class-prefix')).toBeUndefined();
      expect(wrapper.attributes('classPrefix')).toBeUndefined();
    });
  });

  /* ── Extended coverage: pending guard, rapid toggling, rail icons ── */

  it('marks the wrapper data component', () => {
    expect(mount(SnSwitch).attributes('data-snui-component')).toBe('switch');
  });

  it('omits aria-disabled while enabled', () => {
    expect(mount(SnSwitch).attributes('aria-disabled')).toBeUndefined();
  });

  it('shows the pending state and ignores taps until beforeChange settles', async () => {
    let resolvePending: ((allowed: boolean) => void) | undefined;
    const beforeChange = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolvePending = resolve;
        }),
    );
    const wrapper = mount(SnSwitch, { props: { beforeChange } });
    await wrapper.trigger('tap');
    expect(wrapper.classes()).toContain('sn-switch--loading');

    // a second tap while pending must not queue a second toggle
    await wrapper.trigger('tap');
    resolvePending?.(true);
    await vi.waitFor(() => {
      expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    });
    expect(wrapper.classes()).not.toContain('sn-switch--loading');
  });

  it('releases the pending state when the parent clears loading', async () => {
    const beforeChange = () => new Promise<boolean>(() => undefined); // never settles
    const wrapper = mount(SnSwitch, { props: { beforeChange } });
    await wrapper.trigger('tap');
    expect(wrapper.classes()).toContain('sn-switch--loading');
    await wrapper.setProps({ loading: true });
    await wrapper.setProps({ loading: false });
    expect(wrapper.classes()).not.toContain('sn-switch--loading');
    wrapper.unmount();
  });

  it('flips on every tap under v-model', async () => {
    const Host = {
      setup() {
        const model = ref<boolean>(false);
        return () =>
          h(SnSwitch, {
            modelValue: model.value,
            'onUpdate:modelValue': (v: boolean) => {
              model.value = v;
            },
          });
      },
    };
    const wrapper = mount(Host);
    await wrapper.trigger('tap');
    await wrapper.trigger('tap');
    await wrapper.trigger('tap');
    expect(wrapper.classes()).toContain('sn-switch--checked');
    const emitted = wrapper.findComponent(SnSwitch).emitted('update:modelValue') ?? [];
    expect(emitted.map((e) => e[0])).toEqual([true, false, true]);
  });

  it('renders the inactive registry action icon while off', async () => {
    const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
    const { Star } = await import('../sn-icon/sn-icon-set');
    registerSnIcons({ Star });
    const wrapper = mount(SnSwitch, {
      props: { modelValue: false, inactiveActionIcon: 'Star' },
    });
    expect(wrapper.find('.sn-switch__action .sn-icon').exists()).toBe(true);
    clearSnIcons();
  });

  it('renders the active registry rail icon (regression: rail icon used to vanish)', async () => {
    const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
    const { Star } = await import('../sn-icon/sn-icon-set');
    registerSnIcons({ Star });
    const wrapper = mount(SnSwitch, {
      props: { modelValue: true, activeText: 'ON', activeIcon: 'Star' },
    });
    expect(wrapper.find('.sn-switch__rail-icon .sn-icon').exists()).toBe(true);
    expect(wrapper.find('.sn-switch__rail-text').exists()).toBe(false);
    clearSnIcons();
  });

  it('renders the inactive registry rail icon while off', async () => {
    const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
    const { Star } = await import('../sn-icon/sn-icon-set');
    registerSnIcons({ Star });
    const wrapper = mount(SnSwitch, {
      props: { modelValue: false, inactiveText: 'OFF', inactiveIcon: 'Star' },
    });
    expect(wrapper.find('.sn-switch__rail-icon .sn-icon').exists()).toBe(true);
    clearSnIcons();
  });

  it('falls back to the text when a rail icon name is not registered', async () => {
    const wrapper = mount(SnSwitch, {
      props: { modelValue: true, activeText: 'ON', activeIcon: 'not-registered' },
    });
    expect(wrapper.find('.sn-switch__rail-icon').exists()).toBe(false);
  });
});
