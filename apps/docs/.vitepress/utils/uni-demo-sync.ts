/**
 * uni-demo iframe 同步协议 —— docs（宿主）侧发送端。
 *
 * 与 apps/uni-demo/src/state/demo-bridge.ts（接收端）同源约定：
 *  - 消息带 `source` 标识防止与页面内其它 postMessage 串扰；
 *  - uni-demo 挂载后回发 `{ source: 'snui-demo', type: 'ready' }`，宿主
 *    收到后立即补发一次当前态，覆盖「宿主先发、iframe 监听器未挂」的竞态
 *    （初始态另有 URL query 双保险，见 uniDemoPageUrl）；
 *  - 运行时切换：宿主 watch 主题/语言后 postMessage 到 frame.contentWindow。
 */
import type { Ref } from 'vue';

/** docs → uni-demo 消息来源标识。 */
const HOST_SOURCE = 'snui-docs';
/** uni-demo → docs 的就绪消息类型。 */
const READY_TYPE = 'ready';

/** docs 当前主题/语言到协议字段的映射形态。 */
export interface UniDemoState {
  theme: 'dark' | 'light';
  lang: 'zh' | 'en';
}

/** 把 VitePress 的 isDark / lang（'zh-CN' | 'en-US'）折算成协议态。 */
export function uniDemoStateOf(isDark: boolean, lang: string): UniDemoState {
  return { theme: isDark ? 'dark' : 'light', lang: lang.startsWith('en') ? 'en' : 'zh' };
}

/**
 * 向 uni-demo iframe 发送当前主题/语言。frame 未挂载或尚未就绪时静默跳过
 * （初始态由 URL query 兜底；ready 握手后此函数会再次被调用）。
 */
export function postUniDemoState(
  frame: Ref<HTMLIFrameElement | null | undefined>,
  state: UniDemoState,
): void {
  const win = frame.value?.contentWindow;
  if (win === null || win === undefined) return;
  win.postMessage({ source: HOST_SOURCE, ...state }, '*');
}

/**
 * 监听 uni-demo 的 ready 宣告：收到后立即补发一次当前态。返回解绑函数
 * （组件 onUnmounted 时调用，避免多实例重复监听）。SSR 环境（构建期渲染
 * MpHome 等）返回空解绑函数。
 */
export function onUniDemoReady(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (event: MessageEvent): void => {
    const data = event.data as { source?: string; type?: string } | undefined;
    if (data?.source !== 'snui-demo' || data?.type !== READY_TYPE) return;
    handler();
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
