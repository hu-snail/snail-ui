// @vitest-environment happy-dom
/**
 * Tap-bridge regression tests.
 *
 * These lock the behaviour the docs preview depends on: uni components bind
 * `@tap`, and the browser only ever emits `click`. If the shim stops
 * dispatching `tap`, every interactive uni demo silently goes inert again —
 * exactly the bug this suite was written for.
 */
import { afterEach, describe, expect, it } from 'vitest'
import {
  convertInlineRpx,
  installStyleRpxBridge,
  installUniApiPolyfill,
  installUniPreviewShims,
} from './uni-preview-shims'

let dispose: (() => void) | null = null

afterEach(() => {
  dispose?.()
  dispose = null
  document.body.innerHTML = ''
})

/** Mount a preview surface with a nested target, as a real demo renders it. */
function mountPreview(): { surface: HTMLElement; target: HTMLElement } {
  document.body.innerHTML = `
    <div class="sn-phone__screen">
      <div class="sn-demo">
        <button id="target" hover-class="is-pressed" hover-stay-time="0">点我</button>
      </div>
    </div>
  `
  const surface = document.querySelector('.sn-phone__screen') as HTMLElement
  const target = document.querySelector('#target') as HTMLElement
  return { surface, target }
}

describe('installUniPreviewShims', () => {
  describe('tap dispatch', () => {
    it('should dispatch tap when a click lands inside a preview surface', () => {
      dispose = installUniPreviewShims()
      const { target } = mountPreview()
      const seen: string[] = []
      target.addEventListener('tap', () => seen.push('tap'))

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(seen).toEqual(['tap'])
    })

    it('should bubble tap so an ancestor @tap handler still fires', () => {
      dispose = installUniPreviewShims()
      const { target } = mountPreview()
      const host = target.parentElement as HTMLElement
      let count = 0
      host.addEventListener('tap', () => {
        count += 1
      })

      target.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(count).toBe(1)
    })

    it('should not dispatch tap for clicks outside a preview surface', () => {
      dispose = installUniPreviewShims()
      document.body.innerHTML = '<button id="outside">outside</button>'
      const outside = document.querySelector('#outside') as HTMLElement
      let fired = false
      outside.addEventListener('tap', () => {
        fired = true
      })

      outside.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(fired).toBe(false)
    })

    it('should stop dispatching after dispose', () => {
      const off = installUniPreviewShims()
      const { target } = mountPreview()
      let fired = false
      target.addEventListener('tap', () => {
        fired = true
      })

      off()
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(fired).toBe(false)
    })

    it('should carry the source and coordinates in the event detail', () => {
      dispose = installUniPreviewShims()
      const { target } = mountPreview()
      let detail: unknown = null
      target.addEventListener('tap', (event) => {
        detail = (event as CustomEvent).detail
      })

      target.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 12, clientY: 34 }))

      expect(detail).toMatchObject({ source: 'click', x: 12, y: 34 })
    })
  })

  describe('hover-class press feedback', () => {
    it('should apply hover-class on pointerdown and drop it on pointerup', async () => {
      dispose = installUniPreviewShims()
      const { target } = mountPreview()

      target.dispatchEvent(new Event('pointerdown', { bubbles: true }))
      expect(target.classList.contains('is-pressed')).toBe(true)

      target.dispatchEvent(new Event('pointerup', { bubbles: true }))
      // hover-stay-time="0" → removal is deferred one macrotask.
      await new Promise((resolve) => setTimeout(resolve, 5))
      expect(target.classList.contains('is-pressed')).toBe(false)
    })

    it('should ignore hover-class="none"', () => {
      dispose = installUniPreviewShims()
      document.body.innerHTML = `
        <div class="sn-demo">
          <button id="t" hover-class="none">x</button>
        </div>
      `
      const t = document.querySelector('#t') as HTMLElement

      t.dispatchEvent(new Event('pointerdown', { bubbles: true }))

      expect(t.className).toBe('')
    })
  })
})

describe('hover-stop-propagation', () => {
  /** Outer pressed cell wrapping an inner pressed button. */
  function mountNested(innerStop: boolean): { outer: HTMLElement; inner: HTMLElement } {
    document.body.innerHTML = `
      <div class="sn-demo">
        <div id="outer" hover-class="outer-pressed">
          <button id="inner" hover-class="inner-pressed"${
            innerStop ? ' hover-stop-propagation="true"' : ''
          }>inner</button>
        </div>
      </div>
    `
    return {
      outer: document.querySelector('#outer') as HTMLElement,
      inner: document.querySelector('#inner') as HTMLElement,
    }
  }

  it('should light up every ancestor with hover-class by default', () => {
    dispose = installUniPreviewShims()
    const { outer, inner } = mountNested(false)

    inner.dispatchEvent(new Event('pointerdown', { bubbles: true }))

    expect(inner.classList.contains('inner-pressed')).toBe(true)
    expect(outer.classList.contains('outer-pressed')).toBe(true)
  })

  it('should stop the press state at the node that sets hover-stop-propagation', () => {
    dispose = installUniPreviewShims()
    const { outer, inner } = mountNested(true)

    inner.dispatchEvent(new Event('pointerdown', { bubbles: true }))

    // The flagging node still lights up; its ancestors do not.
    expect(inner.classList.contains('inner-pressed')).toBe(true)
    expect(outer.classList.contains('outer-pressed')).toBe(false)
  })
})

/**
 * Inline rpx conversion.
 *
 * uni components compute inline styles with rpx; the browser drops every
 * declaration whose value carries an unknown unit, which collapsed the circle
 * rings, picker columns, cropper frame and swiper track in the preview. The
 * shim rewrites those tokens at the DOM boundary, mirroring the uni H5
 * runtime.
 */
describe('inline rpx conversion', () => {
  it('should convert rpx tokens in an inline style to px', () => {
    expect(convertInlineRpx('--sn-circle-size: 120rpx; --sn-circle-width: 18rpx')).toBe(
      '--sn-circle-size: 60px; --sn-circle-width: 9px',
    )
  })

  it('should convert negative and fractional values', () => {
    expect(convertInlineRpx('margin-left: -20rpx; top: 1.5rpx')).toBe(
      'margin-left: -10px; top: 0.75px',
    )
  })

  it('should leave non-rpx declarations untouched', () => {
    expect(convertInlineRpx('width: 40%; left: 12px')).toBe('width: 40%; left: 12px')
  })

  it('should convert existing inline styles on install', () => {
    document.body.innerHTML = '<div class="sn-demo"><view style="height: 264rpx"></view></div>'
    dispose = installUniPreviewShims()

    const node = document.querySelector('view')
    expect(node?.getAttribute('style')).toBe('height: 132px')
  })

  it('should convert inline styles written after install', async () => {
    document.body.innerHTML = '<div class="sn-demo"><view id="target"></view></div>'
    dispose = installUniPreviewShims()
    const node = document.getElementById('target')

    node?.setAttribute('style', 'transform: translateY(88rpx)')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(node?.getAttribute('style')).toBe('transform: translateY(44px)')
  })
})

/**
 * Style-object rpx bridge.
 *
 * Vue's object-form style binding writes `el.style.width = '64rpx'`; the browser
 * drops the value silently, so the element collapses (the toast check icon
 * rendered at the SVG's intrinsic 300×150 instead of 32px). The bridge converts
 * the value on the way in.
 */
describe('style object rpx bridge', () => {
  it('should convert rpx assigned through the style object', () => {
    installStyleRpxBridge()
    const node = document.createElement('view')

    node.style.width = '64rpx'
    node.style.height = '120rpx'

    expect(node.style.width).toBe('32px')
    expect(node.style.height).toBe('60px')
  })

  it('should convert rpx passed to setProperty (custom properties)', () => {
    installStyleRpxBridge()
    const node = document.createElement('view')

    node.style.setProperty('--sn-circle-size', '120rpx')

    expect(node.style.getPropertyValue('--sn-circle-size')).toBe('60px')
  })

  it('should leave px and percentage values untouched', () => {
    installStyleRpxBridge()
    const node = document.createElement('view')

    node.style.width = '40px'
    node.style.left = '25%'

    expect(node.style.width).toBe('40px')
    expect(node.style.left).toBe('25%')
  })
})

/**
 * Mouse → touch bridge.
 *
 * Every gesture component listens to touch events only, so a desktop mouse
 * produced nothing: sliders would not drag, picker rollers would not turn,
 * slide-verify could not be swiped and the signature pad stayed blank.
 */
describe('mouse to touch bridge', () => {
  it('should dispatch touchstart / touchmove / touchend from a mouse drag', () => {
    document.body.innerHTML = '<div class="sn-demo"><view id="track"></view></div>'
    dispose = installUniPreviewShims()
    const track = document.getElementById('track')
    const seen: string[] = []
    for (const type of ['touchstart', 'touchmove', 'touchend']) {
      track?.addEventListener(type, () => seen.push(type))
    }

    track?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 20 }))
    document.body.dispatchEvent(
      new MouseEvent('mousemove', { bubbles: true, clientX: 40, clientY: 20 }),
    )
    document.body.dispatchEvent(
      new MouseEvent('mouseup', { bubbles: true, clientX: 40, clientY: 20 }),
    )

    expect(seen).toEqual(['touchstart', 'touchmove', 'touchend'])
  })

  it('should carry the pointer coordinates on the synthetic touch', () => {
    document.body.innerHTML = '<div class="sn-demo"><view id="track"></view></div>'
    dispose = installUniPreviewShims()
    const track = document.getElementById('track')
    let clientX = -1
    track?.addEventListener('touchstart', (event) => {
      const touch = (event as TouchEvent).touches?.[0]
      clientX = touch?.clientX ?? -1
    })

    track?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 42, clientY: 20 }))

    expect(clientX).toBe(42)
  })

  it('should not bridge drags that start outside a preview surface', () => {
    document.body.innerHTML = '<div class="outside"><view id="track"></view></div>'
    dispose = installUniPreviewShims()
    const track = document.getElementById('track')
    let fired = false
    track?.addEventListener('touchstart', () => {
      fired = true
    })

    track?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 20 }))

    expect(fired).toBe(false)
  })
})

/**
 * Tap slop.
 *
 * A drag that ends on an element must not also count as a tap, otherwise
 * releasing a picker roller selects whatever sits under the pointer and a
 * slider throw re-seats the knob.
 */
describe('tap slop', () => {
  it('should not dispatch tap when the gesture moved beyond the slop', () => {
    document.body.innerHTML = '<div class="sn-demo"><view id="track"></view></div>'
    dispose = installUniPreviewShims()
    const track = document.getElementById('track')
    let taps = 0
    track?.addEventListener('tap', () => {
      taps += 1
    })

    track?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 20 }))
    document.body.dispatchEvent(
      new MouseEvent('mousemove', { bubbles: true, clientX: 120, clientY: 20 }),
    )
    document.body.dispatchEvent(
      new MouseEvent('mouseup', { bubbles: true, clientX: 120, clientY: 20 }),
    )

    expect(taps).toBe(0)
  })

  it('should dispatch tap when the gesture stayed put', () => {
    document.body.innerHTML = '<div class="sn-demo"><view id="track"></view></div>'
    dispose = installUniPreviewShims()
    const track = document.getElementById('track')
    let taps = 0
    track?.addEventListener('tap', () => {
      taps += 1
    })

    track?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 20 }))
    document.body.dispatchEvent(
      new MouseEvent('mouseup', { bubbles: true, clientX: 12, clientY: 21 }),
    )

    expect(taps).toBe(1)
  })
})

/**
 * `uni` API polyfill.
 *
 * The components read `uni.createSelectorQuery` / `uni.getSystemInfoSync`;
 * without the polyfill those paths silently degrade (selector-mode preview
 * hit zones, floating-panel sizing).
 */
interface SelectorQueryStub {
  selectAll: (selector: string) => {
    boundingClientRect: (callback: (rects: Array<{ width: number }>) => void) => unknown
  }
  exec: () => void
}

describe('uni api polyfill', () => {
  it('should expose createSelectorQuery that measures DOM boxes', () => {
    document.body.innerHTML =
      '<div class="sn-demo"><view class="thumb" style="width: 40px; height: 20px"></view></div>'
    installUniApiPolyfill()

    let measured: Array<{ width: number }> = []
    const host = globalThis as { uni?: { createSelectorQuery: () => SelectorQueryStub } }
    const query = host.uni?.createSelectorQuery()
    query.selectAll('.thumb').boundingClientRect((rects: Array<{ width: number }>) => {
      measured = rects
    })
    query.exec()

    expect(measured).toHaveLength(1)
  })

  it('should not overwrite members a real host already provides', () => {
    const marker = (): string => 'host'
    const host = globalThis as { uni?: Record<string, unknown> }
    host.uni = { getSystemInfoSync: marker }

    installUniApiPolyfill()

    expect((host.uni?.getSystemInfoSync as () => string)()).toBe('host')
    delete host.uni
  })
})
