/**
 * 演示工程 ↔ 宿主页面桥（H5）。
 *
 * docs 站通过外链 iframe 嵌入本工程（ADR-0005），主题与语言由宿主驱动：
 *
 * 1. 初始态走 URL query（`?snuiTheme=dark&snuiLang=en`，hash 路由下位于
 *    `#` 之前）——iframe 每次加载自带初始值，天然规避「消息早于监听器」竞态。
 * 2. 运行时切换走 postMessage：宿主发 `{ source: 'snui-docs', theme, lang }`，
 *    本工程挂载后回发 `{ source: 'snui-demo', type: 'ready' }`，宿主收到后
 *    立即补发一次当前态，双保险覆盖握手时序。
 *
 * 无宿主（直接访问部署站）时两个通道都静默不生效，站内手动切换与
 * 系统主题跟随（followSystemTheme）照常工作。
 */
import { useDemoUi, type DemoLang } from './demo-ui';

/** 宿主 → 演示工程消息来源标识（docs uni-demo-sync.ts 同源约定）。 */
const HOST_SOURCE = 'snui-docs';
/** 演示工程 → 宿主消息来源标识。 */
const DEMO_SOURCE = 'snui-demo';

interface HostStateMessage {
  source: string;
  theme?: 'dark' | 'light';
  lang?: DemoLang;
}

/** URL query 初始态：读取一次并应用到状态仓（theme 显式选择会停止系统跟随）。 */
function applyUrlParams(): void {
  // #ifdef H5
  if (typeof window === 'undefined') return;
  const search = new URLSearchParams(window.location.search);
  const theme = search.get('snuiTheme');
  const lang = search.get('snuiLang');
  const { setTheme, setLang } = useDemoUi();
  if (theme === 'dark' || theme === 'light') setTheme(theme === 'dark');
  if (lang === 'en' || lang === 'zh') setLang(lang);
  // #endif
}

/** 宿主 postMessage 运行时同步：校验来源标识与父窗口后应用 theme / lang。 */
function listenHostMessages(): void {
  // #ifdef H5
  if (typeof window === 'undefined') return;
  // 独立访问（无宿主）时不接受任何外来同步，避免同页其它消息误改主题。
  if (window.parent === window) return;
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.source !== window.parent) return;
    const data = event.data as Partial<HostStateMessage> | undefined;
    if (data === null || typeof data !== 'object' || data.source !== HOST_SOURCE) return;
    const { setTheme, setLang } = useDemoUi();
    if (data.theme === 'dark' || data.theme === 'light') setTheme(data.theme === 'dark');
    if (data.lang === 'en' || data.lang === 'zh') setLang(data.lang);
  });
  // #endif
}

/** 挂载完成后向父页面宣告就绪，宿主据此补发当前主题/语言。 */
function announceReady(): void {
  // #ifdef H5
  if (typeof window === 'undefined') return;
  const target = window.parent !== window ? window.parent : null;
  target?.postMessage({ source: DEMO_SOURCE, type: 'ready' }, '*');
  // #endif
}

/** 在 App.vue setup（H5）调用一次：URL 初始态 → 宿主消息监听 → ready 宣告。 */
export function initDemoBridge(): void {
  applyUrlParams();
  listenHostMessages();
  announceReady();
}
