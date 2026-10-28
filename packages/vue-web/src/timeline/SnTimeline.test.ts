import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnTimeline from './SnTimeline.vue';
import SnTimelineItem from './SnTimelineItem.vue';

/** Mount SnTimeline through a wrapper component, mirroring real usage. */
function mountTimeline(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnTimeline, SnTimelineItem },
      setup() {
        return () => h(SnTimeline, props as never, slots as never);
      },
    }),
  );
}

function itemSlots(): Record<string, unknown> {
  return {
    default: () => [
      h(SnTimelineItem, {
        type: 'success',
        title: '成功',
        content: '已发布',
        time: '2018-04-03 20:46',
      }),
      h(SnTimelineItem, {
        type: 'error',
        content: '构建失败',
        time: '2018-04-03 20:50',
      }),
      h(SnTimelineItem, { lineType: 'dashed', content: '等待中' }),
    ],
  };
}

describe('SnTimeline (AUI-WEB-DD-020)', () => {
  describe('rendering', () => {
    it('renders a left-placement medium vertical timeline by default', () => {
      const w = mountTimeline({}, itemSlots());
      const root = w.find('.sn-timeline');
      expect(root.classes()).toContain('sn-timeline--left-placement');
      expect(root.classes()).toContain('sn-timeline--medium-size');
      expect(root.classes()).not.toContain('sn-timeline--horizontal');
      expect(w.findAll('.sn-timeline-item')).toHaveLength(3);
    });

    it('applies the item-placement modifier classes', () => {
      for (const placement of ['left', 'right'] as const) {
        const w = mountTimeline({ itemPlacement: placement });
        expect(w.find('.sn-timeline').classes()).toContain(`sn-timeline--${placement}-placement`);
      }
    });

    it('applies the size modifier classes', () => {
      for (const size of ['medium', 'large'] as const) {
        const w = mountTimeline({ size });
        expect(w.find('.sn-timeline').classes()).toContain(`sn-timeline--${size}-size`);
      }
    });

    it('marks horizontal mode and drops the placement class', () => {
      const w = mountTimeline({ horizontal: true, itemPlacement: 'right' });
      const root = w.find('.sn-timeline');
      expect(root.classes()).toContain('sn-timeline--horizontal');
      expect(root.classes()).not.toContain('sn-timeline--right-placement');
    });

    it('propagates the icon-size as a CSS variable', () => {
      const w = mountTimeline({ iconSize: 20 });
      expect(w.find('.sn-timeline').attributes('style')).toMatch(/--sn-timeline-icon-size:\s*20px/);
    });
  });

  describe('SnTimelineItem content', () => {
    it('renders title / content / time from props', () => {
      const w = mountTimeline({}, itemSlots());
      const first = w.findAll('.sn-timeline-item')[0];
      expect(first.find('.sn-timeline-item__title').text()).toBe('成功');
      expect(first.find('.sn-timeline-item__body').text()).toBe('已发布');
      expect(first.find('.sn-timeline-item__meta').text()).toBe('2018-04-03 20:46');
    });

    it('renders rail node and line for each item', () => {
      const w = mountTimeline({}, itemSlots());
      const items = w.findAll('.sn-timeline-item');
      for (const item of items) {
        expect(item.find('.sn-timeline-item__timeline').exists()).toBe(true);
        expect(item.find('.sn-timeline-item__circle').exists()).toBe(true);
        expect(item.find('.sn-timeline-item__line').exists()).toBe(true);
      }
    });

    it('applies the type and line-type modifier classes', () => {
      const w = mountTimeline({}, itemSlots());
      const items = w.findAll('.sn-timeline-item');
      expect(items[0].classes()).toContain('sn-timeline-item--success-type');
      expect(items[1].classes()).toContain('sn-timeline-item--error-type');
      expect(items[2].classes()).toContain('sn-timeline-item--default-type');
      expect(items[2].classes()).toContain('sn-timeline-item--dashed-line-type');
      expect(items[0].classes()).toContain('sn-timeline-item--default-line-type');
    });

    it('lets the header / default / footer slots override the props', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [
            h(
              SnTimelineItem,
              { title: 'prop 标题', content: 'prop 内容', time: 'prop 时间' },
              {
                header: () => 'slot 标题',
                default: () => 'slot 内容',
                footer: () => 'slot 时间',
              },
            ),
          ],
        },
      );
      const item = w.find('.sn-timeline-item');
      expect(item.find('.sn-timeline-item__title').text()).toBe('slot 标题');
      expect(item.find('.sn-timeline-item__body').text()).toBe('slot 内容');
      expect(item.find('.sn-timeline-item__meta').text()).toBe('slot 时间');
    });

    it('replaces the circle node with the icon slot', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [h(SnTimelineItem, null, { icon: () => h('span', { class: 'glyph' }) })],
        },
      );
      const item = w.find('.sn-timeline-item');
      expect(item.find('.sn-timeline-item__circle').exists()).toBe(false);
      expect(item.find('.sn-timeline-item__icon .glyph').exists()).toBe(true);
    });

    it('applies the color prop to the node', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [h(SnTimelineItem, { color: 'rgb(9, 9, 9)', content: '啊' })],
        },
      );
      expect(w.find('.sn-timeline-item__circle').attributes('style')).toContain(
        '--sn-timeline-node-color',
      );
    });

    it('lets dot-color win over the legacy color prop', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [
            h(SnTimelineItem, { color: 'red', dotColor: 'rgb(0, 180, 42)', content: '啊' }),
          ],
        },
      );
      expect(w.find('.sn-timeline-item__circle').attributes('style')).toContain(
        '--sn-timeline-node-color: rgb(0, 180, 42)',
      );
    });

    it('defaults to a solid dot and supports the hollow ring', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [
            h(SnTimelineItem, { content: 'solid' }),
            h(SnTimelineItem, { content: 'hollow', dotType: 'hollow' }),
          ],
        },
      );
      const items = w.findAll('.sn-timeline-item');
      expect(items[0].classes()).toContain('sn-timeline-item--solid-dot');
      expect(items[1].classes()).toContain('sn-timeline-item--hollow-dot');
    });

    it('replaces the whole node with the dot slot (over the icon slot)', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [
            h(SnTimelineItem, null, {
              icon: () => h('span', { class: 'glyph' }),
              dot: () => h('span', { class: 'custom-dot' }),
            }),
          ],
        },
      );
      const item = w.find('.sn-timeline-item');
      expect(item.find('.sn-timeline-item__circle').exists()).toBe(false);
      expect(item.find('.sn-timeline-item__icon').exists()).toBe(false);
      expect(item.find('.sn-timeline-item__dot .custom-dot').exists()).toBe(true);
    });

    it('applies the dotted line-type modifier class', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [h(SnTimelineItem, { lineType: 'dotted', content: '点线' })],
        },
      );
      expect(w.find('.sn-timeline-item').classes()).toContain('sn-timeline-item--dotted-line-type');
    });
  });

  describe('direction / mode / label', () => {
    it('honors the direction prop and lets it win over the legacy horizontal flag', () => {
      const w = mountTimeline({ direction: 'horizontal', horizontal: false });
      expect(w.find('.sn-timeline').classes()).toContain('sn-timeline--horizontal');
      expect(w.find('.sn-timeline').classes()).toContain('sn-timeline--mode-top');
    });

    it('normalizes off-axis mode values per direction', () => {
      const vertical = mountTimeline({ mode: 'top' });
      expect(vertical.find('.sn-timeline').classes()).toContain('sn-timeline--mode-left');

      const horizontal = mountTimeline({ direction: 'horizontal', mode: 'left' });
      expect(horizontal.find('.sn-timeline').classes()).toContain('sn-timeline--mode-top');
    });

    it('lets mode win over the legacy item-placement', () => {
      const w = mountTimeline({ mode: 'right', itemPlacement: 'left' });
      const root = w.find('.sn-timeline');
      expect(root.classes()).toContain('sn-timeline--mode-right');
      expect(root.classes()).toContain('sn-timeline--right-placement');
    });

    it('alternates the item side by index in alternate mode', () => {
      const w = mountTimeline({ mode: 'alternate' }, itemSlots());
      const items = w.findAll('.sn-timeline-item');
      expect(items[0].classes()).toContain('sn-timeline-item--side-right');
      expect(items[1].classes()).toContain('sn-timeline-item--side-left');
      expect(items[2].classes()).toContain('sn-timeline-item--side-right');
    });

    it('lets the item position override the alternate parity', () => {
      const w = mountTimeline(
        { mode: 'alternate' },
        {
          default: () => [
            h(SnTimelineItem, { content: 'a' }),
            h(SnTimelineItem, { content: 'b', position: 'right' }),
          ],
        },
      );
      const items = w.findAll('.sn-timeline-item');
      expect(items[1].classes()).toContain('sn-timeline-item--side-right');
      expect(items[1].classes()).toContain('sn-timeline-item--position-right');
    });

    it('renders the label across the axis by default (label-position relative)', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [h(SnTimelineItem, { label: '2017-03-10', title: '里程碑' })],
        },
      );
      const item = w.find('.sn-timeline-item');
      expect(item.find('.sn-timeline-item__opposite').text()).toBe('2017-03-10');
      expect(item.find('.sn-timeline-item__label').exists()).toBe(false);
    });

    it('renders the label inline with label-position same', () => {
      const w = mountTimeline(
        { labelPosition: 'same' },
        {
          default: () => [h(SnTimelineItem, { label: '2017-03-10', title: '里程碑' })],
        },
      );
      const item = w.find('.sn-timeline-item');
      expect(item.find('.sn-timeline-item__label').text()).toBe('2017-03-10');
      expect(item.find('.sn-timeline-item__opposite').exists()).toBe(false);
    });

    it('renders no label cell for items without a label', () => {
      const w = mountTimeline(
        {},
        {
          default: () => [
            h(SnTimelineItem, { title: '无标签' }),
            h(SnTimelineItem, { title: '插槽标签' }, { label: () => 'from slot' }),
          ],
        },
      );
      const items = w.findAll('.sn-timeline-item');
      expect(items[0].find('.sn-timeline-item__opposite').exists()).toBe(false);
      expect(items[1].find('.sn-timeline-item__opposite').text()).toBe('from slot');
    });
  });

  it('renders with default config outside a timeline (degraded, no throw)', () => {
    const w = mount(
      defineComponent({
        components: { SnTimelineItem },
        setup() {
          return () => h(SnTimelineItem, { content: '孤立项' });
        },
      }),
    );
    expect(w.find('.sn-timeline-item__body').text()).toBe('孤立项');
    expect(w.find('.sn-timeline-item').classes()).toContain('sn-timeline-item--default-type');
  });
});
