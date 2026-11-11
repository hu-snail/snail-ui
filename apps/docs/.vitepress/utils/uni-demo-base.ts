/**
 * uni-demo 部署站地址 —— docs 预览 iframe 的目标（ADR-0005）。
 *
 * uni 端 demo 的唯一事实源在 apps/uni-demo；其 H5 部署（GitHub Pages，hash
 * 路由）是 docs 端 uni 组件预览的载体。默认指向本仓库的 Pages 项目站，本地
 * 联调时用环境变量覆盖为本地 uni-demo dev server 即可：
 *
 *   UNI_DEMO_PREVIEW_BASE=http://localhost:5173 pnpm dev
 *
 * 值在构建期经 config.ts 的 `vite.define` 注入为 `__UNI_DEMO_BASE__`，客户端
 * 代码不读 process.env。
 */
declare const __UNI_DEMO_BASE__: string;

/** 部署站根地址（带尾斜杠）。 */
export const UNI_DEMO_BASE = typeof __UNI_DEMO_BASE__ === 'string' ? __UNI_DEMO_BASE__ : '/';

/**
 * uni-demo 内某页面的 hash 路由地址。
 *
 * @param page 页面路径，形如 `pages/basic/button`（来自 demos-manifest.json）
 *   或 `pages/index/index`（首页目录）。
 * @param state 初始主题/语言（可选）。hash 路由下 query 必须位于 `#` 之前；
 *   uni-demo 启动时解析并应用（见 apps/uni-demo/src/state/demo-bridge.ts），
 *   让每次 iframe 加载自带当前态，规避 postMessage 时序竞态。
 */
export function uniDemoPageUrl(
  page: string,
  state?: { theme?: 'dark' | 'light'; lang?: 'zh' | 'en' },
): string {
  const params: string[] = [];
  if (state?.theme) params.push(`snuiTheme=${state.theme}`);
  if (state?.lang) params.push(`snuiLang=${state.lang}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';
  return `${UNI_DEMO_BASE}${query}#/${page}`;
}
