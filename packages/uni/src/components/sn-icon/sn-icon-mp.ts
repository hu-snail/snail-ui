/**
 * sn-icon mini-program rendering support (AUI-MP-002).
 *
 * WXSS/WXML has no inline `<svg>` element: uni-app keeps `<svg>` / `<path>` in
 * the compiled WXML, but WeChat renders unknown tags as empty custom
 * components, so every IconData icon disappeared on MP (the console also flags
 * the `svg` tag selector as illegal in component wxss). The MP path therefore
 * rasterizes IconData into an SVG **data URL** rendered by `<image>`.
 *
 * Two consequences are handled here:
 *
 * 1. A data URL is an isolated SVG document — `currentColor` and `var(--*)`
 *    cannot cross the image boundary (a literal `var()` is invalid inside the
 *    document and falls back to black). The effective stroke is therefore
 *    resolved from the real cascade through `computedStyle`, exactly like the
 *    uni-app x port (packages/uni-x/src/transform/patches.ts). A concrete
 *    `color` prop skips the query; failures keep a neutral ink so an icon is
 *    never blank.
 * 2. WeChat has no `btoa`; the SVG document is ASCII (path data, hex colors,
 *    viewBox), so a tiny base64 encoder avoids a runtime dependency.
 */

import {
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from 'vue';
import type { IconData } from './sn-icon-types';
import { resolveUniHost } from '../../utils/uni-host';

/** Last-resort ink so an unresolved color never erases the glyph. */
const ICON_INK_FALLBACK = '#1a1a1a';

/** Root selector used by the scoped computedStyle query. */
const ICON_SELECTOR = '.sn-icon';

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Colors an SVG data URL can take verbatim (no cascade involvement). */
export function isConcreteIconColor(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$|^rgba?\(|^hsla?\(|^(transparent|white|black)$/i.test(value.trim());
}

/**
 * ASCII-only base64 (the SVG document contains path data / hex colors /
 * viewBox digits only). WeChat ships no `btoa`, so this stays dependency-free.
 */
function encodeBase64Ascii(value: string): string {
  let out = '';
  for (let i = 0; i < value.length; i += 3) {
    const hasB = i + 1 < value.length;
    const hasC = i + 2 < value.length;
    const a = value.charCodeAt(i);
    const b = hasB ? value.charCodeAt(i + 1) : 0;
    const c = hasC ? value.charCodeAt(i + 2) : 0;
    const triplet = (a << 16) | (b << 8) | c;
    out += BASE64_CHARS[(triplet >> 18) & 0x3f];
    out += BASE64_CHARS[(triplet >> 12) & 0x3f];
    out += hasB ? BASE64_CHARS[(triplet >> 6) & 0x3f] : '=';
    out += hasC ? BASE64_CHARS[triplet & 0x3f] : '=';
  }
  return out;
}

/**
 * IconData → SVG data URL for the MP `<image>`.
 *
 * Material-style solid glyphs (`render: 'fill'`) are filled rather than
 * stroked — a stroke would trace the outline into a hollow double line.
 */
export function buildIconDataUrl(
  icon: IconData,
  stroke: string,
  strokeWidth: number | string,
): string {
  const viewBox = icon.viewBox ?? '0 0 24 24';
  const isFill = icon.render === 'fill';
  const body = icon.paths
    .map((d) =>
      isFill
        ? `<path d="${d}" fill="${stroke}"/>`
        : `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`;
  return `data:image/svg+xml;base64,${encodeBase64Ascii(svg)}`;
}

/* ── computedStyle color resolution (MP / no DOM) ─────────────────────── */

interface IconColorField {
  color?: unknown;
}

interface IconColorFieldsOptions {
  computedStyle: string[];
}

interface IconColorSelectChain {
  fields(options: IconColorFieldsOptions, callback: (value: unknown) => void): { exec(): void };
}

interface IconSelectorQuery {
  in(context?: unknown): IconSelectorQuery;
  select(selector: string): IconColorSelectChain;
}

interface IconUniHost {
  createSelectorQuery?: () => IconSelectorQuery;
}

/** Extract a concrete color from any result wrapper the host delivers. */
export function readResolvedIconColor(value: unknown): string {
  const readOne = (node: unknown): string => {
    if (typeof node === 'string') return isConcreteIconColor(node) ? node : '';
    if (node !== null && typeof node === 'object') {
      const direct = (node as IconColorField).color;
      if (typeof direct === 'string' && isConcreteIconColor(direct)) return direct;
    }
    return '';
  };

  if (Array.isArray(value)) {
    for (const item of value) {
      const color = readOne(item);
      if (color !== '') return color;
    }
    return '';
  }

  const color = readOne(value);
  if (color !== '') return color;

  // UTSJSONObject / Map / JSON-string wrappers: probe the serialized shape.
  try {
    const json = typeof value === 'string' ? value : JSON.stringify(value);
    const match = json === undefined ? null : /"color"\s*:\s*"([^"]+)"/.exec(json);
    if (match !== null && isConcreteIconColor(match[1] ?? '')) return match[1] ?? '';
  } catch {
    // Cyclic / non-serializable wrapper — keep the fallback.
  }
  return '';
}

/** H5 has a real DOM and renders inline `<svg>`; only MP/App need the query. */
/** DOM 形态宿主（uni-app x web / 经典 uni H5）下 $el 的最小探测面。 */
interface IconDomEl {
  querySelector(selector: string): Element | null;
  ownerDocument?: { defaultView?: { getComputedStyle(el: Element): CSSStyleDeclaration } | null };
}

/**
 * 该端是否需要解析"烘焙进 data-URL 的级联色"—— 以组件**真实渲染形态**为准，
 * 不做编译目标假设：
 *
 * - MP / App 原生：无 DOM（`$el` 不可用），data-URL `<image>` 是唯一渲染 → 需要查询器；
 * - 经典 uni-app H5：inline `<svg>` + `currentColor`，继承即着色 → 不需要；
 * - **uni-app x web**：转换层把 `<svg>` 分支替换成 `<image>` 光栅化（uni-app x 无
 *   内联 svg 元素），web 上 `document` 存在但渲染的仍是烘焙位图 —— 曾因
 *   `typeof document === 'undefined'` 的目标假设在 web 上直接早退，全站图标
 *   永落墨色（AUI-UNI-FB-021）。DOM 形态下无 svg 子节点即视为光栅化渲染。
 */
export function rendersRasterized(el: unknown): boolean {
  if (el === undefined || el === null) return true;
  if (typeof (el as IconDomEl).querySelector !== 'function') return true;
  return (el as IconDomEl).querySelector('svg') === null;
}

/**
 * 查询失败后的重试节奏（毫秒）。重型 demo 页的组件树 / 样式落地较慢，
 * 单次 50ms 重试会输给首次渲染 —— 部分图标实例查不到级联色就永远落在墨色
 * 兜底上（回归：按钮内嵌 heart 图标在 MP 上渲染为黑）。预算收在 ~3s：
 * 页面 settled 后仍取不到色，多半是宿主查询器本身失效，继续重试无意义。
 */
export const RETRY_DELAYS_MS = [50, 100, 200, 400, 800, 1600];

/** 计算色查询宿主的选取结果：'scope' = 组件 $scope，'uni' = uni 宿主，null = 无。 */
export type MpQueryHostPick =
  | { kind: 'scope'; createQuery: () => IconSelectorQuery; queryScope: unknown }
  | { kind: 'uni'; createQuery: () => IconSelectorQuery; queryScope: unknown }
  | { kind: null };

/**
 * 选取计算色查询的宿主。
 *
 * **优先组件自带的 `$scope.createSelectorQuery`** —— WeChat Component 实例
 * 原生拥有它，`.in($scope)` 把选择器作用域原生收敛到本组件子树，级联色
 * 读取稳定。uni 宿主的页面级查询（AUI-UNI-FB-012 经由自由标识符拿到的
 * `uni.createSelectorQuery`）在嵌套自定义组件（sn-button 内嵌 sn-icon）里
 * `.in(Vue proxy)` 不可靠 —— 232331e5 迁移时误把它排在前面，导致部分图标
 * 实例取色失败、永落墨色（回归：heart 图标在 MP 上渲染为黑）。uni 宿主
 * 仅在没有 `$scope` 的宿主形态下兜底（此时 queryScope 只能尽力传入
 * 组件 proxy）。
 */
export function pickMpQueryHost(
  scope: IconUniHost | null | undefined,
  globalHost: IconUniHost | null | undefined,
  fallbackQueryScope: unknown,
): MpQueryHostPick {
  if (typeof scope?.createSelectorQuery === 'function') {
    return { kind: 'scope', createQuery: scope.createSelectorQuery, queryScope: scope };
  }
  if (typeof globalHost?.createSelectorQuery === 'function') {
    return {
      kind: 'uni',
      createQuery: globalHost.createSelectorQuery,
      queryScope: fallbackQueryScope,
    };
  }
  return { kind: null };
}

/**
 * Resolve the icon's effective stroke color for the MP data URL.
 *
 * A concrete `color` prop is used verbatim. Otherwise the wrapper's computed
 * `color` is read (after mount, once retried) so inherited tokens / theme
 * variables still tint the icon. Any failure keeps `ICON_INK_FALLBACK` — a
 * blank icon is never acceptable (regression: blank-first-paint policy made
 * every icon invisible on runtimes whose callback shape differed).
 */
export function useMpIconColor(color: () => string): Ref<string> {
  const resolved = ref(ICON_INK_FALLBACK);
  const instance = getCurrentInstance();
  let seq = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  /** 兜底：清掉挂起的重试并落到墨色（空图标不可接受的历史契约）。 */
  function settleToInk(seqSnapshot: number): void {
    if (seqSnapshot !== seq) return;
    resolved.value = ICON_INK_FALLBACK;
  }

  function resolve(attempt = 0): void {
    if (retryTimer !== null) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    const raw = color();
    if (isConcreteIconColor(raw)) {
      seq++;
      resolved.value = raw;
      return;
    }
    const el = (instance?.proxy as { $el?: unknown } | undefined)?.$el;
    if (!rendersRasterized(el)) return; // inline <svg>（经典 uni H5）：currentColor 继承即可
    if (typeof (el as IconDomEl | undefined)?.querySelector === 'function') {
      // DOM 形态且走光栅化（uni-app x web）：selector query 的 computedStyle 在 web
      // 运行时不可靠，getComputedStyle 同步读取宿主级联色（data-URL 是独立 SVG
      // 文档，拿不到宿主 CSS —— 与 MP 同理）。
      const node = el as unknown as IconDomEl & Element;
      const style = node.ownerDocument?.defaultView?.getComputedStyle(node);
      const value = readResolvedIconColor({ color: style?.color });
      seq++;
      resolved.value = value !== '' ? value : ICON_INK_FALLBACK;
      return;
    }

    // Query acquisition order:
    // 1. The component's mp `$scope` — the WeChat Component instance natively
    //    owns `createSelectorQuery` and `.in($scope)` scopes natively (see
    //    pickMpQueryHostKind).
    // 2. The uni host (free `uni` identifier, rewritten by the uni compilers
    //    — `globalThis.uni` is never assigned on classic MP, see
    //    src/uni-env.d.ts) — page-level query, `.in(Vue proxy)` best effort.
    const proxy = instance?.proxy as { $scope?: IconUniHost; $?: { scope?: IconUniHost } } | null;
    const scope = proxy?.$scope ?? proxy?.$?.scope;
    const globalHost = resolveUniHost<IconUniHost>();
    const picked = pickMpQueryHost(scope, globalHost, instance?.proxy);
    if (picked.kind === null || instance === null) {
      resolved.value = ICON_INK_FALLBACK;
      return;
    }
    const { createQuery, queryScope } = picked;

    const current = ++seq;
    nextTick(() => {
      if (current !== seq) return;
      try {
        createQuery()
          .in(queryScope)
          .select(ICON_SELECTOR)
          .fields({ computedStyle: ['color'] }, (ret) => {
            if (current !== seq) return;
            const value = readResolvedIconColor(ret);
            if (value !== '') {
              resolved.value = value;
              return;
            }
            if (attempt < RETRY_DELAYS_MS.length) {
              retryTimer = setTimeout(() => {
                retryTimer = null;
                if (current === seq) resolve(attempt + 1);
              }, RETRY_DELAYS_MS[attempt]);
            } else {
              settleToInk(current);
            }
          })
          .exec();
      } catch {
        if (attempt < RETRY_DELAYS_MS.length) {
          retryTimer = setTimeout(() => {
            retryTimer = null;
            if (current === seq) resolve(attempt + 1);
          }, RETRY_DELAYS_MS[attempt]);
        } else {
          settleToInk(current);
        }
      }
    });
  }

  onMounted(() => resolve());
  watch(color, () => resolve());
  onBeforeUnmount(() => {
    seq++;
    if (retryTimer !== null) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  });

  return resolved;
}
