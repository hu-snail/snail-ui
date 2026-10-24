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
import { installUniPreviewShims } from './uni-preview-shims'

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
