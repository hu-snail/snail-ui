import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnAvatarGroup from './SnAvatarGroup.vue';
import SnAvatar from '../avatar/SnAvatar.vue';

/** Mount SnAvatarGroup through a wrapper component, mirroring real usage. */
function mountGroup(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnAvatarGroup },
      setup() {
        return () => h(SnAvatarGroup, props as never, slots as never);
      },
    }),
  );
}

/** Five SnAvatar children keyed by fallback text. */
function fiveAvatars(): Record<string, unknown> {
  return {
    default: () =>
      ['A', 'B', 'C', 'D', 'E'].map((text) => h(SnAvatar, { key: text, fallbackText: text })),
  };
}

describe('SnAvatarGroup (AUI-WEB-DD-026)', () => {
  describe('rendering', () => {
    it('renders the component marker with every slotted avatar by default', () => {
      const w = mountGroup({}, fiveAvatars());
      const root = w.find('.sn-avatar-group');
      expect(root.attributes('data-snui-component')).toBe('avatar-group');
      expect(root.findAll('.sn-avatar')).toHaveLength(5);
      expect(root.find('.sn-avatar-group__rest').exists()).toBe(false);
    });

    it('applies the size to the summary avatar', () => {
      const w = mountGroup({ maxOptions: { max: 2 }, size: 'large' }, fiveAvatars());
      const restAvatar = w.find('.sn-avatar-group__rest-avatar');
      expect(restAvatar.classes()).toContain('sn-avatar--large');
    });
  });

  describe('maxOptions', () => {
    it('shows max − 1 avatars and a +k summary when overflowing', () => {
      const w = mountGroup({ maxOptions: { max: 4 } }, fiveAvatars());
      // 5 total, max 4 → 3 avatars + "+2" (rest = total − (max − 1)).
      expect(w.findAll('.sn-avatar-group__item')).toHaveLength(3);
      expect(w.find('.sn-avatar-group__rest-avatar').text()).toBe('+2');
    });

    it('accepts a numeric maxOptions without an expand hook', () => {
      const w = mountGroup({ maxOptions: 2 }, fiveAvatars());
      expect(w.findAll('.sn-avatar-group__item')).toHaveLength(1);
      expect(w.find('.sn-avatar-group__rest-avatar').text()).toBe('+4');
    });

    it('does not render a summary when the count fits the max', () => {
      const w = mountGroup({ maxOptions: { max: 5 } }, fiveAvatars());
      expect(w.findAll('.sn-avatar-group__item')).toHaveLength(5);
      expect(w.find('.sn-avatar-group__rest').exists()).toBe(false);
    });

    it('flattens fragments so nested slot arrays are counted', () => {
      const w = mountGroup(
        { maxOptions: { max: 3 } },
        {
          // A nested array compiles to a Fragment vnode — the shape a
          // template v-for produces inside the slot.
          default: () => [
            [
              h(SnAvatar, { key: 'x', fallbackText: 'X' }),
              h(SnAvatar, { key: 'y', fallbackText: 'Y' }),
            ],
            h(SnAvatar, { key: 'z', fallbackText: 'Z' }),
            h(SnAvatar, { key: 'w', fallbackText: 'W' }),
          ],
        },
      );
      // 4 children counted → 2 shown + "+2".
      expect(w.findAll('.sn-avatar-group__item')).toHaveLength(2);
      expect(w.find('.sn-avatar-group__rest-avatar').text()).toBe('+2');
    });
  });

  describe('onExpand', () => {
    it('calls onExpand when the summary is clicked', async () => {
      let expanded = false;
      const w = mountGroup(
        {
          maxOptions: {
            max: 2,
            onExpand: () => {
              expanded = true;
            },
          },
        },
        fiveAvatars(),
      );
      const trigger = w.find('button.sn-avatar-group__rest-trigger');
      expect(trigger.exists()).toBe(true);
      await trigger.trigger('click');
      expect(expanded).toBe(true);
    });

    it('renders a non-interactive summary when no onExpand is given', async () => {
      const w = mountGroup({ maxOptions: 2 }, fiveAvatars());
      expect(w.find('button.sn-avatar-group__rest-trigger').exists()).toBe(false);
      expect(w.find('span.sn-avatar-group__rest-trigger').exists()).toBe(true);
      // Clicking must not throw.
      await w.find('.sn-avatar-group__rest-trigger').trigger('click');
    });
  });

  describe('sizeBehavior', () => {
    it('overlaps avatars with negative margins when tightening', () => {
      const w = mountGroup({ sizeBehavior: 'tightening' }, fiveAvatars());
      expect(w.find('.sn-avatar-group').classes()).toContain('sn-avatar-group--tightening');
      const second = w.findAll('.sn-avatar-group__item')[1];
      expect(second.attributes('style')).toContain('margin-left: -10px');
      // First item carries no offset.
      expect(w.findAll('.sn-avatar-group__item')[0].attributes('style')).toBeUndefined();
    });

    it('scales avatars down progressively when shrink', () => {
      const w = mountGroup({ sizeBehavior: 'shrink' }, fiveAvatars());
      expect(w.find('.sn-avatar-group').classes()).toContain('sn-avatar-group--shrink');
      const items = w.findAll('.sn-avatar-group__item');
      expect(items[0].attributes('style')).toBeUndefined();
      expect(items[2].attributes('style')).toContain('scale(0.88)');
    });
  });
});
