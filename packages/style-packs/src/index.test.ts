import { describe, it, expect } from 'vitest';
import {
  defaultPack,
  iosPack,
  doodlePack,
  allPacks,
  getPack,
  BUILTIN_THEMES,
  getBuiltinTheme,
} from './index.js';

describe('@snui/style-packs', () => {
  it('exposes three official packs', () => {
    // `dark` was removed: it mixed the colour axis into a style pack, and the
    // axis now lives in @snui/tokens as five named themes (ADR-0010).
    expect(allPacks.length).toBe(3);
  });

  it('no longer ships a dark style pack', () => {
    expect(getPack('dark')).toBeUndefined();
    expect(allPacks.map((p) => p.name)).not.toContain('dark');
  });

  it('all packs have required fields', () => {
    for (const p of allPacks) {
      expect(p.name).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.description?.length).toBeGreaterThan(0);
      expect(p.style.name).toBeTruthy();
    }
  });

  it('defaultPack is token-layer only', () => {
    expect(defaultPack.skinCss).toBeUndefined();
    expect(defaultPack.resources).toBeUndefined();
  });

  it('iosPack has apple-blue primary', () => {
    expect(iosPack.theme?.semantic?.action?.primary).toBe('#007AFF');
  });

  it('doodlePack has marker-pink primary and sticker shadows', () => {
    expect(doodlePack.theme?.semantic?.action?.primary).toBe('#FF6B9D');
    expect(doodlePack.style.component.button?.shadow).toContain('#1a1a1a');
  });

  it('re-exports the five built-in colour themes', () => {
    expect(BUILTIN_THEMES).toHaveLength(5);
    expect(getBuiltinTheme('forest')?.name).toBe('forest');
  });

  it('getPack() returns the right pack', () => {
    expect(getPack('ios')?.label).toBe('iOS 风格');
    expect(getPack('doodle')?.label).toBe('Doodle 涂鸦');
    expect(getPack('nope')).toBeUndefined();
  });
});
