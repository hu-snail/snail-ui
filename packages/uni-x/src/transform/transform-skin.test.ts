import { describe, expect, it } from 'vitest';
import { transformCss } from './css.ts';

/**
 * Skin Pack variable-injection regression (ADR-0004).
 *
 * Style-pack rules in @snui/uni sources are two-level descendant selectors
 * (`.snui-skin-doodle .sn-button { … }`). On uni-app x App these become
 * single-class var-injection blocks — the mechanism that keeps skins working
 * without relationship selectors. These tests lock that contract: if the
 * flatten ever regresses, skins silently vanish from the uni-x output.
 */
const FILE = 'test/sn-skin.vue';

describe('style-pack variable injection (uni-x)', () => {
  it('should flatten skin rules into a single-class var block with base fallbacks', () => {
    const css = [
      '.snui-skin-doodle .sn-button {',
      '  border-width: 5rpx;',
      '  border-color: #1a1a1a;',
      '}',
      '.sn-button {',
      '  border-width: 2rpx;',
      '  border-color: var(--sn-mp-color-border-default);',
      '}',
    ].join('\n');
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('.snui-skin-doodle {\n  --snx-sn-button-border-width: 5rpx;\n  --snx-sn-button-border-color: #1a1a1a;\n}');
    expect(r.css).toContain('border-width: var(--snx-sn-button-border-width, 2rpx);');
    expect(r.css).toContain('border-color: var(--snx-sn-button-border-color, var(--sn-mp-color-border-default));');
    expect(r.css).not.toMatch(/\.snui-skin-doodle \./);
    expect(r.issues).toHaveLength(0);
  });

  it('should support multiple skins overwriting the same slots (nearest container wins)', () => {
    const css = [
      '.snui-skin-doodle .sn-button { border-width: 5rpx; }',
      '.snui-skin-ios .sn-button { border-width: 2rpx; }',
      '.sn-button { border-width: 2rpx; }',
    ].join('\n');
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('--snx-sn-button-border-width: 5rpx;');
    expect(r.css).toContain('--snx-sn-button-border-width: 2rpx;');
    // One consumer declaration only — the var resolves per ancestor at runtime.
    expect((r.css.match(/border-width: var\(--snx-sn-button-border-width, 2rpx\);/g) ?? []).length).toBe(1);
  });

  it('should drop and report interactive-state skin rules (no pseudo-classes on App)', () => {
    const css = '.snui-skin-doodle .sn-button:hover:not(.sn-button--disabled) {\n  transform: translate(-2rpx, -2rpx);\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).not.toContain(':hover');
    expect(r.issues.some((i) => i.kind === 'pseudo-class')).toBe(true);
  });
});
