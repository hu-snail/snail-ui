import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import SnBreadcrumb from './SnBreadcrumb.vue'
import SnBreadcrumbItem from './SnBreadcrumbItem.vue'

/**
 * Read the component source — used for CSS contract assertions that the test
 * environment (happy-dom) cannot enforce because it does not parse scoped
 * `<style>` blocks. Pinned here so a regression that reverts the breadcrumb
 * to `display: block` (and breaks `text-align: center` centering in any
 * docs/card wrapper) fails CI before it reaches the browser.
 */
const here = dirname(fileURLToPath(import.meta.url))
const breadcrumbSource = readFileSync(resolve(here, './SnBreadcrumb.vue'), 'utf8')

/** Minimal lucide-style icon stub for tests (vue-test-utils can't pull
 *  in lucide-vue-next without pulling in 1500 modules). */
const StubIcon = defineComponent({
  name: 'StubIcon',
  props: { size: { type: Number, default: 16 } },
  setup(props) {
    return () => h('svg', { 'data-stub-icon': '', width: props.size, height: props.size })
  },
})

const renderItems = () => ({
  components: { SnBreadcrumb, SnBreadcrumbItem },
  template: `
    <SnBreadcrumb separator="/">
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/components">Components</SnBreadcrumbItem>
      <SnBreadcrumbItem>Card</SnBreadcrumbItem>
    </SnBreadcrumb>
  `,
})

describe('SnBreadcrumb (AUI-WEB-NAV-003)', () => {
  it('renders a nav with breadcrumb role', () => {
    const w = mount(SnBreadcrumb, { slots: { default: () => h(SnBreadcrumbItem, null, { default: () => 'x' }) } })
    expect(w.element.tagName).toBe('NAV')
    expect(w.attributes('aria-label')).toBe('Breadcrumb')
  })

  /* ─────────── §112 default centering ───────── */
  /*
   * Regression guard: <nav> defaults to display:block, which makes the
   * breadcrumb span the full container width and ignore parent
   * text-align:center. The .sn-breadcrumb rule pins `display: inline-flex`
   * so the most common wrapper pattern (`<div style="text-align: center">`)
   * actually centers the breadcrumb.
   *
   * happy-dom doesn't parse <style> blocks, so we assert against the source
   * string of the component — brittle to whitespace but explicit about intent.
   */
  it('pins the breadcrumb nav to display:inline-flex by default', () => {
    const rule = /\.sn-breadcrumb\s*\{[^}]*display:\s*inline-flex/m
    expect(rule.test(breadcrumbSource)).toBe(true)
  })

  it('honors a custom separator via the per-item prop', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb separator="/">
          <SnBreadcrumbItem href="/a">A</SnBreadcrumbItem>
          <SnBreadcrumbItem separator="~">B</SnBreadcrumbItem>
          <SnBreadcrumbItem>C</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    const seps = w.findAll('.sn-breadcrumb-item__separator')
    expect(seps.length).toBe(3) // every item renders its own trailing separator
    expect(seps[0]!.text()).toBe('/')
    expect(seps[1]!.text()).toBe('~')
  })

  it('uses the parent separator as the default for every item', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb separator="›">
          <SnBreadcrumbItem>A</SnBreadcrumbItem>
          <SnBreadcrumbItem>B</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    const seps = w.findAll('.sn-breadcrumb-item__separator')
    expect(seps.length).toBe(2)
    expect(seps[0]!.text()).toBe('›')
    expect(seps[1]!.text()).toBe('›')
  })

  it('renders one <li> per SnBreadcrumbItem child', () => {
    const w = mount(renderItems())
    expect(w.findAll('.sn-breadcrumb-item').length).toBe(3)
  })

  it('renders SnBreadcrumbItem as <a> when href is provided', () => {
    const w = mount(renderItems())
    const anchors = w.findAll('.sn-breadcrumb-item a')
    expect(anchors.length).toBe(2)
    expect(anchors[0]!.attributes('href')).toBe('/')
  })

  it('renders SnBreadcrumbItem as <span> when no href', () => {
    const w = mount(renderItems())
    const lastLi = w.findAll('.sn-breadcrumb-item').at(-1)!
    expect(lastLi.find('a').exists()).toBe(false)
    expect(lastLi.find('span.sn-breadcrumb-item__link').exists()).toBe(true)
  })

  /* ─────────── §112 expansion: per-item override + showSeparator + clickable ───────── */

  it('clickable=false drops the clickable class', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem :clickable="false">A</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    const li = w.find('.sn-breadcrumb-item')
    expect(li.classes()).not.toContain('sn-breadcrumb-item--clickable')
    expect(li.classes()).toContain('sn-breadcrumb-item--disabled')
  })

  it('showSeparator=false omits the trailing separator span', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem :show-separator="false">A</SnBreadcrumbItem>
          <SnBreadcrumbItem>B</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    const seps = w.findAll('.sn-breadcrumb-item__separator')
    expect(seps.length).toBe(1)
  })

  it('separator slot overrides the prop and parent', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb separator="/">
          <SnBreadcrumbItem>
            A
            <template #separator><svg data-stub-sep /></template>
          </SnBreadcrumbItem>
          <SnBreadcrumbItem>B</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    const firstSep = w.findAll('.sn-breadcrumb-item__separator')[0]!
    expect(firstSep.find('[data-stub-sep]').exists()).toBe(true)
    // No text fallback when slot renders.
    expect(firstSep.text()).toBe('')
  })

  it('invokes onClick handler when the link is clicked', async () => {
    const onClick = vi.fn()
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem href="/" @click="onClick">Home</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
      setup() {
        return { onClick }
      },
    })
    await w.find('.sn-breadcrumb-item a').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  /* ─────────── §112 expansion: icon support ───────── */

  it('renders an icon SnIcon before the slot content', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem, StubIcon },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem :icon="StubIcon">Home</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
      setup() {
        return { StubIcon }
      },
    })
    const icon = w.find('.sn-breadcrumb-item .sn-icon')
    expect(icon.exists()).toBe(true)
    // Icon must come before the label text inside the link wrapper.
    // Use li (not tag-specific) because SnBreadcrumbItem renders <span>
    // when no href is given.
    const li = w.find('.sn-breadcrumb-item')
    const link = li.element.querySelector('.sn-breadcrumb-item__link')!
    expect(link.firstElementChild!.classList.contains('sn-icon')).toBe(true)
    // Slot text is the next sibling after the SnIcon wrapper.
    expect(link.textContent).toContain('Home')
  })

  /* ─────────── §112 expansion: maxCount truncation ───────── */

  it('maxCount caps visible items to head(1) + ellipsis + tail(max-1)', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb :max-count="3">
          <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
          <SnBreadcrumbItem href="/a">A</SnBreadcrumbItem>
          <SnBreadcrumbItem href="/b">B</SnBreadcrumbItem>
          <SnBreadcrumbItem href="/c">C</SnBreadcrumbItem>
          <SnBreadcrumbItem href="/d">D</SnBreadcrumbItem>
          <SnBreadcrumbItem>News</SnBreadcrumbItem>
          <SnBreadcrumbItem>Post</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    // head(1) + ellipsis(1) + tail(2) = 4 list items
    expect(w.findAll('.sn-breadcrumb-item').length).toBe(4)
    expect(w.find('.sn-breadcrumb-item--ellipsis').exists()).toBe(true)
    expect(w.find('.sn-breadcrumb-item__link--ellipsis').text()).toBe('…')
  })

  it('maxCount=4 keeps head(1) + ellipsis + tail(3) for a 6-item trail', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb :max-count="4">
          <SnBreadcrumbItem>A</SnBreadcrumbItem>
          <SnBreadcrumbItem>B</SnBreadcrumbItem>
          <SnBreadcrumbItem>C</SnBreadcrumbItem>
          <SnBreadcrumbItem>D</SnBreadcrumbItem>
          <SnBreadcrumbItem>E</SnBreadcrumbItem>
          <SnBreadcrumbItem>F</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    // head(1) + ellipsis(1) + tail(3) = 5 list items
    expect(w.findAll('.sn-breadcrumb-item').length).toBe(5)
    expect(w.find('.sn-breadcrumb-item--ellipsis').exists()).toBe(true)
    expect(w.find('.sn-breadcrumb-item__link--ellipsis').text()).toBe('…')
  })

  it('maxCount above total renders all items, no ellipsis', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb :max-count="99">
          <SnBreadcrumbItem>A</SnBreadcrumbItem>
          <SnBreadcrumbItem>B</SnBreadcrumbItem>
          <SnBreadcrumbItem>C</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    expect(w.findAll('.sn-breadcrumb-item').length).toBe(3)
    expect(w.find('.sn-breadcrumb-item--ellipsis').exists()).toBe(false)
  })

  it('maxCount=Infinity (default) renders all items', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem>A</SnBreadcrumbItem>
          <SnBreadcrumbItem>B</SnBreadcrumbItem>
          <SnBreadcrumbItem>C</SnBreadcrumbItem>
          <SnBreadcrumbItem>D</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    expect(w.findAll('.sn-breadcrumb-item').length).toBe(4)
    expect(w.find('.sn-breadcrumb-item--ellipsis').exists()).toBe(false)
  })

  /* ─────────── §112 expansion: variant (AUI extension) ───────── */

  it('variant=chip adds the chip modifier class on the link', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem variant="chip">A</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    const link = w.find('.sn-breadcrumb-item a, .sn-breadcrumb-item span.sn-breadcrumb-item__link')
    expect(link.classes()).toContain('sn-breadcrumb-item__link--chip')
  })

  it('variant=outlined adds the outlined modifier class', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem variant="outlined">A</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    const link = w.find('.sn-breadcrumb-item a, .sn-breadcrumb-item span.sn-breadcrumb-item__link')
    expect(link.classes()).toContain('sn-breadcrumb-item__link--outlined')
  })

  it('variant defaults to plain (no modifier class)', () => {
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem>A</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
    })
    const link = w.find('.sn-breadcrumb-item a, .sn-breadcrumb-item span.sn-breadcrumb-item__link')
    expect(link.classes()).not.toContain('sn-breadcrumb-item__link--chip')
    expect(link.classes()).not.toContain('sn-breadcrumb-item__link--outlined')
  })

  it('variant=chip + aria-current renders chip with primary fill', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: 'http://localhost:3000/x' },
    })
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem variant="chip" href="/x">Current</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
      attachTo: document.body,
    })
    await new Promise((r) => setTimeout(r, 0))
    const link = w.find('.sn-breadcrumb-item .sn-breadcrumb-item__link')
    expect(link.classes()).toContain('sn-breadcrumb-item__link--chip')
    expect(link.attributes('aria-current')).toBe('location')
  })

  /* ─────────── §112 expansion: aria-current ───────── */

  it('marks aria-current="location" when window.location.href matches href', async () => {
    // happy-dom provides window.location; mount an item with the same path.
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: 'http://localhost:3000/components/breadcrumb' },
    })
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem href="/components/breadcrumb">Breadcrumb</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
      attachTo: document.body,
    })
    await new Promise((r) => setTimeout(r, 0))
    const link = w.find('.sn-breadcrumb-item a')
    expect(link.attributes('aria-current')).toBe('location')
  })

  it('does NOT mark aria-current when paths differ', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: 'http://localhost:3000/other' },
    })
    const w = mount({
      components: { SnBreadcrumb, SnBreadcrumbItem },
      template: `
        <SnBreadcrumb>
          <SnBreadcrumbItem href="/components/breadcrumb">Breadcrumb</SnBreadcrumbItem>
        </SnBreadcrumb>
      `,
      attachTo: document.body,
    })
    await new Promise((r) => setTimeout(r, 0))
    const link = w.find('.sn-breadcrumb-item a')
    expect(link.attributes('aria-current')).toBeUndefined()
  })
})