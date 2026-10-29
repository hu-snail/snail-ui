/**
 * sn-swiper unit tests — uni-end carousel (wd-swiper parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `list` accepts strings and `SwiperItem` objects (`valueKey` / `textKey`)
 *   - `autoplay` / `interval` / `duration` / `loop` / `displayMultipleItems`
 *     forward to the native `<swiper>`
 *   - `height` / `radius` become inline lengths
 *   - `indicator` accepts `true`, `false` and a config object; `minShowNum`
 *     gates visibility and `type` picks dots / bars / fraction
 *   - `change` / `animationfinish` / `click` / `update:current` payloads
 *   - `displayMultipleItems > 1` counts indicator PAGES (N-M+1), not slides
 *   - `card3d` (AUI-additive) adds the root class + a per-slide 3D transform
 *
 * Untestable in happy-dom: autoplay timing with fake timers, loop wrap-around
 * and touch-swipe direction physics. The component delegates all of these to
 * the native `<swiper>` element (see the SFC header — no timer or touch
 * handler lives here, so there is nothing to fake); happy-dom renders
 * `<swiper>` as an inert unknown element, so only the forwarded attributes and
 * the re-emitted change / animationfinish events can be verified.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSwiper from './sn-swiper.vue';

const list = ['https://x/1.png', 'https://x/2.png', 'https://x/3.png'];

/** Parse the card3d `rotateY(...)` angle from an inline style (`null` when flat). */
function readRotateY(style: string | undefined): number | null {
  const match = /rotateY\((-?[\d.]+)deg\)/.exec(style ?? '');
  return match ? Number(match[1]) : null;
}

describe('sn-swiper', () => {
  it('renders one native slide per list entry', () => {
    const wrapper = mount(SnSwiper, { props: { list } });
    expect(wrapper.findAll('.sn-swiper__item')).toHaveLength(3);
    expect(wrapper.findAll('.sn-swiper__slide')).toHaveLength(3);
  });

  it('forwards the native swiper props', () => {
    const wrapper = mount(SnSwiper, {
      props: {
        list,
        autoplay: false,
        interval: 3000,
        duration: 500,
        loop: false,
        displayMultipleItems: 2,
        direction: 'vertical',
      },
    });
    const swiper = wrapper.find('.sn-swiper__native');
    expect(swiper.attributes('autoplay')).toBe('false');
    expect(swiper.attributes('interval')).toBe('3000');
    expect(swiper.attributes('duration')).toBe('500');
    expect(swiper.attributes('circular')).toBe('false');
    expect(swiper.attributes('display-multiple-items')).toBe('2');
    expect(swiper.attributes('vertical')).toBe('true');
    expect(wrapper.classes()).toContain('sn-swiper--vertical');
  });

  it('applies height and radius as inline lengths', () => {
    // `px` strings: happy-dom drops CSS lengths it cannot parse (`rpx`).
    const wrapper = mount(SnSwiper, { props: { list, height: '240px', radius: '12px' } });
    const style = wrapper.attributes('style') ?? '';
    expect(style).toContain('height: 240px');
    expect(style).toContain('border-radius: 12px');
  });

  it('reads item objects through valueKey and textKey', () => {
    const wrapper = mount(SnSwiper, {
      props: {
        list: [{ url: 'https://x/a.png', title: '第一张' }],
        valueKey: 'url',
        textKey: 'title',
      },
    });
    expect(wrapper.find('.sn-swiper__caption-text').text()).toBe('第一张');
    expect(wrapper.find('.sn-img__image').attributes('src')).toBe('https://x/a.png');
  });

  it('falls back to the poster for a video item', () => {
    const wrapper = mount(SnSwiper, {
      props: { list: [{ type: 'video', poster: 'https://x/p.png' }] },
    });
    expect(wrapper.find('.sn-img__image').attributes('src')).toBe('https://x/p.png');
  });

  it('shows dots by default when there are at least two slides', () => {
    const wrapper = mount(SnSwiper, { props: { list } });
    expect(wrapper.find('.sn-swiper__indicator').exists()).toBe(true);
    expect(wrapper.findAll('.sn-swiper__dot')).toHaveLength(3);
  });

  it('hides the indicator when indicator is false', () => {
    const wrapper = mount(SnSwiper, { props: { list, indicator: false } });
    expect(wrapper.find('.sn-swiper__indicator').exists()).toBe(false);
  });

  it('hides the indicator below minShowNum', () => {
    const wrapper = mount(SnSwiper, {
      props: { list, indicator: { minShowNum: 5 } },
    });
    expect(wrapper.find('.sn-swiper__indicator').exists()).toBe(false);
  });

  it('renders the dots-bar indicator', () => {
    const wrapper = mount(SnSwiper, { props: { list, indicator: { type: 'dots-bar' } } });
    expect(wrapper.findAll('.sn-swiper__dot--bar')).toHaveLength(3);
    expect(wrapper.find('.sn-swiper__indicator').classes()).toContain(
      'sn-swiper__indicator--dots-bar',
    );
  });

  it('renders the fraction indicator', () => {
    const wrapper = mount(SnSwiper, {
      props: { list, current: 1, indicator: { type: 'fraction' } },
    });
    expect(wrapper.find('.sn-swiper__fraction-text').text()).toBe('2/3');
  });

  it('marks the active dot', () => {
    const wrapper = mount(SnSwiper, { props: { list, current: 2 } });
    const dots = wrapper.findAll('.sn-swiper__dot');
    expect(dots[2]!.classes()).toContain('sn-swiper__dot--active');
    expect(dots[0]!.classes()).not.toContain('sn-swiper__dot--active');
  });

  it('applies the indicator position class', () => {
    const wrapper = mount(SnSwiper, { props: { list, indicatorPosition: 'top-right' } });
    expect(wrapper.find('.sn-swiper__indicator').classes()).toContain(
      'sn-swiper__indicator--top-right',
    );
  });

  it('renders the controls only when showControls is set', () => {
    const plain = mount(SnSwiper, { props: { list } });
    expect(plain.find('.sn-swiper__control').exists()).toBe(false);

    const withControls = mount(SnSwiper, {
      props: { list, indicator: { showControls: true } },
    });
    expect(withControls.findAll('.sn-swiper__control')).toHaveLength(2);
  });

  it('emits change + update:current from the native change event', async () => {
    // `<swiper>` is a uni-app built-in element, not a Vue component, so the
    // event is dispatched on the DOM node the way the runtime would.
    const wrapper = mount(SnSwiper, { props: { list } });
    await wrapper.find('.sn-swiper__native').trigger('change', {
      detail: { current: 1, source: 'touch' },
    });
    expect(wrapper.emitted('update:current')?.[0]).toEqual([1]);
    expect(wrapper.emitted('change')?.[0]).toEqual([{ current: 1, source: 'touch' }]);
  });

  it('emits animationfinish from the native event', async () => {
    const wrapper = mount(SnSwiper, { props: { list } });
    await wrapper.find('.sn-swiper__native').trigger('animationfinish', {
      detail: { current: 2, source: 'autoplay' },
    });
    expect(wrapper.emitted('animationfinish')?.[0]).toEqual([{ current: 2, source: 'autoplay' }]);
  });

  it('emits click with the slide index and raw item', async () => {
    const wrapper = mount(SnSwiper, { props: { list } });
    await wrapper.findAll('.sn-swiper__slide')[1]!.trigger('tap');
    expect(wrapper.emitted('click')?.[0]).toEqual([{ index: 1, item: list[1] }]);
  });

  it('forwards the custom classes on the nodes happy-dom can render', () => {
    // `<swiper>` / `<swiper-item>` are uni-app built-ins, so their subtree is
    // not rendered under happy-dom; the root + indicator still are.
    const wrapper = mount(SnSwiper, {
      props: {
        list,
        customClass: 'my-swiper',
        customIndicatorClass: 'my-indicator',
      },
    });
    expect(wrapper.classes()).toContain('my-swiper');
    expect(wrapper.find('.sn-swiper__indicator').classes()).toContain('my-indicator');
  });

  it('forwards the video / adjust-height parity props to the native swiper', () => {
    const wrapper = mount(SnSwiper, {
      props: {
        list,
        videoLoop: true,
        muted: true,
        autoplayVideo: true,
        stopPreviousVideo: true,
        stopAutoplayWhenVideoPlay: true,
        adjustHeight: 'highest',
        adjustVerticalHeight: true,
      },
    });
    const swiper = wrapper.find('.sn-swiper__native');
    expect(swiper.attributes('video-loop')).toBe('true');
    expect(swiper.attributes('muted')).toBe('true');
    expect(swiper.attributes('autoplay-video')).toBe('true');
    expect(swiper.attributes('stop-previous-video')).toBe('true');
    expect(swiper.attributes('stop-autoplay-when-video-play')).toBe('true');
    expect(swiper.attributes('adjust-height')).toBe('highest');
    expect(swiper.attributes('adjust-vertical-height')).toBe('true');
  });

  it('leaves adjust-height off the native swiper when unset', () => {
    const wrapper = mount(SnSwiper, { props: { list } });
    expect(wrapper.find('.sn-swiper__native').attributes('adjust-height')).toBeUndefined();
  });

  it('accepts the prev / next class parity props without changing the render', () => {
    const wrapper = mount(SnSwiper, {
      props: {
        list,
        customPrevImageClass: 'p-img',
        customNextImageClass: 'n-img',
        customPrevClass: 'p-item',
        customNextClass: 'n-item',
      },
    });
    expect(wrapper.findAll('.sn-swiper__item')).toHaveLength(3);
  });

  describe('native swiper forwarding', () => {
    it('publishes the margins as custom properties only when set', () => {
      const withMargins = mount(SnSwiper, {
        props: { list, previousMargin: 20, nextMargin: 30 },
      });
      const style = withMargins.find('.sn-swiper__native').attributes('style') ?? '';
      // Custom properties survive happy-dom's CSS parser (regular rpx lengths
      // do not), so the raw rpx values are assertable here.
      expect(style).toContain('--sn-swiper-previous-margin: 20rpx');
      expect(style).toContain('--sn-swiper-next-margin: 30rpx');

      const withoutMargins = mount(SnSwiper, { props: { list } });
      expect(withoutMargins.find('.sn-swiper__native').attributes('style')).toBeUndefined();
    });

    it('forwards snapToEdge to the native swiper', () => {
      const off = mount(SnSwiper, { props: { list } });
      expect(off.find('.sn-swiper__native').attributes('snap-to-edge')).toBe('false');

      const on = mount(SnSwiper, { props: { list, snapToEdge: true } });
      expect(on.find('.sn-swiper__native').attributes('snap-to-edge')).toBe('true');
    });

    it('drops the easing-function attribute for the default easing', () => {
      const wrapper = mount(SnSwiper, { props: { list } });
      expect(wrapper.find('.sn-swiper__native').attributes('easing-function')).toBeUndefined();
    });

    it('forwards a non-default easing-function', () => {
      const wrapper = mount(SnSwiper, { props: { list, easingFunction: 'linear' } });
      expect(wrapper.find('.sn-swiper__native').attributes('easing-function')).toBe('linear');
    });

    it('forwards the current index to the native swiper', () => {
      const wrapper = mount(SnSwiper, { props: { list, current: 2 } });
      expect(wrapper.find('.sn-swiper__native').attributes('current')).toBe('2');
    });

    it('forwards a px height string as an inline length on the root', () => {
      const wrapper = mount(SnSwiper, { props: { list, height: '320px' } });
      expect(wrapper.attributes('style')).toContain('height: 320px');
    });
  });

  describe('slide content', () => {
    it('forwards imageMode to the inner image', () => {
      const wrapper = mount(SnSwiper, { props: { list, imageMode: 'aspectFit' } });
      expect(wrapper.find('.sn-img__image').attributes('mode')).toBe('aspectFit');
    });

    it('defaults imageMode to aspectFill', () => {
      const wrapper = mount(SnSwiper, { props: { list } });
      expect(wrapper.find('.sn-img__image').attributes('mode')).toBe('aspectFill');
    });

    it('forwards showMenuByLongpress to the inner image', () => {
      const wrapper = mount(SnSwiper, { props: { list, showMenuByLongpress: true } });
      expect(wrapper.find('.sn-img__image').attributes('show-menu-by-longpress')).toBe('true');
    });

    it('applies customItemClass to every slide', () => {
      const wrapper = mount(SnSwiper, { props: { list, customItemClass: 'my-item' } });
      for (const item of wrapper.findAll('.sn-swiper__item')) {
        expect(item.classes()).toContain('my-item');
      }
    });

    it('applies customTextClass / customTextStyle to the caption', () => {
      const wrapper = mount(SnSwiper, {
        props: {
          list: [{ value: 'https://x/1.png', text: '第一张' }],
          customTextClass: 'my-caption',
          customTextStyle: 'background: red',
        },
      });
      const caption = wrapper.find('.sn-swiper__caption');
      expect(caption.attributes('style')).toContain('background: red');
      expect(caption.find('.sn-swiper__caption-text').classes()).toContain('my-caption');
    });

    it('renders no caption for a string slide', () => {
      const wrapper = mount(SnSwiper, { props: { list: ['https://x/1.png'] } });
      expect(wrapper.find('.sn-swiper__caption').exists()).toBe(false);
    });

    it('renders nothing for an empty list', () => {
      const wrapper = mount(SnSwiper, { props: { list: [] } });
      expect(wrapper.findAll('.sn-swiper__item')).toHaveLength(0);
      expect(wrapper.find('.sn-swiper__indicator').exists()).toBe(false);
    });
  });

  describe('indicator details', () => {
    it('hides the indicator for a single slide by default', () => {
      const wrapper = mount(SnSwiper, { props: { list: ['https://x/1.png'] } });
      expect(wrapper.find('.sn-swiper__indicator').exists()).toBe(false);
    });

    it('marks the indicator aria-hidden', () => {
      const wrapper = mount(SnSwiper, { props: { list } });
      expect(wrapper.find('.sn-swiper__indicator').attributes('aria-hidden')).toBe('true');
    });

    it('shows a single slide when minShowNum is lowered', () => {
      const wrapper = mount(SnSwiper, {
        props: { list: ['https://x/1.png'], indicator: { minShowNum: 1 } },
      });
      expect(wrapper.find('.sn-swiper__indicator').exists()).toBe(true);
    });

    it('tracks the bound current in the fraction text', () => {
      const wrapper = mount(SnSwiper, {
        props: { list, current: 0, indicator: { type: 'fraction' } },
      });
      expect(wrapper.find('.sn-swiper__fraction-text').text()).toBe('1/3');
    });

    it('moves the active dot when the bound current changes', async () => {
      const wrapper = mount(SnSwiper, { props: { list, current: 0 } });
      await wrapper.find('.sn-swiper__native').trigger('change', {
        detail: { current: 1, source: 'touch' },
      });
      await wrapper.setProps({ current: 1 });
      const dots = wrapper.findAll('.sn-swiper__dot');
      expect(dots[1]!.classes()).toContain('sn-swiper__dot--active');
      expect(dots[0]!.classes()).not.toContain('sn-swiper__dot--active');
    });
  });

  describe('pages with displayMultipleItems', () => {
    it('counts pages, not slides, for the dot indicator', () => {
      const wrapper = mount(SnSwiper, { props: { list, displayMultipleItems: 2 } });
      // 3 slides shown 2 at a time snap over 2 windows, not 3 slides.
      const dots = wrapper.findAll('.sn-swiper__dot');
      expect(dots).toHaveLength(2);
      expect(dots[0]!.classes()).toContain('sn-swiper__dot--active');
    });

    it('lights the trailing page dot once the window reaches the end', () => {
      const wrapper = mount(SnSwiper, {
        props: { list, displayMultipleItems: 2, current: 2 },
      });
      const dots = wrapper.findAll('.sn-swiper__dot');
      expect(dots).toHaveLength(2);
      expect(dots[1]!.classes()).toContain('sn-swiper__dot--active');
      expect(dots[0]!.classes()).not.toContain('sn-swiper__dot--active');
    });

    it('shows the fraction over pages, not slides', () => {
      const wrapper = mount(SnSwiper, {
        props: { list, displayMultipleItems: 2, current: 1, indicator: { type: 'fraction' } },
      });
      expect(wrapper.find('.sn-swiper__fraction-text').text()).toBe('2/2');
    });
  });

  describe('card3d', () => {
    it('adds the root class and slide transforms only when card3d is on', () => {
      const flat = mount(SnSwiper, { props: { list } });
      expect(flat.classes()).not.toContain('sn-swiper--card3d');
      expect(flat.find('.sn-swiper__slide').attributes('style')).toBeUndefined();

      const card = mount(SnSwiper, { props: { list, card3d: true } });
      expect(card.classes()).toContain('sn-swiper--card3d');
      expect(card.find('.sn-swiper__slide').attributes('style')).toContain('perspective(');
    });

    it('leaves the centre card flat and leans its neighbours', () => {
      const wrapper = mount(SnSwiper, { props: { list, card3d: true, current: 1, loop: false } });
      const slides = wrapper.findAll('.sn-swiper__slide');
      expect(readRotateY(slides[1]!.attributes('style'))).toBeNull();
      expect(readRotateY(slides[0]!.attributes('style'))).toBe(18);
      expect(readRotateY(slides[2]!.attributes('style'))).toBe(-18);
    });

    it('re-centres the stack when current changes', async () => {
      const wrapper = mount(SnSwiper, { props: { list, card3d: true, current: 0, loop: false } });
      expect(readRotateY(wrapper.findAll('.sn-swiper__slide')[0]!.attributes('style'))).toBeNull();

      await wrapper.setProps({ current: 2 });
      const slides = wrapper.findAll('.sn-swiper__slide');
      expect(readRotateY(slides[2]!.attributes('style'))).toBeNull();
      expect(readRotateY(slides[0]!.attributes('style'))).toBe(36);
    });

    it('centres the middle card of a multi-item window', () => {
      const wrapper = mount(SnSwiper, {
        props: {
          list: [...list, 'https://x/4.png', 'https://x/5.png'],
          card3d: true,
          displayMultipleItems: 3,
          current: 0,
          loop: false,
        },
      });
      const slides = wrapper.findAll('.sn-swiper__slide');
      // centre = current + floor((displayMultipleItems - 1) / 2) = 1.
      expect(readRotateY(slides[1]!.attributes('style'))).toBeNull();
      expect(readRotateY(slides[0]!.attributes('style'))).toBe(18);
      expect(readRotateY(slides[2]!.attributes('style'))).toBe(-18);
    });

    it('wraps the offset so a looping far card does not take a huge angle', () => {
      // The component wraps its own offsets; the native loop engine itself is
      // still untestable in happy-dom (see the file header).
      const wrapper = mount(SnSwiper, {
        props: {
          list: [...list, 'https://x/4.png', 'https://x/5.png'],
          card3d: true,
          current: 4,
          loop: true,
        },
      });
      // Slide 0 sits 4 steps ahead of the last slide, i.e. 1 step behind it.
      expect(readRotateY(wrapper.findAll('.sn-swiper__slide')[0]!.attributes('style'))).toBe(-18);
    });

    it('scales the neighbour slides when coverflow is on', () => {
      const flat = mount(SnSwiper, { props: { list } });
      expect(flat.classes()).not.toContain('sn-swiper--coverflow');
      expect(flat.find('.sn-swiper__slide').attributes('style')).toBeUndefined();

      const cover = mount(SnSwiper, { props: { list, coverflow: true, current: 1, loop: false } });
      expect(cover.classes()).toContain('sn-swiper--coverflow');
      const slides = cover.findAll('.sn-swiper__slide');
      expect(slides[1]!.attributes('style')).toContain('scale(1)');
      expect(slides[0]!.attributes('style')).toContain('scale(0.85)');
      expect(slides[2]!.attributes('style')).toContain('scale(0.85)');
    });

    it('peeks the neighbours by default when coverflow is on', () => {
      const wrapper = mount(SnSwiper, { props: { list, coverflow: true } });
      const style = wrapper.find('.sn-swiper__native').attributes('style') ?? '';
      expect(style).toContain('--sn-swiper-previous-margin: 80rpx');
      expect(style).toContain('--sn-swiper-next-margin: 80rpx');
    });

    it('keeps explicit margins as the coverflow peek-width knob', () => {
      const wrapper = mount(SnSwiper, {
        props: { list, coverflow: true, previousMargin: 30, nextMargin: 40 },
      });
      const style = wrapper.find('.sn-swiper__native').attributes('style') ?? '';
      expect(style).toContain('--sn-swiper-previous-margin: 30rpx');
      expect(style).toContain('--sn-swiper-next-margin: 40rpx');
    });
  });

  describe('scale indicator', () => {
    it('renders scale dots with size grading by distance from the active page', () => {
      const wrapper = mount(SnSwiper, {
        props: { list, current: 1, indicator: { type: 'scale' } },
      });
      expect(wrapper.find('.sn-swiper__indicator').classes()).toContain('sn-swiper__indicator--scale');
      const dots = wrapper.findAll('.sn-swiper__dot');
      expect(dots[1]!.attributes('style')).toContain('--sn-swiper-scale-dot-size: 20rpx');
      expect(dots[0]!.attributes('style')).toContain('--sn-swiper-scale-dot-size: 14rpx');
      expect(dots[2]!.attributes('style')).toContain('--sn-swiper-scale-dot-size: 14rpx');
    });

    it('keeps the size floor for far dots', () => {
      const wrapper = mount(SnSwiper, {
        props: {
          list: [...list, 'https://x/4.png', 'https://x/5.png'],
          current: 0,
          indicator: { type: 'scale' },
        },
      });
      const dots = wrapper.findAll('.sn-swiper__dot');
      expect(dots[4]!.attributes('style')).toContain('--sn-swiper-scale-dot-size: 8rpx');
    });
  });

  describe('controls navigation', () => {
    it('steps current forward and back from the arrows', async () => {
      const wrapper = mount(SnSwiper, {
        props: { list, current: 1, indicator: { showControls: true } },
      });
      const controls = wrapper.findAll('.sn-swiper__control');
      await controls[0]!.trigger('tap');
      expect(wrapper.emitted('update:current')?.[0]).toEqual([0]);
      await controls[1]!.trigger('tap');
      expect(wrapper.emitted('update:current')?.[1]).toEqual([2]);
    });

    it('wraps at the ends when loop is on', async () => {
      const wrapper = mount(SnSwiper, {
        props: { list, current: 0, loop: true, indicator: { showControls: true } },
      });
      const controls = wrapper.findAll('.sn-swiper__control');
      await controls[0]!.trigger('tap');
      expect(wrapper.emitted('update:current')?.[0]).toEqual([2]);
    });

    it('clamps at the ends when loop is off', async () => {
      const wrapper = mount(SnSwiper, {
        props: { list, current: 0, loop: false, indicator: { showControls: true } },
      });
      const controls = wrapper.findAll('.sn-swiper__control');
      await controls[0]!.trigger('tap');
      expect(wrapper.emitted('update:current')?.[0]).toEqual([0]);
    });
  });

  it('emits click with the raw object item', async () => {
    const item = { value: 'https://x/1.png', text: '第一张' };
    const wrapper = mount(SnSwiper, { props: { list: [item] } });
    await wrapper.find('.sn-swiper__slide').trigger('tap');
    expect(wrapper.emitted('click')?.[0]).toEqual([{ index: 0, item }]);
  });

  it('merges customStyle into the root style', () => {
    const wrapper = mount(SnSwiper, { props: { list, customStyle: 'margin: 8px' } });
    expect(wrapper.attributes('style')).toContain('margin: 8px');
  });
});
