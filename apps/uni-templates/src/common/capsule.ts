/**
 * 自定义导航页的微信胶囊适配度量。
 *
 * 微信小程序右上角胶囊悬浮在状态栏之下，自定义导航内容若铺满整行
 * 会被遮挡（§93 级视觉缺陷）。此处统一算出三段几何：
 *   - statusBarHeight：状态栏占位；
 *   - navBarHeight：胶囊垂直居中带反推出的导航行高（≥ 44px）；
 *   - capsulePadRight：胶囊左缘到屏幕右缘的距离 + 安全间距，
 *     顶部行内容用它做右内边距，让操作区让位胶囊。
 * H5 / App 无胶囊：状态栏 0（H5）、行高 44px、右侧不预留。
 */
export interface CapsuleMetrics {
  /** 状态栏高度（px）。 */
  statusBarHeight: number;
  /** 导航行高（px）—— 胶囊所在内容带的高度。 */
  navBarHeight: number;
  /** 顶部行右侧需预留的宽度（px）；无胶囊时为 0。 */
  capsulePadRight: number;
  /** 是否存在胶囊（仅微信小程序为 true）。 */
  hasCapsule: boolean;
}

const DEFAULT_NAV_HEIGHT = 44;
const CAPSULE_GAP = 8;

interface MenuButtonRect {
  width: number;
  height: number;
  top: number;
  left: number;
}

let cached: CapsuleMetrics | null = null;

export function getCapsuleMetrics(): CapsuleMetrics {
  if (cached) return cached;

  let statusBarHeight = 0;
  let navBarHeight = DEFAULT_NAV_HEIGHT;
  let capsulePadRight = 0;
  let hasCapsule = false;

  // #ifdef MP-WEIXIN
  const sys = uni.getSystemInfoSync();
  statusBarHeight = sys.statusBarHeight ?? 0;
  // legacy 类型把该方法标在 uni 命名空间上；低版本基础库可能缺失，防御性取用。
  const readRect = (uni as unknown as { getMenuButtonBoundingClientRect?: () => MenuButtonRect })
    .getMenuButtonBoundingClientRect;
  const rect = typeof readRect === 'function' ? readRect.call(uni) : null;
  if (rect && rect.width > 0 && rect.top > statusBarHeight) {
    const gap = rect.top - statusBarHeight;
    navBarHeight = Math.max(gap * 2 + rect.height, DEFAULT_NAV_HEIGHT);
    capsulePadRight = (sys.windowWidth ?? 375) - rect.left + CAPSULE_GAP;
    hasCapsule = true;
  }
  // #endif

  cached = { statusBarHeight, navBarHeight, capsulePadRight, hasCapsule };
  return cached;
}
