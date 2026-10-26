import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnTree from './SnTree.vue';
import type { SnTreeOption } from './sn-tree-types';

const sampleData: SnTreeOption[] = [
  {
    key: 'a',
    label: '节点 A',
    children: [
      { key: 'aa', label: '节点 AA' },
      { key: 'ab', label: '节点 AB' },
    ],
  },
  {
    key: 'b',
    label: '节点 B',
    children: [{ key: 'ba', label: '节点 BA', children: [{ key: 'baa', label: '节点 BAA' }] }],
  },
  { key: 'c', label: '节点 C' },
];

/** Mount SnTree through a wrapper component, mirroring real usage. */
function mountTree(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnTree },
      setup() {
        return () => h(SnTree, { data: sampleData, ...props } as never, slots as never);
      },
    }),
  );
}

function visibleLabels(wrapper: ReturnType<typeof mountTree>): string[] {
  return wrapper.findAll('.sn-tree__node-text').map((node) => node.text());
}

describe('SnTree (AUI-WEB-DD-021)', () => {
  describe('rendering', () => {
    it('renders a tree container with top-level nodes only by default', () => {
      const w = mountTree();
      const root = w.find('.sn-tree');
      expect(root.exists()).toBe(true);
      expect(root.attributes('data-snui-component')).toBe('tree');
      expect(root.attributes('role')).toBe('tree');
      expect(visibleLabels(w)).toEqual(['节点 A', '节点 B', '节点 C']);
    });

    it('hides nested children until their ancestors are expanded', () => {
      const w = mountTree({ defaultExpandedKeys: ['a'] });
      expect(visibleLabels(w)).toEqual(['节点 A', '节点 AA', '节点 AB', '节点 B', '节点 C']);
    });

    it('expands every non-leaf node with default-expand-all', () => {
      const w = mountTree({ defaultExpandAll: true });
      expect(visibleLabels(w)).toEqual([
        '节点 A',
        '节点 AA',
        '节点 AB',
        '节点 B',
        '节点 BA',
        '节点 BAA',
        '节点 C',
      ]);
    });

    it('indents nodes per level with the indent prop', () => {
      const w = mountTree({ defaultExpandedKeys: ['a'] });
      const indents = w.findAll('.sn-tree__indent');
      expect(indents[0]?.attributes('style')).toBe('width: 0px;');
      expect(indents[1]?.attributes('style')).toBe('width: 24px;');

      const wide = mountTree({ defaultExpandedKeys: ['a'], indent: 40 });
      const wideIndents = wide.findAll('.sn-tree__indent');
      expect(wideIndents[1]?.attributes('style')).toBe('width: 40px;');
    });

    it('renders no switcher interaction for leaf nodes', () => {
      const w = mountTree();
      const switchers = w.findAll('.sn-tree__switcher');
      expect(switchers).toHaveLength(3);
      expect(switchers[2]?.classes()).toContain('sn-tree__switcher--hide');
    });

    it('renders an empty state that can be customized via the empty slot', () => {
      const w = mountTree({ data: [] });
      expect(w.find('.sn-tree__empty').text()).toBe('无数据');

      const custom = mountTree({ data: [] }, { empty: () => '自定义空态' });
      expect(custom.find('.sn-tree__empty').text()).toBe('自定义空态');
    });

    it('marks the root with block-line styling when block-line is set', () => {
      const w = mountTree({ blockLine: true });
      expect(w.find('.sn-tree').classes()).toContain('sn-tree--block-line');
    });
  });

  describe('expansion', () => {
    it('emits update:expandedKeys with expand meta on switcher click', async () => {
      const w = mountTree();
      await w.findAll('.sn-tree__switcher')[0]?.trigger('click');

      const emitted = w.findComponent(SnTree).emitted('update:expandedKeys');
      expect(emitted).toHaveLength(1);
      expect(emitted?.[0]?.[0]).toEqual(['a']);
      expect(emitted?.[0]?.[2]).toEqual({ node: sampleData[0], action: 'expand' });

      await w.vm.$nextTick();
      expect(visibleLabels(w)).toContain('节点 AA');
    });

    it('collapses an expanded node and emits collapse meta', async () => {
      const w = mountTree({ defaultExpandedKeys: ['a'] });
      await w.findAll('.sn-tree__switcher')[0]?.trigger('click');

      const emitted = w.findComponent(SnTree).emitted('update:expandedKeys');
      expect(emitted?.[0]?.[0]).toEqual([]);
      expect(emitted?.[0]?.[2]).toEqual({ node: sampleData[0], action: 'collapse' });

      await w.vm.$nextTick();
      expect(visibleLabels(w)).not.toContain('节点 AA');
    });

    it('supports v-model:expanded-keys', async () => {
      const w = mount(
        defineComponent({
          components: { SnTree },
          setup() {
            const expanded = ref<string[]>([]);
            return () =>
              h(SnTree, {
                data: sampleData,
                expandedKeys: expanded.value,
                'onUpdate:expandedKeys': (keys: string[]) => {
                  expanded.value = keys;
                },
              } as never);
          },
        }),
      );

      await w.findAll('.sn-tree__switcher')[0]?.trigger('click');
      await w.vm.$nextTick();
      expect(visibleLabels(w)).toContain('节点 AA');

      await w.findAll('.sn-tree__switcher')[0]?.trigger('click');
      await w.vm.$nextTick();
      expect(visibleLabels(w)).not.toContain('节点 AA');
    });

    it('does not emit when clicking a leaf placeholder switcher', async () => {
      const w = mountTree();
      await w.findAll('.sn-tree__switcher')[2]?.trigger('click');

      expect(w.findComponent(SnTree).emitted('update:expandedKeys')).toBeUndefined();
    });

    it('does not trigger selection when clicking the switcher', async () => {
      const w = mountTree();
      await w.findAll('.sn-tree__switcher')[0]?.trigger('click');

      expect(w.findComponent(SnTree).emitted('update:selectedKeys')).toBeUndefined();
    });

    it('treats isLeaf nodes as leaves even when children exist', () => {
      const w = mountTree({
        data: [
          {
            key: 'x',
            label: '伪叶节点',
            isLeaf: true,
            children: [{ key: 'x1', label: '子节点 X1' }],
          },
        ],
      });
      expect(w.find('.sn-tree__switcher').classes()).toContain('sn-tree__switcher--hide');
      expect(visibleLabels(w)).toEqual(['伪叶节点']);
    });
  });

  describe('selection', () => {
    it('selects a node on content click and emits select meta', async () => {
      const w = mountTree();
      await w.findAll('.sn-tree__node-content')[0]?.trigger('click');

      const emitted = w.findComponent(SnTree).emitted('update:selectedKeys');
      expect(emitted?.[0]?.[0]).toEqual(['a']);
      expect(emitted?.[0]?.[2]).toEqual({ node: sampleData[0], action: 'select' });
      expect(w.findAll('.sn-tree__node')[0]?.classes()).toContain('sn-tree__node--selected');
    });

    it('deselects a selected node when cancelable (default)', async () => {
      const w = mountTree({ defaultSelectedKeys: ['a'] });
      await w.findAll('.sn-tree__node-content')[0]?.trigger('click');

      const emitted = w.findComponent(SnTree).emitted('update:selectedKeys');
      expect(emitted?.[0]?.[0]).toEqual([]);
      expect(emitted?.[0]?.[2]).toEqual({ node: sampleData[0], action: 'unselect' });
    });

    it('keeps the selection when cancelable is false', async () => {
      const w = mountTree({ defaultSelectedKeys: ['a'], cancelable: false });
      await w.findAll('.sn-tree__node-content')[0]?.trigger('click');

      expect(w.findComponent(SnTree).emitted('update:selectedKeys')?.[0]?.[0]).toEqual(['a']);
    });

    it('replaces the single selection when clicking another node', async () => {
      const w = mountTree({ defaultSelectedKeys: ['a'] });
      await w.findAll('.sn-tree__node-content')[2]?.trigger('click');

      expect(w.findComponent(SnTree).emitted('update:selectedKeys')?.[0]?.[0]).toEqual(['c']);
    });

    it('toggles multiple selections when multiple is set', async () => {
      const w = mountTree({ multiple: true });
      const contents = w.findAll('.sn-tree__node-content');
      await contents[0]?.trigger('click');
      await contents[2]?.trigger('click');

      expect(w.findComponent(SnTree).emitted('update:selectedKeys')?.[1]?.[0]).toEqual(['a', 'c']);

      await contents[0]?.trigger('click');
      expect(w.findComponent(SnTree).emitted('update:selectedKeys')?.[2]?.[0]).toEqual(['c']);
    });

    it('does not select when selectable is false', async () => {
      const w = mountTree({ selectable: false });
      await w.findAll('.sn-tree__node-content')[0]?.trigger('click');

      expect(w.findComponent(SnTree).emitted('update:selectedKeys')).toBeUndefined();
    });

    it('does not select disabled nodes', async () => {
      const w = mountTree({
        data: [
          { key: 'a', label: '禁用节点', disabled: true },
          { key: 'b', label: '可用节点' },
        ],
      });
      await w.findAll('.sn-tree__node-content')[0]?.trigger('click');

      expect(w.findComponent(SnTree).emitted('update:selectedKeys')).toBeUndefined();
      expect(w.findAll('.sn-tree__node')[0]?.classes()).toContain('sn-tree__node--disabled');
    });
  });

  describe('checking', () => {
    it('checks a leaf without cascade', async () => {
      const w = mountTree({ checkable: true });
      const checkboxes = w.findAll('.sn-tree__checkbox');
      await checkboxes[2]?.trigger('click');

      const emitted = w.findComponent(SnTree).emitted('update:checkedKeys');
      expect(emitted?.[0]?.[0]).toEqual(['c']);
      expect(emitted?.[0]?.[2]).toEqual({ node: sampleData[2], action: 'check' });
      expect(checkboxes[2]?.classes()).toContain('sn-tree__checkbox--checked');
    });

    it('does not cascade by default — checking a parent checks only itself', async () => {
      const w = mountTree({ checkable: true, defaultExpandedKeys: ['a'] });
      await w.findAll('.sn-tree__checkbox')[0]?.trigger('click');

      const emitted = w.findComponent(SnTree).emitted('update:checkedKeys');
      expect(emitted?.[0]?.[0]).toEqual(['a']);
      expect(w.findAll('.sn-tree__checkbox--checked')).toHaveLength(1);
      expect(w.find('.sn-tree__checkbox--indeterminate').exists()).toBe(false);
    });

    it('cascades to all descendants and marks the parent checked', async () => {
      const w = mountTree({ checkable: true, cascade: true, defaultExpandedKeys: ['a'] });
      await w.findAll('.sn-tree__checkbox')[0]?.trigger('click');

      const emitted = w.findComponent(SnTree).emitted('update:checkedKeys');
      expect(emitted?.[0]?.[0]).toEqual(['a', 'aa', 'ab']);
      expect(w.findAll('.sn-tree__checkbox--checked')).toHaveLength(3);
      expect(w.find('.sn-tree__checkbox--indeterminate').exists()).toBe(false);
    });

    it('marks the parent indeterminate after unchecking one child', async () => {
      const w = mountTree({ checkable: true, cascade: true, defaultExpandedKeys: ['a'] });
      await w.findAll('.sn-tree__checkbox')[0]?.trigger('click');
      await w.findAll('.sn-tree__checkbox')[1]?.trigger('click'); // uncheck 节点 AA

      const parent = w.findAll('.sn-tree__checkbox')[0];
      expect(parent?.classes()).toContain('sn-tree__checkbox--indeterminate');
      const emitted = w.findComponent(SnTree).emitted('update:checkedKeys');
      expect(emitted?.[1]?.[0]).toEqual(['ab']);
      expect(emitted?.[1]?.[2]).toEqual({ node: sampleData[0]?.children?.[0], action: 'uncheck' });
    });

    it('expands a controlled parent key to its whole subtree under cascade', () => {
      const w = mountTree({
        checkable: true,
        cascade: true,
        checkedKeys: ['a'],
        defaultExpandedKeys: ['a'],
      });
      expect(w.findAll('.sn-tree__checkbox--checked')).toHaveLength(3);
    });

    it('skips disabled checkboxes when cascading', async () => {
      const w = mountTree({
        checkable: true,
        cascade: true,
        defaultExpandedKeys: ['p'],
        data: [
          {
            key: 'p',
            label: '父节点',
            children: [
              { key: 'p1', label: '子节点 1' },
              { key: 'p2', label: '子节点 2', checkboxDisabled: true },
            ],
          },
        ],
      });
      await w.findAll('.sn-tree__checkbox')[0]?.trigger('click');

      const emitted = w.findComponent(SnTree).emitted('update:checkedKeys');
      expect(emitted?.[0]?.[0]).toEqual(['p', 'p1']);
      expect(w.findAll('.sn-tree__checkbox--checked')).toHaveLength(2);
      // The disabled checkbox is excluded from the cascade target set, so the
      // parent is fully checked relative to checkable descendants (naive
      // semantics) — not indeterminate.
      expect(w.find('.sn-tree__checkbox--indeterminate').exists()).toBe(false);
      expect(w.findAll('.sn-tree__checkbox')[2]?.classes()).not.toContain(
        'sn-tree__checkbox--checked',
      );
    });

    it('does not check disabled or checkbox-disabled nodes directly', async () => {
      const w = mountTree({
        checkable: true,
        data: [
          { key: 'a', label: '禁用节点', disabled: true },
          { key: 'b', label: '勾选禁用', checkboxDisabled: true },
        ],
      });
      await w.findAll('.sn-tree__checkbox')[0]?.trigger('click');
      await w.findAll('.sn-tree__checkbox')[1]?.trigger('click');

      expect(w.findComponent(SnTree).emitted('update:checkedKeys')).toBeUndefined();
    });
  });

  describe('custom fields', () => {
    it('renders labels through a custom label-field', () => {
      const w = mountTree({
        data: [
          { id: 1, name: '自定义甲', records: [{ id: 11, name: '自定义甲一' }] },
          { id: 2, name: '自定义乙' },
        ],
        keyField: 'id',
        labelField: 'name',
        childrenField: 'records',
      });
      expect(visibleLabels(w)).toEqual(['自定义甲', '自定义乙']);
      expect(w.text()).not.toContain('自定义甲一');

      const w2 = mountTree({
        data: [
          { id: 1, name: '自定义甲', records: [{ id: 11, name: '自定义甲一' }] },
          { id: 2, name: '自定义乙' },
        ],
        keyField: 'id',
        labelField: 'name',
        childrenField: 'records',
        defaultExpandedKeys: [1],
      });
      expect(visibleLabels(w2)).toEqual(['自定义甲', '自定义甲一', '自定义乙']);
    });

    it('generates deterministic keys for nodes missing the key field', () => {
      const w = mountTree({ data: [{ label: '无键节点' }] });
      expect(visibleLabels(w)).toEqual(['无键节点']);
      expect(w.findComponent(SnTree).emitted('update:selectedKeys')).toBeUndefined();
    });
  });

  describe('prefix and suffix', () => {
    it('renders tree-level prefix and suffix render fns', () => {
      const w = mountTree({
        renderPrefix: ({ option, selected }) =>
          `前缀-${String(option.key)}${selected ? '-选中' : ''}`,
        renderSuffix: ({ option }) => `后缀-${String(option.key)}`,
        selectedKeys: ['a'],
      });

      expect(w.find('.sn-tree__node-prefix').text()).toBe('前缀-a-选中');
      expect(w.find('.sn-tree__node-suffix').text()).toBe('后缀-a');
    });

    it('renders option-level prefix and suffix', () => {
      const w = mountTree({
        data: [{ key: 'a', label: '节点 A', prefix: () => 'opt 前缀', suffix: 'opt 后缀' }],
      });
      expect(w.find('.sn-tree__node-prefix').text()).toBe('opt 前缀');
      expect(w.find('.sn-tree__node-suffix').text()).toBe('opt 后缀');
    });
  });
});
