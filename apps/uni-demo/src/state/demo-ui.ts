/**
 * 演示工程 UI 状态 —— 语言（中/英）与主题（浅/深）。
 *
 * 模块级单例 + uni storage 持久化：切换后跳转到任意页面（含分包聚合页）
 * 都读到同一状态；导航栏颜色/标题随主题与语言同步（H5 与 MP 均为尽力而为，
 * 平台不支持时静默降级，页面自身样式由 CSS 变量承担，不依赖导航栏 API）。
 */
import { ref } from 'vue';

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

/** 按当前主题同步导航栏颜色（frontColor 仅接受纯黑/纯白）。 */
function applyNavBar(): void {
  try {
    uni.setNavigationBarColor({
      frontColor: isDark.value ? '#ffffff' : '#000000',
      backgroundColor: isDark.value ? BG_DARK : BG_LIGHT,
    });
  } catch {
    // 平台不支持（如部分 H5 环境）时忽略
  }
}

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
  return { lang, isDark, t, toggleLang, toggleTheme, applyNavBar, setNavTitle };
}
