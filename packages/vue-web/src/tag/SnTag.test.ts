import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnTag from './SnTag.vue';

/** Mount SnTag through a wrapper component, mirroring real usage. */
function mountTag(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnTag },
      setup() {
        return () => h(SnTag, props as never, slots as never);
      },
    }),
  );
}

describe('SnTag (AUI-WEB-DS-002)', () => {
  describe('rendering', () => {
    it('renders a bordered medium default tag by default', () => {
      const w = mountTag({}, { default: () => '标签' });
      const root = w.find('.sn-tag');
      expect(root.classes()).toContain('sn-tag');
      expect(root.classes()).toContain('sn-tag--default');
      expect(root.classes()).toContain('sn-tag--medium');
      expect(root.classes()).toContain('sn-tag--bordered');
      expect(root.text()).toBe('标签');
    });

    it('applies the type modifier class for every semantic type', () => {
      for (const type of ['primary', 'info', 'success', 'warning', 'error'] as const) {
        const w = mountTag({ type });
        expect(w.find('.sn-tag').classes()).toContain(`sn-tag--${type}`);
      }
    });

    it('applies the size modifier classes', () => {
      for (const size of ['small', 'medium', 'large'] as const) {
        const w = mountTag({ size });
        expect(w.find('.sn-tag').classes()).toContain(`sn-tag--${size}`);
      }
    });

    it('drops the border when bordered is false', () => {
      const w = mountTag({ bordered: false });
      expect(w.find('.sn-tag').classes()).not.toContain('sn-tag--bordered');
    });

    it('marks round tags', () => {
      const w = mountTag({ round: true });
      expect(w.find('.sn-tag').classes()).toContain('sn-tag--round');
    });

    it('applies the color override via inline style', () => {
      const w = mountTag({ color: '#ff5722' });
      expect(w.find('.sn-tag').attributes('style')).toContain('background');
    });
  });
  describe('shape (AUI additive, §112.3a)', () => {
    it('renders no shape class for the square default', () => {
      const w = mountTag();
      expect(w.find('.sn-tag').classes()).not.toContain('sn-tag--square');
    });

    it('renders one modifier class per special shape', () => {
      for (const shape of ['round', 'skew', 'ribbon', 'fold', 'ticket'] as const) {
        const w = mountTag({ shape });
        expect(w.find('.sn-tag').classes()).toContain(`sn-tag--${shape}`);
      }
    });

    it('treats round=true as the round shape sugar', () => {
      const w = mountTag({ round: true });
      expect(w.find('.sn-tag').classes()).toContain('sn-tag--round');
    });

    it('lets shape win over the round sugar', () => {
      const w = mountTag({ round: true, shape: 'skew' });
      const classes = w.find('.sn-tag').classes();
      expect(classes).toContain('sn-tag--skew');
      expect(classes).not.toContain('sn-tag--round');
    });
  });

  describe('custom color (n-tag string | object)', () => {
    it('keeps the plain string form working (background only + auto text)', () => {
      const w = mountTag({ color: '#f53f3f' });
      const style = w.find('.sn-tag').attributes('style') ?? '';
      expect(style).toContain('background');
      expect(style).toContain('color');
    });

    it('derives light text for dark backgrounds', () => {
      const w = mountTag({ color: '#1d2129' });
      expect(w.find('.sn-tag').attributes('style')).toContain(
        'var(--sn-web-color-text-on-primary)',
      );
    });

    it('derives dark text for light backgrounds', () => {
      const w = mountTag({ color: '#ffd666' });
      expect(w.find('.sn-tag').attributes('style')).toContain('var(--sn-tag-contrast-text-dark)');
    });

    it('applies the { color, borderColor, textColor } object form verbatim', () => {
      const w = mountTag({
        color: { color: '#fff7e6', borderColor: '#ffa940', textColor: '#d46b08' },
      });
      const style = w.find('.sn-tag').attributes('style') ?? '';
      expect(style).toContain('#fff7e6');
      expect(style).toContain('#ffa940');
      expect(style).toContain('#d46b08');
    });

    it('auto-picks contrast text for the object form without textColor', () => {
      const w = mountTag({ color: { color: '#f53f3f' } });
      expect(w.find('.sn-tag').attributes('style')).toContain(
        'var(--sn-web-color-text-on-primary)',
      );
    });

    it('suppresses the custom color on an unchecked checkable tag', () => {
      const w = mountTag({ checkable: true, checked: false, color: '#f53f3f' });
      expect(w.find('.sn-tag').attributes('style')).toBeUndefined();
    });

    it('applies the custom color once the checkable tag is checked', () => {
      const w = mountTag({ checkable: true, checked: true, color: '#f53f3f' });
      expect(w.find('.sn-tag').attributes('style')).toContain('#f53f3f');
    });
  });

  describe('loading (AUI additive, §112.3a)', () => {
    it('renders the spinner and marks the tag aria-busy', () => {
      const w = mountTag({ loading: true });
      expect(w.find('.sn-tag__spinner').exists()).toBe(true);
      expect(w.find('.sn-tag').attributes('aria-busy')).toBe('true');
    });

    it('replaces the icon slot with the spinner while loading', () => {
      const w = mountTag({ loading: true }, { icon: () => 'ICONSLOT' });
      expect(w.find('.sn-tag__spinner').exists()).toBe(true);
      expect(w.find('.sn-tag__icon').text()).not.toContain('ICONSLOT');
    });

    it('blocks close while loading', async () => {
      const w = mountTag({ loading: true, closable: true });
      await w.find('.sn-tag__close').trigger('click');
      await w.vm.$nextTick();
      expect(w.findComponent(SnTag).emitted('close')).toBeUndefined();
      expect(w.find('.sn-tag').exists()).toBe(true);
    });

    it('renders the close button disabled while loading', () => {
      const w = mountTag({ loading: true, closable: true });
      expect(w.find('.sn-tag__close').attributes('disabled')).toBeDefined();
    });

    it('blocks the checkable toggle while loading', async () => {
      const w = mountTag({ loading: true, checkable: true, checked: false });
      await w.find('.sn-tag').trigger('click');
      expect(w.findComponent(SnTag).emitted('update:checked')).toBeUndefined();
    });

    it('marks a loading checkable tag as unfocusable', () => {
      const w = mountTag({ loading: true, checkable: true });
      expect(w.find('.sn-tag').attributes('tabindex')).toBeUndefined();
    });
  });

  describe('slots (n-tag icon / avatar / close-icon)', () => {
    it('renders the icon slot before the label', () => {
      const w = mountTag({}, { icon: () => 'ICON', default: () => '标签' });
      const icon = w.find('.sn-tag__icon');
      expect(icon.exists()).toBe(true);
      expect(icon.text()).toBe('ICON');
      expect(w.find('.sn-tag__label').text()).toBe('标签');
    });

    it('renders the avatar slot before the icon', () => {
      const w = mountTag({}, { avatar: () => 'AVATAR', icon: () => 'ICON', default: () => '标签' });
      const children = w.find('.sn-tag').element.children;
      expect(children[0]?.classList.contains('sn-tag__avatar')).toBe(true);
      expect(children[1]?.classList.contains('sn-tag__icon')).toBe(true);
      expect(children[2]?.classList.contains('sn-tag__label')).toBe(true);
    });

    it('replaces the close glyph via the close-icon slot', () => {
      const w = mountTag({ closable: true }, { 'close-icon': () => 'XCUSTOM' });
      const btn = w.find('.sn-tag__close');
      expect(btn.text()).toBe('XCUSTOM');
      expect(btn.find('svg').exists()).toBe(false);
    });

    it('keeps the default svg glyph when close-icon is not provided', () => {
      const w = mountTag({ closable: true });
      expect(w.find('.sn-tag__close svg').exists()).toBe(true);
    });
  });

  describe('closable', () => {
    it('renders no close button by default', () => {
      const w = mountTag();
      expect(w.find('.sn-tag__close').exists()).toBe(false);
    });

    it('renders a close button with a real svg glyph', () => {
      // AGENTS.md §113: the close glyph must be an inline svg, never emoji.
      const w = mountTag({ closable: true });
      const btn = w.find('.sn-tag__close');
      expect(btn.exists()).toBe(true);
      expect(btn.attributes('aria-label')).toBe('关闭');
      expect(btn.find('svg').exists()).toBe(true);
    });

    it('emits close and hides the tag when the close button is clicked', async () => {
      const w = mountTag({ closable: true }, { default: () => '标签' });
      await w.find('.sn-tag__close').trigger('click');
      await w.vm.$nextTick();

      expect(w.findComponent(SnTag).emitted('close')).toHaveLength(1);
      expect(w.find('.sn-tag').exists()).toBe(false);
    });

    it('does not toggle the checked state when closing a checkable tag', async () => {
      const w = mountTag({ closable: true, checkable: true });
      await w.find('.sn-tag__close').trigger('click');
      await w.vm.$nextTick();

      expect(w.findComponent(SnTag).emitted('close')).toHaveLength(1);
      expect(w.findComponent(SnTag).emitted('update:checked')).toBeUndefined();
    });

    it('keeps the tag when disabled, even on close click', async () => {
      const w = mountTag({ closable: true, disabled: true });
      await w.find('.sn-tag__close').trigger('click');
      await w.vm.$nextTick();

      expect(w.findComponent(SnTag).emitted('close')).toBeUndefined();
      expect(w.find('.sn-tag').exists()).toBe(true);
    });
  });

  describe('checkable', () => {
    it('emits update:checked with the inverted value on click', async () => {
      const w = mountTag({ checkable: true, checked: false });
      await w.find('.sn-tag').trigger('click');

      expect(w.findComponent(SnTag).emitted('update:checked')?.[0]?.[0]).toBe(true);
    });

    it('supports v-model:checked', async () => {
      const w = mount(
        defineComponent({
          components: { SnTag },
          setup() {
            const checked = ref(false);
            return () =>
              h(SnTag, {
                checkable: true,
                checked: checked.value,
                'onUpdate:checked': (value: boolean) => {
                  checked.value = value;
                },
              } as never);
          },
        }),
      );

      await w.find('.sn-tag').trigger('click');
      expect(w.find('.sn-tag').classes()).toContain('sn-tag--checked');

      await w.find('.sn-tag').trigger('click');
      expect(w.find('.sn-tag').classes()).not.toContain('sn-tag--checked');
    });

    it('toggles via keyboard enter and space', async () => {
      const w = mountTag({ checkable: true, checked: false });
      await w.find('.sn-tag').trigger('keydown.enter');
      expect(w.findComponent(SnTag).emitted('update:checked')?.[0]?.[0]).toBe(true);

      await w.find('.sn-tag').trigger('keydown.space');
      expect(w.findComponent(SnTag).emitted('update:checked')?.[1]?.[0]).toBe(true);
    });

    it('does not toggle when not checkable', async () => {
      const w = mountTag({ checked: false });
      await w.find('.sn-tag').trigger('click');
      expect(w.findComponent(SnTag).emitted('update:checked')).toBeUndefined();
    });

    it('does not toggle when disabled', async () => {
      const w = mountTag({ checkable: true, disabled: true });
      await w.find('.sn-tag').trigger('click');
      expect(w.findComponent(SnTag).emitted('update:checked')).toBeUndefined();
    });

    it('exposes button semantics for assistive tech', () => {
      const w = mountTag({ checkable: true, checked: true });
      const root = w.find('.sn-tag');
      expect(root.attributes('role')).toBe('button');
      expect(root.attributes('aria-pressed')).toBe('true');
      expect(root.attributes('tabindex')).toBe('0');
    });

    it('marks a disabled checkable tag as not focusable', () => {
      const w = mountTag({ checkable: true, disabled: true });
      const root = w.find('.sn-tag');
      expect(root.attributes('aria-disabled')).toBe('true');
      expect(root.attributes('tabindex')).toBeUndefined();
    });
  });
});
