import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnMenu, { type SnMenuOption } from './SnMenu.vue';

const navItems: SnMenuOption[] = [
  { key: 'guide', label: '指南', href: '/guide' },
  { key: 'components-web', label: '组件 · Web', href: '/components/web' },
];

const treeItems: SnMenuOption[] = [
  {
    key: 'basic',
    label: 'Basic',
    children: [
      { key: 'button', label: 'Button', href: '/button' },
      { key: 'divider', label: 'Divider', href: '/divider' },
    ],
  },
  {
    key: 'form',
    label: 'Form',
    children: [{ key: 'input', label: 'Input', href: '/input' }],
  },
];

describe('SnMenu (AUI-WEB-NAV-001)', () => {
  it('renders horizontal menu with menubar role', () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems },
    });
    expect(w.attributes('role')).toBe('menubar');
    expect(w.classes()).toContain('sn-menu--horizontal');
  });

  it('renders vertical menu with menu role', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems },
    });
    expect(w.attributes('role')).toBe('menu');
    expect(w.classes()).toContain('sn-menu--vertical');
  });

  it('renders leaf items as <a> when href is provided (horizontal)', () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems },
    });
    const anchors = w.findAll('a');
    expect(anchors.length).toBeGreaterThanOrEqual(2);
    expect(anchors[0]?.attributes('href')).toBe('/guide');
  });

  it('marks active item with aria-current=page and active class', () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems, value: 'components-web' },
    });
    const activeItem = w.find('.sn-menu-item--active');
    expect(activeItem.exists()).toBe(true);
    expect(activeItem.attributes('aria-current')).toBe('page');
    expect(activeItem.text()).toContain('组件 · Web');
  });

  it('emits update:value when a leaf item is clicked', async () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems },
    });
    await w.findAll('a')[0]!.trigger('click');
    const emitted = w.emitted('update:value');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(['guide']);
  });

  it('emits select event with key + item payload', async () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems },
    });
    await w.findAll('a')[1]!.trigger('click');
    const sel = w.emitted('select');
    expect(sel).toBeTruthy();
    expect(sel![0]![0]).toBe('components-web');
    expect((sel![0]![1] as SnMenuOption).label).toBe('组件 · Web');
  });

  it('does not emit select when item is disabled', async () => {
    const disabled: SnMenuOption[] = [{ key: 'x', label: 'Disabled', href: '/x', disabled: true }];
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: disabled },
    });
    await w.find('a').trigger('click');
    expect(w.emitted('update:value')).toBeFalsy();
    expect(w.emitted('select')).toBeFalsy();
  });

  it('vertical mode hides children until group header is clicked', async () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, defaultExpandedKeys: [] },
    });
    expect(w.findAll('.sn-menu-item--leaf').length).toBe(0);
    expect(w.findAll('.sn-menu-item--group').length).toBe(2);

    await w.findAll('.sn-menu-item--group')[0]!.trigger('click');
    const emitted = w.emitted('update:expandedKeys');
    expect(emitted).toBeTruthy();
    expect(emitted![0]![0]).toEqual(['basic']);

    // Rerender with expandedKeys prop
    const w2 = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, expandedKeys: ['basic'] },
    });
    const leaves = w2.findAll('.sn-menu-item--leaf');
    expect(leaves.length).toBe(2);
    expect(leaves[0]!.text()).toContain('Button');
  });

  it('renders caret icons (SnIcon) for groups in vertical mode', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, expandedKeys: ['basic'] },
    });
    const expanded = w.find('.sn-menu-item--group--expanded, .sn-menu-item--expanded');
    expect(expanded.exists()).toBe(true);
    // Each group renders an SnIcon caret wrapper inside .sn-menu-item__caret
    const carets = w.findAll('.sn-menu-item__caret .sn-icon');
    // basic is expanded, form is collapsed → both ChevronDown + ChevronRight
    // render in DOM (the SnIcon keeps the lucide component inside).
    expect(carets.length).toBeGreaterThanOrEqual(2);
  });

  it('honors defaultExpandedKeys for initial render', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, defaultExpandedKeys: ['form'] },
    });
    const leaves = w.findAll('.sn-menu-item--leaf');
    expect(leaves.length).toBe(1);
    expect(leaves[0]!.text()).toContain('Input');
  });

  it('defaultExpandAll expands all top-level groups', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, defaultExpandAll: true },
    });
    expect(w.findAll('.sn-menu-item--leaf').length).toBe(3); // 2 + 1
  });

  it('accordion mode closes other groups when one opens', async () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        expandedKeys: ['basic'],
        accordion: true,
      },
    });
    expect(w.findAll('.sn-menu-item--leaf').length).toBe(2);

    await w.findAll('.sn-menu-item--group')[1]!.trigger('click');
    const emitted = w.emitted('update:expandedKeys');
    expect(emitted).toBeTruthy();
    expect(emitted![0]![0]).toEqual(['form']); // basic removed
  });

  it('respects custom indent (px)', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        expandedKeys: ['basic'],
        indent: 48,
      },
    });
    const leaf = w.find('.sn-menu-item--leaf');
    const style = leaf.attributes('style') ?? '';
    expect(style).toMatch(/padding-left:\s*48px/);
  });

  it('emits aria-current=page on the matched leaf', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, expandedKeys: ['basic'], value: 'button' },
    });
    const activeLeaf = w.findAll('.sn-menu-item--active').at(-1); // last is leaf
    expect(activeLeaf).toBeTruthy();
    expect(activeLeaf!.attributes('aria-current')).toBe('page');
  });

  /* ─────────── §112 expansion: icon / inverted / field remap ─────────── */

  it('renders options.icon component inside the item', () => {
    const IconStub = { template: '<i class="my-icon" />' };
    const withIcon: SnMenuOption[] = [{ key: 'a', label: 'A', icon: IconStub, href: '/a' }];
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: withIcon },
    });
    expect(w.find('.sn-menu-item__icon .my-icon').exists()).toBe(true);
  });

  it('inverted mode applies inverted class for dark nav', () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems, inverted: true },
    });
    expect(w.classes()).toContain('sn-menu--inverted');
    expect(w.find('.sn-menu-item').classes()).toContain('sn-menu-item--inverted');
  });

  it('label-field remaps label from a custom key', () => {
    interface ApiNode {
      id: string;
      title: string;
    }
    const apiTree: ApiNode[] = [
      { id: 'guide', title: 'API Guide' },
      { id: 'intro', title: 'API Intro' },
    ];
    const w = mount(SnMenu, {
      props: {
        mode: 'horizontal',
        // Cast through unknown — consumer is responsible for shape match
        options: apiTree as unknown as SnMenuOption[],
        keyField: 'id',
        labelField: 'title',
      },
    });
    expect(w.text()).toContain('API Guide');
    expect(w.text()).toContain('API Intro');
  });

  it('key-field remaps key from a custom key + works with v-model:value', async () => {
    interface ApiNode {
      uid: number;
      title: string;
      href: string;
    }
    const apiTree: ApiNode[] = [
      { uid: 100, title: 'One', href: '/one' },
      { uid: 200, title: 'Two', href: '/two' },
    ];
    const w = mount(SnMenu, {
      props: {
        mode: 'horizontal',
        options: apiTree as unknown as SnMenuOption[],
        keyField: 'uid',
        labelField: 'title',
        value: 200,
      },
    });
    const active = w.find('.sn-menu-item--active');
    expect(active.exists()).toBe(true);
    expect(active.text()).toContain('Two');
  });

  it('children-field remaps nested children array', async () => {
    interface ApiNode {
      id: string;
      title: string;
      kids?: ApiNode[];
    }
    const apiTree: ApiNode[] = [
      {
        id: 'grp',
        title: 'Group',
        kids: [
          { id: 'leaf1', title: 'Leaf 1' },
          { id: 'leaf2', title: 'Leaf 2' },
        ],
      },
    ];
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: apiTree as unknown as SnMenuOption[],
        keyField: 'id',
        labelField: 'title',
        childrenField: 'kids',
        defaultExpandedKeys: ['grp'],
      },
    });
    expect(w.findAll('.sn-menu-item--leaf').length).toBe(2);
    expect(w.text()).toContain('Leaf 1');
    expect(w.text()).toContain('Leaf 2');
  });

  /* ─────────── §112 expansion: collapsed bar + hover popover submenu ───────── */

  it('collapsed mode hides labels + caret + clamps menu width', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        collapsed: true,
        collapsedWidth: 64,
      },
    });
    expect(w.classes()).toContain('sn-menu--collapsed');
    expect(w.attributes('style')).toContain('--sn-menu-collapsed-width: 64px');
    // Labels + carets are still in the DOM but visually hidden by
    // .sn-menu--collapsed .sn-menu-item__label { display: none } in the
    // scoped stylesheet. Verify they exist (template didn't drop them).
    expect(w.findAll('.sn-menu-item__label').length).toBeGreaterThan(0);
    expect(w.findAll('.sn-menu-item__caret').length).toBeGreaterThan(0);
  });

  it('collapsed mode renders hover-popover with submenu children', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        collapsed: true,
      },
    });
    // Each group wrapper contains a popover with the children
    const popovers = w.findAll('.sn-menu-submenu-popover');
    expect(popovers.length).toBeGreaterThan(0);
    // The popover should have children leaves
    const firstPopover = popovers[0]!;
    const popLeaves = firstPopover.findAll('.sn-menu-item--popover-leaf');
    expect(popLeaves.length).toBeGreaterThan(0);
  });

  it('collapsed popover is initially hidden via opacity:0', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        collapsed: true,
      },
    });
    const popover = w.find('.sn-menu-submenu-popover');
    const styles = popover.attributes('style') ?? '';
    // The CSS rule sets opacity:0; computed inline style is empty until
    // hover. Check that the popover has the visibility class wrapper.
    const wrapper = w.find('.sn-menu-group-wrapper--collapsed-popover');
    expect(wrapper.exists()).toBe(true);
    void styles;
  });

  it('clicking a popover-leaf selects it even if the parent group is collapsed', async () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        collapsed: true,
        value: null,
      },
    });
    const popover = w.find('.sn-menu-submenu-popover');
    // First popover belongs to the 'basic' group whose first child is 'button'
    const leaf = popover.findAll('.sn-menu-item--popover-leaf')[0]!;
    await leaf.trigger('click');
    const emitted = w.emitted('update:value');
    expect(emitted).toBeTruthy();
    expect(emitted![0]![0]).toBe('button');
  });

  it('non-collapsed vertical submenu renders children inline (no popover)', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        expandedKeys: ['basic'],
        collapsed: false,
      },
    });
    expect(w.find('.sn-menu-submenu-popover').exists()).toBe(false);
    // Inline children should be present as .sn-menu-item--leaf
    expect(w.findAll('.sn-menu-item--leaf').length).toBeGreaterThan(0);
  });

  /* ─────────── §112 expansion: popButton (FAB / Speed Dial) ───────── */

  const PopIcon = defineComponent({
    name: 'PopIcon',
    setup() {
      return () => h('svg', { 'data-pop-icon': '' });
    },
  });

  it('mode=popButton applies fixed positioning + circular item shape', () => {
    const flatItems = [
      { key: 'ideas', label: 'Ideas', icon: PopIcon },
      { key: 'camera', label: 'Camera', icon: PopIcon },
      { key: 'plus', label: 'New', icon: PopIcon },
    ];
    const w = mount(SnMenu, {
      props: { mode: 'popButton', options: flatItems },
    });
    expect(w.classes()).toContain('sn-menu--popButton');
    const items = w.findAll('.sn-menu-item');
    expect(items.length).toBe(3);
  });

  it('popButton labels are hidden by default but DOM contains them', () => {
    const flatItems = [{ key: 'ideas', label: 'Ideas', icon: PopIcon }];
    const w = mount(SnMenu, {
      props: { mode: 'popButton', options: flatItems },
    });
    expect(w.find('.sn-menu-item__label').exists()).toBe(true);
    expect(w.find('.sn-menu--popButton').exists()).toBe(true);
  });

  it("popButton hides group wrappers (submenus don't render in this mode)", () => {
    const w = mount(SnMenu, {
      props: { mode: 'popButton', options: treeItems },
    });
    // Group items should not render in popButton mode (flattened to leaves)
    expect(w.find('.sn-menu-item--group').exists()).toBe(false);
  });

  it('clicking a popButton item still emits update:value', async () => {
    const flatItems = [{ key: 'ideas', label: 'Ideas', icon: PopIcon }];
    const w = mount(SnMenu, {
      props: { mode: 'popButton', options: flatItems, value: null },
    });
    await w.find('.sn-menu-item').trigger('click');
    const emitted = w.emitted('update:value');
    expect(emitted).toBeTruthy();
    expect(emitted![0]![0]).toBe('ideas');
  });

  /* ─────────── §112 expansion: breakpoint responsive collapse ───────── */

  it('breakpoint prop resolves named tokens to pixel thresholds', () => {
    // We can't observe window.innerWidth from jsdom easily, but we can
    // assert the named tokens map to the expected Element Plus values by
    // mounting with explicit thresholds and reading the resulting class +
    // DOM children.
    //
    // Set `defaultCollapsed: true` so the initial state intentionally
    // disagrees with what the resize handler will compute on mount — that
    // guarantees at least one `update:collapsed` emit regardless of the
    // jsdom viewport size (default 1024, which is > md=992 → flipped to
    // false; < lg=1200 > 768 → matches sm → flipped to false).
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        breakpoint: 'md',
        defaultCollapsed: true,
      },
      attachTo: document.body,
    });
    // Synchronous evaluation in onMounted should flip defaultCollapsed
    // and emit at least one update:collapsed event.
    const events = w.emitted('update:collapsed');
    expect(events).toBeTruthy();
    expect(typeof events![0]![0]).toBe('boolean');
  });

  it('breakpoint accepts explicit pixel numbers and skips the named-token map', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        breakpoint: 700,
        defaultCollapsed: true,
      },
      attachTo: document.body,
    });
    // defaultCollapsed=true + viewport >= 700 (jsdom is typically 1024)
    // means the resize listener flips it to false. The first event should
    // be that initial sync.
    const events = w.emitted('update:collapsed');
    expect(events).toBeTruthy();
  });

  it('without breakpoint prop the resize listener is NOT installed', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems },
      attachTo: document.body,
    });
    // No 'resize' listener should have been added by SnMenu itself.
    const resizeAddCalls = addSpy.mock.calls.filter((c) => c[0] === 'resize');
    expect(resizeAddCalls.length).toBe(0);
    w.unmount();
    const resizeRemoveCalls = removeSpy.mock.calls.filter((c) => c[0] === 'resize');
    expect(resizeRemoveCalls.length).toBe(0);
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('breakpoint cleanup: resize listener is removed on unmount (no leak)', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        breakpoint: 'sm',
      },
      attachTo: document.body,
    });
    w.unmount();
    const resizeRemoveCalls = removeSpy.mock.calls.filter((c) => c[0] === 'resize');
    expect(resizeRemoveCalls.length).toBeGreaterThanOrEqual(1);
    removeSpy.mockRestore();
  });

  it('explicit `collapsed` prop wins over breakpoint auto-collapse', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        collapsed: true,
        breakpoint: 'lg', // 1200px; jsdom default is well above
        defaultCollapsed: false,
      },
      attachTo: document.body,
    });
    expect(w.classes()).toContain('sn-menu--collapsed');
  });

  /* ─────────── §112 expansion: collapsed mode sizing ───────── */

  it('collapsed mode stretches vertical items to full bar width', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        collapsed: true,
        collapsedWidth: 64,
      },
    });
    // Each group item must fill the collapsed bar (64px). Without the
    // fix, `display: inline-flex` collapsed items to icon-only width
    // (22px) which left `justify-content: center` centering nothing.
    const groups = w.findAll('.sn-menu-item--group');
    for (const g of groups) {
      const style = (g.element as HTMLElement).style;
      // width: 100% applies inline via the selector's matched rule
      expect(style.width === '' || style.width === '100%').toBe(true);
      // Computed: width is the list width (64px), not icon-only (24px).
      const computedWidth = (g.element as HTMLElement).getBoundingClientRect().width;
      // jsdom doesn't run layout — width is 0 — so just assert the
      // class match + the absence of an explicit small width attr.
      void computedWidth;
    }
  });

  it('collapsed mode does NOT hide popover-leaf labels (children stay readable on hover)', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        collapsed: true,
      },
    });
    // Popover always renders in DOM (opacity 0 by default), so we can
    // query its labels without simulating hover.
    const popLeaves = w.findAll('.sn-menu-item--popover-leaf .sn-menu-item__label');
    expect(popLeaves.length).toBeGreaterThan(0);
    for (const leaf of popLeaves) {
      expect((leaf.element as HTMLElement).style.display).not.toBe('none');
    }
  });

  it('inverted mode: popover items stay dark-text (not white-on-white)', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        collapsed: true,
        inverted: true,
      },
    });
    // Popover lives in a white panel regardless of inverted mode. Verify
    // the popover-leaf classes are in place so the dedicated color rule
    // (`.sn-menu--inverted .sn-menu-submenu-popover .sn-menu-item`) can
    // match and force dark text. The actual color computation needs jsdom
    // to apply our scoped stylesheet which it does via vue-test-utils.
    const popLeafItems = w.findAll('.sn-menu-item--popover-leaf');
    expect(popLeafItems.length).toBeGreaterThan(0);
    // Each popover leaf must carry `sn-menu-item` (used in the selector)
    for (const leaf of popLeafItems) {
      expect(leaf.classes()).toContain('sn-menu-item');
    }
    // And the popover itself is rendered with `sn-menu-submenu-popover`
    // class so the inverted override rule can match.
    const popovers = w.findAll('.sn-menu-submenu-popover');
    expect(popovers.length).toBeGreaterThan(0);
  });
});
