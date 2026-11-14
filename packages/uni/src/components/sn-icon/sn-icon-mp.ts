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
function needsComputedColor(): boolean {
  return typeof document === 'undefined';
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

  function resolve(retried = false): void {
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
    if (!needsComputedColor()) return;

    const uniHost = (globalThis as { uni?: IconUniHost }).uni;
    const createSelectorQuery = uniHost?.createSelectorQuery;
    if (typeof createSelectorQuery !== 'function' || instance === null) {
      resolved.value = ICON_INK_FALLBACK;
      return;
    }

    const current = ++seq;
    nextTick(() => {
      if (current !== seq) return;
      try {
        createSelectorQuery
          .call(uniHost)
          .in(instance.proxy)
          .select(ICON_SELECTOR)
          .fields({ computedStyle: ['color'] }, (ret) => {
            if (current !== seq) return;
            const value = readResolvedIconColor(ret);
            if (value !== '') {
              resolved.value = value;
              return;
            }
            if (!retried) {
              retryTimer = setTimeout(() => {
                if (current === seq) resolve(true);
              }, 50);
              return;
            }
            resolved.value = ICON_INK_FALLBACK;
          })
          .exec();
      } catch {
        if (current === seq) resolved.value = ICON_INK_FALLBACK;
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
