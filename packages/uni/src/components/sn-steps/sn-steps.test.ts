/**
 * sn-steps / sn-step unit tests — uni-end step indicator.
 *
 * Behaviour only (AGENTS.md §46): the status derivation from `active`, the
 * explicit-status override, the vertical / dot / space / alignCenter flags and
 * the last-step line suppression. No rpx numbers in assertions — happy-dom
 * discards lengths it cannot parse.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnSteps from './sn-steps.vue';
import SnStep from './sn-step.vue';
import { clearSnIcons, registerSnIcons } from '../sn-icon/sn-icon-registry';
import { Plus } from '../sn-icon/sn-icon-set';

afterEach(() => {
  clearSnIcons();
});

/** Harness: a steps container with N titled steps. */
async function mountSteps(
  props: Record<string, unknown> = {},
  stepProps: Record<string, unknown>[] = [{ title: 'One' }, { title: 'Two' }, { title: 'Three' }],
) {
  const Harness = defineComponent({
    setup() {
      return () =>
        h(SnSteps, props, {
          default: () => stepProps.map((step) => h(SnStep, step)),
        });
    },
  });
  const wrapper = mount(Harness);
  /* Registration happens in `onMounted` — flush it before asserting. */
  await wrapper.vm.$nextTick();
  return wrapper;
}

describe('sn-steps', () => {
  describe('status derivation', () => {
    it('marks steps before active as finished', async () => {
      const steps = (await mountSteps({ active: 2 })).findAll('.sn-step');
      expect(steps[0]!.classes()).toContain('sn-step--finished');
      expect(steps[1]!.classes()).toContain('sn-step--finished');
    });

    it('marks the active step as process', async () => {
      const steps = (await mountSteps({ active: 1 })).findAll('.sn-step');
      expect(steps[1]!.classes()).toContain('sn-step--process');
    });

    it('marks later steps as wait', async () => {
      const steps = (await mountSteps({ active: 0 })).findAll('.sn-step');
      expect(steps[1]!.classes()).toContain('sn-step--wait');
      expect(steps[2]!.classes()).toContain('sn-step--wait');
    });

    it('lets an explicit status win over the derivation', async () => {
      const wrapper = await mountSteps({ active: 0 }, [{ title: 'A', status: 'error' }]);
      expect(wrapper.find('.sn-step').classes()).toContain('sn-step--error');
    });

    it('renders the step number while waiting or processing', async () => {
      const wrapper = await mountSteps({ active: 0 });
      expect(wrapper.findAll('.sn-step__number')[0]!.text()).toBe('1');
      expect(wrapper.findAll('.sn-step__number')[1]!.text()).toBe('2');
    });

    it('renders a check icon for a finished step', async () => {
      const wrapper = await mountSteps({ active: 1 });
      expect(wrapper.findAll('.sn-step')[0]!.find('.sn-step__indicator .sn-icon').exists()).toBe(
        true,
      );
    });

    it('renders a cross icon for an error step', async () => {
      const wrapper = await mountSteps({ active: 0 }, [{ title: 'A', status: 'error' }]);
      expect(wrapper.find('.sn-step__indicator .sn-icon').exists()).toBe(true);
    });

    it('exposes aria-current on the process step only', async () => {
      const steps = (await mountSteps({ active: 1 })).findAll('.sn-step');
      expect(steps[0]!.attributes('aria-current')).toBeUndefined();
      expect(steps[1]!.attributes('aria-current')).toBe('step');
    });
  });

  describe('layout', () => {
    it('defaults to horizontal', async () => {
      expect((await mountSteps()).find('.sn-steps').classes()).toContain('sn-steps--horizontal');
    });

    it('applies the vertical class on container and steps', async () => {
      const wrapper = await mountSteps({ vertical: true });
      expect(wrapper.find('.sn-steps').classes()).toContain('sn-steps--vertical');
      expect(wrapper.find('.sn-step').classes()).toContain('sn-step--vertical');
    });

    it('applies the dot class', async () => {
      expect((await mountSteps({ dot: true })).find('.sn-steps').classes()).toContain(
        'sn-steps--dot',
      );
    });

    it('suppresses the connector line in dot mode', async () => {
      const wrapper = await mountSteps({ dot: true });
      expect(wrapper.find('.sn-step__line').exists()).toBe(false);
    });

    it('suppresses the connector on the last step', async () => {
      const steps = (await mountSteps()).findAll('.sn-step');
      expect(steps.at(-1)!.classes()).toContain('sn-step--last');
      expect(steps.at(-1)!.find('.sn-step__line').exists()).toBe(false);
    });

    it('renders the connector on non-last steps', async () => {
      expect((await mountSteps()).findAll('.sn-step')[0]!.find('.sn-step__line').exists()).toBe(
        true,
      );
    });

    it('applies alignCenter only in horizontal mode', async () => {
      expect((await mountSteps({ alignCenter: true })).find('.sn-steps').classes()).toContain(
        'sn-steps--center',
      );
      expect(
        (await mountSteps({ alignCenter: true, vertical: true })).find('.sn-steps').classes(),
      ).not.toContain('sn-steps--center');
    });

    it('writes the custom space on each step', async () => {
      const wrapper = await mountSteps({ space: '80px' });
      expect(wrapper.find('.sn-step').attributes('style')).toContain('width: 80px');
    });

    it('forwards customClass on container and step', async () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnSteps,
              { customClass: 'my-steps' },
              {
                default: () => [h(SnStep, { title: 'A', customClass: 'my-step' })],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.find('.sn-steps').classes()).toContain('my-steps');
      expect(wrapper.find('.sn-step').classes()).toContain('my-step');
    });
  });

  describe('content / accessibility', () => {
    it('renders the title and description', async () => {
      const wrapper = await mountSteps({}, [{ title: 'Order', description: 'placed' }]);
      expect(wrapper.find('.sn-step__title').text()).toBe('Order');
      expect(wrapper.find('.sn-step__description').text()).toBe('placed');
    });

    it('omits the description when empty', async () => {
      expect((await mountSteps({}, [{ title: 'A' }])).find('.sn-step__description').exists()).toBe(
        false,
      );
    });

    it('renders the title slot over the title prop', async () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnSteps,
              {},
              {
                default: () => [
                  h(
                    SnStep,
                    { title: 'ignored' },
                    {
                      title: () => h('text', { class: 'custom-title' }, 'slot'),
                    },
                  ),
                ],
              },
            );
        },
      });
      expect(mount(Harness).find('.custom-title').text()).toBe('slot');
    });

    it('exposes role="list" / role="listitem"', async () => {
      const wrapper = await mountSteps();
      expect(wrapper.find('.sn-steps').attributes('role')).toBe('list');
      expect(wrapper.find('.sn-step').attributes('role')).toBe('listitem');
    });

    it('marks decorative connector lines aria-hidden', async () => {
      const wrapper = await mountSteps();
      expect(wrapper.find('.sn-step__line').attributes('aria-hidden')).toBe('true');
    });

    it('marks the container with the component tag', async () => {
      expect((await mountSteps()).find('.sn-steps').attributes('data-snui-component')).toBe(
        'steps',
      );
      expect((await mountSteps()).find('.sn-step').attributes('data-snui-component')).toBe('step');
    });

    it('renders the description slot over the description prop', async () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnSteps,
              {},
              {
                default: () => [
                  h(
                    SnStep,
                    { title: 'A', description: 'ignored' },
                    { description: () => h('text', { class: 'custom-desc' }, 'slot') },
                  ),
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      expect(wrapper.find('.custom-desc').text()).toBe('slot');
      expect(wrapper.find('.sn-step__description').exists()).toBe(false);
    });

    it('renders the icon slot over every default indicator content', async () => {
      const Harness = defineComponent({
        setup() {
          return () =>
            h(
              SnSteps,
              { active: 0 },
              {
                default: () => [
                  h(SnStep, { title: 'A' }, { icon: () => h('text', { class: 'custom-icon' }) }),
                ],
              },
            );
        },
      });
      const wrapper = mount(Harness);
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.custom-icon').exists()).toBe(true);
      expect(wrapper.find('.sn-step__number').exists()).toBe(false);
    });
  });

  describe('step icon prop', () => {
    it('renders a registry-resolved icon instead of the step number', async () => {
      registerSnIcons({ Plus });
      const wrapper = await mountSteps({ active: 0 }, [{ title: 'A', icon: 'Plus' }]);
      const indicator = wrapper.find('.sn-step__indicator');
      expect(indicator.find('.sn-icon').exists()).toBe(true);
      expect(indicator.find('.sn-step__number').exists()).toBe(false);
    });

    it('renders the custom icon on a finished step instead of the builtin check', async () => {
      registerSnIcons({ Plus });
      const wrapper = await mountSteps({ active: 1 }, [
        { title: 'A', icon: 'Plus' },
        { title: 'B' },
      ]);
      const finished = wrapper.findAll('.sn-step')[0]!;
      expect(finished.classes()).toContain('sn-step--finished');
      expect(finished.find('.sn-icon').exists()).toBe(true);
    });

    it('falls back to the builtin check when the icon name is unregistered', async () => {
      clearSnIcons();
      const wrapper = await mountSteps({ active: 1 }, [
        { title: 'A', icon: 'Nope' },
        { title: 'B' },
      ]);
      const finished = wrapper.findAll('.sn-step')[0]!;
      expect(finished.find('.sn-icon').exists()).toBe(true);
      expect(finished.find('.sn-step__number').exists()).toBe(false);
    });
  });

  describe('active boundaries and reactivity', () => {
    it('marks every step finished when active is beyond the last index', async () => {
      const steps = (await mountSteps({ active: 9 })).findAll('.sn-step');
      for (const step of steps) {
        expect(step.classes()).toContain('sn-step--finished');
      }
    });

    it('marks every step wait when active is negative', async () => {
      const steps = (await mountSteps({ active: -1 })).findAll('.sn-step');
      for (const step of steps) {
        expect(step.classes()).toContain('sn-step--wait');
      }
    });

    it('moves the process marker reactively when active changes', async () => {
      const Harness = defineComponent({
        props: { active: { type: Number, default: 0 } },
        setup(props) {
          return () =>
            h(
              SnSteps,
              { active: props.active },
              { default: () => [h(SnStep, { title: 'A' }), h(SnStep, { title: 'B' })] },
            );
        },
      });
      const wrapper = mount(Harness, { props: { active: 0 } });
      await wrapper.vm.$nextTick();
      expect(wrapper.findAll('.sn-step')[0]!.classes()).toContain('sn-step--process');
      await wrapper.setProps({ active: 1 });
      expect(wrapper.findAll('.sn-step')[0]!.classes()).toContain('sn-step--finished');
      expect(wrapper.findAll('.sn-step')[1]!.classes()).toContain('sn-step--process');
    });

    it('applies vertical space as padding-bottom instead of width', async () => {
      const wrapper = await mountSteps({ vertical: true, space: '80px' });
      expect(wrapper.find('.sn-step').attributes('style')).toContain('padding-bottom: 80px');
    });

    it('applies the dot class on each step', async () => {
      const wrapper = await mountSteps({ dot: true });
      expect(wrapper.find('.sn-step').classes()).toContain('sn-step--dot');
    });

    it('forwards step customStyle to the step root', async () => {
      const wrapper = await mountSteps({}, [{ title: 'A', customStyle: 'margin: 8px' }]);
      expect(wrapper.find('.sn-step').attributes('style')).toContain('margin: 8px');
    });

    it('forwards container customStyle', async () => {
      const wrapper = await mountSteps({ customStyle: 'padding: 4px' });
      expect(wrapper.find('.sn-steps').attributes('style')).toContain('padding: 4px');
    });

    it('defaults a standalone step without a container to wait', () => {
      const wrapper = mount(SnStep, { props: { title: 'Lone' } });
      expect(wrapper.classes()).toContain('sn-step--wait');
    });
  });
});
