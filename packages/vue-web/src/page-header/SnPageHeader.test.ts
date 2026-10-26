import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnPageHeader from './SnPageHeader.vue';

/** Mount SnPageHeader through a wrapper component, mirroring real usage. */
function mountHeader(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnPageHeader },
      setup() {
        return () => h(SnPageHeader, props as never, slots as never);
      },
    }),
  );
}

describe('SnPageHeader (AUI-WEB-DD-027)', () => {
  describe('rendering', () => {
    it('renders the component marker with title and subtitle', () => {
      const w = mountHeader({ title: '页面标题', subtitle: '副标题' });
      const root = w.find('.sn-page-header');
      expect(root.attributes('data-snui-component')).toBe('page-header');
      expect(root.find('.sn-page-header__title').text()).toBe('页面标题');
      expect(root.find('.sn-page-header__subtitle').text()).toBe('副标题');
    });

    it('omits the title / subtitle blocks when neither prop nor slot is given', () => {
      const w = mountHeader({});
      expect(w.find('.sn-page-header__title').exists()).toBe(false);
      expect(w.find('.sn-page-header__subtitle').exists()).toBe(false);
    });

    it('renders extra content on the right', () => {
      const w = mountHeader({ title: '标题', extra: '操作区' });
      expect(w.find('.sn-page-header__extra').text()).toBe('操作区');
    });
  });

  describe('back control', () => {
    it('renders a back button with the accessible label and chevron glyph', () => {
      const w = mountHeader({ title: '标题' });
      const button = w.find('button[aria-label="Back"]');
      expect(button.exists()).toBe(true);
      expect(button.find('.sn-page-header__back-icon').exists()).toBe(true);
    });

    it('emits back with the event when the button is clicked', async () => {
      const onBack = vi.fn();
      const w = mountHeader({ title: '标题', onBack });
      await w.find('button[aria-label="Back"]').trigger('click');
      // Asserted via the onBack listener — `wrapper.emitted()` reads the
      // anonymous test wrapper's record, not the child component's.
      expect(onBack).toHaveBeenCalledTimes(1);
      expect(onBack.mock.calls[0]?.[0]).toBeInstanceOf(MouseEvent);
    });
  });

  describe('slots', () => {
    it('prefers the title / subtitle / extra slots over the props', () => {
      const w = mountHeader(
        { title: 'prop 标题', subtitle: 'prop 副标题', extra: 'prop 操作' },
        {
          title: () => 'slot 标题',
          subtitle: () => 'slot 副标题',
          extra: () => 'slot 操作',
        },
      );
      expect(w.find('.sn-page-header__title').text()).toBe('slot 标题');
      expect(w.find('.sn-page-header__subtitle').text()).toBe('slot 副标题');
      expect(w.find('.sn-page-header__extra').text()).toBe('slot 操作');
    });

    it('replaces the back glyph via the icon slot', () => {
      const w = mountHeader(
        { title: '标题' },
        { icon: () => h('b', { class: 'custom-glyph' }, '←') },
      );
      const button = w.find('button[aria-label="Back"]');
      expect(button.find('.custom-glyph').exists()).toBe(true);
      expect(button.find('.sn-page-header__back-icon').exists()).toBe(false);
    });

    it('replaces the whole back control via the back slot', () => {
      const w = mountHeader(
        { title: '标题' },
        { back: () => h('a', { class: 'custom-back', href: '/list' }, '返回列表') },
      );
      expect(w.find('a.custom-back').exists()).toBe(true);
      expect(w.find('button[aria-label="Back"]').exists()).toBe(false);
    });

    it('replaces the whole header via the header slot', () => {
      const w = mountHeader(
        { title: 'prop 标题' },
        { header: () => h('div', { class: 'custom-header' }, '自定义头部') },
      );
      expect(w.find('.custom-header').text()).toBe('自定义头部');
      expect(w.find('.sn-page-header__title').exists()).toBe(false);
    });

    it('renders body content below the header and a footer with a separator', () => {
      const w = mountHeader(
        { title: '标题' },
        {
          default: () => h('p', { class: 'body-text' }, '正文内容'),
          footer: () => h('div', { class: 'footer-text' }, '页脚内容'),
        },
      );
      expect(w.find('.sn-page-header__body .body-text').exists()).toBe(true);
      const footer = w.find('.sn-page-header__footer');
      expect(footer.text()).toBe('页脚内容');
      // The separator lives in the stylesheet; assert the structural class.
      expect(footer.classes()).toContain('sn-page-header__footer');
    });
  });
});
