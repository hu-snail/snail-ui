import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SnMarquee from './SnMarquee.vue'

/**
 * SnMarquee tests — AUI-WEB-MARQUEE.
 *
 * The ticker is driven entirely by CSS (one linear infinite keyframe on the
 * track), so there is no ticker / timer / rAF to fake here. The observable
 * contract is therefore:
 *
 *   1. the rendered copy list (the slot holds ONE copy, the component
 *      duplicates it so the wrap-around seam is invisible),
 *   2. the direction / axis / pause classes, and
 *   3. the custom properties and per-copy padding that feed the animation.
 *
 * Harness notes:
 *   - `wrapper.attributes('style')` is the serialised `style` attribute;
 *     happy-dom keeps custom properties in it, which is what the duration /
 *     shift assertions read (same convention as `SnLoading.test.ts`).
 *   - Every test mounts a `default` slot: the slot is the ticker content and
 *     the component renders nothing without it.
 */

const CONTENT = '<span class="ticker-content">公告：本周五系统维护</span>'

function mountMarquee(
  props: Record<string, unknown> = {},
  content: string = CONTENT,
) {
  return mount(SnMarquee, {
    props,
    slots: { default: content },
  })
}

type MarqueeWrapper = ReturnType<typeof mountMarquee>

/** Root node carrying the `data-snui-component` hook. */
function rootOf(wrapper: MarqueeWrapper) {
  return wrapper.find('[data-snui-component="marquee"]')
}

function copiesOf(wrapper: MarqueeWrapper) {
  return wrapper.findAll('.sn-marquee__copy')
}

describe('SnMarquee', () => {
  describe('rendering', () => {
    it('should render the slot content', () => {
      const wrapper = mountMarquee()

      expect(wrapper.find('.ticker-content').exists()).toBe(true)
      expect(wrapper.text()).toContain('公告：本周五系统维护')
    })

    it('should expose the marquee root hooks', () => {
      const root = rootOf(mountMarquee())

      expect(root.exists()).toBe(true)
      expect(root.attributes('data-snui-component')).toBe('marquee')
      expect(root.attributes('role')).toBe('marquee')
      expect(root.attributes('aria-live')).toBe('off')
    })

    it('should render two copies by default, both inside the animated track', () => {
      const wrapper = mountMarquee()

      expect(copiesOf(wrapper)).toHaveLength(2)
      expect(wrapper.find('.sn-marquee__track').findAll('.sn-marquee__copy')).toHaveLength(2)
    })

    it('should render `repeat` copies with only the first announced', () => {
      const wrapper = mountMarquee({ repeat: 3 })
      const copies = copiesOf(wrapper)

      expect(copies).toHaveLength(3)
      // The extra copies only exist to hide the seam, so AT must see one copy.
      expect(copies[0].attributes('aria-hidden')).toBeUndefined()
      expect(copies[1].attributes('aria-hidden')).toBe('true')
      expect(copies[2].attributes('aria-hidden')).toBe('true')
    })

    it('should render the slot content in every copy', () => {
      const wrapper = mountMarquee({ repeat: 2 })

      expect(wrapper.findAll('.ticker-content')).toHaveLength(2)
    })

    it('should coerce repeat to an integer of at least two', () => {
      // A single copy has nothing to hand over to, and a fractional copy
      // would break the `100% / repeat` seam arithmetic.
      expect(copiesOf(mountMarquee({ repeat: 1 }))).toHaveLength(2)
      expect(copiesOf(mountMarquee({ repeat: 0 }))).toHaveLength(2)
      expect(copiesOf(mountMarquee({ repeat: -4 }))).toHaveLength(2)
      expect(copiesOf(mountMarquee({ repeat: 3.9 }))).toHaveLength(3)
      expect(copiesOf(mountMarquee({ repeat: 5 }))).toHaveLength(5)
    })
  })

  describe('direction', () => {
    it('should scroll left by default', () => {
      const root = rootOf(mountMarquee())

      expect(root.classes()).toContain('sn-marquee--left')
      expect(root.classes()).toContain('sn-marquee--horizontal')
    })

    it('should apply the direction class', () => {
      expect(rootOf(mountMarquee({ direction: 'right' })).classes()).toContain('sn-marquee--right')
      expect(rootOf(mountMarquee({ direction: 'up' })).classes()).toContain('sn-marquee--up')
      expect(rootOf(mountMarquee({ direction: 'down' })).classes()).toContain('sn-marquee--down')
    })

    it('should mark the vertical directions with the vertical axis class', () => {
      expect(rootOf(mountMarquee({ direction: 'up' })).classes()).toContain('sn-marquee--vertical')
      expect(rootOf(mountMarquee({ direction: 'down' })).classes()).toContain(
        'sn-marquee--vertical',
      )
    })

    it('should treat `vertical` as a shorthand for direction up', () => {
      const root = rootOf(mountMarquee({ vertical: true }))

      expect(root.classes()).toContain('sn-marquee--up')
      expect(root.classes()).toContain('sn-marquee--vertical')
    })

    it('should let an explicit vertical direction win over `vertical`', () => {
      expect(rootOf(mountMarquee({ vertical: true, direction: 'down' })).classes()).toContain(
        'sn-marquee--down',
      )
    })
  })

  describe('timing', () => {
    it('should expose the duration as a custom property', () => {
      const style = rootOf(mountMarquee({ duration: 20 })).attributes('style') ?? ''

      expect(style).toContain('--sn-marquee-duration')
      expect(style).toContain('20s')
    })

    it('should default the duration to 12 seconds', () => {
      const style = rootOf(mountMarquee()).attributes('style') ?? ''

      expect(style).toContain('--sn-marquee-duration')
      expect(style).toContain('12s')
    })

    it('should fall back to the default duration for a non-positive value', () => {
      // A negative `animation-duration` is invalid CSS and would silently
      // disable the ticker.
      expect(rootOf(mountMarquee({ duration: 0 })).attributes('style')).toContain('12s')
      expect(rootOf(mountMarquee({ duration: -5 })).attributes('style')).toContain('12s')
    })

    it('should shift the track by one copy box per pass', () => {
      // One pass = 100% / repeat of the track, which is what makes copy 2
      // land exactly where copy 1 started.
      const style = rootOf(mountMarquee({ repeat: 4 })).attributes('style') ?? ''

      expect(style).toContain('--sn-marquee-shift')
      expect(style).toContain('-25%')
      expect(rootOf(mountMarquee()).attributes('style')).toContain('-50%')
    })
  })

  describe('pause', () => {
    it('should not be paused while playing', () => {
      expect(rootOf(mountMarquee({ playing: true })).classes()).not.toContain('sn-marquee--paused')
    })

    it('should pause the animation when playing is false', () => {
      expect(rootOf(mountMarquee({ playing: false })).classes()).toContain('sn-marquee--paused')
    })

    it('should pause on hover by default', () => {
      expect(rootOf(mountMarquee()).classes()).toContain('sn-marquee--pause-on-hover')
    })

    it('should drop the hover-pause class when pauseOnHover is false', () => {
      expect(rootOf(mountMarquee({ pauseOnHover: false })).classes()).not.toContain(
        'sn-marquee--pause-on-hover',
      )
    })
  })

  describe('gap', () => {
    it('should treat a numeric gap as px on each copy', () => {
      const copies = copiesOf(mountMarquee({ gap: 32 }))

      expect(copies[0].attributes('style')).toContain('padding-right: 32px')
      expect(copies[1].attributes('style')).toContain('padding-right: 32px')
    })

    it('should default the gap to 24px', () => {
      expect(copiesOf(mountMarquee())[0].attributes('style')).toContain('padding-right: 24px')
    })

    it('should accept a string gap', () => {
      expect(copiesOf(mountMarquee({ gap: '2rem' }))[0].attributes('style')).toContain(
        'padding-right: 2rem',
      )
    })

    it('should keep the gap off the animated track', () => {
      // A flex `gap` on the track would collapse to a single gap at the
      // wrap-around point and re-introduce the seam.
      const wrapper = mountMarquee({ gap: 32 })

      expect(wrapper.find('.sn-marquee__track').attributes('style')).toBeUndefined()
    })

    it('should pad the bottom instead of the right for a vertical ticker', () => {
      const copy = copiesOf(mountMarquee({ vertical: true, gap: 16 }))[0]

      expect(copy.attributes('style')).toContain('padding-bottom: 16px')
      expect(copy.attributes('style')).not.toContain('padding-right')
    })
  })

  describe('box height', () => {
    it('should treat a numeric height as px', () => {
      expect(rootOf(mountMarquee({ height: 40 })).attributes('style')).toContain('height: 40px')
    })

    it('should accept a string height', () => {
      expect(rootOf(mountMarquee({ height: '12vh' })).attributes('style')).toContain(
        'height: 12vh',
      )
    })

    it('should not set a height when the prop is omitted', () => {
      expect(rootOf(mountMarquee()).attributes('style')).not.toContain('height:')
    })
  })
})