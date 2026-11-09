/**
 * theme-editor/state — 主题编辑器的共享状态（模块级单例）+ 全站应用。
 *
 * ## 一次改动，两件事同时发生
 *
 *   1. 配置写入响应式单例（配置栏 / 两端预览都读它）；
 *   2. 重新生成 `buildSiteCss()` 并**注入 `document.head`**，于是整个文档站
 *      （页面背景、正文、分隔线、品牌色，以及所有页面上的组件）跟着变 ——
 *      不只是编辑器右侧那块预览。
 *
 * ## 为什么默认值要「读」而不是写死
 *
 * 编辑器打开时应当显示**站点当前真实在用的主题**，而不是编辑器自己编的默认值。
 * `readSiteTheme()` 从 `:root` 采样已解析的 CSS 变量（`--sn-web-*` / `--vp-c-*`），
 * 反推出品牌色、中性色板、圆角、字体与间距档位，再作为初始配置。这样：
 *
 *   - 第一次进入编辑器看到的就是站点本来的样子；
 *   - 「重置」回到站点默认（而不是回到一个陌生配色）；
 *   - 与其它主题入口（StyleSwitcher / style-packs）不冲突 —— 谁最后写入谁生效。
 */

import { computed, ref, watch } from 'vue';
import {
  DEFAULT_CONFIG,
  cloneConfig,
  deriveSemanticColors,
  type ThemeEditorConfig,
  type PaletteName,
  type SizeName,
  type SpacingName,
} from './vars';
import { BUILTIN_THEMES } from '@snui/tokens';
import { buildProjectSnippet, buildSiteCss } from './library';
import { hexToRgb, rgbToHex } from './palette';

/** 注入到 head 的 `<style>` 元素 id。 */
const STYLE_ID = 'snui-theme-editor-css';

/** localStorage 存档 key。 */
const STORAGE_KEY = 'snui-theme-editor-config';

/** 当前配置（响应式）。 */
export const themeConfig = ref<ThemeEditorConfig>(cloneConfig(DEFAULT_CONFIG));

/** 站点默认配置（打开编辑器时采样得到；「重置」回这里）。 */
export const siteDefaultConfig = ref<ThemeEditorConfig>(cloneConfig(DEFAULT_CONFIG));

/** 配置是否偏离站点默认（决定「重置」按钮可用性）。 */
export const isDirty = computed(
  () => JSON.stringify(themeConfig.value) !== JSON.stringify(siteDefaultConfig.value),
);

// ─── 采样站点当前主题 ──────────────────────────────────────────────────────

/** 读一个 CSS 变量的已解析值。 */
function readVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** 把任意 CSS 颜色（hex / rgb / rgba）归一成 `#rrggbb`；失败返回 null。 */
function toHex(value: string): string | null {
  if (!value) return null;
  const direct = hexToRgb(value);
  if (direct) return rgbToHex(direct);
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = (m[1] ?? '').split(',').map((s) => parseFloat(s.trim()));
  if (parts.length < 3) return null;
  const [r, g, b] = parts as [number, number, number];
  return rgbToHex({ r, g, b });
}

/** 由一个色值推断最接近的中性色板（比较与五套中性板 500 的色相距离）。 */
function inferPalette(hex: string): PaletteName {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'zinc';
  // 低饱和 → 视为中性；再看冷暖倾向
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const chroma = max - min;
  if (chroma < 8) return 'neutral';
  if (rgb.b > rgb.r + 8) return 'slate';
  if (rgb.r > rgb.b + 8) return 'stone';
  return 'zinc';
}

/** 由控件高度推断尺寸档。 */
function inferSize(controlHeight: number): SizeName {
  if (!Number.isFinite(controlHeight) || controlHeight <= 0) return 'medium';
  if (controlHeight <= 34) return 'small';
  if (controlHeight >= 42) return 'large';
  return 'medium';
}

/** 由 spacing-4 推断间距档。 */
function inferSpacing(spacing4: number): SpacingName {
  if (!Number.isFinite(spacing4) || spacing4 <= 0) return 'default';
  if (spacing4 <= 11) return 'compact';
  if (spacing4 >= 15) return 'loose';
  return 'default';
}

/** 把 px 圆角（如 6px）折回 rem 种子（1rem = 16px）。 */
function pxToRemSeed(px: number): number {
  if (!Number.isFinite(px) || px <= 0) return 0.375;
  return Number((px / 16).toFixed(3));
}

/**
 * 从站点已解析的 CSS 变量采样出一份配置。
 *
 * 只采样「能从现有站点推断」的槽位：品牌色 / 中性色 / 反馈色 / 圆角 / 尺寸 /
 * 间距。字体槽位与表面风格无法从解析后的 font-family 栈反推（栈里含回退），
 * 因此保留工厂默认，避免把回退字体误当成用户选择。
 */
export function readSiteTheme(): ThemeEditorConfig {
  const base = cloneConfig(DEFAULT_CONFIG);
  if (typeof window === 'undefined') return base;

  const brand = toHex(readVar('--sn-web-color-action-primary'));
  const textPrimary = toHex(readVar('--sn-web-color-text-primary'));
  const surface =
    toHex(readVar('--vp-c-bg')) ?? toHex(readVar('--sn-web-color-background-surface'));
  const danger = toHex(readVar('--sn-web-color-feedback-danger'));
  const success = toHex(readVar('--sn-web-color-feedback-success'));
  const warning = toHex(readVar('--sn-web-color-feedback-warning'));
  const info = toHex(readVar('--sn-web-color-feedback-info'));
  const border = readVar('--sn-web-color-border-default');

  const buttonHeight = parseFloat(readVar('--sn-web-button-height-medium'));
  const buttonRadiusPx = parseFloat(readVar('--sn-web-button-radius'));
  const spacing4 = parseFloat(readVar('--sn-web-spacing-4'));

  const next: ThemeEditorConfig = {
    ...base,
    ...(brand ? { brand } : {}),
    ...(danger ? { feedback: { ...base.feedback, danger } } : {}),
    ...(success ? { feedback: { ...base.feedback, success } } : {}),
    ...(warning ? { feedback: { ...base.feedback, warning } } : {}),
    ...(info ? { feedback: { ...base.feedback, info } } : {}),
    palette: textPrimary ? inferPalette(textPrimary) : base.palette,
    size: inferSize(buttonHeight),
    spacing: inferSpacing(spacing4),
    radius: pxToRemSeed(buttonRadiusPx),
    // 站点若已有半透明描边（rgba），把 alpha 也读出来
    ...(border.includes('rgba')
      ? { borderAlpha: Math.round((parseFloat(border.split(',').pop() ?? '1') || 1) * 100) }
      : {}),
  };

  // surface 目前不直接驱动色板（色板由文字色推断），保留读取以免 lint 未使用
  void surface;

  return next;
}

// ─── 全站注入 ──────────────────────────────────────────────────────────────

/** 实际生效的明暗（由编辑器外部传入的解析结果缓存）。 */
let resolvedModeCache: 'light' | 'dark' = 'light';

/** 生成并写入 `<style>`。 */
function applySiteCss(config: ThemeEditorConfig, resolvedMode: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;
  resolvedModeCache = resolvedMode;
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    // 插到 head 末尾：比站点自己的样式表更晚，因此覆盖默认值。
    document.head.appendChild(el);
  }
  el.textContent = buildSiteCss(config, resolvedMode);
}

/** 移除注入（用于「退出编辑器」/ 清理）。 */
export function clearSiteCss(): void {
  if (typeof document === 'undefined') return;
  document.getElementById(STYLE_ID)?.remove();
}

/** 生成「应用到项目」的代码片段（复制到剪贴板的内容）。 */
export function buildSnippet(): string {
  return buildProjectSnippet(themeConfig.value);
}

// ─── 配置写入 ──────────────────────────────────────────────────────────────

/** 整体替换配置。 */
export function replaceConfig(next: ThemeEditorConfig): void {
  themeConfig.value = cloneConfig(next);
}

/** 局部更新（浅合并 + feedback / fonts 深合并）。 */
export function patchConfig(patch: Partial<ThemeEditorConfig>): void {
  const current = themeConfig.value;
  themeConfig.value = {
    ...current,
    ...patch,
    feedback: { ...current.feedback, ...(patch.feedback ?? {}) },
    fonts: { ...current.fonts, ...(patch.fonts ?? {}) },
  };
}

/** 重置到站点默认（打开编辑器时采样到的值）。 */
export function resetConfig(): void {
  themeConfig.value = cloneConfig(siteDefaultConfig.value);
}

/** 恢复出厂默认（完全忽略站点当前值）。 */
export function resetToFactory(): void {
  themeConfig.value = cloneConfig(DEFAULT_CONFIG);
}

// ─── 预设 ──────────────────────────────────────────────────────────────────

export interface ThemePreset {
  name: string;
  label: string;
  brand: string;
  palette: ThemeEditorConfig['palette'];
  radius: number;
}

/**
 * 预设 = `@snui/tokens` 的五个内置主题（ADR-0010），**不在这里另写色值**。
 *
 * 此前这里是五组手写 hex（AUI 橙 / 海蓝 / 森林 / 葡萄 / 黑白），与 token 层的
 * 调色板各存一份，改一边就会漂移。现在品牌色直接取主题的 `brand`（它本身
 * 又是从 primitive 色阶的 500 读出来的），中性板与圆角维持站点基线 ——
 * 这正是 ADR-0010 的选择：主题只移动品牌色，中性色全局共用一个已审计的色阶。
 */
export const PRESETS: ReadonlyArray<ThemePreset> = BUILTIN_THEMES.map((theme) => ({
  name: theme.name,
  label: theme.label,
  brand: theme.brand,
  palette: 'zinc',
  radius: DEFAULT_CONFIG.radius,
}));

/** 应用预设（只改品牌色 / 中性板 / 圆角，保留明暗与反馈色选择）。 */
export function applyPreset(preset: ThemePreset): void {
  patchConfig({
    brand: preset.brand,
    palette: preset.palette,
    radius: preset.radius,
  });
}

// ─── 持久化 + 自动注入 ─────────────────────────────────────────────────────
//
// 刷新后配置还在；存储失败（隐私模式 / SSR）不能影响编辑 —— 全部静默降级。

let restored = false;

/** 是否已完成过一次「采样 + 恢复」初始化。 */
let initialized = false;

/** 存档里是否有一份用户自定义主题（用于「没自定义就别覆盖站点」）。 */
export function hasStoredConfig(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/** 从 localStorage 恢复配置（页面挂载后调用一次）。 */
export function restoreConfig(): void {
  if (restored || typeof window === 'undefined') return;
  restored = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<ThemeEditorConfig> | null;
    if (!parsed || typeof parsed !== 'object') return;
    patchConfig(parsed);
  } catch {
    // 存档损坏 → 保持采样值
  }
}

/**
 * 初始化：采样站点主题 → 作为默认 + 初始值 → 恢复存档 → 注入 CSS。
 *
 * 必须在浏览器端、页面挂载后调用（`onMounted`），因为采样依赖已解析的
 * `getComputedStyle`。
 *
 * **幂等**：现在有两个入口会调它（首页色块、主题编辑器页），第一个入口
 * 负责采样 + 恢复存档，之后任何入口只按当前配置重新注入。否则第二个入口
 * 会对「已经被自己注入覆盖过」的站点重新采样，把用户选好的主题冲掉。
 *
 * @param resolvedMode 站点当前明暗
 */
export function initThemeEditor(resolvedMode: 'light' | 'dark'): void {
  if (!initialized) {
    initialized = true;
    const sampled = readSiteTheme();
    siteDefaultConfig.value = cloneConfig(sampled);
    themeConfig.value = cloneConfig(sampled);
    restoreConfig();
  }
  applySiteCss(themeConfig.value, resolvedMode);
}

/** 是否已完成初始化（首页色块据此决定「先采样、再改色」）。 */
export function isThemeInitialized(): boolean {
  return initialized;
}

/**
 * 站点级入口：跟随已存的自定义主题。
 *
 * 只有用户确实存过自定义主题时才动手 —— 没自定义过的访客在任何页面
 * 看到的仍是站点原样（不注入覆盖）；自定义过的访客在任何页面、任何
 * 刷新后都保持自己选的主题色。
 *
 * 用在全局 Layout（每页挂载）+ 首页色块上，是「切换后全局生效」的落点。
 */
export function applyStoredSiteTheme(resolvedMode: 'light' | 'dark'): boolean {
  if (initialized) {
    applySiteCss(themeConfig.value, resolvedMode);
    return true;
  }
  if (!hasStoredConfig()) return false;
  initThemeEditor(resolvedMode);
  return true;
}

if (typeof window !== 'undefined') {
  watch(
    themeConfig,
    (value) => {
      // 采样 + 恢复之前，themeConfig 还是工厂默认值。此时任何写入都是把
      // 「还没初始化的默认主题」当成用户选择存下来 —— 主题编辑器页的
      // `immediate` watcher 会在 setup 阶段触发一次，正好踩中这个坑：
      // 它会把上一次选好的主题色冲成默认橙。初始化完成后再持久化。
      if (!initialized) return;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch {
        // 存储不可用 → 仅当前会话生效
      }
      applySiteCss(value, resolvedModeCache);
    },
    { deep: true },
  );
}

/** 供预览组件读取「当前生效明暗」。 */
export function currentResolvedMode(): 'light' | 'dark' {
  return resolvedModeCache;
}

/** 由配置推导语义色（预览组件共用）。 */
export function semanticColorsFor(
  config: ThemeEditorConfig,
  resolvedMode: 'light' | 'dark',
): ReturnType<typeof deriveSemanticColors> {
  return deriveSemanticColors(config, resolvedMode);
}
