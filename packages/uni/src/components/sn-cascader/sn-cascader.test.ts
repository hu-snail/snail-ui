/**
 * sn-cascader unit tests — uni-end tabbed hierarchical selector.
 *
 * Behaviour only (AGENTS.md §46): tab drilling, leaf auto-confirm, strict
 * mode, lazy loading with the stale-resolve guard, beforeConfirm veto and
 * the key mapping. No rpx numbers in assertions.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnCascader from './sn-cascader.vue';

const TREE = [
  {
    value: 'zj',
    text: 'Zhejiang',
    children: [
      { value: 'hz', text: 'Hangzhou', children: [{ value: 'xh', text: 'Xihu' }] },
      { value: 'nb', text: 'Ningbo' },
    ],
  },
  { value: 'js', text: 'Jiangsu', children: [{ value: 'nj', text: 'Nanjing' }] },
];

function mountCascader(props: Record<string, unknown> = {}) {
  return mount(SnCascader, {
    props: { visible: true, options: TREE, title: 'Area', ...props },
  });
}

/**
 * The options of one tab panel. `v-show` keeps every panel in the DOM, so
 * panels are addressed by tab index instead of by visibility.
 */
function optionsOf(w: ReturnType<typeof mount>, tabIndex = 0) {
  return w.findAll('.sn-cascader__panel')[tabIndex]?.findAll('.sn-cascader__option') ?? [];
}

describe('sn-cascader', () => {
  describe('structure', () => {
    it('renders the title and the root options', () => {
      const w = mountCascader();
      expect(w.find('.sn-cascader__title').text()).toBe('Area');
      expect(optionsOf(w, 0)).toHaveLength(2);
    });

    it('hides the confirm button in plain static mode', () => {
      expect(mountCascader().find('.sn-cascader__confirm').exists()).toBe(false);
    });

    it('shows the confirm button in checkStrictly mode', () => {
      expect(mountCascader({ checkStrictly: true }).find('.sn-cascader__confirm').exists()).toBe(
        true,
      );
    });

    it('shows the confirm button in lazy mode', () => {
      const w = mountCascader({ lazyLoad: () => {} });
      expect(w.find('.sn-cascader__confirm').exists()).toBe(true);
    });

    it('stays out of the tree while invisible', () => {
      expect(mountCascader({ visible: false }).find('.sn-cascader').exists()).toBe(false);
    });
  });

  describe('drilling', () => {
    it('adds a tab when a branch is tapped', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(2);
      expect(optionsOf(w, 1)).toHaveLength(2);
    });

    it('marks the selected branch', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(optionsOf(w, 0)[0]?.classes()).toContain('sn-cascader__option--selected');
    });

    it('drops deeper tabs when a different branch is tapped', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      await optionsOf(w, 0)[1]?.trigger('tap');
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(2);
      expect(optionsOf(w, 1).map((option) => option.text())).toEqual(['Nanjing']);
    });

    it('does not react to a disabled option', async () => {
      const w = mountCascader({
        options: [{ value: 'a', text: 'A', disabled: true, children: [{ value: 'b', text: 'B' }] }],
      });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(1);
    });
  });

  describe('static confirm', () => {
    it('confirms a leaf immediately', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      await optionsOf(w, 1)[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['nb']);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('emits confirm with the leaf value and the path', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[1]?.trigger('tap');
      await optionsOf(w, 1)[0]?.trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as {
        value: string;
        selectedOptions: unknown[];
      };
      expect(payload.value).toBe('nj');
      expect(payload.selectedOptions).toHaveLength(2);
    });
  });

  describe('strict mode', () => {
    it('does not confirm a branch on tap', async () => {
      const w = mountCascader({ checkStrictly: true });
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('confirms the selected branch with the button', async () => {
      const w = mountCascader({ checkStrictly: true });
      await optionsOf(w, 0)[0]?.trigger('tap');
      await w.find('.sn-cascader__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['zj']);
    });

    it('marks the confirm button disabled until something is selected', async () => {
      const w = mountCascader({ checkStrictly: true });
      expect(w.find('.sn-cascader__confirm').classes()).toContain('sn-cascader__confirm--disabled');
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.find('.sn-cascader__confirm').classes()).not.toContain(
        'sn-cascader__confirm--disabled',
      );
    });
  });

  describe('lazy mode', () => {
    const LAZY = [{ value: 'a', text: 'A', isLeaf: false }];

    it('calls lazyLoad for a non-leaf node', async () => {
      const lazyLoad = vi.fn();
      const w = mountCascader({ options: LAZY, lazyLoad });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      expect(lazyLoad).toHaveBeenCalledTimes(1);
      expect(lazyLoad.mock.calls[0]?.[1]).toBe(0);
    });

    it('renders the resolved children in a new tab', async () => {
      let resolver: ((children: unknown[]) => void) | undefined;
      const w = mountCascader({
        options: LAZY,
        lazyLoad: (_option, _index, resolve) => {
          resolver = resolve as (c: unknown[]) => void;
        },
      });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      expect(w.find('.sn-cascader__loading').exists()).toBe(true);
      resolver?.([{ value: 'a1', text: 'A1', isLeaf: true }]);
      await w.vm.$nextTick();
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(2);
      expect(optionsOf(w, 1)[0]?.text()).toBe('A1');
    });

    it('drops a resolve that lands after the sheet closed', async () => {
      let resolver: ((children: unknown[]) => void) | undefined;
      const w = mountCascader({
        options: LAZY,
        lazyLoad: (_option, _index, resolve) => {
          resolver = resolve as (c: unknown[]) => void;
        },
      });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      await w.setProps({ visible: false });
      await w.setProps({ visible: true });
      resolver?.([{ value: 'a1', text: 'A1' }]);
      await w.vm.$nextTick();
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(1);
    });

    it('emits the whole path in lazy mode', async () => {
      let resolver: ((children: unknown[]) => void) | undefined;
      const w = mountCascader({
        options: LAZY,
        lazyLoad: (_option, _index, resolve) => {
          resolver = resolve as (c: unknown[]) => void;
        },
      });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      resolver?.([{ value: 'a1', text: 'A1', isLeaf: true }]);
      await w.vm.$nextTick();
      await optionsOf(w, 1)[0]?.trigger('tap');
      await w.find('.sn-cascader__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')?.[0]).toEqual([['a', 'a1']]);
    });
  });

  describe('beforeConfirm + keys', () => {
    it('keeps the sheet open when beforeConfirm returns false', async () => {
      const w = mountCascader({ checkStrictly: true, beforeConfirm: () => false });
      await optionsOf(w, 0)[0]?.trigger('tap');
      await w.find('.sn-cascader__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('confirm')).toBeUndefined();
      expect(w.emitted('update:visible')).toBeUndefined();
    });

    it('resolves custom value / text / children keys', async () => {
      const w = mountCascader({
        options: [{ id: 1, label: 'One', kids: [{ id: 11, label: 'One-One' }] }],
        valueKey: 'id',
        textKey: 'label',
        childrenKey: 'kids',
      });
      expect(w.findAll('.sn-cascader__option')[0]?.text()).toContain('One');
      await optionsOf(w, 0)[0]?.trigger('tap');
      await optionsOf(w, 1)[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([11]);
    });

    it('seeds the tabs from a path modelValue', () => {
      const w = mountCascader({ modelValue: ['zj', 'hz'], checkStrictly: true });
      // root + Zhejiang children + Hangzhou children.
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(3);
    });
  });

  describe('line theme', () => {
    it('renders the indicator with the requested theme class', async () => {
      const w = mountCascader({ lineTheme: 'dot' });
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.findAll('.sn-cascader__line--dot').length).toBeGreaterThan(0);
    });
  });
});
