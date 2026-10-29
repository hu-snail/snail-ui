/**
 * sn-icon Iconify 按需加载 Provider（https://iconify.design）。
 *
 * ## 为什么走 SVG 端点而不是 JSON 端点
 *
 * Iconify 的 JSON API 返回任意 SVG 内部标记（circle / rect / g / fill），
 * 解析需要 DOMParser 或引入 svg 解析依赖；而 `{apiBase}/{collection}/{name}.svg`
 * 返回自包含 SVG 文档，可直接包成 data URL 交给 background-image /
 * `<image>` 渲染 —— H5 / MP / App 三端统一，零解析、零依赖。
 *
 * ## 颜色
 *
 * 显式 `color` 通过 Iconify 的 `color` 查询参数烘焙进 SVG（替换
 * currentColor）。`currentColor`（默认值）无法穿透独立的 SVG 文档，
 * 会渲染为黑色 —— 需要继承主题色时请显式传 color。
 *
 * ## 缓存
 *
 * 模块级 Promise 缓存，key = 完整请求 URL（同一图标 + 颜色 + 尺寸只请求
 * 一次，并发调用共享 in-flight Promise）。失败条目移出缓存以便重试。
 * `clearSnIconifyCache()` 仅供测试。
 *
 * ## 网络
 *
 * 默认 request 实现：优先 `fetch`（H5 / App webview / 测试环境），否则
 * 回落 `uni.request`（小程序端）。均可通过 `configSnIconify({ request })`
 * 注入替换（单测注入假 fetcher，业务可接自有网关）。
 */

import {
  SnIconSourceError,
  type SnIconResolveContext,
} from './sn-icon-providers';

/** Iconify 服务配置。 */
export interface SnIconifyOptions {
  /** API 基址，默认官方 `https://api.iconify.design`（可自建代理）。 */
  apiBase?: string;
  /** 单请求超时毫秒数，默认 15000。 */
  timeout?: number;
  /**
   * 注入自定义请求函数（返回 SVG 文档文本）。签名收到合并了外部
   * AbortSignal 的 signal，组件卸载 / 图标变更时会被 abort。
   */
  request?: (url: string, timeoutMs: number, signal: AbortSignal) => Promise<string>;
}

const DEFAULT_API_BASE = 'https://api.iconify.design';
const DEFAULT_TIMEOUT_MS = 15000;

let apiBase = DEFAULT_API_BASE;
let timeoutMs = DEFAULT_TIMEOUT_MS;
let requestFn: (url: string, timeoutMs: number, signal: AbortSignal) => Promise<string> =
  defaultRequest;

/** 配置 Iconify 服务（幂等；未给出的字段保持原值）。 */
export function configSnIconify(options: SnIconifyOptions = {}): void {
  if (options.apiBase !== undefined) apiBase = options.apiBase.replace(/\/+$/, '');
  if (options.timeout !== undefined) timeoutMs = options.timeout;
  if (options.request !== undefined) requestFn = options.request;
}

/** 当前配置快照（测试断言用）。 */
export function getSnIconifyConfig(): Required<Omit<SnIconifyOptions, 'request'>> & {
  request: (url: string, timeoutMs: number, signal: AbortSignal) => Promise<string>;
} {
  return { apiBase, timeout: timeoutMs, request: requestFn };
}

/** 恢复默认配置（测试专用）。 */
export function resetSnIconifyConfig(): void {
  apiBase = DEFAULT_API_BASE;
  timeoutMs = DEFAULT_TIMEOUT_MS;
  requestFn = defaultRequest;
}

/**
 * 构造 Iconify SVG 端点 URL。`color` 为显式颜色时烘焙进请求；
 * `currentColor` 不传（SVG 内部 currentColor 在独立文档中渲染为黑）。
 */
export function buildIconifySvgUrl(
  collection: string,
  name: string,
  ctx: Pick<SnIconResolveContext, 'color' | 'size'>,
): string {
  const height = Number.isFinite(ctx.size) && ctx.size > 0 ? Math.round(ctx.size) : 24;
  let url = `${apiBase}/${encodeURIComponent(collection)}/${encodeURIComponent(name)}.svg?height=${height}`;
  if (ctx.color !== '' && ctx.color !== 'currentColor') {
    url += `&color=${encodeURIComponent(ctx.color)}`;
  }
  return url;
}

/** 端口安全的 collection / name 校验（Iconify 命名仅限字母数字与 -）。 */
const ICONIFY_ID_RE = /^[a-z0-9-]+$/i;

/**
 * 默认请求实现：fetch 优先（H5 / App / 测试），回落 uni.request（MP）。
 * `external` signal（组件生命周期）与超时信号竞争，任一触发即中断。
 */
function defaultRequest(url: string, ms: number, external: AbortSignal): Promise<string> {
  const g = globalThis as Record<string, unknown>;

  if (typeof g.fetch === 'function') {
    const timeoutCtrl = new AbortController();
    const timer = setTimeout(() => timeoutCtrl.abort(), ms);
    const onExternalAbort = () => timeoutCtrl.abort();
    external.addEventListener('abort', onExternalAbort, { once: true });
    return (g.fetch as typeof fetch)(url, { signal: timeoutCtrl.signal, method: 'GET' })
      .then(async (res) => {
        if (!res.ok) {
          throw new SnIconSourceError(
            'ICON_FETCH_FAILED',
            `Iconify request failed: HTTP ${res.status} for ${url}`,
          );
        }
        return res.text();
      })
      .finally(() => {
        clearTimeout(timer);
        external.removeEventListener('abort', onExternalAbort);
      });
  }

  const uni = g.uni as { request?: (o: Record<string, unknown>) => { abort?: () => void } } | undefined;
  const uniRequest = typeof uni?.request === 'function' ? uni.request : undefined;
  if (uniRequest !== undefined) {
    return new Promise<string>((resolve, reject) => {
      let settled = false;
      const task = uniRequest({
        url,
        method: 'GET',
        timeout: ms,
        responseType: 'text',
        success: (res: { statusCode?: number; data?: unknown }) => {
          settled = true;
          if ((res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300 && typeof res.data === 'string') {
            resolve(res.data);
          } else {
            reject(
              new SnIconSourceError(
                'ICON_FETCH_FAILED',
                `Iconify request failed: HTTP ${res.statusCode} for ${url}`,
              ),
            );
          }
        },
        fail: (err: { errMsg?: string }) => {
          settled = true;
          reject(
            new SnIconSourceError(
              err.errMsg?.includes('timeout') === true ? 'ICON_FETCH_TIMEOUT' : 'ICON_FETCH_FAILED',
              `Iconify request failed: ${err.errMsg ?? 'unknown'} for ${url}`,
            ),
          );
        },
      });
      const onExternalAbort = () => {
        if (settled) return;
        task?.abort?.();
        reject(new SnIconSourceError('ICON_FETCH_FAILED', `Iconify request aborted for ${url}`));
      };
      if (external.aborted) {
        onExternalAbort();
        return;
      }
      external.addEventListener('abort', onExternalAbort, { once: true });
    });
  }

  return Promise.reject(
    new SnIconSourceError('ICON_FETCH_FAILED', `No request implementation available for ${url}`),
  );
}

/** 模块级缓存：完整 URL → in-flight / resolved Promise。 */
const cache = new Map<string, Promise<string>>();

/** 清空 Iconify 缓存（测试专用；应用代码不要调用）。 */
export function clearSnIconifyCache(): void {
  cache.clear();
}

/** 把 SVG 文档文本包装成可直接用于 background-image 的 data URL。 */
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`;
}

/**
 * 解析 Iconify 图标目标（`collection:name`），按需请求并缓存。
 * 成功返回就绪的 SVG data URL；失败抛 `SnIconSourceError`（组件捕获
 * 后降级为空渲染 + 结构化警告）。
 */
export function resolveIconifyIcon(
  target: string,
  ctx: SnIconResolveContext,
): Promise<string> {
  const colon = target.indexOf(':');
  const collection = colon > 0 ? target.slice(0, colon) : '';
  const name = colon > 0 ? target.slice(colon + 1) : '';
  if (
    colon <= 0 ||
    colon === target.length - 1 ||
    !ICONIFY_ID_RE.test(collection) ||
    !ICONIFY_ID_RE.test(name)
  ) {
    return Promise.reject(
      new SnIconSourceError(
        'ICON_SOURCE_UNRESOLVED',
        `Invalid iconify target "${target}" — expected "collection:name" (e.g. "mdi:home")`,
      ),
    );
  }
  const url = buildIconifySvgUrl(collection, name, ctx);
  const cached = cache.get(url);
  if (cached) return cached;
  const pending = requestFn(url, timeoutMs, ctx.signal ?? new AbortController().signal)
    .then((svg) => {
      if (!svg.includes('<svg')) {
        throw new SnIconSourceError(
          'ICON_FETCH_FAILED',
          `Iconify response for ${url} is not an SVG document`,
        );
      }
      return svgToDataUrl(svg);
    })
    .catch((err: unknown) => {
      cache.delete(url);
      throw err;
    });
  cache.set(url, pending);
  return pending;
}
