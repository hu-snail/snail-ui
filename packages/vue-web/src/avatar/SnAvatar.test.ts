import { afterEach, describe, expect, it, vi } from 'vitest';
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

interface IOController {
  fire: (isIntersecting: boolean) => void;
}

/** Stub IntersectionObserver, handing tests manual control. */
function stubIntersectionObserver(): IOController[] {
  const controllers: IOController[] = [];
  class IOStub {
    constructor(callback: IntersectionObserverCallback) {
      controllers.push({
        fire: (isIntersecting: boolean) => {
          callback(
            [{ isIntersecting } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
        },
      });
    }
    observe(): void {}
    disconnect(): void {}
    unobserve(): void {}
  }
  vi.stubGlobal('IntersectionObserver', IOStub);
  return controllers;
}

describe('SnAvatar lazy loading', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses the native loading attribute for a plain lazy avatar', () => {
    const w = mount(SnAvatar, { props: { src: '/a.png', lazy: true } });
    const img = w.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/a.png');
    expect(img.attributes('loading')).toBe('lazy');
  });

  it('keeps eager loading when lazy is off', () => {
    const w = mount(SnAvatar, { props: { src: '/a.png' } });
    expect(w.find('img').attributes('loading')).toBe('eager');
  });

  it('withholds the image until the observer reports visibility', async () => {
    const controllers = stubIntersectionObserver();
    const w = mount(SnAvatar, {
      props: {
        src: '/a.png',
        lazy: true,
        fallbackText: '张',
        intersectionObserverOptions: { rootMargin: '200px' },
      },
    });

    // Gated: the fallback content renders and there is no <img> yet.
    expect(w.find('img').exists()).toBe(false);
    expect(w.find('.sn-avatar__text').text()).toBe('张');
    expect(controllers).toHaveLength(1);

    controllers[0].fire(true);
    await w.vm.$nextTick();

    const img = w.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('/a.png');
    expect(img.attributes('loading')).toBe('eager'); // observer mode, not native
    expect(w.find('.sn-avatar__text').exists()).toBe(false);
  });

  it('falls back to the text thumbnail when the gated image fails', async () => {
    const controllers = stubIntersectionObserver();
    const w = mount(SnAvatar, {
      props: {
        src: '/broken.png',
        lazy: true,
        fallbackText: '张',
        intersectionObserverOptions: {},
      },
    });
    controllers[0].fire(true);
    await w.vm.$nextTick();
    await w.find('img').trigger('error');

    expect(w.emitted('error')).toHaveLength(1);
    expect(w.find('img').exists()).toBe(false);
    expect(w.find('.sn-avatar__text').text()).toBe('张');
  });

  it('loads eagerly when IntersectionObserver is unavailable', async () => {
    const globalWithIO = globalThis as { IntersectionObserver?: unknown };
    const original = globalWithIO.IntersectionObserver;
    delete globalWithIO.IntersectionObserver;
    try {
      const w = mount(SnAvatar, {
        props: { src: '/a.png', lazy: true, intersectionObserverOptions: {} },
      });
      // The gate resolves in `onMounted`; the image renders on the next tick.
      await w.vm.$nextTick();
      expect(w.find('img').exists()).toBe(true);
      expect(w.find('img').attributes('src')).toBe('/a.png');
    } finally {
      if (original) globalWithIO.IntersectionObserver = original;
    }
  });
});
