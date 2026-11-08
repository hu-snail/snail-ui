/**
 * theme-editor/vars — 主题配置 → CSS 变量块（Web / uni 两端）+ 全站应用 CSS。
 *
 * ## 三层职责
 *
 *   1. `deriveSemanticColors()` —— 配置展开成一份语义色表（纯数据）；
 *   2. `buildWebVars()` / `buildMpVars()` —— 序列化成两端的变量映射；
 *   3. `buildSiteCss()` —— 把变量渲染成**全站生效**的 CSS（`:root` + `.dark`），
 *      由 `state.ts` 注入 `document.head`，于是整个文档站（而不只是预览区）
 *      跟着主题走。
 *
 * ## 为什么变量名要跟组件真实消费的名字对齐
 *
 * 组件 CSS 读的是 `--sn-web-*` / `--sn-mp-*`（见 packages/tokens-web|tokens-mp）。
 * 编辑器若自造名字，预览就会「看起来有主题、实际组件没变」。所以这里逐个按
 * 真实别名清单输出：颜色、`radius-*`、`spacing-*`、`shadow-*`、`font-*`、
 * `focus-ring` 等阶梯变量全部落地。
 *
 * 颜色槽位一律字面值（`#rrggbb`），不用 `var(--aui-*)` 间接引用 —— 站点被
 * 覆盖时不必再猜 `--aui` 层的值，且导出 CSS 片段可以独立粘贴使用。
 *
 * 纯函数，无 DOM；SSR / 测试可直接调用。
 */

import { buildRamp, normalizeHex, tint, type ColorRamp, type ScaleStep } from './palette';

// ─── 配置模型 ──────────────────────────────────────────────────────────────

/** 模式。auto = 跟随文档站外观（浅色/深色）。 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/** 调色板预设（决定中性色 / 描边 / 表面的基色）。 */
export type PaletteName = 'zinc' | 'slate' | 'stone' | 'neutral' | 'gray';

/** 尺寸档（控制组件高度 / 字号基数）。 */
export type SizeName = 'small' | 'medium' | 'large';

/** 间距档（控制内边距 / 组件间隙）。 */
export type SpacingName = 'compact' | 'default' | 'loose';

/** 字体族槽位。 */
export interface FontFamilies {
  sans: string;
  serif: string;
  mono: string;
  heading: string;
}

/** 表面风格：扁平（无阴影）/ 层叠（卡片与浮层浮起）。 */
export type SurfaceStyle = 'flat' | 'layered';

/** 反馈色槽位。 */
export interface FeedbackColors {
  danger: string;
  success: string;
  warning: string;
  info: string;
}

/** 编辑器暴露的全部可调项。 */
export interface ThemeEditorConfig {
  mode: ThemeMode;
  palette: PaletteName;
  /** 品牌主色（生成整条 50…950 色阶）。 */
  brand: string;
  /** 辅助色（secondary）。 */
  secondary: string;
  /** 强调色（accent）。 */
  accent: string;
  /** 中性/碳色（carbon，深色实心填充）。 */
  carbon: string;
  feedback: FeedbackColors;
  size: SizeName;
  spacing: SpacingName;
  fonts: FontFamilies;
  /** 控件圆角（rem）。 */
  radius: number;
  /** 描边透明度 0–100（0 = 无描边，100 = 实色）。 */
  borderAlpha: number;
  surface: SurfaceStyle;
}

/** 工厂默认值 —— 与文档站视觉基线一致（橙品牌色 + zinc 中性 + 0.375rem 圆角）。 */
export const DEFAULT_CONFIG: ThemeEditorConfig = {
  mode: 'auto',
  palette: 'zinc',
  brand: '#ff4d24',
  secondary: '#e5e5e5',
  accent: '#71717a',
  carbon: '#27272a',
  feedback: {
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  size: 'medium',
  spacing: 'default',
  fonts: {
    sans: 'system',
    serif: 'system',
    mono: 'system',
    heading: 'system',
  },
  radius: 0.375,
  borderAlpha: 100,
  surface: 'layered',
};

/** 浅拷贝 + 深拷贝嵌套对象，避免共享默认对象。 */
export function cloneConfig(config: ThemeEditorConfig): ThemeEditorConfig {
  return {
    ...config,
    feedback: { ...config.feedback },
    fonts: { ...config.fonts },
  };
}

// ─── 调色板 / 字体 / 尺寸表 ────────────────────────────────────────────────

/**
 * 五套中性色板：色相 + 极低饱和度，得到「同色相的灰」——
 * slate 偏蓝、stone 偏暖，正是这几套中性色的辨识点。
 */
const PALETTE_BASE: Record<PaletteName, { hue: number; sat: number }> = {
  zinc: { hue: 240, sat: 0.05 },
  slate: { hue: 215, sat: 0.16 },
  stone: { hue: 24, sat: 0.06 },
  neutral: { hue: 0, sat: 0 },
  gray: { hue: 220, sat: 0.13 },
};

export const PALETTE_NAMES: PaletteName[] = ['zinc', 'slate', 'stone', 'neutral', 'gray'];

/** 中性色的亮度锚点。 */
const NEUTRAL_LIGHTNESS: Record<ScaleStep, number> = {
  50: 0.985,
  100: 0.96,
  200: 0.92,
  300: 0.87,
  400: 0.71,
  500: 0.55,
  600: 0.45,
  700: 0.35,
  800: 0.27,
  900: 0.19,
  950: 0.11,
};

function hslToRgbLocal(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hn = (((h % 360) + 360) % 360) / 360;
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue = (t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return { r: hue(hn + 1 / 3) * 255, g: hue(hn) * 255, b: hue(hn - 1 / 3) * 255 };
}

function rgbToHexLocal({ r, g, b }: { r: number; g: number; b: number }): string {
  const toHex = (v: number): string =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** 由调色板名生成中性灰阶。 */
function buildNeutralRamp(name: PaletteName): ColorRamp {
  const { hue, sat } = PALETTE_BASE[name];
  const ramp = {} as ColorRamp;
  for (const step of Object.keys(NEUTRAL_LIGHTNESS) as unknown as ScaleStep[]) {
    const l = NEUTRAL_LIGHTNESS[step];
    ramp[step] = rgbToHexLocal(hslToRgbLocal(hue, sat, l));
  }
  return ramp;
}

/** 字体族槽位 → 真实 font-family 栈。 */
const FONT_STACKS: Record<string, string> = {
  system:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Microsoft YaHei', sans-serif",
  inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  geist: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  serif: "Georgia, 'Times New Roman', 'Songti SC', serif",
  mono: "'JetBrains Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
};

export const FONT_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'system', label: '系统' },
  { value: 'inter', label: 'Inter' },
  { value: 'geist', label: 'Geist' },
  { value: 'serif', label: '衬线' },
  { value: 'mono', label: '等宽' },
];

/** 字体槽位 token → 真实 font-family 栈（编辑器与 library 桥接层共用）。 */
export function fontStackFor(token: string): string {
  return FONT_STACKS[token] ?? FONT_STACKS['system'] ?? 'sans-serif';
}

/** 尺寸档 → 控件高度 / 字体基数（px）+ 圆角偏移。 */
const SIZE_PRESETS: Record<SizeName, { control: number; font: number; radiusBoost: number }> = {
  small: { control: 32, font: 13, radiusBoost: -0.125 },
  medium: { control: 36, font: 14, radiusBoost: 0 },
  large: { control: 44, font: 16, radiusBoost: 0.125 },
};

/** 间距档 → spacing 全尺度（px）。 */
const SPACING_PRESETS: Record<SpacingName, Record<string, number>> = {
  compact: {
    0: 0,
    1: 2,
    2: 4,
    3: 6,
    4: 10,
    5: 12,
    6: 16,
    8: 20,
    10: 24,
    12: 32,
    16: 44,
    20: 56,
    24: 72,
  },
  default: {
    0: 0,
    1: 2,
    2: 4,
    3: 8,
    4: 12,
    5: 16,
    6: 20,
    8: 24,
    10: 32,
    12: 40,
    16: 56,
    20: 72,
    24: 96,
  },
  loose: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 56,
    16: 72,
    20: 96,
    24: 128,
  },
};

export const SIZE_OPTIONS: ReadonlyArray<{ value: SizeName; label: string }> = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
];

export const SPACING_OPTIONS: ReadonlyArray<{ value: SpacingName; label: string }> = [
  { value: 'compact', label: '紧凑' },
  { value: 'default', label: '默认' },
  { value: 'loose', label: '宽松' },
];

/** 圆角阶梯的倍率（相对 `config.radius`）—— 一个种子驱动整条圆角刻度。 */
const RADIUS_STEPS: ReadonlyArray<{ name: string; factor: number }> = [
  { name: 'none', factor: 0 },
  { name: 'xs', factor: 0.25 },
  { name: 'sm', factor: 0.5 },
  { name: 'md', factor: 1 },
  { name: 'lg', factor: 1.5 },
  { name: 'xl', factor: 2.5 },
  { name: 'full', factor: 9999 },
];

// ─── 语义色表 ──────────────────────────────────────────────────────────────

/** 展开后的语义色（全部为可直接落地的 CSS 颜色值）。 */
export interface SemanticColors {
  primary: ColorRamp;
  secondary: ColorRamp;
  accent: ColorRamp;
  carbon: ColorRamp;
  neutral: ColorRamp;
  danger: ColorRamp;
  success: ColorRamp;
  warning: ColorRamp;
  info: ColorRamp;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    onPrimary: string;
    inverse: string;
  };
  background: {
    surface: string;
    elevated: string;
    subtle: string;
    sunken: string;
    overlay: string;
  };
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };
  /** 语义槽位 + 各自的 foreground / soft（对比度卡与填充按钮用）。 */
  semantics: {
    danger: string;
    success: string;
    warning: string;
    info: string;
    dangerForeground: string;
    successForeground: string;
    warningForeground: string;
    infoForeground: string;
    dangerSoft: string;
    successSoft: string;
    warningSoft: string;
    infoSoft: string;
    secondaryForeground: string;
    accentForeground: string;
    carbonForeground: string;
  };
}

/** 相对亮度（WCAG），用于给语义色挑前置色（黑/白）。 */
function relativeLuminance(hex: string): number {
  const value = normalizeHex(hex);
  const channel = (start: number): number => {
    const v = parseInt(value.slice(start, start + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/** 前景色：亮底配黑，暗底配白（阈值按对比度而非「感觉」）。 */
function foregroundFor(hex: string): string {
  return relativeLuminance(hex) > 0.55 ? '#0a0a0a' : '#ffffff';
}

/** `rgba()` 形式的描边色（透明度来自 borderAlpha 滑杆）。 */
function withAlpha(hex: string, alphaPct: number): string {
  const value = normalizeHex(hex);
  const a = Math.min(100, Math.max(0, alphaPct)) / 100;
  const r = parseInt(value.slice(1, 3), 16);
  const g = parseInt(value.slice(3, 5), 16);
  const b = parseInt(value.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(2))})`;
}

/**
 * 配置 → 语义色表。
 *
 * @param config 编辑器配置
 * @param resolvedMode 实际生效的明暗（`auto` 已由调用方解析）
 */
export function deriveSemanticColors(
  config: ThemeEditorConfig,
  resolvedMode: 'light' | 'dark',
): SemanticColors {
  const dark = resolvedMode === 'dark';
  const neutral = buildNeutralRamp(config.palette);
  const primary = buildRamp(config.brand);
  const secondary = buildRamp(config.secondary);
  const accent = buildRamp(config.accent);
  const carbon = buildRamp(config.carbon);
  const danger = buildRamp(config.feedback.danger);
  const success = buildRamp(config.feedback.success);
  const warning = buildRamp(config.feedback.warning);
  const info = buildRamp(config.feedback.info);

  const softTowards = dark ? neutral[950] : '#ffffff';

  return {
    primary,
    secondary,
    accent,
    carbon,
    neutral,
    danger,
    success,
    warning,
    info,
    text: {
      primary: dark ? neutral[50] : neutral[950],
      secondary: dark ? neutral[400] : neutral[600],
      tertiary: dark ? neutral[500] : neutral[500],
      disabled: dark ? neutral[700] : neutral[300],
      onPrimary: foregroundFor(primary[500]),
      inverse: dark ? neutral[950] : '#ffffff',
    },
    background: {
      surface: dark ? neutral[950] : '#ffffff',
      elevated: dark ? neutral[900] : '#ffffff',
      subtle: dark ? neutral[900] : neutral[100],
      sunken: dark ? neutral[950] : neutral[50],
      overlay: dark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(15, 23, 42, 0.45)',
    },
    border: {
      default: withAlpha(dark ? neutral[700] : neutral[300], config.borderAlpha),
      subtle: withAlpha(dark ? neutral[800] : neutral[200], config.borderAlpha),
      strong: withAlpha(dark ? neutral[600] : neutral[400], config.borderAlpha),
      focus: primary[500],
    },
    semantics: {
      danger: danger[500],
      success: success[500],
      warning: warning[500],
      info: info[500],
      dangerForeground: foregroundFor(danger[500]),
      successForeground: foregroundFor(success[500]),
      warningForeground: foregroundFor(warning[500]),
      infoForeground: foregroundFor(info[500]),
      dangerSoft: tint(danger[500], 0.88, softTowards),
      successSoft: tint(success[500], 0.88, softTowards),
      warningSoft: tint(warning[500], 0.88, softTowards),
      infoSoft: tint(info[500], 0.88, softTowards),
      secondaryForeground: foregroundFor(secondary[500]),
      accentForeground: foregroundFor(accent[500]),
      carbonForeground: foregroundFor(carbon[500]),
    },
  };
}

// ─── 变量映射（两端） ──────────────────────────────────────────────────────

/** 变量映射：CSS 自定义属性名 → 值。 */
export type VarMap = Record<string, string>;

/** 圆角阶梯（px 与 rem 两种表示，两端各取其一）。 */
function radiusLadder(config: ThemeEditorConfig): Record<string, number> {
  const size = SIZE_PRESETS[config.size];
  const base = Math.max(0, config.radius + size.radiusBoost);
  const out: Record<string, number> = {};
  for (const step of RADIUS_STEPS) {
    // full 用极大值表达「胶囊」；换算成 px 时会被各端钳到半宽。
    out[step.name] = step.factor === 9999 ? 9999 : base * step.factor;
  }
  return out;
}

/** 阴影阶梯：扁平 = 全 none；层叠 = 逐级加深。 */
function shadowLadder(
  config: ThemeEditorConfig,
  resolvedMode: 'light' | 'dark',
): Record<string, string> {
  if (config.surface === 'flat') {
    return { none: 'none', xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'none' };
  }
  const dark = resolvedMode === 'dark';
  return {
    none: 'none',
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: dark ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(15,23,42,0.08)',
    md: dark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(15,23,42,0.08)',
    lg: dark ? '0 10px 28px rgba(0,0,0,0.55)' : '0 10px 28px rgba(15,23,42,0.10)',
    xl: dark ? '0 18px 44px rgba(0,0,0,0.6)' : '0 18px 44px rgba(15,23,42,0.12)',
  };
}

/**
 * Web 端变量。
 *
 * 键与 `@snui/vue-web` 组件 CSS 实际读取的 `--sn-web-*` 名字对齐
 * （见 packages/vue-web/dist/styles/index.css 的别名块），因此预览里渲染的
 * 是**真实组件**，不是示意图。
 */
export function buildWebVars(
  config: ThemeEditorConfig,
  colors: SemanticColors,
  resolvedMode: 'light' | 'dark',
): VarMap {
  const size = SIZE_PRESETS[config.size];
  const spacing = SPACING_PRESETS[config.spacing];
  const radii = radiusLadder(config);
  const shadows = shadowLadder(config, resolvedMode);
  const px = (n: number): string => `${Number(n.toFixed(3))}px`;

  const vars: VarMap = {
    // ── 语义色 ──
    '--sn-web-color-text-primary': colors.text.primary,
    '--sn-web-color-text-secondary': colors.text.secondary,
    '--sn-web-color-text-tertiary': colors.text.tertiary,
    '--sn-web-color-text-disabled': colors.text.disabled,
    '--sn-web-color-text-on-primary': colors.text.onPrimary,
    '--sn-web-color-background-surface': colors.background.surface,
    '--sn-web-color-background-elevated': colors.background.elevated,
    '--sn-web-color-background-subtle': colors.background.subtle,
    '--sn-web-color-background-overlay': colors.background.overlay,
    '--sn-web-color-border-default': colors.border.default,
    '--sn-web-color-border-subtle': colors.border.subtle,
    '--sn-web-color-action-primary': colors.primary[500],
    '--sn-web-color-action-primary-hover': colors.primary[600],
    '--sn-web-color-action-primary-soft': tint(colors.primary[500], 0.9, colors.background.surface),
    '--sn-web-color-feedback-success': colors.semantics.success,
    '--sn-web-color-feedback-warning': colors.semantics.warning,
    '--sn-web-color-feedback-danger': colors.semantics.danger,
    '--sn-web-color-feedback-danger-hover': colors.danger[600],
    '--sn-web-color-feedback-info': colors.semantics.info,
    '--sn-web-focus-ring': tint(colors.primary[500], 0.6, colors.background.surface),

    // ── 圆角阶梯（一个种子驱动整条刻度）──
    '--sn-web-radius-none': px(radii['none'] ?? 0),
    '--sn-web-radius-xs': `${Number((radii['xs'] ?? 0).toFixed(4))}rem`,
    '--sn-web-radius-sm': `${Number((radii['sm'] ?? 0).toFixed(4))}rem`,
    '--sn-web-radius-md': `${Number((radii['md'] ?? 0).toFixed(4))}rem`,
    '--sn-web-radius-lg': `${Number((radii['lg'] ?? 0).toFixed(4))}rem`,
    '--sn-web-radius-xl': `${Number((radii['xl'] ?? 0).toFixed(4))}rem`,
    '--sn-web-radius-full': '9999px',

    // ── 组件形状 ──
    '--sn-web-button-radius': `${Number((radii['md'] ?? 0).toFixed(4))}rem`,
    '--sn-web-button-height-tiny': px(size.control - 12),
    '--sn-web-button-height-small': px(size.control - 4),
    '--sn-web-button-height-medium': px(size.control),
    '--sn-web-button-height-large': px(size.control + 8),
    '--sn-web-button-padding-x': px(spacing[4] ?? 12),
    '--sn-web-button-font-size': px(size.font),
    '--sn-web-button-shadow': shadows['xs'] ?? 'none',
    '--sn-web-input-radius': `${Number((radii['md'] ?? 0).toFixed(4))}rem`,
    '--sn-web-input-height-small': px(size.control - 8),
    '--sn-web-input-height-medium': px(size.control - 2),
    '--sn-web-input-height-large': px(size.control + 6),
    '--sn-web-input-padding-x': px(spacing[3] ?? 8),
    '--sn-web-card-radius': `${Number((radii['lg'] ?? 0).toFixed(4))}rem`,
    '--sn-web-card-padding': px(spacing[5] ?? 16),
    '--sn-web-card-shadow': shadows['sm'] ?? 'none',
    '--sn-web-skeleton-radius': `${Number((radii['sm'] ?? 0).toFixed(4))}rem`,
    '--sn-web-dialog-radius': `${Number((radii['lg'] ?? 0).toFixed(4))}rem`,
    '--sn-web-dialog-box-shadow': shadows['xl'] ?? 'none',
    '--sn-web-drawer-radius': `${Number((radii['lg'] ?? 0).toFixed(4))}rem`,
    '--sn-web-drawer-box-shadow': shadows['xl'] ?? 'none',
    '--sn-web-drawer-mask-color': colors.background.overlay,

    // ── 间距阶梯 ──
    '--sn-web-font-family-body': fontStackFor(config.fonts.sans),
    '--sn-web-font-family-heading': fontStackFor(config.fonts.heading),
    '--sn-web-font-family-code': fontStackFor(config.fonts.mono),
    '--sn-web-font-size-xs': px(Math.max(10, size.font - 3)),
    '--sn-web-font-size-sm': px(Math.max(10, size.font - 2)),
    '--sn-web-font-size-md': px(size.font),
    '--sn-web-font-size-lg': px(size.font + 2),
    '--sn-web-font-size-xl': px(size.font + 4),
    '--sn-web-font-size-2xl': px(size.font + 6),
    '--sn-web-font-line-height-tight': '1.25',
    '--sn-web-font-line-height-normal': '1.55',
    '--sn-web-font-line-height-loose': '1.8',
    '--sn-web-font-weight-normal': '400',
    '--sn-web-font-weight-medium': '500',
    '--sn-web-font-weight-semibold': '600',
    '--sn-web-font-weight-bold': '700',
    '--sn-web-icon-size-tiny': px(12),
    '--sn-web-icon-size-small': px(14),
    '--sn-web-icon-size-medium': px(16),
    '--sn-web-icon-size-large': px(20),
    '--sn-web-icon-size-xlarge': px(24),
    '--sn-web-icon-stroke-width': '2',
  };

  for (const [key, value] of Object.entries(spacing)) {
    vars[`--sn-web-spacing-${key}`] = px(value);
  }
  for (const [key, value] of Object.entries(shadows)) {
    vars[`--sn-web-shadow-${key}`] = value;
  }
  for (const [key, value] of Object.entries(colors.primary)) {
    vars[`--sn-web-color-primary-${key}`] = value;
  }
  for (const [key, value] of Object.entries(colors.neutral)) {
    vars[`--sn-web-color-neutral-${key}`] = value;
  }
  // 图表色阶（chart-1…5）：由 primary 派生，供 ECharts / 图表卡使用。
  const chartSteps: ScaleStep[] = [600, 500, 400, 300, 200];
  chartSteps.forEach((step, i) => {
    vars[`--sn-web-chart-${i + 1}`] = colors.primary[step];
  });

  return vars;
}

/**
 * uni 端变量（rpx）。
 *
 * `1rpx = 屏幕宽度 / 750`，按 750 设计稿 → 375px 视口即 `1rpx = 0.5px`。
 * 这里把 px 设计值 ×2 输出 rpx，与 `@snui/tokens-mp` 的约定一致；浏览器不认
 * rpx，由文档站的 `rpx-transform` 编译期插件（以及预览组件的运行时兜底）
 * 换算成 px。
 */
export function buildMpVars(
  config: ThemeEditorConfig,
  colors: SemanticColors,
  resolvedMode: 'light' | 'dark',
): VarMap {
  const size = SIZE_PRESETS[config.size];
  const spacing = SPACING_PRESETS[config.spacing];
  const radii = radiusLadder(config);
  const rpx = (n: number): string => `${Number((n * 2).toFixed(2))}rpx`;

  const vars: VarMap = {
    '--sn-mp-color-text-primary': colors.text.primary,
    '--sn-mp-color-text-secondary': colors.text.secondary,
    '--sn-mp-color-text-tertiary': colors.text.tertiary,
    '--sn-mp-color-text-disabled': colors.text.disabled,
    '--sn-mp-color-text-on-primary': colors.text.onPrimary,
    '--sn-mp-color-background-surface': colors.background.surface,
    '--sn-mp-color-background-elevated': colors.background.elevated,
    '--sn-mp-color-background-subtle': colors.background.subtle,
    '--sn-mp-color-background-soft': colors.background.subtle,
    '--sn-mp-color-background-sunken': colors.background.sunken,
    '--sn-mp-color-background-overlay': colors.background.overlay,
    '--sn-mp-color-border-default': colors.border.default,
    '--sn-mp-color-border-subtle': colors.border.subtle,
    '--sn-mp-color-action-primary': colors.primary[500],
    '--sn-mp-color-action-primary-hover': colors.primary[600],
    '--sn-mp-color-action-primary-soft': tint(colors.primary[500], 0.9, colors.background.surface),
    '--sn-mp-color-feedback-success': colors.semantics.success,
    '--sn-mp-color-feedback-warning': colors.semantics.warning,
    '--sn-mp-color-feedback-danger': colors.semantics.danger,
    '--sn-mp-color-feedback-info': colors.semantics.info,
    '--sn-mp-color-feedback-success-soft': colors.semantics.successSoft,
    '--sn-mp-color-feedback-warning-soft': colors.semantics.warningSoft,
    '--sn-mp-color-feedback-danger-soft': colors.semantics.dangerSoft,
    '--sn-mp-color-feedback-info-soft': colors.semantics.infoSoft,

    '--sn-mp-button-radius': rpx((radii['md'] ?? 0) * 16),
    '--sn-mp-button-height-tiny': rpx(size.control - 12),
    '--sn-mp-button-height-small': rpx(size.control - 4),
    '--sn-mp-button-height-medium': rpx(size.control),
    '--sn-mp-button-height-large': rpx(size.control + 8),
    '--sn-mp-button-padding-x': rpx(spacing[4] ?? 12),
    '--sn-mp-button-font-size': rpx(size.font),
    '--sn-mp-input-radius': rpx((radii['md'] ?? 0) * 16),
    '--sn-mp-input-height-small': rpx(size.control - 8),
    '--sn-mp-input-height-medium': rpx(size.control - 2),
    '--sn-mp-input-height-large': rpx(size.control + 6),
    '--sn-mp-input-padding-x': rpx(spacing[3] ?? 8),
    '--sn-mp-card-radius': rpx((radii['lg'] ?? 0) * 16),
    '--sn-mp-card-padding': rpx(spacing[5] ?? 16),
    '--sn-mp-font-size-xs': rpx(Math.max(9, size.font - 3)),
    '--sn-mp-font-size-sm': rpx(Math.max(10, size.font - 2)),
    '--sn-mp-font-size-md': rpx(size.font),
    '--sn-mp-font-size-lg': rpx(size.font + 2),
    '--sn-mp-font-size-xl': rpx(size.font + 4),
    '--sn-mp-font-size-2xl': rpx(size.font + 6),
    '--sn-mp-font-line-height-tight': '1.25',
    '--sn-mp-font-line-height-normal': '1.55',
    '--sn-mp-font-line-height-loose': '1.8',
    '--sn-mp-icon-size-tiny': rpx(12),
    '--sn-mp-icon-size-small': rpx(14),
    '--sn-mp-icon-size-medium': rpx(16),
    '--sn-mp-icon-size-large': rpx(20),
    '--sn-mp-icon-size-xlarge': rpx(24),
    '--sn-mp-icon-stroke-width': '2',
  };

  // 圆角绝对刻度（组件读的是 --sn-mp-radius-*，不是 --sn-mp-button-radius）
  for (const step of RADIUS_STEPS) {
    const value = step.name === 'full' ? 9999 : (radii[step.name] ?? 0) * 16;
    vars[`--sn-mp-radius-${step.name}`] = rpx(value);
  }
  for (const [key, value] of Object.entries(spacing)) {
    vars[`--sn-mp-spacing-${key}`] = rpx(value);
  }

  return vars;
}

/**
 * 变量映射 → CSS 文本。
 *
 * @param selector 作用域选择器（`:root` / `.dark` / 预览容器）
 * @param vars 变量映射
 * @param extra 额外声明（非 token 的视觉开关，如 font-family 兜底）
 */
export function buildCssBlock(selector: string, vars: VarMap, extra: VarMap = {}): string {
  const lines: string[] = [];
  for (const [name, value] of Object.entries(vars)) {
    lines.push(`  ${name}: ${value};`);
  }
  for (const [name, value] of Object.entries(extra)) {
    lines.push(`  ${name}: ${value};`);
  }
  return `${selector} {\n${lines.join('\n')}\n}`;
}

/**
 * 全站生效 CSS —— 注入 `document.head` 后整个文档站跟着主题走。
 *
 * 结构：
 *   1. `:root` 亮色变量（含两端）
 *   2. `.dark` / `[data-theme="dark"]` 深色变量（VitePress 用 `.dark`）
 *   3. 站点级接线：把 `--vp-c-*` 映射到主题色，使 VitePress 的页面背景、
 *      文字、分隔线、品牌色一起变（组件之外的「整站」部分）
 *
 * @param config 配置
 * @param resolvedMode 当前实际明暗（决定亮/暗两块的「基准」）
 */
export function buildSiteCss(config: ThemeEditorConfig, resolvedMode: 'light' | 'dark'): string {
  const lightColors = deriveSemanticColors(config, 'light');
  const darkColors = deriveSemanticColors(config, 'dark');

  const lightWeb = buildWebVars(config, lightColors, 'light');
  const lightMp = buildMpVars(config, lightColors, 'light');
  const darkWeb = buildWebVars(config, darkColors, 'dark');
  const darkMp = buildMpVars(config, darkColors, 'dark');

  // VitePress 自身的 chrome 变量 → 主题色。这一层是「整站生效」的关键：
  // 否则页面背景 / 正文 / 分隔线仍由站点默认的 --vp-c-* 决定，只有组件变。
  const vpLight: VarMap = {
    '--vp-c-bg': lightColors.background.surface,
    '--vp-c-bg-alt': lightColors.background.subtle,
    '--vp-c-bg-soft': lightColors.background.subtle,
    '--vp-c-bg-elv': lightColors.background.elevated,
    '--vp-c-text-1': lightColors.text.primary,
    '--vp-c-text-2': lightColors.text.secondary,
    '--vp-c-text-3': lightColors.text.tertiary,
    '--vp-c-divider': lightColors.border.default,
    '--vp-c-border': lightColors.border.strong,
    '--vp-c-gutter': lightColors.border.subtle,
    '--vp-c-brand-1': lightColors.primary[500],
    '--vp-c-brand-2': lightColors.primary[600],
    '--vp-c-brand-3': lightColors.primary[700],
    '--vp-c-brand-soft': tint(lightColors.primary[500], 0.88, lightColors.background.surface),
    '--vp-font-family-base': fontStackFor(config.fonts.sans),
    '--vp-font-family-mono': fontStackFor(config.fonts.mono),
  };

  const vpDark: VarMap = {
    '--vp-c-bg': darkColors.background.surface,
    '--vp-c-bg-alt': darkColors.background.subtle,
    '--vp-c-bg-soft': darkColors.background.subtle,
    '--vp-c-bg-elv': darkColors.background.elevated,
    '--vp-c-text-1': darkColors.text.primary,
    '--vp-c-text-2': darkColors.text.secondary,
    '--vp-c-text-3': darkColors.text.tertiary,
    '--vp-c-divider': darkColors.border.default,
    '--vp-c-border': darkColors.border.strong,
    '--vp-c-gutter': darkColors.border.subtle,
    '--vp-c-brand-1': darkColors.primary[400],
    '--vp-c-brand-2': darkColors.primary[500],
    '--vp-c-brand-3': darkColors.primary[600],
    '--vp-c-brand-soft': tint(darkColors.primary[500], 0.85, darkColors.background.surface),
    '--vp-font-family-base': fontStackFor(config.fonts.sans),
    '--vp-font-family-mono': fontStackFor(config.fonts.mono),
  };

  // 预览容器的选择器：预览块自带作用域，两端各一份。
  const previewWebSelector = '.sn-theme-preview-web';
  const previewMpSelector = '.sn-mp-preview';

  const baseVars = { ...lightWeb, ...lightMp };

  return [
    '/* ── AUI 主题编辑器：全站变量（亮色） ── */',
    buildCssBlock(':root', baseVars, vpLight),
    '',
    '/* ── 深色：VitePress 用 .dark，同时兼容 data-theme ── */',
    buildCssBlock('.dark, [data-theme="dark"]', { ...darkWeb, ...darkMp }, vpDark),
    '',
    '/* ── 预览容器：Web 端变量（脱离 :root 也能独立生效） ── */',
    buildCssBlock(previewWebSelector, lightWeb),
    buildCssBlock(
      `.dark ${previewWebSelector}, [data-theme="dark"] ${previewWebSelector}`,
      darkWeb,
    ),
    '',
    '/* ── 预览容器：uni 端变量（rpx 由 rpx-transform 编译期换算） ── */',
    buildCssBlock(previewMpSelector, lightMp),
    buildCssBlock(`.dark ${previewMpSelector}, [data-theme="dark"] ${previewMpSelector}`, darkMp),
    '',
    `/* resolvedMode at export: ${resolvedMode} */`,
  ].join('\n');
}

/** 供外部展示 / 复制：当前配置的完整 CSS（两端各一块，仅变量）。 */
export function buildFullCss(config: ThemeEditorConfig, resolvedMode: 'light' | 'dark'): string {
  const colors = deriveSemanticColors(config, resolvedMode);
  return [
    '/* AUI 主题编辑器 — Web 端（--sn-web-*） */',
    buildCssBlock(':root', buildWebVars(config, colors, resolvedMode)),
    '',
    '/* AUI 主题编辑器 — uni 端（--sn-mp-*，rpx） */',
    buildCssBlock(':root', buildMpVars(config, colors, resolvedMode)),
  ].join('\n');
}

/** 品牌色阶（预览里的 50 → 950 色带用）。 */
export function primaryScale(config: ThemeEditorConfig): ColorRamp {
  return buildRamp(config.brand);
}

export { RADIUS_STEPS, SPACING_PRESETS, SIZE_PRESETS };
