import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnMenu, { type SnMenuOption } from './SnMenu.vue'

const navItems: SnMenuOption[] = [
  { key: 'guide', label: '指南', href: '/guide' },
  { key: 'components-web', label: '组件 · Web', href: '/components/web' },
]

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
    children: [
      { key: 'input', label: 'Input', href: '/input' },
    ],
  },
]

describe('SnMenu (AUI-WEB-NAV-001)', () => {
  it('renders horizontal menu with menubar role', () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems },
    })
    expect(w.attributes('role')).toBe('menubar')
    expect(w.classes()).toContain('sn-menu--horizontal')
  })

  it('renders vertical menu with menu role', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems },
    })
    expect(w.attributes('role')).toBe('menu')
    expect(w.classes()).toContain('sn-menu--vertical')
  })

  it('renders leaf items as <a> when href is provided (horizontal)', () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems },
    })
    const anchors = w.findAll('a')
    expect(anchors.length).toBeGreaterThanOrEqual(2)
    expect(anchors[0]?.attributes('href')).toBe('/guide')
  })

  it('marks active item with aria-current=page and active class', () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems, value: 'components-web' },
    })
    const activeItem = w.find('.sn-menu-item--active')
    expect(activeItem.exists()).toBe(true)
    expect(activeItem.attributes('aria-current')).toBe('page')
    expect(activeItem.text()).toContain('组件 · Web')
  })

  it('emits update:value when a leaf item is clicked', async () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems },
    })
    await w.findAll('a')[0]!.trigger('click')
    const emitted = w.emitted('update:value')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['guide'])
  })

  it('emits select event with key + item payload', async () => {
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: navItems },
    })
    await w.findAll('a')[1]!.trigger('click')
    const sel = w.emitted('select')
    expect(sel).toBeTruthy()
    expect(sel![0]![0]).toBe('components-web')
    expect((sel![0]![1] as SnMenuOption).label).toBe('组件 · Web')
  })

  it('does not emit select when item is disabled', async () => {
    const disabled: SnMenuOption[] = [
      { key: 'x', label: 'Disabled', href: '/x', disabled: true },
    ]
    const w = mount(SnMenu, {
      props: { mode: 'horizontal', options: disabled },
    })
    await w.find('a').trigger('click')
    expect(w.emitted('update:value')).toBeFalsy()
    expect(w.emitted('select')).toBeFalsy()
  })

  it('vertical mode hides children until group header is clicked', async () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, defaultExpandedKeys: [] },
    })
    expect(w.findAll('.sn-menu-item--leaf').length).toBe(0)
    expect(w.findAll('.sn-menu-item--group').length).toBe(2)

    await w.findAll('.sn-menu-item--group')[0]!.trigger('click')
    const emitted = w.emitted('update:expandedKeys')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toEqual(['basic'])

    // Rerender with expandedKeys prop
    const w2 = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, expandedKeys: ['basic'] },
    })
    const leaves = w2.findAll('.sn-menu-item--leaf')
    expect(leaves.length).toBe(2)
    expect(leaves[0]!.text()).toContain('Button')
  })

  it('renders caret icon (▾/▸) for groups in vertical mode', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, expandedKeys: ['basic'] },
    })
    const expanded = w.find('.sn-menu-item--group--expanded, .sn-menu-item--expanded')
    expect(expanded.exists()).toBe(true)
    expect(w.text()).toContain('▾')
    expect(w.text()).toContain('▸')
  })

  it('honors defaultExpandedKeys for initial render', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, defaultExpandedKeys: ['form'] },
    })
    const leaves = w.findAll('.sn-menu-item--leaf')
    expect(leaves.length).toBe(1)
    expect(leaves[0]!.text()).toContain('Input')
  })

  it('defaultExpandAll expands all top-level groups', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, defaultExpandAll: true },
    })
    expect(w.findAll('.sn-menu-item--leaf').length).toBe(3) // 2 + 1
  })

  it('accordion mode closes other groups when one opens', async () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        expandedKeys: ['basic'],
        accordion: true,
      },
    })
    expect(w.findAll('.sn-menu-item--leaf').length).toBe(2)

    await w.findAll('.sn-menu-item--group')[1]!.trigger('click')
    const emitted = w.emitted('update:expandedKeys')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toEqual(['form']) // basic removed
  })

  it('respects custom indent (px)', () => {
    const w = mount(SnMenu, {
      props: {
        mode: 'vertical',
        options: treeItems,
        expandedKeys: ['basic'],
        indent: 48,
      },
    })
    const leaf = w.find('.sn-menu-item--leaf')
    const style = leaf.attributes('style') ?? ''
    expect(style).toMatch(/padding-left:\s*48px/)
  })

  it('emits aria-current=page on the matched leaf', () => {
    const w = mount(SnMenu, {
      props: { mode: 'vertical', options: treeItems, expandedKeys: ['basic'], value: 'button' },
    })
    const activeLeaf = w.findAll('.sn-menu-item--active').at(-1) // last is leaf
    expect(activeLeaf).toBeTruthy()
    expect(activeLeaf!.attributes('aria-current')).toBe('page')
  })
})