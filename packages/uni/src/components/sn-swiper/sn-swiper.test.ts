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
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSwiper from './sn-swiper.vue';

const list = ['https://x/1.png', 'https://x/2.png', 'https://x/3.png'];

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
});
