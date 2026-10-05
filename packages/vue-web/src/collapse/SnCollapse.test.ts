import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnCollapse from './SnCollapse.vue'
import SnCollapseItem from './SnCollapseItem.vue'

interface ItemSpec { name: string; title: string; body: string; disabled?: boolean }

/** Build a wrapper SFC that mounts <SnCollapse> + items at runtime so the
 *  test renderer sees SnCollapseItem inside SnCollapse's default slot. */
function wrapCollapse(props: Record<string, unknown>, items: ItemSpec[]) {
  return defineComponent({
    components: { SnCollapse, SnCollapseItem },
    setup() {
      return () => h(
        SnCollapse,
        props as never,
        {
          default: () => items.map((it) =>
            h(
              SnCollapseItem,
              {
                key: it.name,
                name: it.name,
                title: it.title,
                disabled: it.disabled ?? false,
              },
              { default: () => it.body },
            ),
          ),
        },
      )
    },
  })
}

describe('SnCollapse (AUI-WEB-LAYOUT-005)', () => {
  it('renders a region container', () => {
    const w = mount(SnCollapse, { slots: { default: '<div>x</div>' } })
    expect(w.classes()).toContain('sn-collapse')
    expect(w.attributes('role')).toBe('region')
  })

  it('renders all items collapsed by default', () => {
    const Wrapper = wrapCollapse(
      {},
      [
        { name: 'a', title: 'Section A', body: 'AAA' },
        { name: 'b', title: 'Section B', body: 'BBB' },
      ],
    )
    const w = mount(Wrapper)
    expect(w.findAll('.sn-collapse-item').length).toBe(2)
    expect(w.findAll('.sn-collapse-item--expanded').length).toBe(0)
  })

  it('honors defaultExpandedNames', () => {
    const Wrapper = wrapCollapse(
      { defaultExpandedNames: ['a'] },
      [
        { name: 'a', title: 'Section A', body: 'AAA' },
        { name: 'b', title: 'Section B', body: 'BBB' },
      ],
    )
    const w = mount(Wrapper)
    expect(w.findAll('.sn-collapse-item--expanded').length).toBe(1)
  })

  it('emits update:expandedNames when a header is clicked', async () => {
    const Wrapper = wrapCollapse(
      {},
      [{ name: 'a', title: 'Section A', body: 'AAA' }],
    )
    const w = mount(Wrapper)
    await w.find('.sn-collapse-item__header').trigger('click')
    const emitted = w.findComponent(SnCollapse).emitted('update:expandedNames')
    expect(emitted).toBeTruthy()
    expect(emitted![0]![0]).toEqual(['a'])
  })

  it('toggles the item back off when clicked again', async () => {
    const Wrapper = wrapCollapse(
      { defaultExpandedNames: ['a'] },
      [{ name: 'a', title: 'Section A', body: 'AAA' }],
    )
    const w = mount(Wrapper)
    await w.find('.sn-collapse-item__header').trigger('click')
    const emitted = w.findComponent(SnCollapse).emitted('update:expandedNames')
    expect(emitted![0]![0]).toEqual([])
  })

  it('accordion mode restricts to one expanded item at a time', async () => {
    const Wrapper = wrapCollapse(
      { accordion: true },
      [
        { name: 'a', title: 'Section A', body: 'AAA' },
        { name: 'b', title: 'Section B', body: 'BBB' },
      ],
    )
    const w = mount(Wrapper)
    await w.findAll('.sn-collapse-item__header')[0]!.trigger('click')
    expect((w.findComponent(SnCollapse).emitted('update:expandedNames')![0]![0])).toEqual(['a'])

    await w.findAll('.sn-collapse-item__header')[1]!.trigger('click')
    expect((w.findComponent(SnCollapse).emitted('update:expandedNames')![1]![0])).toEqual(['b'])
  })

  it('header has aria-expanded="true" when expanded', () => {
    const Wrapper = wrapCollapse(
      { defaultExpandedNames: ['a'] },
      [{ name: 'a', title: 'Section A', body: 'AAA' }],
    )
    const w = mount(Wrapper)
    const header = w.find('.sn-collapse-item__header')
    expect(header.attributes('aria-expanded')).toBe('true')
  })

  it('places caret on right when arrowPlacement=right', () => {
    const Wrapper = wrapCollapse(
      { arrowPlacement: 'right', defaultExpandedNames: ['a'] },
      [{ name: 'a', title: 'Section A', body: 'AAA' }],
    )
    const w = mount(Wrapper)
    expect(w.classes()).toContain('sn-collapse--arrow-right')
  })

  it('disabled item does not emit toggle', async () => {
    const Wrapper = wrapCollapse(
      {},
      [{ name: 'locked', title: 'Locked', body: 'AAA', disabled: true }],
    )
    const w = mount(Wrapper)
    await w.find('.sn-collapse-item__header').trigger('click')
    expect(w.findComponent(SnCollapse).emitted('update:expandedNames')).toBeFalsy()
  })
})