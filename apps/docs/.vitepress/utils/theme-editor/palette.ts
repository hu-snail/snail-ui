/**
 * theme-editor/palette — 品牌色 → 11 级色阶（50…950）的纯函数。
 *
 * ## 为什么不是手写一张色板
 *
 * 主题编辑器只让用户选一个品牌主色（brand color），但组件消费的是整条
 * 色阶 + 由它派生出的语义 token（`action-primary` / `action-primary-hover` /
 * `*-soft` / `ring` …）。手写色板既不可维护，也无法覆盖任意用户自选色，所以
 * 色阶在浏览器里按 HSL 生成：
 *
 *   - 150…950 的亮度锚点固定（与 Tailwind zinc / orange 的亮度曲线一致），
 *     保证任何主色都得到「50 最浅、950 最深」的单调色阶；
 *   - 饱和度以主色饱和度为中心，向两端收：浅色端提亮会自然掉饱和，深色端
 *     同理，浅层保留一点色相感（否则 50/100 会变成近灰，卡片底色失去品牌感）；
 *   - 锚点内置在代码里而不是从主色反推亮度，是为了「换色不换明暗节奏」——
 *     主色偏亮的色（如黄）也能得到可用的 900/950。
 *
 * 全部是纯函数（无 DOM、无状态），因此可以在 SSR / 测试里直接调用。
 */

/** 色阶档位名，顺序即展示顺序。 */
export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];

/** 一条完整的 11 级色阶。 */
export type ColorRamp = Record<ScaleStep, string>;

/**
 * 各档位的目标亮度（L，0–1）。
 *
 * 取自 Tailwind 家族的亮度曲线：`500` 落在 55% 附近，正好是橙色系主色的
 * 天然位置；`50` 97% ≈ 卡片底色，`950` 14% ≈ 深色文字/描边。
 */
const LIGHTNESS: Record<ScaleStep, number> = {
  50: 0.97,
  100: 0.945,
  200: 0.9,
  300: 0.82,
  400: 0.69,
  500: 0.55,
  600: 0.47,
  700: 0.38,
  800: 0.3,
  900: 0.23,
  950: 0.14,
};

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** `#rgb` / `#rrggbb` → RGB。非法输入返回 null。 */
export function hexToRgb(hex: string): Rgb | null {
  const value = hex.trim().replace(/^#/, '');
  const expanded =
    value.length === 3
      ? value
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : value;
  if (!/^[0-9a-f]{6}$/i.test(expanded)) return null;
  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

/** RGB → `#rrggbb`（分量自动取整 / 夹紧）。 */
export function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (v: number): string =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** RGB → HSL（h: 0–360，s / l: 0–1）。 */
export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return { h: h * 60, s, l };
}

/** HSL → RGB。 */
export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hn = (((h % 360) + 360) % 360) / 360;
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hueToRgb = (t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return {
    r: hueToRgb(hn + 1 / 3) * 255,
    g: hueToRgb(hn) * 255,
    b: hueToRgb(hn - 1 / 3) * 255,
  };
}

/** 归一化为 `#rrggbb`；非法输入回退到 fallback。 */
export function normalizeHex(input: string, fallback = '#000000'): string {
  const rgb = hexToRgb(input);
  return rgb ? rgbToHex(rgb) : fallback;
}

/**
 * 单色态（s = 0）的色阶——"zinc" 基础色。
 *
 * 灰色没有色相，所以不走 HSL 生成：用户选 zinc 时应得到与 Tailwind zinc
 * 一致的整条灰阶（组件文档的默认骨架），而不是某天 HSL 公式微调后偏蓝的灰。
 * 数值取自 zinc 的官方值，与 `@snui/tokens` 的 gray primitive 同源。
 */
const ZINC_RAMP: ColorRamp = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
};

/**
 * 由品牌主色生成 11 级色阶。
 *
 * @param brand 品牌主色（`#rrggbb`；也接受 `#rgb`）。
 * @returns 完整色阶；输入非法时返回 zinc 色板，保证 UI 永远有可用值。
 */
export function buildRamp(brand: string): ColorRamp {
  const rgb = hexToRgb(brand);
  if (!rgb) return { ...ZINC_RAMP };
  const { h, s } = rgbToHsl(rgb);
  // 饱和度足够低 = 用户选了灰 → 直接用 zinc 灰阶，避免"带色相的灰"。
  if (s < 0.04) return { ...ZINC_RAMP };

  const ramp = {} as ColorRamp;
  for (const step of SCALE_STEPS) {
    const target = LIGHTNESS[step];
    const delta = target - LIGHTNESS[500];
    // 距主色越远饱和度衰减越多（浅色端更多，否则 50/100 也像实体色）；
    // 深色端衰减更少，保住"深但不发灰"的品牌色。
    const decay = delta > 0 ? 0.5 : 0.35;
    const sat = Math.min(
      1,
      Math.max(0, s * (1 - Math.abs(delta) * decay) + Math.max(0, delta) * 0.3),
    );
    const light = step === 950 ? 0.12 + target * 0.15 : target;
    ramp[step] = rgbToHex(hslToRgb({ h, s: sat, l: light }));
  }
  return ramp;
}

/**
 * 生成"柔和底色"—— 语义 token `*-soft`（如 `action-primary-soft`）的取色。
 *
 * 组件用它做浅色徽章 / 输入框聚焦底 / 选中行。与 `color-mix()` 相比，这里
 * 直接算混合结果，避免老浏览器不支持 `color-mix` 时整块底色丢失。
 *
 * @param base 基色（`#rrggbb`）
 * @param ratio 与白色混合的比例（0–1，越大越浅）。深色模式下由调用方传入深色底。
 */
export function tint(base: string, ratio = 0.88, towards = '#ffffff'): string {
  const a = hexToRgb(base);
  const b = hexToRgb(towards);
  if (!a || !b) return base;
  const mix = (x: number, y: number): number => x + (y - x) * ratio;
  return rgbToHex({ r: mix(a.r, b.r), g: mix(a.g, b.g), b: mix(a.b, b.b) });
}

/** 判断一个 CSS 颜色字符串是否为纯色值（非 var()/gradient），用于色块展示。 */
export function isConcreteColor(value: string): boolean {
  return hexToRgb(value) !== null;
}

export { ZINC_RAMP };
