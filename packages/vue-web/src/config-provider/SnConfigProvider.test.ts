import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import SnConfigProvider from './SnConfigProvider.vue'

describe('SnConfigProvider', () => {
  beforeEach(() => {
    // reset body classes
    document.body.className = ''
  })
  afterEach(() => {
    document.body.className = ''
  })

  function mountWith(skin: string | undefined) {
    const Probe = defineComponent({
      setup() {
        return () => h('div', { class: 'probe' }, 'probe')
      },
    })
    return mount(SnConfigProvider, {
      props: skin === undefined ? {} : { skin },
      slots: { default: () => h(Probe) },
    })
  }

  it('renders default slot', () => {
    const wrapper = mountWith(undefined)
    expect(wrapper.find('.probe').exists()).toBe(true)
  })

  it('does not add skin class for empty skin prop', () => {
    mountWith('')
    expect(document.body.className).not.toMatch(/snui-skin-/)
  })

  it('does not add skin class for "default"', () => {
    mountWith('default')
    expect(document.body.className).not.toMatch(/snui-skin-/)
  })

  it('adds snui-skin-{name} class for non-default skin', async () => {
    const wrapper = mountWith('doodle')
    // immediate watch fires synchronously in setup; class is applied
    expect(document.body.classList.contains('snui-skin-doodle')).toBe(true)
    wrapper.unmount()
  })

  it('removes previous skin class when skin changes', async () => {
    const wrapper = mountWith('doodle')
    expect(document.body.classList.contains('snui-skin-doodle')).toBe(true)
    await wrapper.setProps({ skin: 'ios' })
    expect(document.body.classList.contains('snui-skin-doodle')).toBe(false)
    expect(document.body.classList.contains('snui-skin-ios')).toBe(true)
    wrapper.unmount()
  })

  it('removes skin class on unmount', () => {
    const wrapper = mountWith('doodle')
    expect(document.body.classList.contains('snui-skin-doodle')).toBe(true)
    wrapper.unmount()
    expect(document.body.classList.contains('snui-skin-doodle')).toBe(false)
  })
})