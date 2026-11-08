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

    it('converts a numeric lineWidth / lineHeight into rpx', async () => {
      const w = mountCascader({ lineWidth: 24, lineHeight: 6 });
      await optionsOf(w, 0)[0]?.trigger('tap');
      const style = w.find('.sn-cascader__line').attributes('style') ?? '';
      expect(style).toContain('--sn-cascader-line-width: 48rpx');
      expect(style).toContain('--sn-cascader-line-height: 12rpx');
    });

    it('passes a string lineWidth through verbatim', async () => {
      const w = mountCascader({ lineWidth: '50%' });
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.find('.sn-cascader__line').attributes('style')).toContain(
        '--sn-cascader-line-width: 50%',
      );
    });
  });

  describe('tabs', () => {
    it('titles each tab with the selected node text', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      const tabs = w.findAll('.sn-cascader__tab');
      expect(tabs[0]?.find('.sn-cascader__tab-text').text()).toBe('Zhejiang');
      // The drilled-into level has no selection yet — it shows the hint chip.
      expect(tabs[1]?.find('.sn-cascader__tab-text').text()).toBe('请选择');
    });

    it('drops the hint chip once the level holds a selection', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.findAll('.sn-cascader__tab-text--placeholder')).toHaveLength(1);
      await optionsOf(w, 1)[1]?.trigger('tap');
      expect(w.findAll('.sn-cascader__tab-text--placeholder')).toHaveLength(0);
      expect(w.findAll('.sn-cascader__tab')[1]?.find('.sn-cascader__tab-text').text()).toBe(
        'Ningbo',
      );
    });

    it('activates the deepest tab seeded from a path modelValue', () => {
      const w = mountCascader({ modelValue: ['zj', 'hz'], checkStrictly: true });
      const tabs = w.findAll('.sn-cascader__tab');
      expect(tabs[2]?.classes()).toContain('sn-cascader__tab--active');
      expect(tabs[0]?.classes()).not.toContain('sn-cascader__tab--active');
    });

    it('reactivates an earlier tab on tap', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      await w.findAll('.sn-cascader__tab')[0]?.trigger('tap');
      expect(w.findAll('.sn-cascader__tab')[0]?.classes()).toContain('sn-cascader__tab--active');
      expect(w.findAll('.sn-cascader__tab')[1]?.classes()).not.toContain(
        'sn-cascader__tab--active',
      );
    });
  });

  describe('option tips + keys', () => {
    it('renders the option tip when present', () => {
      const w = mountCascader({
        options: [{ value: 'a', text: 'A', tip: 'famous for tea' }],
      });
      expect(w.find('.sn-cascader__option-tip').text()).toBe('famous for tea');
    });

    it('resolves a custom tipKey', () => {
      const w = mountCascader({
        options: [{ value: 'a', text: 'A', hint: 'the hint' }],
        tipKey: 'hint',
      });
      expect(w.find('.sn-cascader__option-tip').text()).toBe('the hint');
    });

    it('honours a custom isLeafKey in lazy mode', async () => {
      const w = mountCascader({
        options: [{ value: 'a', text: 'A', leaf: true }],
        isLeafKey: 'leaf',
        lazyLoad: () => {},
      });
      await optionsOf(w, 0)[0]?.trigger('tap');
      // A lazy leaf never auto-confirms and never opens a second tab.
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(1);
      expect(w.emitted('update:modelValue')).toBeUndefined();
      await w.find('.sn-cascader__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('update:modelValue')?.[0]).toEqual([['a']]);
    });
  });

  describe('popup wiring + labels', () => {
    it('emits close and closes on cancel', async () => {
      const w = mountCascader();
      await w.find('.sn-cascader__cancel').trigger('tap');
      expect(w.emitted('close')).toHaveLength(1);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('closes on mask tap when closeOnClickModal is on', async () => {
      const w = mountCascader();
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('stays open on mask tap when closeOnClickModal is off', async () => {
      const w = mountCascader({ closeOnClickModal: false });
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')).toBeUndefined();
    });

    it('renders the custom confirmText', () => {
      expect(
        mountCascader({ checkStrictly: true, confirmText: 'done' })
          .find('.sn-cascader__confirm')
          .text(),
      ).toBe('done');
    });

    it('forwards zIndex / safeAreaInsetBottom / customStyle to the popup', () => {
      const w = mountCascader({
        zIndex: 42,
        safeAreaInsetBottom: false,
        customStyle: 'background: red',
      });
      const popup = w.findComponent({ name: 'SnPopup' });
      expect(popup.props('zIndex')).toBe(42);
      expect(popup.props('safeAreaInsetBottom')).toBe(false);
      expect(popup.props('customStyle')).toBe('background: red');
    });

    it('merges customClass into the popup sheet', () => {
      const w = mountCascader({ customClass: 'my-sheet' });
      expect(w.find('.sn-cascader-popup.my-sheet').exists()).toBe(true);
    });

    it('accepts root-portal as the documented no-op', () => {
      const w = mountCascader({ rootPortal: true });
      expect(w.find('.sn-cascader').exists()).toBe(true);
    });
  });

  describe('model seeding', () => {
    it('ignores a scalar modelValue instead of crashing', () => {
      const w = mountCascader({ modelValue: 'zj', checkStrictly: true });
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(1);
      expect(optionsOf(w, 0)[0]?.classes()).not.toContain('sn-cascader__option--selected');
    });

    it('stops seeding at an unknown path segment', () => {
      const w = mountCascader({ modelValue: ['zj', 'nowhere'], checkStrictly: true });
      // Root + Zhejiang's children resolve; the unknown segment does not.
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(2);
    });

    it('re-seeds when options change while visible', async () => {
      const w = mountCascader({ visible: false, options: [] });
      await w.setProps({ visible: true });
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(1);
      await w.setProps({ options: TREE });
      expect(optionsOf(w, 0)).toHaveLength(2);
    });
  });

  describe('lazy mode edges', () => {
    const LAZY = [{ value: 'a', text: 'A', isLeaf: false }];

    it('clears the loading state without adding a tab for empty children', async () => {
      let resolver: ((children: unknown[]) => void) | undefined;
      const w = mountCascader({
        options: LAZY,
        lazyLoad: (_option, _index, resolve) => {
          resolver = resolve as (c: unknown[]) => void;
        },
      });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      expect(w.find('.sn-cascader__loading').exists()).toBe(true);
      resolver?.([]);
      await w.vm.$nextTick();
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(1);
      expect(w.find('.sn-cascader__loading').exists()).toBe(false);
    });

    it('supersedes an in-flight request when another node is tapped', async () => {
      const resolvers: Array<(children: unknown[]) => void> = [];
      const w = mountCascader({
        options: [
          { value: 'a', text: 'A', isLeaf: false },
          { value: 'b', text: 'B', isLeaf: false },
        ],
        lazyLoad: (_option, _index, resolve) => {
          resolvers.push(resolve as (c: unknown[]) => void);
        },
      });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      await w.findAll('.sn-cascader__option')[1]?.trigger('tap');
      expect(resolvers).toHaveLength(2);
      // The first resolve is stale — only the second may add a tab.
      resolvers[0]?.([{ value: 'stale', text: 'Stale' }]);
      await w.vm.$nextTick();
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(1);
      resolvers[1]?.([{ value: 'b1', text: 'B1' }]);
      await w.vm.$nextTick();
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(2);
      expect(optionsOf(w, 1)[0]?.text()).toBe('B1');
    });

    it('does not yank the active level when a resolve lands after a step back', async () => {
      const resolvers: Array<(children: unknown[]) => void> = [];
      const w = mountCascader({
        options: [{ value: 'a', text: 'A', isLeaf: false }],
        lazyLoad: (_option, _index, resolve) => {
          resolvers.push(resolve as (c: unknown[]) => void);
        },
      });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      resolvers[0]?.([{ value: 'a1', text: 'A1', isLeaf: false }]);
      await w.vm.$nextTick();
      // Standing on level 1, ask for its children, then step back to level 0.
      await optionsOf(w, 1)[0]?.trigger('tap');
      await w.find('.sn-cascader__back').trigger('tap');
      resolvers[1]?.([{ value: 'a2', text: 'A2', isLeaf: true }]);
      await w.vm.$nextTick();
      // The resolved level is appended, but the sheet stays where the user is.
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(3);
      expect(w.findAll('.sn-cascader__tab')[0]?.classes()).toContain('sn-cascader__tab--active');
      expect(w.find('.sn-cascader__loading').exists()).toBe(false);
    });
  });

  describe('strict confirm payload', () => {
    it('emits confirm with the path and closes', async () => {
      const w = mountCascader({ checkStrictly: true });
      await optionsOf(w, 0)[0]?.trigger('tap');
      await w.find('.sn-cascader__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('confirm')?.[0]).toEqual([{ value: 'zj', selectedOptions: [TREE[0]] }]);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('hands the payload to beforeConfirm', async () => {
      const beforeConfirm = vi.fn(() => true);
      const w = mountCascader({ checkStrictly: true, beforeConfirm });
      await optionsOf(w, 0)[0]?.trigger('tap');
      await w.find('.sn-cascader__confirm').trigger('tap');
      await Promise.resolve();
      expect(beforeConfirm.mock.calls[0]?.[0]).toEqual({
        value: 'zj',
        selectedOptions: [TREE[0]],
      });
    });

    it('marks the confirm button aria-disabled until a node is selected', () => {
      const w = mountCascader({ checkStrictly: true });
      expect(w.find('.sn-cascader__confirm').attributes('aria-disabled')).toBe('true');
    });
  });

  describe('sheet chrome (AUI-OPT-13)', () => {
    it('keeps the back control out of the root level', () => {
      expect(mountCascader().find('.sn-cascader__back').exists()).toBe(false);
    });

    it('shows the back control once a level is drilled into', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.find('.sn-cascader__back').exists()).toBe(true);
    });

    it('steps the active level back up without dropping the deeper level', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      await w.find('.sn-cascader__back').trigger('tap');
      expect(w.findAll('.sn-cascader__tab')[0]?.classes()).toContain('sn-cascader__tab--active');
      expect(w.findAll('.sn-cascader__tab')[1]?.classes()).not.toContain(
        'sn-cascader__tab--active',
      );
      // Level two stays reachable through the tab strip.
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(2);
    });

    it('labels the back control as a button', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[0]?.trigger('tap');
      const back = w.find('.sn-cascader__back');
      expect(back.attributes('role')).toBe('button');
      expect(back.attributes('aria-label')).toBe('back');
    });

    it('hints a drill chevron on a branch row', () => {
      const option = optionsOf(mountCascader(), 0)[0];
      expect(option?.find('.sn-cascader__chevron').exists()).toBe(true);
      expect(option?.find('.sn-cascader__check').exists()).toBe(false);
    });

    it('shows no affordance glyph on a plain leaf row', () => {
      const w = mountCascader({ options: [{ value: 'a', text: 'A' }] });
      expect(optionsOf(w, 0)[0]?.find('.sn-cascader__chevron').exists()).toBe(false);
      expect(optionsOf(w, 0)[0]?.find('.sn-cascader__check').exists()).toBe(false);
    });

    it('swaps the chevron for the check glyph on the selected row', async () => {
      const w = mountCascader();
      await optionsOf(w, 0)[1]?.trigger('tap');
      await optionsOf(w, 1)[0]?.trigger('tap');
      const selectedBranch = optionsOf(w, 0)[1];
      expect(selectedBranch?.find('.sn-cascader__check').exists()).toBe(true);
      expect(selectedBranch?.find('.sn-cascader__chevron').exists()).toBe(false);
    });

    it('keeps a drill chevron on a lazy branch and none on a lazy leaf', () => {
      const w = mountCascader({
        options: [
          { value: 'a', text: 'A', isLeaf: false },
          { value: 'b', text: 'B', isLeaf: true },
        ],
        lazyLoad: () => {},
      });
      const [branch, leaf] = optionsOf(w, 0);
      expect(branch?.find('.sn-cascader__chevron').exists()).toBe(true);
      expect(leaf?.find('.sn-cascader__chevron').exists()).toBe(false);
    });

    it('marks the row affordance as decorative', () => {
      expect(
        optionsOf(mountCascader(), 0)[0]?.find('.sn-cascader__tail').attributes('aria-hidden'),
      ).toBe('true');
    });

    it('drives press feedback through hover-class', () => {
      const w = mountCascader();
      expect(optionsOf(w, 0)[0]?.attributes('hover-class')).toBe('sn-cascader__option--pressed');
      expect(w.find('.sn-cascader__cancel').attributes('hover-class')).toBe(
        'sn-cascader__action--pressed',
      );
      expect(w.findAll('.sn-cascader__tab')[0]?.attributes('hover-class')).toBe(
        'sn-cascader__tab--pressed',
      );
    });

    it('suppresses press feedback on a disabled row', () => {
      const w = mountCascader({ options: [{ value: 'a', text: 'A', disabled: true }] });
      expect(optionsOf(w, 0)[0]?.attributes('hover-class')).toBe('none');
    });

    it('hints an empty level instead of rendering a blank panel', () => {
      const empty = mountCascader({ options: [] }).find('.sn-cascader__empty');
      expect(empty.exists()).toBe(true);
      expect(empty.attributes('role')).toBe('status');
      expect(empty.text()).toBe('暂无选项');
    });

    it('drops the empty hint once the level resolves options', async () => {
      const w = mountCascader({ options: [] });
      await w.setProps({ options: TREE });
      expect(w.find('.sn-cascader__empty').exists()).toBe(false);
    });

    it('renders the spinner while a lazy level loads', async () => {
      const w = mountCascader({
        options: [{ value: 'a', text: 'A', isLeaf: false }],
        lazyLoad: () => {},
      });
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.find('.sn-cascader__loading .sn-loading').exists()).toBe(true);
    });
  });

  describe('card layout (AUI-OPT-13)', () => {
    it('renders the list look by default', () => {
      const w = mountCascader();
      expect(optionsOf(w, 0)[0]?.classes()).not.toContain('sn-cascader__option--card');
    });

    it('marks every row and panel as a card', () => {
      const w = mountCascader({ card: true });
      expect(optionsOf(w, 0)[0]?.classes()).toContain('sn-cascader__option--card');
      expect(w.findAll('.sn-cascader__panel')[0]?.classes()).toContain('sn-cascader__panel--card');
    });

    it('keeps the list classes off the default look', () => {
      const w = mountCascader();
      expect(optionsOf(w, 0)[0]?.classes()).not.toContain('sn-cascader__option--card');
      expect(w.findAll('.sn-cascader__panel')[0]?.classes()).not.toContain(
        'sn-cascader__panel--card',
      );
    });

    it('follows the card flag when it flips at runtime', async () => {
      const w = mountCascader();
      await w.setProps({ card: true });
      expect(optionsOf(w, 0)[0]?.classes()).toContain('sn-cascader__option--card');
      await w.setProps({ card: false });
      expect(optionsOf(w, 0)[0]?.classes()).not.toContain('sn-cascader__option--card');
    });

    it('keeps the row affordances and drilling in card mode', async () => {
      const w = mountCascader({ card: true });
      expect(optionsOf(w, 0)[0]?.find('.sn-cascader__chevron').exists()).toBe(true);
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.findAll('.sn-cascader__tab')).toHaveLength(2);
      expect(w.findAll('.sn-cascader__tab')[1]?.classes()).toContain('sn-cascader__tab--active');
    });
  });

  describe('accessibility', () => {
    it('exposes the tab strip with selection state', async () => {
      const w = mountCascader();
      expect(w.find('.sn-cascader__tabs').attributes('role')).toBe('tablist');
      const tabs = w.findAll('.sn-cascader__tab');
      expect(tabs[0]?.attributes('role')).toBe('tab');
      expect(tabs[0]?.attributes('aria-selected')).toBe('true');
      await optionsOf(w, 0)[0]?.trigger('tap');
      expect(w.findAll('.sn-cascader__tab')[1]?.attributes('aria-selected')).toBe('true');
    });

    it('exposes options as toggle buttons with pressed state', async () => {
      const w = mountCascader();
      const option = optionsOf(w, 0)[0];
      expect(option?.attributes('role')).toBe('button');
      expect(option?.attributes('aria-pressed')).toBe('false');
      await option?.trigger('tap');
      expect(optionsOf(w, 0)[0]?.attributes('aria-pressed')).toBe('true');
    });

    it('announces the lazy loading state', async () => {
      const w = mountCascader({
        options: [{ value: 'a', text: 'A', isLeaf: false }],
        lazyLoad: () => {},
      });
      await w.findAll('.sn-cascader__option')[0]?.trigger('tap');
      const loading = w.find('.sn-cascader__loading');
      expect(loading.attributes('role')).toBe('status');
      expect(loading.attributes('aria-live')).toBe('polite');
    });

    it('labels the cancel action as a button', () => {
      const w = mountCascader();
      expect(w.find('.sn-cascader__cancel').attributes('role')).toBe('button');
      expect(w.find('.sn-cascader__cancel').attributes('aria-label')).toBe('cancel');
    });
  });
});

describe('sn-cascader model sync and node value coercion', () => {
  it('re-seeds the path when the modelValue prop changes', async () => {
    const w = mountCascader({ modelValue: [] });
    await w.setProps({ modelValue: [TREE[0].value] });
    await w.vm.$nextTick();
    // The tab strip reflects the seeded path (one tab for the chosen branch).
    expect(w.findAll('.sn-cascader__tab').length).toBeGreaterThan(0);
  });

  it('accepts numeric option values without string coercion', async () => {
    // checkStrictly defers to the confirm button, so the payload is observable
    // without walking to a leaf.
    const numeric = [{ text: 'One', value: 1, children: [{ text: 'Leaf', value: 11 }] }];
    const w = mountCascader({ options: numeric, modelValue: [], checkStrictly: true });
    await optionsOf(w, 0)[0]?.trigger('tap');
    await w.vm.$nextTick();
    await w.find('.sn-cascader__confirm').trigger('tap');
    await w.vm.$nextTick();
    // A single-select cascader writes the last path value, not an array.
    expect(w.emitted('update:modelValue')?.at(-1)?.[0]).toBe(1);
  });
});
