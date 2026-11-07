/**
 * theme-editor/library — 编辑器配置 ↔ AUI 库自身的 token 体系桥接层。
 *
 * ## 为什么这一层存在
 *
 * 主题编辑器的产出必须是**库的公开 API**（`@snui/tokens` 的
 * ThemeDefinition / StyleDefinition / DensityDefinition + `snCssVars()`），
 * 而不是编辑器自造的一堆 CSS 变量。这样：
 *
 *   - 复制出去的配置在用户项目里走的是和组件库完全相同的解析管线
 *     （resolveEnvironment → primitive/semantic/component 三层级联）；
 *   - 编辑器里的内置主题就是 `@snui/style-packs` 的官方 Pack，天然 100% 适配；
 *   - 站点全局应用 = 注入 `snCssVars()` 的输出 —— 组件消费的
 *     `--sn-web-*` / `--sn-mp-*` 别名最终都指向 `var(--aui-*)`，覆盖
 *     `--aui-*` 层即两端同时生效。
 *
 * 纯函数（`applySiteCss` 除外），无组件依赖；可在测试中直接调用。
 */

import {
  snCssVars,
  type DensityDefinition,
  type StyleDefinition,
  type ThemeDefinition,
} from '@snui/tokens';
import { allPacks } from '@snui/style-packs';
import { tint } from './palette';
import {
  buildMpVars,
  buildWebVars,
  deriveSemanticColors,
  fontStackFor,
  SIZE_PRESETS,
  SPACING_PRESETS,
  type ThemeEditorConfig,
  type VarMap,
} from './vars';

export { allPacks };

// ─── 配置 → 库的三轴定义 ──────────────────────────────────────────────────

/**
 * Theme 轴（颜色）：品牌色派生语义 action 色，反馈色与中性/表面/文字一并覆盖。
 *
 * 语义色不写死 hex，而是**派生自品牌色 ramp**（hover/soft/foreground），
 * 用户改一个主色，整套 action 色跟随 —— 这正是「100% 适配」的含义。
 */
export function buildThemeDefinition(
  config: ThemeEditorConfig,
  resolvedMode: 'light' | 'dark',
): ThemeDefinition {
  const colors = deriveSemanticColors(config, resolvedMode);
  return {
    name: `theme-editor-${resolvedMode}`,
    semantic: {
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        tertiary: colors.text.tertiary,
        disabled: colors.text.disabled,
        onPrimary: colors.text.onPrimary,
      },
      background: {
        surface: colors.background.surface,
        elevated: colors.background.elevated,
        subtle: colors.background.subtle,
        sunken: colors.background.sunken,
        overlay: colors.background.overlay,
      },
      border: {
        default: colors.border.default,
        subtle: colors.border.subtle,
        strong: colors.border.strong,
        focus: colors.border.focus,
      },
      action: {
        primary: colors.primary[500],
        primaryHover: colors.primary[600],
        primaryActive: colors.primary[700],
        secondary: colors.secondary[500],
        secondaryHover: colors.secondary[600],
      },
      feedback: {
        danger: colors.semantics.danger,
        success: colors.semantics.success,
        warning: colors.semantics.warning,
        info: colors.semantics.info,
      },
    },
  };
}

/**
 * Style 轴（形状）：圆角种子 → primitive 阶梯 + 组件 token，阴影跟 surface。
 *
 * 阶梯倍率与 veanui 的「一个种子驱动整条刻度」一致，但值走库的
 * StyleDefinition（radius/sm…xl + button/input/card 组件 token）。
 */
export function buildStyleDefinition(config: ThemeEditorConfig): StyleDefinition {
  const size = SIZE_PRESETS[config.size];
  const base = Math.max(0, config.radius + size.radiusBoost);
  const r = (n: number): string => `${Number(n.toFixed(3))}rem`;
  const layered = config.surface === 'layered';

  return {
    name: 'theme-editor-shape',
    primitive: {
      radius: {
        xs: r(base * 0.25),
        sm: r(base * 0.5),
        md: r(base),
        lg: r(base * 1.5),
        xl: r(base * 2.5),
      },
      shadow: layered
        ? {
            xs: '0 1px 2px rgba(0,0,0,0.05)',
            sm: '0 1px 3px rgba(15,23,42,0.08)',
            md: '0 4px 12px rgba(15,23,42,0.08)',
            lg: '0 10px 28px rgba(15,23,42,0.10)',
            xl: '0 18px 44px rgba(15,23,42,0.12)',
          }
        : { xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'none' },
    },
    component: {
      button: {
        radius: r(base),
        shadow: layered ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
      },
      input: { radius: r(base) },
      card: {
        radius: r(base * 1.5),
        shadow: layered ? '0 1px 3px rgba(15,23,42,0.08)' : 'none',
      },
    },
  };
}

/** Density 轴（间距/尺寸/字号）：编辑器的三档映射到库的密度定义。 */
export function buildDensityDefinition(config: ThemeEditorConfig): DensityDefinition {
  const spacing = SPACING_PRESETS[config.spacing];
  const size = SIZE_PRESETS[config.size];
  return {
    name: `theme-editor-density-${config.spacing}`,
    primitive: {
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, `${v}px`])),
      size: {
        control: {
          sm: `${size.control - 6}px`,
          md: `${size.control}px`,
          lg: `${size.control + 6}px`,
        },
      },
      font: {
        size: {
          sm: `${Math.max(10, size.font - 2)}px`,
          md: `${size.font}px`,
          lg: `${size.font + 2}px`,
        },
      },
    },
  };
}

// ─── 站点全局 CSS（snCssVars + 站点级接线） ───────────────────────────────

/** 变量映射 → CSS 块。 */
function cssBlock(selector: string, vars: VarMap): string {
  const lines = Object.entries(vars).map(([name, value]) => `  ${name}: ${value};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}

/**
 * 全站生效 CSS。
 *
 * 组成：
 *   1. `snCssVars()` 的输出（`--aui-*` + `--sn-*`，dark 块重定向到 `.dark`）；
 *   2. 字体族覆盖（库的 Density 轴不带字族，单独补）；
 *   3. VitePress chrome 接线（`--vp-c-*` → 主题色，页面背景/正文/分隔线一起变）；
 *   4. 组件级补充（dialog/drawer 圆角阴影与遮罩，跟随 style/density）；
 *   5. 两端预览容器的具体变量（Web `--sn-web-*` / uni `--sn-mp-*`），
 *      供预览块脱离 `:root` 独立生效。
 */
export function buildSiteCss(config: ThemeEditorConfig, resolvedMode: 'light' | 'dark'): string {
  const theme = buildThemeDefinition(config, resolvedMode);
  const style = buildStyleDefinition(config);
  const density = buildDensityDefinition(config);

  // 库自己的解析管线：:root + [data-theme="dark"] 两块。
  const libCss = snCssVars({ theme, style, density, withDark: true });
  // VitePress 用 `.dark` 类切换深色 —— 把库的 dark 选择器扩展成两种写法。
  const siteCss = libCss.replaceAll('[data-theme="dark"]', '.dark, [data-theme="dark"]');

  const light = deriveSemanticColors(config, 'light');
  const dark = deriveSemanticColors(config, 'dark');
  const lightWeb = buildWebVars(config, light, 'light');
  const darkWeb = buildWebVars(config, dark, 'dark');
  const lightMp = buildMpVars(config, light, 'light');
  const darkMp = buildMpVars(config, dark, 'dark');

  const vpLight: VarMap = {
    '--vp-c-bg': light.background.surface,
    '--vp-c-bg-alt': light.background.sunken,
    '--vp-c-bg-soft': light.background.subtle,
    '--vp-c-bg-elv': light.background.elevated,
    '--vp-c-text-1': light.text.primary,
    '--vp-c-text-2': light.text.secondary,
    '--vp-c-text-3': light.text.tertiary,
    '--vp-c-divider': light.border.default,
    '--vp-c-border': light.border.strong,
    '--vp-c-gutter': light.border.subtle,
    '--vp-c-brand-1': light.primary[500],
    '--vp-c-brand-2': light.primary[600],
    '--vp-c-brand-3': light.primary[700],
    '--vp-c-brand-soft': tint(light.primary[500], 0.88, light.background.surface),
    '--vp-font-family-base': fontStackFor(config.fonts.sans),
    '--vp-font-family-mono': fontStackFor(config.fonts.mono),
  };
  const vpDark: VarMap = {
    '--vp-c-bg': dark.background.surface,
    '--vp-c-bg-alt': dark.background.sunken,
    '--vp-c-bg-soft': dark.background.subtle,
    '--vp-c-bg-elv': dark.background.elevated,
    '--vp-c-text-1': dark.text.primary,
    '--vp-c-text-2': dark.text.secondary,
    '--vp-c-text-3': dark.text.tertiary,
    '--vp-c-divider': dark.border.default,
    '--vp-c-border': dark.border.strong,
    '--vp-c-gutter': dark.border.subtle,
    '--vp-c-brand-1': dark.primary[400],
    '--vp-c-brand-2': dark.primary[500],
    '--vp-c-brand-3': dark.primary[600],
    '--vp-c-brand-soft': tint(dark.primary[500], 0.85, dark.background.surface),
    '--vp-font-family-base': fontStackFor(config.fonts.sans),
    '--vp-font-family-mono': fontStackFor(config.fonts.mono),
  };

  const overlayRadius = style.primitive?.radius?.lg ?? '8px';

  return [
    '/* ── AUI 主题编辑器：由 @snui/tokens snCssVars() 生成（勿手改） ── */',
    siteCss,
    '',
    '/* ── 字体族（Density 轴不携带字族，单独覆盖） ── */',
    cssBlock(':root', {
      '--aui-font-family-sans': fontStackFor(config.fonts.sans),
      '--aui-font-family-heading': fontStackFor(config.fonts.heading),
      '--aui-font-family-mono': fontStackFor(config.fonts.mono),
      '--aui-font-family-serif': fontStackFor(config.fonts.serif),
      '--aui-font-family-body': fontStackFor(config.fonts.sans),
      '--aui-font-family-code': fontStackFor(config.fonts.mono),
    }),
    '',
    '/* ── VitePress chrome 接线（整站背景/文字/分隔线/品牌色） ── */',
    cssBlock(':root', vpLight),
    cssBlock('.dark, [data-theme="dark"]', vpDark),
    '',
    '/* ── 组件级补充（浮层圆角/阴影/遮罩跟随 style 轴） ── */',
    cssBlock(':root', {
      '--sn-web-dialog-radius': overlayRadius,
      '--sn-web-drawer-radius': overlayRadius,
      '--sn-web-dialog-box-shadow': lightWeb['--sn-web-shadow-xl'] ?? 'none',
      '--sn-web-drawer-box-shadow': lightWeb['--sn-web-shadow-xl'] ?? 'none',
      '--sn-web-drawer-mask-color': light.background.overlay,
    }),
    '',
    '/* ── 预览容器：Web 端变量 ── */',
    cssBlock('.sn-theme-preview-web', lightWeb),
    cssBlock('.dark .sn-theme-preview-web, [data-theme="dark"] .sn-theme-preview-web', darkWeb),
    '',
    '/* ── 预览容器：uni 端变量（rpx 由 rpx-transform 编译期换算） ── */',
    cssBlock('.sn-mp-preview', lightMp),
    cssBlock('.dark .sn-mp-preview, [data-theme="dark"] .sn-mp-preview', darkMp),
  ].join('\n');
}

// ─── 一键复制：可粘贴进用户项目的配置 ─────────────────────────────────────

/**
 * 生成「应用到项目」的完整代码片段。
 *
 * 内容是**库的公开 API**：三个定义对象（可直接存成 `theme.ts`）+
 * `snCssVars()` 注入调用。用户复制后粘进自己项目即可获得与预览一致的主题。
 */
export function buildProjectSnippet(config: ThemeEditorConfig): string {
  const theme = buildThemeDefinition(config, 'light');
  const style = buildStyleDefinition(config);
  const density = buildDensityDefinition(config);

  const obj = (value: unknown, indent = 2): string => {
    const pad = ' '.repeat(indent);
    const inner = JSON.stringify(value, null, indent).replaceAll('\n', `\n${pad}`);
    return inner;
  };

  return `// AUI 主题配置 —— 由文档站主题编辑器生成
// 依赖：@snui/tokens（组件库已内置）
//
// 1) 把下面三个对象存成 src/theme.ts

export const myTheme = ${obj(theme)};

export const myStyle = ${obj(style)};

export const myDensity = ${obj(density)};

// 2) 在应用入口（main.ts / app.ts）注入一次：
//
//    import { snCssVars } from '@snui/tokens'
//    import { myTheme, myStyle, myDensity } from './theme'
//
//    const styleEl = document.createElement('style')
//    styleEl.textContent = snCssVars({
//      theme: myTheme,
//      style: myStyle,
//      density: myDensity,
//    })
//    document.head.appendChild(styleEl)
//
// 3) 说明
//    - Web 端组件读取 --sn-web-*（指向 var(--aui-*)），uni 端组件读取
//      --sn-mp-*；颜色两端同时生效。
//    - uni 端尺寸由 tokens-mp 的 rpx 阶梯决定；density 轴的 spacing/size
//      对 Web 端全量生效。
//    - 深色模式：snCssVars 默认输出 [data-theme="dark"] 块；VitePress 类
//      站点用 .dark 类时把选择器替换为 '.dark, [data-theme="dark"]' 即可。
`;
}

/**
 * 内置主题 → 编辑器配置补丁。
 *
 * 内置主题 = `@snui/style-packs` 的官方 Pack。读取 Pack 的 theme/style/density
 * 反推编辑器槽位（品牌色 / 圆角 / 表面），保证「选内置主题」就是选库里的
 * 一等公民，而不是编辑器的私有预设。
 */
export function packToConfigPatch(packName: string): Partial<ThemeEditorConfig> | null {
  const pack = allPacks.find((p) => p.name === packName);
  if (!pack) return null;

  const brand = pack.theme?.semantic?.action?.primary;
  const radiusMd = pack.style?.primitive?.radius?.md;
  const radiusSeed = radiusMd?.endsWith('rem')
    ? parseFloat(radiusMd)
    : radiusMd?.endsWith('px')
      ? parseFloat(radiusMd) / 16
      : undefined;
  const shadowNone = pack.style?.primitive?.shadow
    ? Object.values(pack.style.primitive.shadow).every((v) => v === 'none')
    : undefined;

  return {
    ...(brand ? { brand } : {}),
    ...(radiusSeed !== undefined ? { radius: Number(radiusSeed.toFixed(3)) } : {}),
    ...(shadowNone !== undefined ? { surface: shadowNone ? 'flat' : 'layered' } : {}),
  };
}
