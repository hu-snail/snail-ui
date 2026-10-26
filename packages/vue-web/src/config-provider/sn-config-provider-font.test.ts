/**
 * SnConfigProvider `font` prop behavior tests (naive-ui "fonts" doc mode).
 *
 * Covers:
 *   - no style tag without the prop (zero behavior change);
 *   - per-key :root token overrides (--aui-* + --sn-web-* alias layer);
 *   - the opt-in body{font-family} rule (only when `body` is provided);
 *   - `</style` breakout sanitization;
 *   - reactive updates on prop change;
 *   - SSR output carries the override (renderToString in happy-dom).
 */

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import SnConfigProvider from './SnConfigProvider.vue'

describe('SnConfigProvider font', () => {
  it('should render no style tag when font is not provided', () => {
    const w = mount(SnConfigProvider)
    expect(w.find('style').exists()).toBe(false)
  })

  it('should emit :root token overrides for provided keys only', () => {
    const w = mount(SnConfigProvider, {
      props: { font: { heading: 'Georgia, serif' } },
    })
    const css = w.find('style').text()
    expect(css).toContain('--aui-font-family-heading:Georgia, serif')
    expect(css).toContain('--sn-web-font-family-heading:Georgia, serif')
    expect(css).not.toContain('--aui-font-family-body:')
    expect(css).not.toContain('body{')
  })

  it('should apply body font-family only when body is provided', () => {
    const w = mount(SnConfigProvider, {
      props: { font: { body: '"Inter", sans-serif' } },
    })
    const css = w.find('style').text()
    expect(css).toContain('--aui-font-family-body:"Inter", sans-serif')
    expect(css).toContain(
      'body{font-family:var(--sn-web-font-family-body, var(--aui-font-family-body))}',
    )
  })

  it('should strip </style sequences from font values', () => {
    const w = mount(SnConfigProvider, {
      props: { font: { body: 'Foo</style><b>boom' } },
    })
    const css = w.find('style').text()
    // Sanitize contract: only `</style` sequences are stripped; the rest of
    // the value passes through (it lands inside textContent, inert).
    expect(css).toContain('Foo><b>boom')
    expect(css).not.toContain('</style')
  })

  it('should update the emitted CSS reactively when the font prop changes', async () => {
    const w = mount(SnConfigProvider, { props: { font: { body: 'One' } } })
    expect(w.find('style').text()).toContain('--aui-font-family-body:One')
    await w.setProps({ font: { body: 'Two' } })
    expect(w.find('style').text()).toContain('--aui-font-family-body:Two')
  })

  it('should server-render the override without touching browser globals', async () => {
    const html = await renderToString(
      h(SnConfigProvider, { font: { body: 'Serif', code: 'Mono' } }),
    )
    expect(html).toContain('--aui-font-family-body:Serif')
    expect(html).toContain('--aui-font-family-code:Mono')
    expect(html).toContain('body{font-family:var(--sn-web-font-family-body')
  })
})
