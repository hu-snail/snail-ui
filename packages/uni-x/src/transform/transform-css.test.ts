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
    expect(r.issues.some((i) => i.kind === 'combinator-unsupported' || i.kind === 'pseudo-class')).toBe(false);
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

  it('should strip unsupported properties and report them', () => {
    const r = transformCss('.a {\n  cursor: pointer;\n  color: red;\n}\n', 'component', FILE);
    expect(r.css).not.toContain('cursor');
    expect(r.css).toContain('color: red');
    expect(r.issues.some((i) => i.kind === 'unsupported-property' && i.detail.includes('cursor'))).toBe(true);
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
  it('should rewrite :root and page selectors to class-only hooks', () => {
    const css = ':root {\n  --x: 1;\n}\npage.sn-theme-dark, .sn-theme-dark {\n  --x: 2;\n}\n';
    const r = transformCss(css, 'tokens', FILE);
    expect(r.css).toContain('.sn-theme-root {\n  --x: 1;\n}');
    expect(r.css).toContain('.sn-theme-root.sn-theme-dark');
    expect(r.css).not.toContain(':root');
    expect(r.css).not.toContain('page');
  });
});
