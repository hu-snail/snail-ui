/**
 * SnAiAssistant behaviour tests — AUI-TPL-007.
 *
 * The unified template's contract is composition, so this suite pins what it
 * adds on top of the chat page rather than re-testing scheduling:
 *
 *   - undeclared props / listeners fall through to the conversation page
 *   - the model-config entry point appears by default and can be turned off
 *   - opening it mounts the model-config panel, and the open state is reported
 *   - the panel's own events are re-emitted so a host can own the state
 */

import { describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import SnAiAssistant from './SnAiAssistant.vue'
import type { SnAiMessage, SnAiModelParams, SnAiVendor } from '../shared/types'

const vendors: SnAiVendor[] = [
  {
    id: 'v-local',
    name: '本地服务',
    models: [{ id: 'm-deep', name: 'Deep', vendorId: 'v-local' }],
  },
]

interface AssistantOptions {
  showModelConfig?: boolean
  modelConfigOpen?: boolean | undefined
  title?: string
  params?: SnAiModelParams | undefined
}

/** Teleport is stubbed so the drawer's panel renders inline and is findable. */
function mountAssistant(options: AssistantOptions = {}): VueWrapper {
  return mount(SnAiAssistant, {
    props: { messages: [] as SnAiMessage[], vendors, ...options },
    global: { stubs: { teleport: true } },
  })
}

/** The header's model-config entry point, or undefined when it is off. */
function triggerOf(wrapper: VueWrapper) {
  return wrapper
    .findAll('button')
    .find((button) => button.attributes('aria-label') === '模型配置')
}

describe('SnAiAssistant', () => {
  describe('composition', () => {
    it('should forward undeclared props to the conversation page', () => {
      const wrapper = mountAssistant({ title: '代码助手' })

      expect(wrapper.find('.sn-ai-chat__title').text()).toBe('代码助手')
    })

    it('should render the chat page and the model-config panel as one template', async () => {
      const wrapper = mountAssistant()
      const trigger = triggerOf(wrapper)
      expect(trigger).toBeDefined()

      await trigger?.trigger('click')

      expect(wrapper.findComponent({ name: 'SnModelConfig' }).exists()).toBe(true)
    })
  })

  describe('model config', () => {
    it('should open the drawer, report it, and close it again', async () => {
      const wrapper = mountAssistant()
      expect(wrapper.findComponent({ name: 'SnModelConfig' }).exists()).toBe(false)

      await triggerOf(wrapper)?.trigger('click')
      expect(wrapper.emitted('update:modelConfigOpen')?.at(-1)).toEqual([true])
      expect(wrapper.findComponent({ name: 'SnModelConfig' }).exists()).toBe(true)

      const panel = wrapper.findComponent({ name: 'SnModelConfig' })
      panel.vm.$emit('update:activeModelId', 'm-deep')
      panel.vm.$emit('test-connection', { vendorId: 'v-local' })
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('update:activeModelId')?.at(-1)).toEqual(['m-deep'])
      expect(wrapper.emitted('test-connection')?.at(-1)).toEqual([{ vendorId: 'v-local' }])
    })

    it('should hand the drawer the same vendor list the composer uses', async () => {
      const wrapper = mountAssistant()
      await triggerOf(wrapper)?.trigger('click')

      expect(wrapper.findComponent({ name: 'SnModelConfig' }).props('vendors')).toEqual(vendors)
    })
    it('should own `params` rather than falling through to the chat page', () => {
      const params: SnAiModelParams = { temperature: 0.4, stream: true }
      const wrapper = mountAssistant({ params, modelConfigOpen: true })

      // A declared prop: an undeclared `params` would sit in $attrs, reach
      // SnConfigProvider — which renders fragment / teleport roots and cannot
      // inherit attributes — and warn, while `v-model:params` would never bind.
      expect(wrapper.props('params')).toEqual(params)
      expect(wrapper.findComponent({ name: 'SnModelConfig' }).props('params')).toEqual(params)
    })


    it('should drop the entry point and the panel when disabled', () => {
      const wrapper = mountAssistant({ showModelConfig: false, modelConfigOpen: true })

      expect(triggerOf(wrapper)).toBeUndefined()
      expect(wrapper.findComponent({ name: 'SnModelConfig' }).exists()).toBe(false)
    })

    it('should let a host control the open state', async () => {
      const wrapper = mountAssistant({ modelConfigOpen: true })
      expect(wrapper.findComponent({ name: 'SnModelConfig' }).exists()).toBe(true)

      await wrapper.setProps({ modelConfigOpen: false })
      expect(wrapper.findComponent({ name: 'SnModelConfig' }).exists()).toBe(false)
    })
  })
})
