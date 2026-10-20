import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnDescriptions from './SnDescriptions.vue'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import SnDescriptionsItem from './SnDescriptionsItem.vue'

/** Mount SnDescriptions through a wrapper component, mirroring real usage. */
function mountDescriptions(
  props: Record<string, unknown> = {},
  slots: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      components: { SnDescriptions, SnDescriptionsItem },
      setup() {
        return () => h(SnDescriptions, props as never, slots as never)
      },
    }),
  )
}

/** Three label/content items, the canonical fixture. */
function itemSlots(): Record<string, unknown> {
  return {
    default: () => [
      h(SnDescriptionsItem, { label: '名称' }, { default: () => 'AUI' }),
      h(SnDescriptionsItem, { label: '版本' }, { default: () => 'v3' }),
      h(SnDescriptionsItem, { label: '平台' }, { default: () => 'Web' }),
    ],
  }
}

describe('SnDescriptions (AUI-WEB-DD-005)', () => {
  describe('rendering', () => {
    it('renders a medium top-placement table by default', () => {
      const w = mountDescriptions({}, itemSlots())
      const root = w.find('.sn-descriptions')
      expect(root.classes()).toContain('sn-descriptions--medium')
      expect(root.classes()).toContain('sn-descriptions--top-label-placement')
      expect(root.classes()).toContain('sn-descriptions--left-label-align')
      expect(w.find('.sn-descriptions__table').exists()).toBe(true)
      // 3 items × 2 physical tracks = 6 sizing cells.
      expect(w.findAll('.sn-descriptions__table-row')[0].findAll('td')).toHaveLength(6)
      // Label row (3 th) + content row (3 td).
      expect(w.findAll('.sn-descriptions__table-header')).toHaveLength(3)
      expect(w.findAll('.sn-descriptions__table-content')).toHaveLength(3)
      expect(w.find('.sn-descriptions__table-header').text()).toBe('名称')
      expect(w.find('.sn-descriptions__table-content').text()).toBe('AUI')
    })

    it('renders the title prop as the header block', () => {
      const w = mountDescriptions({ title: '订单信息' })
      expect(w.find('.sn-descriptions__header').text()).toBe('订单信息')
    })

    it('renders the header slot instead of the title prop', () => {
      const w = mountDescriptions(
        { title: '订单信息' },
        { header: () => '自定义标题' },
      )
      expect(w.find('.sn-descriptions__header').text()).toBe('自定义标题')
    })

    it('renders no header block without title or header slot', () => {
      const w = mountDescriptions({}, itemSlots())
      expect(w.find('.sn-descriptions__header').exists()).toBe(false)
    })

    it('renders labels from the label slot over the label prop', () => {
      const w = mountDescriptions(
        {},
        {
          default: () => [
            h(
              SnDescriptionsItem,
              { label: 'prop 标签' },
              { default: () => '内容', label: () => 'slot 标签' },
            ),
          ],
        },
      )
      expect(w.find('.sn-descriptions__table-header').text()).toBe('slot 标签')
    })

    it('filters children that are not SnDescriptionsItem', () => {
      const w = mountDescriptions(
        {},
        {
          default: () => [
            h('div', '杂项'),
            h(SnDescriptionsItem, { label: '名称' }, { default: () => 'AUI' }),
          ],
        },
      )
      expect(w.findAll('.sn-descriptions__table-header')).toHaveLength(1)
    })

    it('supports v-for item lists (fragments are flattened)', () => {
      const w = mount(
        defineComponent({
          components: { SnDescriptions, SnDescriptionsItem },
          setup() {
            const rows = [
              { label: 'A', value: '1' },
              { label: 'B', value: '2' },
            ]
            return () =>
              h(SnDescriptions, null, {
                default: () =>
                  rows.map((row) =>
                    h(SnDescriptionsItem, { label: row.label }, { default: () => row.value }),
                  ),
              })
          },
        }),
      )
      expect(w.findAll('.sn-descriptions__table-header')).toHaveLength(2)
      expect(w.findAll('.sn-descriptions__table-content')).toHaveLength(2)
    })
  })

  describe('layout', () => {
    it('stretches the last entry of a row to fill remaining columns', () => {
      // 2 items in a 3-column grid: the second (last) item fills 4 tracks.
      const w = mountDescriptions(
        {},
        {
          default: () => [
            h(SnDescriptionsItem, { label: 'A' }, { default: () => '1' }),
            h(SnDescriptionsItem, { label: 'B' }, { default: () => '2' }),
          ],
        },
      )
      const headers = w.findAll('.sn-descriptions__table-header')
      expect(headers[0].attributes('colspan')).toBe('2')
      expect(headers[1].attributes('colspan')).toBe('4')
    })

    it('wraps entries into new rows once the column budget is used', () => {
      const w = mountDescriptions(
        { column: 1 },
        {
          default: () => [
            h(SnDescriptionsItem, { label: 'A' }, { default: () => '1' }),
            h(SnDescriptionsItem, { label: 'B' }, { default: () => '2' }),
          ],
        },
      )
      // column=1 + top placement: each item consumes a label row + content row.
      expect(w.findAll('.sn-descriptions__table-header')).toHaveLength(2)
      expect(w.findAll('.sn-descriptions__table-content')).toHaveLength(2)
    })

    it('honors the span prop of an entry', () => {
      const w = mountDescriptions(
        { column: 3 },
        {
          default: () => [
            h(SnDescriptionsItem, { label: 'A', span: 2 }, { default: () => '1' }),
            h(SnDescriptionsItem, { label: 'B' }, { default: () => '2' }),
          ],
        },
      )
      const headers = w.findAll('.sn-descriptions__table-header')
      // span=2 → 4 tracks; the last entry fills the remaining 2.
      expect(headers[0].attributes('colspan')).toBe('4')
      expect(headers[1].attributes('colspan')).toBe('2')
    })
  })

  describe('bordered', () => {
    it('adds the bordered modifier class', () => {
      const w = mountDescriptions({ bordered: true }, itemSlots())
      expect(w.find('.sn-descriptions').classes()).toContain('sn-descriptions--bordered')
    })

    it('renders label/content cell pairs for left placement', () => {
      const w = mountDescriptions(
        { bordered: true, labelPlacement: 'left' },
        itemSlots(),
      )
      const cells = w.findAll('th, td')
      // 3 items × (1 th + 1 td) — the sizer row only exists in top mode.
      expect(w.findAll('th')).toHaveLength(3)
      expect(w.findAll('td')).toHaveLength(3)
      expect(cells[0].element.tagName).toBe('TH')
      expect(cells[1].element.tagName).toBe('TD')
    })

    it('stretches the last bordered content cell to fill the row', () => {
      const w = mountDescriptions(
        { bordered: true, labelPlacement: 'left' },
        {
          default: () => [
            h(SnDescriptionsItem, { label: 'A' }, { default: () => '1' }),
            h(SnDescriptionsItem, { label: 'B' }, { default: () => '2' }),
          ],
        },
      )
      const contents = w.findAll('.sn-descriptions__table-content')
      expect(contents[0].attributes('colspan')).toBe('1')
      // Last entry content fills the remaining tracks: (3-1)*2 + 1 = 5.
      expect(contents[1].attributes('colspan')).toBe('5')
    })
  })

  describe('label placement / separator / alignment', () => {
    it('renders inline label + separator + content for left placement without border', () => {
      const w = mountDescriptions(
        { labelPlacement: 'left', separator: '：' },
        itemSlots(),
      )
      const label = w.find('.sn-descriptions__label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('名称：')
      expect(w.find('.sn-descriptions__separator').text()).toBe('：')
      expect(w.find('.sn-descriptions__content').text()).toBe('AUI')
    })

    it('omits the separator when empty', () => {
      const w = mountDescriptions(
        { labelPlacement: 'left', separator: '' },
        {
          default: () => [
            h(SnDescriptionsItem, { label: 'A' }, { default: () => '1' }),
          ],
        },
      )
      expect(w.find('.sn-descriptions__separator').exists()).toBe(false)
    })

    it('does not render the separator outside left placement', () => {
      const w = mountDescriptions(
        { labelPlacement: 'top' },
        {
          default: () => [
            h(SnDescriptionsItem, { label: 'A' }, { default: () => '1' }),
          ],
        },
      )
      expect(w.find('.sn-descriptions__separator').exists()).toBe(false)
    })

    it('applies label alignment modifier classes', () => {
      for (const align of ['left', 'center', 'right'] as const) {
        const w = mountDescriptions({ labelAlign: align })
        expect(w.find('.sn-descriptions').classes()).toContain(
          `sn-descriptions--${align}-label-align`,
        )
      }
    })

    it('applies the size modifier classes', () => {
      for (const size of ['small', 'medium', 'large'] as const) {
        const w = mountDescriptions({ size })
        expect(w.find('.sn-descriptions').classes()).toContain(`sn-descriptions--${size}`)
      }
    })
  })

  describe('style pass-through', () => {
    it('applies label-style and content-style to cells', () => {
      const w = mountDescriptions(
        { labelStyle: { color: 'rgb(1, 2, 3)' }, contentStyle: 'font-weight: 700' },
        {
          default: () => [
            h(SnDescriptionsItem, { label: 'A' }, { default: () => '1' }),
          ],
        },
      )
      expect(w.find('.sn-descriptions__table-header').attributes('style')).toContain('color')
      expect(w.find('.sn-descriptions__table-content').attributes('style')).toContain('font-weight')
    })

    it('applies the container-level label-class / content-class', () => {
      const w = mountDescriptions(
        { labelClass: 'my-label', contentClass: 'my-content' },
        {
          default: () => [
            h(SnDescriptionsItem, { label: 'A' }, { default: () => '1' }),
          ],
        },
      )
      expect(w.find('.sn-descriptions__table-header').classes()).toContain('my-label')
      expect(w.find('.sn-descriptions__table-content').classes()).toContain('my-content')
    })
  })
  describe('cell padding', () => {
    /**
     * Regression guard for the "描述组件没有 padding" report: the non-bordered
     * content cells must carry the same 12px column gutter the label row
     * already used, so left-placement items stop touching each other.
     *
     * happy-dom performs no layout, so the authored custom properties are
     * asserted against the SFC source (vitest cwd = packages/vue-web), the
     * same technique `SnAlert.test.ts` uses for its alignment tokens.
     */
    const source = readFileSync(join(process.cwd(), 'src/descriptions/SnDescriptions.vue'), 'utf8')
    const style = (/<style scoped>([\s\S]*?)<\/style>/.exec(source)?.[1] ?? '').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    )

    it('gives non-bordered content cells a horizontal column gutter', () => {
      expect(style).toContain('--sn-descriptions-td-padding: 0 12px 12px 0;')
      expect(style).toContain('--sn-descriptions-td-padding: 0 12px 8px 0;')
      expect(style).toContain('--sn-descriptions-td-padding: 0 12px 16px 0;')
      // The label row keeps its own 12px column gutter and 8px row gap.
      expect(style).toContain('--sn-descriptions-th-padding: 0 12px 8px 0;')
      // The bordered grid keeps its own 12px / 16px cell box.
      expect(style).toContain('--sn-descriptions-td-padding: 12px 16px;')
    })

    it('renders one cell per entry in left placement so the gutter separates them', () => {
      const w = mountDescriptions({ labelPlacement: 'left' }, itemSlots())
      // Left placement without border: 3 combined label/content cells, no
      // sizer row and no separate label row.
      expect(w.findAll('.sn-descriptions__table-content')).toHaveLength(3)
      expect(w.findAll('.sn-descriptions__label')).toHaveLength(3)
      expect(w.findAll('.sn-descriptions__table-header')).toHaveLength(0)
    })
  })
})
