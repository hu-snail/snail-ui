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

  it('should expand a border-radius shorthand in a descendant rule into per-corner vars', () => {
    // Bug (real-world, dialog panel): the round+center theme rule declared the
    // `border-radius` shorthand while the round+bottom rule declared per-corner
    // longhands. Flattening emitted the shorthand var() followed by four
    // longhand var()s that no center container defined — per CSS an undefined
    // var() is invalid at computed-value time (→ initial 0), and the trailing
    // longhands reset every corner of the shorthand: the dialog rendered square.
    const css =
      '.round.center .t {\n' +
      '  border-radius: var(--sn-mp-radius-xl);\n' +
      '}\n' +
      '.round.bottom .t {\n' +
      '  border-top-left-radius: var(--sn-mp-radius-xl);\n' +
      '  border-top-right-radius: var(--sn-mp-radius-xl);\n' +
      '}\n';
    const r = transformCss(css, 'component', FILE);
    // The shorthand became per-corner var slots — no shorthand slot remains.
    expect(r.css).not.toContain('border-radius: var(--snx-');
    expect(r.css).toContain('--snx-t-border-top-left-radius: var(--sn-mp-radius-xl);');
    expect(r.css).toContain('--snx-t-border-bottom-right-radius: var(--sn-mp-radius-xl);');
    expect(r.css).toContain(
      'border-top-left-radius: var(--snx-t-border-top-left-radius)',
    );
    expect(r.css).toContain(
      'border-bottom-right-radius: var(--snx-t-border-bottom-right-radius)',
    );
    expect(r.issues).toHaveLength(0);
  });

  it('should expand a 4-value border-radius shorthand carrying var() per the TL-TR-BR-BL cycle', () => {
    // Bug (real-world, sn-input-number round theme): splitTopLevel skipped the
    // char right after a paren group (the loop's i++ ran past the space that
    // follows `var(...)`), so `var(--full) 0 0 var(--full)` split into three
    // parts and the per-corner cycle came out shifted — top-left got the
    // elliptical `var(--full) 0` and top-right got an invalid 3-value longhand
    // (`var(--full) var(--full) 0`, dropped by every CSS parser). The round
    // theme rendered giant clipped corner arcs on uni-app x.
    const css =
      '.round .minus {\n' +
      '  border-radius: var(--sn-mp-radius-full) 0 0 var(--sn-mp-radius-full);\n' +
      '}\n' +
      '.round .plus {\n' +
      '  border-radius: 0 var(--sn-mp-radius-full) var(--sn-mp-radius-full) 0;\n' +
      '}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain(
      '--snx-minus-border-top-left-radius: var(--sn-mp-radius-full);',
    );
    expect(r.css).toContain('--snx-minus-border-top-right-radius: 0;');
    expect(r.css).toContain('--snx-minus-border-bottom-right-radius: 0;');
    expect(r.css).toContain(
      '--snx-minus-border-bottom-left-radius: var(--sn-mp-radius-full);',
    );
    expect(r.css).toContain('--snx-plus-border-top-left-radius: 0;');
    expect(r.css).toContain(
      '--snx-plus-border-top-right-radius: var(--sn-mp-radius-full);',
    );
    expect(r.css).toContain('--snx-plus-border-bottom-right-radius: var(--sn-mp-radius-full)');
    expect(r.css).toContain('--snx-plus-border-bottom-left-radius: 0');
    // No corner slot may carry a multi-value or elliptical expansion.
    expect(r.css).not.toMatch(/--snx-(minus|plus)-border-\w+-radius: [^;]+ [^;]+/);
    expect(r.issues).toHaveLength(0);
  });

  it('should keep base padding values as flatten fallbacks when a theme overrides padding-bottom', () => {
    // Bug (real-world, popup safe-area): the position rules declared the
    // `padding` shorthand and the safe-area rule overrode `padding-bottom` —
    // the flattened longhand var() came after the shorthand with no fallback,
    // so every panel without the safe-area class lost its bottom padding
    // (undefined var → initial 0).
    const css =
      '.t {\n' +
      '  padding: 16rpx;\n' +
      '}\n' +
      '.center .t {\n' +
      '  padding: 40rpx 32rpx;\n' +
      '}\n' +
      '.safe .t {\n' +
      '  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));\n' +
      '}\n';
    const r = transformCss(css, 'component', FILE);
    // The shorthand expanded into four per-side vars on the container (TRBL cycle).
    expect(r.css).toContain('--snx-t-padding-top: 40rpx;');
    expect(r.css).toContain('--snx-t-padding-right: 32rpx;');
    expect(r.css).toContain('--snx-t-padding-bottom: 40rpx;');
    expect(r.css).toContain('--snx-t-padding-left: 32rpx');
    // The base longhands carry the shorthand's own values as fallbacks.
    expect(r.css).toContain('padding-top: var(--snx-t-padding-top, 16rpx);');
    expect(r.css).toContain('padding-right: var(--snx-t-padding-right, 16rpx);');
    expect(r.css).toContain('padding-bottom: var(--snx-t-padding-bottom, 16rpx);');
    expect(r.css).not.toContain('padding: var(--snx-');
    expect(r.issues).toHaveLength(0);
  });

  it('should flatten `animation: none` as animation-name so sibling animation longhands survive', () => {
    // Bug (real-world, popup layers): `.hidden .panel { animation: none }`
    // flattened to a fallback-less `animation: var(--undefined)` appended after
    // the panel's own animation longhands — with the hidden class absent the
    // var() was invalid at computed-value time and reset the whole shorthand,
    // silencing every popup enter/leave animation on uni-app x.
    const css =
      '.anim .p {\n' +
      '  animation-name: fade;\n' +
      '}\n' +
      '.p {\n' +
      '  animation-duration: 300ms;\n' +
      '  animation-fill-mode: both;\n' +
      '}\n' +
      '.hidden .p {\n' +
      '  animation: none;\n' +
      '}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('--snx-p-animation-name: none');
    expect(r.css).toContain('animation-name: var(--snx-p-animation-name)');
    expect(r.css).not.toContain('animation: var(--snx-');
    expect(r.css).toContain('animation-duration: 300ms;');
    expect(r.issues).toHaveLength(0);
  });

  it('should extract the animation name from a full animation shorthand flatten', () => {
    const css = '.t {\n  color: red;\n}\n.spinning .t {\n  animation: sn-spin 5s linear infinite;\n}\n';
    const r = transformCss(css, 'component', FILE);
    expect(r.css).toContain('--snx-t-animation-name: sn-spin');
    expect(r.css).toContain('animation-name: var(--snx-t-animation-name)');
    expect(r.css).not.toContain('animation: var(--snx-');
    expect(r.issues).toHaveLength(0);
  });

  it('should leave an elliptical border-radius shorthand whole', () => {
    const r = transformCss('.a .t {\n  border-radius: 16rpx / 32rpx;\n}\n', 'component', FILE);
    expect(r.css).toContain('--snx-t-border-radius: 16rpx / 32rpx');
    expect(r.css).toContain('border-radius: var(--snx-t-border-radius)');
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
