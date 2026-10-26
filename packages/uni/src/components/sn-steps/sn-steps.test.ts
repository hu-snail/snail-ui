/**
 * sn-steps / sn-step unit tests — uni-end step indicator.
 *
 * Behaviour only (AGENTS.md §46): the status derivation from `active`, the
 * explicit-status override, the vertical / dot / space / alignCenter flags and
 * the last-step line suppression. No rpx numbers in assertions — happy-dom
 * discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnSteps from './sn-steps.vue';
import SnStep from './sn-step.vue';

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
  });
});
