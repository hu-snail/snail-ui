// gen-x: source apps/uni-demo/src/state/demo-ui.ts sha256:5e68e5443261cc5f —— 生成产物勿手改；源码改动后重跑 pnpm -F @snui/uni-demo-x gen
/**
 * 演示工程 UI 状态 —— 语言（中/英）、主题（浅/深）与风格包（Style Pack）。
 *
 * 模块级单例 + uni storage 持久化：切换后跳转到任意页面（含分包聚合页）
 * 都读到同一状态；导航栏颜色/标题随主题与语言同步（H5 与 MP 均为尽力而为，
 * 平台不支持时静默降级，页面自身样式由 CSS 变量承担，不依赖导航栏 API）。
 */
import {
  COMFORTABLE_DENSITY,
  DARK_THEME,
  LIGHT_THEME,
  MODERN_STYLE,
  resolveEnvironment,
} from '@snui/tokens';
import { allPacks } from '@snui/style-packs';

export type DemoLang = 'zh' | 'en';

const LANG_KEY = 'snui-demo-lang';
const THEME_KEY = 'snui-demo-theme';

/** 浅色页面底色（与 App.vue 的 --demo-page-bg / 画布渐变顶色保持一致）。 */
const BG_LIGHT = '#f8fafc';
/** 深色页面底色。 */
const BG_DARK = '#121020';

function readStored(key: string): string | undefined {
  try {
    const value = uni.getStorageSync(key);
    return typeof value === 'string' && value !== '' ? value : undefined;
  } catch {
    return undefined;
  }
}

function writeStored(key: string, value: string): void {
  try {
    uni.setStorageSync(key, value);
  } catch {
    // 存储不可用（隐私模式等）时仅当前会话生效
  }
}

const lang = ref<DemoLang>(readStored(LANG_KEY) === 'en' ? 'en' : 'zh');
const isDark = ref<boolean>(readStored(THEME_KEY) === 'dark');
const STYLE_KEY = 'snui-demo-style';
const stylePack = ref<string>(readStored(STYLE_KEY) ?? 'default');

/** 是否已有显式主题选择（存储 / URL 参数 / 父页面同步）。无则跟随系统。 */
let themeChosen = readStored(THEME_KEY) !== undefined;

/** 当前风格包展示名（按钮标签）。 */
const stylePackLabel = computed<string>(
  () => allPacks.find((p) => p.name === stylePack.value)?.label ?? 'Default',
);

/**
 * 风格包 → CSS 变量对象。
 *
 * 与 docs 的 StyleSwitcher（snCssVars 文本 + style 注入）不同，演示工程把
 * token 绑定解析成变量对象绑在 shell 根节点 `:style` 上——跨端通用
 * （MP 无 document 可注入），且响应式、随存储恢复。default 包无覆盖，
 * 返回空对象即回到库默认。
 */
const stylePackVars = computed<Record<string, string>>(() => {
  const pack = allPacks.find((p) => p.name === stylePack.value);
  if (!pack || pack.name === 'default') return {};
  // resolveEnvironment 的 theme/style/density 均必填——包未声明的维度回退
  // 库默认（与 snCssVars 的兜底一致），否则整包解析失败、变量为空。
  const bindings = resolveEnvironment({
    theme: pack.theme ?? LIGHT_THEME,
    style: pack.style ?? MODERN_STYLE,
    density: pack.density ?? COMFORTABLE_DENSITY,
  });
  const vars: Record<string, string> = {};
  for (const binding of bindings) {
    vars[binding.name] = binding.value;
  }
  return vars;
});

/** 风格包选择项（名称 + 展示名 + 描述），供首页 sn-popup 选择弹层渲染。 */
const stylePackOptions = computed(() =>
  allPacks.map((p) => ({
    name: p.name,
    label: p.label,
    description: p.description ?? '',
  })),
);

/**
 * 当前主题色（`--aui-color-action-primary` 的字面值）：default 包为库默认
 * blue-500，风格包（iOS 蓝 / Doodle 粉 …）随包覆盖。总览页弥散头部与分类
 * chips 高亮以字面色输出而非 CSS 变量 —— 渐变函数内的 var() 在 MP WXSS 与
 * uvue 内联样式里不可靠，只能由 JS 算好 concrete 值再绑定。
 */
const primaryColor = computed<string>(() => {
  const pack = allPacks.find((p) => p.name === stylePack.value);
  // 与 stylePackVars 同源：包自带 theme（如 Doodle 的粉主色）优先，
  // 未声明时回退当前深浅主题
  const bindings = resolveEnvironment({
    theme: pack?.theme ?? (isDark.value ? DARK_THEME : LIGHT_THEME),
    style: pack?.style ?? MODERN_STYLE,
    density: pack?.density ?? COMFORTABLE_DENSITY,
  });
  const primary = bindings.find((b) => b.name === '--aui-color-action-primary');
  // 解析结果必须是字面色才能参与渐变；异常回退库默认 blue-500
  return primary !== undefined && !primary.value.startsWith('var(') ? primary.value : '#1677ff';
});

/** 设定风格包并持久化（未知名忽略）。弹层 UI（sn-popup）在首页自身维护。
 * 注意（AUI-MP-002 回归）：uvue 蒸汽编译器会静默丢弃含「解构参数箭头回调」
 * 的整个函数——保持无回调的同步实现，不要塞 success: ({ tapIndex }) => …
 * 这类写法，否则函数整体变 undefined，调用点静默失效。 */
function setStylePack(name: string): void {
  if (!allPacks.some((p) => p.name === name)) return;
  stylePack.value = name;
  writeStored(STYLE_KEY, name);
}

/* ── MP 样式隔离桥（AUI-MP-002）─────────────────────────────────────────
 * mp-weixin 组件默认 isolated：app.wxss 的 `page` 变量靠 DOM 继承可以进
 * 组件，但任何选择器块（`.demo-shell` / `.demo-shell--dark` / `.dark`）
 * 都匹配不到组件内部节点。因此：
 *   1. `--sn-mp-color-* → var(--aui-*)` 锚定必须在 shell 根节点 inline 重挂
 *      （page 级别名在 page 元素上就解析成浅色字面量，子树覆盖 --aui-* 不
 *      会跟着翻转）；
 *   2. 深色翻转的 `--aui-*` 差集 + demo 骨架深色变量也要 inline。
 * H5 / App 无隔离，inline 与 CSS 块同值并存无冲突。改下面的映射时须与
 * App.vue 的 `.demo-shell` / `.demo-shell--dark` 块同步。 */
const SN_MP_ANCHORS: Record<string, string> = {
  '--sn-mp-color-text-primary': 'var(--aui-color-text-primary)',
  '--sn-mp-color-text-secondary': 'var(--aui-color-text-secondary)',
  '--sn-mp-color-text-disabled': 'var(--aui-color-text-disabled)',
  '--sn-mp-color-text-tertiary': 'var(--aui-color-text-tertiary)',
  '--sn-mp-color-text-on-primary': 'var(--aui-color-text-on-primary)',
  '--sn-mp-color-background-surface': 'var(--aui-color-background-surface)',
  '--sn-mp-color-background-subtle': 'var(--aui-color-background-subtle)',
  '--sn-mp-color-background-elevated': 'var(--aui-color-background-elevated)',
  '--sn-mp-color-background-overlay': 'var(--aui-color-background-overlay)',
  '--sn-mp-color-background-soft': 'var(--aui-color-background-subtle)',
  '--sn-mp-color-background-sunken': 'var(--aui-color-background-sunken)',
  '--sn-mp-color-background-inverse': 'var(--aui-color-background-inverse)',
  '--sn-mp-color-border-default': 'var(--aui-color-border-default)',
  '--sn-mp-color-border-subtle': 'var(--aui-color-border-subtle)',
  '--sn-mp-color-action-primary': 'var(--aui-color-action-primary)',
  '--sn-mp-color-action-primary-hover': 'var(--aui-color-action-primary-hover)',
  '--sn-mp-color-action-primary-soft': 'var(--aui-color-action-primary-soft)',
  '--sn-mp-color-feedback-success': 'var(--aui-color-feedback-success)',
  '--sn-mp-color-feedback-success-soft': 'var(--aui-color-feedback-success-soft)',
  '--sn-mp-color-feedback-warning': 'var(--aui-color-feedback-warning)',
  '--sn-mp-color-feedback-warning-soft': 'var(--aui-color-feedback-warning-soft)',
  '--sn-mp-color-feedback-danger': 'var(--aui-color-feedback-danger)',
  '--sn-mp-color-feedback-danger-hover': 'var(--aui-color-feedback-danger-hover)',
  '--sn-mp-color-feedback-danger-soft': 'var(--aui-color-feedback-danger-soft)',
  '--sn-mp-color-feedback-info': 'var(--aui-color-feedback-info)',
  '--sn-mp-color-input-bg': 'var(--aui-color-background-surface)',
  '--sn-mp-color-input-text': 'var(--aui-color-text-primary)',
  '--sn-mp-color-input-placeholder': 'var(--aui-color-text-disabled)',
  '--sn-mp-color-input-border': 'var(--aui-color-border-default)',
  '--sn-mp-color-input-border-focus': 'var(--aui-color-action-primary)',
  '--sn-mp-color-control-unchecked': 'var(--aui-color-border-default)',
  '--sn-mp-color-control-knob': 'var(--aui-color-background-elevated)',
  '--sn-mp-color-volcano': 'var(--aui-color-volcano)',
  '--sn-mp-color-volcano-soft': 'var(--aui-color-volcano-soft)',
  '--sn-mp-color-lightblue': 'var(--aui-color-lightblue)',
  '--sn-mp-color-lightblue-soft': 'var(--aui-color-lightblue-soft)',
  '--sn-mp-color-cyan': 'var(--aui-color-cyan)',
  '--sn-mp-color-cyan-soft': 'var(--aui-color-cyan-soft)',
  '--sn-mp-color-pink': 'var(--aui-color-pink)',
  '--sn-mp-color-pink-soft': 'var(--aui-color-pink-soft)',
  '--sn-mp-color-purple': 'var(--aui-color-purple)',
  '--sn-mp-color-purple-soft': 'var(--aui-color-purple-soft)',
};

/** demo 骨架深色变量（App.vue `.demo-shell--dark` 块的 inline 镜像）。 */
const DEMO_DARK_VARS: Record<string, string> = {
  '--sn-mp-color-control-knob': '#e4e4e7',
  '--demo-page-bg': '#121020',
  '--demo-page-canvas': 'linear-gradient(180deg, #171526 0%, #121020 100%)',
  '--demo-card-bg': 'linear-gradient(150deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
  '--demo-card-border': 'rgba(255, 255, 255, 0.1)',
  '--demo-card-shadow': '0 12rpx 40rpx rgba(0, 0, 0, 0.4)',
  '--demo-btn-bg': 'rgba(255, 255, 255, 0.1)',
  '--demo-btn-border': 'rgba(255, 255, 255, 0.16)',
  '--demo-search-bg': 'rgba(255, 255, 255, 0.07)',
  '--demo-chip-bg': 'rgba(255, 255, 255, 0.08)',
  '--demo-chip-border': 'rgba(255, 255, 255, 0.12)',
  '--demo-icon-bg': 'rgba(124, 92, 252, 0.22)',
  '--demo-icon-fg': '#a9bcff',
  '--demo-title': '#eef1fa',
  '--demo-text': '#a7aec4',
  '--demo-text-3': '#6d7488',
};

/**
 * shell 根节点 inline 变量：锚定（恒挂）+ 风格包 + 深色翻转。
 * 深色集合取 resolveEnvironment(DARK_THEME) 与浅色的差集——只有主题敏感
 * 的 --aui-* 需要覆盖，字面量与 `@snui/uni/styles` 的 `.dark` 块同源。
 */
const shellVars = computed<Record<string, string>>(() => {
  const pack = allPacks.find((p) => p.name === stylePack.value);
  const dims = {
    style: pack?.style ?? MODERN_STYLE,
    density: pack?.density ?? COMFORTABLE_DENSITY,
  };
  const vars: Record<string, string> = { ...SN_MP_ANCHORS, ...stylePackVars.value };
  if (!isDark.value) return vars;
  const light = new Map(
    resolveEnvironment({ theme: LIGHT_THEME, ...dims }).map((b) => [b.name, b.value]),
  );
  for (const binding of resolveEnvironment({ theme: DARK_THEME, ...dims })) {
    if (light.get(binding.name) !== binding.value) vars[binding.name] = binding.value;
  }
  return { ...vars, ...DEMO_DARK_VARS };
});

/** 按当前主题同步导航栏颜色（frontColor 仅接受纯黑/纯白）。 */
function applyNavBar(): void {
  // #ifdef H5
  applyNavBarH5();
  // #endif
  // #ifndef H5
  try {
    uni.setNavigationBarColor({
      frontColor: isDark.value ? '#ffffff' : '#000000',
      backgroundColor: isDark.value ? BG_DARK : BG_LIGHT,
    });
  } catch {
    // 平台不支持（如部分 H5 环境）时忽略
  }
  // #endif
}

// #ifdef H5
/**
 * H5 导航栏 DOM 适配：`uni.setNavigationBarColor` 在 H5 端不可靠（部分环境
 * 静默失败），直接注入覆盖样式到 `uni-page-head`（uni h5 的模拟导航栏）。
 * hash 路由 SPA 下导航栏元素跨页面复用，一个持久 style 节点即可。
 */
function applyNavBarH5(): void {
  // 透明：与页面画布连成一体（navigationStyle: custom 下 uni-page-head 本就
  // 不渲染，此注入只服务 native 模式兜底）；文字颜色仍随主题翻转。
  const fg = isDark.value ? '#fafafa' : '#1c2030';
  let style = document.getElementById('snui-demo-navbar-style') as HTMLStyleElement | null;
  if (style === null) {
    style = document.createElement('style');
    style.id = 'snui-demo-navbar-style';
    document.head.appendChild(style);
  }
  style.textContent = [
    `uni-page-head .uni-page-head{background-color:transparent !important;box-shadow:none !important;}`,
    `uni-page-head .uni-page-head__title,uni-page-head .uni-page-head-btn,uni-page-head .uni-page-head-hd,uni-page-head .uni-page-head-ft{color:${fg} !important;}`,
  ].join('');
}
// #endif

/** 设置导航栏标题（页面标题双语用）。 */
function setNavTitle(title: string): void {
  if (title === '') return;
  try {
    uni.setNavigationBarTitle({ title });
  } catch {
    // 平台不支持时忽略
  }
}

/** 双语文案：按当前语言取值。 */
function t(zh: string, en: string): string {
  return lang.value === 'en' ? en : zh;
}

function toggleLang(): void {
  lang.value = lang.value === 'zh' ? 'en' : 'zh';
  writeStored(LANG_KEY, lang.value);
}

function toggleTheme(): void {
  isDark.value = !isDark.value;
  writeStored(THEME_KEY, isDark.value ? 'dark' : 'light');
  applyNavBar();
}

/**
 * 外部显式设定主题（URL 初始态 / 父页面 docs 同步）。与 toggle 同路径：
 * 更新状态 + 持久化 + 导航栏同步；显式选择后不再跟随系统。
 */
function setTheme(dark: boolean): void {
  themeChosen = true;
  if (isDark.value === dark) return;
  isDark.value = dark;
  writeStored(THEME_KEY, dark ? 'dark' : 'light');
  applyNavBar();
}

/** 外部显式设定语言（URL 初始态 / 父页面 docs 同步）。 */
function setLang(value: DemoLang): void {
  if (lang.value === value) return;
  lang.value = value;
  writeStored(LANG_KEY, value);
}

/**
 * 系统主题跟随：仅在没有任何显式选择时生效。H5 监听 prefers-color-scheme，
 * MP（manifest darkmode: true）监听 uni.onThemeChange；显式选择后静默摘除。
 */
function followSystemTheme(): void {
  // #ifdef H5
  if (typeof window.matchMedia !== 'function') return;
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = (event: MediaQueryList | MediaQueryListEvent): void => {
    if (themeChosen) return;
    isDark.value = event.matches;
    applyNavBar();
  };
  apply(query);
  const onChange = (event: MediaQueryListEvent): void => apply(event);
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', onChange);
  } else if (typeof query.addListener === 'function') {
    // 旧版 Safari 的 deprecated API
    query.addListener(onChange);
  }
  // #endif
  // #ifndef H5
  try {
    uni.onThemeChange?.(({ theme }) => {
      if (themeChosen) return;
      isDark.value = theme === 'dark';
      applyNavBar();
    });
  } catch {
    // 平台不支持时忽略（H5 走上方 matchMedia 分支）
  }
  // #endif
}

export function useDemoUi() {
  return {
    lang,
    isDark,
    stylePack,
    stylePackLabel,
    stylePackOptions,
    stylePackVars,
    shellVars,
    primaryColor,
    t,
    toggleLang,
    toggleTheme,
    setTheme,
    setLang,
    setStylePack,
    followSystemTheme,
    applyNavBar,
    setNavTitle,
  };
}
