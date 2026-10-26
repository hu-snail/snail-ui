import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnEmpty from './SnEmpty.vue';

/** Mount SnEmpty through a wrapper component, mirroring real usage. */
function mountEmpty(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnEmpty },
      setup() {
        return () => h(SnEmpty, props as never, slots as never);
      },
    }),
  );
}

describe('SnEmpty (AUI-WEB-DD-006)', () => {
  describe('rendering', () => {
    it('renders the default icon and the zh no-data description by default', () => {
      const w = mountEmpty();
      const root = w.find('.sn-empty');
      expect(root.classes()).toContain('sn-empty--medium');
      expect(w.find('.sn-empty__icon svg').exists()).toBe(true);
      expect(w.find('.sn-empty__description').text()).toBe('无数据');
    });

    it('renders the description prop', () => {
      const w = mountEmpty({ description: '没有更多了' });
      expect(w.find('.sn-empty__description').text()).toBe('没有更多了');
    });

    it('lets the default slot replace the description', () => {
      const w = mountEmpty({ description: 'prop 描述' }, { default: () => 'slot 描述' });
      expect(w.find('.sn-empty__description').text()).toBe('slot 描述');
    });

    it('renders the extra slot below the description', () => {
      const w = mountEmpty({}, { extra: () => '重试一下' });
      expect(w.find('.sn-empty__extra').text()).toBe('重试一下');
    });

    it('renders no extra area without the slot', () => {
      const w = mountEmpty();
      expect(w.find('.sn-empty__extra').exists()).toBe(false);
    });
  });

  describe('show-icon', () => {
    it('renders no icon when show-icon is false', () => {
      const w = mountEmpty({ showIcon: false });
      expect(w.find('.sn-empty__icon').exists()).toBe(false);
      expect(w.find('.sn-empty__description').text()).toBe('无数据');
    });
  });

  describe('show-description', () => {
    it('renders no description when show-description is false', () => {
      const w = mountEmpty({ showDescription: false });
      expect(w.find('.sn-empty__description').exists()).toBe(false);
      expect(w.find('.sn-empty__icon').exists()).toBe(true);
    });
  });

  describe('icon slot', () => {
    it('replaces the default glyph with the icon slot', () => {
      const w = mountEmpty({}, { icon: () => h('span', { class: 'custom-glyph' }, '自定义') });
      expect(w.find('.sn-empty__icon svg').exists()).toBe(false);
      expect(w.find('.sn-empty__icon .custom-glyph').text()).toBe('自定义');
    });
  });

  describe('size', () => {
    it('applies the size modifier classes', () => {
      for (const size of ['tiny', 'small', 'medium', 'large', 'huge'] as const) {
        const w = mountEmpty({ size });
        expect(w.find('.sn-empty').classes()).toContain(`sn-empty--${size}`);
      }
    });
  });
});
