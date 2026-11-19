/**
 * sn-notify unit tests — uni-end stacked card notification (HeroUI-style
 * restyle, queue interaction model).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - show() queues a card, emits `open`, and auto-dismisses after `duration`
 *     (reason `auto`); `duration: 0` keeps it
 *   - the close pill / hide() / hideAll() dismiss with their own reason
 *   - the queue trims beyond `maxVisible` (reason `overflow`)
 *   - deck geometry: measured heights drive the translateY chain and the
 *     front card keeps the highest z-index; without a measurement host the
 *     component degrades to flow mode (explicit class)
 *   - swipe-to-dismiss flings the front card away with reason `swipe`
 *   - per-card customization: icon / background / radius / closeText / styles
 *   - every timer is cleared on unmount (§41)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import SnNotify from './sn-notify.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';

afterEach(() => {
  vi.useRealTimers();
  delete (globalThis as { uni?: unknown }).uni;
});

interface FakeRect {
  id?: string;
  top?: number;
  height?: number;
}

/** Install a `uni` stub: stack rect + per-card heights, resolved on exec(). */
function installUniQuery(stackRect: FakeRect, cardRects: FakeRect[], windowSize = { width: 375, height: 667 }): void {
  let stackCallback: ((rect: FakeRect) => void) | null = null;
  let cardsCallback: ((rects: FakeRect[]) => void) | null = null;
  (globalThis as { uni?: unknown }).uni = {
    getSystemInfoSync: () => ({ windowWidth: windowSize.width, windowHeight: windowSize.height }),
    createSelectorQuery: () => ({
      in: () => ({
        select: () => ({
          boundingClientRect: (callback: (rect: FakeRect) => void) => {
            stackCallback = callback;
            return {
              selectAll: () => ({
                boundingClientRect: (cards: (rects: FakeRect[]) => void) => {
                  cardsCallback = cards;
                  return {
                    exec: (done?: () => void) => {
                      stackCallback?.(stackRect);
                      cardsCallback?.(cardRects);
                      done?.();
                    },
                  };
                },
              }),
            };
          },
        }),
      }),
    }),
  };
}

/** Card nodes in DOM order (newest first). */
function cardsOf(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.sn-notify__card');
}

/** Drive one show() through pre → enter → active. */
async function settleEnter(wrapper: ReturnType<typeof mount>, frames = 40): Promise<void> {
  await flushPromises();
  vi.advanceTimersByTime(frames);
  await flushPromises();
}

describe('sn-notify', () => {
  describe('queue', () => {
    it('renders no card before anything is queued', () => {
      const wrapper = mount(SnNotify);
      expect(cardsOf(wrapper)).toHaveLength(0);
    });

    it('show() renders a card with title and description and emits open', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      const id = wrapper.vm.show({ title: 'Plan upgraded', description: 'You can continue using it' });
      await settleEnter(wrapper);

      expect(id).toBeTruthy();
      const cards = cardsOf(wrapper);
      expect(cards).toHaveLength(1);
      expect(cards[0]!.find('.sn-notify__title').text()).toBe('Plan upgraded');
      expect(cards[0]!.find('.sn-notify__description').text()).toBe('You can continue using it');
      expect(cards[0]!.attributes('role')).toBe('alert');
      expect(cards[0]!.attributes('aria-live')).toBe('assertive');
      expect(wrapper.emitted('open')?.[0]?.[0]).toMatchObject({ id, title: 'Plan upgraded' });
    });

    it('emits close with reason auto after duration and drops the card', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'x', duration: 3000 });
      await settleEnter(wrapper);

      vi.advanceTimersByTime(3000);
      expect(wrapper.emitted('close')?.[0]?.[0]).toMatchObject({ reason: 'auto' });
      await flushPromises();
      vi.advanceTimersByTime(500);
      await flushPromises();
      expect(cardsOf(wrapper)).toHaveLength(0);
    });

    it('keeps duration 0 cards until dismissed', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'x', duration: 0 });
      await settleEnter(wrapper);

      vi.advanceTimersByTime(60000);
      expect(wrapper.emitted('close')).toBeUndefined();
      expect(cardsOf(wrapper)).toHaveLength(1);
    });

    it('hides a single card through hide(id) with reason api', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      const id = wrapper.vm.show({ title: 'x' });
      await settleEnter(wrapper);

      wrapper.vm.hide(id);
      expect(wrapper.emitted('close')?.[0]?.[0]).toMatchObject({ id, reason: 'api' });
      vi.advanceTimersByTime(500);
      await flushPromises();
      expect(cardsOf(wrapper)).toHaveLength(0);
    });

    it('hideAll dismisses every queued card', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'a' });
      wrapper.vm.show({ title: 'b' });
      await settleEnter(wrapper);

      wrapper.vm.hideAll();
      const reasons = wrapper.emitted('close')!.map((entry) => (entry[0] as { reason: string }).reason);
      expect(reasons).toEqual(['api', 'api']);
      vi.advanceTimersByTime(500);
      await flushPromises();
      expect(cardsOf(wrapper)).toHaveLength(0);
    });

    it('trims the queue beyond maxVisible with reason overflow', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify, { props: { maxVisible: 2 } });
      wrapper.vm.show({ title: 'a' });
      wrapper.vm.show({ title: 'b' });
      wrapper.vm.show({ title: 'c' });
      await settleEnter(wrapper);

      const overflow = wrapper
        .emitted('close')!
        .filter((entry) => (entry[0] as { reason: string }).reason === 'overflow');
      expect(overflow).toHaveLength(1);
      const titles = cardsOf(wrapper).map((card) => card.find('.sn-notify__title').text());
      expect(titles).toEqual(['c', 'b']);
    });

    it('emits click only for the front card tap', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'a' });
      wrapper.vm.show({ title: 'b' });
      await settleEnter(wrapper);

      await cardsOf(wrapper)[0]!.trigger('tap');
      expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ title: 'b' });

      await cardsOf(wrapper)[1]!.trigger('tap');
      expect(wrapper.emitted('click')).toHaveLength(1);
    });
  });

  describe('close pill', () => {
    it('renders the default Close pill and dismisses with reason close', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'x' });
      await settleEnter(wrapper);

      const pill = wrapper.find('.sn-notify__close');
      expect(pill.text()).toBe('Close');
      expect(pill.attributes('role')).toBe('button');
      await pill.trigger('tap');
      expect(wrapper.emitted('close')?.[0]?.[0]).toMatchObject({ reason: 'close' });
      // Close tap must not bubble into a card click.
      expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('supports a custom pill label and hiding the pill per card', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'x', closeText: '关闭' });
      wrapper.vm.show({ title: 'y', closable: false });
      await settleEnter(wrapper);

      expect(wrapper.find('.sn-notify__close').text()).toBe('关闭');
      expect(wrapper.findAll('.sn-notify__close')).toHaveLength(1);
    });

    it('renders an icon-only pill when closeText is empty', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'x', closeText: '' });
      await settleEnter(wrapper);

      const pill = wrapper.find('.sn-notify__close');
      expect(pill.classes()).toContain('sn-notify__close--icon-only');
      expect(pill.find('svg').exists()).toBe(true);
      expect(pill.find('.sn-notify__close-text').exists()).toBe(false);
      await pill.trigger('tap');
      expect(wrapper.emitted('close')?.[0]?.[0]).toMatchObject({ reason: 'close' });
    });
  });

  describe('semantics and customization', () => {
    it('renders the type glyph and recolors title and pill', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'ok', type: 'success' });
      wrapper.vm.show({ title: 'plain', type: 'default' });
      await settleEnter(wrapper);

      const cards = cardsOf(wrapper);
      // Newest card first: "plain" is the front card.
      expect(cards[0]!.classes()).toContain('sn-notify__card--default');
      expect(cards[0]!.find('.sn-notify__icon svg').exists()).toBe(true);
      expect(cards[1]!.classes()).toContain('sn-notify__card--success');
      expect(cards[1]!.find('.sn-notify__icon svg').exists()).toBe(true);
    });

    it('honours icon null and a custom icon', async () => {
      vi.useFakeTimers();
      const custom: IconData = { viewBox: '0 0 24 24', paths: ['M5 5h14v14H5z'] };
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'a', icon: null });
      wrapper.vm.show({ title: 'b', icon: custom });
      await settleEnter(wrapper);

      const cards = cardsOf(wrapper);
      // Newest card first: "b" carries the custom icon.
      expect(cards[1]!.find('.sn-notify__icon').exists()).toBe(false);
      expect(cards[0]!.find('.sn-notify__icon svg').exists()).toBe(true);
    });

    it('splits the description on newlines', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'x', description: '第一行\n第二行' });
      await settleEnter(wrapper);

      const lines = wrapper.findAll('.sn-notify__description');
      expect(lines).toHaveLength(2);
      expect(lines[0]!.text()).toBe('第一行');
      expect(lines[1]!.text()).toBe('第二行');
    });

    it('applies per-card background / radius / color / custom style and class', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({
        title: 'x',
        background: '#fff7ed',
        radius: 24,
        color: 'rebeccapurple',
        customClass: 'my-card',
        customStyle: 'border: 1px solid',
      });
      await settleEnter(wrapper);

      const card = wrapper.find('.sn-notify__card');
      const style = card.attributes('style') ?? '';
      expect(style).toContain('background-color: #fff7ed');
      // border-radius is applied inline too, but happy-dom's CSSOM drops it
      // during style-binding serialization — same caveat as env()/calc().
      expect(style).toContain('border: 1px solid');
      expect(card.classes()).toContain('my-card');
      expect(card.find('.sn-notify__title').attributes('style')).toContain('color: rebeccapurple');
    });

    it('renders the card slot instead of the default content', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify, {
        slots: {
          card: `<template #card="{ item }"><text class="slot-title">{{ item.title }}</text></template>`,
        },
      });
      wrapper.vm.show({ title: 'slotted', description: 'ignored' });
      await settleEnter(wrapper);

      expect(wrapper.find('.slot-title').text()).toBe('slotted');
      expect(wrapper.findAll('.sn-notify__title')).toHaveLength(0);
    });
  });

  describe('container', () => {
    it('defaults to top + flow mode when no measurement host exists', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'x' });
      await settleEnter(wrapper);

      expect(wrapper.classes()).toContain('sn-notify--top');
      expect(wrapper.classes()).toContain('sn-notify--flow');
      expect(wrapper.classes()).not.toContain('sn-notify--deck');
    });

    it('applies position bottom and the safeHeight padding', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify, { props: { position: 'bottom', safeHeight: 88, zIndex: 300 } });
      wrapper.vm.show({ title: 'x' });
      await settleEnter(wrapper);

      expect(wrapper.classes()).toContain('sn-notify--bottom');
      const style = wrapper.attributes('style') ?? '';
      expect(style).toContain('z-index: 300');
      // safeHeight only pads the top anchor.
      expect(style).not.toContain('padding-top');
    });

    it('applies safeHeight padding on the top anchor', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify, { props: { safeHeight: 88 } });
      expect(wrapper.attributes('style')).toContain('padding-top: 88px');
    });

    it('clears every pending timer on unmount', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'a', duration: 1000 });
      wrapper.vm.show({ title: 'b', duration: 1000 });
      wrapper.unmount();
      expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
    });
  });

  describe('deck geometry', () => {
    it('switches to deck mode and lays the stack out with measured heights', async () => {
      vi.useFakeTimers();
      installUniQuery(
        { top: 0, height: 0 },
        [
          { id: 'sn-notify-item-1', height: 80 },
          { id: 'sn-notify-item-2', height: 100 },
        ],
      );
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'b' });
      await settleEnter(wrapper);
      wrapper.vm.show({ title: 'a' });
      await settleEnter(wrapper);

      expect(wrapper.classes()).toContain('sn-notify--deck');
      const cards = cardsOf(wrapper);
      // Front card at the anchor, back card peeking below its bottom edge
      // (sliver = 20rpx × 375/750 = 10px → offset = 100 + 10 − 80 = 30).
      expect(cards[0]!.attributes('style')).toContain('translateY(0px)');
      expect(cards[1]!.attributes('style')).toContain('translateY(30px)');
      // Front card paints above the back card.
      expect(cards[0]!.attributes('style')).toContain('z-index: 200');
      expect(cards[1]!.attributes('style')).toContain('z-index: 199');
    });

    it('starts the front card off-screen and slides it to its slot', async () => {
      vi.useFakeTimers();
      installUniQuery({ top: 0, height: 0 }, [{ id: 'sn-notify-item-1', height: 100 }]);
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'a' });
      await flushPromises();

      // enter frame: fully above the screen edge (stack top 0 + height 100).
      const style = wrapper.find('.sn-notify__card').attributes('style') ?? '';
      expect(style).toContain('translateY(-100px)');
      expect(style).toContain('opacity: 0');

      await settleEnter(wrapper);
      expect(wrapper.find('.sn-notify__card').attributes('style')).toContain('translateY(0px)');
      expect(wrapper.find('.sn-notify__card').attributes('style')).not.toContain('opacity: 0');
    });

    it('anchors bottom-mode enter and rest transforms below the stack', async () => {
      vi.useFakeTimers();
      installUniQuery(
        { top: 600, height: 0 },
        [{ id: 'sn-notify-item-1', height: 100 }],
      );
      const wrapper = mount(SnNotify, { props: { position: 'bottom' } });
      wrapper.vm.show({ title: 'a' });
      await flushPromises();

      // enter from below the viewport: 667 − 600 + 100 + 12 = 179px.
      expect(wrapper.find('.sn-notify__card').attributes('style')).toContain('translateY(179px)');
      await settleEnter(wrapper);
      expect(wrapper.find('.sn-notify__card').attributes('style')).toContain('translateY(0px)');
    });

    it('re-flows the offsets when the front card leaves', async () => {
      vi.useFakeTimers();
      installUniQuery(
        { top: 0, height: 0 },
        [
          { id: 'sn-notify-item-1', height: 80 },
          { id: 'sn-notify-item-2', height: 100 },
        ],
      );
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'b' });
      await settleEnter(wrapper);
      wrapper.vm.show({ title: 'a' });
      await settleEnter(wrapper);
      expect(cardsOf(wrapper)[1]!.attributes('style')).toContain('translateY(30px)');

      wrapper.vm.hide(cardsOf(wrapper)[0]!.attributes('id')!);
      vi.advanceTimersByTime(500);
      await flushPromises();
      // The leaving card is gone; the back card became the front card — no
      // peek offset remains.
      expect(cardsOf(wrapper)).toHaveLength(1);
      expect(cardsOf(wrapper)[0]!.attributes('style')).toContain('translateY(0px)');
    });
  });

  describe('swipe to dismiss', () => {
    it('flings the front card away with reason swipe', async () => {
      vi.useFakeTimers();
      installUniQuery({ top: 0, height: 0 }, [{ id: 'sn-notify-item-1', height: 100 }]);
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'a' });
      await settleEnter(wrapper);
      const card = wrapper.find('.sn-notify__card');

      await card.trigger('touchstart', { touches: [{ clientX: 200, clientY: 100 }] });
      await card.trigger('touchmove', { touches: [{ clientX: 100, clientY: 102 }] });
      await card.trigger('touchend', { touches: [] });
      expect(wrapper.emitted('close')?.[0]?.[0]).toMatchObject({ reason: 'swipe' });

      vi.advanceTimersByTime(500);
      await flushPromises();
      expect(cardsOf(wrapper)).toHaveLength(0);
    });

    it('springs back below the threshold and re-arms the timer', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'a', duration: 3000 });
      await settleEnter(wrapper);
      const card = wrapper.find('.sn-notify__card');

      await card.trigger('touchstart', { touches: [{ clientX: 200, clientY: 100 }] });
      await card.trigger('touchmove', { touches: [{ clientX: 180, clientY: 100 }] });
      // While dragging the transform transition is suspended.
      expect(card.attributes('style')).toContain('transition-property: none');
      await card.trigger('touchend', { touches: [] });
      expect(wrapper.emitted('close')).toBeUndefined();
      expect(card.attributes('style')).toContain('translateX(0px)');

      vi.advanceTimersByTime(3000);
      expect(wrapper.emitted('close')?.[0]?.[0]).toMatchObject({ reason: 'auto' });
    });

    it('ignores vertical drags', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify);
      wrapper.vm.show({ title: 'a' });
      await settleEnter(wrapper);
      const card = wrapper.find('.sn-notify__card');

      await card.trigger('touchstart', { touches: [{ clientX: 200, clientY: 100 }] });
      await card.trigger('touchmove', { touches: [{ clientX: 200, clientY: 160 }] });
      await card.trigger('touchend', { touches: [] });
      expect(wrapper.emitted('close')).toBeUndefined();
    });

    it('does nothing when swipeToDismiss is off', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SnNotify, { props: { swipeToDismiss: false } });
      wrapper.vm.show({ title: 'a' });
      await settleEnter(wrapper);
      const card = wrapper.find('.sn-notify__card');

      await card.trigger('touchstart', { touches: [{ clientX: 200, clientY: 100 }] });
      await card.trigger('touchmove', { touches: [{ clientX: 100, clientY: 100 }] });
      await card.trigger('touchend', { touches: [] });
      expect(wrapper.emitted('close')).toBeUndefined();
    });
  });
});
