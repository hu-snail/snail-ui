import { describe, expect, it } from 'vitest';
import { transformCss } from './css.ts';

const FILE = 'test/sn-comp.vue';

describe('transformCss (component mode)', () => {
  it('should keep compound class selectors untouched', () => {
    const r = transformCss('.a.b {\n  color: red;\n}\n', 'component', FILE);
    expect(r.css).toContain('.a.b');
    expect(r.issues).toHaveLength(0);
  });

  it('should strip a tag prefix and keep the class', () => {
    const r = transformCss('textarea.sn-input__native {\n  color: red;\n}\n', 'component', FILE);
    expect(r.css).toContain('.sn-input__native');
    expect(r.css).not.toContain('textarea');
  });

  it('should drop pseudo-class rules and report them', () => {
    const r = transformCss('.btn:active {\n  opacity: 0.7;\n}\n', 'component', FILE);
    expect(r.css).not.toContain(':active');
    expect(r.issues.some((i) => i.kind === 'pseudo-class')).toBe(true);
  });

  it('should drop pseudo-element rules and report them', () => {
    const r = transformCss('.cell--border::after {\n  content: "";\n}\n', 'component', FILE);
    expect(r.css).not.toContain('::after');
    expect(r.issues.some((i) => i.kind === 'pseudo-element')).toBe(true);
  });

  it('should flatten a two-level descendant rule into var-context injection with base fallback', () => {
    const css = '.a .b {\n  color: red;\n}\n.b {\n  color: blue;\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('.a {\n  --snx-b-color: red;\n}');
    expect(r.css).toContain('color: var(--snx-b-color, blue);');
    expect(r.css).not.toContain('.a .b');
    expect(r.issues).toHaveLength(0);
  });

  it('should inject a fallback-less var when no base declaration exists', () => {
    const css = '.a .b {\n  margin-top: 4rpx;\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('var(--snx-b-margin-top)');
    expect(r.css).not.toContain('.a .b');
    expect(
      r.issues.some((i) => i.kind === 'combinator-unsupported' || i.kind === 'pseudo-class'),
    ).toBe(false);
  });

  it('should keep shorthand-derived longhand fallbacks when a skin rule overrides border parts', () => {
    // Bug (real-world, picker indicator): the base rule declares only the
    // `border-top` shorthand; the skin rule overrides width/color longhands,
    // so the flattened injection appended fallback-less var()s — with the
    // skin inactive those vars are unset and CSS drops the longhands back to
    // their *initial* values (3px medium + currentColor), shattering the
    // 1px subtle line into a heavy black one. The injection must carry the
    // shorthand-derived values as fallbacks instead.
    const css =
      '.sk .t {\n' +
      '  border-top-width: 4rpx;\n' +
      '  border-top-color: var(--sn-mp-color-text-primary);\n' +
      '}\n' +
      '.t {\n' +
      '  border-top: 2rpx solid var(--sn-mp-color-border-subtle);\n' +
      '}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain(
      'border-top-width: var(--snx-t-border-top-width, 2rpx);',
    );
    expect(r.css).toContain(
      'border-top-color: var(--snx-t-border-top-color, var(--sn-mp-color-border-subtle));',
    );
  });

  it('should expand a plain border shorthand in a descendant rule into per-longhand vars with no-border fallbacks', () => {
    // Bug (real-world, input-number actions): a theme rule overriding the
    // plain `border` shorthand was flattened as ONE fallback-less var() —
    // `border: var(--undefined)` on App resolves every longhand from the
    // unset var (width → initial `medium`, 3px), an engine-dependent landmine
    // per the uni-app x docs (shorthands cannot reliably carry var() on App).
    // Each longhand must get its own var() slot and an explicit no-border
    // fallback so the absent-context state is inert.
    const css = '.theme .t {\n  border: 2rpx solid var(--sn-mp-color-border-default);\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('--snx-t-border-width: 2rpx;');
    expect(r.css).toContain('--snx-t-border-style: solid;');
    expect(r.css).toContain('--snx-t-border-color: var(--sn-mp-color-border-default)');
    expect(r.css).toContain('border-width: var(--snx-t-border-width, 0);');
    expect(r.css).toContain('border-style: var(--snx-t-border-style, none);');
    expect(r.css).toContain('border-color: var(--snx-t-border-color, transparent)');
    expect(r.css).not.toContain('border: var(');
    expect(r.issues).toHaveLength(0);
  });

  it('should keep base shorthand values as flatten fallbacks when a skin overrides border longhands', () => {
    // Bug (real-world, input-number container): the base rule declares the
    // plain `border` shorthand and the doodle skin overrides width/color
    // longhands — the flatten could not find base longhand entries and
    // appended fallback-less var()s, so with the skin inactive border-width
    // resolved to its initial `medium` (3px) with currentColor ink while the
    // shorthand's solid style survived: a heavy black frame around the
    // stepper. The base shorthand must be expanded so its own values become
    // the fallbacks (same contract as the border-top case above).
    const css =
      '.sk .t {\n' +
      '  border-width: 4rpx;\n' +
      '  border-color: var(--sn-mp-color-text-primary);\n' +
      '}\n' +
      '.t {\n' +
      '  border: 2rpx solid transparent;\n' +
      '}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('--snx-t-border-width: 4rpx;');
    expect(r.css).toContain('--snx-t-border-color: var(--sn-mp-color-text-primary);');
    expect(r.css).toContain('border-width: var(--snx-t-border-width, 2rpx);');
    expect(r.css).toContain('border-color: var(--snx-t-border-color, transparent);');
    expect(r.issues).toHaveLength(0);
  });

  it('should merge multiple container rules onto one target var name', () => {
    const css = '.a .b {\n  color: red;\n}\n.c .b {\n  color: green;\n}\n.b {\n  color: blue;\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('--snx-b-color: red;');
    expect(r.css).toContain('--snx-b-color: green;');
    expect((r.css.match(/color: var\(--snx-b-color, blue\)/g) ?? []).length).toBe(1);
  });

  it('should drop deep descendant selectors and report them', () => {
    const r = transformCss('.a .b .c {\n  color: red;\n}\n', 'component', FILE);
    expect(r.css).not.toContain('.a .b .c');
    expect(r.issues.some((i) => i.kind === 'combinator-unsupported')).toBe(true);
  });

  it('should drop sibling combinators and report them', () => {
    const r = transformCss('.a + .b {\n  color: red;\n}\n', 'component', FILE);
    expect(r.issues.some((i) => i.kind === 'combinator-unsupported')).toBe(true);
  });

  it('should leave @keyframes bodies untouched', () => {
    const css = '@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('@keyframes spin');
    expect(r.css).toContain('to {\n    transform: rotate(360deg);\n  }');
    expect(r.issues).toHaveLength(0);
  });

  it('should inject flex-direction: row into flex containers relying on the W3C default', () => {
    const css =
      '.row {\n  display: flex;\n  gap: 8px;\n}\n.inline {\n  display: inline-flex;\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('.row {\n  display: flex;\n  gap: 8px;\n  flex-direction: row;');
    expect(r.css).toContain('.inline {\n  display: inline-flex;\n  flex-direction: row;');
    expect(r.issues.some((i) => i.kind === 'flex-direction-row')).toBe(true);
  });

  it('should not inject flex-direction when it is already declared', () => {
    const css = '.col {\n  display: flex;\n  flex-direction: column;\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).not.toContain('flex-direction: row');
    expect(r.issues.some((i) => i.kind === 'flex-direction-row')).toBe(false);
  });

  it('should not inject flex-direction into non-flex rules', () => {
    const r = transformCss('.a {\n  display: block;\n  color: red;\n}\n', 'component', FILE);
    expect(r.css).not.toContain('flex-direction');
    expect(r.issues).toHaveLength(0);
  });

  it('should strip unsupported properties and report them', () => {
    const r = transformCss('.a {\n  cursor: pointer;\n  color: red;\n}\n', 'component', FILE);
    expect(r.css).not.toContain('cursor');
    expect(r.css).toContain('color: red');
    expect(
      r.issues.some((i) => i.kind === 'unsupported-property' && i.detail.includes('cursor')),
    ).toBe(true);
  });

  it('should be idempotent (normalize(normalize(x)) === normalize(x))', () => {
    const css = [
      '.a .b { color: red; }',
      '.b { color: blue; cursor: pointer; }',
      '.c:hover { opacity: 0.5; }',
      '.a .b .d { margin: 0; }',
    ].join('\n');
    const once = transformCss(css, 'component', FILE).css;
    const twice = transformCss(once, 'component', FILE).css;
    expect(twice).toBe(once);
  });
});

describe('transformCss (tokens mode)', () => {
  it('should rewrite :root and page selectors to page + class-only hooks', () => {
    // `page` must survive: WeChat app.wxss selectors never match inside custom
    // components, so the vars only reach them through inheritance from the
    // page node. `.sn-theme-root` stays for the App class hook (ADR-0004).
    const css = ':root {\n  --x: 1;\n}\npage.sn-theme-dark, .sn-theme-dark {\n  --x: 2;\n}\n';
    const r = transformCss(css, 'tokens', FILE);
    expect(r.css).toContain('page, .sn-theme-root {\n  --x: 1;\n}');
    expect(r.css).toContain('page.sn-theme-dark, .sn-theme-root.sn-theme-dark');
    expect(r.css).toContain('.sn-theme-dark');
    expect(r.css).not.toContain(':root');
  });
});
