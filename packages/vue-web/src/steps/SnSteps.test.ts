import { readFileSync } from 'node:fs'

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import SnSteps from './SnSteps.vue'
import SnStep from './SnStep.vue'
import SnIcon from '../icon/SnIcon.vue'
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions'

interface StepSpec {
  title?: string
  description?: string
  status?: 'process' | 'finish' | 'error' | 'wait'
  disabled?: boolean
}

/** Wrap <SnSteps> + <SnStep> children in a runtime SFC so the children land
 *  in SnSteps' default slot (matching real usage). */
function wrapSteps(props: Record<string, unknown>, steps: StepSpec[]) {
  return defineComponent({
    components: { SnSteps, SnStep },
    setup() {
      return () =>
        h(
          SnSteps,
          props as never,
          {
            default: () =>
              steps.map((s, i) =>
                h(
                  SnStep,
                  {
                    key: i,
                    title: s.title,
                    description: s.description,
                    status: s.status,
                    disabled: s.disabled,
                  },
                ),
              ),
          },
        )
    },
  })
}

/** Same as wrapSteps but `current` is a reactive ref so click-driven
 *  updates re-render. Returns the ref + emitted payloads. */
function wrapStepsReactive(steps: StepSpec[], initial = 1) {
  const current = ref(initial)
  const emitted: number[] = []
  const wrapper = mount(
    defineComponent({
      components: { SnSteps, SnStep },
      setup() {
        return () =>
          h(
            SnSteps,
            {
              current: current.value,
              'onUpdate:current': (v: number) => {
                emitted.push(v)
                current.value = v
              },
            } as never,
            {
              default: () =>
                steps.map((s, i) =>
                  h(SnStep, {
                    key: i,
                    title: s.title,
                    description: s.description,
                    disabled: s.disabled,
                  }),
                ),
            },
          )
      },
    }),
  )
  return { wrapper, current, emitted }
}

const THREE: StepSpec[] = [
  { title: 'Step 1', description: 'Desc 1' },
  { title: 'Step 2', description: 'Desc 2' },
  { title: 'Step 3', description: 'Desc 3' },
]

describe('SnSteps (AUI-WEB-NAV-004)', () => {
  describe('rendering', () => {
    it('renders one .sn-step per child', () => {
      const w = mount(wrapSteps({ current: 1 }, THREE))
      expect(w.findAll('.sn-step')).toHaveLength(3)
    })

    it('renders step titles and descriptions from props', () => {
      const w = mount(wrapSteps({ current: 1 }, THREE))
      const titles = w.findAll('.sn-step__content-header-title')
      const descs = w.findAll('.sn-step__content-description')
      expect(titles[0]!.text()).toBe('Step 1')
      expect(titles[2]!.text()).toBe('Step 3')
      expect(descs[1]!.text()).toBe('Desc 2')
    })

    it('renders the 1-based ordinal inside each indicator', () => {
      const w = mount(wrapSteps({ current: 1 }, THREE))
      const indexes = w.findAll('.sn-step__index')
      expect(indexes.map((n) => n.text())).toEqual(['1', '2', '3'])
    })

    it('applies the root data-snui hook and size modifier class', () => {
      const w = mount(wrapSteps({ current: 1, size: 'small' }, THREE))
      const root = w.find('.sn-steps')
      expect(root.classes()).toContain('sn-steps--small')
    })

    it('defaults size to medium', () => {
      const w = mount(wrapSteps({ current: 1 }, THREE))
      expect(w.find('.sn-steps').classes()).toContain('sn-steps--medium')
    })
  })

  describe('status derivation', () => {
    it('marks steps before `current` as finish', () => {
      const w = mount(wrapSteps({ current: 2 }, THREE))
      const steps = w.findAll('.sn-step')
      expect(steps[0]!.classes()).toContain('sn-step--finish-status')
    })

    it('marks the step at `current` as process by default', () => {
      const w = mount(wrapSteps({ current: 2 }, THREE))
      const steps = w.findAll('.sn-step')
      expect(steps[1]!.classes()).toContain('sn-step--process-status')
    })

    it('marks steps after `current` as wait', () => {
      const w = mount(wrapSteps({ current: 2 }, THREE))
      const steps = w.findAll('.sn-step')
      expect(steps[2]!.classes()).toContain('sn-step--wait-status')
    })

    it('uses the parent `status` prop for the current step', () => {
      const w = mount(wrapSteps({ current: 2, status: 'error' }, THREE))
      const steps = w.findAll('.sn-step')
      expect(steps[1]!.classes()).toContain('sn-step--error-status')
    })

    it('an explicit per-step `status` wins over derivation', () => {
      const w = mount(
        wrapSteps({ current: 1 }, [
          { title: 'A' },
          { title: 'B', status: 'error' },
        ]),
      )
      const steps = w.findAll('.sn-step')
      // index 2 > current → would be 'wait', but explicit status wins.
      expect(steps[1]!.classes()).toContain('sn-step--error-status')
    })

    it('treats all steps as process when `current` is undefined', () => {
      const w = mount(wrapSteps({}, THREE))
      const steps = w.findAll('.sn-step')
      expect(steps.every((s) => s.classes().includes('sn-step--process-status'))).toBe(
        true,
      )
      expect(w.findAll('.sn-step__index').map((n) => n.text())).toEqual([
        '1',
        '2',
        '3',
      ])
    })
  })

  describe('status icon', () => {
    it('shows an icon instead of the index on finish steps', () => {
      const w = mount(wrapSteps({ current: 3 }, THREE))
      const first = w.findAll('.sn-step')[0]!
      expect(first.findComponent(SnIcon).exists()).toBe(true)
      expect(first.find('.sn-step__index').exists()).toBe(false)
    })

    it('shows an icon instead of the index on error steps', () => {
      const w = mount(wrapSteps({ current: 2, status: 'error' }, THREE))
      const second = w.findAll('.sn-step')[1]!
      expect(second.findComponent(SnIcon).exists()).toBe(true)
      expect(second.find('.sn-step__index').exists()).toBe(false)
    })

    it('keeps the index for wait steps', () => {
      const w = mount(wrapSteps({ current: 1 }, THREE))
      const third = w.findAll('.sn-step')[2]!
      expect(third.findComponent(SnIcon).exists()).toBe(false)
      expect(third.find('.sn-step__index').text()).toBe('3')
    })

    it('renders real svgs for the finish and error glyphs', () => {
      // Regression: both glyphs were passed as `:component="…"` — not an
      // SnIcon prop — so the step circle held the `.sn-icon--missing`
      // placeholder and drew no svg. `findComponent(SnIcon)` still passed.
      const finish = mount(wrapSteps({ current: 3 }, THREE)).findAll('.sn-step')[0]!
      expectIconRendered(finish, '.sn-step__status-icon')
      expectNoMissingIcons(finish, 'SnStep finish')

      const error = mount(wrapSteps({ current: 2, status: 'error' }, THREE))
        .findAll('.sn-step')[1]!
      expectIconRendered(error, '.sn-step__status-icon')
      expectNoMissingIcons(error, 'SnStep error')
    })
  })

  describe('interaction', () => {
    it('emits update:current with the 1-based ordinal on click', async () => {
      const { wrapper, emitted } = wrapStepsReactive(THREE, 1)
      await wrapper.findAll('.sn-step')[2]!.trigger('click')
      expect(emitted).toEqual([3])
    })

    it('re-derives statuses after the parent applies the new current', async () => {
      const { wrapper, current } = wrapStepsReactive(THREE, 1)
      await wrapper.findAll('.sn-step')[2]!.trigger('click')
      await nextTick()
      expect(current.value).toBe(3)
      const steps = wrapper.findAll('.sn-step')
      expect(steps[0]!.classes()).toContain('sn-step--finish-status')
      expect(steps[1]!.classes()).toContain('sn-step--finish-status')
      expect(steps[2]!.classes()).toContain('sn-step--process-status')
    })

    it('does not emit when a disabled step is clicked', async () => {
      const { wrapper, emitted } = wrapStepsReactive(
        [{ title: 'A' }, { title: 'B', disabled: true }],
        1,
      )
      const second = wrapper.findAll('.sn-step')[1]!
      expect(second.classes()).toContain('sn-step--disabled')
      await second.trigger('click')
      expect(emitted).toEqual([])
    })

    it('marks non-disabled steps as clickable', () => {
      const w = mount(wrapSteps({ current: 1 }, THREE))
      expect(w.findAll('.sn-step')[0]!.classes()).toContain('sn-step--clickable')
    })

    it('is not clickable while `current` is undefined', () => {
      const w = mount(wrapSteps({}, THREE))
      expect(w.findAll('.sn-step')[0]!.classes()).not.toContain(
        'sn-step--clickable',
      )
    })
  })

  describe('layout modes', () => {
    it('adds the vertical modifier', () => {
      const w = mount(wrapSteps({ current: 1, vertical: true }, THREE))
      expect(w.find('.sn-steps').classes()).toContain('sn-steps--vertical')
    })

    it('adds the content-bottom modifier for horizontal + contentPlacement=bottom', () => {
      const w = mount(
        wrapSteps({ current: 1, contentPlacement: 'bottom' }, THREE),
      )
      expect(w.find('.sn-steps').classes()).toContain('sn-steps--content-bottom')
    })

    it('does not add content-bottom when vertical', () => {
      const w = mount(
        wrapSteps({ current: 1, vertical: true, contentPlacement: 'bottom' }, THREE),
      )
      const cls = w.find('.sn-steps').classes()
      expect(cls).toContain('sn-steps--vertical')
      expect(cls).not.toContain('sn-steps--content-bottom')
    })

    it('renders the line row in content-bottom mode', () => {
      const w = mount(wrapSteps({ current: 1, contentPlacement: 'bottom' }, THREE))
      expect(w.findAll('.sn-step__line')).toHaveLength(3)
    })

    it('does not render the line row in content-right mode', () => {
      const w = mount(wrapSteps({ current: 1 }, THREE))
      expect(w.findAll('.sn-step__line')).toHaveLength(0)
    })

    it('places the connector line after the title in content-right mode', () => {
      // Regression: the splitor used to sit inside the indicator row between
      // circle and title, pushing the title to the far end of the row.
      // naive-ui puts it in the content header, right after the title.
      const w = mount(wrapSteps({ current: 1 }, THREE))
      const headers = w.findAll('.sn-step__content-header')
      expect(headers[0]!.find('.sn-step__splitor').exists()).toBe(true)
      expect(
        w.find('.sn-step__indicator--row .sn-step__splitor').exists(),
      ).toBe(false)
    })

    it('places the connector line inside the line row in content-bottom mode', () => {
      const w = mount(
        wrapSteps({ current: 1, contentPlacement: 'bottom' }, THREE),
      )
      const lines = w.findAll('.sn-step__line')
      expect(lines[0]!.find('.sn-step__splitor').exists()).toBe(true)
      expect(
        w.find('.sn-step__content-header .sn-step__splitor').exists(),
      ).toBe(false)
    })

    it('keeps the connector line in the indicator column in vertical mode', () => {
      const w = mount(wrapSteps({ current: 1, vertical: true }, THREE))
      expect(w.find('.sn-step__indicator .sn-step__splitor').exists()).toBe(
        true,
      )
      expect(
        w.find('.sn-step__content-header .sn-step__splitor').exists(),
      ).toBe(false)
    })
  })

  describe('slots', () => {
    it('renders default slot content in place of the description prop', () => {
      const w = mount(
        defineComponent({
          components: { SnSteps, SnStep },
          setup() {
            return () =>
              h(SnSteps, { current: 1 } as never, {
                default: () =>
                  h(SnStep, { title: 'A' } as never, {
                    default: () => 'slot body',
                  }),
              })
          },
        }),
      )
      expect(w.find('.sn-step__content-description').text()).toBe('slot body')
    })

    it('renders the title slot in place of the title prop', () => {
      const w = mount(
        defineComponent({
          components: { SnSteps, SnStep },
          setup() {
            return () =>
              h(SnSteps, { current: 1 } as never, {
                default: () =>
                  h(SnStep, { title: 'prop title' } as never, {
                    title: () => 'slot title',
                  }),
              })
          },
        }),
      )
      expect(w.find('.sn-step__content-header-title').text()).toBe('slot title')
    })

    it('renders the icon slot in place of the auto status icon', () => {
      const w = mount(
        defineComponent({
          components: { SnSteps, SnStep },
          setup() {
            return () =>
              h(SnSteps, { current: 1 } as never, {
                default: () =>
                  h(SnStep, { title: 'A' } as never, {
                    icon: () => h('span', { class: 'custom-icon' }, '★'),
                  }),
              })
          },
        }),
      )
      expect(w.find('.custom-icon').exists()).toBe(true)
    })

    it('marks a step with no description and no slot body', () => {
      const w = mount(wrapSteps({ current: 1 }, [{ title: 'No body' }]))
      expect(w.find('.sn-step').classes()).not.toContain('sn-step--show-description')
    })

    it('marks a step that has a description', () => {
      const w = mount(wrapSteps({ current: 1 }, [{ title: 'A', description: 'd' }]))
      expect(w.find('.sn-step').classes()).toContain('sn-step--show-description')
    })
  })

  /**
   * The hover tint is a CSS-only behaviour, so jsdom cannot compute it. These
   * pin the source rule that protects the semantic status colours instead:
   * with equal specificity and the hover block authored first, an error step
   * used to flip to the primary colour on hover (reported from the docs site).
   * The guard rule must therefore name the status *and* keep a higher
   * specificity than the neutral hover tint.
   */
  describe('status colour on hover', () => {
    // Read via cwd-relative path: `import.meta.url` is not a file: URL under
    // vitest's transform pipeline, and the suite always runs from the package
    // root (`pnpm --filter @snui/vue-web test`).
    const source = readFileSync('src/steps/SnStep.vue', 'utf-8')

    /** (classes+pseudo-classes, elements) — enough to compare these rules. */
    function specificity(selector: string): number {
      const classes =
        (selector.match(/\.[\w-]+/g) || []).length +
        (selector.match(/:(?!:)[\w-]+/g) || []).length
      const elements = (selector.match(/(^|[\s>+~])[a-z][\w-]*/g) || []).length
      return classes * 100 + elements
    }

    it('keeps an error title on its semantic colour while hovered', () => {
      const guard =
        '.sn-step--clickable:hover.sn-step--error-status .sn-step__content-header-title'
      expect(source).toContain(guard)
      expect(source).toContain('color: var(--sn-web-color-feedback-danger-hover)')
    })

    it('gives the error hover guard a higher specificity than the neutral tint', () => {
      const neutral = '.sn-step--clickable:hover .sn-step__content-header-title'
      const guard =
        '.sn-step--clickable:hover.sn-step--error-status .sn-step__content-header-title'

      expect(source).toContain(neutral)
      expect(specificity(guard)).toBeGreaterThan(specificity(neutral))
    })

    it('still tints the neutral (wait / unfinished) title on hover', () => {
      // The generic tint must stay: only the semantic statuses opt out.
      expect(source).toContain('color: var(--sn-web-color-action-primary)')
      expect(source).toContain('.sn-step--clickable:hover .sn-step__content-header-title')
    })
  })

  describe('context guard', () => {
    it('throws when SnStep is used outside SnSteps', () => {
      expect(() => mount(SnStep, { props: { title: 'orphan' } })).toThrow(
        /must be placed inside SnSteps/,
      )
    })
  })
})