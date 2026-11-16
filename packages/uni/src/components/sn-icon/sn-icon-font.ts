/**
 * 字体图标注册表（ADR-0011 阶段一）—— lime-icon `registerFontIcon` 同形态的
 * 注册制 API（AGENTS.md §112.3a additive）。
 *
 * ## 渲染契约
 *
 * 注册命中的 `name` 走 **`<text>` + unicode 字面量 + fontFamily**：三端
 * （web / MP / uni-app x App）一致，颜色由 CSS `color` 继承 —— data-URL 光栅化
 * 的取色/烘焙链路（AUI-UNI-FB-021）不参与。未命中的 name 仍走原有解析链
 * （registry → 内置目录 → Provider）。
 *
 * ## 字体加载（跨端分流）
 *
 * - web（经典 + uni-app x）：注入 `@font-face` `<style>`（fontUrl 为 https 直链
 *   或 base64 data URL）；
 * - MP / App 原生：`uni.loadFontFace({ global: true, family, source })` —— 静态
 *   `uni` 调用（AUI-UNI-FB-012：编译器才会打包路由 API）；MP 真机要求字体域名
 *   已加入下载合法域名，或使用自有 https 字体。
 *
 * 加载状态按 fontFamily 去重（幂等）；`fontUrl` 缺省 = 字体由宿主样式表提供。
 *
 * Internal helper（AGENTS.md §15）：不进包 barrel。
 */
import { resolveUniHost } from '../../utils/uni-host';

/** 宿主字体加载器的最小面（经典 uni / uni-app x 的 uni 宿主）。 */
interface FontUniHost {
  loadFontFace?: (options: { family: string; source: string; global?: boolean }) => unknown;
}

/** 字体图标注册配置（lime-icon 同形态签名）。 */
export interface FontIconConfig {
  /** 图标前缀：`<prefix>:<name>` 形式解析的命名空间；同时是裸 name 的查表顺序。 */
  prefix: string;
  /** CSS font-family（与 fontUrl 的 @font-face 声明一致）。 */
  fontFamily: string;
  /** 图标名 → 十六进制码点（如 `'E600'`，不带头部 `\\u`）。 */
  icons: Record<string, string>;
  /** 字体文件 URL（ttf / woff / woff2 / base64 data URL）；缺省 = 宿主样式表提供。 */
  fontUrl?: string;
}

export interface FontGlyph {
  fontFamily: string;
  /** unicode 字面量字符（`<text>` 直接渲染的内容）。 */
  char: string;
}

const fontRegistry = new Map<
  string,
  { fontFamily: string; icons: Record<string, string>; fontUrl?: string }
>();
const injectedFontFaces = new Set<string>();
const loadedFontFamilies = new Set<string>();

/**
 * 注册一个字体图标库（幂等：同 prefix 覆盖）。注册后，sn-icon 的 `name`
 * 按 `<prefix>:<name>` 或裸 name（按注册顺序）命中映射 → 字形渲染。
 */
export function registerFontIcon(config: FontIconConfig): void {
  fontRegistry.set(config.prefix, {
    fontFamily: config.fontFamily,
    icons: { ...config.icons },
    // exactOptionalPropertyTypes：fontUrl 仅在显式提供时写入。
    ...(config.fontUrl !== undefined ? { fontUrl: config.fontUrl } : {}),
  });
}

/** 解析 `name` → 字形（fontFamily + unicode 字面量）；未注册命中返回 null。 */
export function resolveFontIcon(name: string): FontGlyph | null {
  if (name === '') return null;
  const colon = name.indexOf(':');
  if (colon > 0) {
    const entry = fontRegistry.get(name.slice(0, colon));
    const hex = entry?.icons[name.slice(colon + 1)];
    return entry !== undefined && hex !== undefined ? toGlyph(entry, hex) : null;
  }
  // 裸 name：按注册顺序查表（首个命中者胜）。
  for (const entry of fontRegistry.values()) {
    const hex = entry.icons[name];
    if (hex !== undefined) return toGlyph(entry, hex);
  }
  return null;
}

/** 解析 + 确保字体已加载（注入/加载是幂等副作用）。 */
function toGlyph(
  entry: { fontFamily: string; icons: Record<string, string>; fontUrl?: string },
  hex: string,
): FontGlyph | null {
  ensureFontLoaded(entry);
  const codepoint = parseInt(hex, 16);
  if (Number.isNaN(codepoint)) return null;
  return { fontFamily: entry.fontFamily, char: String.fromCodePoint(codepoint) };
}

/** 按端加载字体（fontFamily 幂等）。 */
function ensureFontLoaded(entry: {
  fontFamily: string;
  icons: Record<string, string>;
  fontUrl?: string;
}): void {
  if (loadedFontFamilies.has(entry.fontFamily) || entry.fontUrl === undefined) return;
  loadedFontFamilies.add(entry.fontFamily);
  if (typeof document !== 'undefined') {
    injectFontFaceStyle(entry.fontFamily, entry.fontUrl);
    return;
  }
  // MP / App：无 DOM —— uni.loadFontFace（宿主缺 API 时静默放弃，字形交由
  // 宿主样式表 / 回落渲染）。
  const host = resolveUniHost<FontUniHost>();
  if (typeof host?.loadFontFace === 'function') {
    try {
      host.loadFontFace({
        family: entry.fontFamily,
        source: `url("${entry.fontUrl}")`,
        global: true,
      });
    } catch {
      // 字体加载失败不阻断渲染 —— 字形可能显示为兜底字形。
    }
  }
}

/** web：注入一次 @font-face（fontUrl 可为 https 直链或 base64 data URL）。 */
function injectFontFaceStyle(fontFamily: string, fontUrl: string): void {
  if (injectedFontFaces.has(fontFamily)) return;
  injectedFontFaces.add(fontFamily);
  const style = document.createElement('style');
  style.textContent = `@font-face{font-family:'${fontFamily}';src:url('${fontUrl}')}`;
  document.head.appendChild(style);
}

/** 清空注册与加载状态（测试专用）。 */
export function resetFontIcons(): void {
  fontRegistry.clear();
  injectedFontFaces.clear();
  loadedFontFamilies.clear();
}
