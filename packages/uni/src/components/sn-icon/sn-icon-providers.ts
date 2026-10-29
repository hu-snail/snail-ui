/**
 * sn-icon 图标源解析（string icon API 的路由层）。
 *
 * `<SnIcon icon="...">` 的 string 形态按以下顺序解析：
 *
 *   1. registry        — `registerSnIcons()` 注册的 IconData（同名覆盖目录）
 *   2. built-in catalog — 内置图标目录（sn-icon-catalog.ts）
 *   3. provider        — `prefix:rest` 形式路由到注册的图标源 Provider：
 *                          - `iconify:*` / `collection:name` → Iconify API 按需拉取
 *                          - 自定义 `registerSnIconProvider()` 注册的源
 *
 * Provider 返回两种可渲染结果：
 *   - `IconData` → inline SVG 渲染路径（H5）/ image data URL（uni-x App）
 *   - `string`   → 就绪的图片 URL（通常为 SVG data URL）→ background-image 渲染路径
 *
 * 同步结果（registry / catalog / 同步 Provider）在 computed 内完成；
 * 异步结果由组件 watch 驱动（见 sn-icon.vue），带 AbortSignal 与竞态保护。
 */

import type { IconData } from './sn-icon.vue';
import { resolveIconByName } from './sn-icon-registry';
import { SN_ICON_CATALOG } from './sn-icon-catalog';
import {
  resolveIconifyIcon,
  configSnIconify,
  type SnIconifyOptions,
} from './sn-icon-iconify';

/** 结构化错误码（AGENTS.md §28/§29：稳定、可搜索、可统计）。 */
export type SnIconSourceErrorCode =
  | 'ICON_SOURCE_UNRESOLVED'
  | 'ICON_FETCH_FAILED'
  | 'ICON_FETCH_TIMEOUT';

/** 图标源解析错误 — 组件捕获后 console.warn（不上抛打断渲染）。 */
export class SnIconSourceError extends Error {
  readonly code: SnIconSourceErrorCode;
  constructor(code: SnIconSourceErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'SnIconSourceError';
    this.code = code;
    if (cause !== undefined) this.cause = cause;
  }
}

/** 解析上下文：颜色 / 尺寸供 URL 型 Provider（如 Iconify）构造请求。 */
export interface SnIconResolveContext {
  /** 请求颜色（'currentColor' 表示继承，URL 型源会渲染为黑色）。 */
  color: string;
  /** 请求边长（px；string 尺寸取整数部分，非法回退 24）。 */
  size: number;
  /** 组件卸载 / 图标变更时触发，异步 Provider 应中断请求。 */
  signal?: AbortSignal;
}

/**
 * 解析结果：
 *   - IconData → inline SVG 路径
 *   - string   → 就绪图片 URL（data URL / 远程 URL）
 *   - null     → 无法解析
 */
export type SnIconResolveResult = IconData | string | null;

/** 图标源 Provider：把 `prefix:rest` 中的 rest 解析为可渲染结果。 */
export interface SnIconProvider {
  resolve(name: string, ctx: SnIconResolveContext): SnIconResolveResult | Promise<SnIconResolveResult>;
}

/** Provider 注册表（模块级，write-once at bootstrap；clear 仅供测试）。 */
const providers = new Map<string, SnIconProvider>();

/** 注册图标源 Provider（`icon="prefix:rest"` 路由到这里）。幂等：同名覆盖。 */
export function registerSnIconProvider(prefix: string, provider: SnIconProvider): void {
  providers.set(prefix.trim().toLowerCase(), provider);
}

/** 按 prefix 取 Provider。 */
export function getSnIconProvider(prefix: string): SnIconProvider | undefined {
  return providers.get(prefix.trim().toLowerCase());
}

/** 清空全部 Provider（测试专用；应用代码不要调用）。 */
export function clearSnIconProviders(): void {
  providers.clear();
  ensureBuiltinProviders();
}

/** 内置目录索引：name → entry（O(1) 查找）。 */
const catalogMap = new Map<string, (typeof SN_ICON_CATALOG)[number]>(
  SN_ICON_CATALOG.map((entry) => [entry.name, entry]),
);

/** 目录条目数（测试 / 展示用）。 */
export const SN_ICON_CATALOG_SIZE = catalogMap.size;

/**
 * 同步解析 string icon：registry → catalog。未命中返回 null（可能是
 * 异步 Provider 目标，组件随后走异步路径）。
 */
export function resolveSnIconStringSync(value: string): IconData | null {
  const byRegistry = resolveIconByName(value);
  if (byRegistry) return byRegistry;
  return catalogMap.get(value)?.data ?? null;
}

/**
 * 异步解析 string icon 的 Provider 路径（registry / catalog 已在同步层
 * 查过才会走到这里）：
 *   - `prefix:rest` 且 prefix 已注册 → 该 Provider
 *   - `collection:name` 形式（恰一个冒号）→ 回落到 Iconify（按需，默认开启）
 *   - 其余 → null（组件会给出结构化警告）
 */
export function resolveSnIconStringAsync(
  value: string,
  ctx: SnIconResolveContext,
): SnIconResolveResult | Promise<SnIconResolveResult> {
  const colon = value.indexOf(':');
  if (colon <= 0 || colon === value.length - 1) return null;
  const prefix = value.slice(0, colon).trim().toLowerCase();
  const rest = value.slice(colon + 1);
  const provider = getSnIconProvider(prefix);
  if (provider) return provider.resolve(rest, ctx);
  const iconify = getSnIconProvider('iconify');
  if (iconify && /^[a-z0-9-]+:[a-z0-9-]+$/i.test(value)) {
    return iconify.resolve(value, ctx);
  }
  return null;
}

/** sn-icon 全局配置项。 */
export interface SnIconsConfig {
  /**
   * Iconify 按需加载开关（默认开启）。传 `false` 关闭网络回退；
   * 传对象同时配置 API（apiBase / timeout / request 注入）。
   */
  iconify?: boolean | SnIconifyOptions;
}

function ensureBuiltinProviders(): void {
  if (!providers.has('iconify')) {
    providers.set('iconify', {
      resolve: (name, ctx) => resolveIconifyIcon(name, ctx),
    });
  }
}

/** 配置 sn-icon 全局行为（幂等；建议在 app bootstrap 调用一次）。 */
export function configSnIcons(config: SnIconsConfig): void {
  if (config.iconify === false) {
    providers.delete('iconify');
    return;
  }
  if (config.iconify !== undefined && config.iconify !== true) {
    configSnIconify(config.iconify);
  }
  ensureBuiltinProviders();
}

// 默认开启 Iconify 按需加载（纯 GET 公共 API；可用 configSnIcons({ iconify: false }) 关闭）。
ensureBuiltinProviders();
