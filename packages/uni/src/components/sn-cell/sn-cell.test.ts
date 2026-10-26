/**
 * sn-cell / sn-cell-group unit tests — uni-end list rows.
 *
 * Behaviour only (AGENTS.md §46): the title / value / label rendering, the
 * placeholder rule, the clickable / isLink tap guard, the group inheritance
 * and the required-asterisk placement. No rpx numbers in assertions —
 * happy-dom discards lengths it cannot parse.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnCell from './sn-cell.vue';
import SnCellGroup from './sn-cell-group.vue';

describe('sn-cell', () => {
  describe('content', () => {
    it('renders the title and value', () => {
      const wrapper = mount(SnCell, { props: { title: 'Name', value: 'Ada' } });
      expect(wrapper.find('.sn-cell__title-text').text()).toBe('Name');
      expect(wrapper.find('.sn-cell__value-text').text()).toBe('Ada');
    });

    it('renders a numeric value as text', () => {
      const wrapper = mount(SnCell, { props: { title: 'Count', value: 42 } });
      expect(wrapper.find('.sn-cell__value-text').text()).toBe('42');
    });

    it('renders the placeholder when value is empty', () => {
      const wrapper = mount(SnCell, { props: { title: 'Phone', placeholder: 'Not set' } });
      expect(wrapper.find('.sn-cell__value-text').text()).toBe('Not set');
      expect(wrapper.find('.sn-cell__value-text').classes()).toContain(
        'sn-cell__value-text--placeholder',
      );
    });

    it('renders the value instead of the placeholder when set', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'Phone', value: '123', placeholder: 'Not set' },
      });
      expect(wrapper.find('.sn-cell__value-text').text()).toBe('123');
      expect(wrapper.find('.sn-cell__value-text').classes()).not.toContain(
        'sn-cell__value-text--placeholder',
      );
    });

    it('renders a numeric zero value instead of the placeholder', () => {
      const wrapper = mount(SnCell, { props: { title: 'Count', value: 0, placeholder: 'None' } });
      expect(wrapper.find('.sn-cell__value-text').text()).toBe('0');
      expect(wrapper.find('.sn-cell__value-text').classes()).not.toContain(
        'sn-cell__value-text--placeholder',
      );
    });

    it('renders the label under the title', () => {
      const wrapper = mount(SnCell, { props: { title: 'A', label: 'hint' } });
      expect(wrapper.find('.sn-cell__label').text()).toBe('hint');
    });

    it('omits the label when empty', () => {
      expect(
        mount(SnCell, { props: { title: 'A' } })
          .find('.sn-cell__label')
          .exists(),
      ).toBe(false);
    });

    it('renders the default slot instead of the value prop', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', value: 'ignored' },
        slots: { default: '<text class="custom-value">slot</text>' },
      });
      expect(wrapper.find('.custom-value').text()).toBe('slot');
      expect(wrapper.find('.sn-cell__value-text').exists()).toBe(false);
    });

    it('renders the title slot when useTitleSlot is on', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A' },
        slots: { title: '<text class="custom-title">slot title</text>' },
      });
      expect(wrapper.find('.custom-title').text()).toBe('slot title');
      expect(wrapper.find('.sn-cell__title-text').exists()).toBe(false);
    });

    it('ignores the title slot when useTitleSlot is off', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', useTitleSlot: false },
        slots: { title: '<text class="custom-title">slot title</text>' },
      });
      expect(wrapper.find('.custom-title').exists()).toBe(false);
      expect(wrapper.find('.sn-cell__title-text').text()).toBe('A');
    });

    it('renders the label slot when useLabelSlot is on', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', label: 'prop label' },
        slots: { label: '<text class="custom-label">slot label</text>' },
      });
      expect(wrapper.find('.custom-label').text()).toBe('slot label');
      expect(wrapper.find('.sn-cell__label').exists()).toBe(false);
    });

    it('ignores the label slot when useLabelSlot is off', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', label: 'prop label', useLabelSlot: false },
        slots: { label: '<text class="custom-label">slot label</text>' },
      });
      expect(wrapper.find('.custom-label').exists()).toBe(false);
      expect(wrapper.find('.sn-cell__label').text()).toBe('prop label');
    });

    it('renders the prefix slot over the prefix icon', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', prefixIcon: 'User' },
        slots: { prefix: '<text class="custom-prefix">P</text>' },
      });
      expect(wrapper.find('.custom-prefix').text()).toBe('P');
      expect(wrapper.find('.sn-cell__icon').exists()).toBe(false);
    });
  });

  describe('events', () => {
    it('does not emit while neither clickable nor isLink', async () => {
      const wrapper = mount(SnCell, { props: { title: 'A' } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('emits click when clickable', async () => {
      const wrapper = mount(SnCell, { props: { title: 'A', clickable: true } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('emits click when isLink', async () => {
      const wrapper = mount(SnCell, { props: { title: 'A', isLink: true } });
      await wrapper.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('marks an interactive cell as a button', () => {
      expect(mount(SnCell, { props: { title: 'A', isLink: true } }).attributes('role')).toBe(
        'button',
      );
    });

    it('leaves a static cell without a role', () => {
      expect(mount(SnCell, { props: { title: 'A' } }).attributes('role')).toBeUndefined();
    });

    it('names an interactive cell after its title', () => {
      const wrapper = mount(SnCell, { props: { title: 'Settings', clickable: true } });
      expect(wrapper.attributes('aria-label')).toBe('Settings');
    });

    it('leaves a static cell without an aria-label', () => {
      expect(
        mount(SnCell, { props: { title: 'Settings' } }).attributes('aria-label'),
      ).toBeUndefined();
    });
  });

  describe('arrow / icons', () => {
    it('renders the arrow only for isLink', () => {
      expect(
        mount(SnCell, { props: { title: 'A', isLink: true } })
          .find('.sn-cell__arrow')
          .exists(),
      ).toBe(true);
      expect(
        mount(SnCell, { props: { title: 'A' } })
          .find('.sn-cell__arrow')
          .exists(),
      ).toBe(false);
    });

    it('rotates the arrow per arrowDirection', () => {
      const wrapper = mount(SnCell, { props: { title: 'A', isLink: true, arrowDirection: 'up' } });
      expect(wrapper.find('.sn-cell__arrow .sn-icon').attributes('style')).toContain(
        'rotate(-90deg)',
      );
    });

    it('rotates the arrow to each remaining direction', () => {
      const expectations: Array<['left' | 'down' | 'right', string]> = [
        ['left', 'rotate(180deg)'],
        ['down', 'rotate(90deg)'],
        ['right', 'none'],
      ];
      for (const [direction, transform] of expectations) {
        const wrapper = mount(SnCell, {
          props: { title: 'A', isLink: true, arrowDirection: direction },
        });
        expect(wrapper.find('.sn-cell__arrow .sn-icon').attributes('style')).toContain(transform);
      }
    });

    it('renders a registry-resolved suffix icon', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { Star } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ Star });
      const wrapper = mount(SnCell, { props: { title: 'A', suffixIcon: 'Star' } });
      expect(wrapper.find('.sn-cell__icon.sn-icon').exists()).toBe(true);
      clearSnIcons();
    });

    it('sizes the icons through iconSize', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { Star } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ Star });
      const wrapper = mount(SnCell, {
        props: { title: 'A', prefixIcon: 'Star', iconSize: 40 },
      });
      expect(wrapper.find('.sn-cell__icon').attributes('style')).toContain('width: 40px');
      clearSnIcons();
    });

    it('accepts a cssIcon string as the class prefix', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', prefixIcon: 'user', cssIcon: 'icon' },
      });
      expect(wrapper.find('.sn-cell__icon').classes()).toContain('icon-user');
    });

    it('renders a registry-resolved prefix icon', async () => {
      const { registerSnIcons, clearSnIcons } = await import('../sn-icon/sn-icon-registry');
      const { User } = await import('../sn-icon/sn-icon-set');
      registerSnIcons({ User });
      const wrapper = mount(SnCell, { props: { title: 'A', prefixIcon: 'User' } });
      expect(wrapper.find('.sn-cell__icon.sn-icon').exists()).toBe(true);
      clearSnIcons();
    });

    it('renders a font icon when cssIcon is on', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', prefixIcon: 'user', iconPrefix: 'sn', cssIcon: true },
      });
      expect(wrapper.find('.sn-cell__icon').classes()).toContain('sn-user');
    });

    it('renders the suffix slot when not a link', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A' },
        slots: { suffix: '<text class="custom-suffix">s</text>' },
      });
      expect(wrapper.find('.custom-suffix').exists()).toBe(true);
    });
  });

  describe('required / size / layout', () => {
    it('renders the asterisk at the start by default', () => {
      const wrapper = mount(SnCell, { props: { title: 'A', required: true } });
      const row = wrapper.find('.sn-cell__title-row');
      expect(row.element.firstElementChild?.className).toContain('sn-cell__asterisk');
    });

    it('renders the asterisk at the end when asked', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', required: true, asteriskPosition: 'end' },
      });
      const row = wrapper.find('.sn-cell__title-row');
      expect(row.element.lastElementChild?.className).toContain('sn-cell__asterisk');
    });

    it('hides the asterisk when hideAsterisk is on', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', required: true, hideAsterisk: true },
      });
      expect(wrapper.find('.sn-cell__asterisk').exists()).toBe(false);
    });

    it('applies the large size class', () => {
      expect(mount(SnCell, { props: { title: 'A', size: 'large' } }).classes()).toContain(
        'sn-cell--large',
      );
    });

    it('applies the vertical layout class', () => {
      expect(mount(SnCell, { props: { title: 'A', layout: 'vertical' } }).classes()).toContain(
        'sn-cell--layout-vertical',
      );
    });

    it('applies the value alignment class', () => {
      expect(mount(SnCell, { props: { title: 'A', valueAlign: 'center' } }).classes()).toContain(
        'sn-cell--align-center',
      );
    });

    it('writes titleWidth as px for a number', () => {
      const wrapper = mount(SnCell, { props: { title: 'A', titleWidth: 120 } });
      expect(wrapper.find('.sn-cell__title').attributes('style')).toContain('width: 120px');
    });

    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', customClass: 'my-cell', customStyle: 'margin: 4px;' },
      });
      expect(wrapper.classes()).toContain('my-cell');
      expect(wrapper.attributes('style')).toContain('margin: 4px');
    });

    it('applies the ellipsis class when asked', () => {
      expect(mount(SnCell, { props: { title: 'A', ellipsis: true } }).classes()).toContain(
        'sn-cell--ellipsis',
      );
    });

    it('renders the cell border outside a group when explicitly on', () => {
      expect(mount(SnCell, { props: { title: 'A', border: true } }).classes()).toContain(
        'sn-cell--border',
      );
    });
  });

  describe('navigation payload', () => {
    it('forwards to / replace through the click payload', async () => {
      const wrapper = mount(SnCell, {
        props: { title: 'A', clickable: true, to: '/detail', replace: true },
      });
      await wrapper.trigger('tap');
      const [, navigation] = wrapper.emitted('click')?.[0] ?? [];
      expect(navigation).toEqual({ to: '/detail', replace: true });
    });

    it('carries the defaults when to / replace are unset', async () => {
      const wrapper = mount(SnCell, { props: { title: 'A', isLink: true } });
      await wrapper.trigger('tap');
      const [, navigation] = wrapper.emitted('click')?.[0] ?? [];
      expect(navigation).toEqual({ to: '', replace: false });
    });

    it('keeps the event object as the first payload argument', async () => {
      const wrapper = mount(SnCell, { props: { title: 'A', clickable: true } });
      await wrapper.trigger('tap');
      const [event] = wrapper.emitted('click')?.[0] ?? [];
      expect(event).toBeInstanceOf(Event);
    });
  });
});

describe('sn-cell-group', () => {
  function mountGroup(
    groupProps: Record<string, unknown> = {},
    cellProps: Record<string, unknown> = {},
  ) {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(SnCellGroup, groupProps, {
            default: () => [h(SnCell, { title: 'Row', ...cellProps })],
          });
      },
    });
    return mount(Harness);
  }

  it('renders the group title and value', () => {
    const wrapper = mountGroup({ title: 'Account', value: '2 items' });
    expect(wrapper.find('.sn-cell-group__title-text').text()).toBe('Account');
    expect(wrapper.find('.sn-cell-group__value-text').text()).toBe('2 items');
  });

  it('omits the header without a title or value', () => {
    expect(mountGroup().find('.sn-cell-group__header').exists()).toBe(false);
  });

  it('renders cells through the default slot', () => {
    expect(mountGroup().find('.sn-cell').exists()).toBe(true);
  });

  it('adds the insert / bordered classes', () => {
    const wrapper = mountGroup({ insert: true, border: true });
    expect(wrapper.find('.sn-cell-group').classes()).toContain('sn-cell-group--insert');
    expect(wrapper.find('.sn-cell-group').classes()).toContain('sn-cell-group--bordered');
  });

  it('marks the cells as insert rows inside an insert group', () => {
    expect(mountGroup({ insert: true }).find('.sn-cell').classes()).toContain('sn-cell--insert');
    expect(mountGroup().find('.sn-cell').classes()).not.toContain('sn-cell--insert');
  });

  it('applies the large size class on the group', () => {
    expect(mountGroup({ size: 'large' }).find('.sn-cell-group').classes()).toContain(
      'sn-cell-group--large',
    );
  });

  it('renders the group title / value slots over the props', () => {
    const Harness = defineComponent({
      setup() {
        return () =>
          h(SnCellGroup, { title: 'ignored', value: 'ignored' }, {
            title: () => h('text', { class: 'custom-group-title' }, 'slot title'),
            value: () => h('text', { class: 'custom-group-value' }, 'slot value'),
          });
      },
    });
    const wrapper = mount(Harness);
    expect(wrapper.find('.custom-group-title').text()).toBe('slot title');
    expect(wrapper.find('.custom-group-value').text()).toBe('slot value');
    expect(wrapper.find('.sn-cell-group__title-text').exists()).toBe(false);
  });

  it('inherits the border flag into cells', () => {
    expect(mountGroup({ border: true }).find('.sn-cell').classes()).toContain('sn-cell--border');
    expect(mountGroup({ border: false }).find('.sn-cell').classes()).not.toContain(
      'sn-cell--border',
    );
  });

  it('lets an explicit cell border win over the group', () => {
    expect(
      mountGroup({ border: true }, { border: false }).find('.sn-cell').classes(),
    ).not.toContain('sn-cell--border');
  });

  it('inherits layout / valueAlign / center into cells', () => {
    const wrapper = mountGroup({ layout: 'vertical', valueAlign: 'left', center: true });
    const cell = wrapper.find('.sn-cell');
    expect(cell.classes()).toContain('sn-cell--layout-vertical');
    expect(cell.classes()).toContain('sn-cell--align-left');
    expect(cell.classes()).toContain('sn-cell--center');
  });

  it('inherits titleWidth into cells', () => {
    const wrapper = mountGroup({ titleWidth: 100 });
    expect(wrapper.find('.sn-cell__title').attributes('style')).toContain('width: 100px');
  });

  it('marks the group with role="group" and a label', () => {
    const wrapper = mountGroup({ title: 'Account' });
    expect(wrapper.find('.sn-cell-group').attributes('role')).toBe('group');
    expect(wrapper.find('.sn-cell-group').attributes('aria-label')).toBe('Account');
  });

  it('forwards customClass on the group', () => {
    expect(mountGroup({ customClass: 'my-group' }).find('.sn-cell-group').classes()).toContain(
      'my-group',
    );
  });
});
