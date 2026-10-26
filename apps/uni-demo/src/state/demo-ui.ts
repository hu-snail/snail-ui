/**
 * 演示工程 UI 状态 —— 语言（中/英）、主题（浅/深）与风格包（Style Pack）。
 *
 * 模块级单例 + uni storage 持久化：切换后跳转到任意页面（含分包聚合页）
 * 都读到同一状态；导航栏颜色/标题随主题与语言同步（H5 与 MP 均为尽力而为，
 * 平台不支持时静默降级，页面自身样式由 CSS 变量承担，不依赖导航栏 API）。
 */
import { computed, ref } from 'vue';
import { COMFORTABLE_DENSITY, LIGHT_THEME, MODERN_STYLE, resolveEnvironment } from '@snui/tokens';
import { allPacks } from '@snui/style-packs';

export type DemoLang = 'zh' | 'en';

const LANG_KEY = 'snui-demo-lang';
const THEME_KEY = 'snui-demo-theme';

/** 浅色页面底色（与 App.vue 的 --demo-page-bg 保持一致）。 */
const BG_LIGHT = '#eef1f8';
/** 深色页面底色。 */
const BG_DARK = '#10131c';

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

/** 弹出风格包选择（原生 action sheet，MP / H5 通用）。 */
function chooseStylePack(): void {
  const labels = allPacks.map((p) => p.label);
  uni.showActionSheet({
    itemList: labels,
    success: ({ tapIndex }) => {
      const pack = allPacks[tapIndex];
      if (!pack) return;
      stylePack.value = pack.name;
      writeStored(STYLE_KEY, pack.name);
    },
  });
}

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
  const bg = isDark.value ? BG_DARK : BG_LIGHT;
  const fg = isDark.value ? '#fafafa' : '#1c2030';
  let style = document.getElementById('snui-demo-navbar-style') as HTMLStyleElement | null;
  if (style === null) {
    style = document.createElement('style');
    style.id = 'snui-demo-navbar-style';
    document.head.appendChild(style);
  }
  style.textContent = [
    `uni-page-head .uni-page-head{background-color:${bg} !important;box-shadow:none !important;}`,
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

export function useDemoUi() {
  return {
    lang,
    isDark,
    stylePack,
    stylePackLabel,
    stylePackVars,
    t,
    toggleLang,
    toggleTheme,
    chooseStylePack,
    applyNavBar,
    setNavTitle,
  };
}
