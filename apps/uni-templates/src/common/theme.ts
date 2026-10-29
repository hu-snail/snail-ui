/**
 * 模板工程深浅色主题 —— 跟随系统（MP / App 走 `uni.onThemeChange`，
 * H5 走 `prefers-color-scheme`），并同步原生 chrome：
 *   - 页面底色 `uni.setBackgroundColor`
 *   - 原生 tabBar `uni.setTabBarStyle`
 *   - 状态栏前景 `uni.setNavigationBarColor`（微信自定义导航下仍是它控制）
 * 页面内颜色经根节点 `.sn-theme-dark` class 切换 `--tplh-*` CSS 变量
 * （与 §112.5 的 uni 端暗色契约同构）。
 */
import { ref } from 'vue';

const PAGE_BG = { light: '#f6f7f9', dark: '#0b0f16' } as const;
const NAV_FRONT = { light: '#000000', dark: '#ffffff' } as const;
const TABBAR = {
  light: { backgroundColor: '#ffffff', color: '#98a2b3', selectedColor: '#35a257', borderStyle: 'white' as const },
  dark: { backgroundColor: '#131a24', color: '#5c6675', selectedColor: '#4cd088', borderStyle: 'black' as const },
};

/** 模块级单例：4 个 tab 页共享同一份主题状态。 */
const isDark = ref(false);
let started = false;

function apply(dark: boolean): void {
  isDark.value = dark;
  uni.setBackgroundColor?.({ backgroundColor: dark ? PAGE_BG.dark : PAGE_BG.light });
  uni.setNavigationBarColor?.({ frontColor: dark ? NAV_FRONT.dark : NAV_FRONT.light, backgroundColor: dark ? PAGE_BG.dark : PAGE_BG.light });
  uni.setTabBarStyle?.(dark ? TABBAR.dark : TABBAR.light);
}

export function useTplTheme(): { isDark: typeof isDark } {
  if (started) return { isDark };
  started = true;

  const sys = uni.getSystemInfoSync() as { theme?: string };
  apply(sys.theme === 'dark');

  // #ifndef H5
  if (typeof uni.onThemeChange === 'function') {
    const handler = (res: { theme?: string }): void => apply(res.theme === 'dark');
    uni.onThemeChange(handler);
  }
  // #endif

  // #ifdef H5
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  apply(mq.matches);
  mq.addEventListener('change', (e) => apply(e.matches));
  // #endif

  return { isDark };
}
