import { describe, it, expect } from 'vitest'
import { defaultPack, iosPack, darkPack, doodlePack, allPacks, getPack } from './index.js'

describe('@snui/style-packs', () => {
  it('exposes four official packs', () => {
    expect(allPacks.length).toBe(4)
  })

  it('all packs have required fields', () => {
    for (const p of allPacks) {
      expect(p.name).toMatch(/^[a-z][a-z0-9-]*$/)
      expect(p.label.length).toBeGreaterThan(0)
      expect(p.description?.length).toBeGreaterThan(0)
      expect(p.style.name).toBeTruthy()
    }
  })

  it('defaultPack is token-layer only', () => {
    expect(defaultPack.skinCss).toBeUndefined()
    expect(defaultPack.resources).toBeUndefined()
  })

  it('iosPack has apple-blue primary', () => {
    expect(iosPack.theme?.semantic?.action?.primary).toBe('#007AFF')
  })

  it('darkPack has dark backgrounds', () => {
    expect(darkPack.theme?.semantic?.background?.surface).toBe('#18181b')
  })

  it('doodlePack has marker-pink primary and sticker shadows', () => {
    expect(doodlePack.theme?.semantic?.action?.primary).toBe('#FF6B9D')
    expect(doodlePack.style.component.button?.shadow).toContain('#1a1a1a')
  })

  it('getPack() returns the right pack', () => {
    expect(getPack('ios')?.label).toBe('iOS 风格')
    expect(getPack('doodle')?.label).toBe('Doodle 涂鸦')
    expect(getPack('nope')).toBeUndefined()
  })
})