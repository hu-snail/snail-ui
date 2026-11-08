import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
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

  describe('connector lines', () => {
    const expanded = { defaultExpandedKeys: ['a', 'b', 'ba'] };

    it('renders no line elements by default', () => {
      const w = mountTree(expanded);
      expect(w.find('.sn-tree__line-layer').exists()).toBe(false);
      expect(w.find('.sn-tree').classes()).not.toContain('sn-tree--show-line');
    });

    it('draws an L connector on child rows but not on root rows', () => {
      const w = mountTree({ ...expanded, showLine: true });
      const rows = w.findAll('.sn-tree__node-wrapper');
      expect(rows).toHaveLength(7);
      expect(rows.every((row) => row.find('.sn-tree__line-layer').exists())).toBe(true);
      // a / aa / ab / b / ba / baa / c — only the four nested rows connect.
      expect(w.findAll('.sn-tree__line--horizontal')).toHaveLength(4);
      expect(rows[0]?.find('.sn-tree__line--horizontal').exists()).toBe(false);
      expect(rows[3]?.find('.sn-tree__line--horizontal').exists()).toBe(false);
      expect(rows[6]?.find('.sn-tree__line--horizontal').exists()).toBe(false);
      expect(rows[1]?.find('.sn-tree__line--horizontal').exists()).toBe(true);
      expect(rows[0]?.find('.sn-tree__line-layer').attributes('aria-hidden')).toBe('true');
    });

    it('terminates the last child at the row center and positions lines by indent', () => {
      const w = mountTree({ ...expanded, showLine: true, indent: 40 });
      const rows = w.findAll('.sn-tree__node-wrapper');
      // ab is the last visible child of a — half-height vertical at level 0.
      const abLines = rows[2]?.findAll('.sn-tree__line--vertical');
      expect(abLines).toHaveLength(1);
      expect(abLines?.[0]?.classes()).toContain('sn-tree__line--half');
      expect(abLines?.[0]?.attributes('style')).toContain('left: 20px');
      expect(rows[2]?.find('.sn-tree__line--horizontal').attributes('style')).toContain(
        'width: 32px',
      );
      // baa keeps a level-1 connector; its parent branch has no sibling.
      const baaLines = rows[5]?.findAll('.sn-tree__line--vertical');
      expect(baaLines).toHaveLength(1);
      expect(baaLines?.[0]?.attributes('style')).toContain('left: 60px');
    });

    it('switches the stroke style to dashed only when requested', () => {
      const solid = mountTree({ ...expanded, showLine: true });
      expect(solid.find('.sn-tree').classes()).toContain('sn-tree--show-line');
      expect(solid.find('.sn-tree').classes()).not.toContain('sn-tree--line-dashed');

      const dashed = mountTree({ ...expanded, showLine: true, lineStyle: 'dashed' });
      expect(dashed.find('.sn-tree').classes()).toContain('sn-tree--line-dashed');
      expect(dashed.findAll('.sn-tree__line--horizontal')).toHaveLength(4);
    });

    it('recomputes connectors after a branch collapses', async () => {
      const w = mountTree({ showLine: true, defaultExpandedKeys: ['a'] });
      expect(w.findAll('.sn-tree__line--horizontal')).toHaveLength(2);

      await w.findAll('.sn-tree__switcher')[0]?.trigger('click');
      expect(w.findAll('.sn-tree__line--horizontal')).toHaveLength(0);
    });

    it('keeps node interaction intact with lines enabled', async () => {
      const w = mountTree({ showLine: true, lineStyle: 'dashed' });
      await w.findAll('.sn-tree__node-content')[0]?.trigger('click');
      const emitted = w.findComponent(SnTree).emitted('update:selectedKeys');
      expect(emitted?.[0]?.[0]).toEqual(['a']);
    });

    it('defaults to square elbows and opts into rounded corners', () => {
      const square = mountTree({ ...expanded, showLine: true });
      expect(square.find('.sn-tree').classes()).not.toContain('sn-tree--line-rounded');

      const rounded = mountTree({ ...expanded, showLine: true, lineCorner: 'rounded' });
      expect(rounded.find('.sn-tree').classes()).toContain('sn-tree--line-rounded');
      expect(rounded.findAll('.sn-tree__line--horizontal')).toHaveLength(4);
    });

    it('marks the elbow-level vertical so the rounded arc trims the branch', () => {
      const w = mountTree({ ...expanded, showLine: true, lineCorner: 'rounded' });
      const rows = w.findAll('.sn-tree__node-wrapper');
      // a / aa / ab / b / ba / baa / c — four nested rows each own one elbow.
      expect(w.findAll('.sn-tree__line--elbow')).toHaveLength(4);
      expect(rows[0]?.findAll('.sn-tree__line--elbow')).toHaveLength(0);
      // ab is the last child of a: the arc closes the branch, so CSS stops the
      // straight guide at the arc's top edge instead of the row center.
      expect(rows[2]?.find('.sn-tree__line--elbow').classes()).toEqual(
        expect.arrayContaining(['sn-tree__line--vertical', 'sn-tree__line--half']),
      );
      // aa is not the last child: the full-height trunk stays so the branch
      // curves away from a continuous guide.
      expect(rows[1]?.find('.sn-tree__line--elbow').classes()).not.toContain('sn-tree__line--half');
    });

    it('combines rounded corners with a dashed stroke', () => {
      const w = mountTree({
        ...expanded,
        showLine: true,
        lineCorner: 'rounded',
        lineStyle: 'dashed',
      });
      expect(w.find('.sn-tree').classes()).toEqual(
        expect.arrayContaining([
          'sn-tree--show-line',
          'sn-tree--line-rounded',
          'sn-tree--line-dashed',
        ]),
      );
    });

    it('draws full-height indent guides with line-mode="guide"', () => {
      const w = mountTree({ ...expanded, showLine: true, lineMode: 'guide' });
      expect(w.find('.sn-tree').classes()).toEqual(
        expect.arrayContaining(['sn-tree--show-line', 'sn-tree--line-guide']),
      );
      // Guide mode never emits an elbow: no horizontal segment, no half line.
      expect(w.findAll('.sn-tree__line--horizontal')).toHaveLength(0);
      expect(w.findAll('.sn-tree__line--half')).toHaveLength(0);

      const rows = w.findAll('.sn-tree__node-wrapper');
      // baa (level 2) keeps both the b (level 0) and ba (level 1) guides.
      const baaLines = rows[5]?.findAll('.sn-tree__line--vertical');
      expect(baaLines).toHaveLength(2);
      expect(baaLines?.map((line) => line.attributes('style'))).toEqual([
        'left: 12px;',
        'left: 36px;',
      ]);
      // A root row still owns an empty line layer, not an elbow.
      expect(rows[0]?.findAll('.sn-tree__line--vertical')).toHaveLength(0);
    });

    it('combines indent guides with a dashed stroke and ignores line-corner', () => {
      const w = mountTree({
        ...expanded,
        showLine: true,
        lineMode: 'guide',
        lineStyle: 'dashed',
        lineCorner: 'rounded',
      });
      expect(w.find('.sn-tree').classes()).toEqual(
        expect.arrayContaining(['sn-tree--line-guide', 'sn-tree--line-dashed']),
      );
      expect(w.find('.sn-tree').classes()).not.toContain('sn-tree--line-rounded');
      expect(w.findAll('.sn-tree__line--horizontal')).toHaveLength(0);
    });

    it('exposes lineColor as a CSS variable and leaves it unset by default', () => {
      const plain = mountTree({ ...expanded, showLine: true });
      expect(
        (plain.find('.sn-tree').element as HTMLElement).style.getPropertyValue(
          '--sn-web-tree-line-color',
        ),
      ).toBe('');

      const colored = mountTree({ ...expanded, showLine: true, lineColor: '#ff4d4f' });
      expect(
        (colored.find('.sn-tree').element as HTMLElement).style.getPropertyValue(
          '--sn-web-tree-line-color',
        ),
      ).toBe('#ff4d4f');
    });

    it('does not apply line modifiers while showLine is off', () => {
      const w = mountTree({ ...expanded, lineCorner: 'rounded', lineStyle: 'dashed' });
      expect(w.find('.sn-tree').classes()).not.toContain('sn-tree--line-rounded');
      expect(w.find('.sn-tree').classes()).not.toContain('sn-tree--line-dashed');
    });
  });

  describe('drag and drop', () => {
    const expanded = { defaultExpandedKeys: ['a', 'b', 'ba'] };

    function stubRowRect(el: HTMLElement): void {
      vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 30,
        height: 30,
        left: 0,
        right: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);
    }

    function dragEvent(type: string, clientY = 0): MouseEvent {
      return new MouseEvent(type, { bubbles: true, cancelable: true, clientY });
    }

    it('only makes rows draggable when the prop is on', () => {
      const plain = mountTree({ ...expanded });
      expect(plain.findAll('.sn-tree__node')[0]?.attributes('draggable')).toBe('false');

      const w = mountTree({ ...expanded, draggable: true });
      expect(w.findAll('.sn-tree__node')[0]?.attributes('draggable')).toBe('true');
    });

    it('marks the dragged row and emits dragStart / dragEnd', async () => {
      const w = mountTree({ ...expanded, draggable: true });
      const rows = w.findAll('.sn-tree__node');
      rows[1]?.element.dispatchEvent(dragEvent('dragstart'));
      await nextTick();

      expect(rows[1]?.classes()).toContain('sn-tree__node--dragging');
      expect(w.findComponent(SnTree).emitted('dragStart')?.[0]?.[0]).toMatchObject({
        node: { key: 'aa' },
      });

      rows[1]?.element.dispatchEvent(dragEvent('dragend'));
      await nextTick();
      expect(w.findComponent(SnTree).emitted('dragEnd')?.[0]?.[0]).toMatchObject({
        node: { key: 'aa' },
      });
      expect(w.find('.sn-tree__node--dragging').exists()).toBe(false);
    });

    it('resolves before / inside / after and emits the drop payload', async () => {
      const w = mountTree({ ...expanded, draggable: true });
      const rows = w.findAll('.sn-tree__node');
      const target = rows[0]!.element as HTMLElement;
      stubRowRect(target);
      rows[1]?.element.dispatchEvent(dragEvent('dragstart'));

      target.dispatchEvent(dragEvent('dragover', 2));
      await nextTick();
      expect(rows[0]?.classes()).toContain('sn-tree__node--drop-before');

      target.dispatchEvent(dragEvent('dragover', 15));
      await nextTick();
      expect(rows[0]?.classes()).toContain('sn-tree__node--drop-inside');

      target.dispatchEvent(dragEvent('drop', 15));
      await nextTick();
      expect(w.findComponent(SnTree).emitted('drop')?.[0]?.[0]).toMatchObject({
        node: { key: 'a' },
        dragNode: { key: 'aa' },
        dropPosition: 'inside',
      });
      expect(rows[0]?.classes()).not.toContain('sn-tree__node--drop-inside');

      // The browser follows a drop with dragend on the source row.
      rows[1]?.element.dispatchEvent(dragEvent('dragend'));
      await nextTick();
      expect(rows[1]?.classes()).not.toContain('sn-tree__node--dragging');
      expect(w.findComponent(SnTree).emitted('dragEnd')).toHaveLength(1);
    });

    it('respects allowDrop and refuses drops into the dragged subtree', async () => {
      const blocked = mountTree({ ...expanded, draggable: true, allowDrop: () => false });
      const blockedRows = blocked.findAll('.sn-tree__node');
      const blockedTarget = blockedRows[0]!.element as HTMLElement;
      stubRowRect(blockedTarget);
      blockedRows[1]?.element.dispatchEvent(dragEvent('dragstart'));
      blockedTarget.dispatchEvent(dragEvent('dragover', 15));
      await nextTick();
      expect(blocked.find('.sn-tree__node--drop-inside').exists()).toBe(false);
      blockedTarget.dispatchEvent(dragEvent('drop', 15));
      await nextTick();
      expect(blocked.findComponent(SnTree).emitted('drop')).toBeUndefined();

      const w = mountTree({ ...expanded, draggable: true });
      const rows = w.findAll('.sn-tree__node');
      const descendant = rows[1]!.element as HTMLElement;
      stubRowRect(descendant);
      rows[0]?.element.dispatchEvent(dragEvent('dragstart'));
      descendant.dispatchEvent(dragEvent('dragover', 15));
      await nextTick();
      expect(w.find('.sn-tree__node--drop-before').exists()).toBe(false);
      expect(w.find('.sn-tree__node--drop-inside').exists()).toBe(false);
      descendant.dispatchEvent(dragEvent('drop', 15));
      await nextTick();
      expect(w.findComponent(SnTree).emitted('drop')).toBeUndefined();
    });

    it('keeps checkbox clicks working while draggable', async () => {
      const w = mountTree({ ...expanded, checkable: true, draggable: true });
      await w.find('.sn-tree__checkbox').trigger('click');
      expect(w.find('.sn-tree__checkbox--checked').exists()).toBe(true);
    });

    it('places the checkbox in the leading slot, before the switcher', () => {
      const w = mountTree({ ...expanded, checkable: true });
      const row = w.findAll('.sn-tree__node')[0]!;
      const slots = Array.from(row.element.children).map((el) => el.className);
      expect(slots.findIndex((className) => className.includes('sn-tree__checkbox'))).toBe(1);
      expect(slots.findIndex((className) => className.includes('sn-tree__switcher'))).toBe(2);
    });
  });

  describe('data-level icons and VNode parts', () => {
    it('renders a render-fn icon from node data', () => {
      const w = mountTree({
        data: [
          { key: 'a', label: '节点 A', icon: () => h('span', { class: 'probe-icon' }, 'A') },
          { key: 'b', label: '节点 B' },
        ],
      });
      expect(w.findAll('.sn-tree__node-icon')).toHaveLength(1);
      expect(w.find('.sn-tree__node-icon .probe-icon').text()).toBe('A');
      expect(visibleLabels(w)).toEqual(['节点 A', '节点 B']);
    });

    it('renders a VNode icon and a plain-text icon', () => {
      const w = mountTree({
        data: [
          { key: 'v', label: 'VNode', icon: h('i', { class: 'probe-vnode' }) },
          { key: 't', label: 'Text', icon: 'TS' },
        ],
      });
      expect(w.find('.probe-vnode').exists()).toBe(true);
      expect(w.findAll('.sn-tree__node-icon')[1]?.text()).toBe('TS');
    });

    it('renders VNode prefix/suffix parts instead of stringifying them', () => {
      const w = mountTree({
        renderPrefix: () => h('span', { class: 'probe-prefix' }, '前'),
        renderSuffix: () => h('span', { class: 'probe-suffix' }, '后'),
      });
      expect(w.find('.probe-prefix').text()).toBe('前');
      expect(w.find('.probe-suffix').text()).toBe('后');
      expect(w.text()).not.toContain('[object Object]');
    });
  });
});
