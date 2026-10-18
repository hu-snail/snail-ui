import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import SnCarousel from './SnCarousel.vue'
import SnCarouselItem from './SnCarouselItem.vue'
import {
  clampValue,
  computeAutoLastTranslate,
  computeAutoTotalView,
  computeSlideAxisSize,
  computeSlideTranslates,
  computeTotalView,
  findNearestTranslateIndex,
  getDisplayIndex,
  getDisplayTotalView,
  getNextIndex,
  getPrevIndex,
  getRealIndex,
  isDuplicatedable,
  resolveFlickDirection,
  resolveKeyboardAction,
  resolveSpeed,
  resolveWheelDirection,
} from './carousel-utils'

/** Inst surface exposed by SnCarousel (defineExpose). */
interface SnCarouselInst {
  getCurrentIndex: () => number
  to: (index: number) => void
  prev: () => void
  next: () => void
}

/** Build the carousel wrapper component (items land in the default slot). */
function wrapCarousel(props: Record<string, unknown>, slides: string[] = ['A', 'B', 'C']) {
  return defineComponent({
    components: { SnCarousel, SnCarouselItem },
    setup() {
      return () => h(
        SnCarousel,
        { style: 'width: 300px; height: 150px', ...props } as never,
        {
          default: () => slides.map((body, i) =>
            h(SnCarouselItem, { key: i }, { default: () => body })),
        },
      )
    },
  })
}

/** Same, but binds currentIndex to a reactive ref (controlled mode). */
function wrapCarouselControlled(
  props: Record<string, unknown>,
  slides: string[] = ['A', 'B', 'C'],
) {
  const current = ref<number | undefined>(0)
  return {
    current,
    component: defineComponent({
      components: { SnCarousel, SnCarouselItem },
      setup() {
        return () => h(
          SnCarousel,
          {
            style: 'width: 300px; height: 150px',
            currentIndex: current.value,
            ...props,
          } as never,
          {
            default: () => slides.map((body, i) =>
              h(SnCarouselItem, { key: i }, { default: () => body })),
          },
        )
      },
    }),
  }
}

/** Slides register with the parent in their own mounted hooks, so the
 *  dots / state classes only settle after the first flush. */
async function mountCarousel(
  props: Record<string, unknown>,
  slides: string[] = ['A', 'B', 'C'],
) {
  const w = mount(wrapCarousel(props, slides))
  await nextTick()
  return w
}

function currentSlideIndex(w: ReturnType<typeof mount>): number {
  const slides = w.findAll('.sn-carousel__slide')
  return slides.findIndex((s) => s.classes().includes('sn-carousel__slide--current'))
}

function activeDotIndex(w: ReturnType<typeof mount>): number {
  const dots = w.findAll('.sn-carousel__dot')
  return dots.findIndex((d) => d.classes().includes('sn-carousel__dot--active'))
}

describe('carousel-utils', () => {
  describe('clampValue', () => {
    it('should clamp values into the inclusive range', () => {
      expect(clampValue(-1, 0, 4)).toBe(0)
      expect(clampValue(2, 0, 4)).toBe(2)
      expect(clampValue(9, 0, 4)).toBe(4)
    })
  })

  describe('resolveSpeed', () => {
    it('should parse ms and s durations into milliseconds', () => {
      expect(resolveSpeed('300ms')).toBe(300)
      expect(resolveSpeed('1.5s')).toBe(1500)
      expect(resolveSpeed('2s')).toBe(2000)
      expect(resolveSpeed(500)).toBe(500)
      expect(resolveSpeed(undefined)).toBe(0)
      expect(resolveSpeed('fast')).toBe(0)
    })
  })

  describe('display ⇄ real index mapping', () => {
    it('should shift real indexes by one in duplicated mode', () => {
      expect(getRealIndex(0, true)).toBe(1)
      expect(getRealIndex(2, true)).toBe(3)
      expect(getRealIndex(2, false)).toBe(2)
    })

    it('should map real clone edges back to display edges', () => {
      // real list: [clone(last), 0, 1, 2, clone(first)] → length 5
      expect(getDisplayIndex(0, 5, true)).toBe(2) // clone of last
      expect(getDisplayIndex(4, 5, true)).toBe(0) // clone of first
      expect(getDisplayIndex(1, 5, true)).toBe(0)
      expect(getDisplayIndex(3, 5, true)).toBe(2)
      expect(getDisplayIndex(2, 5, false)).toBe(2)
    })

    it('should collapse to 0 when there is a single view', () => {
      expect(getDisplayIndex(0, 1, true)).toBe(0)
      expect(getDisplayIndex(3, 1, false)).toBe(0)
    })
  })

  describe('prev/next index computation', () => {
    it('should return null at the boundary when loop is off', () => {
      expect(getPrevIndex(0, 3, false)).toBe(null)
      expect(getNextIndex(2, 3, false)).toBe(null)
      expect(getPrevIndex(2, 3, false)).toBe(1)
      expect(getNextIndex(0, 3, false)).toBe(1)
    })

    it('should wrap at the boundary when loop is on', () => {
      expect(getPrevIndex(0, 5, true)).toBe(4)
      expect(getNextIndex(4, 5, true)).toBe(0)
      expect(getPrevIndex(3, 5, true)).toBe(2)
    })
  })

  describe('display total view', () => {
    it('should subtract clone slots in duplicated mode', () => {
      expect(getDisplayTotalView(5, true)).toBe(3)
      expect(getDisplayTotalView(5, false)).toBe(5)
      expect(getDisplayTotalView(3, true)).toBe(3)
    })
  })

  describe('duplicatedable', () => {
    it('should duplicate only for loop + slide effect + single view', () => {
      expect(isDuplicatedable(true, 1, 'slide')).toBe(true)
      expect(isDuplicatedable(false, 1, 'slide')).toBe(false)
      expect(isDuplicatedable(true, 2, 'slide')).toBe(false)
      expect(isDuplicatedable(true, 'auto', 'slide')).toBe(false)
      expect(isDuplicatedable(true, 1, 'fade')).toBe(false)
      expect(isDuplicatedable(true, 1, 'card')).toBe(false)
    })
  })

  describe('slides-per-view geometry', () => {
    it('should compute total views for a fixed slides-per-view', () => {
      expect(computeTotalView(6, 1)).toBe(6)
      expect(computeTotalView(6, 3)).toBe(4)
      expect(computeTotalView(2, 3)).toBe(1)
    })

    it('should split the container minus gaps evenly per view', () => {
      expect(computeSlideAxisSize(300, 3, 10)).toBeCloseTo(280 / 3)
      expect(computeSlideAxisSize(300, 1, 10)).toBe(300)
    })

    it('should compute cumulative translates with optional centering', () => {
      expect(computeSlideTranslates([100, 100, 100], 300, 0, false)).toEqual([0, 100, 200])
      expect(computeSlideTranslates([100, 100], 300, 10, false)).toEqual([0, 110])
      // centered: translate = cumulative + (slide - viewport) / 2
      expect(computeSlideTranslates([100, 100, 100], 300, 0, true)).toEqual([-100, 0, 100])
    })

    it('should count auto views by walking back until the viewport fills', () => {
      const sizes = [200, 200, 200]
      const translates = computeSlideTranslates(sizes, 300, 0, false)
      expect(computeAutoTotalView(sizes, translates, 300)).toBe(3)
      expect(computeAutoTotalView(sizes, translates, 500)).toBe(2)
    })

    it('should translate the last auto view flush with the end', () => {
      const sizes = [200, 200, 200]
      const translates = computeSlideTranslates(sizes, 300, 0, false)
      expect(computeAutoLastTranslate(sizes, translates, 300)).toBe(300)
      expect(computeAutoLastTranslate([], [], 300)).toBe(0)
    })
  })

  describe('drag release', () => {
    it('should find the nearest track position (multi-page snap)', () => {
      const translates = [0, 100, 200, 300]
      expect(findNearestTranslateIndex(translates, 140)).toBe(1)
      expect(findNearestTranslateIndex(translates, 155)).toBe(2)
      expect(findNearestTranslateIndex(translates, 260)).toBe(3)
      expect(findNearestTranslateIndex(translates, -50)).toBe(0)
    })

    it('should detect a flick past half the viewport', () => {
      expect(resolveFlickDirection(60, 100, 1000)).toBe(-1)
      expect(resolveFlickDirection(-60, 100, 1000)).toBe(1)
      expect(resolveFlickDirection(40, 100, 1000)).toBe(0)
    })

    it('should detect a fast flick even under half the viewport', () => {
      // 20px in 25ms = 0.8 px/ms > 0.4
      expect(resolveFlickDirection(20, 100, 25)).toBe(-1)
      expect(resolveFlickDirection(-20, 100, 25)).toBe(1)
      // 20px in 100ms = 0.2 px/ms — too slow
      expect(resolveFlickDirection(20, 100, 100)).toBe(0)
    })
  })

  describe('wheel direction', () => {
    it('should respond to horizontal deltas past the response step', () => {
      expect(resolveWheelDirection(15, 0, false, false)).toBe(1)
      expect(resolveWheelDirection(-15, 0, false, false)).toBe(-1)
      expect(resolveWheelDirection(5, 0, false, false)).toBe(0)
    })

    it('should map shift+vertical delta onto the horizontal axis', () => {
      expect(resolveWheelDirection(0, 15, true, false)).toBe(1)
      expect(resolveWheelDirection(0, 15, false, false)).toBe(0)
    })

    it('should respond only to vertical deltas in vertical mode', () => {
      expect(resolveWheelDirection(0, -15, false, true)).toBe(-1)
      expect(resolveWheelDirection(15, 0, false, true)).toBe(0)
    })
  })

  describe('keyboard action mapping', () => {
    it('should map arrow keys by direction', () => {
      expect(resolveKeyboardAction('ArrowRight', false)).toBe('next')
      expect(resolveKeyboardAction('ArrowLeft', false)).toBe('prev')
      expect(resolveKeyboardAction('ArrowUp', false)).toBe(null)
      expect(resolveKeyboardAction('ArrowDown', false)).toBe(null)
      expect(resolveKeyboardAction('ArrowUp', true)).toBe('next')
      expect(resolveKeyboardAction('ArrowDown', true)).toBe('prev')
      expect(resolveKeyboardAction('ArrowRight', true)).toBe(null)
    })

    it('should map PageUp/PageDown as next/prev in both directions', () => {
      expect(resolveKeyboardAction('PageUp', false)).toBe('next')
      expect(resolveKeyboardAction('PageDown', false)).toBe('prev')
      expect(resolveKeyboardAction('PageUp', true)).toBe('next')
      expect(resolveKeyboardAction('PageDown', true)).toBe('prev')
      expect(resolveKeyboardAction('Enter', false)).toBe(null)
    })
  })
})

describe('SnCarousel', () => {
  /* ─────────── rendering ─────────── */

  it('should render one slide element per item plus loop clones', async () => {
    // loop + slide + per-view 1 → duplicated: [clone(C), A, B, C, clone(A)]
    const w = await mountCarousel({})
    expect(w.findAll('.sn-carousel__slide')).toHaveLength(5)
    expect(w.findAll('.sn-carousel__slide')[0]!.text()).toBe('C')
    expect(w.findAll('.sn-carousel__slide')[4]!.text()).toBe('A')
  })

  it('should render no clones when loop is off', async () => {
    const w = await mountCarousel({ loop: false })
    expect(w.findAll('.sn-carousel__slide')).toHaveLength(3)
  })

  it('should mark the current slide with --current and aria-hidden on the rest', async () => {
    const w = await mountCarousel({})
    const slides = w.findAll('.sn-carousel__slide')
    expect(slides[1]!.classes()).toContain('sn-carousel__slide--current')
    expect(slides[1]!.attributes('aria-hidden')).toBe('false')
    expect(slides[2]!.attributes('aria-hidden')).toBe('true')
    expect(slides[1]!.attributes('role')).toBe('option')
  })

  it('should apply the effect / direction / placement modifier classes', async () => {
    const w = await mountCarousel({ effect: 'card', direction: 'vertical', dotPlacement: 'left' })
    const root = w.find('.sn-carousel')
    expect(root.classes()).toContain('sn-carousel--card')
    expect(root.classes()).toContain('sn-carousel--vertical')
    expect(root.classes()).toContain('sn-carousel--left')
  })

  it('should auto-wrap bare children into slide items', async () => {
    const w = mount(defineComponent({
      components: { SnCarousel },
      setup() {
        return () => h(SnCarousel, { loop: false, style: 'width: 300px; height: 150px' } as never, {
          default: () => [h('div', 'One'), h('div', 'Two')],
        })
      },
    }))
    await nextTick()
    const slides = w.findAll('.sn-carousel__slide')
    expect(slides).toHaveLength(2)
    expect(slides[0]!.text()).toBe('One')
  })

  it('should apply space-between as a margin on each slide', async () => {
    const w = await mountCarousel({ loop: false, spaceBetween: 10 })
    const style = w.findAll('.sn-carousel__slide')[0]!.attributes('style')
    expect(style).toContain('margin-right: 10px')
  })

  it('should merge transition-style into fade slide styles once mounted', async () => {
    const w = await mountCarousel({ loop: false, effect: 'fade' })
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await nextTick()
    const style = w.findAll('.sn-carousel__slide')[1]!.attributes('style')
    expect(style).toContain('transition-duration')
  })

  /* ─────────── dots ─────────── */

  it('should render one dot per slide with the active one marked', async () => {
    const w = await mountCarousel({ defaultIndex: 1 })
    const dots = w.findAll('.sn-carousel__dot')
    expect(dots).toHaveLength(3)
    expect(activeDotIndex(w)).toBe(1)
    expect(dots[1]!.attributes('aria-selected')).toBe('true')
    expect(dots[0]!.attributes('aria-selected')).toBe('false')
  })

  it('should not render dots for a single slide or show-dots=false', async () => {
    const single = await mountCarousel({}, ['A'])
    expect(single.find('.sn-carousel__dots').exists()).toBe(false)
    const hidden = await mountCarousel({ showDots: false })
    expect(hidden.find('.sn-carousel__dots').exists()).toBe(false)
  })

  it('should render line-shaped dots for dot-type=line', async () => {
    const w = await mountCarousel({ dotType: 'line' })
    expect(w.find('.sn-carousel__dots').classes()).toContain('sn-carousel__dots--line')
    expect(w.findAll('.sn-carousel__dot')).toHaveLength(3)
  })

  it('should jump to a slide when its dot is clicked', async () => {
    const w = await mountCarousel({})
    await w.findAll('.sn-carousel__dot')[2]!.trigger('click')
    expect(currentSlideIndex(w)).toBe(3) // real index of display 2 (duplicated)
    expect(activeDotIndex(w)).toBe(2)
  })

  it('should jump to a slide on dot hover when trigger=hover', async () => {
    const w = await mountCarousel({ trigger: 'hover' })
    await w.findAll('.sn-carousel__dot')[1]!.trigger('mouseenter')
    expect(activeDotIndex(w)).toBe(1)
  })

  it('should ignore dot hover when trigger=click (default)', async () => {
    const w = await mountCarousel({})
    await w.findAll('.sn-carousel__dot')[1]!.trigger('mouseenter')
    expect(activeDotIndex(w)).toBe(0)
  })

  /* ─────────── default-index / inst methods / events ─────────── */

  it('should start at default-index', async () => {
    const w = await mountCarousel({ defaultIndex: 2 })
    expect(activeDotIndex(w)).toBe(2)
    // real index 3 = original slide 2 (clone of C prepended shifts by 1)
    expect(currentSlideIndex(w)).toBe(3)
  })

  it('should expose to/prev/next/getCurrentIndex and emit update:current-index', async () => {
    const w = await mountCarousel({})
    const inst = w.findComponent(SnCarousel).vm as unknown as SnCarouselInst
    expect(inst.getCurrentIndex()).toBe(0)
    inst.to(2)
    await nextTick()
    expect(inst.getCurrentIndex()).toBe(2)
    expect(currentSlideIndex(w)).toBe(3)
    const emitted = w.findComponent(SnCarousel).emitted('update:currentIndex')
    expect(emitted?.at(-1)).toEqual([2, 0])
    inst.prev()
    await nextTick()
    expect(emitted?.at(-1)).toEqual([1, 2])
    inst.next()
    await nextTick()
    expect(emitted?.at(-1)).toEqual([2, 1])
  })

  it('should wrap prev/next across the ends when loop is on', async () => {
    const w = await mountCarousel({})
    const inst = w.findComponent(SnCarousel).vm as unknown as SnCarouselInst
    inst.prev()
    await nextTick()
    expect(inst.getCurrentIndex()).toBe(2)
    inst.next()
    await nextTick()
    expect(inst.getCurrentIndex()).toBe(0)
  })

  it('should not move past the ends when loop is off', async () => {
    const w = await mountCarousel({ loop: false })
    const carousel = w.findComponent(SnCarousel)
    const inst = carousel.vm as unknown as SnCarouselInst
    inst.prev()
    await nextTick()
    expect(inst.getCurrentIndex()).toBe(0)
    expect(carousel.emitted('update:currentIndex')).toBeFalsy()
    inst.next()
    inst.next()
    inst.next()
    await nextTick()
    expect(inst.getCurrentIndex()).toBe(2)
    expect(carousel.emitted('update:currentIndex')?.at(-1)).toEqual([2, 1])
  })

  it('should stay on the controlled index when the parent ignores updates', async () => {
    const { component, current } = wrapCarouselControlled({})
    const w = mount(component)
    await nextTick()
    await nextTick()
    const inst = w.findComponent(SnCarousel).vm as unknown as SnCarouselInst
    inst.next()
    await nextTick()
    // Event fired for the parent, but the controlled value did not change.
    expect(w.findComponent(SnCarousel).emitted('update:currentIndex')?.at(-1)).toEqual([1, 0])
    expect(inst.getCurrentIndex()).toBe(0)
    // Parent updates the controlled value → display follows.
    current.value = 2
    await nextTick()
    expect(inst.getCurrentIndex()).toBe(2)
    expect(currentSlideIndex(w)).toBe(3)
  })

  /* ─────────── arrows ─────────── */

  it('should render built-in arrows only with show-arrow', async () => {
    const w = await mountCarousel({ showArrow: true })
    expect(w.findAll('.sn-carousel__arrow')).toHaveLength(2)
    expect(w.find('.sn-carousel').classes()).toContain('sn-carousel--show-arrow')
    const plain = await mountCarousel({})
    expect(plain.findAll('.sn-carousel__arrow')).toHaveLength(0)
  })

  it('should switch slides when the built-in arrows are clicked', async () => {
    const w = await mountCarousel({ showArrow: true })
    const arrows = w.findAll('.sn-carousel__arrow')
    await arrows[1]!.trigger('click')
    expect(activeDotIndex(w)).toBe(1)
    await arrows[0]!.trigger('click')
    expect(activeDotIndex(w)).toBe(0)
  })

  it('should disable the boundary arrows when loop is off', async () => {
    const w = await mountCarousel({ showArrow: true, loop: false })
    const arrows = w.findAll('.sn-carousel__arrow')
    expect(arrows[0]!.classes()).toContain('sn-carousel__arrow--disabled')
    expect(arrows[1]!.classes()).not.toContain('sn-carousel__arrow--disabled')
  })

  it('should provide total/current-index/actions through the arrow slot', async () => {
    const w = mount(defineComponent({
      components: { SnCarousel, SnCarouselItem },
      setup() {
        return () => h(SnCarousel, { showArrow: true, style: 'width:300px;height:150px' } as never, {
          default: () => ['A', 'B', 'C'].map((body, i) =>
            h(SnCarouselItem, { key: i }, { default: () => body })),
          arrow: (slotProps: {
            total: number
            currentIndex: number
            next: () => void
            isNextDisabled: () => boolean
          }) =>
            h('button', {
              class: 'my-arrow-next',
              disabled: slotProps.isNextDisabled(),
              onClick: () => slotProps.next(),
            }, `next-from-${slotProps.currentIndex}-of-${slotProps.total}`),
        })
      },
    }))
    await nextTick()
    expect(w.find('.sn-carousel__arrow').exists()).toBe(false)
    expect(w.find('.my-arrow-next').text()).toBe('next-from-0-of-3')
    await w.find('.my-arrow-next').trigger('click')
    expect(w.find('.my-arrow-next').text()).toBe('next-from-1-of-3')
  })

  /* ─────────── custom dots slot ─────────── */

  it('should let the dots slot render custom dots with total/current-index/to', async () => {
    const w = mount(defineComponent({
      components: { SnCarousel, SnCarouselItem },
      setup() {
        return () => h(SnCarousel, { style: 'width:300px;height:150px' } as never, {
          default: () => ['A', 'B', 'C'].map((body, i) =>
            h(SnCarouselItem, { key: i }, { default: () => body })),
          dots: (slotProps: { total: number; currentIndex: number; to: (i: number) => void }) =>
            h('div', { class: 'my-dots' }, ['A', 'B', 'C'].map((label, i) =>
              h('button', {
                key: label,
                class: i === slotProps.currentIndex ? 'my-dot my-dot--active' : 'my-dot',
                onClick: () => slotProps.to(i),
              }, label))),
        })
      },
    }))
    await nextTick()
    expect(w.findAll('.sn-carousel__dot')).toHaveLength(0)
    const dots = w.findAll('.my-dot')
    expect(dots).toHaveLength(3)
    expect(dots[0]!.classes()).toContain('my-dot--active')
    await dots[2]!.trigger('click')
    const after = w.findAll('.my-dot')
    expect(after[2]!.classes()).toContain('my-dot--active')
    expect(currentSlideIndex(w)).toBe(3)
  })

  /* ─────────── keyboard ─────────── */

  it('should switch slides with arrow keys while a dot is focused', async () => {
    const w = await mountCarousel({ keyboard: true })
    const dots = w.findAll('.sn-carousel__dot')
    dots[0]!.element.focus()
    await dots[0]!.trigger('keydown', { code: 'ArrowRight', key: 'ArrowRight' })
    expect(activeDotIndex(w)).toBe(1)
    await dots[0]!.trigger('keydown', { code: 'ArrowLeft', key: 'ArrowLeft' })
    expect(activeDotIndex(w)).toBe(0)
  })

  it('should map vertical arrow keys in vertical direction', async () => {
    const w = await mountCarousel({ keyboard: true, direction: 'vertical' })
    const dots = w.findAll('.sn-carousel__dot')
    dots[0]!.element.focus()
    await dots[0]!.trigger('keydown', { code: 'ArrowUp', key: 'ArrowUp' })
    expect(activeDotIndex(w)).toBe(1)
    await dots[0]!.trigger('keydown', { code: 'ArrowDown', key: 'ArrowDown' })
    expect(activeDotIndex(w)).toBe(0)
  })

  it('should not switch slides from arrow keys when keyboard is off', async () => {
    const w = await mountCarousel({})
    const dots = w.findAll('.sn-carousel__dot')
    dots[0]!.element.focus()
    await dots[0]!.trigger('keydown', { code: 'ArrowRight', key: 'ArrowRight' })
    expect(activeDotIndex(w)).toBe(0)
  })

  it('should activate a dot with Enter', async () => {
    const w = await mountCarousel({})
    const dots = w.findAll('.sn-carousel__dot')
    await dots[1]!.trigger('keydown', { code: 'Enter', key: 'Enter' })
    expect(activeDotIndex(w)).toBe(1)
  })

  it('should not wrap with arrow keys when loop is off at the edge', async () => {
    const w = await mountCarousel({ keyboard: true, loop: false })
    const dots = w.findAll('.sn-carousel__dot')
    dots[0]!.element.focus()
    await dots[0]!.trigger('keydown', { code: 'ArrowLeft', key: 'ArrowLeft' })
    expect(activeDotIndex(w)).toBe(0)
  })

  /* ─────────── mousewheel ─────────── */

  it('should advance on a horizontal wheel delta past the response step', async () => {
    const w = await mountCarousel({ mousewheel: true })
    await w.find('.sn-carousel__slides').trigger('wheel', { deltaX: 15, deltaY: 0 })
    expect(activeDotIndex(w)).toBe(1)
  })

  it('should ignore small wheel deltas', async () => {
    const w = await mountCarousel({ mousewheel: true })
    await w.find('.sn-carousel__slides').trigger('wheel', { deltaX: 3, deltaY: 0 })
    expect(activeDotIndex(w)).toBe(0)
  })

  it('should ignore the wheel when mousewheel is off', async () => {
    const w = await mountCarousel({})
    await w.find('.sn-carousel__slides').trigger('wheel', { deltaX: 30, deltaY: 0 })
    expect(activeDotIndex(w)).toBe(0)
  })

  /* ─────────── autoplay ─────────── */

  it('should auto-advance on the interval, pause on hover and resume on leave', async () => {
    vi.useFakeTimers()
    try {
      const w = mount(wrapCarousel({ autoplay: true, interval: 1000 }))
      await nextTick()
      const carousel = w.findComponent(SnCarousel)
      expect(carousel.emitted('update:currentIndex')).toBeFalsy()
      vi.advanceTimersByTime(1000)
      await nextTick() // flush the realIndex watch (it restarts the timer)
      expect(carousel.emitted('update:currentIndex')?.at(-1)).toEqual([1, 0])
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(carousel.emitted('update:currentIndex')?.at(-1)).toEqual([2, 1])
      await w.find('.sn-carousel').trigger('mouseenter')
      const countAfterPause = carousel.emitted('update:currentIndex')!.length
      vi.advanceTimersByTime(3000)
      await nextTick()
      expect(carousel.emitted('update:currentIndex')!.length).toBe(countAfterPause)
      await w.find('.sn-carousel').trigger('mouseleave')
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(carousel.emitted('update:currentIndex')!.length).toBe(countAfterPause + 1)
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('should not autoplay a single slide', async () => {
    vi.useFakeTimers()
    try {
      const w = mount(wrapCarousel({ autoplay: true, interval: 1000 }, ['A']))
      await nextTick()
      vi.advanceTimersByTime(5000)
      await nextTick()
      expect(w.findComponent(SnCarousel).emitted('update:currentIndex')).toBeFalsy()
    }
    finally {
      vi.useRealTimers()
    }
  })

  /* ─────────── effects ─────────── */

  it('should mark prev/next slides in card mode', async () => {
    const w = await mountCarousel({ loop: false, effect: 'card', defaultIndex: 1 })
    const slides = w.findAll('.sn-carousel__slide')
    expect(slides[0]!.classes()).toContain('sn-carousel__slide--prev')
    expect(slides[1]!.classes()).toContain('sn-carousel__slide--current')
    expect(slides[2]!.classes()).toContain('sn-carousel__slide--next')
  })

  it('should apply prev/next-slide-style in card mode', async () => {
    const w = await mountCarousel({
      loop: false,
      effect: 'card',
      defaultIndex: 1,
      prevSlideStyle: { opacity: '0.9' },
      nextSlideStyle: 'color: red',
    })
    const slides = w.findAll('.sn-carousel__slide')
    expect(slides[0]!.attributes('style')).toContain('opacity: 0.9')
    expect(slides[2]!.attributes('style')).toContain('color: red')
  })

  it('should keep only the active slide visible in custom mode', async () => {
    const w = await mountCarousel({
      loop: false,
      effect: 'custom',
      transitionProps: { name: 'fade-up' },
    })
    expect(w.find('.sn-carousel').classes()).toContain('sn-carousel--usercontrol')
    const slides = w.findAll('.sn-carousel__slide')
    expect(slides).toHaveLength(3)
    expect(slides[0]!.element.style.display).not.toBe('none')
    expect(slides[1]!.element.style.display).toBe('none')
    // Move to slide 1 → visibility flips.
    const inst = w.findComponent(SnCarousel).vm as unknown as SnCarouselInst
    inst.next()
    await nextTick()
    expect(slides[0]!.element.style.display).toBe('none')
    expect(slides[1]!.element.style.display).not.toBe('none')
  })

  /* ─────────── slides-per-view ─────────── */

  it('should derive the dot count from slides-per-view', async () => {
    const w = await mountCarousel(
      { loop: false, slidesPerView: 2 },
      ['A', 'B', 'C', 'D', 'E'],
    )
    // 5 slides, 2 per view → 4 views → 4 dots
    expect(w.findAll('.sn-carousel__dot')).toHaveLength(4)
  })

  it('should apply space-between sizing styles when slides-per-view > 1', async () => {
    const w = await mountCarousel({ loop: false, slidesPerView: 2, spaceBetween: 4 })
    // Container is measured 0×0 in happy-dom; the width math itself is
    // asserted in the pure-function tests — here only the plumbing runs.
    const style = w.findAll('.sn-carousel__slide')[0]!.attributes('style')
    expect(style).toContain('margin-right: 4px')
  })

  /* ─────────── slide click (card navigation) ─────────── */

  it('should navigate to a clicked side slide in card mode', async () => {
    const w = await mountCarousel({ loop: false, effect: 'card' })
    await w.findAll('.sn-carousel__slide')[2]!.trigger('click')
    expect(activeDotIndex(w)).toBe(2)
  })

  /* ─────────── vertical ─────────── */

  it('should expose the vertical direction on root and container', async () => {
    const w = await mountCarousel({ direction: 'vertical' })
    expect(w.find('.sn-carousel').classes()).toContain('sn-carousel--vertical')
    // touch-action flip + column layout come from the classes (CSS).
    expect(w.find('.sn-carousel__slides').exists()).toBe(true)
  })
})
