/**
 * sn-icon 字体图标注册表 — 行为测试（ADR-0011 阶段一）。
 *
 * 行为面：注册映射的解析（prefix:name / 裸 name / 未命中）、码点转换、
 * 跨端字体加载（web 注入 @font-face / MP·App 走 uni.loadFontFace）与幂等。
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registerFontIcon, resolveFontIcon, resetFontIcons } from './sn-icon-font';

const DEMO_FONT_URL = 'https://cdn.example.com/demo-icons.ttf';

beforeEach(() => {
  resetFontIcons();
  document.querySelectorAll('style[data-sn-icon-font]').forEach((el) => el.remove());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('resolveFontIcon', () => {
  it('resolves a registered prefix:name pair to a unicode glyph', () => {
    registerFontIcon({
      prefix: 'ri',
      fontFamily: 'demo-icons',
      icons: { home: 'EE2B' },
    });
    expect(resolveFontIcon('ri:home')).toEqual({
      fontFamily: 'demo-icons',
      char: '\u{EE2B}',
    });
  });

  it('resolves a bare name by registration order', () => {
    registerFontIcon({ prefix: 'ri', fontFamily: 'a', icons: { home: 'EA6C' } });
    registerFontIcon({ prefix: 'md', fontFamily: 'b', icons: { home: 'E600' } });
    // 首个注册者胜。
    expect(resolveFontIcon('home')).toEqual({ fontFamily: 'a', char: '\u{EA6C}' });
    expect(resolveFontIcon('md:home')).toEqual({ fontFamily: 'b', char: '\u{E600}' });
  });

  it('returns null for unregistered names so the SVG chain stays in charge', () => {
    registerFontIcon({ prefix: 'ri', fontFamily: 'demo-icons', icons: { home: 'EE2B' } });
    expect(resolveFontIcon('ri:missing')).toBeNull();
    expect(resolveFontIcon('unknown')).toBeNull();
    expect(resolveFontIcon('')).toBeNull();
  });

  it('returns null for an invalid hex codepoint instead of throwing', () => {
    registerFontIcon({ prefix: 'x', fontFamily: 'f', icons: { bad: 'ZZZZ' } });
    expect(resolveFontIcon('x:bad')).toBeNull();
  });
});

describe('font loading', () => {
  it('injects one @font-face style on web and is idempotent', () => {
    registerFontIcon({
      prefix: 'ri',
      fontFamily: 'demo-icons',
      icons: { home: 'EE2B' },
      fontUrl: DEMO_FONT_URL,
    });

    expect(resolveFontIcon('ri:home')).not.toBeNull();
    const faces = [...document.querySelectorAll('style')].filter((el) =>
      el.textContent?.includes("font-family:'demo-icons'"),
    );
    expect(faces).toHaveLength(1);
    expect(faces[0].textContent).toContain(`url('${DEMO_FONT_URL}')`);

    // 二次解析不重复注入（幂等）。
    resolveFontIcon('ri:home');
    expect(
      [...document.querySelectorAll('style')].filter((el) =>
        el.textContent?.includes("font-family:'demo-icons'"),
      ),
    ).toHaveLength(1);
  });

  it('loads the font through uni.loadFontFace on DOM-less targets (MP / App)', () => {
    // 回归约束（AUI-UNI-FB-012）：MP 端必须走宿主 uni.loadFontFace —— 静态
    // uni 调用编译器才会打包；无 fontUrl 时不触发加载。
    const loadFontFace = vi.fn();
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('uni', { loadFontFace });
    registerFontIcon({
      prefix: 'ri',
      fontFamily: 'demo-icons',
      icons: { home: 'EE2B' },
      fontUrl: DEMO_FONT_URL,
    });
    resolveFontIcon('ri:home');
    expect(loadFontFace).toHaveBeenCalledTimes(1);
    expect(loadFontFace).toHaveBeenCalledWith({
      family: 'demo-icons',
      source: `url("${DEMO_FONT_URL}")`,
      global: true,
    });

    // 幂等：同一 family 不重复加载。
    resolveFontIcon('ri:home');
    expect(loadFontFace).toHaveBeenCalledTimes(1);
  });

  it('skips loading when the font is provided by the host stylesheet (no fontUrl)', () => {
    const loadFontFace = vi.fn();
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('uni', { loadFontFace });
    registerFontIcon({ prefix: 'ri', fontFamily: 'host-font', icons: { home: 'EE2B' } });
    expect(resolveFontIcon('ri:home')).toEqual({ fontFamily: 'host-font', char: '\u{EE2B}' });
    expect(loadFontFace).not.toHaveBeenCalled();
  });
});
