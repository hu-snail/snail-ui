/**
 * sn-avatar-group unit tests — uni-end avatar stack (wd-avatar-group parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - the slotted avatars render, and the cascade / vertical classes land
 *   - `max-count` collapses the stack: a clip window plus a `+N` bubble
 *   - `collapse-avatar` replaces the derived `+N`
 *   - an unresolvable size skips the limit (documented fallback)
 *   - the group's `size` / `shape` override the member avatars' own props
 *
 * Untestable in happy-dom: real layout (the clip window's effect on painted
 * pixels) — assertions stay on classes / inline style strings / text, the same
 * compromise the other uni components' tests make.
 */

import SnAvatar from '../sn-avatar/sn-avatar.vue';
import { resolveGeometry } from './sn-avatar-group-geometry';
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import SnAvatarGroup from './sn-avatar-group.vue';
import SnAvatar from '../sn-avatar/sn-avatar.vue';

/** A slot holding `count` text avatars. */
function avatarSlot(count: number) {
  return () => Array.from({ length: count }, (_, index) => h(SnAvatar, { text: `A${index + 1}` }));
}

describe('sn-avatar-group', () => {
  it('renders every slotted avatar', () => {
    const wrapper = mount(SnAvatarGroup, { slots: { default: avatarSlot(4) } });
    expect(wrapper.findAll('.sn-avatar')).toHaveLength(4);
    expect(wrapper.text()).toContain('A4');
  });

  it('defaults to the left-up cascade', () => {
    const wrapper = mount(SnAvatarGroup, { slots: { default: avatarSlot(2) } });
    expect(wrapper.classes()).toContain('sn-avatar-group--left-up');
  });

  it('applies the right-up cascade class', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { cascading: 'right-up' },
      slots: { default: avatarSlot(2) },
    });
    expect(wrapper.classes()).toContain('sn-avatar-group--right-up');
    expect(wrapper.classes()).not.toContain('sn-avatar-group--left-up');
  });

  it('applies the vertical class and stacks top-down', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { vertical: true },
      slots: { default: avatarSlot(2) },
    });
    expect(wrapper.classes()).toContain('sn-avatar-group--vertical');
    const style = wrapper.attributes('style') ?? '';
    // Vertical stacking pulls members up, not left.
    expect(style).toContain('--sn-avatar-group-overlap-top: -25rpx');
    expect(style).toContain('--sn-avatar-group-overlap-left: 0rpx');
  });

  it('hands the stacking numbers down as inherited variables', () => {
    const wrapper = mount(SnAvatarGroup, { slots: { default: avatarSlot(3) } });
    const style = wrapper.attributes('style') ?? '';
    // normal = 72rpx diameter → 35% overlap = 25rpx.
    expect(style).toContain('--sn-avatar-group-overlap-left: -25rpx');
    expect(style).toContain('--sn-avatar-group-ring:');
    // The compensation padding is rpx too — pinned in the geometry tests.
  });

  it('renders no bubble and does not clip without a max-count', () => {
    const wrapper = mount(SnAvatarGroup, { slots: { default: avatarSlot(5) } });
    expect(wrapper.find('.sn-avatar-group__collapse').exists()).toBe(false);
    expect(wrapper.find('.sn-avatar-group__clip').attributes('style')).toBeUndefined();
  });

  it('collapses the stack and clips the overflow past max-count', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { maxCount: 3 },
      slots: { default: avatarSlot(5) },
    });
    // max-count 3 = 2 avatars + 1 bubble → 3 hidden of 5.
    const bubble = wrapper.find('.sn-avatar-group__collapse');
    expect(bubble.exists()).toBe(true);
    expect(bubble.text()).toBe('+3');

    // happy-dom drops rpx lengths; the numbers are pinned in the geometry tests.
    const clipStyle = wrapper.find('.sn-avatar-group__clip').attributes('style') ?? '';
    expect(clipStyle).toContain('overflow: hidden');
  });

  it('sizes the clip window by height in vertical mode', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { maxCount: 3, vertical: true },
      slots: { default: avatarSlot(5) },
    });
    const clipStyle = wrapper.find('.sn-avatar-group__clip').attributes('style') ?? '';
    expect(clipStyle).toContain('overflow: hidden');
  });

  it('keeps every avatar visible when the slot fits the limit', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { maxCount: 3 },
      slots: { default: avatarSlot(3) },
    });
    expect(wrapper.find('.sn-avatar-group__collapse').exists()).toBe(false);
    expect(wrapper.findAll('.sn-avatar')).toHaveLength(3);
  });

  it('prefers collapse-avatar over the derived count', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { maxCount: 2, collapseAvatar: 'B+1' },
      slots: { default: avatarSlot(4) },
    });
    expect(wrapper.find('.sn-avatar-group__collapse').text()).toBe('B+1');
  });

  it('skips the limit when the size cannot be measured', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { maxCount: 2, size: '20%' },
      slots: { default: avatarSlot(4) },
    });
    expect(wrapper.find('.sn-avatar-group__collapse').exists()).toBe(false);
    expect(wrapper.find('.sn-avatar-group__clip').attributes('style')).toBeUndefined();
    expect(wrapper.findAll('.sn-avatar')).toHaveLength(4);
  });

  it('ignores a non-positive max-count', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { maxCount: 0 },
      slots: { default: avatarSlot(3) },
    });
    expect(wrapper.find('.sn-avatar-group__collapse').exists()).toBe(false);
    expect(wrapper.findAll('.sn-avatar')).toHaveLength(3);
  });

  it('counts a wrapper element’s children, not the wrapper', () => {
    const wrapper = mount(SnAvatarGroup, {
      props: { maxCount: 2 },
      slots: {
        default: () => h('view', [h(SnAvatar, { text: 'A1' }), h(SnAvatar, { text: 'A2' })]),
      },
    });
    // 2 avatars inside one wrapper = exactly max-count → no collapse.
    expect(wrapper.find('.sn-avatar-group__collapse').exists()).toBe(false);
  });

  describe('group-wide size and shape', () => {
    it('overrides the member avatars’ own size', () => {
      const wrapper = mount(SnAvatarGroup, {
        props: { size: 'small' },
        slots: { default: avatarSlot(2) },
      });
      for (const avatar of wrapper.findAll('.sn-avatar')) {
        expect(avatar.classes()).toContain('sn-avatar--size-small');
      }
    });

    it('overrides the member avatars’ own size even when they declare one', () => {
      const wrapper = mount(SnAvatarGroup, {
        props: { size: 'large' },
        slots: { default: () => [h(SnAvatar, { text: 'A', size: 'small' })] },
      });
      expect(wrapper.find('.sn-avatar').classes()).toContain('sn-avatar--size-large');
    });

    it('applies the group shape to every member and the bubble', () => {
      const wrapper = mount(SnAvatarGroup, {
        props: { shape: 'square', maxCount: 2 },
        slots: { default: avatarSlot(4) },
      });
      expect(wrapper.find('.sn-avatar-group__collapse').classes()).toContain('sn-avatar--square');
      expect(wrapper.findAll('.sn-avatar--square').length).toBeGreaterThan(0);
    });

    it('leaves member props in charge outside a group', () => {
      const standalone = mount(SnAvatar, { props: { text: 'A' } });
      expect(standalone.classes()).toContain('sn-avatar--size-normal');
      expect(standalone.classes()).toContain('sn-avatar--round');
    });
  });
});

/*
 * The stack arithmetic lives in a pure module because happy-dom drops rpx
 * lengths from inline styles — these tests pin the exact numbers the DOM
 * assertions above cannot reach.
 */
describe('sn-avatar-group geometry', () => {
  it('resolves the normal preset to 72rpx with a 25rpx overlap', () => {
    const g = resolveGeometry({
      total: 3,
      maxCount: undefined,
      size: 'normal',
      vertical: false,
      cascading: 'right-up',
    });
    expect(g.diameter).toBe(72);
    expect(g.overlap).toBe(25);
    expect(g.visible).toBe(3);
    expect(g.hidden).toBe(0);
    expect(g.clipping).toBe(false);
    expect(g.length).toBe(0);
    expect(g.paddingSide).toBe('left');
  });

  it('clips to max-count − 1 avatars plus the bubble slot', () => {
    const g = resolveGeometry({
      total: 5,
      maxCount: 3,
      size: 'normal',
      vertical: false,
      cascading: 'left-up',
    });
    expect(g.visible).toBe(2);
    expect(g.hidden).toBe(3);
    expect(g.clipping).toBe(true);
    // 2 visible steps of (72 − 25) = 94rpx window, one diameter deep.
    expect(g.length).toBe(94);
    expect(g.diameter).toBe(72);
    expect(g.paddingSide).toBe('right');
  });

  it('pads on top in vertical mode', () => {
    const g = resolveGeometry({
      total: 5,
      maxCount: 3,
      size: 'normal',
      vertical: true,
      cascading: 'right-up',
    });
    expect(g.paddingSide).toBe('top');
  });

  it('reads px numbers as px→rpx and explicit lengths verbatim', () => {
    expect(
      resolveGeometry({
        total: 2,
        maxCount: undefined,
        size: 36,
        vertical: false,
        cascading: 'right-up',
      }).diameter,
    ).toBe(72);
    expect(
      resolveGeometry({
        total: 2,
        maxCount: undefined,
        size: '96rpx',
        vertical: false,
        cascading: 'right-up',
      }).diameter,
    ).toBe(96);
    expect(
      resolveGeometry({
        total: 2,
        maxCount: undefined,
        size: '48px',
        vertical: false,
        cascading: 'right-up',
      }).diameter,
    ).toBe(96);
  });

  it('gives up measuring unresolvable sizes and skips the clip', () => {
    const g = resolveGeometry({
      total: 5,
      maxCount: 2,
      size: '20%',
      vertical: false,
      cascading: 'right-up',
    });
    expect(g.diameter).toBeNull();
    expect(g.clipping).toBe(false);
    expect(g.visible).toBe(5);
  });

  it('treats a non-positive or fractional limit safely', () => {
    for (const maxCount of [0, -2, Number.NaN] as const) {
      const g = resolveGeometry({
        total: 4,
        maxCount,
        size: 'normal',
        vertical: false,
        cascading: 'right-up',
      });
      expect(g.visible).toBe(4);
      expect(g.clipping).toBe(false);
    }
    const fractional = resolveGeometry({
      total: 4,
      maxCount: 2.6,
      size: 'normal',
      vertical: false,
      cascading: 'right-up',
    });
    // 2.6 floors to 2 → 1 avatar + bubble.
    expect(fractional.visible).toBe(1);
    expect(fractional.hidden).toBe(3);
  });

  it('collapses to a bubble-only stack at max-count 1', () => {
    const g = resolveGeometry({
      total: 3,
      maxCount: 1,
      size: 'normal',
      vertical: false,
      cascading: 'right-up',
    });
    expect(g.visible).toBe(0);
    expect(g.hidden).toBe(3);
    expect(g.length).toBe(0);
  });
});
