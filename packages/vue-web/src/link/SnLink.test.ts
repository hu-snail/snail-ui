import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnLink from './SnLink.vue';

/** Mount SnLink through a wrapper component, mirroring real usage. */
function mountLink(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnLink },
      setup() {
        return () => h(SnLink, props as never, slots as never);
      },
    }),
  );
}

describe('SnLink (AUI-WEB-DD-028)', () => {
  describe('rendering', () => {
    it('renders an anchor with the component marker and slot text', () => {
      const w = mountLink({ href: 'https://example.com' }, { default: () => '示例链接' });
      const root = w.find('a.sn-link');
      expect(root.attributes('data-snui-component')).toBe('link');
      expect(root.attributes('href')).toBe('https://example.com');
      expect(root.find('.sn-link__text').text()).toBe('示例链接');
    });

    it('forwards target and rel onto the anchor', () => {
      const w = mountLink(
        { href: 'https://example.com', target: '_blank', rel: 'noopener' },
        { default: () => '外链' },
      );
      expect(w.find('a').attributes('target')).toBe('_blank');
      expect(w.find('a').attributes('rel')).toBe('noopener');
    });

    it('renders a custom tag without anchor attributes', () => {
      const w = mountLink(
        { tag: 'span', href: '/ignored', target: '_blank' },
        { default: () => '伪链接' },
      );
      const span = w.find('span.sn-link');
      expect(span.exists()).toBe(true);
      expect(span.attributes('href')).toBeUndefined();
      expect(span.attributes('target')).toBeUndefined();
    });
  });

  describe('type colors', () => {
    it('maps each type to the matching modifier class', () => {
      for (const type of ['default', 'primary', 'info', 'success', 'warning', 'error'] as const) {
        const w = mountLink({ type }, { default: () => '链接' });
        expect(w.find('.sn-link').classes()).toContain(`sn-link--${type}`);
      }
    });

    it('defaults to the default type', () => {
      const w = mountLink({}, { default: () => '链接' });
      expect(w.find('.sn-link').classes()).toContain('sn-link--default');
    });
  });

  describe('underline', () => {
    it('marks permanently underlined links with the modifier class', () => {
      const plain = mountLink({}, { default: () => '链接' });
      expect(plain.find('.sn-link').classes()).not.toContain('sn-link--underline');

      const underlined = mountLink({ underline: true }, { default: () => '链接' });
      expect(underlined.find('.sn-link').classes()).toContain('sn-link--underline');
    });
  });

  describe('disabled', () => {
    it('sets aria-disabled and the disabled class', () => {
      const w = mountLink({ disabled: true, href: '/x' }, { default: () => '禁用链接' });
      const a = w.find('a.sn-link');
      expect(a.attributes('aria-disabled')).toBe('true');
      expect(a.classes()).toContain('sn-link--disabled');
    });

    it('suppresses the click event and drops href while disabled', async () => {
      const onClick = vi.fn();
      const w = mountLink({ disabled: true, href: '/x', onClick }, { default: () => '禁用链接' });
      expect(w.find('a').attributes('href')).toBeUndefined();
      await w.find('a.sn-link').trigger('click');
      // `wrapper.emitted('click')` is polluted by native DOM clicks (the
      // test wrapper declares no emits), so the contract is asserted via
      // the onClick listener instead.
      expect(onClick).not.toHaveBeenCalled();
    });

    it('prevents navigation on a disabled anchor click', async () => {
      const w = mountLink({ disabled: true, href: '/x' }, { default: () => '禁用链接' });
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      await w.find('a.sn-link').element.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('emits click when enabled', async () => {
      const onClick = vi.fn();
      const w = mountLink({ href: '/x', onClick }, { default: () => '链接' });
      await w.find('a.sn-link').trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('slots', () => {
    it('renders the icon slot before the text', () => {
      const w = mountLink(
        { href: '/x' },
        {
          icon: () => h('i', { class: 'icon-glyph' }),
          default: () => '带图标',
        },
      );
      const root = w.find('a.sn-link');
      expect(root.find('.sn-link__icon .icon-glyph').exists()).toBe(true);
      expect(root.find('.sn-link__text').text()).toBe('带图标');
    });

    it('omits the icon wrapper when the slot is absent', () => {
      const w = mountLink({ href: '/x' }, { default: () => '纯文本' });
      expect(w.find('.sn-link__icon').exists()).toBe(false);
    });
  });
});
