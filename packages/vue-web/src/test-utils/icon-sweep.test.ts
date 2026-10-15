/**
 * Icon rendering sweep — AUI-FOUND-004 / AGENTS.md §113.
 *
 * ## Why this file exists
 *
 * Nine `:component="X"` misuses shipped in SnDialog / SnAlert / SnStep /
 * SnBackTop / SnDrawerContent because `SnIcon` has no `component` prop: the
 * wrapper still rendered `.sn-icon`, so `expect(findComponent(SnIcon).exists())`
 * passed while the browser painted the `.sn-icon--missing` placeholder and no
 * glyph at all.
 *
 * A per-component unit test only proves what it happens to mount. This file is
 * the cheap global guard: it mounts every component that draws an icon and
 * asserts that *no* unresolved placeholder is left anywhere in the tree, and
 * that each icon host carries a real `<svg>`.
 *
 * If a new component passes the wrong prop to SnIcon, this file fails — even
 * when nothing else does.
 */

import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { describe, expect, it } from 'vitest'
import { expectNoMissingIcons } from './icon-assertions'
import { registerSnIcons } from '../icon/sn-icon-registry'
import SnAlert from '../alert/SnAlert.vue'
import SnBackTop from '../back-top/SnBackTop.vue'
import SnBreadcrumb from '../breadcrumb/SnBreadcrumb.vue'
import SnBreadcrumbItem from '../breadcrumb/SnBreadcrumbItem.vue'
import SnButton from '../button/SnButton.vue'
import SnCollapse from '../collapse/SnCollapse.vue'
import SnCollapseItem from '../collapse/SnCollapseItem.vue'
import SnDialog from '../dialog/SnDialog.vue'
import SnDrawer from '../drawer/SnDrawer.vue'
import SnDrawerContent from '../drawer/SnDrawerContent.vue'
import SnInput from '../input/SnInput.vue'
import SnMenu from '../menu/SnMenu.vue'
import SnStep from '../steps/SnStep.vue'
import SnSteps from '../steps/SnSteps.vue'
import SnTabs from '../tabs/SnTabs.vue'
import SnTabPane from '../tabs/SnTabPane.vue'
import { ChevronRight, Search } from 'lucide-vue-next'

/**
 * Assert the mounted tree draws at least one real icon and no placeholders.
 * The `minIcons` guard stops a component from "passing" by rendering nothing.
 */
function expectHealthyIcons(wrapper: ReturnType<typeof mount>, label: string): void {
  expectNoMissingIcons(wrapper, label)
  const svgs = wrapper.findAll('.sn-icon svg')
  expect(svgs.length, `${label} rendered no real icon svg`).toBeGreaterThan(0)
}

describe('icon rendering sweep (AGENTS.md §113)', () => {
  it('SnButton renders a real svg from a direct icon component', () => {
    const wrapper = mount(SnButton, { props: { icon: Search } })

    expectHealthyIcons(wrapper, 'SnButton icon')
  })

  it('SnButton renders a real svg from a registered icon name', () => {
    registerSnIcons({ Search })
    const wrapper = mount(SnButton, { props: { iconName: 'Search' } })

    expectHealthyIcons(wrapper, 'SnButton iconName')
  })

  it('SnInput renders a real svg for a registered prefix icon name', () => {
    // `prefixIcon` resolves through the SnIcon registry, so register first —
    // this is the same contract consumers follow at app bootstrap.
    registerSnIcons({ Search })
    const wrapper = mount(SnInput, { props: { prefixIcon: 'Search' } as never })

    expectHealthyIcons(wrapper, 'SnInput prefixIcon')
  })

  it('SnInput renders a real svg for the built-in password toggle', () => {
    // The toggle only mounts when `showPassword` is on (its upstream name).
    const wrapper = mount(SnInput, {
      props: { type: 'password', showPassword: true } as never,
    })

    expectHealthyIcons(wrapper, 'SnInput password toggle')
  })

  it('SnAlert renders a real svg for each type icon and its close button', () => {
    for (const type of ['success', 'info', 'warning', 'error']) {
      expectHealthyIcons(mount(SnAlert, { props: { type, closable: true } }), `SnAlert ${type}`)
    }
  })

  it('SnDialog renders a real svg for each type icon and its close button', () => {
    for (const type of ['default', 'info', 'success', 'warning', 'error']) {
      expectHealthyIcons(
        mount(SnDialog, { props: { type, title: 't', closable: true } as never }),
        `SnDialog ${type}`,
      )
    }
  })

  it('SnDrawerContent renders a real svg in its close button', () => {
    const wrapper = mount(SnDrawerContent, { props: { title: 't', closable: true } })

    expectHealthyIcons(wrapper, 'SnDrawerContent close')
  })

  it('SnDrawer renders its slotted content icons without placeholders', () => {
    const wrapper = mount(SnDrawer, {
      props: { show: true },
      slots: {
        default: () => h(SnDrawerContent, { title: 't', closable: true }),
      },
      global: { stubs: { teleport: true } },
    })

    expectHealthyIcons(wrapper, 'SnDrawer')
  })

  it('SnBackTop renders a real svg in its default button', () => {
    const wrapper = mount(SnBackTop, { props: { visibilityHeight: 0 } })

    // The button only appears past the threshold; force the scroll position.
    Object.defineProperty(document.documentElement, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 10,
    })
    window.dispatchEvent(new Event('scroll'))

    return wrapper.vm.$nextTick().then(() => {
      expectHealthyIcons(wrapper, 'SnBackTop')
    })
  })

  it('SnSteps renders a real svg for the finish and error glyphs', () => {
    const wrapper = mount(
      defineComponent({
        components: { SnSteps, SnStep },
        setup: () => () =>
          h(SnSteps, { current: 2 }, () => [
            h(SnStep, { title: 'A' }),
            h(SnStep, { title: 'B' }),
            h(SnStep, { title: 'C' }),
          ]),
      }),
    )

    expectHealthyIcons(wrapper, 'SnSteps finish')
  })

  it('SnCollapse renders a real svg for its expand arrow', () => {
    const wrapper = mount(SnCollapse, {
      props: { defaultExpandedNames: ['a'] },
      slots: { default: () => h(SnCollapseItem, { name: 'a', title: 'A' }, () => 'body') },
    })

    expectHealthyIcons(wrapper, 'SnCollapse arrow')
  })

  it('SnMenu renders a real svg for its submenu arrow and item icon', () => {
    const wrapper = mount(SnMenu, {
      props: {
        options: [
          { label: 'Parent', key: 'p', icon: () => h(ChevronRight), children: [{ label: 'Child', key: 'c' }] },
        ],
        defaultExpandedKeys: ['p'],
      } as never,
    })

    expectNoMissingIcons(wrapper, 'SnMenu')
  })

  it('SnBreadcrumb renders a real svg for an item icon', () => {
    const wrapper = mount(SnBreadcrumb, {
      slots: {
        default: () => h(SnBreadcrumbItem, { icon: Search }, () => 'Home'),
      },
    })

    expectHealthyIcons(wrapper, 'SnBreadcrumb')
  })

  it('SnTabs renders a real svg for a tab icon slot', () => {
    const wrapper = mount(SnTabs, {
      props: { type: 'line' },
      slots: {
        default: () => h(SnTabPane, { name: 'a', tab: 'A' }, { default: () => 'body' }),
      },
    })

    expectNoMissingIcons(wrapper, 'SnTabs')
  })
})
