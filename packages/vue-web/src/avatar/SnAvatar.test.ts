import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { Search } from 'lucide-vue-next';
import SnAvatar from './SnAvatar.vue';
import { registerSnIcons } from '../icon/sn-icon-registry';
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions';

describe('SnAvatar (AUI-WEB-DS-001)', () => {
  it('renders a medium square avatar by default', () => {
    const w = mount(SnAvatar);
    expect(w.classes()).toContain('sn-avatar');
    expect(w.classes()).toContain('sn-avatar--medium');
    expect(w.classes()).not.toContain('sn-avatar--circle');
    expect(w.find('img').exists()).toBe(false);
  });

  it('applies the named size classes', () => {
    for (const size of ['small', 'medium', 'large'] as const) {
      const w = mount(SnAvatar, { props: { size } });
      expect(w.classes()).toContain(`sn-avatar--${size}`);
    }
  });

  it('applies a pixel size via inline style', () => {
    const w = mount(SnAvatar, { props: { size: 64 } });
    expect(w.classes()).not.toContain('sn-avatar--medium');
    expect(w.attributes('style')).toContain('width: 64px');
    expect(w.attributes('style')).toContain('height: 64px');
  });

  it('renders the image when src is given', () => {
    const w = mount(SnAvatar, { props: { src: '/a.png' } });
    expect(w.find('img').exists()).toBe(true);
    expect(w.find('img').attributes('src')).toBe('/a.png');
  });

  it('fits the image with objectFit', () => {
    const w = mount(SnAvatar, { props: { src: '/a.png', objectFit: 'contain' } });
    expect(w.find('img').attributes('style')).toContain('object-fit: contain');
  });

  it('emits error and falls back when the image fails to load', async () => {
    const w = mount(SnAvatar, {
      props: { src: '/broken.png', fallbackText: '张' },
    });
    await w.find('img').trigger('error');

    expect(w.emitted('error')).toHaveLength(1);
    expect(w.find('img').exists()).toBe(false);
    expect(w.find('.sn-avatar__text').text()).toBe('张');
  });

  it('recovers the image when src is replaced after a load error', async () => {
    const w = mount(SnAvatar, { props: { src: '/broken.png' } });
    await w.find('img').trigger('error');
    expect(w.find('img').exists()).toBe(false);

    await w.setProps({ src: '/fixed.png' });
    expect(w.find('img').exists()).toBe(true);
    expect(w.find('img').attributes('src')).toBe('/fixed.png');
  });

  it('shows the fallback text when there is no src', () => {
    const w = mount(SnAvatar, { props: { fallbackText: '张' } });
    expect(w.find('.sn-avatar__text').text()).toBe('张');
  });

  it('lets the default slot replace the fallback content', () => {
    const w = mount(SnAvatar, {
      props: { fallbackText: '张' },
      slots: { default: '自定义' },
    });
    expect(w.text()).toBe('自定义');
    expect(w.find('.sn-avatar__text').exists()).toBe(false);
  });

  it('renders the builtin person glyph when nothing else is given', () => {
    const w = mount(SnAvatar);
    expect(w.find('.sn-avatar__icon svg').exists()).toBe(true);
  });

  it('renders a registered icon name as a real svg', () => {
    registerSnIcons({ Search });
    const w = mount(SnAvatar, { props: { icon: 'Search' } });
    expectIconRendered(w.find('.sn-avatar__icon'), '.sn-icon');
    expectNoMissingIcons(w, 'SnAvatar icon');
  });

  it('lets the icon slot replace the builtin glyph', () => {
    const w = mount(SnAvatar, {
      slots: { icon: () => h('span', { class: 'custom-icon' }) },
    });
    expect(w.find('.sn-avatar__icon .custom-icon').exists()).toBe(true);
  });

  it('applies circle and round corner classes', () => {
    const circle = mount(SnAvatar, { props: { circle: true } });
    expect(circle.classes()).toContain('sn-avatar--circle');

    const round = mount(SnAvatar, { props: { round: true } });
    expect(round.classes()).toContain('sn-avatar--round');
  });

  it('applies the color override via inline style', () => {
    const w = mount(SnAvatar, { props: { color: '#ff5722' } });
    expect(w.attributes('style')).toContain('background');
  });
});
