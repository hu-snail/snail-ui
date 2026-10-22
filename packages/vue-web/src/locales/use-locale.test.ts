/**
 * useLocale / <SnConfigProvider locale> behavior tests (naive-ui i18n).
 *
 * Covers:
 *   - default fallback to zhCN when no provider is present;
 *   - enUS rendering through the provider;
 *   - reactive locale switching without remount;
 *   - partial-namespace merge contract (missing namespaces fall back zhCN).
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'

import SnConfigProvider from '../config-provider/SnConfigProvider.vue'
import SnLog from '../log/SnLog.vue'
import SnUpload from '../upload/SnUpload.vue'
import { enUS, zhCN } from './index'
import type { SnLocaleInput } from './use-locale'

describe('useLocale', () => {
  it('should fall back to zh-CN when no provider is present', () => {
    const w = mount(SnLog, { props: { loading: true } })
    expect(w.find('.sn-log__loader-text').text()).toBe('加载中')
  })

  it('should render en-US strings under <SnConfigProvider :locale>', () => {
    const w = mount(SnConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(SnLog, { loading: true }) },
    })
    expect(w.find('.sn-log__loader-text').text()).toBe('Loading')
  })

  it('should switch strings reactively when the locale prop changes', async () => {
    const w = mount(SnConfigProvider, {
      props: { locale: zhCN },
      slots: { default: () => h(SnLog, { loading: true }) },
    })
    expect(w.find('.sn-log__loader-text').text()).toBe('加载中')
    await w.setProps({ locale: enUS })
    expect(w.find('.sn-log__loader-text').text()).toBe('Loading')
  })

  it('should merge a partial locale namespace over zh-CN (other namespaces fall back)', () => {
    const partial: SnLocaleInput = { Log: { loading: 'Lädt' } }
    const w = mount(SnConfigProvider, {
      props: { locale: partial },
      slots: { default: () => h(SnUpload) },
    })
    // Upload namespace is not provided → zh-CN default stays byte-identical.
    expect(w.find('button').text()).toContain('点击上传')
  })

  it('should render localized upload dragger copy under en-US', () => {
    const w = mount(SnConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(SnUpload) },
    })
    expect(w.find('button').text()).toContain('Click to upload')
  })
})
